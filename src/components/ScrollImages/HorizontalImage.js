import React, { useEffect } from 'react';
import styled from 'styled-components';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const BeforeAfterComparison = () => {
  useEffect(() => {
    gsap.utils.toArray('.comparisonSection').forEach((section) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=100%',
          scrub: true,
          pin: true,
        },
      });

      tl.to(section.querySelector('.afterImage'), {
        clipPath: 'inset(0% 0% 0% 0%)',
        ease: 'power2.out',
        duration: 1.5,
      }).fromTo(
        section.querySelector('.caption'),
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: 'sine.out' },
        '-=1'
      );
    });
  }, []);

  const ComparisonSection = styled.section`
    position: relative;
    width: 100vw;
    height: 100vh;
    background:transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;

    .imageWrapper {
      position: relative;
      width: 90%;
      max-width: 1000px;
      height: 600px;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
    }

    .comparisonImage {
      position: absolute;
      top: 0;
      background:transparent;
      left: 0;
      width: 100%;
      height: 100%;
    }

    .beforeImage img,
    .afterImage img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .afterImage {
      clip-path: inset(0% 100% 0% 0%);
    }

    .caption {
      position: absolute;
      bottom: 12%;
      left: 50%;
      transform: translateX(-50%);
      color: #4c3a2d;
      font-size: 1.6rem;
      font-weight: 500;
      font-family: 'Playfair Display', serif;
      font-style: italic;
      opacity: 0;
      text-align: center;
      white-space: pre-line;
    }
  `;

  return (
    <ComparisonSection className="comparisonSection z-10 bg-transparent">
      <div className="imageWrapper">
        <div className="comparisonImage beforeImage">
          <img src="/images/Deep_Diving.jpg" alt="before" />
        </div>
        <div className="comparisonImage afterImage">
          <img src="/images/Train_Track.jpg" alt="after" />
        </div>
        <div className="caption">
          {`Ngày xưa là ánh mắt lướt qua nhau...\nHôm nay là cái nắm tay không rời.`}
        </div>
      </div>
    </ComparisonSection>
  );
};

export default BeforeAfterComparison;
