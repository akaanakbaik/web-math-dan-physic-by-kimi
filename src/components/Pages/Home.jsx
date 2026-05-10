import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sigma, Atom, HelpCircle, BrainCircuit, ArrowRight, Sparkles } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

const sections = [
  {
    path: '/mathematics',
    title: 'Matematika Lanjut',
    desc: 'Visualisasi Riemann Zeta, Teori Bilangan, Geometri Diferensial, Topologi, dan Analisis Kompleks level PhD.',
    icon: Sigma,
    color: 'text-nexus-cyan',
    bg: 'bg-nexus-cyan/5',
    border: 'border-nexus-cyan/10',
  },
  {
    path: '/physics',
    title: 'Fisika Teoritis',
    desc: 'Simulasi Relativitas Umum, Mekanika Kuantum, Teori Medan, Fluida, dan Astrofisika dengan parameter real-time.',
    icon: Atom,
    color: 'text-nexus-magenta',
    bg: 'bg-nexus-magenta/5',
    border: 'border-nexus-magenta/10',
  },
  {
    path: '/unsolved',
    title: 'Masalah Belum Terpecahkan',
    desc: 'Hipotesis Riemann, Navier-Stokes, P vs NP, Yang-Mills, dan masalah milenium lainnya dengan analisis AI.',
    icon: HelpCircle,
    color: 'text-nexus-gold',
    bg: 'bg-nexus-gold/5',
    border: 'border-nexus-gold/10',
  },
  {
    path: '/ai-assistant',
    title: 'AI Asisten Penelitian',
    desc: 'Integrasi model QwQ-32B untuk penjelasan rumus, derivasi, dan wawasan penelitian real-time.',
    icon: BrainCircuit,
    color: 'text-nexus-emerald',
    bg: 'bg-nexus-emerald/5',
    border: 'border-nexus-emerald/10',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export default function Home() {
  const { addNotification } = useAppStore();

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center sm:text-left"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-nexus-cyan/20 bg-nexus-cyan/5 px-3 py-1 mb-4">
          <Sparkles className="h-3 w-3 text-nexus-cyan" />
          <span className="text-[10px] font-mono uppercase tracking-wider text-nexus-cyan">
            Platform Penelitian Level PhD
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          NEXUS <span className="text-nexus-cyan">SCIENTIA</span>
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-muted-foreground max-w-xl leading-relaxed">
          Visualisasi matematika dan fisika tingkat dewa dengan animasi real-time, 
          rumus interaktif, dan AI integration untuk penelitian level profesor dan ilmuwan.
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-3 sm:gap-4"
      >
        {sections.map((s) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.path} variants={item}>
              <Link
                to={s.path}
                onClick={() =>
                  addNotification({
                    type: 'info',
                    title: 'Navigasi',
                    message: `Memuat modul ${s.title}`,
                  })
                }
                className={`group flex items-start gap-3 sm:gap-4 rounded-xl border ${s.border} ${s.bg} p-4 sm:p-5 transition-all hover:bg-white/[0.03]`}
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${s.border} bg-nexus-void/50`}>
                  <Icon className={`h-5 w-5 ${s.color}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm sm:text-base font-semibold text-foreground">{s.title}</h2>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5" />
                  </div>
                  <p className="mt-1 text-[11px] sm:text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="glass-panel rounded-xl p-4 sm:p-5"
      >
        <h3 className="text-xs font-semibold text-foreground mb-3">Konstanta Fisika Real-Time</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {[
            { label: 'G', value: '6.674×10⁻¹¹', unit: 'm³/kg·s²' },
            { label: 'c', value: '2.998×10⁸', unit: 'm/s' },
            { label: 'ℏ', value: '1.055×10⁻³⁴', unit: 'J·s' },
            { label: 'k_B', value: '1.381×10⁻²³', unit: 'J/K' },
            { label: 'e', value: '1.602×10⁻¹⁹', unit: 'C' },
            { label: 'm_e', value: '9.109×10⁻³¹', unit: 'kg' },
            { label: 'α', value: '7.297×10⁻³', unit: 'dimensionless' },
            { label: 'N_A', value: '6.022×10²³', unit: 'mol⁻¹' },
          ].map((c) => (
            <div key={c.label} className="rounded-lg bg-white/[0.02] p-2.5">
              <p className="text-[10px] font-mono text-nexus-cyan">{c.label}</p>
              <p className="text-[11px] font-mono text-foreground mt-0.5">{c.value}</p>
              <p className="text-[9px] font-mono text-muted-foreground">{c.unit}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
