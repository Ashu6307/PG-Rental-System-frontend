'use client';

import React from 'react';
import { 
  Building2, 
  Shield, 
  HeadphonesIcon,
  ExternalLink,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Users,
  IndianRupee,
  Globe,
  CreditCard,
  Settings,
  FileText,
  BarChart3
} from 'lucide-react';

interface OwnerFooterProps {
  className?: string;
}

const OwnerFooter: React.FC<OwnerFooterProps> = ({ className = '' }) => {
  const currentYear = new Date().getFullYear();

  // Quick Links for Property Management
  const propertyQuickLinks = [
    { label: "Dashboard Overview", href: "/dashboard/owner", icon: BarChart3 },
    { label: "Property Management", href: "/dashboard/owner/properties", icon: Building2 },
    { label: "Tenant Management", href: "/dashboard/owner/tenants", icon: Users },
    { label: "Payment Records", href: "/dashboard/owner/payments", icon: IndianRupee },
    { label: "Financial Reports", href: "/dashboard/owner/reports", icon: FileText },
    { label: "Settings", href: "/dashboard/owner/settings", icon: Settings }
  ];

  // Business Tools & Resources
  const businessTools = [
    { label: "Property Analytics", href: "/dashboard/owner/analytics" },
    { label: "Tenant Communication", href: "/dashboard/owner/communications" },
    { label: "Maintenance Tracking", href: "/dashboard/owner/maintenance" },
    { label: "Document Manager", href: "/dashboard/owner/documents" },
    { label: "Invoice Generator", href: "/dashboard/owner/invoices" },
    { label: "Tax Calculator", href: "/dashboard/owner/tax-tools" }
  ];

  // Support & Legal Links
  const supportLinks = [
    { label: "24/7 Support Center", href: "/support" },
    { label: "Property Owner Guide", href: "/guide/property-owner" },
    { label: "Legal Compliance Help", href: "/legal/compliance" },
    { label: "Tax & Accounting Support", href: "/support/accounting" },
    { label: "API Documentation", href: "/api-docs" },
    { label: "System Status", href: "/status" }
  ];

  const legalLinks = [
    { label: "Terms of Service", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "Data Protection", href: "/data-protection" },
    { label: "Rental Agreement Templates", href: "/templates/rental" },
    { label: "Compliance Guidelines", href: "/compliance" }
  ];

  // Social media links
  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Youtube, href: "#", label: "YouTube" }
  ];

  return (
    <footer className={`bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Property Management Tools */}
            <div>
              <h4 className="text-lg font-semibold mb-6 flex items-center space-x-2">
                <Building2 className="h-5 w-5 text-blue-400" />
                <span>Property Tools</span>
              </h4>
              <ul className="space-y-3">
                {propertyQuickLinks.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href}
                      className="text-gray-300 hover:text-white text-sm transition-colors flex items-center space-x-2 group"
                    >
                      <link.icon className="h-4 w-4 text-gray-500 group-hover:text-blue-400 transition-colors" />
                      <span>{link.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Business & Analytics */}
            <div>
              <h4 className="text-lg font-semibold mb-6 flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-green-400" />
                <span>Business Tools</span>
              </h4>
              <ul className="space-y-3">
                {businessTools.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href}
                      className="text-gray-300 hover:text-white text-sm transition-colors flex items-center space-x-2"
                    >
                      <span>•</span>
                      <span>{link.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support & Resources */}
            <div>
              <h4 className="text-lg font-semibold mb-6 flex items-center space-x-2">
                <HeadphonesIcon className="h-5 w-5 text-purple-400" />
                <span>Support</span>
              </h4>
              <ul className="space-y-3">
                {supportLinks.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href}
                      className="text-gray-300 hover:text-white text-sm transition-colors flex items-center space-x-2"
                    >
                      <span>•</span>
                      <span>{link.label}</span>
                      <ExternalLink className="h-3 w-3 opacity-50" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal & Compliance */}
            <div>
              <h4 className="text-lg font-semibold mb-6 flex items-center space-x-2">
                <Shield className="h-5 w-5 text-yellow-400" />
                <span>Legal & Compliance</span>
              </h4>
              <ul className="space-y-3">
                {legalLinks.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href}
                      className="text-gray-300 hover:text-white text-sm transition-colors flex items-center space-x-2"
                    >
                      <span>•</span>
                      <span>{link.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="py-6 border-t border-gray-700">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            {/* Copyright & Platform Info */}
            <div className="text-center lg:text-left">
              <p className="text-gray-400 text-sm">
                © {currentYear} PropertyHub Pro. All rights reserved. | Built for Professional Property Owners
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Trusted by 10,000+ property owners across India | Industry-leading property management platform
              </p>
            </div>

            {/* Social Links & External */}
            <div className="flex items-center space-x-6">
              {/* Social Media */}
              <div className="flex items-center space-x-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                    title={social.label}
                  >
                    <social.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>

              {/* Platform Status */}
              <div className="flex items-center space-x-2 text-xs">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-gray-400">System Status: All Good</span>
              </div>
            </div>
          </div>

          {/* Additional Owner Benefits */}
          <div className="mt-6 pt-6 border-t border-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="flex items-center justify-center space-x-2">
                <Shield className="h-4 w-4 text-green-400" />
                <span className="text-xs text-gray-400">Bank-level Security</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Globe className="h-4 w-4 text-blue-400" />
                <span className="text-xs text-gray-400">Multi-property Management</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <CreditCard className="h-4 w-4 text-purple-400" />
                <span className="text-xs text-gray-400">Automated Payment Processing</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default OwnerFooter;
