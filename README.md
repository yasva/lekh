# PA1493 Software Development Project (Distance) HT26

---

## Project Description

**Project Name:** _Lab Equipment Knowledge Hub (LEKH)_
**Customer Name:** _Zeth Danielsson_
**Student Full Name:** _Yasaman Vallaee_

### Project Aim and Objectives

The aim of the Lab Equipment Knowledge Hub (LEKH) is to provide a centralised
and accessible source of knowledge about laboratory equipment.

The system will help students and staff find equipment, access setup guides
and troubleshooting information, check equipment availability and condition,
and request equipment for borrowing when applicable.

The project also aims to support laboratory staff in managing equipment,
loans, maintenance, faults and equipment-related knowledge. A key objective
is to preserve this knowledge over time so that it remains available even
when responsible staff or maintainers change.

### User Personas

| Name                  | Characteristics                                                                                                                                                   | Needs and Expectations                                                                                                                                                         | How will they use the system?                                                                                                                                                      |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Alex – Student        | Student / Equipment User. Internal user with varying levels of technical experience.                                                                              | Find equipment, understand how to use it, access guides and troubleshooting information, check availability, request equipment, return borrowed equipment and report problems. | Logs in, browses or searches for equipment, opens equipment pages, reads guides, checks availability, requests loans, returns borrowed equipment from My loans and reports faults. |
| Robin – Lab Assistant | Student assistant with Maintainer responsibilities. Generally has more technical knowledge than an ordinary user and may be responsible for particular equipment. | Maintain equipment information and guides, manage equipment condition, faults and relevant loan requests.                                                                      | Updates equipment and guides, handles reported faults, updates equipment status and processes relevant loan requests.                                                              |
| Sam – Administrator   | Administrator with responsibility for administration and access control.                                                                                          | Manage users, roles, permissions, equipment configuration and maintainer responsibilities.                                                                                     | Manages roles and permissions, assigns maintainers and manages equipment-related access rules.                                                                                     |

### Software Requirements

**Functional Requirements**

- Users shall be able to log in and log out using a username and password.
- The system shall support Student/User, Maintainer and Administrator roles.
- A user may have more than one responsibility or role.
- Users shall be able to browse and view registered laboratory equipment.
- Equipment of the same type may be presented as a grouped quantity, while
  individual physical units may be tracked where traceability is required.
- Equipment shall contain relevant information such as type/model, location,
  availability and condition.
- Users shall be able to access setup and usage guides for equipment.
- Users shall be able to access troubleshooting information for equipment.
- Authorized users shall be able to create and update equipment information.
- Maintainers and Administrators shall be able to create and update equipment
  guides and troubleshooting information.
- Previous versions of updated equipment guides shall remain available for
  viewing.
- Users shall be able to request borrowable equipment for a specified period.
- Authorized users shall be able to approve or reject loan requests when
  approval is required.
- The system shall keep track of active loans and equipment availability.
- Students/Users shall be able to register borrowed equipment as returned.
  (The return checklist confirmed at customer meeting 2 was not built in
  Sprint 3; acceptance test 10 does not require it. The borrower returns
  the loan from My loans.)
- Users shall be able to report equipment faults.
- Authorized users shall be able to manage faults and update equipment
  condition.
- Equipment may provide a QR code linking directly to its information page.
- Equipment may be associated with previous projects or project ideas.

**Non-Functional Requirements**

- The system shall provide a simple and intuitive graphical user interface.
- The interface shall be suitable for users with varying levels of technical competence.
- The application shall be responsive and usable on desktop, tablet and mobile devices.
- All application functionality shall require authentication.
- Access to functionality shall be restricted according to user roles and permissions.
- Borrower identities shall not be visible to ordinary users.
- User-provided data shall be validated before being stored or processed.
- The system should only collect personal information necessary for operating the system.
- Equipment knowledge shall remain available when maintainers or responsibilities change.
- Previous versions of updated equipment guides shall remain accessible.
- The implementation shall use a clear and maintainable structure.

---

## Backlog

