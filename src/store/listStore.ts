import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface List {
  id: string;
  name: string;
  items: string[];
}

interface ListStore {
  lists: List[];
  addList: (name: string) => void;
  updateList: (id: string, updates: Partial<List>) => void;
  removeList: (id: string) => void;
}

export const useListStore = create<ListStore>()(
  persist(
    (set) => ({
      lists: [],
      addList: (name) =>
        set((state) => ({
          lists: [...state.lists, { id: crypto.randomUUID(), name, items: [] }],
        })),
      updateList: (id, updates) =>
        set((state) => ({
          lists: state.lists.map((list) =>
            list.id === id ? { ...list, ...updates } : list
          ),
        })),
      removeList: (id) =>
        set((state) => ({
          lists: state.lists.filter((list) => list.id !== id),
        })),
    }),
    {
      name: "class-board-lists",
    }
  )
);
