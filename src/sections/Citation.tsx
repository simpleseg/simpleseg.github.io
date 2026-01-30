import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Copy, Check } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const citationCode = `@misc{song2026pixellevelvlmperceptionsimple,
      title={Towards Pixel-Level VLM Perception via Simple Points Prediction}, 
      author={Tianhui Song and Haoyu Lu and Hao Yang and Lin Sui and Haoning Wu and Zaida Zhou and Zhiqi Huang and Yiping Bao and Y. Charles and Xinyu Zhou and Limin Wang},
      year={2026},
      eprint={2601.19228},
      archivePrefix={arXiv},
      primaryClass={cs.CV},
      url={https://arxiv.org/abs/2601.19228}, 
}`;

export default function Citation() {
  const sectionRef = useRef<HTMLElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);
  const [displayedCode, setDisplayedCode] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Window typewriter effect
      gsap.fromTo(
        windowRef.current,
        { width: 0, opacity: 0 },
        {
          width: '100%',
          opacity: 1,
          duration: 0.5,
          ease: 'steps(40)',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Code typing animation
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 60%',
        onEnter: () => {
          let index = 0;
          const typeInterval = setInterval(() => {
            if (index <= citationCode.length) {
              setDisplayedCode(citationCode.slice(0, index));
              index++;
            } else {
              clearInterval(typeInterval);
            }
          }, 15);
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Cursor blink animation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 530);

    return () => clearInterval(blinkInterval);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(citationCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <section id="citation" ref={sectionRef} className="section-padding relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          <span className="gradient-text">Citation</span>
        </h2>

        {/* Terminal Window */}
        <div
          ref={windowRef}
          className="glass-strong rounded-xl overflow-hidden"
          style={{ maxWidth: '100%' }}
        >
          {/* Window Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
              <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
            </div>
            <div className="text-xs text-white/40 font-mono">BibTeX</div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-xs text-white/60 hover:text-white transition-colors"
            >
              {copied ? <Check size={14} className="text-[#27C93F]" /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>

          {/* Code Content */}
          <div className="p-6 bg-[#0a0a0a]">
            <pre
              ref={codeRef}
              className="font-mono text-sm text-white/80 overflow-x-auto whitespace-pre-wrap break-words leading-relaxed"
            >
              <code>{displayedCode}</code>
              <span
                className={`inline-block w-2 h-5 bg-white ml-1 ${cursorVisible ? 'opacity-100' : 'opacity-0'}`}
              />
            </pre>
          </div>
        </div>

        {/* Note */}
        <p className="text-center text-sm text-white/40 mt-6">
          If you find this work helpful, please consider citing our paper.
        </p>
      </div>
    </section>
  );
}
