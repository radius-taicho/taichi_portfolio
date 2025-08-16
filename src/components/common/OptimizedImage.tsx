import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { 
  optimizeCloudinaryUrl, 
  useImagePreloader, 
  useIntersectionObserver,
  useImagePerformanceTracker,
  generateSizes
} from '@/lib/imageOptimization';

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

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  quality = 85,
  sizes,
  loading = 'lazy',
  priority = false,
  style,
  onLoad,
  onError,
  context = 'thumbnail',
  enablePreload = true,
  enableLazyLoading = true,
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [fallbackAttempted, setFallbackAttempted] = useState(false);
  const [isInView, setIsInView] = useState(!enableLazyLoading || priority);
  
  const imageRef = useRef<HTMLDivElement>(null);
  const loadStartTime = useRef<number>(0);
  
  // パフォーマンス計測フック
  const { trackImageLoad } = useImagePerformanceTracker();
  
  // プリローダーフック
  const { preloadImage } = useImagePreloader();

  // ローカル画像かCloudinary画像かを判定
  const isLocalImage = src.startsWith('/images/') || src.startsWith('/public/');
  const isCloudinaryImage = src.includes('cloudinary.com');

  // 🚀 新しい高速最適化設定を使用
  const optimizedSrc = isCloudinaryImage 
    ? optimizeCloudinaryUrl(src, width, height, context)
    : src;

  // 動的sizes属性生成
  const finalSizes = sizes || generateSizes(context);

  // Intersection Observer for lazy loading
  const observerCallback = React.useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !isInView) {
        setIsInView(true);
        
        // 🚀 プリロード戦略: 見える前に次の画像をプリロード
        if (enablePreload && isCloudinaryImage) {
          // より高品質な画像をプリロード
          const preloadSrc = optimizeCloudinaryUrl(src, width * 1.2, height * 1.2, 'detail');
          preloadImage(preloadSrc, 'low').catch(() => {});
        }
      }
    });
  }, [isInView, src, width, height, enablePreload, isCloudinaryImage, preloadImage]);

  const observer = useIntersectionObserver(observerCallback, {
    rootMargin: '100px', // 100px前から読み込み開始
    threshold: 0.1,
  });

  useEffect(() => {
    if (observer && imageRef.current && enableLazyLoading && !priority) {
      observer.observe(imageRef.current);
      
      return () => {
        if (imageRef.current) {
          observer.unobserve(imageRef.current);
        }
      };
    }
  }, [observer, enableLazyLoading, priority]);

  // ローカル画像のフォールバック処理（既存の実装を維持）
  const getLocalImageFallbacks = (originalSrc: string) => {
    const fallbacks = [originalSrc];
    
    if (originalSrc.includes('.PNG')) {
      fallbacks.push(originalSrc.replace('.PNG', '.png'));
    }
    if (originalSrc.includes('.GIF')) {
      fallbacks.push(originalSrc.replace('.GIF', '.gif'));
    }
    if (originalSrc.includes('.WEBP')) {
      fallbacks.push(originalSrc.replace('.WEBP', '.webp'));
    }
    
    const baseName = originalSrc.replace(/\.[^/.]+$/, "");
    fallbacks.push(`${baseName}.webp`);
    fallbacks.push(`${baseName}.png`);
    fallbacks.push(`${baseName}.jpg`);
    fallbacks.push(`${baseName}.jpeg`);
    
    return Array.from(new Set(fallbacks));
  };

  const handleImageLoad = () => {
    if (loadStartTime.current > 0) {
      trackImageLoad(loadStartTime.current, optimizedSrc);
    }
    
    setImageLoading(false);
    onLoad?.();
    console.log('✅ Image loaded:', { src: optimizedSrc, context, width, height });
  };

  const handleImageError = (error: any) => {
    console.error('❌ Image failed to load:', {
      original: src,
      optimized: optimizedSrc,
      isLocal: isLocalImage,
      context,
      error: error,
    });

    if (isLocalImage && !fallbackAttempted) {
      setFallbackAttempted(true);
      const fallbacks = getLocalImageFallbacks(src);
      
      if (fallbacks.length > 1) {
        console.log('🔄 Trying fallback images:', fallbacks);
        return;
      }
    }

    setImageError(true);
    setImageLoading(false);
    onError?.();
  };

  // 画像読み込み開始時間を記録
  useEffect(() => {
    if (isInView && !imageError) {
      loadStartTime.current = performance.now();
    }
  }, [isInView, imageError]);

  // エラー時のフォールバック表示
  if (imageError) {
    return (
      <div 
        ref={imageRef}
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
    <div ref={imageRef} style={{ position: 'relative', width, height }}>
      {/* 🚀 高速ローディングスピナー */}
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
            width: '20px', 
            height: '20px', 
            border: '2px solid #dee2e6', 
            borderTop: '2px solid #007bff',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite'
          }}></div>
          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}
      
      {/* 🎯 遅延読み込み対応のImage */}
      {isInView && (
        <Image
          src={optimizedSrc}
          alt={alt}
          width={width}
          height={height}
          className={className}
          quality={quality}
          sizes={finalSizes}
          loading={priority ? 'eager' : 'lazy'}
          priority={priority}
          style={style}
          onLoad={handleImageLoad}
          onError={handleImageError}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        />
      )}
    </div>
  );
};

export default OptimizedImage;
