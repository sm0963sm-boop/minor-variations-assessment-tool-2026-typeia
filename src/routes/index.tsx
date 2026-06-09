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
                  <p className="text-sm sm:text-base text-red-400 leading-relaxed">
                    This tool is intended to support the evaluation process; however, the overall assessment and final decision remain the sole responsibility of the assessor.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Creative Workflow — journey with connected orbs */}
          <div className="mt-12">
            <div className="flex items-baseline justify-between mb-6">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground">
                Workflow
                <span className="ml-3 text-xs font-normal text-muted-foreground tracking-widest uppercase">4 steps</span>
              </h2>
              <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                <span className="size-1.5 rounded-full bg-sky-500" />
                <span className="size-1.5 rounded-full bg-violet-500" />
                <span className="size-1.5 rounded-full bg-indigo-500" />
                <span className="size-1.5 rounded-full bg-emerald-500" />
                Guided flow
              </span>
            </div>

            <div className="relative rounded-2xl border border-border/70 bg-gradient-to-br from-card via-card to-muted/30 p-6 sm:p-8 shadow-soft overflow-hidden">
              {/* decorative blobs */}
              <div className="pointer-events-none absolute -top-20 -left-20 w-72 h-72 rounded-full bg-sky-400/10 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-24 -right-20 w-80 h-80 rounded-full bg-emerald-400/10 blur-3xl" />

              {/* desktop connector line */}
              <div className="hidden lg:block absolute left-10 right-10 top-[88px] h-[2px] bg-gradient-to-r from-sky-400 via-violet-400 to-emerald-400 opacity-60" />

              <div className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
                {[
                  { n: 1, t: "Select Variation", d: "Pick variations from the SFDA catalog.", grad: "from-sky-400 to-sky-600", glow: "shadow-[0_0_30px_-5px_rgba(56,189,248,0.55)]", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /> },
                  { n: 2, t: "Check Conditions", d: "Answer yes/no questions.", grad: "from-violet-400 to-violet-600", glow: "shadow-[0_0_30px_-5px_rgba(167,139,250,0.55)]", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /> },
                  { n: 3, t: "Assessor Opinion", d: "AI analysis of unmet conditions.", grad: "from-blue-400 to-indigo-600", glow: "shadow-[0_0_30px_-5px_rgba(99,102,241,0.55)]", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M12 7a5 5 0 015 5c0 1.657-.8 3.13-2.04 4.05a2.5 2.5 0 00-.96 1.95H10a2.5 2.5 0 00-.96-1.95A4.992 4.992 0 017 12a5 5 0 015-5z" /> },
                  { n: 4, t: "Final Recommendation", d: "Accept or Reject outcome.", grad: "from-emerald-400 to-emerald-600", glow: "shadow-[0_0_30px_-5px_rgba(52,211,153,0.55)]", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /> },
                ].map((s) => (
                  <div key={s.n} className="group relative flex flex-col items-center text-center">
                    {/* orb */}
                    <div className="relative">
                      <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${s.grad} blur-xl opacity-40 group-hover:opacity-70 transition`} />
                      <div className={`relative size-16 rounded-full bg-gradient-to-br ${s.grad} ${s.glow} flex items-center justify-center ring-4 ring-background group-hover:scale-110 group-hover:-translate-y-1 transition-transform duration-300`}>
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">{s.icon}</svg>
                      </div>
                      <div className="absolute -top-1 -right-1 size-6 rounded-full bg-background border border-border text-[11px] font-bold text-foreground flex items-center justify-center shadow-sm">
                        {s.n}
                      </div>
                    </div>
                    <h3 className="mt-4 font-display font-bold text-sm text-foreground tracking-tight">{s.t}</h3>
                    <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed max-w-[14rem]">{s.d}</p>
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
