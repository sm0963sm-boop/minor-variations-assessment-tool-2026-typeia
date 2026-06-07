import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { TypeBadge } from "@/components/TypeBadge";
import { CATEGORIES, TYPE_INFO, VARIATIONS, type Variation } from "@/lib/variations-data";

export const Route = createFileRoute("/classify")({
  head: () => ({
    meta: [
      { title: "أداة تصنيف التغيير — تفاعلية" },
      { name: "description", content: "أداة موجّهة لتحديد نوع تغيير المستحضر الدوائي وفق الدليل الإرشادي SFDA." },
    ],
  }),
  component: Classify,
});

function Classify() {
  const [step, setStep] = useState(0);
  const [category, setCategory] = useState<string | null>(null);
  const [conditionsMet, setConditionsMet] = useState<boolean | null>(null);
  const [picked, setPicked] = useState<Variation | null>(null);

  const inCategory = useMemo(
    () => VARIATIONS.filter(v => v.category === category),
    [category]
  );

  const reset = () => { setStep(0); setCategory(null); setPicked(null); setConditionsMet(null); };

  return (
    <div className="min-h-screen">
      <Header />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
        {/* Stepper */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl font-extrabold text-foreground">أداة التصنيف</h1>
          <button onClick={reset} className="text-sm text-muted-foreground hover:text-foreground">↻ إعادة البدء</button>
        </div>
        <div className="flex gap-2 mb-8">
          {[0,1,2,3].map(i => (
            <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-primary" : "bg-border"}`} />
          ))}
        </div>

        {/* Step 0 - Category */}
        {step === 0 && (
          <Panel title="١. اختر فئة التغيير" subtitle="ما النطاق الذي يتعلق به طلب التغيير؟">
            <div className="grid gap-3 sm:grid-cols-2">
              {CATEGORIES.map(c => (
                <button key={c} onClick={() => { setCategory(c); setStep(1); }}
                  className="text-right rounded-xl border border-border bg-card hover:border-primary hover:shadow-soft p-4 transition">
                  <div className="font-bold text-foreground">{c}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {VARIATIONS.filter(v => v.category === c).length} تغييرات متاحة
                  </div>
                </button>
              ))}
            </div>
          </Panel>
        )}

        {/* Step 1 - Pick specific variation */}
        {step === 1 && category && (
          <Panel title="٢. حدّد التغيير المطلوب" subtitle={`الفئة: ${category}`}>
            <div className="space-y-2">
              {inCategory.map(v => (
                <button key={v.code} onClick={() => { setPicked(v); setStep(2); }}
                  className="w-full text-right rounded-xl border border-border bg-card hover:border-primary hover:bg-muted/30 p-4 transition flex items-start gap-3">
                  <TypeBadge type={v.type} size="sm" />
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground font-mono">{v.code}</div>
                    <div className="font-bold text-foreground mt-0.5">{v.title}</div>
                  </div>
                </button>
              ))}
            </div>
            <button onClick={() => setStep(0)} className="mt-4 text-sm text-muted-foreground hover:text-foreground">→ رجوع</button>
          </Panel>
        )}

        {/* Step 2 - Check conditions */}
        {step === 2 && picked && (
          <Panel title="٣. تحقق من شروط التأهيل" subtitle="هل تنطبق جميع الشروط التالية على حالتك؟">
            <ul className="space-y-2.5 mb-6">
              {picked.conditions.map((c, i) => (
                <li key={i} className="flex gap-3 p-3 rounded-lg bg-muted/40 border border-border">
                  <span className="text-primary font-bold">{i+1}.</span>
                  <span className="text-sm text-foreground">{c}</span>
                </li>
              ))}
            </ul>
            <div className="grid gap-3 sm:grid-cols-2">
              <button onClick={() => { setConditionsMet(true); setStep(3); }}
                className="rounded-xl bg-primary text-primary-foreground py-3 font-bold shadow-soft hover:bg-primary/90 transition">
                ✓ نعم، جميع الشروط مستوفاة
              </button>
              <button onClick={() => { setConditionsMet(false); setStep(3); }}
                className="rounded-xl border border-border bg-card py-3 font-bold text-foreground hover:bg-muted transition">
                ✗ لا، بعضها غير مستوفى
              </button>
            </div>
            <button onClick={() => setStep(1)} className="mt-4 text-sm text-muted-foreground hover:text-foreground">→ رجوع</button>
          </Panel>
        )}

        {/* Step 3 - Result */}
        {step === 3 && picked && (
          <div className="rounded-3xl border border-border bg-card-gradient p-6 sm:p-8 shadow-elegant">
            {conditionsMet ? (
              <>
                <div className="text-xs text-muted-foreground">نتيجة التصنيف</div>
                <div className="mt-3 flex items-center gap-3">
                  <TypeBadge type={picked.type} size="lg" />
                </div>
                <h2 className="mt-4 font-display text-2xl font-extrabold text-foreground">{TYPE_INFO[picked.type].label}</h2>
                <p className="mt-2 text-muted-foreground">{TYPE_INFO[picked.type].description}</p>

                <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-4">
                  <div className="text-xs font-bold text-primary mb-1">الإجراء الزمني</div>
                  <div className="text-sm text-foreground">{TYPE_INFO[picked.type].timeline}</div>
                </div>

                <div className="mt-6">
                  <h3 className="font-bold text-foreground mb-2">الوثائق المطلوبة</h3>
                  <ul className="space-y-1.5">
                    {picked.documents.map((d, i) => (
                      <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                        <span className="text-primary">📄</span>{d}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 text-xs text-muted-foreground">
                  المرجع: <code className="font-mono bg-muted px-1.5 py-0.5 rounded">{picked.code}</code> — {picked.category}
                </div>
              </>
            ) : (
              <>
                <div className="inline-flex items-center gap-2 rounded-full bg-destructive/10 text-destructive px-3 py-1 text-xs font-bold">
                  لا يندرج تحت النوع الأول
                </div>
                <h2 className="mt-4 font-display text-2xl font-extrabold text-foreground">قد يكون تغييرك من النوع الثاني (Type II)</h2>
                <p className="mt-2 text-muted-foreground">
                  عدم استيفاء شروط النوع الأول يعني عادةً أن التغيير يُصنّف كتغيير كبير (Major / Type II) ويتطلب تقييماً علمياً كاملاً ومراجعة من الهيئة قبل التنفيذ.
                </p>
                <div className="mt-6 rounded-xl border border-warning/30 bg-warning/10 p-4 text-sm text-foreground">
                  <strong>توصية:</strong> راجع متطلبات الـ Type II في الدليل الإرشادي، أو اختر تصنيفاً مختلفاً يلائم حالتك.
                </div>
              </>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={reset} className="rounded-xl bg-primary text-primary-foreground px-5 py-2.5 font-bold hover:bg-primary/90 transition">
                تصنيف تغيير آخر
              </button>
              <Link to="/catalog" className="rounded-xl border border-border bg-card px-5 py-2.5 font-medium text-foreground hover:bg-muted transition">
                تصفّح الكتالوج كاملاً
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
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
