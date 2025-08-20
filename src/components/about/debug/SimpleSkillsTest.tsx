import React from "react";
import styles from "@/styles/aboutme.module.scss";

// 🔥 最もシンプルなスキル画像テスト - アニメーション・イベント・状態管理 全て無効
const skillsData = [
  { id: "figma", name: "Figma", image: "/images/figma_img.png" },
  { id: "illustrator", name: "Illustrator", image: "/images/illustrator_img.png" },
  { id: "photoshop", name: "Photoshop", image: "/images/photoshop_img.png" },
  { id: "nextjs", name: "Next.js", image: "/images/Next.js_img.png" },
  { id: "rails", name: "Rails", image: "/images/rails_img.png" },
  { id: "html", name: "HTML/CSS/JS", image: "/images/htmlcssjs_img.png" },
];

const SimpleSkillsTest: React.FC = () => {
  return (
    <div className={styles.sectionContainer}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitleContainer}>
          <h2 className={styles.sectionTitle}>Skills Test (Simple)</h2>
        </div>
      </div>
      
      {/* 🔥 最もシンプルなグリッド - アニメーション・インタラクション一切なし */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "20px",
        justifyContent: "center",
        padding: "40px 20px"
      }}>
        {skillsData.map((skill) => (
          <div key={skill.id} style={{
            width: "80px",
            height: "80px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "10px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f9f9f9"
          }}>
            {/* 🔥 最もシンプルな画像 - Next.js Image使わない */}
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
    </div>
  );
};

export default SimpleSkillsTest;