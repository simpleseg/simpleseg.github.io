import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Abstract() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Card 3D tilt entrance
      gsap.fromTo(
        cardRef.current,
        { rotateX: 20, opacity: 0, y: 50 },
        {
          rotateX: 0,
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            end: 'center center',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Title animation
      gsap.fromTo(
        titleRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Content highlight sweep
      gsap.fromTo(
        contentRef.current,
        { backgroundPosition: '200% center' },
        {
          backgroundPosition: '-100% center',
          duration: 2,
          ease: 'power2.inOut',
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

  const highlightText = (text: string, keywords: string[]) => {
    let result = text;
    keywords.forEach((keyword) => {
      const regex = new RegExp(`(${keyword})`, 'gi');
      result = result.replace(
        regex,
        `<span class="text-[#4A9EFF] font-semibold glow-text cursor-pointer transition-all duration-300 hover:text-[#6BB3FF]">${keyword}</span>`
      );
    });
    return result;
  };

  const abstractText = `We present <strong>SimpleSeg</strong>, a strikingly simple yet highly effective approach to endow Multimodal Large Language Models (MLLMs) with native pixel-level perception. Our method reframes segmentation as a simple sequence generation problem: the model directly predicts <strong>sequence of points</strong> (textual coordinates) delineating object boundaries, entirely within its language space. To achieve high fidelity, we introduce a two-stage SFT→RL training pipeline, where Reinforcement Learning with an IoU-based reward refines the point sequences to accurately match ground-truth contours. We find that <strong>the standard MLLM architecture possesses a strong, inherent capacity for low-level perception</strong> that can be unlocked without any specialized architecture. On segmentation benchmarks, SimpleSeg achieves performance that is comparable to, and often surpasses, methods relying on complex, task-specific designs. This work lays out that precise spatial understanding can emerge from simple point prediction, challenging the prevailing need for auxiliary components and paving the way for more unified and capable VLMs.`;

  const keywords = ['SimpleSeg', 'sequence of points', 'SFT→RL', 'IoU-based reward', 'low-level perception'];

  return (
    <section
      id="abstract"
      ref={sectionRef}
      className="section-padding relative"
      style={{ perspective: '1000px' }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <h2
          ref={titleRef}
          className="text-3xl md:text-4xl font-bold text-center mb-12"
        >
          <span className="gradient-text">Abstract</span>
        </h2>

        {/* Glass Card */}
        <div
          ref={cardRef}
          className="glass rounded-2xl p-8 md:p-12 relative overflow-hidden"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Decorative gradient line */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#4A9EFF] via-[#9B4AFF] to-[#FF69B4]" />

          {/* Content */}
          <div
            ref={contentRef}
            className="text-base md:text-lg text-white/80 leading-relaxed"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(74, 158, 255, 0.1) 50%, transparent 100%)',
              backgroundSize: '200% 100%',
            }}
            dangerouslySetInnerHTML={{
              __html: highlightText(abstractText, keywords),
            }}
          />

          {/* Glow effect */}
          <div className="absolute -right-20 -top-20 w-40 h-40 bg-[#4A9EFF]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-40 h-40 bg-[#9B4AFF]/20 rounded-full blur-3xl pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
