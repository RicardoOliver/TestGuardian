export default function MetricCard({ title, value, helper }) {
  return (
    <article className="card">
      <h3 className="text-sm uppercase tracking-wide text-slate-400">{title}</h3>
      <p className="metric mt-2">{value}</p>
      {helper ? <p className="mt-1 text-xs text-slate-500">{helper}</p> : null}
    </article>
  );
}
