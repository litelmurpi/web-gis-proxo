import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Terminal,
  Map,
  BarChart3,
  Rotate3D,
  Info,
  Menu,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const navItems = [
  { name: "Map Explorer", path: "/map", icon: Map },
  { name: "Analytics", path: "/analytics", icon: BarChart3 },
  { name: "Simulation", path: "/simulation", icon: Rotate3D },
  { name: "About", path: "/about", icon: Info },
];

export default function Navbar() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <nav className="fixed top-0 inset-x-0 z-50 bg-base-950/80 backdrop-blur-lg border-b border-white/5 h-16 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
          <Link
            to="/"
            onClick={closeMenu}
            className="flex items-center gap-1 outline-none group"
          >
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

          <div className="flex items-center gap-2">
            <Link
              to="/design-system"
              className="hidden sm:flex items-center justify-center gap-2 text-[13px] font-medium text-white transition-all bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10 shadow-sm outline-none"
            >
              <Terminal className="w-4 h-4 opacity-70" />
              <span className="hidden sm:inline">Design System</span>
            </Link>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors outline-none"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isMenuOpen ? (
                  <motion.span
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X className="w-4 h-4" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="open"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Menu className="w-4 h-4" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              key="backdrop"
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeMenu}
            />

            <motion.div
              key="drawer"
              className="fixed top-16 inset-x-0 z-40 bg-base-950/98 backdrop-blur-xl border-b border-white/5 md:hidden shadow-2xl"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              <div className="px-4 py-4 space-y-1">
                {navItems.map((item, i) => {
                  const isActive = location.pathname.startsWith(item.path);
                  return (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.2 }}
                    >
                      <Link
                        to={item.path}
                        onClick={closeMenu}
                        className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all
                          ${
                            isActive
                              ? "bg-primary-500/10 border border-primary-500/20 text-white"
                              : "text-base-300 hover:text-white hover:bg-white/5 border border-transparent"
                          }`}
                      >
                        <div
                          className={`p-1.5 rounded-lg ${isActive ? "bg-primary-500/15" : "bg-white/5"}`}
                        >
                          <item.icon
                            className={`w-4 h-4 ${isActive ? "text-primary-400" : "text-base-400"}`}
                            strokeWidth={isActive ? 2.5 : 2}
                          />
                        </div>
                        {item.name}
                        {isActive && (
                          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-400" />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}

                <div className="pt-2 pb-1 border-t border-white/5 mt-2">
                  <Link
                    to="/design-system"
                    onClick={closeMenu}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-base-400 hover:text-white hover:bg-white/5 transition-all border border-transparent"
                  >
                    <div className="p-1.5 rounded-lg bg-white/5">
                      <Terminal className="w-4 h-4 text-base-400" strokeWidth={2} />
                    </div>
                    Design System
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
