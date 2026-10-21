# Definition of Done

A backlog item (task, feature or story) is Done when all of the following hold.

## Code

- The change is on its own branch and merged to `main` through a pull request that references the issue (`Closes #N`).
- `git diff --staged --stat` was checked before committing; schema changes include their Prisma migration folder.
- `npm run lint` and `npm run build` in `client/` pass without errors.

## Behaviour

- Every acceptance criterion in the issue is met, or the issue says which criterion was changed or dropped and why.
- The flow is tested by hand as each affected role (Student, Maintainer) on desktop for each item; phone width for layout changes and before the sprint demo.
- The server rejects the action for roles that may not perform it (403) and rejects invalid input (400).
- Related customer acceptance tests still pass.

## Documentation and tracking

- The README User Manual and Known limitations match the delivered behaviour.
- The issue is closed with a comment on what was delivered and anything left out and the board status is Done.
- Actual time is recorded per issue and reported in the sprint status report.

## Sprint

- All acceptance tests in the sprint scope are run on `main` from a fresh install and an empty database and the result is recorded (PASS / PARTIAL / FAIL).
- Defects found are recorded as GitHub issues.
- Before a release, `npx prisma migrate status` and `migrate diff` show no drift.
