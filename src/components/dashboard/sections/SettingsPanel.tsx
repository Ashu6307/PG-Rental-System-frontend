'use client';

import React, { useState } from 'react';
import { 
  Settings,
  Shield, 
  Bell,
  Database, 
  Save, 
  Eye, 
  EyeOff,
  Mail,
  AlertTriangle,
  Smartphone,
  CreditCard,
  Building,
  Users
} from 'lucide-react';

interface PGSettings {
  propertyName: string;
  ownerName: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
  website?: string;
  description: string;
  totalRooms: number;
  checkInTime: string;
  checkOutTime: string;
  securityDeposit: number;
  electricityRate: number;
  wifiPassword: string;
  pgType: 'boys' | 'girls' | 'co-ed';
}

interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  paymentReminders: boolean;
  maintenanceAlerts: boolean;
  newTenantAlerts: boolean;
  emergencyAlerts: boolean;
  reminderFrequency: 'daily' | 'weekly' | 'monthly';
}

interface SecuritySettings {
  twoFactorAuth: boolean;
  loginAlerts: boolean;
  sessionTimeout: number;
  passwordPolicy: 'basic' | 'medium' | 'strong';
  dataBackup: boolean;
  accessLogs: boolean;
}

interface BillingSettings {
  rentDueDate: number;
  lateFee: number;
  gracePeriod: number;
  autoGenerateBills: boolean;
  paymentMethods: string[];
  taxIncluded: boolean;
  taxRate: number;
}

