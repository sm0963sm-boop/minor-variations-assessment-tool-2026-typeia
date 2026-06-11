import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { TYPE_INFO, VARIATIONS } from "@/lib/variations-data";
import { TypeBadge } from "@/components/TypeBadge";
import heroIllustration from "@/assets/hero-illustration.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Minor Variations Assessment Tool" },
      { name: "description", content: "Assess Type IA / IAIN / IB minor variation requests on registered medicinal products per the SFDA Variation Requirements Guideline." },
    ],
  }),
  component: Home,
});

function Home() {
  const counts = {
    IA: VARIATIONS.filter(v => v.type === "IA").length,
    IAIN: VARIATIONS.filter(v => v.type === "IAIN").length,
  };

  return (
    <div className="min-h-screen">
      <Header />
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero opacity-[0.07]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16 relative">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div className="max-w-3xl">
              <h1 className="font-display text-4xl sm:text-6xl font-extrabold leading-[1.1] text-foreground">
                <span className="bg-hero bg-clip-text text-transparent">Minor Variations Assessment Tool</span>
              </h1>
              <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed">
                This tool was developed by the Generic Products Directorate to support the scientific assessment process
              </p>
              <div className="mt-8">
                <Link
                  to="/classify-multi"
                  className="group relative inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-primary to-primary/80 px-10 py-5 text-xl font-extrabold text-primary-foreground shadow-elegant ring-2 ring-primary/30 ring-offset-4 ring-offset-background hover:shadow-soft hover:-translate-y-0.5 transition-all"
                >
                  <span className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-primary to-primary/60 opacity-40 blur group-hover:opacity-60 transition" aria-hidden />
                  <span className="relative">Start</span>
                  <span className="relative text-2xl">→</span>
                </Link>
              </div>
              <div className="mt-8 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100/40 p-6 shadow-soft">
                <div className="flex items-start gap-4">
                  <div className="mt-0.5 flex-shrink-0 w-10 h-10 rounded-full bg-emerald-500/10 ring-1 ring-emerald-300 flex items-center justify-center">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="space-y-3">
                    <p className="text-sm sm:text-base text-emerald-900 font-semibold leading-relaxed">
                      This is a guided decision-support tool based on the SFDA Guidelines for Variation Requirements Version 6.4.
                    </p>
                    <div className="h-px bg-emerald-200/70" />
                    <p className="text-sm sm:text-base text-red-400 leading-relaxed">
                      This tool is intended to support the evaluation process; however, the overall assessment and final decision remain the sole responsibility of the assessor.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <img
                src={heroIllustration}
                alt="Pharmaceutical assessor reviewing a Type IA variation request with floating documents, checklist, medicine bottle, approval badge and guideline icon"
                width={1024}
                height={1024}
                className="w-full max-w-md lg:max-w-lg h-auto select-none pointer-events-none"
                draggable={false}
              />
            </div>
          </div>



          <div className="mt-16">
            <div className="text-center mb-10">
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-foreground">How it works</h2>
              <p className="mt-2 text-muted-foreground">Four guided steps from variation selection to final decision</p>
            </div>
            <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { n: "1", title: "Select variation(s)", desc: "Choose any Type IA, IAIN, or IB change(s) you want to assess." },
                { n: "2", title: "Verify Type IA conditions", desc: "For Type IA / IAIN variations, confirm that all required conditions are met. Skipped for Type IB." },
                { n: "3", title: "Verify documentation", desc: "Check required documents for Type IB and for Type IA / IAIN variations that met all conditions." },
                { n: "4", title: "Final decision", desc: "Per-variation recommendation: approved, suspended, or rejected." },
              ].map((s) => (
                <li key={s.n} className="relative rounded-2xl border border-border bg-card p-6 pt-8 shadow-soft hover:shadow-elegant transition">
                  <div className="absolute -top-4 left-6 inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-display font-extrabold shadow-elegant">
                    {s.n}
                  </div>
                  <h3 className="mt-2 font-display font-bold text-lg text-foreground">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <div className="border-t border-border/60 py-10 text-center">
        <p className="text-sm text-muted-foreground leading-relaxed">
          For any comments, suggestions, or feedback regarding this tool, please contact:
        </p>
        <p className="mt-2 text-base font-semibold text-foreground">
          Salem Al Muhaydi
        </p>
        <a
          href="mailto:smmhediy@sfda.gov.sa"
          className="mt-1 inline-block text-sm text-primary hover:underline"
        >
          Email: smmhediy@sfda.gov.sa
        </a>
      </div>

      <footer className="border-t border-border/60 py-8 text-center text-xs text-muted-foreground">
        Advisory tool only — the official SFDA Variation Requirements Guideline remains the binding reference.
      </footer>
    </div>
  );
}
