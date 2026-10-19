interface GaugeProps {
  score: number;
  size?: number;
}

function getRisk(score: number) {
  if (score >= 80) return { label: 'Bajo Riesgo', color: '#2d9e6b', bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' };
  if (score >= 60) return { label: 'Riesgo Medio', color: '#e8a020', bg: 'bg-yellow-50', text: 'text-yellow-700', dot: 'bg-yellow-500' };
  if (score >= 40) return { label: 'Riesgo Alto', color: '#C8102E', bg: 'bg-red-50', text: 'text-red-800', dot: 'bg-red-600' };
  return { label: score === 0 ? 'Sin datos' : 'Riesgo Crítico', color: '#8b0000', bg: 'bg-red-100', text: 'text-red-900', dot: 'bg-red-800' };
}

export default function Gauge({ score, size = 192 }: GaugeProps) {
  const radius = 80;
  const strokeWidth = 12;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * Math.PI * 2;
  const strokeDashoffset = circumference * (1 - score / 100);
  const risk = getRisk(score);

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size * 0.65 }}>
        <svg width={size} height={size} viewBox={`0 0 ${radius * 2} ${radius * 2}`}
          className="transform -rotate-90" style={{ originX: '50%', originY: '50%' }}>
          <circle cx={radius} cy={radius} r={normalizedRadius} fill="none"
            stroke="#dff4ff" strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`} strokeLinecap="round" />
          <circle cx={radius} cy={radius} r={normalizedRadius} fill="none"
            stroke={risk.color} strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset} strokeLinecap="round"
            className="transition-all duration-1000 ease-out" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
          <span className="text-5xl font-extrabold text-on-surface tracking-tighter">{score}</span>
          <span className="text-[10px] text-on-surface/40 font-bold -mt-1 tracking-widest uppercase">DE 100</span>
        </div>
      </div>
      <div className={`mt-2 inline-flex items-center gap-2 px-6 py-2 rounded-full font-bold text-xs shadow-sm ${risk.bg} ${risk.text}`}>
        <div className={`w-2 h-2 rounded-full ${risk.dot} animate-pulse`} />
        {risk.label}
      </div>
    </div>
  );
}
