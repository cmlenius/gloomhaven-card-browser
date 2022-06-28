import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

import { useSpoilers } from "../hooks/useSpoilers";
import { characterClasses } from "../data/utils";
import SvgCharacterIcon from "./Svg";

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

function ItemSpoiler({ label, path }) {
  const { spoilers, updateSpoilers } = useSpoilers();

  function handleItemSpoilerToggle() {
    let newSpoilers = { ...spoilers };
    newSpoilers.items[path] = !spoilers.items[path];

    updateSpoilers(newSpoilers);
    localStorage.setItem(
      "spoilers",
      JSON.stringify({
        ...newSpoilers,
        characters: Array.from(newSpoilers.characters),
      })
    );
  }

  return (
    <div className="spoiler-check-option" onClick={handleItemSpoilerToggle}>
      <input checked={spoilers.items[path] || false} readOnly type="checkbox" />
      <span>{label}</span>
    </div>
  );
}

function ProsperitySpoiler({ level }) {
  const { spoilers, updateSpoilers } = useSpoilers();

  function handleProsperityChange() {
    updateSpoilers({
      ...spoilers,
      items: { ...spoilers.items, prosperity: level },
    });
    localStorage.setItem(
      "spoilers",
      JSON.stringify({
        characters: Array.from(spoilers.characters),
        items: { ...spoilers.items, prosperity: level },
      })
    );
  }

  return (
    <li className="prosperity-option" onClick={handleProsperityChange}>
      <input
        checked={spoilers.items.prosperity === level}
        readOnly
        type="radio"
      />
      <span>{level}</span>
    </li>
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

    localStorage.setItem(
      "spoilers",
      JSON.stringify({
        characters: Array.from(spoilers.characters),
        items: { ...spoilers.items, ...items },
      })
    );
  }

  if (!itemSpoilers) return <div />;

  return (
    <div className="spoiler-section">
      <div
        className="spoiler-check-option"
        onClick={handleItemSpoilerToggleAll}
      >
        <input checked={allItemSpoilers} readOnly type="checkbox" />
        <h4>Item Spoilers</h4>
      </div>
      <div className="item-spoilers">
        <div>
          {itemSpoilers.misc.map((is, idx) => (
            <ItemSpoiler key={idx} label={is.label} path={is.path} />
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
                <ProsperitySpoiler key={idx} level={idx} />
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
    spoilers.characters.has(c.id)
  );

  function handleCharacterSpoilerToggleAll() {
    let newSet = new Set(spoilers.characters);
    if (classes.some((c) => !spoilers.characters.has(c.id))) {
      for (const c of classes) {
        newSet.add(c.id);
      }
    } else {
      for (const c of classes) {
        newSet.delete(c.id);
      }
    }

    updateSpoilers({ ...spoilers, characters: newSet });
    localStorage.setItem(
      "spoilers",
      JSON.stringify({
        ...spoilers,
        characters: Array.from(newSet),
      })
    );
  }

  function handleCharacterSpoilerToggle(id) {
    let newSet = spoilers.characters;

    if (spoilers.characters?.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }

    updateSpoilers({ ...spoilers, characters: newSet });
    localStorage.setItem(
      "spoilers",
      JSON.stringify({ ...spoilers, characters: Array.from(newSet) })
    );
  }

  return (
    <div className="spoiler-section">
      <div
        className="spoiler-check-option"
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
            onClick={() => handleCharacterSpoilerToggle(char.id)}
          >
            <input
              checked={spoilers.characters.has(char.id)}
              readOnly
              style={{ accentColor: char.colour }}
              type="checkbox"
            />
            <SvgCharacterIcon character={char.id} />
            <span>{char.altName || char.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Spoilers({ open, onClose }) {
  const router = useRouter();

  const itemSpoilers = itemSpoilerConfig[router.query?.game || "gh"];

  const unlockabelClasses = characterClasses(router.query?.game).filter(
    (c) => !c.base && !c.hidden
  );

  return (
    <>
      <div
        className="spoilers-overlay"
        onClick={onClose}
        style={{ display: open ? "block" : "none" }}
      />
      <div className="spoilers" style={!open ? { width: "0px" } : {}}>
        <div className="spoilers-inner">
          <FontAwesomeIcon
            className="spoilers-close-icon"
            icon={faClose}
            onClick={onClose}
          />
          <div className="spoilers-warning">
            Click the checkboxes below to reveal spoilers for characters and
            items. Please be careful not to reveal anything you do not want to
            see.
          </div>
          <div className="spoilers-content">
            {unlockabelClasses.length > 0 && (
              <CharacterSpoilers classes={unlockabelClasses} />
            )}
            {itemSpoilers && <ItemSpoilers itemSpoilers={itemSpoilers} />}
          </div>
        </div>
      </div>
    </>
  );
}

export default Spoilers;
