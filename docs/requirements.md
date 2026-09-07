# Lab Equipment Knowledge Hub (LEKH)
## Requirements Specification

**Customer:** Zeth Danielsson  
**Course:** PA1493 Software Development Project (Distance) HT26  
**Status:** Draft  
**Version:** 0.1  
**Last updated:** 2026-09-07  

## Document History

| Version | Date | Source | Changes |
|---|---|---|---|
| 0.1 | 2026-09-07 | Project description and Customer Meeting 1 | Initial requirements, proposed MVP, and open questions |

## Requirement Status

Requirements in this document use the following status values:

- **Confirmed** – supported by information provided by the customer during Customer Meeting 1 or by the original project description.
- **Proposed** – an interpretation or proposed solution based on the customer's needs that requires further validation.
- **Open** – a requirement or detail that requires clarification from the customer.

The priorities in this document represent the current interpretation after Customer Meeting 1. The proposed MVP and priorities will be reviewed with the customer during Customer Meeting 2.

---

# 1. Project Overview

## 1.1 Purpose

The purpose of the **Lab Equipment Knowledge Hub (LEKH)** is to provide a central system for storing, preserving, and accessing knowledge about laboratory equipment.

The main problem identified by the customer is that knowledge about equipment is currently difficult to access and is not maintained in one central place. Users should be able to find information about equipment, understand how to set it up and use it, and find solutions to common problems.

Equipment guides are considered the most important part of the system. When asked which functionality should not be removed if the scope had to be reduced, the customer identified **equipment guides** as the essential functionality.

The system should also support workflows surrounding the equipment, including inventory, availability, borrowing, maintenance, fault reporting, and user permissions.

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

Find or scan equipment → open equipment page → read guide → check availability → use or request equipment → consult troubleshooting information if necessary.

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
- Manage relevant loans and returns.
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
3. Equipment knowledge, guides, and troubleshooting.
4. Loans and availability.
5. Maintenance and fault reporting.
6. QR-based equipment access.
7. Project knowledge associated with equipment.

### Initial Scope

The current requirements include:

- User authentication.
- Student, Maintainer, and Administrator roles.
- Equipment inventory.
- Equipment types and individual physical units where applicable.
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
- A responsive graphical web interface.

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

The exact authentication solution has not yet been determined.

---

### FR-2 – User Roles

**Priority:** Must  
**Status:** Confirmed

The system shall support at least the following roles:

- Student/User
- Maintainer
- Administrator

The functionality available to a user shall depend on the user's role and permissions.

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
- Individual physical unit where applicable.
- Location.
- Availability.
- Condition/status.
- Associated equipment knowledge or guide.

---

### FR-6 – Equipment Types and Physical Units

**Priority:** Must  
**Status:** Confirmed

The system shall support distinguishing between an equipment type and individual physical units where this distinction is relevant.

For example:

Raspberry Pi 4B  
- Unit 001
- Unit 002
- Unit 003

Individual units may have different availability or condition.

---

### FR-7 – Equipment Location

**Priority:** Must  
**Status:** Confirmed

Equipment shall contain information about where it is stored or located.

The customer explained that equipment belonging to the same category is normally kept together.

The exact relationship between locations, shelves, equipment types, and individual units will be determined during system design.

---

### FR-8 – Equipment Status

**Priority:** Must  
**Status:** Confirmed

The system shall represent the availability and/or condition of equipment.

Possible statuses may include:

- Available
- On loan
- Broken
- In repair
- Out of service

The exact set of statuses will be refined during development.

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

The guide shall provide users with the knowledge required to understand, set up, and/or use the equipment.

Equipment guides are the highest-priority requirement identified during Customer Meeting 1.

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
**Status:** Open

Authorized users shall be able to create and update equipment guides and related knowledge.

It has not yet been determined whether knowledge editing should be restricted to Maintainers/Administrators or whether Students should also be able to contribute.

---

### FR-16 – Knowledge History

**Priority:** Should  
**Status:** Confirmed

Relevant knowledge content should preserve information about authorship and changes.

When responsibility for equipment changes, existing knowledge shall remain available.

The system should retain information about who originally created or changed relevant knowledge.

The required level of version history remains to be clarified.

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

Authorized users shall be able to record that borrowed equipment has been returned.

The system shall update the equipment's availability appropriately.

Whether equipment must be inspected before becoming available again remains to be clarified.

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

