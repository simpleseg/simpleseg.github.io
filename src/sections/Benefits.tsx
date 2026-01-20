import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Layers, GitBranch, Eye } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface Benefit {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

const benefits: Benefit[] = [
  {
    id: 'simplicity',
    icon: <Layers size={32} />,
    title: 'Simplicity',
    description:
      'SimpleSeg requires no specialized modules and adheres to the standard MLLM architecture. It can be seamlessly integrated as a new core pre-training task for foundation models, similar to visual grounding.',
    color: '#4A9EFF',
  },
  {
    id: 'generality',
    icon: <GitBranch size={32} />,
    title: 'Task Generality',
    description:
      'By framing segmentation as a text-generation problem, our approach is inherently flexible. The model can be easily adapted to a wide range of vision-language tasks requiring precise spatial localization.',
    color: '#9B4AFF',
  },
  {
    id: 'interpretability',
    icon: <Eye size={32} />,
    title: 'Interpretable Output',
    description:
      'The model generates explicit, human-readable coordinate sequences instead of dense pixel masks. This transparency simplifies debugging and makes output directly usable for downstream applications.',
    color: '#FF69B4',
  },
];

export default function Benefits() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [lineHeight, setLineHeight] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Line draw animation
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 70%',
        onEnter: () => setLineHeight(100),
      });

      // Cards stagger animation
      gsap.fromTo(
        cardsRef.current?.children || [],
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'expo.out',
          stagger: 0.15,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-padding relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          <span className="gradient-text">Key Benefits</span>
        </h2>

        {/* Horizontal accordion */}
        <div ref={cardsRef} className="flex gap-4 relative">
          {/* Vertical lines */}
          <div
            className="absolute left-1/3 top-0 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent transition-all duration-1000"
            style={{ height: `${lineHeight}%` }}
          />
          <div
            className="absolute left-2/3 top-0 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent transition-all duration-1000 delay-200"
            style={{ height: `${lineHeight}%` }}
          />

          {benefits.map((benefit) => (
            <div
              key={benefit.id}
              className={`relative flex-1 transition-all duration-500 ease-out cursor-pointer ${
                hoveredCard === benefit.id ? 'flex-[1.4]' : hoveredCard ? 'flex-[0.8]' : 'flex-1'
              }`}
              onMouseEnter={() => setHoveredCard(benefit.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div
                className={`h-full glass rounded-2xl p-6 md:p-8 transition-all duration-500 ${
                  hoveredCard === benefit.id ? 'bg-white/10' : ''
                }`}
              >
                {/* Icon */}
                <div
                  className={`mb-6 transition-all duration-500 ${
                    hoveredCard === benefit.id ? 'rotate-[360deg]' : ''
                  }`}
                  style={{ color: benefit.color }}
                >
                  {benefit.icon}
                </div>

                {/* Title */}
                <h3
                  className="text-xl font-bold mb-4 transition-colors duration-300"
                  style={{ color: hoveredCard === benefit.id ? benefit.color : 'white' }}
                >
                  {benefit.title}
                </h3>

                {/* Description */}
                <p
                  className={`text-sm text-white/60 transition-all duration-500 ${
                    hoveredCard === benefit.id ? 'opacity-100' : 'opacity-70'
                  }`}
                >
                  {benefit.description}
                </p>

                {/* Bottom accent line */}
                <div
                  className={`absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl transition-all duration-500 ${
                    hoveredCard === benefit.id ? 'opacity-100' : 'opacity-30'
                  }`}
                  style={{
                    background: `linear-gradient(90deg, ${benefit.color}, transparent)`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
