import { create } from "zustand";

export interface CraftingState {
  isCraftingMode: boolean;
  toggleCraftingMode: () => void;

  activeDeckClass: string | null;
  activeDeck: string[];

  toggleCard: (cardImage: string, characterClass: string, maxHandSize: number) => void;
  setDeck: (deck: string[]) => void;
  clearDeck: () => void;

  viewActiveHand: boolean;
  toggleViewActiveHand: () => void;

  loadState: (deckClass: string, deck: string[]) => void;

  toastMessage: string | null;
  setToastMessage: (msg: string | null) => void;
}

// Keep a global timeout reference to clear it cleanly
let toastTimeout: NodeJS.Timeout | null = null;

export const useCraftingStore = create<CraftingState>((set, get) => ({
  isCraftingMode: false,
  toggleCraftingMode: () => set((state) => ({ isCraftingMode: !state.isCraftingMode })),

  activeDeckClass: null,
  activeDeck: [],

  toggleCard: (cardImage: string, characterClass: string, maxHandSize: number) => {
    const state = get();
    let currentDeck = state.activeDeck;
    let currentClass = state.activeDeckClass;

    // If playing a new class, clear out the existing hand silently
    if (currentClass !== characterClass) {
      currentDeck = [];
      currentClass = characterClass;
    }

    const isSelected = currentDeck.includes(cardImage);
    if (isSelected) {
      set({
        activeDeckClass: currentClass,
        activeDeck: currentDeck.filter((c) => c !== cardImage),
      });
    } else {
      if (currentDeck.length < maxHandSize) {
        set({
          activeDeckClass: currentClass,
          activeDeck: [...currentDeck, cardImage],
        });
      } else {
        try {
          get().setToastMessage(`Max hand size of ${maxHandSize} reached!`);
        } catch(e) {}
      }
    }
  },

  setDeck: (deck: string[]) => set({ activeDeck: deck }),

  clearDeck: () => set({ activeDeck: [], activeDeckClass: null }),

  viewActiveHand: false,
  toggleViewActiveHand: () => set((state) => ({ viewActiveHand: !state.viewActiveHand })),

  loadState: (deckClass: string, deck: string[]) =>
    set({
      isCraftingMode: true,
      activeDeckClass: deckClass,
      activeDeck: deck,
      viewActiveHand: true,
    }),

  toastMessage: null,
  setToastMessage: (msg: string | null) => {
    if (toastTimeout) clearTimeout(toastTimeout);
    set({ toastMessage: msg });
    if (msg) {
      toastTimeout = setTimeout(() => {
        set({ toastMessage: null });
      }, 3000);
    }
  },
}));
