import { useEffect, useSyncExternalStore } from "react";
import { Notes } from "@/app/(const)/noteMap";
import { AudioEngine } from "../classes/audioEngine";

const keyMap = new Map<string, number>();
const pressedKeys = new Set<string>();
const listeners = new Set<() => void>();

function notifyListeners() {
    listeners.forEach((listener) => listener());
}

export function subscribeToKeyboard(listener: () => void) {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
}

export function isKeyPressed(key: string): boolean {
    if (!key)
        {
            return false;
        }

        const val = pressedKeys.has(key.toLowerCase());
    return val;
    
}

export function useIsKeyPressed(key: string | undefined): boolean {
    return useSyncExternalStore(
        subscribeToKeyboard,
        () => key !== undefined && isKeyPressed(key),
        () => false
    );
}

export function useKeyboardInput() {
    useEffect(() => {
        Notes.forEach((note) => {
            if (note.keyboardInput) {
                keyMap.set(note.keyboardInput.toLowerCase(), note.frequency);
            }
        });

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.repeat) return;
            if (["INPUT", "TEXTAREA"].includes((event.target as HTMLElement).tagName)) return;

            const key = event.key.toLowerCase();
            const frequency = keyMap.get(key);

            if (frequency && !pressedKeys.has(key)) {
                pressedKeys.add(key);
                AudioEngine.getInstance()?.play(frequency);
                notifyListeners();
            }
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            const key = event.key.toLowerCase();
            const frequency = keyMap.get(key);

            if (frequency && pressedKeys.has(key)) {
                pressedKeys.delete(key);
                AudioEngine.getInstance()?.stop(frequency);
                notifyListeners();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, []);

    return {
        useKeyboardInput,
        getKeysActive: () => keyMap
    };
}