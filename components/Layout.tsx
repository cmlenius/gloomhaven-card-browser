import { faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Head from "next/head";
import { useRouter } from "next/router";
import Script from "next/script";
import { useState } from "react";

import { defaultDescription, defaultTitle, getBaseUrl, getGame, verifyQueryParam } from "../common/utils";
import { DropdownNav } from "../components/Dropdown";
import { games } from "../data/games";
import Settings from "./Settings";

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
    let path = `/${newGame}`;
    if (cardType) path += `/${cardType}`;
    return path;
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
            options={getGame(game)?.routes || []}
            value={cardType || "characters"}
          />
        </div>
        <SettingsAnchor openSettingsDrawer={openSettingsDrawer} />
      </div>
    </nav>
  );
};

type LayoutProps = {
  children?: React.ReactNode;
  description?: string;
  title?: string;
};

const Layout = ({ children, description, title }: LayoutProps) => {
  const [settingDrawerOpen, setSettingDrawerOpen] = useState(false);

  return (
    <>
      <Head>
        <title>{title || defaultTitle}</title>
        <meta name="description" content={description || defaultDescription} />
        <meta name="google-adsense-account" content="ca-pub-7422931766476755" />
        <meta name="google-site-verification" content="dyv7-lOXQn9xEOYXMD6s0oQYUYuQzTGN-KkjuPlILxg" />
        <link rel="icon" href={getBaseUrl() + "logo.png"} />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7422931766476755" crossOrigin="anonymous"></script>
      </Head>
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-FFL6ZJNJ4T" strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag("js", new Date());
          gtag("config", "G-FFL6ZJNJ4T");
        `}
      </Script>
      <Settings open={settingDrawerOpen} onClose={() => setSettingDrawerOpen(false)} />
      <TopBar openSettingsDrawer={() => setSettingDrawerOpen(true)} />
      <main className="main">{children}</main>
    </>
  );
};

export default Layout;
