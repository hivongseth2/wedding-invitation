"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { X, ZoomIn } from "lucide-react"
import GridImages from "./GridImages/GridImage"
import ScrollVelocity from "./ScrollVelocity/ScrollVelocity"
import CircularGallery from "./CircularGallery/CircularGallery"
import DotComponent from "./Dot/Dot"
import LoveJourney from "./PipeLine/LovePipeLine"
export default function Gallery() {
  const galleryRef = useRef(null)
  const [selectedImage, setSelectedImage] = useState(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      // Animate the gallery title and description
      const headerTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".gallery-header",
          start: "top 80%",
        },
      })

      headerTl
        .fromTo(".gallery-title", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" })
        .fromTo(
          ".gallery-desc",
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
          "-=0.4",
        )

      // Create a staggered reveal animation for gallery items
      const galleryItems = gsap.utils.toArray(".gallery-item")

      // Create a masonry-like staggered animation
      galleryItems.forEach((item, i) => {
        // Calculate a random delay for more natural feel
        const delay = i * 0.1 + Math.random() * 0.2

        gsap.fromTo(
          item,
          {
            opacity: 0,
            y: 50,
            scale: 0.9,
            rotateX: 10,
            rotateY: i % 2 === 0 ? 5 : -5,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateX: 0,
            rotateY: 0,
            duration: 0.8,
            delay: delay,
            ease: "back.out(1.2)",
            scrollTrigger: {
              trigger: ".gallery-grid",
              start: "top 85%",
            },
          },
        )
      })
    }, galleryRef)

    return () => ctx.revert()
  }, [])

  const openLightbox = (image) => {
    setSelectedImage(image)
    document.body.style.overflow = "hidden"

    // Animate the lightbox opening
    gsap.fromTo(
      ".lightbox-container",
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" },
    )

    // Animate the image
    gsap.fromTo(
      ".lightbox-image",
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.6, delay: 0.1, ease: "power2.out" },
    )
  }

  const closeLightbox = () => {
    // Animate the lightbox closing
    gsap.to(".lightbox-container", {
      opacity: 0,
      scale: 0.9,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        setSelectedImage(null)
        document.body.style.overflow = "auto"
      },
    })
  }

  const images = [
    {
      src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      alt: "Wedding photo 1",
      span: "col-span-1",
    },
    {
      src: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      alt: "Wedding photo 2",
      span: "col-span-2",
    },
    {
      src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80",
      alt: "Wedding photo 3",
      span: "col-span-1",
    },
    {
      src: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      alt: "Wedding photo 4",
      span: "col-span-1",
    },
    {
      src: "https://images.unsplash.com/photo-1507504031003-b417219a0fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      alt: "Wedding photo 5",
      span: "col-span-1",
    },
    {
      src: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      alt: "Wedding photo 6",
      span: "col-span-2",
    },
  ]

  return (
    <section id="gallery" ref={galleryRef} className="py-20 bg-background relative overflow-hidden">

<ScrollVelocity
  texts={['React Bits', 'Scroll Down']} 
//   velocity={velocity} 
  className="custom-scroll-text"
/>
      {/* Background decoration - glassmorphism elements */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-gold/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-gold/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="gallery-header text-center mb-16">
          <h2 className="gallery-title font-playfair text-4xl md:text-5xl text-gold mb-4">Khoảnh Khắc Đẹp</h2>
          <p className="gallery-desc font-montserrat  max-w-2xl mx-auto">
            Những khoảnh khắc đẹp nhất của chúng tôi được lưu giữ mãi mãi.
          </p>
        </div>

        <CircularGallery></CircularGallery>

      
      </div>

      <DotComponent></DotComponent>
      <LoveJourney/>

    </section>
  )
}

