# Workflows

## UXUI Pipeline (11 steps)
See [[workflows/uxui-pipeline/workflow|workflow.md]] for full spec.

| # | Step | Agent | Gate |
|---|---|---|---|
| 01 | [[workflows/uxui-pipeline/steps/step-01-analyze-brd|Analyze BRD]] | [[agents/nate-researcher|Nate]] | |
| 02 | [[workflows/uxui-pipeline/steps/step-02-confirm-gaps|Confirm Gaps]] | Vi + PO | CHECKPOINT |
| 03 | [[workflows/uxui-pipeline/steps/step-03-design-flow|Design Flow]] | [[agents/nate-researcher|Nate]] | |
| 04 | [[workflows/uxui-pipeline/steps/step-04-review-flow|Review Flow]] | [[agents/duc-reviewer|Duc]] | |
| 05 | [[workflows/uxui-pipeline/steps/step-05-confirm-flow|Confirm Flow]] | Vi + PO | CHECKPOINT |
| 06 | [[workflows/uxui-pipeline/steps/step-06-screen-breakdown|Screen Breakdown]] | [[agents/ivy-designer|Ivy]] | |
| 07 | [[workflows/uxui-pipeline/steps/step-07-check-states|Check States]] | [[agents/khoa-qa|Khoa]] | |
| 08 | [[workflows/uxui-pipeline/steps/step-08-confirm-screens|Confirm Screens]] | Vi + PO | CHECKPOINT |
| 09 | [[workflows/uxui-pipeline/steps/step-09-build-code|Build Code]] | [[agents/ivy-designer|Ivy]] | |
| 10 | [[workflows/uxui-pipeline/steps/step-10-qa-final|Final QA]] | [[agents/khoa-qa|Khoa]] | |
| 11 | [[workflows/uxui-pipeline/steps/step-11-ship|Ship]] | Vi + PO | CHECKPOINT |

## Figma Restructure
- [[workflows/figma-restructure/workflow|Figma Restructure Workflow]]

---
Related: [[agents/index|Agents]] · [[knowledge/pipeline|Pipeline]] · [[features/index|Features]]
