import React, { useState, useCallback, useEffect, useRef } from "react";
import styles from "@/styles/aboutme.module.scss";

// 🔥 Step 18: skillsState完全除去 + Step15独立状態管理
// 目的: skillsStateシステムが原因かを確認
const skillsData = [
  { id: "figma", name: "Figma", image: "/images/figma_img.png", bgColor: "#F24E1E" },
  { id: "illustrator", name: "Illustrator", image: "/images/illustrator_img.png", bgColor: "#FF9A00" },
  { id: "photoshop", name: "Photoshop", image: "/images/photoshop_img.png", bgColor: "#31A8FF" },
  { id: "nextjs", name: "Next.js", image: "/images/Next.js_img.png", bgColor: "#000000" },
  { id: "rails", name: "Rails", image: "/images/rails_img.png", bgColor: "#CC0000" },
  { id: "html", name: "HTML/CSS/JS", image: "/images/htmlcssjs_img.png", bgColor: "#E34F26" },
  { id: "sass", name: "Sass", image: "/images/sass_img.png", bgColor: "#CF649A" },
  { id: "tailwind", name: "Tailwind CSS", image: "/images/tailwind_img.png", bgColor: "#06B6D4" },
  { id: "github", name: "GitHub", image: "/images/github_img.png", bgColor: "#181717" },
  { id: "swift", name: "Swift", image: "/images/swift_img.png", bgColor: "#FA7343" },
  { id: "ruby", name: "Ruby", image: "/images/img_ruby-skill.PNG", bgColor: "#CC342D" },
];

