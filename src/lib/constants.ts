export const SCENARIO_TYPES = [
  { value: "climate", label: "Climate" },
  { value: "macro", label: "Macro" },
  { value: "infrastructure", label: "Infrastructure" },
  { value: "geopolitical", label: "Geopolitical" },
  { value: "policy", label: "Policy" },
  { value: "multi-factor", label: "Multi-Factor" },
] as const;

export const RISK_OVERLAY_OPTIONS = [
  { value: "climate", label: "Climate" },
  { value: "inflation", label: "Inflation" },
  { value: "supply-chain", label: "Supply Chain" },
  { value: "conflict", label: "Conflict" },
  { value: "water-stress", label: "Water Stress" },
  { value: "policy", label: "Policy Risk" },
] as const;

export const RISK_DOMAINS = [
  { value: "climate", label: "Climate" },
  { value: "economy", label: "Economy" },
  { value: "infrastructure", label: "Infrastructure" },
  { value: "health", label: "Health" },
  { value: "policy", label: "Policy" },
  { value: "markets", label: "Markets" },
] as const;

export const NAV_ITEMS = [
  { title: "Dashboard", url: "/dashboard", icon: "LayoutDashboard" },
  { title: "Risk Radar", url: "/risk-radar", icon: "Radar" },
  { title: "Scenarios", url: "/scenarios", icon: "FlaskConical" },
  { title: "Simulations", url: "/simulations", icon: "Activity" },
  { title: "Portfolios", url: "/portfolios", icon: "Briefcase" },
  { title: "Impact", url: "/impact", icon: "ShieldCheck" },
  { title: "Propagation Graph", url: "/graph", icon: "GitBranch" },
  { title: "Settings", url: "/settings", icon: "Settings" },
];
