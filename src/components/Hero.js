"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import anime from "animejs/lib/anime.es.js"; // Thêm AnimeJS
import CountdownTimer from "./CountdownTimer";
import FallingText from "./FallingText/FallingText";
import FallingTextIndex from "./FallingText/FallingTextIndex";
import DecryptedText from "./DescripText/DecryptedText";
import ScrollAnimation from "./LineScroll/HeartScroll";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const heroRef = useRef(null);
  const bgRef = useRef(null);
  const contentRef = useRef(null);
  const buttonRef = useRef(null);
  const particleRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Main timeline với GSAP
      const mainTl = gsap.timeline({ delay: 0.3 });

      // Background reveal với gradient overlay
      mainTl.fromTo(
        bgRef.current,
        { scale: 1.3, opacity: 0 },
        { scale: 1, opacity: 1, duration: 2.5, ease: "power4.out" }
      );

      // Content reveal bất đối xứng
      mainTl.from(".hero-title", {
        opacity: 0,
        x: -150,
        skewX: 10,
        duration: 1.5,
        ease: "power3.out",
      }, "-=1.8")
      .from(".hero-subtitle", {
        opacity: 0,
        x: 150,
        skewX: -10,
        duration: 1.5,
        ease: "power3.out",
      }, "-=1.5")
      .from(".hero-date", {
        opacity: 0,
        y: 100,
        duration: 1.2,
        ease: "back.out(2)",
      }, "-=1.2")
      .from(".countdown-item", {
        opacity: 0,
        scale: 0.8,
        y: 50,
        stagger: 0.2,
        duration: 1,
        ease: "elastic.out(1, 0.5)",
      }, "-=1");

      // Button animation với AnimeJS
      anime({
        targets: buttonRef.current,
        scale: [0, 1],
        opacity: [0, 1],
        duration: 1200,
        easing: "spring(1, 80, 10, 0)",
        delay: 1000,
      });

      // Floating button effect
      anime({
        targets: buttonRef.current,
        translateY: [-10, 10],
        duration: 2000,
        loop: true,
        direction: "alternate",
        easing: "easeInOutSine",
      });

      // Particle animation với AnimeJS
      const particleCount = 50;
      const particles = Array.from({ length: particleCount }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
      }));

      particles.forEach((_, i) => {
        const particle = document.createElement("div");
        particle.className = "particle";
        particleRef.current.appendChild(particle);

        anime({
          targets: particle,
          translateX: () => anime.random(-200, 200),
          translateY: () => anime.random(-200, 200),
          scale: [0.5, 1.5],
          opacity: [0, 0.5, 0],
          duration: anime.random(3000, 5000),
          loop: true,
          easing: "easeInOutQuad",
          delay: i * 100,
        });
      });

      // Parallax background
      gsap.to(bgRef.current, {
        y: "40%",
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      // Fade content khi scroll
      gsap.to(contentRef.current, {
        opacity: 0,
        y: 150,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "10% top",
          end: "40% top",
          scrub: true,
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const weddingDate = new Date("2026-12-31T00:00:00");

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black z-10">
      {/* Background với gradient overlay */}
      <div ref={bgRef} className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
          alt="Wedding background"
          fill
          priority
          className="object-cover opacity-70"
        />
         {/* <FallingTextIndex/> */}

                 <ScrollAnimation></ScrollAnimation>

        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-pink-900/20 to-black/70" />
      </div>

      {/* Particle container */}
      <div ref={particleRef} className="absolute inset-0 z-5 pointer-events-none"></div>

      {/* Content */}
      <div ref={contentRef} className="container mx-auto px-6 z-10 text-center relative">
        <div className="hero-subtitle font-sans text-lg md:text-2xl text-white/80 mb-6 tracking-widest uppercase">
            <DecryptedText text="Chúng tôi sắp kết hôn"
                speed={10}
                maxIterations={1000}
                characters="LUANTHU!?"
                className="revealed"
                parentClassName="all-letters"
                encryptedClassName="encrypted">
            </DecryptedText>
        </div>
        <h1 className="hero-title font-serif text-5xl md:text-7xl lg:text-8xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 mb-8 leading-tight drop-shadow-lg">
          Chú Rể <span className="inline-block mx-3"></span> Cô Dâu
        </h1>
        <div className="hero-date font-sans text-xl md:text-3xl text-white/90 mb-12 tracking-wide">
                <DecryptedText
                text="Thời gian địa điểm"
                animateOn="view"
                speed={10}
                maxIterations={200}
                  className="revealed"
                revealDirection="center"
                />
        </div>

        <div className="mb-16">
          <CountdownTimer targetDate={weddingDate} />
        </div>

        <button
          ref={buttonRef}
          className="hero-button relative bg-gradient-to-r from-yellow-400 to-pink-500 text-white font-sans py-4 px-10 rounded-full shadow-xl transition-all duration-300 hover:shadow-2xl hover:brightness-110 overflow-hidden group"
        >
          <span className="relative z-10 text-lg font-medium">Xem Thiệp Mời</span>
          <span className="absolute inset-0 bg-white/20 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500"></span>
        </button>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-12 left-0 right-0 flex justify-center">
        <div className="animate-pulse">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-white/70"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>

      <style jsx>{`
        .particle {
          position: absolute;
          width: 6px;
          height: 6px;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.8), transparent);
          border-radius: 50%;
        }
      `}</style>
    </section>
  );
}