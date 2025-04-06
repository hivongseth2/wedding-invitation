import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger with GSAP
gsap.registerPlugin(ScrollTrigger);

const DotV1Component = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const dotRef = useRef(null);
  const Heart = styled.div`
  position: absolute;
  width: 100px;
  height: 90px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 50% 50% 0 0;
  transform: rotate(-45deg);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.5s ease;

  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 100px;
    height: 90px;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    border-radius: 50% 50% 0 0;
  }

  &::before {
    top: -50px;
    left: 0;
  }

  &::after {
    left: 50px;
    top: 0;
  }
`;

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const mark = title.querySelector('span');
    const dot = dotRef.current;

    // Initial GSAP setup for the dot
    gsap.set(dot, {
        width: '100vmax',
        height: '100vmax',
        xPercent: -50,
        yPercent: -50,
        top: '50%',
        left: '50%',
        scale: 0,
        opacity: 1,
      });
      

    // GSAP timeline with ScrollTrigger
    const tl1 = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=2000', // độ dài scroll (điều chỉnh tuỳ theo cảm giác)
          scrub: 1.5,
          pin: section,
          pinSpacing: true,
          markers: true,
          invalidateOnRefresh: true,
        },
        defaults: { ease: 'none' },
      });
      
    //   tl1
    //     .to(title, { opacity: 1 }, 0) // xuất hiện chữ
    //     .fromTo(dot,
    //       {
    //         scale: 0,
    //         x: () => {
    //           const markBounds = mark.getBoundingClientRect();
    //           const px = markBounds.left + markBounds.width * 0.6;
    //           return px - section.getBoundingClientRect().width / 2;
    //         },
    //         y: () => {
    //           const markBounds = mark.getBoundingClientRect();
    //           const py = markBounds.top + markBounds.height * 0.73;
    //           return py - section.getBoundingClientRect().height / 2;
    //         },
    //       },
    //       {
    //         x: 0,
    //         y: 0,
    //         scale: 1,
    //         duration: 1, // giai đoạn bung ra
    //       }
    //     )
    //     .to(dot, {
    //       scale: 0, // thu lại
    //       duration: 1, // giai đoạn thu vào
    //     });


    tl1
        .to(title, { opacity: 1 }, 0)
        .to(dot, {
            scale: 3,
            duration: 1,
            ease: 'power2.out',
        })
        .to(dot, {
            scale: 5,
            opacity: 0,
            duration: 0.6,
            ease: 'power4.in',
        });
            


    // Cleanup ScrollTrigger on unmount
    return () => {
      tl1.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <Section ref={sectionRef}>
 
      <Title ref={titleRef}>
        TITLE <Mark>?</Mark>
      </Title>
      <Dot ref={dotRef} />
    </Section>
  );
};

// Styled components for scoped CSS
const Section = styled.section`
  position: absolute; /* Overlay other components */
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10; /* Ensure it overlays other content */
`;


const Title = styled.p`
  font-size: 100px;
  text-align: center;
  position: relative;
  font-weight: 900;
  color: #fff;
  opacity: 0;
  left: 200px;
`;

const Mark = styled.span`
  /* No additional styles needed unless customized */
`;

const Dot = styled.div`
  background-color: pink;
  width: 0;
  height: 0;
  border-radius: 50%;
  position: absolute;
  filter: blur(10px); /* Optional for glowing effect */
  mix-blend-mode: screen; /* Optional for blending */
  pointer-events: none; /* Optional to let clicks go through */
`;


export default DotV1Component;