import { motion } from 'framer-motion';
import { Atom } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-nexus-void"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="relative"
      >
        <Atom className="h-12 w-12 text-nexus-cyan" />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute inset-0 rounded-full bg-nexus-cyan/20 blur-xl"
        />
      </motion.div>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: '12rem' }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
        className="mt-8 h-0.5 overflow-hidden rounded-full bg-white/5"
      >
        <motion.div
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="h-full w-1/2 rounded-full bg-nexus-cyan"
        />
      </motion.div>
      <motion.p
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="mt-4 text-[10px] font-mono tracking-widest text-muted-foreground uppercase"
      >
        Memuat Simulasi
      </motion.p>
    </motion.div>
  );
}
