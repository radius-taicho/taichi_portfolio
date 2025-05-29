"use client";

import React from "react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useRouter } from "next/router";
import Link from "next/link";
import styles from "@/styles/components/footer.module.scss";

export default function Footer() {
  const { theme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const router = useRouter();

  // スムーズスクロール関数
  const scrollToWorksSection = (e: React.MouseEvent) => {
    e.preventDefault();

    const scrollToElement = () => {
      const element = document.getElementById("works-section");
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

  return (
    <footer className={styles.footer}>
      {/* モバイル版レイアウト */}
      <div className={styles.mobileLayout}>
        {/* ヘッダー部分 */}
        <div className={styles.mobileHeader}>
          <div className={styles.mobileBrandSection}>
            <div className={styles.mobileBrandContainer}>
              <div className={styles.mobileBrandName}>TAICHI</div>
              <div className={styles.mobileAvatar}></div>
            </div>
            <div className={styles.mobileSocialIcons}>
              {/* X (Twitter) */}
              <svg className={styles.socialIcon} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.286 10.1634L23.2215 0H21.1043L13.3421 8.82293L7.147 0H0L9.37035 13.343L0 24H2.11715L10.3092 14.6805L16.853 24H24L14.286 10.1634ZM11.3853 13.4601L10.4344 12.1306L2.88064 1.56176H6.13301L12.231 10.0944L13.1778 11.4239L21.1033 22.5143H17.851L11.3853 13.4601Z" fill="white" />
              </svg>
              {/* Instagram */}
              <svg className={styles.socialIcon} width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.0012 0C11.6558 0 11.1104 0.0190003 9.40376 0.096667C7.70041 0.174667 6.53774 0.444334 5.52039 0.84C4.46805 1.24867 3.57537 1.79533 2.68603 2.685C1.79602 3.57433 1.24935 4.467 0.839342 5.519C0.442671 6.53667 0.172669 7.69967 0.096001 9.40233C0.0200002 11.109 0 11.6547 0 16C0 20.3453 0.0193338 20.889 0.096668 22.5957C0.175002 24.299 0.444672 25.4617 0.840009 26.479C1.24901 27.5313 1.79569 28.424 2.68536 29.3133C3.57437 30.2033 4.46705 30.7513 5.51872 31.16C6.53674 31.5557 7.69975 31.8253 9.40277 31.9033C11.1095 31.981 11.6545 32 15.9995 32C20.3452 32 20.8889 31.981 22.5956 31.9033C24.2989 31.8253 25.4629 31.5557 26.4809 31.16C27.533 30.7513 28.4243 30.2033 29.3133 29.3133C30.2033 28.424 30.75 27.5313 31.16 26.4793C31.5533 25.4617 31.8233 24.2987 31.9033 22.596C31.98 20.8893 32 20.3453 32 16C32 11.6547 31.98 11.1093 31.9033 9.40267C31.8233 7.69933 31.5533 6.53667 31.16 5.51933C30.75 4.467 30.2033 3.57433 29.3133 2.685C28.4233 1.795 27.5333 1.24833 26.4799 0.84C25.4599 0.444334 24.2966 0.174667 22.5932 0.096667C20.8866 0.0190003 20.3432 0 15.9965 0H16.0012Z" fill="url(#paint0_radial_mobile)" />
                <defs>
                  <radialGradient id="paint0_radial_mobile" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(8.50004 34.4647) rotate(-90) scale(31.7144 29.4969)">
                    <stop stopColor="#FFDD55" />
                    <stop offset="0.1" stopColor="#FFDD55" />
                    <stop offset="0.5" stopColor="#FF543E" />
                    <stop offset="1" stopColor="#C837AB" />
                  </radialGradient>
                </defs>
              </svg>
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
            >
              Works
            </button>
            <Link href="/about" className={styles.mobileNavLink}>About</Link>
            <Link href="/contact" className={styles.mobileNavLink}>Contact</Link>
          </div>

          {/* 設定セクション */}
          <div className={styles.mobileSettings}>
            <div className={styles.mobileLanguageSettings}>
              <div className={styles.mobileSettingTitle}>言語設定</div>
              <div className={styles.mobileSettingOption}>日本語</div>
              <div className={styles.mobileSettingOption}>English</div>
              <div className={styles.mobileSettingOption}>한국어</div>
            </div>
            <div className={styles.mobileThemeSettings}>
              <div className={styles.mobileSettingTitle}>画面設定</div>
              <div className={styles.mobileSettingOption}>モダン</div>
              <div className={styles.mobileSettingOption}>レトロ</div>
            </div>
          </div>
        </div>

        {/* 著作権 */}
        <div className={styles.mobileCopyright}>
          <div className={styles.mobileCopyrightText}>All rights reserved 2025 ©︎ Taichi Inenaga</div>
        </div>
      </div>

      {/* デスクトップ版レイアウト */}
      <div className={styles.desktopLayout}>
        <div className={styles.desktopMainContent}>
          {/* 上部：ブランドセクション */}
          <div className={styles.desktopBrandSection}>
            <div className={styles.desktopBrandContainer}>
              <div className={styles.desktopBrandName}>TAICHI</div>
              <div className={styles.desktopAvatar}></div>
            </div>
            <div className={styles.desktopSocialIcons}>
              {/* X (Twitter) */}
              <svg className={styles.socialIcon} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.286 10.1634L23.2215 0H21.1043L13.3421 8.82293L7.147 0H0L9.37035 13.343L0 24H2.11715L10.3092 14.6805L16.853 24H24L14.286 10.1634ZM11.3853 13.4601L10.4344 12.1306L2.88064 1.56176H6.13301L12.231 10.0944L13.1778 11.4239L21.1033 22.5143H17.851L11.3853 13.4601Z" fill="white" />
              </svg>
              {/* Instagram */}
              <svg className={styles.socialIcon} width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.0012 0C11.6558 0 11.1104 0.0190003 9.40376 0.096667C7.70041 0.174667 6.53774 0.444334 5.52039 0.84C4.46805 1.24867 3.57537 1.79533 2.68603 2.685C1.79602 3.57433 1.24935 4.467 0.839342 5.519C0.442671 6.53667 0.172669 7.69967 0.096001 9.40233C0.0200002 11.109 0 11.6547 0 16C0 20.3453 0.0193338 20.889 0.096668 22.5957C0.175002 24.299 0.444672 25.4617 0.840009 26.479C1.24901 27.5313 1.79569 28.424 2.68536 29.3133C3.57437 30.2033 4.46705 30.7513 5.51872 31.16C6.53674 31.5557 7.99975 31.8253 9.40277 31.9033C11.1095 31.981 11.6545 32 15.9995 32C20.3452 32 20.8889 31.981 22.5956 31.9033C24.2989 31.8253 25.4629 31.5557 26.4809 31.16C27.533 30.7513 28.4243 30.2033 29.3133 29.3133C30.2033 28.424 30.75 27.5313 31.16 26.4793C31.5533 25.4617 31.8233 24.2987 31.9033 22.596C31.98 20.8893 32 20.3453 32 16C32 11.6547 31.98 11.1093 31.9033 9.40267C31.8233 7.69933 31.5533 6.53667 31.16 5.51933C30.75 4.467 30.2033 3.57433 29.3133 2.685C28.4233 1.795 27.5333 1.24833 26.4799 0.84C25.4599 0.444334 24.2966 0.174667 22.5932 0.096667C20.8866 0.0190003 20.3432 0 15.9965 0H16.0012Z" fill="url(#paint0_radial_desktop)" />
                <defs>
                  <radialGradient id="paint0_radial_desktop" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(8.50004 34.4647) rotate(-90) scale(31.7144 29.4969)">
                    <stop stopColor="#FFDD55" />
                    <stop offset="0.1" stopColor="#FFDD55" />
                    <stop offset="0.5" stopColor="#FF543E" />
                    <stop offset="1" stopColor="#C837AB" />
                  </radialGradient>
                </defs>
              </svg>
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
                >
                  Works
                </button>
                <Link href="/about" className={styles.desktopNavLink}>About</Link>
                <Link href="/contact" className={styles.desktopNavLink}>Contact</Link>
              </div>
            </div>

            {/* 右側：設定セクション */}
            <div className={styles.desktopSettings}>
              <div className={styles.desktopLanguageSettings}>
                <div className={styles.desktopSettingTitle}>言語設定</div>
                <div className={styles.desktopSettingOption}>日本語</div>
                <div className={styles.desktopSettingOption}>한국어</div>
                <div className={styles.desktopSettingOption}>English</div>
              </div>
              <div className={styles.desktopThemeSettings}>
                <div className={styles.desktopSettingTitle}>画面設定</div>
                <div className={styles.desktopSettingOption}>モダン</div>
                <div className={styles.desktopSettingOption}>レトロ</div>
              </div>
            </div>
          </div>
        </div>

        {/* 下部：著作権 */}
        <div className={styles.desktopCopyright}>
          <div className={styles.desktopCopyrightText}>All rights reserved 2025 ©︎ Taichi Inenaga</div>
        </div>
      </div>
    </footer>
  );
}
