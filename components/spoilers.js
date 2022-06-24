import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

import { useSpoilers } from "../hooks/useSpoilers";
import { characters } from "../data/common";
import SvgCharacterIcon from "./Svg";

function CharacterSpoiler({ char }) {
  const { spoilers, updateSpoilers } = useSpoilers();

  function handleCharacterSpoilerToggle() {
    const id = char.id;
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

  const isChecked = spoilers.characters.has(char.id);

  return (
    <li className="spoiler-check-option" onClick={handleCharacterSpoilerToggle}>
      <input
        checked={isChecked}
        readOnly
        style={{ accentColor: char.colour }}
        type="checkbox"
      />
      <SvgCharacterIcon character={char.id} />
      <span>{isChecked ? char.name : char.altName}</span>
    </li>
  );
}

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
      <input checked={spoilers.items[path]} readOnly type="checkbox" />
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

function Spoilers({ open, onClose }) {
  const { spoilers, updateSpoilers } = useSpoilers();
  const unlockabelClasses = characters.filter((c) => !c.base && !c.hidden);

  function handleCharacterSpoilerToggleAll() {
    let newArr = [];
    if (unlockabelClasses.some((c) => !spoilers.characters.has(c.id))) {
      newArr = unlockabelClasses.map((c) => c.id);
    }

    updateSpoilers({ ...spoilers, characters: new Set(newArr) });
    localStorage.setItem(
      "spoilers",
      JSON.stringify({
        ...spoilers,
        characters: newArr,
      })
    );
  }

  function handleItemSpoilerToggleAll() {
    let items = { prosperity: "9", recipes: true, other: true };
    if (allItemSpoilers) {
      items = { prosperity: "1", recipes: false, other: false };
    }
    updateSpoilers({
      ...spoilers,
      items: items,
    });
    localStorage.setItem(
      "spoilers",
      JSON.stringify({
        characters: Array.from(spoilers.characters),
        items: items,
      })
    );
  }

  const allCharacterSpoilers = unlockabelClasses.every((c) =>
    spoilers.characters.has(c.id)
  );
  const allItemSpoilers =
    spoilers.items.recipes &&
    spoilers.items.other &&
    spoilers.items.prosperity === "9";

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

          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <div className="spoiler-section">
              <div
                className="spoiler-check-option"
                onClick={handleCharacterSpoilerToggleAll}
              >
                <input
                  checked={allCharacterSpoilers}
                  readOnly
                  type="checkbox"
                />
                <h4>Character Spoilers</h4>
              </div>
              <ul className="character-spoilers">
                {unlockabelClasses.map((char, idx) => (
                  <CharacterSpoiler key={idx} char={char} />
                ))}
              </ul>
            </div>

            <div className="spoiler-section">
              <div
                className="spoiler-check-option"
                onClick={handleItemSpoilerToggleAll}
              >
                <input checked={allItemSpoilers} readOnly type="checkbox" />
                <h4>Item Spoilers</h4>
              </div>
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
              <ItemSpoiler label="Random Item Designs" path="recipes" />
              <ItemSpoiler label="Other Items" path="other" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Spoilers;
