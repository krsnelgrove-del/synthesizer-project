import Piano from "./keys/piano";
import RollWheel from "./rollWheel/rollWheel";
import KeyboardHeader from "./header/keyboardHeader";
import { Container } from "@/lib/container";
import { useKeyboardInput } from "@/app/hooks/useKeyboardInput";

export default function Keyboard() {
    useKeyboardInput();

    return (
        <Container as="div" variant="flex" className="flex flex-col w-full h-full p-2 gap-2">
            {/* Header */}
            <Container as="div" variant="default" className="h-1/5 w-full">
                <KeyboardHeader />
            </Container>

            {/* Content */}
            <Container as="div" variant="default" className="flex flex-row w-full h-full gap-2">
                {/* Roll Wheel */}
                <Container as="div" variant="default" className="w-1/10">
                    <RollWheel/>
                </Container>
                
                {/* Keys Container (MUST be relative to anchor absolute children) */}
                <Container as="div" variant="default" className="w-full h-full relative overflow-hidden">
                    
                    {/* 1. White Keys (Absolute background layer) */}
                    <Piano 
                        variant="white" 
                        className="absolute inset-0 w-full h-full"
                    />

                    {/* 2. Black Keys (Absolute top overlay layer spanning top 65%) */}
                    <div className="absolute top-0 left-0 h-[65%] w-full pointer-events-none z-20">
                        <Piano 
                            variant="black"
                            className="relative w-full h-full pointer-events-auto"
                        />
                    </div>

                </Container>
            </Container>
        </Container>
    );
}