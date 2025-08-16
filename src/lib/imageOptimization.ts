// 🚨 緊急修正: 全ての最適化機能を無効化

// 最適化関数を無効化 - URLをそのまま返す
export const optimizeCloudinaryUrl = (
  url: string,
  width?: number,
  height?: number,
  context?: 'hero' | 'thumbnail' | 'detail' | 'icon'
) => {
  // 最適化処理は行わず、元のURLをそのまま返す
  return url;
};

// プリローダーフックを無効化
export const useImagePreloader = () => {
  return {
    preloadImage: () => Promise.resolve(),
  };
};

// Intersection Observerを無効化
export const useIntersectionObserver = (callback: any, options: any) => {
  return null;
};

// パフォーマンストラッカーを無効化  
export const useImagePerformanceTracker = () => {
  return {
    trackImageLoad: () => {},
  };
};

// サイズ生成を無効化
export const generateSizes = (context?: string) => {
  return undefined;
};
