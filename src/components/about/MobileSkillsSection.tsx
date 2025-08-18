import React from "react";
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

  // タイマーをクリアする関数
  const clearTooltipTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  // 3秒後にツールチップとスケールを非表示にする関数
  const startTooltipTimeout = () => {
    clearTooltipTimeout();
    timeoutRef.current = setTimeout(() => {
      setActiveTooltip(null);
      setClickedSkill(null);
    }, 1500);
  };

  // タッチイベント専用ハンドラー（モバイル最適化版）- passive: false対応
  const handleTouchStart = (skillId: string, e: React.TouchEvent) => {
    // passive: falseにできないReact TouchEventではpreventDefault()を削除
    e.stopPropagation();

    // 既存のタイマーをクリア
    clearTooltipTimeout();

    // タッチ座標を取得
    const touch = e.touches[0];
    const clientX = touch?.clientX || 0;
    const clientY = touch?.clientY || 0;



    // ビューポートサイズを取得
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // ツールチップのサイズ定数（モバイル版）
    const TOOLTIP_WIDTH = 180;
    const TOOLTIP_HEIGHT = 40;
    const MARGIN = 16;

    // ツールチップをタッチ位置の上に表示
    let tooltipX = clientX;
    let tooltipY = clientY - TOOLTIP_HEIGHT - MARGIN;

    // 左右の境界調整
    const minX = TOOLTIP_WIDTH / 2 + MARGIN;
    const maxX = viewportWidth - TOOLTIP_WIDTH / 2 - MARGIN;
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
      // 同じスキルを再タップ → 非表示
      setActiveTooltip(null);
      setClickedSkill(null);

    } else {
      // 新しいスキルまたは別のスキル → 表示
      setClickedSkill(skillId);
      setActiveTooltip(skillId);
      setTooltipPosition({ x: tooltipX, y: tooltipY });

      startTooltipTimeout();
    }
  };

  // クリックイベントハンドラー（フォールバック用）
  const handleClick = (skillId: string, e: React.MouseEvent) => {
    // タッチデバイスでない場合のフォールバック
    if (window.ontouchstart === undefined) {
      e.preventDefault();
      e.stopPropagation();
      handleTouchStart(skillId, {
        preventDefault: () => {},
        stopPropagation: () => {},
        touches: [{ clientX: e.clientX, clientY: e.clientY }],
      } as any);
    }
  };

  const MobileSkillIcon = ({ skillId }: { skillId: string }) => {
    const skill = getSkillData(skillId);
    if (!skill) return null;

    // Ruby画像の特別処理 - サークルなしでサイズを統一
    if (skillId === "ruby") {
      return (
        <div className={skillStyles.skillWrapper}>
          <div
            className={`${skillStyles.rubyImageOnly} ${
              clickedSkill === skillId ? skillStyles.clicked : ""
            }`}
            onTouchStart={(e) => handleTouchStart(skillId, e)}
            onClick={(e) => handleClick(skillId, e)}
          >
            <Image
              src={skill.image}
              alt={skill.name}
              width={80}
              height={80}
            />
          </div>
        </div>
      );
    }

    // その他のスキルは円形アイコンとして表示

    // classNameを正しく解決して適用（Rubyは除外）
    const skillClassName =
      skillId === "figma"
        ? skillStyles.skillFigma
        : skillId === "illustrator"
        ? skillStyles.skillIllustrator
        : skillId === "photoshop"
        ? skillStyles.skillPhotoshop
        : skillId === "nextjs"
        ? skillStyles.skillNextjs
        : skillId === "rails"
        ? skillStyles.skillRails
        : skillId === "html"
        ? skillStyles.skillHtmlcssjs
        : skillId === "sass"
        ? skillStyles.skillSass
        : skillId === "tailwind"
        ? skillStyles.skillTailwind
        : skillId === "github"
        ? skillStyles.skillGithub
        : skillId === "swift"
        ? skillStyles.skillSwift
        : "";

    return (
      <div className={skillStyles.skillWrapper}>
        <div
          className={`${skillStyles.skillCircleGrid} ${skillClassName} ${
            clickedSkill === skillId ? skillStyles.clicked : ""
          }`}
          onTouchStart={(e) => handleTouchStart(skillId, e)}
          onClick={(e) => handleClick(skillId, e)}
        >
          <div className={skillStyles.skillIcon}>
            <Image src={skill.image} alt={skill.name} width={60} height={60} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.sectionContainer}>
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
        >
          {getSkillData(activeTooltip)?.name}
        </div>
      )}
    </div>
  );
};

export default MobileSkillsSection;
