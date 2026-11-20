// (utils)/clock.ts

// Type definition for synth tick callback
type SynthTickCallback = (currentTime: number, tempo: number) => void;

export class MasterClock {
  private _audioContext: AudioContext | null = null;
  private timerId: number | null = null;
  private isRunning: boolean = false;
  private tempo: number = 120; // Default BPM
  private callbacks: Set<SynthTickCallback> = new Set();

  constructor() {
    // Leave constructor clean to prevent SSR module-evaluation crashes
  }

  // Safe getter property: instantiates AudioContext lazily only when first accessed on the client side
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
    this.isRunning = true;

    // Convert BPM to interval (16th notes or tick rate)
    // 60 seconds / BPM / 4 (for 16th notes) * 1000ms
    const intervalMs = (60 / this.tempo / 4) * 1000;

    let lastTime = performance.now();

    const tick = () => {
      if (!this.isRunning) return;

      const currentTime = this.audioContext.currentTime;
      
      // Notify all registered synths/components
      this.callbacks.forEach((cb) => cb(currentTime, this.tempo));

      lastTime = performance.now();
      this.timerId = window.setTimeout(tick, intervalMs);
    };

    this.timerId = window.setTimeout(tick, intervalMs);
  }

  public stop() {
    if (!this.isRunning) return;
    this.isRunning = false;
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  public setTempo(newTempo: number) {
    this.tempo = Math.max(40, Math.min(240, newTempo));
  }

  public getTempo(): number {
    return this.tempo;
  }
}

export const masterClock = new MasterClock();