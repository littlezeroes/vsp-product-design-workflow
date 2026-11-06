# Home rethink → independent feedback → implementation loop

## Purpose and current scope

Build a materially rethought VinClub Home, then use an independent feedback agent to challenge and verify it. The latest user permits changes to layout, hierarchy, grouping and presentation as long as information and needed flows remain complete. Keeping the old giant membership card above search and rail is not a requirement.

A new composition should materially change at least two of grouping, dominant object, reading order and content format. Skin, texture, a small resize or a crop alone does not qualify. Art direction and motion must remain coherent and useful rather than being decorative substitutes for a layout decision.

Read `.claude/agents/vinclub-home-feedback.md` for the reviewer contract. Read current project rules and the available VSP UX/Visual skills. Follow the user's latest scope over stale “immutable IA” notes.

## Ownership

- **Parent / designer:** source discovery, information manifest, layout decision, implementation, evidence collection, fixes and final handoff.
- **Independent feedback agent:** source/evidence reading, read-only inspection or evidence capture, findings, provisional expert ratings, verification of re-render. Owns only its assigned review directory.
- No concurrent edits to renderer, tokens, components or assets. The reviewer does not fix the product it is judging.

Default task directory: `docs/design-reviews/home-rethink-feedback/`. Give each round its own folder. Existing evidence may be linked rather than copied. Keep the original baseline intact unless the user has explicitly asked to replace it.

## 0. Establish source and information completeness

Confirm the server process/cwd, URL, query, viewport, persona and relevant storage state. Port 3300 currently serves `/Users/huykieu/Documents/vinclub-prototype`; do not assume the initial `vsp-ui` workspace owns the running app.

Create `information-and-flow-manifest.json` before evaluating completeness:

```json
{
  "baseline_url":"http://localhost:3300/vinclub-home?...",
  "persona":{"user":"member","tier":"Thành viên"},
  "items":[
    {"id":"wallet","importance":"required","value":"28.650.000 ₫","action":"open wallet","destination":"existing wallet flow","evidence":"source/render"},
    {"id":"points","importance":"required","value":"12.450 VPoint","action":"open points","destination":"existing points flow","evidence":"source/render"},
    {"id":"membership","importance":"required","fields":["tier","holder"],"action":"open membership","destination":"membership flow","evidence":"source/render"},
    {"id":"experience","importance":"required","fields":["title","partner","date/place","price","action"],"entities":"explicit source IDs","evidence":"source/render"},
    {"id":"bill","importance":"conditional","condition":"bill flag/data requires it","evidence":"state source"},
    {"id":"news","importance":"planned_only","evidence":"planning document, not current render"}
  ],
  "navigation":"explicit labels and existing destinations",
  "truth_boundaries":["sample data","prototype stubs","Member VPoint eligibility"]
}
```

Populate it from actual source/render and user requirements; this example is not a substitute for discovery. Do not make a planned block mandatory merely because a document mentions it. Do not omit a required item because it is inconvenient for the new visual.

## 1. Choose and build one layout hypothesis

State the intended Home purpose, dominant object, grouping, reading order, content format and first-viewport tradeoff. Explain why each block gets its particular attention and treatment. Build real information and actions using the local component library.

For this task, plausible independent hypotheses are:
- **Member atelier:** owned-assets bento + compact tactile membership pass, then a concise action band and panoramic discovery/list.
- **Daily command center:** readable assets and one contextual next action before discovery.
- **Editorial concierge:** experience-led invitation with search, account/status lower and compact secondary content.

These are hypotheses, not preapproved templates. Do not generate 100 nearly identical skins to avoid choosing a layout.

## 2. Capture a reviewable candidate

Create `round-01/request.json` using the schema in the agent definition. Include exact candidate version, URLs, persona/query, viewport and manifest. Capture:

- baseline and candidate at rest under the same conditions;
- scroll continuation showing required content and its retrieval;
- relevant detail/back/close/return state;
- normal-motion recording including interaction start/middle/end;
- reduced-motion recording or exercised state evidence;
- actual flow test report, with stubs and untested cases explicit.

Images must show real render. Screenshot filenames alone do not prove their contents. DOM fingerprints, screenshots, runtime traces and flow tests supply different evidence; do not let one stand in for all of them. If an artifact is missing, continue useful independent work and label that check untested.

