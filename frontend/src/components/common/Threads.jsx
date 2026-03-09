import { useRef, useEffect } from "react";

/**
 * Threads — Canvas-based animated flowing curves background.
 * Inspired by ReactBits Threads component.
 *
 * @param {Object} props
 * @param {number} [props.amplitude=0.9] - Wave amplitude multiplier
 * @param {number} [props.frequency=0.005] - Wave frequency
 * @param {number} [props.speed=0.5] - Animation speed
 * @param {number} [props.threadCount=30] - Number of thread lines
 * @param {string} [props.color="99,102,241"] - RGB string for thread color
 * @param {string} [props.className=""] - Additional CSS classes
 */
export default function Threads({
  amplitude = 0.9,
  frequency = 0.005,
  speed = 0.5,
  threadCount = 30,
  color = "99,102,241",
  className = "",
}) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let width, height;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      timeRef.current += speed * 0.01;

      for (let i = 0; i < threadCount; i++) {
        const ratio = i / threadCount;
        const baseY = height * (0.15 + ratio * 0.7);
        const alpha = 0.03 + ratio * 0.06;
        const lineWidth = 0.5 + Math.sin(ratio * Math.PI) * 1.5;
        const amp = amplitude * height * 0.08 * (1 + Math.sin(ratio * Math.PI));
        const phaseShift = i * 0.4;

        ctx.beginPath();
        ctx.strokeStyle = `rgba(${color}, ${alpha})`;
        ctx.lineWidth = lineWidth;

        for (let x = 0; x <= width; x += 3) {
          const wave1 =
            Math.sin(x * frequency + timeRef.current + phaseShift) * amp;
          const wave2 =
            Math.sin(
              x * frequency * 1.8 + timeRef.current * 0.7 + phaseShift * 0.6,
            ) *
            amp *
            0.4;
          const wave3 =
            Math.cos(
              x * frequency * 0.5 + timeRef.current * 1.3 + phaseShift * 0.3,
            ) *
            amp *
            0.2;
          const y = baseY + wave1 + wave2 + wave3;

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.stroke();
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [amplitude, frequency, speed, threadCount, color]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ opacity: 1 }}
    />
  );
}
