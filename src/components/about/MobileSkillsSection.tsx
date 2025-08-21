import React, { useState, useCallback, useEffect, useRef } from "react";
import styles from "@/styles/aboutme.module.scss";
import skillStyles from "./MobileSkillsSection.module.scss";

// スキルデータの型定義
interface SkillData {
  id: string;
  name: string;
  description: string;
  image: string;
}

// Skills Stateの型定義
interface SkillsState {
  activeTooltip: string | null;
  setActiveTooltip: (tooltip: string | null) => void;
  tooltipPosition: { x: number; y: number };
  setTooltipPosition: (position: { x: number; y: number }) => void;
  clickedSkill: string | null;
  setClickedSkill: (skill: string | null) => void;
  timeoutRef: React.MutableRefObject<NodeJS.Timeout | null>;
}

interface Props {
  skillsState: SkillsState;
}

const skillsData: SkillData[] = [
  {
    id: "figma",
    name: "Figma",
    description: "UI/UXデザインツール。プロトタイプ作成やデザインシステム構築が得意です。",
    image: "/images/figma_img.png",
  },
  {
    id: "illustrator",
    name: "Illustrator",
    description: "ベクターグラフィックスツール。ロゴやアイコン、イラスト作成に使用しています。",
    image: "/images/illustrator_img.png",
  },
  {
    id: "photoshop",
    name: "Photoshop",
    description: "ラスターグラフィックスツール。写真加工やバナー作成に活用しています。",
    image: "/images/photoshop_img.png",
  },
  {
    id: "nextjs",
    name: "Next.js",
    description: "Reactベースのフルスタックフレームワーク。SSRやSSGを活用した高速なWebアプリを開発します。",
    image: "/images/Next.js_img.png",
  },
  {
    id: "rails",
    name: "Ruby on Rails",
    description: "Ruby製のWebアプリケーションフレームワーク。API開発やバックエンド構築が得意です。",
    image: "/images/rails_img.png",
  },
  {
    id: "html",
    name: "HTML/CSS/JS",
    description: "Web開発の基礎技術。セマンティックHTML、モダンCSS、ES6+を使った開発が可能です。",
    image: "/images/htmlcssjs_img.png",
  },
  {
    id: "sass",
    name: "Sass",
    description: "CSSプリプロセッサ。変数やミックスイン、ネストを活用した保守性の高いCSS設計を実践します。",
    image: "/images/sass_img.png",
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    description: "ユーティリティファーストのCSSフレームワーク。高速なプロトタイピングと一貫したデザインが得意です。",
    image: "/images/tailwind_img.png",
  },
  {
    id: "github",
    name: "GitHub",
    description: "バージョン管理システム。Gitフローを理解し、チーム開発でのコラボレーションに活用しています。",
    image: "/images/github_img.png",
  },
  {
    id: "swift",
    name: "Swift",
    description: "Apple製のプログラミング言語。iOSアプリ開発でSwiftUIやUIKitを使ったネイティブアプリを作成します。",
    image: "/images/swift_img.png",
  },
  {
    id: "ruby",
    name: "Ruby",
    description: "日本生まれのプログラミング言語。美しいコードとプログラマーの幸福を重視した設計思想が魅力です。",
    image: "/images/img_ruby-skill.PNG",
  },
];

