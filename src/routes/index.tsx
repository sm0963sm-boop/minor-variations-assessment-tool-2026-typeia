import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { TYPE_INFO, VARIATIONS } from "@/lib/variations-data";
import { TypeBadge } from "@/components/TypeBadge";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Type IA Variation Assessment Tool" },
      { name: "description", content: "Classify Type IA / IAIN change requests on registered medicinal products per the SFDA Variation Requirements Guideline." },
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
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24 relative">
          <div className="max-w-3xl">
            <div className="mt-2 rounded-xl border border-emerald-200 bg-emerald-50/80 p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                  <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-emerald-900 font-medium leading-relaxed">
                    This is a guided decision-support tool based on the SFDA Guidelines for Variation Requirements Version 6.4.
                  </p>
                  <div className="h-px bg-emerald-200/60" />
                  <p className="text-sm text-emerald-800/90 leading-relaxed">
                    This tool is intended to support the evaluation process; however, the overall assessment and final decision remain the sole responsibility of the assessor.
                  </p>
                </div>
              </div>
            </div>
            <h1 className="mt-6 font-display text-4xl sm:text-6xl font-extrabold leading-[1.1] text-foreground">
              <span className="bg-hero bg-clip-text text-transparent">Type IA Variation Assessment Tool</span>
            </h1>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/classify-multi" className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-base font-bold text-primary-foreground shadow-elegant hover:shadow-soft hover:-translate-y-px transition">
                Start →
              </Link>
              <Link to="/catalog" className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-base font-medium text-foreground hover:bg-muted transition">
                Browse the catalog
              </Link>
            </div>
          </div>

          <div className="mt-14 grid gap-4 sm:grid-cols-2">
            {(["IA", "IAIN"] as const).map((t) => (
              <div key={t} className="rounded-2xl border border-border bg-card-gradient p-6 shadow-soft hover:shadow-elegant transition">
                <TypeBadge type={t} size="lg" />
                <h3 className="mt-4 font-display font-bold text-lg text-foreground">{TYPE_INFO[t].label}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{TYPE_INFO[t].description}</p>
                <div className="mt-4 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{TYPE_INFO[t].timeline}</span>
                  <span className="font-bold text-foreground">{counts[t]} variations</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16 border-t border-border/60">
        <div className="grid gap-8 sm:grid-cols-3">
          {[
            { t: "Step-by-step", d: "Answer guided questions to identify the exact Type IA classification." },
            { t: "Reviewer opinion", d: "Capture the reviewer's technical opinion alongside the system output." },
            { t: "Final recommendation", d: "Issue a clear final recommendation: accept, reject, or reclassify." },
          ].map((f) => (
            <div key={f.t} className="rounded-xl p-6 bg-card/50 border border-border/40">
              <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold mb-3">✓</div>
              <h3 className="font-display font-bold text-foreground">{f.t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border/60 py-8 text-center text-xs text-muted-foreground">
        Advisory tool only — the official SFDA Variation Requirements Guideline remains the binding reference.
      </footer>
    </div>
  );
}
