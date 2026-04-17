import LZString from "lz-string";

export const serializeBuild = (names: string[]): string => {
  return LZString.compressToEncodedURIComponent(names.join("|"));
};

export const deserializeBuild = (encodedData: string): string[] | null => {
  try {
    const rawData = LZString.decompressFromEncodedURIComponent(encodedData);
    if (!rawData) return null;
    return rawData.split("|");
  } catch (error) {
    console.error("Failed to parse build data", error);
    return null;
  }
};
