import MetricCard from "../components/MetricCard";
import { getDashboardData } from "../lib/api";

export default async function DashboardPage() {
  const { metrics, environments, pipelines, observability } = await getDashboardData();

  return (
    <main className="mx-auto max-w-7xl p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold">TestGuardian Platform Dashboard</h1>
        <p className="mt-2 text-slate-300">Cloud-native QA, DevOps automation and release quality intelligence.</p>
      </header>

      <section className="grid gap-4 md:grid-cols-5">
        <MetricCard title="Test Pass Rate" value={`${metrics.testPassRate}%`} />
        <MetricCard title="Automation Coverage" value={`${metrics.automationCoverage}%`} />
        <MetricCard title="Defect Density" value={`${metrics.defectDensity}%`} />
        <MetricCard title="Release Risk" value={metrics.releaseRiskScore} />
        <MetricCard title="Build Stability" value={`${metrics.buildStability}%`} />
      </section>

      <section className="mt-8 grid gap-6 md:grid-cols-2">
        <article className="card">
          <h2 className="text-xl font-semibold">Environments</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {environments.map((env) => (
              <li key={env.id} className="flex justify-between border-b border-slate-800 pb-2">
                <span>{env.name} ({env.type})</span>
                <span className="text-slate-400">{env.status}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="card">
          <h2 className="text-xl font-semibold">Pipelines</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {pipelines.map((pipeline) => (
              <li key={pipeline.id} className="border-b border-slate-800 pb-2">
                <div className="flex justify-between">
                  <span>{pipeline.id}</span>
                  <span>{pipeline.status}</span>
                </div>
                <p className="text-xs text-slate-400">Commit: {pipeline.commitSha}</p>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="card mt-6">
        <h2 className="text-xl font-semibold">Observability Quick Links</h2>
        <div className="mt-4 grid gap-2 text-sm md:grid-cols-2">
          {Object.entries(observability).map(([name, path]) => (
            <a key={name} href={path} className="rounded border border-slate-700 px-3 py-2 hover:bg-slate-800">
              {name}: {path}
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
