import React, { useEffect, useState } from 'react';
import { useScrollProgress } from '../context/ScrollContext';

interface PageContainerProps {
  index: number;
  children: React.ReactNode;
}

export const PageContainer: React.FC<PageContainerProps> = ({ index, children }) => {
  const { activeIndex } = useScrollProgress();
  const [isActive, setIsActive] = useState(false);

  // We set isActive with a tiny delay to allow CSS transitions to pop flawlessly
  useEffect(() => {
    setIsActive(activeIndex === index);
  }, [activeIndex, index]);

  return (
    <section 
      className={`absolute inset-0 flex flex-col items-center justify-center p-6 md:p-12 transition-all duration-700 pointer-events-none z-10 
        ${isActive ? 'opacity-100 visible pointer-events-auto' : 'opacity-0 invisible delay-300'}`}
    >
      <div className="w-full max-w-7xl mx-auto h-full flex flex-col justify-center">
        {/* We use a React Context Provider to pass isActive so nested components can trigger their own animations if needed, 
            or we can just rely on standard CSS like Draftly did. Let's use standard CSS. */}
        <div className={`w-full transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${isActive 
            ? 'opacity-100 translate-y-0 scale-100' 
            : 'opacity-0 translate-y-12 scale-[0.98]'}`}
        >
          {children}
        </div>
      </div>
    </section>
  );
};
