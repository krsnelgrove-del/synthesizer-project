export enum PARAMETER_TYPE {

    Effect,
    ADSR,
    Other
}

export enum PARAMETER_LABEL {
    Attack = "Attack", 
    Decay = "Decay", 
    Sustain = "Sustain", 
    Release = "Release", 
    ReverbWet = "Reverb Wet", 
    DelayWet = "Delay Wet", 
    DelayTime = "Delay Time", 
    DistortionWet = "Distortion Wet", 
    DistortionDrive = "Distortion Drive"
}

export interface ParameterTargetRef {
    typeOfParameter: PARAMETER_TYPE;
    target: PARAMETER_LABEL;
}

export interface parameterObject {
    parameterName: string;
    parameterTarget: ParameterTargetRef;
    defaultValue: number;
    minValue?: number;
    maxValue?: number;
    step: number;
    unit: string;
}

export const synthParameters: parameterObject[] = [
    {
        parameterName: "Attack",
        parameterTarget: { 
            typeOfParameter: PARAMETER_TYPE.ADSR, 
            target: PARAMETER_LABEL.Attack 
        },
        defaultValue: 0.01,
        minValue: 0.001,
        maxValue: 2.0,
        step: 0.01,
        unit: "s",
    },
    {
        parameterName: "Decay",
        parameterTarget: { 
            typeOfParameter: PARAMETER_TYPE.ADSR, 
            target: PARAMETER_LABEL.Decay 
        },
        defaultValue: 0.05,
        minValue: 0.001,
        maxValue: 2.0,
        step: 0.01,
        unit: "s",
    },
    {
        parameterName: "Sustain",
        parameterTarget: { 
            typeOfParameter: PARAMETER_TYPE.ADSR, 
            target: PARAMETER_LABEL.Sustain 
        },
        defaultValue: 0.3,
        minValue: 0.0,
        maxValue: 1.0,
        step: 0.001,
        unit: "%",
    },
    {
        parameterName: "Release",
        parameterTarget: { 
            typeOfParameter: PARAMETER_TYPE.ADSR, 
            target: PARAMETER_LABEL.Release 
        },
        defaultValue: 1.0,
        minValue: 0.001,
        maxValue: 5.0,
        step: 0.01,
        unit: "s",
    },
    {
        parameterName: "Reverb Wet",
        parameterTarget: { 
            typeOfParameter: PARAMETER_TYPE.Effect, 
            target: PARAMETER_LABEL.ReverbWet 
        },
        defaultValue: 0.5,
        minValue: 0.0,
        maxValue: 1.0,
        step: 0.01,
        unit: "%",
    },
    {
        parameterName: "Delay Wet",
        parameterTarget: { 
            typeOfParameter: PARAMETER_TYPE.Effect, 
            target: PARAMETER_LABEL.DelayWet 
        },
        defaultValue: 0.4,
        minValue: 0.0,
        maxValue: 1.0,
        step: 0.01,
        unit: "%",
    },
    {
        parameterName: "Delay Time",
        parameterTarget: { 
            typeOfParameter: PARAMETER_TYPE.Effect, 
            target: PARAMETER_LABEL.DelayTime 
        },
        defaultValue: 0.5,
        minValue: 0.0,
        maxValue: 2.0,
        step: 0.01,
        unit: "s",
    },
    {
        parameterName: "Distortion Wet",
        parameterTarget: { 
            typeOfParameter: PARAMETER_TYPE.Effect, 
            target: PARAMETER_LABEL.DistortionWet 
        },
        defaultValue: 1.0,
        minValue: 0.0,
        maxValue: 1.0,
        step: 0.01,
        unit: "%",
    },
    {
        parameterName: "Distortion Drive",
        parameterTarget: { 
            typeOfParameter: PARAMETER_TYPE.Effect, 
            target: PARAMETER_LABEL.DistortionDrive 
        },
        defaultValue: 100.0,
        minValue: 1.0,
        maxValue: 200.0,
        step: 1.0,
        unit: "",
    },
];

