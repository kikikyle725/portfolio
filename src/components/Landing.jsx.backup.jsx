import { useState, useEffect } from "react";

// No framer-motion dependency needed - using pure CSS animations!

export default function HomePage() {
  const [hoverDog, setHoverDog] = useState(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-300 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-300 rounded-full blur-lg animate-bounce" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-40 left-1/4 w-28 h-28 bg-pink-300 rounded-full blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center p-6 min-h-screen">
        {/* Enhanced Navbar */}
        <nav className="w-full max-w-6xl flex justify-between items-center mb-16">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Kyle.dev
          </div>
          <div className="flex space-x-8 text-gray-700">
            {['About', 'Projects', 'Skills', 'Contact'].map((item) => (
              <a 
                key={item}
                href={`#${item.toLowerCase()}`} 
                className="relative hover:text-blue-600 transition-all duration-300 group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </div>
        </nav>

        {/* Enhanced Hero Section */}
        <div className="max-w-6xl  rounded-3xl p-12 flex flex-col lg:flex-row items-center justify-between gap-12 border border-white/20">
          {/* Text Content */}
          <div className="flex-1 space-y-6">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Hi, I'm{' '}
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent animate-pulse">
                  Kyle —{' '}
                </span>
              </h1>
              <h2 className="text-2xl lg:text-3xl text-gray-700 font-light">
                Web Developer & Creator
              </h2>
            </div>
            
            <p className="text-xl text-gray-600 leading-relaxed max-w-md">
              I build sleek, interactive web experiences with a playful twist. 
              Let's create something amazing together.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 font-semibold">
                View Projects
                <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300 inline-block">→</span>
              </button>
              <button className="bg-white/90 border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-sm font-semibold hover:border-blue-300">
                Contact Me
              </button>
            </div>

            {/* Tech Stack Pills */}
            <div className="flex flex-wrap gap-3 pt-6">
              {['React', 'Next.js', 'TypeScript', 'Tailwind'].map((tech) => (
                <span key={tech} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-blue-100 hover:text-blue-700 transition-colors duration-300 cursor-default">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Enhanced Hero Graphics */}
          <div className="flex-1 flex flex-col items-center space-y-8">
            {/* Floating Sphere with enhanced animation */}
            <div className="relative">
              <div 
                className="w-48 h-48 bg-gradient-to-br from-blue-400 via-purple-400 to-blue-500 rounded-full shadow-2xl relative overflow-hidden floating-sphere"
                style={{
                  transform: `translateY(${scrollY * 0.1}px)`
                }}
              >
                {/* Inner glow effect */}
                <div className="absolute inset-4 bg-white/20 rounded-full blur-xl"></div>
                <div className="absolute inset-8 bg-white/30 rounded-full blur-lg"></div>
              </div>
              {/* Orbiting elements */}
              <div className="absolute inset-0 animate-spin" style={{animationDuration: '20s'}}>
                <div className="absolute -top-2 left-1/2 w-4 h-4 bg-yellow-400 rounded-full shadow-lg"></div>
              </div>
              <div className="absolute inset-0 animate-spin" style={{animationDuration: '15s', animationDirection: 'reverse'}}>
                <div className="absolute top-1/2 -right-2 w-3 h-3 bg-pink-400 rounded-full shadow-lg"></div>
              </div>
            </div>

            {/* Enhanced Dogs Section */}
            <div className="flex gap-12 items-center">
              <div className="relative">
                <div
                  className={`w-28 h-28 p-2 rounded-2xl bg-gradient-to-br from-orange-100 to-orange-200 shadow-lg transition-all duration-500 cursor-pointer transform ${
                    hoverDog === "kongi" ? 'scale-110 rotate-6 shadow-xl' : 'hover:scale-105'
                  }`}
                  onMouseEnter={() => setHoverDog("kongi")}
                  onMouseLeave={() => setHoverDog(null)}
                >
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/616/616408.png"
                    alt="Kongi the Yorkie"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-md text-xs font-medium text-gray-600">
                  Kongi
                </div>
              </div>

              <div className="relative">
                <div
                  className={`w-28 h-28 p-2 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 shadow-lg transition-all duration-500 cursor-pointer transform ${
                    hoverDog === "buddy" ? 'scale-110 -translate-y-2 shadow-xl' : 'hover:scale-105'
                  }`}
                  onMouseEnter={() => setHoverDog("buddy")}
                  onMouseLeave={() => setHoverDog(null)}
                >
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/616/616408.png"
                    alt="Buddy the Shepadoodle"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-md text-xs font-medium text-gray-600">
                  Buddy
                </div>
              </div>
            </div>

            {/* Enhanced Paw Prints Trail */}
            <div className="flex gap-3 opacity-60">
              {[...Array(6)].map((_, i) => (
                <span 
                  key={i} 
                  className="text-3xl transition-all duration-300 hover:scale-125 cursor-default paw-print"
                  style={{
                    animationDelay: `${i * 0.2}s`
                  }}
                >
                  🐾
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="mt-16 flex flex-col items-center text-gray-400">
          <span className="text-sm font-medium mb-2">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .floating-sphere {
          animation: float 6s ease-in-out infinite;
        }

        .paw-print {
          animation: pawBounce 2s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-20px) rotate(1deg); }
          66% { transform: translateY(-10px) rotate(-1deg); }
        }

        @keyframes pawBounce {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-5px) scale(1.1); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}} />
    </div>
  );
}