import React, { useState, useCallback, useEffect, useRef } from "react";
import styles from "@/styles/aboutme.module.scss";

// スキルデータ
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

  // Step4テスト完全再現：デバイス判定
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const lastTapTime = useRef<number>(0);

  useEffect(() => {
    const checkDevice = () => {
      const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      const isMobileSize = window.innerWidth <= 768;
      return hasTouch || isMobileSize;
    };
    
    setIsTouchDevice(checkDevice());
  }, []);

  // Step4テスト完全再現：タイマー管理
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

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  // Step4テスト完全再現：高速タップ防止付きハンドラー
  const handleSkillTouch = useCallback((skillId: string, e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const currentTime = Date.now();
    const timeSinceLastTap = currentTime - lastTapTime.current;
    
    if (timeSinceLastTap < 300) {
      return;
    }
    
    lastTapTime.current = currentTime;
    
    const touch = e.touches[0];
    const clientX = touch?.clientX || 0;
    const clientY = touch?.clientY || 0;
    
    // シンプルなツールチップ表示
    const viewportWidth = window.innerWidth;
    const TOOLTIP_HEIGHT = 40;
    const MARGIN = 16;

    let tooltipX = clientX;
    let tooltipY = clientY - TOOLTIP_HEIGHT - MARGIN;

    if (tooltipY < MARGIN) {
      tooltipY = clientY + MARGIN;
    }
    if (tooltipX < MARGIN) {
      tooltipX = MARGIN;
    }
    if (tooltipX > viewportWidth - MARGIN) {
      tooltipX = viewportWidth - MARGIN;
    }

    if (activeTooltip === skillId && clickedSkill === skillId) {
      setActiveTooltip(null);
      setClickedSkill(null);
    } else {
      setClickedSkill(skillId);
      setActiveTooltip(skillId);
      setTooltipPosition({ x: tooltipX, y: tooltipY });
      resetSkillWithTimer(1000);
    }
  }, [lastTapTime, activeTooltip, clickedSkill, setActiveTooltip, setClickedSkill, setTooltipPosition, resetSkillWithTimer]);

  const handleSkillClick = useCallback((skillId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const clientX = e.clientX;
    const clientY = e.clientY;
    
    // 同じロジック
    const viewportWidth = window.innerWidth;
    const TOOLTIP_HEIGHT = 40;
    const MARGIN = 16;

    let tooltipX = clientX;
    let tooltipY = clientY - TOOLTIP_HEIGHT - MARGIN;

    if (tooltipY < MARGIN) {
      tooltipY = clientY + MARGIN;
    }
    if (tooltipX < MARGIN) {
      tooltipX = MARGIN;
    }
    if (tooltipX > viewportWidth - MARGIN) {
      tooltipX = viewportWidth - MARGIN;
    }

    if (activeTooltip === skillId && clickedSkill === skillId) {
      setActiveTooltip(null);
      setClickedSkill(null);
    } else {
      setClickedSkill(skillId);
      setActiveTooltip(skillId);
      setTooltipPosition({ x: tooltipX, y: tooltipY });
      resetSkillWithTimer(1000);
    }
  }, [activeTooltip, clickedSkill, setActiveTooltip, setClickedSkill, setTooltipPosition, resetSkillWithTimer]);

  // 配置パターン
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
      
      {/* Step4テスト完全再現：インラインスタイルのみ */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        padding: "40px 20px",
        alignItems: "center"
      }}>
        {/* 1行目: 3個 */}
        <div style={{
          display: "flex",
          gap: "20px",
          justifyContent: "center",
          flexWrap: "wrap"
        }}>
          {firstRow.map((skillId) => {
            const skill = skillsData.find(s => s.id === skillId);
            if (!skill) return null;

            const isClicked = clickedSkill === skillId;
            
            return (
              <div 
                key={skillId} 
                // Step4テスト完全再現：デバイス判定によるイベント分離
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
                  border: isClicked ? "3px solid red" : "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "10px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: isClicked ? "#ffe0e0" : "#f9f9f9",
                  cursor: "pointer",
                  // Step4テスト完全再現：チカチカ防止スタイル
                  WebkitTapHighlightColor: "transparent",
                  WebkitTouchCallout: "none",
                  WebkitUserSelect: "none",
                  userSelect: "none",
                  transform: isClicked ? "scale(1.05)" : "scale(1)",
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
                    // Step4テスト完全再現：画像がイベントを妨害しないように
                    pointerEvents: "none",
                  }}
                />
                <div style={{
                  fontSize: "10px",
                  marginTop: "4px",
                  textAlign: "center",
                  pointerEvents: "none",
                  color: isClicked ? "#d00" : "#333",
                  fontWeight: isClicked ? "bold" : "normal",
                }}>
                  {skill.name}
                </div>
              </div>
            );
          })}
        </div>

        {/* 2行目: 4個 */}
        <div style={{
          display: "flex",
          gap: "20px",
          justifyContent: "center",
          flexWrap: "wrap"
        }}>
          {secondRow.map((skillId) => {
            const skill = skillsData.find(s => s.id === skillId);
            if (!skill) return null;

            const isClicked = clickedSkill === skillId;
            
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
                  border: isClicked ? "3px solid red" : "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "10px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: isClicked ? "#ffe0e0" : "#f9f9f9",
                  cursor: "pointer",
                  WebkitTapHighlightColor: "transparent",
                  WebkitTouchCallout: "none",
                  WebkitUserSelect: "none",
                  userSelect: "none",
                  transform: isClicked ? "scale(1.05)" : "scale(1)",
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
                  color: isClicked ? "#d00" : "#333",
                  fontWeight: isClicked ? "bold" : "normal",
                }}>
                  {skill.name}
                </div>
              </div>
            );
          })}
        </div>

        {/* 3行目: 4個 */}
        <div style={{
          display: "flex",
          gap: "20px",
          justifyContent: "center",
          flexWrap: "wrap"
        }}>
          {thirdRow.map((skillId) => {
            const skill = skillsData.find(s => s.id === skillId);
            if (!skill) return null;

            const isClicked = clickedSkill === skillId;
            
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
                  border: isClicked ? "3px solid red" : "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "10px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: isClicked ? "#ffe0e0" : "#f9f9f9",
                  cursor: "pointer",
                  WebkitTapHighlightColor: "transparent",
                  WebkitTouchCallout: "none",
                  WebkitUserSelect: "none",
                  userSelect: "none",
                  transform: isClicked ? "scale(1.05)" : "scale(1)",
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
                  color: isClicked ? "#d00" : "#333",
                  fontWeight: isClicked ? "bold" : "normal",
                }}>
                  {skill.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* アクティブスキル表示 */}
      {clickedSkill && (
        <div style={{ 
          textAlign: "center", 
          marginTop: "20px",
          fontSize: "14px",
          color: "red",
          fontWeight: "bold"
        }}>
          🎯 Active: {clickedSkill}
        </div>
      )}

      {/* ツールチップ */}
      {activeTooltip && (
        <div
          style={{
            position: "fixed",
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            transform: "translate(-50%, 0)",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            color: "white",
            padding: "8px 12px",
            borderRadius: "4px",
            fontSize: "12px",
            zIndex: 1000,
            pointerEvents: "none",
          }}
        >
          {skillsData.find(s => s.id === activeTooltip)?.name}
        </div>
      )}
    </div>
  );
};

export default MobileSkillsSection;