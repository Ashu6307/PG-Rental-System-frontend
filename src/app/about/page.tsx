
"use client";
import React, { useState, useEffect } from "react";
import { FaStar, FaHeart } from "react-icons/fa";

const API_URL = process.env.NEXT_PUBLIC_ABOUT_API || "http://localhost:5000/api/content/about";

const defaultContent = {
  hero: { title: "About StayWheels", subtitle: "Our Story", description: ["Loading..."] },
  whyChooseUs: [],
  mission: {},
  vision: {},
  values: [],
  team: []
};

const About: React.FC = () => {
  const [aboutContent, setAboutContent] = useState<any>(defaultContent);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  // Helper function to get avatar gradient class
  const getAvatarGradientClass = (name: string) => {
    const charCode = name?.charCodeAt(0) || 65;
    const gradientVariants = [
      'bg-gradient-to-br from-blue-500 to-purple-600',
      'bg-gradient-to-br from-blue-600 to-purple-700', 
      'bg-gradient-to-br from-blue-400 to-purple-500',
      'bg-gradient-to-br from-blue-700 to-purple-800',
      'bg-gradient-to-br from-blue-500 to-indigo-600'
    ];
    return gradientVariants[charCode % gradientVariants.length];
  };

  // Set page title
  useEffect(() => {
    document.title = 'About Us | PG & Room Rental';
  }, []);
  const [error, setError] = useState("");
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const values = aboutContent.values || [];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setScreenSize('mobile');
      } else if (window.innerWidth < 1024) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setLoading(true);
    setError("");
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        // Support both database content and demo data formats
        setAboutContent(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Unable to load about page content.");
        setLoading(false);
      });
  }, []);

  // Hero Section
  const Hero = () => (
    <section className="bg-gradient-to-r from-blue-700 to-purple-700 text-white py-16 text-center">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg">{aboutContent?.hero?.title}</h1>
        <p className="text-2xl max-w-2xl mx-auto text-white/90">
          {aboutContent?.hero?.description?.[0] || "Your trusted partner for quality accommodation and reliable transportation solutions"}
        </p>
      </div>
    </section>
  );

  // Story & Why Choose Us
  const StoryWhy = () => (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50 relative overflow-hidden">
      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Story */}
        <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-10 rounded-3xl shadow-2xl flex flex-col items-center h-full min-h-[420px] justify-center w-full">
          <h2 className="text-3xl font-extrabold mb-6 text-center text-blue-900 tracking-tight">{aboutContent?.hero?.subtitle}</h2>
          <div className="space-y-4 text-lg w-full">
            {(aboutContent?.hero?.description || []).map((paragraph: string, index: number) => (
              <p key={index} className="text-gray-700 leading-relaxed text-center">{paragraph}</p>
            ))}
          </div>
        </div>
        {/* Why Choose Us */}
        <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-10 rounded-3xl shadow-2xl flex flex-col items-center h-full min-h-[420px] justify-center w-full">
          <h3 className="text-3xl font-extrabold mb-6 text-center text-blue-900 tracking-tight">Why Choose Us?</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            {(aboutContent?.whyChooseUs || []).map((item: any, index: number) => (
              <div key={index} className="flex flex-col items-center gap-2 bg-white rounded-xl p-6 shadow hover:shadow-lg transition group hover:scale-105 border-t-4 border-blue-400">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 mb-2 text-3xl text-blue-600 group-hover:bg-blue-200 transition">{item?.icon || "✅"}</div>
                <span className="font-semibold text-blue-900 text-lg mb-1">{item?.title || "Feature"}</span>
                <p className="text-sm text-gray-600 text-left w-full">{item?.description || "Description"}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );

  // Mission & Vision
  const MissionVision = () => (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50 relative overflow-hidden">
      <div className="container mx-auto px-4 flex flex-col md:flex-row gap-12 items-center justify-center">
        {/* Mission Card */}
        <div className="flex-1 bg-white p-10 rounded-3xl shadow-xl flex flex-col items-center text-center border-t-4 border-blue-500 hover:scale-105 transition-transform duration-300 group">
          <div className="bg-blue-100 p-4 rounded-full mb-4 text-4xl">🎯</div>
          <h3 className="text-3xl font-extrabold mb-2 text-blue-900 tracking-tight drop-shadow">{aboutContent?.mission?.title || "Our Mission"}</h3>
          <div className="h-1 w-12 bg-blue-500 rounded-full mb-4 mx-auto"></div>
          <p className="text-gray-700 text-lg font-medium mb-2">
            {aboutContent?.mission?.subtitle || ""}
          </p>
          <p className="text-gray-600 text-base">{aboutContent?.mission?.description || "To provide excellent service and value to our customers."}</p>
        </div>
        {/* Divider */}
        <div className="hidden md:block w-1 h-56 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full mx-8"></div>
        {/* Vision Card */}
        <div className="flex-1 bg-white p-10 rounded-3xl shadow-xl flex flex-col items-center text-center border-t-4 border-purple-500 hover:scale-105 transition-transform duration-300 group">
          <div className="bg-purple-100 p-4 rounded-full mb-4 text-4xl">🚀</div>
          <h3 className="text-3xl font-extrabold mb-2 text-purple-900 tracking-tight drop-shadow">{aboutContent?.vision?.title || "Our Vision"}</h3>
          <div className="h-1 w-12 bg-purple-500 rounded-full mb-4 mx-auto"></div>
          <p className="text-gray-700 text-lg font-medium mb-2">
            {aboutContent?.vision?.subtitle || ""}
          </p>
          <p className="text-gray-600 text-base">{aboutContent?.vision?.description || "To become the leading provider in our industry."}</p>
        </div>
      </div>
    </section>
  );

  // Values Section
  const Values = () => {
    const filteredValues = values.filter((value: any) => selectedCategory === "all" || value.category === selectedCategory);
    
    // Responsive scrolling logic for Values
    const getValuesScrollThreshold = () => {
      if (screenSize === 'mobile') return 1;   // Mobile: >1 card = scroll
      if (screenSize === 'tablet') return 2;   // Tablet: >2 cards = scroll  
      return 4;                                // Desktop: >4 cards = scroll
    };
    
    const shouldScrollValues = filteredValues.length > getValuesScrollThreshold();
    
    return (
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50 overflow-hidden">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-extrabold text-center mb-8 text-blue-900 tracking-tight drop-shadow">Our Values</h2>
          <div className="flex justify-center mb-8">
            <div className="flex flex-wrap gap-2 bg-gray-100 p-2 rounded-lg">
              {["all", "core", "service", "business", "social"].map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    selectedCategory === category
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {category === "all" ? "All" : category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
          {shouldScrollValues ? (
            <div className="horizontal-carousel">
              <div className="carousel-track">
                {filteredValues.map((value: any, index: number) => (
                  <div key={index} className="carousel-slide">
                    <div className="bg-white p-6 rounded-3xl shadow-xl flex flex-col items-center text-center border-t-4 border-blue-500 hover:scale-105 transition-transform duration-300 group h-full">
                      <div 
                        className="w-14 h-14 flex items-center justify-center rounded-full mb-4 text-3xl bg-blue-100 text-blue-800"
                        {...(value.color?.background && {
                          style: { 
                            backgroundColor: value.color.background, 
                            color: value.color.text || "#1E3A8A" 
                          }
                        })}
                      >
                        {value.icon}
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-blue-900">{value.title}</h3>
                      <span className="text-xs text-gray-500 capitalize mb-2">{value.category}</span>
                      <p className="text-gray-600 text-base mb-4 w-full text-left line-clamp-2">{value.description}</p>
                      {value.benefits && value.benefits.length > 0 && (
                        <ul className="text-xs text-gray-600 space-y-1 mb-2 text-left w-full pl-4">
                          {value.benefits.slice(0, 3).map((benefit: string, i: number) => (
                            <li key={i} className="flex items-center">
                              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      )}
                      {value.metrics && (
                        <div className="flex items-center justify-center gap-4 pt-2 mt-auto">
                          <span className="flex items-center text-yellow-500"><FaStar className="mr-1 text-xs" />{value.metrics.satisfactionRate}%</span>
                          <span className="flex items-center text-purple-600"><FaHeart className="mr-1 text-xs" />{value.metrics.impactScore}/10</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredValues.map((value: any, index: number) => (
                <div key={index} className="bg-white p-8 rounded-3xl shadow-xl flex flex-col items-center text-center border-t-4 border-blue-500 hover:scale-105 transition-transform duration-300 group">
                  <div 
                    className="w-14 h-14 flex items-center justify-center rounded-full mb-4 text-3xl bg-blue-100 text-blue-800"
                    {...(value.color?.background && {
                      style: { 
                        backgroundColor: value.color.background, 
                        color: value.color.text || "#1E3A8A" 
                      }
                    })}
                  >
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-blue-900">{value.title}</h3>
                  <span className="text-xs text-gray-500 capitalize mb-2">{value.category}</span>
                  <p className="text-gray-600 text-base mb-4 w-full text-left">{value.description}</p>
                  {value.benefits && value.benefits.length > 0 && (
                    <ul className="text-xs text-gray-600 space-y-1 mb-2 text-left w-full pl-4">
                      {value.benefits.map((benefit: string, i: number) => (
                        <li key={i} className="flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  )}
                  {value.metrics && (
                    <div className="flex items-center justify-center gap-4 pt-2">
                      <span className="flex items-center text-yellow-500"><FaStar className="mr-1 text-xs" />{value.metrics.satisfactionRate}%</span>
                      <span className="flex items-center text-purple-600"><FaHeart className="mr-1 text-xs" />Impact: {value.metrics.impactScore}/10</span>
                    </div>
                  )}
                  {value.tags && value.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1 justify-center">
                      {value.tags.map((tag: string, i: number) => (
                        <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">#{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  };

  // Team Section
  const Team = () => {
    const teamMembers = aboutContent?.team || [];
    
    // Responsive scrolling logic
    const getScrollThreshold = () => {
      if (screenSize === 'mobile') return 1;   // Mobile: >1 card = scroll
      if (screenSize === 'tablet') return 2;   // Tablet: >2 cards = scroll  
      return 4;                                // Desktop: >4 cards = scroll
    };
    
    const shouldScroll = teamMembers.length > getScrollThreshold();
    
    return (
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50 overflow-hidden">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-extrabold text-center mb-8 text-blue-900 tracking-tight drop-shadow">Our Team</h2>
          {shouldScroll ? (
            <div className="horizontal-carousel">
              <div className="carousel-track">
                {teamMembers.map((member: any, index: number) => (
                  <div key={index} className="carousel-slide">
                    <div className="bg-white p-6 rounded-3xl shadow-xl flex flex-col items-center text-center border-t-4 border-blue-500 hover:scale-105 transition-transform duration-300 group h-full">
                      {member?.avatar && member?.avatar.startsWith("http") ? (
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-20 h-20 mb-4 rounded-full object-cover border-2 border-blue-500 bg-transparent"
                        />
                      ) : (
                        <div
                          className={`w-20 h-20 mb-4 rounded-full flex items-center justify-center font-bold text-white text-4xl tracking-wide border-2 border-blue-500 select-none shadow-lg ${getAvatarGradientClass(member?.name || '')}`}
                        >
                          {member?.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                      )}
                      <h3 className="text-xl font-bold mb-1 text-blue-900">{member?.name || "Team Member"}</h3>
                      <p className="text-blue-600 font-medium mb-2">{member?.position || "Position"}</p>
                      <p className="text-sm text-gray-500 mb-4 line-clamp-2">{member?.bio || "Bio information"}</p>
                      {member?.social && (
                        <div className="flex justify-center space-x-4 mt-auto">
                          {member.social.linkedin && (
                            <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm">LinkedIn</a>
                          )}
                          {member.social.email && (
                            <a href={`mailto:${member.social.email}`} className="text-gray-600 hover:text-gray-800 text-sm">Email</a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {teamMembers.map((member: any, index: number) => (
                <div key={index} className="bg-white p-6 rounded-3xl shadow-xl flex flex-col items-center text-center border-t-4 border-blue-500 hover:scale-105 transition-transform duration-300 group h-full">
                  {member?.avatar && member?.avatar.startsWith("http") ? (
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-20 h-20 mb-4 rounded-full object-cover border-2 border-blue-500 bg-transparent"
                    />
                  ) : (
                    <div
                      className={`w-20 h-20 mb-4 rounded-full flex items-center justify-center font-bold text-white text-4xl tracking-wide border-2 border-blue-500 select-none shadow-lg ${getAvatarGradientClass(member?.name || '')}`}
                    >
                      {member?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                  )}
                  <h3 className="text-xl font-bold mb-1 text-blue-900">{member?.name || "Team Member"}</h3>
                  <p className="text-blue-600 font-medium mb-2">{member?.position || "Position"}</p>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">{member?.bio || "Bio information"}</p>
                  {member?.social && (
                    <div className="flex justify-center space-x-4 mt-auto">
                      {member.social.linkedin && (
                        <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm">LinkedIn</a>
                      )}
                      {member.social.email && (
                        <a href={`mailto:${member.social.email}`} className="text-gray-600 hover:text-gray-800 text-sm">Email</a>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-2xl text-blue-600 font-bold animate-pulse">Loading About Page...</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-red-500 font-semibold">{error}</div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50">
      {Hero()}
      {StoryWhy()}
      {MissionVision()}
      {Values()}
      {Team()}
    </div>
  );
};

export default About;
