import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const InputSchema = z.object({
  items: z
    .array(
      z.object({
        code: z.string(),
        title: z.string(),
        unmetConditions: z.array(z.string()).min(1),
      })
    )
    .min(1),
});

export const generateScientificAnalysis = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const gateway = createLovableAiGatewayProvider(key);

    const itemsText = data.items
      .map(
        (it, i) =>
          `${i + 1}. Variation ${it.code} — ${it.title}\nUnmet conditions:\n${it.unmetConditions
            .map((c, j) => `   (${j + 1}) ${c}`)
            .join("\n")}`
      )
      .join("\n\n");

    const systemPrompt = `You are a senior pharmaceutical regulatory assessor specialized in SFDA/EMA Type IA variations for finished pharmaceutical products.
Your task: for each UNMET condition, provide a strictly scientific, regulatory-grade analysis.

STRICT RULES:
- Output language: ENGLISH ONLY.
- Do NOT recommend reclassifying or upgrading the variation type. The final recommendation is always rejection when any condition is unmet — do not discuss it.
- Do NOT list any additional documents required.
- Do NOT mention any guideline references, codes, or external standards by name.
- Focus purely on the scientific/pharmaceutical reasoning.

For EACH unmet condition, write a structured block with these three parts:
1. Scientific explanation — what the condition technically means and why it exists in pharmaceutical/quality terms.
2. Reason for non-compliance — why this specific condition is considered not met in the current submission.
3. Impact on product quality — concrete potential effects on Efficacy, Safety, Stability, and Bioavailability (only mention the relevant ones; be specific, not generic).

Formatting:
- Use clear Markdown.
- For each variation, start with a heading: ### {code} — {title}
- Then for each unmet condition, a sub-heading: #### Condition {n}: {short paraphrase}
- Under it, three bold labels exactly: **Scientific explanation:**, **Reason for non-compliance:**, **Impact on product quality:** each followed by a concise paragraph (2–4 sentences).
- Be precise, professional, and avoid filler.`;

    const userPrompt = `Provide the scientific analysis for the following unmet conditions:\n\n${itemsText}`;

    const { text } = await generateText({
      model: gateway("google/gemini-3-flash-preview"),
      system: systemPrompt,
      prompt: userPrompt,
    });

    return { analysis: text };
  });
