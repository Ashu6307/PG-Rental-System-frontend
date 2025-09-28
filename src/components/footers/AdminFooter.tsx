'use client';
import React from 'react';
import Link from 'next/link';
import { 
  FaCrown,
  FaDatabase,
  FaShieldAlt,
  FaChartLine,
  FaUsers,
  FaCog,
  FaFileAlt,
  FaServer,
  FaLock,
  FaExclamationTriangle,
  FaClock,
  FaCheckCircle
} from 'react-icons/fa';

const AdminFooter = () => {
  const currentTime = new Date().toLocaleString();
  
  return (
    <footer className="bg-red-950 text-gray-300 border-t border-red-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Admin Portal Info */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                <FaCrown className="text-white text-sm" />
              </div>
              <h3 className="text-lg font-bold text-white">Admin Portal</h3>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed">
              System administration dashboard for platform management and monitoring.
            </p>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-xs font-medium">System Online</span>
            </div>
          </div>

          {/* System Management */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white">System</h4>
            <ul className="space-y-1">
              <li>
                <Link href="/admin/users" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors text-xs">
                  <FaUsers className="w-3 h-3" />
                  <span>User Management</span>
                </Link>
              </li>
              <li>
                <Link href="/admin/database" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors text-xs">
                  <FaDatabase className="w-3 h-3" />
                  <span>Database</span>
                </Link>
              </li>
              <li>
                <Link href="/admin/security" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors text-xs">
                  <FaShieldAlt className="w-3 h-3" />
                  <span>Security Center</span>
                </Link>
              </li>
              <li>
                <Link href="/admin/analytics" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors text-xs">
                  <FaChartLine className="w-3 h-3" />
                  <span>Analytics</span>
                </Link>
              </li>
              <li>
                <Link href="/admin/settings" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors text-xs">
                  <FaCog className="w-3 h-3" />
                  <span>System Settings</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Monitoring */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white">Monitoring</h4>
            <ul className="space-y-1">
              <li>
                <Link href="/admin/audit-logs" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors text-xs">
                  <FaFileAlt className="w-3 h-3" />
                  <span>Audit Logs</span>
                </Link>
              </li>
              <li>
                <Link href="/admin/server-status" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors text-xs">
                  <FaServer className="w-3 h-3" />
                  <span>Server Status</span>
                </Link>
              </li>
              <li>
                <Link href="/admin/security-logs" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors text-xs">
                  <FaLock className="w-3 h-3" />
                  <span>Security Logs</span>
                </Link>
              </li>
              <li>
                <Link href="/admin/alerts" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors text-xs">
                  <FaExclamationTriangle className="w-3 h-3" />
                  <span>System Alerts</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* System Status */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white">System Status</h4>
            <div className="space-y-2">
              <div className="bg-red-900/30 rounded-lg p-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-300">Server Health</span>
                  <FaCheckCircle className="w-3 h-3 text-green-400" />
                </div>
                <div className="flex space-x-2 text-xs">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-gray-400">API</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-gray-400">DB</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span className="text-gray-400">Cache</span>
                  </div>
                </div>
              </div>
              
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-400">Uptime:</span>
                  <span className="text-green-400">99.9%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Active Users:</span>
                  <span className="text-blue-400">1,234</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">CPU Usage:</span>
                  <span className="text-yellow-400">45%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-red-900 mt-4 pt-3">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <div className="flex items-center space-x-4 text-xs">
              <p className="text-gray-500">© 2025 Admin Portal</p>
              <div className="flex items-center space-x-1">
                <FaClock className="w-3 h-3 text-gray-400" />
                <span className="text-gray-400">{currentTime}</span>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-xs">
              <Link href="/admin/documentation" className="text-gray-500 hover:text-gray-300">
                Documentation
              </Link>
              <Link href="/admin/api-docs" className="text-gray-500 hover:text-gray-300">
                API Docs
              </Link>
              <div className="flex items-center space-x-1">
                <FaShieldAlt className="w-3 h-3 text-red-400" />
                <span className="text-red-400">Admin Access</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;
