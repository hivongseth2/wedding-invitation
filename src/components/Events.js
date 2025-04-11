"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import SpotlightCard from "./SpotlightCard/SpotlightCard";
import HorizontalScroll from "./HorizontalScroll/HorizontalScroll";
import HeartTimeline from "./HorizontalScroll/HeartLine";
import DotComponent from "./Dot/Dot";
import HeartComponent from "./Dot/DotV2";

export default function HorizontalEvents() {
  const eventsRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.set(".events-title, .events-subtitle", { opacity: 0, y: 30 });
      gsap.to(".events-title", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        scrollTrigger: { trigger: ".events-header", start: "top 80%" },
      });
      gsap.to(".events-subtitle", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: 0.2,
        scrollTrigger: { trigger: ".events-header", start: "top 80%" },
      });

      const cards = gsap.utils.toArray(".event-card");
      cards.forEach((card) => {
        gsap.set(card, { y: 50, opacity: 0 });
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
        tl.to(card, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
        });
      });
    }, eventsRef);

    return () => ctx.revert();
  }, []);

  const events = [
    {
      title: "Lễ Vu Quy",
      date: "31 Tháng 12, 2024",
      time: "9:00 - 11:00",
      location: "Nhà hàng ABC, 123 Đường XYZ, Hà Nội",
      description: "Lễ vu quy sẽ được tổ chức tại nhà gái theo phong tục truyền thống.",
      image:
        "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1170&q=80",
      mapUrl: "https://maps.google.com/?q=21.0285,105.8542",
    },
    {
      title: "Lễ Thành Hôn",
      date: "31 Tháng 12, 2024",
      time: "18:00 - 21:00",
      location: "Trung tâm Tiệc cưới DEF, 456 Đường UVW, Hà Nội",
      description: "Tiệc cưới chính sẽ được tổ chức vào buổi tối với sự tham dự của gia đình và bạn bè thân thiết.",
      image:
        "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1170&q=80",
      mapUrl: "https://maps.google.com/?q=21.0278,105.8342",
    },
    {
      title: "Tiệc Mừng",
      date: "1 Tháng 1, 2025",
      time: "18:00 - 21:00",
      location: "Nhà hàng GHI, 789 Đường RST, Hà Nội",
      description: "Tiệc mừng sau đám cưới dành cho bạn bè và đồng nghiệp.",
      image:
        "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1169&q=80",
      mapUrl: "https://maps.google.com/?q=21.0278,105.8342",
    },
  ];

  return (
    <section ref={eventsRef} className="py-20 relative overflow-hidden">
      <div className="events-header container mx-auto px-4 mb-16 text-center">
        <h2 className="events-title font-playfair text-4xl md:text-5xl text-gold mb-4">
          Sự Kiện Cưới
        </h2>
        <p className="events-subtitle font-montserrat text-muted-foreground max-w-2xl mx-auto">
          Chúng tôi rất mong được đón tiếp bạn trong ngày trọng đại này.
        </p>
      </div>

      <HorizontalScroll>
        <div className="flex flex-col items-center justify-center p-8">
          <div className="max-w-lg text-center">
            <h3 className="font-playfair text-3xl text-gold mb-6">Lịch Trình Đám Cưới</h3>
            <p className="font-montserrat text-muted-foreground mb-8">
              Hãy cuộn sang phải để xem chi tiết các sự kiện trong đám cưới của chúng tôi.
            </p>
            <HeartTimeline />
          </div>
        </div>

        {events.map((event, index) => (
          <div
            key={index}
            className="event-card w-[90vw] md:w-[70vw] flex flex-col md:flex-row items-center gap-6 p-6 bg-white/90 rounded-3xl shadow-lg border border-gold/40 mx-auto"
          >
            <div className="w-full md:w-1/2 h-60 md:h-80 relative rounded-2xl overflow-hidden event-image">
              <Image src={event.image} alt={event.title} layout="fill" objectFit="cover" />
            </div>
            <div className="flex-1 space-y-4 text-center md:text-left">
              <h3 className="event-title font-playfair text-2xl text-gold">{event.title}</h3>
              <p className="event-detail text-muted-foreground"><Calendar className="inline w-4 h-4 mr-2" /> {event.date}</p>
              <p className="event-detail text-muted-foreground"><Clock className="inline w-4 h-4 mr-2" /> {event.time}</p>
              <p className="event-detail text-muted-foreground"><MapPin className="inline w-4 h-4 mr-2" /> {event.location}</p>
              <p className="text-sm text-gray-600">{event.description}</p>
              <div className="event-button">
                <Button variant="outline" asChild>
                  <a href={event.mapUrl} target="_blank" rel="noopener noreferrer">
                    Xem bản đồ
                  </a>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </HorizontalScroll>
      {/* <DotComponent/> */}
      {/* <HeartComponent></HeartComponent> */}

    </section>
  );
}
