'use client';
import React, { useState, useEffect, useContext } from 'react';
import { FaUserShield, FaPlus, FaUsers, FaEdit, FaTrash, FaEye, FaSearch } from 'react-icons/fa';
import { AuthContext } from '@/context/AuthContext';
import AdminRegistrationForm from '@/components/admin/AdminRegistrationForm';
import toast from 'react-hot-toast';

interface Admin {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'super_admin' | 'city_admin';
  isActive: boolean;
  assignedCities: Array<{
    city: string;
    state: string;
    isActive: boolean;
  }>;
  permissions: {
    ownerVerification: boolean;
    propertyApproval: boolean;
    userManagement: boolean;
    cityManagement: boolean;
    adminManagement: boolean;
  };
  lastLogin?: string;
  createdAt: string;
}

const AdminManagement: React.FC = () => {
  const { user, token } = useContext(AuthContext) || {};
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  // Check if current user is super admin
  const isSuperAdmin = user?.role === 'admin'; // Assuming super admin has role 'admin'

  useEffect(() => {
    if (isSuperAdmin) {
      fetchAdmins();
    } else {
      setLoading(false);
    }
  }, [isSuperAdmin, token]);

  const fetchAdmins = async () => {
    try {
      const response = await fetch('/api/admin/list-admins', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setAdmins(data.admins);
      } else {
        toast.error(data.message || 'Failed to fetch admins');
      }
    } catch (error) {
      console.error('Fetch admins error:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
    fetchAdmins(); // Refresh the list
    toast.success('Admin created successfully!');
  };

  const handleToggleStatus = async (adminId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/toggle-status/${adminId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });

      const data = await response.json();
      if (data.success) {
        setAdmins(admins.map(admin => 
          admin.id === adminId 
            ? { ...admin, isActive: !currentStatus }
            : admin
        ));
        toast.success(`Admin ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      } else {
        toast.error(data.message || 'Failed to update admin status');
      }
    } catch (error) {
      console.error('Toggle admin status error:', error);
      toast.error('Network error. Please try again.');
    }
  };

  const filteredAdmins = admins.filter(admin => {
    const matchesSearch = admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         admin.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || admin.role === filterRole;
    return matchesSearch && matchesRole;
  });

  if (!isSuperAdmin) {
    return (
      <div className="text-center p-8">
        <FaUserShield className="mx-auto text-6xl text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
        <p className="text-gray-600">Only Super Admin can manage administrators.</p>
      </div>
    );
  }

  if (showCreateForm) {
    return (
      <AdminRegistrationForm
        onSuccess={handleCreateSuccess}
        onCancel={() => setShowCreateForm(false)}
      />
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white p-6 rounded-lg mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FaUsers className="text-3xl mr-4" />
            <div>
              <h1 className="text-3xl font-bold">Admin Management</h1>
              <p className="text-red-100">Manage system administrators</p>
            </div>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-red-50 transition-colors flex items-center"
          >
            <FaPlus className="mr-2" />
            Create New Admin
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              title="Filter by admin role"
              aria-label="Filter administrators by role"
            >
              <option value="all">All Roles</option>
              <option value="super_admin">Super Admin</option>
              <option value="city_admin">City Admin</option>
              <option value="admin">General Admin</option>
            </select>
          </div>
        </div>
      </div>

      {/* Admin List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading administrators...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Admin Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned Cities
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAdmins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaUserShield className="text-red-600 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {admin.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {admin.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        admin.role === 'super_admin' 
                          ? 'bg-purple-100 text-purple-800'
                          : admin.role === 'city_admin'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {admin.role.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {admin.assignedCities?.length > 0 ? (
                          <div>
                            {admin.assignedCities.slice(0, 2).map((city, index) => (
                              <div key={index} className="text-xs">
                                {city.city}, {city.state}
                              </div>
                            ))}
                            {admin.assignedCities.length > 2 && (
                              <div className="text-xs text-gray-500">
                                +{admin.assignedCities.length - 2} more
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-500">All Cities</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(admin.id, admin.isActive)}
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
                          admin.isActive
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {admin.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {admin.lastLogin 
                        ? new Date(admin.lastLogin).toLocaleDateString()
                        : 'Never'
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        <button
                          className="text-yellow-600 hover:text-yellow-900"
                          title="Edit Admin"
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900"
                          title="Delete Admin"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAdmins.length === 0 && (
            <div className="text-center py-12">
              <FaUsers className="mx-auto text-4xl text-gray-400 mb-4" />
              <p className="text-gray-600">No administrators found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminManagement;
