import { useState, useEffect, useMemo, useCallback } from 'react';

export default function Analytics() {
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('userAnalytics');
    return saved ? JSON.parse(saved) : {
      pageViews: 0,
      propertiesViewed: [],
      favoriteCount: 0,
      comparisons: 0,
      bookings: 0,
      lastVisit: new Date().toISOString(),
      visitDuration: 0,
      popularCategories: { house: 0, kos: 0, car: 0 }
    };
  });

  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    
    setStats(prev => ({
      ...prev,
      pageViews: prev.pageViews + 1,
      lastVisit: new Date().toISOString()
    }));

    return () => {
      const duration = Math.floor((Date.now() - startTime) / 1000);
      setStats(prev => {
        const updatedStats = {
          ...prev,
          visitDuration: prev.visitDuration + duration
        };
        localStorage.setItem('userAnalytics', JSON.stringify(updatedStats));
        return updatedStats;
      });
    };
  }, []);

  const formatDuration = useCallback((seconds) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m`;
  }, []);

  const topCategory = useMemo(() => 
    Object.entries(stats.popularCategories).sort((a, b) => b[1] - a[1])[0],
    [stats.popularCategories]
  );

  const maxCategoryCount = useMemo(() => 
    Math.max(...Object.values(stats.popularCategories), 1),
    [stats.popularCategories]
  );

  const toggleExpanded = useCallback(() => setIsExpanded(prev => !prev), []);

  return (
    <div className={`analytics-widget ${isExpanded ? 'expanded' : ''}`}>
      <button 
        className="analytics-toggle"
        onClick={toggleExpanded}
        title="Your Activity Stats"
        aria-label="Toggle analytics panel"
      >
        📊
      </button>

      {isExpanded && (
        <div className="analytics-panel">
          <div className="analytics-header">
            <h3>Your Activity 📈</h3>
            <button onClick={toggleExpanded} className="close-btn" aria-label="Close analytics">✕</button>
          </div>

          <div className="analytics-stats">
            <div className="stat-card">
              <div className="stat-icon">👁️</div>
              <div className="stat-value">{stats.pageViews}</div>
              <div className="stat-label">Page Views</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🏠</div>
              <div className="stat-value">{stats.propertiesViewed.length}</div>
              <div className="stat-label">Properties Viewed</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">❤️</div>
              <div className="stat-value">{stats.favoriteCount}</div>
              <div className="stat-label">Favorites</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">⏱️</div>
              <div className="stat-value">{formatDuration(stats.visitDuration)}</div>
              <div className="stat-label">Time Spent</div>
            </div>
          </div>

          {topCategory && topCategory[1] > 0 && (
            <div className="analytics-insight">
              <span className="insight-icon">💡</span>
              <span>You&apos;re most interested in <strong>{topCategory[0]}</strong> rentals!</span>
            </div>
          )}

          <div className="analytics-chart">
            <div className="chart-title">Category Interest</div>
            <div className="chart-bars">
              {Object.entries(stats.popularCategories).map(([category, count]) => (
                <div key={category} className="chart-bar-wrapper">
                  <div className="chart-label">{category}</div>
                  <div className="chart-bar-bg">
                    <div 
                      className="chart-bar" 
                      style={{ 
                        width: `${(count / maxCategoryCount) * 100}%` 
                      }}
                    >
                      <span className="bar-value">{count}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
