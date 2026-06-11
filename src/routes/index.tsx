import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { TYPE_INFO, VARIATIONS } from "@/lib/variations-data";
import { TypeBadge } from "@/components/TypeBadge";
import heroIllustration from "@/assets/hero-illustration.png";

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
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16 relative">
          <div className="max-w-3xl">
            <h1 className="font-display text-4xl sm:text-6xl font-extrabold leading-[1.1] text-foreground">
              <span className="bg-hero bg-clip-text text-transparent">Type IA Variation Assessment Tool</span>
            </h1>
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
            <div className="mt-5 flex flex-wrap gap-3">
              <Link to="/catalog" className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-base font-medium text-foreground hover:bg-muted transition">
                Browse the catalog
              </Link>
              <Link to="/guidance" className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-base font-medium text-foreground hover:bg-muted transition">
                Type IA Guidance for New Assessors
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

          {/* Editorial Workflow — bold typographic timeline */}
          <div className="mt-12">
            <div className="flex items-end justify-between mb-6 border-b border-border/60 pb-3">
              <div>
                <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-muted-foreground">How it works</p>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">The Workflow</h2>
              </div>
              <span className="hidden sm:block font-mono text-[11px] text-muted-foreground">01 — 04</span>
            </div>

            <div className="relative">
              {/* dashed timeline */}
              <div className="hidden lg:block absolute top-10 left-0 right-0 h-px border-t border-dashed border-border" />

              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
                {[
                  { n: "01", t: "Select Variation",       d: "Pick variations from the SFDA catalog.", accent: "text-sky-500",     bar: "bg-sky-500" },
                  { n: "02", t: "Check Conditions",       d: "Answer yes/no questions.",               accent: "text-violet-500",  bar: "bg-violet-500" },
                  { n: "03", t: "Assessor Opinion",       d: "AI analysis of unmet conditions.",       accent: "text-indigo-500",  bar: "bg-indigo-500" },
                  { n: "04", t: "Final Recommendation",   d: "Accept or Reject outcome.",              accent: "text-emerald-500", bar: "bg-emerald-500" },
                ].map((s) => (
                  <div key={s.n} className="group relative">
                    {/* node on timeline */}
                    <div className="hidden lg:flex absolute -top-[5px] left-0 size-[11px] rounded-full bg-background border-2 border-foreground" />

                    <div className="relative pt-6 lg:pt-10">
                      {/* huge ghost numeral */}
                      <div className={`font-display font-black text-[5rem] leading-none ${s.accent} opacity-15 group-hover:opacity-30 transition select-none`}>
                        {s.n}
                      </div>
                      <div className={`mt-3 h-[3px] w-10 ${s.bar} group-hover:w-20 transition-all duration-300`} />
                      <h3 className="mt-3 font-display font-bold text-base text-foreground tracking-tight">
                        {s.t}
                      </h3>
                      <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                        {s.d}
                      </p>
                      <p className={`mt-2 font-mono text-[10px] uppercase tracking-widest ${s.accent}`}>
                        Step {s.n}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
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

      <footer className="border-t border-border/60 py-8 text-center text-xs text-muted-foreground">
        Advisory tool only — the official SFDA Variation Requirements Guideline remains the binding reference.
      </footer>
    </div>
  );
}
