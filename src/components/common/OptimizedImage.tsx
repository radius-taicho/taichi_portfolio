import React from 'react';
import Image from 'next/image';

// 🚨 緊急修正: 最適化を完全に無効化し、標準のImageコンポーネントのみ使用
interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  quality?: number;
  sizes?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: () => void;
  context?: 'hero' | 'thumbnail' | 'detail' | 'icon';
  enablePreload?: boolean;
  enableLazyLoading?: boolean;
}

// 完全に標準のImageコンポーネントのラッパーとして動作
const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  quality = 75,
  sizes,
  loading = 'lazy',
  priority = false,
  style,
  onLoad,
  onError,
}) => {
  // 最適化処理は一切行わず、そのままNextjs標準のImageに渡す
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      quality={quality}
      sizes={sizes}
      loading={loading}
      priority={priority}
      style={style}
      onLoad={onLoad}
      onError={onError}
    />
  );
};

export default OptimizedImage;
