import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { TypeBadge } from "@/components/TypeBadge";
import { CATEGORIES, TYPE_INFO, VARIATIONS, type Variation } from "@/lib/variations-data";

export const Route = createFileRoute("/classify-multi")({
  head: () => ({
    meta: [
      { title: "Multi-variation classifier — Combined decision" },
      { name: "description", content: "Classify multiple Type IA / IAIN variations at once and get a single combined final decision." },
    ],
  }),
  component: ClassifyMulti,
});

type ChecksMap = Record<string, boolean[]>; // code -> conditions checked

function ClassifyMulti() {
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);
  const [checks, setChecks] = useState<ChecksMap>({});
  const [opinion, setOpinion] = useState("");

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
        setChecks({ ...checks, [v.code]: new Array(v.conditions.length).fill(false) });
        return [...prev, v.code];
      }
    });
  };

  const setCheck = (code: string, idx: number, val: boolean) => {
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
    const unmet = v.conditions.filter((_, i) => !arr[i]);
    return { v, unmet, accepted: unmet.length === 0 };
  });

  const allAccepted = results.length > 0 && results.every(r => r.accepted);
  const anyRejected = results.some(r => !r.accepted);

  return (
    <div className="min-h-screen">
      <Header />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl font-extrabold text-foreground">Multi-variation classifier</h1>
          <button onClick={reset} className="text-sm text-muted-foreground hover:text-foreground">↻ Restart</button>
        </div>
        <div className="flex gap-2 mb-8">
          {[0, 1, 2].map(i => (
            <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-primary" : "bg-border"}`} />
          ))}
        </div>

        {step === 0 && (
          <Panel title="1. Select one or more variations" subtitle="Tick every variation you want to evaluate together.">
            <div className="space-y-6">
              {CATEGORIES.map(cat => {
                const items = VARIATIONS.filter(v => v.category === cat);
                if (items.length === 0) return null;
                return (
                  <div key={cat}>
                    <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">{cat}</div>
                    <div className="space-y-2">
                      {items.map(v => {
                        const isChecked = selectedCodes.includes(v.code);
                        return (
                          <label key={v.code} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${isChecked ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/50"}`}>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleSelect(v)}
                              className="mt-1 size-4 accent-primary"
                            />
                            <TypeBadge type={v.type} size="sm" />
                            <div className="flex-1 min-w-0">
                              <div className="text-xs text-muted-foreground font-mono">{v.code}</div>
                              <div className="font-bold text-foreground text-sm leading-snug">{v.title}</div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
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
                    {v.conditions.map((c, i) => (
                      <li key={i}>
                        <label className="flex gap-3 p-2.5 rounded-lg bg-muted/40 border border-border cursor-pointer hover:bg-muted/60 transition">
                          <input
                            type="checkbox"
                            checked={(checks[v.code] || [])[i] || false}
                            onChange={(e) => setCheck(v.code, i, e.target.checked)}
                            className="mt-1 size-4 accent-primary"
                          />
                          <span className="text-sm text-foreground flex-1">
                            <span className="font-bold text-primary me-2">{i + 1}.</span>{c}
                          </span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-xl border border-border bg-card p-4">
              <label className="block text-xs font-bold text-foreground mb-1">Reviewer's opinion <span className="text-muted-foreground font-normal">(optional — applies to the combined decision)</span></label>
              <textarea value={opinion} onChange={(e) => setOpinion(e.target.value)} rows={4} placeholder="Combined technical opinion on the submitted dossier..."
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring resize-y" />
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

        {step === 2 && (
          <div className={`rounded-3xl border p-6 sm:p-8 shadow-elegant ${allAccepted ? "border-success/30 bg-success/5" : "border-destructive/30 bg-destructive/5"}`}>
            <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${allAccepted ? "bg-success/20 text-success" : "bg-destructive/15 text-destructive"}`}>
              Combined decision
            </div>
            <h2 className="mt-4 font-display text-2xl font-extrabold text-foreground">
              {allAccepted
                ? `All ${results.length} variation${results.length > 1 ? "s" : ""} approved`
                : `Combined result: ${results.filter(r => !r.accepted).length} of ${results.length} not met`}
            </h2>
            <p className="mt-2 text-muted-foreground">
              {allAccepted
                ? "Every selected variation fulfils its eligibility conditions."
                : "One or more selected variations do not fulfil their eligibility conditions. See breakdown below."}
            </p>

            <div className="mt-5 space-y-3">
              {results.map(({ v, unmet, accepted }) => (
                <div key={v.code} className={`rounded-xl border p-4 ${accepted ? "border-success/30 bg-success/10" : "border-destructive/30 bg-destructive/10"}`}>
                  <div className="flex items-start gap-3">
                    <div className={`shrink-0 rounded-md px-2.5 py-1 text-xs font-mono font-bold ${accepted ? "bg-success/20 text-success" : "bg-destructive/15 text-destructive"}`}>
                      {v.code}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Variation · Type {v.type}</div>
                      <div className="text-sm font-semibold text-foreground leading-snug">{v.title}</div>
                      <div className={`mt-1 text-xs font-bold ${accepted ? "text-success" : "text-destructive"}`}>
                        {accepted ? "✓ All conditions met" : `✗ ${unmet.length} condition${unmet.length > 1 ? "s" : ""} not met`}
                      </div>
                      {!accepted && (
                        <ul className="mt-2 space-y-1">
                          {unmet.map((c, i) => (
                            <li key={i} className="text-xs text-foreground/80">• {c}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {opinion.trim() && (
              <div className="mt-5 rounded-xl border border-border bg-card p-4">
                <div className="text-xs font-bold text-muted-foreground mb-1">Reviewer's opinion</div>
                <p className="text-sm text-foreground whitespace-pre-wrap">{opinion}</p>
              </div>
            )}

            <div className={`mt-6 rounded-2xl border-2 p-5 sm:p-6 ${allAccepted ? "border-success/40 bg-success/10" : "border-destructive/40 bg-destructive/10"}`}>
              <div className={`text-sm font-bold mb-4 ${allAccepted ? "text-success" : "text-destructive"}`}>Final recommendation — per variation</div>
              <div className="space-y-4">
                {results.map(({ v, unmet, accepted }) => (
                  <div key={v.code} className={`rounded-xl border p-4 ${accepted ? "border-success/30 bg-background" : "border-destructive/30 bg-background"}`}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`shrink-0 rounded-md px-2.5 py-1 text-xs font-mono font-bold ${accepted ? "bg-success/20 text-success" : "bg-destructive/15 text-destructive"}`}>
                        {v.code}
                      </div>
                      <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Variation · Type {v.type}</div>
                      <div className={`ml-auto text-xs font-bold ${accepted ? "text-success" : "text-destructive"}`}>
                        {accepted ? "Accepted" : "Rejected"}
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-foreground leading-snug mb-2">{v.title}</div>
                    {accepted ? (
                      <p className="text-sm text-foreground/90 leading-relaxed">
                        Based on the data submitted, this variation is approved. All eligibility conditions are fully met.
                      </p>
                    ) : (
                      <>
                        <p className="text-sm text-foreground/90 leading-relaxed mb-2">
                          Based on the data submitted, this variation is rejected because the following condition{unmet.length > 1 ? "s were" : " was"} not met:
                        </p>
                        <ul className="space-y-1">
                          {unmet.map((c, i) => (
                            <li key={i} className="text-sm text-foreground/85 leading-relaxed">• {c}</li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                ))}
              </div>
              {!allAccepted && (
                <p className="text-sm text-muted-foreground mt-4 leading-relaxed border-t border-destructive/20 pt-4">
                  Reclassify the affected variation(s) as Type IB or Type II, or resubmit with full compliance evidence.
                </p>
              )}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={reset} className="rounded-xl bg-primary text-primary-foreground px-5 py-2.5 font-bold hover:bg-primary/90 transition">
                Start over
              </button>
              <Link to="/catalog" className="rounded-xl border border-border bg-card px-5 py-2.5 font-medium text-foreground hover:bg-muted transition">
                Browse the full catalog
              </Link>
            </div>
          </div>
        )}
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
