# LandGuard BD 🇧🇩
### Understand the Risks Before You Proceed

LandGuard BD is a bilingual land-document risk-screening prototype designed for Bangladesh. It helps users extract information from land documents, review parcel details, identify potential inconsistencies, explore sample parcel locations, and generate reports.

> **Important:** LandGuard BD is a decision-support prototype, not an official government verification service. Its current demonstration records are synthetic and must not be treated as evidence of legal ownership.

## Key Features

- **AI-assisted document extraction:** Extracts relevant fields from supported land documents for user review and correction.
- **Land-detail verification:** Applies deterministic checks against available parcel and ownership records.
- **Explainable risk analysis:** Presents potential mismatches and risk indicators to help users understand what may need further investigation.
- **Interactive parcel map:** Explore approximate parcel locations using Leaflet and OpenStreetMap.
- **Printable reports:** Review and print verification findings.
- **Bilingual interface:** English and Bangla support.
- **Bhumi Sathi:** A bilingual assistant for land-related guidance, with Gemini integration and an offline fallback.
- **Authentication:** Password-protected accounts and session management.
- **Verification history:** Authenticated users can revisit their own saved verification records.

## Technology Stack

| Component | Technology |
|---|---|
| Frontend | Next.js, React, TypeScript |
| Styling | Tailwind CSS |
| Backend | Next.js API routes |
| Database | PostgreSQL on Neon |
| ORM | Prisma |
| PostgreSQL driver | `pg` with `@prisma/adapter-pg` |
| AI integration | Google Gemini |
| Authentication | Argon2id, `jose`, HTTP-only cookies |
| Maps | Leaflet, OpenStreetMap |
| Deployment | Vercel |

## Getting Started

### Prerequisites

Install the following before running the project:

- Node.js compatible with the installed Next.js version
- npm
- A PostgreSQL database, such as a Neon PostgreSQL database
- Git

### 1. Clone the repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd landguard
```

Replace `<YOUR_REPOSITORY_URL>` with your actual repository URL.

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root. Use the variable names expected by the project’s configuration.

Example:

```env
DATABASE_URL="your_postgresql_connection_string"
GEMINI_API_KEY="your_gemini_api_key"
```

- `DATABASE_URL`: Connection string for your PostgreSQL database.
- `GEMINI_API_KEY`: API key for Gemini-powered features, if enabled.

Check the authentication and application configuration for any additional required environment variables. Never commit `.env` or expose API keys in source control.

### 4. Set up the database

Apply the Prisma migrations using the project's configured Prisma 7 setup:

```bash
npx prisma migrate deploy
```

If the repository includes a seed script and you want to load the sample parcel records, run the seed command configured in `package.json` or the Prisma configuration. For example, if configured:

```bash
npx prisma db seed
```

The seed command must be configured before using it. Do not run production migrations or seed data against a database containing important records unless you understand the effects.

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Run checks

```bash
npx tsc --noEmit
npx eslint .
```

Run the project's configured tests as well. If individual test scripts are provided, use those scripts from `package.json`.

## Data Sources

### Synthetic demonstration records

The current prototype uses synthetic demonstration data for parcel and ownership checks. The sample dataset contains 15 demonstration parcels with associated ownership records.

The demonstration data is maintained in the project’s sample-data and Prisma seed files, including:

- `src/data/demo-data.ts`
- `prisma/seed.ts`

These records are intended to demonstrate the verification workflow, not to represent authoritative real-world land ownership.

### Map data

The parcel map uses OpenStreetMap for geographic map tiles. Map points are approximate sample locations, and illustrative demo outlines, where shown, are not official cadastral boundaries.

OpenStreetMap is not a land registry and does not establish property boundaries or legal ownership.

### Future data integration

Integration with authorized government land records and verified cadastral datasets could improve real-world usefulness. Such integration is not currently claimed as an implemented capability and would depend on data access, permissions, and validation.

## AI Tools Used

- **Google Gemini:** Used for AI-assisted document-field extraction and chatbot responses where configured.
- **Offline fallback logic:** Supports selected workflows when AI services are unavailable.
- **AI-assisted development tools:** Add the tools actually used by your team during development, such as Cursor or Claude, if applicable.

AI-extracted information can be incomplete or incorrect. Users should review extracted fields before proceeding. Risk results are generated from available records and implemented checks; they are not legal conclusions.

## How Verification Works

1. The user uploads a supported document or enters land details.
2. The extraction workflow identifies relevant fields when document extraction is used.
3. The user reviews and corrects the extracted information.
4. The verification workflow checks the submitted details against available demonstration records and applies deterministic rules.
5. The application displays potential inconsistencies and risk indicators.
6. The user can explore approximate parcel locations, view or print a report, and revisit saved verification history.

A low-risk result does not guarantee valid ownership, and a flagged result does not prove fraud. Official records and qualified legal review may be required before a land transaction.

## Live Demo

**Live prototype:** https://landguard-sepia.vercel.app

The deployed version may differ from the current development branch. Use demonstration data only and avoid entering sensitive personal documents into a public demo.

## Project Limitations

- Uses synthetic parcel and ownership records for the current demonstration.
- Does not connect to an official government land registry.
- Does not independently establish legal ownership or conclusively detect fraud.
- Map locations and illustrative outlines are not authoritative cadastral data.
- AI extraction may require manual correction.
- Gemini-powered features may require a valid API key and network access.

## Future Improvements

- Integrate authorized land-record services when access is available.
- Support verified cadastral boundaries and official geographic datasets.
- Improve document extraction across more document formats and layouts.
- Expand validation rules and testing with authorized, appropriately protected data.
- Improve accessibility and the user experience for low-bandwidth environments.

## Responsible Use

LandGuard BD is intended to help users organize preliminary document checks and understand potential inconsistencies. It should not be used as the sole basis for purchasing land, transferring property, or making legal decisions.

## Acknowledgements

Built for **LandTech 2026** as a prototype exploring accessible, technology-assisted land-document risk screening in Bangladesh.

**LandGuard BD — Understand the Risks Before You Proceed.**
