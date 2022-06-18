import { createContext, useContext, useEffect, useState } from "react";

const SpoilersContext = createContext();

export const SpoilersProvider = ({ children }) => {
  const [spoilers, setSpoilers] = useState({
    characters: new Set(),
    items: { prosperity: "1", recipes: false, other: false },
  });

  useEffect(() => {
    const storageSpoilers = localStorage.getItem("spoilers");
    if (!storageSpoilers) return;

    let parsedSpoilers = JSON.parse(storageSpoilers);
    parsedSpoilers.characters = new Set(parsedSpoilers?.characters);
    setSpoilers(parsedSpoilers);
  }, []);

  return (
    <SpoilersContext.Provider value={{ spoilers, updateSpoilers: setSpoilers }}>
      {children}
    </SpoilersContext.Provider>
  );
};

export const useSpoilers = () => {
  const { spoilers, updateSpoilers } = useContext(SpoilersContext);
  return { spoilers, updateSpoilers };
};
