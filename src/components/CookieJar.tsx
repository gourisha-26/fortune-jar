'use client';
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Fortune, CookieRarity } from '@/data/fortunes';
import { pickFortune } from '@/data/fortunes';

interface Props {
  onFortunePicked: (fortune: Fortune, rarity: CookieRarity) => void;
  shownIds: Set<number>;
  disabled: boolean;
  onShuffle?: () => void;
}

/* ── Heart shape, centered at (x,y) ── */
function Heart({ x, y, size = 32 }: { x: number; y: number; size?: number }) {
  const s = size / 18;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <path
        d="M 0 6 C -2 0 -9 -3 -14 1 C -19 5 -18 13 -10 19 C -5 23 0 27 0 27 C 0 27 5 23 10 19 C 18 13 19 5 14 1 C 9 -3 2 0 0 6 Z"
        fill="#DC2626"
      />
    </g>
  );
}

/* ── Small dots accent ── */
function Dots({ x, y }: { x: number; y: number }) {
  return (
    <>
      <circle cx={x - 14} cy={y - 4} r="2.2" fill="#DC2626" opacity="0.55" />
      <circle cx={x + 14} cy={y - 4} r="2.2" fill="#DC2626" opacity="0.55" />
      <circle cx={x} cy={y - 16} r="2.2" fill="#DC2626" opacity="0.55" />
    </>
  );
}

/* ── Big fortune cookie for animation (side view) ── */
function BigCookie({ rarity, w = 250, h = 175 }: { rarity?: CookieRarity; w?: number; h?: number }) {
  const isGold = rarity === 'golden';
  const isRain = rarity === 'rainbow';
  const body = isGold ? '#F5C030' : isRain ? '#C084FC' : '#D4954A';
  const dark = isGold ? '#B8860B' : isRain ? '#7C3AED' : '#A06828';
  const light = isGold ? '#FFF0A0' : isRain ? '#F0D0FF' : '#E8B870';
  const uid = `bc-${rarity ?? 'n'}`;
  return (
    <svg viewBox="0 0 240 170" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ width: w, height: h, overflow: 'visible',
        filter: `drop-shadow(0 12px 32px rgba(${isGold ? '160,100,0' : isRain ? '120,60,200' : '120,70,10'},0.35))` }}>
      <defs>
        <radialGradient id={uid} cx="36%" cy="26%" r="65%">
          <stop offset="0%" stopColor={light} />
          <stop offset="100%" stopColor={body} />
        </radialGradient>
      </defs>
      <path d="M120 78 C100 52 55 38 24 56 C6 66 4 86 18 100 C40 116 92 114 120 94 Z"
        fill={`url(#${uid})`} stroke={dark} strokeWidth="3" strokeLinejoin="round" />
      <path d="M120 92 C92 112 44 112 20 100 C44 118 96 120 120 104 Z" fill={dark} opacity="0.18" />
      <path d="M120 80 C100 56 60 44 34 58" stroke={light} strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.85" />
      <path d="M120 82 C104 62 74 52 52 62" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.5" />
      <path d="M120 78 C140 52 185 38 216 56 C234 66 236 86 222 100 C200 116 148 114 120 94 Z"
        fill={`url(#${uid})`} stroke={dark} strokeWidth="3" strokeLinejoin="round" />
      <path d="M120 92 C148 112 196 112 220 100 C196 118 144 120 120 104 Z" fill={dark} opacity="0.18" />
      <path d="M120 80 C140 56 180 44 206 58" stroke={light} strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.85" />
      <path d="M120 82 C136 62 166 52 188 62" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.5" />
      <path d="M120 78 C115 84 115 90 120 94 C125 90 125 84 120 78 Z" fill={dark} opacity="0.6" />
    </svg>
  );
}

/* ── Small fortune cookie inside jar (side/angled view) ── */
function TinyCookie({ cx, cy, size = 36, rot = 0 }: { cx: number; cy: number; size?: number; rot?: number }) {
  const s = size / 36;
  return (
    <g transform={`translate(${cx},${cy}) rotate(${rot}) scale(${s})`}>
      <path d="M 0 0 C -16 -10 -32 -4 -30 10 C -28 20 -12 22 0 16 Z"
        fill="#D4954A" stroke="#A06828" strokeWidth="1.5" />
      <path d="M 0 0 C 16 -10 32 -4 30 10 C 28 20 12 22 0 16 Z"
        fill="#D4954A" stroke="#A06828" strokeWidth="1.5" />
      <path d="M -12 -2 Q 0 5 12 -2" stroke="#E8B870" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <ellipse cx="0" cy="8" rx="2" ry="6" fill="#A06828" opacity="0.45" />
    </g>
  );
}

