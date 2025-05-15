---
name: Design to Engineering Handoff Issue
about: PMs & Designers use this template when a User Story is ready for Engineering. This will be a separate issue for Engineering to track their work.
title: 'Engineering for #[add related user story issue number] [Related User Story Title]'
labels: 'milestone: missing, points: missing, Role: missing, Complexity: Missing, Feature: Missing'
assignees: 

---

**UPDATE LABELS: Add the following labels to each new issue, and remove default labels. Then remove this section:**
* Complexity
* Feature
* Role
* Milestone
* Size
* Project 
### Select the applicable type (located in the right sidebar)
- Under Type,![image](https://github.com/user-attachments/assets/aaf85aa9-ac24-41c7-aac5-e0fd10a3f5de)
 select the applicable label:
   - Bug - select if the issue is to fix a bug
   - Feature - select if the issue is product feature
   - Task - select if the issue is administrative, not a feature
 
### Overview
This issue is for tracking engineering work related to #[add related user story issue number], which is [Provide a brief description of the feature, outlining its purpose and expected outcome see the related user story - We need to do X for Y reason.]

### More Info
Add additional context about the issue, this could include technical information

---

### ✅ Acceptance Criteria

<!-- List of clear, testable criteria. Use checkboxes. -->

- [ ] xxx
- [ ] xxx
- [ ] xxx
- [ ] xxx

---

### 🎨 Designs / Mockups

<!-- Link to Figma files, screenshots, or attach mockups -->

[Figma file →](#)

---

### Action Items
- Assign and Prep
  - [ ] Engineer: Review User Story and Self-Assign
  - [ ] Engineer: Work with PM and Design team member to clarify any questions about the User Story
  - [ ] Engineer: Engineer work with Engineer team Lead to assign the appropriate size, complexity:
      - [ ] Effort Estimation (Refined for Team Capacity)
          - [ ] Front end
          - [ ] Back end
  - [ ] Engineer/Engineering Lead: determine if work should be split into multiple issues, if so create those issues and link them in this issue.
- Draft and Review:
- [ ] Code is deployed, changes are visible in https://dev.homeunite.us/
   - Let Product know that it is ready for review
      - [ ] Engineer: Change Issue Status to "For Review/Feedback Needed"
      - [ ] Engineer: Add Label "Ready for: Product"
      - [ ] Engineer: Tag the PM (assignee) of the related User Story in a comment below and let them know that a draft is ready for review
   - [ ] Product: Review https://dev.homeunite.us/ and compare against Acceptance Criteria
   - [ ] Repeat above steps until all Acceptance Criteria in the User Story are accounted for
 
---

### 🛠 Technical Notes (Optional)

<!-- Notes from tech/engineering about approach, flags, dependencies, etc. -->

- API endpoint: 
- Feature flag: 
- Known limitations: 

---

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

### 🔗 Dependencies

<!-- List any related issues, blockers, or required assets -->

- Blocked by: select "dependency" label and move this section to the top of the page.  Describe the dependency or link to the issue that is blocking this one from proceeding.
- Depends on: #
- Related to: #

---

### 📊 Success Metrics

<!-- Define how we measure if this feature is successful -->

- KPI: 
- Goal: 

---
### ⚠️ Risk Assessment & Compliance Considerations

- **Security Impact:** (e.g., new endpoints, data exposure, authentication changes?)
- **Data Privacy:** (Does it handle PII or sensitive data? Do we need a DPA update?)
- **Regulatory Impact:** (e.g., GDPR, HIPAA, PCI-DSS, etc.)
- **Third-Party Tools:** (Any new integrations needing legal/security review?)
- **Accessibility Concerns:** (Does this meet WCAG/ADA standards?)
- **Rollback Plan:** (What’s the mitigation if something goes wrong?)
---

### Attachments/Screenshots (If Applicable):
(Insert wireframes, UI mockups, or relevant references)

---

### Resources/Instructions
