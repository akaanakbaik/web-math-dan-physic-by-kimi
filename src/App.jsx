import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import Layout from '@/components/Layout/Layout';
import Home from '@/components/Pages/Home';
import Mathematics from '@/components/Pages/Mathematics';
import Physics from '@/components/Pages/Physics';
import Unsolved from '@/components/Pages/Unsolved';
import AIAssistant from '@/components/Pages/AIAssistant';
import LoadingScreen from '@/components/UI/LoadingScreen';
import NotificationCenter from '@/components/UI/NotificationCenter';
import ScrollProgress from '@/components/UI/ScrollProgress';
import FpsCounter from '@/components/UI/FpsCounter';

const pageTransition = {
  initial: { opacity: 0, y: 8, scale: 0.995 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -8, scale: 0.995 },
  transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
};

function AnimatedPage({ children }) {
  return (
    <motion.div
      initial={pageTransition.initial}
      animate={pageTransition.animate}
      exit={pageTransition.exit}
      transition={pageTransition.transition}
      className="w-full min-w-0"
    >
      {children}
    </motion.div>
  );
}

function AppContent() {
  const location = useLocation();
  const { isLoading, setLoading } = useAppStore();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, [location.pathname, setLoading]);

  if (isLoading) return <LoadingScreen />;

  return (
    <Layout>
      <ScrollProgress />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<AnimatedPage><Home /></AnimatedPage>} />
          <Route path="/mathematics" element={<AnimatedPage><Mathematics /></AnimatedPage>} />
          <Route path="/physics" element={<AnimatedPage><Physics /></AnimatedPage>} />
          <Route path="/unsolved" element={<AnimatedPage><Unsolved /></AnimatedPage>} />
          <Route path="/ai-assistant" element={<AnimatedPage><AIAssistant /></AnimatedPage>} />
        </Routes>
      </AnimatePresence>
      <NotificationCenter />
      <FpsCounter />
    </Layout>
  );
}

export default function App() {
  return <AppContent />;
}
