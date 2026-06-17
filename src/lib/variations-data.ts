export type VariationType = "IA" | "IAIN" | "IB";

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
  IB: {
    label: "Type IB — Minor variation (Tell, Wait and Do)",
    short: "IB",
    description: "Minor variations that require submission and acceptance of the required documentation before implementation. No predefined conditions — assessment is based on the documentation requirements only.",
    timeline: "Tell, Wait and Do — implement after acceptance",
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
    "code": "1.a",
    "title": "Change in the name and/or address of the marketing authorization holder",
    "category": "Administrative",
    "type": "IAIN",
    "conditions": [
      "1) The marketing authorization holder (MAH) shall remain the same legal entity."
    ],
    "documents": [
      "1) A formal document from a relevant official body (e.g. chamber of commerce, national drug regulatory authority…etc) in which the new name or new address is mentioned.",
      "2) Replacement of the relevant pages of the dossier that are affected by the variation.",
      "4) Certificate of a Pharmaceutical Product (CPP)."
    ]
  },
  {
    "code": "2",
    "title": "Remove agent name from the artwork (Mock-up)",
    "category": "Administrative",
    "type": "IA",
    "conditions": [
      "1) The proposed artwork should comply with the SFDA guidelines for Presenting the SPC, PIL and Labeling Information."
    ],
    "documents": [
      "1) Samples of the artwork.",
      "2) Replacement of the relevant pages of the dossier that are affected by the variation."
    ]
  },
  {
    "code": "4",
    "title": "Change in name of the active substance",
    "category": "Administrative",
    "type": "IAIN",
    "conditions": [
      "1) The active substance shall remain the same."
    ],
    "documents": [
      "1) Proof of acceptance by WHO or copy of the INN list.",
      "2) Replacement of the relevant pages of the dossier that are affected by the variation."
    ]
  },
  {
    "code": "5",
    "title": "Change in the name and/or address of a manufacturer or supplier of the active substance, starting material, reagent or intermediate used in the manufacture of the active substance (where specified in the product dossier) where no Certificate of Suitability is available",
    "category": "Administrative",
    "type": "IA",
    "conditions": [
      "1) The manufacturing site and all manufacturing operations shall remain the same."
    ],
    "documents": [
      "1) A formal document from a relevant official body (e.g. chamber of commerce, national drug regulatory authority…etc) in which the new name and/or address is mentioned.",
      "2) Replacement of the relevant pages of the dossier that are affected by the variation.",
      "3) In case of a drug master file (DMF), an updated 'letter of access'."
    ]
  },
  {
    "code": "6.a",
    "title": "Change in the name and/or address of a manufacturer of the finished product, including quality control sites – Manufacturer responsible for batch release",
    "category": "Administrative",
    "type": "IAIN",
    "conditions": [
      "1) The manufacturing site and all manufacturing operations shall remain the same."
    ],
    "documents": [
      "1) Copy of the modified manufacturing authorization, if available; or a formal document from a relevant official body in which the new name and/or address is mentioned.",
      "2) Replacement of the relevant pages of the dossier that are affected by the variation."
    ]
  },
  {
    "code": "6.b",
    "title": "Change in the name and/or address of a manufacturer of the finished product, including quality control sites – All other",
    "category": "Administrative",
    "type": "IA",
    "conditions": [
      "1) The manufacturing site and all manufacturing operations shall remain the same."
    ],
    "documents": [
      "1) Copy of the modified manufacturing authorization, if available; or a formal document from a relevant official body in which the new name and/or address is mentioned.",
      "2) Replacement of the relevant pages of the dossier that are affected by the variation."
    ]
  },
  {
    "code": "7",
    "title": "Change in ATC Code / ATC Vet Code",
    "category": "Administrative",
    "type": "IA",
    "conditions": [
      "1) Change following granting of or amendment to ATC Code by WHO / ATC Vet Code."
    ],
    "documents": [
      "1) Proof of acceptance (by WHO) or copy of the ATC (Vet) Code list.",
      "2) Replacement of the relevant pages of the dossier that are affected by the variation."
    ]
  },
  {
    "code": "8",
    "title": "Deletion of a manufacturing site (including for an active substance, intermediate or finished product, packaging site, manufacturer responsible for batch release, site where batch control takes place, or supplier of a starting material, reagent or excipient, when mentioned in the dossier)",
    "category": "Administrative",
    "type": "IA",
    "conditions": [
      "1) There should at least remain one site/manufacturer, as previously authorized, performing the same function as the one(s) concerned by the deletion.",
      "2) The deletion should not be due to critical deficiencies concerning manufacturing."
    ],
    "documents": [
      "1) The submitted documents should clearly outline the 'present' and 'proposed' manufacturers.",
      "2) Replacement of the relevant pages of the dossier that are affected by the variation."
    ]
  },
  {
    "code": "9.a",
    "title": "Change in the manufacturer of a starting material/reagent/intermediate or active substance (no CEP) – Proposed manufacturer is part of the same organization as the currently approved manufacturer",
    "category": "Quality - Active Substance",
    "type": "IAIN",
    "conditions": [
      "1) For starting materials and reagents the specifications (including in-process controls, methods of analysis of all materials) are identical to those already approved. For intermediates and active substances the specifications, method of preparation (including batch size) and detailed route of synthesis are identical.",
      "2) The active substance is not a biological/immunological substance or sterile.",
      "3) Where materials of human or animal origin are used, the manufacturer does not use any new supplier for which assessment of viral safety or TSE risk is required."
    ],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation.",
      "2) A declaration from the MAH that the synthetic route, quality control procedures and specifications are the same as those already approved.",
      "3) Either a TSE Certificate of Suitability for any new source of material or documentary evidence of prior assessment.",
      "4) Batch analysis data (comparative tabular format) for at least two batches (minimum pilot scale) from the current and proposed manufacturers/sites.",
      "5) Documents clearly outlining the 'present' and 'proposed' manufacturers.",
      "6) A declaration by the Qualified Person at the site responsible for batch release.",
      "7) Where relevant, a commitment to inform the MA holder of any changes.",
      "9) A letter of commitment to immediately initiate accelerated and long-term stability studies on at least one production batch of the finished product.",
      "10) Where appropriate, comparative dissolution profile data for the finished product."
    ]
  },
  {
    "code": "9.f",
    "title": "Changes to quality control testing arrangements for the active substance – replacement or addition of a site where batch control/testing takes place",
    "category": "Quality - Active Substance",
    "type": "IA",
    "conditions": [
      "2) The active substance is not a biological/immunological substance or sterile.",
      "4) Method transfer from the old to the new site has been successfully completed."
    ],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation.",
      "5) Documents clearly outlining the 'present' and 'proposed' manufacturers.",
      "11) Method transfer from the old to the new site."
    ]
  },
  {
    "code": "9.i",
    "title": "Introduction of a new site of micronisation",
    "category": "Quality - Active Substance",
    "type": "IA",
    "conditions": [
      "2) The active substance is not a biological/immunological substance or sterile.",
      "5) The particle size specification of the active substance and the corresponding analytical method remain the same."
    ],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation.",
      "4) Batch analysis data (comparative tabular format) for at least two batches (minimum pilot scale).",
      "5) Documents clearly outlining the 'present' and 'proposed' manufacturers.",
      "6) A declaration by the Qualified Person at the site responsible for batch release."
    ]
  },
  {
    "code": "9.l",
    "title": "Addition/change to an API supplier that has already been approved",
    "category": "Quality - Active Substance",
    "type": "IAIN",
    "conditions": [
      "1) For starting materials and reagents the specifications are identical to those already approved.",
      "2) The active substance is not a biological/immunological substance or sterile.",
      "3) Where materials of human or animal origin are used, no new supplier for which assessment of viral safety or TSE risk is required.",
      "6) The DMF of the new API supplier has been evaluated by SFDA during the last five years and no changes have been made since that time."
    ],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation.",
      "5) Documents clearly outlining the 'present' and 'proposed' manufacturers.",
      "9) A letter of commitment to immediately initiate accelerated and long-term stability studies.",
      "10) Where appropriate, comparative dissolution profile data for the finished product."
    ]
  },
  {
    "code": "10.a",
    "title": "Minor change in the manufacturing process of the active substance",
    "category": "Quality - Active Substance",
    "type": "IA",
    "conditions": [
      "1) No change in qualitative and quantitative impurity profile or in physicochemical properties.",
      "2) The product concerned is not a biological/immunological medicinal product.",
      "3) The synthetic route remains the same (intermediates remain the same; no changes to reagents, catalysts or solvents).",
      "4) The specifications of the active substance or intermediates are unchanged.",
      "5) The change is fully described in the open part of the DMF, if applicable.",
      "6) The change does not refer to the geographical source, manufacturing route or production of a herbal medicinal product.",
      "7) The change does not refer to the restricted part of an Active Substance Master File."
    ],
    "documents": [
      "1) Replacement of the relevant pages of the finished product dossier and DMF (where applicable), including a direct comparison of present and new process.",
      "2) Batch analysis data (comparative tabular format) of at least two batches (minimum pilot scale) according to the currently approved and proposed process.",
      "3) Copy of approved specifications of the active substance.",
      "4) A declaration from the MAH or DMF Holder that there is no change in qualitative and quantitative impurity profile or in physico-chemical properties."
    ]
  },
  {
    "code": "11.a",
    "title": "Change in batch size (including batch size ranges) of active substance or intermediate – Up to 10-fold increase compared to the currently approved batch size",
    "category": "Quality - Active Substance",
    "type": "IA",
    "conditions": [
      "1) Any changes to the manufacturing methods are only those necessitated by scale-up, e.g. use of different-sized equipment.",
      "2) Test results of at least two batches according to the specifications should be available for the proposed batch size.",
      "3) The product concerned is not a biological/immunological medicinal product.",
      "4) The change does not affect the reproducibility of the process.",
      "6) The specifications of the active substance/intermediates remain the same.",
      "7) The active substance is not sterile.",
      "8) The currently approved batch size was not approved via a Type IA variation."
    ],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation.",
      "2) The batch numbers of the tested batches having the proposed batch size.",
      "3) Batch analysis data (comparative tabulated format) on a minimum of one production batch manufactured to both the currently approved and the proposed sizes.",
      "4) Copy of approved specifications of the active substance (and of the intermediate, if applicable).",
      "5) A declaration from the MAH or DMF holder that changes to manufacturing methods are only those necessitated by scale-up, the change does not adversely affect reproducibility, is not the result of unexpected events, and that specifications remain the same."
    ]
  },
  {
    "code": "11.b",
    "title": "Change in batch size (including batch size ranges) of active substance or intermediate – Downscaling down to 10-fold",
    "category": "Quality - Active Substance",
    "type": "IA",
    "conditions": [
      "1) Any changes to the manufacturing methods are only those necessitated by downscaling, e.g. use of different-sized equipment.",
      "2) Test results of at least two batches according to the specifications should be available for the proposed batch size.",
      "3) The product concerned is not a biological/immunological medicinal product.",
      "4) The change does not affect the reproducibility of the process.",
      "5) The change should not be the result of unexpected events arising during manufacture or because of stability concerns.",
      "6) The specifications of the active substance/intermediates remain the same.",
      "7) The active substance is not sterile."
    ],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation.",
      "2) The batch numbers of the tested batches having the proposed batch size.",
      "3) Batch analysis data (comparative tabulated format) on a minimum of one production batch manufactured to both the currently approved and the proposed sizes.",
      "4) Copy of approved specifications of the active substance (and of the intermediate, if applicable).",
      "5) A declaration from the MAH or DMF holder."
    ]
  },
  {
    "code": "12.a",
    "title": "Change to in-process tests or limits applied during the manufacture of the active substance – Tightening of in-process limits",
    "category": "Quality - Active Substance",
    "type": "IA",
    "conditions": [
      "1) The change is not a consequence of any commitment from previous assessments to review specification limits.",
      "2) The change does not result from unexpected events arising during manufacture.",
      "3) Any change should be within the range of currently approved limits.",
      "4) The test procedure remains the same."
    ],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation.",
      "2) Comparative table of current and proposed in-process tests."
    ]
  },
  {
    "code": "12.b",
    "title": "Change to in-process tests or limits applied during the manufacture of the active substance – Addition of a new in-process test and limits",
    "category": "Quality - Active Substance",
    "type": "IA",
    "conditions": [
      "1) The change is not a consequence of any commitment from previous assessments to review specification limits.",
      "2) The change does not result from unexpected events arising during manufacture.",
      "5) Any new test method does not concern a novel non-standard technique or a standard technique used in a novel way.",
      "6) The new test method is not a biological/immunological/immunochemical method or a method using a biological reagent for a biological active substance."
    ],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation.",
      "2) Comparative table of current and proposed in-process tests.",
      "3) Details of any new analytical method and validation data.",
      "4) Batch analysis data on two production batches of the active substance for all specification parameters.",
      "6) Justification for the new in-process test and limits."
    ]
  },
  {
    "code": "12.f",
    "title": "Change to in-process tests or limits applied during the manufacture of the active substance – Deletion of a non-significant in-process test",
    "category": "Quality - Active Substance",
    "type": "IA",
    "conditions": [
      "1) The change is not a consequence of any commitment from previous assessments to review specification limits.",
      "2) The change does not result from unexpected events arising during manufacture.",
      "7) The specification parameter does not concern a critical parameter (e.g. assay, impurities, critical physical characteristics, identity test)."
    ],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation.",
      "2) Comparative table of current and proposed in-process tests.",
      "5) Justification/risk-assessment showing that the parameter is non-significant."
    ]
  },
  {
    "code": "14.a",
    "title": "Change in the specification parameters and/or limits of an active substance, starting material/intermediate/reagent – Tightening of specification limits",
    "category": "Quality - Active Substance",
    "type": "IAIN",
    "conditions": [
      "1) The change is not a consequence of any commitment from previous assessments to review specification limits.",
      "2) The change does not result from unexpected events arising during manufacture.",
      "3) Any change should be within the range of currently approved limits.",
      "4) The test procedure remains the same."
    ],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation.",
      "2) Comparative table of current and proposed specifications."
    ]
  },
  {
    "code": "14.b",
    "title": "Change in the specification parameters and/or limits of an active substance, starting material/intermediate/reagent – Addition of a new specification parameter with its corresponding test method",
    "category": "Quality - Active Substance",
    "type": "IA",
    "conditions": [
      "1) The change is not a consequence of any commitment from previous assessments to review specification limits.",
      "2) The change does not result from unexpected events arising during manufacture.",
      "5) Any new test method does not concern a novel non-standard technique or a standard technique used in a novel way.",
      "6) The test method is not a biological/immunological/immunochemical method or a method using a biological reagent.",
      "7) For any material, the change does not concern a genotoxic impurity."
    ],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation.",
      "2) Comparative table of current and proposed specifications.",
      "3) Details of any new analytical method and validation data.",
      "4) Batch analysis data on two production batches of the relevant substance for all specification parameters.",
      "5) Where appropriate, comparative dissolution profile data for the finished product.",
      "7) Justification of the new specification parameter and the limits."
    ]
  },
  {
    "code": "14.g",
    "title": "Change in the specification parameters and/or limits of an active substance, starting material/intermediate/reagent – Deletion of a non-significant specification parameter (e.g. deletion of an obsolete parameter)",
    "category": "Quality - Active Substance",
    "type": "IA",
    "conditions": [
      "1) The change is not a consequence of any commitment from previous assessments to review specification limits.",
      "2) The change does not result from unexpected events arising during manufacture.",
      "8) The specification parameter does not concern a critical parameter (e.g. assay, impurities, critical physical characteristics, identity test, water)."
    ],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation.",
      "2) Comparative table of current and proposed specifications.",
      "6) Justification/risk-assessment showing that the parameter is non-significant."
    ]
  },
  {
    "code": "15.a",
    "title": "Change in test procedure for active substance or starting material/reagent/intermediate – Minor changes to an approved test procedure",
    "category": "Quality - Active Substance",
    "type": "IA",
    "conditions": [
      "1) Appropriate validation studies have been performed in accordance with the relevant guidelines and show that the updated test procedure is at least equivalent to the former.",
      "2) There have been no changes of the total impurity limits; no new unqualified impurities are detected.",
      "3) The method of analysis should remain the same (e.g. a change in column length or temperature, but not a different type of column or method).",
      "4) The test method is not a biological/immunological/immunochemical method, or a method using a biological reagent."
    ],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation, including a description of the analytical methodology and a summary of validation data.",
      "2) Comparative validation results or if justified comparative analysis results showing that the current test and the proposed one are equivalent."
    ]
  },
  {
    "code": "15.d",
    "title": "Change in test procedure for active substance or starting material/reagent/intermediate – Other changes to a test procedure (including replacement or addition) for a reagent",
    "category": "Quality - Active Substance",
    "type": "IA",
    "conditions": [
      "1) Appropriate validation studies have been performed in accordance with the relevant guidelines and show that the updated test procedure is at least equivalent to the former.",
      "2) There have been no changes of the total impurity limits; no new unqualified impurities are detected.",
      "3) Any new test method does not concern a novel non-standard technique or a standard technique used in a novel way.",
      "5) Any new test method does not concern a novel non-standard technique or a standard technique used in a novel way.",
      "6) The active substance is not biological/immunological."
    ],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation, including a description of the analytical methodology and a summary of validation data.",
      "2) Comparative validation results or if justified comparative analysis results showing that the current test and the proposed one are equivalent."
    ]
  },
  {
    "code": "15.e",
    "title": "Change in test procedure for active substance or starting material/reagent/intermediate – Deletion of a test procedure if an alternative test procedure is already authorized",
    "category": "Quality - Active Substance",
    "type": "IA",
    "conditions": [
      "7) An alternative test procedure is already authorized for the specification parameter and this procedure has not been added through a IA variation."
    ],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation, including a description of the analytical methodology and a summary of validation data."
    ]
  },
  {
    "code": "16.a",
    "title": "Change in immediate packaging of the active substance – Change in the qualitative and quantitative composition",
    "category": "Quality - Active Substance",
    "type": "IA",
    "conditions": [
      "1) The proposed packaging material must be at least equivalent to the approved material in respect of its relevant properties.",
      "2) Satisfactory results of the relevant stability studies started according to the SFDA stability guidelines; relevant stability parameters assessed in at least two pilot scale or production scale batches for at least three months.",
      "3) Sterile and biological/immunological active substances are excluded."
    ],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation.",
      "2) Appropriate data on the new packaging (comparative data on permeability, e.g. for O2, CO2, moisture), including a confirmation that the material complies with relevant pharmacopoeial requirements.",
      "3) Proof must be provided that no interaction between the content and the packaging material occurs.",
      "4) The results of stability studies carried out according to the SFDA stability guidelines on at least two pilot or production scale batches for at least three months.",
      "5) A letter of commitment to finalize the stability studies.",
      "6) Comparison of the current and proposed immediate packaging specifications, if applicable."
    ]
  },
  {
    "code": "17.a",
    "title": "Change in the specification parameters and/or limits of the immediate packaging of the active substance – Tightening of specification limits",
    "category": "Quality - Active Substance",
    "type": "IA",
    "conditions": [
      "1) The change is not a consequence of any commitment from previous assessments to review specification limits.",
      "2) The change does not result from unexpected events arising during manufacture of the packaging material or during storage of the active substance.",
      "3) Any change should be within the range of currently approved limits.",
      "4) The test procedure remains the same."
    ],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation.",
      "2) Comparative table of current and proposed specifications."
    ]
  },
  {
    "code": "17.b",
    "title": "Change in the specification parameters and/or limits of the immediate packaging of the active substance – Addition of a new specification parameter with its corresponding test method",
    "category": "Quality - Active Substance",
    "type": "IA",
    "conditions": [
      "1) The change is not a consequence of any commitment from previous assessments to review specification limits.",
      "2) The change does not result from unexpected events arising during manufacture of the packaging material or during storage of the active substance.",
      "5) Any new test method does not concern a novel non-standard technique or a standard technique used in a novel way."
    ],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation.",
      "2) Comparative table of current and proposed specifications.",
      "3) Details of any new analytical method and validation data.",
      "4) Batch analysis data on two batches of the immediate packaging for all specification parameters.",
      "6) Justification of the new specification parameter and the limits."
    ]
  },
  {
    "code": "17.d",
    "title": "Change in the specification parameters and/or limits of the immediate packaging of the active substance – Deletion of a non-significant specification parameter (e.g. deletion of an obsolete test)",
    "category": "Quality - Active Substance",
    "type": "IA",
    "conditions": [
      "1) The change is not a consequence of any commitment from previous assessments to review specification limits.",
      "2) The change does not result from unexpected events arising during manufacture of the packaging material or during storage of the active substance."
    ],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation.",
      "2) Comparative table of current and proposed specifications.",
      "5) Justification/risk-assessment showing that the parameter is non-significant."
    ]
  },
  {
    "code": "18.a",
    "title": "Change in test procedure for the immediate packaging of the active substance – Minor changes to an approved test procedure",
    "category": "Quality - Active Substance",
    "type": "IA",
    "conditions": [
      "1) Appropriate validation studies have been performed in accordance with the relevant guidelines and show that the updated test procedure is at least equivalent to the former.",
      "2) The method of analysis should remain the same (e.g. a change in column length or temperature, but not a different type of column or method).",
      "3) Any new test method does not concern a novel non-standard technique or a standard technique used in a novel way."
    ],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation, including a description of the analytical methodology and a summary of validation data.",
      "2) Comparative validation results or if justified comparative analysis results showing that the current test and the proposed one are equivalent."
    ]
  },
  {
    "code": "18.b",
    "title": "Change in test procedure for the immediate packaging of the active substance – Other changes to a test procedure (including replacement or addition)",
    "category": "Quality - Active Substance",
    "type": "IA",
    "conditions": [
      "1) Appropriate validation studies have been performed in accordance with the relevant guidelines and show that the updated test procedure is at least equivalent to the former.",
      "3) Any new test method does not concern a novel non-standard technique or a standard technique used in a novel way.",
      "4) The active substance/finished product is not biological/immunological."
    ],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation, including a description of the analytical methodology and a summary of validation data.",
      "2) Comparative validation results or if justified comparative analysis results showing that the current test and the proposed one are equivalent."
    ]
  },
  {
    "code": "18.c",
    "title": "Change in test procedure for the immediate packaging of the active substance – Deletion of a test procedure if an alternative test procedure is already authorized",
    "category": "Quality - Active Substance",
    "type": "IA",
    "conditions": [
      "5) There is still a test procedure registered for the specification parameter and this procedure has not been added through a IA/IAIN variation."
    ],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation, including a description of the analytical methodology and a summary of validation data."
    ]
  },
  {
    "code": "19.a.1",
    "title": "Change in the re-test period/storage period or storage conditions of the active substance – Reduction of re-test/storage period",
    "category": "Quality - Active Substance",
    "type": "IA",
    "conditions": [
      "1) The change should not be the result of unexpected events arising during manufacture or because of stability concerns."
    ],
    "documents": [
      "1) Replacement of the relevant pages of the dossier containing results of appropriate recent real-time stability studies on at least two pilot or production-scale batches covering the duration of the requested re-test period.",
      "2) Confirmation that stability studies have been done to the currently approved protocol showing that the agreed relevant specifications are still met.",
      "3) Copy of approved specifications of the active substance."
    ]
  },
  {
    "code": "19.b.1",
    "title": "Change in storage conditions of the active substance – Change to more restrictive storage conditions",
    "category": "Quality - Active Substance",
    "type": "IA",
    "conditions": [
      "1) The change should not be the result of unexpected events arising during manufacture or because of stability concerns."
    ],
    "documents": [
      "1) Replacement of the relevant pages of the dossier containing results of appropriate recent real-time stability studies on at least two pilot or production-scale batches.",
      "2) Confirmation that stability studies have been done to the currently approved protocol.",
      "3) Copy of approved specifications of the active substance."
    ]
  },
  {
    "code": "19.c",
    "title": "Change to an approved stability protocol for the active substance",
    "category": "Quality - Active Substance",
    "type": "IA",
    "conditions": [
      "1) The change should not be the result of unexpected events arising during manufacture or because of stability concerns.",
      "2) The changes do not concern a widening of the acceptance criteria in the parameters tested, a removal of stability indicating parameters or a reduction in the frequency of testing."
    ],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation.",
      "4) Justification for the proposed changes."
    ]
  },
  {
    "code": "20.a",
    "title": "Change or addition of imprints, bossing or other markings including replacement, or addition of inks – Changes in imprints, bossing or other markings",
    "category": "Quality - Finished Product",
    "type": "IAIN",
    "conditions": [
      "1) Finished product release and end of shelf-life specifications have not been changed (except for appearance).",
      "2) Any ink must comply with the relevant pharmaceutical legislation.",
      "3) The scoring/break lines are not intended to divide into equal doses.",
      "4) Any product markings used to differentiate strengths should not be completely deleted."
    ],
    "documents": [
      "1) Replacement of the relevant pages of the dossier including a detailed drawing or written description of the current and new appearance and including revised product information as appropriate.",
      "2) Samples of the finished product where applicable."
    ]
  },
  {
    "code": "21.a",
    "title": "Change in the shape or dimensions of the pharmaceutical form – Immediate release tablets, capsules, suppositories and pessaries",
    "category": "Quality - Finished Product",
    "type": "IAIN",
    "conditions": [
      "1) If appropriate, the dissolution profile of the reformulated product is comparable to the old one.",
      "2) Release and end of shelf-life specifications of the product have not been changed (except for dimensions).",
      "3) The qualitative or quantitative composition and mean mass remain unchanged.",
      "4) The change does not relate to a scored tablet."
    ],
    "documents": [
      "1) Replacement of the relevant pages of the dossier including a detailed drawing of the current and proposed situation.",
      "4) Samples of the finished product where applicable."
    ]
  },
  {
    "code": "22.a.1",
    "title": "Changes in the composition (excipients) – Changes in components of the flavoring or coloring system: Addition, deletion or replacement",
    "category": "Quality - Finished Product",
    "type": "IAIN",
    "conditions": [
      "1) No change in functional characteristics of the pharmaceutical form (e.g. disintegration time, dissolution profile).",
      "2) Any minor adjustment to the formulation to maintain the total weight should be made by an excipient which currently makes up a major part of the finished product formulation.",
      "3) The finished product specifications have only been updated in respect of appearance/odor/taste.",
      "4) Stability studies have been started according to the SFDA stability guidelines on at least two pilot scale or production scale batches for at least three months.",
      "5) Any new proposed components must comply with the relevant guidelines for flavors or colors.",
      "6) The new excipient does not include the use of materials of human or animal origin for which assessment of viral safety or TSE risk is required.",
      "7) Where applicable, the change does not affect the differentiation between strengths.",
      "9) The change is not the result of stability issues.",
      "11) For veterinary medicinal products for oral use, the change does not affect the uptake by target animal species.",
      "12) The change is considered as level 1 according to SUPAC guidelines."
    ],
    "documents": [
      "1) Replacement of the relevant pages of the dossier including identification method for any new colorant and if appropriate updated end of shelf-life specifications.",
      "3) A declaration letter that stability studies will be finalized and that data will be submitted immediately to the authority in case of any OOS results.",
      "4) Sample of the new product, where applicable.",
      "5) Either a TSE Certificate of Suitability for any new source of material or documentary evidence of prior assessment.",
      "6) Any new proposed components must comply with the relevant guidelines for flavors or colors."
    ]
  },
  {
    "code": "22.a.2",
    "title": "Changes in the composition (excipients) – Changes in components of the flavoring or coloring system: Increase or reduction",
    "category": "Quality - Finished Product",
    "type": "IAIN",
    "conditions": [
      "1) No change in functional characteristics of the pharmaceutical form.",
      "2) Any minor adjustment to the formulation to maintain the total weight should be made by an excipient which currently makes up a major part of the finished product formulation.",
      "3) The finished product specifications have only been updated in respect of appearance/odor/taste.",
      "4) Stability studies have been started according to the SFDA stability guidelines on at least two pilot scale or production scale batches for at least three months.",
      "11) For veterinary medicinal products for oral use, the change does not affect the uptake by target animal species.",
      "12) The change is considered as level 1 according to SUPAC guidelines."
    ],
    "documents": [
      "1) Replacement of the relevant pages of the dossier.",
      "2) The results of stability studies carried out according to the SFDA stability guidelines on at least two pilot or production scale batches for at least three months.",
      "3) A declaration letter that stability studies will be finalized.",
      "4) Sample of the new product, where applicable."
    ]
  },
  {
    "code": "26.a",
    "title": "Replacement or addition of a manufacturing site for part or all of the manufacturing process of the finished product – Secondary packaging site",
    "category": "Quality - Finished Product",
    "type": "IAIN",
    "conditions": [
      "1) Satisfactory inspection by SFDA in the last five years.",
      "2) Site appropriately authorized (to manufacture the pharmaceutical form or product concerned) by SFDA."
    ],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation.",
      "2) Proof that the proposed site is appropriately authorized for the pharmaceutical form or product concerned.",
      "3) A certificate of GMP compliance issued from the SFDA or GCC, if available.",
      "4) Registration of the new manufacturing site at the SFDA, if not registered.",
      "5) Certificate of a Pharmaceutical Product (CPP) or Electronic CPP (eCPP) stating the new manufacturing site.",
      "6) The submitted documents should clearly outline the 'present' and 'proposed' finished product manufacturers."
    ]
  },
  {
    "code": "26.b",
    "title": "Replacement or addition of a manufacturing site for part or all of the manufacturing process of the finished product – Primary packaging site",
    "category": "Quality - Finished Product",
    "type": "IAIN",
    "conditions": [
      "1) Satisfactory inspection by SFDA in the last five years.",
      "2) Site appropriately authorized (to manufacture the pharmaceutical form or product concerned) by SFDA.",
      "3) Product concerned is not a sterile product.",
      "4) Where relevant, for instance for suspensions and emulsions, validation scheme is available or validation of the manufacture at the new site has been successfully carried out with at least three production scale batches.",
      "5) Product concerned is not a biological/immunological medicinal product."
    ],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation.",
      "2) Proof that the proposed site is appropriately authorized for the pharmaceutical form or product concerned.",
      "3) A certificate of GMP compliance issued from the SFDA or GCC, if available.",
      "4) Registration of the new manufacturing site at the SFDA, if not registered.",
      "5) Certificate of a Pharmaceutical Product (CPP) or Electronic CPP (eCPP) stating the new manufacturing site.",
      "6) The submitted documents should clearly outline the 'present' and 'proposed' finished product manufacturers.",
      "8) Copy of approved release and end of shelf-life specifications for the product if relevant.",
      "12) Where relevant the batch numbers, corresponding batch size and the manufacturing date of batches (≥3) used in the validation study should be indicated or validation protocol (scheme) be submitted.",
      "15) If the manufacturing site and the primary packaging site are different, conditions of transport and bulk storage should be specified and validated."
    ]
  },
  {
    "code": "27.a",
    "title": "Change to batch release arrangements and quality control testing of the finished product – Replacement or addition of a site where batch control/testing takes place",
    "category": "Quality - Finished Product",
    "type": "IAIN",
    "conditions": [
      "1) The site is appropriately authorized by SFDA.",
      "2) The product is not a biological/immunological medicinal product.",
      "3) Method transfer from the old to the new site or new test laboratory has been successfully completed."
    ],
    "documents": [
      "1) Attach copy of manufacturing authorization(s) or where no manufacturing authorization exists a certificate of GMP compliance issued within the last 3 years by the relevant competent authority.",
      "2) The submitted documents should clearly outline the 'present' and 'proposed' batch control/testing and batch release sites.",
      "4) Replacement of the relevant pages of the dossier that are affected by the variation.",
      "5) Method transfer from the old to the new site or new test laboratory."
    ]
  },
  {
    "code": "27.c.1",
    "title": "Change to batch release arrangements and quality control testing of the finished product – Replacement or addition of a manufacturer responsible for batch release – Not including batch control/testing",
    "category": "Quality - Finished Product",
    "type": "IAIN",
    "conditions": [
      "1) The site is appropriately authorized by SFDA."
    ],
    "documents": [
      "1) Attach copy of manufacturing authorization(s) or certificate of GMP compliance issued within the last 3 years.",
      "2) The submitted documents should clearly outline the 'present' and 'proposed' batch release sites.",
      "3) A declaration by the Qualified Person (QP) responsible for batch certification.",
      "4) Replacement of the relevant pages of the dossier that are affected by the variation."
    ]
  },
  {
    "code": "27.c.2",
    "title": "Change to batch release arrangements and quality control testing of the finished product – Replacement or addition of a manufacturer responsible for batch release – Including batch control/testing",
    "category": "Quality - Finished Product",
    "type": "IAIN",
    "conditions": [
      "1) The site is appropriately authorized by SFDA.",
      "2) The product is not a biological/immunological medicinal product.",
      "3) Method transfer from the old to the new site or new test laboratory has been successfully completed."
    ],
    "documents": [
      "1) Attach copy of manufacturing authorization(s) or certificate of GMP compliance issued within the last 3 years.",
      "2) The submitted documents should clearly outline the 'present' and 'proposed' batch release sites.",
      "3) A declaration by the Qualified Person (QP) responsible for batch certification.",
      "4) Replacement of the relevant pages of the dossier that are affected by the variation.",
      "5) Method transfer from the old to the new site or new test laboratory."
    ]
  },
  {
    "code": "28.f",
    "title": "Change in the manufacturing process of the finished product – Minor change in the manufacturing process",
    "category": "Quality - Finished Product",
    "type": "IAIN",
    "conditions": [
      "1) No change in qualitative and quantitative impurity profile or in physicochemical properties.",
      "2) Either the change relates to an immediate release solid oral dosage form/oral solution and the medicinal product concerned is not a biological/immunological or herbal medicinal product; Or the change relates to process parameter(s) considered to have no impact on the quality of the finished product.",
      "3) The manufacturing principle including the single manufacturing steps remain the same.",
      "4) The currently registered process has to be controlled by relevant in-process controls and no changes (widening or deletion of limits) are required to these controls.",
      "5) The specifications of the finished product or intermediates are unchanged.",
      "6) The new process must lead to an identical product regarding all aspects of quality, safety and efficacy.",
      "7) Relevant stability studies have been started according to the SFDA stability guidelines and relevant stability parameters assessed in at least one pilot scale or production scale batch for at least three months.",
      "8) The change is considered as a level 1 according to SUPAC guidelines."
    ],
    "documents": [
      "1) Replacement of the relevant pages of the dossier including a direct comparison of the present process and the new process.",
      "2) For semi-solid and liquid products in which the active substance is present in non-dissolved form: appropriate validation of the change including microscopic imaging.",
      "3) For solid dosage forms: dissolution profile data of one representative production batch and comparative data of the last three batches from the previous process.",
      "4) Batch analysis data on at least two pilot or production scale batches of the finished product.",
      "5) Relevant stability data.",
      "6) A letter of commitment to finalize the stability studies.",
      "7) Copy of approved release and end of shelf-life specifications.",
      "8) For immediate release solid dosage forms: comparative dissolution profile data.",
      "9) A letter of commitment to finalize the stability studies."
    ]
  },
  {
    "code": "29.a",
    "title": "Change in the batch size (including batch size ranges) of the finished product – Up to 10-fold compared to the currently approved batch size",
    "category": "Quality - Finished Product",
    "type": "IAIN",
    "conditions": [
      "1) The change does not affect reproducibility and/or consistency of the product.",
      "2) The change relates to standard immediate release oral pharmaceutical forms or to non-sterile liquid based pharmaceutical forms.",
      "3) Any changes to the manufacturing method and/or to the in-process controls are only those necessitated by the change in batch-size.",
      "4) Validation scheme is available or validation of the manufacture has been successfully carried out with at least three batches at the proposed new batch size.",
      "5) The product concerned is not a biological/immunological medicinal product.",
      "7) The currently approved batch size was not approved via a Type IA variation."
    ],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation.",
      "4) Where relevant the batch numbers, corresponding batch size and the manufacturing date of batches (≥3) used in the validation study should be indicated or validation protocol (scheme) be submitted."
    ]
  },
  {
    "code": "29.b",
    "title": "Change in the batch size (including batch size ranges) of the finished product – Downscaling down to 10-fold",
    "category": "Quality - Finished Product",
    "type": "IA",
    "conditions": [
      "1) The change does not affect reproducibility and/or consistency of the product.",
      "2) The change relates to standard immediate release oral pharmaceutical forms or to non-sterile liquid based pharmaceutical forms.",
      "3) Any changes to the manufacturing method and/or to the in-process controls are only those necessitated by the change in batch-size.",
      "4) Validation scheme is available or validation of the manufacture has been successfully carried out with at least three batches.",
      "5) The product concerned is not a biological/immunological medicinal product.",
      "6) The change should not be the result of unexpected events arising during manufacture or because of stability concerns."
    ],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation.",
      "4) Where relevant the batch numbers, corresponding batch size and the manufacturing date of batches (≥3) used in the validation study should be indicated or validation protocol (scheme) be submitted."
    ]
  },
  {
    "code": "30.a",
    "title": "Change to in-process tests or limits applied during the manufacture of the finished product – Tightening of in-process limits",
    "category": "Quality - Finished Product",
    "type": "IA",
    "conditions": [
      "1) The change is not a consequence of any commitment from previous assessments to review specification limits.",
      "2) The change does not result from unexpected events arising during manufacture.",
      "3) Any change should be within the range of currently approved limits.",
      "4) The test procedure remains the same."
    ],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation.",
      "2) Comparative table of current and proposed in-process tests."
    ]
  },
  {
    "code": "30.b",
    "title": "Change to in-process tests or limits applied during the manufacture of the finished product – Addition of a new test and limits",
    "category": "Quality - Finished Product",
    "type": "IA",
    "conditions": [
      "1) The change is not a consequence of any commitment from previous assessments to review specification limits.",
      "2) The change does not result from unexpected events arising during manufacture.",
      "5) Any new test method does not concern a novel non-standard technique or a standard technique used in a novel way.",
      "6) The new test method is not a biological/immunological/immunochemical method or a method using a biological reagent for a biological active substance."
    ],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation.",
      "2) Comparative table of current and proposed in-process tests.",
      "3) Details of any new analytical method and validation data.",
      "4) Batch analysis data on two production batches of the finished product for all specification parameters.",
      "5) Where appropriate, comparative dissolution profile data for the finished product.",
      "7) Justification of the new in-process test and limits."
    ]
  },
  {
    "code": "30.f",
    "title": "Change to in-process tests or limits applied during the manufacture of the finished product – Deletion of a non-significant in-process test",
    "category": "Quality - Finished Product",
    "type": "IA",
    "conditions": [
      "1) The change is not a consequence of any commitment from previous assessments to review specification limits.",
      "2) The change does not result from unexpected events arising during manufacture.",
      "7) The in-process test does not concern the control of a critical parameter."
    ],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation.",
      "2) Comparative table of current and proposed in-process tests.",
      "6) Justification/risk-assessment showing that the parameter is non-significant."
    ]
  },
  {
    "code": "31.a",
    "title": "Change in the specification parameters and/or limits of an excipient – Tightening of specification limits",
    "category": "Quality - Finished Product",
    "type": "IA",
    "conditions": [
      "1) The change is not a consequence of any commitment from previous assessments to review specification limits.",
      "2) The change does not result from unexpected events arising during manufacture.",
      "3) Any change should be within the range of currently approved limits.",
      "4) The test procedure remains the same."
    ],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation.",
      "2) Comparative table of current and proposed specifications."
    ]
  },
  {
    "code": "31.b",
    "title": "Change in the specification parameters and/or limits of an excipient – Addition of a new specification parameter to the specification",
    "category": "Quality - Finished Product",
    "type": "IA",
    "conditions": [
      "1) The change is not a consequence of any commitment from previous assessments to review specification limits.",
      "2) The change does not result from unexpected events arising during manufacture.",
      "5) Any new test method does not concern a novel non-standard technique or a standard technique used in a novel way.",
      "6) The test method is not a biological/immunological/immunochemical method.",
      "7) The change does not concern a genotoxic impurity."
    ],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation.",
      "2) Comparative table of current and proposed specifications.",
      "3) Details of any new analytical method and validation data.",
      "4) Batch analysis data on two production batches of the excipient for all specification parameters.",
      "6) Justification for not submitting a new bioequivalence study, if appropriate.",
      "8) Justification of the new specification parameter and the limits."
    ]
  },
  {
    "code": "31.f",
    "title": "Change in the specification parameters and/or limits of an excipient – Deletion of a non-significant specification parameter (e.g. deletion of an obsolete test such as organoleptic test)",
    "category": "Quality - Finished Product",
    "type": "IA",
    "conditions": [
      "1) The change is not a consequence of any commitment from previous assessments to review specification limits.",
      "2) The change does not result from unexpected events arising during manufacture.",
      "8) The specification parameter does not concern the control of a critical parameter (e.g. impurities, critical physical characteristics, identity test, microbiological control)."
    ],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation.",
      "2) Comparative table of current and proposed specifications.",
      "7) Justification/risk-assessment showing that the parameter is non-significant."
    ]
  },
  {
    "code": "32.a",
    "title": "Change in test procedure for an excipient – Minor changes to an approved test procedure",
    "category": "Quality - Finished Product",
    "type": "IA",
    "conditions": [
      "1) Appropriate validation studies have been performed in accordance with the relevant guidelines and show that the updated test procedure is at least equivalent to the former.",
      "2) There have been no changes of the total impurity limits; no new unqualified impurities are detected.",
      "3) The method of analysis should remain the same (e.g. a change in column length or temperature, but not a different type of column or method).",
      "4) The test method is not a biological/immunological/immunochemical method or a method using a biological reagent."
    ],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation, including a description of the analytical methodology and a summary of validation data.",
      "2) Comparative validation results or if justified comparative analysis results showing that the current test and the proposed one are equivalent."
    ]
  },
  {
    "code": "32.d",
    "title": "Change in test procedure for an excipient – Deletion of a test procedure if an alternative test procedure is already authorized",
    "category": "Quality - Finished Product",
    "type": "IA",
    "conditions": [
      "5) An alternative test procedure is already authorised for the specification parameter and this procedure has not been added through IA variation."
    ],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation, including a description of the analytical methodology and a summary of validation data."
    ]
  },
  {
    "code": "33.a.2",
    "title": "Change in source of an excipient or reagent with TSE risk – Change from TSE risk material to vegetable or synthetic origin: For excipients or reagents not used in the manufacture of biological active substance or a finished product containing a biological active substance",
    "category": "Quality - Finished Product",
    "type": "IA",
    "conditions": [
      "1) Excipient and finished product release and end of shelf-life specifications remain the same."
    ],
    "documents": [
      "1) Declaration from the manufacturer of the material that it is purely of vegetable or synthetic origin."
    ]
  },
  {
    "code": "34",
    "title": "Change in supplier of an excipient or reagent without TSE risk",
    "category": "Quality - Finished Product",
    "type": "IA",
    "conditions": [
      "1) The material is purely of vegetable or synthetic origin."
    ],
    "documents": [
      "1) Declaration from the manufacturer of the material that it is purely of vegetable or synthetic origin.",
      "2) Replacement of the relevant section(s) of the dossier, including specifications and batch analysis of the excipient."
    ]
  },
  {
    "code": "35.a",
    "title": "Change in synthesis or recovery of a non-pharmacopoeial excipient (when described in the dossier) or a novel excipient – Minor change in synthesis or recovery of a non-pharmacopoeial excipient or a novel excipient",
    "category": "Quality - Finished Product",
    "type": "IA",
    "conditions": [
      "1) The synthesis and specifications are identical and there is no change in qualitative and quantitative impurity profile (excluding residual solvents, provided they are controlled in accordance with ICH/VICH limits) or in physicochemical properties.",
      "2) Adjuvants are excluded."
    ],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation.",
      "2) Batch analysis data (comparative tabulated format) of at least two batches (minimum pilot scale) of the excipient manufactured according to the old and the new process.",
      "3) Where appropriate, comparative dissolution profile data for the finished product of at least two batches (minimum pilot scale).",
      "4) Copy of approved and new (if applicable) specifications of the excipient."
    ]
  },
  {
    "code": "36.a",
    "title": "Change in the specification parameters and/or limits of the finished product – Tightening of specification limits",
    "category": "Quality - Finished Product",
    "type": "IA",
    "conditions": [
      "1) The change is not a consequence of any commitment from previous assessments to review specification limits.",
      "2) The change does not result from unexpected events arising during manufacture.",
      "3) Any change should be within the range of currently approved limits.",
      "4) The test procedure remains the same."
    ],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation.",
      "2) Comparative table of current and proposed specifications."
    ]
  },
  {
    "code": "36.b",
    "title": "Change in the specification parameters and/or limits of the finished product – Addition of a new specification parameter with its corresponding test method",
    "category": "Quality - Finished Product",
    "type": "IA",
    "conditions": [
      "1) The change is not a consequence of any commitment from previous assessments to review specification limits.",
      "2) The change does not result from unexpected events arising during manufacture.",
      "5) Any new test method does not concern a novel non-standard technique or a standard technique used in a novel way.",
      "6) The test method is not a biological/immunological/immunochemical method or a method using a biological reagent.",
      "7) The change does not concern any impurities (including genotoxic) or dissolution."
    ],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation.",
      "2) Comparative table of current and proposed specifications.",
      "3) Details of any new analytical method and validation data.",
      "4) Batch analysis data on two production batches of the finished product for all specification parameters at the end of shelf life.",
      "5) Where appropriate, comparative dissolution profile data for the finished product.",
      "7) Justification of the new specification parameter and the limits."
    ]
  },
  {
    "code": "36.f",
    "title": "Change in the specification parameters and/or limits of the finished product – Deletion of a non-significant specification parameter (e.g. deletion of an obsolete parameter such as odour and taste or identification test for a colouring or flavouring material)",
    "category": "Quality - Finished Product",
    "type": "IA",
    "conditions": [
      "1) The change is not a consequence of any commitment from previous assessments to review specification limits.",
      "2) The change does not result from unexpected events arising during manufacture.",
      "8) The specification parameter or proposal for the specific dosage form does not concern a critical parameter (e.g. assay, impurities, critical physical characteristics, a test required for the particular dosage form)."
    ],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation.",
      "2) Comparative table of current and proposed specifications.",
      "6) Justification/risk-assessment showing that the parameter is non-significant."
    ]
  },
  {
    "code": "36.g",
    "title": "Change in the specification parameters and/or limits of the finished product – Update of the dossier to comply with the provisions of an updated monograph of an official pharmacopeia for the finished product",
    "category": "Quality - Finished Product",
    "type": "IA",
    "conditions": [
      "1) The change is not a consequence of any commitment from previous assessments to review specification limits.",
      "2) The change does not result from unexpected events arising during manufacture.",
      "3) Any change should be within the range of currently approved limits.",
      "4) The test procedure remains the same.",
      "7) The change does not concern any impurities (including genotoxic) or dissolution."
    ],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation.",
      "2) Comparative table of current and proposed specifications."
    ]
  },
  {
    "code": "37.a",
    "title": "Change in test procedure for the finished product – Minor changes to an approved test procedure",
    "category": "Quality - Finished Product",
    "type": "IA",
    "conditions": [
      "1) Appropriate validation studies have been performed in accordance with the relevant guidelines and show that the updated test procedure is at least equivalent to the former.",
      "2) There have been no changes of the total impurity limits; no new unqualified impurities are detected.",
      "3) The method of analysis should remain the same (e.g. a change in column length or temperature, but not a different type of column or method).",
      "4) The test method is not a biological/immunological/immunochemical method or a method using a biological reagent."
    ],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation, including a description of the analytical methodology and a summary of validation data.",
      "2) Comparative validation results or if justified comparative analysis results showing that the current test and the proposed one are equivalent."
    ]
  },
  {
    "code": "37.d",
    "title": "Change in test procedure for the finished product – Deletion of a test procedure if an alternative method is already authorized",
    "category": "Quality - Finished Product",
    "type": "IA",
    "conditions": [
      "4) The test method is not a biological/immunological/immunochemical method or a method using a biological reagent."
    ],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation, including a description of the analytical methodology and a summary of validation data."
    ]
  },
  {
    "code": "37.e",
    "title": "Change in test procedure for the finished product – Update of the test procedure to comply with the updated monograph in an official pharmacopeia",
    "category": "Quality - Finished Product",
    "type": "IA",
    "conditions": [
      "2) There have been no changes of the total impurity limits; no new unqualified impurities are detected.",
      "3) The method of analysis should remain the same.",
      "4) The test method is not a biological/immunological/immunochemical method or a method using a biological reagent.",
      "5) The registered test procedure already refers to the monograph of an official pharmacopeia and any changes are minor in nature and require update of the technical dossier."
    ],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation, including a description of the analytical methodology and a summary of validation data."
    ]
  },
  {
    "code": "37.f",
    "title": "Change in test procedure for the finished product – To reflect compliance with the official pharmacopeia and remove reference to the outdated internal test method and test method number",
    "category": "Quality - Finished Product",
    "type": "IA",
    "conditions": [
      "2) There have been no changes of the total impurity limits; no new unqualified impurities are detected.",
      "3) The method of analysis should remain the same.",
      "4) The test method is not a biological/immunological/immunochemical method or a method using a biological reagent.",
      "5) The registered test procedure already refers to the monograph of an official pharmacopeia and any changes are minor in nature."
    ],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation, including a description of the analytical methodology and a summary of validation data."
    ]
  },
  {
    "code": "39.a.1",
    "title": "Change in immediate packaging of the finished product – Change in qualitative and quantitative composition: Solid pharmaceutical forms",
    "category": "Container Closure System",
    "type": "IAIN",
    "conditions": [
      "1) The change only concerns the same packaging/container type (e.g. blister to blister).",
      "2) The proposed packaging material must be at least equivalent to the approved material in respect of its relevant properties.",
      "3) Satisfactory results of the relevant stability studies have been started according to the SFDA stability guidelines on at least two pilot scale or production scale batches for at least three months."
    ],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation.",
      "2) Appropriate data on the new packaging (comparative data on permeability, etc.).",
      "3) Proof must be provided that no interaction between the content and the packaging material occurs.",
      "4) The results of stability studies carried out according to the SFDA stability guidelines on at least two pilot or production scale batches for at least three months.",
      "5) A letter of commitment to finalize the stability studies.",
      "6) Comparison of the current and proposed immediate packaging specifications."
    ]
  },
  {
    "code": "39.b.3",
    "title": "Change in immediate packaging of the finished product – Deletion of an immediate packaging that does not lead to the complete deletion of a strength or pharmaceutical form",
    "category": "Container Closure System",
    "type": "IA",
    "conditions": [
      "4) The remaining product presentation(s) must be adequate for the dosing instructions and treatment duration as mentioned in the summary of product characteristics."
    ],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation.",
      "8) Justification for the deletion."
    ]
  },
  {
    "code": "40.a",
    "title": "Change in the specification parameters and/or limits of the immediate packaging of the finished product – Tightening of specification limits",
    "category": "Container Closure System",
    "type": "IA",
    "conditions": [
      "1) The change is not a consequence of any commitment from previous assessments to review specification limits (e.g. made during the procedure for the marketing authorization application or a type II variation procedure).",
      "2) The change does not result from unexpected events arising during manufacture.",
      "3) Any change should be within the range of currently approved limits.",
      "4) The test procedure remains the same."
    ],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation.",
      "2) Comparative table of current and proposed specifications."
    ]
  },
  {
    "code": "40.b",
    "title": "Change in the specification parameters and/or limits of the immediate packaging of the finished product – Addition of a new specification parameter to the specification",
    "category": "Container Closure System",
    "type": "IA",
    "conditions": [
      "1) The change is not a consequence of any commitment from previous assessments to review specification limits.",
      "2) The change does not result from unexpected events arising during manufacture.",
      "5) Any new test method does not concern a novel non-standard technique or a standard technique used in a novel way."
    ],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation.",
      "2) Comparative table of current and proposed specifications.",
      "3) Details of any new analytical method and validation data.",
      "4) Batch analysis data on two batches of the immediate packaging for all specification parameters.",
      "6) Justification of the new specification parameter and the limits."
    ]
  },
  {
    "code": "40.d",
    "title": "Change in the specification parameters and/or limits of the immediate packaging of the finished product – Deletion of a non-significant specification parameter (e.g. deletion of an obsolete test)",
    "category": "Container Closure System",
    "type": "IA",
    "conditions": [
      "1) The change is not a consequence of any commitment from previous assessments to review specification limits.",
      "2) The change does not result from unexpected events arising during manufacture."
    ],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation.",
      "2) Comparative table of current and proposed specifications.",
      "5) Justification/risk-assessment showing that the parameter is non-significant or that it is obsolete."
    ]
  },
  {
    "code": "41.a",
    "title": "Change in test procedure for the immediate packaging of the finished product – Minor changes to an approved test procedure",
    "category": "Container Closure System",
    "type": "IA",
    "conditions": [
      "1) Appropriate validation studies have been performed in accordance with the relevant guidelines and show that the updated test procedure is at least equivalent to the former.",
      "2) The method of analysis should remain the same (e.g. a change in column length or temperature, but not a different type of column or method).",
      "3) Any new test method does not concern a novel non-standard technique or a standard technique used in a novel way."
    ],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation, which includes a description of the analytical methodology and a summary of validation data.",
      "2) Comparative validation results or if justified comparative analysis results showing that the current test and the proposed one are equivalent."
    ]
  },
  {
    "code": "41.b",
    "title": "Change in test procedure for the immediate packaging of the finished product – Other changes to a test procedure (including replacement or addition)",
    "category": "Container Closure System",
    "type": "IA",
    "conditions": [
      "1) Appropriate validation studies have been performed in accordance with the relevant guidelines and show that the updated test procedure is at least equivalent to the former.",
      "3) Any new test method does not concern a novel non-standard technique or a standard technique used in a novel way.",
      "4) The active substance/finished product is not biological/immunological."
    ],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation, which includes a description of the analytical methodology and a summary of validation data.",
      "2) Comparative validation results or if justified comparative analysis results showing that the current test and the proposed one are equivalent."
    ]
  },
  {
    "code": "41.c",
    "title": "Change in test procedure for the immediate packaging of the finished product – Deletion of a test procedure if an alternative test procedure is already authorized",
    "category": "Container Closure System",
    "type": "IA",
    "conditions": [
      "5) An alternative test procedure is already authorised for the specification parameter and this procedure has not been added through IA variation."
    ],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation, which includes a description of the analytical methodology and a summary of validation data."
    ]
  },
  {
    "code": "42.a",
    "title": "Change in shape or dimensions of the container or closure (immediate packaging) – Non-sterile medicinal products",
    "category": "Container Closure System",
    "type": "IA",
    "conditions": [
      "1) No change in the qualitative or quantitative composition of the container.",
      "2) The change does not concern a fundamental part of the packaging material, which affects the delivery, use, safety or stability of the finished product.",
      "3) In case of a change in the headspace or a change in the surface/volume ratio, satisfactory results of stability studies on at least two pilot/production scale batches for at least three months."
    ],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation (including description, detailed drawing and composition of the container or closure material).",
      "2) Samples of the current and new container/closure where applicable.",
      "4) In case of a change in the headspace or surface/volume ratio: stability study results and letter of commitment."
    ]
  },
  {
    "code": "43.a.1",
    "title": "Change in pack size of the finished product – Change in the number of units in a pack – Change within the range of the currently approved pack sizes",
    "category": "Container Closure System",
    "type": "IAIN",
    "conditions": [
      "1) New pack size should be consistent with the posology and treatment duration as approved in the summary of product characteristics.",
      "2) The primary packaging process, equipment and material remains the same."
    ],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation, including revised product information as appropriate.",
      "2) Justification for the new/remaining pack-size.",
      "3) Certificate of a Pharmaceutical Product (CPP) stating the new pack size.",
      "4) The results of stability studies on at least two pilot or production scale batches for at least three months.",
      "5) A letter of commitment to finalize the stability study and to report any out-of-specification results.",
      "6) A recent and official price certificate legalized by the Saudi Embassy in the country of origin.",
      "7) Samples of the finished product."
    ]
  },
  {
    "code": "43.b",
    "title": "Change in pack size of the finished product – Deletion of a pack size(s)",
    "category": "Container Closure System",
    "type": "IA",
    "conditions": [
      "3) The remaining product presentation(s) must be adequate for the dosing instructions and treatment duration as mentioned in the Summary of Product Characteristics."
    ],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation, including revised product information as appropriate.",
      "2) Justification for the remaining pack-size."
    ]
  },
  {
    "code": "43.e",
    "title": "Change in pack size of the finished product – Change in the presentations of units (Tablets, Capsule) without changing the number of units",
    "category": "Container Closure System",
    "type": "IAIN",
    "conditions": [
      "2) The primary packaging process, equipment and material remains the same."
    ],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation, including revised product information as appropriate.",
      "4) The results of stability studies on at least two pilot or production scale batches for at least three months.",
      "5) A letter of commitment to finalize the stability study and to report any out-of-specification results.",
      "7) Samples of the finished product.",
      "8) Validation results of the primary packaging equipment (e.g. blistering machine)."
    ]
  },
  {
    "code": "44.a",
    "title": "Change in any part of the (primary) packaging material not in contact with the finished product formulation – Change that affects the product information",
    "category": "Container Closure System",
    "type": "IAIN",
    "conditions": [
      "1) The change does not concern a part of the packaging material, which affects the delivery, use, safety or stability of the finished product."
    ],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation."
    ]
  },
  {
    "code": "44.b",
    "title": "Change in any part of the (primary) packaging material not in contact with the finished product formulation – Change that does not affect the product information",
    "category": "Container Closure System",
    "type": "IA",
    "conditions": [
      "1) The change does not concern a part of the packaging material, which affects the delivery, use, safety or stability of the finished product."
    ],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation."
    ]
  },
  {
    "code": "45.a",
    "title": "Change in supplier of packaging components or devices (when mentioned in the dossier) – Deletion of a supplier",
    "category": "Container Closure System",
    "type": "IA",
    "conditions": [
      "1) No deletion of packaging component or device."
    ],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation."
    ]
  },
  {
    "code": "45.b",
    "title": "Change in supplier of packaging components or devices (when mentioned in the dossier) – Replacement or addition of a supplier",
    "category": "Container Closure System",
    "type": "IA",
    "conditions": [
      "1) No deletion of packaging component or device.",
      "2) The qualitative and quantitative composition of the packaging components/device and design specifications remain the same.",
      "3) The specifications and quality control method are at least equivalent.",
      "4) The sterilization method and conditions remain the same, if applicable."
    ],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation.",
      "2) For devices for medicinal products for human use, shall have MDMA.",
      "3) Comparative table of current and proposed specifications, if applicable."
    ]
  },
  {
    "code": "47.a.1",
    "title": "Change in the shelf-life or storage conditions of the finished product – Reduction of the shelf-life of the finished product as packaged for sale (and after first opening / after dilution or reconstitution)",
    "category": "Quality - Finished Product",
    "type": "IAIN",
    "conditions": [
      "1) The change should not be the result of unexpected events arising during manufacture or because of stability concerns."
    ],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation.",
      "2) Recent real time stability studies conducted according to the SFDA stability guidelines.",
      "3) Copy of approved end of shelf life finished product specification."
    ]
  },
  {
    "code": "47.e",
    "title": "Change in the shelf-life or storage conditions of the finished product – Change to an approved stability protocol",
    "category": "Quality - Finished Product",
    "type": "IA",
    "conditions": [
      "1) The change should not be the result of unexpected events arising during manufacture or because of stability concerns.",
      "2) The change does not concern a widening of the acceptance criteria in the parameters tested, a removal of stability indicating parameters or a reduction in the frequency of testing."
    ],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation.",
      "4) Justification for the proposed change(s)."
    ]
  },
  {
    "code": "48.a.1",
    "title": "Submission of a new Certificate of Suitability from an already approved manufacturer (active substance / starting material / excipient)",
    "category": "Safety and Efficacy",
    "type": "IAIN",
    "conditions": [
      "1) The finished product release and end of shelf-life specifications remain the same.",
      "2) Unchanged additional specifications for impurities and product specific requirements, if applicable.",
      "3) The manufacturing process of the active substance does not include materials of human or animal origin for which viral safety data is required.",
      "4) For active substance only, tested immediately prior to use if no retest period is included in the CEP.",
      "5) The active substance/starting material/reagent/intermediate/excipient is not sterile.",
      "8) For herbal active substances: the manufacturing route, physical form, extraction solvent and DER should remain the same.",
      "11) If the active substance is not sterile but used in a sterile medicinal product, the CEP must confirm it is free from bacterial endotoxins if water is used in the last steps."
    ],
    "documents": [
      "1) A valid Certificate of Suitability (CEP) including any annexes.",
      "2) Documents clearly outlining the present and proposed manufacturers.",
      "3) Replacement of the relevant pages of the dossier.",
      "4) Where applicable, TSE/BSE risk information.",
      "5) Where applicable, declaration(s) from the Qualified Person(s) (QP) of each of the manufacturing authorization holder(s) listed in the marketing authorization application where the active substance is used as a starting material, and from the QP of each of the manufacturing authorization holder(s) listed in the marketing authorization application as responsible for batch release, stating that the active substance manufacturer(s) referred to in the application operate in compliance with the detailed guidelines on good manufacturing practice for starting materials. Under certain circumstances a single declaration may be acceptable."
    ]
  },
  {
    "code": "48.a.2",
    "title": "Submission of an updated Certificate of Suitability from an already approved manufacturer (active substance / starting material / excipient)",
    "category": "Safety and Efficacy",
    "type": "IA",
    "conditions": [
      "1) The finished product release and end of shelf-life specifications remain the same.",
      "2) Unchanged additional specifications for impurities and product specific requirements, if applicable.",
      "3) The manufacturing process does not include materials of human or animal origin for which viral safety data is required.",
      "4) For active substance only, tested immediately prior to use if no retest period is included in the CEP.",
      "8) For herbal active substances: manufacturing route, physical form, extraction solvent and DER should remain the same."
    ],
    "documents": [
      "1) A valid Certificate of Suitability (CEP) including any annexes.",
      "2) Documents clearly outlining the present and proposed manufacturers.",
      "3) Replacement of the relevant pages of the dossier.",
      "4) Where applicable, TSE/BSE risk information.",
      "5) Where applicable, declaration(s) from the Qualified Person(s) (QP) of each of the manufacturing authorization holder(s) listed in the marketing authorization application where the active substance is used as a starting material, and from the QP of each of the manufacturing authorization holder(s) listed in the marketing authorization application as responsible for batch release, stating that the active substance manufacturer(s) referred to in the application operate in compliance with the detailed guidelines on good manufacturing practice for starting materials. Under certain circumstances a single declaration may be acceptable."
    ]
  },
  {
    "code": "48.a.3",
    "title": "Submission of a new Certificate of Suitability from a new manufacturer (replacement or addition) for active substance / starting material / excipient",
    "category": "Safety and Efficacy",
    "type": "IAIN",
    "conditions": [
      "1) The finished product release and end of shelf-life specifications remain the same.",
      "2) Unchanged additional specifications for impurities and product specific requirements, if applicable.",
      "3) The manufacturing process does not include materials of human or animal origin for which viral safety data is required.",
      "4) For active substance only, tested immediately prior to use if no retest period.",
      "5) The active substance/starting material/reagent/intermediate/excipient is not sterile.",
      "8) For herbal active substances: manufacturing route, physical form, extraction solvent and DER should remain the same.",
      "11) If the active substance is not sterile but used in a sterile medicinal product, the CEP must confirm it is free from bacterial endotoxins."
    ],
    "documents": [
      "1) A valid Certificate of Suitability (CEP) including any annexes.",
      "2) Documents clearly outlining the present and proposed manufacturers.",
      "3) Replacement of the relevant pages of the dossier.",
      "4) Where applicable, TSE/BSE risk information.",
      "5) Where applicable, declaration(s) from the Qualified Person(s) (QP) of each of the manufacturing authorization holder(s) listed in the marketing authorization application where the active substance is used as a starting material, and from the QP of each of the manufacturing authorization holder(s) listed in the marketing authorization application as responsible for batch release, stating that the active substance manufacturer(s) referred to in the application operate in compliance with the detailed guidelines on good manufacturing practice for starting materials. Under certain circumstances a single declaration may be acceptable.",
      "7) Specifications of the finished product manufacturer including all tests and limits of the CEP and Ph.Eur. monograph.",
      "8) Batch analysis from both API manufacturer and finished product manufacturer.",
      "9) Letter of commitment to initiate stability studies using API from the new supplier.",
      "10) Comparative dissolution profile data for the finished product on at least one production batch."
    ]
  },
  {
    "code": "48.a.4",
    "title": "Deletion of a Certificate of Suitability (in case multiple certificates exist per material) for active substance / starting material / excipient",
    "category": "Safety and Efficacy",
    "type": "IA",
    "conditions": [
      "10) At least one manufacturer for the same substance remains in the dossier."
    ],
    "documents": [
      "3) Replacement of the relevant pages of the dossier."
    ]
  },
  {
    "code": "48.b.1",
    "title": "New TSE certificate for an active substance from a new or already approved manufacturer (replacement or addition)",
    "category": "Safety and Efficacy",
    "type": "IAIN",
    "conditions": [
      "3) The manufacturing process does not include materials of human or animal origin for which viral safety data is required.",
      "5) The active substance/starting material/reagent/intermediate/excipient is not sterile.",
      "6) The substance is not included in a veterinary medicinal product for use in animal species susceptible to TSE.",
      "11) If the active substance is not sterile but used in a sterile medicinal product, CEP must confirm endotoxin-free status."
    ],
    "documents": [
      "1) A valid Certificate of Suitability (CEP) including any annexes.",
      "2) Documents clearly outlining the present and proposed manufacturers.",
      "3) Replacement of the relevant pages of the dossier.",
      "4) Where applicable, TSE/BSE risk information.",
      "5) Where applicable, declaration(s) from the Qualified Person(s) (QP) of each of the manufacturing authorization holder(s) listed in the marketing authorization application where the active substance is used as a starting material, and from the QP of each of the manufacturing authorization holder(s) listed in the marketing authorization application as responsible for batch release, stating that the active substance manufacturer(s) referred to in the application operate in compliance with the detailed guidelines on good manufacturing practice for starting materials. Under certain circumstances a single declaration may be acceptable."
    ]
  },
  {
    "code": "48.b.2",
    "title": "New TSE certificate for a starting material/reagent/intermediate/excipient from a new or already approved manufacturer",
    "category": "Safety and Efficacy",
    "type": "IA",
    "conditions": [
      "3) The manufacturing process does not include materials of human or animal origin for which viral safety data is required.",
      "6) The substance is not included in a veterinary medicinal product for use in animal species susceptible to TSE.",
      "9) If gelatine manufactured from bones is used in a parenteral product, it must comply with relevant country requirements."
    ],
    "documents": [
      "1) A valid Certificate of Suitability (CEP) including any annexes.",
      "2) Documents clearly outlining the present and proposed manufacturers.",
      "3) Replacement of the relevant pages of the dossier.",
      "4) Where applicable, TSE/BSE risk information.",
      "5) Where applicable, declaration(s) from the Qualified Person(s) (QP) of each of the manufacturing authorization holder(s) listed in the marketing authorization application where the active substance is used as a starting material, and from the QP of each of the manufacturing authorization holder(s) listed in the marketing authorization application as responsible for batch release, stating that the active substance manufacturer(s) referred to in the application operate in compliance with the detailed guidelines on good manufacturing practice for starting materials. Under certain circumstances a single declaration may be acceptable."
    ]
  },
  {
    "code": "48.b.3",
    "title": "Updated TSE certificate from an already approved manufacturer for starting material/reagent/intermediate/excipient",
    "category": "Safety and Efficacy",
    "type": "IA",
    "conditions": [
      "7) For veterinary medicinal products: there has been no change in the source of material.",
      "9) If gelatine manufactured from bones is used in a parenteral product, it must comply with relevant country requirements."
    ],
    "documents": [
      "1) A valid Certificate of Suitability (CEP) including any annexes.",
      "2) Documents clearly outlining the present and proposed manufacturers.",
      "3) Replacement of the relevant pages of the dossier.",
      "4) Where applicable, TSE/BSE risk information.",
      "5) Where applicable, declaration(s) from the Qualified Person(s) (QP) of each of the manufacturing authorization holder(s) listed in the marketing authorization application where the active substance is used as a starting material, and from the QP of each of the manufacturing authorization holder(s) listed in the marketing authorization application as responsible for batch release, stating that the active substance manufacturer(s) referred to in the application operate in compliance with the detailed guidelines on good manufacturing practice for starting materials. Under certain circumstances a single declaration may be acceptable."
    ]
  },
  {
    "code": "48.b.4",
    "title": "Deletion of TSE certificates (in case multiple certificates exist per material)",
    "category": "Safety and Efficacy",
    "type": "IA",
    "conditions": [
      "10) At least one manufacturer for the same substance remains in the dossier."
    ],
    "documents": [
      "3) Replacement of the relevant pages of the dossier."
    ]
  },
  {
    "code": "49.a.1",
    "title": "Change of specification(s) of a former non-pharmacopeial active substance to comply with reference pharmacopeia",
    "category": "Safety and Efficacy",
    "type": "IAIN",
    "conditions": [
      "1) The change is made exclusively to comply with the pharmacopoeia; all tests must correspond to pharmacopoeial standard after change.",
      "2) Additional specifications for product specific properties are unchanged (e.g. particle size, polymorphic form).",
      "3) No significant changes in qualitative and quantitative impurities profile unless tightened.",
      "4) Additional validation of a new or changed pharmacopoeial method is not required.",
      "5) For herbal active substances: manufacturing route, physical form, extraction solvent and DER should remain the same."
    ],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation.",
      "2) Comparative table of current and proposed specifications.",
      "3) Batch analysis data on two production batches for all tests in the new specification.",
      "4) Data to demonstrate the suitability of the monograph to control the substance."
    ]
  },
  {
    "code": "49.a.2",
    "title": "Change of specification(s) of a former non-pharmacopeial excipient/active substance starting material to comply with reference pharmacopeia",
    "category": "Safety and Efficacy",
    "type": "IA",
    "conditions": [
      "1) The change is made exclusively to comply with the pharmacopoeia.",
      "2) Additional specifications for product specific properties are unchanged.",
      "4) Additional validation of a new or changed pharmacopoeial method is not required."
    ],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation.",
      "2) Comparative table of current and proposed specifications.",
      "3) Batch analysis data on two production batches for all tests in the new specification.",
      "4) Data to demonstrate the suitability of the monograph to control the substance."
    ]
  },
  {
    "code": "49.b",
    "title": "Change to comply with an update of the relevant monograph of the reference pharmacopeia",
    "category": "Safety and Efficacy",
    "type": "IA",
    "conditions": [
      "1) The change is made exclusively to comply with the pharmacopoeia.",
      "2) Additional specifications for product specific properties are unchanged.",
      "4) Additional validation of a new or changed pharmacopoeial method is not required.",
      "5) For herbal active substances: manufacturing route, physical form, extraction solvent and DER should remain the same."
    ],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation.",
      "2) Comparative table of current and proposed specifications.",
      "3) Batch analysis data on two production batches for all tests in the new specification.",
      "4) Data to demonstrate the suitability of the monograph to control the substance."
    ]
  },
  {
    "code": "49.c",
    "title": "Change in specifications from a reference pharmacopeia to another reference pharmacopeia",
    "category": "Safety and Efficacy",
    "type": "IA",
    "conditions": [
      "1) The change is made exclusively to comply with the pharmacopoeia.",
      "4) Additional validation of a new or changed pharmacopoeial method is not required.",
      "5) For herbal active substances: manufacturing route, physical form, extraction solvent and DER should remain the same."
    ],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation.",
      "2) Comparative table of current and proposed specifications.",
      "3) Batch analysis data on two production batches for all tests in the new specification.",
      "4) Data to demonstrate the suitability of the monograph to control the substance."
    ]
  },
  {
    "code": "50.d",
    "title": "Inclusion of an updated/amended Plasma Master File in the marketing authorization dossier when changes do not affect the properties of the finished product",
    "category": "Safety and Efficacy",
    "type": "IA",
    "conditions": [
      "1) The new, updated or amended Plasma Master File has been granted a certificate of compliance from the competent authority."
    ],
    "documents": [
      "1) Letter declaring PMF certificate is fully applicable to the authorized product, PMF holder has submitted the documentation to MAH, and it replaces the previous PMF documentation.",
      "2) Plasma Master File (PMF) certificate, evaluation report and PMF dossier (or amended parts).",
      "3) An expert statement outlining all changes introduced and evaluating their potential impact on the finished product.",
      "4) Documents clearly outlining the present and proposed PMF certificate."
    ]
  },
  {
    "code": "51.c",
    "title": "Inclusion of an updated/amended Vaccine Antigen Master File in the marketing authorization dossier when changes do not affect the properties of the finished product",
    "category": "Safety and Efficacy",
    "type": "IAIN",
    "conditions": [
      "1) The new, updated or amended Vaccine Antigen Master File has been granted a certificate of compliance from the competent authority."
    ],
    "documents": [
      "1) Letter declaring VAMF certificate is fully applicable to the authorized product, VAMF holder has submitted the documentation to MAH, and it replaces the previous VAMF documentation.",
      "2) VAMF certificate, evaluation report and VAMF dossier (or amended parts).",
      "3) An expert statement outlining all changes introduced and evaluating their potential impact on the finished product.",
      "4) Documents clearly outlining the present and proposed VAMF certificate."
    ]
  },
  {
    "code": "52.a.2",
    "title": "Addition or replacement of a certified measuring/administration device (e.g. with MDMA) which is not an integrated part of the primary packaging",
    "category": "Quality - Finished Product",
    "type": "IAIN",
    "conditions": [
      "1) The proposed measuring or administration device must accurately deliver the required dose in line with the approved posology.",
      "2) The new device is compatible with the medicinal product.",
      "3) The change should not lead to substantial amendments of the product information.",
      "6) The medical device is not used as a solvent of the medicinal product.",
      "7) If a measuring function is intended the certification should cover the measuring function."
    ],
    "documents": [
      "1) Replacement of the relevant pages of the dossier (including description, detailed drawing and composition of the device material and supplier).",
      "2) Proof of certification."
    ]
  },
  {
    "code": "52.b",
    "title": "Deletion of a measuring or administration device",
    "category": "Quality - Finished Product",
    "type": "IAIN",
    "conditions": [
      "4) The medicinal product can still be accurately delivered.",
      "5) For veterinary medicinal products, the device is not crucial for the safety of the person administering the product."
    ],
    "documents": [
      "1) Replacement of the relevant pages of the dossier (including description, detailed drawing and composition of the device material and supplier).",
      "4) Justification for the deletion of the device."
    ]
  },
  {
    "code": "53.a",
    "title": "Change in specification parameters and/or limits of a measuring or administration device for veterinary medicinal products – Tightening of specification limits",
    "category": "Quality - Finished Product",
    "type": "IA",
    "conditions": [
      "1) The change is not a consequence of any commitment from previous assessments to review specification limits.",
      "2) The change should not be the result of unexpected events arising during manufacture.",
      "3) Any change should be within the range of currently approved limits.",
      "4) The test procedure remains the same."
    ],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation.",
      "2) Comparative table of current and proposed specifications."
    ]
  },
  {
    "code": "53.b",
    "title": "Change in specification parameters and/or limits of a measuring or administration device for veterinary medicinal products – Addition of a new specification parameter to the specification",
    "category": "Quality - Finished Product",
    "type": "IA",
    "conditions": [
      "1) The change is not a consequence of any commitment from previous assessments.",
      "2) The change should not be the result of unexpected events arising during manufacture.",
      "5) Any new test method does not concern a novel non-standard technique or a standard technique used in a novel way."
    ],
    "documents": [
      "1) Replacement of the relevant pages of the dossier.",
      "2) Comparative table of current and proposed specifications.",
      "3) Details of any new analytical method and summary of validation data.",
      "4) Batch analysis data on two production batches for all tests in the new specification.",
      "6) Justification for the new specification parameter and the limits."
    ]
  },
  {
    "code": "53.f",
    "title": "Change in specification parameters and/or limits of a measuring or administration device for veterinary medicinal products – Deletion of a non-significant specification parameter (e.g. deletion of an obsolete test)",
    "category": "Quality - Finished Product",
    "type": "IA",
    "conditions": [
      "1) The change is not a consequence of any commitment from previous assessments.",
      "2) The change should not be the result of unexpected events arising during manufacture."
    ],
    "documents": [
      "1) Replacement of the relevant pages of the dossier.",
      "2) Comparative table of current and proposed specifications.",
      "5) Justification/risk-assessment showing that the parameter is non-significant."
    ]
  },
  {
    "code": "54.a",
    "title": "Change in test procedure of a measuring or administration device for veterinary medicinal products – Minor change to an approved test procedure",
    "category": "Quality - Finished Product",
    "type": "IA",
    "conditions": [
      "1) Appropriate validation studies have been performed and show the updated test procedure is at least equivalent.",
      "2) The method of analysis should remain the same."
    ],
    "documents": [
      "1) Replacement of the relevant pages of the dossier, including description of analytical methodology and summary of validation data.",
      "2) Comparative validation results showing that the current test and the proposed one are equivalent."
    ]
  },
  {
    "code": "54.b",
    "title": "Change in test procedure of a measuring or administration device for veterinary medicinal products – Other changes to a test procedure (including replacement or addition)",
    "category": "Quality - Finished Product",
    "type": "IA",
    "conditions": [
      "1) Appropriate validation studies have been performed and show the updated test procedure is at least equivalent.",
      "3) Any new test method does not concern a novel non-standard technique or a standard technique used in a novel way."
    ],
    "documents": [
      "1) Replacement of the relevant pages of the dossier, including description of analytical methodology and summary of validation data.",
      "2) Comparative validation results showing that the current test and the proposed one are equivalent."
    ]
  },
  {
    "code": "54.c",
    "title": "Change in test procedure of a measuring or administration device for veterinary medicinal products – Deletion of a test procedure if an alternative test procedure is already authorized",
    "category": "Quality - Finished Product",
    "type": "IA",
    "conditions": [
      "4) An alternative test procedure is already authorised for the specification parameter and this procedure has not been added through IA/IA(IN) notification."
    ],
    "documents": [
      "1) Replacement of the relevant pages of the dossier, including description of analytical methodology and summary of validation data."
    ]
  },
  {
    "code": "61",
    "title": "Change(s) to a PSMF following the assessment of the same change(s) to the same DDPS in relation to another medicinal product of the same MAH",
    "category": "Safety and Efficacy",
    "type": "IA",
    "conditions": [
      "1) The same changes to the PSMF are introduced for all medicinal products of the same MAH (same final PSMF version)."
    ],
    "documents": [
      "1) Latest approved version of the PSMF."
    ]
  },
  {
    "code": "67.a",
    "title": "Changes to the labeling or the package leaflet which are not connected with the summary of product characteristics – Administrative information concerning the holder's representative",
    "category": "Labeling and Leaflet",
    "type": "IAIN",
    "conditions": [],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation."
    ]
  },
  {
    "code": "69",
    "title": "Change in the name and/or address of the VAMF certificate holder",
    "category": "Safety and Efficacy",
    "type": "IAIN",
    "conditions": [
      "1) The VAMF certificate holder must remain the same legal entity."
    ],
    "documents": [
      "1) A formal document from a relevant official body (e.g. Chamber of Commerce) in which the new name or new address is mentioned."
    ]
  },
  {
    "code": "70",
    "title": "Change in the name and/or address of the PMF certificate holder",
    "category": "Safety and Efficacy",
    "type": "IAIN",
    "conditions": [
      "1) The PMF certificate holder must remain the same legal entity."
    ],
    "documents": [
      "1) A formal document from a relevant official body (e.g. Chamber of Commerce) in which the new name or new address is mentioned."
    ]
  },
  {
    "code": "71",
    "title": "Change or transfer of the current PMF certificate holder to a new PMF certificate holder (different legal entity)",
    "category": "Safety and Efficacy",
    "type": "IAIN",
    "conditions": [],
    "documents": [
      "1) A document identifying current PMF Holder (transferor) and the transferee, with proposed implementation date — signed by both companies.",
      "2) Copy of the latest PMF Certificate page.",
      "3) Proof of establishment of the new holder (Excerpt of the commercial register) — signed by both companies.",
      "4) Confirmation of the transfer of the complete PMF documentation to the transferee — signed by both companies.",
      "5) Letter of Authorisation including contact details of the person responsible for communication — signed by the transferee.",
      "6) Letter of Undertaking to fulfil all open and remaining commitments — signed by the transferee."
    ]
  },
  {
    "code": "72",
    "title": "Change in the name and/or address of a blood establishment including blood/plasma collection centers",
    "category": "Stability and Shelf-life",
    "type": "IA",
    "conditions": [
      "1) The blood establishment shall remain the same legal entity.",
      "2) The change shall be administrative (e.g. merger, take over); change in the name provided the blood establishment shall remain the same."
    ],
    "documents": [
      "1) Signed declaration that the change does not involve a change of the quality system within the blood establishment.",
      "2) Signed declaration that there is no change in the list of the collection centers.",
      "3) Updated relevant sections and annexes of the PMF dossier."
    ]
  },
  {
    "code": "74",
    "title": "Deletion or change of status (operational/non-operational) of establishment(s)/centre(s) used for blood/plasma collection or for testing donations and plasma pools",
    "category": "Stability and Shelf-life",
    "type": "IA",
    "conditions": [
      "1) The reason for deletion or change of status should not be related to a GMP issue.",
      "2) The establishment(s)/centre(s) should comply with the legislation in terms of inspections in case of change of status from non-operational to operational."
    ],
    "documents": [
      "1) Updated relevant sections and annexes of the PMF dossier."
    ]
  },
  {
    "code": "79",
    "title": "Deletion of a blood establishment or centre(s) in which storage of plasma is carried out",
    "category": "Stability and Shelf-life",
    "type": "IA",
    "conditions": [
      "1) The reason for deletion should not be related to GMP issues."
    ],
    "documents": [
      "1) Updated relevant sections and annexes of the PMF dossier."
    ]
  },
  {
    "code": "81",
    "title": "Deletion of an organization involved in the transport of plasma",
    "category": "Stability and Shelf-life",
    "type": "IA",
    "conditions": [
      "1) The reason for deletion should not be related to GMP issues."
    ],
    "documents": [
      "1) Updated relevant sections and annexes of the PMF dossier."
    ]
  },
  {
    "code": "82",
    "title": "Addition of MDMA test kit to test individual donations as a new test kit or as a replacement of an existing test kit",
    "category": "Stability and Shelf-life",
    "type": "IA",
    "conditions": [
      "1) The new test kit had MDMA."
    ],
    "documents": [
      "1) List of testing site(s) where the kit is used.",
      "2) Updated relevant sections and annexes of the PMF dossier, including updated information on testing."
    ]
  },
  {
    "code": "83.b",
    "title": "Addition of non-MDMA test kit to test individual donations – The new test kit has been approved in the PMF for other blood centre(s) for testing of donations",
    "category": "Stability and Shelf-life",
    "type": "IA",
    "conditions": [],
    "documents": [
      "1) List of testing centre(s) where the kit is currently used and a list of testing centre(s) where the kit will be used.",
      "2) Updated relevant sections and annexes of the PMF dossier, including updated information on testing."
    ]
  },
  {
    "code": "85",
    "title": "Introduction or extension of inventory hold procedure",
    "category": "Stability and Shelf-life",
    "type": "IA",
    "conditions": [
      "1) The inventory hold procedure is a more stringent procedure (e.g. release only after retesting of donors)."
    ],
    "documents": [
      "1) Updated relevant sections of the PMF dossier, including the rationale for introduction or extension of inventory hold period, the sites where the inventory hold takes place and for changes to procedure, a decision tree including new conditions."
    ]
  },
  {
    "code": "87.a",
    "title": "Replacement or addition of blood containers (e.g. bags, bottles) where the new blood containers have MDMA",
    "category": "Stability and Shelf-life",
    "type": "IA",
    "conditions": [
      "1) The container had MDMA.",
      "2) The quality criteria of the blood in the container remain unchanged."
    ],
    "documents": [
      "1) Updated relevant sections and annexes of the PMF dossier, including the name of container, manufacturer, anticoagulant solution specification, confirmation of MDMA and the name of the blood establishments where the container is used."
    ]
  },
  {
    "code": "88.a",
    "title": "Change in storage and/or transport conditions for plasma (PMF)",
    "category": "Stability and Shelf-life",
    "type": "IA",
    "conditions": [
      "1) The change should tighten the conditions and be in compliance with Ph. Eur. requirements for Human Plasma for Fractionation."
    ],
    "documents": [
      "1) Updated relevant sections and annexes of the PMF dossier, including detailed description of the new conditions, confirmation of validation and the name of the blood establishment(s) where the change takes place."
    ]
  },
  {
    "code": "88.b",
    "title": "Change in maximum storage time for the plasma (PMF)",
    "category": "Stability and Shelf-life",
    "type": "IA",
    "conditions": [
      "1) The change should tighten the conditions and be in compliance with Ph. Eur. requirements.",
      "2) The maximum storage time is shorter than previously."
    ],
    "documents": [
      "1) Updated relevant sections and annexes of the PMF dossier, including detailed description of the new conditions, confirmation of validation and the name of the blood establishment(s) where the change takes place."
    ]
  },
  {
    "code": "1.b",
    "title": "Transfer the product to new marketing authorization holder (different legal entity)",
    "category": "Administrative",
    "type": "IB",
    "conditions": [],
    "documents": [
      "1) A formal document from a relevant official body (e.g. chamber of commerce, national drug regulatory authority…etc) in which the new name or new address is mentioned.",
      "2) Replacement of the relevant pages of the dossier that are affected by the variation.",
      "3) Copy of the agreement",
      "4) Certificate of a Pharmaceutical Product (CPP)",
      "5) A recent and official price certificate by the company and legalized by the Saudi Embassy in the country of origin."
    ]
  },
  {
    "code": "3",
    "title": "Change in the (invented) name of the medicinal product",
    "category": "Administrative",
    "type": "IB",
    "conditions": [],
    "documents": [
      "1) A formal document from the national drug regulatory authority in which the new name is approved, if applicable.",
      "2) Replacement of the relevant pages of the dossier that are affected by the variation."
    ]
  },
  {
    "code": "9.g",
    "title": "Addition of an alternative sterilization site for the active substance using a pharmacopeial method",
    "category": "Quality - Active Substance",
    "type": "IB",
    "conditions": [],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation.",
      "2) A declaration from the marketing authorization holder that the synthetic route (or in case of herbal products, where appropriate the method of preparation, geographical source, production of herbal drug and manufacturing route) quality control procedures and specifications of the active substance and of the starting material/reagent/intermediate in the manufacturing process of the active substance (if applicable) are the same as those already approved.",
      "4) Batch analysis data (in a comparative tabular format) for at least two batches (minimum pilot scale) of the active substance from the current and proposed manufacturers/sites.",
      "5) The submitted documents should clearly outline the “present” and “proposed” manufacturers.",
      "8) Proof that the proposed site is appropriately authorized for the pharmaceutical form or product or manufacturing operation concerned."
    ]
  },
  {
    "code": "9.k",
    "title": "New storage site of Master Cell Bank and/or Working Cell Banks",
    "category": "Quality - Active Substance",
    "type": "IB",
    "conditions": [],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation.",
      "5) The submitted documents should clearly outline the “present” and “proposed” manufacturers."
    ]
  },
  {
    "code": "10.e",
    "title": "Minor change to the restricted part of drug master file (DMF)",
    "category": "Quality - Active Substance",
    "type": "IB",
    "conditions": [],
    "documents": [
      "1) Replacement of the relevant pages of the finished product dossier and drug master file (DMF) (where applicable), including a direct comparison of the present process and the new process.",
      "2) Batch analysis data (in comparative tabular format) of at least two batches (minimum pilot scale) manufactured according to the currently approved and proposed process.",
      "3) Copy of approved specifications of the active substance.",
      "4) A declaration from the marketing authorization holder or the DMF Holder, where applicable, that there is no change in qualitative and quantitative impurity profile or in physico-chemical properties, that the synthetic route remains the same and that the specifications of the active substance or intermediates are unchanged. Note: for 10.b), for chemical active substances, this refers to substantial changes to the synthetic route or manufacturing conditions which may have a potential to change important quality characteristics of the active substance, such as qualitative and/or quantitative impurity profile requiring qualification, or physico-chemical properties impacting on bioavailability."
    ]
  },
  {
    "code": "11.d",
    "title": "More than 10-fold increase compared to the originally approved batch size",
    "category": "Quality - Active Substance",
    "type": "IB",
    "conditions": [],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation.",
      "2) The batch numbers of the tested batches having the proposed batch size.",
      "3) Batch analysis data (in a comparative tabulated format) on a minimum of one production batch manufactured to both the currently approved and the proposed sizes. Batch data on the next two full production batches should be made available upon request and reported by the marketing authorization holder if outside specification (with proposed action).",
      "4) Copy of approved specifications of the active substance (and of the intermediate, if applicable)."
    ]
  },
  {
    "code": "11.e",
    "title": "The scale for a biological/immunological active substance is increased/decreased without process change (e.g. duplication of line)",
    "category": "Quality - Active Substance",
    "type": "IB",
    "conditions": [],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation.",
      "2) The batch numbers of the tested batches having the proposed batch size.",
      "3) Batch analysis data (in a comparative tabulated format) on a minimum of one production batch manufactured to both the currently approved and the proposed sizes. Batch data on the next two full production batches should be made available upon request and reported by the marketing authorization holder if outside specification (with proposed action).",
      "4) Copy of approved specifications of the active substance (and of the intermediate, if applicable)."
    ]
  },
  {
    "code": "12.e",
    "title": "Addition or replacement of an in-process test as a result of a safety or quality issue",
    "category": "Quality - Active Substance",
    "type": "IB",
    "conditions": [],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation.",
      "2) Comparative table of current and proposed in-process tests.",
      "3) Details of any new Non pharmacopoeial analytical method and validation data.",
      "4) Batch analysis data on two production batches (3 production batches for biologicals, unless otherwise justified) of the active substance for all specification parameters",
      "6) Justification for the new in-process test and limits."
    ]
  },
  {
    "code": "14.f",
    "title": "Addition or replacement (excluding biological or immunological method) of a specification parameter as a result of a safety or quality issue",
    "category": "Quality - Active Substance",
    "type": "IB",
    "conditions": [],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation.",
      "2) Comparative table of current and proposed specifications.",
      "3) Details of any new analytical method and validation data.",
      "4) Batch analysis data on two production batches (3 production batches for biologicals, unless otherwise justified) of the relevant substance for all specification parameters.",
      "5) Where appropriate, comparative dissolution profile data for the finished product on at least one pilot batch containing the active substance complying with the current and proposed specification. For herbal products, comparative disintegration data may be acceptable.",
      "7) Justification of the new specification parameter and the limits."
    ]
  },
  {
    "code": "14.h",
    "title": "Change in specification from in-house to a non-official pharmacopoeia or to another official pharmacopoeia",
    "category": "Quality - Active Substance",
    "type": "IB",
    "conditions": [],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation.",
      "2) Comparative table of current and proposed specifications.",
      "3) Details of any new analytical method and validation data.",
      "4) Batch analysis data on two production batches (3 production batches for biologicals, unless otherwise justified) of the relevant substance for all specification parameters.",
      "5) Where appropriate, comparative dissolution profile data for the finished product on at least one pilot batch containing the active substance complying with the current and proposed specification. For herbal products, comparative disintegration data may be acceptable.",
      "7) Justification of the new specification parameter and the limits."
    ]
  },
  {
    "code": "15.c",
    "title": "Other changes to a test procedure (including replacement or addition) for the active substance or a starting material/reagent/intermediate",
    "category": "Quality - Active Substance",
    "type": "IB",
    "conditions": [],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation, which includes a description of the analytical methodology, a summary of validation data, revised specifications for impurities (if applicable).",
      "2) Comparative validation results, or if justified comparative analysis results showing that the current test and the proposed one are equivalent. This requirement is not applicable in case of an addition of a new test procedure. c) Container closure system"
    ]
  },
  {
    "code": "16.c",
    "title": "Liquid active substances (non-sterile) — change in shelf-life or storage conditions",
    "category": "Quality - Active Substance",
    "type": "IB",
    "conditions": [],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation.",
      "2) Appropriate data on the new packaging (comparative data on permeability e.g. for O2, CO2 moisture), including a confirmation that the material complies with relevant pharmacopeial requirements.",
      "3) Proof must be provided that no interaction between the content and the packaging material occurs (e.g. no migration of components of the proposed material into the content and no loss of components of the product into the pack).",
      "4) The results of stability studies that have been carried out according to the SFDA stability guidelines, on the relevant stability parameters, on at least two pilot or production scale batches for at least three months.",
      "5) A letter of commitment to finalize the stability studies and the data must be submitted immediately to the authority only in case of any out-of-specifications (OOS) results or potentially outside specifications at the end of the approved shelf life along with the proposed action(s).",
      "6) Comparison of the current and proposed immediate packaging specifications, if applicable."
    ]
  },
  {
    "code": "17.c",
    "title": "Addition or replacement of a specification parameter for the container closure system as a result of a safety or quality issue",
    "category": "Quality - Active Substance",
    "type": "IB",
    "conditions": [],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation.",
      "2) Comparative table of current and proposed specifications.",
      "3) Details of any new analytical method and validation data.",
      "4) Batch analysis data on two batches of the immediate packaging for all specification parameters.",
      "6) Justification of the new specification parameter and the limits. Change in test procedure for the immediate             Conditions        Documentation to       Procedure 18. packaging of the active substance                      to be fulfilled   be supplied            type"
    ]
  },
  {
    "code": "4",
    "title": "Extension or introduction of a re-test period/storage period supported by real time data",
    "category": "Quality - Active Substance",
    "type": "IB",
    "conditions": [],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation. These must contain the results of appropriate recent real-time stability studies conducted in accordance with the SFDA stability guidelines on at least two pilot or production-scale batches (three production batches for biological medicinal products) of the active substance in the authorized packaging material, covering the duration of the requested re-test period or requested storage conditions.",
      "2) Confirmation that stability studies have been done to the currently approved protocol. The studies must show that the agreed relevant specifications are still met.",
      "3) Copy of approved specifications of the active substance."
    ]
  },
  {
    "code": "3.2",
    "title": "Change in storage conditions of the active substance",
    "category": "Quality - Active Substance",
    "type": "IB",
    "conditions": [],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation. These must contain the results of appropriate recent real-time stability studies conducted in accordance with the SFDA stability guidelines on at least two pilot or production-scale batches (three production batches for biological medicinal products) of the active substance in the authorized packaging material, covering the duration of the requested re-test period or requested storage conditions.",
      "2) Confirmation that stability studies have been done to the currently approved protocol. The studies must show that the agreed relevant specifications are still met.",
      "3) Copy of approved specifications of the active substance."
    ]
  },
  {
    "code": "20.b",
    "title": "Changes in scoring/break lines intended to divide into equal doses",
    "category": "Container Closure System",
    "type": "IB",
    "conditions": [],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation including a detailed drawing or written description of the current and new appearance and including revised product information as appropriate.",
      "2) Samples of the finished product where applicable.",
      "3) Results of the appropriate compendial tests demonstrating equivalence in characteristics/correct dosing"
    ]
  },
  {
    "code": "21.b",
    "title": "Gastro-resistant, modified or prolonged release pharmaceutical forms — change in coating weight or capsule shell weight",
    "category": "Container Closure System",
    "type": "IB",
    "conditions": [],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation including a detailed drawing of the current and proposed situation.",
      "2) Comparative dissolution data on at least one pilot batch of the current and proposed dimensions. For herbal product comparative disintegration data may be acceptable.",
      "3) Justification for not submitting a new bioequivalence study.",
      "4) Samples of the finished product where applicable.",
      "5) Results of the appropriate compendial tests demonstrating equivalence in characteristics/correct dosing. * Applicants are reminded that any change to the ‘strength’ of the medicinal product requires the submission of a new marketing authorization application."
    ]
  },
  {
    "code": "5",
    "title": "Replacement of a single excipient with a comparable excipient with the same functional characteristics and at a similar level",
    "category": "Quality - Finished Product",
    "type": "IB",
    "conditions": [],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation including identification method for any new colorant and if appropriate updated end of shelf-life specifications.",
      "2) The results of stability studies that have been carried out according to the SFDA stability guidelines, on the relevant stability parameters, on at least two pilot or production scale batches for at least three months and a letter of commitment to finalize the stability studies and to submit the data immediately to the authority in case of any out-of-specifications (OOS) results or potentially outside specifications at the end of the approved shelf life along with the proposed action.",
      "3) A declaration letter that stability studies will be finalized and that data will submitted immediately to the authority in case of any out-of-specifications (OOS) results or potentially outside specifications at the end of the approved shelf life along with the proposed action.",
      "4) Sample of the new product, where applicable.",
      "5) Either a TSE Certificate of Suitability for any new source of material or, where applicable, documentary evidence that the specific source of the TSE risk material has previously been assessed by a national drug regulatory authority of the ICH region and associated countries.",
      "6) Data to demonstrate that the new excipient does not interfere with the finished product specification test methods, if appropriate.",
      "7) Justification for the change/choice of excipients etc. must be given by appropriate development pharmaceutics (including stability aspects and antimicrobial preservation where appropriate).",
      "8) For solid dosage forms, comparative dissolution profile data of at least two pilot scale batches of the finished product in the new and old composition. For semisolid dosage forms, comparative in vitro release test of at least two pilot scale batches.",
      "9) Justification for not submitting a new bioequivalence study.",
      "10) For veterinary medicines intended for use in food producing animals, justification that the excipient does not have pharmacological activity at the dose at which it is administered to the target animal."
    ]
  },
  {
    "code": "6",
    "title": "Any minor adjustment of the quantitative composition of the finished product with respect to excipients (excluding biological/immunological product)",
    "category": "Quality - Finished Product",
    "type": "IB",
    "conditions": [],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation including identification method for any new colorant and if appropriate updated end of shelf-life specifications.",
      "2) The results of stability studies that have been carried out according to the SFDA stability guidelines, on the relevant stability parameters, on at least two pilot or production scale batches for at least three months and a letter of commitment to finalize the stability studies and to submit the data must immediately to the authority in case of any out-of-specifications (OOS) results or potentially outside specifications at the end of the approved shelf life along with the proposed action.",
      "3) A declaration letter that stability studies will be finalized and that data will submitted immediately to the authority in case of any out-of-specifications (OOS) results or potentially outside specifications at the end of the approved shelf life along with the proposed action.",
      "4) Sample of the new product, where applicable.",
      "7) Justification for the change/choice of excipients etc. must be given by appropriate development pharmaceutics(including stability aspects and antimicrobial preservation where appropriate).",
      "8) For solid dosage forms, comparative dissolution profile data of at least two pilot scale batches of the finished product in the new and old composition. For herbal products, comparative disintegration data may be acceptable. For semisolid dosage forms, comparative in vitro release test of at least two pilot scale batches of the finished product in the new and old composition."
    ]
  },
  {
    "code": "25",
    "title": "Deletion of the solvent/diluent container from the pack",
    "category": "Quality - Finished Product",
    "type": "IB",
    "conditions": [],
    "documents": [
      "1) Justification for the deletion, including a statement regarding alternative means to obtain the solvent/ diluent as required for the safe and effective use of the medicinal product.",
      "2) Replacement of the relevant pages of the dossier that are affected by the variation. b) Manufacture"
    ]
  },
  {
    "code": "26.d",
    "title": "Site where any manufacturing operation(s) take place, except batch release, batch control, and primary and secondary packaging, for non-sterile medicinal products",
    "category": "Quality - Finished Product",
    "type": "IB",
    "conditions": [],
    "documents": [
      "8) Copy of approved release and end of shelf-life specifications for the product if relevant.",
      "9) Batch analysis data on one production batch and two pilot-scale batches simulating the production process (or two production batches) and comparative data on the last three batches from the previous site; batch data on the next two production batches should be available on request or reported if outside specifications (with proposed action).",
      "10) Relevant stability studies have been started according to the SFDA stability and relevant stability parameters have been assessed in at least two pilot scale or production scale batches for at least three months.",
      "11) A letter of commitment to finalize the stability studies and the data must be submitted immediately to the authority only in case of any out-of-specifications (OOS) results or potentially outside specifications at the end of the approved shelf life along with the proposed action.",
      "12) Where relevant the batch numbers, corresponding batch size and the manufacturing date of batches (≥3) used in the validation study should be indicated or validation protocol (scheme) be submitted."
    ]
  },
  {
    "code": "28.e",
    "title": "Minor change in the manufacturing process of an immediate release solid oral pharmaceutical form or oral solution",
    "category": "Quality - Finished Product",
    "type": "IB",
    "conditions": [],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation, including a direct comparison of the present process and the new process.",
      "2) For semi-solid and liquid products in which the active substance is present in non-dissolved form: appropriate validation of the change including microscopic imaging of particles to check for visible changes in morphology; comparative size distribution data by an appropriate method.",
      "4) Justification for not submitting a new bioequivalence study.",
      "6) Copy of approved release and end of shelf-life specifications.",
      "7) Batch analysis data (in a comparative tabulated format) on a minimum of one batch manufactured to both the currently approved and the proposed process. Batch data on the next two full production batches should be made available upon request and reported by the marketing authorization holder if outside specification (with proposed action).",
      "8) The results of stability studies that have been carried out according to the SFDA stability guidelines, on the relevant stability parameters, on at least one pilot or production scale batches for at least three months.",
      "9) A letter of commitment to finalize the stability studies with indication of the batch concerned and the data must be submitted immediately to the authority only in case of any out-of-specifications (OOS) results or potentially outside specifications at the end of the approved shelf life along with the proposed action."
    ]
  },
  {
    "code": "29.e",
    "title": "More than 10-fold increase compared to the originally approved batch size for the finished product",
    "category": "Quality - Finished Product",
    "type": "IB",
    "conditions": [],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation.",
      "2) Batch analysis data (in a comparative tabulated format) on a minimum of one production batch manufactured to both the currently approved and the proposed sizes. Batch data on the next two full production batches should be made available upon request and reported by the marketing authorization holder if outside specifications (with proposed action).",
      "3) Copy of approved release and end of shelf-life specifications.",
      "4) Where relevant the batch numbers, corresponding batch size and the manufacturing date of batches (≥3) used in the validation study should be indicated or validation protocol (scheme) be submitted.",
      "5) The validation results should be provided",
      "6) The results of stability studies that have been carried out according to the SFDA stability guidelines , on the relevant stability parameters, on at least one batch of the proposed batch Size(s) for at least three months.",
      "7) A letter of commitment to finalize the stability studies and the data must be submitted immediately to the authority only in case of any out-of-specifications (OOS) results or potentially outside specifications at the end of the approved shelf life along with the proposed action. For biologicals/immunologicals: a declaration that an assessment of comparability is not required."
    ]
  },
  {
    "code": "29.f",
    "title": "The scale for a biological/immunological finished product is increased/decreased",
    "category": "Quality - Finished Product",
    "type": "IB",
    "conditions": [],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation.",
      "2) Batch analysis data (in a comparative tabulated format) on a minimum of one production batch manufactured to both the currently approved and the proposed sizes. Batch data on the next two full production batches should be made available upon request and reported by the marketing authorization holder if outside specifications (with proposed action).",
      "3) Copy of approved release and end of shelf-life specifications.",
      "4) Where relevant the batch numbers, corresponding batch size and the manufacturing date of batches (≥3) used in the validation study should be indicated or validation protocol (scheme) be submitted.",
      "5) The validation results should be provided",
      "6) The results of stability studies that have been carried out according to the SFDA stability guidelines , on the relevant stability parameters, on at least one batch of the proposed batch Size(s) for at least three months.",
      "7) A letter of commitment to finalize the stability studies and the data must be submitted immediately to the authority only in case of any out-of-specifications (OOS) results or potentially outside specifications at the end of the approved shelf life along with the proposed action. For biologicals/immunologicals: a declaration that an assessment of comparability is not required."
    ]
  },
  {
    "code": "30.e",
    "title": "Addition or replacement of an in-process test for the finished product as a result of a safety or quality issue",
    "category": "Quality - Finished Product",
    "type": "IB",
    "conditions": [],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation.",
      "2) Comparative table of current and proposed in-process tests.",
      "3) Details of any new analytical method and validation data.",
      "4) Batch analysis data on two production batches (3 production batches for biologicals, unless otherwise justified) of the finished product for all specification parameters.",
      "5) Where appropriate, comparative dissolution profile data for the finished product on at least one pilot batch manufactured using the current and new in-process tests. For herbal products, comparative disintegration data may be acceptable.",
      "7) Justification of the new in-process test and limits. c) Control of excipients"
    ]
  },
  {
    "code": "31.e",
    "title": "Addition or replacement (excluding biological or immunological method) of a specification parameter for the finished product as a result of a safety or quality issue",
    "category": "Quality - Finished Product",
    "type": "IB",
    "conditions": [],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation.",
      "2) Comparative table of current and proposed specifications.",
      "3) Details of any new analytical method and validation data.",
      "4) Batch analysis data on two production batches (3 production batches for biological excipients,) of the excipient for all specification parameters.",
      "5) Where appropriate, comparative dissolution profile data for the finished product on at least one pilot batch containing the excipient complying with the current and proposed specification. For herbal products, comparative disintegration data may be acceptable.",
      "6) Justification for not submitting a new bioequivalence study, if appropriate.",
      "8) Justification of the new specification parameter and the limits."
    ]
  },
  {
    "code": "31.g",
    "title": "Change in specification from in-house to a non-official pharmacopoeia or to another official pharmacopoeia (finished product)",
    "category": "Quality - Finished Product",
    "type": "IB",
    "conditions": [],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation.",
      "2) Comparative table of current and proposed specifications.",
      "3) Details of any new analytical method and validation data.",
      "4) Batch analysis data on two production batches (3 production batches for biological excipients,) of the excipient for all specification parameters.",
      "5) Where appropriate, comparative dissolution profile data for the finished product on at least one pilot batch containing the excipient complying with the current and proposed specification. For herbal products, comparative disintegration data may be acceptable.",
      "6) Justification for not submitting a new bioequivalence study, if appropriate.",
      "8) Justification of the new specification parameter and the limits."
    ]
  },
  {
    "code": "32.c",
    "title": "Other changes to a test procedure (including replacement or addition) for the finished product or an excipient",
    "category": "Quality - Finished Product",
    "type": "IB",
    "conditions": [],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation, which includes a description of the analytical methodology, a summary of validation data, revised specifications for impurities (if applicable).",
      "2) Comparative validation results or if justified comparative analysis results showing that the current test and the proposed one are equivalent. This requirement is not applicable in case of an addition of a new test procedure."
    ]
  },
  {
    "code": "33.a",
    "title": "Change from TSE risk material to vegetable or synthetic origin for excipients or reagents",
    "category": "Quality - Finished Product",
    "type": "IB",
    "conditions": [],
    "documents": [
      "1) Declaration from the manufacturer of the material that it is purely of vegetable or synthetic origin.",
      "2) Study of equivalence of the materials and the impact on production of the final material and impact on behavior (e.g. dissolution characteristics) of the finished product."
    ]
  },
  {
    "code": "36.e",
    "title": "Addition or replacement (excluding biological or immunological method) of a specification parameter for an excipient as a result of a safety or quality issue",
    "category": "Quality - Finished Product",
    "type": "IB",
    "conditions": [],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation.",
      "2) Comparative table of current and proposed specifications.",
      "3) Details of any new analytical method and validation data.",
      "4) Batch analysis data on two production batches (3 production batches for biologicals, unless otherwise justified) of the finished product for all specification parameters at the end of shelf life.",
      "5) Where appropriate, comparative dissolution profile data for the finished product on at least one pilot batch complying with the current and proposed specification. For herbal products, comparative disintegration data may be acceptable.",
      "7) Justification of the new specification parameter and the limits.",
      "8) An official letter stating that the company has started long term stability studies (Section 3.2.P.8.3) according to the SFDA Guidelines for Stability Testing, taking into consideration the updated specifications .Assurance should be given that any out of specification results will be reported immediately to the SFDA."
    ]
  },
  {
    "code": "37.c",
    "title": "Other changes to a test procedure (including replacement or addition) for an excipient",
    "category": "Quality - Finished Product",
    "type": "IB",
    "conditions": [],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation, which includes a description of the analytical methodology, a summary of validation data, revised specifications for impurities (if applicable).",
      "2) Comparative validation results or if justified comparative analysis results showing that the current test and the proposed one are equivalent. This requirement is not applicable in case of an addition of a new test procedure."
    ]
  },
  {
    "code": "39",
    "title": "Change in immediate packaging of the finished product — qualitative and quantitative composition for semi-solid and non-sterile liquid pharmaceutical forms",
    "category": "Container Closure System",
    "type": "IB",
    "conditions": [],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation.",
      "2) Appropriate data on the new packaging (comparative data on permeability e.g. for O2, CO2 moisture).",
      "3) Proof must be provided that no interaction between the content and the packaging material occurs (e.g. no migration of components of the proposed material into the content and no loss of components of the product into the pack). Including confirmation that the material complies with relevant pharmacopoeial requirements.",
      "4) The results of stability studies that have been carried out according to the SFDA stability guidelines, on the relevant stability parameters, on at least two pilot or production scale batches for at least three months.",
      "5) A letter of commitment to finalize the stability studies and the data must be submitted immediately to the authority only in case of any out-of-specifications (OOS) results or potentially outside specifications at the end of the approved shelf life with the proposed action.",
      "6) Comparative table of the current and proposed immediate packaging specifications, if applicable."
    ]
  },
  {
    "code": "39.b",
    "title": "Change in the container type or addition of a new container of the finished product",
    "category": "Container Closure System",
    "type": "IB",
    "conditions": [],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation.",
      "2) Appropriate data on the new packaging (comparative data on permeability e.g. for O2, CO2 moisture).",
      "3) Proof must be provided that no interaction between the content and the packaging material occurs (e.g. no migration of components of the proposed material into the content and no loss of components of the product into the pack). Including confirmation that the material complies with relevant pharmacopoeial requirements.",
      "4) The results of stability studies that have been carried out according to the SFDA stability guidelines, on the relevant stability parameters, on at least two pilot or production scale batches for at least three months.",
      "5) A letter of commitment to finalize the stability studies and the data must be submitted immediately to the authority only in case of any out-of-specifications (OOS) results or potentially outside specifications at the end of the approved shelf life with the proposed action.",
      "6) Comparative table of the current and proposed immediate packaging specifications, if applicable.",
      "7) Samples of the new container/closure where applicable"
    ]
  },
  {
    "code": "40.c",
    "title": "Addition or replacement of a specification parameter for the immediate packaging as a result of a safety or quality issue",
    "category": "Container Closure System",
    "type": "IB",
    "conditions": [],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation.",
      "2) Comparative table of current and proposed specifications.",
      "3) Details of any new analytical method and validation data.",
      "4) Batch analysis data on two batches of the immediate packaging for all specification parameters.",
      "6) Justification of the new specification parameter and the limits."
    ]
  },
  {
    "code": "42.c",
    "title": "Sterile medicinal products — change in any part of the (primary) packaging material not in contact with the finished product formulation",
    "category": "Container Closure System",
    "type": "IB",
    "conditions": [],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation (including description, detailed drawing and composition of the container or closure material).",
      "2) Samples of the current and new container/closure where applicable.",
      "3) Re-validation studies have been performed in case of sterile products terminally sterilized and the summary of validation data is required.",
      "4) In case of a change in the headspace or a change in the surface/volume ratio, the following should be submitted: •   The results of stability studies that have been carried out according to the SFDA stability guidelines, on the relevant stability parameters, on at least two pilot or production scale batches (three batches for biological/immunological medicinal product) for at least three months (six months for biological/immunological medicinal product). •   A letter of commitment to finalize the stability studies and the data must be submitted immediately to the authority only in case of any out-of-specifications (OOS) results or potentially outside specifications at the end of the approved shelf life with the proposed action."
    ]
  },
  {
    "code": "43.a",
    "title": "Change in pack size of the finished product — change in the number of units (e.g. tablets, ampoules, etc.) in a pack",
    "category": "Stability and Shelf-life",
    "type": "IB",
    "conditions": [],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation, including revised product information as appropriate.",
      "2) Justification for the new/remaining pack-size, showing that the new/remaining size is/are consistent with the dosage regimen and duration of use as approved in the summary of product characteristics.",
      "3) Certificate of a Pharmaceutical Product (CPP) stating the new pack size.",
      "4) The results of stability studies that have been carried out according to the SFDA stability guidelines, on the relevant stability parameters, on at least two pilot or production scale batches for at least three months.",
      "5) A letter of commitment to finalize the stability study and to report any out-of-specification results immediately to the authority.",
      "6) A recent and official price certificate by the company and legalized by the Saudi Embassy in the country of origin (indicating the new pack size).",
      "7) Samples of the finished product."
    ]
  },
  {
    "code": "43.d",
    "title": "Change in the fill weight/fill volume of non-parenteral multi-dose (or single-dose, partial use) medicinal products",
    "category": "Stability and Shelf-life",
    "type": "IB",
    "conditions": [],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation, including revised product information as appropriate.",
      "2) Justification for the new/remaining pack-size, showing that the new/remaining size is/are consistent with the dosage regimen and duration of use as approved in the summary of product characteristics.",
      "3) Certificate of a Pharmaceutical Product (CPP) stating the new pack size.",
      "4) The results of stability studies that have been carried out according to the SFDA stability guidelines, on the relevant stability parameters, on at least two pilot or production scale batches for at least three months.",
      "5) A letter of commitment to finalize the stability study and to report any out-of-specification results immediately to the authority.",
      "6) A recent and official price certificate by the company and legalized by the Saudi Embassy in the country of origin (indicating the new pack size).",
      "7) Samples of the finished product."
    ]
  },
  {
    "code": "46",
    "title": "Change in the packaging design of the primary and/or secondary packaging",
    "category": "Stability and Shelf-life",
    "type": "IB",
    "conditions": [],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation.",
      "2) The submitted documents should clearly outline the “present” and “proposed” mock-up.",
      "3) Sample of the artwork f) Stability"
    ]
  },
  {
    "code": "47.b",
    "title": "Extension of the shelf-life of the finished product as packaged for sale supported by real time data",
    "category": "Stability and Shelf-life",
    "type": "IB",
    "conditions": [],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation.",
      "2) Recent real time stability studies (covering the entire shelf-life) conducted according to the SFDA stability guidelines and relevant stability parameters have been assessed on at least two pilot scale batches* batches (three production batches for biological/ immunological medicinal product) of the finished product in the authorized packaging material and/or after first opening or reconstitution (in-use stability), as appropriate; where applicable, results of appropriate microbiological testing should be included.",
      "3) Copy of approved end of shelf life finished product specification and where applicable, specifications after dilution/reconstitution or first opening."
    ]
  },
  {
    "code": "47",
    "title": "Extension of the shelf-life of a biological/immunological medicinal product in accordance with an approved stability protocol",
    "category": "Stability and Shelf-life",
    "type": "IB",
    "conditions": [],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation.",
      "2) Recent real time stability studies (covering the entire shelf-life) conducted according to the SFDA stability guidelines and relevant stability parameters have been assessed on at least two pilot scale batches* batches (three production batches for biological/ immunological medicinal product) of the finished product in the authorized packaging material and/or after first opening or reconstitution (in-use stability), as appropriate; where applicable, results of appropriate microbiological testing should be included.",
      "3) Copy of approved end of shelf life finished product specification and where applicable, specifications after dilution/reconstitution or first opening."
    ]
  },
  {
    "code": "47.c",
    "title": "Change in storage conditions of the finished product or of the diluted/reconstituted product",
    "category": "Stability and Shelf-life",
    "type": "IB",
    "conditions": [],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation.",
      "2) Recent real time stability studies (covering the entire shelf-life) conducted according to the SFDA stability guidelines and relevant stability parameters have been assessed on at least two pilot scale batches* batches (three production batches for biological/ immunological medicinal product) of the finished product in the authorized packaging material and/or after first opening or reconstitution (in-use stability), as appropriate; where applicable, results of appropriate microbiological testing should be included.",
      "3) Copy of approved end of shelf life finished product specification and where applicable, specifications after dilution/reconstitution or first opening."
    ]
  },
  {
    "code": "48",
    "title": "New certificate for a non-sterile active substance from a new manufacturer (CEP)",
    "category": "Manufacturing and Sites",
    "type": "IB",
    "conditions": [],
    "documents": [
      "1) A valid Certificate of Suitability (CEP) (including any annexes) where the declaration of access for the CEP should be duly filled out by the CEP holder, including a written assurance that no significant changes in the manufacturing method have taken place following the granting of certificate or its last revision.",
      "2) The submitted documents should clearly outline the “present” and “proposed” manufacturers.",
      "3) Replacement of the relevant pages of the dossier that are affected by the variation.",
      "4) Where applicable, a document providing information of any materials falling within the scope of the note for guidance on minimizing the risk of transmitting animal spongiform encephalopathy agents via human and veterinary medicinal products or an equivalent guideline of the ICH region and associated countries including those which are used in the manufacturer of the API. The following information should be included for each such material: name of manufacturer, species and tissues from which the material is a derivative, country of origin of the source animals and its use.",
      "5) Where applicable, for active substance, a declaration by the Qualified Person (QP) of each of the manufacturing authorisation holders listed in the application where the active substance is used as a starting material and a declaration by the QP of each of the manufacturing authorisation holders listed in the application as responsible for batch release. These declarations should state that the active substance manufacturer(s) referred to in the application operate in compliance with the detailed guidelines on good manufacturing practice for starting materials. The manufacture of intermediates also require a QP declaration, while as far as any updates to certificates for active substances and intermediates are concerned, a QP declaration is only required if, compared to the previously registered version of the certificate, there is a change to the actual listed manufacturing sites.",
      "6) Suitable evidence to confirm compliance of the water used in the final steps of the synthesis of the active substance with the corresponding requirements on quality of water for pharmaceutical use.",
      "7) Specifications of the finished product manufacturer including all tests and limits of the CEP and Ph.Eur. monograph and any additional tests and acceptance criteria that are not controlled in the CEP and Ph.Eur. monograph, such as polymorphs and/or particle size distribution."
    ]
  },
  {
    "code": "50.b",
    "title": "First-time inclusion of a new Plasma Master File not affecting the properties of the finished product",
    "category": "Manufacturing and Sites",
    "type": "IB",
    "conditions": [],
    "documents": [
      "1) Letter declaring that: •   The PMF certificate, evaluation report and PMF are fully applicable to the authorized product, •   PMF holder has submitted the PMF certificate, evaluation report and PMF dossier to the MAH (where the MAH is different from the PMF holder), •   The PMF certificate, evaluation report and PMF dossier replace the previous PMF documentation for this Marketing Authorization.",
      "2) Plasma Master File (PMF) certificate, evaluation report and PMF dossier (or amended parts).",
      "3) An expert statement outlining all the changes introduced with the certified PMF and evaluating their potential impact on the finished products including product specific risk assessments. .",
      "4) The submitted documents should clearly outline the “present” and “proposed” PMF certificate."
    ]
  },
  {
    "code": "50.c",
    "title": "Inclusion of an updated/amended Plasma Master File not affecting the properties of the finished product",
    "category": "Manufacturing and Sites",
    "type": "IB",
    "conditions": [],
    "documents": [
      "1) Letter declaring that: •   The PMF certificate, evaluation report and PMF are fully applicable to the authorized product, •   PMF holder has submitted the PMF certificate, evaluation report and PMF dossier to the MAH (where the MAH is different from the PMF holder), •   The PMF certificate, evaluation report and PMF dossier replace the previous PMF documentation for this Marketing Authorization.",
      "2) Plasma Master File (PMF) certificate, evaluation report and PMF dossier (or amended parts).",
      "3) An expert statement outlining all the changes introduced with the certified PMF and evaluating their potential impact on the finished products including product specific risk assessments. .",
      "4) The submitted documents should clearly outline the “present” and “proposed” PMF certificate."
    ]
  },
  {
    "code": "51.b",
    "title": "Inclusion of an updated/amended Vaccine Antigen Master File not affecting the properties of the finished product",
    "category": "Manufacturing and Sites",
    "type": "IB",
    "conditions": [],
    "documents": [
      "1) Letter declaring that: •   The VAMF certificate, evaluation report and VAMF are fully applicable to the authorized product, •   VAMF holder has submitted the VAMF certificate, Evaluation report and VAMF dossier to the MAH (where the MAH is different from the VAMF holder), •   The VAMF certificate, evaluation report and VAMF dossier replace the previous VAMF documentation for this Marketing Authorization.",
      "2) VAMF certificate, evaluation report and VAMF dossier (or amended parts).",
      "3) An expert statement outlining all the changes introduced with the certified VAMF and evaluating their potential impact on the finished products including product specific risk assessments. .",
      "4) The submitted document should clearly outline the “present” and “proposed” VAMF certificate. II.5 Drug containing medical device"
    ]
  },
  {
    "code": "52",
    "title": "Change of a measuring or administration device — non-certified device for veterinary products",
    "category": "Manufacturing and Sites",
    "type": "IB",
    "conditions": [],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation (including description, detailed drawing and composition of the device material and supplier where appropriate).",
      "3) Data to demonstrate accuracy, precision and compatibility of the device."
    ]
  },
  {
    "code": "53.e",
    "title": "Addition of a specification parameter for a measuring or administration device as a result of a safety or quality issue",
    "category": "Manufacturing and Sites",
    "type": "IB",
    "conditions": [],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation.",
      "2) Comparative table of current and proposed specifications.",
      "3) Details of any new analytical method and summary of validation data.",
      "4) Batch analysis data on two production batches for all tests in the new specification.",
      "6) Justification for the new specification parameter and the limits."
    ]
  },
  {
    "code": "55",
    "title": "Change in the summary of product characteristics, labeling or package leaflet — implementation of change(s) for which no new pre/non-clinical or clinical data exist",
    "category": "Labeling and Leaflet",
    "type": "IB",
    "conditions": [],
    "documents": [
      "1) Attached to the cover letter of the variation application: the competent authority request, if available.",
      "2) Revised product information.",
      "3) Clear comparison table that shows the exact differences between current and proposed SPC/PIL."
    ]
  },
  {
    "code": "56",
    "title": "Change(s) in the summary of product characteristics, labeling or package leaflet — implementation of agreed wording change(s) requested by SFDA",
    "category": "Labeling and Leaflet",
    "type": "IB",
    "conditions": [],
    "documents": [
      "1) Attached to the cover letter of the variation application: the competent authority request with attached relevant assessment report, if available.",
      "2) Revised product information. Note: MAHs are reminded that once new information becomes available (e.g. new study data) which might entail the variation of the MA, this should be submitted as a variation. 57.Variations related to significant modifications of the           Conditions      Documentation       Procedure Summary of Product Characteristics due in particular to          to be           to be supplied      type new quality, pre-clinical, clinical or pharmacovigilance         fulfilled data*"
    ]
  },
  {
    "code": "59.a",
    "title": "Deletion of a pharmaceutical form",
    "category": "Safety and Efficacy",
    "type": "IB",
    "conditions": [],
    "documents": [
      "1) Declaration that the remaining product presentation(s) are adequate for the dosing instructions and treatment duration as mentioned in the summary of product characteristics.",
      "2) Revised product information. Note: This change used to update product information, deregistration of a pharmaceutical form or strength should be submitted as cessation of marketing of a medicinal product according to SFDA guidance for submission. * Variation requests related to pharmacovigilance data such as RMP, drug safety labeling updates, PSMF, QPPV information or packaging artwork † For innovator"
    ]
  },
  {
    "code": "59.b",
    "title": "Deletion of a strength",
    "category": "Safety and Efficacy",
    "type": "IB",
    "conditions": [],
    "documents": [
      "1) Declaration that the remaining product presentation(s) are adequate for the dosing instructions and treatment duration as mentioned in the summary of product characteristics.",
      "2) Revised product information. Note: This change used to update product information, deregistration of a pharmaceutical form or strength should be submitted as cessation of marketing of a medicinal product according to SFDA guidance for submission. * Variation requests related to pharmacovigilance data such as RMP, drug safety labeling updates, PSMF, QPPV information or packaging artwork † For innovator"
    ]
  },
  {
    "code": "60.a",
    "title": "Change in legal status of a medicinal product — for generic/biosimilar medicinal products",
    "category": "Safety and Efficacy",
    "type": "IB",
    "conditions": [],
    "documents": [
      "1) Legal status classification of the product in stringent regulatory authorities (in tabular format)."
    ]
  },
  {
    "code": "60.c",
    "title": "Change the distribution site of the reference medicinal product",
    "category": "Safety and Efficacy",
    "type": "IB",
    "conditions": [],
    "documents": [
      "4) The company must provide justifications for the change in the distribution site included in the cover letter of the application."
    ]
  },
  {
    "code": "63.b",
    "title": "Deletion of a food producing or non-food producing species not resulting from a safety issue (veterinary)",
    "category": "Safety and Efficacy",
    "type": "IB",
    "conditions": [],
    "documents": [
      "1) Justification for the deletion of the target species.",
      "2) Replacement of the relevant pages of the dossier that are affected by the variation."
    ]
  },
  {
    "code": "64.b",
    "title": "Other changes to the pharmacovigilance system master file (PSMF)",
    "category": "Safety and Efficacy",
    "type": "IB",
    "conditions": [],
    "documents": [
      "1) Replacement of the relevant pages of the dossier that are affected by the variation."
    ]
  },
  {
    "code": "68.b",
    "title": "Change(s) to a PSMF which has been assessed by the relevant national competent authority for another product of the same MAH",
    "category": "Safety and Efficacy",
    "type": "IB",
    "conditions": [],
    "documents": [
      "1) The new Detailed Description of the Pharmacovigilance System) DDPS(",
      "2) Reference to the application/procedure and product in which the DDPS was assessed previously IV.      PMF/VAMF"
    ]
  },
  {
    "code": "73",
    "title": "Replacement or addition of a blood/plasma collection centre",
    "category": "Safety and Efficacy",
    "type": "IB",
    "conditions": [],
    "documents": [
      "1) Epidemiological data for viral markers related to the blood/plasma collection centre covering the last 3 years. For newly opened centre(s) or in case no data are yet available, a declaration that epidemiological data will be provided at the time of the next annual update(s).",
      "2) Statement that the centre is working under the same conditions as the other centers belonging to the blood establishment, as specified in the standard contract between blood establishment and PMF holder.",
      "3) Updated relevant sections and annexes of the PMF dossier."
    ]
  },
  {
    "code": "76",
    "title": "Replacement or addition of a blood centre for testing",
    "category": "Safety and Efficacy",
    "type": "IB",
    "conditions": [],
    "documents": [
      "1) Statement that the testing site is performed following the same SOPs and/or test methods as the already accepted.",
      "2) Updated relevant sections and annexes of the PMF dossier. 77.Addition of a new blood establishment for testing of          Conditions        Documentation    Procedure donations and/or plasma pool not included in the PMF          to be             to be supplied   type fulfilled"
    ]
  },
  {
    "code": "78",
    "title": "Replacement or addition of a new blood establishment for the collection and testing of blood/blood components used as starting material",
    "category": "Safety and Efficacy",
    "type": "IB",
    "conditions": [],
    "documents": [
      "1) Statement that the storage centre is working following the same SOPs as the already accepted establishment.",
      "2) Updated relevant sections and annexes of the PMF dossier."
    ]
  },
  {
    "code": "80",
    "title": "Replacement or addition of an organization involved in the transport of plasma or intermediates",
    "category": "Safety and Efficacy",
    "type": "IB",
    "conditions": [],
    "documents": [
      "1) Updated relevant sections and annexes of the PMF dossier, including a list of all the blood establishments using this transport organization, a summary of the system in place to ensure that the transport is performed under appropriate conditions (time, temperature and GMP compliance) and confirmation that transport conditions are validated."
    ]
  },
  {
    "code": "86",
    "title": "Removal of inventory hold period or reduction in its duration",
    "category": "Safety and Efficacy",
    "type": "IB",
    "conditions": [],
    "documents": [
      "1) Updated relevant sections of the PMF dossier."
    ]
  },
  {
    "code": "90",
    "title": "Change in the plasma pool preparation (e.g. pool size)",
    "category": "Safety and Efficacy",
    "type": "IB",
    "conditions": [],
    "documents": [
      "1) Updated relevant sections of the PMF dossier."
    ]
  }
];

// Strip leading numbering like "1) ", "2. ", "3)" from conditions and documents
// so they render as plain bullets in the UI and in the generated Word document.
const stripLeadingNumber = (s: string): string =>
  s.replace(/^\s*\d+\s*[\)\.\-:]\s*/, "").trim();

for (const v of VARIATIONS) {
  v.conditions = v.conditions.map(stripLeadingNumber);
  v.documents = v.documents.map(stripLeadingNumber);
}
