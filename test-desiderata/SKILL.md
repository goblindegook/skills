---
name: test-desiderata
description: Critiques and scores a project's test suite against Kent Beck's 12 test desiderata, assigning a 1–5 score to each property and surfacing the top 3 highest-impact improvements. Use this skill whenever the user wants to evaluate test quality, audit their test suite, understand what makes tests good, or get actionable feedback on how to improve their tests. Trigger on phrases like "review my tests", "how good are my tests", "test quality", "test audit", "improve my test suite", "evaluate my tests", "rate my tests", "Kent Beck", "test desiderata", or any request to assess or grade tests.
---

# Test Desiderata Reviewer

Analyze a project's test suite against Kent Beck's 12 test desiderata and produce a scored report with actionable top-3 improvements.

## The 12 Desiderata

| # | Property | What it means |
|---|----------|---------------|
| 1 | **Isolated** | Tests don't affect each other — order doesn't matter, shared state is reset |
| 2 | **Composable** | Tests can run in any subset or combination without breaking |
| 3 | **Fast** | The suite runs in seconds, not minutes — fast enough to run on every save |
| 4 | **Inspiring** | A passing suite genuinely increases confidence that the software works |
| 5 | **Writable** | Adding a new test is cheap — low ceremony, good helpers, clear patterns |
| 6 | **Readable** | A test communicates what it's testing and why it might fail |
| 7 | **Behavioral** | Tests describe what the system does, not how it's implemented internally |
| 8 | **Structure-insensitive** | Refactoring internals doesn't break tests unless behavior changes |
| 9 | **Automated** | No human steps needed — tests run in CI and locally with one command |
| 10 | **Specific** | A failing test pinpoints the exact problem — not just "something broke" |
| 11 | **Deterministic** | Tests always produce the same result — no flakiness, no timing-dependent behavior |
| 12 | **Predictive** | Passing tests are a reliable signal that production will work |

## Workflow

### Step 1: Gather inputs

You need two things:
1. **Test files** — read them directly from the repo
2. **Test runner output** — ask the user to run their test suite and share the output, or run it yourself if you have shell access

If test runner output is unavailable, proceed with static analysis and note which scores are estimates.

### Step 2: Detect the stack

Look for framework indicators: `jest.config.*`, `vitest.config.*`, `pytest.ini`, `conftest.py`, `spec_helper.rb`, `*.test.ts`, `*_test.go`, `Cargo.toml` with `[dev-dependencies]`, `build.gradle` with test dependencies, etc. Note the detected stack to apply stack-specific hints during scoring.

### Step 3: Score each desideratum (1–5)

- **5** — Exemplary: the suite clearly demonstrates this property
- **4** — Good: minor gaps or exceptions
- **3** — Mixed: noticeable issues but not pervasive
- **2** — Poor: significant, widespread problems
- **1** — Absent or severely broken

**Scoring heuristics:**

**1. Isolated**
- Look for shared mutable state, globals, DB records or files created in one test and read in another, env vars set without cleanup
- Check if tests import from or call each other
- Stack hints: Jest/Vitest — `beforeEach`/`afterEach` usage; pytest — fixture scope (`function` vs `session`); RSpec — `let` vs `before(:all)`

**2. Composable**
- Tests that are isolated tend to be composable — if Isolated scores high, this often follows
- Look for explicit ordering dependencies: numbered test names (`test_001_`), `dependsOn` annotations, runner config that enforces sequence

**3. Fast**
- Use total runtime from test runner output as the primary signal
- Heuristics: <10s = 5, 10–30s = 4, 30s–2min = 3, 2–5min = 2, >5min = 1
- Look for `sleep()`, real network calls, uncontrolled DB connections, heavy file I/O
- Stack hints: Jest — `--detectOpenHandles`; pytest — `--durations=10` output

**4. Inspiring**
- Assess coverage breadth and test naming as a proxy for confidence
- A suite covering critical paths with meaningful names earns high scores; one that only tests happy paths or skips error handling scores lower
- Flag this score as inferred — it can't be fully verified statically

**5. Writable**
- Measure the ratio of setup to assertion in representative tests — long setup = friction
- Look for reusable helpers, factories, and fixtures; absence of them suggests every test requires boilerplate
- Copy-paste patterns across tests signal missing abstractions

**6. Readable**
- Are test names descriptive? Do they describe behavior ("returns 404 when user not found") or mechanics ("calls getUser")?
- Is the Arrange / Act / Assert structure visible?
- Look for magic numbers, unexplained constants, or assertion messages that don't help diagnose failures

