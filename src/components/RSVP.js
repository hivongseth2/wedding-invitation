"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Wine } from "lucide-react"

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger)

const flowerImages = [
  "https://www.pngmart.com/files/22/Flower-Aesthetic-Theme-PNG-Photo.png",
  "https://www.pngmart.com/files/22/Flower-Aesthetic-Theme-PNG-Photo.png",
  "https://www.pngmart.com/files/22/Flower-Aesthetic-Theme-PNG-Photo.png",
]

const WeddingCard = () => {
  const cardRef = useRef(null)
  const contentRef = useRef(null)
  const flowerRefs = useRef([])
  const glassesRef = useRef(null)
  const nameRef = useRef(null)
  const dateRef = useRef(null)
  const locationRef = useRef(null)

  useEffect(() => {
    // Main card animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: cardRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    })

    // Card entrance animation
    tl.fromTo(
      cardRef.current,
      { opacity: 0, scale: 0.9, filter: "blur(8px)" },
      {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        duration: 1.2,
        ease: "power3.out",
      },
    )

    // Content animations
    tl.fromTo(
      contentRef.current.children,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: "power2.out",
      },
      "-=0.5",
    )

    // Special animation for names
    tl.fromTo(
      nameRef.current,
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: "elastic.out(1, 0.5)",
      },
      "-=0.4",
    )

    // Glasses animation
    tl.fromTo(
      glassesRef.current,
      { opacity: 0, scale: 0, rotation: -15 },
      {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 0.8,
        ease: "back.out(1.7)",
      },
      "-=0.6",
    )

    // Flower animations
    flowerRefs.current.forEach((el, i) => {
      // Random delay for more natural appearance
      const delay = 0.2 + i * 0.15 + Math.random() * 0.3

      // Random rotation
      const rotation = Math.random() * 30 - 15

      // Random scale variation
      const scale = 0.8 + Math.random() * 0.4

      tl.fromTo(
        el,
        {
          opacity: 0,
          scale: 0,
          rotation: rotation - 15,
        },
        {
          opacity: 0.9,
          scale: scale,
          rotation: rotation,
          duration: 0.8,
          ease: "back.out(1.7)",
        },
        "-=0.7",
      )
    })

    // Subtle hover animation for flowers
    flowerRefs.current.forEach((el) => {
      gsap.to(el, {
        y: "+=5",
        rotation: "+=3",
        duration: 2 + Math.random() * 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      })
    })

    return () => {
      // Clean up animations
      if (tl) tl.kill()
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [])

  return (
    <div className="flex justify-center items-center min-h-[500px] py-16 px-4">

      
<img
            src={ "/images/12.jpg"}
            alt={`flower`}
            className="absolute pointer-events-none"
            style={{
              width: `400px`,
              top: `-100`,
              left: `0`,
              zIndex: "1",
            }}
          />
 
      <div
        ref={cardRef}
        className="relative max-w-md w-full overflow-hidden rounded-2xl bg-gradient-to-br from-rose-50 to-white p-8 shadow-xl border border-rose-100"
      >
    
        {/* Flower decorations */}
        {flowerImages.map((src, i) => (
          <img
            key={i}
            ref={(el) => (flowerRefs.current[i] = el)}
            src={src || "/placeholder.svg"}
            alt={`flower-${i}`}
            className="absolute pointer-events-none"
            style={{
              width: `${50 + Math.random() * 100}px`,
              top: `${i % 2 === 0 ? 5 + Math.random() * 20 : 70 + Math.random() * 10}%`,
              left: `${i % 2 === 0 ? 5 + Math.random() * 20 : 70 + Math.random() * 10}%`,
              transform: "translate(-50%, -50%)",
              zIndex: "1",
            }}
          />
        ))}

        {/* Card content */}
        <div ref={contentRef} className="relative z-10 text-center">
          <div className="mb-6 text-rose-800 font-serif">
            <h3 className="text-lg font-light tracking-wide">THIỆP MỜI</h3>
            <h2 className="text-2xl font-semibold mt-1">ĐÁM CƯỚI</h2>
          </div>

          <p className="text-gray-700 mb-4">Trân trọng kính mời bạn đến dự lễ cưới của</p>

          <div ref={nameRef} className="my-6 py-4 border-y border-rose-200">
            <h1 className="text-3xl font-serif text-rose-700 font-bold">Mỹ Linh & Huy Hùng</h1>
          </div>

          <div ref={dateRef} className="mt-6 mb-4 text-gray-700">
            <p className="font-medium">Vào lúc 10:00 sáng, Thứ Ba</p>
            <p className="text-xl font-bold text-rose-600 mt-1">22-02-2022</p>
            <p className="text-sm italic mt-1">(Tức ngày 22 tháng 01 năm Nhâm Dần)</p>
          </div>

          <div ref={locationRef} className="mt-6 text-gray-700 bg-rose-50 p-4 rounded-lg">
            <p className="font-medium">Tại:</p>
            <p className="font-bold text-rose-700">254 Hà Đông, Thanh Xuân, Hà Nội</p>
          </div>

          {/* Champagne glasses decoration */}
          <div ref={glassesRef} className="mt-8 flex justify-center items-center">
            <div className="relative flex items-end">
              <Wine className="h-8 w-8 text-rose-400 transform -rotate-12" />
              <div className="w-px h-10 bg-rose-300 mx-1 opacity-70"></div>
              <Wine className="h-8 w-8 text-rose-400 transform rotate-12" />

              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-transparent via-rose-300 to-transparent opacity-70"></div>
            </div>
          </div>

          <p className="mt-8 text-sm italic text-gray-500">Rất hân hạnh được đón tiếp</p>
        </div>
      </div>
    </div>
  )
}

export default WeddingCard
