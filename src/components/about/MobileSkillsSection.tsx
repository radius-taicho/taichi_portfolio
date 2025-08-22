import React, { useState, useCallback, useEffect, useRef } from "react";
import styles from "@/styles/aboutme.module.scss";

// 🎯 最終版: Step19ベース + 元デザイン再現（Ruby特別処理対応）
// 解決策: シンプル構造 + インライン処理でちらつき解消
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

  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const lastTapTime = useRef<number>(0);

  useEffect(() => {
    const checkDevice = () => {
      const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      const isMobileSize = window.innerWidth <= 768;
      return hasTouch || isMobileSize;
    };
    
    setIsTouchDevice(checkDevice());
    console.log('MobileSkillsSection - 最終版: Step19ベース + 元デザイン再現');
  }, []);

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
    
    handleTooltip(skillId, clientX, clientY);
  }, [lastTapTime]);

  const handleSkillClick = useCallback((skillId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const clientX = e.clientX;
    const clientY = e.clientY;
    
    handleTooltip(skillId, clientX, clientY);
  }, []);

  const handleTooltip = useCallback((skillId: string, clientX: number, clientY: number) => {
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

  return (
    <div className={styles.sectionContainer}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitleContainer}>
          <h2 className={styles.sectionTitle}>Skills</h2>
        </div>
      </div>
      
      {/* ✅ Step19ベースのシンプル単一グリッド構造（ちらつき解消） */}
      <div 
        style={{ 
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gridTemplateRows: "repeat(4, auto)",
          gap: "20px",
          padding: "40px 20px",
          maxWidth: "350px",
          margin: "0 auto",
          justifyItems: "center",
        }}
      >
        {skillsData.map((skill) => {
          const isClicked = clickedSkill === skill.id;
          const isRuby = skill.id === "ruby";
          
          // ✨ 元デザイン再現: Ruby特別処理（シンプル版）
          if (isRuby) {
            return (
              <div
                key={skill.id}
                onTouchStart={(e) => handleSkillTouch(skill.id, e)}
                onClick={(e) => handleSkillClick(skill.id, e)}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <div style={{
                  width: "75px",
                  height: "75px",
                  
                  // ✅ CSS mask-imageで円形化（ちらつき解消）
                  borderRadius: "0px",
                  maskImage: "radial-gradient(circle, white 50%, transparent 50%)",
                  WebkitMaskImage: "radial-gradient(circle, white 50%, transparent 50%)",
                  
                  overflow: "hidden",
                  cursor: "pointer",
                  border: isClicked ? "3px solid #ff4444" : "2px solid transparent",
                  transform: isClicked ? "scale(1.1)" : "scale(1)",
                  transition: "all 0.2s ease-out",
                  boxShadow: isClicked 
                    ? "0 4px 12px rgba(255, 68, 68, 0.3)" 
                    : "0 2px 8px rgba(0,0,0,0.1)",
                  
                  // パフォーマンス最適化
                  WebkitTapHighlightColor: "transparent",
                  WebkitTouchCallout: "none",
                  WebkitUserSelect: "none",
                  userSelect: "none",
                }}>
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
              </div>
            );
          }

          // ✨ 元デザイン再現: 通常スキルの美しい2重円形（シンプル版）
          return (
            <div
              key={skill.id}
              onTouchStart={(e) => handleSkillTouch(skill.id, e)}
              onClick={(e) => handleSkillClick(skill.id, e)}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
              }}
            >
              <div style={{
                width: "75px",
                height: "75px",
                
                // ✅ CSS mask-imageで円形化（ちらつき解消）
                borderRadius: "0px",
                maskImage: "radial-gradient(circle, white 50%, transparent 50%)",
                WebkitMaskImage: "radial-gradient(circle, white 50%, transparent 50%)",
                
                backgroundColor: skill.bgColor,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
                border: isClicked ? "3px solid #ff4444" : "2px solid rgba(255,255,255,0.2)",
                transform: isClicked ? "scale(1.1)" : "scale(1)",
                transition: "all 0.2s ease-out",
                boxShadow: isClicked 
                  ? `0 6px 20px ${skill.bgColor}40, 0 2px 8px rgba(255, 68, 68, 0.3)` 
                  : `0 4px 12px ${skill.bgColor}30`,
                
                // パフォーマンス最適化
                WebkitTapHighlightColor: "transparent",
                WebkitTouchCallout: "none",
                WebkitUserSelect: "none",
                userSelect: "none",
              }}>
                {/* ✨ 美しい内側円形（シンプル版） */}
                <div style={{
                  width: "50px",
                  height: "50px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  
                  // ✅ 内側もCSS mask-image
                  borderRadius: "0px",
                  maskImage: "radial-gradient(circle, white 50%, transparent 50%)",
                  WebkitMaskImage: "radial-gradient(circle, white 50%, transparent 50%)",
                  
                  backgroundColor: "rgba(255,255,255,0.1)",
                }}>
                  <img 
                    src={skill.image}
                    alt={skill.name}
                    style={{
                      width: "35px",
                      height: "35px",
                      objectFit: "contain",
                      pointerEvents: "none",
                      filter: skill.id === "nextjs" || skill.id === "github" ? "invert(1)" : "none",
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ツールチップ（元の機能完全維持） */}
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
    </div>
  );
};

export default MobileSkillsSection;