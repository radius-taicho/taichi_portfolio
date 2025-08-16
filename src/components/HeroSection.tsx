"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { HeroImage } from "@/types";
import styles from "@/styles/components/hero.module.scss";

export default function HeroSection() {
  const [heroImage, setHeroImage] = useState<HeroImage | null>(null);
  const [loading, setLoading] = useState(true);
  const [useDefault, setUseDefault] = useState(false);

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
        } else if (response.status === 404) {
          // 404の場合はデフォルト画像を使用（エラーではない）
          console.log("ℹ️ カスタムHero画像なし - デフォルト画像を表示");
          setUseDefault(true);
        } else {
          throw new Error(`API Error: ${response.status}`);
        }
      } catch (err) {
        console.log("⚠️ Hero画像API呼び出し失敗 - デフォルト画像を表示:", err instanceof Error ? err.message : 'Unknown error');
        setUseDefault(true);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroImage();
  }, []);

  // ローディング中の表示
  if (loading) {
    return (
      <section className={styles.heroSection}>
        <div className={styles.heroSectionFrame}>
          <div className={styles.heroContainer}>
            <div className={styles.heroImagePlaceholder}>
              <div className={styles.loadingSpinner}></div>
              <span>Loading...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // 使用する画像を決定
  const imageProps = useDefault || !heroImage ? {
    // デフォルト画像
    src: "/images/img_hero1.webp",
    alt: "Portfolio Hero Image",
    blurDataURL: "data:image/webp;base64,UklGRkwAAABXRUJQVlA4IEAAAAAwAgCdASoKAAYAAkA4JaQAA3AA/v3AgAA="
  } : {
    // カスタムHero画像（Cloudinary）
    src: heroImage.imageUrl,
    alt: heroImage.title || "Custom Hero Image",
    blurDataURL: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
  };

  return (
    <section className={styles.heroSection}>
      <div className={styles.heroSectionFrame}>
        <div className={styles.heroContainer}>
          <Image
            {...imageProps}
            width={2560}
            height={1440}
            className={styles.heroImage}
            priority={true}
            quality={90}
            loading="eager"
            style={{ objectFit: 'cover' }}
            placeholder="blur"
            sizes="100vw"
          />
          
          {/* 開発時の状態表示（本番では非表示） */}
          {process.env.NODE_ENV === 'development' && (
            <div className={styles.devInfo}>
              {useDefault ? '🖼️ デフォルト画像' : '✨ カスタム画像'}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
