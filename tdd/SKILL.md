---
name: tdd
description: Use when implementing behavior changes or bug fixes where automated tests can drive the implementation, or when asked to use TDD.
---

# TDD

## Purpose

Use strict red-green-refactor in small, behavior-focused increments. Write a failing test before writing the code that makes it pass.

## When To Use

* Implementing new behaviour.
* Modifying existing behaviour.
* Fixing a bug (reproduce the bug with a test before fixing).
* Anything that could potentially alter publicly observable behaviour.

Do not use for purely declarative changes (configuration, styling, documentation, or static content).

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

### What to Do

1. Test behavior users and callers care about.
2. Use public interfaces.
3. Write tests that survive internal refactors.
4. Describe the outcome, not how the outcome is achieved.
5. Separate test code into Arrange-Act-Assert blocks.
6. Write one test per behavior.
7. Use real internal collaborators whenever possible.
8. Write tests that are descriptive and self-contained — duplication is tolerable if it makes the test easier to understand.
9. See the new test fail — if you never see it fail, you cannot know it's testing the right thing.

### What to Avoid

1. Writing a large batch of tests up front instead of iterating one failing test at a time.
2. Writing a test that you never see fail: it's probably worthless.
3. Writing tests after the implementation.
4. Packing multiple unrelated assertions under the same test
5. Implementing behavior not required by the current failing test.
6. Testing implementation details instead of publicly observable behavior (e.g. private methods or internal state).
7. Mocking internal collaborators.
8. Asserting how many times a function is called or the exact call order.
9. Writing tests that break after internal refactors that do not change behavior.
10. Naming tests according to how instead of what.
11. Asserting through side channels instead of the interface under test.
12. Relying on snapshot tests: snapshots lack specificity and are easy to update by mistake.
13. Skipping or commenting tests to make them pass.
14. Changing a failing test expectation to match (incorrect) production output.
15. Saying "All tests pass" without having actually run the tests.

## Mocking Guidelines

1. Mock only at system boundaries. For external HTTP APIs, mock at the outermost layer using boundary tools such as `msw` (JavaScript/TypeScript) or `responses` (Python).
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
