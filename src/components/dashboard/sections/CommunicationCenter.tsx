'use client';

import React, { useState } from 'react';
import { 
  MessageCircle, 
  Bell, 
  Mail, 
  Phone, 
  Send, 
  Users, 
  Search,
  Plus,
  Eye,
  Reply,
  Forward,
  Archive,
  Clock,
  CheckCircle,
  AlertTriangle,
  FileText,
  Calendar,
  User,
  Megaphone,
  Edit
} from 'lucide-react';

interface Message {
  id: string;
  type: 'individual' | 'group' | 'announcement';
  sender: string;
  recipients: string[];
  subject: string;
  content: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  attachments?: string[];
  roomNumbers?: string[];
  category: 'general' | 'maintenance' | 'payment' | 'rules' | 'emergency';
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  targetAudience: 'all' | 'specific-rooms' | 'new-tenants';
  roomNumbers?: string[];
  scheduledFor?: string;
  expiresOn?: string;
  status: 'draft' | 'scheduled' | 'sent' | 'expired';
  createdAt: string;
  readBy: string[];
}

interface Contact {
  id: string;
  name: string;
  roomNumber: string;
  phone: string;
  email: string;
  type: 'tenant' | 'emergency' | 'service-provider';
  lastContact: string;
  status: 'active' | 'inactive';
  notes?: string;
}

