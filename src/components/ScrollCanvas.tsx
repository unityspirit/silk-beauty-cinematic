import React, { useEffect, useRef, useState } from 'react';
import { useScrollProgress } from '../context/ScrollContext';

const TOTAL_FRAMES = 200; // Matches Python script output
const FRAME_DIR = '/frames-webp';
const SCROLL_SPEED_WHEEL = 0.15;
const SCROLL_SPEED_TOUCH = 0.65;
const LERP_SPEED = 0.1;
const PAGE_COUNT = 4; // Hero, Assembly, Portfolio, Journal

export const ScrollCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { setProgress, setActiveIndex } = useScrollProgress();
  
  const [loading, setLoading] = useState(true);
  const [loadPct, setLoadPct] = useState(0);

  // Animation values kept in refs to avoid re-renders
  const stateRef = useRef({
    currentFrame: 0,
    targetFrame: 0,
    images: new Array(TOTAL_FRAMES).fill(null) as (HTMLImageElement | null)[],
    isReady: false,
    rafStarted: false,
    lastTouchY: 0,
  });

  // 1. Load Frames
  useEffect(() => {
    const s = stateRef.current;
    let completed = 0;

    const loadFrame = (i: number): Promise<void> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = `${FRAME_DIR}/frame_${String(i + 1).padStart(6, '0')}.webp`;
        const finish = async () => {
          s.images[i] = img;
          try {
             await img.decode();
          } catch(e) {}
          resolve();
        };
        img.onload = finish;
        img.onerror = () => { s.images[i] = null; resolve(); };
      });
    };

    const loadAll = async () => {
      // Concurrency limit 48
      const concurrency = 48;
      let nextIndex = 0;
      
      const worker = async () => {
        while (true) {
          const i = nextIndex++;
          if (i >= TOTAL_FRAMES) return;
          await loadFrame(i);
          completed++;
          setLoadPct(Math.round((completed / TOTAL_FRAMES) * 100));
        }
      };

      const workers = Array.from({ length: concurrency }, worker);
      await Promise.all(workers);
      
      s.isReady = true;
      setLoading(false);
      startAnim();
      resize(); // Initial draw
    };

    loadAll();
    
    return () => {
       // Cleanup if needed
    };
  }, []);

  // 2. Loop & Draw
  const startAnim = () => {
    const s = stateRef.current;
    if (s.rafStarted) return;
    s.rafStarted = true;

    const animate = () => {
      const cap = Math.max(0, TOTAL_FRAMES - 1);
      s.targetFrame = Math.max(0, Math.min(s.targetFrame, cap));
      s.currentFrame += (s.targetFrame - s.currentFrame) * LERP_SPEED;
      s.currentFrame = Math.max(0, Math.min(s.currentFrame, cap));
      
      drawFrame(s.currentFrame);
      
      // Update Context
      const denom = Math.max(1, TOTAL_FRAMES - 1);
      const progress = Math.min(1, s.currentFrame / denom);
      setProgress(progress);
      
      // Calculate active page based on progress mapped to PAGE_COUNT (0-3)
      let aIdx = Math.floor((progress + (1 / (PAGE_COUNT * 2))) * PAGE_COUNT);
      aIdx = Math.max(0, Math.min(PAGE_COUNT - 1, aIdx));
      setActiveIndex(aIdx);

      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  };

  const drawFrame = (frameFloat: number) => {
    const s = stateRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let idx = Math.round(frameFloat);
    idx = Math.max(0, Math.min(idx, TOTAL_FRAMES - 1));
    const img = s.images[idx];
    
    // Canvas dimensions are matching CSS px size * dpr. But we calculate on window size.
    const cw = window.innerWidth;
    const ch = window.innerHeight;

    if (!img || !img.naturalWidth) {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, cw, ch);
      return;
    }

    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    const scale = Math.max(cw / iw, ch / ih);
    const w = iw * scale;
    const h = ih * scale;
    const x = (cw - w) / 2;
    const y = (ch - h) / 2;
    
    ctx.drawImage(img, x, y, w, h);
  };

  const resize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.floor(window.innerWidth * dpr);
    const h = Math.floor(window.innerHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  };

  useEffect(() => {
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  // 3. User Input Listeners
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      const s = stateRef.current;
      if (!s.isReady) return;
      let delta = e.deltaY;
      if (e.deltaMode === 1) delta *= 30; // DOM_DELTA_LINE
      if (e.deltaMode === 2) delta *= window.innerHeight; // DOM_DELTA_PAGE
      s.targetFrame += delta * SCROLL_SPEED_WHEEL;
      
      const cap = Math.max(0, TOTAL_FRAMES - 1);
      s.targetFrame = Math.max(0, Math.min(s.targetFrame, cap));
    };

    const onTouchStart = (e: TouchEvent) => {
      stateRef.current.lastTouchY = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      const s = stateRef.current;
      if (!s.isReady) return;
      const y = e.touches[0].clientY;
      const dy = s.lastTouchY - y;
      s.lastTouchY = y;
      s.targetFrame += dy * SCROLL_SPEED_TOUCH;
      
      const cap = Math.max(0, TOTAL_FRAMES - 1);
      s.targetFrame = Math.max(0, Math.min(s.targetFrame, cap));
    };

    // Use passive: false where necessary, but true is better for performance if preventDefault isn't needed.
    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full z-0 object-cover"
      />
      {/* Vignette Overlay for readability */}
      <div className="fixed inset-0 z-[1] bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%),rgba(0,0,0,0.2)] pointer-events-none" />
      
      {/* Progress Bar (Bottom) */}
      <div className="fixed bottom-0 left-0 h-1 w-full bg-white/10 z-[100] pointer-events-none">
        <div 
           className="h-full bg-white origin-left transition-transform duration-[50ms]"
           style={{ transform: `scaleX(${useScrollProgress().progress})` }}
        />
      </div>

      {loading && (
        <div className="fixed inset-0 z-[9999] bg-[#030304] flex flex-col items-center justify-center transition-opacity duration-700">
          <div className="text-white text-center">
            <h1 className="text-4xl font-serif mb-2">UnitySpirit</h1>
            <p className="text-white/50 mb-8 uppercase tracking-widest text-xs">Loading Archive</p>
            <div className="text-6xl font-bold font-mono mb-4">{loadPct}<span className="text-2xl text-white/40">%</span></div>
            <div className="w-64 h-1 bg-white/10 rounded overflow-hidden">
              <div className="h-full bg-white transition-all duration-200" style={{ width: `${loadPct}%` }} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
