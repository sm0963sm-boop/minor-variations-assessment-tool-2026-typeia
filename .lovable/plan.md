## Goal
The current Word export uses a `/report-template.docx` (docxtemplater) layout with fields like trade name, API manufacturer, assessors, etc. The user wants to go back to the older report you generated on 2026-06-09 (file attached), which uses a different structure built entirely in code with `docx-js`.

The old format (from commit `ad53ad8`) contains:
1. Centered title block: **Variation Assessment Report** — *Type IA / IAIN Variations — Final Decision* — Date
2. **1. Product information** — info table with `---` placeholders (Product name, Request number, API supplier, FPP manufacture, Strength, Pack size, Storage condition, Shelf life)
3. **2. Submitted variations** — count sentence + 3-col table (Code / Variation title / Type)
4. **Executive summary** table (Total, IAIN count, Approved, Rejected, Overall outcome)
5. **3. Reviewer opinion** — colored callout box (APPROVED / NOT ACCEPTED) + optional reviewer note + optional AI scientific analysis
6. **4. Final recommendation** — per-variation bold heading with "is approved" / "is rejected, the following conditions are not met:" and bulleted unmet conditions
7. SFDA header/footer banner images
8. Filename: `variation-report-<safeName>-YYYY-MM-DD.docx`

## Changes
Edit only the report-generation block inside **`src/routes/classify-multi.tsx`**:

- Remove the current `fetch("/report-template.docx")` + `PizZip` + `Docxtemplater` block (placeholder map, raw-XML scientificXml injection, current field render, `quality-assessment-report-...` filename).
- Replace it with the docx-js implementation from `ad53ad8` that builds `Document` + `Paragraph` + `Table` + `Header`/`Footer` directly (using `Document`, `Packer`, `Paragraph`, `TextRun`, `Table`, `TableRow`, `TableCell`, `ImageRun`, `Header as DocHeader`, `Footer as DocFooter`, `AlignmentType`, `BorderStyle`, `WidthType`, `ShadingType`, `LevelFormat`, plus the existing helpers `h1`, `para`, `bullet`, `spacer`, `infoTable`, `opinionCallout`).
- Keep the existing AI "Assessor opinion" (رأي المقيم) wiring — it's just rendered into the "Scientific analysis" subsection like before.
- Keep the SFDA header/footer assets (`sfdaHeader`, `sfdaFooter`) already imported.
- Restore the old filename pattern `variation-report-${safeName}-${date}.docx`.

No other files are touched. The `public/report-template.docx` file is no longer referenced and can be left in place (harmless) or deleted later.

## Out of scope
- No changes to the multi-step UI, classification logic, AI gateway, or other routes.
- No change to the AI "رأي المقيم" feature (credits issue is unrelated).
