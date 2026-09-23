# Governance

How the bread-docs repository is maintained: who reviews and merges, and how decisions get made. Roles are described by **role**, not by person, so they transfer cleanly as the working group changes hands.

## Roles (MOCHA)

bread-docs is owned by the **Information Pathways** working group. Responsibilities follow the cooperative's MOCHA model:

- **Owner** — drives the docs forward and coordinates the work.
- **Approver** — signs off on and **merges** changes. This is the only role that merges to `main`.
- **Helper** — implements changes (opens issues and PRs). This includes the Breadrich assistant. **Helpers never merge.**
- **Consulted / Megaphone** — as assigned by the working group.

## Merge policy

- Every change to `main` goes through a **pull request** — no direct pushes.
- A PR requires **one approval from the Approver role**, and is **merged by the Approver**, never by its own author.
- **No self-merge.** A contributor — human or automated — never approves or merges their own PR. Automated contributors (the assistant) open PRs and hand them to the Approver.
- The branch must pass `npm run build` (zero errors) and have no unresolved conflicts before merge.

These rules are enforced by branch protection on `main`, so they hold regardless of who has write access.

## Review process

Every PR is reviewed against this checklist before the Approver merges. The **Approver** role reviews and approves; the assistant (**Helper**) may add review comments but never approves or merges. Reviewers check:

- **Content & prose** — accurate, and clear/conventional; no jargon theater or filler.
- **Keystatic / schema** — frontmatter matches `src/content.config.ts` (the build validates it).
- **Routing & redirects** — any moved or renamed URL has a `301` in `public/_redirects`, and there are no broken internal links.
- **Branch state** — the branch is **current with `main`** (not behind) and **mergeable** (no conflicts).
- **Build** — `npm run build` passes and the Netlify deploy-preview is green.
- **Linked issue** — present for requested changes (independent contributions may note "independent").

Enforcement lives in GitHub, not just here: `.github/CODEOWNERS` auto-requests the Approver, and branch protection requires that approval. The docs describe the standard; those settings make it stick.

## How decisions get made

- **Requests for a change** — you want something changed but aren't implementing it yourself — start as a **GitHub issue** using the issue template. The request is clarified and specified on the issue *before* any code; the issue is where the work is coordinated.
- **Independent, self-directed contributions** — you fully understand your own change — can go straight to a PR; you are not required to open an issue first.
- **Larger changes** (new sections, structural reorganization, dependency upgrades): open an issue and agree the approach on it before opening a PR.
- **Disagreements:** open an issue and tag the Owner/Approver. We prefer discussion over blocked PRs.

## Prose standard

Issues and PRs are written in clear, conventional prose — no jargon theater, no filler output. Say what changed, why, and what to check.
