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
  return (
    <div className="relative w-full h-screen">

      {/* Render Landing splash screen if visible */}

      {showLanding ? (
        <Landing onEnter={() => {
          // Delay hiding the landing page
          setTimeout(() => setShowLanding(false), 2000); // 2000ms = 2 seconds
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

    </div>
  );
}
