"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import anime from "animejs/lib/anime.es.js";
import FlyingPosters from "./FlyingPoster/FlyingPosters";
import GridImages from "./GridImages/GridImage";

gsap.registerPlugin(ScrollTrigger);

export default function Story() {
  const storyRef = useRef(null);
  const timelineLineRef = useRef(null);
  const particleContainerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animation cho đường kẻ cuộn xuống (timeline line)
      gsap.from(timelineLineRef.current, {
        height: 0,
        duration: 2,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: ".story-container",
          start: "top 80%",
          end: "bottom 20%",
          scrub: 1,
        },
      });

      // Animation cho tiêu đề
      gsap.from(".story-title", {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power3.out",
      });

      // Animation cho các story item
      const items = gsap.utils.toArray(".story-item");
      items.forEach((item, i) => {
        const img = item.querySelector(".story-image");
        const dot = item.querySelector(".timeline-dot");

        // Reveal animation khi cuộn
        gsap.from(item, {
          opacity: 0,
          y: 100,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
          },
        });

        // Animation cho dot trên timeline
        gsap.from(dot, {
          scale: 0,
          opacity: 0,
          duration: 0.8,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
          },
        });

        // 3D hover effect cho hình ảnh
        img.addEventListener("mousemove", (e) => {
          const rect = img.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          anime({
            targets: img,
            rotateX: y / 10,
            rotateY: x / 10,
            duration: 300,
            easing: "easeOutQuad",
          });
        });
        img.addEventListener("mouseleave", () => {
          anime({
            targets: img,
            rotateX: 0,
            rotateY: 0,
            duration: 300,
            easing: "easeOutQuad",
          });
        });
      });

      // Particle effect khi cuộn
      const spawnParticles = () => {
        const particleCount = 20;
        for (let i = 0; i < particleCount; i++) {
          const particle = document.createElement("div");
          particle.className = "particle";
          particleContainerRef.current.appendChild(particle);

          anime({
            targets: particle,
            translateX: anime.random(-100, 100),
            translateY: anime.random(-100, 100),
            scale: [0.5, 1.5],
            opacity: [0, 0.7, 0],
            duration: anime.random(1000, 2000),
            easing: "easeOutQuad",
            complete: () => particle.remove(),
          });
        }
      };

      ScrollTrigger.create({
        trigger: ".story-container",
        start: "top 80%",
        onEnter: spawnParticles,
      });
    }, storyRef);

    return () => ctx.revert();
  }, []);

  const storyItems = [
    {
      date: "Tháng 6, 2020",
      title: "Lần đầu gặp gỡ",
      description:
        "Chúng tôi gặp nhau lần đầu tại một buổi tiệc của bạn chung. Đó là một cuộc gặp gỡ tình cờ nhưng đầy duyên phận.",
      image:
        "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    },
    {
      date: "Tháng 12, 2021",
      title: "Hẹn hò đầu tiên",
      description:
        "Sau nhiều lần trò chuyện, chúng tôi quyết định có buổi hẹn hò đầu tiên tại một quán cà phê nhỏ ở phố cổ.",
      image:
        "https://images.unsplash.com/photo-1537378235181-2a01be0b5974?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    },
    {
      date: "Tháng 8, 2022",
      title: "Chuyến du lịch đầu tiên",
      description: "Chúng tôi có chuyến du lịch đầu tiên cùng nhau đến Đà Nẵng. Những kỷ niệm tuyệt vời bên bờ biển.",
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1173&q=80",
    },
    {
      date: "Tháng 2, 2023",
      title: "Lời cầu hôn",
      description:
        'Dưới ánh nến lung linh và tiếng nhạc du dương, anh đã quỳ gối và cầu hôn. Và tất nhiên, câu trả lời là "Có"!',
      image:
        "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    },
  ];
  const items = [
    'https://picsum.photos/500/500?grayscale', 
    'https://picsum.photos/600/600?grayscale', 
    'https://picsum.photos/400/400?grayscale'
  ];
  return (
    <section
      ref={storyRef}
      className="py-20 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden"
    >

      <div style={{ height: '100vh', position: 'absolute',zIndex:'30',float:"left" }}>
        <FlyingPosters items={items}/>
      </div>
      {/* Particle container */}
      <div
        ref={particleContainerRef}
        className="absolute inset-0 pointer-events-none"
      ></div>

      <div className="container mx-auto px-4 relative z-10">
        <h2 className="story-title text-5xl font-bold text-center text-white mb-16">
          Câu Chuyện Tình Yêu
        </h2>

        <div className="story-container relative max-w-4xl mx-auto">
          {/* Timeline center line */}
          <div
            ref={timelineLineRef}
            className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-yellow-400 to-pink-500 h-full"
          ></div>

          {storyItems.map((item, index) => (
            <div
              key={index}
              className={`story-item flex flex-col md:flex-row items-center gap-8 mb-16 relative ${
                index % 2 === 0 ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Timeline dot */}
              <div className="timeline-dot absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-yellow-400 rounded-full z-10 shadow-lg"></div>

              {/* Content */}
              <div className="md:w-1/2 text-center md:text-left">
                <span className="inline-block bg-yellow-400/20 text-yellow-400 px-4 py-1 rounded-full text-sm mb-2">
                  {item.date}
                </span>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-white/80">{item.description}</p>
              </div>

              {/* Image */}
              <div className="md:w-1/2 perspective-1000">
                <div className="story-image rounded-lg overflow-hidden shadow-2xl">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={500}
                    height={300}
                    className="w-full h-64 object-cover transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        
      {/* <div style={{ height: '100vh', position: 'absolute',zIndex:'30',right:"0",top:'0' }}>
        <FlyingPosters items={items}/>
      </div> */}

<GridImages></GridImages>

      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
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