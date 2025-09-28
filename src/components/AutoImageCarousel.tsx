import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaBuilding } from 'react-icons/fa';

interface AutoImageCarouselProps {
  images?: Array<{ url: string } | string>;
  alt?: string;
  className?: string;
  autoSlideInterval?: number;
  showControls?: boolean;
  showDots?: boolean;
  type?: 'default' | 'pg' | 'room';
}

const AutoImageCarousel: React.FC<AutoImageCarouselProps> = ({
  images = [],
  alt = 'Image',
  className = '',
  autoSlideInterval = 3000,
  showControls = true,
  showDots = true,
  type = 'default',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>({});

  const getFallbackIcon = () => {
    return FaBuilding;
  };

  const IconFallback: React.FC<{ message: string }> = ({ message }) => {
    const FallbackIcon = getFallbackIcon();
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
        <FallbackIcon size={32} className="text-gray-400 mb-2" />
        <span className="text-gray-500 text-xs text-center px-2">{message}</span>
      </div>
    );
  };

  useEffect(() => {
    if (!images || images.length <= 1 || isHovered) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, autoSlideInterval);
    return () => clearInterval(interval);
  }, [images?.length, autoSlideInterval, isHovered]);

  const handleImageError = (index: number) => {
    setImageErrors((prev) => ({ ...prev, [index]: true }));
  };

  const handleImageLoad = (index: number) => {
    setImageErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[index];
      return newErrors;
    });
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!images || images.length === 0) return;
    setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
  };

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!images || images.length === 0) return;
    setCurrentIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
  };

  if (!images || images.length === 0) {
    const FallbackIcon = getFallbackIcon();
    return (
      <div className={`bg-gradient-to-br from-blue-100 to-purple-100 flex flex-col items-center justify-center ${className}`}>
        <FallbackIcon size={48} className="text-blue-400 mb-2" />
        <span className="text-blue-600 text-sm font-medium">
          {type === 'pg' ? 'PG Image' : type === 'room' ? 'Room/Flat Image' : 'No Image'}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Image */}
      <div className="relative w-full h-full">
        {imageErrors[currentIndex] ? (
          <IconFallback message={`${type === 'pg' ? 'PG' : type === 'room' ? 'Room/Flat' : ''} Image not available`} />
        ) : (
          <img
            src={typeof images[currentIndex] === 'string' ? images[currentIndex] : (images[currentIndex] as any).url}
            alt={alt}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onLoad={() => handleImageLoad(currentIndex)}
            onError={() => handleImageError(currentIndex)}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      {/* Navigation Controls */}
      {images.length > 1 && showControls && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
            aria-label="Previous image"
            title="Previous image"
          >
            <FaChevronLeft size={12} />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
            aria-label="Next image"
            title="Next image"
          >
            <FaChevronRight size={12} />
          </button>
        </>
      )}
      {/* Dot Indicators */}
      {images.length > 1 && showDots && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                goToSlide(index);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-white scale-110'
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
              title={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AutoImageCarousel;
