import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Work } from "@/types";
import styles from "@/styles/components/top_page.module.scss";
import mobileStyles from "@/styles/components/top_page_mobile.module.scss";

export default function MainSection() {
  const { t } = useLanguage();
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorks = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/works");

        if (response.ok) {
          const data = await response.json();
          setWorks(data);
        } else {
          throw new Error("Failed to fetch works");
        }
      } catch (err) {
        console.error("Error fetching works:", err);
        setError("Failed to load works");
      } finally {
        setLoading(false);
      }
    };

    fetchWorks();
  }, []);

  // Webサイト作品を全て取得（制限なし）
  const websiteWorks = works.filter((work) =>
    work.type.toLowerCase().includes("website")
  );

  // Cloudinary URL 最適化関数
  const optimizeCloudinaryUrl = (
    url: string,
    width?: number,
    height?: number
  ) => {
    if (!url || !url.includes("cloudinary.com")) return url;

    const params = [
      "f_auto", // 自動フォーマット選択（WebP、AVIF等）
      "q_auto:good", // 品質自動調整（good品質）
      "c_fill", // クロップ方式
      width ? `w_${width}` : null,
      height ? `h_${height}` : null,
      "dpr_auto", // デバイスピクセル比対応
      "fl_progressive", // プログレッシブ読み込み
    ]
      .filter(Boolean)
      .join(",");

    return url.replace("/upload/", `/upload/${params}/`);
  };

  const WorkItem = ({ work }: { work: Work }) => (
    <Link href={`/works/${work.id}`} className={styles.workCard}>
      <div className={styles.workImageContainer}>
        {work.mainImage ? (
          <Image
            src={optimizeCloudinaryUrl(work.mainImage, 440, 320)}
            alt={work.title}
            width={440}
            height={320}
            className={styles.workImage}
            quality={85}
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          />
        ) : (
          <div className={styles.workImagePlaceholder}>
            <span>No Image</span>
          </div>
        )}
      </div>
      <div className={styles.workInfo}>
        <h3 className={styles.workTitle}>{work.title}</h3>
        <p className={styles.workType}>{work.type}</p>
      </div>
    </Link>
  );

  // モバイル用作品カードコンポーネント
  const MobileWorkCard = ({ work }: { work: Work }) => (
    <Link href={`/works/${work.id}`} className={mobileStyles.mobileWorkCard}>
      <div className={mobileStyles.mobileWorkCardImage}>
        {work.mainImage ? (
          <Image
            src={optimizeCloudinaryUrl(work.mainImage, 343, 214)}
            alt={work.title}
            width={343}
            height={214}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            quality={85}
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          />
        ) : (
          <span>No Image</span>
        )}
      </div>
      <div className={mobileStyles.mobileWorkCardContent}>
        <h3 className={mobileStyles.mobileWorkCardTitle}>{work.title}</h3>
        <p className={mobileStyles.mobileWorkCardDescription}>{work.type}</p>
      </div>
    </Link>
  );

  const LoadingPlaceholder = () => (
    <div className={styles.workCard}>
      <div className={styles.workImageContainer}>
        <div className={styles.loadingPlaceholder}>
          <div className={styles.loadingSpinner}></div>
        </div>
      </div>
      <div className={styles.workInfo}>
        <div className={styles.loadingText}></div>
        <div className={styles.loadingText}></div>
      </div>
    </div>
  );

  // モバイル用ローディングプレースホルダー
  const MobileLoadingCard = () => (
    <div className={mobileStyles.mobileLoadingCard}>
      <div className={mobileStyles.mobileLoadingImage} />
      <div className={mobileStyles.mobileLoadingContent}>
        <div className={mobileStyles.mobileLoadingText} />
        <div className={mobileStyles.mobileLoadingText} />
      </div>
    </div>
  );

  // エラー表示コンポーネント
  const ErrorDisplay = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div
      className={
        isMobile ? mobileStyles.mobileErrorContainer : styles.errorMessage
      }
    >
      <p className={isMobile ? mobileStyles.mobileErrorMessage : undefined}>
        作品の読み込みでエラーが発生しました
      </p>
      <button
        className={isMobile ? mobileStyles.mobileRetryButton : undefined}
        onClick={() => window.location.reload()}
      >
        再読み込み
      </button>
    </div>
  );

  return (
    <>
      {/* デスクトップレイアウト（既存） */}
      <div id="works-section" className={styles.mainSection}>
        <div className={styles.sectionWrapper}>
          <div className={styles.sectionHeader}>
            <div className={styles.container}>
              <div className={styles.sectionTitle}>{t("works.title")}</div>
            </div>
          </div>
          <div className={styles.sectionContent}>
            <div className={styles.categorySection}>
              <div className={styles.categoryTitle}>{t("works.website")}</div>
            </div>
            <div className={styles.worksContainer}>
              <div className={styles.worksGrid}>
                {loading ? (
                  // ローディング中は4つのプレースホルダーを表示
                  <>
                    <div className={styles.worksRow}>
                      <div className={styles.worksRowContent}>
                        <LoadingPlaceholder />
                        <LoadingPlaceholder />
                      </div>
                    </div>
                    <div className={styles.worksRow}>
                      <div className={styles.worksRowContent}>
                        <LoadingPlaceholder />
                        <LoadingPlaceholder />
                      </div>
                    </div>
                  </>
                ) : error ? (
                  <ErrorDisplay />
                ) : websiteWorks.length > 0 ? (
                  // 作品を2つずつのペアに分けて表示
                  <>
                    {Array.from(
                      { length: Math.ceil(websiteWorks.length / 2) },
                      (_, rowIndex) => (
                        <div key={rowIndex} className={styles.worksRow}>
                          <div className={styles.worksRowContent}>
                            {websiteWorks
                              .slice(rowIndex * 2, rowIndex * 2 + 2)
                              .map((work) => (
                                <WorkItem key={work.id} work={work} />
                              ))}
                          </div>
                        </div>
                      )
                    )}
                  </>
                ) : (
                  <div className={styles.noWorksMessage}>
                    <p>まだWebサイト作品が登録されていません</p>
                  </div>
                )}
              </div>
            </div>
            <div className={styles.categorySection}>
              <div className={styles.categoryTitle}>
                {t("works.illustration")}
              </div>
            </div>
            <div className={styles.illustrationContainer}>
              <div className={styles.illustrationContent}></div>
              <div className={styles.paginationContainer}>
                <div className={styles.pagination}>
                  <div className={styles.paginationItemContainer}>
                    <div className={styles.paginationItem}>
                      <div className={styles.ellipse6}></div>
                      <div className={styles.ellipse3}></div>
                    </div>
                    <div className={styles.paginationItem}>
                      <div className={styles.ellipse62}></div>
                      <div className={styles.ellipse32}></div>
                    </div>
                    <div className={styles.paginationItem}>
                      <div className={styles.ellipse63}></div>
                      <div className={styles.ellipse33}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.bottomSection}>
          <div className={styles.decorativeCircle}></div>
        </div>
      </div>

      {/* モバイルレイアウト（新規追加） */}
      <div id="works-section-mobile" className={mobileStyles.mobileLayout}>
        {/* メインコンテンツコンテナ */}
        <div className={mobileStyles.mobileMainContainer}>
          <div className={mobileStyles.mobileSectionFrame}>
            {/* セクションタイトル */}
            <div className={mobileStyles.mobileSectionTitleContainer}>
              <div className={mobileStyles.mobileSectionTitleWrapper}>
                <h1 className={mobileStyles.mobileSectionTitle}>
                  {t("works.title") || "Works"}
                </h1>
              </div>
            </div>

            {/* Webサイトセクション */}
            <div className={mobileStyles.mobileCategorySection}>
              <div className={mobileStyles.mobileCategoryHeader}>
                <div className={mobileStyles.mobileCategoryTitleContainer}>
                  <h2 className={mobileStyles.mobileCategoryTitle}>
                    {t("works.website") || "Website"}
                  </h2>
                </div>
              </div>

              {/* 作品グリッド */}
              <div className={mobileStyles.mobileWorksContent}>
                {loading ? (
                  <div className={mobileStyles.mobileLoadingContainer}>
                    {Array.from({ length: 4 }, (_, index) => (
                      <MobileLoadingCard key={index} />
                    ))}
                  </div>
                ) : error ? (
                  <ErrorDisplay isMobile />
                ) : websiteWorks.length > 0 ? (
                  <div className={mobileStyles.mobileWorksGrid}>
                    {websiteWorks.map((work) => (
                      <MobileWorkCard key={work.id} work={work} />
                    ))}
                  </div>
                ) : (
                  <div className={mobileStyles.mobileErrorContainer}>
                    <p>まだWebサイト作品が登録されていません</p>
                  </div>
                )}
              </div>
            </div>

            {/* イラスト＆アイコンデザインセクション */}
            <div className={mobileStyles.mobileCategorySection}>
              <div className={mobileStyles.mobileCategoryHeader}>
                <div className={mobileStyles.mobileCategoryTitleContainer}>
                  <h2 className={mobileStyles.mobileCategoryTitle}>
                    {t("works.illustration") || "Illustration & Icon Design"}
                  </h2>
                </div>
              </div>
              <div className={mobileStyles.mobileWorksContent}>
                <div className={mobileStyles.mobileIllustrationContainer} />
              </div>
            </div>
          </div>
        </div>

        {/* プロフィールセクション */}
        <div className={mobileStyles.mobileProfileSection}>
          <div className={mobileStyles.mobileProfileImage} />
        </div>
      </div>
    </>
  );
}
