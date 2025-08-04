import React from "react";
import Header from "@/components/Header";
import MainSection from "@/components/top/MainSection";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";
import { useLanguage } from "@/components/providers/LanguageProvider";
import styles from "@/styles/components/top_page.module.scss";


export default function HomePage() {
  const { t } = useLanguage();

  return (
    <div className={styles.pageContainer}>
      <Header />

      {/* ヒーローセクション */}
      <HeroSection />

      {/* メインセクション */}
      <MainSection />

      {/* フッター */}
      <Footer />
    </div>
  );
}
