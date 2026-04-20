---
name: tdd
description: Enforce strict test-driven development for behavior changes and bug fixes. Use when implementing through automated tests with one-test-at-a-time red-green-refactor discipline.
---

# TDD

## Purpose

Use strict red-green-refactor in small, behavior-focused increments.

## Trigger

Use for behavior changes and bug fixes where automated tests can drive implementation.

## Interaction Contract

1. Align with the user before the first test in a sequence.
2. Check in at decision boundaries: interface changes, new behavior branch, test strategy shifts, or non-trivial refactors.
3. If the next micro-step is obvious and low risk, continue without pausing, then report progress after up to 3 red-green-refactor loops.

## Non-Negotiable Rules

1. Write one failing test for one observable effect.
2. Write only the implementation needed to pass that test.
3. Refactor only when all tests are green.
4. Repeat.

## Workflow

### Before Each Test

1. Confirm the external behavior and interface change.
2. Confirm the single effect this test will verify.
3. Identify opportunities for deep modules with small surface area.
   - Reduce public methods.
   - Simplify parameters.
   - Hide complexity internally.
4. Confirm with the user when crossing a decision boundary; otherwise proceed and report.

### Red-Green-Refactor Loop

1. Red: Add one test for one effect; verify it fails for the right reason.
2. Green: Implement only what is needed to pass that test.
3. Verify green: Run relevant tests and confirm they pass.
4. Refactor (green only):
   - Remove duplication.
   - Inline unnecessary indirection.
   - Keep interfaces small and implementations deep.
   - Improve naming and structure without changing behavior.
5. Run tests after every refactor change.

## Good vs Bad Tests

Guiding principle:

> The more your tests resemble the way your software is used, the more confidence they can give you.

Good tests:

1. Test behavior users and callers care about.
2. Use public interfaces.
3. Survive internal refactors.
4. Describe what, not how.
5. Keep assertions focused on one behavior.
6. Use real internal collaborators whenever possible.

Bad tests:

1. Write a large batch of tests up front instead of iterating one failing test at a time.
2. Implement behavior not required by the current failing test.
3. Test implementation details instead of behavior.
4. Mock internal collaborators.
5. Test private methods.
6. Assert how many times a function is called or the exact call order.
7. Break after internal refactors that do not change behavior.
8. Name tests by how instead of what.
9. Assert through side channels instead of the interface under test.

## Mocking Guidelines

1. Mock only at system boundaries. For external HTTP APIs, mock at the outermost layer using boundary tools such as `msw` (JavaScript/TypeScript) and `responses` (Python).
2. Prefer real databases when tests can run against them.
3. Inject dependencies for non-deterministic behavior (time, randomness); prefer simple dependency injection.
4. Mock the file system only when necessary.
5. NEVER mock internal collaborators.
6. NEVER mock the function under test.

## Quick Checklist

- [ ] Confirm external behavior and interface change.
- [ ] Choose one next effect to test.
- [ ] Add one failing test and verify the failure reason.
- [ ] Implement the minimum code to pass.
- [ ] Run relevant tests and confirm green.
- [ ] Refactor on green only.
- [ ] Re-run tests after each refactor step.
- [ ] Repeat for the next behavior.