The backlog is the [Agile Board](https://github.com/orgs/dipt-pa1493-ht26/projects/24) (Priority, Estimated Effort, Sprint) together with the GitHub Issues it lists: user stories, features and tasks, linked with "Supports #N" and "Part of #N".

---

## Development

- `client/` – React with Vite. The dev server proxies `/api` to the server on port 4000.
- `server/` – Express 5 with sessions, Prisma 7 and PostgreSQL. The schema and migrations are in `server/prisma/`.
- `docs/requirements.md` – requirements specification and acceptance-test traceability.
- `docs/definition-of-done.md` – Definition of Done for backlog items.

Each backlog item is developed on its own branch and merged to `main` through a pull request that closes the issue.

---

## User Manual

### Installing

Requirements: Node.js (LTS) and a running PostgreSQL server.

1. Clone the repository.
2. Create an empty PostgreSQL database, for example `lekh`.
3. Create the server environment file:

   ```bash
   cd server
   cp .env.example .env
   ```

   Set `DATABASE_URL` to your database and `SESSION_SECRET` to any long random string.

4. Install the server, create the database tables and load the demo data:

   ```bash
   npm ci
   npx prisma migrate deploy
   npx prisma generate
   npm run seed
   ```

5. Install the client:

   ```bash
   cd ../client
   npm ci
   ```

### Running

Start the server and the client in two terminals:

```bash
# Terminal 1
cd server
npm run dev        # API on http://localhost:4000

# Terminal 2
cd client
npm run dev        # App on the address Vite prints, usually http://localhost:5173
```

Log in with one of the test accounts (password `password123` for all):

| Username     | Role          |
| ------------ | ------------- |
| `student`    | Student       |
| `maintainer` | Maintainer    |
| `admin`      | Administrator |

New users can create their own Student account on the login page with **Create account**.

### Using LEKH on a phone

The phone and the computer must be on the same Wi-Fi network. The client calls the API through Vite's proxy (`/api` → port 4000), so only the client port needs to be reachable from the phone.

1. Start the client with `npx vite --host` instead of `npm run dev`.
2. Vite prints a `Network:` address, for example `http://192.168.1.23:5173`.
3. Open that address in the phone's browser. **Type the full address including `http://`.** Without it, many phone browsers try `https://` and the page does not load.

If the project runs inside WSL2 on Windows, the addresses Vite prints may be internal to Windows and inaccessible from the phone. Forward the port from Windows (PowerShell as administrator) and open the computer's Wi-Fi address from `ipconfig` instead:

```powershell
netsh interface portproxy add v4tov4 listenport=5173 listenaddress=0.0.0.0 connectport=5173 connectaddress=<WSL address from: hostname -I>
New-NetFirewallRule -DisplayName "Vite 5173" -Direction Inbound -LocalPort 5173 -Protocol TCP -Action Allow
```

The WSL address can change after a restart. If the phone stops connecting, delete the portproxy rule and add it again with the new address:

```powershell
netsh interface portproxy delete v4tov4 listenport=5173 listenaddress=0.0.0.0
```

Remove the firewall rule afterwards:

```powershell
Remove-NetFirewallRule -DisplayName "Vite 5173"
```

### Main workflows

**Student**

- Browse equipment with its category and availability. Open an equipment page to read its guide and troubleshooting information.
- Request a loan: choose an available unit, a start date and an end date. The request stays pending until a Maintainer decides.
- My loans lists your requests and their status, and refreshes while it is open. Return an active loan from here.
- Report a fault on a specific unit from the unit's page.
- Projects: record a finished project and the equipment it used. Each equipment page lists the projects that used it.
- Search: search equipment, guides and projects at once and open any result.

**Maintainer / Administrator**

- Add equipment types and register units, each with its own identifier, location and condition. Set a unit to Out of service to stop it from being borrowed.
- Add troubleshooting entries to a type. They are shown as known problems on every unit of that type.
- Loan requests: approve or reject pending requests.
- Faults: see all reported faults, open faults first, and mark a fault as resolved.

### Resetting the demo data

```bash
cd server
npm run seed
```

**Warning:** this empties the LEKH tables (users, equipment, units, guides, troubleshooting, loans, faults and projects) in the database `DATABASE_URL` points to, then recreates the demo state with the three test accounts. Accounts created with **Create account** are removed. Only run it against your development database.

After a reset, all equipment requires approval, so a loan request stays pending until a Maintainer approves it.

### Known limitations

- An approved loan with a future start date marks the unit as on loan immediately.
- Resolving a fault does not change the unit's condition or status; a Maintainer updates the unit separately.
- Only the borrower can return a loan. There is no staff overview of all active loans.
- New accounts always get the Student role. There is no user interface for changing roles or giving a user more than one role; the Maintainer and Administrator accounts are created by the seed.
- Guide version history and QR codes are not built. Projects cannot be edited or deleted.
- The interface has a dark theme only; Light and Auto modes are not implemented (#152).
- Category is matched by the Filter box; there is no separate category dropdown (#152).
- Resolving a fault records no resolution note (#145).
- The return checklist (FR-22) is not built; returns are one step from My loans (#152).
