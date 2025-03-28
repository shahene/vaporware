import React, { useState, useEffect } from 'react';

interface Quote {
  text: string;
  author: string;
  category: string;
}

const quotes: Quote[] = [
  {
    text: "Every cigarette not smoked is a step toward a longer, healthier life.",
    author: "Anonymous",
    category: "health"
  },
  {
    text: "The greatest wealth is health. Protect it by staying smoke-free.",
    author: "Virgil",
    category: "health"
  },
  {
    text: "Your lungs are healing with every breath of clean air you take.",
    author: "Anonymous",
    category: "health"
  },
  {
    text: "The purpose of technology is not to confuse the brain but to serve the body. Free your body from nicotine.",
    author: "William S. Burroughs",
    category: "tech"
  },
  {
    text: "Take care of your body. It's the only place you have to live, and it deserves to be free from smoke.",
    author: "Jim Rohn",
    category: "health"
  },
  {
    text: "The future belongs to those who believe in the beauty of their smoke-free dreams.",
    author: "Eleanor Roosevelt (adapted)",
    category: "inspiration"
  },
  {
    text: "Longevity is the reward for a life well-lived and choices well-made.",
    author: "David Sinclair",
    category: "longevity"
  },
  {
    text: "The key to longevity is eliminating harmful habits and embracing healthy ones.",
    author: "Anonymous",
    category: "longevity"
  },
  {
    text: "Aging is not lost youth but a new stage of opportunity and strength. Don't let smoking rob you of it.",
    author: "Betty Friedan",
    category: "longevity"
  },
  {
    text: "The greatest impact in the world is made by those who choose to live longer, healthier, smoke-free lives.",
    author: "David Sinclair",
    category: "longevity"
  },
  {
    text: "Your habits will determine your future. Choose a smoke-free life for a longer future.",
    author: "Jack Ma",
    category: "inspiration"
  },
  {
    text: "The biggest room in the world is the room for improvement. Start by improving your lung health.",
    author: "Helmut Schmidt",
    category: "inspiration"
  },
  {
    text: "The only way to do great work is to love what you do. And to do it with healthy, smoke-free lungs.",
    author: "Steve Jobs",
    category: "tech"
  },
  {
    text: "The future depends on what you do today. Each day without vaping adds to your lifespan.",
    author: "Mahatma Gandhi",
    category: "inspiration"
  },
  {
    text: "Breathing clean air is the first luxury. Enjoy it fully by staying vape-free.",
    author: "Coco Chanel (adapted)",
    category: "health"
  },
  {
    text: "The human body is the best picture of the human soul. Keep both clean from smoke.",
    author: "Ludwig Wittgenstein",
    category: "health"
  },
  {
    text: "Longevity is the ultimate form of wealth. Don't trade it for temporary pleasure.",
    author: "Anonymous",
    category: "longevity"
  },
  {
    text: "Those who think they have no time for healthy habits will sooner or later have to find time for illness.",
    author: "Edward Stanley",
    category: "health"
  },
  {
    text: "The science of today is the technology of tomorrow. Science clearly shows: no smoking means longer living.",
    author: "Edward Teller",
    category: "tech"
  },
  {
    text: "Your future self is watching you right now through memories. Make those memories smoke-free.",
    author: "Anonymous",
    category: "inspiration"
  }
];

const MotivationalQuote: React.FC = () => {
  const [quote, setQuote] = useState<Quote | null>(null);
  
  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex]);
  };
  
  useEffect(() => {
    getRandomQuote();
    
    // Change quote every day
    const interval = setInterval(getRandomQuote, 24 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);
  
  if (!quote) return null;
  
  return (
    <div className="card">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <blockquote style={{ fontSize: '1.25rem', color: '#e2e8f0', fontStyle: 'italic', marginBottom: '1rem' }}>
          "{quote.text}"
        </blockquote>
        <cite style={{ color: 'var(--primary-color)', fontStyle: 'normal' }}>— {quote.author}</cite>
        <button 
          onClick={getRandomQuote}
          className="btn btn-primary"
          style={{ marginTop: '1rem' }}
        >
          New Quote
        </button>
      </div>
    </div>
  );
};

export default MotivationalQuote; 