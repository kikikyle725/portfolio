import { useState, useRef, useEffect } from 'react';

// Simple animation utility
const animateValue = (target, property, endValue, duration, easing = 'easeOut', onUpdate = null, onComplete = null) => {
  const startValue = parseFloat(target[property]) || 0;
  const startTime = Date.now();
  const change = endValue - startValue;
  
  const easingFunctions = {
    easeOut: t => 1 - Math.pow(1 - t, 3),
    easeIn: t => t * t * t,
    easeInOut: t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
  };
  
  const easingFunc = easingFunctions[easing] || easingFunctions.easeOut;
  
  const animate = () => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / (duration * 1000), 1);
    const easedProgress = easingFunc(progress);
    
    target[property] = startValue + (change * easedProgress);
    
    if (onUpdate) onUpdate();
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else if (onComplete) {
      onComplete();
    }
  };
  
  requestAnimationFrame(animate);
};

export default function TransitionOverlay({ isActive, onComplete }) {
  const [phase, setPhase] = useState('hidden'); // hidden, zooming, flashing, fading, complete
  const overlayRef = useRef(null);
  const zoomRef = useRef(null);
  
  useEffect(() => {
    if (!isActive || phase !== 'hidden') return;
    
    // Start the transition sequence
    setPhase('zooming');
    
    // Phase 1: Zoom effect (1.5 seconds)
    if (zoomRef.current) {
      zoomRef.current.style.transform = 'scale(1)';
      zoomRef.current.style.opacity = '1';
      
      animateValue(
        zoomRef.current.style,
        'transform',
        'scale(20)', // This creates the zoom-in tunnel effect
        1.5,
        'easeIn',
        null,
        () => {
          // Phase 2: White flash
          setPhase('flashing');
          
          if (overlayRef.current) {
            animateValue(
              overlayRef.current.style,
              'opacity',
              1,
              0.8,
              'easeOut',
              null,
              () => {
                // Phase 3: Hold briefly then fade out
                setTimeout(() => {
                  setPhase('fading');
                  animateValue(
                    overlayRef.current.style,
                    'opacity',
                    0,
                    1.2,
                    'easeInOut',
                    null,
                    () => {
                      setPhase('complete');
                      if (onComplete) onComplete();
                    }
                  );
                }, 800);
              }
            );
          }
        }
      );
    }
  }, [isActive, phase, onComplete]);
  
  if (phase === 'hidden' || phase === 'complete') {
    return null;
  }
  
  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Zoom tunnel effect */}
      {(phase === 'zooming') && (
        <div
          ref={zoomRef}
          className="absolute inset-0 border-4 border-blue-400 rounded-full"
          style={{
            left: '50%',
            top: '50%',
            width: '10px',
            height: '10px',
            marginLeft: '-5px',
            marginTop: '-5px',
            transform: 'scale(1)',
            opacity: 0.8,
            background: 'radial-gradient(circle, rgba(74,144,226,0.3) 0%, rgba(74,144,226,0.1) 50%, transparent 70%)'
          }}
        />
      )}
      
      {/* White flash overlay */}
      {(phase === 'flashing' || phase === 'fading') && (
        <div
          ref={overlayRef}
          className="absolute inset-0"
          style={{
            background: "radial-gradient(circle, white 70%, rgba(255,255,255,0.8) 100%)",
            opacity: 0,
          }}
        />
      )}
      
      {/* Optional: Status text */}
      {phase !== 'hidden' && phase !== 'complete' && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center z-10">
          <div className="bg-black/50 px-6 py-3 rounded-lg backdrop-blur-sm">
            <div className="text-xl font-semibold">
              {phase === 'zooming' && '🌌 Entering portal...'}
              {phase === 'flashing' && '✨ Transitioning...'}t
              {phase === 'fading' && '🚀 Welcome!'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}