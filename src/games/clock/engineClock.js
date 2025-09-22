export function useEngineClock() {
  return {
    throws: [],
    onThrow: () => {},
    onUndo: () => {},
    scoreView: { current: 0, start: 0 },
  };
}