const CommunicationCenter = () => {
  const [activeTab, setActiveTab] = useState('messages');
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Sample messages data
  const messages: Message[] = [
    {
      id: '1',
      type: 'announcement',
      sender: 'Owner',
      recipients: ['All Tenants'],
      subject: 'Monthly Rent Payment Reminder',
      content: 'Dear tenants, this is a reminder that monthly rent payment is due by 5th of every month. Please ensure timely payment to avoid late fees.',
      timestamp: '2 hours ago',
      status: 'delivered',
      priority: 'medium',
      roomNumbers: ['all'],
      category: 'payment'
    },
    {
      id: '2',
      type: 'individual',
      sender: 'Rahul Sharma (Room 101)',
      recipients: ['Owner'],
      subject: 'AC Maintenance Request',
      content: 'Hi, the AC in my room is not cooling properly. Can you please arrange for a technician to check it?',
      timestamp: '4 hours ago',
      status: 'read',
      priority: 'high',
      roomNumbers: ['101'],
      category: 'maintenance'
    },
    {
      id: '3',
      type: 'group',
      sender: 'Owner',
      recipients: ['Room 201', 'Room 202', 'Room 203'],
      subject: 'Water Supply Interruption - 2nd Floor',
      content: 'There will be a planned water supply interruption on 2nd floor tomorrow from 10 AM to 2 PM for pipeline maintenance.',
      timestamp: '1 day ago',
      status: 'delivered',
      priority: 'urgent',
      roomNumbers: ['201', '202', '203'],
      category: 'general'
    },
    {
      id: '4',
      type: 'individual',
      sender: 'Priya Singh (Room 203)',
      recipients: ['Owner'],
      subject: 'Guest Permission Request',
      content: 'I would like to request permission for my parents to stay for 2 days next week. Please let me know the procedure.',
      timestamp: '2 days ago',
      status: 'sent',
      priority: 'low',
      roomNumbers: ['203'],
      category: 'rules'
    }
  ];

  // Sample notifications data
  const notifications: Notification[] = [
    {
      id: '1',
      title: 'Monthly Safety Drill',
      message: 'Monthly fire safety drill will be conducted this Saturday at 11 AM. All tenants must participate.',
      type: 'warning',
      targetAudience: 'all',
      status: 'scheduled',
      scheduledFor: '5 Feb 2025, 11:00 AM',
      createdAt: '3 Feb 2025',
      readBy: []
    },
    {
      id: '2',
      title: 'New WiFi Password',
      message: 'WiFi password has been updated for security. New password: PG@2025Secure. Please update your devices.',
      type: 'info',
      targetAudience: 'all',
      status: 'sent',
      createdAt: '2 Feb 2025',
      readBy: ['Rahul Sharma', 'Priya Singh', 'Amit Kumar']
    },
    {
      id: '3',
      title: 'Welcome to PG',
      message: 'Welcome to our PG! Please read the house rules and contact management for any questions.',
      type: 'success',
      targetAudience: 'new-tenants',
      status: 'draft',
      createdAt: '1 Feb 2025',
      readBy: []
    }
  ];

  // Sample contacts data
  const contacts: Contact[] = [
    {
      id: '1',
      name: 'Rahul Sharma',
      roomNumber: '101',
      phone: '+91 98765 43210',
      email: 'rahul.sharma@email.com',
      type: 'tenant',
      lastContact: '2 hours ago',
      status: 'active'
    },
    {
      id: '2',
      name: 'Priya Singh',
      roomNumber: '203',
      phone: '+91 98765 43211',
      email: 'priya.singh@email.com',
      type: 'tenant',
      lastContact: '1 day ago',
      status: 'active'
    },
    {
      id: '3',
      name: 'Fire Department',
      roomNumber: 'Emergency',
      phone: '101',
      email: 'fire@emergency.gov',
      type: 'emergency',
      lastContact: 'Never',
      status: 'active'
    },
    {
      id: '4',
      name: 'Ravi Plumber',
      roomNumber: 'Service',
      phone: '+91 98765 43215',
      email: 'ravi.plumber@email.com',
      type: 'service-provider',
      lastContact: '3 days ago',
      status: 'active'
    }
  ];

  const getMessageStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return <Send className="h-4 w-4 text-blue-600" />;
      case 'delivered': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'read': return <Eye className="h-4 w-4 text-gray-600" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getNotificationTypeIcon = (type: string) => {
    switch (type) {
      case 'info': return <Bell className="h-5 w-5 text-blue-600" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'success': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default: return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getContactTypeIcon = (type: string) => {
    switch (type) {
      case 'tenant': return <User className="h-5 w-5 text-blue-600" />;
      case 'emergency': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'service-provider': return <Users className="h-5 w-5 text-green-600" />;
      default: return <User className="h-5 w-5 text-gray-600" />;
    }
  };

  const filteredMessages = messages.filter(message => {
    const searchMatch = searchTerm === '' || 
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const filterMatch = selectedFilter === 'all' || message.category === selectedFilter;
    
    return searchMatch && filterMatch;
  });

  const totalMessages = messages.length;
  const unreadMessages = messages.filter(m => m.status !== 'read').length;
  const urgentMessages = messages.filter(m => m.priority === 'urgent').length;
  const todayMessages = messages.filter(m => m.timestamp.includes('hour') || m.timestamp.includes('minute')).length;

  return (
    <div className="space-y-6">
      {/* Header with Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Communication Center</h2>
            <p className="text-gray-500">Manage all communications with tenants and service providers</p>
          </div>
          
          <button 
            onClick={() => setShowComposeModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            <span>Compose Message</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {[
            { id: 'messages', label: 'Messages', icon: MessageCircle },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'contacts', label: 'Contacts', icon: Users },
            { id: 'templates', label: 'Templates', icon: FileText }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Messages Tab */}
      {activeTab === 'messages' && (
        <>
          {/* Message Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Total Messages</p>
                  <p className="text-2xl font-bold text-gray-900">{totalMessages}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">All time</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Unread</p>
                  <p className="text-2xl font-bold text-gray-900">{unreadMessages}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
                  <Mail className="h-6 w-6 text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">Requires attention</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Urgent</p>
                  <p className="text-2xl font-bold text-gray-900">{urgentMessages}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">High priority</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Today</p>
                  <p className="text-2xl font-bold text-gray-900">{todayMessages}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">Recent activity</p>
            </div>
          </div>

          {/* Message Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search messages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <select 
                value={selectedFilter} 
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="Filter messages by category"
              >
                <option value="all">All Categories</option>
                <option value="general">General</option>
                <option value="maintenance">Maintenance</option>
                <option value="payment">Payment</option>
                <option value="rules">Rules</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>
          </div>

          {/* Messages List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Messages</h3>
            
            <div className="space-y-4">
              {filteredMessages.map((message) => (
                <div key={message.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <MessageCircle className="h-6 w-6 text-blue-600" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-medium text-gray-900">{message.subject}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(message.priority)}`}>
                            {message.priority.toUpperCase()}
                          </span>
                          <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                            {message.type}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mb-3">{message.content}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">{message.sender}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">{message.recipients.join(', ')}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">{message.timestamp}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getMessageStatusIcon(message.status)}
                            <span className="text-gray-600 capitalize">{message.status}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100" title="Reply">
                        <Reply className="h-4 w-4" />
                      </button>
                      <button className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100" title="Forward">
                        <Forward className="h-4 w-4" />
                      </button>
                      <button className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100" title="Archive">
                        <Archive className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Push Notifications</h3>
              <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                <Megaphone className="h-4 w-4" />
                <span>Create Announcement</span>
              </button>
            </div>
            
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div key={notification.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        {getNotificationTypeIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-medium text-gray-900">{notification.title}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            notification.status === 'sent' ? 'bg-green-100 text-green-800' :
                            notification.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                            notification.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {notification.status.toUpperCase()}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mb-3">{notification.message}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">Target: {notification.targetAudience}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">Created: {notification.createdAt}</span>
                          </div>
                          {notification.scheduledFor && (
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-600">Scheduled: {notification.scheduledFor}</span>
                            </div>
                          )}
                        </div>
                        
                        {notification.readBy.length > 0 && (
                          <div className="mt-3">
                            <span className="text-sm text-gray-500">Read by {notification.readBy.length} users</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100" title="View details">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100" title="Edit">
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Contacts Tab */}
      {activeTab === 'contacts' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Contact Directory</h3>
            <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              <Plus className="h-4 w-4" />
              <span>Add Contact</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contacts.map((contact) => (
              <div key={contact.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      {getContactTypeIcon(contact.type)}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{contact.name}</h4>
                      <p className="text-sm text-gray-500">{contact.roomNumber}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    contact.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {contact.status}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{contact.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{contact.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Last contact: {contact.lastContact}</span>
                  </div>
                </div>
                
                <div className="mt-4 flex space-x-2">
                  <button className="flex-1 py-2 px-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm flex items-center justify-center space-x-1">
                    <MessageCircle className="h-4 w-4" />
                    <span>Message</span>
                  </button>
                  <button className="flex-1 py-2 px-3 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 text-sm flex items-center justify-center space-x-1">
                    <Phone className="h-4 w-4" />
                    <span>Call</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Communication Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Communication Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <Megaphone className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Send Announcement</p>
              <p className="text-sm text-gray-500">Broadcast to all tenants</p>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Group Message</p>
              <p className="text-sm text-gray-500">Message specific rooms</p>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all">
            <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
              <Bell className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Emergency Alert</p>
              <p className="text-sm text-gray-500">Urgent notifications</p>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all">
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Message Templates</p>
              <p className="text-sm text-gray-500">Pre-written messages</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommunicationCenter;
