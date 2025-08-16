import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import styles from "./MobileImTaichiGame.module.scss";

interface MobileImTaichiGameProps {
  onGameStart?: () => void;
}

type GameState = "intro" | "menu" | "conversation" | "detailed";
type ConversationStep = "question" | "answer";

const MobileImTaichiGame: React.FC<MobileImTaichiGameProps> = ({ onGameStart }) => {
  const [selectedItem, setSelectedItem] = useState<string>("趣味");
  const [gameState, setGameState] = useState<GameState>("intro");
  const [conversationStep, setConversationStep] = useState<ConversationStep>("question");
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [clickedItem, setClickedItem] = useState<string | null>(null);
  const [imagesLoaded, setImagesLoaded] = useState<boolean>(false);

  // ゲームコンテナへの参照
  const gameContainerRef = useRef<HTMLDivElement>(null);

  // 画像の事前読み込み（即座に開始）
  useEffect(() => {
    console.log('モバイル版: 画像の事前読み込み開始');
    
    const preloadImages = async () => {
      const imageUrls = [
        '/images/taichi-hello.PNG',
        '/images/taichi-silent.PNG', 
        '/images/taichi-talking.GIF'
      ];

      try {
        // 並列で画像を読み込み
        const imagePromises = imageUrls.map((url) => {
          return new Promise<string>((resolve, reject) => {
            const img = new window.Image();
            img.onload = () => {
              console.log(`モバイル版: 画像読み込み完了: ${url}`);
              resolve(url);
            };
            img.onerror = (error) => {
              console.warn(`モバイル版: 画像読み込み失敗: ${url}`, error);
              resolve(url); // エラーでも続行
            };
            // 高優先度で読み込み
            img.decoding = 'async';
            img.loading = 'eager';
            img.src = url;
          });
        });

        await Promise.all(imagePromises);
        console.log('モバイル版: すべての画像読み込み完了');
        setImagesLoaded(true);
      } catch (error) {
        console.error('モバイル版: 画像読み込みエラー:', error);
        setImagesLoaded(true); // エラーでも続行
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
      console.log('モバイル版: イントロ状態開始 - 画像読み込み完了後処理開始');
      
      const timer = setTimeout(() => {
        // Profileセクションを検索してスクロール
        const profileSection = document.querySelector('[data-section="profile"]') as HTMLElement;
        
        if (profileSection) {
          console.log('モバイル版: Profileセクションが見つかりました、スクロール実行');
          profileSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
          
          // スクロール完了後にメニュー状態に変更
          setTimeout(() => {
            console.log('モバイル版: メニュー状態に変更');
            setGameState("menu");
            setClickedItem(null);
            setHoveredItem(null);
          }, 800);
        } else {
          // Profileセクションが見つからない場合は即座にメニューに変更
          console.log('モバイル版: Profileセクションが見つからないため即座にメニューに変更');
          setGameState("menu");
          setClickedItem(null);
          setHoveredItem(null);
        }
        
      }, 1800); // 1.8秒後に実行

      return () => clearTimeout(timer);
    }
  }, [gameState, imagesLoaded]);

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
            <div className={styles.conversationMessage}>
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

export default MobileImTaichiGame;
