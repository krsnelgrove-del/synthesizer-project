import Key from "./key";
import { Note, Notes } from "@/app/(const)/noteMap";
import { cn } from "@/lib/utils";
import React from "react";

interface PianoProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "white" | "black";
}

export default function Piano({ variant, className}: PianoProps) {
    const isWhite = variant === "white";
    const totalWhiteKeys = Notes.filter(n => n.variant === "white").length;
    const whiteKeyWidthPercent = 100 / totalWhiteKeys;

    let whiteKeyCounter = 0;

    return (
        <div 
            className={cn(
                "h-full overflow-hidden",
                isWhite ? "flex flex-row flex-nowrap w-full" : "relative w-full h-full",
                className
            )}
        >
            {Notes.map((note) => {
                if (note.variant === "white") {
                    const currentWhiteIndex = whiteKeyCounter;
                    whiteKeyCounter++; // Increment for the next note

                    if (isWhite) {
                        return <Key 
                        key={note.name}
                        note={note} showName={false}/>;
                    }
                } else {
                    // It's a black key! It sits between (whiteKeyCounter - 1) and whiteKeyCounter
                    const precedingWhiteIndex = whiteKeyCounter - 1;

                    if (!isWhite) {
                        // Black key width
                        const blackKeyWidthPercent = whiteKeyWidthPercent * 0.62;
                        
                        // Center position: Right edge of preceding white key minus half the black key width
                        const leftPosition = ((precedingWhiteIndex + 1) * whiteKeyWidthPercent) - (blackKeyWidthPercent / 2);

                        return (
                            <div 
                                key={note.name} 
                                className="absolute top-0 h-full"
                                style={{ 
                                    left: `${leftPosition}%`,
                                    width: `${blackKeyWidthPercent}%`
                                }}
                            >
                                <Key note={note} 
                                showName={false}/>
                            </div>
                        );
                    }
                }
                return null;
            })}
        </div>
    );
}