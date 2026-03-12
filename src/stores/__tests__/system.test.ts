import { describe, it, expect, beforeEach } from "vitest";
import { useSystemStore } from "../system";

describe("useSystemStore", () => {
  beforeEach(() => {
    useSystemStore.setState({ stats: null });
  });

  it("has correct initial state", () => {
    expect(useSystemStore.getState().stats).toBeNull();
  });

  describe("update", () => {
    it("sets stats", () => {
      const stats = { cpu: 50, memory: 1024, uptime: 3600 } as any;
      useSystemStore.getState().update(stats);
      expect(useSystemStore.getState().stats).toEqual(stats);
    });

    it("replaces previous stats", () => {
      useSystemStore.getState().update({ cpu: 10 } as any);
      useSystemStore.getState().update({ cpu: 90 } as any);
      expect(useSystemStore.getState().stats).toEqual({ cpu: 90 });
    });

    it("can set complex stats objects", () => {
      const stats = {
        cpu: 75,
        memory: 2048,
        uptime: 7200,
        processes: [{ name: "brain", pid: 1 }],
      } as any;
      useSystemStore.getState().update(stats);
      expect(useSystemStore.getState().stats).toEqual(stats);
    });
  });
});
