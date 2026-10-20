# Lab Equipment Knowledge Hub (LEKH)

## Requirements Specification

**Customer:** Zeth Danielsson  
**Course:** PA1493 Software Development Project (Distance) HT26  
**Status:** Draft  
**Version:** 0.5
**Last updated:** 2026-10-20

## Document History

| Version | Date       | Source                                            | Changes                                                                                                                                              |
| ------- | ---------- | ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0.1     | 2026-09-07 | Project description and Customer Meeting 1        | Initial requirements, proposed MVP and open questions                                                                                                |
| 0.2     | 2026-09-11 | Customer Meeting 2                                | Updated requirements, priorities, permissions, return workflow, equipment quantity model, guide version history and mobile requirements              |
| 0.3     | 2026-09-21 | Customer Meeting 2 review and Sprint 1 refinement | Clarified equipment type vs physical unit modelling, multi-role responsibilities, knowledge/troubleshooting scope and remaining open questions       |
| 0.4     | 2026-10-12 | Sprint 3 acceptance tests and backlog refinement  | Added Sprint 3 implementation scope, acceptance-test traceability and deferred implementation notes without changing customer-confirmed requirements |
| 0.5     | 2026-10-20 | Sprint 3 acceptance test run (#129)               | Recorded Sprint 3 outcome, return workflow change and remaining gaps                                                                                 |

## Requirement Status

Requirements in this document use the following status values:

- **Confirmed** – supported by information provided by the customer during Customer Meetings 1 or 2 or by the original project description.
- **Proposed** – an interpretation or proposed solution based on the customer's needs that requires further validation.
- **Open** – a requirement or detail that requires clarification from the customer.

The priorities in this document have been updated based on Customer Meetings 1 and 2. Equipment Knowledge & Guides has been confirmed as the highest-priority area.

---

# 1. Project Overview

## 1.1 Purpose

The purpose of the **Lab Equipment Knowledge Hub (LEKH)** is to provide a central system for storing, preserving and accessing knowledge about laboratory equipment.

The main problem identified by the customer is that knowledge about equipment is currently difficult to access and is not maintained in one central place. Users should be able to find information about equipment, understand how to set it up and use it and find solutions to common problems.

Equipment guides are considered the most important part of the system. When asked which functionality should not be removed if the scope had to be reduced, the customer identified **equipment guides** as the essential functionality.

The system should also support workflows surrounding the equipment, including inventory, availability, borrowing, maintenance, fault reporting and user permissions.

### Main Goals

- Preserve knowledge about laboratory equipment.
- Make equipment knowledge easily accessible.
- Help users find and understand available equipment.
- Provide setup guides and troubleshooting information.
- Keep track of equipment availability and condition.
- Support borrowing and returning equipment.
- Support maintenance and fault reporting.
- Ensure that equipment knowledge remains available when responsible staff change.
- Provide quick access to equipment information while users are working in the laboratory.

---

## 1.2 Target Users

### Student / Equipment User

The primary everyday user is a person who needs to use laboratory equipment.

Technical competence should not be assumed to be high. The customer stated that some ordinary users may have a very low level of technical competence.

**Characteristics**

- Internal user.
- Varying levels of technical experience.
- Uses laboratory equipment for courses, projects, or other work.

**Needs and Expectations**

- Find appropriate equipment.
- See what equipment is available.
- Find where equipment is located.
- Understand what equipment can be used for.
- Access setup and usage instructions.
- Find common problems and troubleshooting information.
- Access relevant equipment resources.
- Request equipment when borrowing is required.
- Report problems with equipment.
- Discover examples of how equipment has previously been used.

**Typical Use**

Log in → find or scan equipment → open equipment page → read guide → check availability → use or request equipment → consult troubleshooting information if necessary.

---

### Maintainer / Caretaker

A maintainer is responsible for maintaining equipment and the knowledge associated with it.

Maintainers are expected to have greater technical knowledge than ordinary users.

**Characteristics**

- Lab staff or student assistant.
- Generally has greater technical knowledge than an ordinary user.
- May be responsible for particular equipment.

**Needs and Expectations**

- Maintain equipment information.
- Create and update equipment guides.
- Keep equipment status current.
- Manage relevant loan requests and loan information.
- Handle reported faults.
- Maintain knowledge about known problems.
- Be responsible for particular equipment where appropriate.

Not every piece of equipment requires a dedicated maintainer. Some specialized equipment may require a maintainer who has completed appropriate training or otherwise has permission to maintain that equipment.

---

### Administrator

The administrator has a higher level of responsibility for the system and its users.

**Characteristics**

- Internal user with administrative privileges.
- Responsible for access control and system administration.

**Needs and Expectations**

- Manage users and roles.
- Assign maintainer permissions.
- Manage equipment.
- Manage equipment-related permissions.
- Configure relevant equipment access or borrowing rules.
- Ensure that responsibility for equipment can be transferred when maintainers change.

---

## 1.3 Scope

The initial system is divided into seven main functional areas:

1. Authentication and user roles.
2. Equipment inventory and discovery.
3. Equipment knowledge, guides and troubleshooting.
4. Loans and availability.
5. Maintenance and fault reporting.
6. QR-based equipment access.
7. Project knowledge associated with equipment.

### Initial Scope

The current requirements include:

- User authentication.
- Student, Maintainer and Administrator roles.
- Equipment inventory.
- Equipment types with grouped quantities and individual unit tracking where required.
- Equipment location.
- Equipment availability and condition.
- Equipment guides.
- Setup and usage instructions.
- Troubleshooting information.
- Relevant equipment resources.
- Loan requests.
- Flexible loan periods.
- Loan approval where required.
- Returns.
- Fault reporting.
- Maintenance information.
- QR codes linked to equipment.
- Basic printable QR labels.
- Project examples or ideas associated with equipment.
- A responsive, mobile-compatible graphical user interface.

### Lower-Priority / Extended Scope

The following functionality is not considered essential to the initial core product and may be implemented if time allows:

- Advanced social functionality.
- Advanced rating and commenting functionality.
- Complex waiting-list or queue systems.
- Advanced analytics and statistics.
- Specialized label-printer integration.
- Public production hosting.

The customer prefers **quality over scope**. The project should therefore prioritize a smaller, stable and useful product rather than attempting to implement every possible feature.

---

# 2. Functional Requirements

## 2.1 Authentication & Users

### FR-1 – User Authentication

**Priority:** Must  
**Status:** Confirmed

The system shall provide authentication for users.

Users shall be able to:

- Log in.
- Log out.
- Have an identifiable user account.
- Have sufficient contact information for authorized staff to contact them when necessary.

All application functionality shall require the user to be authenticated.

Users shall authenticate using a username and password.

The exact account creation and user provisioning process has not yet been determined.

---

### FR-2 – User Roles

**Priority:** Must  
**Status:** Confirmed

The system shall support at least the following roles:

- Student/User
- Maintainer
- Administrator

The functionality available to a user shall depend on the user's role and permissions.

A user may hold more than one role or responsibility. For example,
a Student may also have Maintainer responsibilities.

The interface may distinguish between the user's current role context
where this is useful for presenting role-specific functionality.

The exact technical representation of multiple roles is a system
design decision.

---

### FR-3 – Role Administration

**Priority:** Must  
**Status:** Proposed

Administrators shall be able to assign and change user roles, including Maintainer privileges.

The exact division of permission-management responsibilities between Administrators and Maintainers requires customer validation.

---

### FR-4 – Equipment-Specific Authorization

**Priority:** Should  
**Status:** Confirmed

The system should support restricting certain equipment to appropriately authorized users or maintainers.

This is particularly relevant for specialized equipment that requires training, induction, or other authorization.

Not all equipment requires such restrictions.

---

## 2.2 Equipment Inventory

### FR-5 – View Equipment

**Priority:** Must  
**Status:** Confirmed

Users shall be able to view equipment registered in the system.

Relevant equipment information may include:

- Name.
- Equipment type or model.
- Location.
- Availability.
- Condition/status.
- Associated equipment knowledge or guide.

---

### FR-6 – Equipment Types and Physical Units

**Priority:** Must  
**Status:** Confirmed

The system shall distinguish between an equipment type and, where
necessary, its individual physical units.

Equipment of the same type may be presented to ordinary users as a
group with a total and available quantity.

Where individual traceability is required, physical units should be
identifiable separately so that information such as loans, faults,
condition, serial numbers or asset identifiers can be associated with
the relevant unit.

Not all equipment types necessarily require individual unit tracking.

---

### FR-7 – Equipment Location

**Priority:** Must  
**Status:** Confirmed

Equipment shall contain information about where it is stored or located.

The customer explained that equipment belonging to the same category is normally kept together.

The exact relationship between locations, shelves and equipment types will be determined during system design.

---

### FR-8 – Equipment Availability and Condition

**Priority:** Must  
**Status:** Confirmed

The system shall represent the availability and condition of equipment.

For quantity-based equipment, availability shall reflect how many items are currently available.

Equipment condition/status may include:

- Operational.
- Broken.
- In repair.
- Out of service.

The exact representation of availability and condition will be refined during system design.

---

### FR-9 – Manage Equipment

**Priority:** Must  
**Status:** Confirmed

Authorized users shall be able to:

- Add new equipment.
- Update existing equipment information.
- Update equipment status and condition.

---

### FR-10 – Equipment Search and Discovery

**Priority:** Should  
**Status:** Confirmed

Users should be able to find relevant equipment without needing to know its exact identifier.

Search and/or filtering functionality should support equipment discovery.

---

## 2.3 Equipment Knowledge & Guides

### FR-11 – Equipment Guides

**Priority:** Must – Core Requirement  
**Status:** Confirmed

Equipment shall be able to have an associated guide.

The guide shall provide users with the knowledge required to understand, set up and/or use the equipment.

Equipment guides are the highest-priority requirement, as identified during Customer Meeting 1 and confirmed during Customer Meeting 2.

---

### FR-12 – Setup and Usage Information

**Priority:** Must  
**Status:** Confirmed

Equipment guides shall support instructions explaining how equipment is set up and used.

Depending on the equipment, information may include:

- Setup steps.
- Usage instructions.
- Configuration information.
- Wiring or pinout information.
- Safety information.

---

### FR-13 – Troubleshooting Knowledge

**Priority:** Must  
**Status:** Confirmed

Users shall be able to access information about common equipment problems and possible solutions.

The purpose is to preserve previously acquired knowledge so that users do not repeatedly need to solve the same problems from scratch.

---

### FR-14 – Equipment Resources

**Priority:** Should  
**Status:** Confirmed

Equipment knowledge may contain links or access to relevant resources, including:

- OS images.
- Firmware.
- Configuration files.
- Documentation.
- Other relevant files or resources.

The customer leaves the technical storage method to the developer. Resources may therefore be stored by the application or provided through external links.

---

### FR-15 – Guide Creation and Editing

**Priority:** Must  
**Status:** Confirmed

Maintainers and Administrators shall be able to create and update equipment guides and related troubleshooting knowledge.

Students/ordinary users shall be able to view this knowledge but shall not be permitted to create or edit guides or troubleshooting information.

---

### FR-16 – Knowledge History

**Priority:** Should  
**Status:** Confirmed

When an equipment guide is updated, previous versions shall remain available for viewing.

The system should preserve relevant authorship and change information so that knowledge remains traceable when guides are updated or responsibility for equipment changes.

---

## 2.4 Loans & Availability

### FR-17 – Loan Request

**Priority:** Must  
**Status:** Confirmed

Users shall be able to request equipment that can be borrowed.

A loan request shall include a requested borrowing period.

---

### FR-18 – Flexible Borrowing Duration

**Priority:** Must  
**Status:** Confirmed

The system shall not enforce one universal borrowing duration for all equipment.

Loan periods may vary from a few days to several weeks and may potentially cover approximately eight weeks for course-related use.

---

### FR-19 – Loan Approval

**Priority:** Must  
**Status:** Confirmed

Equipment requiring approval shall allow an authorized user to approve or reject the loan request.

Not all equipment requires approval before use or borrowing.

---

### FR-20 – Equipment Usage Policy

**Priority:** Should  
**Status:** Proposed

The system should support different usage or borrowing rules for different equipment.

A proposed model is to allow equipment to be configured as:

- Available for direct use.
- Bookable for a time period.
- Borrowable through a request and approval process.

The exact model requires customer validation.

---

### FR-21 – Active Loans

**Priority:** Must  
**Status:** Confirmed

The system shall keep track of active loans.

At minimum, an active loan shall contain:

- Equipment.
- Borrower.
- Start date.
- Expected return date.

This reflects information already maintained in the customer's current manual loan process.

---

### FR-22 – Return Equipment

**Priority:** Must  
**Status:** Confirmed

A Student/User shall be able to register the return of borrowed equipment.

As part of the return workflow, the user shall complete a checklist/information step concerning the returned equipment.

After the return is registered, the equipment availability shall be updated appropriately.

A separate Maintainer inspection or pending-inspection state is not required before the equipment can be returned to availability.

**Sprint 3 note:** the checklist/information step was not implemented in Sprint 3 because acceptance test 10 does not require it. The borrower returns an active loan in one step from My loans; the loan keeps its return date and appears in the unit's loan history. The requirement remains open and will be confirmed with the customer.

---

### FR-23 – Equipment Availability

**Priority:** Must  
**Status:** Confirmed

Users shall be able to determine whether equipment is currently available.

Ordinary users shall not be shown the identity of the person currently borrowing equipment.

---

### FR-24 – Existing Excel Data

**Priority:** Not Required  
**Status:** Confirmed

Existing loan data from the customer's current Excel spreadsheet does not need to be imported into the new system.

Existing data may be used as an example of the information currently recorded, but data migration is outside the required scope.

---

## 2.5 Maintenance & Fault Reporting

### FR-25 – Report Equipment Fault

**Priority:** Must  
**Status:** Confirmed

Users shall be able to report problems or faults associated with equipment.

---

### FR-26 – Manage Faults

**Priority:** Must  
**Status:** Confirmed

Authorized Maintainers shall be able to review and manage reported equipment faults.

---

### FR-27 – Update Equipment Condition

**Priority:** Must  
**Status:** Confirmed

Authorized users shall be able to update equipment condition/status when equipment becomes broken, is repaired, or otherwise changes condition.

---

### FR-28 – Maintainer Assignment

**Priority:** Should  
**Status:** Confirmed

Equipment that requires a responsible Maintainer should support assigning an appropriate Maintainer.

Not every piece of equipment requires a dedicated Maintainer.

---

### FR-29 – Change Maintainer

**Priority:** Should  
**Status:** Confirmed

It shall be possible to change the Maintainer responsible for equipment.

Historical authorship of guides and equipment knowledge shall remain intact when the current Maintainer changes.

The roles allowed to assign or change Maintainers require further clarification.

---

## 2.6 QR Codes

### FR-30 – Equipment QR Code

**Priority:** Should  
**Status:** Confirmed

Equipment should be able to have a QR code.

Scanning the QR code shall direct the user to the relevant equipment information page.

The QR code itself shall not be used as an authentication mechanism.

If the user is not already authenticated, authentication shall be required before the equipment information is displayed.

---

### FR-31 – Printable Equipment Label

**Priority:** Should  
**Status:** Confirmed

The system should support producing a basic printable equipment label.

The label should primarily contain:

- Equipment name.
- QR code.

A normal printer is sufficient. Integration with a dedicated label printer is not required.

---

## 2.7 Project Knowledge

### FR-32 – Equipment-Related Projects

**Priority:** Should  
**Status:** Confirmed

Users should be able to discover previous projects or project ideas associated with equipment.

This information can help users understand practical applications of available equipment.

For example:

> What can I build with this Raspberry Pi?

---

### FR-33 – Project Information

**Priority:** Should  
**Status:** Proposed

Project entries may contain information such as:

- Equipment used.
- Project description.
- Relevant resources.
- Experience or knowledge gained.
- Relevant links.

The exact project data model has not yet been specified.

---

### FR-34 – Project Ratings

**Priority:** Could  
**Status:** Confirmed

Users may be able to rate project ideas based on whether the project or idea was useful.

Ratings apply primarily to project ideas rather than to the physical equipment itself.

---

### FR-35 – Comments

**Priority:** Could  
**Status:** Open

The system may support comments on relevant project or knowledge content.

The following details remain unclear:

- Who may create comments.
- Whether comments may be edited.
- Whether comments may be deleted.
- Whether comments are permanent.
- Whether comments expire.
- Whether moderation is required.

Comment functionality is not currently considered part of the core MVP.

---

# 3. Non-Functional Requirements

## 3.1 Usability

### NFR-1 – Simple User Interface

**Priority:** Must  
**Status:** Confirmed

The system shall provide a simple and intuitive graphical user interface.

The design shall not assume a high level of technical competence.

---

### NFR-2 – Clear Navigation

**Priority:** Must  
**Status:** Confirmed

Core functionality, particularly equipment information and guides, shall be easy to locate.

A user working next to a piece of equipment should be able to reach relevant information with minimal navigation.

---

### NFR-3 – User Feedback

**Priority:** Should  
**Status:** Proposed

Actions and errors should provide clear and understandable feedback to users.

---

## 3.2 Mobile and Responsive Design

### NFR-4 – Mobile Support

**Priority:** Must  
**Status:** Confirmed

The application shall work effectively on mobile devices.

This is important because users and Maintainers may access the system while physically standing next to equipment in the laboratory.

---

### NFR-5 – Responsive and Mobile-Compatible Interface

**Priority:** Must  
**Status:** Confirmed

The user interface shall work effectively across relevant screen sizes, including:

- Desktop.
- Tablet.
- Mobile.

The technical solution may be implemented as a responsive web application or another suitable mobile-compatible solution. The customer leaves this technical choice to the development team.

---

## 3.3 Security & Authorization

### NFR-6 – Authentication

**Priority:** Must  
**Status:** Confirmed

All application functionality shall require authentication.

Users shall authenticate using a username and password.

---

### NFR-7 – Role-Based Authorization

**Priority:** Must  
**Status:** Confirmed

Users shall only be able to perform operations permitted by their role and permissions.

---

### NFR-8 – Restricted Equipment

**Priority:** Should  
**Status:** Confirmed

Where equipment requires special training or authorization, the system should prevent unauthorized users from performing restricted operations.

---

### NFR-9 – Input Validation

**Priority:** Must  
**Status:** Confirmed

User-provided data shall be validated before being stored or processed.

---

## 3.4 Privacy

### NFR-10 – Borrower Privacy

**Priority:** Must  
**Status:** Confirmed

Ordinary users shall not be able to see the identity of the person currently borrowing equipment.

Authorized staff may access borrower information when required for loan management.

---

### NFR-11 – Data Minimization

**Priority:** Should  
**Status:** Proposed

The application should only collect personal information necessary for operating the system.

Sufficient contact information shall be available for authorized staff to contact borrowers.

A requirement to collect users' physical home addresses has not been established.

---

### NFR-12 – Internal Users

**Priority:** Must  
**Status:** Confirmed

The application is intended for users within the organization rather than members of the general public.

---

## 3.5 Maintainability

### NFR-13 – Knowledge Preservation

**Priority:** Must  
**Status:** Confirmed

Equipment knowledge shall remain available when Maintainers or other responsible staff change.

---

### NFR-14 – Authorship and History

**Priority:** Should  
**Status:** Confirmed

Relevant knowledge should preserve authorship and change information so that it is possible to identify who contributed information.

Previous versions of updated equipment guides shall remain accessible for viewing.

---

### NFR-15 – Technical Maintainability

**Priority:** Must  
**Status:** Proposed

The implementation should use a clear and maintainable structure appropriate for continued development during the three project sprints.

The customer has not mandated a specific programming language or framework. The technology stack may therefore be selected based on the project's requirements and feasibility.

---

# 4. Proposed MVP

The following MVP reflects the current interpretation of the customer's priorities following Customer Meetings 1 and 2.

Equipment Knowledge & Guides has been confirmed as the highest-priority area. The customer has emphasized that equipment guides should remain in scope even if the overall project scope must be reduced.

Quality should be prioritized over implementing a large number of features.

## 4.1 Must

### Equipment Knowledge & Guides

- View equipment guides.
- Access setup and usage instructions.
- Access troubleshooting information.
- Preserve equipment knowledge over time.
- Maintainers and Administrators can create and update guides and troubleshooting information.

### Equipment Inventory

- View registered equipment.
- View equipment details.
- View equipment location.
- View availability and condition/status.
- Basic equipment management by authorized users.

### Authentication & Roles

- Login and logout.
- Student/User role.
- Maintainer role.
- Administrator role.
- Basic role-based authorization.

### Basic Loans & Availability

- Request borrowable equipment.
- Specify requested borrowing period.
- Approval where required.
- Track active loans.
- Allow users to return borrowed equipment through a checklist/information step.
- Display equipment availability.
- Protect borrower identity from ordinary users.

### Maintenance & Fault Reporting

- Report equipment faults.
- Review/manage reported faults.
- Update equipment condition/status.

---

## 4.2 Should

The following functionality should be considered after the core product is stable:

- Search and filter equipment.
- QR codes linking to equipment pages.
- Printable equipment name and QR labels.
- Guide version/change history.
- Equipment-specific Maintainer assignment.
- Transfer/change of Maintainer.
- Training/induction-based permissions.
- Project examples associated with equipment.
- Relevant OS images, firmware, configuration files and other resources.
- Different usage policies for direct-use, bookable and approval-required equipment.
- More detailed maintenance history.

---

## 4.3 Could

The following functionality may be considered if sufficient time remains after Must and Should requirements have been implemented to an acceptable quality:

- Project ratings.
- Comments.
- Dark/light mode.
- Advanced project idea catalogue.
- Advanced booking or waiting-list functionality.
- Statistics and dashboards.
- Advanced notifications and reminders.
- Advanced exports.
- Advanced availability timelines.
- Specialized label-printer integration.
- Additional social functionality.

---

## 4.4 Proposed Core User Journey

The proposed primary MVP journey is:

1. A Student logs in.
2. The Student finds a piece of equipment.
3. The Student opens the equipment page.
4. The Student reads the guide, setup instructions, or troubleshooting information.
5. The Student checks equipment availability.
6. If borrowing is required, the Student submits a request for a specified period.
7. An authorized user processes the request where approval is required.
8. The equipment is borrowed.
9. When returning the equipment, the Student completes the return checklist/information step and registers the return.
10. The system updates the equipment availability without requiring a separate inspection/pending state.

A second core journey is:

1. A user discovers a problem with equipment.
2. The user reports the fault.
3. A Maintainer reviews and handles the fault.
4. The equipment condition/status is updated.
5. Relevant equipment knowledge may be updated to preserve information about the problem and its solution.

---

# 5. Customer Meeting 2 Decisions and Remaining Open Questions

This section records decisions confirmed during Customer Meeting 2 and identifies the questions that remain open.

## 5.1 Confirmed Decisions

- Equipment Knowledge & Guides is the highest-priority area.
- All application functionality shall require authentication.
- Guides and troubleshooting information may be created and edited by Maintainers and Administrators, but not ordinary Students.
- Students may report equipment faults.
- Students shall complete a checklist/information step when returning borrowed equipment.
- A separate inspection/pending state is not required after return.
- The system uses Student/User, Maintainer and Administrator roles.
- A Student may also have Maintainer responsibilities.
- Equipment of the same type may be presented to ordinary users as a grouped quantity, while individual physical units may be tracked separately where traceability is required.
- Previous versions of updated guides shall remain accessible.
- The system must work effectively on mobile devices; the technical implementation is left to the development team.

## 5.2 Remaining Open Questions

- exact account creation and user provisioning process;
- technical representation and user-interface handling of users with multiple roles or responsibilities;
- detailed borrowing rules for different equipment types;
- detailed modelling of equipment types and physical units where individual traceability is required;
- equipment-specific permission administration;
- Maintainer assignment/change permissions;
- project library priority;
- comment functionality and moderation rules remain deferred because comments are outside the core MVP.

# 6. Sprint 3 Acceptance-Test Traceability (12 October 2026)

This section records **Sprint 3 implementation priorities**, not new customer-confirmed decisions. The customer requirements and their original status remain documented above.

Test outcomes must be recorded separately. Inclusion in this section does not mean that a feature has passed its acceptance test.

| Acceptance Test                             | Related Requirements   | Sprint 3 Backlog                          | Delivery Priority |
| ------------------------------------------- | ---------------------- | ----------------------------------------- | ----------------- |
| AT1 – User registration                     | FR-1, NFR-6, NFR-9     | #66, #126                                 | Must              |
| AT2 – Authentication and roles              | FR-1–FR-2, NFR-6–NFR-7 | #66, #126; existing login/RBAC            | Must (regression) |
| AT3 – Physical unit identity and location   | FR-5–FR-9              | #119–#122, #125                           | Must              |
| AT4 – Category filtering and availability   | FR-8, FR-10, FR-23     | #123, #127; existing #94–#97              | Must              |
| AT5 – Unit-specific out-of-service handling | FR-6, FR-8, FR-27      | #121, #123                                | Must              |
| AT6 – Equipment guides                      | FR-11–FR-15            | Existing guides; #129 verification        | Must (regression) |
| AT7 – Unit-specific fault reporting         | FR-25–FR-27            | #47, #72–#73, #93                         | Must              |
| AT8 – Known problems on units               | FR-6, FR-13            | #125; existing guide/troubleshooting data | Must              |
| AT9 – Unit-specific borrowing               | FR-17–FR-21, FR-23     | #43–#44, #124; existing #91               | Must              |
| AT10 – Return and history                   | FR-21–FR-23            | #46, #71, #90, #92                        | Must              |
| AT11 – Mobile usability                     | NFR-1–NFR-5            | #128–#129                                 | Must              |
| AT12 – Project library                      | FR-32–FR-33            | #130–#131                                 | Should (stretch)  |
| AT13 – Global search                        | FR-10, FR-11, FR-32    | #132–#133                                 | Should (stretch)  |

## 6.1 Deferred Sprint 3 Implementation

The following functionality remains documented in the requirements specification but is not part of the Sprint 3 core commitment:

- Role administration: #13, #26, #67–#68.
- Guide version history: #48–#49, #74–#75.
- QR codes and printable labels: #98–#101.
- Resolution note on resolved faults: #145.

Deferring these implementations does not remove the underlying customer requirements or change their customer-confirmation status.

## 6.2 Quality Assurance

Completed workflows shall be verified against the relevant acceptance criteria.

Testing shall include:

- Role-based access control and authorization.
- Equipment-unit data integrity.
- Loan availability and conflicting requests.
- Borrowing, approval and return workflows.
- Fault reporting and equipment status updates.
- Mobile and desktop layouts.
- Dark, Light and Auto themes.

Test results shall be recorded as PASS, PARTIAL or FAIL. Identified defects shall be documented, corrected and retested where feasible before Demo 3 on 21 October 2026.

## 6.3 Sprint 3 Outcome (20 October 2026)

All 13 acceptance tests passed on main @ 9097937 from a fresh install and an empty database; results are recorded in #129.

Not met from the Sprint 3 commitment:

- The return checklist (FR-22) was not implemented (#152).
- Dark, Light and Auto themes were not verified; the application has a dark theme only (#152).
- Category filtering uses the text filter; there is no separate category dropdown (#127, #152).

Testing was manual and with scripted browser runs; the repository contains no automated test suite.

# 7. Current Requirements Summary

The main requirement confirmed through Customer Meetings 1 and 2 is the preservation and accessibility of equipment knowledge.

The current proposed implementation priorities are therefore:

1. Establish equipment records and equipment pages.
2. Make guides and troubleshooting knowledge accessible.
3. Establish users, authentication and appropriate permissions.
4. Support the basic lifecycle of borrowing and returning equipment.
5. Support fault reporting and equipment condition management.

The requirements and priorities will continue to be refined iteratively as remaining open questions are resolved and further customer feedback is received.
