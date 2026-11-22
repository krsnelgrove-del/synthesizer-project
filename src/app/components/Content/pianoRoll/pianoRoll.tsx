import PianoRollHeader from "./pianoRollHeader";
import PianoRollContent from "./pianoRollContent";
import CardTitleBar from "../../textFields/cardTitleBar";

export default function PianoRoll() {
    return(
        <div className="flex flex-col w-full h-full p-0 pt-2 pb-2 gap-2 min-h-0">
            <CardTitleBar title="SEQUENCER" textColor="synth-text" className="self-start"/> 

            {/* header + conent */}
            <PianoRollHeader/>
            <PianoRollContent/>                
        </div>
    )
}