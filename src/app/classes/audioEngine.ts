export class AudioEngine {

    private ctx: AudioContext | null = null;
    private masterGain: GainNode | null = null;
    private activeNotes = new Map<number, { osc: OscillatorNode; gain: GainNode; count: number }>();
    private waveformType: OscillatorType = "sine";

    private gain = 0.25;
    private attack = 0.01;
    private decay = 0.05;
    private sustain = 0.3;
    private release = 1;

    static #instance: AudioEngine | null = null;

    constructor() {
        if (AudioEngine.#instance) {
            throw new Error("Use Singleton.getInstance() instead of 'new'.");
        }

        AudioEngine.#instance = this;
    }

    static getInstance(): AudioEngine | null {
        if (!AudioEngine.#instance) {
            new AudioEngine();
        }
        return AudioEngine.#instance;
    }

    private initContext() {
        if (!this.ctx) {
            const win = window as unknown as {
                AudioContext?: typeof AudioContext;
                webkitAudioContext?: typeof AudioContext;
            };

            const AudioCtx = win.AudioContext || win.webkitAudioContext;
            if (AudioCtx) {
                this.ctx = new AudioCtx();
            }
        }

        if (!this.masterGain && this.ctx) {
                this.masterGain = this.ctx.createGain();
                this.masterGain.gain.value = this.gain; 
                this.masterGain.connect(this.ctx.destination);
        }
        
        if (this.ctx && this.ctx.state === "suspended") {
            this.ctx.resume();
        }
    }

    public getCurrentOscillatorWaveform(): OscillatorType {
        return this.waveformType;
    }

    public setOscillatorWaveform(waveformType: OscillatorType) {
        this.waveformType = waveformType;
    }

    public getADSRSetting(type: ADSRTypes): number {
        switch(type) {
            case ADSRTypes.attack:
                return this.attack;

            case ADSRTypes.decay:
                return this.decay;

            case ADSRTypes.release:
                return this.release;

            case ADSRTypes.sustain:
                return this.sustain;
        }
    }

    public SetADSRSettings(type: ADSRTypes, value: number) {
        switch(type) {
            case ADSRTypes.attack:
                this.attack = value;

            case ADSRTypes.decay:
                this.decay = value;

            case ADSRTypes.release:
                this.release = value;

            case ADSRTypes.sustain:
                this.sustain = value;
        }
    }


    public play(frequency: number) {
        this.initContext();
        if (!this.ctx) return;

        const entry = this.activeNotes.get(frequency);
        if (entry) {
            entry.count++;
            return;
        }

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);
        osc.type = this.waveformType;

        const attackDuration = Math.max(this.attack, 0.001);
        const peakTime = this.ctx.currentTime + attackDuration;
        gain.gain.linearRampToValueAtTime(1.0, peakTime);

        const decayDuration = Math.max(this.decay, 0.001);
        const sustainTime = peakTime + decayDuration;
        
        const targetSustain = Math.max(this.sustain, 0.0001);
        gain.gain.linearRampToValueAtTime(targetSustain, sustainTime);

        osc.connect(gain);
        gain.connect(this.masterGain!);
        osc.start();

        this.activeNotes.set(frequency, { osc, gain, count: 1 });
    }

    public stop(frequency: number) {
        const entry = this.activeNotes.get(frequency);
        if (!entry) return;

        entry.count--;

        if (entry.count <= 0) {
            const { osc, gain } = entry;
            if (this.ctx) {
                gain.gain.cancelScheduledValues(this.ctx.currentTime);
                gain.gain.setValueAtTime(gain.gain.value, this.ctx.currentTime);

                const releaseDuration = Math.max(this.release, 0.001);
                const releaseTime = this.ctx.currentTime + releaseDuration;
                gain.gain.linearRampToValueAtTime(0.0001, releaseTime);

                osc.stop(releaseTime);
                this.activeNotes.delete(frequency);
                

                osc.onended = () => {
                    osc.disconnect();
                    gain.disconnect();
                }
            }
        }
    }
}


export const audioEngine = AudioEngine.getInstance();
export enum ADSRTypes { attack, decay, sustain, release }