import { useState, useRef, useEffect } from "react";
import { FaHome, FaUser, FaTools, FaBriefcase, FaFolderOpen, FaPhoneAlt} from "react-icons/fa";
import "./Navbar.css";

function Navbar() {
  const [activeIndex, setActiveIndex] = useState(0);
  const navRef = useRef(null);
  const [circleStyle, setCircleStyle] = useState({ left: 0 });

  const icons = [
    { icon: <FaHome className="nav-icon nav-icon--big" />, label: "Home" },
    { icon: <FaUser className="nav-icon" />, label: "About" },
    { icon: <FaTools className="nav-icon" />, label: "Skills" },
   // { icon: <FaBriefcase className="nav-icon" />, label: "Experiences" },
    { icon: <FaFolderOpen className="nav-icon nav-icon--big" />, label: "Portfolio" },
    { icon: <FaPhoneAlt className="nav-icon" />, label: "Contact" },
  ];

  const updateCirclePosition = () => {
    if (navRef.current) {
      const items = navRef.current.querySelectorAll(".nav-item");
      const iconEl = items[activeIndex].querySelector(".nav-icon");
      const rect = iconEl.getBoundingClientRect();
      const parentRect = navRef.current.getBoundingClientRect();

      const left = rect.left - parentRect.left + rect.width / 2 - 25; // 25 = half circle width
      const top = rect.top - parentRect.top + rect.height / 2 - 25;   // 25 = half circle height
      setCircleStyle({ left, top });
    }
  };

  useEffect(() => {
    updateCirclePosition();
    window.addEventListener("resize", updateCirclePosition); // recalc on resize
    return () => window.removeEventListener("resize", updateCirclePosition);
  }, [activeIndex]);

  return (
    <nav className="navbar" ref={navRef}>
      <div className="highlight-circle" style={circleStyle}></div>
      {icons.map((item, index) => (
        <div
            key={index}
            className={`nav-item ${activeIndex === index ? "active" : ""}`}
            onClick={() => setActiveIndex(index)}
        >
            {item.icon}
            <span className="nav-label">{item.label}</span>
        </div>
        ))}
    </nav>
     );
}

export default Navbar;
