"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { HeroImage } from "@/types";
import styles from "@/styles/components/hero.module.scss";

export default function HeroSection() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [heroImage, setHeroImage] = useState<HeroImage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  // Cloudinary URL 最適化関数（サイズ指定なしバージョン）
  const optimizeCloudinaryUrl = (url: string, width?: number, height?: number) => {
    if (!url || !url.includes('cloudinary.com')) return url;
    
    const params = [
      'f_auto', // 自動フォーマット選択（WebP、AVIF等）
      'q_auto:good', // 品質自動調整（good品質）
      width ? `w_${width}` : null,
      height ? `h_${height}` : null,
      'dpr_auto', // デバイスピクセル比対応
      'fl_progressive' // プログレッシブ読み込み
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
      {loading ? (
        <div className={styles.heroImagePlaceholder}>
          <div className={styles.loadingSpinner}></div>
          <span>Loading...</span>
        </div>
      ) : heroImage && !imageError ? (
        <div className={styles.heroContainer}>
          <Image
            src={optimizeCloudinaryUrl(heroImage.imageUrl)}
            alt={heroImage.title}
            fill
            className={styles.heroImage}
            priority
            quality={85}
            onError={handleImageError}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          />
        </div>
      ) : (
        <div className={styles.heroImagePlaceholder}>
          <span>Portfolio Visual</span>
          <p className={styles.noImageText}>
            {error
              ? "エラーが発生しました"
              : "管理画面でHero画像を登録してください"}
          </p>
          {error && (
            <button
              className={styles.retryButton}
              onClick={() => window.location.reload()}
            >
              再読み込み
            </button>
          )}
        </div>
      )}
    </section>
  );
}
