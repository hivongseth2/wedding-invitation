"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import anime from "animejs/lib/anime.es.js";
import { Menu, X } from "lucide-react";
import MusicPlayer from "./MusicPlayer/MusicPlayer";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const headerRef = useRef(null);
  const navRefs = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Gradient background animation
      anime({
        targets: headerRef.current,
        background: [
          "linear-gradient(45deg, #ff6b6b, #4ecdc4)",
          "linear-gradient(45deg, #4ecdc4, #45b7d1)",
          "linear-gradient(45deg, #45b7d1, #ff6b6b)",
        ],
        duration: 5000,
        loop: true,
        easing: "linear",
      });

      // Nav items 3D hover
      navRefs.current.forEach((item) => {
        item.addEventListener("mouseenter", () => {
          anime({
            targets: item,
            rotateX: 15,
            scale: 1.1,
            translateY: -5,
            duration: 300,
            easing: "easeOutQuad",
          });
        });
        item.addEventListener("mouseleave", () => {
          anime({
            targets: item,
            rotateX: 0,
            scale: 1,
            translateY: 0,
            duration: 300,
            easing: "easeOutQuad",
          });
        });
      });

      // Mobile menu animation
      if (isMenuOpen) {
        anime({
          targets: ".mobile-menu",
          translateY: ["-100%", "0%"],
          opacity: [0, 1],
          duration: 600,
          easing: "easeOutExpo",
        });
      } else {
        anime({
          targets: ".mobile-menu",
          translateY: "100%",
          opacity: 0,
          duration: 400,
          easing: "easeInExpo",
        });
      }
    }, headerRef);

    return () => ctx.revert();
  }, [isMenuOpen]);

  const addToRefs = (el) => {
    if (el && !navRefs.current.includes(el)) navRefs.current.push(el);
  };

  return (
    <header
      ref={headerRef}
      className="fixed w-full z-50 py-4 glass-effect transition-all duration-500"
    >
      
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="text-3xl font-bold text-white">
          C & C
        </Link>

        <button
          className="md:hidden text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <nav className="hidden md:flex space-x-8">
          <Link href="#story" ref={addToRefs} className="nav-item text-white">
            Câu Chuyện
          </Link>
          <Link href="#events" ref={addToRefs} className="nav-item text-white">
            Sự Kiện
          </Link>
          <Link href="#gallery" ref={addToRefs} className="nav-item text-white">
            Hình Ảnh
          </Link>
          <Link href="#rsvp" ref={addToRefs} className="nav-item text-white">
            RSVP
          </Link>
        </nav>

        

      </div>

      {isMenuOpen && (
        <div className="mobile-menu md:hidden glass-effect absolute top-full left-0 w-full">
          <nav className="py-4 flex flex-col space-y-4 text-center text-white">
            <Link href="#story" onClick={() => setIsMenuOpen(false)}>
              Câu Chuyện
            </Link>
            <Link href="#events" onClick={() => setIsMenuOpen(false)}>
              Sự Kiện
            </Link>
            <Link href="#gallery" onClick={() => setIsMenuOpen(false)}>
              Hình Ảnh
            </Link>
            <Link href="#rsvp" onClick={() => setIsMenuOpen(false)}>
              RSVP
            </Link>
          </nav>
        </div>
      )}

      <style jsx>{`
        .glass-effect {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }
        .nav-item {
          transition: transform 0.3s ease;
          perspective: 500px;
        }
      `}</style>
    </header>
  );
}