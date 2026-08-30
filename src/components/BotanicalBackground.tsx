export default function BotanicalBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
      {/* Top-left leaves */}
      <svg className="absolute -top-8 -left-8 w-64 h-64 opacity-[0.07] dark:opacity-[0.05]" viewBox="0 0 200 200" fill="none">
        <path d="M20,180 Q20,80 100,40 Q180,80 180,180" stroke="currentColor" strokeWidth="1.5" className="text-sage-600" />
        <path d="M30,170 Q50,120 80,100" stroke="currentColor" strokeWidth="1" className="text-sage-500" />
        <path d="M170,170 Q150,120 120,100" stroke="currentColor" strokeWidth="1" className="text-sage-500" />
        <ellipse cx="60" cy="130" rx="14" ry="5" fill="currentColor" className="text-sage-400" transform="rotate(-30 60 130)" />
        <ellipse cx="140" cy="130" rx="14" ry="5" fill="currentColor" className="text-sage-400" transform="rotate(30 140 130)" />
        <ellipse cx="95" cy="80" rx="12" ry="4" fill="currentColor" className="text-sage-400" transform="rotate(-60 95 80)" />
      </svg>

      {/* Bottom-right leaves */}
      <svg className="absolute -bottom-12 -right-12 w-80 h-80 opacity-[0.07] dark:opacity-[0.05]" viewBox="0 0 200 200" fill="none">
        <path d="M20,20 Q20,120 100,160 Q180,120 180,20" stroke="currentColor" strokeWidth="1.5" className="text-sage-600" />
        <path d="M30,30 Q50,80 80,100" stroke="currentColor" strokeWidth="1" className="text-sage-500" />
        <path d="M170,30 Q150,80 120,100" stroke="currentColor" strokeWidth="1" className="text-sage-500" />
        <ellipse cx="60" cy="70" rx="14" ry="5" fill="currentColor" className="text-sage-400" transform="rotate(30 60 70)" />
        <ellipse cx="140" cy="70" rx="14" ry="5" fill="currentColor" className="text-sage-400" transform="rotate(-30 140 70)" />
      </svg>

      {/* Top-right small flower */}
      <svg className="absolute top-10 right-10 w-32 h-32 opacity-[0.06] dark:opacity-[0.04]" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="6" className="fill-blush-400" />
        <ellipse cx="50" cy="30" rx="8" ry="14" className="fill-blush-300" />
        <ellipse cx="50" cy="70" rx="8" ry="14" className="fill-blush-300" />
        <ellipse cx="30" cy="50" rx="14" ry="8" className="fill-blush-300" />
        <ellipse cx="70" cy="50" rx="14" ry="8" className="fill-blush-300" />
        <ellipse cx="36" cy="36" rx="10" ry="6" className="fill-lavender-300" transform="rotate(-45 36 36)" />
        <ellipse cx="64" cy="36" rx="10" ry="6" className="fill-lavender-300" transform="rotate(45 64 36)" />
        <ellipse cx="36" cy="64" rx="10" ry="6" className="fill-lavender-300" transform="rotate(45 36 64)" />
        <ellipse cx="64" cy="64" rx="10" ry="6" className="fill-lavender-300" transform="rotate(-45 64 64)" />
      </svg>

      {/* Bottom-left small flower */}
      <svg className="absolute bottom-10 left-10 w-28 h-28 opacity-[0.06] dark:opacity-[0.04]" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="5" className="fill-lavender-400" />
        <ellipse cx="50" cy="32" rx="7" ry="12" className="fill-lavender-300" />
        <ellipse cx="50" cy="68" rx="7" ry="12" className="fill-lavender-300" />
        <ellipse cx="32" cy="50" rx="12" ry="7" className="fill-lavender-300" />
        <ellipse cx="68" cy="50" rx="12" ry="7" className="fill-lavender-300" />
      </svg>

      {/* Floating petals */}
      <div className="absolute top-1/4 left-[8%] w-3 h-3 rounded-full bg-blush-300/20 animate-float-slow" />
      <div className="absolute top-1/3 right-[12%] w-2 h-2 rounded-full bg-lavender-300/20 animate-float-med" />
      <div className="absolute bottom-1/4 left-[15%] w-2.5 h-2.5 rounded-full bg-sage-300/20 animate-float-slow" />
      <div className="absolute bottom-1/3 right-[8%] w-3 h-3 rounded-full bg-blush-200/20 animate-float-med" />
    </div>
  );
}
