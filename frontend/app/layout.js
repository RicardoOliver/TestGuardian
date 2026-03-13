export const metadata = {
  title: "QAOps Platform Dashboard",
  description: "Cloud-native QAOps monitoring dashboard"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "Inter, Arial, sans-serif", background: "#0b1020", color: "#d9e1ff" }}>
        {children}
      </body>
    </html>
  );
}
