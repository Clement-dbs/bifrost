import sys
import os
import click
from rich.console import Console
from rich.panel import Panel
from rich.table import Table
from rich import box
import uvicorn
from app.core.database import engine, Base, SessionLocal
from app.models.models import Connector
from sqlalchemy import inspect

console = Console()

BIFROST_ART = """[bold]
[violet]██████╗ ██╗███████╗██████╗  ██████╗ ███████╗████████╗[/violet]
[violet]██╔══██╗██║██╔════╝██╔══██╗██╔═══██╗██╔════╝╚══██╔══╝[/violet]
[cyan]██████╔╝██║█████╗  ██████╔╝██║   ██║███████╗   ██║   [/cyan]
[cyan]██╔══██╗██║██╔══╝  ██╔══██╗██║   ██║╚════██║   ██║   [/cyan]
[green]██████╔╝██║██║     ██║  ██║╚██████╔╝███████║   ██║   [/green]
[green]╚═════╝ ╚═╝╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚══════╝   ╚═╝   [/green]
[/bold]"""


@click.group()
@click.version_option(version="0.1.0", prog_name="bifrost")
def cli():
    """Bifrost — Mini orchestrateur d'APIs"""
    pass


# ── start ─────────────────────────────────────────────────────────────────────

@cli.command()
@click.option("--host",    default="0.0.0.0", show_default=True, help="Bind host")
@click.option("--port",    default=8000,       show_default=True, help="Bind port")
@click.option("--reload",  is_flag=True,       default=False,     help="Enable auto-reload (dev mode)")
@click.option("--workers", default=1,          show_default=True, help="Number of worker processes")
def start(host, port, reload, workers):
    """Start the Bifrost API server."""
    console.print(BIFROST_ART)
    console.print(Panel(
        f"[bold green]Server starting[/bold green]\n\n"
        f"  [dim]Host   :[/dim]  {host}\n"
        f"  [dim]Port   :[/dim]  {port}\n"
        f"  [dim]Reload :[/dim]  {'[green]yes[/green]' if reload else '[dim]no[/dim]'}\n"
        f"  [dim]Workers:[/dim]  {workers}\n\n"
        f"  [bold]UI →[/bold]  [underline cyan]http://localhost:{port}[/underline cyan]",
        title="🌈 Bifrost",
        border_style="violet",
    ))
    Base.metadata.create_all(bind=engine)
    uvicorn.run(
        "app.main:app",
        host=host,
        port=port,
        reload=reload,
        workers=1 if reload else workers,
    )

@cli.group()
def db():
    """Database management commands."""
    pass


@db.command("init")
def db_init():
    """Create all tables in the database."""
    try:
        with console.status("[bold violet]Creating tables...[/bold violet]"):
            Base.metadata.create_all(bind=engine)
        console.print("[bold green]✓[/bold green] Tables created successfully.")
    except Exception as e:
        console.print(f"[bold red]✗[/bold red] {e}")


@db.command("drop")
@click.confirmation_option(prompt="This will delete ALL data. Are you sure?")
def db_drop():
    """Drop all tables."""
    try:
        with console.status("[bold violet]Dropping tables...[/bold violet]"):
            Base.metadata.drop_all(bind=engine)
        console.print("[bold green]✓[/bold green] All tables dropped.")
    except Exception as e:
        console.print(f"[bold red]✗[/bold red] {e}")


@db.command("status")
def db_status():
    """Show database connection status and table info."""
    try:
        inspector = inspect(engine)
        console.print("[bold green]✓[/bold green] Database connection OK\n")
        t = Table("Tables in DB", box=box.SIMPLE_HEAD)
        t.add_column("Table",   style="cyan")
        t.add_column("Columns", style="dim")
        for name in inspector.get_table_names():
            cols = [c["name"] for c in inspector.get_columns(name)]
            t.add_row(name, ", ".join(cols))
        console.print(t)
    except Exception as e:
        console.print(f"[bold red]✗[/bold red] Cannot connect: {e}")


@cli.group()
def connectors():
    """Manage Connectors (configured API sources)."""
    pass


@connectors.command("list")
def connectors_list():
    """List all configured Connectors."""
    session = SessionLocal()
    try:
        items = session.query(Connector).all()
        if not items:
            console.print("[dim]No connectors found.[/dim]")
            return

        t = Table(box=box.SIMPLE_HEAD)
        t.add_column("ID",       style="dim",  width=5)
        t.add_column("Name",     style="cyan")
        t.add_column("URL",      style="dim")
        t.add_column("Method",   style="dim")
        t.add_column("Auth",     style="dim")
        t.add_column("Status",   justify="center")
        t.add_column("Created",  justify="center", style="dim")

        STATUS_COLOR = {"active": "green", "error": "red", "paused": "yellow"}

        for c in items:
            auth_type = (c.auth or {}).get("type", "none")
            color = STATUS_COLOR.get(c.status, "white")
            t.add_row(
                str(c.id),
                c.name,
                c.url,
                c.method,
                auth_type,
                f"[{color}]{c.status}[/{color}]",
                str(c.created_at)[:19] if c.created_at else "—",
            )
        console.print(t)
    finally:
        session.close()


# ── info ──────────────────────────────────────────────────────────────────────

@cli.command()
def info():
    """Show Bifrost environment info."""
    console.print(BIFROST_ART)
    t = Table(box=box.SIMPLE_HEAD, show_header=False)
    t.add_column("Key",   style="dim",  width=20)
    t.add_column("Value", style="cyan")
    t.add_row("Version",    "0.1.0")
    t.add_row("Python",     sys.version.split()[0])
    t.add_row("Database",   "sqlite:///./bifrost.db")
    console.print(t)