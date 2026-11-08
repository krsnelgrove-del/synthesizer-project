class AudioEngine {
    private ctx: AudioContext | null = null;
    private activeNotes = new Map<number, { osc: OscillatorNode; gain: GainNode; count: number }>();

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
        if (this.ctx && this.ctx.state === "suspended") {
            this.ctx.resume();
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

        osc.type = "sine";
        osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);

        gain.gain.setValueAtTime(0, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.25, this.ctx.currentTime + 0.01);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
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
                gain.gain.setValueAtTime(gain.gain.value, this.ctx.currentTime);
                gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.04);
                
                setTimeout(() => {
                    osc.stop();
                    osc.disconnect();
                }, 40);
            }
            this.activeNotes.delete(frequency);
        }
    }
}

export const audioEngine = new AudioEngine();