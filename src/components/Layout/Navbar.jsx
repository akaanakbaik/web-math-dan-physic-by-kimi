import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Atom, Menu, Bell, Search } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export default function Navbar() {
  const location = useLocation();
  const { toggleSidebar, notifications } = useAppStore();
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 border-b border-glass-border bg-nexus-deep/80 backdrop-blur-xl">
      <div className="flex h-full items-center justify-between px-3 sm:px-4 md:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="touch-target rounded-lg hover:bg-white/5 md:hidden"
          >
            <Menu className="h-5 w-5 text-muted-foreground" />
          </button>
          
          <Link to="/" className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <Atom className="h-6 w-6 text-nexus-cyan" />
            </motion.div>
            <span className="hidden text-sm font-bold tracking-widest text-foreground sm:inline-block">
              NEXUS
            </span>
            <span className="text-xs font-medium tracking-wider text-nexus-cyan hidden sm:inline-block">
              SCIENTIA
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button className="touch-target rounded-lg hover:bg-white/5">
            <Search className="h-4 w-4 text-muted-foreground" />
          </button>
          
          <button className="touch-target relative rounded-lg hover:bg-white/5">
            <Bell className="h-4 w-4 text-muted-foreground" />
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-nexus-crimson text-[9px] font-bold text-white"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </motion.span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
