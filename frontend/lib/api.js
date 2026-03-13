const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

async function safeFetch(path, fallback) {
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, { cache: "no-store" });
    if (!res.ok) return fallback;
    return await res.json();
  } catch {
    return fallback;
  }
}

export async function getDashboardData() {
  const [metrics, environments, pipelines, observability] = await Promise.all([
    safeFetch("/api/metrics/dashboard", {
      testPassRate: 0,
      automationCoverage: 0,
      defectDensity: 0,
      releaseRiskScore: "UNKNOWN",
      buildStability: 0
    }),
    safeFetch("/api/environments", { items: [] }),
    safeFetch("/api/pipelines", { items: [] }),
    safeFetch("/api/observability", {})
  ]);

  return {
    metrics,
    environments: environments.items ?? [],
    pipelines: pipelines.items ?? [],
    observability
  };
}
