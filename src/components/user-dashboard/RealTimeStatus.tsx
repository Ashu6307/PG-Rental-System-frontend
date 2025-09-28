'use client';

import React from 'react';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle,
  Clock
} from 'lucide-react';

interface RealTimeStatusProps {
  showDetails?: boolean;
  className?: string;
}

const RealTimeStatus: React.FC<RealTimeStatusProps> = ({ 
  showDetails = true, 
  className = '' 
}) => {
  const { 
    isConnected, 
    connectionStatus, 
    error, 
    lastUpdate, 
    retryConnection 
  } = useWebSocket();

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'connecting':
        return <RefreshCw className="w-4 h-4 text-yellow-500 animate-spin" />;
      case 'disconnected':
        return <WifiOff className="w-4 h-4 text-gray-400" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Wifi className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Real-time updates active';
      case 'connecting':
        return 'Connecting...';
      case 'disconnected':
        return 'Real-time updates offline';
      case 'error':
        return error || 'Connection error';
      default:
        return 'Unknown status';
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'connecting':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'disconnected':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatLastUpdate = () => {
    if (!lastUpdate) return 'Never';
    const now = new Date();
    const diff = now.getTime() - lastUpdate.getTime();
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return lastUpdate.toLocaleDateString();
  };

  if (!showDetails) {
    return (
      <div className={`inline-flex items-center space-x-2 ${className}`}>
        {getStatusIcon()}
        <span className="text-sm font-medium text-gray-700">
          {isConnected ? 'Live' : 'Offline'}
        </span>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <div className={`inline-flex items-center space-x-3 px-3 py-2 rounded-lg border ${getStatusColor()}`}>
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className="text-sm font-medium">
            {getStatusText()}
          </span>
        </div>
        
        {connectionStatus === 'error' && (
          <button
            onClick={retryConnection}
            className="text-xs px-2 py-1 bg-white border border-red-300 rounded hover:bg-red-50 transition-colors"
          >
            Retry
          </button>
        )}
      </div>
      
      {isConnected && lastUpdate && (
        <div className="flex items-center space-x-1 mt-1 text-xs text-gray-500">
          <Clock className="w-3 h-3" />
          <span>Last update: {formatLastUpdate()}</span>
        </div>
      )}
    </div>
  );
};

export default RealTimeStatus;