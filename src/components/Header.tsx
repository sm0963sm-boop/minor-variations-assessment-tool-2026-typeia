import { Link } from "@tanstack/react-router";

export function Header() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/70 border-b border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-hero shadow-soft flex items-center justify-center text-primary-foreground font-display font-bold">
            IA
          </div>
          <div className="leading-tight">
            <div className="font-display font-bold text-foreground">Type IA classification tool</div>
            <div className="text-[11px] text-muted-foreground">SFDA — Variations Guideline</div>
          </div>
        </Link>
        <nav className="hidden sm:flex items-center gap-1 text-sm">
          <Link to="/" className="px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition">Home</Link>
          <Link to="/classify" className="px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition">Classifier</Link>
          <Link to="/catalog" className="px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition">Catalog</Link>
        </nav>
      </div>
    </header>
  );
}
