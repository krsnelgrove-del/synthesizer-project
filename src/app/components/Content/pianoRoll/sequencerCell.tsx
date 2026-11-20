//does not currently send scheduled notes to the synth !!!

import React, { ReactNode } from "react";
import { useSequencerStore } from "@/(utils)/useSequencerStore";
import { cn } from "@/lib/utils";
import { MidiNoteEvent } from "@/(utils)/midiEvents";
import { Note } from "@/app/(const)/noteMap";

interface SequencerCellProps {
    isStepNode: boolean;
    startRow: number;
    endRow: number;
    startCol: number;
    endCol: number;
    midi?: Note;
    children?: (midiNote: Note) => ReactNode;
}

export const SequencerCell = React.memo(function SequencerCell({
    isStepNode,
    startRow,
    endRow,
    startCol,
    endCol,
    midi,
    children,
}: SequencerCellProps) {
    // Subscribe directly to this specific step's active state
    const isActive = useSequencerStore((state) => !!state.activeSteps[`${startCol}-${startRow}`]);
    const toggleStep = useSequencerStore((state) => state.toggleStep);

    return (
        <button
            type="button"
            onClick={() => isStepNode ? toggleStep(startCol, startRow) : null}
            style={{ 
                gridRowStart: startRow,
                gridRowEnd: endRow, 
                gridColumnStart: startCol, 
                gridColumnEnd: endCol 
            }}
            className={cn(
                "min-h-5 border-r border-r-synth-muted/40 border-b-2 border-b-black/15",
                isActive && isStepNode
                    ? "bg-synth-purple hover:bg-synth-purple/90 shadow-inner" 
                    : "bg-transparent hover:bg-synth-muted/30",
                    isStepNode ? "transition-colors cursor-pointer" : ""
            )}
        >
            {midi && children ? children?.(midi) : null}
            </button>
    );
});