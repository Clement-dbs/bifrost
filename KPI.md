Description courte (tagline)
Bifrost est une plateforme open-source de collecte et d'orchestration de données via API — légère, self-hostable, opérationnelle en 2 minutes.

Description longue
Bifrost comble le vide entre les outils trop complexes (Airbyte, Airflow) et l'absence d'outil. Il permet à n'importe quel développeur solo ou petite équipe de connecter des APIs HTTP, planifier des collectes automatiques et exporter les données vers la destination de leur choix — sans Docker, sans Kubernetes, sans configuration YAML.
Le projet se positionne comme le "MLflow de la collecte de données" : une commande pip install bifrost, un CLI intuitif, une interface web no-code, et vous êtes opérationnel.

Stack technique

Backend : FastAPI + SQLAlchemy + APScheduler
Base de données : SQLite (dev) / PostgreSQL (prod)
CLI : Click + Rich
Frontend : HTML + Tailwind + JS vanilla
Packaging : pyproject.toml


KPIs produit à suivre
KPIDescriptionSources configuréesNombre total de connecteurs ajoutésCollectes / jourVolume de requêtes exécutéesTaux de succès% de collectes sans erreurTemps de réponse moyenLatence moyenne par source en msSources en erreurNombre de sources en statut errorDonnées collectéesVolume total stocké (MB/GB)

KPIs traction (SaaS / open-source)
KPICible 3 moisStars GitHub100Inscrits waitlist200Utilisateurs actifs50Installations pip500Rétention J30> 40%

Positionnement en une phrase
Bifrost c'est Airbyte pour ceux qui veulent juste pip install et commencer à collecter des données en 2 minutes, sans infrastructure.