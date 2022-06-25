import { createContext, useContext, useEffect, useState } from "react";

const SpoilersContext = createContext();

export const SpoilersProvider = ({ children }) => {
  const [spoilers, setSpoilers] = useState({
    characters: new Set(),
    items: {
      prosperity: "1",
      recipes: false,
      solo: false,
      other: false,
      fc: false,
    },
    level: 1,
    loading: true,
  });

  useEffect(() => {
    const storageSpoilers = localStorage.getItem("spoilers");
    if (!storageSpoilers) {
      setSpoilers({ ...spoilers, loading: false });
      return;
    }

    let parsedSpoilers = JSON.parse(storageSpoilers);
    if (!parsedSpoilers) {
      localStorage.delete("spoilers");
      setSpoilers({ ...spoilers, loading: false });
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

  function updateSpoilers(newSpoilers) {
    localStorage.setItem(
      "spoilers",
      JSON.stringify({
        ...newSpoilers,
        characters: Array.from(newSpoilers.characters || []),
      })
    );
    setSpoilers(newSpoilers);
  }

  return { spoilers, updateSpoilers };
};
