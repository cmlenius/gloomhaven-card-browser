import { SpoilersProvider } from "../hooks/useSpoilers";
import "../public/global.css";

function MyApp({ Component, pageProps }) {
  return (
    <SpoilersProvider>
      <Component {...pageProps} />
    </SpoilersProvider>
  );
}

export default MyApp;
