import React, { useState, useEffect } from "react";
import styles from "@/styles/components/ImTaichiGame.module.scss";

const ImTaichiGame: React.FC = () => {
  const [gameState, setGameState] = useState<"title" | "playing">("title");
  const [showMessage, setShowMessage] = useState(false);

  const handleStartGame = () => {
    setGameState("playing");
    setShowMessage(true);
  };

  useEffect(() => {
    if (gameState === "playing" && showMessage) {
      const timer = setTimeout(() => {
        setShowMessage(false);

        // 現在の画面サイズを取得して適切なProfileセクションを選択
        const isDesktop = window.innerWidth >= 768; // smブレークポイント (768px)
        let profileSection;

        console.log("画面幅:", window.innerWidth, "デスクトップ:", isDesktop);

        // より確実な方法でProfile セクションを探す
        if (isDesktop) {
          // デスクトップ版の探索
          console.log("デスクトップ版のProfile セクションを探しています...");

          // 1. data-section="profile" で探す（デスクトップコンテナ内）
          const desktopContainers = document.querySelectorAll(
            '[class*="desktopContainer"]'
          );
          console.log("デスクトップコンテナ数:", desktopContainers.length);

          for (let container of desktopContainers) {
            const profileInContainer = container.querySelector(
              '[data-section="profile"]'
            );
            if (profileInContainer) {
              profileSection = profileInContainer;
              console.log("デスクトップコンテナ内でProfile発見");
              break;
            }
          }

          // 2. フォールバック: desktopProfileSection クラスで直接探す
          if (!profileSection) {
            profileSection = document.querySelector(
              '[class*="desktopProfileSection"]'
            );
            console.log("desktopProfileSectionで検索:", !!profileSection);
          }
        } else {
          // モバイル版の探索
          console.log("モバイル版のProfile セクションを探しています...");

          // 1. data-section="profile" で探す（モバイルコンテナ内）
          const mobileContainers = document.querySelectorAll(
            '[class*="mobileContainer"]'
          );
          console.log("モバイルコンテナ数:", mobileContainers.length);

          for (let container of mobileContainers) {
            const profileInContainer = container.querySelector(
              '[data-section="profile"]'
            );
            if (profileInContainer) {
              profileSection = profileInContainer;
              console.log("モバイルコンテナ内でProfile発見");
              break;
            }
          }

          // 2. フォールバック: sectionContainer内でProfileテキストを探す
          if (!profileSection) {
            const sectionContainers = document.querySelectorAll(
              '[class*="sectionContainer"]'
            );
            for (let section of sectionContainers) {
              const h2 = section.querySelector("h2");
              if (h2 && h2.textContent?.includes("Profile")) {
                profileSection = section;
                console.log("h2テキストからProfile発見");
                break;
              }
            }
          }
        }

        if (profileSection) {
          console.log("スクロール対象を発見:", profileSection.className);
          console.log("要素:", profileSection);
          profileSection.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        } else {
          console.log("Profile セクションが見つかりませんでした");
          // 全ての data-section="profile" 要素を表示
          const allProfileSections = document.querySelectorAll(
            '[data-section="profile"]'
          );
          console.log(
            '全てのdata-section="profile"要素:',
            allProfileSections.length
          );
          allProfileSections.forEach((el, index) => {
            console.log(`Profile要素 ${index}:`, el.className, el);
          });
        }

        // 1秒後にタイトル画面に戻る
        setTimeout(() => {
          setGameState("title");
        }, 1000);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [gameState, showMessage]);

  return (
    <div className={styles.gameContainer}>
      {gameState === "title" && (
        <div className={styles.titleScreen}>
          <div className={styles.titleContent}>
            <h1 className={styles.gameTitle}>I'm Taichi</h1>
            <button className={styles.startButton} onClick={handleStartGame}>
              スタート
            </button>
          </div>
        </div>
      )}

      {gameState === "playing" && showMessage && (
        <div className={styles.playingScreen}>
          <div className={styles.messageContainer}>
            <div className={styles.characterContainer}>
              <div className={styles.character}>
                <div className={styles.characterFace}>
                  <div className={styles.characterEyes}>
                    <div className={styles.eye}></div>
                    <div className={styles.eye}></div>
                  </div>
                  <div className={styles.characterMouth}></div>
                </div>
              </div>
              <div className={styles.speechBubble}>
                <p className={styles.message}>
                  たいちはいきなり
                  <br />
                  自己紹介してきた！
                </p>
                <div className={styles.bubbleArrow}></div>
              </div>
            </div>
            <div className={styles.loadingDots}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImTaichiGame;
