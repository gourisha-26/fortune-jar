export type FortuneCategory =
  | 'work'
  | 'student'
  | 'relationship'
  | 'technology'
  | 'food'
  | 'social'
  | 'chaotic'
  | 'wholesome'
  | 'rare_golden'
  | 'rare_rainbow';

export interface Fortune {
  id: number;
  text: string;
  category: FortuneCategory;
  luckyNumber: number;
  luckyDrink: string;
  luckyEmoji: string;
}

const drinks = [
  'Bubble Tea', 'Matcha Latte', 'Iced Americano', 'Oat Milk Latte',
  'Jasmine Tea', 'Chai', 'Cold Brew', 'Sparkling Water', 'Hojicha',
  'Lavender Lemonade', 'Strawberry Milk', 'Oolong Tea', 'Hot Cocoa',
  'Peppermint Tea', 'Coconut Water', 'Yuzu Soda', 'Rose Milk Tea',
];

const emojis = [
  '🦆', '🐸', '🌸', '✨', '🍀', '🦋', '🐙', '🍜', '🌈', '🎯',
  '🦊', '🐝', '🌻', '🎪', '🍵', '🐠', '🌿', '🎭', '🦄', '🍩',
  '🐧', '🌙', '⭐', '🎨', '🦩', '🐿️', '🌺', '🎠', '🍋', '🐬',
];

