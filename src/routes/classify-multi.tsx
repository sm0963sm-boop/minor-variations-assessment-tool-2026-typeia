import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { TypeBadge } from "@/components/TypeBadge";
import { CATEGORIES, TYPE_INFO, VARIATIONS, type Variation } from "@/lib/variations-data";
import { Copy, Check, FileDown } from "lucide-react";
import { Document, Packer, Paragraph, HeadingLevel, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle } from "docx";
import fileSaver from "file-saver";
const { saveAs } = fileSaver;

export const Route = createFileRoute("/classify-multi")({
  head: () => ({
    meta: [
      { title: "Final report — Combined decision" },
      { name: "description", content: "Classify multiple Type IA / IAIN variations at once and get a single combined final decision." },
    ],
  }),
  component: ClassifyMulti,
});

type CondStatus = "met" | "unmet" | "na";
type ChecksMap = Record<string, CondStatus[]>; // code -> conditions status

function ClassifyMulti() {
  const [step, setStep] = useState<0 | 1 | 2>(0);
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
    setStep(0); setSelectedCodes([]); setChecks({}); setOpinion("");
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
          <h1 className="font-display text-3xl font-extrabold text-foreground">Final report</h1>
          <button onClick={reset} className="text-sm text-muted-foreground hover:text-foreground">↻ Restart</button>
        </div>
        <div className="flex gap-2 mb-8">
          {[0, 1, 2].map(i => (
            <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-primary" : "bg-border"}`} />
          ))}
        </div>

        {step === 0 && (
          <Panel title="1. Select one or more variations" subtitle="Pick a variation from each category dropdown, then add it to the selection.">
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
                onClick={() => setStep(1)}
                className="rounded-xl bg-primary text-primary-foreground px-5 py-2.5 font-bold disabled:opacity-50 hover:bg-primary/90 transition"
              >
                Continue →
              </button>
            </div>
          </Panel>
        )}

        {step === 1 && (
          <Panel title="2. Verify conditions for each variation" subtitle="Tick every condition that is fully met.">
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
              <button onClick={() => setStep(0)} className="text-sm text-muted-foreground hover:text-foreground">← Back</button>
              <button onClick={() => setStep(2)}
                className="rounded-xl bg-primary text-primary-foreground px-5 py-2.5 font-bold hover:bg-primary/90 transition">
                Generate combined decision →
              </button>
            </div>
          </Panel>
        )}

        {step === 2 && (() => {
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
          reviewerLines.push(`Scope reviewed: ${total} variation${total === 1 ? "" : "s"} (${typesSummary}).`);
          reviewerLines.push(`Outcome summary: ${approvedCount} approved · ${rejectedCount} rejected.`);
          reviewerLines.push(`Assessment: ${overall}`);
          if (rejectedCount > 0) {
            reviewerLines.push("Key gaps identified:");
            results.filter(r => !r.accepted).forEach(({ v, unmet }) => {
              reviewerLines.push(`• ${v.code} — ${unmet.length} unmet ${unmet.length === 1 ? "condition" : "conditions"}.`);
            });
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
            const heading = (text: string) =>
              new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text, bold: true })] });
            const para = (text: string, bold = false) =>
              new Paragraph({ children: [new TextRun({ text, bold })] });
            const bullet = (text: string) =>
              new Paragraph({ bullet: { level: 0 }, children: [new TextRun(text)] });

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
            const cellBorder = { style: BorderStyle.SINGLE, size: 6, color: "BFBFBF" };
            const borders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };
            const infoTable = new Table({
              width: { size: 9360, type: WidthType.DXA },
              columnWidths: [3120, 6240],
              rows: infoRows.map(([label, value]) => new TableRow({
                children: [
                  new TableCell({
                    borders,
                    width: { size: 3120, type: WidthType.DXA },
                    margins: { top: 80, bottom: 80, left: 120, right: 120 },
                    children: [new Paragraph({ children: [new TextRun({ text: label, bold: true })] })],
                  }),
                  new TableCell({
                    borders,
                    width: { size: 6240, type: WidthType.DXA },
                    margins: { top: 80, bottom: 80, left: 120, right: 120 },
                    children: [new Paragraph({ children: [new TextRun(value || "—")] })],
                  }),
                ],
              })),
            });

            const children: (Paragraph | Table)[] = [];
            children.push(heading("Product information"));
            children.push(infoTable);
            children.push(new Paragraph({ children: [new TextRun("")] }));
            children.push(heading("Reviewer opinion"));
            children.push(para(`Scope reviewed: ${total} variation${total === 1 ? "" : "s"} (${typesSummary}).`));
            children.push(para(`Outcome summary: ${approvedCount} approved · ${rejectedCount} rejected.`));
            children.push(para(`Assessment: ${overall}`));
            if (rejectedCount > 0) {
              children.push(para("Key gaps identified:", true));
              results.filter(r => !r.accepted).forEach(({ v, unmet }) => {
                children.push(bullet(`${v.code} — ${unmet.length} unmet ${unmet.length === 1 ? "condition" : "conditions"}.`));
              });
            }
            if (opinion.trim()) {
              children.push(para("Reviewer's note:", true));
              opinion.trim().split("\n").forEach(l => children.push(para(l)));
            }

            children.push(new Paragraph({ children: [new TextRun("")] }));
            children.push(heading("Final recommendation"));
            results.forEach(({ v, unmet, accepted }) => {
              children.push(new Paragraph({
                children: [
                  new TextRun({ text: `${v.code} `, bold: true }),
                  new TextRun({ text: v.title, bold: true }),
                  new TextRun({ text: accepted ? " is approved" : ` is rejected, the following ${unmet.length === 1 ? "condition is" : "conditions are"} not met:` }),
                ],
              }));
              if (!accepted) unmet.forEach(c => children.push(bullet(c)));
              children.push(new Paragraph({ children: [new TextRun("")] }));
            });

            const doc = new Document({ sections: [{ children }] });
            const blob = await Packer.toBlob(doc);
            saveAs(blob, `reviewer-decision-${new Date().toISOString().slice(0, 10)}.docx`);
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
                  <p>
                    <span className="font-bold">Scope reviewed:</span> {total} variation{total === 1 ? "" : "s"} ({typesSummary}).
                  </p>
                  <p>
                    <span className="font-bold">Outcome summary:</span>{" "}
                    <span className="font-bold text-success">{approvedCount} approved</span>
                    {" · "}
                    <span className="font-bold text-destructive">{rejectedCount} rejected</span>.
                  </p>
                  <p>
                    <span className="font-bold">Assessment:</span> {overall}
                  </p>
                  {rejectedCount > 0 && (
                    <div>
                      <div className="font-bold mb-1">Key gaps identified:</div>
                      <ul className="space-y-1 ps-5 list-disc">
                        {results.filter(r => !r.accepted).map(({ v, unmet }) => (
                          <li key={v.code} className="text-sm text-foreground/90">
                            <span className="font-mono font-bold">{v.code}</span> — {unmet.length} unmet {unmet.length === 1 ? "condition" : "conditions"}.
                          </li>
                        ))}
                      </ul>
                    </div>
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
