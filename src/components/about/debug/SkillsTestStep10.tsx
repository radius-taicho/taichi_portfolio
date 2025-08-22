import React, { useState, useCallback, useEffect, useRef } from "react";
import styles from "@/styles/aboutme.module.scss";

// 🔥 Step 10: border-radius チカチカ問題 解決策適用版
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

const SkillsTestStep10: React.FC = () => {
  const [clickedSkill, setClickedSkill] = useState<string | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastTapTime = useRef<number>(0);

  useEffect(() => {
    const checkDevice = () => {
      const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      const isMobileSize = window.innerWidth <= 768;
      return hasTouch || isMobileSize;
    };
    
    setIsTouchDevice(checkDevice());
    console.log(`Step10 Device Type: ${checkDevice() ? "Touch Device" : "Desktop"}`);
  }, []);

  const clearTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const resetSkillWithTimer = useCallback((delay: number = 1000) => {
    clearTimer();
    
    timeoutRef.current = setTimeout(() => {
      setClickedSkill(null);
      timeoutRef.current = null;
      console.log("🕐 Step10 Skill reset by timer");
    }, delay);
  }, [clearTimer]);

  const handleSkillTouch = useCallback((skillId: string, e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const currentTime = Date.now();
    const timeSinceLastTap = currentTime - lastTapTime.current;
    
    if (timeSinceLastTap < 300) {
      console.log(`⚡ Step10 Fast tap ignored: ${timeSinceLastTap}ms`);
      return;
    }
    
    lastTapTime.current = currentTime;
    console.log(`✋ Step10 Touch: ${skillId} (${timeSinceLastTap}ms since last)`);
    
    setClickedSkill(skillId);
    resetSkillWithTimer(1000);
  }, [resetSkillWithTimer]);

  const handleSkillClick = useCallback((skillId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log(`🖱️ Step10 Click: ${skillId}`);
    setClickedSkill(skillId);
    resetSkillWithTimer(1000);
  }, [resetSkillWithTimer]);

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  // 配置パターン
  const firstRow = ["figma", "illustrator", "photoshop"];
  const secondRow = ["nextjs", "html", "sass", "tailwind"];
  const thirdRow = ["rails", "github", "swift", "ruby"];

  // 🎯 チカチカ解決策適用版スキルボックス
  const SkillBox = React.memo<{ skillId: string; size: string; testRadius: string }>(({ skillId, size, testRadius }) => {
    const skill = skillsData.find(s => s.id === skillId);
    if (!skill) return null;
    
    return (
      <div 
        key={skillId}
        {...(isTouchDevice 
          ? {
              onTouchStart: (e: React.TouchEvent) => handleSkillTouch(skillId, e)
            }
          : {
              onClick: (e: React.MouseEvent) => handleSkillClick(skillId, e)
            }
        )}
        style={{
          // 基本サイズ
          width: size === "large" ? "80px" : "70px",
          height: size === "large" ? "80px" : "70px",
          
          // 🔥 大きめの borderRadius でテスト（元々問題があった範囲）
          borderRadius: testRadius,
          
          // 基本スタイル
          padding: "10px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          
          // 状態管理
          border: clickedSkill === skillId ? "3px solid red" : "1px solid #ddd",
          backgroundColor: clickedSkill === skillId ? "#ffe0e0" : "#f9f9f9",
          
          // 基本的なチカチカ防止
          WebkitTapHighlightColor: "transparent",
          WebkitTouchCallout: "none" as any,
          WebkitUserSelect: "none" as any,
          userSelect: "none",
          
          // 基本エフェクト
          transform: clickedSkill === skillId ? "scale(1.05)" : "scale(1)",
          transition: "all 0.15s ease-out",
          
          // 🚀 Web検索で見つかったiOS Safari border-radius チカチカ解決策
          
          // 解決策1: isolation (最推奨・2024年でも有効)
          isolation: "isolate" as any,
          
          // 解決策2: -webkit-mask-image (よく知られた解決策)
          WebkitMaskImage: "-webkit-radial-gradient(white, black)" as any,
          
          // 解決策3: z-index + stacking context
          zIndex: 0,
          position: "relative" as any,
          
          // 解決策4: clip-path (Safari専用)
          clipPath: "content-box" as any,
          
        }}
      >
        <img 
          src={skill.image}
          alt={skill.name}
          style={{
            // 基本画像スタイル
            width: "50px",
            height: "50px",
            objectFit: "contain",
            pointerEvents: "none",
          }}
        />
        <div style={{
          // 基本テキストスタイル
          fontSize: "10px",
          marginTop: "4px",
          textAlign: "center",
          pointerEvents: "none",
          color: clickedSkill === skillId ? "#d00" : "#333",
          fontWeight: clickedSkill === skillId ? "bold" : "normal",
        }}>
          {skill.name}
        </div>
      </div>
    );
  });

  SkillBox.displayName = "SkillBox";

  return (
    <div className={styles.sectionContainer}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitleContainer}>
          <h2 className={styles.sectionTitle}>
            Skills Test Step 10 ({isTouchDevice ? "Touch Mode" : "Desktop Mode"})
          </h2>
          <div style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
            iOS Safari border-radius チカチカ解決策適用版 | 16px radius | 解決策4つ同時適用
          </div>
        </div>
      </div>
      
      {/* Step9と同じレイアウト構造 */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "30px",
        padding: "40px 20px",
        alignItems: "center",
        maxWidth: "400px",
        margin: "0 auto",
      }}>
        
        {/* 1行目: 3個 - 16pxテスト（解決策適用） */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "25px",
          width: "100%",
          justifyItems: "center",
        }}>
          {firstRow.map((skillId) => (
            <SkillBox key={skillId} skillId={skillId} size="large" testRadius="16px" />
          ))}
        </div>

        {/* 2行目: 4個 - 16pxテスト（解決策適用） */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
          width: "100%",
          justifyItems: "center",
        }}>
          {secondRow.map((skillId) => (
            <SkillBox key={skillId} skillId={skillId} size="small" testRadius="16px" />
          ))}
        </div>

        {/* 3行目: 4個 - 16pxテスト（解決策適用） */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
          width: "100%",
          justifyItems: "center",
        }}>
          {thirdRow.map((skillId) => (
            <SkillBox key={skillId} skillId={skillId} size="small" testRadius="16px" />
          ))}
        </div>
      </div>

      {clickedSkill && (
        <div style={{ 
          textAlign: "center", 
          marginTop: "20px",
          fontSize: "14px",
          color: "red",
          fontWeight: "bold"
        }}>
          🎯 Step10 Active: {clickedSkill}
        </div>
      )}
      
      <div style={{
        position: "fixed",
        bottom: "10px",
        right: "10px",
        fontSize: "11px",
        backgroundColor: "rgba(0,0,0,0.9)",
        color: "white",
        padding: "8px",
        borderRadius: "4px",
        zIndex: 1000,
        maxWidth: "300px"
      }}>
        <div>Step10: iOS チカチカ解決策適用</div>
        <div>✅ isolation: isolate</div>
        <div>✅ -webkit-mask-image</div>
        <div>✅ z-index: 0 + position</div>
        <div>✅ clip-path: content-box</div>
        <div>borderRadius: 16px (元々問題値)</div>
        <div>{isTouchDevice ? "Touch Events" : "Click Events"}</div>
      </div>
    </div>
  );
};

export default SkillsTestStep10;