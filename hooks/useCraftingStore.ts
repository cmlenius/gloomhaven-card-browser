import { create } from "zustand";
import { CharacterAbilityEnhancement } from "../common/types";

export interface EnhancementData {
  id: number;
  level: number;
  game: string;
  action: 'top' | 'bottom';
  loss: boolean;
  persistent: boolean;
  index: number;
  dot: CharacterAbilityEnhancement;
  x: number;
  y: number;
};

export interface CraftingState {
  isCraftingMode: boolean;
  toggleCraftingMode: () => void;

  enhancingMode: EnhancementData | null;
  setEnhancingMode: (enhancingMode: EnhancementData | null) => void;

  activeDeckClass: string | null;
  activeDeck: string[];
  activeEnhancements: Record<string, string>;

  toggleCard: (cardImage: string, characterClass: string, maxHandSize: number) => void;
  setDeck: (deck: string[]) => void;
  addEnhancement: (id: number, action: string, index: number, enhancement: string | null) => void;
  getEnhancement: (id: number, action: string, index: number) => string | null;
  clearDeck: () => void;

  viewActiveHand: boolean;
  toggleViewActiveHand: () => void;

  loadState: (deckClass: string, deck: string[], enhancements: Record<string, string>) => void;

  toastMessage: string | null;
  setToastMessage: (msg: string | null) => void;
}

// Keep a global timeout reference to clear it cleanly
let toastTimeout: NodeJS.Timeout | null = null;

export const useCraftingStore = create<CraftingState>((set, get) => ({
  isCraftingMode: false,
  toggleCraftingMode: () => set((state) => ({ isCraftingMode: !state.isCraftingMode })),

  enhancingMode: null,
  setEnhancingMode: (enhancingMode: EnhancementData | null) => set({ enhancingMode }),

  activeDeckClass: null,
  activeDeck: [],
  activeEnhancements: {},

  toggleCard: (cardImage: string, characterClass: string, maxHandSize: number) => {
    const state = get();
    let currentDeck = state.activeDeck;
    let currentClass = state.activeDeckClass;
    let currentEnhancements = state.activeEnhancements;

    // If playing a new class, clear out the existing hand silently
    if (currentClass !== characterClass) {
      currentDeck = [];
      currentEnhancements = {};
      currentClass = characterClass;
    }

    const isSelected = currentDeck.includes(cardImage);
    if (isSelected) {
      set({
        activeDeckClass: currentClass,
        activeDeck: currentDeck.filter((c) => c !== cardImage),
        activeEnhancements: currentEnhancements,
      });
    } else {
      if (currentDeck.length < maxHandSize) {
        set({
          activeDeckClass: currentClass,
          activeDeck: [...currentDeck, cardImage],
          activeEnhancements: currentEnhancements,
        });
      } else {
        try {
          get().setToastMessage(`Max hand size of ${maxHandSize} reached!`);
        } catch (e) { }
      }
    }
  },

  setDeck: (deck: string[]) => set({ activeDeck: deck }),

  addEnhancement: (id, action, index, enhancement) => {
    const state = get();
    const currentEnhancements = state.activeEnhancements;

    const key = `${id}_${action}_${index}`;
    const activeEnhancements = {
      ...currentEnhancements,
    };
    if (enhancement) {
      activeEnhancements[key] = enhancement;
    } else {
      delete activeEnhancements[key];
    }
    set({
      enhancingMode: null,
      activeEnhancements: activeEnhancements,
    })
  },

  getEnhancement: (id, action, index) => {
    const state = get();
    const key = `${id}_${action}_${index}`;
    return state.activeEnhancements[key] ?? null;
  },

  clearDeck: () => set({ activeDeck: [], activeEnhancements: {}, activeDeckClass: null }),

  viewActiveHand: false,
  toggleViewActiveHand: () => set((state) => ({ viewActiveHand: !state.viewActiveHand })),

  loadState: (deckClass, deck, enhancements) =>
    set({
      isCraftingMode: true,
      enhancingMode: null,
      activeDeckClass: deckClass,
      activeDeck: deck,
      activeEnhancements: enhancements,
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
