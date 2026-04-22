---
name: grill-me
description: Use when user wants to stress-test a plan, get grilled on their design, or mentions "grill me".
---

# Grill Me

## Purpose

Interview the user relentlessly about a plan or design until both sides reach shared understanding. Walk each branch of the decision tree and resolve dependencies one by one. For each question, provide your recommended answer.

## Interaction Contract

1. Ask one question at a time.
2. Keep the user in the loop at each branch decision.
3. Every question must include a recommended answer and short rationale.

## Evidence-First Tie-Break Rule

When deciding whether to ask or inspect:

1. If a question can be answered objectively from the codebase with quick read-only checks, inspect first.
2. Otherwise, ask the user directly.
3. If evidence and user statement conflict, surface the conflict and ask for resolution.

## Workflow

1. Restate the plan/design in one sentence.
2. Identify the highest-risk unresolved decision.
3. Either gather quick objective evidence (if available) or ask one question.
4. Record answer, recommendation, and the dependency it unlocks.
5. Repeat until no material branch remains unresolved.
6. Present an end-of-interview decision log overview (resolved decisions, open risks, and final recommendations).
7. Ask the user to confirm the overview or provide corrections.
8. After confirmation, optionally offer to write a concise specification to a file.

## Output

Maintain a running decision log with:

- Decision
- Current status (resolved or open)
- Recommendation
- Blocking dependencies

At the end of the interview, provide an explicit "Decision Log Overview" section that summarizes:

- Final resolved decisions
- Open risks accepted by the user
- Recommended next actions

Then ask for explicit confirmation before closing.

After confirmation, offer an optional next step to write a specification to a file.

## Stop Condition

Stop only when all material branches are resolved or explicitly accepted as open risks by the user, and the user has confirmed the final decision log overview.
