import React, { useEffect } from 'react';
import styled from 'styled-components';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

// Đăng ký ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const BeforeAfterComparison = () => {
  useEffect(() => {
    // GSAP animation cho mỗi comparison section
    gsap.utils.toArray(".comparisonSection").forEach(section => {
      let tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "center center",
          end: () => "+=" + section.offsetWidth,
          scrub: true,
          pin: true,
          anticipatePin: 1
        },
        defaults: { ease: "none" }
      });

      tl.fromTo(
        section.querySelector(".afterImage"),
        { xPercent: 100, x: 0 },
        { xPercent: 0 }
      )
      .fromTo(
        section.querySelector(".afterImage img"),
        { xPercent: -100, x: 0 },
        { xPercent: 0 },
        0
      );
    });
  }, []);

  // Styled components
  const Panel = styled.section`
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100%;
    
    .header-section {
      font-weight: 400;
      max-width: none;
      color: white;
    }
  `;

  const ComparisonSection = styled.section`
    position: relative;
    padding-bottom: 56.25%; /* duy trì aspect ratio */
    
    .comparisonImage {
      width: 100%;
      height: 100%;
    }


    .afterImage {
      position: absolute;
      overflow: hidden;
      top: 0;
      transform: translate(100%, 0px);
    }

    .afterImage img {
      transform: translate(-100%, 0px);
    }

    .comparisonImage img {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      object-fit: contain;
    }
  `;

  return (
    <>
      <Panel>
        <h1 className="header-section">Scroll to see the before/after</h1>
      </Panel>

      <ComparisonSection className="comparisonSection">
        <div className="comparisonImage beforeImage">
          <img 

            src="images/1.png" 
            alt="before"
          />
        </div>
        <div className="comparisonImage afterImage">
          <img 
            src="images/2.jpg" 
            alt="after"
          />
        </div>
      </ComparisonSection>


    </>
  );
};

// CSS cho body nên được đặt ở file CSS global (ví dụ: index.css)
// body {
//   height: 300vh;
//   background-color: #111;
//   color: white;
//   overflow-x: hidden;
// }

export default BeforeAfterComparison;