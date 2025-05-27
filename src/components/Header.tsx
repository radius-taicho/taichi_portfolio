import React, { useState } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useRouter } from "next/router";
import Link from "next/link";
import styles from "@/styles/components/header.module.scss";

export default function Header() {
  const { t } = useLanguage();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    // ここで将来的にモバイルメニューの開閉処理を実装
  };

  return (
    <>
      {/* モバイルヘッダー */}
      <div className={styles.mobileHeader}>
        <div className={styles.logoContainer}>
          <Link href="/" className={styles.logoText}>
            Taichi
          </Link>
        </div>
        <svg
          className={styles.hamburgerMenu}
          width="33"
          height="24"
          viewBox="0 0 33 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          onClick={handleMobileMenuToggle}
        >
          <path
            d="M0 0H33.1392"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M0 12H33.1392"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M0 24H33.1392"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* デスクトップヘッダー（既存） */}
      <header className={styles.desktopHeader}>
        {/* ロゴ */}
        <div className={styles.desktopLogoContainer}>
          <Link href={"/"} className={styles.logoText}>
            Taichi
          </Link>
        </div>

        {/* ナビゲーション */}
        <nav className={styles.desktopNavigation}>
          <WorksNavItem onClick={scrollToWorksSection} label={t("nav.works")} />
          <NavItem href="/about" label={t("nav.about")} />
          <NavItem href="/contact" label={t("nav.contact")} />
        </nav>
      </header>
    </>
  );
}

interface NavItemProps {
  href: string;
  label: string;
}

function NavItem({ href, label }: NavItemProps) {
  return (
    <Link href={href} className={styles.navItem}>
      {label}
    </Link>
  );
}

// Works専用のナビゲーションアイテム
interface WorksNavItemProps {
  onClick: (e: React.MouseEvent) => void;
  label: string;
}

function WorksNavItem({ onClick, label }: WorksNavItemProps) {
  return (
    <button onClick={onClick} className={styles.worksNavItem}>
      {label}
    </button>
  );
}
