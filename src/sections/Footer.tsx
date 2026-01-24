import { Github, FileText, Box } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="py-12 border-t border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo / Title */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold gradient-text">SimpleSeg</h3>
            <p className="text-sm text-white/40 mt-1">
              Towards Pixel-Level VLM Perception
            </p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <a
              href=""
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-white/60 hover:text-[#4A9EFF] transition-colors"
            >
              <FileText size={16} />
              arXiv
            </a>
            <a
              href="https://github.com/songtianhui/SimpleSeg"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-white/60 hover:text-[#4A9EFF] transition-colors"
            >
              <Github size={16} />
              Code
            </a>
            <a
              href="https://huggingface.co/sthui/SimpleSeg"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-white/60 hover:text-[#4A9EFF] transition-colors"
            >
              <Box size={16} />
              Models
            </a>
          </div>

          {/* Copyright */}
          <div className="text-center md:text-right">
            <p className="text-xs text-white/30">
              © 2025 Kimi Team & Nanjing University
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
