import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Info, ChevronUp } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { riemannZeta, mandelbrotIter, fibonacci, isPrime, formatNumber } from '@/lib/utils';
import { getMathVisualizationInsight } from '@/lib/api';

const tabs = [
  { id: 'zeta', label: 'Riemann Zeta', formula: 'ζ(s) = Σₙ₌₁^∞ 1/nˢ' },
  { id: 'mandelbrot', label: 'Mandelbrot', formula: 'zₙ₊₁ = zₙ² + c' },
  { id: 'fibonacci', label: 'Fibonacci', formula: 'Fₙ = Fₙ₋₁ + Fₙ₋₂' },
  { id: 'prime', label: 'Distribusi Prima', formula: 'π(x) ~ x/ln(x)' },
];

export default function Mathematics() {
  const [activeTab, setActiveTab] = useState('zeta');
  const [isPlaying, setIsPlaying] = useState(false);
  const [params, setParams] = useState({ s: 2, zoom: 1, offsetX: 0, offsetY: 0, n: 30 });
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
    return () => cancelAnimationFrame(animRef.current);
  }, [isPlaying, activeTab, params]);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, w, h);

    if (activeTab === 'zeta') drawZeta(ctx, w, h);
    else if (activeTab === 'mandelbrot') drawMandelbrot(ctx, w, h);
    else if (activeTab === 'fibonacci') drawFibonacci(ctx, w, h);
    else if (activeTab === 'prime') drawPrimes(ctx, w, h);
  };

  const drawZeta = (ctx, w, h) => {
    const s = params.s;
    ctx.strokeStyle = '#00d4ff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let x = 0; x < w; x++) {
      const t = (x / w) * 20 + 0.1;
      const val = riemannZeta(s + (t / 10) * 0.5, 5000);
      const y = h / 2 - (val - 1) * 30;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    ctx.fillStyle = 'rgba(0, 212, 255, 0.3)';
    ctx.beginPath();
    for (let x = 0; x < w; x++) {
      const t = (x / w) * 20 + 0.1;
      const val = riemannZeta(s + (t / 10) * 0.5, 5000);
      const y = h / 2 - (val - 1) * 30;
      if (x === 0) ctx.moveTo(x, h);
      else ctx.lineTo(x, y);
    }
    ctx.lineTo(w, h);
    ctx.fill();
  };

  const drawMandelbrot = (ctx, w, h) => {
    const zoom = params.zoom;
    const img = ctx.createImageData(w, h);
    for (let py = 0; py < h; py += 2) {
      for (let px = 0; px < w; px += 2) {
        const x0 = (px - w / 2) / (w / 4 * zoom) + params.offsetX;
        const y0 = (py - h / 2) / (h / 4 * zoom) + params.offsetY;
        const iter = mandelbrotIter(x0, y0, 80);
        const idx = (py * w + px) * 4;
        const c = iter === 80 ? 0 : iter * 3;
        img.data[idx] = c;
        img.data[idx + 1] = c * 0.5;
        img.data[idx + 2] = c * 1.5;
        img.data[idx + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
  };

  const drawFibonacci = (ctx, w, h) => {
    const n = params.n;
    const cx = w / 2;
    const cy = h / 2;
    for (let i = 0; i < n; i++) {
      const angle = i * 2.39996;
      const radius = Math.sqrt(i) * 8;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;
      const size = Math.log(fibonacci(i + 1)) * 2;
      ctx.beginPath();
      ctx.arc(x, y, Math.max(size, 2), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 215, 0, ${0.3 + (i / n) * 0.7})`;
      ctx.fill();
    }
  };

  const drawPrimes = (ctx, w, h) => {
    const max = 1000;
    const cols = Math.floor(w / 3);
    for (let i = 2; i < max; i++) {
      if (isPrime(i)) {
        const x = (i % cols) * 3;
        const y = Math.floor(i / cols) * 3;
        ctx.fillStyle = `rgba(255, 0, 160, ${0.5 + Math.random() * 0.5})`;
        ctx.fillRect(x, y, 2, 2);
      }
    }
  };

  const handleExplain = async () => {
    setLoading(true);
    try {
      const tab = tabs.find((t) => t.id === activeTab);
      const res = await getMathVisualizationInsight(tab.label, params);
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
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">Matematika Lanjut</h1>
        <p className="text-xs text-muted-foreground">Visualisasi interaktif dengan derivasi real-time</p>
      </div>

      <div className="flex gap-1 overflow-x-auto hide-scrollbar rounded-lg bg-white/[0.02] p-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setActiveTab(t.id);
              setIsPlaying(false);
              addNotification({ type: 'info', title: 'Modul', message: `Memuat ${t.label}` });
            }}
            className={`shrink-0 rounded-md px-3 py-2 text-[11px] font-medium transition-all ${
              activeTab === t.id
                ? 'bg-white/5 text-nexus-cyan'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="glass-panel overflow-hidden rounded-xl">
        <div className="flex items-center justify-between border-b border-glass-border px-3 py-2 sm:px-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-nexus-cyan">
              {tabs.find((t) => t.id === activeTab)?.formula}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="touch-target rounded-md hover:bg-white/5"
            >
              {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            </button>
            <button
              onClick={() => {
                setParams({ s: 2, zoom: 1, offsetX: 0, offsetY: 0, n: 30 });
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
          style={{ imageRendering: 'pixelated' }}
        />

        <div className="border-t border-glass-border p-3 sm:p-4">
          <div className="flex flex-wrap items-center gap-3">
            {activeTab === 'zeta' && (
              <div className="flex items-center gap-2">
                <label className="text-[10px] text-muted-foreground">s</label>
                <input
                  type="range"
                  min="1.1"
                  max="10"
                  step="0.1"
                  value={params.s}
                  onChange={(e) => setParams({ ...params, s: parseFloat(e.target.value) })}
                  className="h-1 w-24 accent-nexus-cyan"
                />
                <span className="w-10 text-right font-mono text-[10px] text-nexus-cyan">
                  {params.s.toFixed(1)}
                </span>
              </div>
            )}
            {activeTab === 'mandelbrot' && (
              <div className="flex items-center gap-2">
                <label className="text-[10px] text-muted-foreground">Zoom</label>
                <input
                  type="range"
                  min="0.5"
                  max="5"
                  step="0.1"
                  value={params.zoom}
                  onChange={(e) => setParams({ ...params, zoom: parseFloat(e.target.value) })}
                  className="h-1 w-20 accent-nexus-magenta"
                />
              </div>
            )}
            {activeTab === 'fibonacci' && (
              <div className="flex items-center gap-2">
                <label className="text-[10px] text-muted-foreground">N</label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="1"
                  value={params.n}
                  onChange={(e) => setParams({ ...params, n: parseInt(e.target.value) })}
                  className="h-1 w-24 accent-nexus-gold"
                />
                <span className="w-6 text-right font-mono text-[10px] text-nexus-gold">
                  {params.n}
                </span>
              </div>
            )}
            <button
              onClick={handleExplain}
              disabled={loading}
              className="ml-auto flex items-center gap-1.5 rounded-md bg-nexus-cyan/10 px-3 py-1.5 text-[10px] font-medium text-nexus-cyan hover:bg-nexus-cyan/20 disabled:opacity-50"
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
            <h3 className="text-xs font-semibold text-nexus-cyan">Penjelasan AI</h3>
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
