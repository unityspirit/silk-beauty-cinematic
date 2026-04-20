import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useScrollProgress } from '../context/ScrollContext';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { progress } = useScrollProgress();
  
  const scrolled = progress > 0.02;

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ru' : 'en');
  };

  return (
    <header className={`fixed w-full top-0 z-50 transition-all duration-700 ease-in-out border-b border-white/5 ${scrolled ? 'bg-background/80 backdrop-blur-xl py-4' : 'bg-transparent py-4 md:py-8'}`}>
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex justify-between items-center">
        {/* Nav Links - Desktop */}
        <nav className="hidden md:flex gap-8 items-center text-xs tracking-[0.2em] uppercase text-surface-tint">
          {t.nav.slice(0, 2).map((item, idx) => (
            <a key={idx} href={`#${item.toLowerCase()}`} className="hover:text-white transition-colors duration-300">{item}</a>
          ))}
        </nav>

        {/* Logo */}
        <a href="/" className="absolute left-1/2 -translate-x-1/2 text-center group">
          <h1 className="text-xl md:text-3xl font-bold tracking-[0.15em] serif-display text-white group-hover:text-glow transition-all duration-500">
            UnitySpirit
          </h1>
          <p className="text-[9px] uppercase tracking-[0.3em] text-surface-tint mt-1 mr-[-0.3em]">Restoration</p>
        </a>

        {/* Action button - Desktop */}
        <div className="hidden md:flex items-center gap-6">
          <a href="#archive" className="text-xs tracking-[0.2em] uppercase text-surface-tint hover:text-white transition-colors duration-300">{t.nav[2]}</a>
          <button onClick={toggleLanguage} className="text-xs tracking-[0.1em] uppercase border border-outline-variant px-4 py-2 hover:bg-white hover:text-background transition-all duration-500 min-w-16">
            {language === 'en' ? 'RU' : 'EN'}
          </button>
        </div>

        {/* Mobile Menu Toggle & Lang (Mobile) */}
        <div className="md:hidden flex items-center gap-3">
          <button onClick={toggleLanguage} className="text-xs tracking-[0.1em] uppercase border border-outline-variant px-3 py-1 text-white hover:bg-white hover:text-background transition-all duration-300">
            {language === 'en' ? 'RU' : 'EN'}
          </button>
          <button 
            className="text-white flex gap-1 items-center"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="text-[10px] uppercase tracking-widest">{menuOpen ? 'Close' : 'Menu'}</span>
            <span className="material-symbols-outlined text-[18px]">{menuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-background/95 backdrop-blur-xl border-b border-white/5 p-6 md:hidden flex flex-col gap-6 text-center animate-fade-in">
           <a href="#portfolio" className="text-sm tracking-[0.2em] uppercase text-surface-tint hover:text-white transition-colors">{t.nav[0]}</a>
           <a href="#assembly" className="text-sm tracking-[0.2em] uppercase text-surface-tint hover:text-white transition-colors">{t.nav[1]}</a>
           <a href="#journal" className="text-sm tracking-[0.2em] uppercase text-surface-tint hover:text-white transition-colors">{t.nav[2]}</a>
        </div>
      )}
    </header>
  );
}
