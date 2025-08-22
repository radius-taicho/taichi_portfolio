import React, { useState, useCallback, useEffect, useRef } from "react";
import styles from "@/styles/aboutme.module.scss";

// 🔥 Step 7: Step4ベース + グリッドレイアウトのみ - 極限までシンプル化
const skillsData = [
  { id: "figma", name: "Figma", image: "/images/figma_img.png" },
  { id: "illustrator", name: "Illustrator", image: "/images/illustrator_img.png" },
  { id: "photoshop", name: "Photoshop", image: "/images/photoshop_img.png" },
  { id: "nextjs", name: "Next.js", image: "/images/Next.js_img.png" },
  { id: "rails", name: "Rails", image: "/images/rails_img.png" },
  { id: "html", name: "HTML/CSS/JS", image: "/images/htmlcssjs_img.png" },
  { id: "sass", name: "Sass", image: "/images/sass_img.png" },
  { id: "tailwind", name: "Tailwind CSS", image: "/images/tailwind_img.png" },
  { id: "github", name: "GitHub", image: "/images/github_img.png" },
  { id: "swift", name: "Swift", image: "/images/swift_img.png" },
  { id: "ruby", name: "Ruby", image: "/images/img_ruby-skill.PNG" },
];

const SkillsTestStep7: React.FC = () => {
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
    console.log(`Step7 Device Type: ${checkDevice() ? "Touch Device" : "Desktop"}`);
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
      console.log("🕐 Step7 Skill reset by timer");
    }, delay);
  }, [clearTimer]);

  const handleSkillTouch = useCallback((skillId: string, e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const currentTime = Date.now();
    const timeSinceLastTap = currentTime - lastTapTime.current;
    
    if (timeSinceLastTap < 300) {
      console.log(`⚡ Step7 Fast tap ignored: ${timeSinceLastTap}ms`);
      return;
    }
    
    lastTapTime.current = currentTime;
    console.log(`✋ Step7 Touch: ${skillId} (${timeSinceLastTap}ms since last)`);
    
    setClickedSkill(skillId);
    resetSkillWithTimer(1000);
  }, [resetSkillWithTimer]);

  const handleSkillClick = useCallback((skillId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log(`🖱️ Step7 Click: ${skillId}`);
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

  return (
    <div className={styles.sectionContainer}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitleContainer}>
          <h2 className={styles.sectionTitle}>
            Skills Test Step 7 ({isTouchDevice ? "Touch Mode" : "Desktop Mode"})
          </h2>
          <div style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
            Step4ベース + グリッドレイアウトのみ | 極限シンプル化 | スクロールチカチカ検証
          </div>
        </div>
      </div>
      
      {/* 🎯 Step4と同じレイアウト構造 + グリッドのみ追加 */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "30px",
        padding: "40px 20px",
        alignItems: "center",
        maxWidth: "400px",
        margin: "0 auto",
      }}>
        
        {/* 1行目: 3個 - Step4と同じボックス構造 */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "25px",
          width: "100%",
          justifyItems: "center",
        }}>
          {firstRow.map((skillId) => {
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
                  // 🔥 Step4と完全に同じスタイル
                  width: "80px",
                  height: "80px",
                  border: clickedSkill === skillId ? "3px solid red" : "1px solid #ddd",
                  borderRadius: "8px", // Step4と同じ
                  padding: "10px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: clickedSkill === skillId ? "#ffe0e0" : "#f9f9f9", // Step4と同じ
                  cursor: "pointer",
                  // Step4と同じチカチカ防止
                  WebkitTapHighlightColor: "transparent",
                  WebkitTouchCallout: "none" as any,
                  WebkitUserSelect: "none" as any,
                  userSelect: "none",
                  // Step4と同じエフェクト
                  transform: clickedSkill === skillId ? "scale(1.05)" : "scale(1)",
                  transition: "all 0.15s ease-out",
                }}
              >
                <img 
                  src={skill.image}
                  alt={skill.name}
                  style={{
                    // Step4と完全に同じ画像スタイル
                    width: "50px",
                    height: "50px",
                    objectFit: "contain",
                    pointerEvents: "none",
                  }}
                />
                <div style={{
                  // Step4と完全に同じテキストスタイル
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
          })}
        </div>

        {/* 2行目: 4個 - Step4と同じボックス構造 */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
          width: "100%",
          justifyItems: "center",
        }}>
          {secondRow.map((skillId) => {
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
                  width: "80px",
                  height: "80px",
                  border: clickedSkill === skillId ? "3px solid red" : "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "10px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: clickedSkill === skillId ? "#ffe0e0" : "#f9f9f9",
                  cursor: "pointer",
                  WebkitTapHighlightColor: "transparent",
                  WebkitTouchCallout: "none" as any,
                  WebkitUserSelect: "none" as any,
                  userSelect: "none",
                  transform: clickedSkill === skillId ? "scale(1.05)" : "scale(1)",
                  transition: "all 0.15s ease-out",
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
                  }}
                />
                <div style={{
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
          })}
        </div>

        {/* 3行目: 4個 - Step4と同じボックス構造 */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
          width: "100%",
          justifyItems: "center",
        }}>
          {thirdRow.map((skillId) => {
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
                  width: "80px",
                  height: "80px",
                  border: clickedSkill === skillId ? "3px solid red" : "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "10px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: clickedSkill === skillId ? "#ffe0e0" : "#f9f9f9",
                  cursor: "pointer",
                  WebkitTapHighlightColor: "transparent",
                  WebkitTouchCallout: "none" as any,
                  WebkitUserSelect: "none" as any,
                  userSelect: "none",
                  transform: clickedSkill === skillId ? "scale(1.05)" : "scale(1)",
                  transition: "all 0.15s ease-out",
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
                  }}
                />
                <div style={{
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
          })}
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
          🎯 Step7 Active: {clickedSkill}
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
        <div>Step7: Step4構造 + グリッド</div>
        <div>完全にStep4ベース</div>
        <div>グリッドレイアウトのみ追加</div>
        <div>{isTouchDevice ? "Touch Events" : "Click Events"}</div>
      </div>
    </div>
  );
};

export default SkillsTestStep7;