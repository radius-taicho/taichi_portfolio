import React, { useState, useEffect, useRef } from "react";
import styles from "@/styles/components/scrollTopBubble.module.scss";

interface ScrollTopBubbleProps {
  targetSelector: string; // 監視する要素のセレクタ
  isMobile?: boolean;
}

export default function ScrollTopBubble({
  targetSelector,
  isMobile = false,
}: ScrollTopBubbleProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fullText = "クリックでページトップへ";
  const typingSpeed = 80; // ミリ秒（1文字あたりの表示間隔）

  // タイピングアニメーション開始
  const startTypingAnimation = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    let currentIndex = 0;
    setDisplayedText("");
    setIsTypingComplete(false);

    intervalRef.current = setInterval(() => {
      if (currentIndex < fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setIsTypingComplete(true);
      }
    }, typingSpeed);
  };

  // タイピングアニメーション リセット
  const resetTypingAnimation = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setDisplayedText("");
    setIsTypingComplete(false);
  };

  // スクロール位置を監視して要素の表示状態をチェック
  useEffect(() => {
    let isInitialized = false;
    let checkInterval: NodeJS.Timeout | null = null;
    
    const checkVisibility = () => {
      // より確実な要素検索
      let targetElement: Element | null = null;
      
      if (targetSelector.startsWith('.')) {
        // クラス名から検索 - 複数の方法で試行
        const className = targetSelector.substring(1);
        
        // 1. 完全一致での検索
        targetElement = document.querySelector(`.${className}`);
        
        // 2. 部分一致での検索（CSSモジュール対応）
        if (!targetElement) {
          targetElement = document.querySelector(`[class*="${className}"]`);
        }
        
        // 3. 特定のタグと組み合わせて検索
        if (!targetElement) {
          const possibleTags = ['div', 'img', 'section', 'button'];
          for (const tag of possibleTags) {
            targetElement = document.querySelector(`${tag}[class*="${className}"]`);
            if (targetElement) break;
          }
        }
        
        // 4. スクロールトップ特有の検索（GIF畫像を直接的に検索）
        if (!targetElement && (className.includes('bottom') || className.includes('Circle') || className.includes('Image'))) {
          const gifs = document.querySelectorAll('img[src*="tothetop.GIF"]');
          if (gifs.length > 0) {
            // GIF畫像の親要素を取得
            targetElement = gifs[0].closest('div') || gifs[0].parentElement || gifs[0];
          }
        }
        
        // 5. 最後の手段：全て1約的な検索
        if (!targetElement) {
          const elements = document.querySelectorAll(`[class*="${className}"]`);
          if (elements.length > 0) {
            targetElement = elements[elements.length - 1]; // 最後の要素を使用
          }
        }
      } else {
        targetElement = document.querySelector(targetSelector);
      }

      if (!targetElement) {
        return false; // 要素が見つからない
      }

      if (!isInitialized) {
        isInitialized = true;
      }

      const rect = targetElement.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // 要素が画面内に入ったか判定（より緩い条件）
      const isInView = rect.top <= windowHeight * 0.9 && rect.bottom >= -100;
      
      if (isInView && !isVisible) {
        setIsVisible(true);
        // 少し遅延してアニメーション開始
        setTimeout(() => {
          startTypingAnimation();
        }, 100);
      } else if (!isInView && isVisible) {
        resetTypingAnimation();
        setIsVisible(false);
      }
      
      return true; // 要素が見つかった
    };

    // 定期的なチェック（要素が後から追加される場合に対応）
    const startPeriodicCheck = () => {
      if (checkInterval) {
        clearInterval(checkInterval);
      }
      
      let attempts = 0;
      const maxAttempts = 20; // 10秒間（500ms * 20）
      
      checkInterval = setInterval(() => {
        attempts++;
        const found = checkVisibility();
        
        if (found || attempts >= maxAttempts) {
          if (checkInterval) {
            clearInterval(checkInterval);
            checkInterval = null;
          }
        }
      }, 500);
    };

    // イベントリスナーの設定
    const setupEventListeners = () => {
      const throttledCheck = () => checkVisibility();
      window.addEventListener("scroll", throttledCheck, { passive: true });
      window.addEventListener("resize", throttledCheck, { passive: true });
      
      return () => {
        window.removeEventListener("scroll", throttledCheck);
        window.removeEventListener("resize", throttledCheck);
      };
    };

    // 初期化
    let cleanup: (() => void) | null = null;
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
          startPeriodicCheck();
          cleanup = setupEventListeners();
        }, 1000);
      });
    } else {
      setTimeout(() => {
        startPeriodicCheck();
        cleanup = setupEventListeners();
      }, 1000);
    }

    return () => {
      if (checkInterval) {
        clearInterval(checkInterval);
      }
      if (cleanup) {
        cleanup();
      }
      resetTypingAnimation();
    };
  }, [targetSelector, isVisible]);

  // 表示されていない場合は何も描画しない
  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`${styles.bubbleContainer} ${
        isMobile ? styles.mobile : styles.desktop
      }`}
    >
      <div className={styles.bubble}>
        <div className={styles.bubbleText}>
          {displayedText}
          {!isTypingComplete && <span className={styles.cursor}>|</span>}
        </div>
        {/* 吹き出しの矢印（尻尾） */}
        <div className={styles.bubbleArrow}></div>
      </div>
    </div>
  );
}
