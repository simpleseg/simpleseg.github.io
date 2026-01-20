import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { X, ZoomIn } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface ResultPair {
  id: string;
  title: string;
  query: string;
  response: string;
  inputImage: string;
  inputTitle: string;
  outputImage: string;
  outputTitle: string;
}

const results: ResultPair[] = [
  {
    id: 'octopus',
    title: 'Complex Object Segmentation',
    query: 'Show me the precise polygon of octopus in the image.',
    response: 'Sure, you can find it at [[[0.295, 0.204], [0.298, 0.225], ..., [0.456, 0.273], [0.412, 0.231], [0.358, 0.206]]].',
    inputImage: './static/documents/octopus.png',
    inputTitle: 'Input Image',
    outputImage: './static/documents/octopus-result.jpeg',
    outputTitle: 'Segmentation Result',
  },
  {
    id: 'bracelet',
    title: 'Fine Detail Recognition',
    query: 'Help me locate the polygon of bracelet in the image.',
    response: '[[[0.737, 0.324], [0.725, 0.316], [0.706, 0.316], ..., [0.739, 0.358], [0.744, 0.346], [0.743, 0.333]]].',
    inputImage: './static/documents/bracelet.jpeg',
    inputTitle: 'Input Image',
    outputImage: './static/documents/bracelet-result.jpeg',
    outputTitle: 'Segmentation Result',
  },
  {
    id: 'curve',
    title: 'Contour Extraction',
    query: 'Outline the curve in the image.',
    response: 'Sure, [[[0.927, 0.399], [0.916, 0.388], [0.904, 0.401], ..., [0.897, 0.534], [0.904, 0.534], [0.916, 0.466], [0.916, 0.438]]].',
    inputImage: './static/documents/curve.jpg',
    inputTitle: 'Input Image',
    outputImage: './static/documents/curve-result.jpeg',
    outputTitle: 'Segmentation Result',
  },
  {
    id: 'aniya',
    title: 'Image Domain Generalization',
    query: 'Please output the polygon coordinates of Aniya in the image.',
    response: '[[[0.533, 0.260], [0.525, 0.280], [0.483, 0.290], ..., [0.583, 0.310], [0.556, 0.306], [0.540, 0.286], [0.538, 0.268]]].',
    inputImage: './static/documents/aniya.jpeg',
    inputTitle: 'Input Image',
    outputImage: './static/documents/aniya-result.jpeg',
    outputTitle: 'Segmentation Result',
  },
  {
    id: 'cross',
    title: 'Geometric Recognition',
    query: 'Please outline the cross/heart in the image.',
    response: '',
    inputImage: './static/documents/cross.jpg',
    inputTitle: 'Segmentation Result',
    outputImage: './static/documents/heart.jpg',
    outputTitle: 'Segmentation Result',
  },
  {
    id: 'cat-click',
    title: 'Input and Task Flexibility',
    query: 'Show me the contour of the object at point [0.621, 0.592].',
    response: '[[[0.700, 0.535], [0.689, 0.543], [0.678, 0.558], [0.674, 0.572], ..., [0.748, 0.543], [0.730, 0.531], [0.717, 0.529]]].',
    inputImage: './static/documents/cat9-click.jpg',
    inputTitle: 'Input Image',
    outputImage: './static/documents/cat9-poly.jpeg',
    outputTitle: 'Segmentation Result',
  },
  {
    id: 'stamp-box',
    title: 'Box Region Segmentation',
    query: 'Give the polygon vertices of the stuff within the box region [0.372, 0.162, 0.784, 0.605].',
    response: 'The polygon vertices within that region are [[[0.773, 0.166], [0.765, 0.165], ..., [0.782, 0.185], [0.780, 0.173]]].',
    inputImage: './static/documents/stamp-box.jpg',
    inputTitle: 'Input Image',
    outputImage: './static/documents/stamp-poly.jpeg',
    outputTitle: 'Segmentation Result',
  }
];

interface ImageModalProps {
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
}

function ImageModal({ src, alt, isOpen, onClose }: ImageModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-2 text-white/70 hover:text-white transition-colors z-10"
      >
        <X size={32} />
      </button>
      <img
        src={src}
        alt={alt}
        className="max-w-full max-h-[90vh] object-contain"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}

export default function Results() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [modalImage, setModalImage] = useState<{ src: string; alt: string } | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardsRef.current?.children || [],
        { y: 60, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'expo.out',
          stagger: 0.15,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const openModal = (src: string, alt: string) => {
    setModalImage({ src, alt });
  };

  const closeModal = () => {
    setModalImage(null);
  };

  return (
    <section id="results" ref={sectionRef} className="section-padding relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          <span className="gradient-text">Visual Results</span>
        </h2>

        <div ref={cardsRef} className="space-y-12">
          {results.map((result) => (
            <div
              key={result.id}
              className={`transition-all duration-500 ${
                hoveredCard === result.id ? 'z-10' : ''
              }`}
              onMouseEnter={() => setHoveredCard(result.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div
                className={`glass rounded-2xl overflow-hidden transition-all duration-500 ${
                  hoveredCard === result.id
                    ? 'shadow-2xl shadow-[#4A9EFF]/10'
                    : ''
                }`}
              >
                <div className="p-6 md:p-8 border-b border-white/10">
                  <h3 className="text-xl md:text-2xl font-semibold text-[#4A9EFF] mb-4">
                    {result.title}
                  </h3>
                  <div className="space-y-2">
                    <p className="text-sm text-white/70">
                      <span className="font-semibold text-white/90">User:</span>{' '}
                      {result.query}
                    </p>
                    <p className="text-sm text-white/70">
                      <span className="font-semibold text-[#4A9EFF]">SimpleSeg:</span>{' '}
                      {result.response}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-black/20">
                  {/* Input Image */}
                  <div 
                    className="relative overflow-hidden rounded-xl cursor-pointer group"
                    onClick={() => openModal(result.inputImage, `${result.title} input`)}
                  >
                    <img
                      src={result.inputImage}
                      alt={`${result.title} input`}
                      className="w-full h-auto max-h-[500px] object-contain mx-auto transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2 px-4 py-2 bg-black/60 backdrop-blur-sm rounded-full">
                        <ZoomIn size={18} className="text-white" />
                        <span className="text-sm text-white font-medium">Click to enlarge</span>
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <span className="px-3 py-1.5 text-xs font-medium text-white bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                        {result.inputTitle}
                      </span>
                    </div>
                  </div>

                  {/* Output Image */}
                  <div 
                    className="relative overflow-hidden rounded-xl cursor-pointer group"
                    onClick={() => openModal(result.outputImage, `${result.title} output`)}
                  >
                    <img
                      src={result.outputImage}
                      alt={`${result.title} output`}
                      className="w-full h-auto max-h-[500px] object-contain mx-auto transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2 px-4 py-2 bg-black/60 backdrop-blur-sm rounded-full">
                        <ZoomIn size={18} className="text-white" />
                        <span className="text-sm text-white font-medium">Click to enlarge</span>
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <span className="px-3 py-1.5 text-xs font-medium text-white bg-[#4A9EFF]/20 backdrop-blur-sm rounded-full border border-[#4A9EFF]/30">
                        {result.outputTitle}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Image Modal */}
      <ImageModal
        src={modalImage?.src || ''}
        alt={modalImage?.alt || ''}
        isOpen={!!modalImage}
        onClose={closeModal}
      />
    </section>
  );
}
