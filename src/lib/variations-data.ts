// SFDA — Variation Requirements Guideline for Registered Pharmaceutical Products
// Type I Variations (IA / IAIN / IB)

export type VariationType = "IA" | "IAIN" | "IB";

export interface Variation {
  code: string;
  title: string;
  category: string;
  type: VariationType;
  conditions: string[];
  documents: string[];
  notes?: string;
}

export const TYPE_INFO: Record<VariationType, { label: string; short: string; description: string; timeline: string }> = {
  IA: {
    label: "Type IA — Minor variation (Do and Tell)",
    short: "IA",
    description: "Variations with minimal or no impact on quality, safety, or efficacy. Implement first, then notify within 12 months via the annual report.",
    timeline: "Notify within 12 months (Do and Tell)",
  },
  IAIN: {
    label: "Type IAIN — Immediate Notification",
    short: "IAIN",
    description: "Type IA variations that must be notified to SFDA immediately after implementation rather than via the annual report.",
    timeline: "Immediate notification after implementation",
  },
  IB: {
    label: "Type IB — Minor variation (Tell, Wait & Do)",
    short: "IB",
    description: "Variations that are not minor but do not reach Type II level. Submit the application and await SFDA acceptance before implementation.",
    timeline: "Wait 30 working days before implementation (Tell, Wait & Do)",
  },
};

export const CATEGORIES = [
  "Administrative",
  "Quality — Active Substance",
  "Quality — Finished Product",
  "Container Closure System",
  "Stability & Shelf-life",
  "Labeling & Leaflet",
  "Manufacturing & Sites",
  "Safety & Efficacy",
] as const;

export const VARIATIONS: Variation[] = [
  // ===== Administrative =====
  {
    code: "A.1",
    title: "Change in name and/or address of the Marketing Authorization Holder (MAH)",
    category: "Administrative",
    type: "IAIN",
    conditions: ["The MAH remains the same legal entity"],
    documents: ["Official document from the competent authority evidencing the name/address change", "Updated registration form", "Updated labels and leaflets"],
  },
  {
    code: "A.2(a)",
    title: "Change of the (invented) name of the medicinal product",
    category: "Administrative",
    type: "IB",
    conditions: ["No similarity with other registered products that could cause a medication mix-up"],
    documents: ["Justification for the change", "No-objection letter where applicable", "Labels and leaflets bearing the new name"],
  },
  {
    code: "A.3",
    title: "Change in name and/or address of the active substance manufacturer (no site change)",
    category: "Administrative",
    type: "IA",
    conditions: ["No change in the manufacturing site", "No change in manufacturing operations or quality controls"],
    documents: ["Official document evidencing the name/address change", "Updated ASMF/CEP if needed"],
  },
  {
    code: "A.4",
    title: "Change in name and/or address of the finished product manufacturer (no site change)",
    category: "Administrative",
    type: "IAIN",
    conditions: ["Same geographical manufacturing site", "No impact on manufacturing operations"],
    documents: ["Official document evidencing the change", "Updated GMP certificate"],
  },
  {
    code: "A.5(a)",
    title: "Change in name/address of the batch release site",
    category: "Administrative",
    type: "IA",
    conditions: ["No change in responsibilities or scope of testing"],
    documents: ["Official document", "Updated registration form"],
  },
  {
    code: "A.7",
    title: "Deletion of a manufacturing site (API, intermediate, finished product, or packaging)",
    category: "Administrative",
    type: "IA",
    conditions: ["Alternative authorized and registered sites are available", "The deleted site is not the only remaining site"],
    documents: ["Cover letter", "Updated registration form and CTD documents"],
  },

  // ===== Active Substance =====
  {
    code: "B.I.a.1(a)",
    title: "Change in the API manufacturer (addition of a new manufacturer with CEP)",
    category: "Quality — Active Substance",
    type: "IAIN",
    conditions: ["A valid CEP is available for the new manufacturer", "Specifications and reference method remain unchanged", "Same synthetic route"],
    documents: ["Updated CEP copy", "QP declaration", "Stability data if required"],
  },
  {
    code: "B.I.a.2(a)",
    title: "Minor changes in the API manufacturing process",
    category: "Quality — Active Substance",
    type: "IA",
    conditions: ["No change in qualitative or quantitative impurity profile", "Physicochemical properties remain unchanged", "Same synthetic route"],
    documents: ["Process description before/after", "Comparative batch data", "Updated section 3.2.S.2"],
  },
  {
    code: "B.I.b.1(a)",
    title: "Tightening of API specification limits",
    category: "Quality — Active Substance",
    type: "IA",
    conditions: ["Limits are within the previously approved range", "No new test parameters added"],
    documents: ["Specifications before/after", "Brief scientific justification"],
  },
  {
    code: "B.I.b.2(a)",
    title: "Change in the analytical procedure of the API (minor change)",
    category: "Quality — Active Substance",
    type: "IA",
    conditions: ["Method re-validation is documented", "Results equivalent to the approved method"],
    documents: ["Validation report", "Comparison between methods"],
  },

  // ===== Finished Product =====
  {
    code: "B.II.a.1",
    title: "Change or addition of imprints/embossing on tablets or capsules",
    category: "Quality — Finished Product",
    type: "IA",
    conditions: ["No impact on weight or dissolution of the dosage form", "Change does not cause confusion with other products"],
    documents: ["Before/after illustration", "Updated specifications and leaflet"],
  },
  {
    code: "B.II.a.3(a)",
    title: "Minor changes in the excipient composition of the finished product",
    category: "Quality — Finished Product",
    type: "IB",
    conditions: ["Excipient is not a critical excipient", "Comparative stability data for at least 3 months are available"],
    documents: ["Scientific justification", "Stability data", "Comparative dissolution data"],
  },
  {
    code: "B.II.b.1(a)",
    title: "Replacement or addition of a secondary packaging site",
    category: "Manufacturing & Sites",
    type: "IAIN",
    conditions: ["Valid GMP certificate", "Same packaging operations"],
    documents: ["GMP certificate", "Site description", "Updated 3.2.P.3.1"],
  },
  {
    code: "B.II.b.2(a)",
    title: "Addition or replacement of a QC testing site for the finished product",
    category: "Manufacturing & Sites",
    type: "IA",
    conditions: ["Successful analytical method transfer", "Laboratory accreditation"],
    documents: ["Method transfer report", "Laboratory accreditation"],
  },
  {
    code: "B.II.b.3(a)",
    title: "Minor change in the manufacturing process of the finished product",
    category: "Quality — Finished Product",
    type: "IA",
    conditions: ["Same manufacturing principle", "Equivalent batch data (3 batches)", "No impact on stability"],
    documents: ["Process description", "Batch data", "Stability data"],
  },
  {
    code: "B.II.b.4(a)",
    title: "Change in the finished product batch size up to 10-fold",
    category: "Manufacturing & Sites",
    type: "IA",
    conditions: ["Same equipment and process", "Process validation results are available"],
    documents: ["Validation report", "Batch data"],
  },
  {
    code: "B.II.b.5(a)",
    title: "Change in in-process tests (tightening of limits)",
    category: "Quality — Finished Product",
    type: "IA",
    conditions: ["Limits within the approved range", "No deletion of existing parameters"],
    documents: ["Specifications before/after", "Justification"],
  },
  {
    code: "B.II.d.1(a)",
    title: "Tightening of finished product specifications",
    category: "Quality — Finished Product",
    type: "IA",
    conditions: ["Within previously approved lim