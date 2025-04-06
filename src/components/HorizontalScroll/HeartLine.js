"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(MotionPathPlugin, ScrollTrigger);

export default function HeartTimeline({ eventId, className = "", ...props }) {
  const heartRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!heartRef.current || !containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(heartRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",   // Khi phần tử container đến gần bottom viewport
          end: "bottom top",     // Khi phần tử container đến gần top viewport
          scrub: 0.5,            // Điều chỉnh tốc độ cuộn
          markers: true,         // Debugging markers
        },
        duration: 1,
        ease: "none",
        motionPath: {
          path: "#wave-path",
          align: "#wave-path",
          autoRotate: false,
          alignOrigin: [0.5, 0.5],
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[300px] ${className}`}
      {...props}
    >
      <svg
        viewBox="0 0 1000 150"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <path
          id="wave-path"
          d="M 0 75 Q 50 35, 100 75 T 200 75 T 300 75 T 400 75 T 500 75 T 600 75 T 700 75 T 800 75 T 900 75 T 1000 75"
          stroke="#E63946"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
        <g ref={heartRef}>
          <path
            d="M24 4 C18 -4, 0 -4, 0 12 C0 25, 12 35, 24 44 C36 35, 48 25, 48 12 C48 -4, 30 -4, 24 4 Z"
            fill="#E63946"
            transform="translate(-24, -24) scale(0.7)"
          />
        </g>
      </svg>
    </div>
  );
}

