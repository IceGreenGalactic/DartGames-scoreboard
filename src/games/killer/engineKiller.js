export function useEngineKiller() {
  return {
    throws: [],
    onThrow: () => {},
    onUndo: () => {},
    scoreView: { current: 0, start: 0 },
  };
}
