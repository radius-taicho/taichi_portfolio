import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useLanguage } from "@/components/providers/LanguageProvider";
import ScrollTopBubble from "@/components/common/ScrollTopBubble";
import { Work } from "@/types";
import styles from "@/styles/components/top_page.module.scss";
import mobileStyles from "@/styles/components/top_page_mobile.module.scss";
import illustrationStyles from "@/styles/components/illustration-grid.module.scss";

// 画面サイズを検知してCSS変数を生成するカスタムフック
const useResponsiveLayout = () => {
  const [windowSize, setWindowSize] = useState({
    width: 1024, // SSR用の固定デフォルト値
    height: 768,
  });
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // クライアント側でのみ実行
    setIsClient(true);

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setWindowSize({ width, height });
      setIsMobile(width < 768);
    };

    handleResize(); // 初期値設定
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // シンプルレスポンシブレイアウト（完全新規作成）
  const getLayoutConfig = (itemCount: number) => {
    if (!isClient) {
      return {
        columns: 3,
        imageSize: 120,
        gap: 16,
        padding: 24,
        frameRadius: 16,
        itemPadding: 12,
        containerMaxWidth: 800,
      };
    }

    const { width } = windowSize;

    // シンプルな列数決定（最大3列まで）
    let columns;
    if (width < 300) columns = 1; // 極小スマホ: 1列
    else if (width < 992) columns = 2; // Md未満: 2列
    else columns = 3; // Md以上: 3列

    // アイテム数が少ない場合は列数を減らす
    columns = Math.min(columns, itemCount);

    // シンプルサイズ計算
    const gap = width < 480 ? 12 : width < 768 ? 14 : 16;
    const padding = width < 480 ? 16 : width < 768 ? 20 : 24;
    const itemPadding = width < 480 ? 8 : width < 768 ? 10 : 12;

    // 安全なコンテナ幅計算（絶対に途切れない）
    const safetyMargin = 40;
    const availableWidth = width - safetyMargin;
    const containerPadding = padding * 2;
    const totalGaps = gap * (columns - 1);
    const totalItemPadding = itemPadding * 2 * columns;

    // 余った幅からアイテムサイズを計算
    const remainingWidth =
      availableWidth - containerPadding - totalGaps - totalItemPadding;
    let imageSize = Math.floor(remainingWidth / columns);

    // サイズ制限でレスポンシブ対応
    const minSize = 80;
    const maxSize = width < 768 ? 160 : 200; // モバイルとデスクトップで最大サイズを変える
    imageSize = Math.max(minSize, Math.min(maxSize, imageSize));

    // 安全なコンテナ幅を再計算
    const actualItemWidth = imageSize + itemPadding * 2;
    const actualContentWidth = actualItemWidth * columns + totalGaps;
    const containerMaxWidth = actualContentWidth + containerPadding;



    return {
      columns,
      imageSize,
      gap,
      padding,
      frameRadius: width < 480 ? 12 : width < 768 ? 14 : 16,
      itemPadding,
      containerMaxWidth: Math.min(containerMaxWidth, availableWidth),
    };
  };

  return { windowSize, isMobile, getLayoutConfig, isClient };
};

