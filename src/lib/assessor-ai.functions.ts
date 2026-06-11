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
        status: z.enum(["APPROVED", "SUSPENDED", "REJECTED"]).optional(),
        unmetConditions: z.array(z.string()).default([]),
        metConditions: z.array(z.string()).optional(),
        missingDocs: z.array(z.string()).default([]),
        type: z.string().optional(),
      })
    )
    .min(1),
});

type Status = "APPROVED" | "SUSPENDED" | "REJECTED";
function deriveStatus(it: {
  status?: Status;
  accepted?: boolean;
  unmetConditions: string[];
  missingDocs: string[];
}): Status {
  if (it.status) return it.status;
  if (it.accepted === false || it.unmetConditions.length > 0) return "REJECTED";
  if (it.missingDocs.length > 0) return "SUSPENDED";
  return "APPROVED";
}

export const generateScientificAnalysis = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const gateway = createLovableAiGatewayProvider(key);

    const statuses = data.items.map((it) => deriveStatus(it));
    const allApproved = statuses.every((s) => s === "APPROVED");
    const anySuspended = statuses.includes("SUSPENDED");
    const anyRejected = statuses.includes("REJECTED");

    const itemsText = data.items
      .map((it, i) => {
        const s = statuses[i];
        if (s === "APPROVED") {
          const conds = (it.metConditions ?? []).map((c, j) => `   (${j + 1}) ${c}`).join("\n");
          return `${i + 1}. Variation ${it.code} — ${it.title}\nStatus: APPROVED (all conditions met and all required documents submitted)\nMet conditions:\n${conds || "   (all required conditions satisfied)"}`;
        }
        if (s === "SUSPENDED") {
          const docs = it.missingDocs.map((d, j) => `   (${j + 1}) ${d}`).join("\n");
          return `${i + 1}. Variation ${it.code} — ${it.title}\nStatus: SUSPENDED (conditions are met, but one or more required documents are missing)\nMissing required documents:\n${docs || "   (one or more required documents not submitted)"}`;
        }
        return `${i + 1}. Variation ${it.code} — ${it.title}\nStatus: NOT ACCEPTED (one or more conditions are not met)\nUnmet conditions:\n${it.unmetConditions
          .map((c, j) => `   (${j + 1}) ${c}`)
          .join("\n")}`;
      })
      .join("\n\n");

    const systemPrompt = `You are a senior pharmaceutical regulatory assessor specialized in SFDA/EMA minor variations (Type IA and Type IB) for finished pharmaceutical products.
Your task: provide a strictly scientific, regulatory-grade analysis for each variation, fully aligned with its actual decision status (APPROVED, SUSPENDED, or NOT ACCEPTED).

STRICT RULES:
- Output language: ENGLISH ONLY.
- Do NOT recommend reclassifying or upgrading the variation type.
- Do NOT mention any guideline references, codes, or external standards by name.
- Focus on scientific/pharmaceutical reasoning.
- Treat each variation's status as ground truth. NEVER state that a SUSPENDED or NOT ACCEPTED variation is "acceptable" or "approved". A variation with missing documents is SUSPENDED, not approved.

For APPROVED variations (all conditions met AND all required documents submitted):
- Heading: ### {code} — {title}
- **Scientific justification:** why the change is scientifically acceptable as a minor variation given that all conditions are met (2–4 sentences).
- **Impact on product quality:** the expected (minimal) impact on Efficacy, Safety, Stability, and Bioavailability — explain why product quality is preserved (2–4 sentences).
- **Assessor conclusion:** one short paragraph confirming the variation is acceptable from a scientific standpoint and approved.

For SUSPENDED variations (conditions met but required documents are missing):
- Heading: ### {code} — {title}
- **Scientific context:** brief scientific framing of the change and why all conditions being met is necessary but not sufficient on its own (2–3 sentences).
- For each missing document, a sub-heading: #### Missing document {n}: {short paraphrase}
  Under it, two bold labels: **Why this document is required:** and **Impact of its absence on the assessment:** each a concise paragraph (2–3 sentences) explaining its role in confirming product quality (Efficacy, Safety, Stability, Bioavailability).
- **Assessor conclusion:** one short paragraph stating that the variation is SUSPENDED pending submission of the missing document(s), and explicitly NOT approved at this stage. Do NOT call it "acceptable" or "approved".

For NOT ACCEPTED variations (one or more unmet conditions):
- Heading: ### {code} — {title}
- For each unmet condition, a sub-heading: #### Condition {n}: {short paraphrase}
- Under it, three bold labels: **Scientific explanation:**, **Reason for non-compliance:**, **Impact on product quality:** each followed by a concise paragraph (2–4 sentences).
- **Assessor conclusion:** one short paragraph stating that the variation is NOT ACCEPTED as submitted. Do NOT call it "acceptable" or "approved".

Formatting:
- Use clear Markdown.
- Be precise, professional, and avoid filler.
${allApproved ? "- All submitted variations are APPROVED — produce only the approved-variation block format." : ""}${anySuspended && !anyRejected && !allApproved ? "\n- Some variations are SUSPENDED — never describe a SUSPENDED variation as approved or acceptable; the wording must reflect that it is on hold pending missing documents." : ""}`;

    const userPrompt = `Provide the scientific analysis for the following variations, strictly respecting each one's status:\n\n${itemsText}`;

    const { text } = await generateText({
      model: gateway("google/gemini-3-flash-preview"),
      system: systemPrompt,
      prompt: userPrompt,
    });

    return { analysis: text };
  });
