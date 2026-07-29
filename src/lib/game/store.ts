import { useSyncExternalStore } from "react";

export type GameState = {
  nickname: string;
  myPicks: string[];             // selected card ids
  friends: { name: string; picks: string[] }[];
  hatched: boolean;
  unlockedCharacterId: string | null;
};

const KEY = "anima-hatch-state-v1";

const defaultState: GameState = {
  nickname: "",
  myPicks: [],
  friends: [],
  hatched: false,
  unlockedCharacterId: null,
};

let state: GameState = load();
const listeners = new Set<() => void>();

function load(): GameState {
  if (typeof window === "undefined") return defaultState;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultState;
    return { ...defaultState, ...JSON.parse(raw) };
  } catch {
    return defaultState;
  }
}
function save() {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* noop */ }
}
function emit() { listeners.forEach((l) => l()); }

export function setState(patch: Partial<GameState>) {
  state = { ...state, ...patch };
  save();
  emit();
}
export function resetState() {
  state = { ...defaultState };
  save();
  emit();
}
export function getState() { return state; }

export function useGame(): GameState {
  return useSyncExternalStore(
    (l) => { listeners.add(l); return () => listeners.delete(l); },
    () => state,
    () => defaultState,
  );
}
