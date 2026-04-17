# Incident Command API

`incident-command` is a NestJS API for managing incident response workflows. The current codebase supports incident creation and lifecycle updates, incident acknowledgements, ticket creation and assignment, and audit-style logs for both incidents and tickets.

## Current Scope

- Create and list incidents stored in PostgreSQL through Prisma.
- Update incident status with guarded status transitions.
- Acknowledge incidents and persist acknowledgment metadata.
- Create, list, assign, and update tickets linked to incidents.
- View incident logs and ticket logs, optionally filtered by event type.
- Create, update, list, and delete employees through a separate employee module.
- Enforce simple request authentication and role checks using an employee email header.

## Stack

- NestJS 11
- TypeScript
- Prisma ORM with PostgreSQL
- Jest for unit and e2e testing
- Class Validator / Class Transformer for DTO validation

## Important Implementation Notes

- Persistence for incidents, tickets, incident logs, ticket logs, and authenticated employees uses PostgreSQL via Prisma.
- Authentication is not JWT-based. Protected routes expect an `x-user-email` request header.
- The `EmployeesService` in `src/employees` is currently in-memory and does not write to Prisma.
- Because of that split, the `/employees` endpoints and the auth/authorization flow do not currently share the same backing store.
- There is a `HealthModule`, but no health endpoint is implemented yet.
- The README below reflects the code as it exists now, not a target architecture.

## Data Model

### Employees

Prisma employee records include:

- `role`: `IT_HELP`, `SYSTEM`, `NETWORK`, `SRE`, `HR`
- `level`: `L1`, `L2`, `L3`
- `active`
- `onCall`

### Incidents

- `severity`: `SEV1`, `SEV2`, `SEV3`
- `status`: `OPEN`, `IN_PROGRESS`, `RESOLVED`, `REOPENED`, `CANCELLED`
- Optional acknowledgment metadata:
  - `acknowledgedByEmployeeId`
  - `acknowledgedAt`
  - `acknowledgedNote`

Allowed incident transitions:

- `OPEN -> IN_PROGRESS | CANCELLED`
- `IN_PROGRESS -> RESOLVED | CANCELLED`
- `RESOLVED -> REOPENED`
- `REOPENED -> IN_PROGRESS | CANCELLED`

### Tickets

- `status`: `OPEN`, `IN_PROGRESS`, `RESOLVED`, `REOPENED`, `CANCELLED`
- Optional link to an incident via `incidentId`
- Optional assignee via `assignedToEmployeeId`

Allowed ticket transitions:

- `OPEN -> IN_PROGRESS | CANCELLED`
- `IN_PROGRESS -> RESOLVED | CANCELLED`
- `RESOLVED -> REOPENED`
- `REOPENED -> IN_PROGRESS | CANCELLED`

### Logs

Incident log types:

- `STATUS_CHANGED`
- `ACKNOWLEDGED`

Ticket log types:

- `STATUS_CHANGED`
- `ACKNOWLEDGED`
- `ASSIGNED`

## Authentication And Authorization

Protected routes use a custom `AuthGuard` and `RolesGuard`.

- Send `x-user-email: person@company.com` on protected requests.
- The email must match an active employee record in Prisma.
- `@Roles('IT_HELP')` requires the authenticated employee role to be `IT_HELP`.
- `@Roles('ONCALL')` requires the authenticated employee to have `onCall = true`.

Examples:

```http
x-user-email: employee1@company.com
```

## API Overview

### Incidents

- `GET /incidents`
- `GET /incidents/:id`
- `POST /incidents`
- `PATCH /incidents/:id/status` `Auth + on-call required`
- `GET /incidents/acknowledgments`
- `GET /incidents/:id/acknowledgments`
- `PATCH /incidents/:id/acknowledgments` `Auth + IT_HELP required`
- `GET /incidents/:id/logs` `Auth required`

Create incident body:

```json
{
  "title": "Database latency spike",
  "severity": "SEV1",
  "reportedBy": "reporter@company.com",
  "summary": "Optional summary"
}
```

Update incident status body:

```json
{
  "status": "IN_PROGRESS",
  "note": "Pager acknowledged and triage started"
}
```

Acknowledge incident body:

```json
{
  "note": "Taking ownership"
}
```

### Tickets

- `GET /tickets` `Auth + IT_HELP required`
- `GET /tickets/:id` `Auth + IT_HELP required`
- `GET /tickets/:id/logs` `Auth + IT_HELP required`
- `POST /tickets` `Auth + IT_HELP required`
- `POST /tickets/:id/assign` `Auth + IT_HELP required`
- `PATCH /tickets/:id/status` `Auth + IT_HELP required`

Create ticket body:

```json
{
  "title": "Investigate alert routing",
  "description": "Alert notifications are delayed for on-call engineers.",
  "requestedByEmail": "manager@company.com",
  "incidentId": "optional-incident-uuid"
}
```

Assign ticket body:

```json
{
  "assigneeId": "employee-uuid"
}
```

Update ticket status body:

```json
{
  "status": "IN_PROGRESS",
  "note": "Picked up by help desk"
}
```

### Employees

- `POST /employees`
- `GET /employees`
- `GET /employees/:id`
- `PATCH /employees/:id`
- `DELETE /employees/:id`

Create employee body:

```json
{
  "name": "Jane Doe",
  "email": "jane.doe@company.com",
  "role": "IT_HELP",
  "level": 1,
  "active": true,
  "onCall": false
}
```

## Local Setup

### Prerequisites

- Node.js 20+
- PostgreSQL

### Environment

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/incident_command?schema=public"
PORT=3000
```

### Install And Run

```bash
npm install
npx prisma migrate dev
npx prisma generate
npm run start:dev
```

The API listens on `http://localhost:3000` unless `PORT` is overridden.

### Seed Prisma Employees

The Prisma seed script creates 20 active employees using the `company.com` domain:

```bash
npx prisma db seed
```

That seed is useful for testing protected routes because auth depends on Prisma employee records, not the in-memory `/employees` module.

## Testing

Run the test suite with:

```bash
npm test
```

For e2e tests:

```bash
npm run test:e2e
```

## Project Layout

```text
src/
  incidents/              Incident CRUD and status updates
  incident-acknowledge/   Incident acknowledgment rules
  incident-logs/          Incident log queries
  tickets/                Ticket CRUD and status updates
  ticket-assignment/      Ticket assignment workflow
  employees/              In-memory employee endpoints
  common/auth/            Header-based authentication
  common/roles/           Role and on-call checks
  common/request-timing/  Request duration logging
prisma/
  schema.prisma
  migrations/
  seed.ts
```

## Known Gaps

- `/employees` is not backed by Prisma yet.
- No JWT or session auth is implemented.
- No Docker setup exists in the repository at the moment.
- `UsersModule`, `ActionsModule`, and `HealthModule` are present in the app module but are not documented features yet.
