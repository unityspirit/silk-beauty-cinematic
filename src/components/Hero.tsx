import { useLanguage } from '../context/LanguageContext';

export const Hero = () => {
  const { t } = useLanguage();

  return (
    <section className="relative w-full h-full flex items-end justify-center pt-24 pb-12 px-6 md:px-12 pointer-events-auto">
      {/* Content wrapper */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8 h-full pb-20">
        <div className="max-w-2xl text-center md:text-left h-full flex flex-col justify-end">
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-none text-white tracking-tight">
            {t.hero.titleLines.map((line, i) => (
              <span key={i} className="block drop-shadow-2xl">
                {line}
              </span>
            ))}
          </h1>
        </div>

        <div className="max-w-sm flex flex-col gap-6 items-center md:items-start text-center md:text-left drop-shadow-xl h-full justify-end pb-4">
          <p className="text-white/80 text-lg font-medium drop-shadow-md">
            {t.hero.subtitle}
          </p>
          <div>
            <button className="text-white hover:text-secondary bg-black/20 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 transition-all duration-300 flex items-center gap-2 group text-sm uppercase tracking-widest font-sans">
              <span className="h-[1px] w-8 bg-current group-hover:w-16 transition-all duration-300"></span>
              {t.hero.cta}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
