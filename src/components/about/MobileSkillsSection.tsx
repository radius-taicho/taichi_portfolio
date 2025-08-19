import React, { useMemo, useCallback } from "react";
import Image from "next/image";
import styles from "@/styles/aboutme.module.scss";
import skillStyles from "./MobileSkillsSection.module.scss";

// スキルデータの型定義
interface SkillData {
  id: string;
  name: string;
  description: string;
  image: string;
}

// Skills Stateの型定義（クリックエフェクト版）
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
    description:
      "UI/UXデザインツール。プロトタイプ作成やデザインシステム構築が得意です。",
    image: "/images/figma_img.png",
  },
  {
    id: "illustrator",
    name: "Illustrator",
    description:
      "ベクターグラフィックスツール。ロゴやアイコン、イラスト作成に使用しています。",
    image: "/images/illustrator_img.png",
  },
  {
    id: "photoshop",
    name: "Photoshop",
    description:
      "ラスターグラフィックスツール。写真加工やバナー作成に活用しています。",
    image: "/images/photoshop_img.png",
  },
  {
    id: "nextjs",
    name: "Next.js",
    description:
      "Reactベースのフルスタックフレームワーク。SSRやSSGを活用した高速なWebアプリを開発します。",
    image: "/images/Next.js_img.png",
  },
  {
    id: "rails",
    name: "Ruby on Rails",
    description:
      "Ruby製のWebアプリケーションフレームワーク。API開発やバックエンド構築が得意です。",
    image: "/images/rails_img.png",
  },
  {
    id: "html",
    name: "HTML/CSS/JS",
    description:
      "Web開発の基礎技術。セマンティックHTML、モダンCSS、ES6+を使った開発が可能です。",
    image: "/images/htmlcssjs_img.png",
  },
  {
    id: "sass",
    name: "Sass",
    description:
      "CSSプリプロセッサ。変数やミックスイン、ネストを活用した保守性の高いCSS設計を実践します。",
    image: "/images/sass_img.png",
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    description:
      "ユーティリティファーストのCSSフレームワーク。高速なプロトタイピングと一貫したデザインが得意です。",
    image: "/images/tailwind_img.png",
  },
  {
    id: "github",
    name: "GitHub",
    description:
      "バージョン管理システム。Gitフローを理解し、チーム開発でのコラボレーションに活用しています。",
    image: "/images/github_img.png",
  },
  {
    id: "swift",
    name: "Swift",
    description:
      "Apple製のプログラミング言語。iOSアプリ開発でSwiftUIやUIKitを使ったネイティブアプリを作成します。",
    image: "/images/swift_img.png",
  },
  {
    id: "ruby",
    name: "Ruby",
    description:
      "日本生まれのプログラミング言語。美しいコードとプログラマーの幸福を重視した設計思想が魅力です。",
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

  const getSkillData = (id: string) =>
    skillsData.find((skill) => skill.id === id);

  // 3-4-4配置のスキル構成
  const firstRow = ["figma", "illustrator", "photoshop"]; // 3個
  const secondRow = ["nextjs", "html", "sass", "tailwind"]; // 4個
  const thirdRow = ["rails", "github", "swift", "ruby"]; // 4個（railsを移動、rubyも通常アイコン）

    // デバイス種別を判定する関数（改良版）
  const isTouchDevice = useCallback(() => {
    // 開発環境では画面サイズも考慮した判定
    const hasTouch = "ontouchstart" in window ||
      navigator.maxTouchPoints > 0;
    
    // 768px以下の場合はモバイルとして扱う（開発環境対応）
    const isMobileSize = window.innerWidth <= 768;
    
    return hasTouch || isMobileSize;
  }, []);

  // タイマーをクリアする関数（メモ化）
  const clearTooltipTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, [timeoutRef]);

  // タイムアウト時間を動的に決定（メモ化）
  const startTooltipTimeout = useCallback(() => {
    clearTooltipTimeout();
    // 2秒で統一
    const timeoutDuration = 2000;
    
    timeoutRef.current = setTimeout(() => {
      setActiveTooltip(null);
      setClickedSkill(null);
    }, timeoutDuration);
  }, [clearTooltipTimeout, setActiveTooltip, setClickedSkill, timeoutRef]);

  // 統一されたイベントハンドラー（メモ化）
  const handleSkillInteraction = useCallback(
    (skillId: string, clientX: number, clientY: number) => {
      // 既存のタイマーをクリア
      clearTooltipTimeout();



      // ビューポートサイズを取得
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // レスポンシブなツールチップサイズ推定（テキスト幅に合わせた動的計算）
      const skillData = getSkillData(skillId);
      const skillName = skillData?.name || "";

      // テキスト長に基づいたツールチップ幅の推定（文字数×フォントサイズ + パディング）
      let estimatedWidth = Math.max(
        60, // 最小幅
        skillName.length *
          (viewportWidth <= 320 ? 11 : viewportWidth <= 480 ? 12 : 13) +
          24 // 文字幅 + パディング
      );

      // 最大幅の制限
      const maxTooltipWidth = viewportWidth - 32;
      estimatedWidth = Math.min(estimatedWidth, maxTooltipWidth);

      const TOOLTIP_HEIGHT = 40;
      const MARGIN = 16;

      // ツールチップをクリック位置の上に表示
      let tooltipX = clientX;
      let tooltipY = clientY - TOOLTIP_HEIGHT - MARGIN;

      // 左右の境界調整（推定幅を使用）
      const minX = estimatedWidth / 2 + MARGIN;
      const maxX = viewportWidth - estimatedWidth / 2 - MARGIN;
      tooltipX = Math.max(minX, Math.min(maxX, tooltipX));

      // 上下の境界調整
      if (tooltipY < MARGIN) {
        tooltipY = clientY + MARGIN;
      }

      if (tooltipY + TOOLTIP_HEIGHT > viewportHeight - MARGIN) {
        tooltipY = viewportHeight - TOOLTIP_HEIGHT - MARGIN;
      }

      // 状態の更新
      if (activeTooltip === skillId && clickedSkill === skillId) {
        // 同じスキルを再クリック → 非表示
        setActiveTooltip(null);
        setClickedSkill(null);
      } else {
        // 新しいスキルまたは別のスキル → 表示
        setClickedSkill(skillId);
        setActiveTooltip(skillId);
        setTooltipPosition({ x: tooltipX, y: tooltipY });

        startTooltipTimeout();
      }
    },
    [
      activeTooltip,
      clickedSkill,
      setActiveTooltip,
      setClickedSkill,
      setTooltipPosition,
      clearTooltipTimeout,
      startTooltipTimeout,
    ]
  );

  // タッチイベントハンドラー（メモ化）
  const handleTouchStart = useCallback(
    (skillId: string, e: React.TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const touch = e.touches[0];
      const clientX = touch?.clientX || 0;
      const clientY = touch?.clientY || 0;
      
      handleSkillInteraction(skillId, clientX, clientY);
    },
    [handleSkillInteraction]
  );

  // クリックイベントハンドラー（改良版PC対応）（メモ化）
  const handleClick = useCallback(
    (skillId: string, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      const clientX = e.clientX;
      const clientY = e.clientY;
      
      handleSkillInteraction(skillId, clientX, clientY);
    },
    [handleSkillInteraction]
  );

  // 背景クリックでツールチップを閉じる（メモ化）
  const handleBackgroundClick = useCallback((e: React.MouseEvent) => {
    // イベントのターゲットが背景の場合のみ処理
    if (e.target === e.currentTarget) {
      clearTooltipTimeout();
      setActiveTooltip(null);
      setClickedSkill(null);
    }
  }, [clearTooltipTimeout, setActiveTooltip, setClickedSkill]);

  // メモ化されたスキルクラス名取得関数（Rubyは除外）
  const getSkillClassName = useMemo(() => {
    const classNameMap: Record<string, string> = {
      figma: skillStyles.skillFigma,
      illustrator: skillStyles.skillIllustrator,
      photoshop: skillStyles.skillPhotoshop,
      nextjs: skillStyles.skillNextjs,
      rails: skillStyles.skillRails,
      html: skillStyles.skillHtmlcssjs,
      sass: skillStyles.skillSass,
      tailwind: skillStyles.skillTailwind,
      github: skillStyles.skillGithub,
      swift: skillStyles.skillSwift,
      // ruby は除外（既に円形画像のため）
    };
    return (skillId: string) => classNameMap[skillId] || "";
  }, []);

  // メモ化された画像コンポーネント（画像再読み込み防止）
  const MemoizedSkillImage = React.memo<{ skill: SkillData }>(({ skill }) => {
    return (
      <Image
        src={skill.image}
        alt={skill.name}
        width={60}
        height={60}
        loading="eager"
        priority
        quality={90}
        sizes="60px"
        style={{ objectFit: "contain" }}
        placeholder="blur"
        blurDataURL="data:image/webp;base64,UklGRjIAAABXRUJQVlA4ICYAAAAwAQCdASoEAAQAAkA4JZwAA3AA/v8A"
      />
    );
  });

  MemoizedSkillImage.displayName = "MemoizedSkillImage";

  // メモ化されたスキルアイコンコンポーネント
  const MobileSkillIcon = React.memo<{ skillId: string }>(({ skillId }) => {
    const skill = getSkillData(skillId);
    if (!skill) return null;

    // 統一されたイベントハンドラー（再レンダリング防止）
    const handleSkillTouchStart = useCallback(
      (e: React.TouchEvent) => {
        handleTouchStart(skillId, e);
      },
      [skillId, handleTouchStart]
    );

    const handleSkillClick = useCallback(
      (e: React.MouseEvent) => {
        // マウスクリックイベントを直接処理
        handleClick(skillId, e);
      },
      [skillId, handleClick]
    );

    // Ruby画像はシンプルな画像表示のみ（円形スタイルなし）
    if (skillId === "ruby") {
      const isClicked = clickedSkill === skillId;
      return (
        <div className={skillStyles.skillWrapper}>
          <div
          className={`${skillStyles.rubyImageOnly} ${
          isClicked ? skillStyles.clicked : ""
          }`}
          onTouchStart={handleSkillTouchStart}
          onMouseDown={handleSkillClick}
          >
            <MemoizedSkillImage skill={skill} />
          </div>
        </div>
      );
    }

    // その他のスキルは円形サークル背景を適用
    const skillClassName = getSkillClassName(skillId);
    const isClicked = clickedSkill === skillId;

    return (
      <div className={skillStyles.skillWrapper}>
        <div
          className={`${skillStyles.skillCircleGrid} ${skillClassName} ${
            isClicked ? skillStyles.clicked : ""
          }`}
          onTouchStart={handleSkillTouchStart}
          onMouseDown={handleSkillClick}
        >
          <div className={skillStyles.skillIcon}>
            <MemoizedSkillImage skill={skill} />
          </div>
        </div>
      </div>
    );
  });

  MobileSkillIcon.displayName = "MobileSkillIcon";

  return (
  <div 
        className={styles.sectionContainer} 
        onClick={handleBackgroundClick}
        onTouchStart={(e) => {
          // 背景のタッチイベントのみ処理
          if (e.target === e.currentTarget) {
            clearTooltipTimeout();
            setActiveTooltip(null);
            setClickedSkill(null);
          }
        }}
      >
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitleContainer}>
          <h2 className={styles.sectionTitle}>Skills</h2>
        </div>
      </div>
      <div className={skillStyles.skillsContentContainer}>
        {/* 全画面サイズで統一された3-4-4配置 */}
        {/* 1行目: 3個 */}
        <div className={skillStyles.skillsRowContainer}>
          {firstRow.map((skillId) => (
            <MobileSkillIcon key={skillId} skillId={skillId} />
          ))}
        </div>

        {/* 2行目: 4個 */}
        <div className={skillStyles.skillsRowContainer}>
          {secondRow.map((skillId) => (
            <MobileSkillIcon key={skillId} skillId={skillId} />
          ))}
        </div>

        {/* 3行目: 4個（rails、github、swift、ruby） */}
        <div className={skillStyles.skillsRowContainer}>
          {thirdRow.map((skillId) => (
            <MobileSkillIcon key={skillId} skillId={skillId} />
          ))}
        </div>
      </div>

      {/* カーソル追従ツールチップ - カーソル上表示版 */}
      {activeTooltip && (
        <div
          className={`${skillStyles.skillTooltipCursor} ${skillStyles.active}`}
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            transform: "translate(-50%, 0)",
          }}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          {getSkillData(activeTooltip)?.name}
        </div>
      )}
    </div>
  );
};

export default MobileSkillsSection;