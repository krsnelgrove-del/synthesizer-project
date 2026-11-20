// app/stores/useSequencerStore.ts
import { create } from "zustand";

interface SequencerState {
    // Map of active steps keyed by "col-row", e.g. { "1-0": true, "4-12": true }
    activeSteps: Record<string, boolean>;
    toggleStep: (col: number, row: number) => void;
    isStepActive: (col: number, row: number) => boolean;
    clearGrid: () => void;
}

export const useSequencerStore = create<SequencerState>((set, get) => ({
    activeSteps: {},

    toggleStep: (col, row) => {
        const key = `${col}-${row}`;
        set((state) => {
            const nextSteps = { ...state.activeSteps };
            if (nextSteps[key]) {
                delete nextSteps[key];
            } else {
                nextSteps[key] = true;
            }
            
            return { activeSteps: nextSteps };
        });
    },

    isStepActive: (col, row) => {
        return !!get().activeSteps[`${col}-${row}`];
    },

    clearGrid: () => set({ activeSteps: {} }),
}));