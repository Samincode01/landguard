# PostgreSQL Migration History

This directory contains the active PostgreSQL migrations for LandGuard BD on Neon.

## Migrations
- `20261017180500_init_postgresql`: Initial PostgreSQL baseline creating `User`, `LandParcel`, `OwnershipRecord`, `VerificationRequest`, and `RiskFlag` with primary keys, indexes, foreign keys, and referential actions.

The previous SQLite migration history is safely preserved in `prisma/migrations_sqlite/`.
