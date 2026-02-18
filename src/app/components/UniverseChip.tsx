import { Universe } from '../data/mockData';

interface UniverseChipProps {
  universe: Universe;
  onClick?: () => void;
}

export function UniverseChip({ universe, onClick }: UniverseChipProps) {
  return (
    <button
      onClick={onClick}
      className="group relative flex-shrink-0 flex flex-col items-center gap-3 p-5 min-w-[140px] rounded-xl overflow-hidden transition-all duration-300 hover:scale-110 hover:-translate-y-2 border-4 border-slate-700 hover:border-yellow-400 bg-slate-800"
    >
      {/* Comic book glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/0 to-red-500/0 group-hover:from-yellow-400/20 group-hover:to-red-500/20 transition-all" />
      
      {/* Halftone pattern */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-10" 
           style={{ 
             backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
             backgroundSize: '8px 8px'
           }} 
      />
      
      {/* Icon with bold outline */}
      <div className="relative">
        <div className="text-5xl filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform">
          {universe.icon}
        </div>
      </div>
      
      <div className="relative text-sm font-black text-white text-center group-hover:text-yellow-400 transition-colors uppercase tracking-wide">
        {universe.name}
      </div>
      
      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-yellow-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}