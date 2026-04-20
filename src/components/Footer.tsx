import { useLanguage } from '../context/LanguageContext';

export function Footer() {
  const { t } = useLanguage();
  const { description, socials, nav, address, contact, brand, labels, copyright, links } = t.footer;

  return (
    <footer className="w-full bg-black/40 backdrop-blur-md pt-16 md:pt-24 pb-12 px-6 md:px-12 border border-white/10 rounded-3xl shadow-2xl" id="contact">
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16 md:mb-24">
          
          {/* Brand Col */}
          <div className="lg:col-span-1">
            <h2 className="serif-display text-2xl text-white mb-6 tracking-wider">{brand}</h2>
            <p className="text-sm text-surface-tint font-light leading-relaxed mb-8 max-w-xs">
              {description}
            </p>
          </div>

          {/* Nav Col */}
          <div className="lg:col-span-1 lg:pl-12">
            <h3 className="text-xs tracking-[0.2em] uppercase text-white mb-6">{labels.directory}</h3>
            <ul className="space-y-4">
              {nav.map((item, idx) => (
                <li key={idx}>
                  <a href={`#${item.toLowerCase().replace(' ', '')}`} className="text-sm text-surface-tint hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials Col */}
          <div className="lg:col-span-1">
            <h3 className="text-xs tracking-[0.2em] uppercase text-white mb-6">{labels.network}</h3>
            <ul className="space-y-4">
              {socials.map((social, idx) => (
                <li key={idx}>
                  <a href="#" className="text-sm text-surface-tint hover:text-white transition-colors">
                    {social}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Col */}
          <div className="lg:col-span-1">
            <h3 className="text-xs tracking-[0.2em] uppercase text-white mb-6">{labels.headquarters}</h3>
            <div className="text-sm text-surface-tint font-light leading-relaxed whitespace-pre-line mb-6">
              {address}
            </div>
            <div className="text-sm text-surface-tint font-light leading-relaxed whitespace-pre-line">
              {contact}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10 text-xs text-surface-tint/60 tracking-wider">
          <p>&copy; {new Date().getFullYear()} {copyright}</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            {links.map((link, i) => (
              <a key={i} href="#" className="hover:text-white">{link}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
