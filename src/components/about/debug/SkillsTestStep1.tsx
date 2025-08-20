import React, { useState } from "react";
import styles from "@/styles/aboutme.module.scss";

// 🔥 Step 1: クリック/タッチイベントを追加 - アニメーション・CSS効果はまだなし
const skillsData = [
  { id: "figma", name: "Figma", image: "/images/figma_img.png" },
  { id: "illustrator", name: "Illustrator", image: "/images/illustrator_img.png" },
  { id: "photoshop", name: "Photoshop", image: "/images/photoshop_img.png" },
  { id: "nextjs", name: "Next.js", image: "/images/Next.js_img.png" },
  { id: "rails", name: "Rails", image: "/images/rails_img.png" },
  { id: "html", name: "HTML/CSS/JS", image: "/images/htmlcssjs_img.png" },
];

const SkillsTestStep1: React.FC = () => {
  const [clickedSkill, setClickedSkill] = useState<string | null>(null);

  const handleSkillClick = (skillId: string) => {
    console.log(`Clicked: ${skillId}`);
    setClickedSkill(skillId);
    // 1秒後にリセット
    setTimeout(() => setClickedSkill(null), 1000);
  };

  return (
    <div className={styles.sectionContainer}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitleContainer}>
          <h2 className={styles.sectionTitle}>Skills Test Step 1 (With Click Events)</h2>
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
            onClick={() => handleSkillClick(skill.id)}
            onTouchStart={() => handleSkillClick(skill.id)}
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
              // 🔥 まだアニメーション・トランジションは追加しない
            }}
          >
            <img 
              src={skill.image}
              alt={skill.name}
              style={{
                width: "50px",
                height: "50px",
                objectFit: "contain"
              }}
            />
            <div style={{
              fontSize: "10px",
              marginTop: "4px",
              textAlign: "center"
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
          Clicked: {clickedSkill}
        </div>
      )}
    </div>
  );
};

export default SkillsTestStep1;