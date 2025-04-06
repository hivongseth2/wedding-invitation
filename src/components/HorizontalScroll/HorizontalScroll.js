"use client";

import { useEffect, useRef, Children, cloneElement, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeartTimeline from "./HeartLine"

export default function HorizontalScroll({ 
  children, 
  allowAddSections = false,
  className = "",
  ...props 
}) {
  const [childrenArray, setChildrenArray] = useState(
    Children.toArray(children)
  );
  
  const containerRef = useRef(null);
  const scrollTweenRef = useRef(null);
  
  // Function to get a random color
  const getRandomColor = () => {
    const colors = ["red", "blue", "orange", "purple", "green"];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  
  // Add a new section (optional functionality)
  const addSection = () => {
    if (!allowAddSections) return;
    
    // Get the current ScrollTrigger progress before adding a new section
    const st = scrollTweenRef.current.scrollTrigger;
    const oldProgress = st.progress;
    
    // Create a new section with a random color
    const newSection = (
      <section 
        key={`new-section-${childrenArray.length}`} 
        className={`panel`}
        style={{
          ...styles.panel, 
          backgroundColor: `transparent`,
        }}
      >
        New Section {childrenArray.length + 1}
      </section>
    );
    
    // Add the new section to state
    setChildrenArray(prev => [...prev, newSection]);
    
    // Update the container width
    gsap.set(containerRef.current, { "--width": ((childrenArray.length + 1) * 100) + "%" });
    
    // Update ScrollTrigger
    ScrollTrigger.refresh();
    
    // Adjust the scroll position to make it appear seamless
    st.scroll(st.start + (st.end - st.start) * oldProgress * (childrenArray.length - 1) / childrenArray.length);
    st.update();
    st.endAnimation();
  };
  
  useEffect(() => {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    
    // Initialize the horizontal scroll animation
    scrollTweenRef.current = gsap.to(containerRef.current, {
      x: () => -(containerRef.current.scrollWidth - document.documentElement.clientWidth) + "px",
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        pin: true,
        start: "top top",
        scrub: 1,
        end: () => `+=${containerRef.current.scrollWidth}`, // Sửa lại để lấy độ dài chính xác
        invalidateOnRefresh: true,
      }
    });
    
    
    // Cleanup function
    return () => {
      if (scrollTweenRef.current && scrollTweenRef.current.scrollTrigger) {
        scrollTweenRef.current.scrollTrigger.kill();
      }
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);
  
  // Update the container width when children change
  useEffect(() => {
    gsap.set(containerRef.current, { "--width": (childrenArray.length * 100) + "%" });
    
    // Only refresh ScrollTrigger if it's already been initialized
    if (scrollTweenRef.current && scrollTweenRef.current.scrollTrigger) {
      ScrollTrigger.refresh();
    }
  }, [childrenArray]);
  
  // Process children to ensure they have the panel class and proper styling
  const processedChildren = childrenArray.map((child, index) => {
    // If the child is a React element, clone it and add the necessary props
    if (child.props) {
      return cloneElement(child, {
        key: child.key || `panel-${index}`,
        className: `panel ${child.props.className || ""}`,
        style: {
          ...styles.panel,
          ...child.props.style,
        },
      });
    }
    return child;
  });
  
  return (
    <>
      <div 
        className={`horizontal-scroll-container ${className}`} 
        ref={containerRef} 
        style={{...styles.container, ...props.style}}
        {...props}
      >


        {processedChildren}
      </div>

      {allowAddSections && (
        <button onClick={addSection} style={styles.button}>
          Add section
        </button>
      )}
    </>
  );
}

// Component-scoped styles
const styles = {
  container: {
    width: "var(--width, 400%)",
    height: "100vh",
    display: "flex",
    flexWrap: "nowrap",
  },
  panel: {
    minWidth: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "2rem",
    fontWeight: "bold",
  },
  button: {
    position: "fixed",
    right: "20px",
    top: "50%",
    transform: "translateY(-50%)",
    padding: "10px 15px",
    backgroundColor: "#2ecc71",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    zIndex: 100,
  }
};
