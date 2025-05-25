import React from "react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useLanguage } from "@/components/providers/LanguageProvider";
import Link from "next/link";

export default function Header() {
  const { theme } = useTheme();
  const { t } = useLanguage();

  return (
    <header
      className={`
      w-full h-18 flex items-center justify-between px-16
      ${theme === "retro" ? "bg-retro-card" : "bg-white shadow-md"}
    `}
    >
      {/* ロゴ */}
      <div className="flex items-center">
        <Link
          href={"/"}
          className={`
          font-bold text-2xl
          ${theme === "retro" ? "text-black" : "text-gray-900"}
        `}
        >
          Taichi
        </Link>
      </div>

      {/* ナビゲーション */}
      <nav className="flex items-center gap-8">
        <NavItem href="/" label={t("nav.works")} />
        <NavItem href="#about" label={t("nav.about")} />
        <NavItem href="#contact" label={t("nav.contact")} />
      </nav>
    </header>
  );
}

interface NavItemProps {
  href: string;
  label: string;
}

function NavItem({ href, label }: NavItemProps) {
  const { theme } = useTheme();

  return (
    <a
      href={href}
      className={`
        flex items-center justify-center px-4 py-2 font-semibold text-2xl
        hover:opacity-80 transition-opacity
        ${
          theme === "retro"
            ? "text-black"
            : "text-gray-900 hover:text-primary-600"
        }
      `}
    >
      {label}
    </a>
  );
}
