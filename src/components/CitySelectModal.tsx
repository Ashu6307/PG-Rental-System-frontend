"use client";
import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

interface City {
  id: string;
  name: string;
  image: string;
  isNewCity?: boolean;
}

interface CitySelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCitySelect: (city: City) => void;
  cities: City[];
  currentCity?: City | null;
}

const CitySelectModal: React.FC<CitySelectModalProps> = ({
  isOpen,
  onClose,
  onCitySelect,
  cities,
  currentCity
}) => {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  const handleCityClick = (city: City) => {
    setSelectedCity(city);
    onCitySelect(city);
    onClose();
  };

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup function to restore scrolling when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // ESC key handler disabled - user must use close button or select city

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden relative shadow-2xl border border-gray-200 flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl z-10 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {currentCity ? 'Change City' : 'Select City'}
              </h2>
              {currentCity && (
                <p className="text-sm text-gray-600 mt-1">
                  Currently viewing: <span className="font-semibold text-blue-600">{currentCity.name}</span>
                </p>
              )}
              <div className="w-12 h-1 bg-teal-500 mt-2"></div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Close"
              aria-label="Close modal"
            >
              <FaTimes className="text-gray-500 text-xl" />
            </button>
          </div>
        </div>

        {/* Cities Grid - Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {/* All Cities Option */}
            <div
              onClick={() => handleCityClick({ id: 'all', name: 'All Cities', image: '/images/all-cities.jpg' })}
              className={`relative cursor-pointer group hover:scale-105 transition-transform duration-200 ${
                currentCity?.id === 'all' ? 'ring-2 ring-blue-500 ring-offset-2' : ''
              }`}
            >
              {/* Current Selection Badge */}
              {currentCity?.id === 'all' && (
                <div className="absolute -top-2 -left-2 z-10">
                  <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                    Current
                  </div>
                </div>
              )}
              
              {/* All Cities Image */}
              <div className="relative rounded-xl overflow-hidden aspect-square">
                <div className="w-full h-full bg-gradient-to-br from-blue-500 via-purple-500 to-teal-500 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-2xl mb-1">🌍</div>
                    <div className="text-xs font-semibold">All Cities</div>
                  </div>
                </div>
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                {/* City Name */}
                <div className="absolute bottom-2 left-2 right-2">
                  <h3 className="text-white font-semibold text-sm text-center">
                    All Cities
                  </h3>
                </div>
              </div>
            </div>

            {cities.map((city) => (
              <div
                key={city.id}
                onClick={() => handleCityClick(city)}
                className={`relative cursor-pointer group hover:scale-105 transition-transform duration-200 ${
                  currentCity?.id === city.id ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                }`}
              >
                {/* Current City Badge */}
                {currentCity?.id === city.id && (
                  <div className="absolute -top-2 -left-2 z-10">
                    <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                      Current
                    </div>
                  </div>
                )}
                
                {/* New Badge */}
                {city.isNewCity && (
                  <div className="absolute -top-2 -right-2 z-10">
                    <div className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold transform rotate-12">
                      New
                    </div>
                  </div>
                )}

                {/* City Image */}
                <div className="relative rounded-xl overflow-hidden aspect-square">
                  <img
                    src={city.image}
                    alt={city.name}
                    className="w-full h-full object-cover group-hover:brightness-110 transition-all duration-200"
                    onError={(e) => {
                      // Fallback to a generic city placeholder
                      e.currentTarget.src = `https://via.placeholder.com/150x150/4A90E2/FFFFFF?text=${encodeURIComponent(city.name)}`;
                    }}
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  
                  {/* City Name */}
                  <div className="absolute bottom-2 left-2 right-2">
                    <h3 className="text-white font-semibold text-sm text-center">
                      {city.name}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No cities message */}
          {cities.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-2">No cities available</div>
              <div className="text-gray-500 text-sm">Please try again later</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CitySelectModal;