/* ── Whole cookie (decorative, outside jar) ── */
function WholeCookieDecor({ cx, cy, rot = 0, sc = 1 }: { cx: number; cy: number; rot?: number; sc?: number }) {
  return (
    <g transform={`translate(${cx},${cy}) rotate(${rot}) scale(${sc})`}>
      <path d="M 0 0 C -22 -14 -44 -6 -42 14 C -40 28 -18 30 0 22 Z"
        fill="#D4954A" stroke="#A06828" strokeWidth="1.8" />
      <path d="M 0 0 C 22 -14 44 -6 42 14 C 40 28 18 30 0 22 Z"
        fill="#D4954A" stroke="#A06828" strokeWidth="1.8" />
      <path d="M -16 -3 Q 0 7 16 -3" stroke="#E8B870" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M -20 6 Q 0 14 20 6" stroke="#E8B870" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.6" />
      <ellipse cx="0" cy="11" rx="2.5" ry="8" fill="#A06828" opacity="0.5" />
    </g>
  );
}

/* ── Cracked open cookie (decorative, with paper slip) ── */
function CrackedCookieDecor({ cx, cy, rot = 0 }: { cx: number; cy: number; rot?: number }) {
  return (
    <g transform={`translate(${cx},${cy}) rotate(${rot})`}>
      <g transform="rotate(-28) translate(-10,0)">
        <path d="M 0 0 C -22 -14 -44 -6 -42 14 C -40 28 -18 30 0 22 Z"
          fill="#D4954A" stroke="#A06828" strokeWidth="1.8" />
        <path d="M -18 -3 C -30 3 -34 12 -30 20" stroke="#E8B870" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </g>
      <g transform="rotate(22) translate(14,6)">
        <path d="M 0 0 C 22 -14 44 -6 42 14 C 40 28 18 30 0 22 Z"
          fill="#D4954A" stroke="#A06828" strokeWidth="1.8" />
        <path d="M 18 -3 C 30 3 34 12 30 20" stroke="#E8B870" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </g>
      <rect x="-11" y="6" width="22" height="10" rx="2" fill="#F5F3EE" stroke="#D8D0C0" strokeWidth="0.8" />
      <line x1="-8" y1="9.5" x2="8" y2="9.5" stroke="#C0B8A8" strokeWidth="0.8" />
      <line x1="-6" y1="12.5" x2="6" y2="12.5" stroke="#C0B8A8" strokeWidth="0.8" />
    </g>
  );
}

