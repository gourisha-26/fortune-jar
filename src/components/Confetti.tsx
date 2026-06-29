'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Piece {
  id: number;
  x: number;
  color: string;
  size: number;
  rotation: number;
  duration: number;
  delay: number;
}

export default function Confetti({ active }: { active: boolean }) {
  const [pieces, setPieces] = useState<Piece[]>([]);

  useEffect(() => {
    if (!active) return;
    const colors = ['#FFD700', '#C97763', '#A9B8A4', '#D7A86E', '#E9DDC7', '#FF6B6B', '#4ECDC4', '#45B7D1'];
    setPieces(Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: colors[i % colors.length],
      size: Math.random() * 8 + 4,
      rotation: Math.random() * 360,
      duration: Math.random() * 2 + 1.5,
      delay: Math.random() * 0.8,
    })));
  }, [active]);

  return (
    <AnimatePresence>
      {active && (
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 200 }}>
          {pieces.map(p => (
            <motion.div
              key={p.id}
              className="absolute top-0"
              style={{ left: `${p.x}%`, width: p.size, height: p.size, backgroundColor: p.color, borderRadius: Math.random() > 0.5 ? '50%' : '2px' }}
              initial={{ y: -20, rotate: p.rotation, opacity: 1 }}
              animate={{ y: '100vh', rotate: p.rotation + 720, opacity: [1, 1, 0] }}
              transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
