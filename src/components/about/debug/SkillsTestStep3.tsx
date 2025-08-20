import React, { useState, useCallback, useEffect } from "react";
import styles from "@/styles/aboutme.module.scss";

// 🔥 Step 3: デバイス判定でイベント分離 - タッチなら onClick無効、PCならtouch無効
const skillsData = [
  { id: "figma", name: "Figma", image: "/images/figma_img.png" },
  { id: "illustrator", name: "Illustrator", image: "/images/illustrator_img.png" },
  { id: "photoshop", name: "Photoshop", image: "/images/photoshop_img.png" },
  { id: "nextjs", name: "Next.js", image: "/images/Next.js_img.png" },
  { id: "rails", name: "Rails", image: "/images/rails_img.png" },
  { id: "html", name: "HTML/CSS/JS", image: "/images/htmlcssjs_img.png" },
];

const SkillsTestStep3: React.FC = () => {
  const [clickedSkill, setClickedSkill] = useState<string | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // デバイス判定（マウント時のみ実行）
  useEffect(() => {
    const checkDevice = () => {
      // タッチサポートがあるか？
      const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      // モバイルサイズか？（768px以下）
      const isMobileSize = window.innerWidth <= 768;
      // どちらか一つでも該当すればタッチデバイス
      return hasTouch || isMobileSize;
    };
    
    setIsTouchDevice(checkDevice());
    console.log(`Device Type: ${checkDevice() ? "Touch Device" : "Desktop"}`);
  }, []);

  const handleSkillTouch = useCallback((skillId: string, e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log(`✋ Touch: ${skillId}`);
    setClickedSkill(skillId);
    // 1秒後にリセット
    setTimeout(() => setClickedSkill(null), 1000);
  }, []);

  const handleSkillClick = useCallback((skillId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log(`🖱️ Click: ${skillId}`);
    setClickedSkill(skillId);
    // 1秒後にリセット
    setTimeout(() => setClickedSkill(null), 1000);
  }, []);

  return (
    <div className={styles.sectionContainer}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitleContainer}>
          <h2 className={styles.sectionTitle}>
            Skills Test Step 3 ({isTouchDevice ? "Touch Mode" : "Desktop Mode"})
          </h2>
          <div style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
            デバイス判定: {isTouchDevice ? "タッチデバイス" : "デスクトップ"} | 
            幅: {typeof window !== 'undefined' ? window.innerWidth : 0}px
          </div>
        </div>
      </div>
      
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "20px",
        justifyContent: "center",
        padding: "40px 20px"
      }}>
        {skillsData.map((skill) => (
          <div 
            key={skill.id}
            // 🔥 重要: デバイスに応じてイベントハンドラーを分ける
            {...(isTouchDevice 
              ? {
                  // タッチデバイス: onTouchStart のみ
                  onTouchStart: (e: React.TouchEvent) => handleSkillTouch(skill.id, e)
                }
              : {
                  // デスクトップ: onClick のみ
                  onClick: (e: React.MouseEvent) => handleSkillClick(skill.id, e)
                }
            )}
            style={{
              width: "80px",
              height: "80px",
              border: clickedSkill === skill.id ? "2px solid red" : "1px solid #ddd",
              borderRadius: "8px",
              padding: "10px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: clickedSkill === skill.id ? "#ffe0e0" : "#f9f9f9",
              cursor: "pointer",
              // タッチ用の追加スタイル
              WebkitTapHighlightColor: "transparent",
              WebkitTouchCallout: "none",
              WebkitUserSelect: "none",
              userSelect: "none",
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
            }}>
              {skill.name}
            </div>
          </div>
        ))}
      </div>
      
      {clickedSkill && (
        <div style={{ 
          textAlign: "center", 
          marginTop: "20px",
          fontSize: "14px",
          color: "red"
        }}>
          Active: {clickedSkill}
        </div>
      )}
      
      {/* デバッグ情報 */}
      <div style={{
        position: "fixed",
        bottom: "10px",
        right: "10px",
        fontSize: "12px",
        backgroundColor: "rgba(0,0,0,0.8)",
        color: "white",
        padding: "8px",
        borderRadius: "4px",
        zIndex: 1000
      }}>
        {isTouchDevice ? "Touch Events Only" : "Click Events Only"}
      </div>
    </div>
  );
};

export default SkillsTestStep3;