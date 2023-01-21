import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faWarning } from "@fortawesome/free-solid-svg-icons";

import { useSpoilers } from "../hooks/useSpoilers";
import {
  getBaseUrl,
  getCharacterClasses,
  verifyQueryParam,
} from "../common/helpers";
import { Character, Spoilers } from "../common/types";
import type { ParsedUrlQuery } from "querystring";

import Dropdown from "./Dropdown";

type GameOption = {
  id: string;
  name: string;
};

const gameOptions: GameOption[] = [
  { id: "gh", name: "Gloomhaven" },
  { id: "jotl", name: "Jaws of the Lion" },
  { id: "cs", name: "Crimson Scales" },
  { id: "toa", name: "Trail of Ashes" },
  { id: "fh", name: "Frosthaven" },
];

type ItemMiscSpoiler = {
  label: string;
  path: string;
};

type ItemSpoilerValue = string | boolean;

type ItemSpoilerConfig = {
  all: Record<string, ItemSpoilerValue>;
  default: Record<string, ItemSpoilerValue>;
  prosperity?: number;
  misc: ItemMiscSpoiler[];
};

const itemSpoilerConfig: Record<string, ItemSpoilerConfig> = {
  gh: {
    all: {
      prosperity: "9",
      recipes: true,
      solo: true,
      other: true,
      fc: true,
    },
    default: {
      prosperity: "1",
      recipes: false,
      solo: false,
      other: false,
      fc: false,
    },
    prosperity: 9,
    misc: [
      { label: "Random Item Designs", path: "recipes" },
      { label: "Other Items", path: "other" },
      { label: "Solo Scenario", path: "solo" },
      { label: "Forgotten Circles", path: "fc" },
    ],
  },
  jotl: {
    all: { jotl1: true, jotl2: true, jotl3: true },
    default: { jotl1: false, jotl2: false, jotl3: false },
    misc: [
      { label: "#14-20", path: "jotl1" },
      { label: "#21-26", path: "jotl2" },
      { label: "#27-36", path: "jotl3" },
    ],
  },
};

type ProsperitySpoilerProps = {
  handleItemSpoilerChange: (key: string, level: string) => void;
  level: string;
  spoilers: Spoilers;
};

const ProsperitySpoiler = (props: ProsperitySpoilerProps) => {
  const { handleItemSpoilerChange, level, spoilers } = props;

  return (
    <li
      className="prosperity-option"
      onClick={() => handleItemSpoilerChange("prosperity", level)}
    >
      <input
        checked={spoilers.items.prosperity === level}
        readOnly
        type="radio"
      />
      <span>{level}</span>
    </li>
  );
};

type ItemSpoilerProps = {
  handleItemSpoilerChange: (path: string, value: ItemSpoilerValue) => void;
  label: string;
  path: string;
  spoilers: Spoilers;
};

const ItemSpoiler = ({
  handleItemSpoilerChange,
  label,
  path,
  spoilers,
}: ItemSpoilerProps) => {
  return (
    <div
      className="spoiler-check-option"
      onClick={() => handleItemSpoilerChange(path, !spoilers.items[path])}
    >
      <input
        checked={!!spoilers.items[path] || false}
        readOnly
        type="checkbox"
      />
      <span>{label}</span>
    </div>
  );
};

