import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGear,
  faScroll,
  faSackDollar,
  faShield,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";

import Search from "./Search";
import Settings from "./Settings";

const headerLinks = [
  { icon: faShield, label: "Characters", pathname: "/characters" },
  { icon: faSackDollar, label: "Items", pathname: "/items" },
  { icon: faScroll, label: "Mats", pathname: "/mats" },
];

function TopBar({ openSettingDrawer }) {
  const router = useRouter();
  const query = router.query;

  return (
    <nav className="topbar">
      <div className="topbar-inner">
        <div className="main-search">
          <Search />
        </div>
        <div className="header-links">
          {headerLinks.map((link, idx) => (
            <div key={idx} className="header-link">
              <Link
                href={{
                  pathname: link.pathname,
                  query: { game: query.game || "gh" },
                }}
              >
                <span>
                  <FontAwesomeIcon className="header-icon" icon={link.icon} />
                  <a>{link.label}</a>
                </span>
              </Link>
            </div>
          ))}
          <div className="header-link view-more" onClick={openSettingDrawer}>
            <FontAwesomeIcon className="header-icon" icon={faGear} />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default function Layout({ children }) {
  const [settingDrawerOpen, setSettingDrawerOpen] = useState(false);

  return (
    <>
      <Head>
        <title>Gloomhaven Cards</title>
        <meta
          name="description"
          content="Gloomhaven Cards is a tool for browsing and searching Gloomhaven cards."
        />
        <link rel="icon" href="/logo.png" />
      </Head>
      <Settings
        open={settingDrawerOpen}
        onClose={() => setSettingDrawerOpen(false)}
      />
      <TopBar openSettingDrawer={() => setSettingDrawerOpen(true)} />
      <main className="main">{children}</main>
    </>
  );
}
