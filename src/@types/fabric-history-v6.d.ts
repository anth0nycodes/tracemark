declare module "fabric-history-v6" {
  interface HistoryMethods {
    /**
     * Initialize history functionality
     */
    _historyInit(): void;
    _historyDispose(): void;
    /**
     * Undo the last action
     */
    undo(cb?: () => void): void;
    /**
     * Redo the last undone action
     */
    redo(cb?: () => void): void;
    /**
     * Save initial state during initialization
     */
    saveInitialState(): void;
    /**
     * Clear all undo and redo history
     */
    clearHistory(): void;
    /**
     * Enable history recording
     */
    onHistory(): void;
    /**
     * Disable history recording
     */
    offHistory(): void;
    /**
     * Check if there are actions that can be undone
     */
    canUndo(): boolean;
    /**
     * Check if there are actions that can be redone
     */
    canRedo(): boolean;
  }

  export function HistoryMixin<T>(
    Base: new (...args: any[]) => T
  ): new (...args: any[]) => HistoryMethods & T;
}
