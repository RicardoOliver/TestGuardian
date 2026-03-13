import MetricCard from "../components/metric-card";

const metrics = [
  { title: "Test Pass Rate", value: "91%", subtitle: "From latest regression suite" },
  { title: "Automation Coverage", value: "82%", subtitle: "Web + API end-to-end" },
  { title: "Defect Density", value: "0.8", subtitle: "Defects per test run" },
  { title: "Build Stability", value: "93%", subtitle: "Successful pipelines in 7 days" },
  { title: "Release Risk Score", value: "MEDIUM", subtitle: "AI quality analysis" }
];

export default function Page() {
  return (
    <main style={{ maxWidth: 1040, margin: "0 auto", padding: 24 }}>
      <h1 style={{ marginBottom: 4 }}>QAOps Platform</h1>
      <p style={{ marginTop: 0, color: "#9fb0e6" }}>
        Unified dashboard for environments, CI/CD, test automation and quality intelligence.
      </p>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginTop: 16 }}>
        {metrics.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </section>

      <section style={{ marginTop: 24, background: "#121a33", border: "1px solid #24315f", borderRadius: 12, padding: 16 }}>
        <h2 style={{ marginTop: 0 }}>Environment Flow</h2>
        <p style={{ marginBottom: 0 }}>DEV → QA → UAT → PROD</p>
      </section>
    </main>
  );
}
