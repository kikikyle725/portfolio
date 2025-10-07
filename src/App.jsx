import React, { useState } from "react";
import Navbar from "./components/Navbar";
import About from "./components/About";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Landing from "./components/Landing";
import MainSite from "./components/MainSite";
import PawPrintCursor from "./components/PawPrintCursor"
//import GlassFruitScene from "./components/GlassFruitScene"; // new background component


export default function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [showWhiteFlash, setShowWhiteFlash] = useState(false);
  return (
    <div className="relative w-full h-screen">

      {/* Render Landing splash screen if visible */}

      {showLanding ? (
        <Landing onEnter={() => {
        // Start the white flash transition
        setShowWhiteFlash(true);
        
        // After white flash, hide landing and show main content
        setTimeout(() => {
          setShowLanding(false);
          setShowWhiteFlash(false);
        }, 1500); // Duration of white flash
      }} />
    ) : (
        <>
          <PawPrintCursor>
            <Navbar />
            <MainSite />
            <div style={{ height: "100px" }}></div>
            <About />
            <Projects />
            <Contact />
            <Footer />
          </PawPrintCursor>
        </>
      )}
    {/* White flash overlay that covers everything */}
    {showWhiteFlash && (
      <div 
        className="fixed inset-0 z-50 bg-white"
        style={{
          animation: 'fadeInOut 1.5s ease-in-out forwards'
        }}
      />
    )}

    <style dangerouslySetInnerHTML={{
      __html: `
        @keyframes fadeInOut {
          0% { opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { opacity: 0; }
        }
      `
    }} />
  
    </div>
  );
}
