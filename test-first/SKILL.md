---
name: test-first
description: Use when delegating a feature-sized or multi-file implementation to an AI agent, to keep a human in control of what the tests verify rather than the agent alone. Use instead of ad hoc "write it and I'll review the diff" delegation.
---

# Test-First (Agentic)

## When To Use

* Delegating a change larger than a few lines — a feature, an endpoint, a multi-file refactor — to an agent, where tests should be the contract for what "correct" means.
* Requirements are clear enough to write tests against, but the agent shouldn't be the sole judge of whether its own tests capture your intent.

Redirect to `tdd` instead when a human is driving the keyboard through a tight unit-level loop themselves, or approving every test as it's written — that's a different regime with its own evidence base. Neither skill fits purely declarative changes (styling, config, static content, docs).

## The Non-Negotiable Rules

1. **No implementation code before the tests are approved.** The agent may draft tests, but a human must read and explicitly approve them — or actively co-edit them until satisfied — before any production code is written. This is the entire mechanism; skipping it turns this into unsupervised autonomous TDD, the regime with the weakest evidence.
2. **Never resolve a failing test by weakening or deleting it.** If a test fails after implementation and the fix isn't obvious, say so and ask — do not narrow the assertion, delete the test, change its expected value to match current (wrong) output, or mark it skipped. This is the most common way agents quietly break the safety net. Treat any edit to a test's *expectations* after approval as itself requiring re-approval.
3. **State test granularity before writing tests, and say why.** Don't default to either extreme silently.
4. **A test that never failed is not verified.** Run it against the pre-implementation state (or a deliberately broken one) and confirm it fails for the right reason, same as classic TDD.

## Choosing Granularity: A Dial, Not a Default

How small a test should be depends on how well the shape of the solution is already understood — not on habit:

* **High gear (coarse — e2e, feature-, or API-level tests, big jumps):** use when the interface and behavior are already clear and agreed. Fewer, larger tests; the agent implements a large chunk in one sweep afterward.
* **Middle gear (service/module-level):** use when the interface is clear but the internal approach isn't — expect to revise tests as understanding develops during review.
* **Low gear (unit-level, one test at a time — i.e. drop into `tdd`):** use when genuinely exploring an uncertain design. Small, frequent, revertible steps.

Say out loud which gear you're in and why before drafting tests. It's fine — expected, even — to shift gears mid-task as certainty changes: start high-gear on the parts you understand, drop to low-gear on the part you don't.

## Workflow

### 1. Draft

Agent proposes tests for the agreed behavior, at the chosen gear. Tests describe observable outcomes (inputs → outputs, states, side effects a caller would notice), not implementation steps.

### 2. Review and iterate (the gate)

Human reads the tests and checks: do they actually capture what "correct" means here, including the edge cases that matter? Iterate — add, cut, or rewrite tests together — until satisfied. **Do not proceed to implementation until this step ends in explicit approval.** This is the step classic mechanical TDD skips when it's run autonomously, and it's the step the evidence says matters most.

### 3. Confirm red

Run the approved tests against the current (pre-change) code and confirm each one fails, for the reason you expect. In this workflow "red" doesn't mean "I personally have work to do" — it means "I now trust this suite to catch a wrong implementation." If a test doesn't fail, the code already satisfies it or the test isn't testing what you think.

### 4. Implement

Agent implements toward green, at whatever size sweep the chosen gear allows — one test at a time in low gear, or a whole feature at once in high gear. Refactor once everything is green, without changing behavior.

### 5. Verify green, then re-check intent

Run the full suite. If a test needed to change to pass, treat that change as new test-intent and route it back through step 2 — don't let a green run substitute for re-approval of a changed contract.

## Good vs Bad Tests

> The more your tests resemble the way your software is used, the more confidence they give you.

**Do:**
- Test behavior a caller or user cares about, through public interfaces.
- Describe the outcome, not how it's achieved — tests should survive internal refactors.
- Name and describe tests in business language — what a caller or end user experiences — not implementation mechanics. The person approving these tests at the gate needs to judge whether they capture real intent without first translating your jargon; a name like "does not mutate the input" or "returns a new reference" makes them do that translation work, or skip it.
- One test per behavior, Arrange-Act-Assert, self-contained even if that means some duplication.
- Use real internal collaborators; mock only at system boundaries (external HTTP via `msw`/`responses`-style boundary tools, real databases where feasible, injected clocks/randomness).

**Avoid:**
- Writing a large batch of tests with no review checkpoint in between — defeats the gate.
- Testing implementation details (private methods, internal state, call counts/order).
- Naming or describing a test after a technical mechanism (mutation, object identity, reference equality) instead of the behavior that mechanism serves. If the mechanism matters at all to a caller, say what they'd notice — e.g. "the cart you were holding before applying a code still shows its original total" beats "does not mutate the cart passed in."
- Two tests that guard the same underlying guarantee from different technical angles (e.g. "doesn't mutate the input" and "returns a new object, not the same reference" are usually one guarantee, not two) — collapse them; each extra test is one more thing the approver has to read and re-approve on every change.
- Snapshot tests — low specificity, too easy to update by accident (or by an agent trying to get to green).
- Claiming tests pass without having actually run them.

## Quick Checklist

- [ ] Named the gear (coarse/medium/fine) and why, before drafting tests.
- [ ] Tests drafted, described in terms of observable behavior.
- [ ] Human reviewed and explicitly approved the tests — or iterated until satisfied — before any implementation code was written.
- [ ] Confirmed each approved test fails against the pre-change code, for the right reason.
- [ ] Implemented toward green at the agreed sweep size; refactored only on green.
- [ ] Full suite passes; any test whose *expectations* changed to get there was re-approved, not just re-run.
- [ ] No test was weakened, skipped, or deleted to make it pass.
