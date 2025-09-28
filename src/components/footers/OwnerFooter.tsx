'use client';
import React from 'react';
import Link from 'next/link';
import { 
  FaBuilding,
  FaChartLine,
  FaUsers,
  FaDollarSign,
  FaFileAlt,
  FaHeadset,
  FaShieldAlt,
  FaPhone,
  FaEnvelope,
  FaGraduationCap,
  FaTrophy
} from 'react-icons/fa';

const OwnerFooter = () => {
  return (
    <footer className="bg-slate-900 text-gray-300 border-t border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Owner Portal Info */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <FaBuilding className="text-white text-sm" />
              </div>
              <h3 className="text-lg font-bold text-white">Owner Portal</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Comprehensive property management platform designed for modern property owners.
            </p>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <FaTrophy className="w-3 h-3 text-yellow-400" />
                <span className="text-gray-400">Trusted Platform</span>
              </div>
            </div>
          </div>

          {/* Management Tools */}
          <div className="space-y-3">
            <h4 className="text-md font-semibold text-white">Management</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/owner/properties" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors text-sm">
                  <FaBuilding className="w-3 h-3" />
                  <span>Properties</span>
                </Link>
              </li>
              <li>
                <Link href="/owner/tenants" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors text-sm">
                  <FaUsers className="w-3 h-3" />
                  <span>Tenants</span>
                </Link>
              </li>
              <li>
                <Link href="/owner/finances" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors text-sm">
                  <FaDollarSign className="w-3 h-3" />
                  <span>Finances</span>
                </Link>
              </li>
              <li>
                <Link href="/owner/analytics" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors text-sm">
                  <FaChartLine className="w-3 h-3" />
                  <span>Analytics</span>
                </Link>
              </li>
              <li>
                <Link href="/owner/reports" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors text-sm">
                  <FaFileAlt className="w-3 h-3" />
                  <span>Reports</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-3">
            <h4 className="text-md font-semibold text-white">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/owner/help" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors text-sm">
                  <FaHeadset className="w-3 h-3" />
                  <span>Owner Support</span>
                </Link>
              </li>
              <li>
                <Link href="/owner/guides" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors text-sm">
                  <FaGraduationCap className="w-3 h-3" />
                  <span>Owner Guides</span>
                </Link>
              </li>
              <li>
                <Link href="/owner/best-practices" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Best Practices
                </Link>
              </li>
              <li>
                <Link href="/owner/legal" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Legal Guidelines
                </Link>
              </li>
              <li>
                <Link href="/owner/tax-info" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Tax Information
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Contact */}
          <div className="space-y-3">
            <h4 className="text-md font-semibold text-white">Owner Support</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <FaPhone className="w-3 h-3 text-blue-400" />
                <span className="text-gray-400 text-sm">+91 98765 43211</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaEnvelope className="w-3 h-3 text-blue-400" />
                <span className="text-gray-400 text-sm">owners@pgportal.com</span>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="bg-slate-800 rounded-lg p-3 mt-3">
              <h5 className="text-white font-medium text-sm mb-2">Platform Stats</h5>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Active Owners:</span>
                  <span className="text-blue-400">1,200+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Properties Listed:</span>
                  <span className="text-green-400">5,000+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Occupancy Rate:</span>
                  <span className="text-yellow-400">92%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-700 mt-6 pt-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="text-gray-500 text-sm">
              © 2025 Owner Portal. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 text-sm">
              <Link href="/owner/terms" className="text-gray-500 hover:text-gray-300">
                Terms
              </Link>
              <Link href="/owner/privacy" className="text-gray-500 hover:text-gray-300">
                Privacy
              </Link>
              <div className="flex items-center space-x-1">
                <FaShieldAlt className="w-3 h-3 text-green-400" />
                <span className="text-gray-400">Secure Platform</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default OwnerFooter;
