import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const navLinks = [
  { label: 'Abstract', href: '#abstract' },
  { label: 'Method', href: '#method' },
  { label: 'Results', href: '#results' },
  { label: 'Citation', href: '#citation' },
];

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const [activeSection, setActiveSection] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance animation
      gsap.fromTo(
        navRef.current,
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out', delay: 0.2 }
      );

      // Show/hide based on scroll
      ScrollTrigger.create({
        start: 'top -100',
        onUpdate: (self) => {
          setIsVisible(self.scroll() > 100);
        },
      });

      // Track active section
      navLinks.forEach((link) => {
        ScrollTrigger.create({
          trigger: link.href,
          start: 'top center',
          end: 'bottom center',
          onEnter: () => setActiveSection(link.href),
          onEnterBack: () => setActiveSection(link.href),
        });
      });
    });

    return () => ctx.revert();
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      ref={navRef}
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
      }`}
    >
      <div className="glass-strong rounded-full px-2 py-2 flex items-center gap-1">
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={(e) => handleClick(e, link.href)}
            className={`relative px-4 py-2 text-sm font-medium transition-colors duration-300 rounded-full ${
              activeSection === link.href
                ? 'text-white'
                : 'text-white/60 hover:text-white/90'
            }`}
          >
            {activeSection === link.href && (
              <span className="absolute inset-0 bg-white/10 rounded-full" />
            )}
            <span className="relative z-10">{link.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}
