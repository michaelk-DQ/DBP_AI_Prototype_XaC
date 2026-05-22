import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import type { KnowledgeDomain } from "../types/knowledge";

export interface SavedItem {
  domain: KnowledgeDomain;
  slug: string;
  title: string;
  description: string;
  tags: string[];
  savedAt: number;
}

interface SavedItemsState {
  items: SavedItem[];
  addItem: (item: Omit<SavedItem, "savedAt">) => void;
  removeItem: (domain: KnowledgeDomain, slug: string) => void;
  toggleItem: (item: Omit<SavedItem, "savedAt">) => void;
  isSaved: (domain: KnowledgeDomain, slug: string) => boolean;
}

const INITIAL_SAVED: SavedItem[] = [
  {
    domain: "service",
    slug: "facilitate-communication-with-strategic-stakeholders",
    title: "Facilitate Communication With Strategic Stakeholders",
    description:
      "Supports SMEs in establishing connections with key industry and government stakeholders.",
    tags: ["support services", "networking", "launch"],
    savedAt: Date.now() - 86400000,
  },
  {
    domain: "event",
    slug: "abu-dhabi-sme-innovation-forum-2026",
    title: "Abu Dhabi SME Innovation Forum 2026",
    description:
      "Flagship gathering for founders, technology leaders, and policymakers in the UAE ecosystem.",
    tags: ["forum", "innovation", "networking"],
    savedAt: Date.now() - 43200000,
  },
  {
    domain: "course",
    slug: "sme-digital-cybersecurity-fundamentals",
    title: "SME Digital Cybersecurity Fundamentals",
    description:
      "Foundational cybersecurity knowledge for SME owners and managers.",
    tags: ["cybersecurity", "technology", "launch"],
    savedAt: Date.now() - 21600000,
  },
];

export const useSavedItemsStore = create<SavedItemsState>((set, get) => ({
  items: INITIAL_SAVED,

  addItem: (item) => {
    if (get().isSaved(item.domain, item.slug)) return;
    set((state) => ({
      items: [{ ...item, savedAt: Date.now() }, ...state.items],
    }));
  },

  removeItem: (domain, slug) => {
    set((state) => ({
      items: state.items.filter(
        (i) => !(i.domain === domain && i.slug === slug)
      ),
    }));
  },

  toggleItem: (item) => {
    if (get().isSaved(item.domain, item.slug)) {
      get().removeItem(item.domain, item.slug);
    } else {
      get().addItem(item);
    }
  },

  isSaved: (domain, slug) =>
    get().items.some((i) => i.domain === domain && i.slug === slug),
}));

/** Stable selector — avoids new function reference per render. */
export function useSavedItemsByDomain(domain: KnowledgeDomain): SavedItem[] {
  return useSavedItemsStore(
    useShallow((state) => state.items.filter((i) => i.domain === domain))
  );
}
