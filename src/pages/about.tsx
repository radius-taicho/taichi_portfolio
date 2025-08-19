import React, { useState, useRef, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ImTaichiGame from "@/components/games/ImTaichiGame";
import MobileCareerSection from "@/components/about/MobileCareerSection";
import DesktopCareerSection from "@/components/about/DesktopCareerSection";
import MobileProfileSection from "@/components/about/MobileProfileSection";
import DesktopProfileSection from "@/components/about/DesktopProfileSection";
import MobileSkillsSection from "@/components/about/MobileSkillsSection";
import DesktopSkillsSection from "@/components/about/DesktopSkillsSection";
import MobileStrengthSection from "@/components/about/MobileStrengthSection";
import DesktopStrengthSection from "@/components/about/DesktopStrengthSection";
import ScrollTopBubble from "@/components/common/ScrollTopBubble";
import styles from "@/styles/aboutme.module.scss";

export default function AboutPage() {
  // Hero表示状態（初期状態は画像、ゲーム開始でImTaichiGame表示）
  const [heroState, setHeroState] = useState<"image" | "game">("image");



  // スキルセクション共通状態（モバイル・デスクトップ間で統一、クリックエフェクト版）
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [clickedSkill, setClickedSkill] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 画面リサイズ時のスキル状態リセット
  useEffect(() => {
    let resizeTimeoutId: NodeJS.Timeout | null = null;
    
    const handleResize = () => {
      // 継続するリサイズイベントをキャンセル
      if (resizeTimeoutId) {
        clearTimeout(resizeTimeoutId);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      
      // 即座にスキル状態をリセット
      setActiveTooltip(null);
      setClickedSkill(null);
      
      // 位置のリセットはデバウンス
      resizeTimeoutId = setTimeout(() => {
        setTooltipPosition({ x: 0, y: 0 });
        resizeTimeoutId = null;
      }, 150);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (resizeTimeoutId) {
        clearTimeout(resizeTimeoutId);
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  // スキル状態管理関数（クリックエフェクト版）
  const skillsState = {
    activeTooltip,
    setActiveTooltip,
    tooltipPosition,
    setTooltipPosition,
    clickedSkill,
    setClickedSkill,
    timeoutRef
  };

  // ページトップへスクロールする関数
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <Head>
        <title>About Me - Taichi Portfolio</title>
        <meta
          name="description"
          content="稲永太一のプロフィール、スキル、経歴について"
        />
      </Head>
      <div className={styles.pageContainer}>
        <Header />

        {/* モバイルレイアウト（デフォルト: sm未満） */}
        <div className={styles.mobileContainer}>
          <div className={styles.sectionFrame}>
            {/* About Me タイトル + Heroグループ */}
            <div className={styles.titleHeroGroup}>
              {/* About Me タイトル */}
              <div className={styles.pageTitleContainer} id="about-section">
                <div className={styles.pageTitleWrapper}>
                  <h1 className={styles.pageTitle}>About Me</h1>
                </div>
              </div>

              {/* Hero セクション */}
              <div className={styles.heroContainer}>
                <div className={styles.heroImageContainer}>
                  <div
                    className={`${styles.heroImage} ${
                      heroState === "game" ? styles.gameMode : ""
                    }`}
                  >
                    {heroState === "image" ? (
                      <div className={styles.heroImageDisplay}>
                        <Image
                          src="/images/about-taichi-main.webp"
                          alt="Taichi Hero Image"
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, (max-width: 2560px) 100vw, 2560px"
                          style={{ objectFit: "cover" }}
                          quality={85}
                          loading="eager"
                          priority
                          placeholder="blur"
                          blurDataURL="data:image/webp;base64,UklGRkwAAABXRUJQVlA4IEAAAAAwAgCdASoKAAYAAkA4JaQAA3AA/v3AgAA="
                        />
                        <button
                          className={styles.heroStartButton}
                          onClick={() => {
                            setHeroState("game");
                            // ゲーム画面を中央にスクロール
                            setTimeout(() => {
                              const heroSection =
                                document.querySelector(
                                  `.${styles.heroContainer}`
                                ) ||
                                document.querySelector(
                                  `.${styles.heroImageContainer}`
                                );
                              if (heroSection) {
                                heroSection.scrollIntoView({
                                  behavior: "smooth",
                                  block: "center",
                                });
                              }
                            }, 100); // DOM更新を待つ
                          }}
                        >
                          start
                        </button>
                      </div>
                    ) : (
                      <div className={`${styles.gameWrapper}`}>
                        <ImTaichiGame 
                          onGameStart={() => {}}
                          onGameEnd={() => {
                            // ゲーム終了時にヒーロー画像に戻す
                            setTimeout(() => {
                              setHeroState("image");
                              // モバイル版でのアスペクト比修正のため、レイアウトを強制リフロー
                              setTimeout(() => {
                                const heroContainer = document.querySelector(`.${styles.heroImageContainer}`);
                                if (heroContainer) {
                                  // スタイルを再適用することでアスペクト比を修正
                                  (heroContainer as HTMLElement).style.display = 'none';
                                  (heroContainer as HTMLElement).offsetHeight; // リフローを強制
                                  (heroContainer as HTMLElement).style.display = '';
                                }
                              }, 50);
                            }, 100);
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Profile セクション - モバイル版カード型コンポーネント */}
            <MobileProfileSection />

            {/* Skills セクション - モバイル版コンポーネント */}
            <MobileSkillsSection skillsState={skillsState} />

            {/* Strength セクション - モバイル版コンポーネント */}
            <MobileStrengthSection />

            {/* Career セクション - モバイル用コンポーネント */}
            <MobileCareerSection />
          </div>
        </div>

        {/* モバイル専用 プロフィール & フッターセクション */}
        <div className={styles.bottomProfileSection}>
          <div
            className={styles.bottomProfileImage}
            onClick={scrollToTop}
            style={{ cursor: "pointer", position: "relative" }}
          >
            <Image
              src="/images/tothetop.GIF"
              alt="Top of page"
              width={192}
              height={192}
              loading="eager"
              priority
              quality={85}
              sizes="192px"
              style={{ objectFit: 'contain' }}
            />
            {/* モバイル用吹き出し */}
            <ScrollTopBubble
              targetSelector={`.${styles.bottomProfileImage}`}
              isMobile={true}
            />
          </div>
        </div>

        {/* デスクトップレイアウト（sm以上） */}
        <div className={styles.desktopContainer}>
        {/* About Me タイトル + Heroグループ */}
        <div className={styles.desktopTitleHeroGroup}>
          {/* About Me タイトルセクション */}
          <div className={styles.desktopPageTitleSection} id="about-section-desktop">
            <h1 className={styles.desktopPageTitle}>About Me</h1>
          </div>

            {/* Hero セクション */}
            <div className={styles.desktopHeroSection}>
              <div className={styles.desktopHeroContainer}>
                <div
                  className={`${styles.desktopHeroImage} ${
                    heroState === "game" ? styles.gameMode : ""
                  }`}
                >
                  {heroState === "image" ? (
                    <div className={styles.desktopHeroImageDisplay}>
                      <Image
                        src="/images/about-taichi-main.webp"
                        alt="Taichi Hero Image"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, (max-width: 2560px) 100vw, 2560px"
                        style={{ objectFit: "cover" }}
                        quality={85}
                        loading="eager"
                        priority
                        placeholder="blur"
                        blurDataURL="data:image/webp;base64,UklGRkwAAABXRUJQVlA4IEAAAAAwAgCdASoKAAYAAkA4JaQAA3AA/v3AgAA="
                      />
                      <button
                        className={styles.desktopHeroStartButton}
                        onClick={() => {
                          setHeroState("game");
                          // ゲーム画面を中央にスクロール
                          setTimeout(() => {
                            const heroSection =
                              document.querySelector(
                                `.${styles.desktopHeroContainer}`
                              ) ||
                              document.querySelector(
                                `.${styles.desktopHeroSection}`
                              );
                            if (heroSection) {
                              heroSection.scrollIntoView({
                                behavior: "smooth",
                                block: "center",
                              });
                            }
                          }, 100); // DOM更新を待つ
                        }}
                      >
                        start
                      </button>
                    </div>
                  ) : (
                    <div className={`${styles.gameWrapper}`}>
                      <ImTaichiGame 
                        onGameStart={() => {}}
                        onGameEnd={() => {
                          // ゲーム終了時にヒーロー画像に戻す
                          setTimeout(() => {
                            setHeroState("image");
                            // レイアウトを強制リフロー
                            setTimeout(() => {
                              const heroContainer = document.querySelector(`.${styles.desktopHeroContainer}`);
                              if (heroContainer) {
                                // スタイルを再適用することでアスペクト比を修正
                                (heroContainer as HTMLElement).style.display = 'none';
                                (heroContainer as HTMLElement).offsetHeight; // リフローを強制
                                (heroContainer as HTMLElement).style.display = '';
                              }
                            }, 50);
                          }, 100);
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Profile セクション - デスクトップ版カード型コンポーネント */}
          <DesktopProfileSection />

          {/* Skills セクション - デスクトップ版コンポーネント */}
          <DesktopSkillsSection skillsState={skillsState} />

          {/* Strength セクション - デスクトップ版コンポーネント */}
          <DesktopStrengthSection />

          {/* Career セクション - デスクトップ用コンポーネント */}
          <DesktopCareerSection />

          {/* デスクトップ専用 デコレーションセクション */}
          <div className={styles.desktopBottomSection}>
            <div
              className={styles.desktopBottomCircle}
              onClick={scrollToTop}
              style={{ cursor: "pointer", position: "relative" }}
            >
              <Image
                src="/images/tothetop.GIF"
                alt="Top of page"
                width={320}
                height={320}
                loading="eager"
                priority
                quality={85}
                sizes="320px"
                style={{ objectFit: 'contain' }}
              />
              {/* デスクトップ用吹き出し */}
              <ScrollTopBubble
                targetSelector={`.${styles.desktopBottomCircle}`}
                isMobile={false}
              />
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}