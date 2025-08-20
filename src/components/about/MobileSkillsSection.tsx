import React, { useMemo, useCallback, useEffect } from "react";
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

  // 🔍 緊急診断用：青い四角の正体を特定
  useEffect(() => {
    // デバッグ情報を画面に表示
    const addDebugInfo = () => {
      const debugDiv = document.createElement('div');
      debugDiv.id = 'tap-debug-info';
      debugDiv.style.cssText = `
        position: fixed;
        top: 10px;
        left: 10px;
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 10px;
        font-size: 12px;
        z-index: 9999;
        max-width: 300px;
        border-radius: 5px;
      `;
      
      const skillElements = document.querySelectorAll('.skillCircleGrid, .rubyImageOnly');
      let debugText = '🔍 タップハイライト診断:\n';
      
      skillElements.forEach((el, index) => {
        const computedStyle = window.getComputedStyle(el);
        const tapHighlight = computedStyle.getPropertyValue('-webkit-tap-highlight-color');
        const cursor = computedStyle.getPropertyValue('cursor');
        const touchAction = computedStyle.getPropertyValue('touch-action');
        
        debugText += `\n要素${index + 1}:`;
        debugText += `\n  ハイライト: ${tapHighlight}`;
        debugText += `\n  カーソル: ${cursor}`;
        debugText += `\n  タッチ: ${touchAction}`;
        
        // 画像要素も確認
        const img = el.querySelector('img, [data-nimg]');
        if (img) {
          const imgStyle = window.getComputedStyle(img);
          const imgHighlight = imgStyle.getPropertyValue('-webkit-tap-highlight-color');
          const pointerEvents = imgStyle.getPropertyValue('pointer-events');
          debugText += `\n  画像ハイライト: ${imgHighlight}`;
          debugText += `\n  画像ポインタ: ${pointerEvents}`;
        }
      });
      
      debugDiv.innerText = debugText;
      document.body.appendChild(debugDiv);
      
      // 5秒後に自動で非表示
      setTimeout(() => {
        debugDiv.remove();
      }, 10000);
    };
    
    // 1秒後に診断実行
    setTimeout(addDebugInfo, 1000);
  }, []);

  // 🚨 最終手段：iOS Safari タップハイライト完全根絶（超強力版）
  useEffect(() => {
    // Step 1: 最強のグローバル無効化
    const applyNuclearFix = () => {
      // 全ページレベルでの無効化
      const css = `
        *, *:before, *:after, 
        img, [data-nimg], [data-nimg] *, 
        .skillCircleGrid, .skillCircleGrid *,
        .rubyImageOnly, .rubyImageOnly * {
          -webkit-tap-highlight-color: transparent !important;
          -webkit-tap-highlight-color: rgba(0,0,0,0) !important;
          -webkit-touch-callout: none !important;
          -webkit-user-select: none !important;
          user-select: none !important;
          outline: none !important;
          -webkit-appearance: none !important;
          -webkit-focus-ring-color: transparent !important;
          -webkit-highlight: none !important;
          touch-action: manipulation !important;
        }
        
        /* 画像の完全無効化 */
        .skillCircleGrid img, .rubyImageOnly img,
        .skillCircleGrid [data-nimg], .rubyImageOnly [data-nimg] {
          pointer-events: none !important;
          -webkit-tap-highlight-color: transparent !important;
          -webkit-tap-highlight-color: rgba(0,0,0,0) !important;
          -webkit-touch-callout: none !important;
          -webkit-user-select: none !important;
          user-select: none !important;
          outline: none !important;
          cursor: default !important;
          -webkit-user-drag: none !important;
          -webkit-appearance: none !important;
        }
        
        /* クリッカブル要素の完全無効化 */
        .skillCircleGrid, .rubyImageOnly {
          -webkit-tap-highlight-color: transparent !important;
          -webkit-tap-highlight-color: rgba(0,0,0,0) !important;
          -webkit-touch-callout: none !important;
          outline: none !important;
          cursor: default !important;
          -webkit-user-select: none !important;
          user-select: none !important;
          -webkit-appearance: none !important;
          touch-action: manipulation !important;
        }
        
        /* アクティブ状態での無効化 */
        .skillCircleGrid:active, .rubyImageOnly:active,
        .skillCircleGrid:focus, .rubyImageOnly:focus,
        .skillCircleGrid:hover, .rubyImageOnly:hover {
          -webkit-tap-highlight-color: transparent !important;
          -webkit-tap-highlight-color: rgba(0,0,0,0) !important;
          outline: none !important;
        }
      `;
      
      const style = document.createElement('style');
      style.id = 'tap-highlight-killer';
      style.innerHTML = css;
      document.head.appendChild(style);
    };
    
    // Step 2: DOM要素への直接適用
    const applyDirectFix = () => {
      const skillElements = document.querySelectorAll('.skillCircleGrid, .rubyImageOnly');
      
      skillElements.forEach(element => {
        const htmlElement = element as HTMLElement;
        
        // 親要素への全プロパティ適用
        const properties = [
          ['-webkit-tap-highlight-color', 'transparent'],
          ['-webkit-tap-highlight-color', 'rgba(0,0,0,0)'],
          ['-webkit-touch-callout', 'none'],
          ['-webkit-user-select', 'none'],
          ['user-select', 'none'],
          ['outline', 'none'],
          ['cursor', 'default'],
          ['-webkit-appearance', 'none'],
          ['touch-action', 'manipulation'],
          ['-webkit-focus-ring-color', 'transparent'],
          ['-webkit-highlight', 'none']
        ];
        
        properties.forEach(([prop, value]) => {
          htmlElement.style.setProperty(prop, value, 'important');
        });
        
        // 子要素（画像含む）への適用
        const allChildren = htmlElement.querySelectorAll('*');
        allChildren.forEach(child => {
          const childElement = child as HTMLElement;
          properties.forEach(([prop, value]) => {
            childElement.style.setProperty(prop, value, 'important');
          });
          
          // 画像要素には pointer-events も適用
          if (childElement.tagName === 'IMG' || childElement.hasAttribute('data-nimg')) {
            childElement.style.setProperty('pointer-events', 'none', 'important');
            childElement.style.setProperty('-webkit-user-drag', 'none', 'important');
          }
        });
      });
    };
    
    // Step 3: イベントレベルでの完全ブロック
    const blockAllEvents = () => {
      const skillElements = document.querySelectorAll('.skillCircleGrid, .rubyImageOnly');
      
      skillElements.forEach(element => {
        // 全てのタッチ関連イベントをブロック
        const events = ['touchstart', 'touchmove', 'touchend', 'touchcancel', 'mousedown', 'mouseup', 'click'];
        
        events.forEach(eventType => {
          element.addEventListener(eventType, (e) => {
            // ハイライト関連の処理のみブロック、機能は維持
            e.stopPropagation();
          }, { passive: true, capture: true });
        });
      });
    };
    
    // 複数回実行で確実に適用
    const executeAll = () => {
      applyNuclearFix();
      applyDirectFix();
      blockAllEvents();
    };
    
    // 即座に実行
    executeAll();
    // 100ms後に再実行
    setTimeout(executeAll, 100);
    // 500ms後に再実行
    setTimeout(executeAll, 500);
    // 1秒後に最終実行
    setTimeout(executeAll, 1000);
    
    return () => {
      // クリーンアップ
      const style = document.getElementById('tap-highlight-killer');
      if (style) {
        style.remove();
      }
    };
  }, []);

  const getSkillData = (id: string) =>
    skillsData.find((skill) => skill.id === id);

  // 3-4-4配置のスキル構成
  const firstRow = ["figma", "illustrator", "photoshop"]; // 3個
  const secondRow = ["nextjs", "html", "sass", "tailwind"]; // 4個
  const thirdRow = ["rails", "github", "swift", "ruby"]; // 4個（railsを移動、rubyも通常アイコン）

  // デバイス種別を判定する関数（改良版）
  const isTouchDevice = useCallback(() => {
    // 開発環境では画面サイズも考慮した判定
    const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;

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

  // タッチイベントハンドラー（超強化版）
  const handleTouchStart = useCallback(
    (skillId: string, e: React.TouchEvent) => {
      // 🎯 iOS Safariタップハイライトを完全に防ぐための強力な処理
      e.preventDefault();
      e.stopPropagation();
      e.nativeEvent.preventDefault();
      e.nativeEvent.stopImmediatePropagation();
      
      // returnValueを使用した追加のブロック（非推奨だが効果的）
      if ('returnValue' in e.nativeEvent) {
        (e.nativeEvent as any).returnValue = false;
      }
      
      const touch = e.touches[0];
      const clientX = touch?.clientX || 0;
      const clientY = touch?.clientY || 0;

      handleSkillInteraction(skillId, clientX, clientY);
    },
    [handleSkillInteraction]
  );

  // クリックイベントハンドラー（強化版）
  const handleClick = useCallback(
    (skillId: string, e: React.MouseEvent) => {
      // タップハイライトを完全に防ぐためのpreventDefault
      e.preventDefault();
      e.stopPropagation();
      e.nativeEvent.preventDefault();
      e.nativeEvent.stopImmediatePropagation();
      
      const clientX = e.clientX;
      const clientY = e.clientY;

      handleSkillInteraction(skillId, clientX, clientY);
    },
    [handleSkillInteraction]
  );

  // 背景クリックでツールチップを閉じる（強化版）
  const handleBackgroundClick = useCallback(
    (e: React.MouseEvent) => {
      // イベントのターゲットが背景の場合のみ処理
      if (e.target === e.currentTarget) {
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.preventDefault();
        e.nativeEvent.stopImmediatePropagation();
        clearTooltipTimeout();
        setActiveTooltip(null);
        setClickedSkill(null);
      }
    },
    [clearTooltipTimeout, setActiveTooltip, setClickedSkill]
  );

  // 背景タッチイベントハンドラー（強化版）
  const handleBackgroundTouchStart = useCallback(
    (e: React.TouchEvent) => {
      // イベントのターゲットが背景の場合のみ処理
      if (e.target === e.currentTarget) {
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.preventDefault();
        e.nativeEvent.stopImmediatePropagation();
        clearTooltipTimeout();
        setActiveTooltip(null);
        setClickedSkill(null);
      }
    },
    [clearTooltipTimeout, setActiveTooltip, setClickedSkill]
  );

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

    // タッチエンドイベント（強化版）
    const handleSkillTouchEnd = useCallback((e: React.TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
      e.nativeEvent.preventDefault();
      e.nativeEvent.stopImmediatePropagation();
    }, []);

    // タッチキャンセルイベント（強化版）
    const handleSkillTouchCancel = useCallback((e: React.TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
      e.nativeEvent.preventDefault();
      e.nativeEvent.stopImmediatePropagation();
    }, []);

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
            onTouchEnd={handleSkillTouchEnd}
            onTouchCancel={handleSkillTouchCancel}
            onClick={handleSkillClick}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              e.nativeEvent.preventDefault();
              e.nativeEvent.stopImmediatePropagation();
            }}
            onContextMenu={(e) => {
              e.preventDefault();
              e.stopPropagation();
              e.nativeEvent.preventDefault();
              e.nativeEvent.stopImmediatePropagation();
            }}
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
          onTouchEnd={handleSkillTouchEnd}
          onTouchCancel={handleSkillTouchCancel}
          onClick={handleSkillClick}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            e.nativeEvent.preventDefault();
            e.nativeEvent.stopImmediatePropagation();
          }}
          onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
            e.nativeEvent.preventDefault();
            e.nativeEvent.stopImmediatePropagation();
          }}
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
      onTouchStart={handleBackgroundTouchStart}
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
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            e.nativeEvent.preventDefault();
            e.nativeEvent.stopImmediatePropagation();
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            e.nativeEvent.preventDefault();
            e.nativeEvent.stopImmediatePropagation();
          }}
          onTouchStart={(e) => {
            e.preventDefault();
            e.stopPropagation();
            e.nativeEvent.preventDefault();
            e.nativeEvent.stopImmediatePropagation();
          }}
        >
          {getSkillData(activeTooltip)?.name}
        </div>
      )}
    </div>
  );
};

export default MobileSkillsSection;