const ItemSpoilers = ({ itemSpoilers }) => {
  const { spoilers, updateSpoilers } = useSpoilers();

  const allItemSpoilers = Object.keys(itemSpoilers.all).every(
    (key) => itemSpoilers.all[key] === spoilers.items[key]
  );

  const handleItemSpoilerToggleAll = () => {
    const items = allItemSpoilers ? itemSpoilers.default : itemSpoilers.all;

    updateSpoilers({
      ...spoilers,
      items: { ...spoilers.items, ...items },
    });
  };

  const handleItemSpoilerChange = (path: string, value: ItemSpoilerValue) => {
    const newSpoilers = { ...spoilers };
    newSpoilers.items[path] = value;
    updateSpoilers(newSpoilers);
  };

  if (!itemSpoilers) return <div />;

  return (
    <div className="spoiler-section">
      <div
        className="spoiler-check-option spoiler-header"
        onClick={handleItemSpoilerToggleAll}
      >
        <input checked={allItemSpoilers} readOnly type="checkbox" />
        <h4>Item Spoilers</h4>
      </div>
      <div className="item-spoilers">
        <div>
          {itemSpoilers.misc.map((is: ItemMiscSpoiler, idx: number) => (
            <ItemSpoiler
              key={idx}
              label={is.label}
              handleItemSpoilerChange={handleItemSpoilerChange}
              path={is.path}
              spoilers={spoilers}
            />
          ))}
        </div>
        {itemSpoilers.prosperity && (
          <div className="prosperity-spoilers">
            <h5>Prosperity</h5>
            <ul>
              {[
                ...Array.from({ length: 3 }, (_, i) => String(i * 3 + 1)),
                ...Array.from({ length: 3 }, (_, i) => String(i * 3 + 2)),
                ...Array.from({ length: 3 }, (_, i) => String(i * 3 + 3)),
              ].map((idx) => (
                <ProsperitySpoiler
                  key={idx}
                  handleItemSpoilerChange={handleItemSpoilerChange}
                  level={idx}
                  spoilers={spoilers}
                />
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

type CharacterSpoilersProps = {
  classes: Character[];
};

const CharacterSpoilers = ({ classes }: CharacterSpoilersProps) => {
  const { spoilers, updateSpoilers } = useSpoilers();
  const router = useRouter();

  const game = verifyQueryParam(router.query?.game, "gh");

  const allCharacterSpoilers = classes.every((c: Character) =>
    spoilers.characters.has(c.class)
  );

  const handleCharacterSpoilerToggleAll = () => {
    const newSet = new Set(spoilers.characters);

    if (classes.some((c: Character) => !spoilers.characters.has(c.class))) {
      for (const c of classes) {
        newSet.add(c.class);
      }
    } else {
      for (const c of classes) {
        newSet.delete(c.class);
      }
    }

    updateSpoilers({ ...spoilers, characters: newSet });
  };

  const handleCharacterSpoilerToggle = (id: string) => {
    const newSet = spoilers.characters;

    if (spoilers.characters?.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }

    updateSpoilers({ ...spoilers, characters: newSet });
  };

  return (
    <div className="spoiler-section">
      <div
        className="spoiler-check-option spoiler-header"
        onClick={handleCharacterSpoilerToggleAll}
      >
        <input checked={allCharacterSpoilers} readOnly type="checkbox" />
        <h4>Character Spoilers</h4>
      </div>
      <ul className="character-spoilers">
        {classes.map((char, idx) => (
          <li
            key={idx}
            className="spoiler-check-option"
            onClick={() => handleCharacterSpoilerToggle(char.class)}
          >
            <input
              checked={spoilers.characters.has(char.class)}
              readOnly
              style={{ accentColor: char.colour }}
              type="checkbox"
            />
            <img
              alt=""
              className="spoiler-class-icon"
              src={getBaseUrl() + `character-icons/${game}/${char.class}.png`}
            />
            <span>{char.altName || char.name}</span>
          </li>
        ))}
        {classes.length % 2 == 1 && <li className="spoiler-check-option" />}
      </ul>
    </div>
  );
};

type SettingsProps = {
  open: boolean;
  onClose: () => void;
};

const Settings = ({ open, onClose }: SettingsProps) => {
  const router = useRouter();
  const game = verifyQueryParam(router.query.game, "gh");
  const itemSpoilers = itemSpoilerConfig[game];
  const unlockabelClasses = getCharacterClasses(game).filter(
    (c) => !c.base && !c.hidden
  );

  const handleGameChange = (newGame: string) => {
    const newQuery: ParsedUrlQuery = {
      game: newGame,
    };

    router.push({
      pathname: router.pathname,
      query: newQuery,
    });
  };

  return (
    <>
      <div
        className="settings-overlay"
        onClick={onClose}
        style={{ display: open ? "block" : "none" }}
      />
      <div className="settings" style={!open ? { width: "0px" } : {}}>
        <div className="settings-inner">
          <div className="settings-header">
            <div style={{ width: "24px" }} />
            <Dropdown
              onChange={handleGameChange}
              options={gameOptions}
              value={game}
            />
            <FontAwesomeIcon
              className="spoilers-close-icon"
              icon={faClose}
              onClick={onClose}
            />
          </div>
          <div className="spoilers">
            {unlockabelClasses.length > 0 && (
              <CharacterSpoilers classes={unlockabelClasses} />
            )}
            {itemSpoilers && <ItemSpoilers itemSpoilers={itemSpoilers} />}
          </div>
          {(unlockabelClasses.length > 0 || itemSpoilers) && (
            <div className="spoilers-warning">
              <FontAwesomeIcon icon={faWarning} height="48px" />
              <span>
                Clicking the checkboxes above will reveal spoilers for those
                characters and items
              </span>
            </div>
          )}
          <div className="issues">
            <a
              href="https://github.com/cmlenius/gloomhaven-card-browser/issues"
              rel="noreferrer"
              target="_blank"
            >
              Report issues or missing content
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
