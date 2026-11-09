import { Container } from "@/lib/container";
import ContentHeader from "./header/contentHeader";
import Keyboard from "./keyboard/keyboard";
import PianoRoll from "./pianoRoll/pianoRoll";
import SynthPanel from "./synthPanel/synthPanel";

export default function Content() {
    return (
        <Container as="div" variant="default" className="flex flex-col justify-between shrink-0 text-[1cqw] w-full h-full p-2 min-h-0">
            {/*Header*/}
            <Container as="div" variant="flex" className="flex justify-center items-center w-full min-h-1/24 max-h-3/24 shrink-0">
                <ContentHeader/>
            </Container>

            {/*Content Area*/}
            <Container as="div" variant="flex" className="flex flex-row p-2 gap-2 w-full h-7/12 min-h-0 min-w-0 overflow-hidden">
                {/*Engine*/}
                <Container as="div" variant="panel" className="flex justify-center p-4 w-1/4 h-full min-w-0 min-h-0 max-h-125 self-start overflow-auto">
                    <SynthPanel/>
                </Container>

                {/*Keyroll*/}
                <Container as="div" variant="panel" className="flex justify-center items-center w-3/4 h-full min-w-0 min-h-0 self-end verflow-auto">
                    <PianoRoll/>
                </Container>
            </Container>

            {/* Keyboard Area */}
            <Container as="div" variant="flex" className="flex flex-row p-2 gap-2 w-full h-full min-h-0 max-h-7/24 overflow-hidden">
                <Container as="div" variant="panel" className="flex justify-center items-center w-full h-full min-w-0 min-h-0 overflow-auto">
                    <Keyboard/>
                </Container>
            </Container>
        </Container>
    )
}
