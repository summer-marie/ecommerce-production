import { memo, useCallback, useEffect, useRef, useState } from "react";

// Optimized image component with lazy loading
export const LazyImage = memo(
  ({ src, alt, className = "", fallbackSrc, ...props }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    const handleLoad = useCallback(() => {
      setIsLoaded(true);
    }, []);

    const handleError = useCallback(() => {
      setHasError(true);
      setIsLoaded(true);
    }, []);

    const imgSrc = hasError && fallbackSrc ? fallbackSrc : src;

    return (
      <div className={`relative ${className}`}>
        {!isLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
        )}
        <img
          src={imgSrc}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={`transition-opacity duration-300 ${
            isLoaded ? "opacity-100" : "opacity-0"
          } ${className}`}
          loading="lazy"
          {...props}
        />
      </div>
    );
  }
);

LazyImage.displayName = "LazyImage";

// Virtualized list component for large datasets
export const VirtualizedList = memo(
  ({ items, renderItem, itemHeight = 80 }) => {
    const [visibleRange, setVisibleRange] = useState({ start: 0, end: 10 });
    const containerRef = useRef(null);

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const handleScroll = () => {
        const scrollTop = container.scrollTop;
        const containerHeight = container.clientHeight;

        const start = Math.floor(scrollTop / itemHeight);
        const end = Math.min(
          start + Math.ceil(containerHeight / itemHeight) + 2,
          items.length
        );

        setVisibleRange({ start, end });
      };

      container.addEventListener("scroll", handleScroll);
      handleScroll(); // Initial calculation

      return () => container.removeEventListener("scroll", handleScroll);
    }, [items.length, itemHeight]);

    const visibleItems = items.slice(visibleRange.start, visibleRange.end);
    const totalHeight = items.length * itemHeight;
    const offsetY = visibleRange.start * itemHeight;

    return (
      <div
        ref={containerRef}
        className="overflow-auto"
        style={{ height: "400px" }}
      >
        <div style={{ height: totalHeight, position: "relative" }}>
          <div style={{ transform: `translateY(${offsetY}px)` }}>
            {visibleItems.map((item, index) =>
              renderItem(item, visibleRange.start + index)
            )}
          </div>
        </div>
      </div>
    );
  }
);

VirtualizedList.displayName = "VirtualizedList";
