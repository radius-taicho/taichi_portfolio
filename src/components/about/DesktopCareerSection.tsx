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

  // Intersection Observerでスクロール位置を監視
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
          threshold: 0.6, // 60%が表示されたらアクティブに
          rootMargin: '-20% 0px -20% 0px' // 上下20%のマージン
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
        {/* タイムライン型レイアウト */}
        <div className={styles.timelineContainer}>
          {careerData.map((item, index) => (
            <div
              key={item.step}
              ref={el => timelineRefs.current[index] = el} // refを追加
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

              {/* 右側: 画像とテキスト */}
              <div className={styles.timelineRight}>
                <div className={styles.timelineContent}>
                  <h4 className={styles.timelineTitle}>{item.title}</h4>
                </div>
                <div className={styles.timelineImageContainer}>
                  <Image
                    src={`/images/img_step${item.step}.PNG`}
                    alt={`Step ${item.step} Image`}
                    width={150}
                    height={150}
                    style={{ objectFit: "contain" }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DesktopCareerSection;
