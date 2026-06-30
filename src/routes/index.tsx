import { createFileRoute, Link } from "@tanstack/react-router";
import { ClipboardList, ShieldCheck, FileCheck, Scale } from "lucide-react";
import { Header } from "@/components/Header";
import { TYPE_INFO, VARIATIONS } from "@/lib/variations-data";
import { TypeBadge } from "@/components/TypeBadge";
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
          <div className="grid gap-10">
            <div className="max-w-3xl">
              <h1 className="font-display text-4xl sm:text-6xl font-extrabold leading-[1.1] text-foreground">
                <span className="bg-hero bg-clip-text text-transparent">Minor Variations Assessment Tool</span>
              </h1>
              <p className="font-display text-2xl sm:text-4xl font-extrabold leading-tight bg-hero bg-clip-text text-transparent mt-1">
                (MVAT)
              </p>
              <div className="mt-8 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-8 shadow-soft relative overflow-hidden">
                <div className="absolute left-0 top-4 bottom-4 w-1 rounded-full bg-gradient-to-b from-primary to-primary/40" />
                <div className="flex items-start gap-5 pl-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <svg className="w-5 h-5 text-primary/80" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                    </svg>
                  </div>
                  <div className="space-y-4">
                    <p className="text-sm sm:text-[15px] text-foreground/90 font-medium leading-relaxed">
                      This is a guided decision-support tool based on the SFDA Guidelines for Variation Requirements Version 6.4.
                    </p>
                    <div className="h-px bg-border/50" />
                    <p className="text-sm sm:text-[15px] text-muted-foreground leading-relaxed">
                      This tool is intended to support the evaluation process; however, the overall assessment and final decision remain the sole responsibility of the assessor.
                    </p>
                  </div>
                </div>
              </div>
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
            </div>
          </div>



          <div className="mt-16">
            <div className="text-center mb-10">
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-foreground">How it works</h2>
              <p className="mt-2 text-muted-foreground">Four guided steps from variation selection to final decision</p>
            </div>
            <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: ClipboardList, title: "Select variation(s)", desc: "Choose any Type IA, IAIN, or IB change(s) you want to assess." },
                { icon: ShieldCheck, title: "Verify Type IA conditions", desc: "For Type IA / IAIN variations, confirm that all required conditions are met. Skipped for Type IB." },
                { icon: FileCheck, title: "Verify documentation", desc: "Check required documents for Type IB and for Type IA / IAIN variations that met all conditions." },
                { icon: Scale, title: "Final decision", desc: "Per-variation recommendation: approved, suspended, or rejected." },
              ].map((s, i) => {
                const Icon = s.icon;
                return (
                  <li key={i} className="relative rounded-2xl border border-border bg-card p-6 pt-10 shadow-soft hover:shadow-elegant transition">
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-elegant">
                      <Icon className="w-6 h-6" strokeWidth={2} />
                    </div>
                    <h3 className="mt-4 font-display font-bold text-lg text-foreground text-center">{s.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed text-center">{s.desc}</p>
                  </li>
                );
              })}
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
