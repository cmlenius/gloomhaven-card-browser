import "../public/global.css";
import { Analytics } from "@vercel/analytics/react";
import { SpoilersProvider } from "../hooks/useSpoilers";

function MyApp({ Component, pageProps }) {
  return (
    <SpoilersProvider>
      <Component {...pageProps} />
      <Analytics />
    </SpoilersProvider>
  );
}

export default MyApp;