const MobileSkillsSection: React.FC<Props> = ({ skillsState }) => {
  const {
    activeTooltip,
    setActiveTooltip,
    tooltipPosition,
    setTooltipPosition,
    clickedSkill,
    setClickedSkill,
    timeoutRef,
  } = skillsState;

  // 🎯 Step4確実パターン: デバイス判定と高速タップ防止
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const lastTapTime = useRef<number>(0);

  // デバイス判定（マウント時のみ実行）
  useEffect(() => {
    const checkDevice = () => {
      const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      const isMobileSize = window.innerWidth <= 768;
      return hasTouch || isMobileSize;
    };
    
    setIsTouchDevice(checkDevice());
  }, []);

  // 🎯 Step4確実パターン: タイマー管理
  const clearTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, [timeoutRef]);

  const resetSkillWithTimer = useCallback((delay: number = 1000) => {
    clearTimer();
    timeoutRef.current = setTimeout(() => {
      setActiveTooltip(null);
      setClickedSkill(null);
      timeoutRef.current = null;
    }, delay);
  }, [clearTimer, setActiveTooltip, setClickedSkill, timeoutRef]);

  // クリーンアップ
  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  const getSkillData = (id: string) =>
    skillsData.find((skill) => skill.id === id);

  // 3-4-4配置
  const firstRow = ["figma", "illustrator", "photoshop"];
  const secondRow = ["nextjs", "html", "sass", "tailwind"];
  const thirdRow = ["rails", "github", "swift", "ruby"];

  // 🎯 Step4確実パターン: 高速タップ防止機能付きハンドラー
  const handleSkillTouch = useCallback((skillId: string, e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // 高速タップ防止
    const currentTime = Date.now();
    const timeSinceLastTap = currentTime - lastTapTime.current;
    
    if (timeSinceLastTap < 300) {
      return;
    }
    
    lastTapTime.current = currentTime;
    
    // シンプルなツールチップ表示
    const touch = e.touches[0];
    const clientX = touch?.clientX || 0;
    const clientY = touch?.clientY || 0;
    
    handleSkillInteraction(skillId, clientX, clientY);
  }, [lastTapTime]);

  const handleSkillClick = useCallback((skillId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const clientX = e.clientX;
    const clientY = e.clientY;
    
    handleSkillInteraction(skillId, clientX, clientY);
  }, []);

  // 🎯 Step4確実パターン: シンプルな位置計算
  const handleSkillInteraction = useCallback(
    (skillId: string, clientX: number, clientY: number) => {
      clearTimer();

      const viewportWidth = window.innerWidth;
      const TOOLTIP_HEIGHT = 40;
      const MARGIN = 16;

      let tooltipX = clientX;
      let tooltipY = clientY - TOOLTIP_HEIGHT - MARGIN;

      // 簡単な境界調整
      if (tooltipY < MARGIN) {
        tooltipY = clientY + MARGIN;
      }
      if (tooltipX < MARGIN) {
        tooltipX = MARGIN;
      }
      if (tooltipX > viewportWidth - MARGIN) {
        tooltipX = viewportWidth - MARGIN;
      }

      // 状態更新
      if (activeTooltip === skillId && clickedSkill === skillId) {
        setActiveTooltip(null);
        setClickedSkill(null);
      } else {
        setClickedSkill(skillId);
        setActiveTooltip(skillId);
        setTooltipPosition({ x: tooltipX, y: tooltipY });
        resetSkillWithTimer(1000);
      }
    },
    [activeTooltip, clickedSkill, setActiveTooltip, setClickedSkill, setTooltipPosition, clearTimer, resetSkillWithTimer]
  );

  // 🎯 Step4確実パターン: シンプル画像コンポーネント（チカチカ防止）
  const SkillImage = React.memo<{ skill: SkillData }>(({ skill }) => (
    <img
      src={skill.image}
      alt={skill.name}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "contain",
        display: "block",
        // チカチカ防止の核心部分
        backgroundColor: "transparent",
        WebkitTapHighlightColor: "transparent",
        WebkitTouchCallout: "none",
        WebkitUserSelect: "none",
        userSelect: "none",
        pointerEvents: "none", // 重要：画像自体はイベントを受けない
      }}
      loading="eager"
      onLoad={(e) => {
        // 安定化処理
        e.currentTarget.style.backgroundColor = "transparent";
      }}
    />
  ));
  SkillImage.displayName = "SkillImage";

  // 🎯 Step4確実パターン: シンプルスキルアイコン
  const SkillIcon = React.memo<{ skillId: string }>(({ skillId }) => {
    const skill = getSkillData(skillId);
    if (!skill) return null;

    const isClicked = clickedSkill === skillId;
    
    // イベントハンドラー（最適化済み）
    const handleTouchStart = useCallback((e: React.TouchEvent) => {
      handleSkillTouch(skillId, e);
    }, [skillId]);

    const handleClick = useCallback((e: React.MouseEvent) => {
      handleSkillClick(skillId, e);
    }, [skillId]);

    return (
      <div className={skillStyles.skillWrapper}>
        <div
          className={`${skillStyles.skillCircleGrid} ${
            isClicked ? skillStyles.clicked : ""
          }`}
          // 🎯 Step4確実パターン: 完全なイベント分離
          {...(isTouchDevice 
            ? { onTouchStart: handleTouchStart }
            : { onClick: handleClick }
          )}
          style={{
            // チカチカ防止の重要なスタイル
            WebkitTapHighlightColor: "transparent",
            WebkitTouchCallout: "none",
            WebkitUserSelect: "none",
            userSelect: "none",
            cursor: "pointer",
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <div className={skillStyles.skillIcon}>
            <SkillImage skill={skill} />
          </div>
        </div>
      </div>
    );
  });
  SkillIcon.displayName = "SkillIcon";

  // 背景クリックハンドラー
  const handleBackgroundClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      e.preventDefault();
      e.stopPropagation();
      clearTimer();
      setActiveTooltip(null);
      setClickedSkill(null);
    }
  }, [clearTimer, setActiveTooltip, setClickedSkill]);

  const handleBackgroundTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.target === e.currentTarget) {
      e.preventDefault();
      e.stopPropagation();
      clearTimer();
      setActiveTooltip(null);
      setClickedSkill(null);
    }
  }, [clearTimer, setActiveTooltip, setClickedSkill]);

  return (
    <div
      className={styles.sectionContainer}
      onClick={handleBackgroundClick}
      onTouchStart={handleBackgroundTouchStart}
    >
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitleContainer}>
          <h2 className={styles.sectionTitle}>Skills</h2>
        </div>
      </div>
      
      <div className={skillStyles.skillsContentContainer}>
        {/* 1行目: 3個 */}
        <div className={skillStyles.skillsRowContainer}>
          {firstRow.map((skillId) => (
            <SkillIcon key={skillId} skillId={skillId} />
          ))}
        </div>

        {/* 2行目: 4個 */}
        <div className={skillStyles.skillsRowContainer}>
          {secondRow.map((skillId) => (
            <SkillIcon key={skillId} skillId={skillId} />
          ))}
        </div>

        {/* 3行目: 4個 */}
        <div className={skillStyles.skillsRowContainer}>
          {thirdRow.map((skillId) => (
            <SkillIcon key={skillId} skillId={skillId} />
          ))}
        </div>
      </div>

      {/* ツールチップ */}
      {activeTooltip && (
        <div
          className={`${skillStyles.skillTooltipCursor} ${skillStyles.active}`}
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            transform: "translate(-50%, 0)",
          }}
          onMouseDown={(e) => e.preventDefault()}
          onClick={(e) => e.preventDefault()}
          onTouchStart={(e) => e.preventDefault()}
        >
          {getSkillData(activeTooltip)?.name}
        </div>
      )}
    </div>
  );
};

export default MobileSkillsSection;