// 🚀 Service Worker 登録と画像パフォーマンス監視
export const registerImageCacheServiceWorker = () => {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  // Service Worker登録
  navigator.serviceWorker
    .register('/sw-image-cache.js', {
      scope: '/',
    })
    .then((registration) => {
      console.log('🚀 Image Cache SW registered:', registration.scope);
      
      // Service Workerの更新チェック
      registration.addEventListener('updatefound', () => {
        console.log('🔄 New Image Cache SW version found');
      });
    })
    .catch((error) => {
      console.error('❌ Image Cache SW registration failed:', error);
    });

  // Service Workerとの通信チャネル設定
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data.type === 'IMAGE_CACHE_STATUS') {
      console.log('📊 Image cache status:', event.data);
    }
  });
};

// 画像読み込みパフォーマンス監視
export const trackImagePerformance = (() => {
  const metrics: {
    url: string;
    loadTime: number;
    size?: number;
    context: string;
    cached: boolean;
  }[] = [];

  return {
    track: (url: string, loadTime: number, context: string, cached = false, size?: number) => {
      metrics.push({ url, loadTime, context, cached, size });
      
      // Service Workerに統計情報を送信
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'IMAGE_PERFORMANCE',
          metrics: {
            url,
            loadTime,
            context,
            cached,
            size,
            timestamp: Date.now(),
          },
        });
      }
      
      // パフォーマンス統計をコンソールに出力（開発環境のみ）
      if (process.env.NODE_ENV === 'development') {
        const avg = metrics.reduce((sum, m) => sum + m.loadTime, 0) / metrics.length;
        const cacheHitRate = (metrics.filter(m => m.cached).length / metrics.length) * 100;
        
        console.log(`📈 Image Performance Summary:`, {
          totalImages: metrics.length,
          averageLoadTime: `${avg.toFixed(0)}ms`,
          cacheHitRate: `${cacheHitRate.toFixed(1)}%`,
          latest: { url: url.split('/').pop(), loadTime: `${loadTime}ms`, context, cached }
        });
      }
    },
    
    getMetrics: () => ({ 
      total: metrics.length,
      average: metrics.reduce((sum, m) => sum + m.loadTime, 0) / metrics.length,
      cacheHitRate: (metrics.filter(m => m.cached).length / metrics.length) * 100,
      byContext: metrics.reduce((acc, m) => {
        if (!acc[m.context]) acc[m.context] = [];
        acc[m.context].push(m);
        return acc;
      }, {} as Record<string, typeof metrics>)
    }),
    
    reset: () => {
      metrics.length = 0;
    }
  };
})();

// 重要画像のプリロード
export const preloadCriticalImages = () => {
  if (typeof window === 'undefined') return;
  
  const criticalImages = [
    '/images/img_hero1.webp',
    '/images/figma_img.png',
    '/images/Next.js_img.png',
    '/images/about-taichi-main.webp',
  ];
  
  criticalImages.forEach((src) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
  
  console.log('🎯 Critical images preloaded:', criticalImages.length);
};

// 接続状況に応じた画像品質調整
export const getAdaptiveImageQuality = () => {
  if (typeof window === 'undefined') {
    return { quality: 80, dpr: 1.5 };
  }
  
  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
  
  if (!connection) {
    return { quality: 80, dpr: window.devicePixelRatio > 1 ? 1.5 : 1 };
  }
  
  const { effectiveType, downlink, saveData } = connection;
  
  // Data Saver モード
  if (saveData) {
    return { quality: 70, dpr: 1 };
  }
  
  // 接続速度に応じた品質調整
  switch (effectiveType) {
    case 'slow-2g':
    case '2g':
      return { quality: 60, dpr: 1 };
    case '3g':
      return { quality: 75, dpr: 1.2 };
    case '4g':
    default:
      return { 
        quality: downlink > 10 ? 90 : 80, 
        dpr: window.devicePixelRatio > 1 ? 1.5 : 1 
      };
  }
};

// 画像読み込みエラーの追跡
export const trackImageError = (src: string, error: any, context: string) => {
  console.warn(`❌ Image failed to load:`, {
    src: src.length > 50 ? src.substring(0, 50) + '...' : src,
    context,
    error: error.message || 'Unknown error',
    timestamp: new Date().toISOString()
  });
  
  // エラー統計をService Workerに送信
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'IMAGE_ERROR',
      data: { src, context, error: error.message, timestamp: Date.now() }
    });
  }
};