export default function CookieJar({ onFortunePicked, shownIds, disabled, onShuffle }: Props) {
  const [phase, setPhase] = useState<'idle' | 'rising' | 'cracking' | 'open' | 'done'>('idle');
  const [rarity, setRarity] = useState<CookieRarity>('normal');
  const [fortune, setFortune] = useState<Fortune | null>(null);

  const handleClick = useCallback(() => {
    if (disabled || phase !== 'idle') return;
    const { fortune: f, rarity: r } = pickFortune(shownIds);
    setRarity(r);
    setFortune(f);
    setPhase('rising');
    setTimeout(() => setPhase('cracking'), 800);
    setTimeout(() => setPhase('open'), 1100);
    setTimeout(() => {
      setPhase('done');
      onFortunePicked(f, r);
      setTimeout(() => setPhase('idle'), 500);
    }, 3000);
  }, [disabled, phase, shownIds, onFortunePicked]);

  const isOpen = phase === 'open' || phase === 'done';

  const innerCookies = [
    { cx: 178, cy: 150, rot: 20, s: 40 },
    { cx: 236, cy: 136, rot: -15, s: 38 },
    { cx: 162, cy: 164, rot: 55, s: 36 },
    { cx: 258, cy: 158, rot: -35, s: 40 },
    { cx: 208, cy: 172, rot: 85, s: 34 },
    { cx: 242, cy: 148, rot: 115, s: 36 },
    { cx: 194, cy: 126, rot: -55, s: 38 },
    { cx: 252, cy: 140, rot: 10, s: 34 },
    { cx: 176, cy: 156, rot: 78, s: 36 },
    { cx: 220, cy: 160, rot: 145, s: 32 },
  ];

  const hearts = [
    { x: 122, y: 270, s: 44 }, { x: 196, y: 312, s: 50 }, { x: 280, y: 268, s: 42 },
    { x: 160, y: 240, s: 34 }, { x: 252, y: 304, s: 38 }, { x: 314, y: 332, s: 40 },
    { x: 138, y: 356, s: 34 }, { x: 234, y: 364, s: 46 }, { x: 302, y: 260, s: 34 },
    { x: 175, y: 396, s: 30 }, { x: 278, y: 392, s: 32 }, { x: 96, y: 318, s: 28 },
    { x: 342, y: 300, s: 30 },
  ];

  return (
    <div style={{ position: 'relative', display: 'inline-block', userSelect: 'none' }}>

      {/* ── ANIMATION COOKIE ── */}
      <AnimatePresence>
        {phase !== 'idle' && fortune && (
          <motion.div
            style={{
              position: 'absolute', left: '50%', top: '10%', x: '-50%',
              zIndex: 40, width: 290, pointerEvents: 'none',
            }}
            initial={{ y: 90, scale: 0.55, opacity: 0 }}
            animate={phase === 'rising'
              ? { y: -85, scale: 1.05, opacity: 1 }
              : { y: -105, scale: 1.15, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 150, damping: 18 }}
          >
            {/* Paper slip */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, scaleY: 0.3, y: 10 }}
                  animate={{ opacity: 1, scaleY: 1, y: 0 }}
                  transition={{ delay: 0.1, type: 'spring', stiffness: 220, damping: 24 }}
                  style={{
                    position: 'absolute', top: 74, left: '50%',
                    transform: 'translateX(-50%)',
                    width: 205,
                    background: '#FFFDF8',
                    borderRadius: 6,
                    padding: '10px 14px',
                    boxShadow: '0 4px 18px rgba(80,40,0,0.2)',
                    border: '1px solid #E8DCCA',
                    zIndex: 35,
                  }}
                >
                  <p style={{
                    fontFamily: 'Fraunces, Georgia, serif',
                    fontStyle: 'italic',
                    fontSize: 13,
                    lineHeight: 1.55,
                    color: '#3A2008',
                    margin: 0,
                    textAlign: 'center',
                  }}>
                    {fortune.text}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Cookie halves */}
            <div style={{ position: 'relative', width: 270, height: 175, margin: '0 auto' }}>
              <motion.div style={{ position: 'absolute', inset: 0, clipPath: 'inset(0 50% 0 0)', transformOrigin: '100% 65%' }}
                animate={phase === 'cracking' ? { rotate: -12, x: -10 } : phase === 'open' ? { rotate: -40, x: -44, y: 26 } : { rotate: 0, x: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 22 }}>
                <BigCookie rarity={rarity} w={270} h={175} />
              </motion.div>
              <motion.div style={{ position: 'absolute', inset: 0, clipPath: 'inset(0 0 0 50%)', transformOrigin: '0% 65%' }}
                animate={phase === 'cracking' ? { rotate: 12, x: 10 } : phase === 'open' ? { rotate: 40, x: 44, y: 26 } : { rotate: 0, x: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 22 }}>
                <BigCookie rarity={rarity} w={270} h={175} />
              </motion.div>
            </div>

            {/* Sparkles */}
            {isOpen && [
              { s: '✦', ox: -95, oy: -50, c: '#F9A8D4', f: 22 },
              { s: '♥', ox: 100, oy: -44, c: '#FBBF24', f: 20 },
              { s: '✦', ox: 82, oy: 60, c: '#A78BFA', f: 16 },
              { s: '♥', ox: -85, oy: 55, c: '#6EE7B7', f: 18 },
              { s: '★', ox: -115, oy: 5, c: '#FCA5A5', f: 20 },
              { s: '★', ox: 115, oy: 2, c: '#93C5FD', f: 18 },
            ].map((d, i) => (
              <motion.span key={i}
                style={{ position: 'absolute', top: '50%', left: '50%', fontSize: d.f, color: d.c, lineHeight: 1, pointerEvents: 'none' }}
                initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                animate={{ x: d.ox, y: d.oy, opacity: [0, 1, 1, 0], scale: [0, 1.3, 1, 0.5] }}
                transition={{ delay: i * 0.06, duration: 1.1, ease: 'easeOut' }}
              >
                {d.s}
              </motion.span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── JAR SVG ── */}
      <div onClick={handleClick} className={phase === 'idle' ? 'jar-cursor' : 'cursor-default'}>
        <svg viewBox="0 0 490 510" fill="none" xmlns="http://www.w3.org/2000/svg"
          style={{ width: 'min(460px, 90vw)', height: 'auto', overflow: 'visible', display: 'block' }}>
          <defs>
            <radialGradient id="jbody" cx="32%" cy="28%" r="72%">
              <stop offset="0%" stopColor="#FAF3E0" />
              <stop offset="100%" stopColor="#E4D4A8" />
            </radialGradient>
            <radialGradient id="jrim" cx="38%" cy="32%" r="65%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#EEE4C8" />
            </radialGradient>
            <radialGradient id="jint" cx="44%" cy="36%" r="62%">
              <stop offset="0%" stopColor="#D8C898" />
              <stop offset="100%" stopColor="#907038" />
            </radialGradient>
            <clipPath id="jint-clip">
              <ellipse cx="218" cy="163" rx="132" ry="54" />
            </clipPath>
          </defs>

          {/* Shadow under jar */}
          <ellipse cx="230" cy="462" rx="162" ry="18" fill="rgba(50,25,5,0.18)" />

          {/* Handle (behind body) */}
          <path d="M 82 204 C 24 204 24 278 82 278"
            fill="none" stroke="#EEE4C8" strokeWidth="34" strokeLinecap="round" />
          <path d="M 82 210 C 36 210 36 272 82 272"
            fill="none" stroke="#FFFFFF" strokeWidth="16" strokeLinecap="round" opacity="0.75" />
          <path d="M 82 218 C 48 218 48 264 82 264"
            fill="none" stroke="#E4D8B0" strokeWidth="6" strokeLinecap="round" opacity="0.5" />

          {/* Jar body */}
          <path d="M 70 180 C 56 262 60 358 80 426 Q 218 460 356 426 C 376 358 380 262 366 180 Z"
            fill="url(#jbody)" />

          {/* Hearts on body */}
          {hearts.map((h, i) => <Heart key={i} x={h.x} y={h.y} size={h.s} />)}

          {/* Dot accents near hearts */}
          {[
            [145, 256], [118, 282], [216, 298], [190, 325],
            [298, 256], [274, 282], [158, 368], [255, 378],
            [325, 345], [108, 332], [352, 284], [165, 410], [285, 408],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="2.8" fill="#DC2626" opacity="0.5" />
          ))}

          {/* Body left gloss */}
          <path d="M 76 205 C 66 268 68 342 86 418 C 100 342 98 268 88 205 Z"
            fill="rgba(255,255,255,0.22)" />

          {/* Outer rim */}
          <ellipse cx="218" cy="163" rx="154" ry="64" fill="url(#jrim)" />

          {/* Interior dark */}
          <ellipse cx="218" cy="163" rx="132" ry="54" fill="url(#jint)" />

          {/* Cookies inside */}
          <g clipPath="url(#jint-clip)">
            {/* bottom shadow */}
            <ellipse cx="218" cy="198" rx="134" ry="28" fill="rgba(60,30,5,0.3)" />
            {innerCookies.map((c, i) => (
              <TinyCookie key={i} cx={c.cx} cy={c.cy} rot={c.rot} size={c.s} />
            ))}
            {/* paper slips visible */}
            {[[178, 148], [248, 138], [208, 166]].map(([px, py], i) => (
              <g key={i}>
                <rect x={px - 8} y={py - 5} width="16" height="7" rx="1.5"
                  fill="#F5F2EE" opacity="0.92" stroke="#D8D0C0" strokeWidth="0.6" />
              </g>
            ))}
          </g>

          {/* Rim inner shadow ring */}
          <ellipse cx="218" cy="163" rx="132" ry="54"
            fill="none" stroke="rgba(60,30,5,0.12)" strokeWidth="7" />

          {/* Rim front highlight */}
          <path d="M 86 163 A 132 54 0 0 0 350 163"
            stroke="rgba(255,255,255,0.55)" strokeWidth="4" fill="none" />

          {/* Outer rim highlight ring */}
          <ellipse cx="218" cy="163" rx="154" ry="64"
            fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="3" />

          {/* Body bottom edge highlight */}
          <path d="M 84 422 Q 218 456 352 422" stroke="rgba(255,255,255,0.2)" strokeWidth="3" fill="none" />

          {/* ── Decorative cookies outside jar (right side) ── */}
          {/* Shadow under cookies */}
          <ellipse cx="398" cy="334" rx="46" ry="9" fill="rgba(50,25,5,0.14)" />
          <ellipse cx="405" cy="430" rx="42" ry="7" fill="rgba(50,25,5,0.14)" />

          {/* Whole cookie */}
          <WholeCookieDecor cx={398} cy={318} rot={-12} sc={1.15} />

          {/* Cracked cookie with paper */}
          <CrackedCookieDecor cx={406} cy={412} rot={8} />
        </svg>
      </div>

      {/* ── Shuffle button ── */}
      {onShuffle && (
        <motion.button
          onClick={e => { e.stopPropagation(); onShuffle(); }}
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.96 }}
          style={{
            position: 'absolute', bottom: -48, right: 0,
            background: 'rgba(255,255,255,0.88)',
            border: '1px solid rgba(160,110,60,0.2)',
            borderRadius: 999,
            padding: '9px 20px',
            fontSize: 14,
            fontFamily: 'Inter, sans-serif',
            color: '#5A3C22',
            cursor: 'pointer',
            boxShadow: '0 2px 12px rgba(60,30,5,0.12)',
            backdropFilter: 'blur(8px)',
          }}
        >
          Shuffle the jar
        </motion.button>
      )}
    </div>
  );
}
