export default function MetricCard({ title, value, subtitle }) {
  return (
    <div style={{ background: "#121a33", border: "1px solid #24315f", borderRadius: 12, padding: 16 }}>
      <p style={{ margin: 0, color: "#9ca9d7", fontSize: 12 }}>{title}</p>
      <h3 style={{ margin: "8px 0", fontSize: 26 }}>{value}</h3>
      <p style={{ margin: 0, color: "#a8b4de", fontSize: 13 }}>{subtitle}</p>
    </div>
  );
}
