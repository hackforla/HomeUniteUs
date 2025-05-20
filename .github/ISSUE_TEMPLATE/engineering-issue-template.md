---
name: Engineering Issue Template
about: 'Purpose: To document development work derived from product stories, including
  tech context, implementation plan, and delivery scope.'
title: '"[Dev] <Feature or Component Name>"'
labels: 'Complexity: Missing, Feature: Missing, milestone: missing, Role: missing,
  size: missing'
assignees: ''

---

**UPDATE LABELS: Add the following labels to each new issue, and remove default labels. Then remove this section:**
* Complexity
* Feature
* Role
* Milestone
* Size
* Project 
#### Select Project Board (located in the right sidebar)- Then remove this section:
- Under Type,![image](https://github.com/user-attachments/assets/aaf85aa9-ac24-41c7-aac5-e0fd10a3f5de) 
      - P: HUU: Project Board
#### Select the applicable type (located in the right sidebar). Then remove this section:
- Under Type,![image](https://github.com/user-attachments/assets/aaf85aa9-ac24-41c7-aac5-e0fd10a3f5de) select the applicable label:
   - Bug - select if the issue is to fix a bug
   - Feature - select if the issue is product feature
   - Task - select if the issue is administrative, not a feature
#### Select the applicable type (located in the right sidebar). Then remove this section:
- Under Type,![image](https://github.com/user-attachments/assets/aaf85aa9-ac24-41c7-aac5-e0fd10a3f5de) select the applicable label:
   - Bug - select if the issue is to fix a bug
   - Feature - select if the issue is product feature
   - Task - select if the issue is administrative, not a feature

### Overview
This issue is for tracking engineering work related to #[add related user story issue number], which is [Provide a brief description of the feature, outlining its purpose and expected outcome see the related user story - We need to do X for Y reason.]

### More Info
Brief summary of the feature or enhancement, tied to the product spec.

> _Example:_ Implement the frontend and backend logic for the Host Intake Profile form based on the approved product story.
---


### 📐 Scope of Work

Clearly define what’s in scope for this issue.
- Create form fields dynamically from schema
- Implement save progress functionality (autosave and manual)
- Add validation rules as defined in the schema
- Ensure user authentication is respected
- Set up database schema if not yet implemented

### 🔧 Engineering Tasks

<!-- Actionable dev steps for implementation. Include backend, frontend, tests, etc. -->
### Steps to Implement 
-[Add engineering action items here] Such as:
- [ ] Implement backend logic for profile update
- [ ] Add UI form fields (email, display name)
- [ ] Connect frontend to backend endpoint
- [ ] Add input validation on frontend
- [ ] Write unit and integration tests
- [ ] Deploy under feature flag
- [ ] Update API docs if applicable

---

### ✅ Acceptance Criteria

<!-- List of clear, testable criteria. Use checkboxes. -->

- [ ] xxx
- [ ] xxx
- [ ] xxx
- [ ] xxx

---
### 🔄 Dependencies
- Select "dependency" label and move this section to the top of the page.  Describe the dependency or link to the issue that is blocking this one from proceeding. 

---

### 📦 Technical Notes

Engineering team should document their approach here, such as:
- Component hierarchy or file structure plan
- Libraries or dependencies needed
- How local state and API responses will be managed
- Planned test coverage
- API endpoint: 
- Feature flag: 
- Known limitations: 

---

### 🧪 Testing Strategy
- Unit tests for form logic and validation
- Integration test with backend service
- Cross-browser UI check
- Responsive layout testing (mobile, tablet, desktop)

---

### 🚩 Risks / Considerations

- API spec not finalized – may need adjustments
- Edge case for conditional fields requires backend logic
- DB schema must be deployed first

### ⚠️ Risk Assessment & Compliance Considerations
- **Security Impact:** (e.g., new endpoints, data exposure, authentication changes?)
- **Data Privacy:** (Does it handle PII or sensitive data? Do we need a DPA update?)
- **Regulatory Impact:** (e.g., GDPR, HIPAA, PCI-DSS, etc.)
- **Third-Party Tools:** (Any new integrations needing legal/security review?)
- **Accessibility Concerns:** (Does this meet WCAG/ADA standards?)
- **Rollback Plan:** (What’s the mitigation if something goes wrong?)
---

### 🧵 Related Issues

- Product Issue: [Link]
- Design QA (if created): [Link]
- Backend Ticket (if split): [Link]
- Frontend Ticket (if split): [Link]
---

### Action Items
- Assign and Prep
  - [ ] Engineer: Understand the Issue to be drafted and Self-Assign
  - [ ] Engineer: Conduct the necessary research (if applicable), clarify any questions 
  - [ ] Engineer: Engineer work with Engineer team Lead to assign the appropriate size & complexity:
  - [ ] Engineer/Engineering Lead: determine if work should be split into multiple issues, if so create those issues and link them in this issue (if applicable) or create as standalone.
- Draft and Review:
  - [ ] Engineer: Change Issue Status to "For Review/Feedback Needed"
  - [ ] Engineer: Add Label "Ready for: Dev Peer Review"
  - [ ] Engineer 1st Level/Peer Review: Review and compare against Acceptance Criteria, provide feedback in comment section below, tag assignee.
  - [ ] Engineer 1st Level/Peer Reviewer: Change Issue Status to "Questions/Clarification" and add label "Ready for Dev Team Member"
  - [ ] Engineer (Assignee): Change Issue Status to "In Progress"
  - [ ] Engineer (Assignee): Review issue comment(s) and resolve accordingly
  - [ ] Repeat above steps until all Acceptance Criteria are accounted and comments are resolved
  - [ ] Engineer 1st Level/Peer Reviewer: Change Issue Status to "For Review/Feedback Needed" and add label "Ready for: Dev Lead"
  - [ ] 2nd final/Lead Engineer: Review and compare against Acceptance Criteria, provide feedback (if any) in comment section below, add label "Ready for Dev Team Member"
  - [ ] Repeat above steps until all Acceptance Criteria are accounted and comments are resolved 
   
---

### 📎 Resources
- Figma UI Reference: [Link]
- Technical Design Doc (if applicable): [Link]

---

### Attachments/Screenshots (If Applicable):
- (Insert wireframes, UI mockups, or relevant references)

---
