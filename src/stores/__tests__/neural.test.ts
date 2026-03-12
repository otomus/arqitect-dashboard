import { describe, it, expect, beforeEach } from "vitest";
import { useNeuralStore } from "../neural";

const initialState = {
  nerves: [],
  events: [],
  activeNerve: null,
  selectedNerve: null,
  selectedNerveDetails: null,
  detailsLoading: false,
  brainState: "idle" as const,
  dreamStage: null,
  dreamNerve: null,
  dreamMessage: null,
};

describe("useNeuralStore", () => {
  beforeEach(() => {
    useNeuralStore.setState(initialState);
  });

  it("has correct initial state", () => {
    const state = useNeuralStore.getState();
    expect(state.nerves).toEqual([]);
    expect(state.events).toEqual([]);
    expect(state.activeNerve).toBeNull();
    expect(state.selectedNerve).toBeNull();
    expect(state.selectedNerveDetails).toBeNull();
    expect(state.detailsLoading).toBe(false);
    expect(state.brainState).toBe("idle");
    expect(state.dreamStage).toBeNull();
    expect(state.dreamNerve).toBeNull();
    expect(state.dreamMessage).toBeNull();
  });

  describe("updateNerves", () => {
    it("sets nerves array", () => {
      const nerves = [{ name: "vision", status: "active" }] as any;
      useNeuralStore.getState().updateNerves(nerves);
      expect(useNeuralStore.getState().nerves).toEqual(nerves);
    });

    it("replaces existing nerves", () => {
      useNeuralStore.getState().updateNerves([{ name: "a" }] as any);
      useNeuralStore.getState().updateNerves([{ name: "b" }] as any);
      expect(useNeuralStore.getState().nerves).toEqual([{ name: "b" }]);
    });

    it("can set to empty array", () => {
      useNeuralStore.getState().updateNerves([{ name: "a" }] as any);
      useNeuralStore.getState().updateNerves([]);
      expect(useNeuralStore.getState().nerves).toEqual([]);
    });
  });

  describe("addEvent", () => {
    it("appends an event with id and timestamp", () => {
      useNeuralStore.getState().addEvent({ type: "thought" });
      const events = useNeuralStore.getState().events;
      expect(events).toHaveLength(1);
      expect(events[0].type).toBe("thought");
      expect(events[0].id).toMatch(/^evt-\d+$/);
      expect(events[0].timestamp).toBeGreaterThan(0);
    });

    it("preserves optional nerve and stage fields", () => {
      useNeuralStore
        .getState()
        .addEvent({ type: "action", nerve: "vision", stage: "processing" });
      const event = useNeuralStore.getState().events[0];
      expect(event.nerve).toBe("vision");
      expect(event.stage).toBe("processing");
    });

    it("caps events at 101 (slices to last 100 then appends 1)", () => {
      const existing = Array.from({ length: 100 }, (_, i) => ({
        id: `existing-${i}`,
        type: "thought" as const,
        timestamp: Date.now(),
      }));
      useNeuralStore.setState({ events: existing });

      useNeuralStore.getState().addEvent({ type: "result" });
      const events = useNeuralStore.getState().events;
      expect(events).toHaveLength(101);
      expect(events[100].type).toBe("result");
    });

    it("trims when exceeding 100 before appending", () => {
      const existing = Array.from({ length: 150 }, (_, i) => ({
        id: `existing-${i}`,
        type: "thought" as const,
        timestamp: i,
      }));
      useNeuralStore.setState({ events: existing });

      useNeuralStore.getState().addEvent({ type: "response" });
      const events = useNeuralStore.getState().events;
      // slice(-100) of 150 = 100, then append 1 = 101
      expect(events).toHaveLength(101);
      expect(events[0].id).toBe("existing-50");
      expect(events[100].type).toBe("response");
    });

    it("generates unique IDs", () => {
      useNeuralStore.getState().addEvent({ type: "thought" });
      useNeuralStore.getState().addEvent({ type: "action" });
      const events = useNeuralStore.getState().events;
      expect(events[0].id).not.toBe(events[1].id);
    });
  });

  describe("setActiveNerve", () => {
    it("sets activeNerve", () => {
      useNeuralStore.getState().setActiveNerve("vision");
      expect(useNeuralStore.getState().activeNerve).toBe("vision");
    });

    it("clears activeNerve with null", () => {
      useNeuralStore.getState().setActiveNerve("vision");
      useNeuralStore.getState().setActiveNerve(null);
      expect(useNeuralStore.getState().activeNerve).toBeNull();
    });
  });

  describe("setSelectedNerve", () => {
    it("sets selectedNerve", () => {
      useNeuralStore.getState().setSelectedNerve("hearing");
      expect(useNeuralStore.getState().selectedNerve).toBe("hearing");
    });

    it("clears selectedNerve with null", () => {
      useNeuralStore.getState().setSelectedNerve("hearing");
      useNeuralStore.getState().setSelectedNerve(null);
      expect(useNeuralStore.getState().selectedNerve).toBeNull();
    });
  });

  describe("setSelectedNerveDetails", () => {
    it("sets selectedNerveDetails", () => {
      const details = { name: "vision", config: {} } as any;
      useNeuralStore.getState().setSelectedNerveDetails(details);
      expect(useNeuralStore.getState().selectedNerveDetails).toEqual(details);
    });

    it("clears with null", () => {
      useNeuralStore
        .getState()
        .setSelectedNerveDetails({ name: "x" } as any);
      useNeuralStore.getState().setSelectedNerveDetails(null);
      expect(useNeuralStore.getState().selectedNerveDetails).toBeNull();
    });
  });

  describe("setDetailsLoading", () => {
    it("sets detailsLoading to true", () => {
      useNeuralStore.getState().setDetailsLoading(true);
      expect(useNeuralStore.getState().detailsLoading).toBe(true);
    });

    it("sets detailsLoading to false", () => {
      useNeuralStore.setState({ detailsLoading: true });
      useNeuralStore.getState().setDetailsLoading(false);
      expect(useNeuralStore.getState().detailsLoading).toBe(false);
    });
  });

  describe("setBrainState", () => {
    it("sets brainState to each valid value", () => {
      const states = ["idle", "thinking", "acting", "responding"] as const;
      for (const s of states) {
        useNeuralStore.getState().setBrainState(s);
        expect(useNeuralStore.getState().brainState).toBe(s);
      }
    });
  });

  describe("setDream", () => {
    it("sets dreamStage", () => {
      useNeuralStore.getState().setDream("qualifying");
      const state = useNeuralStore.getState();
      expect(state.dreamStage).toBe("qualifying");
      expect(state.dreamNerve).toBeNull();
      expect(state.dreamMessage).toBeNull();
    });

    it("sets dreamStage with nerve and message", () => {
      useNeuralStore.getState().setDream("reconciling", "memory", "processing");
      const state = useNeuralStore.getState();
      expect(state.dreamStage).toBe("reconciling");
      expect(state.dreamNerve).toBe("memory");
      expect(state.dreamMessage).toBe("processing");
    });

    it("defaults nerve and message to null when not provided", () => {
      useNeuralStore
        .getState()
        .setDream("finetuning", "nerve1", "msg1");
      useNeuralStore.getState().setDream("pruning");
      const state = useNeuralStore.getState();
      expect(state.dreamStage).toBe("pruning");
      expect(state.dreamNerve).toBeNull();
      expect(state.dreamMessage).toBeNull();
    });

    it("clears dream with null stage", () => {
      useNeuralStore
        .getState()
        .setDream("qualifying", "nerve", "msg");
      useNeuralStore.getState().setDream(null);
      const state = useNeuralStore.getState();
      expect(state.dreamStage).toBeNull();
      expect(state.dreamNerve).toBeNull();
      expect(state.dreamMessage).toBeNull();
    });

    it("supports all dream stages", () => {
      const stages = [
        "qualifying",
        "qualified",
        "qualification_failed",
        "reconciling",
        "pruning",
        "finetuning",
        "personality_reflection",
      ] as const;
      for (const stage of stages) {
        useNeuralStore.getState().setDream(stage);
        expect(useNeuralStore.getState().dreamStage).toBe(stage);
      }
    });
  });
});
