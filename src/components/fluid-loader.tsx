'use client';

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

const LOADER_SIZE = 300; // Size of the loader canvas

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
    
    canvas.width = LOADER_SIZE;
    canvas.height = LOADER_SIZE;

    const ballColor = 'hsl(275, 100%, 65%)';
    const numBalls = 6;
    const balls: Ball[] = [];

    class Ball {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 1.5;
        this.vy = (Math.random() - 0.5) * 1.5;
        this.r = Math.random() * 20 + 20;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < this.r || this.x > canvas.width - this.r) this.vx *= -1;
        if (this.y < this.r || this.y > canvas.height - this.r) this.vy *= -1;
      }

      draw() {
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx!.fillStyle = ballColor;
        ctx!.fill();
      }
    }

    for (let i = 0; i < numBalls; i++) {
        balls.push(new Ball());
    }

    function animate() {
      ctx!.clearRect(0, 0, canvas.width, canvas.height);
      
      // Apply filters for the metaball effect
      ctx!.filter = 'blur(20px) contrast(30)';
      
      balls.forEach(ball => {
        ball.update();
        ball.draw();
      });
      
      // Reset filter to draw other things normally if needed
      ctx!.filter = 'none';

      requestAnimationFrame(animate);
    }
    
    animate();

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
