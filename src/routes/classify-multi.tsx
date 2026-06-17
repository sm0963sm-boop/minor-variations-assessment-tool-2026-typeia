import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import ReactMarkdown from "react-markdown";
import { Header } from "@/components/Header";
import { TypeBadge } from "@/components/TypeBadge";
import { CATEGORIES, TYPE_INFO, VARIATIONS, type Variation } from "@/lib/variations-data";
import { Copy, Check, FileDown, Sparkles, Loader2 } from "lucide-react";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";

import fileSaver from "file-saver";
import { generateScientificAnalysis } from "@/lib/assessor-ai.functions";

const { saveAs } = fileSaver;

export const Route = createFileRoute("/classify-multi")({
  head: () => ({
    meta: [
      { title: "Minor Variations Assessment Tool" },
      { name: "description", content: "Assess multiple Type IA / IAIN / IB minor variations at once and get a per-variation final decision." },
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
  // SFDA Quality Assessment Report — Administrative Information
  const [productInfo, setProductInfo] = useState({
    tradeName: "",
    activeIngredients: "",
    subProductNo: "",
    mah: "",
    apiManufacturers: "",
    drugProductManufacturer: "",
    pharmaceuticalForm: "",
    route: "",
    strength: "",
    shelfLife: "",
    storage: "",
  });
  // SFDA Quality Assessment Report — Assessor Names
  const [assessors, setAssessors] = useState({
    api: { name: "", endDate: "" },
    fpp: { name: "", endDate: "" },
    analytical: { name: "", endDate: "" },
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

  // IB variations have no conditions → treated as auto-accepted; decision is based on documentation only.
  const hasConditionVars = selected.some(v => v.conditions.length > 0);
  const allAccepted = results.length > 0 && results.every(r => r.accepted);
  const anyAccepted = results.some(r => r.accepted);
  const anyRejected = results.some(r => !r.accepted);
  const allDocsSubmitted = allAccepted && results.every(r => r.missingDocs.length === 0);
  // Per-item status: each variation gets its own final decision
  type ItemStatus = "APPROVED" | "SUSPENDED" | "REJECTED";
  const itemStatusOf = (r: typeof results[number]): ItemStatus =>
    !r.accepted ? "REJECTED" : r.missingDocs.length === 0 ? "APPROVED" : "SUSPENDED";
  const totalSteps = anyAccepted ? 4 : 3;

  return (
    <div className="min-h-screen">
      <Header />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
        <div className="rounded-xl border border-warning/30 bg-warning/10 p-4 mb-8">
          <p className="text-sm text-foreground leading-relaxed">
            <span className="font-bold text-warning">Note:</span> This tool assists the reviewer in evaluating Type IA / IAIN / IB minor variation requests. It does not replace the full independent assessment required by the reviewer.
          </p>
        </div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl font-extrabold text-foreground">Minor Variations Assessment Tool</h1>
          <button onClick={reset} className="text-sm text-muted-foreground hover:text-foreground">↻ Restart</button>
        </div>
        <div className="flex gap-2 mb-8">
          {Array.from({ length: totalSteps }, (_, idx) => idx + 1).map(i => {
            const displayStep = anyAccepted ? step : (step === 4 ? 3 : step);
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
                onClick={() => setStep(hasConditionVars ? 2 : 3)}
                className="rounded-xl bg-primary text-primary-foreground px-5 py-2.5 font-bold disabled:opacity-50 hover:bg-primary/90 transition"
              >
                Continue →
              </button>
            </div>
          </Panel>
        )}

        {step === 2 && (
          <Panel title="2. Verify conditions (Type IA / IAIN)" subtitle="Mark each condition as Met / Not met / N/A. Type IB variations are not shown here — they are assessed on documentation only in the next step.">

            <div className="space-y-5">
              {selected.filter(v => v.conditions.length > 0).map(v => (
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
              <button onClick={() => setStep(anyAccepted ? 3 : 4)}
                className="rounded-xl bg-primary text-primary-foreground px-5 py-2.5 font-bold hover:bg-primary/90 transition">
                {anyAccepted ? "Verify requirements →" : "Generate combined decision →"}
              </button>
            </div>
          </Panel>
        )}

        {step === 3 && anyAccepted && (
          <Panel
            title="3. Verify required documentation"
            subtitle={allAccepted
              ? "Tick each required document that has been submitted. Any missing item will place that variation on Suspension."
              : "Shown for Type IB variations and for Type IA / IAIN variations that met all their conditions. Tick the documents that have been submitted; missing items will place that variation on Suspension."}
          >
            <div className="space-y-5">
              {selected.filter(v => (results.find(r => r.v.code === v.code)?.accepted)).map(v => {
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
              <button onClick={() => setStep(hasConditionVars ? 2 : 1)} className="text-sm text-muted-foreground hover:text-foreground">← Back</button>
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
          const itemStatuses = results.map(itemStatusOf);
          const hasApproved = itemStatuses.includes("APPROVED");
          const hasSuspended = itemStatuses.includes("SUSPENDED");
          const hasRejected = itemStatuses.includes("REJECTED");
          const decisionStatus: "APPROVED" | "SUSPENDED" | "NOT_ACCEPTED" | "MIXED" =
            !hasRejected && !hasSuspended ? "APPROVED"
            : !hasApproved && !hasSuspended ? "NOT_ACCEPTED"
            : !hasRejected ? "SUSPENDED"
            : "MIXED";
          const overall = decisionStatus === "APPROVED"
            ? "All selected variations satisfy their required conditions and all required documentation has been submitted. The request qualifies for approval."
            : decisionStatus === "SUSPENDED"
              ? "All selected variations satisfy their required conditions; however, some required documentation has not been submitted. The request is placed on Suspension pending submission of the missing documents."
              : decisionStatus === "NOT_ACCEPTED"
                ? "None of the selected variations satisfy all required conditions; each one fails on at least one item."
                : "The selected variations show a mixed outcome: each variation has its own independent decision below (Approved, Suspended, or Not accepted).";


          const finalText = results.map((r) => {
            const { v, unmet, missingDocs } = r;
            const s = itemStatusOf(r);
            const lines: string[] = [`${v.code} ${v.title}`];
            if (s === "APPROVED") {
              lines.push("is approved");
            } else if (s === "SUSPENDED") {
              lines.push("is suspended — please provide the following required document(s):");
              missingDocs.forEach(d => lines.push(`• ${d}`));
            } else {
              lines.push(`is rejected, the following ${unmet.length === 1 ? "condition is" : "conditions are"} not met:`);
              unmet.forEach(c => lines.push(`• ${c}`));
            }
            return lines.join("\n");
          }).join("\n\n");

          const downloadWord = async () => {
            const cleanText = (s: string) => (s || "")
              .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
              .replace(/\*\*/g, "")
              .trimEnd();

            const parts: string[] = [];
            parts.push("3. Scientific Assessment");
            parts.push("This section presents the scientific assessment of the submitted Type IA / IAIN / IB minor variation(s), including the justification, impact on product quality (Efficacy, Safety, Stability, Bioavailability), and the assessor's conclusion for each variation.");
            parts.push("");
            parts.push("3.1 Submitted variations");
            selected.forEach(v => parts.push(`${cleanText(v.code)} | ${cleanText(v.title)} | ${cleanText(v.type)}`));
            parts.push("");
            let nextIdx = 2;
            if (opinion.trim()) {
              parts.push(`3.${nextIdx} Reviewer's note`);
              opinion.trim().split("\n").forEach(l => parts.push(cleanText(l)));
              parts.push("");
              nextIdx++;
            }
            parts.push(`3.${nextIdx} Scientific analysis (AI-assisted)`);
            if (aiAnalysis.trim()) {
              aiAnalysis.split("\n").forEach(rawLine => {
                const line = cleanText(rawLine.replace(/\r/g, ""));
                if (!line.trim()) { parts.push(""); return; }
                const h2 = line.match(/^##\s+(.*)$/);
                const h3 = line.match(/^###\s+(.*)$/);
                const h4 = line.match(/^####\s+(.*)$/);
                const li = line.match(/^\s*[-*]\s+(.*)$/);
                const oli = line.match(/^\s*\d+\.\s+(.*)$/);
                if (h2) { parts.push(cleanText(h2[1])); return; }
                if (h3) { parts.push(cleanText(h3[1])); return; }
                if (h4) { parts.push(cleanText(h4[1])); return; }
                if (li || oli) { parts.push(`• ${cleanText((li || oli)![1])}`); return; }
                parts.push(line);
              });
            } else {
              parts.push("— Scientific analysis was not generated. Use the 'Generate analysis' button before downloading the report. —");
            }
            parts.push("");

            // Section 4: Final Decision
            parts.push("4. Final Decision");
            const calloutLabel = decisionStatus === "APPROVED" ? "APPROVED"
              : decisionStatus === "SUSPENDED" ? "SUSPENDED"
              : decisionStatus === "MIXED" ? "MIXED OUTCOME — PER-VARIATION DECISION"
              : "NOT ACCEPTED";
            const opinionText =
              decisionStatus === "APPROVED"
                ? "The proposed change and supporting documentation have been reviewed and found to comply with the applicable requirements and conditions. The provided data are considered adequate to support the proposed change and demonstrate that it does not adversely affect the quality of the product."
                : decisionStatus === "SUSPENDED"
                  ? "All applicable conditions for the proposed variation(s) have been met; however, one or more required documents have not been submitted. The request is therefore placed on Suspension pending submission of the missing documentation listed below."
                  : decisionStatus === "MIXED"
                    ? "The submitted variations have different outcomes: each variation has its own independent decision (Approved, Suspended, or Not accepted) as listed below."
                    : "The submitted variation(s) have been incorrectly classified and do not meet the applicable criteria for the requested variation category. Therefore, the variation(s) cannot be accepted as submitted.";
            parts.push(calloutLabel);
            parts.push(opinionText);
            parts.push("");

            results.forEach((r) => {
              const { v, unmet, missingDocs } = r;
              const s = itemStatusOf(r);
              const statusText = s === "APPROVED"
                ? "is approved"
                : s === "SUSPENDED"
                  ? "is suspended — please provide the following required document(s):"
                  : `  is rejected, the following ${unmet.length === 1 ? "condition is" : "conditions are"} not met:`;
              parts.push(`${cleanText(v.code)} ${cleanText(v.title)} ${statusText}`);
              if (s === "SUSPENDED") missingDocs.forEach(d => parts.push(`• ${cleanText(d)}`));
              else if (s === "REJECTED") unmet.forEach(c => parts.push(`• ${cleanText(c)}`));
            });

            const scientificText = parts.join("\n");

            // Load template & fill placeholders
            const res = await fetch("/report-template.docx");
            if (!res.ok) throw new Error("Failed to load report template");
            const buf = await res.arrayBuffer();
            const zip = new PizZip(buf);
            const documentXml = zip.file("word/document.xml");
            if (documentXml) {
              const placeholderMap: Record<string, string> = {
                "{tradeName}": "[[tradeName]]",
                "{activeIngredient}": "[[activeIngredient]]",
                "{subProductNo}": "[[subProductNo]]",
                "{mah}": "[[mah]]",
                "{apiManufacturer}": "[[apiManufacturer]]",
                "{drugManufacturer}": "[[drugManufacturer]]",
                "{pharmaceuticalForm}": "[[pharmaceuticalForm]]",
                "{routeOfAdministration}": "[[routeOfAdministration]]",
                "{strength}": "[[strength]]",
                "{shelfLife}": "[[shelfLife]]",
                "{storageConditions}": "[[storageConditions]]",
                "{apiAssessor}": "[[apiAssessor]]",
                "{apiEndDate}": "[[apiEndDate]]",
                "{fppAssessor}": "[[fppAssessor]]",
                "{fppEndDate}": "[[fppEndDate]]",
                "{analyticalAssessor}": "[[analyticalAssessor]]",
                "{analyticalEndDate}": "[[analyticalEndDate]]",
                "{@scientificXml}": "[[scientificText]]",
              };
              const applySafePlaceholders = (input: string) =>
                Object.entries(placeholderMap).reduce((acc, [from, to]) => acc.replaceAll(from, to), input);
              const xml = applySafePlaceholders(documentXml.asText());
              const rawTagPattern = /<w:p(?:\s[^>]*)?>\s*<w:r(?:\s[^>]*)?>\s*<w:t(?:\s[^>]*)?>\[\[scientificText\]\]<\/w:t>\s*<\/w:r>\s*<\/w:p>/;
              const rawTagMatch = xml.match(rawTagPattern);
              const sectionPropsIndex = xml.lastIndexOf("<w:sectPr");
              if (rawTagMatch?.index !== undefined && sectionPropsIndex !== -1 && rawTagMatch.index > sectionPropsIndex) {
                const xmlWithoutRawTag = xml.slice(0, rawTagMatch.index) + xml.slice(rawTagMatch.index + rawTagMatch[0].length);
                const fixedSectionPropsIndex = xmlWithoutRawTag.lastIndexOf("<w:sectPr");
                zip.file("word/document.xml", xmlWithoutRawTag.slice(0, fixedSectionPropsIndex) + rawTagMatch[0] + xmlWithoutRawTag.slice(fixedSectionPropsIndex));
              } else {
                zip.file("word/document.xml", xml);
              }
            }
            const doc = new Docxtemplater(zip, {
              paragraphLoop: true,
              linebreaks: true,
              delimiters: { start: "[[", end: "]]" },
            });
            doc.render({
              tradeName: productInfo.tradeName || "",
              activeIngredient: productInfo.activeIngredients || "",
              subProductNo: productInfo.subProductNo || "",
              mah: productInfo.mah || "",
              apiManufacturer: productInfo.apiManufacturers || "",
              drugManufacturer: productInfo.drugProductManufacturer || "",
              pharmaceuticalForm: productInfo.pharmaceuticalForm || "",
              routeOfAdministration: productInfo.route || "",
              strength: productInfo.strength || "",
              shelfLife: productInfo.shelfLife || "",
              storageConditions: productInfo.storage || "",
              apiAssessor: assessors.api.name || "",
              apiEndDate: assessors.api.endDate || "",
              fppAssessor: assessors.fpp.name || "",
              fppEndDate: assessors.fpp.endDate || "",
              analyticalAssessor: assessors.analytical.name || "",
              analyticalEndDate: assessors.analytical.endDate || "",
              scientificText,
            });
            const blob = doc.getZip().generate({
              type: "blob",
              mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            });
            const safeName = (productInfo.tradeName || "report").replace(/[^a-z0-9-_]+/gi, "_").slice(0, 40);
            saveAs(blob, `quality-assessment-report-${safeName}-${new Date().toISOString().slice(0, 10)}.docx`);
          };


          return (
            <>
            {(() => {
              const submittedByVar = results
                .map(r => {
                  const s = itemStatusOf(r);
                  if (r.v.type !== "IB" && s === "REJECTED") return null;
                  const flags = docsSubmitted[r.v.code] || [];
                  const submitted = r.v.documents
                    .map((d, i) => ({ d, status: (flags[i] || "missing") as DocStatus }))
                    .filter(x => x.status === "submitted")
                    .map(x => x.d);
                  if (submitted.length === 0) return null;
                  return { v: r.v, status: s, submitted };
                })
                .filter((x): x is { v: typeof results[number]["v"]; status: ItemStatus; submitted: string[] } => x !== null);

              if (submittedByVar.length === 0) return null;
              return (
                <div className="mb-6 rounded-3xl border-2 border-primary/40 bg-primary/5 p-6 sm:p-8 shadow-elegant">
                  <div className="flex items-center gap-2 mb-4">
                    <FileDown size={18} className="text-primary" />
                    <div className="text-base font-extrabold text-primary uppercase tracking-wide">The submitted data</div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-4">
                    Documents submitted for each variation. Type IB shows all submitted documents; Type IA / IAIN shows submitted documents when the decision is Approved or Suspended.
                  </p>
                  <ul className="space-y-4">
                    {submittedByVar.map(({ v, status, submitted }) => (
                      <li key={v.code} className="rounded-xl border border-border bg-card p-4">
                        <div className="flex items-start gap-3 mb-2 flex-wrap">
                          <TypeBadge type={v.type} size="sm" />
                          <div className="min-w-0 flex-1">
                            <div className="text-xs text-muted-foreground font-mono">{v.code}</div>
                            <div className="font-bold text-foreground text-sm">{v.title}</div>
                          </div>
                          <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                            status === "APPROVED" ? "bg-success/15 text-success"
                            : status === "SUSPENDED" ? "bg-warning/15 text-warning"
                            : "bg-destructive/15 text-destructive"
                          }`}>{status}</span>
                        </div>
                        <ul className="mt-2 space-y-1.5 ps-1">
                          {submitted.map((d, i) => (
                            <li key={i} className="text-sm text-foreground/90 leading-relaxed flex gap-2">
                              <Check size={14} className="text-success mt-0.5 shrink-0" />
                              <span>{d}</span>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })()}
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
                           type: r.v.type,
                           accepted: r.accepted,
                           status: itemStatusOf(r),
                           unmetConditions: r.unmet,
                           metConditions: r.v.conditions.filter(c => !r.unmet.includes(c)),
                           missingDocs: r.missingDocs,
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
              : decisionStatus === "SUSPENDED" ? "border-warning/30 bg-warning/5"
              : decisionStatus === "MIXED" ? "border-border bg-background"
              : "border-destructive/30 bg-destructive/5"
            }`}>




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
                  {results.map((r) => {
                    const { v, unmet, missingDocs } = r;
                    const s = itemStatusOf(r);
                    return (
                      <li key={v.code} className="text-sm sm:text-base text-foreground leading-relaxed">
                        <span className="font-mono font-bold text-xs me-2 px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{v.code}</span>
                        <span className="font-semibold">{v.title}</span>
                        {s === "SUSPENDED" ? (
                          <span className="ms-1 font-bold text-warning">
                            is suspended — please provide the following required document(s):
                          </span>
                        ) : s === "APPROVED" ? (
                          <span className="ms-1 font-bold text-success">is approved</span>
                        ) : (
                          <span className="ms-1 font-bold text-destructive">
                            is rejected, the following {unmet.length === 1 ? "condition is" : "conditions are"} not met:
                          </span>
                        )}
                        {s === "SUSPENDED" && (
                          <ul className="mt-2 space-y-1 ps-5">
                            {missingDocs.map((d, i) => (
                              <li key={i} className="text-sm text-foreground/80 leading-relaxed list-disc">{d}</li>
                            ))}
                          </ul>
                        )}
                        {s === "REJECTED" && unmet.length > 0 && (
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

type ProductInfo = {
  tradeName: string; activeIngredients: string; subProductNo: string; mah: string;
  apiManufacturers: string; drugProductManufacturer: string; pharmaceuticalForm: string;
  route: string; strength: string; shelfLife: string; storage: string;
};
type Assessors = {
  api: { name: string; endDate: string };
  fpp: { name: string; endDate: string };
  analytical: { name: string; endDate: string };
};

function ReportMetadataForm({
  productInfo, setProductInfo, assessors, setAssessors,
}: {
  productInfo: ProductInfo;
  setProductInfo: React.Dispatch<React.SetStateAction<ProductInfo>>;
  assessors: Assessors;
  setAssessors: React.Dispatch<React.SetStateAction<Assessors>>;
}) {
  const fields: { key: keyof ProductInfo; label: string; placeholder?: string }[] = [
    { key: "tradeName", label: "Trade name", placeholder: "e.g. Productol" },
    { key: "activeIngredients", label: "Active Ingredient(s)" },
    { key: "subProductNo", label: "Sub-product No." },
    { key: "mah", label: "MAH" },
    { key: "apiManufacturers", label: "API Manufacturer(s)" },
    { key: "drugProductManufacturer", label: "Drug product manufacturer" },
    { key: "pharmaceuticalForm", label: "Pharmaceutical form" },
    { key: "route", label: "Route" },
    { key: "strength", label: "Strength" },
    { key: "shelfLife", label: "Shelf life" },
    { key: "storage", label: "Storage" },
  ];
  const assessorRows: { key: keyof Assessors; label: string }[] = [
    { key: "api", label: "Active pharmaceutical ingredient" },
    { key: "fpp", label: "Finished pharmaceutical product" },
    { key: "analytical", label: "Analytical and validation" },
  ];
  return (
    <div className="mb-6 rounded-3xl border-2 border-primary/30 bg-card p-6 sm:p-8 shadow-soft">
      <div className="mb-2 text-xs font-bold uppercase tracking-wider text-primary">Administrative Information</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {fields.map(f => (
          <label key={f.key} className="block">
            <span className="block text-xs font-semibold text-foreground mb-1">{f.label}</span>
            <input
              type="text"
              value={productInfo[f.key]}
              placeholder={f.placeholder}
              onChange={(e) => setProductInfo(prev => ({ ...prev, [f.key]: e.target.value }))}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
        ))}
      </div>
      <div className="mb-2 text-xs font-bold uppercase tracking-wider text-primary">Assessor Names</div>
      <div className="space-y-3">
        {assessorRows.map(row => (
          <div key={row.key} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_180px] gap-3 items-end">
            <div className="text-sm font-semibold text-foreground">{row.label}</div>
            <label className="block">
              <span className="block text-xs font-medium text-muted-foreground mb-1">Assessor name</span>
              <input
                type="text"
                value={assessors[row.key].name}
                onChange={(e) => setAssessors(prev => ({ ...prev, [row.key]: { ...prev[row.key], name: e.target.value } }))}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </label>
            <label className="block">
              <span className="block text-xs font-medium text-muted-foreground mb-1">End date</span>
              <input
                type="date"
                value={assessors[row.key].endDate}
                onChange={(e) => setAssessors(prev => ({ ...prev, [row.key]: { ...prev[row.key], endDate: e.target.value } }))}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
