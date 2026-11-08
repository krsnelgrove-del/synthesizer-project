import { MenuSquare } from "lucide-react"

export default function KeyboardHeader() {
    return (
        <div className="flex flex-row justify-between">
            <span className="font-sans font-bold text-[1.25vw]">VIRTUAL KEYBOARD</span>
                <MenuSquare className="opacity-50 hover:opacity-65 hover:scale-105 active:scale-95 transition duraiton-50 ease-in-out"/>
            </div>
    )
}