import { useState, useRef, useEffect } from "react";
import { FaHome, FaUser, FaTools, FaBriefcase, FaFolderOpen, FaPhoneAlt} from "react-icons/fa";
//import "./Navbar.css";

function MainSite() {
    return (
      <div className="min-h-screen bg-gray-100 relative overflow-hidden animate-fade-in">
        <div className="relative z-10 flex flex-col items-center justify-center p-6 min-h-screen">
          
          {/* Clean Navbar */}
          <nav className="w-full max-w-6xl flex justify-between items-center mb-20 animate-slide-down">
            <div className="text-3xl">🐾</div>
            <div className="flex space-x-12 text-gray-800 text-lg">
              {['About', 'Projects', 'Skills', 'Contact'].map((item, index) => (
                <a 
                  key={item}
                  href={`#${item.toLowerCase()}`} 
                  className="hover:text-blue-600 transition-colors duration-300 font-medium animate-slide-down"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {item}
                </a>
              ))}
            </div>
          </nav>

          {/* Main Content Card */}
          <div className="max-w-7xl w-full bg-white rounded-3xl shadow-xl p-16 flex items-center justify-between gap-16 animate-slide-up">
            
            {/* Left Side - Text Content */}
            <div className="flex-1 space-y-8">
              <div>
                <h1 className="text-6xl font-bold text-gray-900 leading-tight mb-6">
                  Hi, I'm Kyle —<br />
                  Web Developer<br />
                  & Creator
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                  I build sleek, interactive web experiences with a playful twist
                </p>
              </div>
              
              <div className="flex gap-6 pt-4">
                <button className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-colors duration-300 shadow-lg">
                  View Projects
                </button>
                <button className="bg-gray-100 text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-200 transition-colors duration-300">
                  Contact Me
                </button>
              </div>
            </div>

            {/* Right Side - Simple Illustration */}
            <div className="flex-1 relative flex flex-col items-center">
              <div className="w-80 h-80 bg-gradient-to-br from-blue-300 to-blue-500 rounded-full mb-8 relative shadow-2xl animate-gentle-float">
                <div className="absolute inset-8 bg-white/20 rounded-full"></div>
              </div>
              
              {/* Simple paw prints */}
              <div className="flex gap-4 text-gray-300 text-2xl">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="animate-fade-in" style={{ animationDelay: `${i * 0.2 + 1}s` }}>🐾</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <style dangerouslySetInnerHTML={{__html: `
          @keyframes fade-in {
            0% { opacity: 0; }
            100% { opacity: 1; }
          }
          
          @keyframes slide-down {
            0% { opacity: 0; transform: translateY(-20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes slide-up {
            0% { opacity: 0; transform: translateY(40px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes gentle-float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          
          .animate-fade-in { animation: fade-in 1s ease-out forwards; }
          .animate-slide-down { animation: slide-down 0.8s ease-out forwards; }
          .animate-slide-up { animation: slide-up 1s ease-out forwards; }
          .animate-gentle-float { animation: gentle-float 6s ease-in-out infinite; }
        `}} />
      </div>
    );
}

export default MainSite;
