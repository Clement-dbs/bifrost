from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database.database import get_db
from database.models import Schedule, ApiSource, User
from database.schemas import ScheduleCreate, ScheduleOut, ScheduleUpdate
from dependencies import get_current_user

router = APIRouter(prefix="/schedules", tags=["schedules"])


def _get_source_for_user(source_id: int, user_id: int, db: Session) -> ApiSource:
    source = (
        db.query(ApiSource)
        .filter(ApiSource.id == source_id, ApiSource.user_id == user_id)
        .first()
    )
    if not source:
        raise HTTPException(status_code=404, detail="Source not found")
    return source


@router.get("/", response_model=List[ScheduleOut])
def list_schedules(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Join through sources to enforce ownership
    return (
        db.query(Schedule)
        .join(ApiSource)
        .filter(ApiSource.user_id == current_user.id)
        .all()
    )


@router.post("/", response_model=ScheduleOut, status_code=201)
def create_schedule(
    payload: ScheduleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _get_source_for_user(payload.source_id, current_user.id, db)
    schedule = Schedule(**payload.dict())
    db.add(schedule)
    db.commit()
    db.refresh(schedule)
    _register_job(schedule)
    return schedule


@router.patch("/{schedule_id}", response_model=ScheduleOut)
def update_schedule(
    schedule_id: int,
    payload: ScheduleUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    schedule = (
        db.query(Schedule)
        .join(ApiSource)
        .filter(Schedule.id == schedule_id, ApiSource.user_id == current_user.id)
        .first()
    )
    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")
    for field, value in payload.dict(exclude_unset=True).items():
        setattr(schedule, field, value)
    db.commit()
    db.refresh(schedule)
    _sync_job(schedule)
    return schedule


@router.delete("/{schedule_id}", status_code=204)
def delete_schedule(
    schedule_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    schedule = (
        db.query(Schedule)
        .join(ApiSource)
        .filter(Schedule.id == schedule_id, ApiSource.user_id == current_user.id)
        .first()
    )
    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")
    db.delete(schedule)
    db.commit()
    _remove_job(schedule_id)


# ---------------------------------------------------------------------------
# APScheduler helpers (imported lazily to avoid circular imports)
# ---------------------------------------------------------------------------

def _register_job(schedule: Schedule):
    try:
        from app.main import scheduler
        from app.collector import run_scheduled_collection
        if schedule.enabled:
            scheduler.add_job(
                run_scheduled_collection,
                "interval",
                seconds=schedule.interval_seconds,
                args=[schedule.id],
                id=f"schedule_{schedule.id}",
                replace_existing=True,
            )
    except Exception:
        pass  # scheduler not yet started during tests


def _sync_job(schedule: Schedule):
    try:
        from app.main import scheduler
        from app.collector import run_scheduled_collection
        job_id = f"schedule_{schedule.id}"
        if schedule.enabled:
            scheduler.add_job(
                run_scheduled_collection,
                "interval",
                seconds=schedule.interval_seconds,
                args=[schedule.id],
                id=job_id,
                replace_existing=True,
            )
        else:
            scheduler.remove_job(job_id)
    except Exception:
        pass


def _remove_job(schedule_id: int):
    try:
        from app.main import scheduler
        scheduler.remove_job(f"schedule_{schedule_id}")
    except Exception:
        pass