export default function MainSection() {
  const { t } = useLanguage();
  const router = useRouter();
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // レスポンシブレイアウトフックを使用
  const { windowSize, isMobile, getLayoutConfig, isClient } =
    useResponsiveLayout();

  // ページトップへスクロールする関数
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

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

  // イラスト・アイコンデザイン作品をメモ化で取得
  const illustrationWorks = useMemo(() => {
    return works.filter(
      (work) =>
        work.type.toLowerCase().includes("illustration") ||
        work.type.toLowerCase().includes("icon")
    );
  }, [works]);

  // フィギュア棚用のアイテムデータをメモ化で生成
  const figureItems = useMemo(() => {
    return illustrationWorks.flatMap((work) => {
      // 新しい画像構造がある場合はそれを使用、なければ従来のmainImageを使用
      if (work.images && work.images.length > 0) {
        const visibleImages = work.images.filter((img) => img.isVisible);

        return visibleImages.map((img) => ({
          id: `${work.id}-${img.id}`,
          workId: work.id,
          title: img.title || work.title,
          imageUrl: img.imageUrl,
          workTitle: work.title,
          workType: work.type,
          rarity: img.rarity || "common",
        }));
      } else if (work.mainImage) {
        // 後方互換性：従来のmainImageを使用
        return [
          {
            id: work.id,
            workId: work.id,
            title: work.title,
            imageUrl: work.mainImage,
            workTitle: work.title,
            workType: work.type,
            rarity: "common",
          },
        ];
      }
      return [];
    });
  }, [illustrationWorks]);

  // 4つのジャンルに分類する関数を削除し、全アイテムを直接使用
  // const categorizeItems = ... は削除

  // カルーセル状態管理を削除
  // const [currentGenre, setCurrentGenre] = useState('icon');
  // const genres = ... は削除

  // 現在のジャンルのアイテムではなく、全アイテムを使用
  const currentItems = figureItems;

  // Webサイト作品を全て取得（制限なし）
  const websiteWorks = works.filter((work) =>
    work.type.toLowerCase().includes("website")
  );

  // 🚀 最優先読み込みの WorkItem コンポーネント
  const WorkItem = ({ work }: { work: Work }) => (
    <Link href={`/works/${work.id}`} className={styles.workCard}>
      <div className={styles.workImageContainer}>
        {work.mainImage ? (
          <Image
            src={work.mainImage}
            alt={work.title}
            width={440}
            height={320}
            className={styles.workImage}
            loading="eager"
            priority={true}
            quality={90}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAUABQDASIAAhEBAxEB/8QAFwABAQEBAAAAAAAAAAAAAAAABQAEAv/EACgQAAIBAwMEAQQDAAAAAAAAAAABAgMEEQAFITEGE0FRYSKBkbHB8P/EABYBAQEBAAAAAAAAAAAAAAAAAAIDAQT/xAAcEQADAQADAQEAAAAAAAAAAAABAgMAESExEkH/2gAMAwEAAhEDEQA/ALuTuxl3ZlYFWjQAEHngk4yM8ccGuNhm2tpk0iQVFVJGAZiTHGCFBySQO/Y/NdOPdaF9ybgZJpAoWpkWGJ1GCWKqMn6hjA5JGck4/FdcdHdeJd01qCkr1dYnCkF0KnOTnAPC5zw2Se+O2ug/d9JY0a2tr0KYY3ijhmV42kjIjDH6A7cFRxjGcnnnPOB6kXZY+1JOLKFqSGMOCm5uUjkcAdwFwTk85Oa4bdb6C2JKqt1HU2mCojCR0bQPJI8pOc7jjAwRj4zgkA49A2rQ7ZJq9K9+0O/S0xSolSNZJiVUnODlSMEnI5+M4Ocef+y13k+iV2qnWNnuV5tqsC6oSrLIhHZlORg/kED4HGtHbaOv1PWU9ovbwvOqMZBkqwDNk8AAHK4A7ds5IHcbrRpDfJf/2Q=="
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
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

  // 🚀 最優先読み込みの MobileWorkCard コンポーネント
  const MobileWorkCard = ({ work }: { work: Work }) => (
    <Link href={`/works/${work.id}`} className={mobileStyles.mobileWorkCard}>
      <div className={mobileStyles.mobileWorkCardImage}>
        {work.mainImage ? (
          <Image
            src={work.mainImage}
            alt={work.title}
            width={343}
            height={214}
            loading="eager"
            priority={true}
            quality={90}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAUABQDASIAAhEBAxEB/8QAFwABAQEBAAAAAAAAAAAAAAAABQAEAv/EACgQAAIBAwMEAQQDAAAAAAAAAAABAgMEEQAFITEGE0FRYSKBkbHB8P/EABYBAQEBAAAAAAAAAAAAAAAAAAIDAQT/xAAcEQADAQADAQEAAAAAAAAAAAABAgMAESExEkH/2gAMAwEAAhEDEQA/ALuTuxl3ZlYFWjQAEHngk4yM8ccGuNhm2tpk0iQVFVJGAZiTHGCFBySQO/Y/NdOPdaF9ybgZJpAoWpkWGJ1GCWKqMn6hjA5JGck4/FdcdHdeJd01qCkr1dYnCkF0KnOTnAPC5zw2Se+O2ug/d9JY0a2tr0KYY3ijhmV42kjIjDH6A7cFRxjGcnnnPOB6kXZY+1JOLKFqSGMOCm5uUjkcAdwFwTk85Oa4bdb6C2JKqt1HU2mCojCR0bQPJI8pOc7jjAwRj4zgkA49A2rQ7ZJq9K9+0O/S0xSolSNZJiVUnODlSMEnI5+M4Ocef+y13k+iV2qnWNnuV5tqsC6oSrLIhHZlORg/kED4HGtHbaOv1PWU9ovbwvOqMZBkqwDNk8AAHK4A7ds5IHcbrRpDfJf/2Q=="
            sizes="(max-width: 480px) 100vw, 343px"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
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

  // JavaScriptとSCSSを組み合わせたイラストレーショングリッド
  const SimpleIllustrationGrid = ({
    isMobile = false,
  }: {
    isMobile?: boolean;
  }) => {
    const layoutConfig = getLayoutConfig(currentItems.length);

    // SSR時はローディング表示
    if (!isClient) {
      return (
        <div className={illustrationStyles.loadingState}>ローディング中...</div>
      );
    }

    // CSS変数を設定するオブジェクト
    const cssVariables = {
      "--grid-columns": layoutConfig.columns,
      "--grid-gap": `${layoutConfig.gap}px`,
      "--grid-frame-padding": `${layoutConfig.padding}px`,
      "--grid-frame-radius": `${layoutConfig.frameRadius}px`,
      "--grid-item-padding": `${layoutConfig.itemPadding}px`,
      "--grid-container-max-width": `${layoutConfig.containerMaxWidth}px`,
      "--grid-image-size": `${layoutConfig.imageSize}px`,
    } as React.CSSProperties;

    return (
      <div className={illustrationStyles.illustrationGrid}>
        <div className={illustrationStyles.gridFrame} style={cssVariables}>
          <div className={illustrationStyles.gridContainer}>
            {currentItems.length > 0 ? (
              currentItems.map((item) => (
                <Link 
                  href={`/works/${item.workId}`} 
                  key={item.id}
                  style={{
                    textDecoration: 'none',
                    color: 'inherit'
                  }}
                >
                  <div className={illustrationStyles.gridItem}>
                    <div className={illustrationStyles.imageBackground}>
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        width={layoutConfig.imageSize}
                        height={layoutConfig.imageSize}
                        className={illustrationStyles.iconImage}
                        loading="eager"
                        priority={true}
                        quality={90}
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAQABADASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABwAF/8QAJRAAAQMDBAICAwAAAAAAAAAAAQIDBAAFEQYSEyEHMRRBFVFh/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAaEQACAwEBAAAAAAAAAAAAAAABAgADESFB/9oADAMBAAIRAxEAPwDVaLrOnx3Vvo1wivSfgzGW4pZHChkE4VjJxnGPvyKw9HXzSL1wtt1Y1u3hLbhSkKdQ6pRO3cTtO04SB5APuqfR9TteqGnINvfcDrA/Eyrh8lOAe4yDnHnFFa7DU1r8OOxHbxgWsHv8/wCz3TbJ+7FbAk2K9kYtFWqNfJB4vtRBBSCT0+Kv/9k="
                        sizes={`${layoutConfig.imageSize}px`}
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <h4 className={illustrationStyles.itemTitle}>
                      {item.title}
                    </h4>
                  </div>
                </Link>
              ))
            ) : (
              <div className={illustrationStyles.emptyState}>
                <div className={illustrationStyles.emptyIcon}>💼</div>
                <p className={illustrationStyles.emptyText}>
                  アイコン作品がまだ登録されていません
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

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
            <div
              style={{
                margin: "40px 0",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <SimpleIllustrationGrid isMobile={false} />
            </div>
          </div>
        </div>
        <div className={styles.bottomSection}>
          <div
            className={styles.decorativeCircle}
            onClick={scrollToTop}
            style={{ cursor: "pointer", position: "relative" }}
          >
            <Image
              src="/images/tothetop.GIF"
              alt="Top of page"
              width={320}
              height={320}
              loading="eager"
              priority={true}
              quality={90}
              sizes="320px"
              style={{ objectFit: 'contain' }}
            />
            {/* デスクトップ用吹き出し */}
            <ScrollTopBubble
              targetSelector={`.${styles.decorativeCircle}`}
              isMobile={false}
            />
          </div>
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
              <div
                style={{
                  margin: "20px 0",
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <SimpleIllustrationGrid isMobile={true} />
              </div>
            </div>
          </div>
        </div>

        {/* プロフィールセクション */}
        <div className={mobileStyles.mobileProfileSection}>
          <div
            className={mobileStyles.mobileProfileImage}
            onClick={scrollToTop}
            style={{ cursor: "pointer", position: "relative" }}
          >
            <Image
              src="/images/tothetop.GIF"
              alt="Top of page"
              width={192}
              height={192}
              loading="eager"
              priority={true}
              quality={90}
              sizes="192px"
              style={{ objectFit: 'contain' }}
            />
            {/* モバイル用吹き出し */}
            <ScrollTopBubble
              targetSelector={`.${mobileStyles.mobileProfileImage}`}
              isMobile={true}
            />
          </div>
        </div>
      </div>
    </>
  );
}
