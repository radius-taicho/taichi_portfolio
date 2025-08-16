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

  // 最適化関数を削除

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
              width={2560}
              height={1440}
              className={styles.heroImage}
              priority={true}
              style={{ objectFit: 'cover' }}
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
