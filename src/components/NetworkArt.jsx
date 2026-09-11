const LAYOUTS = {
  full: {
    points: [
      [13, 23],
      [30, 11],
      [51, 19],
      [78, 12],
      [89, 40],
      [74, 74],
      [47, 87],
      [18, 75],
      [8, 49],
      [40, 47],
    ],
    edges: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 6],
      [6, 7],
      [7, 8],
      [8, 0],
      [0, 9],
      [2, 9],
      [5, 9],
      [7, 9],
      [9, 4],
    ],
  },
  compact: {
    points: [
      [18, 28],
      [43, 12],
      [73, 26],
      [83, 63],
      [52, 80],
      [22, 68],
    ],
    edges: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 0],
      [0, 3],
      [1, 4],
    ],
  },
};

export default function NetworkArt({ variant = "full", label = "Rede visual de sinais e relações entre ameaças" }) {
  const { points, edges } = LAYOUTS[variant] ?? LAYOUTS.full;
  const coreIndex = points.length - 1;

  return (
    <svg
      className={`network-art ${variant === "compact" ? "network-art-compact" : ""}`}
      viewBox="0 0 100 100"
      role="img"
      aria-label={label}
    >
      <defs>
        <radialGradient id={`core-glow-${variant}`}>
          <stop offset="0" stopColor="#93f5b0" stopOpacity=".35" />
          <stop offset="1" stopColor="#93f5b0" stopOpacity="0" />
        </radialGradient>
        <filter id={`soft-glow-${variant}`}>
          <feGaussianBlur stdDeviation=".8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <circle cx="50" cy="50" r="30" fill={`url(#core-glow-${variant})`} />
      {edges.map(([a, b]) => (
        <line
          key={`${a}-${b}`}
          className="network-edge"
          x1={points[a][0]}
          y1={points[a][1]}
          x2={points[b][0]}
          y2={points[b][1]}
        />
      ))}
      {points.map(([x, y], index) => (
        <g key={`${x}-${y}`} className={`network-node node-${index}`} filter={`url(#soft-glow-${variant})`}>
          <circle cx={x} cy={y} r={index === coreIndex ? 2.3 : 1.35} />
          <circle className="node-ring" cx={x} cy={y} r="4" />
        </g>
      ))}
      <circle className="network-scan" cx="50" cy="50" r="38" />
    </svg>
  );
}
