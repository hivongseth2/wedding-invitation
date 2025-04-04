import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CountdownTimer({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const timerRef = useRef(null);

  function calculateTimeLeft() {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  useEffect(() => {
    // Pulse animation for seconds
    const ctx = gsap.context(() => {
      gsap.to('.seconds-value', {
        scale: 1.1,
        duration: 0.3,
        ease: 'power2.out',
        repeat: -1,
        yoyo: true,
        repeatDelay: 0.7
      });
      
      // Subtle rotation animation for the countdown boxes
      gsap.to('.countdown-item:nth-child(odd)', {
        rotate: 2,
        duration: 3,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true
      });
      
      gsap.to('.countdown-item:nth-child(even)', {
        rotate: -2,
        duration: 3.5,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true
      });
    }, timerRef);
    
    return () => ctx.revert();
  }, []);

  const timerComponents = [];

  Object.keys(timeLeft).forEach((interval) => {
    if (!timeLeft[interval]) {
      return;
    }

    timerComponents.push(
      <div key={interval} className="countdown-item flex flex-col items-center mx-2 relative">
        <div className="bg-white/20 backdrop-blur-sm rounded-lg w-20 h-20 md:w-24 md:h-24 flex items-center justify-center shadow-lg relative overflow-hidden group">
          <div className="absolute inset-0 bg-gold/10 transform scale-0 group-hover:scale-100 transition-transform duration-500 ease-out rounded-lg"></div>
          <span className={`text-3xl md:text-4xl font-bold text-white relative z-10 ${interval === 'seconds' ? 'seconds-value' : ''}`}>
            {timeLeft[interval]}
          </span>
        </div>
        <span className="text-white text-sm mt-2 capitalize font-montserrat tracking-wider">
          {interval}
        </span>
        
        {/* Decorative dots */}
        {interval !== 'seconds' && (
          <div className="absolute -right-5 top-1/2 transform -translate-y-1/2 flex flex-col space-y-1">
            <div className="w-1.5 h-1.5 rounded-full bg-gold/70"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-gold/70"></div>
          </div>
        )}
      </div>
    );
  });

  return (
    <div ref={timerRef} className="flex justify-center">
      {timerComponents.length ? (
        <div className="flex flex-wrap justify-center">
          {timerComponents}
        </div>
      ) : (
        <div className="text-white text-2xl font-playfair animate-pulse">
          Hôm nay là ngày cưới!
        </div>
      )}
    </div>
  );
}
