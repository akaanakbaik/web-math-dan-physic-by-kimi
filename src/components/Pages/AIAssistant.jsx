import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Loader2, Sparkles, Trash2, Copy, Check } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { askAI } from '@/lib/api';

export default function AIAssistant() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(null);
  const { aiMessages, addAiMessage, clearAiMessages, addNotification } = useAppStore();
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [aiMessages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    addAiMessage({ role: 'user', content: userMsg });
    setInput('');
    setLoading(true);

    try {
      const res = await askAI(userMsg, 'You are a PhD-level physics and mathematics research assistant. Provide detailed, technical explanations with formulas when relevant.');
      addAiMessage({ role: 'assistant', content: res.data?.response || 'Maaf, tidak dapat memproses permintaan.' });
      addNotification({ type: 'success', title: 'AI', message: 'Respons diterima' });
    } catch {
      addAiMessage({ role: 'assistant', content: 'Terjadi kesalahan koneksi ke AI. Silakan coba lagi.' });
      addNotification({ type: 'error', title: 'AI', message: 'Gagal terhubung' });
    }
    setLoading(false);
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const suggestions = [
    'Jelaskan Hipotesis Riemann secara detail',
    'Derivasi persamaan Einstein dari prinsip aksi',
    'Apa itu anomali chiral dalam QFT?',
    'Buktikan ketidaksamaan Bell',
    'Jelaskan dualitas AdS/CFT',
    'Apa perbedaan supersimetri terbuka dan tertutup?',
  ];

  return (
    <div className="flex h-[calc(100dvh-7rem)] flex-col gap-3 md:h-[calc(100dvh-3.5rem)]">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">AI Asisten Penelitian</h1>
        <p className="text-xs text-muted-foreground">Powered by QwQ-32B via Siputzx API</p>
      </div>

      {aiMessages.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-nexus-cyan/10"
          >
            <Sparkles className="h-6 w-6 text-nexus-cyan" />
          </motion.div>
          <p className="text-xs text-muted-foreground">Mulai percakapan penelitian level PhD</p>
          <div className="grid w-full max-w-md grid-cols-1 gap-2 px-4 sm:grid-cols-2">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => {
                  setInput(s);
                }}
                className="rounded-lg border border-glass-border bg-white/[0.02] px-3 py-2 text-left text-[11px] text-muted-foreground transition-all hover:bg-white/5 hover:text-foreground"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto hide-scrollbar rounded-xl border border-glass-border bg-nexus-deep/30 p-3"
        >
          <div className="flex flex-col gap-3">
            {aiMessages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                    msg.role === 'user' ? 'bg-nexus-magenta/10' : 'bg-nexus-cyan/10'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <User className="h-3.5 w-3.5 text-nexus-magenta" />
                  ) : (
                    <Bot className="h-3.5 w-3.5 text-nexus-cyan" />
                  )}
                </div>
                <div
                  className={`group relative max-w-[85%] rounded-xl px-3 py-2 text-[11px] leading-relaxed sm:max-w-[75%] ${
                    msg.role === 'user'
                      ? 'bg-nexus-magenta/10 text-foreground'
                      : 'glass-panel text-muted-foreground'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  {msg.role === 'assistant' && (
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="absolute -bottom-1.5 -right-1.5 rounded-md bg-nexus-deep p-1 opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      {copied === msg.id ? (
                        <Check className="h-3 w-3 text-nexus-emerald" />
                      ) : (
                        <Copy className="h-3 w-3 text-muted-foreground" />
                      )}
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 px-10"
              >
                <Loader2 className="h-3.5 w-3.5 animate-spin text-nexus-cyan" />
                <span className="text-[10px] text-muted-foreground">AI sedang berpikir...</span>
              </motion.div>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 rounded-xl border border-glass-border bg-nexus-deep/50 p-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Tanyakan tentang fisika, matematika, atau masalah penelitian..."
          className="flex-1 bg-transparent px-2 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="touch-target rounded-lg bg-nexus-cyan/10 p-2 text-nexus-cyan transition-all hover:bg-nexus-cyan/20 disabled:opacity-30"
        >
          <Send className="h-4 w-4" />
        </button>
        {aiMessages.length > 0 && (
          <button
            onClick={clearAiMessages}
            className="touch-target rounded-lg p-2 text-muted-foreground hover:bg-white/5"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
