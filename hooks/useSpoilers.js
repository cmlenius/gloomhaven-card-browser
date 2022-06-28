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
    loading: true,
  });

  useEffect(() => {
    const storageSpoilers = localStorage.getItem("spoilers");
    if (!storageSpoilers) {
      setSpoilers({ ...spoilers, loading: false });
      return;
    }

    let parsedSpoilers = JSON.parse(storageSpoilers);
    parsedSpoilers.characters = new Set(parsedSpoilers?.characters);
    setSpoilers({ ...parsedSpoilers, loading: false });
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
