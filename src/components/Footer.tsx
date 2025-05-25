"use client";

import React from "react";
import { useTheme } from "@/components/providers/ThemeProvider";
import styles from "@/styles/components/footer.module.scss";

export default function Footer() {
  const { theme } = useTheme();

  return <footer className={styles.footer}></footer>;
}
