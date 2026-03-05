import { Link, useLocation } from "react-router-dom";
import { Terminal, Map, BarChart3, Rotate3D, Info } from "lucide-react";

export default function Navbar() {
  const location = useLocation();

  const navItems = [
    { name: "Map Explorer", path: "/map", icon: Map },
    { name: "Analytics", path: "/analytics", icon: BarChart3 },
    { name: "Simulation", path: "/simulation", icon: Rotate3D },
    { name: "About", path: "/about", icon: Info },
  ];

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-base-950/80 backdrop-blur-lg border-b border-white/5 h-16 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-1 outline-none group">
          <span className="w-8 h-8 rounded-lg bg-base-900 border border-white/5 shadow-card flex items-center justify-center mr-2 group-hover:shadow-glow-sm transition-all">
            <span className="font-emphasis italic font-normal text-white text-lg leading-none translate-y-px">
              U
            </span>
          </span>
          <h1 className="text-lg font-semibold tracking-tight font-heading text-white">
            UrbanInsight{" "}
            <span className="text-primary-400 opacity-80 italic font-emphasis text-xl ml-[2px] leading-none">
              AI
            </span>
          </h1>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 font-body text-[13px] font-medium px-3 py-2 rounded-lg transition-colors outline-none
                  ${
                    isActive
                      ? "text-white bg-white/3 shadow-card"
                      : "text-base-400 hover:text-white hover:bg-white/2"
                  }`}
              >
                <item.icon
                  className="w-4 h-4 opacity-70"
                  strokeWidth={isActive ? 2.5 : 2}
                />
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* CTA / Quick Actions */}
        <div className="flex items-center gap-3">
          <Link
            to="/design-system"
            className="flex items-center justify-center gap-2 text-[13px] font-medium text-white transition-all bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10 shadow-sm outline-none ring-primary-500 focus-visible:ring-2"
          >
            <Terminal className="w-4 h-4 opacity-70" />
            <span className="hidden sm:inline">Design System</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
