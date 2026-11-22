import { useSynthStore } from "@/(utils)/synthStore";
import { Note } from "@/app/(const)/noteMap";
import { AudioEngine } from "@/app/classes/audioEngine";
import { useIsKeyPressed } from "@/app/hooks/useKeyboardInput";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef } from "react";

interface KeyProps extends React.ButtonHTMLAttributes<HTMLButtonElement>{
    synthID: string;
    note: Note;
    isPressed?: boolean;
    showName?: boolean;
    useKeyboard?: boolean;
    _onPointerEnter?: () => void;
    _onPointerDown?: () => void;
}

export default function Key({ 
    synthID,
    note, 
    showName, 
    useKeyboard = true, //true default
    isPressed: externalIsPressed, 
    _onPointerDown, 
    _onPointerEnter,
    className, 
    ...props 
}: KeyProps) {

    const synthRef = useRef<AudioEngine | undefined>(undefined);
    const synth = useSynthStore((state) => state.getSynthById(synthID));
    
    const keyboardPressed = useIsKeyPressed(note.keyboardInput);
    const isPressed = externalIsPressed || keyboardPressed;

    useEffect(() => {
        if (!synth) return;
        
        synthRef.current = synth;

        if(useKeyboard) {
            if (keyboardPressed) {
                synth.play(note.midiID);
        } else {
            synth.stop(note.midiID);
        }
    }
    }, [keyboardPressed, synth, note.midiID]);

    const isWhite = note.variant === "white";

    const whiteKeyHoverStyle: string = "hover:bg-synth-muted ";
    const whiteKeyClickStyle: string = "active:bg-piano-key-black-active ";

    const blackKeyHoverStyle: string = "hover:bg-piano-key-black-hover ";
    const blackKeyClickStyle: string = "active:bg-piano-key-black-active ";
    
    // const keyAnimateProperties = (duration: number, type: "ease-in-out" | "transition-none") => {
    //     return (
    //         `${"transition duration-" + duration.toString() + " " + type}`
    //     )
    // }

    const getKeyStyles = () => {
        
        if (isWhite) {
            return isPressed 
                ? "bg-piano-key-white-active text-black border border-app" 
                : whiteKeyHoverStyle + whiteKeyClickStyle + "bg-piano-key-white-default text-black border border-synth-app";
        }

        return isPressed 
            ? "bg-piano-key-black-active text-white" 
            : blackKeyHoverStyle + blackKeyClickStyle + " bg-piano-key-black-default text-white";
    };

    function handleKeyDown(){
        if(isPressed) {
            synth?.play(note.midiID);
        }
    }

    return (
        <button
            type="button"
            onPointerDown={() => {
                synth?.play(note.midiID);
                _onPointerDown?.();
            }}
            onPointerUp={() => synth?.stop(note.midiID)}
            onPointerLeave={() => synth?.stop(note.midiID)}
            onPointerEnter={_onPointerEnter}

            
            className={cn("h-full w-full select-none touch-none outline-none", getKeyStyles(), className)}
            {...props}
        >
            <span>{showName ? `${note.name}` : ""}</span>
        </button>
    );
}