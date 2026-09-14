import { List, Map } from "lucide-react";

interface ViewToggleProps {
    view: 'lista' | 'mapa';
    onChange: (view: 'lista' | 'mapa') => void;
}

export function ViewToggle({ view, onChange }: ViewToggleProps) {
    return (
        <div className="flex bg-card border-[1.5px] border-line rounded-lg p-[3px] shrink-0">
            <button
                onClick={() => onChange('lista')}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-md transition-colors ${view === 'lista' ? 'bg-night text-paper' : 'text-muted hover:text-night'
                    }`}
            >
                <List className="w-3.5 h-3.5" /> Lista
            </button>

            <button
                onClick={() => onChange('mapa')}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-md transition-colors ${view === 'mapa' ? 'bg-night text-paper' : 'text-muted hover:text-night'
                    }`}
            >
                <Map className="w-3.5 h-3.5" /> Mapa
            </button>
        </div>
    );
}
