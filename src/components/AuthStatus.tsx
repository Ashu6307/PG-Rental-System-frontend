'use client';
import React, { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';

const AuthStatus = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    return null;
  }

  const { isAuthenticated, user, role, logout } = authContext;

  if (!isAuthenticated) {
    return (
      <div className="fixed top-4 right-4 bg-white rounded-lg shadow-md p-4 border">
        <p className="text-sm text-gray-600 mb-2">Not logged in</p>
        <div className="space-x-2">
          <a 
            href="/auth/login?role=user" 
            className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            User Login
          </a>
          <a 
            href="/auth/login?role=owner" 
            className="text-xs bg-slate-600 text-white px-3 py-1 rounded hover:bg-slate-700"
          >
            Owner Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 bg-white rounded-lg shadow-md p-4 border">
      <div className="text-sm">
        <p className="font-medium text-gray-800">{user?.name || 'User'}</p>
        <p className="text-gray-600 capitalize">{role} Account</p>
        <button 
          onClick={logout}
          className="mt-2 text-xs bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 w-full"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AuthStatus;
