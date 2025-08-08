import React, { useEffect, useRef } from 'react';

interface ParticleBackgroundProps {
  darkMode: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  hue: number;
  pulse: number;
}

const ParticleBackground: React.FC<ParticleBackgroundProps> = ({ darkMode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      const particles: Particle[] = [];
      const particleCount = darkMode 
        ? Math.min(220, Math.floor((canvas.width * canvas.height) / 8000))
        : Math.min(140, Math.floor((canvas.width * canvas.height) / 12000));

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * (darkMode ? 1.0 : 0.7),
          vy: (Math.random() - 0.5) * (darkMode ? 1.0 : 0.7),
          size: Math.random() * (darkMode ? 3.5 : 2.5) + 1.2,
          opacity: Math.random() * (darkMode ? 0.6 : 0.4) + 0.15,
          hue: Math.random() * 360,
          pulse: Math.random() * Math.PI * 2,
        });
      }

      particlesRef.current = particles;
    };

    const drawParticles = () => {
      // Fade the previous frame slightly for trail effect instead of a hard clear
      ctx.fillStyle = darkMode ? 'rgba(3, 6, 20, 0.18)' : 'rgba(245, 247, 255, 0.12)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const time = Date.now() * 0.001;

      // Use additive blending in dark mode for poppier glow
      const prevComposite = ctx.globalCompositeOperation;
      ctx.globalCompositeOperation = darkMode ? 'lighter' : 'source-over';

      particlesRef.current.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.y > canvas.height) particle.y = 0;
        if (particle.y < 0) particle.y = canvas.height;

        // Update pulse
        particle.pulse += 0.025;

        // Calculate dynamic size and opacity
        const pulseFactor = Math.sin(particle.pulse) * 0.35 + 0.75;
        const dynamicSize = particle.size * pulseFactor;
        const dynamicOpacity = particle.opacity * pulseFactor;

        // Glow
        ctx.shadowBlur = darkMode ? 16 : 10;
        ctx.shadowColor = darkMode ? 'rgba(180, 140, 255, 0.9)' : 'rgba(102, 126, 234, 0.7)';

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, dynamicSize, 0, Math.PI * 2);
        
        if (darkMode) {
          const hue = (particle.hue + time * 30) % 360;
          const saturation = 70 + Math.sin(particle.pulse) * 20;
          const lightness = 65 + Math.sin(particle.pulse * 2) * 15;
          ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        } else {
          const gradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, dynamicSize
          );
          gradient.addColorStop(0, `rgba(90, 180, 255, ${dynamicOpacity})`);
          gradient.addColorStop(1, `rgba(90, 180, 255, 0)`);
          ctx.fillStyle = gradient;
        }
        ctx.fill();

        // Connections
        particlesRef.current.slice(index + 1).forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = darkMode ? 140 : 95;

          if (distance < maxDistance) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);

            const connectionOpacity = (1 - distance / maxDistance) * (darkMode ? 0.5 : 0.35);
            let connectionColor;

            if (darkMode) {
              const hue = (particle.hue + otherParticle.hue + time * 20) / 2;
              connectionColor = `hsla(${hue}, 75%, 60%, ${connectionOpacity})`;
            } else {
              connectionColor = `rgba(90, 180, 255, ${connectionOpacity})`;
            }

            ctx.strokeStyle = connectionColor;
            ctx.lineWidth = darkMode ? 1.8 : 1.2;
            ctx.stroke();
          }
        });
      });

      // Restore composite mode
      ctx.globalCompositeOperation = prevComposite;
      // Subtle vignette to add depth
      const vignette = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, Math.min(canvas.width, canvas.height) * 0.2,
        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) * 0.7
      );
      vignette.addColorStop(0, 'rgba(0,0,0,0)');
      vignette.addColorStop(1, darkMode ? 'rgba(5,10,25,0.35)' : 'rgba(200,210,240,0.15)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const animate = () => {
      drawParticles();
      animationRef.current = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      resizeCanvas();
      createParticles();
    };

    resizeCanvas();
    // Prime canvas with a transparent base
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    createParticles();
    animate();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [darkMode]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
};

export default ParticleBackground;