// Performance monitoring component for development
import { useEffect, useState } from 'react';

const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({
    memoryUsage: 0,
    renderTime: 0,
    bundleSize: 0,
    imageCount: 0
  });

  useEffect(() => {
    if (import.meta.env.MODE !== 'development') return;

    const updateMetrics = () => {
      const memory = navigator.memory?.usedJSHeapSize || 0;
      const scripts = document.querySelectorAll('script[src]').length;
      const images = document.querySelectorAll('img').length;

      setMetrics({
        memoryUsage: (memory / 1024 / 1024).toFixed(2), // MB
        bundleSize: scripts,
        imageCount: images,
        renderTime: performance.now()
      });
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 5000);

    return () => clearInterval(interval);
  }, []);

  if (import.meta.env.MODE !== 'development') return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white p-2 rounded text-xs z-50">
      <div className="font-bold mb-1">🚀 Performance</div>
      <div>Memory: {metrics.memoryUsage}MB</div>
      <div>Scripts: {metrics.bundleSize}</div>
      <div>Images: {metrics.imageCount}</div>
    </div>
  );
};

export default PerformanceMonitor;
