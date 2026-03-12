import { describe, it, expect, beforeEach } from "vitest";
import { useMemoryStore } from "../memory";

const initialState = {
  session: {},
  conversation: [],
  episodes: [],
  facts: [],
};

describe("useMemoryStore", () => {
  beforeEach(() => {
    useMemoryStore.setState(initialState);
  });

  it("has correct initial state", () => {
    const state = useMemoryStore.getState();
    expect(state.session).toEqual({});
    expect(state.conversation).toEqual([]);
    expect(state.episodes).toEqual([]);
    expect(state.facts).toEqual([]);
  });

  describe("update", () => {
    it("sets all fields from data", () => {
      const data = {
        session: { user: "alice" },
        conversation: [{ role: "user", content: "hi" }],
        episodes: [{ task: "greet", nerve: "chat", success: true }],
        facts: [{ key: "name", value: "Alice" }],
      } as any;

      useMemoryStore.getState().update(data);
      const state = useMemoryStore.getState();
      expect(state.session).toEqual({ user: "alice" });
      expect(state.conversation).toEqual([{ role: "user", content: "hi" }]);
      expect(state.episodes).toEqual([
        { task: "greet", nerve: "chat", success: true },
      ]);
      expect(state.facts).toEqual([{ key: "name", value: "Alice" }]);
    });

    it("defaults missing fields to empty object/array", () => {
      useMemoryStore.getState().update({} as any);
      const state = useMemoryStore.getState();
      expect(state.session).toEqual({});
      expect(state.conversation).toEqual([]);
      expect(state.episodes).toEqual([]);
      expect(state.facts).toEqual([]);
    });

    it("handles null fields via nullish coalescing", () => {
      useMemoryStore.getState().update({
        session: null,
        conversation: null,
        episodes: null,
        facts: null,
      } as any);
      const state = useMemoryStore.getState();
      expect(state.session).toEqual({});
      expect(state.conversation).toEqual([]);
      expect(state.episodes).toEqual([]);
      expect(state.facts).toEqual([]);
    });

    it("replaces previous state entirely", () => {
      useMemoryStore.getState().update({
        session: { a: "1" },
        conversation: [{ role: "user", content: "hi" }],
        episodes: [],
        facts: [],
      } as any);

      useMemoryStore.getState().update({
        session: { b: "2" },
        conversation: [],
        episodes: [{ task: "t", nerve: "n", success: false }],
        facts: [],
      } as any);

      const state = useMemoryStore.getState();
      expect(state.session).toEqual({ b: "2" });
      expect(state.conversation).toEqual([]);
      expect(state.episodes).toEqual([
        { task: "t", nerve: "n", success: false },
      ]);
    });

    it("handles undefined fields via nullish coalescing", () => {
      useMemoryStore.getState().update({
        session: undefined,
        conversation: undefined,
        episodes: undefined,
        facts: undefined,
      } as any);
      const state = useMemoryStore.getState();
      expect(state.session).toEqual({});
      expect(state.conversation).toEqual([]);
      expect(state.episodes).toEqual([]);
      expect(state.facts).toEqual([]);
    });
  });
});
