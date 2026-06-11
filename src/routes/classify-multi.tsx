import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import ReactMarkdown from "react-markdown";
import { Header } from "@/components/Header";
import { TypeBadge } from "@/components/TypeBadge";
import { CATEGORIES, TYPE_INFO, VARIATIONS, type Variation } from "@/lib/variations-data";
import { Copy, Check, FileDown, Sparkles, Loader2 } from "lucide-react";
import { Document, Packer, Paragraph, HeadingLevel, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle, AlignmentType, ShadingType, PageNumber, Footer as DocFooter, LevelFormat } from "docx";

import fileSaver from "file-saver";
import { generateScientificAnalysis } from "@/lib/assessor-ai.functions";

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
type DocStatus = "submitted" | "missing" | "na";
type DocsMap = Record<string, DocStatus[]>; // code -> per-document status

function ClassifyMulti() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);
  const [checks, setChecks] = useState<ChecksMap>({});
  const [docsSubmitted, setDocsSubmitted] = useState<DocsMap>({});
  const [opinion, setOpinion] = useState("");
  const [openCat, setOpenCat] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [] as Variation[];
    const tokens = q.split(/\s+/).filter(Boolean);
    return VARIATIONS.filter(v => {
      const hay = `${v.code} ${v.title} ${v.category} ${v.type}`.toLowerCase();
      return tokens.every(t => hay.includes(t));
    }).slice(0, 12);
  }, [searchQuery]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string>("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const callAnalysis = useServerFn(generateScientificAnalysis);
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
        const { [v.code]: _omit2, ...restDocs } = docsSubmitted;
        setChecks(rest);
        setDocsSubmitted(restDocs);
        return next;
      } else {
        setChecks({ ...checks, [v.code]: new Array(v.conditions.length).fill("unmet") });
        setDocsSubmitted({ ...docsSubmitted, [v.code]: new Array(v.documents.length).fill("missing" as DocStatus) });
        return [...prev, v.code];
      }
    });
  };

  const setStatus = (code: string, idx: number, val: CondStatus) => {
    const arr = [...(checks[code] || [])];
    arr[idx] = val;
    setChecks({ ...checks, [code]: arr });
  };

  const setDocStatus = (code: string, idx: number, val: DocStatus) => {
    const arr = [...(docsSubmitted[code] || [])];
    arr[idx] = val;
    setDocsSubmitted({ ...docsSubmitted, [code]: arr });
  };

  const reset = () => {
    setStep(1); setSelectedCodes([]); setChecks({}); setDocsSubmitted({}); setOpinion("");
    setAiAnalysis(""); setAiError(null);
  };

  // Build per-variation status
  const results = selected.map(v => {
    const arr = checks[v.code] || [];
    const unmet = v.conditions.filter((_, i) => (arr[i] || "unmet") === "unmet");
    const docFlags = docsSubmitted[v.code] || [];
    const missingDocs = v.documents.filter((_, i) => (docFlags[i] || "missing") === "missing");
    return { v, unmet, status: arr, accepted: unmet.length === 0, missingDocs };
  });

  const allAccepted = results.length > 0 && results.every(r => r.accepted);
  const anyRejected = results.some(r => !r.accepted);
  const allDocsSubmitted = allAccepted && results.every(r => r.missingDocs.length === 0);
  const totalSteps = allAccepted ? 4 : 3;

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
          {Array.from({ length: totalSteps }, (_, idx) => idx + 1).map(i => {
            const displayStep = allAccepted ? step : (step === 4 ? 3 : step);
            return (
              <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= displayStep ? "bg-primary" : "bg-border"}`} />
            );
          })}
        </div>

        {step === 1 && (
          <Panel title="1. Select one or more variations" subtitle="Search by keywords (e.g. ‘shelf life’, ‘artwork’) or browse by category.">
            <div className="mb-6 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent p-4">
              <label className="text-xs font-bold uppercase tracking-widest text-primary mb-2 block">🔎 Smart search</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Try: change shelf life, update artwork, manufacturer name…"
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 pr-10 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-sm"
                    aria-label="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>
              {searchQuery && (
                <div className="mt-3">
                  {searchResults.length === 0 ? (
                    <div className="text-sm text-muted-foreground py-4 text-center">No matching variations. Try different keywords.</div>
                  ) : (
                    <>
                      <div className="text-xs text-muted-foreground mb-2">{searchResults.length} match{searchResults.length === 1 ? "" : "es"} — click to add</div>
                      <div className="space-y-1.5 max-h-80 overflow-auto">
                        {searchResults.map(v => {
                          const isChecked = selectedCodes.includes(v.code);
                          return (
                            <button
                              key={v.code}
                              type="button"
                              onClick={() => toggleSelect(v)}
                              className={`w-full flex items-start gap-3 px-3 py-2.5 text-left rounded-lg border transition ${isChecked ? "bg-primary/10 border-primary/40" : "bg-card border-border hover:border-primary/40 hover:bg-muted/40"}`}
                            >
                              <input type="checkbox" checked={isChecked} readOnly className="mt-1 size-4 accent-primary pointer-events-none" />
                              <TypeBadge type={v.type} size="sm" />
                              <div className="flex-1 min-w-0">
                                <div className="text-xs text-muted-foreground"><span className="font-mono">{v.code}</span> • {v.category}</div>
                                <div className="font-bold text-foreground text-sm leading-snug">{v.title}</div>
                              </div>
                              {isChecked && <span className="text-xs text-primary font-bold shrink-0">Added</span>}
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
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
          <Panel title="2. Verify conditions for each variation" subtitle="Mark each condition as Met / Not met / N/A.">

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
              <button onClick={() => setStep(allAccepted ? 3 : 4)}
                className="rounded-xl bg-primary text-primary-foreground px-5 py-2.5 font-bold hover:bg-primary/90 transition">
                {allAccepted ? "Verify requirements →" : "Generate combined decision →"}
              </button>
            </div>
          </Panel>
        )}

        {step === 3 && allAccepted && (
          <Panel
            title="3. Verify required documentation"
            subtitle="Tick each required document that has been submitted. Any missing item will place the final decision on Suspension."
          >
            <div className="space-y-5">
              {selected.map(v => {
                const flags = docsSubmitted[v.code] || [];
                const missingCount = v.documents.filter((_, i) => (flags[i] || "missing") === "missing").length;
                const naCount = v.documents.filter((_, i) => flags[i] === "na").length;
                return (
                  <div key={v.code} className="rounded-xl border border-border bg-card p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <TypeBadge type={v.type} size="sm" />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs text-muted-foreground font-mono">{v.code}</div>
                        <div className="font-bold text-foreground text-sm">{v.title}</div>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded-md ${missingCount === 0 ? "bg-success/15 text-success" : "bg-warning/15 text-warning"}`}>
                        {missingCount === 0 ? (naCount > 0 ? `All cleared (${naCount} N/A)` : "All submitted") : `${missingCount} missing`}
                      </span>
                    </div>
                    {v.documents.length === 0 ? (
                      <p className="text-xs text-muted-foreground italic">No specific documentation required for this variation.</p>
                    ) : (
                      <ul className="space-y-2">
                        {v.documents.map((d, i) => {
                          const status: DocStatus = (flags[i] || "missing") as DocStatus;
                          const rowClass =
                            status === "submitted" ? "bg-success/10 border-success/30"
                            : status === "na" ? "bg-muted/40 border-border"
                            : "bg-destructive/5 border-destructive/30";
                          const btn = (val: DocStatus, label: string, activeCls: string) => (
                            <button
                              type="button"
                              onClick={() => setDocStatus(v.code, i, val)}
                              className={`px-2.5 py-1 rounded-md text-xs font-bold border transition ${status === val ? activeCls : "bg-background border-border text-muted-foreground hover:text-foreground"}`}
                            >
                              {label}
                            </button>
                          );
                          return (
                            <li key={i} className={`p-2.5 rounded-lg border flex items-start gap-3 ${rowClass}`}>
                              <span className="flex-1 text-sm text-foreground leading-relaxed">{d}</span>
                              <div className="flex gap-1 shrink-0">
                                {btn("submitted", "Submitted", "bg-success/20 border-success/40 text-success")}
                                {btn("missing", "Missing", "bg-destructive/15 border-destructive/40 text-destructive")}
                                {btn("na", "N/A", "bg-muted border-border text-foreground")}
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-5 flex items-center justify-between gap-3">
              <button onClick={() => setStep(2)} className="text-sm text-muted-foreground hover:text-foreground">← Back</button>
              <button onClick={() => setStep(4)}
                className="rounded-xl bg-primary text-primary-foreground px-5 py-2.5 font-bold hover:bg-primary/90 transition">
                Generate final decision →
              </button>
            </div>
          </Panel>
        )}

        {step === 4 && (() => {
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
          const decisionStatus: "APPROVED" | "SUSPENDED" | "NOT_ACCEPTED" =
            !allAccepted ? "NOT_ACCEPTED" : (allDocsSubmitted ? "APPROVED" : "SUSPENDED");
          const overall = decisionStatus === "APPROVED"
            ? "All selected variations satisfy their required conditions and all required documentation has been submitted. The request qualifies for approval."
            : decisionStatus === "SUSPENDED"
              ? "All selected variations satisfy their required conditions; however, some required documentation has not been submitted. The request is placed on Suspension pending submission of the missing documents."
              : approvedCount === 0
                ? "None of the selected variations satisfy all required conditions; each one fails on at least one item."
                : "The selected variations show a mixed outcome: some satisfy all conditions while others fail on one or more required items.";


          const finalText = (() => {
            if (decisionStatus === "SUSPENDED") {
              const blocks = results.map(({ v, missingDocs }) => {
                const lines: string[] = [];
                lines.push(`${v.code} ${v.title}`);
                if (missingDocs.length === 0) {
                  lines.push("is approved (all required documents submitted)");
                } else {
                  lines.push(`is suspended — please provide the following required document(s):`);
                  missingDocs.forEach(d => lines.push(`• ${d}`));
                }
                return lines.join("\n");
              });
              return blocks.join("\n\n");
            }
            return results.map(({ v, unmet, accepted }) => {
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
          })();

          const downloadWord = async () => {
            const BRAND = "1F3A68"; // deep navy
            const ACCENT = "2E75B6";
            const MUTED = "595959";
            const LIGHT_BG = "F2F6FB";
            const SUCCESS_BG = "E8F3EC";
            const SUCCESS_BORDER = "3F8A56";
            const DANGER_BG = "FBEAEA";
            const DANGER_BORDER = "B33A3A";
            const WARN_BG = "FFF4E5";
            const WARN_BORDER = "B8860B";

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
            const calloutFill = decisionStatus === "APPROVED" ? SUCCESS_BG : decisionStatus === "SUSPENDED" ? WARN_BG : DANGER_BG;
            const calloutBorderColor = decisionStatus === "APPROVED" ? SUCCESS_BORDER : decisionStatus === "SUSPENDED" ? WARN_BORDER : DANGER_BORDER;
            const calloutBorder = { style: BorderStyle.SINGLE, size: 8, color: calloutBorderColor };
            const calloutLabel = decisionStatus === "APPROVED" ? "APPROVED" : decisionStatus === "SUSPENDED" ? "SUSPENDED" : "NOT ACCEPTED";
            const opinionText =
              decisionStatus === "APPROVED"
                ? "The proposed change and supporting documentation have been reviewed and found to comply with the applicable requirements and conditions for a Type IA variation. The provided data are considered adequate to support the proposed change and demonstrate that it does not adversely affect the quality of the product. All relevant regulatory requirements have been satisfactorily addressed. Therefore, no regulatory concerns were identified, and approval of the proposed change is recommended."
                : decisionStatus === "SUSPENDED"
                  ? "All applicable conditions for the proposed Type IA variation(s) have been met; however, one or more required documents have not been submitted. The request is therefore placed on Suspension pending submission of the missing documentation listed below."
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
                      children: [new TextRun({ text: calloutLabel, bold: true, color: calloutBorderColor, font: "Calibri", size: 22 })],
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

            // Assessor opinion — scientific analysis only (no red callout box)
            children.push(h1("3. Assessor opinion"));
            if (opinion.trim()) {
              children.push(para("Reviewer's note", { bold: true, color: BRAND }));
              opinion.trim().split("\n").forEach(l => children.push(para(l)));
              children.push(spacer());
            }
            if (aiAnalysis.trim()) {
              aiAnalysis.split("\n").forEach(rawLine => {
                const line = rawLine.replace(/\r/g, "");
                if (!line.trim()) { children.push(spacer()); return; }
                const h3 = line.match(/^###\s+(.*)$/);
                const h4 = line.match(/^####\s+(.*)$/);
                const h2 = line.match(/^##\s+(.*)$/);
                const li = line.match(/^\s*[-*]\s+(.*)$/);
                const oli = line.match(/^\s*\d+\.\s+(.*)$/);
                if (h2) { children.push(para(h2[1].replace(/\*\*/g, ""), { bold: true, color: BRAND })); return; }
                if (h3) { children.push(para(h3[1].replace(/\*\*/g, ""), { bold: true, color: ACCENT })); return; }
                if (h4) { children.push(para(h4[1].replace(/\*\*/g, ""), { bold: true })); return; }
                if (li || oli) { children.push(bullet((li || oli)![1].replace(/\*\*/g, ""))); return; }
                children.push(para(line.replace(/\*\*/g, "")));
              });
            }
            children.push(spacer());

            // Final recommendation — mirrors the UI box in the last step
            children.push(h1("4. Final recommendation"));
            children.push(opinionCallout);
            children.push(spacer());
            results.forEach(({ v, unmet, accepted, missingDocs }) => {
              const isSuspendedItem = decisionStatus === "SUSPENDED" && accepted && missingDocs.length > 0;
              const statusColor = isSuspendedItem
                ? WARN_BORDER
                : accepted ? SUCCESS_BORDER : DANGER_BORDER;
              const statusText = isSuspendedItem
                ? `  is suspended — please provide the following required document(s):`
                : accepted
                  ? "  is approved"
                  : `  is rejected, the following ${unmet.length === 1 ? "condition is" : "conditions are"} not met:`;
              children.push(new Paragraph({
                spacing: { before: 160, after: 80, line: 300 },
                children: [
                  new TextRun({ text: `${v.code}  `, bold: true, font: "Consolas", size: 20, color: MUTED }),
                  new TextRun({ text: v.title, bold: true, font: "Calibri", size: 22 }),
                  new TextRun({ text: statusText, bold: true, color: statusColor, font: "Calibri", size: 22 }),
                ],
              }));
              if (isSuspendedItem) {
                missingDocs.forEach(d => children.push(bullet(d)));
              } else if (!accepted) {
                unmet.forEach(c => children.push(bullet(c)));
              }
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
                    margin: { top: 1440, right: 1440, bottom: 1440, left: 1440, header: 0, footer: 720 },
                  },
                },

                footers: {
                  default: new DocFooter({
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({ text: "Page ", color: MUTED, font: "Calibri", size: 18 }),
                          new TextRun({ children: [PageNumber.CURRENT], color: MUTED, font: "Calibri", size: 18 }),
                          new TextRun({ text: " of ", color: MUTED, font: "Calibri", size: 18 }),
                          new TextRun({ children: [PageNumber.TOTAL_PAGES], color: MUTED, font: "Calibri", size: 18 }),
                        ],
                      }),
                    ],
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
            <>
            <div className="mb-6 rounded-3xl border-2 border-info bg-info/15 p-6 sm:p-8 shadow-elegant">
              <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <Sparkles size={18} className="text-info" />
                  <div className="text-base font-extrabold text-info uppercase tracking-wide">Assessor Opinion</div>
                </div>
                <div className="flex items-center gap-2">
                  {aiAnalysis && (
                    <button
                      type="button"
                      onClick={() => handleCopy(aiAnalysis, "ai")}
                      className="inline-flex items-center gap-1 rounded-lg border border-info/40 bg-info/10 px-2 py-1 text-xs font-bold text-info hover:bg-info/20 transition"
                    >
                      {copiedKey === "ai" ? <Check size={14} /> : <Copy size={14} />}
                      {copiedKey === "ai" ? "Copied!" : "Copy"}
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={aiLoading}
                    onClick={async () => {
                      setAiLoading(true);
                      setAiError(null);
                      try {
                        const items = results.map(r => ({
                          code: r.v.code,
                          title: r.v.title,
                          accepted: r.accepted,
                          unmetConditions: r.unmet,
                          metConditions: r.v.conditions.filter(c => !r.unmet.includes(c)),
                        }));
                        const res = await callAnalysis({ data: { items } });
                        setAiAnalysis(res.analysis);
                      } catch (e: any) {
                        const msg = String(e?.message || e);
                        if (msg.includes("429")) setAiError("Rate limit reached. Please try again shortly.");
                        else if (msg.includes("402")) setAiError("AI credits exhausted. Add credits in your workspace settings.");
                        else setAiError("Could not generate analysis. Please try again.");
                      } finally {
                        setAiLoading(false);
                      }
                    }}
                    className="inline-flex items-center gap-2 rounded-lg bg-info text-white px-3 py-1.5 text-xs font-bold hover:opacity-90 disabled:opacity-60 transition"
                  >
                    {aiLoading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                    {aiLoading ? "Generating…" : aiAnalysis ? "Regenerate" : "Generate analysis"}
                  </button>
                </div>
              </div>

              {!aiAnalysis && !aiLoading && !aiError && (
                <p className="text-sm text-foreground/80">
                  {allAccepted
                    ? "Generate a scientific justification for the accepted variations: why each change is acceptable as a minor (Type IA) variation, and its (minimal) impact on Efficacy, Safety, Stability, and Bioavailability."
                    : "Generate a detailed scientific analysis for each unmet condition: meaning, reason for non-compliance, and impact on product quality (Efficacy, Safety, Stability, Bioavailability)."}
                </p>
              )}
              {aiError && (
                <p className="text-sm text-destructive font-medium">{aiError}</p>
              )}
              {aiAnalysis && (
                <div className="rounded-xl bg-background/70 p-4 text-sm text-foreground leading-relaxed space-y-2 [&_h3]:text-base [&_h3]:font-extrabold [&_h3]:mt-4 [&_h3]:mb-2 [&_h3]:text-info [&_h4]:text-sm [&_h4]:font-bold [&_h4]:mt-3 [&_h4]:mb-1 [&_h4]:text-foreground [&_p]:mb-2 [&_strong]:font-bold [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:ps-5 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:ps-5">
                  <ReactMarkdown>{aiAnalysis}</ReactMarkdown>
                </div>
              )}
            </div>

            <div className={`rounded-3xl border p-6 sm:p-8 shadow-elegant ${
              decisionStatus === "APPROVED" ? "border-success/30 bg-success/5"
              : decisionStatus === "SUSPENDED" ? "border-border bg-background"
              : "border-destructive/30 bg-destructive/5"
            }`}>
              <div className={`mb-5 rounded-2xl border-2 p-4 ${
                decisionStatus === "APPROVED" ? "border-success/50 bg-success/10"
                : decisionStatus === "SUSPENDED" ? "border-border bg-muted/30"
                : "border-destructive/50 bg-destructive/10"
              }`}>
                <div className={`text-xl font-extrabold ${
                  decisionStatus === "APPROVED" ? "text-success"
                  : decisionStatus === "SUSPENDED" ? "text-foreground"
                  : "text-destructive"
                }`}>
                  {decisionStatus === "APPROVED" ? "APPROVED" : decisionStatus === "SUSPENDED" ? "SUSPENDED" : "NOT ACCEPTED"}
                </div>
                <p className="mt-2 text-sm text-foreground/80 leading-relaxed">{overall}</p>
              </div>


              <div className="rounded-2xl border-2 border-primary/40 bg-primary/10 p-5 sm:p-6">
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
                  {results.map(({ v, unmet, accepted, missingDocs }) => {
                    const isSuspendedItem = decisionStatus === "SUSPENDED" && accepted && missingDocs.length > 0;
                    return (
                      <li key={v.code} className="text-sm sm:text-base text-foreground leading-relaxed">
                        <span className="font-mono font-bold text-xs me-2 px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{v.code}</span>
                        <span className="font-semibold">{v.title}</span>
                        {isSuspendedItem ? (
                          <span className="ms-1 font-bold text-foreground">
                            is suspended — please provide the following required document(s):
                          </span>

                        ) : accepted ? (
                          <span className="ms-1 font-bold text-success">is approved</span>
                        ) : (
                          <span className="ms-1 font-bold text-destructive">
                            is rejected, the following {unmet.length === 1 ? "condition is" : "conditions are"} not met:
                          </span>
                        )}
                        {isSuspendedItem && (
                          <ul className="mt-2 space-y-1 ps-5">
                            {missingDocs.map((d, i) => (
                              <li key={i} className="text-sm text-foreground/80 leading-relaxed list-disc">{d}</li>
                            ))}
                          </ul>
                        )}
                        {!isSuspendedItem && !accepted && unmet.length > 0 && (
                          <ul className="mt-2 space-y-1 ps-5">
                            {unmet.map((c, i) => (
                              <li key={i} className="text-sm text-foreground/80 leading-relaxed list-disc">{c}</li>
                            ))}
                          </ul>
                        )}
                      </li>
                    );
                  })}
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
            </>
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
