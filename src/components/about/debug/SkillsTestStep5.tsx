import React, { useState, useCallback, useEffect, useRef } from "react";
import styles from "@/styles/aboutme.module.scss";

// 🔥 Step 5: Step4ベース + 円形デザイン追加版
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

const SkillsTestStep5: React.FC = () => {
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
    console.log(`Step5 Device Type: ${checkDevice() ? "Touch Device" : "Desktop"}`);
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
      console.log("🕐 Step5 Skill reset by timer");
    }, delay);
  }, [clearTimer]);

  const handleSkillTouch = useCallback((skillId: string, e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const currentTime = Date.now();
    const timeSinceLastTap = currentTime - lastTapTime.current;
    
    if (timeSinceLastTap < 300) {
      console.log(`⚡ Step5 Fast tap ignored: ${timeSinceLastTap}ms`);
      return;
    }
    
    lastTapTime.current = currentTime;
    console.log(`✋ Step5 Touch: ${skillId} (${timeSinceLastTap}ms since last)`);
    
    setClickedSkill(skillId);
    resetSkillWithTimer(1000);
  }, [resetSkillWithTimer]);

  const handleSkillClick = useCallback((skillId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log(`🖱️ Step5 Click: ${skillId}`);
    setClickedSkill(skillId);
    resetSkillWithTimer(1000);
  }, [resetSkillWithTimer]);

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  // 🎯 円形スキルアイコンコンポーネント（Step4ベース + 円形デザイン）
  const SkillIcon = React.memo<{ skillId: string }>(({ skillId }) => {
    const skill = skillsData.find(s => s.id === skillId);
    if (!skill) return null;

    const isClicked = clickedSkill === skillId;
    const isRuby = skillId === "ruby";
    
    const handleTouchStart = useCallback((e: React.TouchEvent) => {
      handleSkillTouch(skillId, e);
    }, [skillId]);

    const handleClick = useCallback((e: React.MouseEvent) => {
      handleSkillClick(skillId, e);
    }, [skillId]);

    // 🎯 Ruby専用処理（シンプル化）
    if (isRuby) {
      return (
        <div
          {...(isTouchDevice 
            ? { onTouchStart: handleTouchStart }
            : { onClick: handleClick }
          )}
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            overflow: "hidden",
            cursor: "pointer",
            // 🔥 Step4と同じチカチカ防止（強力版）
            WebkitTapHighlightColor: "transparent",
            WebkitTouchCallout: "none",
            WebkitUserSelect: "none",
            userSelect: "none",
            // シンプルなborder + background変更のみ
            border: isClicked ? "2px solid red" : "1px solid #ddd",
            backgroundColor: isClicked ? "#ffe0e0" : "#f9f9f9",
          }}
        >
          <img 
            src={skill.image}
            alt={skill.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              pointerEvents: "none",
            }}
          />
        </div>
      );
    }

    // 🎯 通常スキル：円形カラー背景（シンプル化）
    return (
      <div
        {...(isTouchDevice 
          ? { onTouchStart: handleTouchStart }
          : { onClick: handleClick }
        )}
        style={{
          width: "70px",
          height: "70px",
          borderRadius: "50%",
          backgroundColor: skill.bgColor,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          // 🔥 Step4と同じチカチカ防止（強力版）
          WebkitTapHighlightColor: "transparent",
          WebkitTouchCallout: "none",
          WebkitUserSelect: "none",
          userSelect: "none",
          // シンプルなborder + background変更のみ（transform, box-shadowなし）
          border: isClicked ? "2px solid red" : "1px solid rgba(255,255,255,0.2)",
          opacity: isClicked ? 0.8 : 1,
        }}
      >
        <img 
          src={skill.image}
          alt={skill.name}
          style={{
            width: "35px",
            height: "35px",
            objectFit: "contain",
            pointerEvents: "none",
            filter: skillId === "nextjs" || skillId === "github" ? "invert(1)" : "none",
          }}
        />
      </div>
    );
  });

  SkillIcon.displayName = "SkillIcon";

  // 配置パターン
  const firstRow = ["figma", "illustrator", "photoshop"];
  const secondRow = ["nextjs", "html", "sass", "tailwind"];
  const thirdRow = ["rails", "github", "swift", "ruby"];

  return (
    <div className={styles.sectionContainer}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitleContainer}>
          <h2 className={styles.sectionTitle}>
            Skills Test Step 5 ({isTouchDevice ? "Touch Mode" : "Desktop Mode"})
          </h2>
          <div style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
            Step4ベース + 円形デザイン | transform/box-shadowなし | チカチカ確認
          </div>
        </div>
      </div>
      
      {/* 🎯 元のデザイン再現：グリッドレイアウト */}
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

      {clickedSkill && (
        <div style={{ 
          textAlign: "center", 
          marginTop: "20px",
          fontSize: "14px",
          color: "red",
          fontWeight: "bold"
        }}>
          🎯 Step5 Active: {clickedSkill}
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
        maxWidth: "200px"
      }}>
        <div>Step5: 円形デザイン追加</div>
        <div>{isTouchDevice ? "Touch Events Only" : "Click Events Only"}</div>
        <div>Timer: {timeoutRef.current ? "⏱️ Active" : "❌ None"}</div>
      </div>
    </div>
  );
};

export default SkillsTestStep5;