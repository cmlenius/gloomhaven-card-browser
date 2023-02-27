import { useState } from "react";
import Head from "next/head";
import Script from "next/script";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";

import { DropdownNav } from "../components/Dropdown";
import { verifyQueryParam } from "../common/helpers";
import { Option } from "../common/types";
import { games } from "../data/games";
import Settings from "./Settings";

const cardTypeOptions: Option[] = [
  { id: "characters", name: "Characters" },
  { id: "items", name: "Items" },
  { id: "events", name: "Events" },
  { id: "monsters", name: "Monsters" },
];

type SettingsAnchorProps = {
  openSettingsDrawer: () => void;
};

const SettingsAnchor = ({ openSettingsDrawer }: SettingsAnchorProps) => {
  return (
    <div className="header-link view-more" onClick={openSettingsDrawer}>
      <span>
        <FontAwesomeIcon className="header-icon" icon={faGear} />
        <span>Settings</span>
      </span>
    </div>
  );
};

type TopBarProps = {
  openSettingsDrawer: () => void;
};

const TopBar = ({ openSettingsDrawer }: TopBarProps) => {
  const router = useRouter();
  const game = verifyQueryParam(router.query.game, "gh");

  const handleGameChange = (newGame: string) => {
    return `/${newGame}/${cardType}`;
  };

  const handleCardTypeChange = (newCardType: string) => {
    return `/${game}/${newCardType}`;
  };

  const path = router.asPath.split("/");
  let cardType = path.length >= 3 ? path[2] : null;
  if (cardType) {
    cardType = cardType.split("?")[0];
  }

  return (
    <nav className="topbar">
      <div className="topbar-inner">
        <div className="header-links">
          <DropdownNav href={handleGameChange} options={games} value={game} />
          <DropdownNav
            href={handleCardTypeChange}
            options={cardTypeOptions}
            value={cardType}
          />
        </div>
        <SettingsAnchor openSettingsDrawer={openSettingsDrawer} />
      </div>
    </nav>
  );
};

type LayoutProps = {
  children?: React.ReactNode;
  title?: string;
};

const Layout = ({ children, title }: LayoutProps) => {
  const [settingDrawerOpen, setSettingDrawerOpen] = useState(false);

  return (
    <>
      <Head>
        <title>{title || "Gloomhaven Card Browser"}</title>
        <meta
          name="description"
          content="Gloomhaven Card Browser is a tool for viewing Ability, Item, Monster, and Event cards from the games Gloomhaven, Frosthaven, Forgotten Circles, Jaws of the Lion, Crimson Circles, and Trail of Ashes"
        />
        <meta
          name="google-site-verification"
          content="dyv7-lOXQn9xEOYXMD6s0oQYUYuQzTGN-KkjuPlILxg"
        />
        <link rel="icon" href="/logo.png" />
      </Head>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-FFL6ZJNJ4T"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag("js", new Date());
          gtag("config", "G-FFL6ZJNJ4T");
        `}
      </Script>
      <Settings
        open={settingDrawerOpen}
        onClose={() => setSettingDrawerOpen(false)}
      />
      <TopBar openSettingsDrawer={() => setSettingDrawerOpen(true)} />
      <main className="main">{children}</main>
    </>
  );
};

export default Layout;