const SettingsPanel = () => {
  const [activeTab, setActiveTab] = useState('property');
  const [showPassword, setShowPassword] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Sample settings data
  const [pgSettings, setPgSettings] = useState<PGSettings>({
    propertyName: 'Sunshine PG',
    ownerName: 'Rajesh Kumar',
    address: '123, MG Road, Near Metro Station',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    phone: '+91 98765 43210',
    email: 'owner@sunshinepg.com',
    website: 'www.sunshinepg.com',
    description: 'Premium PG accommodation with all modern amenities',
    totalRooms: 24,
    checkInTime: '12:00',
    checkOutTime: '11:00',
    securityDeposit: 10000,
    electricityRate: 8,
    wifiPassword: 'SunPG@2025',
    pgType: 'co-ed'
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    paymentReminders: true,
    maintenanceAlerts: true,
    newTenantAlerts: true,
    emergencyAlerts: true,
    reminderFrequency: 'weekly'
  });

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorAuth: true,
    loginAlerts: true,
    sessionTimeout: 30,
    passwordPolicy: 'strong',
    dataBackup: true,
    accessLogs: true
  });

  const [billingSettings, setBillingSettings] = useState<BillingSettings>({
    rentDueDate: 5,
    lateFee: 500,
    gracePeriod: 3,
    autoGenerateBills: true,
    paymentMethods: ['UPI', 'Bank Transfer', 'Cash'],
    taxIncluded: false,
    taxRate: 18
  });

  const handleSave = () => {
    // Save settings logic here
    setHasChanges(false);
    // Show success message
  };

  return (
    <div className="space-y-6">
      {/* Header with Save Button */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
            <p className="text-gray-500">Configure your PG property settings and preferences</p>
          </div>
          
          <button 
            onClick={handleSave}
            disabled={!hasChanges}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              hasChanges 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Save className="h-4 w-4" />
            <span>Save Changes</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 overflow-x-auto">
          {[
            { id: 'property', label: 'Property Info', icon: Building },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'security', label: 'Security', icon: Shield },
            { id: 'billing', label: 'Billing', icon: CreditCard },
            { id: 'preferences', label: 'Preferences', icon: Settings }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
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

      {/* Property Information Tab */}
      {activeTab === 'property' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Property Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="propertyName" className="block text-sm font-medium text-gray-700 mb-2">Property Name</label>
              <input
                id="propertyName"
                type="text"
                value={pgSettings.propertyName}
                onChange={(e) => {
                  setPgSettings({...pgSettings, propertyName: e.target.value});
                  setHasChanges(true);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700 mb-2">Owner Name</label>
              <input
                id="ownerName"
                type="text"
                value={pgSettings.ownerName}
                onChange={(e) => {
                  setPgSettings({...pgSettings, ownerName: e.target.value});
                  setHasChanges(true);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <textarea
                id="address"
                value={pgSettings.address}
                onChange={(e) => {
                  setPgSettings({...pgSettings, address: e.target.value});
                  setHasChanges(true);
                }}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <input
                id="city"
                type="text"
                value={pgSettings.city}
                onChange={(e) => {
                  setPgSettings({...pgSettings, city: e.target.value});
                  setHasChanges(true);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">State</label>
              <input
                id="state"
                type="text"
                value={pgSettings.state}
                onChange={(e) => {
                  setPgSettings({...pgSettings, state: e.target.value});
                  setHasChanges(true);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
              <input
                id="pincode"
                type="text"
                value={pgSettings.pincode}
                onChange={(e) => {
                  setPgSettings({...pgSettings, pincode: e.target.value});
                  setHasChanges(true);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                id="phone"
                type="tel"
                value={pgSettings.phone}
                onChange={(e) => {
                  setPgSettings({...pgSettings, phone: e.target.value});
                  setHasChanges(true);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                id="email"
                type="email"
                value={pgSettings.email}
                onChange={(e) => {
                  setPgSettings({...pgSettings, email: e.target.value});
                  setHasChanges(true);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">Website (Optional)</label>
              <input
                id="website"
                type="url"
                value={pgSettings.website || ''}
                onChange={(e) => {
                  setPgSettings({...pgSettings, website: e.target.value});
                  setHasChanges(true);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">PG Type</label>
              <select
                value={pgSettings.pgType}
                onChange={(e) => {
                  setPgSettings({...pgSettings, pgType: e.target.value as 'boys' | 'girls' | 'co-ed'});
                  setHasChanges(true);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="Select PG type"
              >
                <option value="boys">Boys Only</option>
                <option value="girls">Girls Only</option>
                <option value="co-ed">Co-ed</option>
              </select>
            </div>

            <div>
              <label htmlFor="totalRooms" className="block text-sm font-medium text-gray-700 mb-2">Total Rooms</label>
              <input
                id="totalRooms"
                type="number"
                value={pgSettings.totalRooms}
                onChange={(e) => {
                  setPgSettings({...pgSettings, totalRooms: parseInt(e.target.value)});
                  setHasChanges(true);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="securityDeposit" className="block text-sm font-medium text-gray-700 mb-2">Security Deposit (₹)</label>
              <input
                id="securityDeposit"
                type="number"
                value={pgSettings.securityDeposit}
                onChange={(e) => {
                  setPgSettings({...pgSettings, securityDeposit: parseInt(e.target.value)});
                  setHasChanges(true);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="checkInTime" className="block text-sm font-medium text-gray-700 mb-2">Check-in Time</label>
              <input
                id="checkInTime"
                type="time"
                value={pgSettings.checkInTime}
                onChange={(e) => {
                  setPgSettings({...pgSettings, checkInTime: e.target.value});
                  setHasChanges(true);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="checkOutTime" className="block text-sm font-medium text-gray-700 mb-2">Check-out Time</label>
              <input
                id="checkOutTime"
                type="time"
                value={pgSettings.checkOutTime}
                onChange={(e) => {
                  setPgSettings({...pgSettings, checkOutTime: e.target.value});
                  setHasChanges(true);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="electricityRate" className="block text-sm font-medium text-gray-700 mb-2">Electricity Rate (₹/unit)</label>
              <input
                id="electricityRate"
                type="number"
                step="0.1"
                value={pgSettings.electricityRate}
                onChange={(e) => {
                  setPgSettings({...pgSettings, electricityRate: parseFloat(e.target.value)});
                  setHasChanges(true);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="wifiPassword" className="block text-sm font-medium text-gray-700 mb-2">WiFi Password</label>
              <div className="relative">
                <input
                  id="wifiPassword"
                  type={showPassword ? "text" : "password"}
                  value={pgSettings.wifiPassword}
                  onChange={(e) => {
                    setPgSettings({...pgSettings, wifiPassword: e.target.value});
                    setHasChanges(true);
                  }}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Settings Tab */}
      {activeTab === 'notifications' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Notification Preferences</h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Communication Channels</h4>
              <div className="space-y-4">
                {[
                  { key: 'emailNotifications', label: 'Email Notifications', icon: Mail },
                  { key: 'smsNotifications', label: 'SMS Notifications', icon: Smartphone },
                  { key: 'pushNotifications', label: 'Push Notifications', icon: Bell }
                ].map(({ key, label, icon: Icon }) => (
                  <div key={key} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Icon className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-900">{label}</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings[key as keyof NotificationSettings] as boolean}
                        onChange={(e) => {
                          setNotificationSettings({
                            ...notificationSettings,
                            [key]: e.target.checked
                          });
                          setHasChanges(true);
                        }}
                        className="sr-only peer"
                        aria-label={`Toggle ${label.toLowerCase()}`}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-4">Alert Types</h4>
              <div className="space-y-4">
                {[
                  { key: 'paymentReminders', label: 'Payment Reminders', icon: CreditCard },
                  { key: 'maintenanceAlerts', label: 'Maintenance Alerts', icon: Settings },
                  { key: 'newTenantAlerts', label: 'New Tenant Alerts', icon: Users },
                  { key: 'emergencyAlerts', label: 'Emergency Alerts', icon: AlertTriangle }
                ].map(({ key, label, icon: Icon }) => (
                  <div key={key} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Icon className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-900">{label}</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings[key as keyof NotificationSettings] as boolean}
                        onChange={(e) => {
                          setNotificationSettings({
                            ...notificationSettings,
                            [key]: e.target.checked
                          });
                          setHasChanges(true);
                        }}
                        className="sr-only peer"
                        aria-label={`Toggle ${label.toLowerCase()}`}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Reminder Frequency</label>
              <select
                value={notificationSettings.reminderFrequency}
                onChange={(e) => {
                  setNotificationSettings({
                    ...notificationSettings,
                    reminderFrequency: e.target.value as 'daily' | 'weekly' | 'monthly'
                  });
                  setHasChanges(true);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="Select reminder frequency"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Security Settings Tab */}
      {activeTab === 'security' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Security & Privacy</h3>
          
          <div className="space-y-6">
            <div className="space-y-4">
              {[
                { key: 'twoFactorAuth', label: 'Two-Factor Authentication', description: 'Add an extra layer of security to your account' },
                { key: 'loginAlerts', label: 'Login Alerts', description: 'Get notified when someone logs into your account' },
                { key: 'dataBackup', label: 'Automatic Data Backup', description: 'Automatically backup your data daily' },
                { key: 'accessLogs', label: 'Access Logs', description: 'Keep detailed logs of all system access' }
              ].map(({ key, label, description }) => (
                <div key={key} className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{label}</h4>
                    <p className="text-sm text-gray-500 mt-1">{description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer ml-4">
                    <input
                      type="checkbox"
                      checked={securitySettings[key as keyof SecuritySettings] as boolean}
                      onChange={(e) => {
                        setSecuritySettings({
                          ...securitySettings,
                          [key]: e.target.checked
                        });
                        setHasChanges(true);
                      }}
                      className="sr-only peer"
                      aria-label={`Toggle ${label.toLowerCase()}`}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
                <input
                  type="number"
                  value={securitySettings.sessionTimeout}
                  onChange={(e) => {
                    setSecuritySettings({
                      ...securitySettings,
                      sessionTimeout: parseInt(e.target.value)
                    });
                    setHasChanges(true);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  aria-label="Session timeout in minutes"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password Policy</label>
                <select
                  value={securitySettings.passwordPolicy}
                  onChange={(e) => {
                    setSecuritySettings({
                      ...securitySettings,
                      passwordPolicy: e.target.value as 'basic' | 'medium' | 'strong'
                    });
                    setHasChanges(true);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  aria-label="Select password policy"
                >
                  <option value="basic">Basic (8+ characters)</option>
                  <option value="medium">Medium (8+ chars, numbers)</option>
                  <option value="strong">Strong (8+ chars, numbers, symbols)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Billing Settings Tab */}
      {activeTab === 'billing' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Billing Configuration</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rent Due Date (Day of Month)</label>
              <input
                type="number"
                min="1"
                max="31"
                value={billingSettings.rentDueDate}
                onChange={(e) => {
                  setBillingSettings({
                    ...billingSettings,
                    rentDueDate: parseInt(e.target.value)
                  });
                  setHasChanges(true);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="Rent due date day of month"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Late Fee (₹)</label>
              <input
                type="number"
                value={billingSettings.lateFee}
                onChange={(e) => {
                  setBillingSettings({
                    ...billingSettings,
                    lateFee: parseInt(e.target.value)
                  });
                  setHasChanges(true);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="Late fee amount in rupees"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Grace Period (Days)</label>
              <input
                type="number"
                value={billingSettings.gracePeriod}
                onChange={(e) => {
                  setBillingSettings({
                    ...billingSettings,
                    gracePeriod: parseInt(e.target.value)
                  });
                  setHasChanges(true);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="Grace period in days"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tax Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={billingSettings.taxRate}
                onChange={(e) => {
                  setBillingSettings({
                    ...billingSettings,
                    taxRate: parseFloat(e.target.value)
                  });
                  setHasChanges(true);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="Tax rate percentage"
              />
            </div>

            <div className="md:col-span-2">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Auto-Generate Bills</h4>
                    <p className="text-sm text-gray-500">Automatically generate monthly bills</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={billingSettings.autoGenerateBills}
                      onChange={(e) => {
                        setBillingSettings({
                          ...billingSettings,
                          autoGenerateBills: e.target.checked
                        });
                        setHasChanges(true);
                      }}
                      className="sr-only peer"
                      aria-label="Toggle auto-generate bills"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Tax Included in Rent</h4>
                    <p className="text-sm text-gray-500">Include tax in the base rent amount</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={billingSettings.taxIncluded}
                      onChange={(e) => {
                        setBillingSettings({
                          ...billingSettings,
                          taxIncluded: e.target.checked
                        });
                        setHasChanges(true);
                      }}
                      className="sr-only peer"
                      aria-label="Toggle tax included in rent"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Settings Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <Database className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Backup Data</p>
              <p className="text-sm text-gray-500">Create full data backup</p>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Security Audit</p>
              <p className="text-sm text-gray-500">Run security check</p>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all">
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
              <Settings className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Reset to Defaults</p>
              <p className="text-sm text-gray-500">Restore default settings</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
