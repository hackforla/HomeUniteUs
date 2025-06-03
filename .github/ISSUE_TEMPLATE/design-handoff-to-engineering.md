---
name: Design Handoff to Engineering
about: To document and communicate finalized design work for Engineering implementation.
title: 'Dev: [Design Handoff → Dev] <Feature Name or Epic>'
labels: 'Complexity: Missing, Feature: Missing, Milestone: missing, Project: Missing,
  Role: missing, Size: missing'
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
#### Select issue "Planned Start and End date".  Then remove this section:
- Under selected Project Board: P: HUU: Project Board Under Type,![image](https://github.com/user-attachments/assets/aaf85aa9-ac24-41c7-aac5-e0fd10a3f5de) located in the right sidebar, click on the 2nd drop down button and select the appropriate "Planned Start and End Date"
---

### 🧩 Overview
*(Completed by Design/PM)*
*This issue is for tracking engineering work related to #[add related user story issue number], which is [Provide a brief description of the feature, outlining its purpose and expected outcome see the related user story - We need to do X for Y reason.]*

### More Info
*(Completed by Engineering/Dev)*
- Add additional context about the issue, this could include technical information
- Brief summary of the feature, component, or page.  
- Explain what is being handed off and why.

> _Example: Final UI for Host Intake Profile Page, including navigation, form field components, save/progress behavior, and validation states.

### More Info
Brief summary of the feature or enhancement, tied to the product spec.

---

### ✅ Acceptance Criteria - Design
*(Agreed upon by Product/Design/Engineering - this written from the user's perspective and describe the expected behavior of the feature).*
<!-- List of clear, testable criteria. Use checkboxes. -->

- [ ] xxx
- [ ] xxx
- [ ] xxx
- [ ] xxx

---

### 🎨 Final Design Links
*(Provided by Design Team Member)*
- **Figma File:** [Link]
- **Page / Component Flow:** [Link or section]
- **Design Specs / Measurements:** Included in Figma  
- **Design System Components Used:** [e.g., Modal, Stepper, Accordion]

---

### 🔄 Interaction & Behavior Details
*(Completed by Design team member) *
*Describe intended user interactions, transitions, and animations. *
*Specify how users interact with interface elements and how the system responds. *

Examples of what to include:
- Click/tap/hover behaviors and visual feedback
- Field validation rules and timing
- Error/success messaging placement and behavior
- Modal/dropdown opening and closing behavior
- State changes (enabled/disabled, selected/unselected)
- Page-to-page navigation and transitions
- Animation and transition requirements
- Form validation timing and error display
- Loading states and progress indicators

Specific interactions for this feature:
- [ ] [User action]: [Expected system response]
- [ ] [Interface element]: [Behavior in different states]
- [ ] [Form/input]: [Validation and feedback timing]

---

### 📱 Responsive Layouts
*Provided by Design Team Member*
> If applicable, link to responsive designs  
- ✅ Mobile: [Link]  
- ✅ Tablet: [Link]  
- ✅ Desktop: [Link]

---

### ✅ UX Acceptance Checklist
*Completed by Design Team Member - modify accordingly*
- [ ] Visual design QA complete 
    - (Verify that all visual elements match the approved designs, including spacing, typography, colors, and component usage. Check that interactive states (hover, focus, active, disabled) are clearly defined and any design system components are properly specified).
- [ ] Copy finalized 
    - (Confirm that all text content is final and approved - no placeholder text, lorem ipsum, or "TBD" copy remains. This includes labels, buttons, error messages, tooltips, and any microcopy. If copy is still being refined, note what's pending and when it will be finalized.)
- [ ] Accessibility reviewed (basic standards) 
    - (Ensure the design meets fundamental accessibility requirements: sufficient color contrast ratios, keyboard navigation considered, meaningful alt text planned for images, and form labels properly associated. Flag any potential accessibility concerns for developer attention.)
- [ ] Edge cases covered 
    - (Document how the design handles uncommon but important scenarios such as: very long text/names, empty data states, error conditions, slow loading, offline states, and boundary conditions (minimum/maximum values). List the specific edge cases considered for this feature.)
- [ ] Placeholder behavior confirmed (empty states, loading, etc.) 
    - (Define what users see during transitional states: loading spinners or skeletons while data loads, empty state messaging when no content exists, form validation feedback, and any progressive disclosure patterns. Include specific copy and visual treatment for these states.)
- [ ] Responsive behavior documented (if applicable) 
     - (Specify how the design adapts across different screen sizes and devices. Include breakpoint behavior, layout changes, content prioritization, and any mobile-specific interactions. Document which elements stack, hide, or transform on smaller screens, and note any touch-specific considerations like minimum tap target sizes.)
- [ ] Design tokens/specifications provided for developers
    - (Include precise technical specifications developers need for implementation: exact spacing values, font sizes, color hex codes, border radius, shadow values, and animation timing. Reference specific design system tokens where applicable or provide explicit measurements when custom styling is required.)

---

### 🧪 Known Edge Cases or Special Logic
*(Design/Product provide initial information, Engineering to add any technical cases)*
*Document unusual scenarios and custom business rules that require specific handling. Include both the condition and expected behavior.* 

Highlight any non-obvious logic or conditional behaviors:
- Conditional field rendering
- Required vs optional inputs
- Scroll behavior or sticky elements
- Form submission triggers

Examples to consider:
- Data validation boundaries (character limits, format requirements)
- User behavior scenarios (rapid clicking, navigation during processes)
- System failure states (API errors, network issues)
- Business rule exceptions (user role differences, geographic restrictions)
- Integration-specific requirements

List specific cases for this feature:
- [ ] [Condition]: [Expected behavior]
- [ ] [Condition]: [Expected behavior]

---

### 🛠 Dev/Engineering Notes (Optional) 
*Engineering to provide - any known technical constraints, performance considerations, or anticipated pain points. 
*Technical implementation details, constraints, and guidance specifically for the development team. This section bridges the gap between design intent and technical execution by providing engineering-specific context that isn't captured elsewhere. *
*Dev/Engineering Notes = "How to build it within our technical ecosystem"  i.e "Here are the technical things the dev team should know while building this feature."*

Examples of what to include:
- Framework/library requirements or preferences
- Performance considerations and optimization notes
- Integration details (APIs, database changes, third-party services)
- Browser/device support requirements
- Implementation phases or priorities (MVP vs. nice-to-have)
- Technical gotchas, limitations, or workarounds needed

Specific technical guidance:
- [ ] [Implementation detail]: [Specific guidance or constraint]
- [ ] [Technical requirement]: [Why it's needed or how to approach]
- [ ] [Integration note]: [What developers need to know]

---

### 🚩 Risks / Considerations
* Engineering to provide - Note potential challenges specific to implementing this feature. *
Examples of what to include:
- Dependencies that must be completed first
- Unfinalized specs that may change
- Complex logic requiring coordination between teams
- Technical constraints specific to this feature

Feature-specific items:
- [ ] [Feature-specific risk]: [How it might impact implementation]
- [ ] [Feature constraint]: [What developers should know]
- [ ] [Feature dependency]: [What this relies on] Select "dependency" label and move this to the top, before "Overview" section. 

---

### 🧵 Related Issues

- Product Issue: [Link]
- Design QA (if created): [Link]
- Backend Ticket (if split): [Link]
- Frontend Ticket (if split): [Link]
---


### Action Items
- Assign and Prep
  - [ ] Engineer: Review User Story and Self-Assign
  - [ ] Engineer: Conduct the necessary research (if applicable), clarify any questions 
  - [ ] Engineer: Work with PM and Design team member to clarify any questions about the User Story
  - [ ] Engineer: Engineer work with Engineer team Lead to assign the appropriate size, complexity 
  - [ ] Engineer/Engineering Lead: determine if work should be split into multiple issues, if so create those issues and link them in this issue (if applicable) or create as standalone.
   - [ ] Engineer/Engineering Lead: determine and provide "start and end date" for Product to update.
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
- [ ] Code is deployed, changes are visible in https://dev.homeunite.us/
   - Let Product know that it is ready for review
      - [ ] Engineer: Change Issue Status to "For Review/Feedback Needed"
      - [ ] Engineer: Add Label "Ready for: Product"
      - [ ] Engineer: Tag the PM (assignee) of the related User Story in a comment below and let them know that a draft is ready for review
   - [ ] Product: Review https://dev.homeunite.us/ and compare against Acceptance Criteria
   - [ ] Repeat above steps until all Acceptance Criteria in the User Story are accounted for
 
---

### 📎 Additional Resources

- Related Product Spec / User Story: [Link]
- Design QA Plan (if separate): [Link]
- Existing related feature in Prod: [Link]

---

- [ ] Yes – Design is final, reviewed, and ready for Engineering to implement
