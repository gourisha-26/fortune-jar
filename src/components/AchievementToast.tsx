'use client';
import { motion, AnimatePresence } from 'framer-motion';
import type { Achievement } from '@/hooks/useAchievements';

export default function AchievementToast({ achievement }: { achievement: Achievement | null }) {
  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          initial={{ x: 120, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 120, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="fixed bottom-6 right-6 z-[300] flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl"
          style={{ background: 'var(--card)', border: '1px solid rgba(169,184,164,0.4)', color: 'var(--text)' }}
        >
          <span className="text-2xl">{achievement.emoji}</span>
          <div>
            <p className="text-xs font-medium opacity-60 uppercase tracking-wider">Achievement Unlocked</p>
            <p className="font-semibold text-sm font-fraunces">{achievement.title}</p>
            <p className="text-xs opacity-60">{achievement.description}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
