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
        ? Math.min(150, Math.floor((canvas.width * canvas.height) / 10000))
        : Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * (darkMode ? 0.8 : 0.5),
          vy: (Math.random() - 0.5) * (darkMode ? 0.8 : 0.5),
          size: Math.random() * (darkMode ? 3 : 2) + 1,
          opacity: Math.random() * (darkMode ? 0.5 : 0.3) + 0.1,
          hue: Math.random() * 360,
          pulse: Math.random() * Math.PI * 2,
        });
      }

      particlesRef.current = particles;
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const time = Date.now() * 0.001;

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
        particle.pulse += 0.02;

        // Calculate dynamic size and opacity
        const pulseFactor = Math.sin(particle.pulse) * 0.3 + 0.7;
        const dynamicSize = particle.size * pulseFactor;
        const dynamicOpacity = particle.opacity * pulseFactor;

        // Draw particle with enhanced effects
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, dynamicSize, 0, Math.PI * 2);
        
        if (darkMode) {
          // Mesmerizing dark mode with color variations
          const hue = (particle.hue + time * 20) % 360;
          const saturation = 60 + Math.sin(particle.pulse) * 20;
          const lightness = 70 + Math.sin(particle.pulse * 2) * 20;
          ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        } else {
          // Enhanced light mode with subtle gradients
          const gradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, dynamicSize
          );
          gradient.addColorStop(0, `rgba(102, 126, 234, ${dynamicOpacity})`);
          gradient.addColorStop(1, `rgba(102, 126, 234, 0)`);
          ctx.fillStyle = gradient;
        }
        
        ctx.fill();

        // Draw enhanced connections
        particlesRef.current.slice(index + 1).forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = darkMode ? 120 : 80;

          if (distance < maxDistance) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            
            const connectionOpacity = (1 - distance / maxDistance) * 0.3;
            let connectionColor;
            
            if (darkMode) {
              // Colorful connections in dark mode
              const hue = (particle.hue + otherParticle.hue) / 2;
              connectionColor = `hsla(${hue}, 70%, 60%, ${connectionOpacity})`;
            } else {
              // Subtle connections in light mode
              connectionColor = `rgba(102, 126, 234, ${connectionOpacity})`;
            }
            
            ctx.strokeStyle = connectionColor;
            ctx.lineWidth = darkMode ? 1.5 : 1;
            ctx.stroke();
          }
        });
      });
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
    createParticles();
    animate();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

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