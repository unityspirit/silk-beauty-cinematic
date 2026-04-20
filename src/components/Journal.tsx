import { useLanguage } from '../context/LanguageContext';

export function Journal() {
  const { t } = useLanguage();
  const { title, description, placeholder, subscribe } = t.journal;

  return (
    <div className="relative text-center w-full max-w-3xl mx-auto backdrop-blur-md bg-black/20 p-8 md:p-16 rounded-3xl border border-white/10 shadow-2xl">
      {/* Abstract Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[300px] border border-white/5 rounded-[100%] blur-[10px] opacity-20 pointer-events-none"></div>

      <div className="relative z-10">
        <h2 className="serif-display text-4xl md:text-6xl text-white mb-6 text-shadow-md">
          {title}
        </h2>
        <p className="text-white/80 font-light tracking-wide leading-relaxed mb-12 max-w-lg mx-auto drop-shadow-sm">
          {description}
        </p>

        <form className="flex flex-col md:flex-row gap-4 max-w-xl mx-auto" onSubmit={(e) => e.preventDefault()}>
          <input 
            type="email" 
            placeholder={placeholder}
            className="flex-1 bg-black/40 backdrop-blur-md border border-white/20 py-4 px-6 rounded-full text-white placeholder:text-white/50 focus:outline-none focus:border-white transition-colors"
            required
          />
          <button 
            type="submit"
            className="text-xs tracking-[0.1em] uppercase bg-white text-black font-semibold rounded-full px-8 py-4 hover:bg-white/90 hover:scale-105 transition-all duration-300 whitespace-nowrap"
          >
            {subscribe}
          </button>
        </form>
      </div>
    </div>
  );
}
