import { Note, Notes } from "@/app/(const)/noteMap";
import { SequencerCell } from "./sequencerCell";
import Key from "../keyboard/keys/key";

export default function SequencerWindow() {
    const columns = 17; 
    const rows = Notes.length;

    const wrapperGridStyleString = "overflow-auto w-full h-full border-4 border-synth-border bg-synth-app "
    + "grid grid-rows-" + (rows).toString() + " grid-cols-" + (columns).toString();

    function RenderHeadTimeStamps() {
        const divElements = [];

        for (let i = 0; i < columns; i++) {
            const labelString = i > 0 ? i.toString() : "";
            const startLine = i === 0 ? 1 : i + 1;
            const endLine = i === 1 ? 2 : i + 2;

            divElements.push(
                <div 
                    key={i}
                    style={{ 
                        gridRowStart: 1, 
                        gridColumnStart: startLine, 
                        gridColumnEnd: endLine 
                    }}
                    className="sticky top-0 border-r border-r-synth-muted/65 border-b-2 border-b-black/10 flex items-center justify-start text-xs text-synth-text pl-2"
                >
                    <span>{labelString}</span> 
                </div>
            );
        }

        return divElements;
    }

    function RenderCells() {
        const divElements = [];

        for (let c = 1; c < columns; c++) {
            for (let r = 0; r < rows; r++) {
                const startRow = 2 + r;
                const endRow = 3 + r;
                const startCol = 1 + c;
                const endCol = 2 + c;

                divElements.push(
                    <SequencerCell
                        key={`cell-${c}-${r}`}
                        isStepNode={true}
                        startRow={startRow}
                        endRow={endRow}
                        startCol={startCol}
                        endCol={endCol} 
                        />
                );
            }
        }

        return divElements;
    }
    
    function renderPianoRollSidebar(midiOffset: number) {
        const elements = [];
        const noteMap = (() => {
                let base = [...Notes];
                if (rows <= base.length) {
                    base = base.slice(0, rows);
                }
                return base;
            })();

        const totalWhiteKeys = noteMap.filter(n => n.variant === "white").length;
        // const whiteKeySizePercent = totalWhiteKeys > 0 ? 100 / totalWhiteKeys : 0;
        // const whiteKeyCounter = 0;

        for(let r = 1; r <= rows; r++) {
            const styleString = "min-h-0 col-start-1 col-end-2 row-start-" + (r+1).toString() + " row-end-" + (r+2).toString();
            const note: Note = noteMap.toReversed()[r-1];
            console.log("Note In Sequencer Window Instantiated: " + note.midiID);
            elements.push(
                <div key={r} className={styleString}>
                    <Key 
                    synthID="000"
                    note={note}
                    />
                </div>
            )
        }

        return elements;
    }

    return (
        <div className={wrapperGridStyleString} >
            {RenderHeadTimeStamps()}

            {renderPianoRollSidebar(0)}

            {RenderCells()}
        </div>
    );
}