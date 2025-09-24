import React, { useState, useEffect } from 'react';
import heartbeatService from '../services/heartbeatService';

interface HeartbeatStatusProps {
  showDetails?: boolean;
}

const HeartbeatStatus: React.FC<HeartbeatStatusProps> = ({ showDetails = false }) => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [lastCheck, setLastCheck] = useState<string>('');
  const [serverInfo, setServerInfo] = useState<any>(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const result = await heartbeatService.manualCheck();
        setIsConnected(result);
        setLastCheck(new Date().toLocaleTimeString());
        
        if (result) {
          // If we want to show server details, we could fetch them here
          // For now, just show basic status
        }
      } catch (error) {
        setIsConnected(false);
        setLastCheck(new Date().toLocaleTimeString());
      }
    };

    // Initial check
    checkStatus();

    // Check every 30 seconds for UI updates
    const interval = setInterval(checkStatus, 30000);

    return () => clearInterval(interval);
  }, []);

  if (!showDetails) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div className={`w-3 h-3 rounded-full ${
          isConnected === null ? 'bg-yellow-400' : 
          isConnected ? 'bg-green-400' : 'bg-red-400'
        }`} title={
          isConnected === null ? 'Checking connection...' :
          isConnected ? `Connected - Last check: ${lastCheck}` :
          `Disconnected - Last check: ${lastCheck}`
        } />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-800">Server Status</h3>
        <div className={`w-3 h-3 rounded-full ${
          isConnected === null ? 'bg-yellow-400' : 
          isConnected ? 'bg-green-400' : 'bg-red-400'
        }`} />
      </div>
      
      <div className="space-y-2 text-sm text-gray-600">
        <div>
          <span className="font-medium">Status:</span> 
          <span className={`ml-2 ${
            isConnected === null ? 'text-yellow-600' :
            isConnected ? 'text-green-600' : 'text-red-600'
          }`}>
            {isConnected === null ? 'Checking...' :
             isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
        
        <div>
          <span className="font-medium">Last Check:</span> 
          <span className="ml-2">{lastCheck || 'Never'}</span>
        </div>
        
        {serverInfo && (
          <>
            <div>
              <span className="font-medium">Environment:</span> 
              <span className="ml-2">{serverInfo.environment}</span>
            </div>
            <div>
              <span className="font-medium">Uptime:</span> 
              <span className="ml-2">{Math.floor(serverInfo.uptime / 60)} minutes</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HeartbeatStatus;
