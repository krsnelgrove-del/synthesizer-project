// (utils)/synthStore.ts
import { create } from 'zustand';
import { AudioEngine } from '@/app/classes/audioEngine';

interface SynthStoreState {
  // Dictionary/Map: { [synthId]: AudioEngine }
  synths: Record<string, AudioEngine>;
  
  initializeEngine: (id: string) => void;
  destroyEngine: (id: string) => void;
  getSynthById: (id: string) => AudioEngine | undefined;
}

export const useSynthStore = create<SynthStoreState>((set, get) => ({
  synths: {},

  initializeEngine: (id) => {
    if (typeof window !== 'undefined') {
      const existing = get().synths [id];
        if (existing) {
            console.warn(`Synth with ID "${id}" already exists. Skipping init.`);
            // console.log("Synths initialized: ", get().synths);
            return;
        }

      const synth = new AudioEngine(id);
      synth.initSynth();
      
      // merge existing
      set((state) => ({
        synths: {
          ...state.synths,
          [id]: synth,
        },
      }));
      
      console.log(`Synth initialized and stored with ID: "${id}"`);
    }
  },

  destroyEngine: (id) => {
    const targetSynth = get().synths[id];
    
    if (targetSynth) {
      targetSynth.destroy();
      
      set((state) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [id]: removed, ...rest } = state.synths;
        return { synths: rest };
      });
      
      console.log(`Synth with ID "${id}" destroyed and removed from store.`);
    }
  },

  getSynthById: (id) => {
    return get().synths[id];
  },
}));