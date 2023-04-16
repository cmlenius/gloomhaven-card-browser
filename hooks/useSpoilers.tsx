import { createContext, useContext, useEffect, useState } from "react";
import { Spoilers } from "../common/types";
import { characters } from "../data/characters";

interface SpoilersContextInterface {
  spoilers: Spoilers;
  setSpoilers: (sc: Spoilers) => void;
}

export const defaultSpoilersContextValue: Spoilers = {
  characters: new Set<string>(characters.map((c) => c.class)),
  items: {
    prosperity: "9",
    recipes: true,
    solo: true,
    other: true,
    fc: true,
  },
  level: 1,
  loading: true,
};

const SpoilersContext = createContext<SpoilersContextInterface>({
  spoilers: defaultSpoilersContextValue,
  setSpoilers: () => {},
});

export const SpoilersProvider = ({ children }) => {
  const [spoilers, setSpoilers] = useState<Spoilers>(
    defaultSpoilersContextValue
  );

  useEffect(() => {
    const storageSpoilers = localStorage.getItem("spoilers");
    if (!storageSpoilers) {
      setSpoilers((spoilers) => ({ ...spoilers, loading: false }));
      return;
    }

    const parsedSpoilers = JSON.parse(storageSpoilers);
    if (!parsedSpoilers) {
      localStorage.delete("spoilers");
      setSpoilers((spoilers) => ({ ...spoilers, loading: false }));
      return;
    }

    parsedSpoilers.characters = new Set(parsedSpoilers?.characters);
    setSpoilers({ ...parsedSpoilers, loading: false });
  }, []);

  return (
    <SpoilersContext.Provider value={{ spoilers, setSpoilers: setSpoilers }}>
      {children}
    </SpoilersContext.Provider>
  );
};

export const useSpoilers = () => {
  const { spoilers, setSpoilers } = useContext(SpoilersContext);

  const updateSpoilers = (newSpoilers: Spoilers) => {
    localStorage.setItem(
      "spoilers",
      JSON.stringify({
        ...newSpoilers,
        characters: Array.from(newSpoilers.characters || []),
      })
    );
    setSpoilers(newSpoilers);
  };

  return { spoilers, updateSpoilers };
};
