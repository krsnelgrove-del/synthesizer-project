import { Notes } from "@/app/(const)/noteMap";
import { SequencerCell } from "./sequencerCell";
import Key from "../keyboard/keys/key";
import { useTransportStore } from "@/(utils)/transportStore";

function TimeStampsRow({ gridColumns }: { gridColumns: number }) {
    const currentBeat = useTransportStore((state) => state.currentBeat);
    const activeStepCol = Math.floor(currentBeat) % 16;

    return (
        <>
            {Array.from({ length: gridColumns + 1 }).map((_, i) => {
                const labelString = i > 0 ? i.toString() : "";
                const startLine = i === 0 ? 1 : i + 1;
                const endLine = i === 1 ? 2 : i + 2;
                const isPlayheadActive = i > 0 && activeStepCol === (i - 1);

                const transportHeadStyle = 
                    "sticky top-0 bg-synth-app z-30 border-b-2 border-b-black/10 flex items-center justify-start text-xs text-synth-text pl-2 relative " + 
                    (isPlayheadActive ? "border-l border-l-synth-violet bg-synth-muted/20" : "border-l border-l-synth-muted/50");

                return (
                    <div 
                        key={i}
                        style={{ gridRowStart: 1, gridColumnStart: startLine, gridColumnEnd: endLine }}
                        className={transportHeadStyle}
                    >
                        <span>{labelString}</span> 
                        {isPlayheadActive && (
                            <div className="absolute -bottom-1.5 left-0 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-synth-violet z-40 pointer-events-none" />
                        )}
                    </div>
                );
            })}
        </>
    );
}

export default function SequencerWindow() {
    const synthID = "000";
    const maxBeats = useTransportStore((state) => state.amountOfBeats);
    const gridRows = Notes.length;
    const gridColumns = maxBeats;

    const wrapperClassnameString = "overflow-auto w-full h-full border-4 border-synth-border bg-synth-app grid";

    const wrapperGridStyle = {
        gridTemplateColumns: `minmax(0, 100px) repeat(${gridColumns}, 1fr)`
    };

    const noteMap = [...Notes].reverse();

    return (
        <div className={wrapperClassnameString} style={wrapperGridStyle}>
            {/* Timestamps header */}
            <TimeStampsRow gridColumns={gridColumns} />

            {/* Piano Roll Sidebar */}
            {noteMap.map((note, r) => (
                <div 
                    key={`piano-key-${r}`} 
                    className={`min-h-0 col-start-1 col-end-2 row-start-${r + 2} row-end-${r + 3}`}
                >
                    <Key synthID={synthID} note={note} useKeyboard={false} />
                </div>
            ))}

            {/* Sequencer Cells Grid */}
            {Array.from({ length: gridColumns + 1 }).map((_, colIndex) => {
                const c = colIndex + 1;
                return Notes.map((_, r) => (
                    <SequencerCell
                        key={`cell-${c}-${r}`}
                        isStepNode={true}
                        col={c}
                        row={r}
                        synthID={synthID}
                        startRow={2 + r}
                        endRow={3 + r}
                        startCol={1 + c}
                        endCol={2 + c}
                    />
                ));
            })}
        </div>
    );
}