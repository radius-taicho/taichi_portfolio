import React, { useState } from "react";
import Image from "next/image";
import styles from "./MobileProfileSection.module.scss";

export default function MobileProfileSection() {
  const [isSecondImage, setIsSecondImage] = useState(false);

  const toggleImage = () => {
    setIsSecondImage(prev => !prev);
  };

  return (
    <div className={styles.sectionContainer} data-section="profile">
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitleContainer}>
          <h2 className={styles.sectionTitle}>Profile</h2>
        </div>
      </div>
      
      {/* モバイル版カード型プロフィール */}
      <div className={styles.mobileCardProfileContainer}>
        <div className={styles.profileCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardProfileImageContainer}>
              <div className={styles.cardProfileImage}>
                <Image
                  src={isSecondImage ? "/images/img_profile-taichi2.PNG" : "/images/taichi-silent.PNG"}
                  alt="稲永太一 プロフィール画像"
                  fill
                  sizes="(max-width: 768px) 140px, 140px"
                  style={{ objectFit: "cover" }}
                  quality={90}
                  priority
                />
                <button 
                  className={styles.imageToggleButton}
                  onClick={toggleImage}
                  aria-label="プロフィール画像を切り替える"
                >
                  ↻
                </button>
              </div>
            </div>
            <div className={styles.cardProfileHeader}>
              <div className={styles.cardNameFurigana}>いねながたいち</div>
              <h3 className={styles.cardName}>稲永太一</h3>
            </div>
          </div>
          
          <div className={styles.cardDivider}></div>
          
          <div className={styles.cardContent}>
            <div className={styles.cardSection}>
              <div className={styles.cardSectionTitle}>出身地</div>
              <p className={styles.cardText}>
                1998年生まれ、福岡県春日市出身。武蔵そばと大きい公園以外は特に何もないところですが、その何もないがあるところが好きです。
              </p>
            </div>
            
            <div className={styles.cardSection}>
              <div className={styles.cardSectionTitle}>キャリアのきっかけ</div>
              <p className={styles.cardText}>
                フリーターとして生活していましたが、25歳となった冬に自分の将来について真剣に考えたことをきっかけとして、IT業界で働くため翌年の5月にテックキャンプを利用開始。
              </p>
            </div>
            
            <div className={styles.cardSection}>
              <div className={styles.cardSectionTitle}>デザイナーへの道</div>
              <p className={styles.cardText}>
                エンジニアを目指していましたが、「どうやったら興味を引くデザインにできるか」に魅力を感じ、webデザイナーの道を選びました。常にユーザー視点で「どう感じるか」「どんな行動を取りたくなるか」を意識してデザインしています。
              </p>
            </div>
            
            <div className={styles.cardSection}>
              <div className={styles.cardSectionTitle}>ポリシー</div>
              <p className={styles.cardText}>
                見た目の美しさだけでなく、ユーザーの行動や感情に働きかけるデザインを目指しています。データ分析も活用し、チームと連携してプロジェクト全体の成功に貢献したいです。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
