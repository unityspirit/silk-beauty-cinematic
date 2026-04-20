import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

export const TheAssembly = () => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
      
      {/* Text Content */}
      <div className="w-full lg:w-1/2 flex flex-col gap-8 order-2 lg:order-1 text-center md:text-left">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-secondary font-sans text-sm tracking-widest uppercase mb-4 block">
            {t.assembly.sectionNum}
          </span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-2 text-shadow-md">
            {t.assembly.headlineMain}
          </h2>
          <h3 className="font-serif text-3xl md:text-4xl text-white/90 leading-tight drop-shadow-sm">
            {t.assembly.headlineSub}
          </h3>
        </motion.div>

        <motion.div 
          className="flex flex-col gap-6 mt-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            visible: { transition: { staggerChildren: 0.2 } },
            hidden: {}
          }}
        >
          {t.assembly.paragraphs.map((p, i) => (
            <motion.p 
              key={i} 
              className="text-lg text-white/80 leading-relaxed max-w-lg drop-shadow-sm"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
              }}
            >
              {p}
            </motion.p>
          ))}
        </motion.div>
      </div>

      {/* Image with simple hover scale */}
      <div className="w-full lg:w-1/2 order-1 lg:order-2 h-[45vh] md:h-[60vh] lg:h-[70vh] overflow-hidden rounded-xl border border-white/10 shadow-2xl relative bg-black/40 backdrop-blur-md">
        <motion.div className="w-full h-full">
          <img 
            src={t.assembly.image} 
            alt={t.assembly.imageCaption}
            className="w-full h-full object-cover opacity-90 transition-transform duration-1000 hover:scale-110"
          />
        </motion.div>
        <div className="absolute bottom-4 right-4 text-xs font-sans tracking-widest uppercase text-white/90 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
          {t.assembly.imageCaption}
        </div>
      </div>

    </div>
  );
};
