export interface MidiNoteEvent {
  midi: number;      //60 = Middle C
  beat: number;      // starts at a beat number
  duration: number;  //In beats
}