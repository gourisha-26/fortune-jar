'use client';
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  dx: number;
  dy: number;
}

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 12 + 8,
    delay: Math.random() * 8,
    dx: (Math.random() - 0.5) * 120,
    dy: -(Math.random() * 80 + 40),
  }));
}

export default function Background({ isRainbow }: { isRainbow?: boolean }) {
  const particles = useRef(generateParticles(20));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* Warm sunrays */}
      <div className="absolute inset-0">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute top-0 origin-top"
            style={{
              left: `${15 + i * 18}%`,
              width: '3px',
              height: '70%',
              background: isRainbow
                ? `hsl(${i * 60}, 80%, 70%)`
                : 'linear-gradient(to bottom, rgba(215,168,110,0.25), transparent)',
              filter: 'blur(20px)',
              transformOrigin: 'top center',
              transform: `rotate(${-15 + i * 8}deg)`,
            }}
            animate={{ opacity: [0.04, 0.09, 0.04] }}
            transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.8, ease: 'easeInOut' }}
          />
        ))}
      </div>

      {/* Floating dust particles */}
      {particles.current.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: isRainbow ? `hsl(${p.id * 18}, 80%, 75%)` : ['rgba(244,167,185,0.45)','rgba(255,203,164,0.4)','rgba(212,196,240,0.45)','rgba(184,232,208,0.4)'][p.id % 4],
          }}
          animate={{
            x: [0, p.dx * 0.3, p.dx],
            y: [0, p.dy * 0.5, p.dy],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Floating leaf shapes */}
      {[
        { x: 8, y: 25, rot: 30 },
        { x: 88, y: 60, rot: -20 },
        { x: 5, y: 70, rot: 45 },
        { x: 92, y: 20, rot: -45 },
      ].map((leaf, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: `${leaf.x}%`, top: `${leaf.y}%` }}
          animate={{
            x: [0, 12, 4, -8, 0],
            y: [0, -8, -18, -8, 0],
            rotate: [leaf.rot, leaf.rot + 10, leaf.rot - 5, leaf.rot + 8, leaf.rot],
          }}
          transition={{ duration: 8 + i * 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg width="24" height="28" viewBox="0 0 24 28" fill="none">
            <path
              d="M12 2 C18 2 22 8 22 14 C22 20 18 26 12 26 C6 26 2 20 2 14 C2 8 6 2 12 2Z"
              fill={isRainbow ? `hsl(${i * 90}, 60%, 70%)` : 'rgba(169,184,164,0.35)'}
            />
            <line x1="12" y1="2" x2="12" y2="26" stroke={isRainbow ? `hsl(${i * 90}, 60%, 60%)` : 'rgba(169,184,164,0.6)'} strokeWidth="0.8" />
          </svg>
        </motion.div>
      ))}

      {/* Small coffee cup decoration */}
      <motion.div
        className="absolute bottom-16 right-10 opacity-40 hidden lg:block"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg width="48" height="52" viewBox="0 0 48 52" fill="none">
          <rect x="8" y="14" width="28" height="24" rx="4" fill="rgba(201,119,99,0.5)" />
          <path d="M36 20 C44 20 44 30 36 30" stroke="rgba(201,119,99,0.6)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <rect x="4" y="38" width="36" height="3" rx="1.5" fill="rgba(201,119,99,0.4)" />
          {/* Steam */}
          <motion.path
            d="M18 10 C18 6 22 6 22 2" stroke="rgba(201,119,99,0.4)" strokeWidth="1.5" fill="none" strokeLinecap="round"
            animate={{ opacity: [0.4, 0.8, 0.4], y: [0, -3, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.path
            d="M24 12 C24 8 28 8 28 4" stroke="rgba(201,119,99,0.4)" strokeWidth="1.5" fill="none" strokeLinecap="round"
            animate={{ opacity: [0.4, 0.8, 0.4], y: [0, -3, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          />
        </svg>
      </motion.div>

      {/* Small plant */}
      <motion.div
        className="absolute bottom-12 left-10 opacity-35 hidden lg:block"
        animate={{ rotate: [-2, 2, -2] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg width="44" height="60" viewBox="0 0 44 60" fill="none">
          <rect x="16" y="42" width="12" height="18" rx="3" fill="rgba(169,184,164,0.6)" />
          <ellipse cx="22" cy="38" rx="10" ry="14" fill="rgba(169,184,164,0.5)" />
          <ellipse cx="12" cy="30" rx="8" ry="12" fill="rgba(169,184,164,0.4)" transform="rotate(-20 12 30)" />
          <ellipse cx="32" cy="30" rx="8" ry="12" fill="rgba(169,184,164,0.4)" transform="rotate(20 32 30)" />
        </svg>
      </motion.div>

      {/* Rainbow background tint */}
      {isRainbow && (
        <motion.div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, rgba(255,100,100,0.06), rgba(100,100,255,0.06), rgba(100,255,100,0.06))' }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </div>
  );
}
