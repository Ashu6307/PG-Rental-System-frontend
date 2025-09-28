'use client';

import React from 'react';

interface RoleBasedLayoutProps {
  role: 'user' | 'admin' | 'owner';
  children: React.ReactNode;
}

const RoleBasedLayout: React.FC<RoleBasedLayoutProps> = ({ role, children }) => {
  return (
    <div className={`role-based-layout ${role}-layout`}>
      {children}
    </div>
  );
};

export default RoleBasedLayout;