export class AudioEngine {
    private ctx: AudioContext | null = null;
    private masterGain: GainNode | null = null;
    private dryGain: GainNode | null = null;
    private wetGain: GainNode | null = null;
    private reverbGain: GainNode | null = null;
    private delayGain: GainNode | null = null;
    private distortGain: GainNode | null = null;

    private convolverNode: ConvolverNode | null = null;
    private delayNode: DelayNode | null = null;
    private distortNode: WaveShaperNode | null = null;
    private eqNode: BiquadFilterNode | null = null;

    private activeNotes = new Map<number, { osc: OscillatorNode; gain: GainNode; count: number }>();
    private waveformType: OscillatorType = "sine";

    public delayTime: number = 0.5; // Default delay time in seconds
    public wetGainPercent: number = 0.3;
    public reverbWetPercent: number = 0.5;
    public delayWetPercent: number = 0.4;
    public distortWetPercentage: number = 1.0;
    public distortionDriveAmount: number = 100.0;

    public envelopeSettings = {
        gain: 0.25,
        attack: 0.01,
        decay: 0.05,
        sustain: 0.3,
        release: 1.0,
    };

    private convolverPath: string = "audio/impulses/reaper-irs/IRx1000_01B.wav";

    static #instance: AudioEngine | null = null;

    private listeners = new Set<() => void>();

    private cachedSnapshot = {
        attack: this.getSynthParameter(PARAMETER_LABEL.Attack),
        decay: this.getSynthParameter(PARAMETER_LABEL.Decay),
        sustain: this.getSynthParameter(PARAMETER_LABEL.Sustain),
        release: this.getSynthParameter(PARAMETER_LABEL.Release),
        reverbWet: this.getSynthParameter(PARAMETER_LABEL.ReverbWet),
        delayWet: this.getSynthParameter(PARAMETER_LABEL.DelayWet),
        delayTime: this.getSynthParameter(PARAMETER_LABEL.DelayTime),
        distortWet: this.getSynthParameter(PARAMETER_LABEL.DistortionWet),
        distortionDrive: this.getSynthParameter(PARAMETER_LABEL.DistortionDrive),
        waveform: this.waveformType,
    };

    private updateSnapshot() {
        this.cachedSnapshot = {
        attack: this.getSynthParameter(PARAMETER_LABEL.Attack),
        decay: this.getSynthParameter(PARAMETER_LABEL.Decay),
        sustain: this.getSynthParameter(PARAMETER_LABEL.Sustain),
        release: this.getSynthParameter(PARAMETER_LABEL.Release),
        reverbWet: this.getSynthParameter(PARAMETER_LABEL.ReverbWet),
        delayWet: this.getSynthParameter(PARAMETER_LABEL.DelayWet),
        delayTime: this.getSynthParameter(PARAMETER_LABEL.DelayTime),
        distortWet: this.getSynthParameter(PARAMETER_LABEL.DistortionWet),
        distortionDrive: this.getSynthParameter(PARAMETER_LABEL.DistortionDrive),
            waveform: this.waveformType,
        };
    }

    //protecting hyration and ssr
    public subscribe = (listener: () => void) => {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    };

    private notifyListeners() {
        this.updateSnapshot(); // Update cache reference before notifying React
        this.listeners.forEach((listener) => listener());
    }

    // 2. Return the stable cached reference
    public getSnapshot = () => {
        return this.cachedSnapshot;
    };

    constructor() {
        if (AudioEngine.#instance) {
            throw new Error("Use Singleton.getInstance() instead of 'new'.");
        }
        AudioEngine.#instance = this;
    }

    static getInstance(): AudioEngine {
        if (!AudioEngine.#instance) {
            new AudioEngine();
        }
        return AudioEngine.#instance!;
    }

