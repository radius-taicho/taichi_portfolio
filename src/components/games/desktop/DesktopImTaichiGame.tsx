import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import styles from "./DesktopImTaichiGame.module.scss";

interface DesktopImTaichiGameProps {
  onGameStart?: () => void;
  onGameEnd?: () => void;
}

type GameState =
  | "intro"
  | "menu"
  | "conversation"
  | "detailed"
  | "detailedConversation"
  | "completed";
type ConversationStep = "question" | "answer";

const DesktopImTaichiGame: React.FC<DesktopImTaichiGameProps> = ({
  onGameStart,
  onGameEnd,
}) => {
  const [selectedItem, setSelectedItem] = useState<string>("趣味");
  const [selectedDetail, setSelectedDetail] = useState<string>("");
  const [gameState, setGameState] = useState<GameState>("intro");
  const [conversationStep, setConversationStep] =
    useState<ConversationStep>("question");
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [clickedItem, setClickedItem] = useState<string | null>(null);
  const [imagesLoaded, setImagesLoaded] = useState<boolean>(false);
  const [optimalTextSize, setOptimalTextSize] = useState<number>(24);
  const [askedDetails, setAskedDetails] = useState<Set<string>>(new Set());
  const [completedTopics, setCompletedTopics] = useState<Set<string>>(
    new Set()
  );

  // ゲームコンテナへの参照
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const conversationMessageRef = useRef<HTMLDivElement>(null);

  // ゲームコンテナを画面中央に配置する関数
  const scrollToGameCenter = () => {
    const gameContainer = gameContainerRef.current;
    if (gameContainer) {
      gameContainer.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  };

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

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 画像の事前読み込み（高解像度対応）
  useEffect(() => {
    const preloadImages = async () => {
      const imageUrls = [
        "/images/taichi-hello.PNG",
        "/images/taichi-silent.PNG",
        "/images/taichi-talking.GIF",
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
            img.decoding = "sync";
            img.loading = "eager";
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

  const menuItems = ["趣味", "目標", "挑戦", "デザイン"];

  // 各トピックの会話データ（2階層構造）
  const conversationData = {
    趣味: {
      question: "あなた：たいちの趣味は何？",
      answer: "たいち：映画鑑賞、ゲーム、山登り、雑貨屋巡りが好きだよ。",
      details: {
        映画: {
          label: "映画",
          question: "あなた：どんな映画が好きなの？",
          answer:
            "たいち：クエンティンタランティーノの映画が特に好きだよ。血の表現が良いよね。会話劇は基本好きかな",
        },
        ゲーム: {
          label: "ゲーム",
          question: "あなた：どんなゲームが好きなの？",
          answer:
            "たいち：ケロケロキングってゲームが好きだよ。あと最近だとSLUDGE LIFEってゲームが好きだな。雰囲気がすごく良いんだ",
        },
        山登り: {
          label: "山登り",
          question: "あなた：どこの山に登っているの？",
          answer:
            "たいち：いつも天拝山に登っているよ。頂上にある社があるところの木の下で木漏れ日を見るのが好きだよ",
        },
        雑貨屋: {
          label: "雑貨屋",
          question: "あなた：雑貨屋で何を見るのが好き？",
          answer:
            "たいち：とにかく自分好みのかわいい雑貨を探すのが好きだよ。自分好みすぎたらちょっと嫉妬しちゃうけどね",
        },
      },
    },
    目標: {
      question: "あなた：たいちの将来の目標は？",
      answer: "たいち：1年後、3年後、5年後、20年後の目標があるよ",
      details: {
        "2年後": {
          label: "1年後",
          question: "あなた：1年後はどうなっていたい？",
          answer:
            "たいち：自分のデザイン力をもっと上げて、会社でデザインするものと自分のサービスをより良いものにしていくよ",
        },
        "5年後": {
          label: "3年後",
          question: "あなた：3年後の目標は？",
          answer:
            "たいち：会社で働きながら、自分のデザインしたキャラクターに関する商品を自分のサイトで実際に売り出すことだね",
        },
        "7年後": {
          label: "5年後",
          question: "あなた：5年後の目標は？",
          answer:
            "たいち：会社で働きながら、ゲームやサービスをリリースして、得た資金が少なくてもそのお金を使って社会貢献することだよ",
        },
        "10年後": {
          label: "20年後",
          question: "あなた：20年後は？",
          answer:
            "たいち：自分のコインランドリーを経営して、自分のキャラクターのガチャガチャをお店に置くことだよ",
        },
      },
    },
    挑戦: {
      question: "あなた：近いうちにチャレンジしたいことってある？",
      answer:
        "たいち：働き始めてお金に少し余裕ができたら絵画教室、クロスフィット、作家塾、蝶ネクタイ作りにチャレンジしたいな",
      details: {
        絵画教室: {
          label: "絵画教室",
          question: "あなた：なぜ絵画教室に興味があるの？",
          answer:
            "たいち：自分の表現方法に幅を持たせたいのと、自分が思い描くキャラクターを思い通りに描いたり、既存の生み出したキャラクターをより良いデザインにしたいんだ",
        },
        作家塾: {
          label: "作家塾",
          question: "あなた：作家塾で何を書くの？",
          answer:
            "たいち：自分が考えているゲームのプロットをより良いものにしたいんだ。『hello world』っていうんだ。楽しみにしててね",
        },
        Xfit: {
          label: "Xfit",
          question: "あなた：クロスフィットって激しそうだけど大丈夫？",
          answer:
            "たいち：一回体験に行ったことがあってまた行きたいんだ。自分をより良い見た目にするためにもね",
        },
        ネクタイ: {
          label: "ネクタイ",
          question: "あなた：蝶ネクタイ作り？",
          answer:
            "たいち：自分のトレードマークとして子供の頃からずっとつけたかったんだ。自分だけのオリジナルデザインで作ってみたいな",
        },
      },
    },
    デザイン: {
      question: "あなた：好きなデザインってどんなもの？",
      answer:
        "たいち：UI&UXを損なわない、意図のある、遊び心があるデザインが好きだよ。",
      details: {
        遊び心: {
          label: "遊び心",
          question: "あなた：遊び心のあるデザインって？",
          answer:
            "たいち：興味深いキャラクターや要素が配置されていたり、アニメーションなどを用いてユーザーを楽しませるようなデザインかな",
        },
        意図: {
          label: "意図",
          question: "あなた：「意図のある」って部分を詳しく教えて",
          answer:
            "たいち：なぜそこにそのデザインの要素が配置してあるかが見て読み取れるものだよ",
        },
        会社: {
          label: "会社",
          question:
            "あなた：会社で働くとしても自分が好きなデザインを取り入れようとするの？",
          answer:
            "たいち：郷に入っては郷に従えを意識して、任された仕事に適したデザインをするつもりだよ",
        },
        例: {
          label: "例",
          question: "あなた：好きなデザインの具体例は？",
          answer:
            "たいち：長野県の移住総合WEBメディアのSuuHaa（スーハー）やワンス・アポン・ア塊魂のサイトが遊び心を感じられて、発信している情報に対してより興味を持つことができるから好きだよ ",
        },
      },
    },
  };

  const handleItemClick = (item: string) => {
    setSelectedItem(item);
    setClickedItem(item);
    setGameState("conversation");
    setConversationStep("question");
    setAskedDetails(new Set()); // 新しいトピックを選んだ時は質問履歴をリセット
    // ゲーム画面を中央に配置
    setTimeout(() => scrollToGameCenter(), 100);
  };

  const handleDetailClick = (detail: string) => {
    setSelectedDetail(detail);
    setClickedItem(detail);
    setGameState("detailedConversation");
    setConversationStep("question");
    // ゲーム画面を中央に配置
    setTimeout(() => scrollToGameCenter(), 100);
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
    // ゲーム画面を中央に配置
    setTimeout(() => scrollToGameCenter(), 100);
  };

  const handleDetailedConversationClick = () => {
    // 質問した詳細項目を履歴に追加
    const newAskedDetails = new Set(askedDetails);
    newAskedDetails.add(selectedDetail);
    setAskedDetails(newAskedDetails);

    // 現在のトピックの詳細項目数を取得
    const currentTopicDetails = Object.keys(
      conversationData[selectedItem as keyof typeof conversationData].details
    );

    // 4つ全て質問し終わったか確認
    if (newAskedDetails.size >= currentTopicDetails.length) {
      // 4つ全て聞いたらトピックを完了済みに追加
      const newCompletedTopics = new Set(completedTopics);
      newCompletedTopics.add(selectedItem);
      setCompletedTopics(newCompletedTopics);

      // 全てのトピック（4つ）が完了したかチェック
      if (newCompletedTopics.size >= 4) {
        // 全質問完了 - 終了画面へ
        setGameState("completed");
        setConversationStep("question");
        setClickedItem(null);
        setHoveredItem(null);
        setSelectedDetail("");
        setAskedDetails(new Set());
        // ゲーム画面を中央に配置
        setTimeout(() => scrollToGameCenter(), 100);
      } else {
        // まだ完了していないトピックがある - メニューに戻る
        setGameState("menu");
        setConversationStep("question");
        setClickedItem(null);
        setHoveredItem(null);
        setSelectedDetail("");
        setAskedDetails(new Set()); // 履歴をリセット
        // ゲーム画面を中央に配置
        setTimeout(() => scrollToGameCenter(), 100);
      }
    } else {
      // まだ聞いていない質問があるので詳細選択に戻る
      setGameState("detailed");
      setClickedItem(null);
      setSelectedDetail("");
      // ゲーム画面を中央に配置
      setTimeout(() => scrollToGameCenter(), 100);
    }
  };

  // ゲーム終了時の自動終了処理
  useEffect(() => {
    if (gameState === "completed" && onGameEnd) {
      const timer = setTimeout(() => {
        onGameEnd();
      }, 3000); // 3秒後に終了

      return () => clearTimeout(timer);
    }
  }, [gameState, onGameEnd]);

  // 会話の流れを管理
  useEffect(() => {
    if (
      (gameState === "conversation" || gameState === "detailedConversation") &&
      conversationStep === "question"
    ) {
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
        const profileSection =
          (document.querySelector(
            '.desktopProfileSection[data-section="profile"]'
          ) as HTMLElement) ||
          (document.querySelector(
            '[class*="desktopProfileSection"]'
          ) as HTMLElement);

        if (profileSection) {
          profileSection.scrollIntoView({
            behavior: "smooth",
            block: "start",
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
    if (
      conversationMessageRef.current &&
      (gameState === "conversation" || gameState === "detailedConversation")
    ) {
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
              {gameState === "intro" || gameState === "completed" ? (
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
              ) : (gameState === "conversation" ||
                  gameState === "detailedConversation") &&
                conversationStep === "answer" ? (
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
      <div
        className={`${styles.bottomPanel} ${
          gameState === "intro" ? styles.introMode : ""
        }`}
      >
        {gameState === "intro" ? (
          <div className={styles.introSection}>
            {!imagesLoaded ? (
              <div className={styles.loadingMessage}>画像を読み込み中...</div>
            ) : (
              <div className={styles.introMessage}>
                たいちはいきなり自己紹介してきた！！
              </div>
            )}
          </div>
        ) : gameState === "completed" ? (
          <div className={styles.conversationSection}>
            <div
              className={styles.conversationMessage}
              ref={conversationMessageRef}
              style={{ fontSize: `${optimalTextSize}px` }}
            >
              たいち：話を聞いてくれてありがとう。またね
            </div>
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
                {menuItems.map((item) => {
                  const isCompleted = completedTopics.has(item);
                  return (
                    <button
                      key={item}
                      className={`${styles.menuItem} ${
                        selectedItem === item ? styles.selected : ""
                      } ${hoveredItem === item ? styles.hovered : ""} ${
                        clickedItem === item ? styles.clicked : ""
                      } ${isCompleted ? styles.asked : ""}`}
                      onClick={() => handleItemClick(item)}
                      onMouseEnter={() => setHoveredItem(item)}
                      onMouseLeave={() => setHoveredItem(null)}
                      onMouseDown={() => handleItemMouseDown(item)}
                      onMouseUp={handleItemMouseUp}
                    >
                      <span
                        className={`${styles.menuItemTriangle} ${
                          hoveredItem === item || clickedItem === item
                            ? styles.visible
                            : ""
                        }`}
                      >
                        ▶
                      </span>
                      <span className={styles.menuItemText}>{item}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        ) : gameState === "conversation" ? (
          <div
            className={styles.conversationSection}
            onClick={
              conversationStep === "answer"
                ? handleConversationClick
                : undefined
            }
          >
            <div
              className={styles.conversationMessage}
              ref={conversationMessageRef}
              style={{ fontSize: `${optimalTextSize}px` }}
            >
              {conversationStep === "question"
                ? conversationData[
                    selectedItem as keyof typeof conversationData
                  ].question
                : conversationData[
                    selectedItem as keyof typeof conversationData
                  ].answer}
            </div>
            {conversationStep === "answer" && (
              <div className={styles.nextArrow}>▶</div>
            )}
          </div>
        ) : gameState === "detailedConversation" ? (
          <div
            className={styles.conversationSection}
            onClick={
              conversationStep === "answer"
                ? handleDetailedConversationClick
                : undefined
            }
          >
            <div
              className={styles.conversationMessage}
              ref={conversationMessageRef}
              style={{ fontSize: `${optimalTextSize}px` }}
            >
              {(() => {
                const topicData = conversationData[selectedItem as keyof typeof conversationData];
                const detailData = topicData.details[selectedDetail as keyof typeof topicData.details];
                return conversationStep === "question" ? detailData.question : detailData.answer;
              })()}}
            </div>
            {conversationStep === "answer" && (
              <div className={styles.nextArrow}>▶</div>
            )}
          </div>
        ) : (
          <>
            {/* 詳細表示モード（戻るボタン削除） */}
            <div className={styles.questionSection}>
              <div className={styles.questionTitle}>質問</div>
            </div>

            <div className={styles.menuSection}>
              <div className={styles.menuGrid}>
                {Object.entries(
                  conversationData[
                    selectedItem as keyof typeof conversationData
                  ].details
                ).map(([key, detail]) => {
                  const isAsked = askedDetails.has(key);
                  return (
                    <button
                      key={key}
                      className={`${styles.menuItem} ${
                        hoveredItem === key ? styles.hovered : ""
                      } ${clickedItem === key ? styles.clicked : ""} ${
                        isAsked ? styles.asked : ""
                      }`}
                      onClick={() => handleDetailClick(key)}
                      onMouseEnter={() => setHoveredItem(key)}
                      onMouseLeave={() => setHoveredItem(null)}
                      onMouseDown={() => handleItemMouseDown(key)}
                      onMouseUp={handleItemMouseUp}
                    >
                      <span
                        className={`${styles.menuItemTriangle} ${
                          hoveredItem === key || clickedItem === key
                            ? styles.visible
                            : ""
                        }`}
                      >
                        ▶
                      </span>
                      <span className={styles.menuItemText}>
                        {detail.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DesktopImTaichiGame;
