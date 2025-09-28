// Frontend Performance Optimization Utilities
import { memo, useEffect, useState } from "react";
import { logger } from "./logger";

// Performance monitoring hook
export const usePerformanceMonitor = (componentName) => {
  useEffect(() => {
    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Log slow renders (> 16ms threshold for 60fps)
      if (renderTime > 16) {
        logger.warn(
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
    logger.log("🚀 Frontend Performance Metrics");
    logger.debug(
      "Bundle chunks loaded:",
      document.querySelectorAll("script[src]").length
    );
    logger.debug("Images loaded:", document.querySelectorAll("img").length);
    logger.debug(
      "Memory usage:",
      navigator.memory ? navigator.memory.usedJSHeapSize : "Not available"
    );
    // groupEnd removed; using simple log lines via logger
  }
};

// Intentionally no default export to avoid mixing components with utilities in this file.
