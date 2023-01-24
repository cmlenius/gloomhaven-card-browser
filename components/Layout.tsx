import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Script from "next/script";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGear,
  faSackDollar,
  faShield,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import { verifyQueryParam } from "../common/helpers";

import Settings from "./Settings";

type HeaderLink = {
  icon: IconDefinition;
  isHome?: boolean;
  label: string;
  pathname: string;
};

const headerLinks = [
  { icon: faShield, label: "Characters", pathname: "characters" },
  { icon: faSackDollar, label: "Items", pathname: "items" },
];

type SettingsAnchorProps = {
  mobile?: boolean;
  openSettingsDrawer: () => void;
};

const SettingsAnchor = ({
  mobile,
  openSettingsDrawer,
}: SettingsAnchorProps) => {
  return (
    <div
      className={`header-link view-more ${mobile ? "mobile" : "desktop"}`}
      onClick={openSettingsDrawer}
    >
      <span>
        <FontAwesomeIcon className="header-icon" icon={faGear} />
        <span>Settings</span>
      </span>
    </div>
  );
};

type HeaderLinkProps = {
  game: string | null;
  link: HeaderLink;
};

const HeaderLink = ({ game, link }: HeaderLinkProps) => {
  return (
    <Link
      href={{
        pathname: link.pathname,
        ...(game && !link.isHome && { query: { game: game } }),
      }}
    >
      <div className="header-link">
        <span>
          <FontAwesomeIcon className="header-icon" icon={link.icon} />
          <a>{link.label}</a>
        </span>
      </div>
    </Link>
  );
};

type TopBarProps = {
  openSettingsDrawer: () => void;
};

const TopBar = ({ openSettingsDrawer }: TopBarProps) => {
  const router = useRouter();

  const showLinks = router.pathname !== "/";

  return (
    <nav className="topbar">
      <div className="topbar-inner">
        <div className="header-links">
          {showLinks &&
            headerLinks.map((link, idx) => (
              <HeaderLink
                key={idx}
                game={verifyQueryParam(router.query.game)}
                link={link}
              />
            ))}
          {showLinks && (
            <SettingsAnchor mobile openSettingsDrawer={openSettingsDrawer} />
          )}
        </div>
        {showLinks && (
          <SettingsAnchor openSettingsDrawer={openSettingsDrawer} />
        )}
      </div>
    </nav>
  );
};

type LayoutProps = {
  children?: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const router = useRouter();
  const game = verifyQueryParam(router?.query?.game, "gh");

  const [settingDrawerOpen, setSettingDrawerOpen] = useState(false);

  let titlePrefix = "Gloomhaven";
  switch (game) {
    case "fh":
      titlePrefix = "Frosthaven";
      break;
    case "cs":
    case "toa":
      titlePrefix = "Crimson Scales";
      break;
    case "jotl":
      titlePrefix = "Jaws of the Lion";
      break;
  }

  return (
    <>
      <Head>
        <title>{titlePrefix + " Card Browser"}</title>
        <meta
          name="description"
          content="Gloomhaven Card Browser is a tool for viewing and browsing Gloomhaven cards. It includes cards from the Gloomhaven, Frosthaven, Forgotten Circles, Jaws of the Lion, Crimson Circles, and Trail of Ashes"
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
