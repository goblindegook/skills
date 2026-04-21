---
name: roundtable
description: Review a project or feature from the point of view of a set of personas. Use this when the user asks for multi-perspective critique — "review from the POV of X, Y, Z", "what would a [role] think of this?", "roundtable review", "get different perspectives on this". Each persona reads the actual source code before commenting, then all personas discuss together to agree on a prioritised top 5 list. If no personas are provided, ask the user and offer suggestions.
---

## What this produces

1. Each persona gives **5 specific points** (positive or negative), grounded in actual source files
2. The personas hold a **roundtable discussion** — they compare notes, challenge each other, and converge
3. A **joint top 5** of problems, omissions, or improvements, with concrete fixes

## Step 1: Establish personas

If the user specified personas, use those. If not, **stop and ask** before proceeding. Offer 4–6 suggestions tailored to the project type. Examples:

- Web app: staff engineer, UX designer, first-time user, accessibility auditor
- Language learning app: teacher in the subject, beginner student, advanced student, UX designer
- API or library: security engineer, consumer developer, technical writer, performance engineer
- CLI tool: power user, occasional user, DevOps engineer, open-source contributor

Keep it to **4 personas maximum**. More than 4 produces diminishing returns and a bloated discussion.

For each persona, decide:
- **Name and role** (e.g. "Amira, Staff Engineer")
- **Brief background** (2–3 sentences: their expertise, what they care about, their relationship to this kind of project)

Make them feel like real people with specific expertise, not generic role labels.

## Step 2: Confirm scope

Before exploring, confirm what's being reviewed if it's ambiguous. If the user said "review this project" and the repo is large or has multiple subsystems, ask: *which part — the whole thing, a specific feature, a particular set of files?* A scoped review is always better than a shallow scan of everything.

Only skip this if the user already gave a clear target (a specific file, route, or feature).

## Step 3: Explore the codebase

Before any persona speaks, read the project:

1. Read `AGENTS.md`, `CLAUDE.md`, `README.md` — whatever describes the project's purpose, architecture, and design intent
2. Identify and read the key source files relevant to what's being reviewed:
   - For a full-project review: main page components, key feature files, routing, state management
   - For a focused review: the specific files in scope

**This step is not optional.** A persona who hasn't read the code is making things up. Every claim in the review must be traceable to a specific file. If a claim can't be verified from source, it doesn't belong in the review.

## Step 4: Write each persona's review

For each persona in turn:

1. **Re-read** files specifically relevant to that persona's concerns before writing their section. A UX designer should focus on UI components and interaction patterns; a teacher should read explanation and exercise logic; an engineer should read data flow, state management, error handling.

2. Write **5 numbered points** — a mix of positive and negative. Each point must:
   - Reference a specific file, component, or code pattern (with path:line where useful)
   - Explain *why* it matters from this persona's perspective
   - Describe what the code **actually does**, not what you'd assume it does

3. **Verify before publishing.** Before finalising any negative point, re-read the relevant section. If the code already handles the problem you're about to describe, the point is wrong — drop it or correct it. Getting this wrong undermines the whole review.

Format:

```
## [Name] — [Role]

*[2–3 sentence background]*

### [Name]'s 5 Points

**1. [+/-] Short title**
Specific, grounded observation. File reference where relevant.

**2. ...** (and so on)
```

Use `[+]` for positive points and `[-]` for negative ones.

## Step 5: The roundtable discussion

Write a dialogue where the personas:

- **Compare notes** — where do they agree? Where does one persona's finding surprise another?
- **Challenge each other's claims** — if Persona A says "there's no X", and Persona B has read a different file that shows there is, say so. Correct the record in the discussion, not silently.
- **Debate severity** — not all problems are equal. Let the personas argue about which issues are most widespread, most urgent, or most fixable.
- **Converge** — by the end, they agree on 5 items to surface as the top priorities.

The discussion should feel like a real conversation: people changing their minds, acknowledging blind spots, building on each other's points. It is not a summary of all the negative points — it's a synthesis. Some points from individual reviews may not survive the roundtable. That's fine.

Format: named dialogue, 8-10 paragraphs, ending with clear convergence on the top 5.

## Step 6: Joint top 5

Present the agreed top 5 as a ranked list. For each:

- **What**: Name the problem or improvement clearly
- **Why it matters**: Who is affected and how
- **Fix**: A concrete suggestion — not "consider exploring" but a specific action

Ground each item in the actual code. If it came from a specific file or feature, say so.

## Honesty rules

These apply throughout and override any pressure to produce a "complete" review:

- **No invented problems.** If re-reading the code shows a claim is wrong, drop it. Don't quietly swap it for a different critique to fill the quota.
- **Don't pad to meet the quota.** If the scope is small and only supports 2–3 genuine points per persona, write 2–3. Reducing the count is honest; inflating it with weak observations is not.
- **Positive points matter.** A review that is all criticism is not a balanced review — it's a complaint list. Real strengths deserve acknowledgment.
- **Specificity over volume.** One well-grounded point is worth more than three vague ones.
- **The roundtable can correct the personas.** If Persona A made a claim in their section that Persona B's reading disproves, the roundtable is the place to surface and resolve that. The top 5 should reflect the corrected picture.
- **"The code already handles this" is a valid finding.** Not everything is a problem.
