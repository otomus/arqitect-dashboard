import { describe, it, expect, beforeEach } from "vitest";
import { useSystemStore } from "../system";
import type { SystemStats } from "@otomus/sentient-sdk";

function makeStats(data: Record<string, unknown>): SystemStats {
  return data as unknown as SystemStats;
}

describe("useSystemStore", () => {
  beforeEach(() => {
    useSystemStore.setState({ stats: null });
  });

  it("has correct initial state", () => {
    expect(useSystemStore.getState().stats).toBeNull();
  });

  describe("update", () => {
    it("sets stats", () => {
      const stats = makeStats({ cpu: 50, memory: 1024, uptime: 3600 });
      useSystemStore.getState().update(stats);
      expect(useSystemStore.getState().stats).toEqual(stats);
    });

    it("replaces previous stats", () => {
      useSystemStore.getState().update(makeStats({ cpu: 10 }));
      useSystemStore.getState().update(makeStats({ cpu: 90 }));
      expect(useSystemStore.getState().stats).toEqual({ cpu: 90 });
    });

    it("can set complex stats objects", () => {
      const stats = makeStats({
        cpu: 75,
        memory: 2048,
        uptime: 7200,
        processes: [{ name: "brain", pid: 1 }],
      });
      useSystemStore.getState().update(stats);
      expect(useSystemStore.getState().stats).toEqual(stats);
    });
  });
});
