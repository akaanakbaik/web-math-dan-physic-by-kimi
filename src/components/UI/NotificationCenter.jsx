import { motion, AnimatePresence } from 'framer-motion';
import { X, Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

const icons = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
};

const colors = {
  info: 'text-nexus-cyan',
  success: 'text-nexus-emerald',
  warning: 'text-nexus-amber',
  error: 'text-nexus-crimson',
};

export default function NotificationCenter() {
  const { notifications, removeNotification } = useAppStore();

  return (
    <div className="fixed right-3 top-16 z-[60] flex w-[calc(100vw-1.5rem)] max-w-sm flex-col gap-2 sm:right-4 sm:w-80">
      <AnimatePresence>
        {notifications.slice(0, 5).map((n) => {
          const Icon = icons[n.type] || Info;
          return (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="glass-panel flex items-start gap-2.5 rounded-lg p-3"
            >
              <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${colors[n.type] || colors.info}`} />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-foreground">{n.title}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground leading-relaxed">{n.message}</p>
              </div>
              <button
                onClick={() => removeNotification(n.id)}
                className="shrink-0 rounded p-1 hover:bg-white/5"
              >
                <X className="h-3 w-3 text-muted-foreground" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