const fortuneTexts: Omit<Fortune, 'id' | 'luckyNumber' | 'luckyDrink' | 'luckyEmoji'>[] = [
  // User fortunes
  { text: "Your next \"why not?\" becomes your best decision.", category: 'wholesome' },
  { text: "The plot is about to thicken... in your favor.", category: 'wholesome' },
  { text: "Your luck just updated to Version 2.0.", category: 'chaotic' },
  { text: "Tomorrow owes you a little surprise.", category: 'wholesome' },
  { text: "Something you've been waiting for is finally getting unstuck.", category: 'wholesome' },
  { text: "Your \"it is what it is\" era is ending.", category: 'wholesome' },
  { text: "The universe just bookmarked your name.", category: 'wholesome' },
  { text: "You're closer than you think. Keep going.", category: 'wholesome' },
  { text: "Your next chapter has better lighting.", category: 'wholesome' },
  { text: "Soon, you'll laugh about what you're stressing over today.", category: 'wholesome' },
  { text: "Someone has your name in their head more than you'd guess.", category: 'social' },
  { text: "A conversation you've been avoiding is about to go surprisingly well.", category: 'social' },
  { text: "Expect an unexpected text.", category: 'social' },
  { text: "Someone's typing... eventually.", category: 'social' },
  { text: "Your next favorite person isn't in your contacts yet.", category: 'social' },
  { text: "Love is taking the scenic route.", category: 'relationship' },
  { text: "The right people are slowly finding you.", category: 'relationship' },
  { text: "Someone misses your energy.", category: 'social' },
  { text: "Your wallet is manifesting better days.", category: 'chaotic' },
  { text: "A random opportunity is closer than payday.", category: 'wholesome' },
  { text: "Your future self already thanked you for today's effort.", category: 'wholesome' },
  { text: "Your next \"yes\" is worth more than you think.", category: 'wholesome' },
  { text: "Keep cooking. Something big is almost ready.", category: 'wholesome' },
  { text: "You're about to accidentally impress someone important.", category: 'work' },
  { text: "Success is literally looking for your address.", category: 'wholesome' },
  { text: "The grind is about to send a receipt.", category: 'work' },
  { text: "Your next screenshot will become lore.", category: 'chaotic' },
  { text: "You'll say \"just one episode.\" You won't mean it.", category: 'chaotic' },
  { text: "Someone will send you a meme at exactly the right time.", category: 'social' },
  { text: "Your next impulse decision will somehow work out.", category: 'chaotic' },
  { text: "The tea is approaching.", category: 'chaotic' },
  { text: "Your playlist knows something you don't.", category: 'chaotic' },
  { text: "A plot twist is loading... please wait.", category: 'chaotic' },
  { text: "You'll remember why you walked into the room. Eventually.", category: 'chaotic' },
  { text: "The universe ships this storyline.", category: 'wholesome' },
  { text: "Tomorrow has \"main character\" energy.", category: 'wholesome' },
  { text: "You'll make someone smile without realizing it.", category: 'wholesome' },
  { text: "A tiny moment will become a core memory.", category: 'wholesome' },
  { text: "Future you is secretly proud of current you.", category: 'wholesome' },
  { text: "Peace is closer than perfection.", category: 'wholesome' },
  { text: "Something small today will matter a lot later.", category: 'wholesome' },
  { text: "Your kindness is quietly paying dividends.", category: 'wholesome' },
  { text: "A fresh start is already looking for you.", category: 'wholesome' },
  { text: "You're becoming someone younger you would admire.", category: 'wholesome' },
  { text: "Reply to that message. Yes, that one.", category: 'social' },
  { text: "Stop checking. It'll happen anyway.", category: 'chaotic' },
  { text: "The algorithm is finally on your side.", category: 'technology' },
  { text: "Your \"For You\" page is about to get suspiciously accurate.", category: 'technology' },
  { text: "Your screen time is high, but so is your potential.", category: 'technology' },
  { text: "The universe just left you on \"typing...\"", category: 'chaotic' },
  { text: "You're one random Tuesday away from a life-changing moment.", category: 'wholesome' },
  { text: "Your next notification might actually be exciting.", category: 'chaotic' },
  { text: "Someone is about to become your new favorite notification.", category: 'social' },
  { text: "This cookie has seen your future... it includes snacks.", category: 'food' },

  // Rare golden
  { text: "The universe has been quietly arranging something wonderful for you. Be patient — it's almost ready.", category: 'rare_golden' },
  { text: "You hold a rare kind of energy: the sort that makes rooms feel warmer and lighter.", category: 'rare_golden' },
  { text: "Today, luck bends toward you. Accept the unexpected thing with open hands.", category: 'rare_golden' },
  { text: "Something you've hoped for longer than you'll admit is closer than you think.", category: 'rare_golden' },

  // Rare rainbow
  { text: "You are a once-in-a-generation combination of brilliant, stubborn, and endlessly loveable. The world is luckier for it.", category: 'rare_rainbow' },
  { text: "Congratulations: you have found the rarest fortune. It says you are exactly where you need to be, doing exactly enough. ✨", category: 'rare_rainbow' },
  { text: "The stars aligned specifically for this moment. Not the fortune — the fact that you're here, reading this, still going. That's the miracle.", category: 'rare_rainbow' },
];

export const FORTUNES: Fortune[] = fortuneTexts.map((f, i) => ({
  ...f,
  id: i + 1,
  luckyNumber: Math.floor(Math.random() * 20) + 1,
  luckyDrink: drinks[i % drinks.length],
  luckyEmoji: emojis[i % emojis.length],
}));

export type CookieRarity = 'normal' | 'golden' | 'rainbow';

export function pickFortune(shown: Set<number>): { fortune: Fortune; rarity: CookieRarity; resetShown: boolean } {
  const roll = Math.random();
  let rarity: CookieRarity = 'normal';
  if (roll < 0.01) rarity = 'rainbow';
  else if (roll < 0.05) rarity = 'golden';

  const pool = FORTUNES.filter(f => {
    if (rarity === 'rainbow') return f.category === 'rare_rainbow';
    if (rarity === 'golden') return f.category === 'rare_golden';
    return f.category !== 'rare_golden' && f.category !== 'rare_rainbow';
  });

  const unseen = pool.filter(f => !shown.has(f.id));
  const resetShown = unseen.length === 0;
  const source = resetShown ? pool : unseen;
  return {
    fortune: source[Math.floor(Math.random() * source.length)],
    rarity,
    resetShown,
  };
}
