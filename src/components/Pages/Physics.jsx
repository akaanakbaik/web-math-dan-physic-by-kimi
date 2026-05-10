import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Info, ChevronUp } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import {
  gravitationalForce,
  lorentzFactor,
  eventHorizonRadius,
  hawkingTemperature,
  schrodingerPsi,
  PHYSICS_CONSTANTS,
  formatNumber,
} from '@/lib/utils';
import { getPhysicsSimulationInsight } from '@/lib/api';

const tabs = [
  { id: 'gravity', label: 'Gravitasi N-Body', formula: 'F = Gm₁m₂/r²' },
  { id: 'quantum', label: 'Oscilator Harmonik', formula: 'ψₙ(x,t) = √(2/L) sin(nπx/L) e^(-iEₙt/ℏ)' },
  { id: 'blackhole', label: 'Lubang Hitam', formula: 'rₛ = 2GM/c²' },
  { id: 'relativity', label: 'Relativitas', formula: 'γ = 1/√(1-v²/c²)' },
];

export default function Physics() {
  const [activeTab, setActiveTab] = useState('gravity');
  const [isPlaying, setIsPlaying] = useState(false);
  const [params, setParams] = useState({
    m1: 1000,
    m2: 500,
    r: 200,
    v: 0.5,
    M: 1e30,
    n: 1,
    L: 1,
  });
  const [explanation, setExplanation] = useState('');
  const [showExplanation, setShowExplanation] = useState(false);
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const { addNotification } = useAppStore();

  useEffect(() => {
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  useEffect(() => {
    if (isPlaying) {
      const loop = () => {
        draw();
        animRef.current = requestAnimationFrame(loop);
      };
      loop();
    } else {
      draw();
    }
  }, [isPlaying, activeTab, params]);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, w, h);

    if (activeTab === 'gravity') drawGravity(ctx, w, h);
    else if (activeTab === 'quantum') drawQuantum(ctx, w, h);
    else if (activeTab === 'blackhole') drawBlackHole(ctx, w, h);
    else if (activeTab === 'relativity') drawRelativity(ctx, w, h);
  };

  const drawGravity = (ctx, w, h) => {
    const cx = w / 2;
    const cy = h / 2;
    const F = gravitationalForce(params.m1, params.m2, params.r);
    const scale = Math.min(w, h) / 600;

    ctx.fillStyle = '#00d4ff';
    ctx.beginPath();
    ctx.arc(cx - params.r * scale * 0.3, cy, Math.sqrt(params.m1) * scale * 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#00d4ff';
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#ff00a0';
    ctx.beginPath();
    ctx.arc(cx + params.r * scale * 0.3, cy, Math.sqrt(params.m2) * scale * 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff00a0';
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(cx - params.r * scale * 0.3, cy);
    ctx.lineTo(cx + params.r * scale * 0.3, cy);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '10px JetBrains Mono';
    ctx.fillText(`F = ${formatNumber(F, 3)} N`, cx - 40, cy - 20);
  };

  const drawQuantum = (ctx, w, h) => {
    const n = params.n;
    const L = params.L;
    const t = Date.now() / 1000;
    ctx.strokeStyle = '#00ff88';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let x = 0; x < w; x++) {
      const xi = (x / w) * L;
      const psi = schrodingerPsi(xi, t, n, L, PHYSICS_CONSTANTS.me, PHYSICS_CONSTANTS.hbar);
      const y = h / 2 - psi.prob * h * 0.4;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    ctx.fillStyle = 'rgba(0, 255, 136, 0.1)';
    ctx.beginPath();
    for (let x = 0; x < w; x++) {
      const xi = (x / w) * L;
      const psi = schrodingerPsi(xi, t, n, L, PHYSICS_CONSTANTS.me, PHYSICS_CONSTANTS.hbar);
      const y = h / 2 - psi.prob * h * 0.4;
      if (x === 0) ctx.moveTo(x, h);
      else ctx.lineTo(x, y);
    }
    ctx.lineTo(w, h);
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '10px JetBrains Mono';
    ctx.fillText(`n = ${n}`, 10, 20);
  };

  const drawBlackHole = (ctx, w, h) => {
    const rs = eventHorizonRadius(params.M);
    const cx = w / 2;
    const cy = h / 2;
    const scale = Math.min(w, h) / (rs * 4 + 100);

    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, rs * scale * 2);
    grad.addColorStop(0, '#000');
    grad.addColorStop(0.4, '#0a0a0f');
    grad.addColorStop(0.7, '#1a0a1a');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = '#ff1744';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, rs * scale, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '10px JetBrains Mono';
    ctx.fillText(`rₛ = ${formatNumber(rs / 1000, 2)} km`, 10, 20);
    ctx.fillText(`T_H = ${formatNumber(hawkingTemperature(params.M), 3)} K`, 10, 35);
  };

  const drawRelativity = (ctx, w, h) => {
    const v = params.v * PHYSICS_CONSTANTS.c;
    const gamma = lorentzFactor(v);
    const cx = w / 2;
    const cy = h / 2;

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.strokeRect(cx - 50, cy - 50, 100, 100);

    ctx.fillStyle = '#ffd700';
    ctx.fillRect(cx - 50 / gamma, cy - 50, 100 / gamma, 100);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '10px JetBrains Mono';
    ctx.fillText(`v = ${formatNumber(params.v, 3)}c`, 10, 20);
    ctx.fillText(`γ = ${formatNumber(gamma, 4)}`, 10, 35);
    ctx.fillText(`L = L₀/γ`, 10, 50);
  };

  const handleExplain = async () => {
    setLoading(true);
    try {
      const tab = tabs.find((t) => t.id === activeTab);
      const res = await getPhysicsSimulationInsight(tab.label, params);
      setExplanation(res.data?.response || 'Analisis tidak tersedia.');
      setShowExplanation(true);
    } catch {
      setExplanation('Gagal memuat penjelasan AI.');
      setShowExplanation(true);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">Fisika Teoritis</h1>
        <p className="text-xs text-muted-foreground">Simulasi real-time dengan konstanta fisika akurat</p>
      </div>

      <div className="flex gap-1 overflow-x-auto hide-scrollbar rounded-lg bg-white/[0.02] p-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setActiveTab(t.id);
              setIsPlaying(false);
              addNotification({ type: 'info', title: 'Simulasi', message: `Memuat ${t.label}` });
            }}
            className={`shrink-0 rounded-md px-3 py-2 text-[11px] font-medium transition-all ${
              activeTab === t.id
                ? 'bg-white/5 text-nexus-magenta'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="glass-panel overflow-hidden rounded-xl">
        <div className="flex items-center justify-between border-b border-glass-border px-3 py-2 sm:px-4">
          <span className="font-mono text-[10px] text-nexus-magenta">
            {tabs.find((t) => t.id === activeTab)?.formula}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="touch-target rounded-md hover:bg-white/5"
            >
              {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            </button>
            <button
              onClick={() => {
                setParams({ m1: 1000, m2: 500, r: 200, v: 0.5, M: 1e30, n: 1, L: 1 });
                draw();
              }}
              className="touch-target rounded-md hover:bg-white/5"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          className="h-48 w-full sm:h-64 md:h-80"
        />

        <div className="border-t border-glass-border p-3 sm:p-4">
          <div className="flex flex-wrap items-center gap-3">
            {activeTab === 'gravity' && (
              <>
                <div className="flex items-center gap-2">
                  <label className="text-[10px] text-muted-foreground">m₁</label>
                  <input
                    type="range"
                    min="100"
                    max="5000"
                    value={params.m1}
                    onChange={(e) => setParams({ ...params, m1: parseInt(e.target.value) })}
                    className="h-1 w-20 accent-nexus-cyan"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-[10px] text-muted-foreground">r</label>
                  <input
                    type="range"
                    min="50"
                    max="500"
                    value={params.r}
                    onChange={(e) => setParams({ ...params, r: parseInt(e.target.value) })}
                    className="h-1 w-20 accent-nexus-cyan"
                  />
                </div>
              </>
            )}
            {activeTab === 'quantum' && (
              <div className="flex items-center gap-2">
                <label className="text-[10px] text-muted-foreground">n</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={params.n}
                  onChange={(e) => setParams({ ...params, n: parseInt(e.target.value) })}
                  className="h-1 w-20 accent-nexus-emerald"
                />
                <span className="w-4 text-right font-mono text-[10px] text-nexus-emerald">{params.n}</span>
              </div>
            )}
            {activeTab === 'blackhole' && (
              <div className="flex items-center gap-2">
                <label className="text-[10px] text-muted-foreground">M</label>
                <input
                  type="range"
                  min="1e29"
                  max="1e32"
                  step="1e29"
                  value={params.M}
                  onChange={(e) => setParams({ ...params, M: parseFloat(e.target.value) })}
                  className="h-1 w-24 accent-nexus-crimson"
                />
              </div>
            )}
            {activeTab === 'relativity' && (
              <div className="flex items-center gap-2">
                <label className="text-[10px] text-muted-foreground">v/c</label>
                <input
                  type="range"
                  min="0.01"
                  max="0.99"
                  step="0.01"
                  value={params.v}
                  onChange={(e) => setParams({ ...params, v: parseFloat(e.target.value) })}
                  className="h-1 w-24 accent-nexus-gold"
                />
                <span className="w-10 text-right font-mono text-[10px] text-nexus-gold">
                  {params.v.toFixed(2)}
                </span>
              </div>
            )}
            <button
              onClick={handleExplain}
              disabled={loading}
              className="ml-auto flex items-center gap-1.5 rounded-md bg-nexus-magenta/10 px-3 py-1.5 text-[10px] font-medium text-nexus-magenta hover:bg-nexus-magenta/20 disabled:opacity-50"
            >
              <Info className="h-3 w-3" />
              {loading ? 'Memuat...' : 'Jelaskan dengan AI'}
            </button>
          </div>
        </div>
      </div>

      {showExplanation && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="glass-panel rounded-xl p-3 sm:p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold text-nexus-magenta">Penjelasan AI</h3>
            <button onClick={() => setShowExplanation(false)} className="rounded p-1 hover:bg-white/5">
              <ChevronUp className="h-3 w-3 text-muted-foreground" />
            </button>
          </div>
          <p className="text-[11px] leading-relaxed text-muted-foreground whitespace-pre-wrap">
            {explanation}
          </p>
        </motion.div>
      )}
    </div>
  );
}
