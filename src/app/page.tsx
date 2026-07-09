'use client';
import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Fortune, CookieRarity } from '@/data/fortunes';
import FortuneCard from '@/components/FortuneCard';
import Confetti from '@/components/Confetti';
import { useAchievements } from '@/hooks/useAchievements';
import { pickFortune } from '@/data/fortunes';

const COOKIE_IMGS = ['/cookie1.png', '/cookie3.png', '/cookie4.png', '/cookie5.png'];
const BREAK_MAP: Record<string, string> = {
  '/cookie1.png': '/break_cookie1.png',
  '/cookie3.png': '/break_cookie3.png',
  '/cookie4.png': '/break_cookie4.png',
  '/cookie5.png': '/break_cookie5.png',
};

export default function HomePage() {
  const [fortune, setFortune] = useState<Fortune | null>(null);
  const [rarity, setRarity] = useState<CookieRarity>('normal');
  const [showConfetti, setShowConfetti] = useState(false);
  const [jarBusy, setJarBusy] = useState(false);
  // phase: idle → rising → cracking (break image) → settled (fortune card) → idle
  const [phase, setPhase] = useState<'idle' | 'rising' | 'cracking' | 'settled'>('idle');
  const [jarImg, setJarImg] = useState('/jar-bg1.png.png');
  const [cookieImg, setCookieImg] = useState<string>('/cookie1.png');

  const { cookieCount, favorites, shownIds, recordCookieOpen, recordShare, resetShownIds, toggleFavorite } = useAchievements();

  const handleJarClick = useCallback(() => {
    if (jarBusy || phase !== 'idle') return;
    const { fortune: f, rarity: r, resetShown } = pickFortune(shownIds);
    if (resetShown) resetShownIds();

    // Pick a random cookie image immediately
    const idx = Math.floor(Math.random() * COOKIE_IMGS.length);
    const picked = COOKIE_IMGS[idx];
    setCookieImg(picked);

    setJarBusy(true);
    setPhase('rising');

    // Cookie rises, then cracks, then fortune card appears
    setTimeout(() => {
      setCookieImg(BREAK_MAP[picked] ?? picked);
      setPhase('cracking');
    }, 700);

    setTimeout(() => {
      setPhase('settled');
      setFortune(f);
      setRarity(r);
      recordCookieOpen(r, f.id);
      if (r !== 'normal') {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 4000);
      }
    }, 1200);
  }, [jarBusy, phase, shownIds, recordCookieOpen, resetShownIds]);

  const handlePickAnother = useCallback(() => {
    setFortune(null);
    setJarBusy(false);
    setPhase('idle');
  }, []);

  const handleShare = useCallback(() => {
    if (!fortune) return;
    recordShare();
    const text = `🥠 Your Fortune Jar\n\n"${fortune.text}"\n\nLucky Number: ${fortune.luckyNumber}`;
    if (navigator.share) navigator.share({ title: 'My Fortune', text }).catch(() => {});
    else navigator.clipboard.writeText(text).catch(() => {});
  }, [fortune, recordShare]);

  const isAnimating = phase !== 'idle';
  const isCracking = phase === 'cracking';

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', userSelect: 'none' }}>

      {/* Background */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        backgroundImage: "url('/bg1.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
      }} />

      <Confetti active={showConfetti} />

      {/* Title */}
      <motion.div
        animate={{ marginBottom: isAnimating ? 40 : 0 }}
        transition={{ type: 'spring', stiffness: 180, damping: 22 }}
        style={{ position: 'relative', zIndex: 10, padding: '38px 32px 28px', textAlign: 'center' }}>
        <h1 style={{
          fontFamily: 'Fraunces, Georgia, serif',
          fontWeight: 800,
          fontSize: 'clamp(2.4rem, 5.5vw, 4rem)',
          color: '#1C100A',
          lineHeight: 1.1,
          margin: 0,
          letterSpacing: '-0.02em',
        }}>
          Your Fortune Jar
        </h1>
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: 'clamp(0.82rem, 1.8vw, 0.95rem)',
          color: '#1C100A',
          opacity: 0.65,
          margin: '5px 0 0',
        }}>
          Every cookie hides a tiny surprise.
        </p>
      </motion.div>

      {/* Jar — enlarges and pins to bottom when cookie rises */}
      <motion.div
        onClick={handleJarClick}
        className={phase === 'idle' ? 'jar-cursor' : 'cursor-default'}
        style={{
          position: 'fixed',
          left: '50%',
          x: '-50%',
          zIndex: 15,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
        animate={isAnimating
          ? { top: '85%', y: '-30%', width: 'min(800px, 115vw)' }
          : { top: '54%', y: '-50%', width: 'min(460px, 68vw)' }
        }
        transition={{ type: 'spring', stiffness: 160, damping: 22 }}
      >
        <img
          src={jarImg}
          alt="Fortune Jar"
          style={{ width: '100%', height: 'auto', display: 'block', pointerEvents: 'none' }}
        />
      </motion.div>

      {/* Cookie — rises out of the jar, crossfades to break version */}
      <AnimatePresence>
        {isAnimating && (
          <motion.div
            style={{
              position: 'fixed',
              left: '50%',
              zIndex: 50,
              width: 'min(400px, 60vw)',
              pointerEvents: 'none',
              x: '-50%',
            }}
            initial={{ top: '42%', scale: 0.5, opacity: 0 }}
            animate={{ top: '24%', scale: 1, opacity: 1 }}
            exit={{ top: '42%', scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 160, damping: 20 }}
          >
            {/* Whole cookie — visible during rising phase */}
            <AnimatePresence>
              {!isCracking && (
                <motion.img
                  key="whole"
                  src={cookieImg.startsWith('/break') ? cookieImg.replace('/break_', '/') : cookieImg}
                  alt="Fortune Cookie"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  style={{
                    position: 'absolute',
                    top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '55%',
                    filter: 'drop-shadow(0 16px 36px rgba(120,70,10,0.35))',
                  }}
                />
              )}
            </AnimatePresence>

            {/* Break cookie — fades in during cracking phase with shake */}
            <AnimatePresence>
              {isCracking && (
                <motion.img
                  key="broken"
                  src={cookieImg}
                  alt="Broken Fortune Cookie"
                  initial={{ opacity: 0, scale: 0.88 }}
                  animate={{ opacity: 1, scale: 1, rotate: [-4, 4, -3, 3, -1, 1, 0] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                  style={{
                    position: 'absolute', inset: 0, width: '100%',
                    filter: 'drop-shadow(0 16px 36px rgba(120,70,10,0.35))',
                  }}
                />
              )}
            </AnimatePresence>

            {/* Spacer to maintain container height */}
            <img src={cookieImg} alt="" style={{ width: '100%', opacity: 0, display: 'block' }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom stack: instruction + shuffle + counter */}
      <motion.div
        animate={{ y: isAnimating ? 160 : 0, opacity: isAnimating ? 0 : 1 }}
        transition={{ type: 'spring', stiffness: 180, damping: 22 }}
        style={{
          position: 'fixed',
          bottom: 44,
          left: 0, right: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
          zIndex: 20,
          pointerEvents: 'none',
        }}>
        <motion.p
          animate={{ opacity: jarBusy ? 0.55 : 0.78 }}
          style={{ fontFamily: 'Inter, sans-serif', fontSize: 15, color: '#1C100A', margin: 0 }}
        >
          {jarBusy ? 'Reading your fortune…' : 'Click on the jar to pick a cookie'}
        </motion.p>

        <motion.button
          onClick={e => {
            e.stopPropagation();
            setJarImg(prev => prev === '/jar-bg1.png.png' ? '/jar-bg2.png.png' : '/jar-bg1.png.png');
            try { localStorage.removeItem('fortune-jar-shown'); } catch {}
          }}
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.96 }}
          style={{
            background: 'rgba(255,255,255,0.88)',
            border: '1px solid rgba(160,110,60,0.2)',
            borderRadius: 999,
            padding: '9px 22px',
            fontSize: 14,
            fontFamily: 'Inter, sans-serif',
            color: '#5A3C22',
            cursor: 'pointer',
            boxShadow: '0 2px 12px rgba(60,30,5,0.12)',
            backdropFilter: 'blur(8px)',
            pointerEvents: 'all',
          }}
        >
          Shuffle the jar
        </motion.button>

        <p style={{
          fontSize: 13,
          fontFamily: 'Inter, sans-serif',
          color: '#1C100A',
          opacity: 0.55,
          margin: 0,
        }}>
          🥠 <strong>{cookieCount.toLocaleString()}</strong> fortunes opened so far
        </p>
      </motion.div>

      {/* Credit */}
      <div style={{
        position: 'fixed',
        bottom: 14,
        left: 0,
        right: 0,
        textAlign: 'center',
        zIndex: 20,
        fontFamily: 'Inter, sans-serif',
        fontSize: 12,
        color: '#1C100A',
        opacity: 0.5,
      }}>
        made with nostalgia by{' '}
        <a
          href="https://www.linkedin.com/in/gourisha-goel/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#1C100A', textDecoration: 'underline', textUnderlineOffset: 2 }}
        >
          Gourisha Goel
        </a>{' '}❤️
      </div>

      {/* Fortune card overlay */}
      <FortuneCard
        fortune={fortune}
        rarity={rarity}
        onPickAnother={handlePickAnother}
        onShare={handleShare}
        isFavorited={fortune ? favorites.includes(fortune.id) : false}
        onFavorite={() => fortune && toggleFavorite(fortune.id)}
        cookieCount={cookieCount}
      />
    </div>
  );
}
