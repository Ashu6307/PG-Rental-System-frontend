"use client";
import React, { useRef, useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface HorizontalCarouselProps {
  children: React.ReactNode[];
  autoScroll?: boolean;
  scrollSpeed?: number;
  showArrows?: boolean;
  className?: string;
}

const HorizontalCarousel: React.FC<HorizontalCarouselProps> = ({
  children,
  autoScroll = true,
  scrollSpeed = 120,
  showArrows = true,
  className = ""
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [currentOffset, setCurrentOffset] = useState(0);

  // Calculate animation duration for consistent linear speed
  const animationDuration = Math.max(20, scrollSpeed); // Use scrollSpeed directly

  // Reset manual offset when auto-scroll resumes
  useEffect(() => {
    if (!isPaused && trackRef.current && currentOffset !== 0) {
      trackRef.current.style.transition = 'transform 0.5s ease-out';
      trackRef.current.style.transform = 'translate3d(0, 0, 0)';
      setCurrentOffset(0);
      
      setTimeout(() => {
        if (trackRef.current) {
          trackRef.current.style.transition = '';
        }
      }, 500);
    }
  }, [isPaused, currentOffset]);

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

  const handleButtonClick = (direction: 'left' | 'right') => {
    // Temporarily pause auto-scroll for manual navigation
    setIsPaused(true);
    scrollToDirection(direction);
    
    // Resume auto-scroll after 3 seconds
    setTimeout(() => {
      if (autoScroll) {
        setIsPaused(false);
      }
    }, 3000);
  };
  const scrollToDirection = (direction: 'left' | 'right') => {
    if (trackRef.current) {
      const cardWidth = 452; // Card width (420px) + gap (32px)
      const totalWidth = cardWidth * children.length; // Width of one set
      
      let newOffset;
      
      if (direction === 'right') {
        newOffset = currentOffset - cardWidth;
        // If we've scrolled past one complete set, reset to beginning of second set
        if (Math.abs(newOffset) >= totalWidth) {
          newOffset = 0;
        }
      } else {
        newOffset = currentOffset + cardWidth;
        // If we've scrolled back past the beginning, go to end of first set
        if (newOffset > 0) {
          newOffset = -totalWidth + cardWidth;
        }
      }
      
      setCurrentOffset(newOffset);
      trackRef.current.style.transform = `translate3d(${newOffset}px, 0, 0)`;
      trackRef.current.style.transition = 'transform 0.5s ease-out';
      
      // Remove transition after animation completes to avoid conflict with CSS animation
      setTimeout(() => {
        if (trackRef.current) {
          trackRef.current.style.transition = '';
        }
      }, 500);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Left Arrow */}
      {showArrows && (
        <button
          onClick={() => handleButtonClick('left')}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-300 hover:scale-110"
          aria-label="Scroll left"
        >
          <FaChevronLeft className="text-gray-600 text-lg" />
        </button>
      )}

      {/* Right Arrow */}
      {showArrows && (
        <button
          onClick={() => handleButtonClick('right')}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-300 hover:scale-110"
          aria-label="Scroll right"
        >
          <FaChevronRight className="text-gray-600 text-lg" />
        </button>
      )}

      {/* Carousel Container - Ultra-smooth CSS Animation */}
      <div className="carousel-container" ref={containerRef}>
        <div 
          ref={trackRef}
          className={`carousel-track ${isPaused ? 'paused' : ''}`}
          data-animation-duration={animationDuration}
          data-animation-state={isPaused ? 'paused' : 'running'}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Multiple sets for ultra smooth infinite loop */}
          {children.map((child, index) => (
            <div key={`set1-${index}`} className="carousel-card">
              {child}
            </div>
          ))}
          {children.map((child, index) => (
            <div key={`set2-${index}`} className="carousel-card">
              {child}
            </div>
          ))}
          {children.map((child, index) => (
            <div key={`set3-${index}`} className="carousel-card">
              {child}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HorizontalCarousel;
