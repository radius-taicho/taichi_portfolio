import React, { useState } from "react";
import Image from "next/image";

interface OptimizedLocalImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  style?: React.CSSProperties;
  context: "hero" | "icon" | "thumbnail";
  onClick?: () => void;
  priority?: boolean;
}

const OptimizedLocalImage: React.FC<OptimizedLocalImageProps> = ({
  src,
  alt,
  width,
  height,
  fill = false,
  className,
  style,
  context,
  onClick,
  priority: explicitPriority,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // コンテキスト別最適化設定
  const getOptimizationSettings = () => {
    const settings = {
      hero: {
        quality: 95,
        priority: explicitPriority !== undefined ? explicitPriority : true,
        loading: "eager" as const,
        sizes: "(max-width: 640px) 100vw, (max-width: 1024px) 100vw, (max-width: 1280px) 100vw, (max-width: 1536px) 100vw, 100vw",
        blurDataURL: src.includes('.webp') 
          ? "data:image/webp;base64,UklGRkwAAABXRUJQVlA4IEAAAAAwAgCdASoKAAYAAkA4JaQAA3AA/v3AgAA="
          : "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==",
      },
      icon: {
        quality: 90,
        priority: explicitPriority !== undefined ? explicitPriority : false,
        loading: "lazy" as const,
        sizes: "(max-width: 640px) 192px, (max-width: 1024px) 256px, 320px",
        blurDataURL: src.includes('.gif') 
          ? "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
          : "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==",
      },
      thumbnail: {
        quality: 85,
        priority: explicitPriority !== undefined ? explicitPriority : false,
        loading: "lazy" as const,
        sizes: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
        blurDataURL: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==",
      },
    };

    return settings[context];
  };

  const settings = getOptimizationSettings();

  const handleLoad = () => {
    setIsLoading(false);
    console.log(`✅ Local image loaded: ${src}`);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    console.error(`❌ Failed to load local image: ${src}`);
  };

  // ローディング状態のスタイル
  const loadingStyle = isLoading && context !== 'icon' ? {
    ...style,
    filter: 'blur(2px)',
    transition: 'filter 0.3s ease',
  } : style;

  // エラーフォールバック
  if (hasError) {
    return (
      <div 
        className={className}
        style={{
          ...style,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f3f4f6',
          color: '#9ca3af',
          fontSize: '14px',
        }}
      >
        画像を読み込めませんでした
      </div>
    );
  }

  const imageProps = {
    src,
    alt,
    quality: settings.quality,
    placeholder: "blur" as const,
    blurDataURL: settings.blurDataURL,
    loading: settings.loading,
    priority: settings.priority,
    sizes: settings.sizes,
    onLoad: handleLoad,
    onError: handleError,
    style: loadingStyle,
    className,
    onClick,
  };

  if (fill) {
    return (
      <Image
        {...imageProps}
        fill
      />
    );
  }

  return (
    <Image
      {...imageProps}
      width={width}
      height={height}
    />
  );
};

export default OptimizedLocalImage;
