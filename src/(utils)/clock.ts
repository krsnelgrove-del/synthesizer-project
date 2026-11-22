import { useTransportStore } from "./transportStore";

type SynthTickCallback = (currentTime: number, tempo: number) => void;

export class MasterClock {
  private _audioContext: AudioContext | null = null;
  private animationFrameId: number | null = null;
  private isRunning: boolean = false;
  private tempo: number = 120;
  private callbacks: Set<SynthTickCallback> = new Set();
  private startTime: number = 0;
  private pausedAt: number = 0;

  public get audioContext(): AudioContext {
    if (!this._audioContext) {
      if (typeof window === 'undefined') {
        throw new Error("AudioContext cannot be initialized on the server side.");
      }
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this._audioContext = new AudioCtx();
    }
    return this._audioContext;
  }

  public set audioContext(ctx: AudioContext) {
    this._audioContext = ctx;
  }

  public registerSynth(callback: SynthTickCallback) {
    this.callbacks.add(callback);
    return () => this.callbacks.delete(callback);
  }

  public start() {
    if (this.isRunning) return;

    if (this._audioContext && this._audioContext.state === "suspended") {
      this._audioContext.resume();
    }

    this.isRunning = true;

    //anchor start time using high-res performance timer
    this.startTime = performance.now() / 1000 - this.pausedAt;

    const tick = () => {
      if (!this.isRunning) return;

      const now = performance.now() / 1000;
      let elapsedSeconds = now - this.startTime;

      const { bpm, amountOfBeats } = useTransportStore.getState();
      
      // Calculate loop limits (4 beats per bar)
      const beatsPerSecond = bpm / 60;
      const loopDurationSeconds = amountOfBeats / beatsPerSecond;

      //reset
      if (elapsedSeconds >= loopDurationSeconds) {
        this.startTime += loopDurationSeconds;
        elapsedSeconds = now - this.startTime;

      }

      useTransportStore.getState().updateTransportTime(elapsedSeconds);

      const audioTime = this._audioContext ? this._audioContext.currentTime : elapsedSeconds;
      this.callbacks.forEach((callback) => callback(audioTime, this.tempo));

      this.animationFrameId = requestAnimationFrame(tick);
    };

    this.animationFrameId = requestAnimationFrame(tick);
  }

  public stop() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (!this.isRunning) return;
    this.isRunning = false;

    const state = useTransportStore.getState();
    this.pausedAt = state.currentTime;
  }

  public reset() {
    this.stop();
    this.pausedAt = 0;
  }

  public setTempo(newTempo: number) {
    this.tempo = Math.max(40, Math.min(240, newTempo));
  }

  public getTempo(): number {
    return this.tempo;
  }
}

export const masterClock = new MasterClock();