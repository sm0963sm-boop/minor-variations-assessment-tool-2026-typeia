import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { TypeBadge } from "@/components/TypeBadge";
import { CATEGORIES, TYPE_INFO, VARIATIONS, type VariationType } from "@/lib/variations-data";

export const Route = createFileRoute("/catalog")({
  head: () => ({
    meta: [
      { title: "Variations Catalog — Type I" },
      { name: "description", content: "Browse all Type I variation classifications with eligibility conditions and required documents." },
    ],
  }),
  component: Catalog,
});

function Catalog() {
  const [q, setQ] = useState("");
  const [type, setType] = useState<VariationType | "ALL">("ALL");
  const [cat, setCat] = useState<string>("ALL");
  const [open, setOpen] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return VARIATIONS.filter(v => {
      if (type !== "ALL" && v.type !== type) return false;
      if (cat !== "ALL" && v.category !== cat) return false;
      if (q && !(`${v.code} ${v.title} ${v.category}`.toLowerCase().includes(q.toLowerCase()))) return false;
      return true;
    });
  }, [q, type, cat]);

  return (
    <div className="min-h-screen">
      <Header />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-foreground">Variations Catalog</h1>
        <p className="mt-2 text-muted-foreground">All Type I variations (IA / IAIN / IB) under the SFDA guideline.</p>

        <div className="mt-8 rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-soft">
          <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by code or title..."
              className="rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
            <select value={type} onChange={(e) => setType(e.target.value as VariationType | "ALL")}
              className="rounded-xl border border-input bg-background px-3 py-2.5 text-sm">
              <option value="ALL">All types</option>
              <option value="IA">IA</option>
              <option value="IAIN">IAIN</option>
              <option value="IB">IB</option>
            </select>
            <select value={cat} onChange={(e) => setCat(e.target.value)}
              className="rounded-xl border border-input bg-background px-3 py-2.5 text-sm">
              <option value="ALL">All categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="mt-3 text-xs text-muted-foreground">Results: <span className="font-bold text-foreground">{filtered.length}</span></div>
        </div>

        <div className="mt-6 space-y-3">
          {filtered.map(v => {
            const isOpen = open === v.code;
            return (
              <div key={v.code} className="rounded-2xl border border-border bg-card overflow-hidden shadow-soft">
                <button onClick={() => setOpen(isOpen ? null : v.code)} className="w-full flex items-start gap-4 p-5 text-left hover:bg-muted/40 transition">
                  <div className="shrink-0 mt-1"><TypeBadge type={v.type} size="sm" /></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <code className="font-mono bg-muted px-1.5 py-0.5 rounded">{v.code}</code>
                      <span>•</span><span>{v.category}</span>
                    </div>
                    <h3 className="mt-1 font-display font-bold text-foreground text-base leading-snug">{v.title}</h3>
                  </div>
                  <span className={`shrink-0 text-muted-foreground transition ${isOpen ? "rotate-180" : ""}`}>▾</span>
                </button>
                {isOpen && (
                  <div className="border-t border-border bg-muted/30 p-5 grid gap-5 sm:grid-cols-2">
                    <div>
                      <h4 className="font-bold text-sm text-foreground mb-2">Eligibility conditions</h4>
                      <ul className="space-y-1.5 text-sm text-muted-foreground">
                        {v.conditions.map((c, i) => (
                          <li key={i} className="flex gap-2"><span className="text-primary">◆</span><span>{c}</span></li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-foreground mb-2">Required documents</h4>
                      <ul className="space-y-1.5 text-sm text-muted-foreground">
                        {v.documents.map((d, i) => (
                          <li key={i} className="flex gap-2"><span className="text-primary">📄</span><span>{d}</span></li>
                        ))}
                      </ul>
                    </div>
                    <div className="sm:col-span-2 text-xs text-muted-foreground border-t border-border pt-3">
                      <span className="font-bold text-foreground">Procedural timeline:</span> {TYPE_INFO[v.type].timeline}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">No matching results.</div>
          )}
        </div>
      </div>
    </div>
  );
}
