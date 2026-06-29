'use client';
import { useState, useEffect, useCallback } from 'react';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  unlocked: boolean;
  unlockedAt?: number;
}

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'first', title: 'First Cookie', description: 'Open your first fortune cookie', emoji: '🍪', unlocked: false },
  { id: 'addict', title: 'Cookie Addict', description: 'Open 10 fortune cookies', emoji: '🥠', unlocked: false },
  { id: 'golden', title: 'Lucky Soul', description: 'Find a Golden Cookie', emoji: '✨', unlocked: false },
  { id: 'rainbow', title: 'Legendary Finder', description: 'Find the Rainbow Cookie', emoji: '🌈', unlocked: false },
  { id: 'sharer', title: 'Fortune Teller', description: 'Share a fortune', emoji: '📜', unlocked: false },
  { id: 'collector', title: 'Cookie Jar Emptier', description: 'Open 50 fortune cookies', emoji: '🏆', unlocked: false },
];

const STORAGE_KEY = 'fortune-jar-achievements';
const COUNT_KEY = 'fortune-jar-count';
const FAVORITES_KEY = 'fortune-jar-favorites';
const SHOWN_KEY = 'fortune-jar-shown';

export function useAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);
  const [cookieCount, setCookieCount] = useState(0);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [shownIds, setShownIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setAchievements(JSON.parse(saved));
      const count = localStorage.getItem(COUNT_KEY);
      if (count) setCookieCount(parseInt(count));
      const favs = localStorage.getItem(FAVORITES_KEY);
      if (favs) setFavorites(JSON.parse(favs));
      const shown = localStorage.getItem(SHOWN_KEY);
      if (shown) setShownIds(new Set(JSON.parse(shown)));
    } catch {}
  }, []);

  const unlock = useCallback((id: string) => {
    setAchievements(prev => {
      const a = prev.find(a => a.id === id);
      if (!a || a.unlocked) return prev;
      const updated = prev.map(ac =>
        ac.id === id ? { ...ac, unlocked: true, unlockedAt: Date.now() } : ac
      );
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch {}
      setNewAchievement({ ...a, unlocked: true });
      setTimeout(() => setNewAchievement(null), 4000);
      return updated;
    });
  }, []);

  const recordCookieOpen = useCallback((rarity: 'normal' | 'golden' | 'rainbow', fortuneId: number) => {
    setCookieCount(prev => {
      const next = prev + 1;
      try { localStorage.setItem(COUNT_KEY, String(next)); } catch {}
      if (next === 1) unlock('first');
      if (next === 10) unlock('addict');
      if (next === 50) unlock('collector');
      return next;
    });
    if (rarity === 'golden') unlock('golden');
    if (rarity === 'rainbow') unlock('rainbow');
    setShownIds(prev => {
      const next = new Set(prev);
      next.add(fortuneId);
      try { localStorage.setItem(SHOWN_KEY, JSON.stringify([...next])); } catch {}
      return next;
    });
  }, [unlock]);

  const recordShare = useCallback(() => unlock('sharer'), [unlock]);

  const resetShownIds = useCallback(() => {
    setShownIds(new Set());
    try { localStorage.removeItem(SHOWN_KEY); } catch {}
  }, []);

  const toggleFavorite = useCallback((id: number) => {
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
      try { localStorage.setItem(FAVORITES_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  return { achievements, cookieCount, newAchievement, favorites, shownIds, recordCookieOpen, recordShare, resetShownIds, toggleFavorite };
}
