import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';

export function FetchConsole() {
  const [logs, setLogs] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Override console methods to capture logs
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;

    const addLog = (level, args) => {
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' ');
      
      // Only capture component fetch related logs
      if (message.includes('ShadCN') || 
          message.includes('GitHub') || 
          message.includes('Fetching') ||
          message.includes('component') ||
          message.includes('fallback')) {
        const logEntry = {
          id: Date.now() + Math.random(),
          level,
          message,
          timestamp: new Date().toLocaleTimeString()
        };
        
        setLogs(prev => [...prev.slice(-50), logEntry]); // Keep last 50 logs
      }
    };

    console.log = (...args) => {
      originalLog(...args);
      addLog('info', args);
    };

    console.warn = (...args) => {
      originalWarn(...args);
      addLog('warn', args);
    };

    console.error = (...args) => {
      originalError(...args);
      addLog('error', args);
    };

    return () => {
      console.log = originalLog;
      console.warn = originalWarn;
      console.error = originalError;
    };
  }, []);

  const clearLogs = () => {
    setLogs([]);
  };

  const getLogIcon = (level) => {
    switch (level) {
      case 'info': return '🔗';
      case 'warn': return '⚠️';
      case 'error': return '❌';
      default: return '📝';
    }
  };

  const getLogColor = (level) => {
    switch (level) {
      case 'info': return 'text-blue-600';
      case 'warn': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button 
          onClick={() => setIsVisible(true)}
          variant="outline"
          size="sm"
          className="bg-white shadow-lg"
        >
          📡 Show Fetch Console ({logs.length})
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-h-96">
      <div className="bg-white rounded-lg shadow-xl border-2">
        <div className="p-4 pb-2 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">
              📡 Component Fetch Console
            </h3>
            <div className="flex gap-2">
              <Button 
                onClick={clearLogs}
                variant="ghost" 
                size="sm"
                className="h-6 px-2 text-xs"
              >
                Clear
              </Button>
              <Button 
                onClick={() => setIsVisible(false)}
                variant="ghost" 
                size="sm"
                className="h-6 px-2 text-xs"
              >
                ✕
              </Button>
            </div>
          </div>
        </div>
        <div className="p-4 pt-2">
          <div className="bg-gray-50 rounded-md p-3 max-h-64 overflow-y-auto">
            {logs.length === 0 ? (
              <div className="text-gray-500 text-sm text-center py-4">
                No component fetches yet. Try generating a component!
              </div>
            ) : (
              <div className="space-y-2">
                {logs.map((log) => (
                  <div key={log.id} className="flex items-start gap-2 text-xs">
                    <span className="text-gray-400 shrink-0">
                      {log.timestamp}
                    </span>
                    <span className="shrink-0">
                      {getLogIcon(log.level)}
                    </span>
                    <div className={`${getLogColor(log.level)} flex-1 break-words`}>
                      {log.message}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}