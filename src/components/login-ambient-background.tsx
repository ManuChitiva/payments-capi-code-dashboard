"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/components/theme-provider";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
};

const ORB_LAYERS = [
  "absolute -top-[18%] left-[8%] h-[min(520px,55vmin)] w-[min(520px,55vmin)] rounded-full blur-[120px] animate-login-orb-a brand-ambient-orb-1",
  "absolute top-[35%] -right-[12%] h-[min(440px,48vmin)] w-[min(440px,48vmin)] rounded-full blur-[110px] animate-login-orb-b brand-ambient-orb-2",
  "absolute -bottom-[15%] left-[30%] h-[min(400px,42vmin)] w-[min(400px,42vmin)] rounded-full blur-[100px] animate-login-orb-c brand-ambient-orb-3",
] as const;

function createParticles(width: number, height: number): Particle[] {
  const area = width * height;
  const count = Math.min(Math.max(Math.floor(area / 12000), 40), 85);

  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.12,
    vy: (Math.random() - 0.5) * 0.12,
    size: Math.random() * 1.1 + 0.35,
    opacity: Math.random() * 0.28 + 0.06,
  }));
}

const DEFAULT_AMBIENT_COLORS = {
  particle: "rgb(245 245 247)",
  line: "rgb(41 151 255)",
  vignette: "rgba(0, 0, 0, 0.55)",
};

function readAmbientColors() {
  if (typeof window === "undefined") {
    return DEFAULT_AMBIENT_COLORS;
  }
  const styles = getComputedStyle(document.documentElement);
  return {
    particle:
      styles.getPropertyValue("--brand-ambient-particle").trim() ||
      DEFAULT_AMBIENT_COLORS.particle,
    line:
      styles.getPropertyValue("--brand-ambient-line").trim() ||
      DEFAULT_AMBIENT_COLORS.line,
    vignette:
      styles.getPropertyValue("--brand-ambient-vignette").trim() ||
      DEFAULT_AMBIENT_COLORS.vignette,
  };
}

export function LoginAmbientBackground() {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const sizeRef = useRef({ width: 0, height: 0 });
  const colorsRef = useRef(DEFAULT_AMBIENT_COLORS);

  useEffect(() => {
    colorsRef.current = readAmbientColors();
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let animationFrame = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      const width = parent.clientWidth;
      const height = parent.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      sizeRef.current = { width, height };
      particlesRef.current = createParticles(width, height);
    };

    const draw = () => {
      const { width, height } = sizeRef.current;
      if (width === 0 || height === 0) {
        animationFrame = requestAnimationFrame(draw);
        return;
      }

      const colors = colorsRef.current;
      ctx.clearRect(0, 0, width, height);
      const particles = particlesRef.current;

      for (const particle of particles) {
        if (!reducedMotion) {
          particle.x += particle.vx;
          particle.y += particle.vy;

          if (particle.x < -8) particle.x = width + 8;
          if (particle.x > width + 8) particle.x = -8;
          if (particle.y < -8) particle.y = height + 8;
          if (particle.y > height + 8) particle.y = -8;
        }

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = colors.particle;
        ctx.globalAlpha = particle.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      const linkDistance = 110;
      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.hypot(dx, dy);

          if (distance < linkDistance) {
            const alpha = (1 - distance / linkDistance) * 0.055;
            ctx.globalAlpha = alpha;
            ctx.strokeStyle = colors.line;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }

      animationFrame = requestAnimationFrame(draw);
    };

    resize();
    const observer = new ResizeObserver(resize);
    if (canvas.parentElement) {
      observer.observe(canvas.parentElement);
    }

    animationFrame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationFrame);
      observer.disconnect();
    };
  }, [theme]);

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      <div className="brand-radial-accent absolute inset-0" />

      {ORB_LAYERS.map((className) => (
        <div key={className} className={className} />
      ))}

      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-90" />

      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 100%, var(--brand-ambient-vignette), transparent 65%)",
        }}
      />
    </div>
  );
}
