import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGear,
  faMagnifyingGlass,
  faSackDollar,
  faShield,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";

import Settings from "./Settings";

const headerLinks = [
  { icon: faShield, label: "Characters", pathname: "/characters" },
  { icon: faSackDollar, label: "Items", pathname: "/items" },
];

function SearchBar() {
  const router = useRouter();
  const query = router.query;
  const initialSearchText = query.searchFilter ?? "";

  const [searchText, setSearchText] = useState(initialSearchText);

  const onSubmit = (e) => {
    e.preventDefault();

    if (searchText) {
      query.searchFilter = searchText;
    } else {
      delete query.searchFilter;
    }

    router.push({
      pathname: router.pathname,
      query,
    });
  };

  return (
    <form className="header-search" onSubmit={onSubmit}>
      <input
        type="search"
        defaultValue={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />

      <button type="submit">
        <FontAwesomeIcon className="header-icon" icon={faMagnifyingGlass} />
      </button>
    </form>
  );
}

function SettingsAnchor({ mobile, openSettingDrawer }) {
  return (
    <div
      className={`header-link view-more ${mobile ? "mobile" : "desktop"}`}
      onClick={openSettingDrawer}
    >
      <span>
        <FontAwesomeIcon className="header-icon" icon={faGear} />
        <span>Settings</span>
      </span>
    </div>
  );
}

function HeaderLink({ game, link }) {
  return (
    <div className="header-link">
      <Link
        href={{
          pathname: link.pathname,
          query: { game: game },
        }}
      >
        <span>
          <FontAwesomeIcon className="header-icon" icon={link.icon} />
          <a>{link.label}</a>
        </span>
      </Link>
    </div>
  );
}

function TopBar({ openSettingDrawer }) {
  const router = useRouter();
  const query = router.query;

  return (
    <nav className="topbar">
      <div className="topbar-inner">
        <div className="header-links">
          {headerLinks.map((link, idx) => (
            <HeaderLink key={idx} game={query.game || "gh"} link={link} />
          ))}
          <SettingsAnchor mobile openSettingDrawer={openSettingDrawer} />
        </div>
        <SearchBar />
        <SettingsAnchor openSettingDrawer={openSettingDrawer} />
      </div>
    </nav>
  );
}

export default function Layout({ children }) {
  const [settingDrawerOpen, setSettingDrawerOpen] = useState(false);

  return (
    <>
      <Head>
        <title>Gloomhaven Card Browser</title>
        <meta
          name="description"
          content="Gloomhaven Card Browser is a tool for browsing and viewing Gloomhaven cards. It includes cards from the Gloomhaven, Forgotten Circles, Jaws of the Lion, and Crimson Circles"
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
