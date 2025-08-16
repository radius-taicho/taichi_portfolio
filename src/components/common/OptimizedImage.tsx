import React, { useState } from 'react';
import Image from 'next/image';

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
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  quality = 100,
  sizes,
  loading = 'lazy',
  priority = false,
  style,
  onLoad,
  onError,
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Cloudinary URL最適化
  const optimizeCloudinaryUrl = (url: string, w?: number, h?: number) => {
    if (!url || !url.includes("cloudinary.com")) return url;

    const params = [
      "f_auto",
      "q_auto:good", // q_100から変更してパフォーマンス改善
      "c_fill",
      w ? `w_${Math.round(w * 1.5)}` : null, // レティナ対応（2倍から1.5倍に調整）
      h ? `h_${Math.round(h * 1.5)}` : null,
      "dpr_auto",
      "fl_progressive",
    ]
      .filter(Boolean)
      .join(",");

    return url.replace("/upload/", `/upload/${params}/`);
  };

  const optimizedSrc = optimizeCloudinaryUrl(src, width, height);

  const handleImageLoad = () => {
    setImageLoading(false);
    onLoad?.();
    console.log('✅ Image loaded successfully:', optimizedSrc);
  };

  const handleImageError = (error: any) => {
    setImageError(true);
    setImageLoading(false);
    onError?.();
    console.error('❌ Image failed to load:', {
      original: src,
      optimized: optimizedSrc,
      error: error,
    });
  };

  // エラー時のフォールバック表示
  if (imageError) {
    return (
      <div 
        className={className}
        style={{
          ...style,
          width,
          height,
          backgroundColor: '#f5f5f5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          border: '1px dashed #ddd',
          borderRadius: '8px',
        }}
      >
        <div style={{ fontSize: '12px', color: '#999', textAlign: 'center', padding: '8px' }}>
          <div>画像の読み込みに失敗しました</div>
          <div style={{ marginTop: '4px', fontSize: '10px', wordBreak: 'break-all' }}>
            {src.substring(0, 50)}...
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {imageLoading && (
        <div 
          className={className}
          style={{
            ...style,
            width,
            height,
            backgroundColor: '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            zIndex: 1,
          }}
        >
          <div style={{ fontSize: '12px', color: '#666' }}>Loading...</div>
        </div>
      )}
      <Image
        src={optimizedSrc}
        alt={alt}
        width={width}
        height={height}
        className={className}
        quality={quality}
        sizes={sizes}
        loading={loading}
        priority={priority}
        style={style}
        onLoad={handleImageLoad}
        onError={handleImageError}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
      />
    </>
  );
};

export default OptimizedImage;
