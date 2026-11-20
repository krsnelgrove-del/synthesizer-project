import Key from "./key";
import { Note, Notes } from "@/app/(const)/noteMap";
import { cn } from "@/lib/utils";
import React from "react";

interface PianoProps extends React.HTMLAttributes<HTMLDivElement> {
    synthID: string;
    variant?: "white" | "black";
    isVertical?: boolean;
    midiOffset?: number;
    numberOfKeys?: number;
}

export default function Piano({ synthID, variant, isVertical, midiOffset = 0, numberOfKeys, className }: PianoProps) {
    const isWhite = variant === "white";

    // 1. Resolve the note map safely without mutating global constants
    const noteMap = (() => {
        let base = [...Notes];
        if (numberOfKeys && numberOfKeys <= base.length) {
            base = base.slice(0, numberOfKeys);
        }
        return isVertical ? base.reverse() : base;
    })();

    // 2. Calculate white key percentage based strictly on the active subset
    const totalWhiteKeys = noteMap.filter(n => n.variant === "white").length;
    const whiteKeySizePercent = totalWhiteKeys > 0 ? 100 / totalWhiteKeys : 0;

    let whiteKeyCounter = 0;

    return (
        <div 
            className={cn(
                "overflow-hidden relative w-full h-full",
                isWhite 
                    ? isVertical 
                        ? "flex flex-col flex-nowrap w-full h-full" 
                        : "flex flex-row flex-nowrap w-full h-full" 
                    : "absolute inset-0 pointer-events-none", // Overlay container for black keys
                className
            )}
        >
            {noteMap.map((midiNote) => {
                // Immutable copy to prevent global state mutation
                const adjustedNote: Note = {
                    ...midiNote,
                    midiID: midiNote.midiID + midiOffset
                };

                if (midiNote.variant === "white") {
                    whiteKeyCounter++; 

                    if (isWhite) {
                        return (
                            <Key
                                synthID={synthID}
                                key={adjustedNote.name}
                                note={adjustedNote} 
                                showName={false}
                                style={
                                    isVertical 
                                        ? { height: `${whiteKeySizePercent}%` } 
                                        : { width: `${whiteKeySizePercent}%` }
                                }
                                className={isVertical ? "w-full min-h-0 flex-1" : "h-full min-w-0 flex-1"}
                            />
                        );
                    }
                } else {
                    const precedingWhiteIndex = whiteKeyCounter - 1;

                    if (!isWhite) {
                        // Black keys proportioned nicely to white key size
                        const blackKeySizePercent = whiteKeySizePercent * 0.65;
                        const offsetPosition = ((precedingWhiteIndex + 1) * whiteKeySizePercent) - (blackKeySizePercent / 2);

                        const absoluteStyle = isVertical 
                            ? { 
                                top: `${offsetPosition}%`, 
                                height: `${blackKeySizePercent}%`, 
                                width: '55%' // Control thickness of vertical black keys here
                              } 
                            : { 
                                left: `${offsetPosition}%`, 
                                width: `${blackKeySizePercent}%`, 
                                height: '60%' 
                              };

                        return (
                            <div 
                                key={adjustedNote.name} 
                                className="absolute z-10 pointer-events-auto"
                                style={absoluteStyle}
                            >
                                <Key synthID={synthID} note={adjustedNote} showName={false} />
                            </div>
                        );
                    }
                }
                return null;
            })}
        </div>
    );
}