## 3. Invoke the independent reviewer

Use the available sub-agent mechanism. User authorization for an independent feedback agent already exists in this task; do not ask permission again. Do not spawn extra roles without a reason.

For Codex orchestration, the parent can use:

```js
collaboration.spawn_agent({
  task_name: "home_feedback",
  fork_turns: "all",
  message: "Read .claude/agents/vinclub-home-feedback.md. Review round-01/request.json and its actual render/motion evidence. Write only round-01/review.json and review.md. Do not edit product files. Return verdict, stable must-fix findings, limits and at most three major next changes. Latest user permits substantial layout/hierarchy changes with information and flow completeness. Round budget: 3."
})
```

For clients with file-defined agents, invoke `vinclub-home-feedback` with the same brief and artifact paths. If no sub-agent capability is available, say the review is sequential self-review rather than claiming independence.

## 4. Receive evidence-based feedback

Reviewer outputs:
- structural novelty across the four dimensions;
- information, flows, visibility, rethink and motion gates (`pass/fail/not_tested`);
- stable issue IDs with source/visual/interaction evidence, impact, correction and acceptance test;
- must-fix P0/P1 versus nonblocking P2/tradeoffs;
- anchored 100-point rubric: identity/WOW 25, craft 25, hierarchy 20, motion 15, usability 15;
- `iterate`, `ready_with_limits` or `incomplete` verdict.

A dimension without evidence stays `null`; incomplete dimensions mean total `null`. There is no automatic pass at 85 or any other score. High visual ratings cannot compensate for a failed or untested hard gate. AI expert ratings are not user research.

## 5. Implement, then re-render

The parent resolves P0/P1 before adding ornamental P2 polish. Maintain `changes.md` mapping issue ID → source change → expected result → evidence captured. Mark issues `fixed` as an implementation claim; the reviewer alone marks `verified` after inspecting the next artifact.

Keep required information and truth boundaries while making the correction. Do not remove metadata, prices or actions merely to make a composition cleaner. Do not replace a working flow with an inert “coming soon” sheet.

Capture the changed state and directly affected transitions. Repeat broader checks when renderer/shared-component changes, a failure or a new concern justifies them. Build success is not visual verification.

Send a follow-up to the same independent agent:

```js
collaboration.followup_task({
  target: "home_feedback",
  message: "Review round-02/request.json. Verify stable IDs from round-01 against the new render and tested flows. Look for regressions introduced by the fixes. Do not edit product files. Return the updated verdict and exact remaining work. This is review round 2 of 3."
})
```

Do not submit the old screenshots as the post-fix evidence. If a reviewer finding is based on the wrong state, provide the correct artifact and explain the mismatch; do not silently ignore it.

## 6. Bound the loop and report honestly

Default **batch** size: 3 review rounds, including the first critique and verification. The user may set an explicit total budget or pause; that takes precedence. A batch cap bounds one reviewer exchange, not the parent's obligation to finish authorized fixes. There is no user-permission pause between authorized iterations or batches.

Stop early when no scoped must-fix remains, required information/flow/motion checks have evidence, fixes are verified and remaining limitations are explicit. Otherwise use the remaining rounds for substantive correction, not cosmetic score chasing.

At the end of a 3-round batch, unresolved must-fix or required missing evidence means **`incomplete` for that batch**, with stable issue IDs, missing artifacts and the concrete next implementation/validation step. If fixable issues or attainable evidence remain, the parent starts the next batch autonomously under the existing authorization. Preserve history and global round numbering. Do not auto-pass, fabricate a total, lower the gate or stop solely because a batch ended.

Stop task work only when scoped criteria are met and fixes verified, an explicit user pause/total budget requires stopping, or a real external dependency prevents further meaningful progress. Additional batches need a concrete unresolved issue or obtainable evidence, not endless cosmetic polishing. This workflow's `incomplete` verdict is not a command to change a Codex goal's status.

Final handoff leads with the actual layout result, reachable URL, what structurally changed, verified corrections, evidence locations and unresolved limits. Do not call a prototype premium/world-class solely because the renderer/build/harness is green, or ask the user to do the whole critique job after handing them a gallery.
