import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const DotV2Component = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const heartRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const heart = heartRef.current;

    gsap.set(heart, {
      scale: 0,
      opacity: 0,
      transformOrigin: 'center',
    });

    gsap.set(title, {
      opacity: 0,
      y: 20,
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=2000',
        scrub: 1,
        pin: section,
        pinSpacing: true,
        fastScrollEnd: true,
       invalidateOnRefresh: true,
        markers: false,
      },
      defaults: { ease: 'power2.inOut' },
    });

    tl.to(title, {
      opacity: 1,
      y: 0,
      duration: 0.8,
    })
      .to(heart, {
        scale: 1,
        opacity: 0.9,
        duration: 1,
        ease: 'elastic.out(1, 0.5)',
      })
      .to(heart, {
        scale: 2,
        duration: 1.2,
      })
      .to(heart, {
        scale: 1,
        opacity: 0.5,
        duration: 1.2,
      });

    const pulse = gsap.to(heart, {
      scale: 1.05,
      duration: 0.7,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      paused: true,
    });

    tl.eventCallback('onComplete', () => pulse.play());

    return () => {
      tl.kill();
      pulse.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <Section ref={sectionRef}>
      <Title ref={titleRef}>
        LOVE <Mark>YOU</Mark>
      </Title>
      <Heart ref={heartRef} />
    </Section>
  );
};

// Styled components với glassmorphism
const Section = styled.section`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  background: linear-gradient(135deg, rgba(255, 182, 193, 0.1), rgba(255, 235, 235, 0.1));
`;

const Title = styled.p`
  font-size: 80px;
  text-align: center;
  position: relative;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.9);
  left: 200px;
  padding: 20px 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.18);
`;

const Mark = styled.span`
  color: #ff8e8e;
`;

const Heart = styled.svg.attrs({
  width: '150px',
  height: '150px',
  viewBox: '0 0 24 24',
  xmlns: 'http://www.w3.org/2000/svg',
  children: (
    <g transform="translate(0 -1028.4)">
      <path
        d="m7 1031.4c-1.5355 0-3.0784 0.5-4.25 1.7-2.3431 2.4-2.2788 6.1 0 8.5l9.25 9.8 9.25-9.8c2.279-2.4 2.343-6.1 0-8.5-2.343-2.3-6.157-2.3-8.5 0l-0.75 0.8-0.75-0.8c-1.172-1.2-2.7145-1.7-4.25-1.7z"
        fill="rgba(233, 131, 152, 0.34)"
      />
    </g>
  ),
})`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background:transparent;
//   backdrop-filter: blur(12px);

  pointer-events: none;
`;

export default DotV2Component;