import { Terminal } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto py-12 border-t border-white/5 bg-base-950">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-base-900 border border-white/5 shadow-card flex items-center justify-center">
            <span className="font-emphasis italic font-normal text-white text-xl leading-none pt-0.5">
              U
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold tracking-tight font-heading text-white">
              UrbanInsight{" "}
              <span className="text-primary-400 italic font-emphasis">AI</span>
            </p>
            <p className="text-[11px] font-mono text-base-500 uppercase tracking-widest mt-0.5">
              Build smarter cities.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <a
            href="/about"
            className="text-[13px] text-base-400 hover:text-white transition-colors"
          >
            Methodology
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="text-[13px] text-base-400 hover:text-white transition-colors"
          >
            Source Code
          </a>
          <a
            href="/design-system"
            className="flex items-center gap-2 text-[13px] text-base-400 hover:text-primary-400 transition-colors"
          >
            <Terminal className="w-3.5 h-3.5" /> ui specs
          </a>
        </div>
      </div>
    </footer>
  );
}
