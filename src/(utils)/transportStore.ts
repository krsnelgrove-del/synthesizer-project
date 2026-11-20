// (utils)/transportStore.ts
import { create } from 'zustand';
import { masterClock } from './clock';

export type TransportStateStatus = "stopped" | "playing" | "paused";

interface TransportStore {
  status: TransportStateStatus;
  isPlaying: boolean;
  isRecording: boolean;
  bpm: number;
  currentTime: number;
  currentBeat: number;
  audioContext: AudioContext | null;

  
  setStatus: (status: TransportStateStatus) => void;
  togglePlay: () => void;
  setBpm: (bpm: number) => void;
  resetTransport: () => void;
}

export const useTransportStore = create<TransportStore>((set) => ({
  status: "stopped",
  isPlaying: false,
  isRecording: false,
  bpm: 100,
  currentTime: 0,
  currentBeat: 0,
  audioContext: null,

  setStatus: (status) => 
    set({ 
      status, 
      isPlaying: status === "playing" 
    }),

  togglePlay: () => 
    set((state) => {
      const nextPlaying = !state.isPlaying;
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

  resetTransport: () =>
    set({
      status: "stopped",
      isPlaying: false,
      isRecording: false,
      bpm: 100,
      currentTime: 0,
      currentBeat: 0,
    }),
}));

// Client-side side-effect subscription to sync with MasterClock
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