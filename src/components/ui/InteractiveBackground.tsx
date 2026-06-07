import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../App';

export const InteractiveBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    
    // Config
    const SPACING = 60; // Grid spacing
    const MOUSE_RADIUS = 250;
    const MAGNETIC_PULL = 0.4; // How strongly points pull towards mouse
    const SPRING_RETURN = 0.1; // How quickly points return to origin
    const FRICTION = 0.8;
    
    let mouse = { x: -1000, y: -1000 };
    
    class Point {
      ox: number;
      oy: number;
      x: number;
      y: number;
      vx: number;
      vy: number;
      col: number;
      row: number;

      constructor(x: number, y: number, col: number, row: number) {
        this.ox = x;
        this.oy = y;
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.col = col;
        this.row = row;
      }

      update() {
        const dxMouse = mouse.x - this.ox;
        const dyMouse = mouse.y - this.oy;
        const distSq = dxMouse * dxMouse + dyMouse * dyMouse;
        
        // Magnetic pull
        if (distSq < MOUSE_RADIUS * MOUSE_RADIUS) {
          const dist = Math.sqrt(distSq);
          const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
          
          const targetX = this.ox + (dxMouse / dist) * force * SPACING * MAGNETIC_PULL;
          const targetY = this.oy + (dyMouse / dist) * force * SPACING * MAGNETIC_PULL;
          
          this.vx += (targetX - this.x) * 0.2;
          this.vy += (targetY - this.y) * 0.2;
        }

        // Spring back to original position
        this.vx += (this.ox - this.x) * SPRING_RETURN;
        this.vy += (this.oy - this.y) * SPRING_RETURN;

        // Apply friction
        this.vx *= FRICTION;
        this.vy *= FRICTION;

        // Update position
        this.x += this.vx;
        this.y += this.vy;
      }
    }

    let points: Point[][] = [];
    let cols = 0;
    let rows = 0;

    const initGrid = () => {
      points = [];
      // Calculate cols and rows to cover the screen plus a margin
      cols = Math.ceil(width / SPACING) + 2;
      rows = Math.ceil(height / SPACING) + 2;
      
      const offsetX = (width - (cols - 1) * SPACING) / 2;
      const offsetY = (height - (rows - 1) * SPACING) / 2;

      for (let i = 0; i < cols; i++) {
        points[i] = [];
        for (let j = 0; j < rows; j++) {
          const x = i * SPACING + offsetX;
          const y = j * SPACING + offsetY;
          points[i][j] = new Point(x, y, i, j);
        }
      }
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initGrid();
    };

    const animate = () => {
      // Clear screen
      ctx.fillStyle = isDark ? '#000000' : '#ffffff'; 
      ctx.fillRect(0, 0, width, height);

      // Update points
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          points[i][j].update();
        }
      }

      // Draw grid lines
      ctx.lineWidth = 1;
      
      const rgbColor = isDark ? '255, 255, 255' : '0, 0, 0';
      
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const p = points[i][j];
          
          // Distance to mouse for brightness
          const dx = mouse.x - p.ox;
          const dy = mouse.y - p.oy;
          const distSq = dx * dx + dy * dy;
          const radiusSq = MOUSE_RADIUS * MOUSE_RADIUS * 2; // extended radius for glow
          
          let opacity = isDark ? 0.05 : 0.03; // Base subtle grid
          if (distSq < radiusSq) {
            const glowStrength = isDark ? 0.4 : 0.2;
            opacity = opacity + (1 - distSq / radiusSq) * glowStrength; // Brighter near mouse
          }
          
          ctx.strokeStyle = `rgba(${rgbColor}, ${opacity})`;
          
          ctx.beginPath();
          // Connect to right neighbor
          if (i < cols - 1) {
            const rightP = points[i + 1][j];
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(rightP.x, rightP.y);
          }
          // Connect to bottom neighbor
          if (j < rows - 1) {
            const bottomP = points[i][j + 1];
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(bottomP.x, bottomP.y);
          }
          ctx.stroke();
          
          // Draw small dot at intersection if near mouse
          if (distSq < radiusSq * 0.5) {
             const dotOpacity = (1 - distSq / (radiusSq * 0.5)) * (isDark ? 0.8 : 0.4);
             ctx.fillStyle = `rgba(${rgbColor}, ${dotOpacity})`;
             ctx.beginPath();
             ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
             ctx.fill();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const onMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);

    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDark]); // Re-run effect when theme changes

  return (
    <div className={`fixed inset-0 w-full h-full overflow-hidden z-0 ${isDark ? 'bg-black' : 'bg-white'}`}>
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full z-10"
      />
      {/* Subtle vignette / gradient overlay to make edges darker in dark mode, or slightly shaded in light mode */}
      <div className={`absolute inset-0 z-20 pointer-events-none ${isDark ? 'bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]' : 'bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.05)_100%)]'}`} />
      
      {/* Noise Texture for that premium technical feel */}
      <div className={`absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay z-30 pointer-events-none ${isDark ? 'opacity-[0.15]' : 'opacity-[0.4] invert'}`} />
    </div>
  );
};
