import { MenuSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface TitleBarProps extends React.HtmlHTMLAttributes<HTMLDivElement>{
    title?: string,
    textColor: "synth-app" | "synth-panel" | "synth-card" | "synth-card-hover" 
    | "synth-input" | "synth-border" | "synth-violet" | "synth-cyan" | "synth-purple" 
    | "synth-red" | "synth-text" | "synth-muted";
}

export default function CardTitleBar({title, textColor, className, ...props}: TitleBarProps) {
    return (
        <div className={cn("flex flex-row w-full p-2 justify-between items-center border-b border-white/10", className)}
            {...props}>
            <span className={`font-sans font-bold text-[1.25vw] text-${textColor ? textColor : "white"}`}>{title ? title : ""}</span>
            <MenuSquare className="opacity-50 hover:opacity-65 hover:scale-105 active:scale-95 transition duration-50 ease-in-out" />
        </div>
    )
}