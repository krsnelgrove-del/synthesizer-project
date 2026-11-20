export function midiToFreq(midi: number): number {
    const hertzTuning = 440;
    const numberOfKeys = 69;
    const keysInOctave = 12;
  return hertzTuning * Math.pow(2, (midi - numberOfKeys) / keysInOctave); //440 Main tuning for "A". 69 keys. 12 keys in an octave.
  //Middle C is 60.
}

export function freqToMidi(frequency: number): number {
    const hertzTuning = 440;
    const numberOfKeys = 69;
    const keysInOctave = 12;
    
    return Math.round(numberOfKeys + keysInOctave * Math.log2(frequency / hertzTuning));
}