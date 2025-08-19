import React from "react";
import Image from "next/image";
import styles from "@/styles/aboutme.module.scss";
import skillStyles from "./DesktopSkillsSection.module.scss";

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

const DesktopSkillsSection: React.FC<Props> = ({ skillsState }) => {
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

  // 3-4-4配置のスキル構成（モバイルと統一）
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
    }, 1500); // クリック操作に最適化した3秒
  };

  // クリックイベントハンドラー（スケール＆ツールチップカーソル上版）
  const handleSkillInteraction = (skillId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // 既存のタイマーをクリア
    clearTooltipTimeout();

    // クリック位置を取得
    const clientX = e.clientX;
    const clientY = e.clientY;

    // ビューポートサイズを取得
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // ツールチップのサイズ定数（デスクトップ版）
    const TOOLTIP_WIDTH = 220;
    const TOOLTIP_HEIGHT = 45;
    const MARGIN = 20;

    // ツールチップをクリック位置の上に表示（カーソル上）
    let tooltipX = clientX;
    let tooltipY = clientY - TOOLTIP_HEIGHT - MARGIN;

    // 左右の境界調整
    const minX = TOOLTIP_WIDTH / 2 + MARGIN;
    const maxX = viewportWidth - TOOLTIP_WIDTH / 2 - MARGIN;
    tooltipX = Math.max(minX, Math.min(maxX, tooltipX));

    // 上下の境界調整
    if (tooltipY < MARGIN) {
      // 上に表示できない場合は下に（カーソルの下）
      tooltipY = clientY + MARGIN;
    }

    // 下端の調整
    if (tooltipY + TOOLTIP_HEIGHT > viewportHeight - MARGIN) {
      tooltipY = viewportHeight - TOOLTIP_HEIGHT - MARGIN;
    }

    // 状態の更新（クリック状態とツールチップ）
    if (activeTooltip === skillId) {
      // 同じスキルを再クリック → 非表示
      setActiveTooltip(null);
      setClickedSkill(null);
    } else {
      // 新しいスキルまたは別のスキル → 表示

      // 既に他のスキルが表示されている場合は即座にリセット
      if (activeTooltip !== null) {
        setActiveTooltip(null);
        setClickedSkill(null);

        // わずかな遅延後に新しいスキルを表示（UIの安定性向上）
        setTimeout(() => {
          setClickedSkill(skillId);
          setActiveTooltip(skillId);
          setTooltipPosition({ x: tooltipX, y: tooltipY });

          startTooltipTimeout();
        }, 80);
      } else {
        // 何も表示されていない場合は即座に表示
        setClickedSkill(skillId);
        setActiveTooltip(skillId);
        setTooltipPosition({ x: tooltipX, y: tooltipY });

        startTooltipTimeout();
      }
    }
  };

  // スキルクラス名マッピング関数（Rubyは除外）
  const getSkillClassName = (skillId: string): string => {
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
    return classNameMap[skillId] || "";
  };

  const DesktopSkillIcon = ({
    skillId,
    className,
  }: {
    skillId: string;
    className: string;
  }) => {
    const skill = getSkillData(skillId);
    if (!skill) return null;

    // Ruby画像はシンプルな画像表示のみ（円形スタイルなし）
    if (skillId === "ruby") {
      const isClicked = clickedSkill === skillId;
      return (
        <div className={skillStyles.desktopSkillWrapper}>
          <div
            className={`${skillStyles.desktopRubyImageOnly} ${
              isClicked ? skillStyles.clicked : ""
            }`}
            onClick={(e) => handleSkillInteraction(skillId, e)}
          >
            <Image src={skill.image} alt={skill.name} width={120} height={120} />
          </div>
        </div>
      );
    }

    // その他のスキルは円形サークル背景を適用
    const skillClassName = getSkillClassName(skillId);
    const isClicked = clickedSkill === skillId;

    return (
      <div className={skillStyles.desktopSkillWrapper}>
        <div
          className={`${skillStyles.desktopSkillCircleGrid} ${skillClassName} ${
            isClicked ? skillStyles.clicked : ""
          }`}
          onClick={(e) => handleSkillInteraction(skillId, e)}
        >
          <div className={skillStyles.desktopSkillIcon}>
            <Image src={skill.image} alt={skill.name} width={120} height={120} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={skillStyles.desktopSkillsSection}>
      <div className={styles.desktopSectionHeader}>
        <div className={styles.desktopSectionTitleContainer}>
          <h2 className={styles.desktopSectionTitle}>Skills</h2>
        </div>
      </div>
      <div className={skillStyles.desktopSkillsContent}>
        {/* 全画面サイズで統一された3-4-4配置 */}
        {/* 1行目: 3個 */}
        <div className={skillStyles.desktopSkillsRow}>
          {firstRow.map((skillId) => (
            <DesktopSkillIcon key={skillId} skillId={skillId} className="" />
          ))}
        </div>

        {/* 2行目: 4個 */}
        <div className={skillStyles.desktopSkillsRow}>
          {secondRow.map((skillId) => (
            <DesktopSkillIcon key={skillId} skillId={skillId} className="" />
          ))}
        </div>

        {/* 3行目: 4個（rails、github、swift、ruby） */}
        <div className={skillStyles.desktopSkillsRow}>
          {thirdRow.map((skillId) => (
            <DesktopSkillIcon key={skillId} skillId={skillId} className="" />
          ))}
        </div>
      </div>

      {/* カーソル追従ツールチップ - カーソル上表示版 */}
      {activeTooltip && (
        <div
          className={`${skillStyles.desktopSkillTooltipCursor} ${skillStyles.active}`}
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

export default DesktopSkillsSection;
