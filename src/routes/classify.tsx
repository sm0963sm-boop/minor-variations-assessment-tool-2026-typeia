import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { TypeBadge } from "@/components/TypeBadge";
import { CATEGORIES, TYPE_INFO, VARIATIONS, type Variation } from "@/lib/variations-data";

export const Route = createFileRoute("/classify")({
  head: () => ({
    meta: [
      { title: "Variation Classifier — Interactive" },
      { name: "description", content: "Guided tool to determine the variation type per SFDA, with auto-generated rejection drafts for unmet conditions." },
    ],
  }),
  component: Classify,
});

function buildAcceptance(v: Variation, productName: string, applicant: string, reviewer: string, opinion: string) {
  const today = new Date().toISOString().slice(0, 10);
  const refProduct = productName.trim() || "[Product Name]";
  const refApplicant = applicant.trim() || "[Applicant / MAH]";
  const refReviewer = reviewer.trim() || "[Reviewer Name]";
  const refOpinion = opinion.trim() || "All eligibility conditions have been verified and supporting documentation is adequate.";
  return `Date: ${today}
Applicant / MAH: ${refApplicant}
Product: ${refProduct}
Variation reference: ${v.code} — ${v.title}
Classification: Type ${v.type}

Subject: Acceptance of the proposed Type ${v.type} variation

Dear Applicant,

Upon technical review of the submitted change request against the SFDA Variation Requirements Guideline, the change qualifies as a Type ${v.type} variation (${v.code}). All eligibility conditions for this category are fulfilled.

Reviewer's opinion:
${refOpinion}

Final recommendation:
  • ACCEPT as Type ${v.type}.
  • Procedural pathway: ${TYPE_INFO[v.type].timeline}.
  • The applicant shall ensure that all supporting documentation listed in the guideline is maintained in the dossier.

This decision is issued in accordance with the SFDA Variation Requirements Guideline for Registered Pharmaceutical Products.

Reviewer: ${refReviewer}
Regulatory Affairs — Variations Assessment
`;
}

function buildRejection(v: Variation, unmet: string[], productName: string, applicant: string, reviewer: string, opinion: string) {
  const today = new Date().toISOString().slice(0, 10);
  const refProduct = productName.trim() || "[Product Name]";
  const refApplicant = applicant.trim() || "[Applicant / MAH]";
  const refReviewer = reviewer.trim() || "[Reviewer Name]";
  const refOpinion = opinion.trim() || "One or more mandatory eligibility conditions for the proposed Type IA classification are not fulfilled based on the submitted documentation.";
  const bullets = unmet.map((c, i) => `   ${i + 1}. ${c}`).join("\n");
  return `Date: ${today}
Applicant / MAH: ${refApplicant}
Product: ${refProduct}
Variation reference: ${v.code} — ${v.title}
Proposed classification: Type ${v.type}

Subject: Non-acceptance of the proposed Type ${v.type} variation

Dear Applicant,

Upon technical review of the submitted change request against the SFDA Variation Requirements Guideline, the proposed classification as a Type ${v.type} variation (${v.code}) cannot be accepted.

The following eligibility condition(s) required for this variation category are not fulfilled:

${bullets}

Reviewer's opinion:
${refOpinion}

Final recommendation:
  • REJECT the proposed Type ${v.type} classification.
  • Submit revised documentation demonstrating full compliance with the unmet condition(s), or
  • Reclassify the change as a Type IB or Type II variation and submit it with the corresponding scientific dossier for full evaluation prior to implementation.

This decision is issued in accordance with the SFDA Variation Requirements Guideline for Registered Pharmaceutical Products.

Reviewer: ${refReviewer}
Regulatory Affairs — Variations Assessment
`;
}

