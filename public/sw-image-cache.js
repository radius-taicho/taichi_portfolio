// 🚀 Service Worker - 画像キャッシュ戦略
const CACHE_NAME = 'taichi-portfolio-images-v2';
const IMAGE_CACHE_NAME = 'taichi-portfolio-images-cache';
const CLOUDINARY_BASE = 'https://res.cloudinary.com';
const LOCAL_IMAGES = '/images';

// キャッシュ戦略
const CACHE_STRATEGIES = {
  hero: {
    strategy: 'CacheFirst',
    maxAge: 24 * 60 * 60 * 1000, // 24時間
  },
  thumbnail: {
    strategy: 'StaleWhileRevalidate',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7日
  },
  detail: {
    strategy: 'NetworkFirst',
    maxAge: 24 * 60 * 60 * 1000, // 24時間
  },
  icon: {
    strategy: 'CacheFirst',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30日
  },
};

// Service Worker install event
self.addEventListener('install', (event) => {
  console.log('🚀 Image Cache Service Worker installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // 重要な画像をプリキャッシュ
      return cache.addAll([
        '/images/img_hero1.webp',
        '/images/tothetop.GIF',
        '/images/figma_img.png',
        '/images/Next.js_img.png',
        '/images/about-taichi-main.webp',
      ]);
    })
  );
  
  self.skipWaiting();
});

// Service Worker activate event
self.addEventListener('activate', (event) => {
  console.log('🔄 Image Cache Service Worker activated');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            return cacheName !== CACHE_NAME && cacheName !== IMAGE_CACHE_NAME;
          })
          .map((cacheName) => {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          })
      );
    })
  );
  
  self.clients.claim();
});

// Fetch event - 画像リクエストのインターセプト
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // 画像リクエストのみ処理
  if (!request.destination.includes('image')) {
    return;
  }
  
  // Cloudinary画像の処理
  if (url.origin.includes('cloudinary.com')) {
    event.respondWith(handleCloudinaryImage(request));
    return;
  }
  
  // ローカル画像の処理
  if (url.pathname.startsWith('/images/')) {
    event.respondWith(handleLocalImage(request));
    return;
  }
});

// Cloudinary画像のキャッシュ戦略
async function handleCloudinaryImage(request) {
  const url = new URL(request.url);
  const context = getImageContext(url.pathname);
  const strategy = CACHE_STRATEGIES[context] || CACHE_STRATEGIES.thumbnail;
  
  const cache = await caches.open(IMAGE_CACHE_NAME);
  const cached = await cache.match(request);
  
  // Cache First 戦略
  if (strategy.strategy === 'CacheFirst' && cached) {
    // キャッシュの有効期限チェック
    const cacheDate = new Date(cached.headers.get('sw-cache-date') || 0);
    const isExpired = Date.now() - cacheDate.getTime() > strategy.maxAge;
    
    if (!isExpired) {
      console.log('📦 Cache hit (CacheFirst):', request.url);
      return cached;
    }
  }
  
  try {
    console.log('🌐 Fetching image:', request.url);
    const response = await fetch(request);
    
    if (response.ok) {
      // レスポンスにキャッシュ日時を追加
      const responseToCache = response.clone();
      const headers = new Headers(responseToCache.headers);
      headers.set('sw-cache-date', new Date().toISOString());
      
      const modifiedResponse = new Response(await responseToCache.blob(), {
        status: responseToCache.status,
        statusText: responseToCache.statusText,
        headers: headers
      });
      
      await cache.put(request, modifiedResponse);
      console.log('💾 Image cached:', request.url);
    }
    
    return response;
  } catch (error) {
    console.warn('❌ Image fetch failed:', request.url, error);
    
    // ネットワークエラー時はキャッシュを返す
    if (cached) {
      console.log('📦 Fallback to cache:', request.url);
      return cached;
    }
    
    // フォールバック画像を返す
    return generateFallbackImage();
  }
}

// ローカル画像のキャッシュ戦略
async function handleLocalImage(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  
  if (cached) {
    console.log('📦 Local image cache hit:', request.url);
    return cached;
  }
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      await cache.put(request, response.clone());
      console.log('💾 Local image cached:', request.url);
    }
    return response;
  } catch (error) {
    console.warn('❌ Local image fetch failed:', request.url, error);
    return generateFallbackImage();
  }
}

// 画像コンテキストの推定
function getImageContext(pathname) {
  if (pathname.includes('hero') || pathname.includes('main')) {
    return 'hero';
  }
  if (pathname.includes('icon') || pathname.includes('small')) {
    return 'icon';
  }
  if (pathname.includes('detail') || pathname.includes('large')) {
    return 'detail';
  }
  return 'thumbnail';
}

// フォールバック画像生成
function generateFallbackImage() {
  const svg = `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="300" fill="#f8f9fa"/>
      <text x="200" y="140" text-anchor="middle" fill="#6c757d" font-family="sans-serif" font-size="16">
        🖼️
      </text>
      <text x="200" y="170" text-anchor="middle" fill="#6c757d" font-family="sans-serif" font-size="14">
        画像を読み込めません
      </text>
    </svg>
  `;
  
  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'no-cache'
    }
  });
}

// パフォーマンス計測
self.addEventListener('message', (event) => {
  if (event.data.type === 'IMAGE_PERFORMANCE') {
    console.log('📊 Image Performance:', event.data.metrics);
  }
});