**7. Behavioral**
- Do tests name behaviors in their descriptions, or implementation details?
- Are tests spying on internal/private methods rather than testing through the public interface?
- High count of internal spy/mock assertions = lower score

**8. Structure-insensitive**
- Look for tests that assert on internal method invocations, private functions, or internal data shapes
- Testing through the public API = higher score; testing implementation details = lower

**9. Automated**
- Is there a CI config? (`.github/workflows/`, `.circleci/`, `Jenkinsfile`, `Makefile` with a `test` target)
- Can tests run with a single command? Check README, `package.json` scripts, `Makefile`
- Any "run manually" comments or manual setup steps?

**10. Specific**
- Count assertions per test — one assertion per test is ideal; many assertions mean failures give ambiguous signals
- Are test names self-describing enough that a failure is diagnostic without reading the body?
- Are assertion error messages customized where helpful?

**11. Deterministic**
- Look for `Date.now()`, `Math.random()`, `time.time()`, `rand()`, uncontrolled network calls, file system path assumptions, port binding
- Check runner output for retry annotations or flaky test markers (`@flaky`, `--retries`, `x/y passed, z skipped`)
- Any `sleep()` or timing-based waits are a red flag

**12. Predictive**
- Are critical user journeys covered? (infer from naming and file structure)
- Look for obvious untested paths: error handling, edge cases, integration boundaries
- A suite that is 100% unit tests with no integration coverage scores lower here
- Flag this score as inferred

### Step 4: Present the terminal report

Output a table in this format:

```
┌──────────────────────────┬───────┬────────────────────────────────────────────────────┐
│ Desideratum              │ Score │ Rationale                                          │
├──────────────────────────┼───────┼────────────────────────────────────────────────────┤
│ 1. Isolated              │  4/5  │ Good beforeEach usage; one shared DB fixture...    │
│ 2. Composable            │  4/5  │ Follows from isolation; no explicit ordering...    │
│ 3. Fast                  │  2/5  │ Suite takes 4m 20s; 3 tests hit live network...    │
│ 4. Inspiring             │  3/5  │ (inferred) Happy paths covered; error paths thin.. │
│ 5. Writable              │  3/5  │ No test factories; each test sets up 30+ lines...  │
│ 6. Readable              │  4/5  │ Clear AAA structure; some magic numbers present... │
│ 7. Behavioral            │  2/5  │ 18 tests spy on _fetchFromDb (internal method)...  │
│ 8. Structure-insensitive │  2/5  │ Many tests assert on internal call counts...       │
│ 9. Automated             │  5/5  │ GitHub Actions CI; npm test runs full suite...     │
│ 10. Specific             │  3/5  │ Avg 4 assertions/test; names are descriptive...    │
│ 11. Deterministic        │  4/5  │ No sleeps; one test uses Date.now() directly...    │
│ 12. Predictive           │  3/5  │ (inferred) Unit-heavy; integration layer thin...   │
├──────────────────────────┼───────┼────────────────────────────────────────────────────┤
│ TOTAL                    │ 39/60 │                                                    │
└──────────────────────────┴───────┴────────────────────────────────────────────────────┘
```

Mark inferred scores with `(inferred)` in the rationale.

Then present the top-3 improvements — the three lowest-scoring properties, each with one specific, actionable fix drawn from the actual code:

```
## Top 3 Improvements

1. **Fast (2/5)** — The payment API call in `checkout.test.js:34` adds ~90s per run. Mock it with
   your existing `msw` setup the same way the auth tests do in `auth.test.js:12`.

2. **Behavioral / Structure-insensitive (2/5)** — `userService.test.js` spies on `_fetchFromDb`
   (a private method) in 18 places. Rewrite these to call `getUser()` and assert on the returned
   value — the internal call is an implementation detail that will break on any refactor.

3. **Writable (3/5)** — Every test manually constructs a `User` object (avg 12 lines of setup).
   A `createUser(overrides = {})` factory would reduce this to one line per test.
```

### Step 5: Offer to save

Ask: "Would you like me to save this report to `docs/test-quality-report.md`?"

If yes, write the full report as a markdown document with the same content, plus a timestamp and the detected stack at the top.

## Notes on inferred scores

"Inspiring" and "Predictive" can't be fully assessed from code alone — they require judgment about whether the tests would catch real bugs. When scoring these, explain your reasoning and flag them as inferred. If the user disagrees, accept their assessment — they know their domain better than static analysis can.
