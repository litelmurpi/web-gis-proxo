import { ArrowRight, Map } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-base-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-600/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="text-center relative z-10 max-w-3xl">
        <h1 className="text-6xl md:text-8xl font-heading font-semibold text-white tracking-tight mb-6 leading-tight">
          Urban planning, <br />
          but{" "}
          <span className="font-emphasis italic font-normal text-primary-400">
            smarter.
          </span>
        </h1>
        <p className="text-xl text-base-400 font-body mb-12 max-w-2xl mx-auto leading-relaxed">
          AI-powered geospatial analytics for sustainable city development.
          Simulate equity, heat islands, and flood risks in real-time.
        </p>
        <div className="flex items-center justify-center gap-4">
          <a
            href="/map"
            className="group flex items-center justify-center gap-2 bg-primary-500 text-white font-medium text-sm px-8 py-4 rounded-full shadow-glow-sm hover:shadow-glow-md transition-all duration-300 transform hover:-translate-y-0.5 outline-none ring-2 ring-transparent focus-visible:ring-primary-400"
          >
            Launch Map Engine
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="/design-system"
            className="flex items-center justify-center gap-2 text-sm font-medium text-white transition-all bg-white/5 hover:bg-white/10 px-8 py-4 rounded-full border border-white/10 shadow-sm outline-none ring-primary-500 focus-visible:ring-2"
          >
            <Map className="w-4 h-4 opacity-70" />
            Design System
          </a>
        </div>
      </div>
    </div>
  );
}
