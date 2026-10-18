import type { AppProps } from "next/app";

import { SpoilersProvider } from "../hooks/useSpoilers";
import "../public/global.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SpoilersProvider>
      <Component {...pageProps} />
    </SpoilersProvider>
  );
}

export default MyApp;
