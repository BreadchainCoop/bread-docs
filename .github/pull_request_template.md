<!--
Per GOVERNANCE.md: the Approver reviews and merges. The assistant (Helper) does not merge.
Keep this description clear and conventional — no jargon theater, no filler.
-->

## Summary

<!-- What does this PR change, and why? -->

## Linked issue

<!-- Required for requested changes. Independent, self-directed PRs may write "N/A — independent contribution". -->
Closes #

## What changed

<!-- The concrete changes: pages added / edited / moved, renames, redirects. -->
-

## URLs affected & redirects

<!-- URLs that changed, and the redirects added for old paths. "None" if not applicable. -->

## Content-collection / Keystatic impact

<!-- Does this touch content collections, frontmatter schema, or Keystatic config? Note it, or "None". -->

## Checks

- [ ] `npm run build` passes with no broken internal links
- [ ] Redirects added for any moved or renamed pages
- [ ] Sidebar / category changes reviewed for downstream impact
- [ ] Netlify deploy preview looks correct

---

## Reviewer checklist — Approver only

<!-- The assistant (Helper) may comment but does not approve or merge. See .github/GOVERNANCE.md → Review process. -->

- [ ] Content accurate; clear, conventional prose
- [ ] Keystatic / schema valid (build passes)
- [ ] Moved / renamed URLs have `301`s in `public/_redirects`; no broken internal links
- [ ] Branch is current with `main` and mergeable (not behind)
- [ ] Netlify deploy-preview green
- [ ] Linked issue present (or "independent")
