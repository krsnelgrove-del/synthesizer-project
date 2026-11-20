export interface MidiNoteEvent {
  midi: number;      //60 = Middle C
  startBeat: number;      // starts at a beat number
  endBeat: number;  //In beats
}