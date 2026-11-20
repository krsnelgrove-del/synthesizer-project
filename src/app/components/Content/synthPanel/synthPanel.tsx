//will eventually refactor and seperate large rendering code into sub-components for reusability.

"use client";

import Image from "next/image";
import { Container } from "@/lib/container";
import { synthParameters } from "@/app/classes/audioEngine";
import { PARAMETER_TYPE, PARAMETER_LABEL } from "@/(utils)/synthParameterUtils";
import { useSyncExternalStore } from "react";
import CustomKnob from "../../customInputs/CustomKnob";
import CardTitleBar from "../../textFields/cardTitleBar";
import { useSynthStore } from "@/(utils)/synthStore";

const waveformIcons: Record<OscillatorType, string> = {
  sine: "sine.svg",
  sawtooth: "sawtooth.svg",
  triangle: "triangle.svg",
  square: "square.svg",
  custom: "sine.svg",
};

// Safe fallback snapshot for SSR hydration
const serverSnapshot = {
  attack: 0.01,
  decay: 0.05,
  sustain: 0.3,
  release: 1.0,
  reverbWet: 0.5,
  delayWet: 0.4,
  delayTime: 0.5,
  distortWet: 1.0,
  distortionDrive: 100.0,
  waveform: "sine" as OscillatorType,
};

interface SynthProps {
  synthID: string;
}

export default function SynthPanel({ synthID }: SynthProps) {
  const synth = useSynthStore((state) => state.getSynthById(synthID));
  const oscillatorTypes: OscillatorType[] = ["sine", "sawtooth", "triangle", "square"];
  
  const state = useSyncExternalStore(
    synth?.subscribe ?? (() => () => {}),
    synth?.getSnapshot ?? (() => serverSnapshot),
    () => serverSnapshot
  );

  const handleOscillatorTypeClick = (oscillatorType: OscillatorType) => {
    synth?.setOscillatorWaveform(oscillatorType);
  };

  const handleParameterChange = (target: PARAMETER_LABEL, value: number) => {
    synth?.setSynthParameter(target, value);
  };

  const getSnapshotValue = (type: PARAMETER_LABEL): number => {
    switch (type) {
      case PARAMETER_LABEL.Attack: return state.attack;
      case PARAMETER_LABEL.Decay: return state.decay;
      case PARAMETER_LABEL.Sustain: return state.sustain;
      case PARAMETER_LABEL.Release: return state.release;
      case PARAMETER_LABEL.ReverbWet: return state.reverbWet;
      case PARAMETER_LABEL.DelayWet: return state.delayWet;
      case PARAMETER_LABEL.DelayTime: return state.delayTime;
      case PARAMETER_LABEL.DistortionWet: return state.distortWet;
      case PARAMETER_LABEL.DistortionDrive: return state.distortionDrive;
      default: return 0;
    }
  };

  return (
    <div className="flex flex-col w-full h-full p-0 pb-2 gap-2">
      <CardTitleBar title={`SYNTH: ${synthID.toUpperCase()}`} textColor="synth-text" />

      {/* Oscillator */}
      <Container as="div" variant="panel">
        <div className="flex flex-row justify-between pb-2">
          <span>Oscillator</span>
        </div>
        <div className="flex flex-col w-full h-auto p-2">
          <div className="flex flex-row w-full justify-between gap-0 font-geist-sans">
            {oscillatorTypes.map((type, index) => {
              const isSelected = type === state.waveform;
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

      {/* ADSR Settings */}
      <Container as="div" variant="panel">
        <div className="flex flex-row justify-between pb-2">
          <span>ADSR Envelope</span>
        </div>
        <div className="flex flex-col w-full h-auto p-2 gap-2">
          {synthParameters.filter(item => item.parameterTarget.typeOfParameter === PARAMETER_TYPE.ADSR).map((item) => {
            return (
              <div key={item.parameterName} className="flex flex-col gap-2 bg-synth-card border border-synth-border rounded-xl p-2">
                <CustomKnob 
                  title={item.parameterName} 
                  value={getSnapshotValue(item.parameterTarget.target)} 
                  parameterTarget={item} 
                  min={item.minValue} 
                  max={item.maxValue} 
                  step={item.step} 
                  onChange={(target, val) => handleParameterChange(target.parameterTarget.target, val)}
                />
              </div>
            );
          })}
        </div>
      </Container>

      {/* Effects Settings */}
      <Container as="div" variant="panel">
        <div className="flex flex-row justify-between pb-2">
          <span>Effects</span>
        </div>
        <div className="flex flex-col w-full h-auto p-2 gap-2">
          {synthParameters.filter(item => item.parameterTarget.typeOfParameter === PARAMETER_TYPE.Effect).map((item) => {
            return (
              <div key={item.parameterName} className="flex flex-col gap-2 bg-synth-card border border-synth-border rounded-xl p-2">
                <CustomKnob 
                  title={item.parameterName} 
                  value={getSnapshotValue(item.parameterTarget.target)} 
                  parameterTarget={item} 
                  min={item.minValue} 
                  max={item.maxValue} 
                  step={item.step} 
                  onChange={(target, val) => handleParameterChange(target.parameterTarget.target, val)}
                />
              </div>
            );
          })}
        </div>
      </Container>
    </div>
  );
}