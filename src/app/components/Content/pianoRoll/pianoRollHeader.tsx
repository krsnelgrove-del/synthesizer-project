import { useTransportStore } from "@/(utils)/transportStore";
import { ChangeEvent } from "react";

export default function PianoRollHeader() {
    const bpm = useTransportStore((state) => state.bpm);
    const currentTime = useTransportStore((state) => state.currentTime);
    const setBpm = useTransportStore((state) => state.setBpm);
    const togglePlay = useTransportStore((state) => state.togglePlay);
    const resetTransport = useTransportStore((state) => state.resetTransport);

    function handleLoopControlClick(): void {
    }

    function handleOnChangeBPM(value: string): void {
        const parsed = parseInt(value, 10);
        if (!isNaN(parsed)) {
            setBpm(parsed);
        }
    }

    // Format elapsed seconds into MM:SS:MS format
    const formatTime = (secs: number) => {
        const minutes = Math.floor(secs / 60);
        const seconds = Math.floor(minutes / 60);
        const millis = Math.floor((secs % 1) * 100);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${millis.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-row items-center p-4 justify-between bg-synth-card border rounded-md border-synth-border w-full">
            {/* Playback Controls */}
            <div className="flex flex-row gap-2 items-center">
                <button 
                    onClick={togglePlay}
                    className="bg-synth-card-hover px-3 py-2 border border-piano-key-white-hover hover:border-synth-violet rounded-md text-xs font-semibold cursor-pointer">
                    <span>PLAY</span>
                </button>
                <button 
                    onClick={resetTransport}
                    className="bg-synth-card-hover px-3 py-2 border border-piano-key-white-hover hover:border-synth-violet rounded-md text-xs font-semibold cursor-pointer">
                    <span>STOP</span>
                </button>
                <button 
                    onClick={() => console.error("Undefined function for 'REC' button")}
                    className="bg-synth-card-hover px-3 py-2 border border-piano-key-white-hover hover:border-synth-violet rounded-md text-xs font-semibold cursor-pointer">
                    <span>REC</span>
                </button>
            </div>

            {/* Playhead Info */}
            <div className="flex flex-row items-center gap-6">
                <div className="flex flex-row items-center gap-2">
                    <span className="text-xs text-synth-text">BPM:</span>
                    <input 
                        type="number"
                        value={bpm}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleOnChangeBPM(e.target.value)}
                        className="bg-synth-input text-synth-text border border-synth-border rounded px-2 py-1 text-sm w-16 text-center outline-none" 
                    />
                </div>
                <div className="flex flex-row items-center gap-2">
                    <span className="text-xs text-slate-400">Time:</span>
                    <span className="text-sm font-mono text-slate-200">{formatTime(currentTime)}</span>
                </div>
            </div>

            {/* Loop Control */}
            <div className="flex flex-row items-center gap-2">
                <span className="text-xs text-synth-text">Loop:</span>
                <button 
                    onClick={handleLoopControlClick}
                    className="px-3 py-1 bg-synth-card-hover border border-synth-border rounded text-xs font-bold hover:border-synth-violet transition cursor-pointer">
                    ON
                </button>
            </div>
        </div>
    );
}