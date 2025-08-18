import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import styles from "./DesktopImTaichiGame.module.scss";

interface DesktopImTaichiGameProps {
  onGameStart?: () => void;
}

type GameState = "intro" | "menu" | "conversation" | "detailed";
type ConversationStep = "question" | "answer";

const DesktopImTaichiGame: React.FC<DesktopImTaichiGameProps> = ({ onGameStart }) => {
  const [selectedItem, setSelectedItem] = useState<string>("趣味");
  const [gameState, setGameState] = useState<GameState>("intro");
  const [conversationStep, setConversationStep] = useState<ConversationStep>("question");
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [clickedItem, setClickedItem] = useState<string | null>(null);
  const [imagesLoaded, setImagesLoaded] = useState<boolean>(false);
  const [optimalTextSize, setOptimalTextSize] = useState<number>(24);

  // ゲームコンテナへの参照
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const conversationMessageRef = useRef<HTMLDivElement>(null);

  // 最適なテキストサイズを計算する関数
  const calculateOptimalTextSize = () => {
    const container = gameContainerRef.current;
    if (!container) return 24;

    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;
    
    // コンテナサイズに基づいてテキストサイズを計算
    const baseSize = Math.min(containerWidth / 40, containerHeight / 25);
    const clampedSize = Math.max(20, Math.min(32, baseSize));
    

    return clampedSize;
  };

  // ウィンドウリサイズ時にテキストサイズを再計算
  useEffect(() => {
    const handleResize = () => {
      const newSize = calculateOptimalTextSize();
      setOptimalTextSize(newSize);
    };

    // 初期計算
    setTimeout(handleResize, 100);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 画像の事前読み込み（高解像度対応）
  useEffect(() => {

    
    const preloadImages = async () => {
      const imageUrls = [
        '/images/taichi-hello.PNG',
        '/images/taichi-silent.PNG', 
        '/images/taichi-talking.GIF'
      ];

      try {
        // シーケンシャルに読み込み（デスクトップは余裕があるため安定性重視）
        for (const url of imageUrls) {
          await new Promise<void>((resolve, reject) => {
            const img = new window.Image();
            img.onload = () => {

              resolve();
            };
            img.onerror = (error) => {

              resolve(); // エラーでも続行
            };
            // 高品質で読み込み
            img.decoding = 'sync';
            img.loading = 'eager';
            img.src = url;
          });
        }


        setImagesLoaded(true);
      } catch (error) {

        setImagesLoaded(true);
      }
    };

    preloadImages();
  }, []);

  const menuItems = ["趣味", "目標", "人生", "デザイン"];

  // 各トピックの会話データ
  const conversationData = {
    "趣味": {
      question: "あなた：趣味はなんですか？",
      answer: "たいち：映画鑑賞、ゲーム、山登り、雑貨屋巡りが好きだよ。",
      details: ["映画", "ゲーム", "山登り", "雑貨"]
    },
    "目標": {
      question: "あなた：将来の目標はありますか？",
      answer: "たいち：ユーザーフレンドリーで美しいデザインを作ることだよ。",
      details: ["UXデザイン", "UIデザイン", "ブランディング", "ユーザビリティ"]
    },
    "人生": {
      question: "あなた：人生で大切にしていることは？",
      answer: "たいち：家族や友人との時間、新しいことへのチャレンジを大切にしているよ。",
      details: ["家族", "友人", "チャレンジ", "成長"]
    },
    "デザイン": {
      question: "あなた：デザインについてどう思いますか？",
      answer: "たいち：デザインは人と人をつなぐコミュニケーションツールだと思うよ。",
      details: ["コミュニケーション", "ユーザー体験", "美意識", "機能性"]
    }
  };

  const handleItemClick = (item: string) => {
    setSelectedItem(item);
    setClickedItem(item);
    setGameState("conversation");
    setConversationStep("question");
  };

  const handleItemMouseDown = (item: string) => {
    setClickedItem(item);
  };

  const handleItemMouseUp = () => {
    setClickedItem(null);
  };

  const handleConversationClick = () => {
    setGameState("detailed");
    setClickedItem(null);
  };

  const handleBackToMenu = () => {
    setGameState("menu");
    setConversationStep("question");
    setClickedItem(null);
    setHoveredItem(null);
  };

  // 会話の流れを管理
  useEffect(() => {
    if (gameState === "conversation" && conversationStep === "question") {
      const timer = setTimeout(() => {
        setConversationStep("answer");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [gameState, conversationStep]);

  // ゲーム開始の処理
  useEffect(() => {
    if (onGameStart) {
      onGameStart();
    }
  }, [onGameStart]);

  // 画像読み込み完了後にProfileセクションにスクロールしてメニュー状態に変更
  useEffect(() => {
    if (gameState === "intro" && imagesLoaded) {

      
      const timer = setTimeout(() => {
        // デスクトップ版のProfileセクションを検索してスクロール
        const profileSection = document.querySelector('.desktopProfileSection[data-section="profile"]') as HTMLElement ||
                             document.querySelector('[class*="desktopProfileSection"]') as HTMLElement;
        
        if (profileSection) {

          profileSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
          
          // スクロール完了後にメニュー状態に変更
          setTimeout(() => {

            setGameState("menu");
            setClickedItem(null);
            setHoveredItem(null);
          }, 800);
        } else {
          // Profileセクションが見つからない場合は即座にメニューに変更

          setGameState("menu");
          setClickedItem(null);
          setHoveredItem(null);
        }
        
      }, 1800); // 1.8秒後に実行

      return () => clearTimeout(timer);
    }
  }, [gameState, imagesLoaded]);

  // 会話メッセージのテキストサイズを動的に適用
  useEffect(() => {
    if (conversationMessageRef.current && gameState === "conversation") {
      conversationMessageRef.current.style.fontSize = `${optimalTextSize}px`;
    }
  }, [optimalTextSize, gameState]);

  return (
    <div className={styles.gameContainer} ref={gameContainerRef}>
      {/* 上部メイン枠 */}
      <div className={styles.mainPanel}>
        <div className={styles.characterSection}>
          {/* キャラクター画像エリア */}
          <div className={styles.characterImage}>
            <div className={styles.imagePlaceholder}>
              {gameState === "intro" ? (
                <Image
                  src="/images/taichi-hello.PNG"
                  alt="たいち - 挨拶"
                  fill
                  priority={true}
                  style={{ objectFit: "contain" }}
                />
              ) : gameState === "menu" || gameState === "detailed" ? (
                <Image
                  src="/images/taichi-silent.PNG"
                  alt="たいち - 待機"
                  fill
                  priority={true}
                  style={{ objectFit: "contain" }}
                />
              ) : gameState === "conversation" && conversationStep === "answer" ? (
                <Image
                  src="/images/taichi-talking.GIF"
                  alt="たいち - 会話中"
                  fill
                  priority={true}
                  style={{ objectFit: "contain" }}
                  unoptimized
                />
              ) : (
                <Image
                  src="/images/taichi-silent.PNG"
                  alt="たいち - 待機"
                  fill
                  priority={true}
                  style={{ objectFit: "contain" }}
                />
              )}
            </div>
          </div>
          <div className={styles.characterName}>たいち</div>
        </div>
      </div>

      {/* 下部パネル */}
      <div className={`${styles.bottomPanel} ${gameState === "intro" ? styles.introMode : ""}`}>
        {gameState === "intro" ? (
          <div className={styles.introSection}>
            {!imagesLoaded ? (
              <div className={styles.loadingMessage}>
                画像を読み込み中...
              </div>
            ) : (
              <div className={styles.introMessage}>
                たいちはいきなり自己紹介してきた！！
              </div>
            )}
          </div>
        ) : gameState === "menu" ? (
          <>
            {/* 左側：質問セクション */}
            <div className={styles.questionSection}>
              <div className={styles.questionTitle}>質問</div>
            </div>

            {/* 右側：メニューセクション */}
            <div className={styles.menuSection}>
              <div className={styles.menuGrid}>
                {menuItems.map((item) => (
                  <button
                    key={item}
                    className={`${styles.menuItem} ${
                      selectedItem === item ? styles.selected : ""
                    } ${hoveredItem === item ? styles.hovered : ""} ${
                      clickedItem === item ? styles.clicked : ""
                    }`}
                    onClick={() => handleItemClick(item)}
                    onMouseEnter={() => setHoveredItem(item)}
                    onMouseLeave={() => setHoveredItem(null)}
                    onMouseDown={() => handleItemMouseDown(item)}
                    onMouseUp={handleItemMouseUp}
                  >
                    <span className={`${styles.menuItemTriangle} ${
                      hoveredItem === item || clickedItem === item ? styles.visible : ""
                    }`}>▶</span>
                    <span className={styles.menuItemText}>{item}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : gameState === "conversation" ? (
          <div className={styles.conversationSection} onClick={conversationStep === "answer" ? handleConversationClick : undefined}>
            <div 
              className={styles.conversationMessage}
              ref={conversationMessageRef}
              style={{ fontSize: `${optimalTextSize}px` }}
            >
              {conversationStep === "question" 
                ? conversationData[selectedItem as keyof typeof conversationData].question
                : conversationData[selectedItem as keyof typeof conversationData].answer
              }
            </div>
            {conversationStep === "answer" && (
              <div className={styles.nextArrow}>▶</div>
            )}
          </div>
        ) : (
          <>
            {/* 詳細表示モード */}
            <div className={styles.questionSection}>
              <div className={styles.questionTitle}>質問</div>
            </div>

            <div className={styles.menuSection}>
              <div className={styles.menuGrid}>
                {conversationData[selectedItem as keyof typeof conversationData].details.map((detail) => (
                  <button
                    key={detail}
                    className={styles.menuItem}
                    onClick={handleBackToMenu}
                  >
                    <span className={styles.menuItemText}>{detail}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DesktopImTaichiGame;
