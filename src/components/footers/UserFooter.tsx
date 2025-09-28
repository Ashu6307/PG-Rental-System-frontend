'use client';
import React from 'react';
import Link from 'next/link';
import { 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedin,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaHome,
  FaHeart,
  FaShieldAlt,
  FaHeadset
} from 'react-icons/fa';

const UserFooter = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <FaHome className="text-white text-sm" />
              </div>
              <h3 className="text-xl font-bold text-white">PG Portal</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your trusted partner in finding the perfect PG and room accommodations. 
              Safe, verified, and comfortable living spaces for students and professionals.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors" aria-label="Facebook" title="Follow us on Facebook">
                <FaFacebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors" aria-label="Twitter" title="Follow us on Twitter">
                <FaTwitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors" aria-label="Instagram" title="Follow us on Instagram">
                <FaInstagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors" aria-label="LinkedIn" title="Follow us on LinkedIn">
                <FaLinkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/pg" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Find PG
                </Link>
              </li>
              <li>
                <Link href="/rooms" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Browse Rooms
                </Link>
              </li>
              <li>
                <Link href="/user/favorites" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors text-sm">
                  <FaHeart className="w-3 h-3" />
                  <span>My Favorites</span>
                </Link>
              </li>
              <li>
                <Link href="/user/bookings" className="text-gray-400 hover:text-white transition-colors text-sm">
                  My Bookings
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors text-sm">
                  <FaHeadset className="w-3 h-3" />
                  <span>Help Center</span>
                </Link>
              </li>
              <li>
                <Link href="/safety" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors text-sm">
                  <FaShieldAlt className="w-3 h-3" />
                  <span>Safety Guidelines</span>
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-white transition-colors text-sm">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refund" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Get in Touch</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <FaPhone className="w-4 h-4 text-blue-400" />
                <span className="text-gray-400 text-sm">+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaEnvelope className="w-4 h-4 text-blue-400" />
                <span className="text-gray-400 text-sm">support@pgportal.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <FaMapMarkerAlt className="w-4 h-4 text-blue-400 mt-1" />
                <span className="text-gray-400 text-sm">
                  123 Business District,<br />
                  Tech City, India - 110001
                </span>
              </div>
            </div>
            
            {/* Emergency Contact */}
            <div className="bg-red-900/20 border border-red-800 rounded-lg p-3 mt-4">
              <h5 className="text-red-400 font-medium text-sm mb-1">24/7 Emergency</h5>
              <p className="text-red-300 text-sm">+91 98765 00000</p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-500 text-sm">
              © 2025 PG Portal. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              <Link href="/sitemap" className="text-gray-500 hover:text-gray-300 text-sm">
                Sitemap
              </Link>
              <Link href="/accessibility" className="text-gray-500 hover:text-gray-300 text-sm">
                Accessibility
              </Link>
              <Link href="/careers" className="text-gray-500 hover:text-gray-300 text-sm">
                Careers
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default UserFooter;
