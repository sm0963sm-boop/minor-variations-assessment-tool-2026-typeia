## Goal
Update the Word report exported from Step 4:
1. **Remove** the **Executive summary** table.
2. **Add** a new **Submitted data** section that mirrors the "THE SUBMITTED DATA" card on the final step (per-variation block: Type badge area + code + title + status pill, followed by a checked list of the documents marked Submitted).

## Report structure after the change
1. Product information
2. Submitted variations
3. **Submitted data** ← new (only rendered if at least one variation has any submitted docs)
4. Reviewer opinion (was 3)
5. Final recommendation (was 4)

## Submitted data — content rules (match the UI exactly)
- Use the same filter already in the UI (`src/routes/classify-multi.tsx` lines 809–821):
  - Skip Type IA / IAIN variations whose status is REJECTED.
  - Skip variations with zero `submitted` docs.
- If the filtered list is empty, skip the whole section (no empty "3.").
- Per variation, render in the Word doc:
  - A bold heading paragraph: `Type <IA|IAIN|IB>  ·  <code>  —  <title>` in brand color, with a colored status label at the end (`APPROVED` = success green, `SUSPENDED` = warning amber, `REJECTED` = danger red — reuse existing `SUCCESS_BORDER` / `B8860B` / `DANGER_BORDER` constants).
  - A bulleted list of the submitted document names, using the existing `bullet()` helper.
  - `spacer()` between entries.
- Section intro paragraph (same wording as UI): *"Documents submitted for each variation. Type IB shows all submitted documents; Type IA / IAIN shows submitted documents when the decision is Approved or Suspended."*

## Executive summary — removal
Delete lines 674–710 in `src/routes/classify-multi.tsx` (the `outcomeLabel`, `summaryRows`, `summaryTable`, and the two `children.push` calls for the heading and table, plus the trailing `spacer()`). Keep the `approvedCount` / `suspendedCount` / `rejectedCount` / `typeCounts` derivations earlier in the file — they're still used by the "Final recommendation" summary line ("Summary: X of N variation(s) approved (...)").

## Technical changes (single file: `src/routes/classify-multi.tsx`)
- Remove the Executive summary block (lines 674–710).
- After the section 2 `spacer()`, build a `submittedByVar` array reusing the same logic as the UI (lines 809–821) — compute it once at the top of the report builder so both the UI block and the Word block share it (or duplicate inline; either way the filter must stay identical).
- If `submittedByVar.length > 0`:
  - `children.push(h1("3. Submitted data"))`
  - `children.push(para("Documents submitted for each variation. Type IB shows all submitted documents; Type IA / IAIN shows submitted documents when the decision is Approved or Suspended.", { italic: true, color: MUTED }))`
  - For each entry, push the heading paragraph (code + title + colored status label) and one `bullet(d)` per submitted doc, then `spacer()`.
- Renumber the two remaining headings to `"4. Reviewer opinion"` and `"5. Final recommendation"`.

## Out of scope
- No UI changes to Step 4.
- No changes to classification logic, AI gateway, filename, header/footer, or other routes.