    public async initContext() {
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

        if (this.ctx && !this.masterGain) {
            // 1. Master Output Bus -> Destination
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.value = this.envelopeSettings.gain;
            this.masterGain.connect(this.ctx.destination);

            // 2. Dry Signal Path
            this.dryGain = this.ctx.createGain();
            this.dryGain.gain.value = 1.0 - this.getSynthParameter(PARAMETER_LABEL.ReverbWet);
            this.dryGain.connect(this.masterGain);

            // 3. Wet Submix Bus
            this.wetGain = this.ctx.createGain();
            this.wetGain.gain.value = this.getSynthParameter(PARAMETER_LABEL.ReverbWet);
            this.wetGain.connect(this.masterGain);

            // 4. Reverb Chain (Convolver -> ReverbGain -> WetBus)
            this.convolverNode = this.ctx.createConvolver();
            this.loadNewConvolverImpulse(this.convolverPath);

            this.reverbGain = this.ctx.createGain();
            this.reverbGain.gain.value = this.reverbWetPercent;

            this.convolverNode.connect(this.reverbGain);
            this.reverbGain.connect(this.wetGain);

            // 5. Delay Chain (Delay -> DelayGain -> WetBus)
            this.delayNode = this.ctx.createDelay(5.0);
            this.delayNode.delayTime.value = this.getSynthParameter(PARAMETER_LABEL.DelayTime);

            this.delayGain = this.ctx.createGain();
            this.delayGain.gain.value = this.getSynthParameter(PARAMETER_LABEL.DelayWet);

            this.delayNode.connect(this.delayGain);
            this.delayGain.connect(this.wetGain);

            this.distortNode = this.ctx.createWaveShaper();
            this.distortNode.curve = this.createSoftDistortionCurve(this.getSynthParameter(PARAMETER_LABEL.DistortionDrive));
            this.distortNode.oversample = "2x";

            this.distortGain = this.ctx.createGain();
            this.distortGain.gain.value = this.getSynthParameter(PARAMETER_LABEL.DistortionWet);

            this.distortNode.connect(this.distortGain);
            this.distortGain.connect(this.wetGain);
            
        }

        if (this.ctx && this.ctx.state === "suspended") {
            await this.ctx.resume();
        }
    }

    public async loadNewConvolverImpulse(url: string) {
        if (!this.ctx || !this.convolverNode) return;
        try {
            const response = await fetch(url);
            const arrBuffer = await response.arrayBuffer();
            this.convolverNode.buffer = await this.ctx.decodeAudioData(arrBuffer);
        } catch (error) {
            console.error("Failed to load/decode convolver impulse: ", error);
        }
    }

    private createSoftDistortionCurve(driveAmount: number): Float32Array<ArrayBuffer> {
            const distortionFactor = typeof driveAmount === "number" ? driveAmount : 50;
            
            const curveResolution = this.ctx?.sampleRate ?? 44100;
            const distortionLookupTable = new Float32Array(curveResolution);
            
            const degreesToRadians = Math.PI / 180;

            for (let sampleIndex = 0; sampleIndex < curveResolution; sampleIndex++) {
                const inputSample = (sampleIndex * 2) / curveResolution - 1;
                
                const saturationNumerator = (3 + distortionFactor) * inputSample * 20 * degreesToRadians;
                const saturationDenominator = Math.PI + distortionFactor * Math.abs(inputSample);
                
                distortionLookupTable[sampleIndex] = saturationNumerator / saturationDenominator;
            }
            
            return distortionLookupTable;
        }

    public getCurrentOscillatorWaveform(): OscillatorType {
        return this.waveformType;
    }

    public setOscillatorWaveform(waveformType: OscillatorType) {
        this.waveformType = waveformType;
        this.notifyListeners();
    }

    public getSynthParameter(type: PARAMETER_LABEL): number {
        switch (type) {
            case PARAMETER_LABEL.Attack: return this.envelopeSettings.attack;
            case PARAMETER_LABEL.Decay: return this.envelopeSettings.decay;
            case PARAMETER_LABEL.Sustain: return this.envelopeSettings.sustain;
            case PARAMETER_LABEL.Release: return this.envelopeSettings.release;
            case PARAMETER_LABEL.ReverbWet: return this.reverbWetPercent;
            case PARAMETER_LABEL.DelayWet: return this.delayWetPercent;
            case PARAMETER_LABEL.DelayTime: return this.delayTime;
            case PARAMETER_LABEL.DistortionWet: return this.distortWetPercentage;
            case PARAMETER_LABEL.DistortionDrive: return this.distortionDriveAmount;
            default: return 0;
        }
    }

