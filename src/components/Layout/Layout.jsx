import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import ParticleBackground from '../Effects/ParticleBackground';

export default function Layout({ children }) {
  const location = useLocation();
  const { sidebarOpen, setSidebarOpen, setIsMobile } = useAppStore();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(false);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsMobile, setSidebarOpen]);

  useEffect(() => {
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname, setSidebarOpen]);

  return (
    <div className="relative min-h-[100dvh] w-full max-w-[100vw] overflow-x-hidden bg-nexus-void">
      <ParticleBackground />
      
      <Navbar />
      
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <Sidebar />

      <main className="relative z-10 min-h-[100dvh] w-full pt-14 pb-20 md:pb-0 md:pl-64">
        <div className="mobile-container py-4 sm:py-6">
          {children}
        </div>
      </main>

      <MobileNav />
    </div>
  );
}
