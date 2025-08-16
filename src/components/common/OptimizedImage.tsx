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
  const [fallbackAttempted, setFallbackAttempted] = useState(false);

  // ローカル画像かCloudinary画像かを判定
  const isLocalImage = src.startsWith('/images/') || src.startsWith('/public/');
  const isCloudinaryImage = src.includes('cloudinary.com');

  // Cloudinary URL最適化
  const optimizeCloudinaryUrl = (url: string, w?: number, h?: number) => {
    if (!url || !url.includes("cloudinary.com")) return url;

    const params = [
      "f_auto",
      "q_auto:good",
      "c_fill",
      w ? `w_${Math.round(w * 1.5)}` : null,
      h ? `h_${Math.round(h * 1.5)}` : null,
      "dpr_auto",
      "fl_progressive",
    ]
      .filter(Boolean)
      .join(",");

    return url.replace("/upload/", `/upload/${params}/`);
  };

  // ローカル画像のフォールバック処理
  const getLocalImageFallbacks = (originalSrc: string) => {
    const fallbacks = [originalSrc];
    
    // 大文字小文字を変更したバージョンを試行
    if (originalSrc.includes('.PNG')) {
      fallbacks.push(originalSrc.replace('.PNG', '.png'));
    }
    if (originalSrc.includes('.GIF')) {
      fallbacks.push(originalSrc.replace('.GIF', '.gif'));
    }
    if (originalSrc.includes('.WEBP')) {
      fallbacks.push(originalSrc.replace('.WEBP', '.webp'));
    }
    
    // 異なる拡張子も試行
    const baseName = originalSrc.replace(/\.[^/.]+$/, "");
    fallbacks.push(`${baseName}.webp`);
    fallbacks.push(`${baseName}.png`);
    fallbacks.push(`${baseName}.jpg`);
    fallbacks.push(`${baseName}.jpeg`);
    
    return [...new Set(fallbacks)];
  };

  // 実際に使用するsrc
  const finalSrc = isCloudinaryImage 
    ? optimizeCloudinaryUrl(src, width, height)
    : src;

  const handleImageLoad = () => {
    setImageLoading(false);
    onLoad?.();
    console.log('✅ Image loaded successfully:', finalSrc);
  };

  const handleImageError = (error: any) => {
    console.error('❌ Image failed to load:', {
      original: src,
      final: finalSrc,
      isLocal: isLocalImage,
      error: error,
    });

    // ローカル画像の場合、フォールバック画像を試行
    if (isLocalImage && !fallbackAttempted) {
      setFallbackAttempted(true);
      const fallbacks = getLocalImageFallbacks(src);
      
      // 次のフォールバック画像を試行
      if (fallbacks.length > 1) {
        console.log('🔄 Trying fallback images:', fallbacks);
        return; // 再度読み込みを試行
      }
    }

    setImageError(true);
    setImageLoading(false);
    onError?.();
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
          backgroundColor: '#f8f9fa',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          border: '2px dashed #dee2e6',
          borderRadius: '8px',
          color: '#6c757d',
        }}
      >
        <div style={{ fontSize: '24px', marginBottom: '8px' }}>🖼️</div>
        <div style={{ fontSize: '12px', textAlign: 'center', padding: '8px', maxWidth: '90%' }}>
          <div style={{ fontWeight: 'bold' }}>画像が見つかりません</div>
          <div style={{ marginTop: '4px', fontSize: '10px', wordBreak: 'break-all', opacity: 0.7 }}>
            {src.length > 40 ? `${src.substring(0, 40)}...` : src}
          </div>
          {isLocalImage && (
            <div style={{ marginTop: '4px', fontSize: '10px', color: '#e74c3c' }}>
              ローカル画像の読み込みに失敗
            </div>
          )}
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
            backgroundColor: '#f8f9fa',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            zIndex: 1,
            borderRadius: '4px',
          }}
        >
          <div style={{ 
            width: '24px', 
            height: '24px', 
            border: '3px solid #dee2e6', 
            borderTop: '3px solid #007bff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}
      <Image
        src={finalSrc}
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