function Classify() {
  const [step, setStep] = useState(0);
  const [category, setCategory] = useState<string | null>(null);
  const [picked, setPicked] = useState<Variation | null>(null);
  const [checked, setChecked] = useState<boolean[]>([]);
  const [productName, setProductName] = useState("");
  const [applicant, setApplicant] = useState("");
  const [reviewer, setReviewer] = useState("");
  const [opinion, setOpinion] = useState("");
  const [copied, setCopied] = useState(false);

  const inCategory = useMemo(() => VARIATIONS.filter(v => v.category === category), [category]);

  const reset = () => {
    setStep(0); setCategory(null); setPicked(null); setChecked([]); setOpinion(""); setCopied(false);
  };

  const choose = (v: Variation) => {
    setPicked(v);
    setChecked(new Array(v.conditions.length).fill(false));
    setStep(2);
  };

  const allMet = picked && checked.length > 0 && checked.every(Boolean);
  const unmet = picked ? picked.conditions.filter((_, i) => !checked[i]) : [];

  return (
    <div className="min-h-screen">
      <Header />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl font-extrabold text-foreground">Classifier</h1>
          <button onClick={reset} className="text-sm text-muted-foreground hover:text-foreground">↻ Restart</button>
        </div>
        <div className="flex gap-2 mb-8">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-primary" : "bg-border"}`} />
          ))}
        </div>

        {step === 0 && (
          <Panel title="1. Select the change category" subtitle="What is the scope of your change request?">
            <div className="grid gap-3 sm:grid-cols-2">
              {CATEGORIES.map(c => (
                <button key={c} onClick={() => { setCategory(c); setStep(1); }}
                  className="text-left rounded-xl border border-border bg-card hover:border-primary hover:shadow-soft p-4 transition">
                  <div className="font-bold text-foreground">{c}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {VARIATIONS.filter(v => v.category === c).length} variations
                  </div>
                </button>
              ))}
            </div>
          </Panel>
        )}

        {step === 1 && category && (
          <Panel title="2. Pick the specific variation" subtitle={`Category: ${category}`}>
            <div className="space-y-2">
              {inCategory.map(v => (
                <button key={v.code} onClick={() => choose(v)}
                  className="w-full text-left rounded-xl border border-border bg-card hover:border-primary hover:bg-muted/30 p-4 transition flex items-start gap-3">
                  <TypeBadge type={v.type} size="sm" />
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground font-mono">{v.code}</div>
                    <div className="font-bold text-foreground mt-0.5">{v.title}</div>
                  </div>
                </button>
              ))}
            </div>
            <button onClick={() => setStep(0)} className="mt-4 text-sm text-muted-foreground hover:text-foreground">← Back</button>
          </Panel>
        )}

        {step === 2 && picked && (
          <Panel title="3. Verify eligibility conditions" subtitle="Tick every condition that is fully met for your case.">
            <ul className="space-y-2.5 mb-6">
              {picked.conditions.map((c, i) => (
                <li key={i}>
                  <label className="flex gap-3 p-3 rounded-lg bg-muted/40 border border-border cursor-pointer hover:bg-muted/60 transition">
                    <input
                      type="checkbox"
                      checked={checked[i] || false}
                      onChange={(e) => {
                        const next = [...checked]; next[i] = e.target.checked; setChecked(next);
                      }}
                      className="mt-1 size-4 accent-primary"
                    />
                    <span className="text-sm text-foreground flex-1">
                      <span className="font-bold text-primary me-2">{i + 1}.</span>{c}
                    </span>
                  </label>
                </li>
              ))}
            </ul>

            <div className="rounded-xl border border-border bg-card p-4 mb-4 grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-foreground mb-1">Product name <span className="text-muted-foreground font-normal">(optional)</span></label>
                <input value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="e.g., Paracetamol 500 mg Tablets"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="block text-xs font-bold text-foreground mb-1">Applicant / MAH <span className="text-muted-foreground font-normal">(optional)</span></label>
                <input value={applicant} onChange={(e) => setApplicant(e.target.value)} placeholder="e.g., ACME Pharma Co."
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="block text-xs font-bold text-foreground mb-1">Reviewer name <span className="text-muted-foreground font-normal">(optional)</span></label>
                <input value={reviewer} onChange={(e) => setReviewer(e.target.value)} placeholder="e.g., Dr. A. Reviewer"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-foreground mb-1">Reviewer's opinion <span className="text-muted-foreground font-normal">(optional — included in the final statement)</span></label>
                <p className="text-[11px] text-muted-foreground mb-1.5">
                  Please include: (1) verification of submitted documents, (2) assessment of eligibility conditions, (3) any deviations or gaps noted, (4) scientific/technical justification, and (5) references to applicable SFDA guideline sections.
                </p>
                <textarea value={opinion} onChange={(e) => setOpinion(e.target.value)} rows={5} placeholder="Technical opinion on the submitted dossier..."
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring resize-y" />
              </div>
            </div>

            <button onClick={() => setStep(3)}
              className="w-full rounded-xl bg-primary text-primary-foreground py-3 font-bold shadow-soft hover:bg-primary/90 transition">
              Generate result →
            </button>
            <button onClick={() => setStep(1)} className="mt-4 text-sm text-muted-foreground hover:text-foreground">← Back</button>
          </Panel>
        )}

        {step === 3 && picked && (
          <div className="rounded-3xl border border-border bg-card-gradient p-6 sm:p-8 shadow-elegant">
            {allMet ? (
              <AcceptanceView
                picked={picked}
                opinion={opinion}
              />
            ) : (
              <RejectionView
                picked={picked}
                unmet={unmet}
                opinion={opinion}
              />
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={reset} className="rounded-xl bg-primary text-primary-foreground px-5 py-2.5 font-bold hover:bg-primary/90 transition">
                Classify another change
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

function RejectionView({
  picked, unmet, opinion,
}: {
  picked: Variation;
  unmet: string[];
  opinion: string;
}) {
  const defaultOpinion = unmet.length
    ? `The following eligibility condition${unmet.length > 1 ? "s" : ""} required for a Type ${picked.type} classification ${unmet.length > 1 ? "are" : "is"} not fulfilled based on the submitted documentation:\n\n${unmet.map((c, i) => `${i + 1}. ${c}`).join("\n")}\n\nTherefore, the proposed change cannot be accepted as Type ${picked.type}.`
    : "One or more mandatory conditions for Type IA classification are not fulfilled.";

  return (
    <>
      <div className="inline-flex items-center gap-2 rounded-full bg-destructive/10 text-destructive px-3 py-1 text-xs font-bold">
        Does not qualify as Type {picked.type}
      </div>
      <h2 className="mt-4 font-display text-2xl font-extrabold text-foreground">
        {unmet.length} condition{unmet.length > 1 ? "s" : ""} not met for {picked.code}
      </h2>
      <p className="mt-2 text-muted-foreground">
        The proposed variation cannot be classified as Type {picked.type}. A formal rejection statement with the reviewer's opinion and the final recommendation has been generated below.
      </p>

      <div className="mt-5 rounded-xl border border-border bg-card p-4">
        <div className="text-xs font-bold text-foreground mb-3">Conditions checklist</div>
        <ul className="space-y-2">
          {picked.conditions.map((c, i) => {
            const isMet = !unmet.includes(c);
            return (
              <li key={i} className={`flex gap-2 text-sm p-2 rounded-lg ${isMet ? "bg-success/10" : "bg-destructive/5"}`}>
                <span className={`font-bold ${isMet ? "text-success" : "text-destructive"}`}>
                  {isMet ? "✓" : "✗"}
                </span>
                <span className={isMet ? "text-foreground" : "text-foreground"}>{c}</span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-muted/30 p-4">
          <div className="text-xs font-bold text-muted-foreground mb-1">Reviewer's opinion</div>
          <p className="text-sm text-foreground whitespace-pre-wrap">
            {opinion.trim() || defaultOpinion}
          </p>
        </div>
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4">
          <div className="text-xs font-bold text-muted-foreground mb-1">Variation</div>
          <p className="text-sm text-foreground font-medium mb-3">{picked.code} — {picked.title}</p>
          <div className="text-xs font-bold text-destructive mb-1">Final recommendation</div>
          <p className="text-sm text-foreground font-bold">
            Based on the data submitted, the proposed variation is rejected, the following condition{unmet.length > 1 ? "s were" : " was"} not met:
          </p>
          <ul className="mt-2 space-y-1">
            {unmet.map((c, i) => (
              <li key={i} className="text-xs text-muted-foreground">• {c}</li>
            ))}
          </ul>
          <p className="text-xs text-muted-foreground mt-3">Reclassify as Type IB or Type II, or resubmit with full compliance evidence.</p>
        </div>
      </div>
    </>
  );
}

function AcceptanceView({
  picked, opinion,
}: {
  picked: Variation;
  opinion: string;
}) {
  return (
    <>
      <div className="text-xs text-muted-foreground">Classification result</div>
      <div className="mt-3"><TypeBadge type={picked.type} size="lg" /></div>
      <h2 className="mt-4 font-display text-2xl font-extrabold text-foreground">{TYPE_INFO[picked.type].label}</h2>
      <p className="mt-2 text-muted-foreground">{TYPE_INFO[picked.type].description}</p>

      <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-4">
        <div className="text-xs font-bold text-primary mb-1">Procedural timeline</div>
        <div className="text-sm text-foreground">{TYPE_INFO[picked.type].timeline}</div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-muted/30 p-4">
          <div className="text-xs font-bold text-muted-foreground mb-1">Reviewer's opinion</div>
          <p className="text-sm text-foreground whitespace-pre-wrap">
            {opinion.trim() || "All eligibility conditions have been verified and supporting documentation is adequate."}
          </p>
        </div>
        <div className="rounded-xl border border-success/30 bg-success/10 p-4">
          <div className="text-xs font-bold text-muted-foreground mb-1">Variation</div>
          <p className="text-sm text-foreground font-medium mb-3">{picked.code} — {picked.title}</p>
          <div className="text-xs font-bold text-success-foreground mb-1">Final recommendation</div>
          <p className="text-sm text-foreground font-bold">Based on the data submitted, the proposed variation is approved.</p>
          <p className="text-xs text-muted-foreground mt-1">{TYPE_INFO[picked.type].timeline}.</p>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-bold text-foreground mb-2">Required documents</h3>
        <ul className="space-y-1.5">
          {picked.documents.map((d, i) => (
            <li key={i} className="flex gap-2 text-sm text-muted-foreground"><span className="text-primary">📄</span>{d}</li>
          ))}
        </ul>
      </div>

      <div className="mt-6 text-xs text-muted-foreground">
        Reference: <code className="font-mono bg-muted px-1.5 py-0.5 rounded">{picked.code}</code> — {picked.category}
      </div>
    </>
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
