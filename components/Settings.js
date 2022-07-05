import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faWarning } from "@fortawesome/free-solid-svg-icons";

import { useSpoilers } from "../hooks/useSpoilers";
import { characterClasses, defaultClass } from "../data/utils";

import Dropdown from "./Dropdown";
import SvgCharacterIcon from "./Svg";

const gameOptions = [
  { id: "gh", name: "Gloomhaven" },
  { id: "jotl", name: "Jaws of the Lion" },
  { id: "cs", name: "Crimson Scales" },
];

const itemSpoilerConfig = {
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
      { label: "Solo Scenario", path: "solo" },
      { label: "Other Items", path: "other" },
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

function ProsperitySpoiler({ handleItemSpoilerChange, level, spoilers }) {
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
}

function ItemSpoiler({ handleItemSpoilerChange, label, path, spoilers }) {
  return (
    <div
      className="spoiler-check-option"
      onClick={() => handleItemSpoilerChange(path, !spoilers.items[path])}
    >
      <input checked={spoilers.items[path] || false} readOnly type="checkbox" />
      <span>{label}</span>
    </div>
  );
}

function ItemSpoilers({ itemSpoilers }) {
  const { spoilers, updateSpoilers } = useSpoilers();

  const allItemSpoilers = Object.keys(itemSpoilers.all).every(
    (key) => itemSpoilers.all[key] === spoilers.items[key]
  );

  function handleItemSpoilerToggleAll() {
    const items = allItemSpoilers ? itemSpoilers.default : itemSpoilers.all;

    updateSpoilers({
      ...spoilers,
      items: { ...spoilers.items, ...items },
    });
  }

  function handleItemSpoilerChange(path, value) {
    let newSpoilers = { ...spoilers };
    newSpoilers.items[path] = value;
    updateSpoilers(newSpoilers);
  }

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
          {itemSpoilers.misc.map((is, idx) => (
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
}

function CharacterSpoilers({ classes }) {
  const { spoilers, updateSpoilers } = useSpoilers();

  const allCharacterSpoilers = classes.every((c) =>
    spoilers.characters.has(c.class)
  );

  function handleCharacterSpoilerToggleAll() {
    let newSet = new Set(spoilers.characters);

    if (classes.some((c) => !spoilers.characters.has(c.class))) {
      for (const c of classes) {
        newSet.add(c.class);
      }
    } else {
      for (const c of classes) {
        newSet.delete(c.class);
      }
    }

    updateSpoilers({ ...spoilers, characters: newSet });
  }

  function handleCharacterSpoilerToggle(id) {
    let newSet = spoilers.characters;

    if (spoilers.characters?.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }

    updateSpoilers({ ...spoilers, characters: newSet });
  }

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
            <SvgCharacterIcon character={char.class} />
            <span>{char.altName || char.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Settings({ open, onClose }) {
  const router = useRouter();

  const itemSpoilers = itemSpoilerConfig[router.query?.game || "gh"];

  const unlockabelClasses = characterClasses(router.query?.game || "gh").filter(
    (c) => !c.base && !c.hidden
  );

  function handleGameChange(newGame) {
    let newQuery = { ...router.query, game: newGame };

    if (router.pathname === "/characters") {
      newQuery.class = defaultClass(newGame);
    }

    router.push({
      pathname: router.pathname,
      query: newQuery,
    });
  }

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
              value={router.query.game || "gh"}
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
          <div className="spoilers-warning">
            <FontAwesomeIcon icon={faWarning} height="48px" />
            <span>
              Clicking the checkboxes above will reveal spoilers for those
              characters and items
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default Settings;
