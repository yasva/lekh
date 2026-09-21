# PA1493 Software Development Project (Distance) HT26

---

## Project Description

**Project Name:** *Lab Equipment Knowledge Hub (LEKH)*

**Customer Name:** *Zeth Danielsson*

**Student Full Name:** *Yasaman Vallaee*

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

| Name | Characteristics | Needs and Expectations | How will they use the system? |
| --- | --- | --- | --- |
| Alex – Student | Student / Equipment User. Internal user with varying levels of technical experience. | Find equipment, understand how to use it, access guides and troubleshooting information, check availability, request equipment, return borrowed equipment and report problems. | Logs in, browses or searches for equipment, opens equipment pages, reads guides, checks availability, requests loans, completes the return checklist when returning equipment and reports faults. |
| Robin – Lab Assistant | Student assistant with Maintainer responsibilities. Generally has more technical knowledge than an ordinary user and may be responsible for particular equipment. | Maintain equipment information and guides, manage equipment condition, faults and relevant loan requests. | Updates equipment and guides, handles reported faults, updates equipment status and processes relevant loan requests. |
| Sam – Administrator | Administrator with responsibility for administration and access control. | Manage users, roles, permissions, equipment configuration and maintainer responsibilities. | Manages roles and permissions, assigns maintainers and manages equipment-related access rules. |

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
- Students/Users shall be able to complete a return checklist and register
  borrowed equipment as returned.
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

## Your Backlog

Your backlog lives in two places, working together:

### 1. GitHub Issues (the content)

For every user story, feature and task, create a GitHub Issue with a clear title and description. Use the issue template provided in this repository (see `.github/ISSUE_TEMPLATE/`).

Write them in this order:
1. All **user stories** first (format: *"As [a user], I want [action] so that [goal]"*)
2. Then all **features**
3. Then all **tasks**

### 2. Project Board (the backlog itself)

Add every Issue to a Project board. The board is your backlog, not the issue text.

Your repository does not come with a board already set up — see **[PROJECT_BOARD.md](PROJECT_BOARD.md)** for step-by-step instructions on creating your board and setting up the required fields (Priority, Estimated Effort, Sprint). 

You'll need a working board by the end of Sprint 1, as Status Report 3 requires it.


---

## Development

From Week 38 onward:
- Set up your development environment and start development.
- You're free to organise your code however works best for you — for example, using `src/` and `docs/` folders, or any other structure. There's no required folder layout; 
- At the end of each sprint, your work will be demonstrated to the customer at that sprint's Demo
- Keep this README as the one place that always explains how to install and run your project.


Your repository must remain **Private** for the entire course. This protects your customer's requirements and your own work.

---

## Documenting Your Project

Once Sprint 2 begins, add a **User Manual** section to this README, covering:
- **Installing** — what's needed to set up your project locally (dependencies, environment, etc.)
- **Running** — how to start/execute the application

