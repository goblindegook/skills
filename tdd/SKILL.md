---
name: tdd
description: Enforce strict test-driven development for behavior changes and bug fixes. Use when implementing code through automated tests and when one-test-at-a-time red-green-refactor discipline is required.
---

# TDD

Run strict red-green-refactor in tiny increments.

## Guiding Principle

> The more your tests resemble the way your software is used, the more confidence they can give you.

## Core Rules

1. Write one failing test for one observable effect.
2. Write the minimum implementation needed to pass that test.
3. Refactor only when all tests are green.
4. Repeat.

## Before Writing Each Test

1. Confirm interface changes.
2. Confirm behaviors to test.
3. Identify opportunities for deep modules with small surface area.
   - Can I reduce the number of methods?
   - Can I simplify the parameters?
   - Can I hide more complexity inside?
4. Design interfaces that are testable.
5. Focus on behaviors, not implementation details.
6. Confirm the immediate plan with the user.

## Red-Green-Refactor Loop

1. Red: Add one test that verifies one effect and fail it.
2. Green: Implement only what is needed to pass that test.
3. Verify green: Run tests and confirm all relevant tests pass.
4. Refactor (green only):
   - Extract duplicates.
   - Inline single-use variables or functions.
   - Prefer deep modules: simple interfaces, complex implementation.
   - Apply SOLID when appropriate.
   - Re-evaluate existing code in light of the new code.
5. Run tests after every refactor change.

## Mocking Guidelines

1. Mock only at system boundaries. For external HTTP APIs, mock at the outermost layer using boundary tools such as `msw` (JavaScript/TypeScript) and `responses` (Python).
2. Do not mock databases when tests can run against them.
3. Inject dependencies to fake non-deterministic behavior (time, randomness); prefer simple dependency injection without containers.
4. Mock the file system only when necessary.
5. NEVER mock internal collaborators; treat this as a critical error.
6. NEVER mock the functions under test.
7. NEVER mock anything in the codebase that we own.

## Good vs Bad Tests

Good tests:

1. Test behavior users and callers care about.
2. Use public APIs only.
3. Survive internal refactors.
4. Describe WHAT, not HOW.
5. Keep one logical assertion per test.
6. Test through real interfaces and never mock internals.

Bad tests:

1. Write all tests first, then all implementation.
2. Implement behavior not required by the current failing test.
3. Test implementation details instead of behavior.
4. Mock internal collaborators.
5. Test private methods.
6. Assert how many times a function is called or the exact call order.
7. Break during refactors with no behavior change.
8. Name tests by HOW instead of WHAT.
9. Verify through external means instead of the interface under test.

## Checklist

- [ ] Confirm interface changes.
- [ ] Confirm behaviors to test.
- [ ] Identify deep-module opportunities with small surface area.
- [ ] Design testable interfaces.
- [ ] Focus on behavior, not implementation details.
- [ ] Confirm plan with the user.
- [ ] Add one test for one effect and verify it fails.
- [ ] Implement the minimum code to pass.
- [ ] Run tests and confirm green before refactor.
- [ ] Refactor only on green.
- [ ] Extract duplicates.
- [ ] Inline single-use variables/functions where clearer.
- [ ] Preserve simple interfaces over complex surfaces.
- [ ] Re-run tests after each refactor change.
- [ ] Repeat for the next behavior.
