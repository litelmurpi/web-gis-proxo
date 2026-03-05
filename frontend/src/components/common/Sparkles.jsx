import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
export function Sparkles({
  particleColor = "#ffffff",
  particleCount = 50,
  speed = 1,
  minSize = 1,
  maxSize = 3,
  className = "",
}) {
  const [particles] = useState(() => {
    return Array.from({ length: particleCount }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage string
      y: Math.random() * 100, // percentage string
      size: Math.random() * (maxSize - minSize) + minSize,
      // Calculate random movement vectors
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      // Opacity animation offset
      delay: Math.random() * 5,
      duration: Math.random() * 5 + 3,
    }));
  });

  if (particles.length === 0) return null;

  return (
    <div
      className={`absolute inset-0 z-0 overflow-hidden pointer-events-none ${className}`}
    >
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            backgroundColor: particleColor,
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            // Base subtle glow
            boxShadow: `0 0 ${particle.size * 2}px ${particleColor}`,
          }}
          animate={{
            // Slow, drifting animation
            y: [0, particle.vy * 50, particle.vy * 100],
            x: [0, particle.vx * 50, particle.vx * 100],
            // Pulsing opacity
            opacity: [0, 0.4, 0.8, 0.2, 0],
            scale: [0, 1, 1.2, 0.5, 0],
          }}
          transition={{
            duration: particle.duration * 5, // slow down the motion
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: particle.delay,
          }}
        />
      ))}
    </div>
  );
}
