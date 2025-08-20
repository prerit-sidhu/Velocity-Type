'use client';

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

const LOADER_SIZE = 400; // Size of the loader canvas

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
    
    // Set a fixed size for the canvas
    let width = (canvas.width = LOADER_SIZE);
    let height = (canvas.height = LOADER_SIZE);
    let mouse = { x: width / 2, y: height / 2, isDown: false };
    let particles: Particle[] = [];
    const particleCount = 150;
    const particleSize = 1.5;
    const particleSpeed = 1;
    const particleColor = 'hsl(275, 100%, 50%)';

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
          if (dist < 200) {
            let force = (200 - dist) / 200;
            this.vx += (dx / dist) * force * 0.25;
            this.vy += (dy / dist) * force * 0.25;
          }
        }
        this.vx *= 0.98;
        this.vy *= 0.98;
      }

      draw() {
        ctx!.fillStyle = particleColor;
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    function init() {
        particles = [];
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
            if(dist < 120) {
                ctx!.beginPath();
                ctx!.strokeStyle = `hsla(275, 100%, 70%, ${1 - dist/120})`;
                ctx!.lineWidth = 0.3;
                ctx!.moveTo(particles[i].x, particles[i].y);
                ctx!.lineTo(particles[j].x, particles[j].y);
                ctx!.stroke();
            }
        }
      }
      requestAnimationFrame(animate);
    }
    
    // Adjust mouse coordinates to be relative to the canvas
    const handleMouseMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    }
    
    const handleMouseDown = () => { mouse.isDown = true; }
    const handleMouseUp = () => { mouse.isDown = false; }


    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    
    init();
    animate();

    return () => {
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
      <canvas ref={canvasRef} className="rounded-lg shadow-2xl" />
    </div>
  );
}
