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
                  <p className="text-sm sm:text-base text-emerald-800/90 leading-relaxed">
                    This tool is intended to support the evaluation process; however, the overall assessment and final decision remain the sole responsibility of the assessor.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Compact Workflow — near the title */}
          <div className="mt-12">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground mb-5">Workflow</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  n: 1,
                  t: "Select Variation",
                  d: "Pick variations from the SFDA catalog.",
                  color: "from-sky-500 to-sky-600",
                  ring: "ring-sky-200",
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  ),
                },
                {
                  n: 2,
                  t: "Check Conditions",
                  d: "Answer yes/no questions.",
                  color: "from-violet-500 to-violet-600",
                  ring: "ring-violet-200",
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  ),
                },
                {
                  n: 3,
                  t: "Assessor Opinion",
                  d: "AI analysis of unmet conditions.",
                  color: "from-blue-500 to-indigo-600",
                  ring: "ring-blue-200",
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M12 7a5 5 0 015 5c0 1.657-.8 3.13-2.04 4.05a2.5 2.5 0 00-.96 1.95H10a2.5 2.5 0 00-.96-1.95A4.992 4.992 0 017 12a5 5 0 015-5z" />
                  ),
                },
                {
                  n: 4,
                  t: "Final Recommendation",
                  d: "Accept or Reject outcome.",
                  color: "from-emerald-500 to-emerald-600",
                  ring: "ring-emerald-200",
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  ),
                },
              ].map((s, i, arr) => (
                <div key={s.n} className="relative">
                  <div className="relative h-full rounded-xl border border-border bg-card p-4 shadow-soft hover:shadow-elegant transition">
                    <div className={`absolute -top-3 left-4 size-6 rounded-full bg-gradient-to-br ${s.color} text-white text-xs font-bold flex items-center justify-center shadow-md ring-4 ring-background`}>
                      {s.n}
                    </div>
                    <div className={`mt-2 size-9 rounded-lg bg-gradient-to-br ${s.color} text-white flex items-center justify-center shadow-sm ring-2 ${s.ring}`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {s.icon}
                      </svg>
                    </div>
                    <h3 className="mt-3 font-display font-bold text-sm text-foreground">{s.t}</h3>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{s.d}</p>
                  </div>
                  {i < arr.length - 1 && (
                    <>
                      <div className="hidden lg:flex absolute top-1/2 -right-2 z-10 size-5 -translate-y-1/2 rounded-full bg-background border border-border items-center justify-center text-muted-foreground">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                      <div className="lg:hidden flex justify-center py-1 text-muted-foreground">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </>
                  )}
                </div>
              ))}
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
