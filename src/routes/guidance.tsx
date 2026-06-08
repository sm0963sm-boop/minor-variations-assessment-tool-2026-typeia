import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";

export const Route = createFileRoute("/guidance")({
  head: () => ({
    meta: [
      { title: "Type IA Guidance for New Assessors" },
      {
        name: "description",
        content:
          "A detailed walkthrough of Type IA and IAIN variations for new SFDA assessors: definitions, conditions, documentation, timelines, and review workflow.",
      },
    ],
  }),
  component: GuidancePage,
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-soft">
      <h2 className="font-display text-2xl font-bold text-foreground">{title}</h2>
      <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  );
}

function GuidancePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-16">
        <div className="mb-10">
          <Link to="/" className="text-sm text-primary hover:underline">
            ← Back to home
          </Link>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl font-extrabold leading-tight">
            <span className="bg-hero bg-clip-text text-transparent">
              Type IA Guidance for New Assessors
            </span>
          </h1>
          <p className="mt-4 text-base text-muted-foreground">
            A detailed introduction to Type IA and IAIN variations for assessors new to the
            SFDA Variation Requirements Guideline (Version 6.4). This page explains what
            these changes are, when they apply, and how to evaluate them step by step.
          </p>
        </div>

        <div className="space-y-6">
          <Section title="1. What is a Type IA variation?">
            <p>
              A <strong>Type IA variation</strong> is a <em>minor change</em> to the terms
              of a marketing authorization that has only a minimal impact, or no impact at
              all, on the quality, safety, or efficacy of the medicinal product. Because
              the risk is low, Type IA changes can be implemented by the Marketing
              Authorization Holder (MAH) <strong>before</strong> formal SFDA approval.
            </p>
            <p>
              They follow what is commonly called the <em>"Do and Tell"</em> procedure:
              the MAH implements the change and then notifies the authority within the
              defined timeframe (typically <strong>12 months</strong> of implementation,
              or grouped in the annual notification).
            </p>
          </Section>

          <Section title="2. What is a Type IAIN variation?">
            <p>
              <strong>Type IAIN</strong> stands for "Type IA requiring Immediate
              Notification". It is still a minor variation, but the nature of the change
              means SFDA must be informed <strong>immediately after implementation</strong>{" "}
              — within <strong>14 calendar days</strong>.
            </p>
            <p>
              Typical examples include changes affecting the manufacturing site, the
              qualitative composition of the immediate packaging, or any change that could
              affect pharmacovigilance traceability.
            </p>
          </Section>

          <Section title="3. Core conditions an assessor must verify">
            <ul className="list-disc pl-5 space-y-2">
              <li>
                The change matches a specific variation code listed in the SFDA
                guideline.
              </li>
                <li>
                <strong>All</strong> conditions for that code are met — if even one
                condition is not satisfied, the change cannot be classified as Type IA
                and must be escalated (often to Type IB or Type II).
              </li>
              <li>All required supporting documentation is provided.</li>
              <li>
                Implementation dates and notification dates fall within the allowed
                window (12 months for IA, 14 days for IAIN).
              </li>
            </ul>
          </Section>

          <Section title="4. Typical documentation to expect">
            <ul className="list-disc pl-5 space-y-2">
              <li>Cover letter describing the change and the variation code claimed.</li>
              <li>Present / Proposed comparison table.</li>
              <li>Updated Module 1 administrative documents (when applicable).</li>
              <li>
                Updated Module 3 quality sections (specifications, manufacturing,
                stability) for CMC changes.
              </li>
              <li>Declaration that all conditions of the variation code are fulfilled.</li>
            </ul>
          </Section>

          <Section title="5. Assessment workflow (recommended)">
            <ol className="list-decimal pl-5 space-y-2">
              <li>Identify the variation code claimed by the MAH.</li>
              <li>Read the conditions and documentation requirements in the guideline.</li>
              <li>
                Use this tool to walk through the conditions one by one and capture your
                technical opinion.
              </li>
              <li>
                Decide: <strong>Accept</strong> as Type IA / IAIN,{" "}
                <strong>Reject</strong>, or <strong>Reclassify</strong> to a higher
                category.
              </li>
              <li>Document the rationale clearly in the assessment report.</li>
            </ol>
          </Section>

          <Section title="6. Common pitfalls">
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Accepting a Type IA when one or more conditions are not met — the default
                must be to reclassify.
              </li>
              <li>
                Confusing IA (annual / 12 months) with IAIN (immediate / 14 days)
                notification windows.
              </li>
              <li>
                Missing the present/proposed comparison, which is essential to evaluate
                the actual scope of the change.
              </li>
              <li>
                Treating editorial corrections as variations when they are not within the
                scope of the guideline.
              </li>
            </ul>
          </Section>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-5 text-sm text-emerald-900">
            Reminder: this guidance is educational. The official SFDA Variation
            Requirements Guideline (Version 6.4) remains the binding reference, and the
            final assessment decision is the sole responsibility of the assessor.
          </div>

          <div className="flex flex-wrap gap-3 pt-4">
            <Link
              to="/classify-multi"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-base font-bold text-primary-foreground shadow-elegant hover:shadow-soft hover:-translate-y-px transition"
            >
              Start an assessment →
            </Link>
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-base font-medium text-foreground hover:bg-muted transition"
            >
              Browse the catalog
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
