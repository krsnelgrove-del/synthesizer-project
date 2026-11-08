import { Note } from "@/app/(const)/noteMap";
import { audioEngine } from "@/app/classes/audioEngine";
import { useIsKeyPressed } from "@/app/hooks/useKeyboardInput";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

interface KeyProps extends React.ButtonHTMLAttributes<HTMLButtonElement>{
    note: Note;
    isPressed?: boolean;
    showName?: boolean;
    onPointerEnter?: () => void;
    onPointerDown?: () => void;
}

export default function Key({ 
    note, 
    showName, 
    isPressed: externalIsPressed, 
    onPointerDown, 
    onPointerEnter, 
    className, 
    ...props 
}: KeyProps) {
    const isWhite = note.variant === "white";
    const keyboardPressed = useIsKeyPressed(note.keyboardInput);
    const isPressed = externalIsPressed || keyboardPressed;

    const whiteKeyHoverStyle: string = "hover:bg-synth-muted ";
    const whiteKeyClickStyle: string = "active:bg-piano-key-black-active ";

    const blackKeyHoverStyle: string = "hover:bg-piano-key-black-hover ";
    const blackKeyClickStyle: string = "active:bg-piano-key-black-active ";
    
    const keyAnimateProperties = (duration: number, type: "ease-in-out" | "transition-none") => {
        return (
            `${"transition duration-" + duration.toString() + " " + type}`
        )
    }

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

    return (
        <button
            type="button"
            onPointerDown={() => {
                audioEngine.play(note.frequency);
                onPointerDown?.();
            }}
            onPointerUp={() => audioEngine.stop(note.frequency)}
            onPointerLeave={() => audioEngine.stop(note.frequency)}
            onPointerEnter={onPointerEnter}
            className={cn("h-full w-full select-none touch-none", getKeyStyles(), className)}
            {...props}
        >
            <span>{showName ? `${note.name}` : ""}</span>
        </button>
    );
}