import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info } from 'lucide-react';

export default function FormulaTooltip({ formula, explanation, children }) {
  const [show, setShow] = useState(false);

  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onClick={() => setShow(!show)}
    >
      {children}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-1/2 z-50 mb-2 w-64 -translate-x-1/2 rounded-lg border border-glass-border bg-nexus-deep/95 p-3 shadow-glass backdrop-blur-xl"
          >
            <div className="flex items-center gap-1.5 mb-1.5">
              <Info className="h-3 w-3 text-nexus-cyan" />
              <span className="text-[10px] font-semibold text-nexus-cyan">Rumus</span>
            </div>
            <p className="font-mono text-[11px] text-foreground">{formula}</p>
            {explanation && (
              <p className="mt-1.5 text-[10px] leading-relaxed text-muted-foreground">{explanation}</p>
            )}
            <div className="absolute bottom-0 left-1/2 h-2 w-2 -translate-x-1/2 translate-y-1/2 rotate-45 border-b border-r border-glass-border bg-nexus-deep/95" />
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}
