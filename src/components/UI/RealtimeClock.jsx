import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

export default function RealtimeClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const format = (n) => n.toString().padStart(2, '0');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center gap-2 rounded-lg bg-white/[0.02] px-3 py-2"
    >
      <Clock className="h-3.5 w-3.5 text-nexus-cyan" />
      <div className="font-mono text-[11px] text-foreground">
        <span>{format(time.getHours())}</span>
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="mx-0.5"
        >
          :
        </motion.span>
        <span>{format(time.getMinutes())}</span>
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="mx-0.5"
        >
          :
        </motion.span>
        <span>{format(time.getSeconds())}</span>
      </div>
      <span className="text-[9px] text-muted-foreground">WIB</span>
    </motion.div>
  );
}
