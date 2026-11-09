import { MenuSquare } from "lucide-react";
import Image from "next/image";
import { Container } from "@/lib/container";
import { AudioEngine, ADSRTypes } from "@/app/classes/audioEngine";
import { useState } from "react";

const waveformIcons: Record<OscillatorType, string> = {
  sine: "sine.svg",
  sawtooth: "sawtooth.svg",
  triangle: "triangle.svg",
  square: "square.svg",
  custom: "sine.svg",
};

export default function SynthPanel() {
  const engine = AudioEngine.getInstance();
  const oscillatorTypes: OscillatorType[] = ["sine", "sawtooth", "triangle", "square"];
  
  const [currentOscillatorType, setCurrentOscillatorType] = useState<OscillatorType>(
    engine?.getCurrentOscillatorWaveform() ?? "sine"
  );

  const [attack, setAttack] = useState(engine?.getADSRSetting(ADSRTypes.attack) ?? 0.01);
  const [decay, setDecay] = useState(engine?.getADSRSetting(ADSRTypes.decay) ?? 0.05);
  const [sustain, setSustain] = useState(engine?.getADSRSetting(ADSRTypes.sustain) ?? 0.3);
  const [release, setRelease] = useState(engine?.getADSRSetting(ADSRTypes.release) ?? 1);

  const handleOscillatorTypeClick = (oscillatorType: OscillatorType) => {
    AudioEngine.getInstance()?.setOscillatorWaveform(oscillatorType);
    setCurrentOscillatorType(oscillatorType);
    console.log("Oscillator type switched to: ", oscillatorType);
  };

  const handleAdsrChange = (type: ADSRTypes, value: number) => {
    AudioEngine.getInstance()?.SetADSRSettings(type, value);

    switch (type) {
      case ADSRTypes.attack:
        setAttack(value);
        break;
      case ADSRTypes.decay:
        setDecay(value);
        break;
      case ADSRTypes.sustain:
        setSustain(value);
        break;
      case ADSRTypes.release:
        setRelease(value);
        break;
    }
  };

  return (
    <div className="flex flex-col w-full h-full p-0 pt-2 pb-2 gap-2">
      <div className="flex flex-row w-full justify-between">
        <span className="font-sans font-bold text-[1.25vw]">PLUG-IN: SYNTHESIZE!</span>
        <MenuSquare className="opacity-50 hover:opacity-65 hover:scale-105 active:scale-95 transition duration-50 ease-in-out" />
      </div>

      {/* Oscillator */}
      <Container as="div" variant="panel">
        <div className="flex flex-row justify-between pb-2">
          <span>Oscillator</span>
        </div>
        <div className="flex flex-col w-full h-auto p-2">
          <div className="flex flex-row w-full justify-between gap-0 font-geist-sans">
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
      </Container>

      {/* ADSR Envelope */}
      <Container as="div" variant="panel">
        <div className="flex flex-row justify-between pb-2">
          <span>ADSREnvelope</span>
        </div>
        <div className="flex flex-col w-full h-auto p-2">
          
          {/* Attack Control */}
          <div className="flex flex-col gap-2 bg-synth-card border border-synth-border rounded-xl p-2">
            <div className="flex justify-between text-xs text-slate-300">
              <span>Attack</span>
              <span>{attack.toFixed(2)}s</span>
            </div>
            <input
              type="range"
              min="0.001"
              max="2.0"
              step="0.01"
              value={attack}
              onChange={(e) => handleAdsrChange(ADSRTypes.attack, parseFloat(e.target.value))}
              className="accent-slate-400 cursor-pointer w-full"
            />
          </div>

          {/* Decay */}
          <div className="flex flex-col gap-2 bg-synth-card border border-synth-border rounded-xl p-3">
            <div className="flex justify-between text-xs text-slate-300">
              <span>Decay</span>
              <span>{decay.toFixed(2)}s</span>
            </div>
            <input
              type="range"
              min="0.001"
              max="2.0"
              step="0.01"
              value={decay}
              onChange={(e) => handleAdsrChange(ADSRTypes.decay, parseFloat(e.target.value))}
              className="accent-slate-400 cursor-pointer w-full"
            />
          </div>

          {/* Sustain */}
          <div className="flex flex-col gap-1 bg-synth-card border border-synth-border rounded-xl p-3">
            <div className="flex justify-between text-xs text-slate-300">
              <span>Sustain</span>
              <span>{Math.round(sustain * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.01"
              value={sustain}
              onChange={(e) => handleAdsrChange(ADSRTypes.sustain, parseFloat(e.target.value))}
              className="accent-slate-400 cursor-pointer w-full"
            />
          </div>

          {/* Release */}
          <div className="flex flex-col gap-1 bg-synth-card border border-synth-border rounded-xl p-3">
            <div className="flex justify-between text-xs text-slate-300">
              <span>Release</span>
              <span>{release.toFixed(2)}s</span>
            </div>
            <input
              type="range"
              min="0.001"
              max="5.0"
              step="0.01"
              value={release}
              onChange={(e) => handleAdsrChange(ADSRTypes.release, parseFloat(e.target.value))}
              className="accent-slate-400 cursor-pointer w-full"
            />
          </div>

        </div>
      </Container>

      <div></div>
    </div>
  );
}