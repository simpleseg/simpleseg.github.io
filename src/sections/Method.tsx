import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Info, X } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface Hotspot {
  id: string;
  x: number;
  y: number;
  title: string;
  description: string;
}

const hotspots: Hotspot[] = [
  {
    id: 'sft',
    x: 25,
    y: 50,
    title: 'Stage 1: SFT',
    description: 'Supervised Fine-Tuning on point sequence generation task to establish basic segmentation capability.',
  },
  {
    id: 'rl',
    x: 75,
    y: 50,
    title: 'Stage 2: RL',
    description: 'Reinforcement Learning with IoU-based reward to refine point sequences for high-fidelity contours.',
  },
];

export default function Method() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Image scale and focus animation
      gsap.fromTo(
        imageContainerRef.current,
        { scale: 0.9, filter: 'blur(5px)' },
        {
          scale: 1,
          filter: 'blur(0px)',
          duration: 1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            end: 'center center',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <section id="method" ref={sectionRef} className="section-padding relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          <span className="gradient-text">Method Overview</span>
        </h2>

        {/* Image Container */}
        <div
          ref={imageContainerRef}
          className="relative rounded-2xl overflow-hidden glass group"
          onMouseMove={handleMouseMove}
        >
          {/* Method Image */}
          <div className="relative aspect-video">
            <img
              src="./static/documents/method.png"
              alt="Method Overview"
              className="w-full h-full object-contain bg-black/50"
            />

            {/* Custom cursor */}
            <div
              className="pointer-events-none absolute w-24 h-24 rounded-full border-2 border-[#4A9EFF]/50 flex items-center justify-center transition-transform duration-100 z-20"
              style={{
                left: mousePosition.x - 48,
                top: mousePosition.y - 48,
                transform: 'scale(0)',
              }}
            />

            {/* Hotspots */}
            {hotspots.map((hotspot) => (
              <button
                key={hotspot.id}
                className={`absolute w-8 h-8 -ml-4 -mt-4 rounded-full flex items-center justify-center transition-all duration-300 z-10 ${
                  activeHotspot === hotspot.id
                    ? 'bg-[#4A9EFF] scale-125'
                    : 'bg-white/20 hover:bg-white/40'
                }`}
                style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
                onClick={() => setActiveHotspot(activeHotspot === hotspot.id ? null : hotspot.id)}
              >
                <Info size={16} className="text-white" />
              </button>
            ))}

            {/* Hotspot Tooltips */}
            {hotspots.map((hotspot) => (
              <div
                key={`tooltip-${hotspot.id}`}
                className={`absolute glass-strong rounded-xl p-4 max-w-xs transition-all duration-300 z-30 ${
                  activeHotspot === hotspot.id
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-4 pointer-events-none'
                }`}
                style={{
                  left: `${hotspot.x}%`,
                  top: `${hotspot.y + 8}%`,
                  transform: 'translateX(-50%)',
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-[#4A9EFF]">{hotspot.title}</h4>
                  <button
                    onClick={() => setActiveHotspot(null)}
                    className="text-white/60 hover:text-white"
                  >
                    <X size={16} />
                  </button>
                </div>
                <p className="text-sm text-white/70">{hotspot.description}</p>
              </div>
            ))}

            {/* Chromatic aberration effect on hover */}
            <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div
                className="absolute inset-0 mix-blend-screen"
                style={{
                  background: 'linear-gradient(90deg, rgba(255,0,0,0.1), transparent, rgba(0,255,255,0.1))',
                  transform: 'translateX(-2px)',
                }}
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-8 text-center text-white/60 max-w-3xl mx-auto">
          <p className="text-sm">
          In this work, we explore the limits of MLLM pixel-level perception by predicting the next point in a contour
          with the simplest approach possible. Without introducing any complex architectures or special patterns, we show how
          even minimalistic point prediction can achieve effective segmentation at the pixel level.
          </p>
        </div>
      </div>
    </section>
  );
}
