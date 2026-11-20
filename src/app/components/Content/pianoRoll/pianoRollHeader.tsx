import { useTransportStore } from "@/(utils)/transportStore";
import { error } from "console";
import { ChangeEvent } from "react";



export default function PianoRollHeader() {
    function handleTransportClick(value: number): void {
        const transport = useTransportStore.getState();

        switch(value) {
            
            case 0: 
            transport.togglePlay();
            break;
            case 1:
            transport.resetTransport();
            break;
            case 2:

            break;

            default:
                throw new Error(`Argument invalid for handleTransportClick. Check to see if valid argument was passed in pianoRollHeader. Passed: ${value}`);
        }
        
    }

    function handleLoopControlClick(): void {
        throw new Error("Function not implemented.");
    }

    function handleOnChangeBPM(value: string): void {
        throw new Error("Function not implemented.");
    }

    return (
        <div className="flex flex-row items-center p-4 justify-between bg-synth-card border rounded-md border-synth-border w-full">
            {/* Playback Controls */}
            <div className="flex flex-row gap-2 items-center">
                <button 
                onClick={((e) => handleTransportClick(0))}
                className="bg-synth-card-hover px-3 py-2 border border-piano-key-white-hover hover:border-synth-violet rounded-md text-xs font-semibold cursor-pointer">
                    <span>PLAY</span>
                </button>
                <button 
                onClick={((e) => handleTransportClick(1))}
                className="bg-synth-card-hover px-3 py-2 border border-piano-key-white-hover hover:border-synth-violet rounded-md text-xs font-semibold cursor-pointer">
                    <span>STOP</span>
                </button>
                <button 
                onClick={((e) => handleTransportClick(2))}
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
                    onChange={((e: ChangeEvent<HTMLInputElement>) => handleOnChangeBPM(e.target.value))}
                    className="bg-synth-input text-synth-text border border-synth-border rounded px-2 py-1 text-sm w-16 text-center outline-none" placeholder="103" />
                </div>
                <div className="flex flex-row items-center gap-2">
                    <span className="text-xs text-slate-400">Time:</span>
                    <span className="text-sm font-mono text-slate-200">0:21:25</span>
                </div>
            </div>

            {/* Loop Control */}
            <div className="flex flex-row items-center gap-2">
                <span className="text-xs text-synth-text">Loop:</span>
                <button 
                onClick={((e) => handleLoopControlClick())}
                className="px-3 py-1 bg-synth-card-hover border border-synth-border rounded text-xs font-bold hover:border-synth-violet transition cursor-pointer">
                    ON
                </button>
            </div>
        </div>
    );
}