"use client";

import { useRef, useEffect, useState } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useRouter } from "next/navigation";
import { FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import styles from "@/styles/components/footer.module.scss";

export default function Footer() {
  const { language, setLanguage } = useLanguage();
  const router = useRouter();
  const mobileBackgroundRef = useRef<HTMLDivElement>(null);
  const desktopBackgroundRef = useRef<HTMLDivElement>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // ホバーイベントを設定
  useEffect(() => {
    // 背景画像とアイコン位置を変更する関数
    const changeBackgroundWithPosition = (
      element: HTMLElement,
      imagePath: string,
      isXBackground: boolean
    ) => {
      element.style.backgroundImage = `url("${imagePath}")`;

      // X背景の時だけアイコンを少し下げる
      const leftEyeIcon = element.querySelector(
        `.${styles.leftEye}`
      ) as HTMLElement;
      const rightEyeIcon = element.querySelector(
        `.${styles.rightEye}`
      ) as HTMLElement;

      if (isXBackground) {
        // X背景: アイコンを少し下げる
        if (leftEyeIcon) leftEyeIcon.style.top = "47%";
        if (rightEyeIcon) rightEyeIcon.style.top = "47%";
      } else {
        // Instagram背景: デフォルト位置
        if (leftEyeIcon) leftEyeIcon.style.top = "42%";
        if (rightEyeIcon) rightEyeIcon.style.top = "42%";
      }
    };

    // 初期背景画像を設定する関数（一度だけ実行）
    const setInitialBackground = () => {
      // デフォルトでX背景を設定
      const defaultImagePath = "/images/x-background.png";

      if (mobileBackgroundRef.current) {
        changeBackgroundWithPosition(
          mobileBackgroundRef.current,
          defaultImagePath,
          true
        );
      }

      if (desktopBackgroundRef.current) {
        changeBackgroundWithPosition(
          desktopBackgroundRef.current,
          defaultImagePath,
          true
        );
      }
    };

    // イベント設定関数（ホバー）
    const setupHoverEvents = (
      iconElement: HTMLElement | null,
      backgroundElement: HTMLElement | null,
      imagePath: string,
      isXBackground: boolean
    ) => {
      if (!iconElement || !backgroundElement) return;

      const handleMouseEnter = () => {
        // 遷移中でなければ背景を変更
        if (!isTransitioning) {
          changeBackgroundWithPosition(
            backgroundElement,
            imagePath,
            isXBackground
          );
        }
      };

      iconElement.addEventListener("mouseenter", handleMouseEnter);

      return () => {
        iconElement.removeEventListener("mouseenter", handleMouseEnter);
      };
    };

    // クリックイベント設定関数
    const setupClickEvents = (
      iconElement: HTMLElement | null,
      backgroundElement: HTMLElement | null,
      imagePath: string,
      isXBackground: boolean,
      url: string
    ) => {
      if (!iconElement || !backgroundElement) return;

      const handleClick = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();

        // すでに遷移中の場合は何もしない
        if (isTransitioning) return;

        setIsTransitioning(true);

        // 背景画像を変更
        changeBackgroundWithPosition(
          backgroundElement,
          imagePath,
          isXBackground
        );

        // 1秒後に画面遷移
        setTimeout(() => {
          window.open(url, "_blank", "noopener,noreferrer");
          setIsTransitioning(false);
          // クリックしたアイコンに対応する背景を保持（元に戻さない）
        }, 1000);
      };

      const handleTouchStart = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        handleClick(e);
      };

      // マウスとタッチの両方に対応
      iconElement.addEventListener("click", handleClick);
      iconElement.addEventListener("touchstart", handleTouchStart, {
        passive: false,
      });

      return () => {
        iconElement.removeEventListener("click", handleClick);
        iconElement.removeEventListener("touchstart", handleTouchStart);
      };
    };

    // 初期背景画像を設定（一度だけ）
    setInitialBackground();

    // モバイル版のイベント設定
    const mobileBackground = mobileBackgroundRef.current;
    const mobileInstagramIcon = mobileBackground?.querySelector(
      `.${styles.rightEye}`
    ) as HTMLElement;
    const mobileXIcon = mobileBackground?.querySelector(
      `.${styles.leftEye}`
    ) as HTMLElement;

    // ホバーイベント
    const mobileInstagramHoverCleanup = setupHoverEvents(
      mobileInstagramIcon,
      mobileBackground,
      "/images/instagram-background.png",
      false
    );
    const mobileXHoverCleanup = setupHoverEvents(
      mobileXIcon,
      mobileBackground,
      "/images/x-background.png",
      true
    );

    // クリックイベント
    const mobileInstagramClickCleanup = setupClickEvents(
      mobileInstagramIcon,
      mobileBackground,
      "/images/instagram-background.png",
      false,
      "https://www.instagram.com/radius.taichi/"
    );
    const mobileXClickCleanup = setupClickEvents(
      mobileXIcon,
      mobileBackground,
      "/images/x-background.png",
      true,
      "https://x.com/radius_taicho"
    );

    // デスクトップ版のイベント設定
    const desktopBackground = desktopBackgroundRef.current;
    const desktopInstagramIcon = desktopBackground?.querySelector(
      `.${styles.rightEye}`
    ) as HTMLElement;
    const desktopXIcon = desktopBackground?.querySelector(
      `.${styles.leftEye}`
    ) as HTMLElement;

    // ホバーイベント
    const desktopInstagramHoverCleanup = setupHoverEvents(
      desktopInstagramIcon,
      desktopBackground,
      "/images/instagram-background.png",
      false
    );
    const desktopXHoverCleanup = setupHoverEvents(
      desktopXIcon,
      desktopBackground,
      "/images/x-background.png",
      true
    );

    // クリックイベント
    const desktopInstagramClickCleanup = setupClickEvents(
      desktopInstagramIcon,
      desktopBackground,
      "/images/instagram-background.png",
      false,
      "https://www.instagram.com/radius.taichi/"
    );
    const desktopXClickCleanup = setupClickEvents(
      desktopXIcon,
      desktopBackground,
      "/images/x-background.png",
      true,
      "https://x.com/radius_taicho"
    );

    // クリーンアップ
    return () => {
      mobileInstagramHoverCleanup?.();
      mobileXHoverCleanup?.();
      mobileInstagramClickCleanup?.();
      mobileXClickCleanup?.();
      desktopInstagramHoverCleanup?.();
      desktopXHoverCleanup?.();
      desktopInstagramClickCleanup?.();
      desktopXClickCleanup?.();
    };
  }, []); // 依存配列を空にして初期化時のみ実行

  // スムーズスクロール関数（Works用）
  const scrollToWorksSection = (e: React.MouseEvent) => {
    e.preventDefault();

    const scrollToElement = () => {
      // モバイルサイズかどうかを判定（768px以下をモバイルとする）
      const isMobile = window.innerWidth < 768;
      const elementId = isMobile ? "works-section-mobile" : "works-section";
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    };

    // 現在のページがトップページの場合はスクロールのみ
    if (router.pathname === "/") {
      scrollToElement();
    } else {
      // 他のページからの場合はトップページに遷移してからスクロール
      router.push("/").then(() => {
        // ページ遷移後に少し待ってからスクロール
        setTimeout(scrollToElement, 100);
      });
    }
  };

  // スムーズスクロール関数（Contact用） -> 通常のページ遷移に変更
  const navigateToContact = (e: React.MouseEvent) => {
    e.preventDefault();

    // 直接Contactページに遷移
    router.push("/contact");
  };

  // スムーズスクロール関数（About用） -> 通常のページ遷移に変更
  const navigateToAbout = (e: React.MouseEvent) => {
    e.preventDefault();

    // 直接Aboutページに遷移
    router.push("/about");
  };

  // トップページに遷移する関数
  const navigateToHome = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push("/");
  };

  return (
    <footer className={styles.footer}>
      {/* モバイル版レイアウト */}
      <div className={styles.mobileLayout}>
        {/* ヘッダー部分 */}
        <div className={styles.mobileHeader}>
          <div className={styles.mobileBrandSection}>
            <div className={styles.mobileBrandContainer}>
              <div
                className={styles.mobileBrandName}
                data-text="TAICHI"
                onClick={navigateToHome}
                onTouchStart={(e) => {
                  e.preventDefault();
                  navigateToHome(e as any);
                }}
              >
                TAICHI
              </div>
            </div>
            <div className={styles.mobileSocialIcons}>
              {/* 顔の背景コンテナ */}
              <div className={styles.faceContainer} ref={mobileBackgroundRef}>
                {/* X (Twitter) - 左目 */}
                <div className={styles.socialLink}>
                  <FaXTwitter
                    className={`${styles.socialIcon} ${styles.leftEye}`}
                  />
                </div>

                {/* Instagram - 右目 */}
                <div className={styles.socialLink}>
                  <FaInstagram
                    className={`${styles.socialIcon} ${styles.rightEye}`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className={styles.mobileMainContent}>
          {/* ナビゲーション */}
          <div className={styles.mobileNavigation}>
            <button
              className={styles.mobileNavLink}
              onClick={scrollToWorksSection}
              data-text="Works"
            >
              Works
            </button>
            <button
              className={styles.mobileNavLink}
              onClick={navigateToAbout}
              data-text="About"
            >
              About
            </button>
            <button
              className={styles.mobileNavLink}
              onClick={navigateToContact}
              data-text="Contact"
            >
              Contact
            </button>
          </div>

          {/* 設定セクション */}
          <div className={styles.mobileSettings}>
            <div className={styles.mobileLanguageSettings}>
              <div className={styles.mobileSettingTitle}>言語設定(実装中)</div>
              <div className={styles.mobileLanguageOptions}>
                <div className={styles.mobileSettingOption} data-text="日本語">
                  日本語
                </div>
                <div className={styles.mobileSettingOption} data-text="English">
                  English
                </div>
                <div className={styles.mobileSettingOption} data-text="한국어">
                  한국어
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 著作権 */}
        <div className={styles.mobileCopyright}>
          <div className={styles.mobileCopyrightText}>
            All rights reserved 2025 ©︎ Taichi Inenaga
          </div>
        </div>
      </div>

      {/* デスクトップ版レイアウト */}
      <div className={styles.desktopLayout}>
        <div className={styles.desktopMainContent}>
          {/* 上部：ブランドセクション */}
          <div className={styles.desktopBrandSection}>
            <div className={styles.desktopBrandContainer}>
              <div
                className={styles.desktopBrandName}
                data-text="TAICHI"
                onClick={navigateToHome}
              >
                TAICHI
              </div>
            </div>
            <div className={styles.desktopSocialIcons}>
              {/* 顔の背景コンテナ */}
              <div className={styles.faceContainer} ref={desktopBackgroundRef}>
                {/* X (Twitter) - 左目 */}
                <div className={styles.socialLink}>
                  <FaXTwitter
                    className={`${styles.socialIcon} ${styles.leftEye}`}
                  />
                </div>

                {/* Instagram - 右目 */}
                <div className={styles.socialLink}>
                  <FaInstagram
                    className={`${styles.socialIcon} ${styles.rightEye}`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 中央：ナビゲーションと設定 */}
          <div className={styles.desktopContentArea}>
            {/* 左側：ナビゲーション */}
            <div className={styles.desktopNavigation}>
              <div className={styles.desktopNavContainer}>
                <button
                  className={styles.desktopNavLink}
                  onClick={scrollToWorksSection}
                  data-text="Works"
                >
                  Works
                </button>
                <button
                  className={styles.desktopNavLink}
                  onClick={navigateToAbout}
                  data-text="About"
                >
                  About
                </button>
                <button
                  className={styles.desktopNavLink}
                  onClick={navigateToContact}
                  data-text="Contact"
                >
                  Contact
                </button>
              </div>
            </div>

            {/* 右側：設定セクション */}
            <div className={styles.desktopSettings}>
              <div className={styles.desktopLanguageSettings}>
                <div className={styles.desktopSettingTitle}>
                  言語設定(実装中)
                </div>
                <div className={styles.desktopSettingOption} data-text="日本語">
                  日本語
                </div>
                <div
                  className={styles.desktopSettingOption}
                  data-text="English"
                >
                  English
                </div>
                <div className={styles.desktopSettingOption} data-text="한국어">
                  한국어
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 下部：著作権 */}
        <div className={styles.desktopCopyright}>
          <div className={styles.desktopCopyrightText}>
            All rights reserved 2025 ©︎ Taichi Inenaga
          </div>
        </div>
      </div>
    </footer>
  );
}
