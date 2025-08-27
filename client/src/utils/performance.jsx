// Frontend Performance Optimization Utilities
import { memo, useEffect, useState } from "react";

// Performance monitoring hook
export const usePerformanceMonitor = (componentName) => {
  useEffect(() => {
    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Log slow renders (> 16ms threshold for 60fps)
      if (renderTime > 16) {
        console.warn(
          `Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`
        );
      }
    };
  });
};

// Debounced state hook for search inputs
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Memoized component wrapper for expensive renders
export const withPerformanceOptimization = (
  Component,
  shouldRerender = () => true
) => {
  return memo(Component, (prevProps, nextProps) => {
    return !shouldRerender(prevProps, nextProps);
  });
};

// Bundle analyzer function for development
export const logBundlePerformance = () => {
  if (import.meta.env.MODE === "development") {
    console.group("🚀 Frontend Performance Metrics");
    console.log(
      "Bundle chunks loaded:",
      document.querySelectorAll("script[src]").length
    );
    console.log("Images loaded:", document.querySelectorAll("img").length);
    console.log(
      "Memory usage:",
      navigator.memory ? navigator.memory.usedJSHeapSize : "Not available"
    );
    console.groupEnd();
  }
};

// Intentionally no default export to avoid mixing components with utilities in this file.
