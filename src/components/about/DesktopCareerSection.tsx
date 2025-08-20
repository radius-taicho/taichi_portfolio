import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import styles from "./DesktopCareerSection.module.scss";

const DesktopCareerSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState(1);
  const timelineRefs = useRef<(HTMLDivElement | null)[]>([]);

  const careerData = [
    {
      step: 1,
      title: "テックキャンプでプログラミングを学ぶ",
    },
    {
      step: 2,
      title: "Figmaの使い方を覚えながらデザインについて学ぶ",
    },
    {
      step: 3,
      title:
        "テックキャンプで実際の案件に携わり、より深くデザインやツールについて学ぶ",
    },
    {
      step: 4,
      title: "Webデザイン会社に就職し実務経験を積みながらスキルに磨きをかける",
    },
    {
      step: 5,
      title:
        "会社で働きながら自分のサービスのデザインをより洗練された興味深いものにして、得た資金で社会貢献する",
    },
  ];

  // Intersection Observerでスクロール位置を監視（画面中央でアクティブ化）
  useEffect(() => {
    const observers = timelineRefs.current.map((ref, index) => {
      if (!ref) return null;
      
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveStep(index + 1);
            }
          });
        },
        {
          threshold: [0.3, 0.5, 0.7], // 複数の閾値で精密に検出
          rootMargin: '-40% 0px -40% 0px' // 画面中央20%の領域でのみアクティブ化
        }
      );
      
      observer.observe(ref);
      return observer;
    });

    return () => {
      observers.forEach(observer => {
        if (observer) {
          observer.disconnect();
        }
      });
    };
  }, []);

  const handleStepHover = (stepNumber: number) => {
    setActiveStep(stepNumber);
  };

  const handleStepClick = (stepNumber: number) => {
    setActiveStep(stepNumber);
  };

  return (
    <div className={styles.desktopSection}>
      <div className={styles.desktopSectionHeader}>
        <div className={styles.desktopSectionTitleContainer}>
          <h2 className={styles.desktopSectionTitle}>Career</h2>
        </div>
      </div>

      <div className={styles.desktopCareerContainer}>
        {/* タイムライン型レイアウト（各アイテム内はグリッド） */}
        <div className={styles.timelineContainer}>
          {careerData.map((item, index) => (
            <div
              key={item.step}
              ref={el => { timelineRefs.current[index] = el; }}
              className={`${styles.timelineItem} ${
                activeStep === item.step ? styles.active : ""
              }`}
              onMouseEnter={() => handleStepHover(item.step)}
              onClick={() => handleStepClick(item.step)}
            >
              {/* 左側: Stepナンバーとライン */}
              <div className={styles.timelineLeft}>
                <div
                  className={`${styles.timelineStep} ${
                    activeStep === item.step ? styles.active : ""
                  }`}
                >
                  {item.step}
                </div>
                {index < careerData.length - 1 && (
                  <div className={styles.timelineLine}></div>
                )}
              </div>

              {/* 中央: テキストコンテンツ */}
              <div className={styles.timelineContent}>
                <h4 className={styles.timelineTitle}>{item.title}</h4>
              </div>

              {/* 右側: 画像 */}
              <div className={styles.timelineImageContainer}>
                <Image
                  src={`/images/img_step${item.step}.PNG`}
                  alt={`Step ${item.step} Image`}
                  width={200}
                  height={200}
                  style={{ objectFit: "contain" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DesktopCareerSection;
