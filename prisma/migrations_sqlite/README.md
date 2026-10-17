# Preserved SQLite Migration History

This directory archives the initial SQLite migration history for LandGuard BD before transitioning the database datasource to PostgreSQL (Neon).

## Archived Contents
- `migration_lock.toml`: SQLite provider lock (`provider = "sqlite"`).
- `20261016183246_init/`: Initial SQLite DDL migration covering:
  - `LandParcel`
  - `OwnershipRecord`
  - `VerificationRequest`
  - `RiskFlag`

## Purpose
This archive is maintained to preserve historical auditability and reproducibility of the SQLite baseline without deleting or overwriting historical migration records.
Active PostgreSQL migrations are maintained in `prisma/migrations/`.
