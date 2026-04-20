/**
 * Encodes a selected build as a compact, human-readable string.
 * Format: "{characterClass}_{id}-{id}-..."  e.g. "BR_1-7-12-14"
 *
 * Card IDs are 1-based sequential numbers assigned per class after
 * sorting by level ascending (see assignCardIds in utils.ts).
 */
export const serializeBuild = (characterClass: string, cardIds: number[]): string => {
  return `${characterClass}_${cardIds.join("-")}`;
};

export const deserializeBuild = (
  encoded: string
): { characterClass: string; cardIds: number[] } | null => {
  try {
    if (!encoded || !encoded.includes("_")) return null;

    const [characterClass, idsStr] = encoded.split("_");
    const cardIds = idsStr
      ? idsStr
        .split("-")
        .map(Number)
        .filter((n) => Number.isInteger(n) && n > 0)
      : [];

    // Safeguard: limit to 15 cards to prevent memory/UI abuse
    return { characterClass, cardIds: cardIds.slice(0, 15) };
  } catch (error) {
    console.error("Failed to parse build data", error);
    return null;
  }
};
