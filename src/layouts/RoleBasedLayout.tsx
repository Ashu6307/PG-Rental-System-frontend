'use client';
import React, { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import UserNavbar from '@/components/navbars/UserNavbar';
import OwnerNavbar from '@/components/navbars/OwnerNavbar';
import AdminNavbar from '@/components/navbars/AdminNavbar';
import UserFooter from '@/components/footers/UserFooter';
import OwnerFooter from '@/components/footers/OwnerFooter';
import AdminFooter from '@/components/footers/AdminFooter';

interface RoleBasedLayoutProps {
  children: React.ReactNode;
  role?: 'user' | 'owner' | 'admin';
  showFooter?: boolean;
}

const RoleBasedLayout: React.FC<RoleBasedLayoutProps> = ({ 
  children, 
  role,
  showFooter = true 
}) => {
  const { user, isAuthenticated } = useContext(AuthContext) || {};
  
  // Determine which navbar to show based on role
  const getCurrentRole = () => {
    // If role is explicitly passed, use that
    if (role) return role;
    
    // If user is authenticated, use their role
    if (isAuthenticated && user?.role) {
      return user.role;
    }
    
    // Default to user
    return 'user';
  };

  const currentRole = getCurrentRole();

  const renderNavbar = () => {
    switch (currentRole) {
      case 'admin':
        return <AdminNavbar />;
      case 'owner':
        return <OwnerNavbar />;
      case 'user':
      default:
        return <UserNavbar />;
    }
  };

  const renderFooter = () => {
    switch (currentRole) {
      case 'admin':
        return <AdminFooter />;
      case 'owner':
        return <OwnerFooter />;
      case 'user':
      default:
        return <UserFooter />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Role-based Navbar */}
      {renderNavbar()}
      
      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
      
      {/* Role-based Footer */}
      {showFooter && renderFooter()}
    </div>
  );
};

export default RoleBasedLayout;
