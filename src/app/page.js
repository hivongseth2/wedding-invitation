"use client";

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Story from '@/components/Story';
import Events from '@/components/Events';
import Gallery from '@/components/Gallery';
import RSVP from '@/components/RSVP';
import Footer from '@/components/Footer';
import ThemeToggle from '@/components/ThemeToggle';
import LoadingScreen from '@/components/LoadingScreen';
import SpotlightCursor from '@/components/Cursor/SpotlightCursor';
import ScrollAnimation from '@/components/LineScroll/HeartScroll';
import LovePathAnimation from '@/components/LineScroll/LovePathAnimation';
import HorizontalImage from '@/components/ScrollImages/HorizontalImage';
import BeforeAfterHorizontal from '@/components/ScrollImages/HorizontalImage';
import LoveJourney from '@/components/PipeLine/LovePipeLine';
import DotComponent from '@/components/Dot/Dot';
import DotV1Component from '@/components/Dot/DotV1';
import DotV2Component from '@/components/Dot/DotV2';
import ScrollingRing from '@/components/Glb/ScrollingRing';
import EnergyOrb from '@/components/Sync/SyncCanvas';

export default function Home() {
  const mainRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cursorType, setCursorType] = useState('default');

  useEffect(() => {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
    
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    
    // Initial page load animation sequence
    const ctx = gsap.context(() => {
      // Create smooth scrolling with GSAP ScrollTrigger
      ScrollTrigger.defaults({
        toggleActions: 'play none none reverse',
        start: 'top 80%',
      });
      
      // Create a smooth page transition effect when clicking on navigation links
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
          e.preventDefault();
          
          const targetId = this.getAttribute('href');
          const targetElement = document.querySelector(targetId);
          
          if (targetElement) {
            // Create a smooth scroll animation
            gsap.to(window, {
              duration: 1.2,
              scrollTo: {
                y: targetElement,
                offsetY: 80
              },
              ease: 'power3.inOut'
            });
          }
        });
      });
      
      // Handle cursor hover effects
      const handleMouseEnter = (type) => {
        setCursorType(type);
      };
      
      const handleMouseLeave = () => {
        setCursorType('default');
      };
      
      // Add event listeners for interactive elements
      document.querySelectorAll('.interactive').forEach(element => {
        element.addEventListener('mouseenter', () => handleMouseEnter('hover'));
        element.addEventListener('mouseleave', handleMouseLeave);
      });
      
      document.querySelectorAll('.clickable').forEach(element => {
        element.addEventListener('mouseenter', () => handleMouseEnter('click'));
        element.addEventListener('mouseleave', handleMouseLeave);
      });
      
      document.querySelectorAll('.gallery-item').forEach(element => {
        element.addEventListener('mouseenter', () => handleMouseEnter('view'));
        element.addEventListener('mouseleave', handleMouseLeave);
      });
    }, mainRef);
    
    return () => {
      ctx.revert(); // Cleanup GSAP
      clearTimeout(timer); // Cleanup timer
      
      // Remove event listeners
      document.querySelectorAll('.interactive, .clickable, .gallery-item').forEach(element => {
        element.removeEventListener('mouseenter', () => {});
        element.removeEventListener('mouseleave', () => {});
      });
    };
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  
  return (
    <>

      <main ref={mainRef} className="min-h-screen relative z-10">
      <SpotlightCursor/>
        {/* <ScrollAnimation></ScrollAnimation> */}
        {/* <ThemeToggle /> */}

      {/* <LoveJourney></LoveJourney> */}




       {/* <LovePathAnimation></LovePathAnimation> */}
        <Header />
        {/* <Hero /> */}

        <EnergyOrb/>
        <Story /> 
        <BeforeAfterHorizontal></BeforeAfterHorizontal>

        <Events />

        <Gallery />

        {/* <DotV1Component/> */}
   {/*
        {/* <LoveJourney></LoveJourney> */}
        {/* <DotV1Component/> */}


        <RSVP />


        <ScrollingRing absolute={true} zIndex={10} showText={true} showProgress={true} />

        <Footer /> 
      </main>
    </>
  );
}
