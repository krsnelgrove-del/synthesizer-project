import { masterClock } from "@/(utils)/clock";
import { useTransportStore } from "@/(utils)/transportStore";
import { PARAMETER_TYPE, PARAMETER_LABEL, ParameterObject } from "@/(utils)/synthParameterUtils";
import { MidiNoteEvent } from "@/(utils)/midiEvents";
import { midiToFreq } from "@/(utils)/midiHelpers";
import { DistortionTool } from "./distortionTool";

export const synthParameters: ParameterObject[] = [
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
    private id: string;
    private unsubscribeFromClock: () => void;
    private notes: MidiNoteEvent[] = [];        //store sequence if any
    private scheduledIndices = new Set<number>(); //stops double notes

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

    public delayTime: number = 0.5;
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

    constructor(id: string, initialNotes: MidiNoteEvent[] = []) {
        this.id = id;
        this.notes = initialNotes;

        // Change parameter name from lookaheadHorizon to tempo (or ignore it)
        this.unsubscribeFromClock = masterClock.registerSynth((_, tempo) => {
            this.scheduleNotes();
        });

        if (typeof window !== 'undefined') {
            useTransportStore.subscribe((state, prevState) => {
                if (prevState.isPlaying && !state.isPlaying) {
                    this.stopAllVoices();
                    this.scheduledIndices.clear();
                }
                
                if (state.currentBeat < prevState.currentBeat || state.currentTime === 0) {
                    this.scheduledIndices.clear();
                }
            });
        }
    }

    public setNotes(notes: MidiNoteEvent[]) {
        this.notes = notes;
        this.scheduledIndices.clear();
  }

    public resetPlaybackState() {
        this.scheduledIndices.clear();
  }

    //protecting hyration and ssr
    public subscribe = (listener: () => void) => {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    };

    private notifyListeners() {
        this.updateSnapshot(); // Update cache reference before notifying
        this.listeners.forEach((listener) => listener());
    }

    // 2. Return the stable cached reference
    public getSnapshot = () => {
        return this.cachedSnapshot;
    };

    public getAudioContext(): AudioContext {
        return masterClock.audioContext;
    }

    private scheduleNotes() {
        const transport = useTransportStore.getState();
        const ctx = this.getAudioContext();
        const secondsPerBeat = 60 / transport.bpm;

        const lookaheadWindow = 0.1;
        const horizon = ctx.currentTime + lookaheadWindow;

        this.notes.forEach((note, index) => {
            if (this.scheduledIndices.has(index)) return;

            const noteStartSec = note.beat * secondsPerBeat;
            const exactHardwareTime = ctx.currentTime + (noteStartSec - transport.currentTime);

            const tolerance = 0.05;

            if (exactHardwareTime >= (ctx.currentTime - tolerance) && exactHardwareTime < horizon) {
                const safeTriggerTime = Math.max(exactHardwareTime, ctx.currentTime);
                const gateDurationSec = 0.8 * secondsPerBeat; 

                this.play(note.midi, safeTriggerTime, gateDurationSec);
                this.scheduledIndices.add(index);

                console.log(`Successfully scheduled note index ${index} at beat ${note.beat} for time ${exactHardwareTime}`);
            }
        });
    }

    public destroy() {
        this.unsubscribeFromClock();
    }


    public async initSynth() {
        const ctx = this.getAudioContext();

        if (!this.masterGain) {
            // 1. Master Output Bus -> Destination
            this.masterGain = ctx.createGain();
            this.masterGain.gain.value = this.envelopeSettings.gain;
            this.masterGain.connect(ctx.destination);

            // 2. Dry Signal Path
            this.dryGain = ctx.createGain();
            this.dryGain.gain.value = 1.0 - this.getSynthParameter(PARAMETER_LABEL.ReverbWet);
            this.dryGain.connect(this.masterGain);

            // 3. Wet Submix Bus
            this.wetGain = ctx.createGain();
            this.wetGain.gain.value = this.getSynthParameter(PARAMETER_LABEL.ReverbWet);
            this.wetGain.connect(this.masterGain);

            // 4. Reverb Chain (Convolver -> ReverbGain -> WetBus)
            this.convolverNode = ctx.createConvolver();
            this.loadNewConvolverImpulse(this.convolverPath);

            this.reverbGain = ctx.createGain();
            this.reverbGain.gain.value = this.reverbWetPercent;

            this.convolverNode.connect(this.reverbGain);
            this.reverbGain.connect(this.wetGain);

            // 5. Delay Chain (Delay -> DelayGain -> WetBus)
            this.delayNode = ctx.createDelay(5.0);
            this.delayNode.delayTime.value = this.getSynthParameter(PARAMETER_LABEL.DelayTime);

            this.delayGain = ctx.createGain();
            this.delayGain.gain.value = this.getSynthParameter(PARAMETER_LABEL.DelayWet);

            this.delayNode.connect(this.delayGain);
            this.delayGain.connect(this.wetGain);

            this.distortNode = ctx.createWaveShaper();
            this.distortNode.curve = new DistortionTool().createSoftDistortionCurve(ctx, this.getSynthParameter(PARAMETER_LABEL.DistortionDrive));
            this.distortNode.oversample = "2x";

            this.distortGain = ctx.createGain();
            this.distortGain.gain.value = this.getSynthParameter(PARAMETER_LABEL.DistortionWet);

            this.distortNode.connect(this.distortGain);
            this.distortGain.connect(this.wetGain);
            
        }
        if (ctx.state === "suspended") {
            await ctx.resume();
        }
    }

    public async loadNewConvolverImpulse(url: string) {
        const ctx = this.getAudioContext();
        if (!ctx || !this.convolverNode) return;
        try {
            const response = await fetch(url);
            const arrBuffer = await response.arrayBuffer();
            this.convolverNode.buffer = await ctx.decodeAudioData(arrBuffer);
        } catch (error) {
            console.error("Failed to load/decode convolver impulse: ", error);
        }
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
        const ctx = this.getAudioContext();

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
            if (this.reverbGain && ctx) {
                this.reverbGain.gain.setValueAtTime(value, ctx.currentTime);
            }
            break;
        case PARAMETER_LABEL.DelayWet: 
            this.delayWetPercent = value; 
            if (this.delayGain && ctx) {
                this.delayGain.gain.setValueAtTime(value, ctx.currentTime);
            }
            break;
        case PARAMETER_LABEL.DelayTime: 
            this.delayTime = value; 
            if (this.delayNode && ctx) {
                this.delayNode.delayTime.setValueAtTime(value, ctx.currentTime);
            }
            break;
        case PARAMETER_LABEL.DistortionWet: 
            this.distortWetPercentage = value; 
            if (this.distortGain && ctx) {
                this.distortGain.gain.setValueAtTime(value, ctx.currentTime);
            }
            break;
        case PARAMETER_LABEL.DistortionDrive: 
            this.distortionDriveAmount = value; 
            if (this.distortNode && ctx) {
                this.distortNode.curve = new DistortionTool().createSoftDistortionCurve(ctx, value);
            }
            break;
            default: return 0;
        }

        this.notifyListeners();
    }

    public play(midi: number, time?: number, duration?: number) {
        const ctx = this.getAudioContext();
        if (!ctx) {
            console.warn("NO AUDIO CONTEXT AVAILABLE BEFORE PLAYING NOTE");
            return;
        }

        const existingEntry = this.activeNotes.get(midi);
        if (existingEntry) {
            try {
                const now = ctx.currentTime;
                existingEntry.gain.gain.cancelScheduledValues(now);
                existingEntry.gain.gain.setValueAtTime(existingEntry.gain.gain.value, now);
                existingEntry.gain.gain.linearRampToValueAtTime(0.0001, now + 0.01); 
                existingEntry.osc.stop(now + 0.02);
                existingEntry.osc.disconnect();
                existingEntry.gain.disconnect();
            } catch (_) {
                // ignore if already disconnected
            }
            this.activeNotes.delete(midi);
        }
        
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();

        const noteTimeToTrigger = time ? time : ctx.currentTime;

        const attackDuration = Math.max(this.getSynthParameter(PARAMETER_LABEL.Attack), 0.001);
        const decayDuration = Math.max(this.getSynthParameter(PARAMETER_LABEL.Decay), 0.001);
        const targetSustain = Math.max(this.getSynthParameter(PARAMETER_LABEL.Sustain), 0.001);

        const peakTime = noteTimeToTrigger + attackDuration;
        const sustainTime = peakTime + decayDuration;

        osc.frequency.setValueAtTime(midiToFreq(midi), noteTimeToTrigger);
        osc.type = this.waveformType;

        osc.connect(noteGain);

        if (this.dryGain) noteGain.connect(this.dryGain);
        if (this.convolverNode) noteGain.connect(this.convolverNode);
        if (this.delayNode) noteGain.connect(this.delayNode);
        if (this.distortNode) noteGain.connect(this.distortNode);

        // ADSR Envelope
        noteGain.gain.cancelScheduledValues(noteTimeToTrigger);
        noteGain.gain.setValueAtTime(0.0001, noteTimeToTrigger);
        noteGain.gain.linearRampToValueAtTime(1.0, peakTime);
        noteGain.gain.linearRampToValueAtTime(targetSustain, sustainTime);

        osc.start(noteTimeToTrigger);

        // store active voice instance
        this.activeNotes.set(midi, { osc, gain: noteGain, count: 1 });

        if (duration) {
            this.stop(midi, duration);
        }
    }

    public stop(midi: number, duration?: number) {
        const ctx = this.getAudioContext();
        const entry = this.activeNotes.get(midi);
        if (!entry) return;

        const { osc, gain } = entry;
        const now = ctx.currentTime;
        const releaseDuration = Math.max(this.getSynthParameter(PARAMETER_LABEL.Release), 0.001);
        const stopTime = (duration ? duration + now : now);
        const releaseTime = stopTime + releaseDuration;

        try {
            gain.gain.cancelScheduledValues(now);
            gain.gain.setValueAtTime(Math.max(gain.gain.value, 0.0001), stopTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, releaseTime);

            osc.stop(releaseTime + 0.05);
            this.activeNotes.delete(midi);

            osc.onended = () => {
                osc.disconnect();
                gain.disconnect();
            };
        } catch (_) {
            // safety catch for already stopped nodes
        }
    }

    public stopAllVoices() {
        const now = this.getAudioContext().currentTime;

        // Iterate through all active voices currently playing
        this.activeNotes.forEach((note) => {
            try {
                // Mute gain instantly to prevent clicks/pops
                note.gain.gain.cancelScheduledValues(now);
                note.gain.gain.setValueAtTime(0.0001, now);

                note.osc.stop(now);
                note.osc.disconnect();
                note.gain.disconnect();
            } catch (_) {
                // ignore errors
            }
        });

        this.activeNotes.clear();
    }
}