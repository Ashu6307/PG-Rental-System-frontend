'use client';

import React, { useState } from 'react';
import { useOwnerData } from '@/hooks/useOwnerData';
import { 
  Home,
  Building2,
  Users,
  IndianRupee,
  FileText,
  BarChart3,
  Settings,
  Bell,
  MessageSquare,
  Wrench,
  Shield,
  ChevronDown,
  TrendingUp,
  Calendar,
  PlusCircle,
  Eye,
  DollarSign,
  Clock,
  Zap
} from 'lucide-react';

interface OwnerSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const OwnerSidebar: React.FC<OwnerSidebarProps> = ({
  activeSection,
  onSectionChange,
  isOpen,
  onClose
}) => {
  const { ownerData, ownerName, primaryPropertyName } = useOwnerData();
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  const toggleMenu = (menuId: string) => {
    setExpandedMenu(expandedMenu === menuId ? null : menuId);
  };

  // Main navigation menu with industry-level features
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard Overview',
      icon: Home,
      description: 'Main analytics & insights',
      badge: 'live'
    },
    {
      id: 'properties',
      label: 'Property Management',
      icon: Building2,
      description: 'Manage all properties',
      badge: ownerData.stats.totalProperties.toString(),
      subItems: [
        { id: 'properties-overview', label: 'Properties Overview', icon: Eye },
        { id: 'add-property', label: 'Add New Property', icon: PlusCircle },
        { id: 'property-analytics', label: 'Property Analytics', icon: BarChart3 },
        { id: 'room-management', label: 'Room Management', icon: Building2 },
        { id: 'property-documents', label: 'Property Documents', icon: FileText }
      ]
    },
    {
      id: 'tenants',
      label: 'Tenant Management',
      icon: Users,
      description: 'Manage all tenants',
      badge: ownerData.stats.totalTenants.toString(),
      subItems: [
        { id: 'tenants-overview', label: 'All Tenants', icon: Users },
        { id: 'add-tenant', label: 'Add New Tenant', icon: PlusCircle },
        { id: 'tenant-requests', label: 'Tenant Requests', icon: MessageSquare },
        { id: 'tenant-documents', label: 'Tenant Documents', icon: FileText },
        { id: 'check-in-out', label: 'Check-in/Check-out', icon: Calendar }
      ]
    },
    {
      id: 'financial',
      label: 'Financial Management',
      icon: IndianRupee,
      description: 'Payments & revenue tracking',
      badge: ownerData.stats.pendingPayments > 0 ? ownerData.stats.pendingPayments.toString() : undefined,
      subItems: [
        { id: 'payments-overview', label: 'Payment Dashboard', icon: DollarSign },
        { id: 'payment-collection', label: 'Collect Payments', icon: IndianRupee },
        { id: 'invoices', label: 'Invoice Management', icon: FileText },
        { id: 'financial-reports', label: 'Financial Reports', icon: BarChart3 },
        { id: 'revenue-analytics', label: 'Revenue Analytics', icon: TrendingUp },
        { id: 'tax-management', label: 'Tax Management', icon: Shield }
      ]
    },
    {
      id: 'communications',
      label: 'Communication Center',
      icon: MessageSquare,
      description: 'Tenant communications',
      subItems: [
        { id: 'send-notices', label: 'Send Notices', icon: Bell },
        { id: 'bulk-messages', label: 'Bulk Messaging', icon: MessageSquare },
        { id: 'communication-history', label: 'Message History', icon: Clock },
        { id: 'announcements', label: 'Announcements', icon: Zap }
      ]
    },
    {
      id: 'maintenance',
      label: 'Maintenance & Services',
      icon: Wrench,
      description: 'Property maintenance',
      badge: ownerData.stats.maintenanceRequests > 0 ? ownerData.stats.maintenanceRequests.toString() : undefined,
      subItems: [
        { id: 'maintenance-requests', label: 'Active Requests', icon: Wrench },
        { id: 'maintenance-schedule', label: 'Maintenance Schedule', icon: Calendar },
        { id: 'vendor-management', label: 'Vendor Management', icon: Users },
        { id: 'maintenance-history', label: 'Maintenance History', icon: Clock }
      ]
    },
    {
      id: 'analytics',
      label: 'Analytics & Reports',
      icon: BarChart3,
      description: 'Business insights',
      subItems: [
        { id: 'business-analytics', label: 'Business Overview', icon: BarChart3 },
        { id: 'occupancy-analytics', label: 'Occupancy Analytics', icon: TrendingUp },
        { id: 'revenue-insights', label: 'Revenue Insights', icon: IndianRupee },
        { id: 'custom-reports', label: 'Custom Reports', icon: FileText }
      ]
    },
    {
      id: 'documents',
      label: 'Document Management',
      icon: FileText,
      description: 'All documents & contracts'
    },
    {
      id: 'settings',
      label: 'Settings & Preferences',
      icon: Settings,
      description: 'Account & system settings'
    }
  ];

  // Quick stats for sidebar
  const quickStats = [
    {
      label: 'Occupancy Rate',
      value: `${ownerData.stats.occupancyRate}%`,
      icon: TrendingUp,
      color: 'bg-green-500',
      trend: 'up'
    },
    {
      label: 'Monthly Revenue',
      value: `₹${(ownerData.stats.monthlyRevenue / 1000).toFixed(0)}K`,
      icon: IndianRupee,
      color: 'bg-blue-500',
      trend: 'up'
    },
    {
      label: 'Pending Payments',
      value: ownerData.stats.pendingPayments.toString(),
      icon: Clock,
      color: ownerData.stats.pendingPayments > 0 ? 'bg-red-500' : 'bg-green-500',
      trend: ownerData.stats.pendingPayments > 0 ? 'down' : 'stable'
    }
  ];

  return (
    <>
      {/* Sidebar */}
      <div className={`
        w-80 bg-white border-r border-gray-200 shadow-xl h-screen
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col overflow-hidden
        lg:static
        fixed inset-y-0 left-0 z-50
      `}>
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">{ownerName}</h2>
                <p className="text-xs text-gray-500">{primaryPropertyName}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              ×
            </button>
          </div>

          {/* Quick Stats Cards */}
          <div className="mt-4 space-y-2">
            {quickStats.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg p-3 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-6 h-6 rounded-md ${stat.color} flex items-center justify-center`}>
                      <stat.icon className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-xs text-gray-600">{stat.label}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm font-bold text-gray-800">{stat.value}</span>
                    {stat.trend === 'up' && <TrendingUp className="h-3 w-3 text-green-500" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto p-4">
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <div key={item.id}>
                <button
                  onClick={() => {
                    if (item.subItems) {
                      toggleMenu(item.id);
                    } else {
                      onSectionChange(item.id);
                      onClose();
                    }
                  }}
                  className={`
                    w-full flex items-center justify-between p-3 rounded-lg text-left transition-all duration-200
                    ${activeSection === item.id 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                      : 'hover:bg-gray-50 text-gray-700'
                    }
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className={`h-5 w-5 ${
                      activeSection === item.id ? 'text-white' : 'text-gray-500'
                    }`} />
                    <div>
                      <span className="text-sm font-medium">{item.label}</span>
                      <p className={`text-xs ${
                        activeSection === item.id ? 'text-blue-100' : 'text-gray-400'
                      }`}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {item.badge && (
                      <span className={`
                        px-2 py-1 text-xs rounded-full font-medium
                        ${item.badge === 'live' 
                          ? 'bg-green-100 text-green-800 animate-pulse' 
                          : activeSection === item.id
                            ? 'bg-white/20 text-white'
                            : 'bg-blue-100 text-blue-800'
                        }
                      `}>
                        {item.badge}
                      </span>
                    )}
                    {item.subItems && (
                      <ChevronDown className={`h-4 w-4 transition-transform ${
                        expandedMenu === item.id ? 'rotate-180' : ''
                      } ${activeSection === item.id ? 'text-white' : 'text-gray-400'}`} />
                    )}
                  </div>
                </button>

                {/* Sub Items */}
                {item.subItems && expandedMenu === item.id && (
                  <div className="mt-2 ml-6 space-y-1">
                    {item.subItems.map((subItem) => (
                      <button
                        key={subItem.id}
                        onClick={() => {
                          onSectionChange(subItem.id);
                          onClose();
                        }}
                        className={`
                          w-full flex items-center space-x-3 p-2 rounded-lg text-left transition-colors text-sm
                          ${activeSection === subItem.id 
                            ? 'bg-blue-50 text-blue-700 border-l-2 border-blue-500' 
                            : 'hover:bg-gray-50 text-gray-600'
                          }
                        `}
                      >
                        <subItem.icon className={`h-4 w-4 ${
                          activeSection === subItem.id ? 'text-blue-500' : 'text-gray-400'
                        }`} />
                        <span>{subItem.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom Section - Help & Support */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          {/* <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
            <div className="flex items-center space-x-3 mb-2">
              <Award className="h-5 w-5" />
              <span className="font-semibold text-sm">Premium Support</span>
            </div>
            <p className="text-xs text-green-100 mb-3">
              24/7 dedicated support for property owners
            </p>
            <button className="w-full bg-white/20 hover:bg-white/30 rounded-md py-2 px-3 text-xs font-medium transition-colors">
              Contact Support
            </button>
          </div> */}

          {/* System Info */}
          <div className="mt-3 text-center">
            <p className="text-xs text-gray-500">PropertyHub Pro v2.1.0</p>
            <div className="flex items-center justify-center space-x-1 mt-1">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
              <span className="text-xs text-gray-400">System Online</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OwnerSidebar;
