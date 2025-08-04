import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Work } from "@/types";
import styles from "@/styles/components/top_page.module.scss";
import mobileStyles from "@/styles/components/top_page_mobile.module.scss";

// 画面サイズを検知するカスタムフック
const useResponsiveLayout = () => {
  const [windowSize, setWindowSize] = useState({
    width: 1024, // SSR用の固定デフォルト値
    height: 768
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
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 画面サイズに応じたレイアウト計算
  const getLayoutConfig = (itemCount: number) => {
    // クライアント側でない場合はデフォルト設定を返す
    if (!isClient) {
      return {
        columns: 4,
        rows: 2,
        imageSize: 180,
        gap: 24,
        padding: 32,
        frameRadius: 24,
        itemPadding: 16,
        itemRadius: 12,
        fontSize: { title: 14, type: 12 },
        containerMaxWidth: 1200
      };
    }
    
    const { width } = windowSize;
    
    // 基本設定
    let config = {
      columns: 4,
      rows: 2,
      imageSize: 180,
      gap: 24,
      padding: 32,
      frameRadius: 24,
      itemPadding: 16,
      itemRadius: 12,
      fontSize: { title: 14, type: 12 },
      containerMaxWidth: 1200
    };

    // 画面サイズ別調整
    if (width < 480) {
      // 超小画面 (スマートフォン縦)
      config = {
        ...config,
        imageSize: Math.max(60, width * 0.15),
        gap: 12,
        padding: 16,
        frameRadius: 12,
        itemPadding: 8,
        itemRadius: 8,
        fontSize: { title: 11, type: 9 },
        containerMaxWidth: width - 32
      };
    } else if (width < 768) {
      // 小画面 (スマートフォン横、小タブレット)
      config = {
        ...config,
        imageSize: Math.max(80, width * 0.12),
        gap: 16,
        padding: 20,
        frameRadius: 16,
        itemPadding: 12,
        itemRadius: 10,
        fontSize: { title: 12, type: 10 },
        containerMaxWidth: width - 40
      };
    } else if (width < 1024) {
      // 中画面 (タブレット)
      config = {
        ...config,
        imageSize: Math.max(120, width * 0.10),
        gap: 20,
        padding: 24,
        frameRadius: 20,
        itemPadding: 14,
        itemRadius: 11,
        fontSize: { title: 13, type: 11 },
        containerMaxWidth: width - 80
      };
    } else if (width < 1440) {
      // 大画面 (デスクトップ)
      config = {
        ...config,
        imageSize: Math.max(150, width * 0.08),
        gap: 24,
        padding: 28,
        frameRadius: 22,
        itemPadding: 15,
        itemRadius: 12,
        fontSize: { title: 14, type: 12 },
        containerMaxWidth: Math.min(1000, width - 100)
      };
    } else {
      // 超大画面 (大型デスクトップ)
      config = {
        ...config,
        imageSize: 180,
        gap: 32,
        padding: 32,
        frameRadius: 24,
        itemPadding: 16,
        itemRadius: 12,
        fontSize: { title: 16, type: 14 },
        containerMaxWidth: 1200
      };
    }

    // アイテム数に応じたレイアウト調整
    if (itemCount === 0) {
      config.columns = 4;
      config.rows = 2;
    } else if (itemCount <= 4) {
      config.columns = Math.min(2, Math.floor(width / (config.imageSize + config.gap + 100)));
      config.rows = Math.ceil(itemCount / config.columns);
    } else if (itemCount <= 8) {
      config.columns = Math.min(4, Math.floor(width / (config.imageSize + config.gap + 100)));
      config.rows = Math.ceil(itemCount / config.columns);
    } else {
      // 9個以上の場合、高さを8個分に制限するため画像を縮小
      config.columns = 4;
      config.rows = Math.ceil(itemCount / 4);
      const maxRows = 2;
      if (config.rows > maxRows) {
        const scaleFactor = maxRows / config.rows;
        config.imageSize = Math.floor(config.imageSize * scaleFactor);
        config.gap = Math.floor(config.gap * scaleFactor);
        config.itemPadding = Math.floor(config.itemPadding * scaleFactor);
        config.fontSize = {
          title: Math.floor(config.fontSize.title * scaleFactor),
          type: Math.floor(config.fontSize.type * scaleFactor)
        };
      }
    }

    return config;
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
  const { windowSize, isMobile, getLayoutConfig, isClient } = useResponsiveLayout();

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
    return works.filter((work) =>
      work.type.toLowerCase().includes("illustration") ||
      work.type.toLowerCase().includes("icon")
    );
  }, [works]);
  
  // フィギュア棚用のアイテムデータをメモ化で生成
  const figureItems = useMemo(() => {
    return illustrationWorks.flatMap(work => {
      // 新しい画像構造がある場合はそれを使用、なければ従来のmainImageを使用
      if (work.images && work.images.length > 0) {
        const visibleImages = work.images.filter(img => img.isVisible);
        
        return visibleImages.map(img => ({
          id: `${work.id}-${img.id}`,
          workId: work.id,
          title: img.title || work.title,
          imageUrl: img.imageUrl,
          workTitle: work.title,
          workType: work.type,
          rarity: img.rarity || 'common'
        }));
      } else if (work.mainImage) {
        // 後方互換性：従来のmainImageを使用
        return [{
          id: work.id,
          workId: work.id,
          title: work.title,
          imageUrl: work.mainImage,
          workTitle: work.title,
          workType: work.type,
          rarity: 'common'
        }];
      }
      return [];
    });
  }, [illustrationWorks]);

  // 4つのジャンルに分類する関数
  const categorizeItems = useMemo(() => {
    const categories = {
      icon: [],
      illustration: [],
      character: [],
      logo: []
    };

    figureItems.forEach(item => {
      const title = item.title.toLowerCase();
      const workType = item.workType.toLowerCase();
      
      // キーワードベースでジャンル分類
      if (title.includes('icon') || workType.includes('icon')) {
        categories.icon.push(item);
      } else if (title.includes('character') || title.includes('キャラクター') || workType.includes('character')) {
        categories.character.push(item);
      } else if (title.includes('logo') || title.includes('ロゴ') || workType.includes('logo')) {
        categories.logo.push(item);
      } else {
        // デフォルトはイラストに分類
        categories.illustration.push(item);
      }
    });

    return categories;
  }, [figureItems]);

  // カルーセル状態管理
  const [currentGenre, setCurrentGenre] = useState('icon');
  const genres = [
    { key: 'icon', label: 'アイコン', emoji: '🎭' },
    { key: 'illustration', label: 'イラスト', emoji: '🎨' },
    { key: 'character', label: 'キャラクター', emoji: '👾' },
    { key: 'logo', label: 'ロゴ', emoji: '🏷️' }
  ];

  // 現在のジャンルのアイテム
  const currentItems = categorizeItems[currentGenre] || [];

  // Webサイト作品を全て取得（制限なし）
  const websiteWorks = works.filter((work) =>
    work.type.toLowerCase().includes("website")
  );
  
  // Cloudinary URL 最適化関数（超最高品質版）
  const optimizeCloudinaryUrl = (
    url: string,
    width?: number,
    height?: number
  ) => {
    if (!url || !url.includes("cloudinary.com")) return url;

    const params = [
      "f_auto", // 自動フォーマット選択（WebP、AVIF等）
      "q_100", // 品質100%（非圧縮・最高品質）
      "c_fill", // クロップ方式でアスペクト比保持
      width ? `w_${Math.round(width * 2)}` : null, // レティナ対応で解像度〢2倍に
      height ? `h_${Math.round(height * 2)}` : null, // レティナ対応で解像度〢2倍に
      "dpr_auto", // デバイスピクセル比自動対応
      "fl_progressive", // プログレッシブ読み込み
      "fl_immutable_cache", // キャッシュ最適化
      "fl_preserve_transparency", // 透明度保持
      "fl_awebp", // 自動WebP変換
      "fl_strip_profile", // メタデータ削除でファイルサイズ最適化
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
            quality={100}
            sizes="(max-width: 768px) 343px, 440px"
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
            quality={100}
            sizes="343px"
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

  // シンプルなイラスト・アイコンデザイン作品表示コンポーネント（JSレスポンシブ制御）
  const SimpleIllustrationGrid = ({ isMobile = false }: { isMobile?: boolean }) => {
    const itemCount = currentItems.length;
    const layoutConfig = getLayoutConfig(itemCount);

    // SSR時は簡素なローディング表示
    if (!isClient) {
      return (
        <div 
          className={isMobile ? mobileStyles.illustrationGridContainer : styles.illustrationGridContainer}
        >
          <div 
            className={isMobile ? mobileStyles.heroStyleFrameJS : styles.heroStyleFrameJS}
            style={{
              padding: '2rem',
              borderRadius: '24px',
              minHeight: isMobile ? '280px' : '400px'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: '#666',
              fontSize: '16px'
            }}>
              ローディング中...
            </div>
          </div>
        </div>
      );
    }

    // コンテナスタイル
    const containerStyle = {
      maxWidth: `${layoutConfig.containerMaxWidth}px`,
      margin: '0 auto'
    };

    // フレームスタイル
    const frameStyle = {
      padding: `${layoutConfig.padding}px`,
      borderRadius: `${layoutConfig.frameRadius}px`,
      minHeight: isMobile ? '280px' : '400px'
    };

    // グリッドスタイル
    const gridStyle = {
      display: 'grid',
      gridTemplateColumns: `repeat(${layoutConfig.columns}, 1fr)`,
      gridTemplateRows: `repeat(${layoutConfig.rows}, 1fr)`,
      gap: `${layoutConfig.gap}px`,
      width: '100%',
      justifyItems: 'center',
      alignItems: 'start'
    };

    // アイテムスタイル
    const itemStyle = {
      padding: `${layoutConfig.itemPadding}px`,
      borderRadius: `${layoutConfig.itemRadius}px`
    };

    // 画像コンテナスタイル
    const imageContainerStyle = {
      width: `${layoutConfig.imageSize}px`,
      height: `${layoutConfig.imageSize}px`,
      borderRadius: `${Math.max(8, layoutConfig.itemRadius - 4)}px`,
      marginBottom: `${Math.max(8, layoutConfig.itemPadding / 2)}px`
    };

    // テキストスタイル
    const titleStyle = {
      fontSize: `${layoutConfig.fontSize.title}px`,
      lineHeight: 1.4
    };

    const typeStyle = {
      fontSize: `${layoutConfig.fontSize.type}px`,
      lineHeight: 1.3
    };

    return (
      <div 
        className={isMobile ? mobileStyles.illustrationGridContainer : styles.illustrationGridContainer}
        style={containerStyle}
      >
        {/* JS制御のレスポンシブフレーム */}
        <div 
          className={isMobile ? mobileStyles.heroStyleFrameJS : styles.heroStyleFrameJS}
          style={frameStyle}
        >
          <div style={gridStyle}>
            {currentItems.length > 0 ? (
              currentItems.map((item) => (
                <Link href={`/works/${item.workId}`} key={item.id}>
                  <div
                    className={`${
                      isMobile ? mobileStyles.illustrationGridItemJS : styles.illustrationGridItemJS
                    }`}
                    style={itemStyle}
                  >
                    <div 
                      className={isMobile ? mobileStyles.illustrationImageContainerJS : styles.illustrationImageContainerJS}
                      style={imageContainerStyle}
                    >
                      <Image
                        src={optimizeCloudinaryUrl(item.imageUrl, layoutConfig.imageSize * 2, layoutConfig.imageSize * 2)}
                        alt={item.title}
                        width={layoutConfig.imageSize}
                        height={layoutConfig.imageSize}
                        className={isMobile ? mobileStyles.illustrationImageJS : styles.illustrationImageJS}
                        quality={90}
                        loading="lazy"
                        sizes={isClient ? (
                          isMobile 
                            ? "(max-width: 480px) 25vw, (max-width: 768px) 20vw, 15vw"
                            : "(max-width: 1024px) 20vw, (max-width: 1440px) 15vw, 12vw"
                        ) : "200px"}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </div>
                    <div className={isMobile ? mobileStyles.illustrationItemInfoJS : styles.illustrationItemInfoJS}>
                      <h4 
                        className={isMobile ? mobileStyles.illustrationItemTitleJS : styles.illustrationItemTitleJS}
                        style={titleStyle}
                      >
                        {item.title}
                      </h4>
                      <p 
                        className={isMobile ? mobileStyles.illustrationItemTypeJS : styles.illustrationItemTypeJS}
                        style={typeStyle}
                      >
                        {item.workType}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div 
                className={isMobile ? mobileStyles.emptyStateJS : styles.emptyStateJS}
                style={{
                  gridColumn: '1 / -1',
                  gridRow: '1 / -1',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  minHeight: '200px'
                }}
              >
                <div className={isMobile ? mobileStyles.emptyStateIcon : styles.emptyStateIcon}>
                  💼
                </div>
                <p className={isMobile ? mobileStyles.emptyStateText : styles.emptyStateText}>
                  {genres.find(g => g.key === currentGenre)?.label}の作品がまだ登録されていません
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ページネーションドット風ジャンル選択 */}
        <div className={isMobile ? mobileStyles.genrePagination : styles.genrePagination}>
          <div className={isMobile ? mobileStyles.genreDots : styles.genreDots}>
            {genres.map((genre) => (
              <button
                key={genre.key}
                onClick={() => setCurrentGenre(genre.key)}
                className={`${
                  isMobile ? mobileStyles.genreDot : styles.genreDot
                } ${
                  currentGenre === genre.key 
                    ? (isMobile ? mobileStyles.activeGenreDot : styles.activeGenreDot)
                    : ''
                }`}
                title={`${genre.label} (${categorizeItems[genre.key]?.length || 0}件)`}
              >
                <span className={isMobile ? mobileStyles.dotEmoji : styles.dotEmoji}>
                  {genre.emoji}
                </span>
                <span className={isMobile ? mobileStyles.dotLabel : styles.dotLabel}>
                  {genre.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* デバッグ情報表示（開発時のみ） */}
        {process.env.NODE_ENV === 'development' && isClient && (
          <div style={{
            position: 'fixed',
            top: '10px',
            right: '10px',
            background: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '8px',
            borderRadius: '4px',
            fontSize: '12px',
            zIndex: 9999
          }}>
            <div>画面: {windowSize.width}x{windowSize.height}</div>
            <div>画像: {layoutConfig.imageSize}px</div>
            <div>グリッド: {layoutConfig.columns}x{layoutConfig.rows}</div>
            <div>アイテム: {itemCount}個</div>
          </div>
        )}
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
            <div className={styles.illustrationContainer}>
              <SimpleIllustrationGrid isMobile={false} />
            </div>
          </div>
        </div>
        <div className={styles.bottomSection}>
          <div
            className={styles.decorativeCircle}
            onClick={scrollToTop}
            style={{ cursor: "pointer" }}
          >
            <Image
              src="/images/tothetop.GIF"
              alt="Top of page"
              width={320}
              height={320}
              loading="lazy"
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
              <div className={mobileStyles.mobileWorksContent}>
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
            style={{ cursor: "pointer" }}
          >
            <Image
              src="/images/tothetop.GIF"
              alt="Top of page"
              width={192}
              height={192}
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </>
  );
}
