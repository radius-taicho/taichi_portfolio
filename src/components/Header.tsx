"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useRouter } from "next/router";
import Link from "next/link";
import styles from "@/styles/components/header.module.scss";
import menuStyles from "@/styles/components/hamburgerMenu.module.scss";

export default function Header() {
  const { t } = useLanguage();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // メニューが開いているときはbody要素のスクロールを無効化
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // クリーンアップ
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // スムーズスクロール関数（Works用）
  const scrollToWorksSection = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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

  // スムーズスクロール関数（Contact用）
  const scrollToContactSection = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMobileMenuOpen(false); // メニューを閉じる

    const scrollToElement = () => {
      const element = document.getElementById("contact-section");
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    };

    // 現在のページがContactページの場合はスクロールのみ
    if (router.pathname === "/contact") {
      scrollToElement();
    } else {
      // 他のページからの場合はContactページに遷移してからスクロール
      router.push("/contact").then(() => {
        // ページ遷移後に少し待ってからスクロール
        setTimeout(scrollToElement, 100);
      });
    }
  };

  // スムーズスクロール関数（About用）
  const scrollToAboutSection = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMobileMenuOpen(false); // メニューを閉じる

    const scrollToElement = () => {
      // モバイルサイズかどうかを判定（768px以下をモバイルとする）
      const isMobile = window.innerWidth < 768;
      const elementId = isMobile ? "about-section" : "about-section-desktop";
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    };

    // 現在のページがAboutページの場合はスクロールのみ
    if (router.pathname === "/about") {
      scrollToElement();
    } else {
      // 他のページからの場合はAboutページに遷移してからスクロール
      router.push("/about").then(() => {
        // ページ遷移後に少し待ってからスクロール
        setTimeout(scrollToElement, 100);
      });
    }
  };

  const handleMobileMenuToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMobileMenuOpen(false);
  };

  const handleMenuContentClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // メニュー内容のクリックでオーバーレイが反応しないように
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
        </div>

        {/* ナビゲーション（中央左寄り） */}
        <div className={styles.desktopNavigation}>
          <div className={styles.navItem}>
            <button
              className={styles.navText}
              onClick={scrollToWorksSection}
              data-text="Works"
            >
              Works
            </button>
          </div>
          <div className={styles.navItem}>
            <button
              className={styles.navText}
              onClick={scrollToAboutSection}
              data-text="About"
            >
              About
            </button>
          </div>
          <div className={styles.navItem}>
            <button
              className={styles.navText}
              onClick={scrollToContactSection}
              data-text="Contact"
            >
              Contact
            </button>
          </div>
        </div>

        {/* ロゴ（中央絶対配置） */}
        <div className={styles.desktopLogo}>
          <Link href="/" className={styles.logoText} data-text="TAICHI">
            TAICHI
          </Link>
        </div>
      </div>

      {/* モバイルヘッダー（sm未満） */}
      <div className={styles.mobileHeader}>
        {/* ロゴ（左） */}
        <div className={styles.mobileLogo}>
          <Link href="/" className={styles.mobileLogoText} data-text="TAICHI">
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
        </div>
      </div>

      {/* ハンバーガーメニューのオーバーレイとコンテンツ */}
      {isMobileMenuOpen && (
        <>
          {/* 背景オーバーレイ（最下層） */}
          <div 
            className={menuStyles.overlay}
            onClick={handleOverlayClick}
          />
          
          {/* メニューコンテンツ（最上層） */}
          <div className={menuStyles.menuWrapper}>
            {/* デスクトップ用メニュー */}
            <div className={menuStyles.desktopMenu} onClick={handleMenuContentClick}>
              <div className={menuStyles.menuContent}>
                {/* ナビゲーションリンク */}
                <div className={menuStyles.navigationSection}>
                  <button
                    className={menuStyles.navLink}
                    onClick={scrollToWorksSection}
                    data-text="Works"
                  >
                    Works
                  </button>
                  <button
                    className={menuStyles.navLink}
                    onClick={scrollToAboutSection}
                    data-text="About"
                  >
                    About
                  </button>
                  <button
                    className={menuStyles.navLink}
                    onClick={scrollToContactSection}
                    data-text="Contact"
                  >
                    Contact
                  </button>
                </div>

                {/* 設定セクション */}
                <div className={menuStyles.settingsSection}>
                  {/* 言語設定 */}
                  <div className={menuStyles.settingGroup}>
                    <div className={menuStyles.settingTitle}>言語設定</div>
                    <div className={menuStyles.settingOption} data-text="日本語">日本語</div>
                    <div className={menuStyles.settingOption} data-text="English">English</div>
                    <div className={menuStyles.settingOption} data-text="한국어">한국어</div>
                  </div>
                </div>
              </div>
            </div>

            {/* モバイル用メニュー */}
            <div className={menuStyles.mobileMenu} onClick={handleMenuContentClick}>
              <div className={menuStyles.menuContent}>
                {/* ナビゲーションリンク */}
                <div className={menuStyles.navigationSection}>
                  <button
                    className={menuStyles.navLink}
                    onClick={scrollToWorksSection}
                    data-text="Works"
                  >
                    Works
                  </button>
                  <button
                    className={menuStyles.navLink}
                    onClick={scrollToAboutSection}
                    data-text="About"
                  >
                    About
                  </button>
                  <button
                    className={menuStyles.navLink}
                    onClick={scrollToContactSection}
                    data-text="Contact"
                  >
                    Contact
                  </button>
                </div>

                {/* 設定セクション */}
                <div className={menuStyles.settingsSection}>
                  {/* 言語設定 */}
                  <div className={menuStyles.settingGroup}>
                    <div className={menuStyles.settingTitle}>言語設定</div>
                    <div className={menuStyles.settingOption} data-text="日本語">日本語</div>
                    <div className={menuStyles.settingOption} data-text="English">English</div>
                    <div className={menuStyles.settingOption} data-text="한국어">한국어</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
