import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { FileText, Github, Box, Play } from 'lucide-react';
import ParticleBackground from '../components/ParticleBackground';

interface MagneticButtonProps {
  children: React.ReactNode;
  href?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

function MagneticButton({ children, href, icon, onClick }: MagneticButtonProps) {
  const buttonRef = useRef<HTMLAnchorElement | HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setPosition({ x: x * 0.3, y: y * 0.3 });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const buttonContent = (
    <>
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </>
  );

  const buttonClass = `magnetic-btn inline-flex items-center justify-center px-6 py-3 rounded-full glass text-white font-medium text-sm transition-all duration-300 hover:bg-white/10 hover:border-white/20 group`;

  const style = {
    transform: `translate(${position.x}px, ${position.y}px)`,
  };

  if (href) {
    return (
      <a
        ref={buttonRef as React.RefObject<HTMLAnchorElement>}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClass}
        style={style}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {buttonContent}
      </a>
    );
  }

  return (
    <button
      ref={buttonRef as React.RefObject<HTMLButtonElement>}
      className={buttonClass}
      style={style}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {buttonContent}
    </button>
  );
}

export default function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const authorsRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        titleRef.current,
        { rotateX: 90, y: 50, opacity: 0 },
        { rotateX: 0, y: 0, opacity: 1, duration: 1.2, ease: 'expo.out', delay: 0.2 }
      );

      // Subtitle animation
      gsap.fromTo(
        subtitleRef.current,
        { filter: 'blur(10px)', opacity: 0 },
        { filter: 'blur(0px)', opacity: 1, duration: 0.8, ease: 'power2.out', delay: 0.6 }
      );

      // Authors animation
      gsap.fromTo(
        authorsRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out', delay: 0.8 }
      );

      // Buttons animation
      gsap.fromTo(
        buttonsRef.current?.children || [],
        { scale: 0.8, y: 20, opacity: 0 },
        { scale: 1, y: 0, opacity: 1, duration: 0.6, ease: 'back.out(1.7)', stagger: 0.1, delay: 1 }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Text glitch effect
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (!titleRef.current) return;
      const chars = titleRef.current.querySelectorAll('.glitch-char');
      const randomChar = chars[Math.floor(Math.random() * chars.length)];
      if (randomChar) {
        gsap.to(randomChar, { opacity: 0.5, duration: 0.05, yoyo: true, repeat: 1 });
      }
    }, 5000);

    return () => clearInterval(glitchInterval);
  }, []);

  const titleText = "Towards Pixel-Level VLM Perception";
  const subtitleText = "via Simple Points Prediction";

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Particle Background */}
      <ParticleBackground />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50 z-[1]" />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Title */}
        <h1
          ref={titleRef}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight"
          style={{ perspective: '1000px' }}
        >
          <span className="block">
            {titleText.split('').map((char, i) => (
              <span key={i} className="glitch-char inline-block">
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </span>
          <span className="block gradient-text mt-2">
            {subtitleText.split('').map((char, i) => (
              <span key={i} className="glitch-char inline-block">
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </span>
        </h1>

        {/* Authors */}
        <div ref={authorsRef} className="mt-8 mb-4">
          <div className="text-sm sm:text-base text-white/80 mb-2">
            <span className="font-medium">Tianhui Song</span>
            <sup className="text-[#4A9EFF]">1,2*</sup>,{' '}
            <span className="font-medium">Haoyu Lu</span>
            <sup className="text-[#4A9EFF]">1*†</sup>,{' '}
            <span className="font-medium">Hao Yang</span>
            <sup className="text-[#4A9EFF]">1</sup>,{' '}
            <span className="font-medium">Lin Sui</span>
            <sup className="text-[#4A9EFF]">1</sup>,{' '}
            <span className="font-medium">Haoning Wu</span>
            <sup className="text-[#4A9EFF]">1</sup>,
          </div>
          <div className="text-sm sm:text-base text-white/80 mb-2">
            <span className="font-medium">Zaida Zhou</span>
            <sup className="text-[#4A9EFF]">1</sup>,{' '}
            <span className="font-medium">Zhiqi Huang</span>
            <sup className="text-[#4A9EFF]">1</sup>,{' '}
            <span className="font-medium">Yiping Bao</span>
            <sup className="text-[#4A9EFF]">1</sup>,{' '}
            <span className="font-medium">Y.Charles</span>
            <sup className="text-[#4A9EFF]">1</sup>,{' '}
            <span className="font-medium">Xinyu Zhou</span>
            <sup className="text-[#4A9EFF]">1</sup>, and{' '}
            <span className="font-medium">Limin Wang</span>
            <sup className="text-[#4A9EFF]">2</sup>
          </div>
        </div>

        {/* Affiliations */}
        <div ref={subtitleRef} className="text-sm text-white/60 mb-2">
          <sup className="text-[#4A9EFF]">1</sup>{' '}
          <span className="font-semibold text-white/80">Kimi Team</span>,{' '}
          <sup className="text-[#4A9EFF]">2</sup>{' '}
          <span className="font-semibold text-white/80">Nanjing University</span>
        </div>

        {/* Equal contribution note */}
        <div className="text-xs text-white/40 mb-10">
          <sup className="text-[#4A9EFF]">*</sup> Equal Contribution{' '}
          <span className="mx-2">|</span>
          <sup className="text-[#4A9EFF]">†</sup> Project Lead
        </div>

        {/* Buttons */}
        <div ref={buttonsRef} className="flex flex-wrap justify-center gap-4">
          <MagneticButton href="https://arxiv.org/abs/2601.19228" icon={<FileText size={18} />}>
            arXiv
          </MagneticButton>
          <MagneticButton href="https://github.com/songtianhui/SimpleSeg" icon={<Github size={18} />}>
            Code
          </MagneticButton>
          <MagneticButton href="https://huggingface.co/collections/sthui/simpleseg" icon={<Box size={18} />}>
            🤗 Models
          </MagneticButton>
          <MagneticButton href="" icon={<Play size={18} />}>
            🤗 Demo
          </MagneticButton>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-white/50 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