    public setSynthParameter(type: PARAMETER_LABEL, value: number) {
        switch (type) {
            case PARAMETER_LABEL.Attack:
                this.envelopeSettings.attack = value; break;
            case PARAMETER_LABEL.Decay:
                this.envelopeSettings.decay = value; break;
            case PARAMETER_LABEL.Sustain:
                this.envelopeSettings.sustain = value; break;
            case PARAMETER_LABEL.Release:
                this.envelopeSettings.release = value; break;

        case PARAMETER_LABEL.ReverbWet: 
            this.reverbWetPercent = value;
            if (this.reverbGain && this.ctx) {
                this.reverbGain.gain.setValueAtTime(value, this.ctx.currentTime);
            }
            break;
        case PARAMETER_LABEL.DelayWet: 
            this.delayWetPercent = value; 
            if (this.delayGain && this.ctx) {
                this.delayGain.gain.setValueAtTime(value, this.ctx.currentTime);
            }
            break;
        case PARAMETER_LABEL.DelayTime: 
            this.delayTime = value; 
            if (this.delayNode && this.ctx) {
                this.delayNode.delayTime.setValueAtTime(value, this.ctx.currentTime);
            }
            break;
        case PARAMETER_LABEL.DistortionWet: 
            this.distortWetPercentage = value; 
            if (this.distortGain && this.ctx) {
                this.distortGain.gain.setValueAtTime(value, this.ctx.currentTime);
            }
            break;
        case PARAMETER_LABEL.DistortionDrive: 
            this.distortionDriveAmount = value; 
            if (this.distortNode && this.ctx) {
                this.distortNode.curve = this.createSoftDistortionCurve(value);
            }
            break;
            default: return 0;
        }

        this.notifyListeners();
    }

    public play(frequency: number) {
        if (!this.ctx) {
            this.initContext().then(() => this.play(frequency));
            return;
        }

        const entry = this.activeNotes.get(frequency);
        if (entry) {
            entry.count++;
            return;
        }

        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();

        osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);
        osc.type = this.waveformType;

        osc.connect(noteGain);

        if (this.dryGain) noteGain.connect(this.dryGain);
        if (this.convolverNode) noteGain.connect(this.convolverNode);
        if (this.delayNode) noteGain.connect(this.delayNode);
        if (this.distortNode) noteGain.connect(this.distortNode);

        const now = this.ctx.currentTime;
        const attackDuration = Math.max(this.getSynthParameter(PARAMETER_LABEL.Attack), 0.001);
        const decayDuration = Math.max(this.getSynthParameter(PARAMETER_LABEL.Decay), 0.001);
        const targetSustain = Math.max(this.getSynthParameter(PARAMETER_LABEL.Sustain), 0.001);

        const peakTime = now + attackDuration;
        const sustainTime = peakTime + decayDuration;

        noteGain.gain.setValueAtTime(0.0001, now);
        noteGain.gain.linearRampToValueAtTime(1.0, peakTime ? peakTime : 0.001);
        noteGain.gain.linearRampToValueAtTime(targetSustain, sustainTime);

        osc.start(now);

        this.activeNotes.set(frequency, { osc, gain: noteGain, count: 1 });
    }

    public stop(frequency: number) {
        const entry = this.activeNotes.get(frequency);
        if (!entry) return;

        entry.count--;

        if (entry.count <= 0 && this.ctx) {
            const { osc, gain } = entry;
            const now = this.ctx.currentTime;

            gain.gain.cancelScheduledValues(now);
            gain.gain.setValueAtTime(Math.max(gain.gain.value, 0.0001), now);

            const releaseDuration = Math.max(this.getSynthParameter(PARAMETER_LABEL.Release), 0.001);
            const releaseTime = now + releaseDuration;
            
            gain.gain.exponentialRampToValueAtTime(0.0001, releaseTime);

            osc.stop(releaseTime + 0.05);
            this.activeNotes.delete(frequency);

            osc.onended = () => {
                osc.disconnect();
                gain.disconnect();
            };
        }
    }
}

export const audioEngine = AudioEngine.getInstance();