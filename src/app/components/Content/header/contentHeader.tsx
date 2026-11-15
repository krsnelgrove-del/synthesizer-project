import { AudioWaveform, LogOut } from "lucide-react";

export default function ContentHeader() {
    return(
        <div className="flex flex-row gap-2 p-2 w-full h-full border-b-2 border-synth-card-hover shadow-xl shadow-synth-cyan/5">
            {/*Title*/}
            <div className="flex justify-between place-items-center w-2/10 h-full">
                <AudioWaveform size={35} className="flex ml-6 hover:drop-shadow-2xl hover:drop-shadow-synth-cyan transition-all duration-300 ease-in-out"/>
                <span className="flex w-full h-full font-sans font-black text-3xl justify-center">SYNTHESIZE!</span>
            </div>

            <div className="flex h-full w-7/10">
                {/* EMPTY */}
            </div>

            
            {/*Header Buttons*/}
            <div className="relative flex place-items-center text-nowrap overflow-hidden w-1/10 h-full">
                <LogOut size={20} className="absolute right-0 mr-4 text-red-600 drop-shadow-sm drop-shadow-black 
                hover:drop-shadow-red-300 hover:scale-110 hover:drop-shadow-xl transition-all duration-300 ease-in-out"/>
            </div>

        </div>
    )
}