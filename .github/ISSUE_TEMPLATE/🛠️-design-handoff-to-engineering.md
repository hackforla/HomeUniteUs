---
name: "\U0001F6E0️ Design Handoff to Engineering"
about: To document and communicate finalized design work for Engineering implementation.
title: 'Dev: [Design Handoff → Dev] <Feature Name or Epic>'
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
**Select the applicable type (located in the right sidebar) and remove this section**
- Under Type,![image](https://github.com/user-attachments/assets/aaf85aa9-ac24-41c7-aac5-e0fd10a3f5de)
 select the applicable label:
   - Bug - select if the issue is to fix a bug
   - Feature - select if the issue is product feature
   - Task - select if the issue is administrative, not a feature
---

### 🧩 Overview
This issue is for tracking engineering work related to #[add related user story issue number], which is [Provide a brief description of the feature, outlining its purpose and expected outcome see the related user story - We need to do X for Y reason.]

### More Info
- Add additional context about the issue, this could include technical information
- Brief summary of the feature, component, or page.  
- Explain what is being handed off and why.

> _Example:_ Final UI for Host Intake Profile Page, including navigation, form field components, save/progress behavior, and validation states.

---

### ✅ Acceptance Criteria

<!-- List of clear, testable criteria. Use checkboxes. -->

- [ ] xxx
- [ ] xxx
- [ ] xxx
- [ ] xxx

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

### 🎨 Final Design Links

- **Figma File (or Zeplin, Sketch, etc.):** [Link]
- **Page / Component Flow:** [Link or section]
- **Design Specs / Measurements:** Included in Figma  
- **Design System Components Used:** [e.g., Modal, Stepper, Accordion]

---

### 🔄 Interaction & Behavior Details

Describe intended user interactions, transitions, and animations.

- Field validation rules
- Hover/active states
- Error/success messaging
- Mobile responsiveness expectations
- Page-to-page navigation
- Accessibility considerations (e.g., tab order, color contrast)

---

### 📱 Responsive Layouts

> If applicable, link to responsive designs  
- ✅ Mobile: [Link]  
- ✅ Tablet: [Link]  
- ✅ Desktop: [Link]

---

### ✅ UX Acceptance Checklist

- [x] Visual design QA complete
- [x] Copy finalized
- [x] Accessibility reviewed (basic standards)
- [x] Edge cases covered
- [x] Placeholder behavior confirmed (empty states, loading, etc.)

---

### 🧪 Known Edge Cases or Special Logic

Highlight any non-obvious logic or conditional behaviors:
- Conditional field rendering
- Required vs optional inputs
- Scroll behavior or sticky elements
- Form submission triggers

---

### 🛠 Dev/Engineering Notes (from Design)

(Optional) Any known technical constraints, performance considerations, or anticipated pain points.

---

### 🔁 Review Expectations

- Handoff Date: MM/DD/YYYY  
- Kickoff/Walkthrough with Dev Team: Scheduled? (Y/N)  

---

### 📎 Additional Resources

- Related Product Spec / User Story: [Link]
- Design QA Plan (if separate): [Link]
- Existing related feature in Prod: [Link]

---

### 🏁 Ready for Dev?

- [ ] Yes – Design is final, reviewed, and ready for Engineering to implement
