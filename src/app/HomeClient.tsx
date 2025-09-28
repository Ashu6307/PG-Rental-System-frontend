"use client";
import React, { useState, useEffect } from "react";
import {
  FaBuilding,
  FaHome,
  FaBed,
  FaCreditCard,
  FaStar,
  FaLock,
  FaMobileAlt,
  FaMapMarkerAlt,
  FaHeadset,
  FaUsers,
  FaShieldAlt,
  FaKey,
  FaWifi,
  FaCar,
  FaHotel,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import apiService from "@/services/api";
import HorizontalCarousel from "@/components/HorizontalCarousel";
import CitySelectModal from "@/components/CitySelectModal";

const HomePageLoader = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
  </div>
);

const HomeClient = () => {
  const [homeData, setHomeData] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [screenSize, setScreenSize] = useState<"mobile" | "tablet" | "desktop">(
    "desktop"
  );
  const [showCityModal, setShowCityModal] = useState(false);
  const [selectedCity, setSelectedCity] = useState<any>(null);
  const [cities, setCities] = useState<any[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  // Auto-change images every 4 seconds
  useEffect(() => {
    const { hero } = homeData || {};
    const heroImages = hero?.images || [hero?.image].filter(Boolean);

    if (heroImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex(
          (prevIndex) => (prevIndex + 1) % heroImages.length
        );
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [homeData]);

  // Set page title
  useEffect(() => {
    document.title = "Home | PG & Room Rental";
  }, []);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const data = await apiService.get("/api/home");
        setHomeData(data);
      } catch (err) {
        if (process.env.NODE_ENV === "development") {
          console.error("Home API error:", err);
        }
      }
    };

    fetchHomeData();
  }, []);

  // Check if user is logged in and fetch cities
  useEffect(() => {
    const checkAuthAndFetchCities = async () => {
      try {
        // Check if user is logged in
        const token =
          localStorage.getItem("token") || sessionStorage.getItem("token");
        if (token) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
          // Fetch cities for modal if user is not logged in
          const citiesData = await apiService.get("/api/cities");
          setCities(citiesData.cities || []);

          // Check if city is already selected in localStorage
          const savedCity = localStorage.getItem("selectedCity");
          if (!savedCity) {
            setShowCityModal(true);
          } else {
            setSelectedCity(JSON.parse(savedCity));
          }
        }
      } catch (err) {
        console.error("Error checking auth or fetching cities:", err);
        setIsLoggedIn(false);
      }
    };

    checkAuthAndFetchCities();
  }, []);

  // Screen size detection for responsive scrolling
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setScreenSize("mobile");
      } else if (width < 1024) {
        setScreenSize("tablet");
      } else {
        setScreenSize("desktop");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle city selection
  const handleCitySelect = (city: any) => {
    setSelectedCity(city);
    localStorage.setItem("selectedCity", JSON.stringify(city));
    setShowCityModal(false);

    // Show a brief notification about city change
    console.log(`City changed to: ${city.name}`);

    // Trigger refresh of city-specific data if needed
    // This can be enhanced later to refresh PG/Room lists
  };

  // Handle modal close
  const handleModalClose = () => {
    setShowCityModal(false);
  };

  if (!homeData) {
    return <HomePageLoader />;
  }

  const { hero } = homeData;
  const heroImages = hero?.images || [hero?.image].filter(Boolean);
  const currentImage = heroImages[currentImageIndex];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">{hero?.title || ""}</h1>
          <p className="text-xl mb-6 max-w-2xl mx-auto">
            {hero?.subtitle || ""}
          </p>

          {/* Selected City Display */}
          {selectedCity && (
            <div className="mb-6 flex justify-center">
              <button
                onClick={() => setShowCityModal(true)}
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 border border-white/30 hover:border-white/50"
              >
                <span className="text-yellow-300">📍</span>
                <span>Currently viewing: {selectedCity.name}</span>
                <span className="text-sm opacity-75">• Click to change</span>
              </button>
            </div>
          )}

          {/* Hero Image Carousel */}
          <div className="relative mt-4">
            <img
              src={currentImage}
              alt="Hero Image"
              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                e.currentTarget.classList.add('hidden');
                if (e.currentTarget.nextSibling) {
                  (e.currentTarget.nextSibling as HTMLElement).classList.remove('hidden');
                  (e.currentTarget.nextSibling as HTMLElement).classList.add('flex');
                }
              }}
              onLoad={(e: React.SyntheticEvent<HTMLImageElement>) => {
                e.currentTarget.classList.remove('hidden');
                if (e.currentTarget.nextSibling) {
                  (e.currentTarget.nextSibling as HTMLElement).classList.add('hidden');
                }
              }}
              className="mx-auto rounded-lg shadow-2xl w-full max-w-7xl object-cover transition-opacity duration-1000 h-[350px]"
            />

            {/* Fallback when image fails to load */}
            <div
              className="mx-auto rounded-lg shadow-2xl w-full max-w-7xl bg-gray-200 items-center justify-center text-gray-600 text-2xl font-semibold h-[350px] hidden"
            >
              Image
            </div>

            {/* Image Indicators */}
            {heroImages.length > 1 && (
              <div className="flex justify-center mt-2 space-x-2">
                {heroImages.map((_: string, index: number) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentImageIndex
                        ? "bg-white scale-125"
                        : "bg-white/50 hover:bg-white/75"
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                    aria-label={`View image ${index + 1}`}
                    title={`View image ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {homeData.stats && homeData.stats.length > 0 && (
        <section className="py-15 bg-gradient-to-br from-blue-50 to-indigo-50 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold mb-4 text-blue-900 tracking-tight drop-shadow">
                {homeData.sectionHeaders?.stats?.title || ""}
              </h2>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                {homeData.sectionHeaders?.stats?.subtitle || ""}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {homeData.stats.map((stat: any, idx: number) => {
                const getIconForStat = (label: string | null | undefined) => {
                  if (!label) return FaStar; // Default icon
                  if (
                    label.toLowerCase().includes("cities") ||
                    label.toLowerCase().includes("city")
                  )
                    return FaMapMarkerAlt;
                  if (
                    label.toLowerCase().includes("support") ||
                    label.toLowerCase().includes("customer")
                  )
                    return FaHeadset;
                  if (
                    label.toLowerCase().includes("rating") ||
                    label.toLowerCase().includes("star")
                  )
                    return FaStar;
                  if (
                    label.toLowerCase().includes("properties") ||
                    label.toLowerCase().includes("verified")
                  )
                    return FaShieldAlt;
                  if (
                    label.toLowerCase().includes("users") ||
                    label.toLowerCase().includes("user")
                  )
                    return FaUsers;
                  return FaStar;
                };

                const IconComponent = getIconForStat(stat.label);

                return (
                  <div
                    key={idx}
                    className="bg-white p-8 rounded-3xl shadow-xl flex flex-col items-center justify-center border-t-4 border-blue-500 hover:scale-105 hover:shadow-2xl transition-all duration-300 group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    <div className="relative z-10 bg-blue-100 p-4 rounded-full mb-4 group-hover:bg-blue-200 transition-colors duration-300">
                      <IconComponent
                        size={32}
                        className="text-blue-600 group-hover:text-blue-700 transition-colors"
                      />
                    </div>

                    <div className="relative z-10 text-4xl font-extrabold text-blue-600 mb-3 group-hover:text-blue-700 transition-colors duration-300">
                      {stat.value ?? "N/A"}
                    </div>

                    <div className="relative z-10 text-lg font-semibold text-gray-700 text-center group-hover:text-gray-800 transition-colors duration-300">
                      {stat.label ?? "No label"}
                    </div>

                    <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500 opacity-10 rounded-full transform translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500"></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-indigo-500 opacity-10 rounded-full transform -translate-x-6 translate-y-6 group-hover:scale-125 transition-transform duration-500"></div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Featured PGs Section */}
      {homeData.featuredPGs && homeData.featuredPGs.length > 0 && (
        <section className="py-15 bg-gradient-to-br from-blue-50 to-indigo-50 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-extrabold mb-4 text-blue-900 tracking-tight drop-shadow">
                {homeData.sectionHeaders?.pgs?.title || ""}
              </h2>
              <p className="text-xl text-gray-700 max-w-2xl mx-auto">
                {homeData.sectionHeaders?.pgs?.subtitle || ""}
              </p>
            </div>

            <HorizontalCarousel
              autoScroll={true}
              scrollSpeed={100}
              showArrows={true}
            >
              {homeData.featuredPGs
                .slice(0, 20)
                .map((item: any, idx: number) => (
                  <div
                    key={`${item._id || idx}-${idx}`}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                  >
                    {/* Image + Badges */}
                    <div 
                      className="relative h-48 w-full cursor-pointer"
                      onClick={() => router.push("/pg")}
                    >
                      {/* Main Image */}
                      <img
                        src={item.images?.[0]?.url || item.images?.[0]}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          if (e.currentTarget.nextSibling) {
                            (
                              e.currentTarget.nextSibling as HTMLElement
                            ).style.display = "flex";
                          }
                        }}
                      />
                      {/* Fallback if image missing */}
                      <div
                        className={`w-full h-full flex-col items-center justify-center text-gray-400 ${
                          item.images && item.images.length > 0 ? "hidden" : "flex"
                        }`}
                      >
                        <FaBuilding size={32} className="mb-2" />
                        <span className="text-sm">No Image</span>
                      </div>

                      {/* PG Badge */}
                      <div className="absolute top-3 left-3">
                        {(() => {
                          let badgeText = "PG";
                          let badgeColor = "bg-blue-600";
                          if (
                            item.genderType === "male" ||
                            item.genderType === "boys"
                          ) {
                            badgeText = "Boys";
                            badgeColor = "bg-blue-600";
                          } else if (
                            item.genderType === "female" ||
                            item.genderType === "girls"
                          ) {
                            badgeText = "Girls";
                            badgeColor = "bg-pink-500";
                          } else if (
                            item.genderType === "co-living" ||
                            item.genderType === "coliving" ||
                            item.genderType === "unisex"
                          ) {
                            badgeText = "Co-living";
                            badgeColor = "bg-purple-600";
                          }
                          return (
                            <span
                              className={`${badgeColor} text-white text-xs px-3 py-1 rounded-full font-semibold shadow`}
                            >
                              {badgeText}
                            </span>
                          );
                        })()}
                      </div>
                      {item.originalPrice &&
                        item.originalPrice > item.price && (
                          <div className="absolute top-3 right-3">
                            {" "}
                            <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow">
                              {" "}
                              UP TO{" "}
                              {Math.round(
                                ((item.originalPrice - item.price) /
                                  item.originalPrice) *
                                  100
                              )}
                              % OFF{" "}
                            </div>{" "}
                          </div>
                        )}
                    </div>

                    {/* Info Section */}
                    <div className="px-4 py-4">
                      <div className="flex items-center justify-between">
                        {/* Name */}
                        <h3 className="text-[17px] font-bold text-blue-700 mb-1">
                          {item.name}
                        </h3>

                        {/* Rating - Updated with Full Stars */}
                        {/* Rating - Accurate with full, half, and empty stars */}
                        {(item.rating || item.rating?.overall) && (
                          <div className="bg-white px-3 py-1 rounded-full flex items-center gap-2 text-sm font-semibold shadow text-gray-800">
                            <div className="flex relative text-yellow-400">
                              {[1, 2, 3, 4, 5].map((star) => {
                                const rating =
                                  typeof item.rating === "object"
                                    ? item.rating.overall
                                    : item.rating;

                                if (star <= Math.floor(rating)) {
                                  // Full star
                                  return (
                                    <FaStar key={star} className="text-xs" />
                                  );
                                } else if (star - 1 < rating && star > rating) {
                                  // Half star
                                  const percent =
                                    (rating - Math.floor(rating)) * 100;
                                  return (
                                    <div
                                      key={star}
                                      className="relative text-xs w-3.5"
                                    >
                                      <FaStar className="text-gray-300" />
                                      <FaStar
                                        className="text-yellow-400 absolute top-0 left-0"
                                        style={{
                                          clipPath: `inset(0 ${
                                            100 - percent
                                          }% 0 0)`,
                                        }}
                                      />
                                    </div>
                                  );
                                } else {
                                  // Empty star
                                  return (
                                    <FaStar
                                      key={star}
                                      className="text-xs text-gray-300"
                                    />
                                  );
                                }
                              })}
                            </div>
                            <span>
                              {(typeof item.rating === "object"
                                ? item.rating.overall
                                : item.rating
                              ).toFixed(1)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Location */}
                      <div className="flex items-center text-sm text-gray-600 mb-3">
                        <FaMapMarkerAlt className="text-gray-500 mr-1" />
                        {item.city}, {item.state}
                      </div>

                      {/* Price + Button */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="text-green-600 font-bold text-lg">
                          ₹{item.price.toLocaleString()}
                          <span className="text-sm font-normal text-gray-500 ml-1">
                            /month
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Navigate to specific PG detail page
                            router.push(`/pg/${item._id || item.id || 'details'}`);
                          }}
                          className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-blue-700 transition-all duration-300 hover:scale-105 active:scale-95"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </HorizontalCarousel>
          </div>
        </section>
      )}

      {/* Featured Rooms & Flats Section */}
      {homeData.featuredRooms && homeData.featuredRooms.length > 0 && (
        <section className="py-15 bg-gradient-to-br from-purple-50 to-pink-50 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-extrabold mb-4 text-purple-900 tracking-tight drop-shadow">
                {homeData.sectionHeaders?.rooms?.title || ""}
              </h2>
              <p className="text-xl text-gray-700 max-w-2xl mx-auto">
                {homeData.sectionHeaders?.rooms?.subtitle || ""}
              </p>
            </div>

            <HorizontalCarousel
              autoScroll={true}
              scrollSpeed={45}
              showArrows={true}
            >
              {homeData.featuredRooms
                .slice(0, 20)
                .map((item: any, idx: number) => (
                  <div
                    key={`${item._id || idx}-${idx}`}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 group overflow-hidden"
                  >
                    <div className="relative">
                      {/* Card Image */}
                      <div 
                        className="relative h-48 w-full cursor-pointer"
                        onClick={() => router.push("/rooms")}
                      >
                        {item.images && item.images.length > 0 ? (
                          <img
                            src={item.images[0].url || item.images[0]}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.classList.add('hidden');
                              if (e.currentTarget.nextSibling) {
                                (e.currentTarget.nextSibling as HTMLElement).classList.remove('hidden');
                                (e.currentTarget.nextSibling as HTMLElement).classList.add('flex');
                              }
                            }}
                          />
                        ) : null}
                        <div
                          className={`w-full h-full items-center justify-center text-gray-400 ${
                            item.images && item.images.length > 0 ? "hidden" : "flex"
                          }`}
                        >
                          <FaHotel size={32} className="mb-2" />
                          <span className="text-sm">No Image</span>
                        </div>

                        {/* Room Type Badge */}
                        <div className="absolute top-3 left-3">
                          <span className="bg-purple-600 text-white text-xs px-3 py-1 rounded-full font-semibold shadow">
                            {item.propertyType || item.type || "Room"}
                          </span>
                        </div>

                        {/* Discount Badge */}
                        {item.pricing?.originalPrice &&
                          item.pricing.originalPrice > (item.pricing?.rent || item.price) && (
                            <div className="absolute top-3 right-3">
                              <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow">
                                UP TO{" "}
                                {Math.round(
                                  ((item.pricing.originalPrice - (item.pricing?.rent || item.price)) /
                                    item.pricing.originalPrice) * 100
                                )}
                                % OFF
                              </div>
                            </div>
                          )}


                      </div>

                      {/* Content */}
                      <div className="p-4">
                        {/* Title */}
                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                          {item.title || item.name}
                        </h3>

                        {/* Location */}
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                          <div className="flex items-center">
                            <FaMapMarkerAlt className="text-gray-500 mr-1" />
                            {item.location || `${item.city}, ${item.state}`}
                          </div>

                          {/* Rating */}
                          {(item.rating || item.rating?.overall) && (
                            <div className="bg-white px-3 py-1 rounded-full flex items-center gap-2 text-sm font-semibold shadow text-gray-800">
                              <div className="flex relative text-yellow-400">
                                {[1, 2, 3, 4, 5].map((star) => {
                                  const rating =
                                    typeof item.rating === "object"
                                      ? item.rating.overall
                                      : item.rating;

                                  if (star <= Math.floor(rating)) {
                                    // Full star
                                    return (
                                      <FaStar key={star} className="text-xs" />
                                    );
                                  } else if (star - 1 < rating && star > rating) {
                                    // Half star
                                    const percent =
                                      (rating - Math.floor(rating)) * 100;
                                    return (
                                      <div
                                        key={star}
                                        className="relative text-xs w-3.5"
                                      >
                                        <FaStar className="text-gray-300" />
                                        <FaStar
                                          className="text-yellow-400 absolute top-0 left-0"
                                          style={{
                                            clipPath: `inset(0 ${
                                              100 - percent
                                            }% 0 0)`,
                                          }}
                                        />
                                      </div>
                                    );
                                  } else {
                                    // Empty star
                                    return (
                                      <FaStar
                                        key={star}
                                        className="text-xs text-gray-300"
                                      />
                                    );
                                  }
                                })}
                              </div>
                              <span>
                                {(typeof item.rating === "object"
                                  ? item.rating.overall
                                  : item.rating
                                ).toFixed(1)}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Price + Button */}
                        <div className="flex items-center justify-between mt-4">
                          <div className="text-green-600 font-bold text-lg">
                            ₹{(item.pricing?.rent || item.pricing?.monthlyRent || item.price).toLocaleString()}
                            <span className="text-sm font-normal text-gray-500 ml-1">
                              /month
                            </span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/rooms/${item._id || item.id || 'details'}`);
                            }}
                            className="bg-purple-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-purple-700 transition-all duration-300 hover:scale-105 active:scale-95"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </HorizontalCarousel>
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      {homeData.testimonials && homeData.testimonials.length > 0 && (
        <section className="py-15 bg-gradient-to-br from-green-50 to-teal-50 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-extrabold mb-4 text-green-900 tracking-tight drop-shadow">
                {homeData.sectionHeaders?.testimonials?.title || ""}
              </h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                {homeData.sectionHeaders?.testimonials?.subtitle || ""}
              </p>
            </div>

            <HorizontalCarousel
              autoScroll={true}
              scrollSpeed={45}
              showArrows={true}
            >
              {homeData.testimonials.map((review: any, idx: number) => (
                <div
                  key={idx}
                  className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="flex flex-col items-center text-center">
                    {review.avatar ? (
                      <img
                        src={review.avatar}
                        alt={review.name}
                        className="w-16 h-16 rounded-full mb-4 object-cover shadow-md"
                      />
                    ) : (
                      <span className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold text-xl mb-4 shadow-md">
                        {review.name
                          ? review.name.charAt(0).toUpperCase()
                          : "U"}
                      </span>
                    )}
                    <h3 className="text-xl font-semibold text-blue-700 mb-1">
                      {review.name || "Anonymous"}
                    </h3>
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={
                            i < (review.rating ?? 0)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }
                        >
                          ★
                        </span>
                      ))}
                      <span className="ml-2 text-gray-600 font-medium">
                        {review.rating ?? "N/A"}
                      </span>
                    </div>
                    <p className="text-gray-700 text-center italic">
                      "{review.review || review.text || "No review provided."}"
                    </p>
                  </div>
                </div>
              ))}
            </HorizontalCarousel>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 to-cyan-50 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold mb-4 text-indigo-900 tracking-tight drop-shadow">
              {homeData.sectionHeaders?.features?.title ||
                homeData.features?.title ||
                "Why Choose Our Platform"}
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              {homeData.sectionHeaders?.features?.subtitle ||
                homeData.features?.subtitle ||
                "Experience the best in PG accommodations and bike rentals with our comprehensive platform"}
            </p>
          </div>

          {(() => {
            const features =
              homeData.features?.items && Array.isArray(homeData.features.items)
                ? homeData.features.items
                : [];

            // Responsive scrolling logic for Features - Show all 6 cards on desktop
            const getFeaturesScrollThreshold = () => {
              if (screenSize === "mobile") return 1; // Mobile: >1 card = scroll
              if (screenSize === "tablet") return 2; // Tablet: >2 cards = scroll
              return 6; // Desktop: >6 cards = scroll (show all 6)
            };

            const shouldScrollFeatures =
              features.length > getFeaturesScrollThreshold();

            const iconMap: { [key: string]: any } = {
              home: FaHome,
              bed: FaBed,
              "credit-card": FaCreditCard,
              star: FaStar,
              lock: FaLock,
              mobile: FaMobileAlt,
              building: FaBuilding,
              hotel: FaHotel,
              key: FaKey,
              wifi: FaWifi,
              car: FaCar,
            };

            const FeatureCard = ({
              feature,
              idx,
            }: {
              feature: any;
              idx: number;
            }) => {
              const IconComponent = iconMap[feature.icon] || FaStar;

              // Color mapping based on database color field - matching old frontend exactly
              const colorMap: {
                [key: string]: {
                  border: string;
                  bg: string;
                  bgHover: string;
                  text: string;
                  title: string;
                };
              } = {
                blue: {
                  border: "border-blue-500",
                  bg: "bg-blue-100",
                  bgHover: "group-hover:bg-blue-200",
                  text: "text-blue-600",
                  title: "text-blue-900",
                },
                purple: {
                  border: "border-purple-500",
                  bg: "bg-purple-100",
                  bgHover: "group-hover:bg-purple-200",
                  text: "text-purple-600",
                  title: "text-purple-900",
                },
                green: {
                  border: "border-green-500",
                  bg: "bg-green-100",
                  bgHover: "group-hover:bg-green-200",
                  text: "text-green-600",
                  title: "text-green-900",
                },
                orange: {
                  border: "border-orange-500",
                  bg: "bg-orange-100",
                  bgHover: "group-hover:bg-orange-200",
                  text: "text-orange-600",
                  title: "text-orange-900",
                },
                pink: {
                  border: "border-pink-500",
                  bg: "bg-pink-100",
                  bgHover: "group-hover:bg-pink-200",
                  text: "text-pink-600",
                  title: "text-pink-900",
                },
                cyan: {
                  border: "border-cyan-500",
                  bg: "bg-cyan-100",
                  bgHover: "group-hover:bg-cyan-200",
                  text: "text-cyan-600",
                  title: "text-cyan-900",
                },
              };

              const colors = colorMap[feature.color] || colorMap["blue"]; // fallback to blue

              return (
                <div
                  key={idx}
                  className={`bg-white p-8 rounded-3xl shadow-xl flex flex-col items-center text-center border-t-4 ${colors.border} hover:scale-105 transition-transform duration-300 group`}
                >
                  <div
                    className={`${colors.bg} p-4 rounded-full mb-6 ${colors.bgHover} transition`}
                  >
                    <IconComponent size={40} className={colors.text} />
                  </div>
                  <h3 className={`text-2xl font-bold mb-4 ${colors.title}`}>
                    {feature.title || "Feature"}
                  </h3>
                  <p className="text-gray-600 text-base leading-relaxed">
                    {feature.description || "Feature description"}
                  </p>
                </div>
              );
            };

            if (shouldScrollFeatures) {
              return (
                <div className="horizontal-carousel">
                  <div className="carousel-track">
                    {features.map((feature: any, idx: number) => (
                      <div key={idx} className="carousel-slide">
                        <FeatureCard feature={feature} idx={idx} />
                      </div>
                    ))}
                  </div>
                </div>
              );
            } else {
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-8">
                  {features.map((feature: any, idx: number) => (
                    <FeatureCard key={idx} feature={feature} idx={idx} />
                  ))}
                </div>
              );
            }
          })()}
        </div>
      </section>

      {/* City Select Modal */}
      <CitySelectModal
        isOpen={showCityModal}
        onClose={handleModalClose}
        onCitySelect={handleCitySelect}
        cities={cities}
        currentCity={selectedCity}
      />
    </div>
  );
};

export default HomeClient;
