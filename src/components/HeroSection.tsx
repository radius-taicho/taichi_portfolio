"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { HeroImage } from "@/types";
import styles from "@/styles/components/hero.module.scss";

export default function HeroSection() {
  const { t } = useLanguage();
  const [heroImage, setHeroImage] = useState<HeroImage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  // Cloudinary URL 最適化関数（最高品質版）
  const optimizeCloudinaryUrl = (url: string, width?: number, height?: number) => {
    if (!url || !url.includes('cloudinary.com')) return url;
    
    const params = [
      'f_auto', // 自動フォーマット選択（WebP、AVIF等）
      'q_100', // 品質100%（最高品質・非圧縮レベル）
      width ? `w_${width}` : 'w_2560', // 4K対応の最大幅を設定
      height ? `h_${height}` : null,
      'c_fill', // クロップ方式
      'dpr_auto', // デバイスピクセル比対応
      'fl_progressive', // プログレッシブ読み込み
      'fl_immutable_cache', // キャッシュ最適化
      'fl_preserve_transparency' // 透明度保持
    ].filter(Boolean).join(',');
    
    return url.replace('/upload/', `/upload/${params}/`);
  };

  useEffect(() => {
    const fetchHeroImage = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/hero-image");

        if (response.ok) {
          const data = await response.json();
          setHeroImage(data);
        } else if (response.status === 404) {
          // アクティブなHeroImageが見つからない場合
          console.log("No active hero image found");
          setHeroImage(null);
        } else {
          throw new Error("Failed to fetch hero image");
        }
      } catch (err) {
        console.error("Error fetching hero image:", err);
        setError("Failed to load hero image");
      } finally {
        setLoading(false);
      }
    };

    fetchHeroImage();
  }, []);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <section className={styles.heroSection}>
      <div className={styles.heroSectionFrame}>
        {loading ? (
          <div className={styles.heroImagePlaceholder}>
            <div className={styles.loadingSpinner}></div>
            <span>Loading...</span>
          </div>
        ) : (
          // 常にデフォルト画像を表示
          <div className={styles.heroContainer}>
            <Image
              src="/images/img_hero1.webp"
              alt="Portfolio Hero Image"
              fill
              className={styles.heroImage}
              priority
              quality={100}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, (max-width: 2560px) 100vw, 2560px"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            />
          </div>
        )}
        {/* Cloudinaryのエラー時の情報表示（オプション） */}
        {!loading && error && (
          <div className={styles.heroImagePlaceholder}>
            <p className={styles.noImageText}>
              管理画面のHero画像を読み込めませんでした。デフォルト画像を表示しています。
            </p>
            <button
              className={styles.retryButton}
              onClick={() => window.location.reload()}
            >
              再読み込み
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
