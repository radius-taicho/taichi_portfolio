import React, { useState, useCallback, useEffect, useRef } from "react";
import styles from "@/styles/aboutme.module.scss";

// 🔥 Step 16: CSS clip-path で円形化テスト  
// 目的: borderRadius使わずにclip-pathで完全円形を実現
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

const SkillsTestStep16_ClipPath: React.FC = () => {
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
    console.log(`Step16 Device Type: ${checkDevice() ? 'Touch' : 'Desktop'}`);
    console.log('Step16 - CSS clip-path 円形化テスト開始');
  }, []);

  const handleSkillTap = useCallback((skillId: string) => {
    const now = Date.now();
    
    // ダブルタップ防止 (500ms以内の連続タップを無視)
    if (now - lastTapTime.current < 500) {
      console.log(`Step16: ダブルタップ防止 - ${skillId} (${now - lastTapTime.current}ms間隔)`);
      return;
    }
    
    lastTapTime.current = now;
    console.log(`Step16: スキルタップ - ${skillId}`);
    
    setClickedSkill(skillId);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setClickedSkill(null);
    }, 800);
  }, []);

  // タッチイベント処理 (確立済みのベスト実装)
  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>, skillId: string) => {
    e.preventDefault(); // iOS Safari チカチカ防止
    e.stopPropagation();
    handleSkillTap(skillId);
  }, [handleSkillTap]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>, skillId: string) => {
    // タッチデバイスではクリックイベントを無視（重複実行防止）
    if (isTouchDevice) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    handleSkillTap(skillId);
  }, [handleSkillTap, isTouchDevice]);

  return (
    <section className={styles.skillsSection}>
      <div className={styles.skillsContainer}>
        <h2 className={styles.skillsTitle}>Skills</h2>
        
        {/* Step16特徴: CSS clip-path で完全円形化 */}
        <div 
          style={{ 
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gridTemplateRows: "repeat(4, auto)",
            gap: "16px",
            padding: "20px 10px",
            maxWidth: "350px",
            margin: "0 auto",
          }}
        >
          {skillsData.map((skill) => {
            const isClicked = clickedSkill === skill.id;
            
            return (
              <div
                key={skill.id}
                onTouchStart={(e) => handleTouchStart(e, skill.id)}
                onClick={(e) => handleClick(e, skill.id)}
                style={{
                  // ⭐ STEP16の特徴: clip-path で円形化
                  borderRadius: "0px", // borderRadius完全不使用
                  backgroundColor: skill.bgColor,
                  clipPath: "circle(50%)", // 円形クリッピング
                  
                  // サイズ・レイアウト
                  width: "80px",
                  height: "80px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  position: "relative",
                  
                  // パフォーマンス最適化
                  WebkitTapHighlightColor: "transparent",
                  userSelect: "none",
                  WebkitUserSelect: "none",
                  
                  // クリック時エフェクト（軽量版）
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
                    // 重要: 子要素のポインタイベント無効化
                    pointerEvents: "none",
                    // カラー背景に対応して色反転
                    filter: ["figma", "html", "sass"].includes(skill.id) ? "none" : "invert(1)",
                  }}
                />
              </div>
            );
          })}
        </div>
        
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
          <div>🧪 <strong>Step16テスト</strong></div>
          <div>形状: <strong>CSS clip-path 円形</strong></div>
          <div>borderRadius: <strong>0px（不使用）</strong></div>
          <div>クリップ: <strong>circle(50%)</strong></div>
          <div>クリック中: <strong>{clickedSkill || "なし"}</strong></div>
          <div>デバイスタイプ: <strong>{isTouchDevice ? "Touch" : "Desktop"}</strong></div>
        </div>
      </div>
    </section>
  );
};

export default SkillsTestStep16_ClipPath;