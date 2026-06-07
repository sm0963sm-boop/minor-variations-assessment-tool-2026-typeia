import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { TYPE_INFO, VARIATIONS } from "@/lib/variations-data";
import { TypeBadge } from "@/components/TypeBadge";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "دليل تصنيف تغييرات النوع الأول — SFDA" },
      { name: "description", content: "أداة تفاعلية لتحديد تصنيف طلب التغيير (IA / IAIN / IB) على المستحضرات الدوائية المسجلة." },
    ],
  }),
  component: Home,
});

function Home() {
  const counts = {
    IA: VARIATIONS.filter(v => v.type === "IA").length,
    IAIN: VARIATIONS.filter(v => v.type === "IAIN").length,
    IB: VARIATIONS.filter(v => v.type === "IB").length,
  };

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero opacity-[0.07]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs text-primary font-medium">
              <span className="size-1.5 rounded-full bg-primary animate-pulse" />
              مرجع متوافق مع الدليل الإرشادي للهيئة العامة للغذاء والدواء
            </div>
            <h1 className="mt-5 font-display text-4xl sm:text-6xl font-extrabold leading-[1.1] text-foreground">
              صنّف <span className="bg-hero bg-clip-text text-transparent">تغييرات النوع الأول</span> على مستحضراتك الدوائية بثقة.
            </h1>
            <p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed">
              أداة تفاعلية تستند إلى الدليل الإرشادي لطلبات التغيير من SFDA — تساعدك على تحديد ما إذا كان تغييرك من نوع
              <span className="font-bold text-foreground"> IA</span> أو
              <span className="font-bold text-foreground"> IAIN</span> أو
              <span className="font-bold text-foreground"> IB</span>، مع شروط التأهيل والوثائق المطلوبة.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/classify" className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-base font-bold text-primary-foreground shadow-elegant hover:shadow-soft hover:translate-y-[-1px] transition">
                ابدأ تصنيف تغيير ←
              </Link>
              <Link to="/catalog" className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-base font-medium text-foreground hover:bg-muted transition">
                تصفّح الكتالوج
              </Link>
            </div>
          </div>

          {/* Type cards */}
          <div className="mt-14 grid gap-4 sm:grid-cols-3">
            {(["IA", "IAIN", "IB"] as const).map((t) => (
              <div key={t} className="rounded-2xl border border-border bg-card-gradient p-6 shadow-soft hover:shadow-elegant transition">
                <TypeBadge type={t} size="lg" />
                <h3 className="mt-4 font-display font-bold text-lg text-foreground">{TYPE_INFO[t].label}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{TYPE_INFO[t].description}</p>
                <div className="mt-4 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{TYPE_INFO[t].timeline}</span>
                  <span className="font-bold text-foreground">{counts[t]} تغيير</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16 border-t border-border/60">
        <div className="grid gap-8 sm:grid-cols-3">
          {[
            { t: "تصنيف خطوة بخطوة", d: "أجب عن أسئلة موجّهة لمعرفة نوع التغيير بدقة." },
            { t: "كتالوج شامل", d: "أكثر من 25 تصنيفاً مفصّلاً مع الشروط والوثائق." },
            { t: "مرجعية SFDA", d: "بنود تتبع ترميز الدليل الرسمي (B.I / B.II / C.I...)." },
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
        أداة استرشادية فقط — تبقى المرجعية النهائية للدليل الإرشادي الرسمي المنشور من قِبل الهيئة العامة للغذاء والدواء.
      </footer>
    </div>
  );
}
