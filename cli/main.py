import sys
import os
import click
from rich.console import Console
from rich.panel import Panel
from rich.table import Table
from rich import box
import uvicorn
from app.config.database import engine, Base, SessionLocal
from app.config import models
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
    """Bifrost — Platform for collecting and orchestrating data from APIs"""
    pass


@cli.command()
@click.option("--host", default="0.0.0.0", show_default=True, help="Bind host")
@click.option("--port", default=8000, show_default=True, help="Bind port")
@click.option(
    "--reload", is_flag=True, default=False, help="Enable auto-reload (dev mode)"
)
@click.option(
    "--workers", default=1, show_default=True, help="Number of worker processes"
)
def start(host, port, reload, workers):
    """Start the Bifrost API server."""

    console.print(BIFROST_ART)
    console.print(
        Panel(
            f"[bold green]Server starting[/bold green]\n\n"
            f"  [dim]Host   :[/dim]  {host}\n"
            f"  [dim]Port   :[/dim]  {port}\n"
            f"  [dim]Reload :[/dim]  {'[green]yes[/green]' if reload else '[dim]no[/dim]'}\n"
            f"  [dim]Workers:[/dim]  {workers}\n\n"
            f"  [bold]UI →[/bold]  [underline cyan]http://localhost:{port}[/underline cyan]",
            title="🌈 Bifrost",
            border_style="violet",
        )
    )

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
        console.print("  [dim]→ config[/dim]")
    except Exception as e:
        console.print(f"[bold red]✗[/bold red] Cannot operate: {e}")


@db.command("drop")
@click.confirmation_option(prompt="This will delete ALL data. Are you sure?")
def db_drop():
    """Drop all tables"""
    try:
        with console.status("[bold violet]Dropping tables...[/bold violet]"):
            Base.metadata.drop_all(bind=engine)

        console.print("[bold green]✓[/bold green] All tables dropped.")
    except Exception as e:
        console.print(f"[bold red]✗[/bold red] Cannot operate: {e}")


@db.command("status")
def db_status():
    """Show database connection status and table info."""

    try:
        inspector = inspect(engine)
        table_names = inspector.get_table_names()

        console.print("[bold green]✓[/bold green] Database connection OK\n")

        table_obj = Table("Tables in DB", box=box.SIMPLE_HEAD)
        table_obj.add_column("Table", style="cyan")
        table_obj.add_column("Columns", style="dim")

        for name in table_names:
            cols = [c["name"] for c in inspector.get_columns(name)]
            table_obj.add_row(name, ", ".join(cols))

        console.print(table_obj)

    except Exception as e:
        console.print(f"[bold red]✗[/bold red] Cannot connect: {e}")


@cli.group()
def sources():
    """Inspect API sources."""
    pass


@sources.command("list")
def sources_list():
    """List all configured API sources."""

    db = SessionLocal()
    try:
        q = db.query(models.ApiSource)

        srcs = q.all()

        if not srcs:
            console.print("[dim]No sources found.[/dim]")
            return

        table = Table(box=box.SIMPLE_HEAD)
        table.add_column("ID", style="dim", width=5)
        table.add_column("Name", style="cyan")
        table.add_column("URL", style="dim")
        table.add_column("Auth", style="dim")
        table.add_column("Status", justify="center")
        table.add_column("Created_at", justify="center")

        STATUS_COLOR = {"active": "green", "error": "red", "paused": "yellow"}

        for s in srcs:
            color = STATUS_COLOR.get(s.status, "white")
            table.add_row(
                str(s.id),
                s.name,
                s.url,
                s.auth_type,
                f"[{color}]{s.status}[/{color}]",
                str(s.created_at) if s.created_at else "—",
            )

        console.print(table)

    finally:
        db.close()


@sources.command("create")
@click.option("--name", prompt="Source name", help="Name of the source")
@click.option("--url", prompt="URL", help="API endpoint URL")
@click.option(
    "--method",
    default="GET",
    show_default=True,
    type=click.Choice(["GET", "POST", "PUT", "PATCH", "DELETE"]),
    help="HTTP method",
)
@click.option(
    "--auth-type",
    default="none",
    show_default=True,
    type=click.Choice(["none", "api_key", "bearer", "basic", "oauth2"]),
    help="Authentication type",
)
@click.option("--auth-value", default=None, help="API key or token")
@click.option(
    "--format",
    "response_format",
    default="json",
    show_default=True,
    type=click.Choice(["json", "csv", "xml", "text"]),
    help="Response format",
)
def sources_create(name, url, method, auth_type, auth_value, response_format):
    """Create a new API source."""

    if auth_type != "none" and not auth_value:
        console.print(
            "[bold red]✗[/bold red] auth_value is required when auth_type is not 'none'."
        )
        return

    db = SessionLocal()
    try:
        existing = (
            db.query(models.ApiSource).filter(models.ApiSource.name == name).first()
        )
        if existing:
            console.print(
                f"[bold red]✗[/bold red] A source named '[cyan]{name}[/cyan]' already exists."
            )
            return

        source = models.ApiSource(
            name=name,
            url=url,
            method=method,
            auth_type=auth_type,
            auth_value=auth_value,
            response_format=response_format,
        )
        db.add(source)
        db.commit()
        db.refresh(source)

        console.print(
            f"[bold green]✓[/bold green] Source '[cyan]{source.name}[/cyan]' created (id={source.id})"
        )

        table = Table(box=box.SIMPLE_HEAD, show_header=False)
        table.add_column("Field", style="dim", width=18)
        table.add_column("Value", style="cyan")
        table.add_row("ID", str(source.id))
        table.add_row("Name", source.name)
        table.add_row("URL", source.url)
        table.add_row("Method", source.method)
        table.add_row("Auth type", source.auth_type)
        table.add_row("Format", source.response_format)
        table.add_row("Status", source.status)
        table.add_row("Created at", str(source.created_at))
        console.print(table)

    except Exception as e:
        db.rollback()
        console.print(f"[bold red]✗[/bold red] Error: {e}")
    finally:
        db.close()


@cli.command()
def info():
    """Show Bifrost environment info."""

    console.print(BIFROST_ART)

    table = Table(box=box.SIMPLE_HEAD, show_header=False)
    table.add_column("Key", style="dim", width=20)
    table.add_column("Value", style="cyan")

    table.add_row("Version", "0.1.0")
    table.add_row("Python", sys.version.split()[0])
    table.add_row("Database", os.getenv("DATABASE_URL", "sqlite:///./bifrost.db"))
    table.add_row(
        "Secret Key", "***" if os.getenv("SECRET_KEY") else "[red]NOT SET[/red]"
    )
    table.add_row("Token expiry", f"{os.getenv('ACCESS_TOKEN_EXPIRE_DAYS', 7)} days")

    console.print(table)
