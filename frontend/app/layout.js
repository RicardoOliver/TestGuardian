import "./globals.css";

export const metadata = {
  title: "TestGuardian Dashboard",
  description: "QAOps quality intelligence dashboard"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
