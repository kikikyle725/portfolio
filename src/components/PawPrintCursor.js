import { useEffect, useRef } from "react";

const PawPrintCursor = ({ children }) => {
  const cursorRef = useRef(null);
  const trailsRef = useRef([]);

  useEffect(() => {
    let lastTrailTime = 0;

    const handleMouseMove = (e) => {
      // Update cursor position directly (MUCH faster than React state)
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX - 12}px, ${e.clientY - 12}px)`;
      }

      // Add trail less frequently
      const now = Date.now();
      if (now - lastTrailTime > 100) { // Every 100ms
        createTrailPrint(e.clientX, e.clientY);
        lastTrailTime = now;
      }
    };

    const createTrailPrint = (x, y) => {
      const trail = document.createElement('div');
      trail.innerHTML = '🐾';
      trail.style.cssText = `
        position: fixed;
        left: ${x - 10}px;
        top: ${y - 10}px;
        pointer-events: none;
        z-index: 9998;
        color: rgb(156, 163, 175);
        font-size: 20px;
        animation: pawFade 1.5s ease-out forwards;
      `;
      
      document.body.appendChild(trail);
      
      // Clean up after animation
      setTimeout(() => {
        if (trail.parentNode) {
          trail.parentNode.removeChild(trail);
        }
      }, 1500);
    };

    // Add CSS animation if not already added
    if (!document.getElementById('paw-cursor-styles')) {
      const style = document.createElement('style');
      style.id = 'paw-cursor-styles';
      style.textContent = `
        @keyframes pawFade {
          0% { opacity: 0.8; transform: scale(1); }
          100% { opacity: 0; transform: scale(0.3); }
        }
      `;
      document.head.appendChild(style);
    }

    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      // Clean up any remaining trails
      const trails = document.querySelectorAll('[style*="pawFade"]');
      trails.forEach(trail => trail.remove());
    };
  }, []);

  return (
    <div className="cursor-none">
      {/* Super fast cursor using ref */}
      <div 
        ref={cursorRef}
        className="fixed top-0 left-0 w-6 h-6 pointer-events-none z-[9999]"
        style={{ willChange: 'transform' }}
      >
        <div className="w-full h-full text-2xl">🐾</div>
      </div>

      {children}
      
      <style dangerouslySetInnerHTML={{__html: `
        *, *:hover {
          cursor: none !important;
        }
      `}} />
    </div>
  );
};

export default PawPrintCursor;