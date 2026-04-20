import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

export const Portfolio = () => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-24 md:gap-32 w-full">
      {t.portfolio.projects.map((item, index) => (
        <PortfolioItem key={item.id} item={item} index={index} cta={t.portfolio.cta} />
      ))}
    </div>
  );
};

const PortfolioItem = ({ item, index, cta }: { item: any, index: number, cta: string }) => {
  const isEven = index % 2 === 0;

  return (
    <div 
      className={`flex flex-col lg:flex-row gap-8 lg:gap-24 items-center ${isEven ? '' : 'lg:flex-row-reverse'}`}
    >
      <div className="w-full lg:w-[60%] h-[40vh] md:h-[50vh] lg:h-[70vh] overflow-hidden group rounded-xl border border-white/10 shadow-2xl bg-black/40 backdrop-blur-md">
        <motion.div 
          className="w-full h-full"
        >
          {/* Removed grayscale here for premium photography colors */}
          <img 
            src={item.image} 
            alt={item.title} 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-90"
          />
        </motion.div>
      </div>

      <motion.div 
        className="w-full lg:w-[40%] flex flex-col justify-center text-center md:text-left items-center md:items-start"
        initial={{ opacity: 0, x: isEven ? 50 : -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-20%' }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <span className="text-secondary font-sans text-sm tracking-widest uppercase mb-4 block">
          No. 0{item.id}
        </span>
        <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white mb-6">
          {item.title}
        </h3>
        <p className="text-on-surface-variant text-lg leading-relaxed mb-8 max-w-md">
          {item.description}
        </p>
        <button className="text-white hover:text-secondary transition-colors duration-300 flex items-center gap-2 group text-sm uppercase tracking-widest font-sans w-fit">
          <span className="h-[1px] w-8 bg-current group-hover:w-16 transition-all duration-300"></span>
          {cta}
        </button>
      </motion.div>
    </div>
  );
};