// 🚫 skillsStateシステム完全除去、Step15の独立状態管理を採用
const SkillsTestStep18_IndependentState: React.FC = () => {
  // ✅ Step15と同じ独立した状態管理
  const [clickedSkill, setClickedSkill] = useState<string | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastTapTime = useRef<number>(0);

  useEffect(() => {
    const checkDevice = () => {
      const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      const isMobileSize = window.innerWidth <= 768;
      return hasTouch || isMobileSize;
    };
    
    setIsTouchDevice(checkDevice());
    console.log(`Step18 Device Type: ${checkDevice() ? 'Touch' : 'Desktop'}`);
    console.log('Step18 - skillsState完全除去 + Step15独立状態管理');
  }, []);

  // ✅ Step15と同じシンプルなイベント処理
  const handleSkillTap = useCallback((skillId: string) => {
    const now = Date.now();
    
    // ダブルタップ防止
    if (now - lastTapTime.current < 500) {
      console.log(`Step18: ダブルタップ防止 - ${skillId} (${now - lastTapTime.current}ms間隔)`);
      return;
    }
    
    lastTapTime.current = now;
    console.log(`Step18: スキルタップ - ${skillId}`);
    
    setClickedSkill(skillId);
    setActiveTooltip(skillId);
    
    // シンプルなツールチップ位置設定（画面中央）
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    setTooltipPosition({ 
      x: viewportWidth / 2, 
      y: viewportHeight / 2 - 50 
    });
    
    // タイマー管理
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setClickedSkill(null);
      setActiveTooltip(null);
    }, 800);
  }, []);

  // タッチイベント処理（Step15ベース）
  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>, skillId: string) => {
    e.preventDefault();
    e.stopPropagation();
    handleSkillTap(skillId);
  }, [handleSkillTap]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>, skillId: string) => {
    if (isTouchDevice) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    handleSkillTap(skillId);
  }, [handleSkillTap, isTouchDevice]);

  // ✅ Step15と完全同一のSkillIcon構造
  const SkillIcon = React.memo<{ skillId: string }>(({ skillId }) => {
    const skill = skillsData.find(s => s.id === skillId);
    if (!skill) return null;

    const isClicked = clickedSkill === skillId;

    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}>
        <div
          onTouchStart={(e) => handleTouchStart(e, skillId)}
          onClick={(e) => handleClick(e, skillId)}
          style={{
            width: "70px",
            height: "70px",
            
            // ✅ Step15で成功したCSS mask-image
            borderRadius: "0px",
            maskImage: "radial-gradient(circle, white 50%, transparent 50%)",
            WebkitMaskImage: "radial-gradient(circle, white 50%, transparent 50%)",
            
            backgroundColor: skill.bgColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            position: "relative",
            
            // パフォーマンス最適化
            WebkitTapHighlightColor: "transparent",
            userSelect: "none",
            WebkitUserSelect: "none",
            
            // シンプルなクリック時エフェクト（Step15と同じ）
            transform: isClicked ? "scale(1.05)" : "scale(1)",
            transition: "all 0.15s ease-out",
            boxShadow: isClicked 
              ? "0 8px 20px rgba(0, 0, 0, 0.15)" 
              : "0 2px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <img
            src={skill.image}
            alt={skill.name}
            style={{
              width: "50px",
              height: "50px",
              objectFit: "contain",
              pointerEvents: "none",
              filter: ["figma", "html", "sass"].includes(skill.id) ? "none" : "invert(1)",
            }}
          />
        </div>
      </div>
    );
  });

  SkillIcon.displayName = "SkillIcon";

  // 元のデザイン配置パターン維持
  const firstRow = ["figma", "illustrator", "photoshop"];
  const secondRow = ["nextjs", "html", "sass", "tailwind"];
  const thirdRow = ["rails", "github", "swift", "ruby"];

  return (
    <div className={styles.sectionContainer}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitleContainer}>
          <h2 className={styles.sectionTitle}>Skills</h2>
        </div>
      </div>
      
      {/* ✅ 元のデザイン完全再現：グリッドレイアウト（3-4-4配置） */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "30px",
        padding: "40px 20px",
        alignItems: "center",
        maxWidth: "400px",
        margin: "0 auto",
      }}>
        {/* 1行目: 3個 */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "25px",
          width: "100%",
          justifyItems: "center",
        }}>
          {firstRow.map((skillId) => (
            <SkillIcon key={skillId} skillId={skillId} />
          ))}
        </div>

        {/* 2行目: 4個 */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
          width: "100%",
          justifyItems: "center",
        }}>
          {secondRow.map((skillId) => (
            <SkillIcon key={skillId} skillId={skillId} />
          ))}
        </div>

        {/* 3行目: 4個 */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
          width: "100%",
          justifyItems: "center",
        }}>
          {thirdRow.map((skillId) => (
            <SkillIcon key={skillId} skillId={skillId} />
          ))}
        </div>
      </div>

      {/* シンプルなツールチップ（Step15ベース） */}
      {activeTooltip && (
        <div
          style={{
            position: "fixed",
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            transform: "translate(-50%, 0)",
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            color: "white",
            padding: "8px 12px",
            borderRadius: "6px",
            fontSize: "12px",
            fontWeight: "500",
            zIndex: 1000,
            pointerEvents: "none",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            whiteSpace: "nowrap",
          }}
        >
          {skillsData.find(s => s.id === activeTooltip)?.name}
        </div>
      )}
      
      {/* デバッグ情報表示 */}
      <div style={{ 
        marginTop: "20px", 
        padding: "10px", 
        backgroundColor: "#f5f5f5", 
        borderRadius: "4px",
        fontSize: "12px",
        textAlign: "center",
        color: "#666"
      }}>
        <div>🧪 <strong>Step18テスト</strong></div>
        <div>状態管理: <strong>skillsState完全除去、Step15独立方式</strong></div>
        <div>イベント処理: <strong>シンプルなuseState + useCallback</strong></div>
        <div>ツールチップ: <strong>画面中央固定（シンプル版）</strong></div>
        <div>クリック中: <strong>{clickedSkill || "なし"}</strong></div>
        <div>デバイスタイプ: <strong>{isTouchDevice ? "Touch" : "Desktop"}</strong></div>
      </div>
    </div>
  );
};

export default SkillsTestStep18_IndependentState;