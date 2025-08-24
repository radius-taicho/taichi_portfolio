import React, { useState, useCallback, useEffect, useRef } from "react";
import styles from "@/styles/aboutme.module.scss";
import mobileStyles from "./MobileSkillsSection.module.scss";

// 🎯 最終版: Step19ベース + SCSSクラス適用版
const skillsData = [
  { id: "figma", name: "Figma", image: "/images/figma_img.png", className: "skillFigma" },
  { id: "illustrator", name: "Illustrator", image: "/images/illustrator_img.png", className: "skillIllustrator" },
  { id: "photoshop", name: "Photoshop", image: "/images/photoshop_img.png", className: "skillPhotoshop" },
  { id: "nextjs", name: "Next.js", image: "/images/Next.js_img.png", className: "skillNextjs" },
  { id: "rails", name: "Rails", image: "/images/rails_img.png", className: "skillRails" },
  { id: "html", name: "HTML/CSS/JS", image: "/images/htmlcssjs_img.png", className: "skillHtmlcssjs" },
  { id: "sass", name: "Sass", image: "/images/sass_img.png", className: "skillSass" },
  { id: "tailwind", name: "Tailwind CSS", image: "/images/tailwind_img.png", className: "skillTailwind" },
  { id: "github", name: "GitHub", image: "/images/github_img.png", className: "skillGithub" },
  { id: "swift", name: "Swift", image: "/images/swift_img.png", className: "skillSwift" },
  { id: "ruby", name: "Ruby", image: "/images/img_ruby-skill.PNG", className: "rubyImageOnly" },
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
    console.log('MobileSkillsSection - SCSSクラス適用版');
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
      
      {/* ✅ SCSSクラス適用版のスキルグリッド */}
      <div className={mobileStyles.skillsContentContainer}>
        <div className={mobileStyles.skillsRowContainer}>
          {skillsData.slice(0, 3).map((skill) => {
            const isClicked = clickedSkill === skill.id;
            const isRuby = skill.id === "ruby";
            
            if (isRuby) {
              return (
                <div
                  key={skill.id}
                  className={mobileStyles.skillWrapper}
                  onTouchStart={(e) => handleSkillTouch(skill.id, e)}
                  onClick={(e) => handleSkillClick(skill.id, e)}
                >
                  <div 
                    className={`${mobileStyles.rubyImageOnly} ${
                      isClicked ? mobileStyles.clicked : ""
                    }`}
                  >
                    <img 
                      src={skill.image}
                      alt={skill.name}
                    />
                  </div>
                </div>
              );
            }

            return (
              <div
                key={skill.id}
                className={mobileStyles.skillWrapper}
                onTouchStart={(e) => handleSkillTouch(skill.id, e)}
                onClick={(e) => handleSkillClick(skill.id, e)}
              >
                <div 
                  className={`${mobileStyles.skillCircleGrid} ${mobileStyles[skill.className]} ${
                    isClicked ? mobileStyles.clicked : ""
                  }`}
                >
                  <div className={mobileStyles.skillIcon}>
                    <img 
                      src={skill.image}
                      alt={skill.name}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className={mobileStyles.skillsRowContainer}>
          {skillsData.slice(3, 7).map((skill) => {
            const isClicked = clickedSkill === skill.id;
            const isRuby = skill.id === "ruby";
            
            if (isRuby) {
              return (
                <div
                  key={skill.id}
                  className={mobileStyles.skillWrapper}
                  onTouchStart={(e) => handleSkillTouch(skill.id, e)}
                  onClick={(e) => handleSkillClick(skill.id, e)}
                >
                  <div 
                    className={`${mobileStyles.rubyImageOnly} ${
                      isClicked ? mobileStyles.clicked : ""
                    }`}
                  >
                    <img 
                      src={skill.image}
                      alt={skill.name}
                    />
                  </div>
                </div>
              );
            }

            return (
              <div
                key={skill.id}
                className={mobileStyles.skillWrapper}
                onTouchStart={(e) => handleSkillTouch(skill.id, e)}
                onClick={(e) => handleSkillClick(skill.id, e)}
              >
                <div 
                  className={`${mobileStyles.skillCircleGrid} ${mobileStyles[skill.className]} ${
                    isClicked ? mobileStyles.clicked : ""
                  }`}
                >
                  <div className={mobileStyles.skillIcon}>
                    <img 
                      src={skill.image}
                      alt={skill.name}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className={mobileStyles.skillsRowContainer}>
          {skillsData.slice(7, 11).map((skill) => {
            const isClicked = clickedSkill === skill.id;
            const isRuby = skill.id === "ruby";
            
            if (isRuby) {
              return (
                <div
                  key={skill.id}
                  className={mobileStyles.skillWrapper}
                  onTouchStart={(e) => handleSkillTouch(skill.id, e)}
                  onClick={(e) => handleSkillClick(skill.id, e)}
                >
                  <div 
                    className={`${mobileStyles.rubyImageOnly} ${
                      isClicked ? mobileStyles.clicked : ""
                    }`}
                  >
                    <img 
                      src={skill.image}
                      alt={skill.name}
                    />
                  </div>
                </div>
              );
            }

            return (
              <div
                key={skill.id}
                className={mobileStyles.skillWrapper}
                onTouchStart={(e) => handleSkillTouch(skill.id, e)}
                onClick={(e) => handleSkillClick(skill.id, e)}
              >
                <div 
                  className={`${mobileStyles.skillCircleGrid} ${mobileStyles[skill.className]} ${
                    isClicked ? mobileStyles.clicked : ""
                  }`}
                >
                  <div className={mobileStyles.skillIcon}>
                    <img 
                      src={skill.image}
                      alt={skill.name}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ツールチップ */}
      {activeTooltip && (
        <div
          className={mobileStyles.skillTooltipCursor}
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            opacity: 1,
            visibility: 'visible'
          }}
        >
          {skillsData.find(s => s.id === activeTooltip)?.name}
        </div>
      )}
    </div>
  );
};

export default MobileSkillsSection;
