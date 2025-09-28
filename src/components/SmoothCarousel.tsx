"use client";
// Smooth scrolling carousel component
import React, { useRef, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface SmoothCarouselProps {
  children: React.ReactNode[];
  autoScroll?: boolean;
  scrollSpeed?: number;
  showArrows?: boolean;
  className?: string;
}

const SmoothCarousel: React.FC<SmoothCarouselProps> = ({
  children,
  autoScroll = true,
  scrollSpeed = 50,
  showArrows = true,
  className = ""
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Calculate animation duration based on scroll speed
  const animationDuration = (children.length * 320) / scrollSpeed; // 320px per card

  const handleMouseEnter = () => {
    if (autoScroll) {
      setIsPaused(true);
    }
  };

  const handleMouseLeave = () => {
    if (autoScroll) {
      setIsPaused(false);
    }
  };

  const scrollToDirection = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollAmount = 320;
      const newScrollLeft = direction === 'left' 
        ? containerRef.current.scrollLeft - scrollAmount
        : containerRef.current.scrollLeft + scrollAmount;
      
      containerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Left Arrow */}
      {showArrows && (
        <button
          onClick={() => scrollToDirection('left')}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-300 hover:scale-110"
          aria-label="Scroll left"
        >
          <FaChevronLeft className="text-gray-600 text-lg" />
        </button>
      )}

      {/* Right Arrow */}
      {showArrows && (
        <button
          onClick={() => scrollToDirection('right')}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-300 hover:scale-110"
          aria-label="Scroll right"
        >
          <FaChevronRight className="text-gray-600 text-lg" />
        </button>
      )}

      {/* Scrollable Container */}
      <div
        ref={containerRef}
        className="overflow-hidden"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div 
          className={`flex gap-8 pb-4 smooth-scroll-animation ${isPaused ? 'paused' : ''}`}
          data-duration={animationDuration}
        >
          {/* First set */}
          {children.map((child, index) => (
            <div key={`original-${index}`} className="flex-shrink-0 w-80">
              {child}
            </div>
          ))}
          {/* Duplicate set for seamless loop */}
          {children.map((child, index) => (
            <div key={`duplicate-${index}`} className="flex-shrink-0 w-80">
              {child}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SmoothCarousel;
