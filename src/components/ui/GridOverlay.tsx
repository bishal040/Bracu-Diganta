import React from 'react';

interface GridOverlayProps {
  scrollData: React.MutableRefObject<{ progress: number; phase: 1 | 2 | 3 }>;
}

export const GridOverlay: React.FC<GridOverlayProps> = ({ scrollData }) => {
  const gridRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    let animationFrameId: number;

    const render = () => {
      if (!gridRef.current) return;
      const { progress, phase } = scrollData.current;
      
      let opacity = 0;
      if (phase === 2) {
        // Fade in 0.35 to 0.4
        if (progress > 0.35 && progress <= 0.4) {
          opacity = (progress - 0.35) / 0.05;
        } else if (progress > 0.4 && progress <= 0.48) {
          opacity = 1;
        } else if (progress > 0.48 && progress <= 0.5) {
          // Fade out 0.48 to 0.5
          opacity = 1 - ((progress - 0.48) / 0.02);
        }
      }

      gridRef.current.style.opacity = opacity.toString();
      gridRef.current.style.pointerEvents = opacity > 0.5 ? 'auto' : 'none';

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [scrollData]);

  return (
    <div 
      ref={gridRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    >
      <div 
        className="w-full h-full" 
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '4vw 4vw',
          backgroundPosition: 'center center'
        }}
      />
      
      {/* Telemetry markers */}
      <div className="absolute top-8 left-8 text-telemetry-cyan font-mono text-xs opacity-50">
        SYS: ON-LINE<br/>
        LAT: 23.7772° N<br/>
        LON: 90.3995° E
      </div>
      <div className="absolute bottom-8 right-8 text-telemetry-cyan font-mono text-xs opacity-50 text-right">
        ALT: 0.0m<br/>
        V: 0.0m/s<br/>
        T: +00:00:00
      </div>
    </div>
  );
};
