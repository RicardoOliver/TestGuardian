export const DELIVERY_FLOW = ["DEV", "QA", "UAT", "PROD"];

export const DEFAULT_ENVIRONMENTS = [
  {
    id: "env-dev",
    name: "DEV",
    purpose: "Development and experimentation",
    stability: "LOW",
    data: "Mock data",
    status: "ACTIVE"
  },
  {
    id: "env-qa",
    name: "QA",
    purpose: "Automated testing and validation",
    stability: "MEDIUM",
    data: "Test datasets",
    status: "ACTIVE"
  },
  {
    id: "env-uat",
    name: "UAT",
    purpose: "Business validation",
    stability: "HIGH",
    data: "Anonymized production data",
    status: "ACTIVE"
  },
  {
    id: "env-prod",
    name: "PROD",
    purpose: "Live system",
    stability: "VERY_HIGH",
    data: "Production data",
    status: "ACTIVE"
  }
];
