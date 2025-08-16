import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Work } from '@/types';
import styles from '@/styles/websitework.module.scss';

interface RotatingCarouselProps {
  works: Work[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  // optimizeCloudinaryUrl プロパティを削除
}

const CAROUSEL_CONFIG = {
  autoplayInterval: 4000, // 4秒
  progressUpdateInterval: 50, // 50msごとに更新
};

export default function RotatingCarousel({ 
  works, 
  currentIndex, 
  onIndexChange
  // optimizeCloudinaryUrl プロパティを削除
}: RotatingCarouselProps) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // refs
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<NodeJS.Timeout | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // タイマーの開始
  const startTimers = useCallback(() => {
    // 既存のタイマーをクリア
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
    if (progressRef.current) {
      clearInterval(progressRef.current);
    }

    // プログレスをリセット
    setProgress(0);

    // 自動スライドタイマー
    autoPlayRef.current = setInterval(() => {
      const nextIndex = (currentIndex + 1) % works.length;
      onIndexChange(nextIndex);
      setProgress(0); // 進行状況をリセット
    }, CAROUSEL_CONFIG.autoplayInterval);

    // 進行状況の更新タイマー
    progressRef.current = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (CAROUSEL_CONFIG.progressUpdateInterval / CAROUSEL_CONFIG.autoplayInterval) * 100;
        return Math.min(newProgress, 100);
      });
    }, CAROUSEL_CONFIG.progressUpdateInterval);
  }, [works.length, onIndexChange, currentIndex]);

  // タイマーのリセット
  const resetTimer = useCallback(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
    if (progressRef.current) {
      clearInterval(progressRef.current);
      progressRef.current = null;
    }

    setProgress(0);

    // 表示中の場合のみ再開
    if (isVisible && works.length > 1) {
      startTimers();
    }
  }, [isVisible, startTimers, works.length]);

  // スライドインデックスの変更時に自動再生タイマーをリセット
  useEffect(() => {
    resetTimer();
  }, [currentIndex, resetTimer]);

  // Intersection Observer の設定
  useEffect(() => {
    if (!carouselRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );

    observerRef.current.observe(carouselRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // 表示状態に基づいてタイマーを制御
  useEffect(() => {
    if (isVisible && works.length > 1) {
      startTimers();
    } else {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
        autoPlayRef.current = null;
      }
      if (progressRef.current) {
        clearInterval(progressRef.current);
        progressRef.current = null;
      }
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
      if (progressRef.current) {
        clearInterval(progressRef.current);
      }
    };
  }, [isVisible, startTimers, works.length]);

  const currentWork = works[currentIndex];

  if (!currentWork) {
    return null;
  }

  return (
    <div 
      ref={carouselRef}
      className={styles.otherWorksCarouselWrapper}
    >
      <div className={styles.otherWorksCarousel}>
        <Link 
          href={`/works/${currentWork.id}`} 
          className={styles.otherWorkLink}
        >
          <div className={styles.otherWorkImageSection}>
            {currentWork.mainImage ? (
              <Image
                src={currentWork.mainImage}
                alt={currentWork.title}
                fill
                className={styles.otherWorkImage}
                quality={100}
                sizes="(max-width: 768px) 90vw, (max-width: 1200px) 80vw, 900px"
                priority={true}
                style={{ objectFit: 'cover' }}
              />
            ) : (
              <div className={styles.otherWorkImagePlaceholder}>
                <span>No Image</span>
              </div>
            )}
          </div>
          
          <div className={styles.otherWorkInfo}>
            <h3 className={styles.otherWorkTitle}>{currentWork.title}</h3>
            <p className={styles.otherWorkType}>{currentWork.type}</p>
          </div>
        </Link>
      </div>

      {/* ページネーションドット */}
      <div className={styles.paginationWrapper}>
        {works.map((_, index) => (
          <div
            key={index}
            className={styles.dotContainer}
            onClick={() => {
              setProgress(0); // クリック時に即座にプログレスをリセット
              onIndexChange(index);
            }}
          >
            {index === currentIndex ? (
              <div className={styles.activeDot}>
                <svg className={styles.progressCircle} width="24" height="24">
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    fill="none"
                    stroke="#E65853"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray={62.83}
                    strokeDashoffset={62.83 * (1 - progress / 100)}
                    transform="rotate(-90 12 12)"
                    style={{
                      transition: progress === 0 ? 'stroke-dashoffset 0.2s ease-out' : 'stroke-dashoffset 0.1s linear'
                    }}
                  />
                </svg>
                <div className={styles.centerDot}></div>
              </div>
            ) : (
              <div className={styles.inactiveDot}></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
