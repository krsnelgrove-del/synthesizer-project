export interface Note {
    name: string;
    frequency: number;
    variant: "white" | "black";
    keyboardInput?: string;
}

export const Notes: readonly Note[] = [
    // Octave 2 (Mapped to Z row / ASDF black key row)
    { name: "C2", frequency: 65.41, variant: "white", keyboardInput: "z" },
    { name: "C#2", frequency: 69.30, variant: "black", keyboardInput: "s" },
    { name: "D2", frequency: 73.42, variant: "white", keyboardInput: "x" },
    { name: "D#2", frequency: 77.78, variant: "black", keyboardInput: "d" },
    { name: "E2", frequency: 82.41, variant: "white", keyboardInput: "c" },
    { name: "F2", frequency: 87.31, variant: "white", keyboardInput: "v" },
    { name: "F#2", frequency: 92.50, variant: "black", keyboardInput: "g" },
    { name: "G2", frequency: 98.00, variant: "white", keyboardInput: "b" },
    { name: "G#2", frequency: 103.83, variant: "black", keyboardInput: "h" },
    { name: "A2", frequency: 110.00, variant: "white", keyboardInput: "n" },
    { name: "A#2", frequency: 116.54, variant: "black", keyboardInput: "j" },
    { name: "B2", frequency: 123.47, variant: "white", keyboardInput: "m" },

    // Octave 3 (Mapped to Q row / Number row black keys starting on 'q')
    { name: "C3", frequency: 130.81, variant: "white", keyboardInput: "q" },
    { name: "C#3", frequency: 138.59, variant: "black", keyboardInput: "2" },
    { name: "D3", frequency: 146.83, variant: "white", keyboardInput: "w" },
    { name: "D#3", frequency: 155.56, variant: "black", keyboardInput: "3" },
    { name: "E3", frequency: 164.81, variant: "white", keyboardInput: "e" },
    { name: "F3", frequency: 174.61, variant: "white", keyboardInput: "r" },
    { name: "F#3", frequency: 185.00, variant: "black", keyboardInput: "5" },
    { name: "G3", frequency: 196.00, variant: "white", keyboardInput: "t" },
    { name: "G#3", frequency: 207.65, variant: "black", keyboardInput: "6" },
    { name: "A3", frequency: 220.00, variant: "white", keyboardInput: "y" },
    { name: "A#3", frequency: 233.08, variant: "black", keyboardInput: "7" },
    { name: "B3", frequency: 246.94, variant: "white", keyboardInput: "u" },

    // Octave 4 / Transition (Continuing the Q row)
    { name: "C4", frequency: 261.63, variant: "white", keyboardInput: "i" },
    { name: "C#4", frequency: 277.18, variant: "black", keyboardInput: "9" },
    { name: "D4", frequency: 293.66, variant: "white", keyboardInput: "o" },
    { name: "D#4", frequency: 311.13, variant: "black", keyboardInput: "0" },
    { name: "E4", frequency: 329.63, variant: "white", keyboardInput: "p" },

    // Higher Octave notes (available for mouse/UI or extended bindings)
    { name: "F4", frequency: 349.23, variant: "white" },
    { name: "F#4", frequency: 369.99, variant: "black" },
    { name: "G4", frequency: 392.00, variant: "white" },
    { name: "G#4", frequency: 415.30, variant: "black" },
    { name: "A4", frequency: 440.00, variant: "white" },
    { name: "A#4", frequency: 466.16, variant: "black" },
    { name: "B4", frequency: 493.88, variant: "white" },
    { name: "C5", frequency: 523.25, variant: "white" }
] as const;