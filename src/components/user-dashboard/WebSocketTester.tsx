'use client';

import React, { useState } from 'react';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { 
  Zap, 
  Bell, 
  TrendingUp, 
  Calendar, 
  Play,
  Wifi,
  WifiOff
} from 'lucide-react';

const WebSocketTester: React.FC = () => {
  const { isConnected, emit } = useWebSocket();
  const [isLoading, setIsLoading] = useState(false);
  const [lastTriggered, setLastTriggered] = useState<string | null>(null);

  const triggerSampleUpdates = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/websocket/trigger-samples/USER_ID`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setLastTriggered(new Date().toLocaleTimeString());
      }
    } catch (error) {
      console.error('Error triggering updates:', error);
    }
    setIsLoading(false);
  };

  const sendTestNotification = () => {
    emit('test:notification', {
      title: 'Test Notification',
      message: 'This is a test notification from the dashboard',
      timestamp: new Date()
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">WebSocket Tester</h3>
        <div className="flex items-center space-x-2">
          {isConnected ? (
            <>
              <Wifi className="w-5 h-5 text-green-500" />
              <span className="text-sm text-green-600 font-medium">Connected</span>
            </>
          ) : (
            <>
              <WifiOff className="w-5 h-5 text-red-500" />
              <span className="text-sm text-red-600 font-medium">Disconnected</span>
            </>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Trigger Sample Updates */}
          <button
            onClick={triggerSampleUpdates}
            disabled={!isConnected || isLoading}
            className={`flex items-center justify-center space-x-2 p-4 rounded-lg font-medium transition-all ${
              isConnected && !isLoading
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <div className="w-5 h-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            ) : (
              <Play className="w-5 h-5" />
            )}
            <span>Trigger Live Updates</span>
          </button>

          {/* Send Test Notification */}
          <button
            onClick={sendTestNotification}
            disabled={!isConnected}
            className={`flex items-center justify-center space-x-2 p-4 rounded-lg font-medium transition-all ${
              isConnected
                ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Bell className="w-5 h-5" />
            <span>Test Notification</span>
          </button>
        </div>

        {/* Sample Event Buttons */}
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => emit('dashboard:subscribe')}
            disabled={!isConnected}
            className="flex flex-col items-center p-3 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 disabled:opacity-50"
          >
            <TrendingUp className="w-5 h-5 text-purple-600 mb-1" />
            <span className="text-sm font-medium text-purple-700">Dashboard</span>
          </button>

          <button
            onClick={() => emit('bookings:subscribe')}
            disabled={!isConnected}
            className="flex flex-col items-center p-3 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 disabled:opacity-50"
          >
            <Calendar className="w-5 h-5 text-blue-600 mb-1" />
            <span className="text-sm font-medium text-blue-700">Bookings</span>
          </button>

          <button
            onClick={() => emit('analytics:subscribe')}
            disabled={!isConnected}
            className="flex flex-col items-center p-3 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 disabled:opacity-50"
          >
            <Zap className="w-5 h-5 text-green-600 mb-1" />
            <span className="text-sm font-medium text-green-700">Analytics</span>
          </button>
        </div>

        {lastTriggered && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700">
              ✅ Sample updates triggered at {lastTriggered}
            </p>
          </div>
        )}

        <div className="text-xs text-gray-500 mt-4">
          <p>• Use "Trigger Live Updates" to see real-time data flow</p>
          <p>• Subscribe buttons will enable specific update channels</p>
          <p>• Check the Live Activity panel for incoming updates</p>
        </div>
      </div>
    </div>
  );
};

export default WebSocketTester;