### NFR-5 – Responsive Web Interface

**Priority:** Must  
**Status:** Confirmed

The graphical interface shall adapt to different screen sizes, including:

- Desktop.
- Tablet.
- Mobile.

A native mobile application is not required.

---

## 3.3 Security & Authorization

### NFR-6 – Authentication

**Priority:** Must  
**Status:** Confirmed

Protected functionality shall require authentication.

The exact authentication mechanism remains to be determined.

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

The borrowing system is intended for users within the organization rather than members of the general public.

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

The exact level of version history remains to be clarified.

---

### NFR-15 – Technical Maintainability

**Priority:** Must  
**Status:** Proposed

The implementation should use a clear and maintainable structure appropriate for continued development during the three project sprints.

The customer has not mandated a specific programming language or framework. The technology stack may therefore be selected based on the project's requirements and feasibility.

---

# 4. Proposed MVP

The following MVP represents the current interpretation of the customer's priorities based on Customer Meeting 1.

It has not yet been finalized and will be reviewed with the customer during Customer Meeting 2.

The customer has stated that quality should be prioritized over implementing a large number of features.

## 4.1 Must

### Equipment Knowledge & Guides

- View equipment guides.
- Access setup and usage instructions.
- Access troubleshooting information.
- Preserve equipment knowledge over time.

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
- Record returned equipment.
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
- Relevant OS images, firmware, configuration files, and other resources.
- Different usage policies for direct-use, bookable, and approval-required equipment.
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
7. An authorized Maintainer processes the request where approval is required.
8. The equipment is borrowed and later returned.
9. The system updates the equipment's availability.

A second core journey is:

1. A user discovers a problem with equipment.
2. The user reports the fault.
3. A Maintainer reviews and handles the fault.
4. The equipment condition/status is updated.
5. Relevant equipment knowledge may be updated to preserve information about the problem and its solution.

---

# 5. Open Questions

The following questions require further clarification before related implementation decisions are finalized.

## 5.1 Questions for Customer Meeting 2

### Q1 – Validate the Proposed MVP

The current interpretation identifies five core areas:

1. Equipment Inventory & Discovery.
2. Equipment Knowledge & Guides.
3. Users, Roles & Permissions.
4. Loans & Availability.
5. Maintenance & Fault Reporting.

**Question:** Does this represent the customer's priorities for the core product?

---

### Q2 – Knowledge Editing Permissions

**Question:** Who should be allowed to create and edit equipment guides and troubleshooting information?

Possible alternatives include:

- Maintainers and Administrators only.
- Students may also contribute knowledge.

---

### Q3 – Equipment Permissions and Maintainer Assignment

**Question:** Who should be able to assign or change equipment-specific permissions and Maintainers?

Should this be restricted to Administrators, or should Maintainers also have this ability?

---

### Q4 – Equipment Usage and Borrowing Model

Different equipment may require different usage rules.

A proposed model distinguishes between:

- Direct-use equipment.
- Bookable equipment.
- Equipment requiring a loan request and approval.

**Question:** Does this model reflect the customer's intended equipment workflows, or should a simpler model be used?

---

### Q5 – Return and Condition Workflow

**Question:** When equipment is returned, should an authorized Maintainer explicitly confirm its condition before it becomes available again?

Possible workflows include:

`Return → Available`

or:

`Return → Inspection → Available / Broken`

---

### Q6 – Guide Version History

**Question:** Should previous versions of equipment guides be viewable and/or restorable, or is it sufficient to record who changed a guide and when?

---

### Q7 – Authentication

**Question:** Is local username/email and password authentication sufficient for the prototype, or is integration with an existing university authentication system expected?

---

### Q8 – Project Library Priority

**Question:** After the core equipment knowledge functionality, how important is the project/idea library compared with loan and maintenance functionality?

This will help determine whether project knowledge should be included in an implementation sprint or treated as lower-priority functionality.

---

# 6. Current Requirements Summary

The main requirement identified after Customer Meeting 1 is the preservation and accessibility of equipment knowledge.

The current proposed implementation priorities are therefore:

1. Establish equipment records and equipment pages.
2. Make guides and troubleshooting knowledge accessible.
3. Establish users, authentication, and appropriate permissions.
4. Support the basic lifecycle of borrowing and returning equipment.
5. Support fault reporting and equipment condition management.

The scope and priorities will be revised following further customer feedback.