import { describe, it, expect, beforeEach } from "vitest";
import { useConnectionStore } from "../connection";

const initialState = {
  status: "connecting" as const,
  reconnectAttempt: 0,
};

describe("useConnectionStore", () => {
  beforeEach(() => {
    useConnectionStore.setState(initialState);
  });

  it("has correct initial state", () => {
    const state = useConnectionStore.getState();
    expect(state.status).toBe("connecting");
    expect(state.reconnectAttempt).toBe(0);
  });

  describe("setOnline", () => {
    it("sets status to online and resets reconnectAttempt", () => {
      useConnectionStore.setState({ status: "offline", reconnectAttempt: 5 });
      useConnectionStore.getState().setOnline();
      const state = useConnectionStore.getState();
      expect(state.status).toBe("online");
      expect(state.reconnectAttempt).toBe(0);
    });

    it("resets reconnectAttempt even from connecting state", () => {
      useConnectionStore.getState().setOnline();
      const state = useConnectionStore.getState();
      expect(state.status).toBe("online");
      expect(state.reconnectAttempt).toBe(0);
    });
  });

  describe("setOffline", () => {
    it("sets status to offline", () => {
      useConnectionStore.setState({ status: "online" });
      useConnectionStore.getState().setOffline();
      expect(useConnectionStore.getState().status).toBe("offline");
    });

    it("does not reset reconnectAttempt", () => {
      useConnectionStore.setState({ reconnectAttempt: 3 });
      useConnectionStore.getState().setOffline();
      const state = useConnectionStore.getState();
      expect(state.status).toBe("offline");
      expect(state.reconnectAttempt).toBe(3);
    });
  });

  describe("setReconnecting", () => {
    it("sets status to offline and reconnectAttempt to the given value", () => {
      useConnectionStore.getState().setReconnecting(1);
      const state = useConnectionStore.getState();
      expect(state.status).toBe("offline");
      expect(state.reconnectAttempt).toBe(1);
    });

    it("updates reconnectAttempt on successive calls", () => {
      useConnectionStore.getState().setReconnecting(1);
      useConnectionStore.getState().setReconnecting(2);
      useConnectionStore.getState().setReconnecting(3);
      expect(useConnectionStore.getState().reconnectAttempt).toBe(3);
    });

    it("works with attempt 0", () => {
      useConnectionStore.getState().setReconnecting(0);
      expect(useConnectionStore.getState().reconnectAttempt).toBe(0);
      expect(useConnectionStore.getState().status).toBe("offline");
    });
  });

  describe("setKilled", () => {
    it("sets status to killed", () => {
      useConnectionStore.getState().setKilled();
      expect(useConnectionStore.getState().status).toBe("killed");
    });

    it("sets status to killed from any previous state", () => {
      useConnectionStore.setState({ status: "online" });
      useConnectionStore.getState().setKilled();
      expect(useConnectionStore.getState().status).toBe("killed");
    });
  });
});
