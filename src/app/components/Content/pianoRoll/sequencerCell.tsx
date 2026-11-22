// app/components/sequencerCell.tsx
import React, { ReactNode } from "react";
import { useSequencerStore } from "@/(utils)/useSequencerStore";
import { cn } from "@/lib/utils";
import { Note } from "@/app/(const)/noteMap";
import { useTransportStore } from "@/(utils)/transportStore";

interface SequencerCellProps {
    isStepNode: boolean;
    col: number;
    row: number;
    startRow: number;
    endRow: number;
    startCol: number;
    endCol: number;
    synthID?: string;
    midi?: Note;
    children?: (midiNote: Note) => ReactNode;
}

export const SequencerCell = React.memo(function SequencerCell({
    isStepNode,
    col,
    row,
    startRow,
    endRow,
    startCol,
    endCol,
    synthID = "000",
    midi,
    children,
}: SequencerCellProps) {
    const isActive = useSequencerStore((state) => state.isStepActive(col, row));
    const toggleStep = useSequencerStore((state) => state.toggleStep);
    const transport = useTransportStore((state) => state);

    const activeColumnPlayhead = Math.floor(transport.currentBeat ) % 16; 
    const isPlayheadHere = activeColumnPlayhead === (col-1);

    return (
        <button
            type="button"
            onClick={() => isStepNode ? toggleStep(col, row, synthID) : null}
            style={{ 
                gridRowStart: startRow,
                gridRowEnd: endRow, 
                gridColumnStart: startCol, 
                gridColumnEnd: endCol 
            }}
            className={cn(
                "min-h-5 border-l border-l-synth-muted/40 border-b-2 border-b-black/15",
                isActive && isStepNode
                    ? "bg-synth-purple hover:bg-synth-purple/90 shadow-inner" 
                    : "bg-transparent hover:bg-synth-muted/30",
                isStepNode ? "transition-colors cursor-pointer" : "",
                isPlayheadHere ? "border-l-synth-muted" : ""
            )}
        >
            {midi && children ? children(midi) : null}
        </button>
    );
});