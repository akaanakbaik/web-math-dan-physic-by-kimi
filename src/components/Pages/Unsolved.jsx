import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Brain, ChevronRight, Loader2, ChevronUp } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { getUnsolvedProblemInsight } from '@/lib/api';

const problems = [
  {
    id: 'riemann',
    title: 'Hipotesis Riemann',
    field: 'Teori Bilangan',
    year: 1859,
    desc: 'Semua non-trivial zeros dari fungsi zeta Riemann memiliki bagian real 1/2.',
    formula: 'ζ(s) = 0 ⇒ Re(s) = 1/2',
    prize: '$1,000,000',
  },
  {
    id: 'navier-stokes',
    title: 'Eksistensi & Kelancaran Navier-Stokes',
    field: 'Analisis & PDE',
    year: 1822,
    desc: 'Buktikan eksistensi dan kelancaran solusi persamaan Navier-Stokes di 3D.',
    formula: '∂u/∂t + (u·∇)u = -∇p/ρ + ν∇²u',
    prize: '$1,000,000',
  },
  {
    id: 'p-vs-np',
    title: 'P vs NP',
    field: 'Ilmu Komputer',
    year: 1971,
    desc: 'Apakah setiap masalah yang solusinya dapat diverifikasi secara polinomial juga dapat diselesaikan secara polinomial?',
    formula: 'P = NP ?',
    prize: '$1,000,000',
  },
  {
    id: 'yang-mills',
    title: 'Mass Gap Yang-Mills',
    field: 'Fisika Matematika',
    year: 1954,
    desc: 'Buktikan adanya mass gap dalam teori gauge Yang-Mills non-abelian.',
    formula: 'L = -¼FᵃᵤᵥFᵃᵘᵛ + ψ̄(iγᵘDᵤ - m)ψ',
    prize: '$1,000,000',
  },
  {
    id: 'hodge',
    title: 'Hodge Conjecture',
    field: 'Geometri Aljabar',
    year: 1950,
    desc: 'Setiap kelas Hodge pada varietas proyektif non-singular adalah kombinasi linear rasional dari kelas siklus aljabar.',
    formula: 'H^{p,p}(X) ∩ H^{2p}(X, ℚ)',
    prize: '$1,000,000',
  },
  {
    id: 'birch-swinnerton',
    title: 'Birch & Swinnerton-Dyer',
    field: 'Teori Bilangan',
    year: 1965,
    desc: 'Hubungan antara rank kurva eliptik dan perilaku L-fungsi di s=1.',
    formula: 'L(E, 1) ~ C · Ω_E · Reg_E · Ш_E · ∏c_p',
    prize: '$1,000,000',
  },
  {
    id: 'navier-stokes-millenium',
    title: 'Navier-Stokes Existence',
    field: 'Analisis',
    year: 2000,
    desc: 'Buktikan atau sangkal eksistensi solusi smooth untuk persamaan Navier-Stokes.',
    formula: 'ρ(∂u/∂t + u·∇u) = -∇p + μ∇²u + f',
    prize: '$1,000,000',
  },
];

export default function Unsolved() {
  const [expanded, setExpanded] = useState(null);
  const [insight, setInsight] = useState('');
  const [loading, setLoading] = useState(false);
  const { addNotification } = useAppStore();

  const handleExpand = async (id) => {
    if (expanded === id) {
      setExpanded(null);
      return;
    }
    setExpanded(id);
    setLoading(true);
    const problem = problems.find((p) => p.id === id);
    try {
      const res = await getUnsolvedProblemInsight(problem.title);
      setInsight(res.data?.response || 'Wawasan tidak tersedia.');
    } catch {
      setInsight('Gagal memuat wawasan AI. Coba lagi nanti.');
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">Masalah Belum Terpecahkan</h1>
        <p className="text-xs text-muted-foreground">Masalah Milenium Clay Mathematics Institute & lainnya</p>
      </div>

      <div className="flex flex-col gap-2.5">
        {problems.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-panel overflow-hidden rounded-xl"
          >
            <button
              onClick={() => handleExpand(p.id)}
              className="flex w-full items-center gap-3 p-3 sm:p-4 text-left"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-nexus-gold/10">
                <Lock className="h-4 w-4 text-nexus-gold" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-foreground">{p.title}</h3>
                  <span className="rounded bg-nexus-gold/10 px-1.5 py-0.5 text-[9px] font-mono text-nexus-gold">
                    {p.prize}
                  </span>
                </div>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {p.field} · {p.year}
                </p>
              </div>
              <motion.div
                animate={{ rotate: expanded === p.id ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </motion.div>
            </button>

            <AnimatePresence>
              {expanded === p.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-glass-border px-3 pb-4 pt-2 sm:px-4">
                    <p className="text-[11px] leading-relaxed text-muted-foreground">{p.desc}</p>
                    <div className="mt-2 rounded-lg bg-white/[0.02] p-2.5">
                      <p className="font-mono text-[10px] text-nexus-cyan">{p.formula}</p>
                    </div>

                    <div className="mt-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Brain className="h-3 w-3 text-nexus-emerald" />
                        <span className="text-[10px] font-medium text-nexus-emerald">Wawasan AI</span>
                        {loading && <Loader2 className="h-3 w-3 animate-spin text-nexus-emerald" />}
                      </div>
                      <p className="text-[11px] leading-relaxed text-muted-foreground whitespace-pre-wrap">
                        {insight}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
