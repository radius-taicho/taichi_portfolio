"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Head from "next/head";
import { HeroImage } from "@/types";
import styles from "@/styles/components/hero.module.scss";

export default function HeroSection() {
  const [heroImage, setHeroImage] = useState<HeroImage | null>(null);
  const [loading, setLoading] = useState(true);
  const [useDefault, setUseDefault] = useState(false);
  const [imagePreloaded, setImagePreloaded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(true); // 画像の表示状態管理

  // 🎯 ヒーロー画像のプリロード関数
  const preloadHeroImage = (imageSrc: string) => {
    if (typeof window === 'undefined') return;
    
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = imageSrc;
    link.crossOrigin = 'anonymous';
    // ブラウザキャッシュに強制的に保存
    link.setAttribute('cache', 'force-cache');
    document.head.appendChild(link);
    
    // プリロード済みフラグを設定
    setImagePreloaded(true);
  };

  useEffect(() => {
    const fetchHeroImage = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/hero-image");

        if (response.ok) {
          const data = await response.json();
          setHeroImage(data);
          setUseDefault(false);
          console.log("✅ カスタムHero画像を読み込みました");
          // カスタム画像をプリロード
          if (data.imageUrl) {
            preloadHeroImage(data.imageUrl);
          }
        } else if (response.status === 404) {
          // 404の場合はデフォルト画像を使用（エラーではない）
          console.log("ℹ️ カスタムHero画像なし - デフォルト画像を表示");
          setUseDefault(true);
          // デフォルト画像をプリロード
          preloadHeroImage('/images/img_hero1.webp');
        } else {
          throw new Error(`API Error: ${response.status}`);
        }
      } catch (err) {
        console.log("⚠️ Hero画像API呼び出し失敗 - デフォルト画像を表示:", err instanceof Error ? err.message : 'Unknown error');
        setUseDefault(true);
        // エラー時もデフォルト画像をプリロード
        preloadHeroImage('/images/img_hero1.webp');
      } finally {
        setLoading(false);
      }
    };

    fetchHeroImage();
  }, []);

  // 🔍 スクロール時の表示状態管理
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // ビューポートに入ったら表示状態を確実に保持
            setIsVisible(true);
            console.log('👁️ ヒーロー画像が表示エリアに入りました');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px 0px -50px 0px'
      }
    );

    const heroSection = document.querySelector(`.${styles.heroSection}`);
    if (heroSection) {
      observer.observe(heroSection);
    }

    return () => {
      if (heroSection) {
        observer.unobserve(heroSection);
      }
    };
  }, [imageLoaded]);

  // ローディング中の表示：真っ白画面を防ぐ
  if (loading) {
    return (
      <>
        {/* ローディング中もプリロード */}
        <Head>
          <link
            rel="preload"
            as="image"
            href="/images/img_hero1.webp"
            crossOrigin="anonymous"
          />
        </Head>
        
        <section className={styles.heroSection}>
          <div className={styles.heroSectionFrame}>
            <div className={styles.heroContainer}>
              <div className={styles.heroImageWrapper}>
                {/* ローディング中も背景を表示 */}
                <div className={styles.heroImagePlaceholder}>
                  <div className={styles.loadingSpinner}></div>
                  <span>Loading...</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  // 使用する画像を決定
  const imageProps = useDefault || !heroImage ? {
    // デフォルト画像
    src: "/images/img_hero1.webp",
    alt: "Portfolio Hero Image",
    // 真っ白な画面を防ぐグラデーションblurDataURL
    blurDataURL: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImdyYWQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNmOGY5ZmE7c3RvcC1vcGFjaXR5OjEiIC8+PHN0b3Agb2Zmc2V0PSI1MCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNlOWVjZWY7c3RvcC1vcGFjaXR5OjEiIC8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojZGVlMmU2O3N0b3Atb3BhY2l0eToxIiAvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JhZCkiLz48L3N2Zz4="
  } : {
    // カスタムHero画像（Cloudinary）
    src: heroImage.imageUrl,
    alt: heroImage.title || "Custom Hero Image",
    // カスタム画像用のグラデーションblurDataURL
    blurDataURL: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImdyYWQyIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojZjFmM2Y0O3N0b3Atb3BhY2l0eToxIiAvPjxzdG9wIG9mZnNldD0iNTAlIiBzdHlsZT0ic3RvcC1jb2xvcjojZThlYWVkO3N0b3Atb3BhY2l0eToxIiAvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2RhZGNlMDtzdG9wLW9wYWNpdHk6MSIgLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyYWQyKSIvPjwvc3ZnPg=="
  };

  return (
    <>
      {/* 💪 ヒーロー画像の強力なプリロード */}
      <Head>
        <link
          rel="preload"
          as="image"
          href={imageProps.src}
          crossOrigin="anonymous"
        />
        <link
          rel="prefetch"
          href={imageProps.src}
          crossOrigin="anonymous"
        />
      </Head>
      
      <section className={styles.heroSection}>
        <div className={styles.heroSectionFrame}>
        <div className={styles.heroContainer}>
          <div className={styles.heroImageWrapper}>
            <Image
              {...imageProps}
              width={2560}
              height={1440}
              className={styles.heroImage}
              priority={true}
              quality={90}
              loading="eager"
              placeholder="blur"
              sizes="100vw"
              // キャッシュ強化で再読み込み防止
              unoptimized={false}
              onLoad={(e) => {
                console.log('🎆 ヒーロー画像読み込み完了');
                setImageLoaded(true);
                setIsVisible(true);
                // 画像が成功したらコンテナにクラスを追加
                const container = (e.target as HTMLImageElement).closest(`.${styles.heroImageWrapper}`);
                if (container) {
                  container.classList.add(styles.imageLoaded);
                }
              }}
              onError={(e) => {
                console.warn('⚠️ ヒーロー画像エラー - プレースホルダーを維持');
                setImageLoaded(false);
                // エラー時も真っ白にしない
                setIsVisible(true);
              }}
              // 真っ白な画面を防ぐための設定
              style={{
                objectFit: 'cover',
                opacity: isVisible ? 1 : 0.8,
                transition: 'opacity 0.2s ease',
                backgroundColor: 'transparent',
              }}
            />
          </div>
          
          {/* 開発時の状態表示（本番では非表示） */}
          {process.env.NODE_ENV === 'development' && (
            <div className={styles.devInfo}>
              {useDefault ? '🖼️ デフォルト画像' : '✨ カスタム画像'}
            </div>
          )}
        </div>
      </div>
    </section>
    </>
  );
}
