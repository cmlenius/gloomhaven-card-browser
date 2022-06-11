import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSackDollar, faShield } from "@fortawesome/free-solid-svg-icons";

function TopBar() {
  const router = useRouter();

  return (
    <nav className="topbar">
      <div className="topbarInner">
        <img src="/logo.png" style={{ height: 40, width: 40 }} />

        <div className="header-links">
          <div className="header-link">
            <Link href={{ pathname: "/characters", query: router.query }}>
              <span>
                <FontAwesomeIcon className="header-icon" icon={faShield} />
                <a>Characters</a>
              </span>
            </Link>
          </div>
          <div className="header-link">
            <Link href={{ pathname: "/items", query: router.query }}>
              <span>
                <FontAwesomeIcon className="header-icon" icon={faSackDollar} />
                <a>Items</a>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default function Layout({ children }) {
  return (
    <div>
      <Head>
        <title>Gloomhaven Card Viewer</title>
        <meta name="description" content="Browse gloomhaven cards and data" />
        <link rel="icon" href="/logo.png" />
      </Head>
      <TopBar />
      <main className="main">{children}</main>
    </div>
  );
}
