import { useEffect, useSyncExternalStore } from "react";
import { Notes } from "@/app/(const)/noteMap";

const keyMap = new Map<string, number>();
let pressedKeys = new Set<string>(); // Keep as tracked reference
const listeners = new Set<() => void>();

function notifyListeners() {
    pressedKeys = new Set(pressedKeys);
    listeners.forEach((listener) => listener());
}

export function subscribeToKeyboard(listener: () => void) {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
}

export function getSnapshot(): Set<string> {
    return pressedKeys;
}

export function useIsKeyPressed(key: string | undefined): boolean {
    return useSyncExternalStore(
        subscribeToKeyboard,
        () => {
            if (!key) return false;
            return pressedKeys.has(key.toLowerCase());
        },
        () => false
    );
}

export function useKeyboardInput() {
    useEffect(() => {
        if (keyMap.size === 0) {
            Notes.forEach((note) => {
                if (note.keyboardInput) {
                    keyMap.set(note.keyboardInput.toLowerCase(), note.midiID);
                }
            });
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.repeat) return;
            if (["INPUT", "TEXTAREA"].includes((event.target as HTMLElement).tagName)) return;
            if (event.ctrlKey || event.shiftKey || event.altKey || event.metaKey) return;

            const inputKey = event.key.toLowerCase();
            const midiNote = keyMap.get(inputKey);

            if (midiNote !== undefined && !pressedKeys.has(inputKey)) {
                pressedKeys.add(inputKey);
                notifyListeners();
            }
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            const inputKey = event.key.toLowerCase();
            const midiNote = keyMap.get(inputKey);

            if (midiNote !== undefined && pressedKeys.has(inputKey)) {
                pressedKeys.delete(inputKey);
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