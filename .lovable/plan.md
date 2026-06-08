## Changes

1. **Remove the yellow "Note" box** on the home page (`src/routes/index.tsx`, lines 29–33).

2. **Remove the "Classifier" link** from the top-right nav in `src/components/Header.tsx` (line 18). Keep Home and Catalog.

3. **Optimize layout for desktop browsers** (not mobile-first):
   - Switch preview viewport to desktop.
   - In `src/routes/index.tsx`, adjust hero and grid sizing so the design reads as a desktop layout by default (larger base paddings, base font sizes targeting desktop, hero grid forced to 2 columns on standard screens, feature section to 3 columns at base).
   - In `src/components/Header.tsx`, always show the nav (remove `hidden sm:flex` so it shows on desktop by default).
   - Other routes (`/classify-multi`, `/catalog`) are left as-is unless desktop polish is also required — confirm if you want me to extend the same desktop tuning to them.

No business logic or Word-report generation logic is touched.
