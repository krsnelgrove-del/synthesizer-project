import { IconButton as IconButton } from '@/lib/iconButton';
import { Sliders, Settings, Save, User } from 'lucide-react';

export default function Sidebar() {
    return (
        <aside className="w-16 h-full bg-synth-panel border-r border-synth-border flex flex-col justify-between items-center py-6 select-none">
            {/* Top Navigation / Tool Icons */}
            <div className="flex flex-col items-center gap-4">
                <IconButton variant="default" aria-label="Oscillator View" className="w-10 h-10 rounded-xl bg-synth-card border border-synth-border flex items-center justify-center text-synth-text shadow-sm hover:border-synth-violet transition-colors">
                    <Sliders size={20} />
                </IconButton>
                <IconButton variant="default" aria-label="Export" className="w-10 h-10 rounded-xl bg-synth-card border border-synth-border flex items-center justify-center text-synth-text shadow-sm hover:border-synth-violet transition-colors">
                    <Save size={20} />
                </IconButton>
                 <IconButton variant="default" aria-label="Settings" className="w-10 h-10 rounded-xl bg-synth-card border border-synth-border flex items-center justify-center text-synth-text shadow-sm hover:border-synth-violet transition-colors">
                    <Settings size={20} />
                </IconButton>
            </div>

            {/* Bottom Profile / Settings Icon */}
            <div className="flex flex-col items-center">
                <IconButton variant="default" aria-label="User Settings" className="w-10 h-10 rounded-xl flex items-center justify-center text-synth-muted hover:text-synth-text hover:bg-synth-card-hover transition-colors">
                    <User size={20} />
                </IconButton>
            </div>
        </aside>
    );
}