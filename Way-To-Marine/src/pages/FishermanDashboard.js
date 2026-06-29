import React, { useState, useEffect, useCallback } from "react";
import "./Dashboard.css";
import marineDataService from "../services/marineDataService";

const FishermanDashboard = () => {
  const [marineData, setMarineData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState('connected');

  const showSuccessMessage = useCallback(() => {
    setError('Data refreshed successfully!');
    setTimeout(() => {
      setError(null); // Clear any previous error instead of restoring it
    }, 2000);
  }, []); // Remove error dependency to prevent loops

  const fetchMarineData = useCallback(async (isInitial = false, isAutoRefresh = false) => {
    const handleFetchError = async (err, isInitial) => {
      const newRetryCount = retryCount + 1;
      setRetryCount(newRetryCount);
      
      if (newRetryCount <= 3) {
        setError(`Connection issue (Attempt ${newRetryCount}/3). Retrying...`);
        setConnectionStatus('retrying');
        
        // Exponential backoff retry
        setTimeout(() => {
          fetchMarineData(isInitial);
        }, Math.min(1000 * Math.pow(2, newRetryCount - 1), 10000));
        
      } else {
        setConnectionStatus('disconnected');
        setError('Unable to fetch live data. Displaying cached information.');
        
        // Try to get mock data as fallback
        try {
          const mockData = await marineDataService.getAllMarineData();
          setMarineData(mockData);
        } catch (mockErr) {
          setError('Service temporarily unavailable. Please try again later.');
        }
      }
    };

    try {
      if (!isInitial) {
        setRefreshing(true);
      }
      
      setError(null);
      setConnectionStatus('connected');
      
      const data = await marineDataService.getAllMarineData();
      setMarineData(data);
      setLastUpdated(new Date());
      setRetryCount(0);
      
      // Success feedback for manual refreshes
      if (!isInitial && !isAutoRefresh) {
        showSuccessMessage();
      }
      
    } catch (err) {
      console.error('Error fetching marine data:', err);
      handleFetchError(err, isInitial);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [retryCount, showSuccessMessage]);

  // Enhanced data fetching with retry logic and connection monitoring
  useEffect(() => {
    const initializeDashboard = async () => {
      setLoading(true);
      await fetchMarineData(true);
    };

    initializeDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount
  
  // Separate useEffect for auto-refresh to prevent infinite loops
  useEffect(() => {
    if (!marineData) return; // Don't start auto-refresh until we have initial data
    
    const interval = setInterval(() => {
      if (connectionStatus === 'connected' && !loading && !refreshing) {
        fetchMarineData(false, true);
      }
    }, 600000); // 10 minutes instead of 5 to reduce fluctuation
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marineData]); // Only depend on marineData to prevent infinite loops

  // Monitor connection status
  useEffect(() => {
    const handleOnline = () => {
      setConnectionStatus('connected');
      // Only retry if we had an error and are not currently loading
      if (error && !loading && !refreshing) {
        setRetryCount(0);
        setError(null);
        fetchMarineData(false);
      }
    };
    const handleOffline = () => setConnectionStatus('offline');
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // No dependencies to prevent constant re-registration
  const retryDataFetch = () => {
    setRetryCount(0);
    setError(null);
    fetchMarineData(false);
  };

  const manualRefresh = () => {
    if (!loading && !refreshing) {
      fetchMarineData(false);
    }
  };


  const getTimeAgo = (timestamp) => {
    if (!timestamp) return 'Never';
    
    const now = new Date();
    const diff = Math.floor((now - timestamp) / 1000);
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return timestamp.toLocaleDateString();
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return '#22c55e';
      case 'retrying': return '#f59e0b';
      case 'offline': return '#6b7280';
      case 'disconnected': return '#ef4444';
      default: return '#64ffda';
    }
  };

  if (loading && !marineData) {
    return (
      <div className="dashboard-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading marine data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">🐟 Fisherman Dashboard 🌊</h1>
        <div className="dashboard-controls">
          <div className="status-indicators">
            <div className="connection-status">
              <div 
                className={`status-dot ${connectionStatus}`}
                style={{ backgroundColor: getConnectionStatusColor() }}
              ></div>
              <span className="status-text">
                {connectionStatus === 'connected' && 'Connected'}
                {connectionStatus === 'retrying' && `Retrying ${retryCount}/3`}
                {connectionStatus === 'offline' && 'Offline'}
                {connectionStatus === 'disconnected' && 'No Connection'}
              </span>
            </div>
            
            {lastUpdated && (
              <div className="last-updated">
                <span className="update-label">Last Updated:</span>
                <span className="update-time">{getTimeAgo(lastUpdated)}</span>
              </div>
            )}
          </div>
          
          <div className="action-controls">
            <button 
              className={`refresh-btn ${refreshing ? 'refreshing' : ''}`}
              onClick={manualRefresh} 
              disabled={loading || refreshing}
              title="Manually refresh all marine data"
            >
              <span className={`refresh-icon ${refreshing ? 'spinning' : ''}`}>🔄</span>
              {loading ? 'Loading...' : refreshing ? 'Refreshing...' : 'Refresh Data'}
            </button>
            
            {error && connectionStatus === 'disconnected' && (
              <button 
                className="retry-btn"
                onClick={retryDataFetch}
                title="Retry connection"
              >
                🔌 Retry
              </button>
            )}
          </div>
          
          {error && (
            <div className={`status-message ${error.includes('successfully') ? 'success' : 'error'}`}>
              {error}
            </div>
          )}
        </div>
      </div>
      
      <div className="dashboard-content">
        {/* Left Half - Main Iframe */}
        <div className="dashboard-left">
          <div className="iframe-wrapper">
            <h3 className="iframe-title">
              Marine Navigation & Data - {marineData?.location?.name || 'Loading...'}
            </h3>
            <iframe
              src={`https://www.marinetraffic.com/en/ais/embed/zoom:10/centery:${marineData?.location?.lat || 37.7749}/centerx:${marineData?.location?.lon || -122.4194}/maptype:4/shownames:false/mmsi:0/trackvessel:0/fleet:/fleet_id:/vtypes:/showtrack:false/timespam:24`}
              title="Marine Navigation"
              className="main-iframe"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        {/* Right Half - Weather Iframe and Data Panels */}
        <div className="dashboard-right">
          <div className="iframe-wrapper">
            <h3 className="iframe-title">Weather & Ocean Conditions</h3>
            <iframe
              src={`https://www.windy.com/?${marineData?.location?.lat || 38},${marineData?.location?.lon || -95},8`}
              title="Weather Conditions"
              className="secondary-iframe"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
          
          {/* Real-time Marine Info Panel */}
          <div className={`info-panel ${refreshing ? 'refreshing' : ''}`}>
            <h4>
              🌊 Live Marine Conditions
              {refreshing && <span className="panel-loading">⏳</span>}
            </h4>
            <div className="info-items">
              <div className="info-item">
                <span className="icon">🌡️</span>
                <span className={`data-value ${refreshing ? 'updating' : ''}`}>
                  Water Temp: {refreshing ? '...' : (marineData?.marine?.waterTemperature || '--')}°C
                </span>
              </div>
              <div className="info-item">
                <span className="icon">🌊</span>
                <span className={`data-value ${refreshing ? 'updating' : ''}`}>
                  Wave Height: {refreshing ? '...' : (marineData?.marine?.swellHeight || '--')}m
                </span>
              </div>
              <div className="info-item">
                <span className="icon">💨</span>
                <span className={`data-value ${refreshing ? 'updating' : ''}`}>
                  Wind: {refreshing ? '...' : `${marineData?.weather?.windSpeed || '--'} knots ${marineData?.weather?.windDirection || '--'}`}
                </span>
              </div>
              <div className="info-item">
                <span className="icon">🔽</span>
                <span className={`data-value ${refreshing ? 'updating' : ''}`}>
                  Pressure: {refreshing ? '...' : (marineData?.weather?.pressure || '--')} hPa
                </span>
              </div>
            </div>
          </div>

          {/* Fish Activity Panel */}
          <div className={`info-panel fish-activity-panel ${refreshing ? 'refreshing' : ''}`}>
            <h4>
              🐟 Fish Activity Forecast
              {refreshing && <span className="panel-loading">⏳</span>}
            </h4>
            <div className="fish-activity-score">
              {refreshing ? (
                <div className="activity-indicator loading">
                  <span className="activity-level">Calculating...</span>
                  <span className="activity-score">--/100</span>
                </div>
              ) : (
                <div className={`activity-indicator ${marineData?.fishActivity?.activity?.toLowerCase() || 'low'}`}>
                  <span className="activity-level">{marineData?.fishActivity?.activity || 'Unknown'}</span>
                  <span className="activity-score">{marineData?.fishActivity?.score || 0}/100</span>
                </div>
              )}
            </div>
            <div className="activity-details">
              <div className="best-times">
                <strong>🕐 Best Times:</strong>
                <ul>
                  {(marineData?.fishActivity?.bestTimes || ['Dawn', 'Dusk']).map((time, index) => (
                    <li key={index}>{time}</li>
                  ))}
                </ul>
              </div>
              <div className="recommendations">
                <strong>💡 Tips:</strong>
                <ul>
                  {(marineData?.fishActivity?.recommendations || ['Check conditions']).slice(0, 2).map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Tides Panel */}
          <div className="info-panel tides-panel">
            <h4>🌊 Tide Schedule</h4>
            <div className="tides-info">
              <div className="tide-station">📍 {marineData?.tides?.station || 'Loading...'}</div>
              <div className="tide-times">
                {(marineData?.tides?.tides || []).slice(0, 4).map((tide, index) => (
                  <div key={index} className="tide-item">
                    <span className={`tide-type ${tide.type?.toLowerCase() || ''}`}>
                      {tide.type || 'N/A'}
                    </span>
                    <span className="tide-time">{tide.time || '--'}</span>
                    <span className="tide-height">{tide.height || '--'}ft</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Marine Bubble Animation */}
      <div className="bubble-container">
        <div className="bubble bubble-1"></div>
        <div className="bubble bubble-2"></div>
        <div className="bubble bubble-3"></div>
        <div className="bubble bubble-4"></div>
        <div className="bubble bubble-5"></div>
        <div className="bubble bubble-6"></div>
        <div className="bubble bubble-7"></div>
        <div className="bubble bubble-8"></div>
      </div>
    </div>
  );
};

export default FishermanDashboard;
