import { create } from "zustand";
import { useSynthStore } from "./synthStore";
import { MidiNoteEvent } from "./midiEvents";
import { Notes } from "@/app/(const)/noteMap";

interface SequencerState {
    activeSteps: Record<string, MidiNoteEvent>; // Keyed by "col-row"
    toggleStep: (col: number, row: number, synthID: string) => void;
    isStepActive: (col: number, row: number) => boolean;
    clearGrid: (synthID: string) => void;
}

export const useSequencerStore = create<SequencerState>((set, get) => ({
    activeSteps: {},

    toggleStep: (col, row, synthID) => {
        const key = `${col}-${row}`;
        
        const noteMap = [...Notes].reverse();
        const targetNote = noteMap[row];
        if (!targetNote) return;

        set((state) => {
            const nextSteps = { ...state.activeSteps };

            if (nextSteps[key]) {
                delete nextSteps[key];
            } else {
                // col - 1 converts grid column 1-16 into 0-indexed beat positions (0 to 15)
                nextSteps[key] = {
                    midi: targetNote.midiID,
                    beat: col - 1, 
                    duration: 1, // 1 beat duration by default :( no resizing just yet
                };
            }

            // convert dictionary values back into an array for AudioEngine.setNotes()
            const noteArray = Object.values(nextSteps);
            const synth = useSynthStore.getState().getSynthById(synthID);
            synth?.setNotes(noteArray);

            return { activeSteps: nextSteps };
        });
    },

    isStepActive: (col, row) => {
        return !!get().activeSteps[`${col}-${row}`];
    },

    clearGrid: (synthID) => {
        const synth = useSynthStore.getState().getSynthById(synthID);
        synth?.setNotes([]);
        set({ activeSteps: {} });
    },
}));