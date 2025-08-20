'use client';

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export function FluidLoader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fluid simulation logic adapted from a simple example
    // Not a physically accurate simulation, but visually appealing.
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let mouse = { x: width / 2, y: height / 2, isDown: false };
    let particles: Particle[] = [];
    const particleCount = 100;
    const particleSize = 1;
    const particleSpeed = 2;
    const particleColor = 'hsl(275, 100%, 50%)'; // Primary color

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * particleSpeed;
        this.vy = (Math.random() - 0.5) * particleSpeed;
        this.size = Math.random() * particleSize + 0.5;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        if (mouse.isDown) {
          let dx = this.x - mouse.x;
          let dy = this.y - mouse.y;
          let dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            let force = (150 - dist) / 150;
            this.vx += (dx / dist) * force * 0.5;
            this.vy += (dy / dist) * force * 0.5;
          }
        }
      }

      draw() {
        ctx!.fillStyle = particleColor;
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    function init() {
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }

    function animate() {
      ctx!.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      for (let i = 0; i < particles.length; i++) {
        for (let j = i; j < particles.length; j++) {
            let dx = particles[i].x - particles[j].x;
            let dy = particles[i].y - particles[j].y;
            let dist = Math.sqrt(dx * dx + dy * dy);
            if(dist < 100) {
                ctx!.beginPath();
                ctx!.strokeStyle = `hsla(275, 100%, 50%, ${1 - dist/100})`;
                ctx!.lineWidth = 0.2;
                ctx!.moveTo(particles[i].x, particles[i].y);
                ctx!.lineTo(particles[j].x, particles[j].y);
                ctx!.stroke();
            }
        }
      }
      requestAnimationFrame(animate);
    }
    
    const handleResize = () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        particles = [];
        init();
    };
    
    const handleMouseMove = (e: MouseEvent) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    }
    
    const handleMouseDown = () => { mouse.isDown = true; }
    const handleMouseUp = () => { mouse.isDown = false; }


    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    
    init();
    animate();

    return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mouseup', handleMouseUp);
    }
  }, [isMounted]);

  if (!isMounted) {
    return null;
  }

  return (
    <div
      className={cn(
        'fixed inset-0 z-[100] bg-background transition-opacity duration-1000 flex items-center justify-center',
        {
          'opacity-0 pointer-events-none': !isLoading,
        }
      )}
    >
      <canvas ref={canvasRef} className="absolute inset-0" />
      <h1 className="text-4xl sm:text-6xl font-headline font-bold text-primary animate-pulse z-10">
        VelocityType
      </h1>
    </div>
  );
}
