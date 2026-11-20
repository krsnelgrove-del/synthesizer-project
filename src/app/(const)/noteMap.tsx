export interface Note {
    name: string;
    midiID: number;
    variant: "white" | "black";
    keyboardInput?: string;
}

export const Notes: readonly Note[] = [
    // Octave 2 (Mapped to Z row / ASDF black key row)
    { name: "C2", midiID: 36, variant: "white", keyboardInput: "z" },
    { name: "C#2", midiID: 37, variant: "black", keyboardInput: "s" },
    { name: "D2", midiID: 38, variant: "white", keyboardInput: "x" },
    { name: "D#2", midiID: 39, variant: "black", keyboardInput: "d" },
    { name: "E2", midiID: 40, variant: "white", keyboardInput: "c" },
    { name: "F2", midiID: 41, variant: "white", keyboardInput: "v" },
    { name: "F#2", midiID: 42, variant: "black", keyboardInput: "g" },
    { name: "G2", midiID: 43, variant: "white", keyboardInput: "b" },
    { name: "G#2", midiID: 44, variant: "black", keyboardInput: "h" },
    { name: "A2", midiID: 45, variant: "white", keyboardInput: "n" },
    { name: "A#2", midiID: 46, variant: "black", keyboardInput: "j" },
    { name: "B2", midiID: 47, variant: "white", keyboardInput: "m" },

    // Octave 3 (Mapped to Q row / Number row black keys starting on 'q')
    { name: "C3", midiID: 48, variant: "white", keyboardInput: "q" },
    { name: "C#3", midiID: 49, variant: "black", keyboardInput: "2" },
    { name: "D3", midiID: 50, variant: "white", keyboardInput: "w" },
    { name: "D#3", midiID: 51, variant: "black", keyboardInput: "3" },
    { name: "E3", midiID: 52, variant: "white", keyboardInput: "e" },
    { name: "F3", midiID: 53, variant: "white", keyboardInput: "r" },
    { name: "F#3", midiID: 54, variant: "black", keyboardInput: "5" },
    { name: "G3", midiID: 55, variant: "white", keyboardInput: "t" },
    { name: "G#3", midiID: 56, variant: "black", keyboardInput: "6" },
    { name: "A3", midiID: 57, variant: "white", keyboardInput: "y" },
    { name: "A#3", midiID: 58, variant: "black", keyboardInput: "7" },
    { name: "B3", midiID: 59, variant: "white", keyboardInput: "u" },

    // Octave 4 / Transition (Continuing the Q row)
    { name: "C4", midiID: 60, variant: "white", keyboardInput: "i" },
    { name: "C#4", midiID: 61, variant: "black", keyboardInput: "9" },
    { name: "D4", midiID: 62, variant: "white", keyboardInput: "o" },
    { name: "D#4", midiID: 63, variant: "black", keyboardInput: "0" },
    { name: "E4", midiID: 64, variant: "white", keyboardInput: "p" },

    // Higher Octave notes (available for mouse/UI or extended bindings)
    { name: "F4", midiID: 65, variant: "white" },
    { name: "F#4", midiID: 66, variant: "black" },
    { name: "G4", midiID: 67, variant: "white" },
    { name: "G#4", midiID: 68, variant: "black" },
    { name: "A4", midiID: 69, variant: "white" },
    { name: "A#4", midiID: 70, variant: "black" },
    { name: "B4", midiID: 71, variant: "white" },
    { name: "C5", midiID: 72, variant: "white" }
] as const;