export type VariationType = "IA" | "IAIN";

export interface Variation {
  code: string;
  title: string;
  category: string;
  type: VariationType;
  conditions: string[];
  documents: string[];
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
    description: "Type IA variations that must be notified immediately after implementation rather than via the annual report.",
    timeline: "Immediate notification after implementation",
  },
};

export const CATEGORIES = [
  "Administrative",
  "Quality - Active Substance",
  "Quality - Finished Product",
  "Container Closure System",
  "Stability and Shelf-life",
  "Labeling and Leaflet",
  "Manufacturing and Sites",
  "Safety and Efficacy",
] as const;

export const VARIATIONS: Variation[] = [
  {
    code: "A.1",
    title: "Change in name and/or address of the Marketing Authorization Holder (MAH)",
    category: "Administrative",
    type: "IAIN",
    conditions: ["The MAH remains the same legal entity"],
    documents: ["Official document evidencing the name/address change", "Updated registration form", "Updated labels and leaflets"],
  },
  {
    code: "A.3",
    title: "Change in name and/or address of the active substance manufacturer (no site change)",
    category: "Administrative",
    type: "IA",
    conditions: ["No change in the manufacturing site", "No change in manufacturing operations or quality controls"],
    documents: ["Official document evidencing the change", "Updated ASMF/CEP if needed"],
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
    title: "Deletion of a manufacturing site",
    category: "Administrative",
    type: "IA",
    conditions: ["Alternative authorized and registered sites are available", "The deleted site is not the only remaining site"],
    documents: ["Cover letter", "Updated registration form and CTD documents"],
  },
  {
    code: "B.I.a.1(a)",
    title: "Change in the API manufacturer (addition of a new manufacturer with CEP)",
    category: "Quality - Active Substance",
    type: "IAIN",
    conditions: ["A valid CEP is available for the new manufacturer", "Specifications and reference method remain unchanged", "Same synthetic route"],
    documents: ["Updated CEP copy", "QP declaration", "Stability data if required"],
  },
  {
    code: "B.I.a.2(a)",
    title: "Minor changes in the API manufacturing process",
    category: "Quality - Active Substance",
    type: "IA",
    conditions: ["No change in qualitative or quantitative impurity profile", "Physicochemical properties remain unchanged", "Same synthetic route"],
    documents: ["Process description before/after", "Comparative batch data", "Updated section 3.2.S.2"],
  },
  {
    code: "B.I.b.1(a)",
    title: "Tightening of API specification limits",
    category: "Quality - Active Substance",
    type: "IA",
    conditions: ["Limits are within the previously approved range", "No new test parameters added"],
    documents: ["Specifications before/after", "Brief scientific justification"],
  },
  {
    code: "B.I.b.2(a)",
    title: "Change in the analytical procedure of the API (minor change)",
    category: "Quality - Active Substance",
    type: "IA",
    conditions: ["Method re-validation is documented", "Results equivalent to the approved method"],
    documents: ["Validation report", "Comparison between methods"],
  },
  {
    code: "B.II.a.1",
    title: "Change or addition of imprints/embossing on tablets or capsules",
    category: "Quality - Finished Product",
    type: "IA",
    conditions: ["No impact on weight or dissolution of the dosage form", "Change does not cause confusion with other products"],
    documents: ["Before/after illustration", "Updated specifications and leaflet"],
  },
  {
    code: "B.II.b.1(a)",
    title: "Replacement or addition of a secondary packaging site",
    category: "Manufacturing and Sites",
    type: "IAIN",
    conditions: ["Valid GMP certificate", "Same packaging operations"],
    documents: ["GMP certificate", "Site description", "Updated 3.2.P.3.1"],
  },
  {
    code: "B.II.b.2(a)",
    title: "Addition or replacement of a QC testing site for the finished product",
    category: "Manufacturing and Sites",
    type: "IA",
    conditions: ["Successful analytical method transfer", "Laboratory accreditation"],
    documents: ["Method transfer report", "Laboratory accreditation"],
  },
  {
    code: "B.II.b.3(a)",
    title: "Minor change in the manufacturing process of the finished product",
    category: "Quality - Finished Product",
    type: "IA",
    conditions: ["Same manufacturing principle", "Equivalent batch data for 3 batches", "No impact on stability"],
    documents: ["Process description", "Batch data", "Stability data"],
  },
  {
    code: "B.II.b.4(a)",
    title: "Change in the finished product batch size up to 10-fold",
    category: "Manufacturing and Sites",
    type: "IA",
    conditions: ["Same equipment and process", "Process validation results are available"],
    documents: ["Validation report", "Batch data"],
  },
  {
    code: "B.II.b.5(a)",
    title: "Change in in-process tests (tightening of limits)",
    category: "Quality - Finished Product",
    type: "IA",
    conditions: ["Limits within the approved range", "No deletion of existing parameters"],
    documents: ["Specifications before/after", "Justification"],
  },
  {
    code: "B.II.d.1(a)",
    title: "Tightening of finished product specifications",
    category: "Quality - Finished Product",
    type: "IA",
    conditions: ["Within previously approved limits", "No deletion of quality parameters"],
    documents: ["Specifications before/after", "Scientific justification"],
  },
  {
    code: "B.II.d.2(a)",
    title: "Change in analytical procedures of the finished product",
    category: "Quality - Finished Product",
    type: "IA",
    conditions: ["Validation of the new method is documented", "Results equivalent to the current method"],
    documents: ["Validation report", "Comparison of results"],
  },
  {
    code: "B.II.e.4(a)",
    title: "Change in the shape or dimensions of the container (no material change)",
    category: "Container Closure System",
    type: "IA",
    conditions: ["Same container material and closure system", "No impact on stability"],
    documents: ["Drawings", "Comparative data"],
  },
  {
    code: "B.II.e.5(a)",
    title: "Change in pack size (number of units per pack)",
    category: "Container Closure System",
    type: "IAIN",
    conditions: ["Within the approved dose range and duration", "Same primary packaging type"],
    documents: ["Justification", "Updated label and leaflet"],
  },
  {
    code: "C.I.z",
    title: "Editorial changes in the leaflet or label (linguistic/clarifying)",
    category: "Labeling and Leaflet",
    type: "IA",
    conditions: ["No impact on substantive medical information", "No change in dose, indication, or warnings"],
    documents: ["Before/after comparison", "Updated leaflet and label"],
  },
];
