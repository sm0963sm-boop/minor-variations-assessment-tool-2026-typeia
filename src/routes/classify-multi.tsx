import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { TypeBadge } from "@/components/TypeBadge";
import { CATEGORIES, TYPE_INFO, VARIATIONS, type Variation } from "@/lib/variations-data";
import { Copy, Check, FileDown } from "lucide-react";
import { Document, Packer, Paragraph, HeadingLevel, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle, AlignmentType, ShadingType, PageNumber, Header as DocHeader, Footer as DocFooter, LevelFormat } from "docx";
import fileSaver from "file-saver";
const { saveAs } = fileSaver;

export const Route = createFileRoute("/classify-multi")({
  head: () => ({
    meta: [
      { title: "Type IA Variation Assessment Tool" },
      { name: "description", content: "Classify multiple Type IA / IAIN variations at once and get a single combined final decision." },
    ],
  }),
  component: ClassifyMulti,
});

type CondStatus = "met" | "unmet" | "na";
type ChecksMap = Record<string, CondStatus[]>; // code -> conditions status

type DosageForm =
  | "solid-oral" | "liquid-oral" | "sterile-injectable" | "ophthalmic"
  | "topical" | "inhalation" | "suppository" | "other";

const DOSAGE_FORMS: { value: DosageForm; label: string; sterileDefault: boolean }[] = [
  { value: "solid-oral", label: "Solid Oral (Tablets / Capsules)", sterileDefault: false },
  { value: "liquid-oral", label: "Liquid Oral (Syrup / Solution)", sterileDefault: false },
  { value: "sterile-injectable", label: "Sterile Injectable", sterileDefault: true },
  { value: "ophthalmic", label: "Ophthalmic / Otic", sterileDefault: true },
  { value: "topical", label: "Topical (Cream / Ointment / Gel)", sterileDefault: false },
  { value: "inhalation", label: "Inhalation / Nasal Spray", sterileDefault: false },
  { value: "suppository", label: "Suppository / Pessary", sterileDefault: false },
  { value: "other", label: "Other", sterileDefault: false },
];

type Annotation = { kind: "applies" | "not-applies" | "review"; reason: string };

function annotateCondition(text: string, form: DosageForm | null, sterile: boolean | null): Annotation {
  const t = text.toLowerCase();
  if (/\bsteril/.test(t)) {
    if (sterile === true) return { kind: "applies", reason: "Product is sterile — this condition is in scope." };
    if (sterile === false) return { kind: "not-applies", reason: "Product is non-sterile — sterility wording likely does not apply." };
  }
  if (/inhalation|inhaler|nebuli/.test(t)) {
    if (form === "inhalation") return { kind: "applies", reason: "Condition targets inhalation products." };
    if (form) return { kind: "not-applies", reason: "Condition targets inhalation products, not the selected dosage form." };
  }
  if (/ophthalmic|ocular|eye drop/.test(t)) {
    if (form === "ophthalmic") return { kind: "applies", reason: "Condition targets ophthalmic products." };
    if (form) return { kind: "not-applies", reason: "Condition targets ophthalmic products, not the selected dosage form." };
  }
  if (/modified[- ]release|prolonged[- ]release|extended[- ]release|controlled[- ]release/.test(t)) {
    return { kind: "review", reason: "Mentions release profile — confirm manually against the product." };
  }
  if (/\b(tablet|capsule|solid dosage)\b/.test(t)) {
    if (form === "solid-oral") return { kind: "applies", reason: "Condition targets solid oral forms." };
    if (form) return { kind: "not-applies", reason: "Condition targets solid oral forms, not the selected dosage form." };
  }
  return { kind: "review", reason: "No automatic product-context match — reviewer judgment required." };
}

