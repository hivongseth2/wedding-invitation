"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { Heart, Facebook, Instagram, Youtube } from "lucide-react"

export default function Footer() {
  const footerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate footer elements
      gsap.fromTo(
        ".footer-title",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 90%",
          },
        },
      )

      gsap.fromTo(
        ".footer-text",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: 0.2,
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 90%",
          },
        },
      )

      gsap.fromTo(
        ".social-icons a",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.2,
          duration: 0.6,
          ease: "back.out(1.7)",
          delay: 0.4,
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 90%",
          },
        },
      )

      gsap.fromTo(
        ".copyright",
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: 0.8,
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 90%",
          },
        },
      )

      // Heartbeat animation
      gsap.to(".heart-icon", {
        scale: 1.2,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      })
    }, footerRef)

    return () => ctx.revert()
  }, [])

  return (
    <footer ref={footerRef} className="py-12 glass relative overflow-hidden">
      <div className="container mx-auto px-4 text-center">
        <h3 className="footer-title font-playfair text-2xl text-gold mb-4">Chú Rể & Cô Dâu</h3>
        <p className="footer-text font-montserrat  mb-6 max-w-xl mx-auto">
          Cảm ơn bạn đã ghé thăm trang web thiệp cưới của chúng tôi. Chúng tôi rất mong được gặp bạn trong ngày trọng
          đại.
        </p>

        <div className="social-icons flex justify-center space-x-6 mb-8">
          <a href="#" className="text-gold hover:text-gold/80 transition-colors transform hover:scale-110 duration-300">
            <Facebook className="h-6 w-6" />
          </a>
          <a href="#" className="text-gold hover:text-gold/80 transition-colors transform hover:scale-110 duration-300">
            <Instagram className="h-6 w-6" />
          </a>
          <a href="#" className="text-gold hover:text-gold/80 transition-colors transform hover:scale-110 duration-300">
            <Youtube className="h-6 w-6" />
          </a>
        </div>

        <div className="flex items-center justify-center mb-4">
          <div className="h-px bg-gold/30 w-16"></div>
          <div className="heart-icon text-gold mx-4">
            <Heart className="h-6 w-6 fill-gold" />
          </div>
          <div className="h-px bg-gold/30 w-16"></div>
        </div>

        <p className="copyright font-montserrat text-sm ">
          &copy; {new Date().getFullYear()} Wedding Invitation. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

