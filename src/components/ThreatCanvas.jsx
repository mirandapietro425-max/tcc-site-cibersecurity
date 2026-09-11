import { useEffect, useRef } from "react";

const TONES = {
  mint: "#93f5b0",
  cyan: "#83e6ed",
  violet: "#b7a4ff",
  orange: "#ffad70",
  red: "#ff7777",
};

function prefersReducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

/**
 * Simulação educativa: os pulsos representam o comportamento das ameaças
 * estudadas no TCC, não telemetria real de ataques.
 */
export default function ThreatCanvas({ nodes, activeId, onSelect }) {
  const canvasRef = useRef(null);
  const stateRef = useRef({ pulses: [], hover: null });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    const reduced = prefersReducedMotion();
    let frame = 0;
    let raf = 0;

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const center = () => {
      const { width, height } = canvas.getBoundingClientRect();
      return { cx: width / 2, cy: height / 2, width, height };
    };

    const nodePosition = (node, width, height) => ({
      x: (node.origin[0] / 100) * width,
      y: (node.origin[1] / 100) * height,
    });

    const spawn = () => {
      const node = nodes[Math.floor(Math.random() * nodes.length)];
      stateRef.current.pulses.push({ node, progress: 0, speed: 0.004 + Math.random() * 0.004 });
      if (stateRef.current.pulses.length > 14) stateRef.current.pulses.shift();
    };

    const draw = () => {
      const { cx, cy, width, height } = center();
      ctx.clearRect(0, 0, width, height);

      ctx.strokeStyle = "rgba(147, 245, 176, 0.08)";
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 46) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 46) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const radarR = Math.min(width, height) * 0.36;
      ctx.strokeStyle = "rgba(147, 245, 176, 0.22)";
      [0.45, 0.72, 1].forEach((scale) => {
        ctx.beginPath();
        ctx.arc(cx, cy, radarR * scale, 0, Math.PI * 2);
        ctx.stroke();
      });

      if (!reduced) {
        const angle = (frame / 150) % (Math.PI * 2);
        const gradient = ctx.createLinearGradient(cx, cy, cx + Math.cos(angle) * radarR, cy + Math.sin(angle) * radarR);
        gradient.addColorStop(0, "rgba(147, 245, 176, 0.35)");
        gradient.addColorStop(1, "rgba(147, 245, 176, 0)");
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(angle) * radarR, cy + Math.sin(angle) * radarR);
        ctx.stroke();
        ctx.lineWidth = 1;
      }

      stateRef.current.pulses.forEach((pulse) => {
        const { x, y } = nodePosition(pulse.node, width, height);
        const color = TONES[pulse.node.tone] ?? TONES.mint;
        const t = pulse.progress;
        const px = x + (cx - x) * t;
        const py = y + (cy - y) * t - Math.sin(t * Math.PI) * 42;

        ctx.strokeStyle = `${color}44`;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.quadraticCurveTo((x + cx) / 2, (y + cy) / 2 - 42, px, py);
        ctx.stroke();

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(px, py, 2.6, 0, Math.PI * 2);
        ctx.fill();
        pulse.progress += reduced ? 0 : pulse.speed;
      });
      stateRef.current.pulses = stateRef.current.pulses.filter((pulse) => pulse.progress < 1);

      nodes.forEach((node) => {
        const { x, y } = nodePosition(node, width, height);
        const color = TONES[node.tone] ?? TONES.mint;
        const isActive = node.id === activeId || node.id === stateRef.current.hover;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, isActive ? 6 : 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = isActive ? color : `${color}55`;
        ctx.beginPath();
        ctx.arc(x, y, isActive ? 13 : 9, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = isActive ? "#e9f4f1" : "rgba(233, 244, 241, 0.62)";
        ctx.font = "10px 'Space Mono', monospace";
        ctx.fillText(node.title.toUpperCase(), x + 16, y + 4);
      });

      ctx.fillStyle = "rgba(147, 245, 176, 0.9)";
      ctx.font = "10px 'Space Mono', monospace";
      ctx.fillText("SIMULAÇÃO EDUCATIVA · SEM DADOS REAIS", 14, height - 14);

      frame += 1;
      if (!reduced && frame % 46 === 0) spawn();
      raf = window.requestAnimationFrame(draw);
    };

    spawn();
    draw();

    const pick = (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      return nodes.find((node) => {
        const pos = nodePosition(node, rect.width, rect.height);
        return Math.hypot(pos.x - x, pos.y - y) < 22;
      });
    };

    const onMove = (event) => {
      const node = pick(event);
      stateRef.current.hover = node?.id ?? null;
      canvas.style.cursor = node ? "pointer" : "default";
    };
    const onClick = (event) => {
      const node = pick(event);
      if (node) onSelect(node.id);
    };

    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("click", onClick);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("click", onClick);
    };
  }, [nodes, activeId, onSelect]);

  return (
    <canvas
      ref={canvasRef}
      className="threat-canvas"
      role="img"
      aria-label="Visualização animada das ameaças estudadas convergindo para um alvo. Simulação educativa, sem dados reais."
    />
  );
}
