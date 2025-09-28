"use client";
import React, { useState, useEffect } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaPaperPlane, FaWhatsapp, FaBuilding } from 'react-icons/fa';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', subject: '', message: '',
    inquiryType: 'general', priority: 'medium', attachments: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [content, setContent] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  // Form validation states
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [mobileError, setMobileError] = useState('');

  // Set page title
  useEffect(() => {
    document.title = 'Contact Us | PG & Room Rental';
  }, []);

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
    const fetchContactContent = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5000/api/content/contact?for=public');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setContent(data || {});
        setError('');
      } catch (error) {
        setError('Unable to load contact page content.');
        console.error('Contact API error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContactContent();
  }, []);

  const validateName = (name: string) => {
    if (!name.trim()) return 'Name is required';
    if (name.length < 2) return 'Name must be at least 2 characters';
    if (name.length > 30) return 'Name must not exceed 30 characters';
    if (!/^[a-zA-Z\s]+$/.test(name)) return 'Name can only contain letters and spaces';
    return '';
  };

  const validateEmail = (email: string) => {
    if (!email.trim()) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const validateMobile = (phone: string) => {
    if (!phone.trim()) return 'Phone number is required';
    if (!/^[6-9]\d{9}$/.test(phone)) return 'Please enter a valid 10-digit mobile number';
    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      const phoneValue = value.replace(/[^0-9]/g, '');
      setFormData({ ...formData, phone: phoneValue });
      setMobileError(validateMobile(phoneValue));
    } else if (name === 'name') {
      setFormData({ ...formData, name: value });
      setNameError(validateName(value));
    } else if (name === 'email') {
      setFormData({ ...formData, email: value });
      setEmailError(validateEmail(value));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setFormData({ ...formData, attachments: Array.from(files) as any });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const nameErr = validateName(formData.name);
    const emailErr = validateEmail(formData.email);
    const mobileErr = validateMobile(formData.phone);
    
    setNameError(nameErr);
    setEmailError(emailErr);
    setMobileError(mobileErr);

    if (nameErr || emailErr || mobileErr || !formData.subject.trim() || !formData.message.trim()) {
      setSubmitMessage('error: Please fill all required fields correctly.');
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'attachments' && Array.isArray(value) && value.length > 0) {
          value.forEach(file => data.append('attachments', file));
        } else if (key !== 'attachments') {
          data.append(key, value as string);
        }
      });

      const response = await fetch('http://localhost:5000/api/contacts', {
        method: 'POST',
        body: data,
      });

      const result = await response.json();

      if (result.success || response.ok) {
        setSubmitMessage('Thank you for your message! We will get back to you soon.');
        setFormData({
          name: '', email: '', phone: '', subject: '', message: '',
          inquiryType: 'general', priority: 'medium', attachments: []
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setSubmitMessage('error: Something went wrong. Please try again.');
      }
    } catch (error) {
      setSubmitMessage('error: Error sending message. Please try again.');
      console.error('Contact form error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const offices = Array.isArray(content?.offices) ? content.offices : [];
  const faq = Array.isArray(content?.faq) ? content.faq : [];
  const contactInfo = content?.contactInfo || {};

  // Responsive scrolling logic for Offices
  const getOfficesScrollThreshold = () => {
    if (screenSize === 'mobile') return 1;   // Mobile: >1 office = scroll
    if (screenSize === 'tablet') return 2;   // Tablet: >2 offices = scroll  
    return 3;                                // Desktop: >3 offices = scroll
  };

  const shouldScrollOffices = offices.length > getOfficesScrollThreshold();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-blue-600 text-xl">Loading contact page...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">{content?.hero?.title || 'Contact Us'}</h1>
          <p className="text-xl max-w-2xl mx-auto">{content?.hero?.description?.[0] || 'Get in touch with us for any queries or support'}</p>
        </div>
      </section>

      {/* Contact Form + Info Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-gradient-to-br from-white via-blue-100 to-purple-100 p-6 rounded-2xl shadow-2xl border border-blue-100 w-full max-w-xl mx-auto">
            <h2 className="text-2xl font-extrabold mb-4 text-blue-700 tracking-tight drop-shadow">
              {content?.hero?.subtitle || 'Get in Touch'}
            </h2>
            
            {submitMessage && (
              <div className={`mb-6 p-4 rounded-lg shadow ${submitMessage.includes('error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {submitMessage.replace('error:', '')}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="name" className="block text-gray-700 text-base font-semibold mb-2">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    maxLength={30}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition disabled:bg-gray-100 shadow-sm text-sm"
                    placeholder="Your full name"
                  />
                  {nameError && <p className="text-red-500 text-xs mt-1">{nameError}</p>}
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-gray-700 text-base font-semibold mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    maxLength={10}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition disabled:bg-gray-100 shadow-sm text-sm"
                    placeholder="10-digit mobile number"
                  />
                  {mobileError && <p className="text-red-500 text-xs mt-1">{mobileError}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-gray-700 text-base font-semibold mb-2">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition disabled:bg-gray-100 shadow-sm text-sm"
                  placeholder="Your email address"
                />
                {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="inquiryType" className="block text-gray-700 text-base font-semibold mb-2">Inquiry Type *</label>
                  <select 
                    id="inquiryType" 
                    name="inquiryType" 
                    value={formData.inquiryType} 
                    onChange={handleChange} 
                    required 
                    disabled={isSubmitting} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition disabled:bg-gray-100 shadow-sm bg-white text-sm"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="room_rental">Room & Flat Rental</option>
                    <option value="pg_accommodation">PG Accommodation</option>
                    <option value="support">Technical Support</option>
                    <option value="complaint">Complaint</option>
                    <option value="partnership">Partnership</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="priority" className="block text-gray-700 text-base font-semibold mb-2">Priority *</label>
                  <select 
                    id="priority" 
                    name="priority" 
                    value={formData.priority} 
                    onChange={handleChange} 
                    required 
                    disabled={isSubmitting} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition disabled:bg-gray-100 shadow-sm bg-white text-sm"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="attachments" className="block text-gray-700 text-base font-semibold mb-2">Attachments</label>
                <input 
                  type="file" 
                  id="attachments" 
                  name="attachments" 
                  multiple 
                  onChange={handleFileChange} 
                  disabled={isSubmitting} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition disabled:bg-gray-100 shadow-sm bg-white text-sm" 
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-gray-700 text-base font-semibold mb-2">Subject *</label>
                <input 
                  type="text" 
                  id="subject" 
                  name="subject" 
                  value={formData.subject} 
                  onChange={handleChange} 
                  required 
                  disabled={isSubmitting} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition disabled:bg-gray-100 shadow-sm text-sm" 
                  placeholder="Message subject" 
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-gray-700 text-base font-semibold mb-2">Message *</label>
                <textarea 
                  id="message" 
                  name="message" 
                  value={formData.message} 
                  onChange={handleChange} 
                  required 
                  disabled={isSubmitting} 
                  rows={5} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition disabled:bg-gray-100 shadow-sm text-sm" 
                  placeholder="Your message here..." 
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting} 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-xl font-bold text-base shadow-lg hover:from-blue-700 hover:to-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-300 flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="mr-2" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Info Card */}
          <div className="bg-gradient-to-br from-white via-blue-100 to-purple-100 p-6 rounded-2xl shadow-2xl border border-blue-100 max-w-xl mx-auto">
            <h2 className="text-2xl font-extrabold mb-4 text-blue-700 tracking-tight drop-shadow">Contact Information</h2>
            <div className="flex flex-col gap-8 w-full items-start">
              {contactInfo.address && (
                <div className="flex flex-col w-full">
                  <span className="flex items-center gap-2 text-xs font-semibold text-blue-500 mb-1">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100">
                      <FaMapMarkerAlt className="text-blue-600 text-lg" />
                    </span>
                    Address
                  </span>
                  <div className="ml-8 text-blue-700 text-lg font-medium">
                    {contactInfo.address.street}, {contactInfo.address.city}, {contactInfo.address.state} {contactInfo.address.pincode}
                  </div>
                </div>
              )}
              
              {contactInfo.phone && (
                <div className="flex flex-col w-full">
                  <span className="flex items-center gap-2 text-xs font-semibold text-blue-500 mb-1">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100">
                      <FaPhone className="text-blue-600 text-lg" />
                    </span>
                    Contact Number
                  </span>
                  <div className="ml-8 text-blue-700 text-lg font-medium">
                    {typeof contactInfo.phone === 'object' ? contactInfo.phone.primary : contactInfo.phone}
                  </div>
                </div>
              )}
              
              {contactInfo.email && (
                <div className="flex flex-col w-full">
                  <span className="flex items-center gap-2 text-xs font-semibold text-blue-500 mb-1">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100">
                      <FaEnvelope className="text-blue-600 text-lg" />
                    </span>
                    Email
                  </span>
                  <div className="ml-8 text-blue-700 text-lg font-medium">
                    {contactInfo.email}
                  </div>
                </div>
              )}
              
              {contactInfo.whatsapp && (
                <div className="flex flex-col w-full">
                  <span className="flex items-center gap-2 text-xs font-semibold text-green-500 mb-1">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100">
                      <FaWhatsapp className="text-green-600 text-lg" />
                    </span>
                    WhatsApp Number
                  </span>
                  <div className="ml-8 text-green-700 text-lg font-medium">
                    {contactInfo.whatsapp}
                  </div>
                </div>
              )}
              
              {contactInfo.workingHours && (
                <div className="flex flex-col w-full">
                  <span className="flex items-center gap-2 text-xs font-semibold text-purple-500 mb-1">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-purple-100">
                      <FaClock className="text-purple-600 text-lg" />
                    </span>
                    Working Hours
                  </span>
                  <div className="ml-8 text-purple-700 text-lg font-medium">
                    {contactInfo.workingHours.start} - {contactInfo.workingHours.end}
                  </div>
                </div>
              )}
              
              {contactInfo.additional && (
                <div className="flex flex-col w-full">
                  <span className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-1">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100">
                      <FaEnvelope className="text-gray-600 text-lg" />
                    </span>
                    Note
                  </span>
                  <div className="ml-8 text-gray-700 text-base font-medium mt-2">
                    {contactInfo.additional}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Offices Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50 overflow-hidden">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-extrabold text-center mb-8 text-blue-900 tracking-tight drop-shadow">Our Offices</h2>
          {shouldScrollOffices ? (
            <div className="horizontal-carousel">
              <div className="carousel-track">
                {offices.map((office: any, idx: number) => (
                  <div key={idx} className="carousel-slide">
                    <div className="bg-white p-8 rounded-3xl shadow-xl flex flex-col items-center text-center border-t-4 border-blue-500 hover:scale-105 transition-transform duration-300 group h-full">
                      <div className="w-14 h-14 flex items-center justify-center rounded-full mb-4 text-3xl bg-blue-100 text-blue-600">
                        <FaBuilding />
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-blue-900">
                        {office.name || office.city || office.address?.city}
                      </h3>
                      <p className="text-gray-600 text-base mb-2 line-clamp-2">
                        {office.address?.street || ''}{office.address?.city ? `, ${office.address.city}` : ''}{office.address?.state ? `, ${office.address.state}` : ''}{office.address?.pincode ? ` - ${office.address.pincode}` : ''}
                      </p>
                      {office.contact?.phone && (
                        <p className="text-gray-700 mb-2">
                          <FaPhone className="inline mr-2" />
                          {typeof office.contact.phone === "object"
                            ? office.contact.phone.primary || office.contact.phone.whatsapp
                            : office.contact.phone}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2 justify-center mb-2">
                        {office.services && Object.entries(office.services).slice(0, 3).map(([service, enabled]) =>
                          enabled ? (
                            <span
                              key={service}
                              className={`px-2 py-1 text-xs rounded-full ${
                                service === "pgRentals"
                                  ? "bg-blue-100 text-blue-800"
                                  : service === "roomRentals"
                                  ? "bg-green-100 text-green-800"
                                  : service === "maintenance"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : service === "insurance"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {service.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                            </span>
                          ) : null
                        )}
                      </div>
                      {office.workingHours && (
                        <div className="text-sm text-gray-600 mt-auto">
                          <strong>Working Hours:</strong> {office.workingHours.start} - {office.workingHours.end}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {offices.length === 0 ? (
                <div className="text-center py-12 col-span-3">
                  <p className="text-gray-600">No offices found. Please check back later.</p>
                </div>
              ) : (
                offices.map((office: any, idx: number) => (
                  <div key={idx} className="bg-white p-8 rounded-3xl shadow-xl flex flex-col items-center text-center border-t-4 border-blue-500 hover:scale-105 transition-transform duration-300 group">
                    <div className="w-14 h-14 flex items-center justify-center rounded-full mb-4 text-3xl bg-blue-100 text-blue-600">
                      <FaBuilding />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-blue-900">
                      {office.name || office.city || office.address?.city}
                    </h3>
                    <p className="text-gray-600 text-base mb-2">
                      {office.address?.street || ''}{office.address?.city ? `, ${office.address.city}` : ''}{office.address?.state ? `, ${office.address.state}` : ''}{office.address?.pincode ? ` - ${office.address.pincode}` : ''}
                    </p>
                    {office.contact?.phone && (
                      <p className="text-gray-700 mb-2">
                        <FaPhone className="inline mr-2" />
                        {typeof office.contact.phone === "object"
                          ? office.contact.phone.primary || office.contact.phone.whatsapp
                          : office.contact.phone}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2 justify-center mb-2">
                      {office.services && Object.entries(office.services).map(([service, enabled]) =>
                        enabled ? (
                          <span
                            key={service}
                            className={`px-2 py-1 text-xs rounded-full ${
                              service === "pgRentals"
                                ? "bg-blue-100 text-blue-800"
                                : service === "roomRentals"
                                ? "bg-green-100 text-green-800"
                                : service === "maintenance"
                                ? "bg-yellow-100 text-yellow-800"
                                : service === "insurance"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {service.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                          </span>
                        ) : null
                      )}
                    </div>
                    {office.workingHours && (
                      <div className="text-sm text-gray-600">
                        <strong>Working Hours:</strong> {office.workingHours.start} - {office.workingHours.end}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-extrabold text-center mb-8 text-blue-900 tracking-tight drop-shadow">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {faq.map((item: any, index: number) => (
              <div key={index} className="bg-white p-8 rounded-3xl shadow-xl flex flex-col items-center text-center border-t-4 border-blue-500 hover:scale-105 transition-transform duration-300 group">
                <h3 className="text-lg font-bold mb-3 text-blue-900">{item?.question || 'Question'}</h3>
                <p className="text-gray-600">{item?.answer || 'Answer'}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
