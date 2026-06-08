import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { TypeBadge } from "@/components/TypeBadge";
import { CATEGORIES, TYPE_INFO, VARIATIONS, type Variation } from "@/lib/variations-data";

export const Route = createFileRoute("/classify")({
  head: () => ({
    meta: [
      { title: "Type IA Variation Assessment Tool" },
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
  • Submit revised documentation demonstrating full compliance with the unmet condition(s).

This decision is issued in accordance with the SFDA Variation Requirements Guideline for Registered Pharmaceutical Products.

Reviewer: ${refReviewer}
Regulatory Affairs — Variations Assessment
`;
}

type CondStatus = "met" | "unmet" | "na";

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

/** Annotates a condition based on product context. Never hides conditions. */
function annotateCondition(text: string, form: DosageForm | null, sterile: boolean | null): Annotation {
  const t = text.toLowerCase();
  if (/\bsteril/.test(t)) {
    if (sterile === true) return { kind: "applies", reason: "Product is sterile — sterility wording is in scope." };
    if (sterile === false) return { kind: "not-applies", reason: "Product is non-sterile — sterility wording does not apply." };
  }
  if (/\bbiologic|biotech|vaccine\b/.test(t))
    return { kind: "review", reason: "Mentions biological/biotech — confirm product type manually." };
  if (/inhalation|inhaler|nebuli/.test(t)) {
    if (form === "inhalation") return { kind: "applies", reason: "Condition targets inhalation products." };
    if (form) return { kind: "not-applies", reason: `Condition is for inhalation products, not your ${form} form.` };
  }
  if (/ophthalmic|ocular|eye drop/.test(t)) {
    if (form === "ophthalmic") return { kind: "applies", reason: "Condition targets ophthalmic products." };
    if (form) return { kind: "not-applies", reason: `Condition is for ophthalmic products, not your ${form} form.` };
  }
  if (/modified[- ]release|prolonged[- ]release|extended[- ]release|controlled[- ]release/.test(t))
    return { kind: "review", reason: "Mentions modified-release — verify against the product's release profile." };
  if (/\b(tablet|capsule|solid dosage)\b/.test(t)) {
    if (form === "solid-oral") return { kind: "applies", reason: "Condition targets solid oral forms." };
    if (form) return { kind: "not-applies", reason: `Condition is for solid oral forms, not your ${form} form.` };
  }
  return { kind: "review", reason: "No product-context match — reviewer judgment required." };
}

function Classify() {
  const [step, setStep] = useState(0);
  const [dosageForm, setDosageForm] = useState<DosageForm | null>(null);
  const [sterile, setSterile] = useState<boolean | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [picked, setPicked] = useState<Variation | null>(null);
  const [status, setStatus] = useState<CondStatus[]>([]);
  const [productName, setProductName] = useState("");
  const [applicant, setApplicant] = useState("");
  const [reviewer, setReviewer] = useState("");
  const [opinion, setOpinion] = useState("");
  const [copied, setCopied] = useState(false);

  const inCategory = useMemo(() => VARIATIONS.filter(v => v.category === category), [category]);

  const reset = () => {
    setStep(0); setDosageForm(null); setSterile(null);
    setCategory(null); setPicked(null); setStatus([]); setOpinion(""); setCopied(false);
  };

  const choose = (v: Variation) => {
    setPicked(v);
    setStatus(new Array(v.conditions.length).fill("unmet"));
    setStep(3);
  };

  const allMet = picked && status.length > 0 && status.every(s => s !== "unmet");
  const unmet = picked ? picked.conditions.filter((_, i) => status[i] === "unmet") : [];

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
          <h1 className="font-display text-3xl font-extrabold text-foreground">Classifier</h1>
        </div>
        <div className="flex gap-2 mb-8">
          {[0, 1, 2, 3, 4].map(i => (
            <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-primary" : "bg-border"}`} />
          ))}
        </div>

        {step === 0 && (
          <Panel title="1. Product context" subtitle="Tell the system about the product so it can flag which conditions actually apply later.">
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
          <Panel title="2. Select the change category" subtitle="What is the scope of your change request?">
            <div className="grid gap-3 sm:grid-cols-2">
              {CATEGORIES.map(c => (
                <button key={c} onClick={() => { setCategory(c); setStep(2); }}
                  className="text-left rounded-xl border border-border bg-card hover:border-primary hover:shadow-soft p-4 transition">
                  <div className="font-bold text-foreground">{c}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {VARIATIONS.filter(v => v.category === c).length} variations
                  </div>
                </button>
              ))}
            </div>
            <button onClick={() => setStep(0)} className="mt-4 text-sm text-muted-foreground hover:text-foreground">← Back</button>
          </Panel>
        )}

        {step === 2 && category && (
          <Panel title="3. Pick the specific variation" subtitle={`Category: ${category}`}>
            <div className="space-y-4">
              <select
                className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer"
                value={picked?.code || ""}
                onChange={(e) => {
                  const v = inCategory.find(x => x.code === e.target.value);
                  if (v) choose(v);
                }}
              >
                <option value="" disabled>Choose a variation…</option>
                {inCategory.map(v => (
                  <option key={v.code} value={v.code}>
                    {v.code} — {v.title} (Type {v.type})
                  </option>
                ))}
              </select>
            </div>
            <button onClick={() => setStep(1)} className="mt-4 text-sm text-muted-foreground hover:text-foreground">← Back</button>
          </Panel>
        )}

        {step === 3 && picked && (
          <Panel title="4. Verify eligibility conditions" subtitle="Every SFDA condition is shown. The system flags which ones likely apply based on your product context.">
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 mb-4 text-xs text-foreground">
              <span className="font-bold">Product context:</span>{" "}
              {DOSAGE_FORMS.find(d => d.value === dosageForm)?.label} ·{" "}
              {sterile ? "Sterile" : "Non-sterile"}
            </div>
            <ul className="space-y-2.5 mb-6">
              {picked.conditions.map((c, i) => {
                const s = status[i] || "unmet";
                const setS = (val: CondStatus) => {
                  const next = [...status]; next[i] = val; setStatus(next);
                };
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
                  <li key={i} className={`p-3 rounded-lg border ${s === "na" ? "bg-muted/20 border-border opacity-70" : "bg-muted/40 border-border"}`}>
                    <div className="flex gap-3 items-start">
                      <span className="text-sm text-foreground flex-1">
                        <span className="font-bold text-primary me-2">{i + 1}.</span>{c}
                      </span>
                    </div>
                    <div className={`mt-2 inline-flex items-center gap-1.5 text-[11px] font-bold px-2 py-1 rounded-md border ${annCfg.cls}`}>
                      <span>{annCfg.icon}</span><span>{annCfg.label}</span>
                    </div>
                    <div className="mt-1 text-[11px] text-muted-foreground italic">{ann.reason}</div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {opts.map(o => (
                        <button
                          key={o.val}
                          type="button"
                          onClick={() => setS(o.val)}
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
                <label className="block text-sm font-extrabold text-foreground mb-1">Reviewer's opinion <span className="text-muted-foreground font-normal text-xs">(optional)</span></label>
                <textarea
                  value={opinion}
                  onChange={(e) => setOpinion(e.target.value)}
                  rows={4}
                  placeholder="Enter your reviewer's opinion (optional). This will be printed before the final recommendation."
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring resize-y"
                />
              </div>
            </div>

            <button onClick={() => setStep(4)}
              className="w-full rounded-xl bg-primary text-primary-foreground py-3 font-bold shadow-soft hover:bg-primary/90 transition">
              Generate result →
            </button>
            <button onClick={() => setStep(2)} className="mt-4 text-sm text-muted-foreground hover:text-foreground">← Back</button>
          </Panel>
        )}

        {step === 4 && picked && (
          <div className="rounded-3xl border border-border bg-card-gradient p-6 sm:p-8 shadow-elegant">
            {allMet ? (
              <AcceptanceView picked={picked} opinion={opinion} />
            ) : (
              <RejectionView picked={picked} unmet={unmet} status={status} opinion={opinion} />
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
  picked, unmet, status, opinion,
}: {
  picked: Variation;
  unmet: string[];
  status: CondStatus[];
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
            const s = status[i] || "unmet";
            const cfg = s === "met"
              ? { icon: "✓", bg: "bg-success/10", color: "text-success", label: "Met" }
              : s === "na"
              ? { icon: "—", bg: "bg-muted", color: "text-muted-foreground", label: "N/A" }
              : { icon: "✗", bg: "bg-destructive/5", color: "text-destructive", label: "Not met" };
            return (
              <li key={i} className={`flex gap-2 text-sm p-2 rounded-lg ${cfg.bg}`}>
                <span className={`font-bold ${cfg.color}`}>{cfg.icon}</span>
                <span className="text-foreground flex-1">{c}</span>
                <span className={`text-xs font-bold ${cfg.color}`}>{cfg.label}</span>
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
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5">
          <div className="flex items-start gap-4 mb-5">
            <div className="shrink-0 rounded-md bg-destructive/15 text-destructive px-3 py-1.5 text-sm font-mono font-bold">
              {picked.code}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Variation</div>
              <div className="text-base font-semibold text-foreground leading-snug">{picked.title}</div>
            </div>
          </div>
          <div className="border-t-2 border-destructive/20 pt-4">
            <div className="text-sm font-bold text-destructive mb-2">Final recommendation</div>
            <p className="text-base text-foreground font-bold leading-relaxed">
              Based on the data submitted, the proposed variation is rejected, the following condition{unmet.length > 1 ? "s were" : " was"} not met:
            </p>
            <ul className="mt-3 space-y-2">
              {unmet.map((c, i) => (
                <li key={i} className="text-sm text-foreground/80 leading-relaxed">• {c}</li>
              ))}
            </ul>
          </div>
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
        <div className="rounded-xl border border-success/30 bg-success/10 p-5">
          <div className="flex items-start gap-4 mb-5">
            <div className="shrink-0 rounded-md bg-success/20 text-success px-3 py-1.5 text-sm font-mono font-bold">
              {picked.code}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Variation</div>
              <div className="text-base font-semibold text-foreground leading-snug">{picked.title}</div>
            </div>
          </div>
          <div className="border-t-2 border-success/20 pt-4">
            <div className="text-sm font-bold text-success-foreground mb-2">Final recommendation</div>
            <p className="text-base text-foreground font-bold leading-relaxed">Based on the data submitted, the proposed variation is approved.</p>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{TYPE_INFO[picked.type].timeline}.</p>
          </div>
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
