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
        accepted: z.boolean().optional(),
        unmetConditions: z.array(z.string()).default([]),
        metConditions: z.array(z.string()).optional(),
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

    const allAccepted = data.items.every((it) => it.accepted !== false && it.unmetConditions.length === 0);

    const itemsText = data.items
      .map((it, i) => {
        const accepted = it.accepted !== false && it.unmetConditions.length === 0;
        if (accepted) {
          const conds = (it.metConditions ?? []).map((c, j) => `   (${j + 1}) ${c}`).join("\n");
          return `${i + 1}. Variation ${it.code} — ${it.title}\nStatus: ACCEPTED (all conditions met)\nMet conditions:\n${conds || "   (all required conditions satisfied)"}`;
        }
        return `${i + 1}. Variation ${it.code} — ${it.title}\nStatus: NOT ACCEPTED\nUnmet conditions:\n${it.unmetConditions
          .map((c, j) => `   (${j + 1}) ${c}`)
          .join("\n")}`;
      })
      .join("\n\n");

    const systemPrompt = `You are a senior pharmaceutical regulatory assessor specialized in SFDA/EMA Type IA variations for finished pharmaceutical products.
Your task: provide a strictly scientific, regulatory-grade analysis for each variation.

STRICT RULES:
- Output language: ENGLISH ONLY.
- Do NOT recommend reclassifying or upgrading the variation type.
- Do NOT list any additional documents required.
- Do NOT mention any guideline references, codes, or external standards by name.
- Focus purely on the scientific/pharmaceutical reasoning.

For ACCEPTED variations (all conditions met):
- For each variation, start with a heading: ### {code} — {title}
- Then provide a structured block with these bold labels exactly:
  **Scientific justification:** why the change is scientifically acceptable as a minor (Type IA) variation given that all conditions are met (2–4 sentences).
  **Impact on product quality:** the expected (minimal) impact on Efficacy, Safety, Stability, and Bioavailability — explain why product quality is preserved (2–4 sentences).
  **Assessor conclusion:** one short paragraph confirming the variation is acceptable from a scientific standpoint.

For NOT ACCEPTED variations (one or more unmet conditions):
- For each variation, start with a heading: ### {code} — {title}
- Then for each unmet condition, a sub-heading: #### Condition {n}: {short paraphrase}
- Under it, three bold labels exactly: **Scientific explanation:**, **Reason for non-compliance:**, **Impact on product quality:** each followed by a concise paragraph (2–4 sentences).
- Do NOT discuss the final recommendation; rejection is implicit.

Formatting:
- Use clear Markdown.
- Be precise, professional, and avoid filler.
${allAccepted ? "- All submitted variations are ACCEPTED — produce only the accepted-variation block format." : ""}`;

    const userPrompt = `Provide the scientific analysis for the following variations:\n\n${itemsText}`;

    const { text } = await generateText({
      model: gateway("google/gemini-3-flash-preview"),
      system: systemPrompt,
      prompt: userPrompt,
    });

    return { analysis: text };
  });
