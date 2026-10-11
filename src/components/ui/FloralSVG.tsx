// Decorative inline SVG botanical elements - hidden from screen readers

export function FloralCorner({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M10,10 Q30,5 50,20 Q70,35 60,60 Q50,85 30,80 Q10,75 8,55 Q6,35 10,10Z"
        fill="none"
        stroke="#B69659"
        strokeWidth="0.8"
        opacity="0.6"
      />
      <circle cx="55" cy="58" r="5" fill="#E5AA46" opacity="0.35" />
      <path
        d="M20,20 Q25,15 35,25 Q30,35 20,30 Z"
        fill="#D59A91"
        opacity="0.4"
      />
      <path
        d="M35,10 Q45,8 50,18 Q40,25 32,18 Z"
        fill="#A8B69D"
        opacity="0.45"
      />
      <path
        d="M5,40 Q2,55 15,60 Q20,50 12,42 Z"
        fill="#E5AA46"
        opacity="0.3"
      />
      <path
        d="M60,15 Q70,10 75,22 Q65,28 58,20 Z"
        fill="#D59A91"
        opacity="0.35"
      />
      <line x1="10" y1="10" x2="60" y2="60" stroke="#B69659" strokeWidth="0.5" opacity="0.3" strokeDasharray="3 4" />
    </svg>
  );
}

export function FloralDivider() {
  return (
    <div aria-hidden="true" className="flex items-center justify-center gap-3 my-2">
      <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, transparent, rgba(182,150,89,0.35))" }} />
      <svg viewBox="0 0 40 20" width="40" height="20" fill="none">
        <circle cx="20" cy="10" r="3" fill="#E5AA46" opacity="0.6" />
        <circle cx="10" cy="10" r="2" fill="#D59A91" opacity="0.5" />
        <circle cx="30" cy="10" r="2" fill="#D59A91" opacity="0.5" />
        <path d="M4,10 Q7,5 10,10 Q13,15 16,10" stroke="#B69659" strokeWidth="0.8" fill="none" opacity="0.5" />
        <path d="M24,10 Q27,5 30,10 Q33,15 36,10" stroke="#B69659" strokeWidth="0.8" fill="none" opacity="0.5" />
      </svg>
      <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, rgba(182,150,89,0.35), transparent)" }} />
    </div>
  );
}

export function JhrokhaSVG({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 200 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Arch */}
      <path
        d="M30,260 L30,100 Q30,30 100,30 Q170,30 170,100 L170,260"
        fill="none"
        stroke="#B69659"
        strokeWidth="1.5"
        opacity="0.5"
      />
      {/* Inner arch */}
      <path
        d="M50,260 L50,110 Q50,55 100,55 Q150,55 150,110 L150,260"
        fill="none"
        stroke="#B69659"
        strokeWidth="1"
        opacity="0.35"
      />
      {/* Top finial */}
      <circle cx="100" cy="28" r="8" fill="#E5AA46" opacity="0.4" />
      <path d="M92,20 Q100,10 108,20" fill="#E5AA46" opacity="0.3" />
      {/* Side panels */}
      <rect x="30" y="180" width="20" height="80" fill="none" stroke="#B69659" strokeWidth="0.8" opacity="0.25" />
      <rect x="150" y="180" width="20" height="80" fill="none" stroke="#B69659" strokeWidth="0.8" opacity="0.25" />
      {/* Lattice */}
      <path d="M55,120 Q100,110 145,120" stroke="#B69659" strokeWidth="0.8" opacity="0.3" fill="none" />
      <path d="M55,140 Q100,130 145,140" stroke="#B69659" strokeWidth="0.8" opacity="0.3" fill="none" />
    </svg>
  );
}

export function SparklesSVG() {
  return (
    <svg aria-hidden="true" viewBox="0 0 100 100" width="100" height="100" fill="none">
      <path d="M50,10 L53,42 L85,38 L55,50 L85,62 L53,58 L50,90 L47,58 L15,62 L45,50 L15,38 L47,42 Z" fill="#E5AA46" opacity="0.35" />
      <circle cx="50" cy="50" r="4" fill="#E5AA46" opacity="0.6" />
      <circle cx="25" cy="25" r="2" fill="#D59A91" opacity="0.5" />
      <circle cx="75" cy="25" r="2" fill="#D59A91" opacity="0.5" />
      <circle cx="25" cy="75" r="2" fill="#D59A91" opacity="0.5" />
      <circle cx="75" cy="75" r="2" fill="#D59A91" opacity="0.5" />
    </svg>
  );
}
