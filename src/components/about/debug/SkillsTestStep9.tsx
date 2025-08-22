import React, { useState, useCallback, useEffect, useRef } from "react";
import styles from "@/styles/aboutme.module.scss";

// 🔥 Step 9: borderRadius限界点テスト (8px〜16px間)
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

const SkillsTestStep9: React.FC = () => {
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
    console.log(`Step9 Device Type: ${checkDevice() ? "Touch Device" : "Desktop"}`);
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
      console.log("🕐 Step9 Skill reset by timer");
    }, delay);
  }, [clearTimer]);

  const handleSkillTouch = useCallback((skillId: string, e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const currentTime = Date.now();
    const timeSinceLastTap = currentTime - lastTapTime.current;
    
    if (timeSinceLastTap < 300) {
      console.log(`⚡ Step9 Fast tap ignored: ${timeSinceLastTap}ms`);
      return;
    }
    
    lastTapTime.current = currentTime;
    console.log(`✋ Step9 Touch: ${skillId} (${timeSinceLastTap}ms since last)`);
    
    setClickedSkill(skillId);
    resetSkillWithTimer(1000);
  }, [resetSkillWithTimer]);

  const handleSkillClick = useCallback((skillId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log(`🖱️ Step9 Click: ${skillId}`);
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

  // 🎯 複数のborderRadius値をテスト
  const SkillBox = React.memo<{ skillId: string; size: string; radiusTest: string }>(({ skillId, size, radiusTest }) => {
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
          // Step7と同じ基本サイズ
          width: size === "large" ? "80px" : "70px",
          height: size === "large" ? "80px" : "70px",
          
          // 🔥 限界点テスト: 12px
          borderRadius: radiusTest, 
          
          // Step7と同じ基本スタイル
          padding: "10px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          
          // Step7と同じ状態管理
          border: clickedSkill === skillId ? "3px solid red" : "1px solid #ddd",
          backgroundColor: clickedSkill === skillId ? "#ffe0e0" : "#f9f9f9",
          
          // Step7と同じチカチカ防止
          WebkitTapHighlightColor: "transparent",
          WebkitTouchCallout: "none" as any,
          WebkitUserSelect: "none" as any,
          userSelect: "none",
          
          // Step7と同じエフェクト
          transform: clickedSkill === skillId ? "scale(1.05)" : "scale(1)",
          transition: "all 0.15s ease-out",
        }}
      >
        <img 
          src={skill.image}
          alt={skill.name}
          style={{
            // Step7と完全に同じ画像スタイル
            width: "50px",
            height: "50px",
            objectFit: "contain",
            pointerEvents: "none",
          }}
        />
        <div style={{
          // Step7と完全に同じテキストスタイル
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
            Skills Test Step 9 ({isTouchDevice ? "Touch Mode" : "Desktop Mode"})
          </h2>
          <div style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
            borderRadius限界点テスト | 12px | 8px(正常) ↔ 16px(チカチカ) の中間値
          </div>
        </div>
      </div>
      
      {/* Step7と同じレイアウト構造 */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "30px",
        padding: "40px 20px",
        alignItems: "center",
        maxWidth: "400px",
        margin: "0 auto",
      }}>
        
        {/* 1行目: 3個 - 12pxテスト */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "25px",
          width: "100%",
          justifyItems: "center",
        }}>
          {firstRow.map((skillId) => (
            <SkillBox key={skillId} skillId={skillId} size="large" radiusTest="12px" />
          ))}
        </div>

        {/* 2行目: 4個 - 12pxテスト */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
          width: "100%",
          justifyItems: "center",
        }}>
          {secondRow.map((skillId) => (
            <SkillBox key={skillId} skillId={skillId} size="small" radiusTest="12px" />
          ))}
        </div>

        {/* 3行目: 4個 - 12pxテスト */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
          width: "100%",
          justifyItems: "center",
        }}>
          {thirdRow.map((skillId) => (
            <SkillBox key={skillId} skillId={skillId} size="small" radiusTest="12px" />
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
          🎯 Step9 Active: {clickedSkill}
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
        maxWidth: "250px"
      }}>
        <div>Step9: borderRadius限界点テスト</div>
        <div>8px ✅ → 12px ？ → 16px ❌</div>
        <div>現在: 12px</div>
        <div>{isTouchDevice ? "Touch Events" : "Click Events"}</div>
      </div>
    </div>
  );
};

export default SkillsTestStep9;