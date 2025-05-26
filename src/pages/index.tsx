import React from "react";
import Header from "@/components/Header";
import MainSection from "@/components/top/MainSection";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useTheme } from "@/components/providers/ThemeProvider";

export default function HomePage() {
  const { t } = useLanguage();
  const { theme } = useTheme();

  return (
    <div className={`pc ${theme === "retro" ? "retro-style" : "modern-style"}`}>
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
