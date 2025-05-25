import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Work } from '@/types';
import styles from '@/styles/websitework.module.scss';

interface RotatingCarouselProps {
  works: Work[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  optimizeCloudinaryUrl: (url: string, width?: number, height?: number) => string;
}

export default function RotatingCarousel({ 
  works, 
  currentIndex, 
  onIndexChange, 
  optimizeCloudinaryUrl 
}: RotatingCarouselProps) {
  const [isTransitioning, setIsTransitioning] = React.useState(false);

  const handleWorkHover = (targetIndex: number) => {
    if (targetIndex !== currentIndex && !isTransitioning) {
      setIsTransitioning(true);
      onIndexChange(targetIndex);
      
      // トランジション完了後にフラグをリセット
      setTimeout(() => {
        setIsTransitioning(false);
      }, 600);
    }
  };

  return (
    <div className={styles.threeItemCarouselWrapper}>
      <div className={styles.threeItemCarousel}>
        {/* 全作品を配置し、transformで位置制御 */}
        <div className={styles.carouselTrack}>
          {works.map((work, index) => {
            // 現在のインデックスを基準とした相対位置を計算
            let relativePosition = index - currentIndex;
            
            // 循環的な位置計算（左右どちらが近いかを判定）
            if (relativePosition > works.length / 2) {
              relativePosition -= works.length;
            } else if (relativePosition < -works.length / 2) {
              relativePosition += works.length;
            }

            // 表示する要素かどうかを判定（中央±1の範囲）
            const isVisible = Math.abs(relativePosition) <= 1;
            
            // 位置に応じたクラス名
            const positionClass = 
              relativePosition === -1 ? styles.leftWork :
              relativePosition === 0 ? styles.centerWork :
              relativePosition === 1 ? styles.rightWork :
              styles.hiddenWork;

            return (
              <div
                key={work.id} // 安定したkey
                className={`${styles.carouselItem} ${positionClass}`}
                style={{
                  transform: `translate(-50%, -50%) translateX(${relativePosition * 350}px) scale(${
                    relativePosition === 0 ? 1 : 0.8
                  })`,
                  opacity: isVisible ? (relativePosition === 0 ? 1 : 0.6) : 0,
                  pointerEvents: isVisible ? 'auto' : 'none'
                }}
                onMouseEnter={() => handleWorkHover(index)}
              >
                <Link href={`/works/${work.id}`} className={styles.workCardLink}>
                  <div className={`${styles.workCard} ${relativePosition === 0 ? styles.activeCard : ''}`}>
                    <div className={styles.workImageContainer}>
                      {work.mainImage && (
                        <Image
                          src={optimizeCloudinaryUrl(
                            work.mainImage, 
                            relativePosition === 0 ? 420 : 300, 
                            relativePosition === 0 ? 300 : 220
                          )}
                          alt={work.title}
                          width={relativePosition === 0 ? 420 : 300}
                          height={relativePosition === 0 ? 300 : 220}
                          style={{ 
                            width: '100%', 
                            height: '100%',
                            objectFit: 'cover' 
                          }}
                          quality={80}
                          {...(relativePosition === 0 ? { priority: true } : { loading: 'lazy' })}
                        />
                      )}
                    </div>
                    <div className={styles.workCardContent}>
                      <h3>{work.title}</h3>
                      <p>{work.type}</p>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* ページネーションドット */}
      <div className={styles.paginationContainer}>
        <div className={styles.paginationDotsContainer}>
          {works.map((_, index) => (
            <div
              key={index}
              className={`${styles.paginationDot} ${
                index === currentIndex ? styles.activeDot : ''
              }`}
              onClick={() => handleWorkHover(index)}
            >
              <div className={styles.ellipse6}></div>
              {index === currentIndex && <div className={styles.ellipse3}></div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
