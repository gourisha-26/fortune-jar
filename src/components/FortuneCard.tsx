'use client';
import { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Fortune, CookieRarity } from '@/data/fortunes';

interface Props {
  fortune: Fortune | null;
  rarity: CookieRarity;
  onPickAnother: () => void;
  onShare: () => void;
  isFavorited: boolean;
  onFavorite: () => void;
  cookieCount: number;
}

const rarityConfig = {
  normal:  { label: "Today's Fortune",      accent: '#A06828', bg: '#FEFCF6' },
  golden:  { label: '✨ Golden Fortune',    accent: '#C9920A', bg: '#FFFBEA' },
  rainbow: { label: '🌈 Legendary Fortune', accent: '#8B5CF6', bg: '#F8F4FF' },
};

export default function FortuneCard({ fortune, rarity, onPickAnother, onShare, isFavorited, onFavorite, cookieCount }: Props) {
  const cfg = rarityConfig[rarity];

  return (
    <AnimatePresence>
      {fortune && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center p-5"
          style={{ zIndex: 150, background: 'rgba(28,18,10,0.55)', backdropFilter: 'blur(10px)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={e => { if (e.target === e.currentTarget) onPickAnother(); }}
        >
          <motion.div
            className="relative w-full max-w-sm"
            initial={{ scale: 0.82, y: 56, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.86, y: 36, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 290, damping: 24 }}
          >
            {/* Rarity glow halos */}
            {rarity === 'golden' && (
              <div className="absolute inset-0 rounded-[28px] blur-2xl"
                style={{ background: 'radial-gradient(circle, rgba(255,215,0,0.35) 0%, transparent 70%)' }} />
            )}
            {rarity === 'rainbow' && (
              <motion.div className="absolute inset-0 rounded-[28px] blur-2xl opacity-25"
                style={{ background: 'conic-gradient(from 0deg,#ff6b6b,#ffd700,#6bffb8,#6bb5ff,#d96bff,#ff6b6b)' }}
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              />
            )}

            {/* Card */}
            <div
              className="relative overflow-hidden"
              style={{
                borderRadius: 14,
                background: cfg.bg,
                border: '1px solid rgba(169,184,164,0.25)',
                boxShadow: '0 28px 64px rgba(94,70,52,0.22)',
              }}
            >
              {/* Close button */}
              <button
                onClick={onPickAnother}
                style={{
                  position: 'absolute', top: 14, right: 14,
                  width: 32, height: 32,
                  borderRadius: 8,
                  background: 'rgba(94,70,52,0.08)',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, color: '#5A3C22',
                  zIndex: 10,
                }}
              >
                ✕
              </button>


<div className="relative flex flex-col items-center gap-6 p-8 text-center">
                {/* Fortune label */}
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
                  className="flex flex-col items-center gap-1.5"
                >
                  <span className="text-[11px] font-medium tracking-[0.2em] uppercase" style={{ color: '#5A3C22', opacity: 0.55 }}>
                    {cfg.label}
                  </span>
                  <div className="w-8 h-px" style={{ background: cfg.accent, opacity: 0.6 }} />
                </motion.div>

                {/* Fortune text */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.32, type: 'spring', stiffness: 200 }}
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 'clamp(1rem, 2.2vw, 1.15rem)',
                    color: '#1C100A',
                    opacity: 0.65,
                    margin: 0,
                    lineHeight: 1.65,
                  }}
                >
                  "{fortune.text}"
                </motion.p>

                {/* Divider */}
                <div className="w-10 h-px" style={{ background: 'var(--accent-green)', opacity: 0.4 }} />

                {/* Lucky Number + Emoji only */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.48 }}
                  className="flex items-center justify-center gap-10"
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] tracking-widest uppercase" style={{ color: 'var(--text)', opacity: 0.4 }}>Lucky Number</span>
                    <span className="font-fraunces text-2xl font-semibold" style={{ color: '#3A2008' }}>{fortune.luckyNumber}</span>
                  </div>
                  <div className="w-px h-10" style={{ background: 'rgba(94,70,52,0.12)' }} />
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] tracking-widest uppercase" style={{ color: 'var(--text)', opacity: 0.4 }}>Lucky Emoji</span>
                    <span className="text-2xl">{fortune.luckyEmoji}</span>
                  </div>
                </motion.div>


                {/* Action buttons — Pick Another · Share · Heart */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.58 }}
                  className="flex items-center gap-2.5 w-full"
                >
                  <motion.button
                    onClick={onPickAnother}
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    className="py-3 text-sm font-medium"
                    style={{ background: '#F5ECD7', color: '#5A3C22', flex: '2', borderRadius: 10 }}
                  >
                    🥠 Pick Another
                  </motion.button>
                  <motion.button
                    onClick={onShare}
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    className="py-3 text-sm font-medium"
                    style={{ background: '#C8DEC5', color: '#5A3C22', flex: '1', borderRadius: 10 }}
                  >
                    Share
                  </motion.button>
                  <motion.button
                    onClick={onFavorite}
                    whileHover={{ scale: 1.08, y: -2 }}
                    whileTap={{ scale: 0.94 }}
                    className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'transparent', border: 'none', fontSize: 28 }}
                  >
                    {isFavorited ? '❤️' : '🤍'}
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
