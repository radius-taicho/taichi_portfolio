import React, { useState } from "react";
import styles from "@/styles/aboutme.module.scss";

// 🔥 Step 2: イベント重複を修正 - preventDefault()でゴーストクリック防止
const skillsData = [
  { id: "figma", name: "Figma", image: "/images/figma_img.png" },
  { id: "illustrator", name: "Illustrator", image: "/images/illustrator_img.png" },
  { id: "photoshop", name: "Photoshop", image: "/images/photoshop_img.png" },
  { id: "nextjs", name: "Next.js", image: "/images/Next.js_img.png" },
  { id: "rails", name: "Rails", image: "/images/rails_img.png" },
  { id: "html", name: "HTML/CSS/JS", image: "/images/htmlcssjs_img.png" },
];

const SkillsTestStep2: React.FC = () => {
  const [clickedSkill, setClickedSkill] = useState<string | null>(null);

  const handleSkillTouch = (skillId: string, e: React.TouchEvent) => {
    // 🔥 重要：ゴーストクリックを完全に防止
    e.preventDefault();
    e.stopPropagation();
    
    console.log(`Touch: ${skillId}`);
    setClickedSkill(skillId);
    // 1秒後にリセット
    setTimeout(() => setClickedSkill(null), 1000);
  };

  const handleSkillClick = (skillId: string, e: React.MouseEvent) => {
    // 🔥 デスクトップ用のクリック処理
    e.preventDefault();
    e.stopPropagation();
    
    console.log(`Click: ${skillId}`);
    setClickedSkill(skillId);
    // 1秒後にリセット
    setTimeout(() => setClickedSkill(null), 1000);
  };

  return (
    <div className={styles.sectionContainer}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitleContainer}>
          <h2 className={styles.sectionTitle}>Skills Test Step 2 (Fixed Events)</h2>
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
            onTouchStart={(e) => handleSkillTouch(skill.id, e)}
            onClick={(e) => handleSkillClick(skill.id, e)}
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
              // 🔥 タッチ用の追加スタイル
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
                // 🔥 画像がタッチイベントを邪魔しないように
                pointerEvents: "none",
              }}
            />
            <div style={{
              fontSize: "10px",
              marginTop: "4px",
              textAlign: "center",
              // 🔥 テキストがタッチイベントを邪魔しないように
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
    </div>
  );
};

export default SkillsTestStep2;