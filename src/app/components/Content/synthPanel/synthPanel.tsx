import { MenuSquare } from "lucide-react";
import Image from "next/image";
import { Container } from "@/lib/container";
import { AudioEngine } from "@/app/classes/audioEngine";
import { useState } from "react";

const waveformIcons: Record<OscillatorType, string> = {
  sine: "sine.svg",
  sawtooth: "sawtooth.svg",
  triangle: "triangle.svg",
  square: "square.svg",
  custom: "sine.svg",
};

const adsrIcons: Record<string, { value: number, icon: string }> = {
    
}

export default function SynthPanel() {
  const oscillatorTypes: OscillatorType[] = ["sine", "sawtooth", "triangle", "square"];
  const [currentOscillatorType, setCurrentOscillatorType] = useState(oscillatorTypes[0]);

  const handleOscillatorTypeClick = (oscillatorType: OscillatorType) => {
    AudioEngine.getInstance()?.setOscillatorWaveform(oscillatorType);
    setCurrentOscillatorType(oscillatorType);
    console.log("Oscillator type switched to: ", oscillatorType);
  };

  return (
    <div className="flex flex-col w-full h-full p-0 pt-2 pb-2 gap-2">
      <div className="flex flex-row w-full justify-between">
        <span className="font-sans font-bold text-[1.25vw]">PLUG-IN: SYNTHESIZE!</span>
        <MenuSquare className="opacity-50 hover:opacity-65 hover:scale-105 active:scale-95 transition duration-50 ease-in-out" />
      </div>

    {/* Oscillator Waveforms */}
      <Container as="div" variant="panel">
        <div className="flex flex-row justify-between pb-2">
          <span>Oscillator</span>
        </div>
        <div className="flex flex-col w-full h-auto p-2">
            {/* Wow you finally mapped it! Totally not lazy */}
          <div className="flex flex-row w-full justifications-between gap-0 font-geist-sans">
            {oscillatorTypes.map((type, index) => {
              const isSelected = type === currentOscillatorType;
              const isFirst = index === 0;
              const isLast = index === oscillatorTypes.length - 1;
              const imageSrc = waveformIcons[type];

              let baseClasses = "flex-1 flex flex-col min-w-0 p-2 transition duration-50 ease-in-out outline-none ";

              if (isFirst) {
                baseClasses += "rounded-l-2xl border border-synth-border border-r-0 ";
              } else if (isLast) {
                baseClasses += "rounded-r-2xl border border-synth-border border-l-0 ";
              } else {
                baseClasses += "border border-synth-border ";
              }

              let stateClasses = "";
              if (isSelected) {
                stateClasses = "bg-synth-card-hover text-slate-400 active:scale-95 focus:scale-95 ";
              } else {
                stateClasses = "bg-synth-card text-slate-100 hover:cursor-pointer hover:scale-105 hover:bg-synth-card-hover hover:text-slate-400 active:scale-95 active:bg-synth-card-hover active:text-slate-400 focus:scale-95 focus:bg-synth-card-hover focus:text-slate-400 ";
              }

              let imageClass = "flex-1 mt-auto ";
              if (isSelected) {
                imageClass += "fill-current text-white";
              }

              return (
                <button
                  key={type}
                  onClick={() => handleOscillatorTypeClick(type)}
                  className={baseClasses + stateClasses}
                >
                  <span>{type}</span>
                  <div className="w-full border-0 border-t border-synth-border m-0" />
                  <Image
                    src={imageSrc}
                    width={100}
                    height={100}
                    alt={`${type} Wave`}
                    className={imageClass}
                  />
                </button>
              );
            })}
          </div>
        </div>
        
            {/* ADSR */}
        <Container as="div" variant="panel">
            <div className="flex flex-row justify-between pb-2">
                <span>Envelope</span>
                <div className="flex flex-1 flex-col gap-0">

                </div>
            </div>
        </Container>
        
        <div></div>
      </Container>
    </div>
  );
}