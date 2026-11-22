//handles page rendering and instantiating synth state && gesture input for audioContext resume.

"use client"

import { useEffect } from "react";
import Content from "../components/Content/content";
import Sidebar from "../components/sidebar/sideBar";
import { Container } from "@/lib/container";
import { useSynthStore } from "@/(utils)/synthStore";

export default function Home() {
  const _synthID = "000";
  const initializedSynth = useSynthStore((state) =>  {state.initializeEngine(_synthID); return state.getSynthById(_synthID)});

  useEffect(() => {

    const handleFirstGesture = async () => {
      try {
        const context = initializedSynth?.getAudioContext();
        if (context && context.state === 'suspended') {
          await context.resume();
          console.log("AudioContext successfully resumed via user gesture.");
        }

      } catch (err) {
        console.error("Failed to auto-resume audio context:", err);
      }
    };

    window.addEventListener("pointerdown", handleFirstGesture, { once: true });
    window.addEventListener("keydown", handleFirstGesture, { once: true });

    return () => {
      window.removeEventListener("pointerdown", handleFirstGesture);
      window.removeEventListener("keydown", handleFirstGesture);
    };
  }, [_synthID]);


  return (
    <Container 
      as="div" 
      variant="default" 
      className="bg-synth-app flex flex-row w-full h-screen overflow-hidden"
    >
      <Container as="div" className="flex w-[5%] h-full">
        <Sidebar />
      </Container>

      {/* Main Content */}
      <Container as="div" variant="default" className="w-[95%] h-full overflow-y-auto">
        <Content synthID={_synthID}/>
      </Container>
    </Container>
  );
}