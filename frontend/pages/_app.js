// Keep a single global stylesheet import for the Pages Router.
// Do not import ../app/globals.css (App Router path).
import "../styles/globals.css";

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}