import { create } from 'zustand';
import { masterClock } from './clock';

export type TransportStateStatus = "stopped" | "playing" | "paused";

interface TransportStore {
  status: TransportStateStatus;
  isPlaying: boolean;
  isRecording: boolean;
  bpm: number;
  currentTime: number; // In seconds
  currentBeat: number; // Subdivided beat position
  amountOfBeats: number; // Number of beats in the sequencer loop
  audioContext: AudioContext | null;

  setStatus: (status: TransportStateStatus) => void;
  togglePlay: () => void;
  setBpm: (bpm: number) => void;
  setAmountOfBars: (bars: number) => void;
  resetTransport: () => void;
  updateTransportTime: (elapsedSeconds: number) => void;
}

export const useTransportStore = create<TransportStore>((set, get) => ({
  status: "stopped",
  isPlaying: false,
  isRecording: false,
  bpm: 100,
  currentTime: 0,
  currentBeat: 0,
  amountOfBeats: 4, 
  audioContext: null,

  setStatus: (status) => 
    set({ 
      status, 
      isPlaying: status === "playing" 
    }),

  togglePlay: () => 
    set((state) => {
      const nextPlaying = !state.isPlaying;
      if (!nextPlaying) {
        masterClock.stop();
      } else {
        masterClock.start();
      }
      return {
        status: nextPlaying ? "playing" : "stopped",
        isPlaying: nextPlaying,
      };
    }),

  setBpm: (newBpm) => {
    const clamped = Math.max(40, Math.min(240, newBpm));
    if (typeof window !== 'undefined') {
      masterClock.setTempo(clamped);
    }
    set({ bpm: clamped });
  },

  setAmountOfBars: (bars) => {
    const clampedBars = Math.max(1, Math.min(64, bars));
    set({ amountOfBeats: clampedBars });
  },

  resetTransport: () => {
    masterClock.reset();
    set({
      status: "stopped",
      isPlaying: false,
      isRecording: false,
      currentTime: 0,
      currentBeat: 0,
    });
  },

  updateTransportTime: (elapsedSeconds: number) => {
    const { bpm, amountOfBeats: beats } = get();
    
    // Beats per second = BPM / 60
    const beatsPerSecond = bpm / 60;
    const rawBeats = elapsedSeconds * beatsPerSecond;

    const totalMaxBeats = beats * (4*60);
    
    const currentBeat = rawBeats % totalMaxBeats;
    
    const currentTime = currentBeat / beatsPerSecond;

    set({ currentTime, currentBeat });
  },
}));

// client-side subscription to sync with MasterClock state changes
if (typeof window !== 'undefined') {
  useTransportStore.subscribe((state, prevState) => {
    if (state.isPlaying !== prevState.isPlaying) {
      if (state.isPlaying) {
        masterClock.start();
      } else {
        masterClock.stop();
      }
    }
  });
}