function ClassifyMulti() {
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const [dosageForm, setDosageForm] = useState<DosageForm | null>(null);
  const [sterile, setSterile] = useState<boolean | null>(null);
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);
  const [checks, setChecks] = useState<ChecksMap>({});
  const [opinion, setOpinion] = useState("");
  const [openCat, setOpenCat] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [productInfo, setProductInfo] = useState({
    productName: "",
    requestNumber: "",
    apiSupplier: "",
    fppManufacture: "",
    strength: "",
    packSize: "",
    storageCondition: "",
    shelfLife: "",
  });

  const handleCopy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      // ignore
    }
  };

  const selected = useMemo(
    () => VARIATIONS.filter(v => selectedCodes.includes(v.code)),
    [selectedCodes]
  );

  const toggleSelect = (v: Variation) => {
    setSelectedCodes(prev => {
      const exists = prev.includes(v.code);
      if (exists) {
        const next = prev.filter(c => c !== v.code);
        const { [v.code]: _omit, ...rest } = checks;
        setChecks(rest);
        return next;
      } else {
        setChecks({ ...checks, [v.code]: new Array(v.conditions.length).fill("unmet") });
        return [...prev, v.code];
      }
    });
  };

  const setStatus = (code: string, idx: number, val: CondStatus) => {
    const arr = [...(checks[code] || [])];
    arr[idx] = val;
    setChecks({ ...checks, [code]: arr });
  };

  const reset = () => {
    setStep(0); setDosageForm(null); setSterile(null); setSelectedCodes([]); setChecks({}); setOpinion("");
  };

  // Build per-variation status
  const results = selected.map(v => {
    const arr = checks[v.code] || [];
    const unmet = v.conditions.filter((_, i) => (arr[i] || "unmet") === "unmet");
    return { v, unmet, status: arr, accepted: unmet.length === 0 };
  });

  const allAccepted = results.length > 0 && results.every(r => r.accepted);
  const anyRejected = results.some(r => !r.accepted);

  return (
    <div className="min-h-screen">
      <Header />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
        <div className="rounded-xl border border-warning/30 bg-warning/10 p-4 mb-8">
          <p className="text-sm text-foreground leading-relaxed">
            <span className="font-bold text-warning">Note:</span> This tool assists the reviewer in evaluating Type IA / IAIN variation requests. It does not replace the full independent assessment required by the reviewer.
          </p>
        </div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl font-extrabold text-foreground">Type IA Variation Assessment Tool</h1>
          <button onClick={reset} className="text-sm text-muted-foreground hover:text-foreground">↻ Restart</button>
        </div>
        <div className="flex gap-2 mb-8">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-primary" : "bg-border"}`} />
          ))}
        </div>

        {step === 0 && (
          <Panel title="1. Product context" subtitle="Tell the system about the product. All conditions will still be shown later; the system will only flag which ones likely apply.">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">Pharmaceutical dosage form</label>
                <div className="grid gap-2 sm:grid-cols-2">
                  {DOSAGE_FORMS.map(df => (
                    <button key={df.value} type="button"
                      onClick={() => { setDosageForm(df.value); if (sterile === null) setSterile(df.sterileDefault); }}
                      className={`text-left rounded-xl border p-3 transition ${dosageForm === df.value ? "border-primary bg-primary/5 shadow-soft" : "border-border bg-card hover:border-primary/50"}`}>
                      <div className="text-sm font-bold text-foreground">{df.label}</div>
                      {df.sterileDefault && <div className="text-xs text-muted-foreground mt-0.5">Typically sterile</div>}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">Is the product sterile?</label>
                <div className="flex gap-2">
                  {[{ val: true, label: "Yes — Sterile" }, { val: false, label: "No — Non-sterile" }].map(o => (
                    <button key={String(o.val)} type="button" onClick={() => setSterile(o.val)}
                      className={`flex-1 rounded-xl border px-4 py-3 text-sm font-bold transition ${sterile === o.val ? "border-primary bg-primary text-primary-foreground shadow-soft" : "border-border bg-card text-foreground hover:border-primary/50"}`}>
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={() => setStep(1)} disabled={!dosageForm || sterile === null}
                className="w-full rounded-xl bg-primary text-primary-foreground py-3 font-bold shadow-soft hover:bg-primary/90 transition disabled:opacity-40 disabled:cursor-not-allowed">
                Continue →
              </button>
            </div>
          </Panel>
        )}

        {step === 1 && (
          <Panel title="2. Select one or more variations" subtitle="Pick a variation from each category dropdown, then add it to the selection.">
            <div className="space-y-6">
              {CATEGORIES.map(cat => {
                const items = VARIATIONS.filter(v => v.category === cat);
                if (items.length === 0) return null;
                return (
                  <div key={cat}>
                    <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">{cat}</div>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setOpenCat(openCat === cat ? null : cat)}
                        className="w-full flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 text-left hover:border-primary/50 transition"
                      >
                        <span className="text-sm text-muted-foreground">Choose a variation…</span>
                        <span className="text-muted-foreground">{openCat === cat ? "▲" : "▼"}</span>
                      </button>
                      {openCat === cat && (
                        <div className="absolute z-10 mt-1 w-full max-h-64 overflow-auto rounded-xl border border-border bg-card shadow-elegant">
                          {items.map(v => {
                            const isChecked = selectedCodes.includes(v.code);
                            return (
                              <button
                                key={v.code}
                                type="button"
                                onClick={() => { toggleSelect(v); setOpenCat(null); }}
                                className={`w-full flex items-start gap-3 px-4 py-3 text-left transition border-b border-border/50 last:border-b-0 ${isChecked ? "bg-primary/5" : "hover:bg-muted/40"}`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  readOnly
                                  className="mt-1 size-4 accent-primary pointer-events-none"
                                />
                                <TypeBadge type={v.type} size="sm" />
                                <div className="flex-1 min-w-0">
                                  <div className="text-xs text-muted-foreground font-mono">{v.code}</div>
                                  <div className="font-bold text-foreground text-sm leading-snug">{v.title}</div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {selectedCodes.length > 0 && (
              <div className="mt-6 rounded-xl border border-border bg-card p-4">
                <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Selected variations ({selectedCodes.length})</div>
                <div className="space-y-2">
                  {selected.map(v => (
                    <div key={v.code} className="flex items-center gap-3 rounded-lg bg-primary/5 border border-primary/20 px-3 py-2">
                      <TypeBadge type={v.type} size="sm" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-muted-foreground font-mono">{v.code}</div>
                        <div className="font-bold text-foreground text-sm leading-snug">{v.title}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleSelect(v)}
                        className="text-muted-foreground hover:text-destructive text-sm font-bold px-2"
                        title="Remove"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 flex items-center justify-between gap-3">
              <div className="text-sm text-muted-foreground">{selectedCodes.length} selected</div>
              <button
                disabled={selectedCodes.length === 0}
                onClick={() => setStep(2)}
                className="rounded-xl bg-primary text-primary-foreground px-5 py-2.5 font-bold disabled:opacity-50 hover:bg-primary/90 transition"
              >
                Continue →
              </button>
            </div>
          </Panel>
        )}

        {step === 2 && (
          <Panel title="3. Verify conditions for each variation" subtitle="Every SFDA condition is shown. The system flags which ones likely apply based on your product context.">
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 mb-4 text-xs text-foreground">
              <span className="font-bold">Product context:</span>{" "}
              {DOSAGE_FORMS.find(d => d.value === dosageForm)?.label} · {sterile ? "Sterile" : "Non-sterile"}
            </div>
            <div className="space-y-5">
              {selected.map(v => (
                <div key={v.code} className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <TypeBadge type={v.type} size="sm" />
                    <div className="min-w-0">
                      <div className="text-xs text-muted-foreground font-mono">{v.code}</div>
                      <div className="font-bold text-foreground text-sm">{v.title}</div>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {v.conditions.map((c, i) => {
                      const s = (checks[v.code] || [])[i] || "unmet";
                      const ann = annotateCondition(c, dosageForm, sterile);
                      const annCfg = ann.kind === "applies"
                        ? { icon: "✓", label: "Likely applies", cls: "bg-warning/15 text-warning border-warning/40" }
                        : ann.kind === "not-applies"
                          ? { icon: "⊘", label: "Likely doesn't apply", cls: "bg-muted text-muted-foreground border-border" }
                          : { icon: "?", label: "Reviewer judgment", cls: "bg-primary/10 text-primary border-primary/30" };
                      const opts: { val: CondStatus; label: string; cls: string }[] = [
                        { val: "met", label: "Met", cls: "bg-success/15 text-success border-success/40" },
                        { val: "unmet", label: "Not met", cls: "bg-destructive/10 text-destructive border-destructive/40" },
                        { val: "na", label: "N/A", cls: "bg-muted text-muted-foreground border-border" },
                      ];
                      return (
                        <li key={i} className={`p-2.5 rounded-lg border ${s === "na" ? "bg-muted/20 border-border opacity-70" : "bg-muted/40 border-border"}`}>
                          <span className="text-sm text-foreground block">
                            <span className="font-bold text-primary me-2">{i + 1}.</span>{c}
                          </span>
                          <div className={`mt-2 inline-flex items-center gap-1.5 text-[11px] font-bold px-2 py-1 rounded-md border ${annCfg.cls}`}>
                            <span>{annCfg.icon}</span><span>{annCfg.label}</span>
                          </div>
                          <div className="mt-1 text-[11px] text-muted-foreground italic">{ann.reason}</div>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {opts.map(o => (
                              <button
                                key={o.val}
                                type="button"
                                onClick={() => setStatus(v.code, i, o.val)}
                                className={`text-xs font-bold px-2.5 py-1 rounded-md border transition ${s === o.val ? o.cls : "bg-background text-muted-foreground border-border hover:border-foreground/30"}`}
                              >
                                {o.label}
                              </button>
                            ))}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-xl border border-border bg-card p-4">
              <label className="block text-sm font-extrabold text-foreground mb-1">Reviewer's opinion <span className="text-muted-foreground font-normal text-xs">(optional)</span></label>
              <textarea
                value={opinion}
                onChange={(e) => setOpinion(e.target.value)}
                rows={4}
                placeholder="Enter your reviewer's opinion (optional). This will be printed before the final recommendation."
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring resize-y"
              />
            </div>

            <div className="mt-5 flex items-center justify-between gap-3">
              <button onClick={() => setStep(1)} className="text-sm text-muted-foreground hover:text-foreground">← Back</button>
              <button onClick={() => setStep(3)}
                className="rounded-xl bg-primary text-primary-foreground px-5 py-2.5 font-bold hover:bg-primary/90 transition">
                Generate combined decision →
              </button>
            </div>
          </Panel>
        )}

        {step === 3 && (() => {
          const total = results.length;
          const approvedCount = results.filter(r => r.accepted).length;
          const rejectedCount = total - approvedCount;
          const typeCounts = results.reduce<Record<string, number>>((acc, r) => {
            acc[r.v.type] = (acc[r.v.type] || 0) + 1;
            return acc;
          }, {});
          const typesSummary = Object.entries(typeCounts)
            .map(([t, n]) => `${n} × ${t}`)
            .join(", ");
          const overall = allAccepted
            ? "All selected variations satisfy their required conditions and qualify for the requested classification."
            : approvedCount === 0
              ? "None of the selected variations satisfy all required conditions; each one fails on at least one item."
              : "The selected variations show a mixed outcome: some satisfy all conditions while others fail on one or more required items.";

          const reviewerLines: string[] = [];
          if (allAccepted) {
            reviewerLines.push(
              "The proposed change and supporting documentation have been reviewed and found to comply with the applicable requirements and conditions for a Type IA variation. The provided data are considered adequate to support the proposed change and demonstrate that it does not adversely affect the quality of the product. All relevant regulatory requirements have been satisfactorily addressed. Therefore, no regulatory concerns were identified, and approval of the proposed change is recommended."
            );
          } else {
            reviewerLines.push(
              "The submitted variation(s) have been incorrectly classified and do not meet the applicable criteria for the requested variation category. Therefore, the variation(s) cannot be accepted as submitted."
            );
          }
          if (opinion.trim()) {
            reviewerLines.push("Reviewer's note:");
            reviewerLines.push(opinion.trim());
          }
          const reviewerText = reviewerLines.join("\n");

          const finalText = results.map(({ v, unmet, accepted }) => {
            const lines: string[] = [];
            lines.push(`${v.code} ${v.title}`);
            if (accepted) {
              lines.push("is approved");
            } else {
              lines.push(`is rejected, the following ${unmet.length === 1 ? "condition is" : "conditions are"} not met:`);
              unmet.forEach(c => lines.push(`• ${c}`));
            }
            return lines.join("\n");
          }).join("\n\n");

          const downloadWord = async () => {
            const BRAND = "1F3A68"; // deep navy
            const ACCENT = "2E75B6";
            const MUTED = "595959";
            const LIGHT_BG = "F2F6FB";
            const SUCCESS_BG = "E8F3EC";
            const SUCCESS_BORDER = "3F8A56";
            const DANGER_BG = "FBEAEA";
            const DANGER_BORDER = "B33A3A";

            const today = new Date().toLocaleDateString("en-GB", {
              day: "2-digit", month: "long", year: "numeric",
            });

            const h1 = (text: string) =>
              new Paragraph({
                heading: HeadingLevel.HEADING_1,
                spacing: { before: 280, after: 160 },
                border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: ACCENT, space: 4 } },
                children: [new TextRun({ text, bold: true, size: 28, color: BRAND, font: "Calibri" })],
              });
            const para = (text: string, opts: { bold?: boolean; italic?: boolean; color?: string; align?: typeof AlignmentType[keyof typeof AlignmentType] } = {}) =>
              new Paragraph({
                alignment: opts.align,
                spacing: { after: 120, line: 300 },
                children: [new TextRun({ text, bold: opts.bold, italics: opts.italic, color: opts.color, font: "Calibri", size: 22 })],
              });
            const bullet = (text: string) =>
              new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                spacing: { after: 80, line: 280 },
                children: [new TextRun({ text, font: "Calibri", size: 22 })],
              });
            const spacer = () => new Paragraph({ children: [new TextRun("")], spacing: { after: 80 } });

            const infoRows: [string, string][] = [
              ["Product name", productInfo.productName],
              ["Request number", productInfo.requestNumber],
              ["API supplier", productInfo.apiSupplier],
              ["FPP manufacture", productInfo.fppManufacture],
              ["Strength", productInfo.strength],
              ["Pack size", productInfo.packSize],
              ["Storage condition", productInfo.storageCondition],
              ["Shelf life", productInfo.shelfLife],
            ];
            const cellBorder = { style: BorderStyle.SINGLE, size: 4, color: "BFBFBF" };
            const borders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };
            const infoTable = new Table({
              width: { size: 9360, type: WidthType.DXA },
              columnWidths: [3120, 6240],
              rows: infoRows.map(([label, value]) => new TableRow({
                children: [
                  new TableCell({
                    borders,
                    width: { size: 3120, type: WidthType.DXA },
                    shading: { fill: LIGHT_BG, type: ShadingType.CLEAR, color: "auto" },
                    margins: { top: 120, bottom: 120, left: 160, right: 160 },
                    children: [new Paragraph({ children: [new TextRun({ text: label, bold: true, color: BRAND, font: "Calibri", size: 22 })] })],
                  }),
                  new TableCell({
                    borders,
                    width: { size: 6240, type: WidthType.DXA },
                    margins: { top: 120, bottom: 120, left: 160, right: 160 },
                    children: [new Paragraph({ children: [new TextRun({ text: value || "—", font: "Calibri", size: 22 })] })],
                  }),
                ],
              })),
            });

            // Opinion callout box (single-cell shaded table)
            const calloutFill = allAccepted ? SUCCESS_BG : DANGER_BG;
            const calloutBorderColor = allAccepted ? SUCCESS_BORDER : DANGER_BORDER;
            const calloutBorder = { style: BorderStyle.SINGLE, size: 8, color: calloutBorderColor };
            const opinionText = allAccepted
              ? "The proposed change and supporting documentation have been reviewed and found to comply with the applicable requirements and conditions for a Type IA variation. The provided data are considered adequate to support the proposed change and demonstrate that it does not adversely affect the quality of the product. All relevant regulatory requirements have been satisfactorily addressed. Therefore, no regulatory concerns were identified, and approval of the proposed change is recommended."
              : "The submitted variation(s) have been incorrectly classified and do not meet the applicable criteria for the requested variation category. Therefore, the variation(s) cannot be accepted as submitted.";
            const opinionCallout = new Table({
              width: { size: 9360, type: WidthType.DXA },
              columnWidths: [9360],
              rows: [new TableRow({
                children: [new TableCell({
                  borders: { top: calloutBorder, bottom: calloutBorder, left: calloutBorder, right: calloutBorder },
                  width: { size: 9360, type: WidthType.DXA },
                  shading: { fill: calloutFill, type: ShadingType.CLEAR, color: "auto" },
                  margins: { top: 200, bottom: 200, left: 240, right: 240 },
                  children: [
                    new Paragraph({
                      spacing: { after: 80 },
                      children: [new TextRun({ text: allAccepted ? "APPROVED" : "NOT ACCEPTED", bold: true, color: calloutBorderColor, font: "Calibri", size: 22 })],
                    }),
                    new Paragraph({
                      spacing: { line: 300 },
                      children: [new TextRun({ text: opinionText, font: "Calibri", size: 22 })],
                    }),
                  ],
                })],
              })],
            });

            const children: (Paragraph | Table)[] = [];
            // Title block
            children.push(new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { after: 80 },
              children: [new TextRun({ text: "Variation Assessment Report", bold: true, size: 40, color: BRAND, font: "Calibri" })],
            }));
            children.push(new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { after: 80 },
              children: [new TextRun({ text: "Type IA / IAIN Variations — Final Decision", italics: true, size: 24, color: MUTED, font: "Calibri" })],
            }));
            children.push(new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { after: 240 },
              border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: ACCENT, space: 6 } },
              children: [new TextRun({ text: `Date: ${today}`, size: 20, color: MUTED, font: "Calibri" })],
            }));

            children.push(h1("1. Product information"));
            children.push(infoTable);
            children.push(spacer());

            // Submitted variations table
            const varBorder = { style: BorderStyle.SINGLE, size: 4, color: "BFBFBF" };
            const varBorders = { top: varBorder, bottom: varBorder, left: varBorder, right: varBorder };
            const variationsTable = new Table({
              width: { size: 9360, type: WidthType.DXA },
              columnWidths: [1600, 5460, 2300],
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      borders: varBorders,
                      width: { size: 1600, type: WidthType.DXA },
                      shading: { fill: LIGHT_BG, type: ShadingType.CLEAR, color: "auto" },
                      margins: { top: 120, bottom: 120, left: 160, right: 160 },
                      children: [new Paragraph({ children: [new TextRun({ text: "Code", bold: true, color: BRAND, font: "Calibri", size: 22 })] })],
                    }),
                    new TableCell({
                      borders: varBorders,
                      width: { size: 5460, type: WidthType.DXA },
                      shading: { fill: LIGHT_BG, type: ShadingType.CLEAR, color: "auto" },
                      margins: { top: 120, bottom: 120, left: 160, right: 160 },
                      children: [new Paragraph({ children: [new TextRun({ text: "Variation title", bold: true, color: BRAND, font: "Calibri", size: 22 })] })],
                    }),
                    new TableCell({
                      borders: varBorders,
                      width: { size: 2300, type: WidthType.DXA },
                      shading: { fill: LIGHT_BG, type: ShadingType.CLEAR, color: "auto" },
                      margins: { top: 120, bottom: 120, left: 160, right: 160 },
                      children: [new Paragraph({ children: [new TextRun({ text: "Type", bold: true, color: BRAND, font: "Calibri", size: 22 })] })],
                    }),
                  ],
                }),
                ...selected.map(v => new TableRow({
                  children: [
                    new TableCell({
                      borders: varBorders,
                      width: { size: 1600, type: WidthType.DXA },
                      margins: { top: 120, bottom: 120, left: 160, right: 160 },
                      children: [new Paragraph({ children: [new TextRun({ text: v.code, font: "Calibri", size: 22 })] })],
                    }),
                    new TableCell({
                      borders: varBorders,
                      width: { size: 5460, type: WidthType.DXA },
                      margins: { top: 120, bottom: 120, left: 160, right: 160 },
                      children: [new Paragraph({ children: [new TextRun({ text: v.title, font: "Calibri", size: 22 })] })],
                    }),
                    new TableCell({
                      borders: varBorders,
                      width: { size: 2300, type: WidthType.DXA },
                      margins: { top: 120, bottom: 120, left: 160, right: 160 },
                      children: [new Paragraph({ children: [new TextRun({ text: v.type, font: "Calibri", size: 22, color: v.type === "IA" ? SUCCESS_BORDER : ACCENT })] })],
                    }),
                  ],
                })),
              ],
            });

            children.push(h1("2. Submitted variations"));
            children.push(para(`The following ${selected.length} variation(s) have been submitted for assessment:`));
            children.push(variationsTable);
            children.push(spacer());

            // Executive summary
            const summaryRows: [string, string][] = [
              ["Total variations submitted", String(selected.length)],
              ...(Object.entries(typeCounts).map(([t, n]) => [`Type ${t} variations`, String(n)]) as [string, string][]),
              ["Approved", String(approvedCount)],
              ["Rejected", String(rejectedCount)],
              ["Overall outcome", allAccepted ? "All approved" : rejectedCount === selected.length ? "All rejected" : "Partially approved"],
            ];
            const summaryTable = new Table({
              width: { size: 9360, type: WidthType.DXA },
              columnWidths: [4680, 4680],
              rows: summaryRows.map(([label, value]) => new TableRow({
                children: [
                  new TableCell({
                    borders: varBorders,
                    width: { size: 4680, type: WidthType.DXA },
                    shading: { fill: LIGHT_BG, type: ShadingType.CLEAR, color: "auto" },
                    margins: { top: 100, bottom: 100, left: 160, right: 160 },
                    children: [new Paragraph({ children: [new TextRun({ text: label, bold: true, color: BRAND, font: "Calibri", size: 22 })] })],
                  }),
                  new TableCell({
                    borders: varBorders,
                    width: { size: 4680, type: WidthType.DXA },
                    margins: { top: 100, bottom: 100, left: 160, right: 160 },
                    children: [new Paragraph({ children: [new TextRun({ text: value, font: "Calibri", size: 22, color: value === "All approved" ? SUCCESS_BORDER : value === "All rejected" ? DANGER_BORDER : BRAND })] })],
                  }),
                ],
              })),
            });
            children.push(para("Executive summary", { bold: true, color: BRAND }));
            children.push(summaryTable);
            children.push(spacer());

            children.push(h1("3. Reviewer opinion"));
            children.push(opinionCallout);
            if (opinion.trim()) {
              children.push(spacer());
              children.push(para("Reviewer's note", { bold: true, color: BRAND }));
              opinion.trim().split("\n").forEach(l => children.push(para(l)));
            }
            children.push(spacer());

            children.push(h1("4. Final recommendation"));
            children.push(para(`Summary: ${approvedCount} of ${results.length} variation(s) approved (${typesSummary}).`, { italic: true, color: MUTED }));
            children.push(spacer());
            results.forEach(({ v, unmet, accepted }, idx) => {
              const statusColor = accepted ? SUCCESS_BORDER : DANGER_BORDER;
              const statusLabel = accepted ? "APPROVED" : "REJECTED";
              children.push(new Paragraph({
                spacing: { before: 120, after: 60 },
                children: [
                  new TextRun({ text: `${idx + 1}. ${v.code} `, bold: true, color: BRAND, font: "Calibri", size: 24 }),
                  new TextRun({ text: v.title, bold: true, font: "Calibri", size: 24 }),
                ],
              }));
              children.push(new Paragraph({
                spacing: { after: 80 },
                children: [
                  new TextRun({ text: statusLabel, bold: true, color: statusColor, font: "Calibri", size: 20 }),
                  new TextRun({ text: accepted
                    ? "  —  All required conditions are met."
                    : `  —  The following ${unmet.length === 1 ? "condition is" : "conditions are"} not met:`, font: "Calibri", size: 22 }),
                ],
              }));
              if (!accepted) unmet.forEach(c => children.push(bullet(c)));
            });

            const doc = new Document({
              creator: "Type IA Variation Assessment Tool",
              title: "Variation Assessment Report",
              styles: {
                default: { document: { run: { font: "Calibri", size: 22 } } },
              },
              numbering: {
                config: [{
                  reference: "bullets",
                  levels: [{
                    level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
                    style: { paragraph: { indent: { left: 720, hanging: 360 } } },
                  }],
                }],
              },
              sections: [{
                properties: {
                  page: {
                    size: { width: 12240, height: 15840 },
                    margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
                  },
                },
                headers: {
                  default: new DocHeader({
                    children: [new Paragraph({
                      alignment: AlignmentType.RIGHT,
                      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: ACCENT, space: 4 } },
                      children: [new TextRun({ text: "Variation Assessment Report", italics: true, color: MUTED, font: "Calibri", size: 18 })],
                    })],
                  }),
                },
                footers: {
                  default: new DocFooter({
                    children: [new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new TextRun({ text: "Page ", color: MUTED, font: "Calibri", size: 18 }),
                        new TextRun({ children: [PageNumber.CURRENT], color: MUTED, font: "Calibri", size: 18 }),
                        new TextRun({ text: " of ", color: MUTED, font: "Calibri", size: 18 }),
                        new TextRun({ children: [PageNumber.TOTAL_PAGES], color: MUTED, font: "Calibri", size: 18 }),
                      ],
                    })],
                  }),
                },
                children,
              }],
            });
            const blob = await Packer.toBlob(doc);
            const safeName = (productInfo.productName || "report").replace(/[^a-z0-9-_]+/gi, "_").slice(0, 40);
            saveAs(blob, `variation-report-${safeName}-${new Date().toISOString().slice(0, 10)}.docx`);
          };

          return (
            <div className={`rounded-3xl border p-6 sm:p-8 shadow-elegant ${allAccepted ? "border-success/30 bg-success/5" : "border-destructive/30 bg-destructive/5"}`}>
              <div className="rounded-2xl border-2 border-primary/40 bg-primary/10 p-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm font-bold text-primary">Reviewer opinion</div>
                  <button
                    type="button"
                    onClick={() => handleCopy(reviewerText, "reviewer")}
                    className="inline-flex items-center gap-1 rounded-lg border border-primary/30 bg-primary/10 px-2 py-1 text-xs font-bold text-primary hover:bg-primary/20 transition"
                  >
                    {copiedKey === "reviewer" ? <Check size={14} /> : <Copy size={14} />}
                    {copiedKey === "reviewer" ? "Copied!" : "Copy"}
                  </button>
                </div>
                <div className="space-y-3 text-sm sm:text-base text-foreground leading-relaxed">
                  {allAccepted ? (
                    <p className="text-foreground/90 whitespace-pre-wrap">
                      The proposed change and supporting documentation have been reviewed and found to comply with the applicable requirements and conditions for a Type IA variation. The provided data are considered adequate to support the proposed change and demonstrate that it does not adversely affect the quality of the product. All relevant regulatory requirements have been satisfactorily addressed. Therefore, no regulatory concerns were identified, and approval of the proposed change is recommended.
                    </p>
                  ) : (
                    <p className="text-foreground/90 whitespace-pre-wrap">
                      The submitted variation(s) have been incorrectly classified and do not meet the applicable criteria for the requested variation category. Therefore, the variation(s) cannot be accepted as submitted.
                    </p>
                  )}
                  {opinion.trim() && (
                    <div className="pt-2 border-t border-primary/20">
                      <div className="font-bold mb-1">Reviewer's note:</div>
                      <p className="text-foreground/90 whitespace-pre-wrap">{opinion.trim()}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 rounded-2xl border-2 border-primary/40 bg-primary/10 p-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm font-bold text-primary">Final recommendation</div>
                  <button
                    type="button"
                    onClick={() => handleCopy(finalText, "final")}
                    className="inline-flex items-center gap-1 rounded-lg border border-primary/30 bg-primary/10 px-2 py-1 text-xs font-bold text-primary hover:bg-primary/20 transition"
                  >
                    {copiedKey === "final" ? <Check size={14} /> : <Copy size={14} />}
                    {copiedKey === "final" ? "Copied!" : "Copy"}
                  </button>
                </div>
                <ul className="space-y-3">
                  {results.map(({ v, unmet, accepted }) => (
                    <li key={v.code} className="text-sm sm:text-base text-foreground leading-relaxed">
                      <span className="font-mono font-bold text-xs me-2 px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{v.code}</span>
                      <span className="font-semibold">{v.title}</span>
                      {accepted ? (
                        <span className="ms-1 font-bold text-success">is approved</span>
                      ) : (
                        <span className="ms-1 font-bold text-destructive">
                          is rejected, the following {unmet.length === 1 ? "condition is" : "conditions are"} not met:
                        </span>
                      )}
                      {!accepted && unmet.length > 0 && (
                        <ul className="mt-2 space-y-1 ps-5">
                          {unmet.map((c, i) => (
                            <li key={i} className="text-sm text-foreground/80 leading-relaxed list-disc">{c}</li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={downloadWord}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-5 py-2.5 font-bold hover:bg-primary/90 transition"
                >
                  <FileDown size={16} /> Download as Word
                </button>
                <button onClick={reset} className="rounded-xl border border-border bg-card px-5 py-2.5 font-medium text-foreground hover:bg-muted transition">
                  Start over
                </button>
                <Link to="/catalog" className="rounded-xl border border-border bg-card px-5 py-2.5 font-medium text-foreground hover:bg-muted transition">
                  Browse the full catalog
                </Link>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}

function Panel({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-soft">
      <h2 className="font-display text-xl sm:text-2xl font-extrabold text-foreground">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-muted-foreground mb-5">{subtitle}</p>}
      {children}
    </div>
  );
}
