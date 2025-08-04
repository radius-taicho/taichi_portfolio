import React, { useState } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useRouter } from "next/router";
import Link from "next/link";
import styles from "@/styles/components/header.module.scss";
import menuStyles from "@/styles/components/hamburgerMenu.module.scss";

export default function Header() {
  const { t } = useLanguage();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // スムーズスクロール関数
  const scrollToWorksSection = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMobileMenuOpen(false); // メニューを閉じる

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

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavLinkClick = () => {
    setIsMobileMenuOpen(false); // メニューを閉じる
  };

  return (
    <>
      {/* デスクトップヘッダー（sm以上） */}
      <div className={styles.desktopHeader}>
        {/* ハンバーガーメニュー（左） */}
        <div className={styles.hamburgerContainer}>
          <svg
            className={styles.hamburgerMenu}
            width="33"
            height="24"
            viewBox="0 0 33 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            onClick={handleMobileMenuToggle}
          >
            <path d="M0 0H33.1392" stroke="#252525" strokeWidth="2" strokeLinecap="round" />
            <path d="M0 12H33.1392" stroke="#252525" strokeWidth="2" strokeLinecap="round" />
            <path d="M0 24H33.1392" stroke="#252525" strokeWidth="2" strokeLinecap="round" />
          </svg>

          {/* ハンバーガーメニュードロップダウン */}
          {isMobileMenuOpen && (
            <div className={menuStyles.hamburgerMenuDropdown}>
              <div className={menuStyles.menuContainer}>
                {/* ナビゲーションリンク */}
                <div className={menuStyles.navigationSection}>
                  <button
                    className={menuStyles.navLink}
                    onClick={scrollToWorksSection}
                  >
                    Works
                  </button>
                  <Link 
                    href="/about" 
                    className={menuStyles.navLink}
                    onClick={handleNavLinkClick}
                  >
                    About
                  </Link>
                  <Link 
                    href="/contact" 
                    className={menuStyles.navLink}
                    onClick={handleNavLinkClick}
                  >
                    Contact
                  </Link>
                </div>

                {/* 設定セクション */}
                <div className={menuStyles.settingsSection}>
                  {/* 言語設定 */}
                  <div className={menuStyles.settingGroup}>
                    <div className={menuStyles.settingTitle}>言語設定</div>
                    <div className={menuStyles.settingOption}>日本語</div>
                    <div className={menuStyles.settingOption}>English</div>
                    <div className={menuStyles.settingOption}>한국어</div>
                  </div>


                </div>
              </div>
            </div>
          )}
        </div>

        {/* ナビゲーション（中央左寄り） */}
        <div className={styles.desktopNavigation}>
          <div className={styles.navItem}>
            <button
              className={styles.navText}
              onClick={scrollToWorksSection}
            >
              Works
            </button>
          </div>
          <div className={styles.navItem}>
            <Link href="/about" className={styles.navText}>
              About
            </Link>
          </div>
          <div className={styles.navItem}>
            <Link href="/contact" className={styles.navText}>
              Contact
            </Link>
          </div>
        </div>

        {/* ロゴ（中央絶対配置） */}
        <div className={styles.desktopLogo}>
          <Link href="/" className={styles.logoText}>
            TAICHI
          </Link>
        </div>
      </div>

      {/* モバイルヘッダー（sm未満） */}
      <div className={styles.mobileHeader}>
        {/* ロゴ（左） */}
        <div className={styles.mobileLogo}>
          <Link href="/" className={styles.mobileLogoText}>
            TAICHI
          </Link>
        </div>

        {/* ハンバーガーメニュー（右） */}
        <div className={styles.mobileHamburgerContainer}>
          <svg
            className={styles.mobileHamburgerMenu}
            width="33"
            height="24"
            viewBox="0 0 33 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            onClick={handleMobileMenuToggle}
          >
            <path d="M0 0H33.1392" stroke="#252525" strokeWidth="2" strokeLinecap="round" />
            <path d="M0 12H33.1392" stroke="#252525" strokeWidth="2" strokeLinecap="round" />
            <path d="M0 24H33.1392" stroke="#252525" strokeWidth="2" strokeLinecap="round" />
          </svg>

          {/* モバイル用ハンバーガーメニュードロップダウン */}
          {isMobileMenuOpen && (
            <div className={menuStyles.mobileMenuDropdown}>
              <div className={menuStyles.menuContainer}>
                {/* ナビゲーションリンク */}
                <div className={menuStyles.navigationSection}>
                  <button
                    className={menuStyles.navLink}
                    onClick={scrollToWorksSection}
                  >
                    Works
                  </button>
                  <Link 
                    href="/about" 
                    className={menuStyles.navLink}
                    onClick={handleNavLinkClick}
                  >
                    About
                  </Link>
                  <Link 
                    href="/contact" 
                    className={menuStyles.navLink}
                    onClick={handleNavLinkClick}
                  >
                    Contact
                  </Link>
                </div>

                {/* 設定セクション */}
                <div className={menuStyles.settingsSection}>
                  {/* 言語設定 */}
                  <div className={menuStyles.settingGroup}>
                    <div className={menuStyles.settingTitle}>言語設定</div>
                    <div className={menuStyles.settingOption}>日本語</div>
                    <div className={menuStyles.settingOption}>English</div>
                    <div className={menuStyles.settingOption}>한국어</div>
                  </div>


                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* オーバーレイ（メニューが開いている時に背景をクリックで閉じる） */}
      {isMobileMenuOpen && (
        <div
          className={menuStyles.overlay}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
