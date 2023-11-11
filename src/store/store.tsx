import { create } from "zustand";

export interface Card {
  id: number;
  text: string;
  open: boolean;
}
interface Tag {
  name: string;
  category: string;
  value: number;
  id: string;
}

type Store = {
  cards: Card[];
  newCard: string;
  setCards: (cards: Card[]) => void;
  addCard: () => void;
  updateCard: (id: number, text: string) => void;
  removeCard: (id: number) => void;
  setNewCard: (newInput: string) => void;
  toggleCard: (id: number) => void;
};

const updateCard = (cards: Card[], id: number, text: string): Card[] =>
  cards.map((card) => ({
    ...card,
    text: card.id === id ? text : card.text,
  }));

const removeCard = (cards: Card[], id: number): Card[] =>
  cards.filter((card) => card.id !== id);

const addCard = (cards: Card[], text: string): Card[] => [
  ...cards,
  {
    id: Math.max(0, ...cards.map(({ id }) => id)) + 1,
    text,
    open: false,
  },
];

const toggleCard = (cards: Card[], id: number): Card[] =>
  cards.map((card) => ({
    ...card,
    open: card.id === id ? !card.open : card.open,
  }));

const useStore = create<Store>((set) => ({
  cards: [],
  tags: [],
  newCard: "",
  setCards: (cards) => set({ cards }),
  removeCard: (id) => set((state) => ({ cards: removeCard(state.cards, id) })),
  updateCard: (id, text) =>
    set((state) => ({ cards: updateCard(state.cards, id, text) })),
  setNewCard: (newCard) => set({ newCard }),
  toggleCard: (id) => set((state) => ({ cards: toggleCard(state.cards, id) })),
  addCard: () =>
    set((state) => ({
      cards: addCard(state.cards, state.newCard),
      newCard: "",
    })),
}));

export default useStore;
