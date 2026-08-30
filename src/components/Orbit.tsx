import { useState } from 'react';
import { CheckCircle, Target, Repeat, FolderOpen, BookOpen, Timer, Sun } from 'lucide-react';

export interface OrbitNode {
  key: string;
  label: string;
  icon: typeof CheckCircle;
  color: string;
  count?: number;
}

interface OrbitProps {
  nodes: OrbitNode[];
  onNodeClick?: (key: string) => void;
  size?: number;
  interactive?: boolean;
}

export default function Orbit({ nodes, onNodeClick, size = 360, interactive = true }: OrbitProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const center = size / 2;
  const radius = size * 0.36;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Orbit rings */}
      <svg className="absolute inset-0" width={size} height={size}>
        <circle cx={center} cy={center} r={radius} fill="none" stroke="var(--border-soft)" strokeWidth="1" strokeDasharray="3 6" />
        <circle cx={center} cy={center} r={radius * 0.65} fill="none" stroke="var(--border-soft)" strokeWidth="1" strokeDasharray="2 5" opacity="0.5" />
      </svg>

      {/* Connecting lines */}
      <svg className="absolute inset-0" width={size} height={size}>
        {nodes.map((node, i) => {
          const angle = (i / nodes.length) * 2 * Math.PI - Math.PI / 2;
          const x = center + Math.cos(angle) * radius;
          const y = center + Math.sin(angle) * radius;
          const isActive = hovered === node.key;
          return (
            <line
              key={node.key}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke={isActive ? node.color : 'var(--border-soft)'}
              strokeWidth={isActive ? 2 : 1}
              strokeDasharray="4 4"
              style={{ transition: 'stroke 0.3s ease, stroke-width 0.3s ease' }}
            />
          );
        })}
      </svg>

      {/* Center node */}
      <div
        className="absolute z-10 flex flex-col items-center justify-center rounded-full orbit-pulse"
        style={{
          width: 72, height: 72,
          background: 'var(--accent-sage)',
          color: 'white',
        }}
      >
        <Sun size={22} />
        <span className="text-xs font-semibold mt-0.5">TODAY</span>
      </div>

      {/* Orbiting nodes */}
      {nodes.map((node, i) => {
        const angle = (i / nodes.length) * 2 * Math.PI - Math.PI / 2;
        const x = center + Math.cos(angle) * radius;
        const y = center + Math.sin(angle) * radius;
        const isHovered = hovered === node.key;
        const Icon = node.icon;
        return (
          <button
            key={node.key}
            onMouseEnter={() => interactive && setHovered(node.key)}
            onMouseLeave={() => interactive && setHovered(null)}
            onClick={() => onNodeClick?.(node.key)}
            className="absolute z-20 flex flex-col items-center justify-center rounded-full transition-all duration-300"
            style={{
              left: x, top: y,
              transform: 'translate(-50%, -50%)',
              width: isHovered ? 64 : 54,
              height: isHovered ? 64 : 54,
              background: 'var(--bg-card)',
              border: `2px solid ${isHovered ? node.color : 'var(--border-soft)'}`,
              boxShadow: isHovered ? `0 0 20px ${node.color}40` : 'var(--shadow-soft)',
              cursor: interactive ? 'pointer' : 'default',
            }}
          >
            <Icon size={isHovered ? 22 : 18} style={{ color: node.color }} />
            <span
              className="text-[10px] font-medium mt-0.5 whitespace-nowrap"
              style={{ color: 'var(--text-secondary)' }}
            >
              {node.label}
            </span>
            {node.count !== undefined && (
              <span
                className="absolute -top-1 -right-1 text-[9px] font-bold rounded-full px-1.5 py-0.5 text-white"
                style={{ background: node.color }}
              >
                {node.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
