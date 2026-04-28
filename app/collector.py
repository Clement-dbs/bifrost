"""
Bifrost — HTTP collection engine.
Handles one-off fetches and scheduled recurring collections.
"""
import json
import logging
from datetime import datetime, timezone
from typing import Any, Dict

import httpx
from sqlalchemy.orm import Session

from database.database import SessionLocal
from database.models import ApiSource, Collection, Schedule

logger = logging.getLogger("bifrost.collector")


def _build_headers(source: ApiSource) -> Dict[str, str]:
    headers: Dict[str, str] = {}
    auth_type = (source.auth_type or "").lower()

    if auth_type == "api_key":
        headers[source.auth_header_name or "X-API-Key"] = source.auth_value or ""
    elif auth_type == "bearer":
        headers["Authorization"] = f"Bearer {source.auth_value or ''}"
    elif auth_type == "basic":
        import base64
        encoded = base64.b64encode(f"{source.auth_value}".encode()).decode()
        headers["Authorization"] = f"Basic {encoded}"

    if source.extra_headers:
        try:
            headers.update(json.loads(source.extra_headers))
        except Exception:
            pass

    return headers


async def collect_once(source: ApiSource) -> Dict[str, Any]:
    """
    Fire a single HTTP request for *source* and return a result dict.
    Does NOT write to the database — useful for test/preview calls.
    """
    headers = _build_headers(source)
    params = {}
    if source.query_params:
        try:
            params = json.loads(source.query_params)
        except Exception:
            pass

    try:
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.request(
                method=(source.method or "GET").upper(),
                url=source.url,
                headers=headers,
                params=params,
            )
        data = resp.json() if "json" in resp.headers.get("content-type", "") else resp.text
        return {
            "status": "success",
            "status_code": resp.status_code,
            "collected_at": datetime.now(timezone.utc).isoformat(),
            "data": data,
        }
    except Exception as exc:
        logger.error("collect_once failed for source %s: %s", source.id, exc)
        return {
            "status": "error",
            "error": str(exc),
            "collected_at": datetime.now(timezone.utc).isoformat(),
            "data": None,
        }


def run_scheduled_collection(schedule_id: int) -> None:
    """
    Called by APScheduler.  Runs synchronously — spawns its own DB session.
    """
    db: Session = SessionLocal()
    try:
        schedule: Schedule | None = db.query(Schedule).get(schedule_id)
        if not schedule or not schedule.enabled:
            return

        source: ApiSource | None = db.query(ApiSource).get(schedule.source_id)
        if not source:
            return

        import asyncio
        result = asyncio.run(collect_once(source))

        collection = Collection(
            source_id=source.id,
            schedule_id=schedule.id,
            status=result["status"],
            status_code=result.get("status_code"),
            raw_data=json.dumps(result["data"]) if result["data"] is not None else None,
            error_message=result.get("error"),
            collected_at=datetime.now(timezone.utc),
        )
        db.add(collection)

        schedule.last_run_at = datetime.now(timezone.utc)
        schedule.last_status = result["status"]

        db.commit()
        logger.info(
            "Schedule %s — %s (source: %s)", schedule_id, result["status"], source.name
        )
    except Exception as exc:
        logger.error("Scheduled collection %s failed: %s", schedule_id, exc)
        db.rollback()
    finally:
        db.close()