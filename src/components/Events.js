"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { MapPin, Clock } from "lucide-react"
import SpotlightCard from "./SpotlightCard/SpotlightCard"

export default function Events() {
  const eventsRef = useRef(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      // Set initial states with GSAP
      gsap.set(".events-title, .events-subtitle", { opacity: 0, y: 30 })
      gsap.set(".dress-code-title", { opacity: 0, y: 30 })
      gsap.set(".dress-code-item", { opacity: 0, y: 30 })

      // Main section animation
      gsap.to(".events-title", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: ".events-container",
          start: "top 80%",
        },
      })

      gsap.to(".events-subtitle", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: 0.2,
        scrollTrigger: {
          trigger: ".events-container",
          start: "top 80%",
        },
      })

      // Create a staggered animation for the event cards
      const cards = gsap.utils.toArray(".event-card")

      cards.forEach((card, i) => {
        // Set initial states
        gsap.set(card, {
          y: 100,
          opacity: 0,
          rotateY: i % 2 === 0 ? -5 : 5,
          rotateZ: i % 2 === 0 ? -2 : 2,
        })

        const cardImage = card.querySelector(".event-image")
        const cardTitle = card.querySelector(".event-title")
        const cardDetails = card.querySelectorAll(".event-detail")
        const cardButton = card.querySelector(".event-button")

        gsap.set(cardImage, { opacity: 0, scale: 1.2 })
        gsap.set(cardTitle, { opacity: 0, y: 20 })
        gsap.set(cardDetails, { opacity: 0, x: -20 })
        gsap.set(cardButton, { opacity: 0, y: 20 })

        // Create a timeline for each card
        const cardTl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        })

        // Card reveal animation
        cardTl.to(card, {
          y: 0,
          opacity: 1,
          rotateY: 0,
          rotateZ: 0,
          duration: 1,
          ease: "power3.out",
        })

        // Animate card content
        cardTl.to(
          cardImage,
          {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.6",
        )

        cardTl.to(
          cardTitle,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.4",
        )

        cardTl.to(
          cardDetails,
          {
            opacity: 1,
            x: 0,
            stagger: 0.1,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.4",
        )

        cardTl.to(
          cardButton,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "back.out(1.7)",
          },
          "-=0.2",
        )
      })

      // Dress code animation
      gsap.to(".dress-code-title", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: ".dress-code-section",
          start: "top 80%",
        },
      })

      gsap.to(".dress-code-item", {
        opacity: 1,
        y: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: ".dress-code-section",
          start: "top 80%",
        },
      })
    }, eventsRef)

    return () => ctx.revert()
  }, [])

  const events = [
    {
      title: "Lễ Vu Quy",
      date: "31 Tháng 12, 2024",
      time: "9:00 - 11:00",
      location: "Nhà hàng ABC, 123 Đường XYZ, Hà Nội",
      description: "Lễ vu quy sẽ được tổ chức tại nhà gái theo phong tục truyền thống.",
      image:
        "https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      mapUrl: "https://maps.google.com/?q=21.0285,105.8542",
    },
    {
      title: "Lễ Thành Hôn",
      date: "31 Tháng 12, 2024",
      time: "18:00 - 21:00",
      location: "Trung tâm Tiệc cưới DEF, 456 Đường UVW, Hà Nội",
      description: "Tiệc cưới chính sẽ được tổ chức vào buổi tối với sự tham dự của gia đình và bạn bè thân thiết.",
      image:
        "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      mapUrl: "https://maps.google.com/?q=21.0278,105.8342",
    },
  ]

  return (
    <section id="events" ref={eventsRef} className="py-20 bg-secondary/50 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="events-title font-playfair text-4xl md:text-5xl text-gold mb-4">Sự Kiện Cưới</h2>
          <p className="events-subtitle font-montserrat text-muted-foreground max-w-2xl mx-auto">
            Chúng tôi rất mong được đón tiếp bạn trong ngày trọng đại này.
          </p>
        </div>

        <div className="events-container grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {events.map((event, index) => (
                  <SpotlightCard className="custom-spotlight-card" spotlightColor="#880E4F">


  


              
              <div className="relative h-64 event-image overflow-hidden">
                <Image
                  src={event.image || "/placeholder.svg"}
                  alt={event.title}
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-4 left-6 text-white">
                  <span className="inline-block glass-gold px-3 py-1 rounded-full text-sm font-medium">
                    {event.date}
                  </span>
                </div>
              </div>

              <div className="p-6 event-content">
                <h3 className="event-title font-playfair text-2xl text-foreground mb-4">{event.title}</h3>

                <div className="space-y-3 mb-6">
                  <div className="event-detail flex items-center">
                    <Clock className="h-5 w-5 text-gold mr-3" />
                    <span className="font-montserrat text-muted-foreground">{event.time}</span>
                  </div>

                  <div className="event-detail flex items-start">
                    <MapPin className="h-5 w-5 text-gold mr-3 mt-1" />
                    <span className="font-montserrat text-muted-foreground">{event.location}</span>
                  </div>

                  <div className="event-detail">
                    <p className="font-montserrat text-muted-foreground mt-2 pl-8">{event.description}</p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="event-button border-gold text-foreground hover:text-gold hover:bg-transparent hover:border-gold/80 inline-flex items-center"
                  asChild
                >
                  <a href={event.mapUrl} target="_blank" rel="noopener noreferrer">
                    <MapPin className="h-4 w-4 mr-2" />
                    Xem Bản Đồ
                  </a>
                </Button>
              </div>
              </SpotlightCard>

          ))}
        </div>

        <div className="dress-code-section mt-16 text-center">
          <h3 className="dress-code-title font-playfair text-2xl text-foreground mb-6">Dress Code</h3>
          <div className="flex justify-center space-x-8">
            <div className="dress-code-item text-center transform transition-transform duration-300 hover:scale-110">
              <div className="w-16 h-16 rounded-full bg-pink-200 mx-auto mb-2 shadow-md"></div>
              <p className="font-montserrat text-muted-foreground">Pastel</p>
            </div>
            <div className="dress-code-item text-center transform transition-transform duration-300 hover:scale-110">
              <div className="w-16 h-16 rounded-full bg-blue-200 mx-auto mb-2 shadow-md"></div>
              <p className="font-montserrat text-muted-foreground">Trang nhã</p>
            </div>
            <div className="dress-code-item text-center transform transition-transform duration-300 hover:scale-110">
              <div className="w-16 h-16 rounded-full bg-gray-200 mx-auto mb-2 shadow-md"></div>
              <p className="font-montserrat text-muted-foreground">Lịch sự</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

