'use client';

import React, { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';

// Import layout components
import OwnerNavbar from './layout/OwnerNavbar';
import OwnerSidebar from './layout/OwnerSidebar';
import OwnerFooter from './layout/OwnerFooter';

// Import dashboard sections
import EnhancedMainDashboard from './sections/EnhancedMainDashboard';
import EnhancedRoomManagement from './sections/EnhancedRoomManagement';
import EnhancedTenantManagement from './sections/EnhancedTenantManagement';
import EnhancedFinancialManagement from './sections/EnhancedFinancialManagement';
// import UtilityManagement from './sections/UtilityManagement';
// import MaintenanceManagement from './sections/MaintenanceManagement';
// import CommunicationCenter from './sections/CommunicationCenter';
// import DocumentManagement from './sections/DocumentManagement';
// import SettingsPanel from './sections/SettingsPanel';
import AnalyticsReports from './sections/AnalyticsReports';

// Placeholder components for missing sections
const PlaceholderSection = ({ title }: { title: string }) => (
  <div className="p-8 text-center">
    <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
    <p className="text-gray-600">This section is under development.</p>
  </div>
);

const OwnerDashboard = () => {
  const router = useRouter();
  const { isAuthenticated } = useContext(AuthContext) || {};
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login?role=owner');
    }
  }, [isAuthenticated, router]);

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    setSidebarOpen(false); // Close sidebar on mobile after selection
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <EnhancedMainDashboard />;
      case 'properties':
      case 'properties-overview':
      case 'add-property':
      case 'rooms':
        return <EnhancedRoomManagement />;
      case 'tenants':
      case 'tenants-overview':
      case 'add-tenant':
        return <EnhancedTenantManagement />;
      case 'financial':
      case 'payments-overview':
      case 'invoices':
        return <EnhancedFinancialManagement />;
      case 'utilities':
        return <PlaceholderSection title="Utility Management" />;
      case 'maintenance':
        return <PlaceholderSection title="Maintenance Management" />;
      case 'communications':
        return <PlaceholderSection title="Communication Center" />;
      case 'documents':
        return <PlaceholderSection title="Document Management" />;
      case 'analytics':
        return <AnalyticsReports />;
      case 'settings':
        return <PlaceholderSection title="Settings Panel" />;
      default:
        return <EnhancedMainDashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden">
      {/* Sidebar - Fixed Left */}
      <div className="flex-shrink-0">
        <OwnerSidebar
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation - Fixed Top */}
        <div className="flex-shrink-0">
          <OwnerNavbar 
            onMenuToggle={toggleSidebar}
            activeSection={activeSection}
          />
        </div>

        {/* Content Area - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <main className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {renderContent()}
            </div>
          </main>

          {/* Footer */}
          <OwnerFooter />
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default OwnerDashboard;
