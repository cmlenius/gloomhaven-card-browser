import "../public/global.css";
import { SpoilersProvider } from "../hooks/useSpoilers";

function MyApp({ Component, pageProps }) {
  return (
    <SpoilersProvider>
      <Component {...pageProps} />
    </SpoilersProvider>
  );
}

export default MyApp;
