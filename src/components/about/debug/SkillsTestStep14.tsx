import React, { useState, useCallback, useEffect, useRef } from "react";
import styles from "@/styles/aboutme.module.scss";

// 🔥 Step 14: CSS-in-JS vs CSSクラス比較テスト
// 目的: インラインスタイルをCSSクラス化してレンダリング負荷軽減確認

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

const SkillsTestStep14: React.FC = () => {
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
    console.log(`Step14 Device Type: ${checkDevice() ? 'Touch' : 'Desktop'}`);
    console.log('Step14 - CSS-in-JS vs CSSクラス比較テスト開始');
  }, []);

  const handleSkillTap = useCallback((skillId: string) => {
    const now = Date.now();
    
    // ダブルタップ防止 (500ms以内の連続タップを無視)
    if (now - lastTapTime.current < 500) {
      console.log(`Step14: ダブルタップ防止 - ${skillId} (${now - lastTapTime.current}ms間隔)`);
      return;
    }
    
    lastTapTime.current = now;
    console.log(`Step14: スキルタップ - ${skillId}`);
    
    setClickedSkill(skillId);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setClickedSkill(null);
    }, 800);
  }, []);

  // タッチイベント処理 (Step4～13で確立済みのベスト実装)
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
    <>
      {/* ⭐ STEP14の特徴: CSS-in-JS から CSSクラスへ移行 */}
      <style jsx>{`
        .skills-grid-step14 {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows: repeat(4, auto);
          gap: 16px;
          padding: 20px 10px;
          max-width: 350px;
          margin: 0 auto;
        }
        
        .skill-box-step14 {
          border-radius: 8px; /* Step7ベースの安全な値 */
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          position: relative;
          
          /* パフォーマンス最適化 */
          -webkit-tap-highlight-color: transparent;
          user-select: none;
          -webkit-user-select: none;
          
          /* クリック時エフェクト */
          transform: scale(1);
          transition: all 0.15s ease-out;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        .skill-box-step14.clicked {
          transform: scale(1.05);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        }
        
        .skill-image-step14 {
          width: 50px;
          height: 50px;
          object-fit: contain;
          pointer-events: none;
        }
        
        /* 各スキルの背景色（CSS変数を使用） */
        .skill-box-step14.figma { background-color: #F24E1E; }
        .skill-box-step14.illustrator { background-color: #FF9A00; }
        .skill-box-step14.photoshop { background-color: #31A8FF; }
        .skill-box-step14.nextjs { background-color: #000000; }
        .skill-box-step14.rails { background-color: #CC0000; }
        .skill-box-step14.html { background-color: #E34F26; }
        .skill-box-step14.sass { background-color: #CF649A; }
        .skill-box-step14.tailwind { background-color: #06B6D4; }
        .skill-box-step14.github { background-color: #181717; }
        .skill-box-step14.swift { background-color: #FA7343; }
        .skill-box-step14.ruby { background-color: #CC342D; }
        
        /* 色反転が不要なスキル */
        .skill-box-step14.figma .skill-image-step14,
        .skill-box-step14.html .skill-image-step14,
        .skill-box-step14.sass .skill-image-step14 {
          filter: none;
        }
        
        /* 色反転が必要なスキル */
        .skill-box-step14:not(.figma):not(.html):not(.sass) .skill-image-step14 {
          filter: invert(1);
        }
      `}</style>

      <section className={styles.skillsSection}>
        <div className={styles.skillsContainer}>
          <h2 className={styles.skillsTitle}>Skills</h2>
          
          {/* Step14特徴: CSS-in-JS → CSSクラス化 */}
          <div className="skills-grid-step14">
            {skillsData.map((skill) => {
              const isClicked = clickedSkill === skill.id;
              
              return (
                <div
                  key={skill.id}
                  className={`skill-box-step14 ${skill.id} ${isClicked ? 'clicked' : ''}`}
                  onTouchStart={(e) => handleTouchStart(e, skill.id)}
                  onClick={(e) => handleClick(e, skill.id)}
                >
                  <img
                    src={skill.image}
                    alt={skill.name}
                    className="skill-image-step14"
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
            <div>🧪 <strong>Step14テスト</strong></div>
            <div>スタイル: <strong>CSS-in-JS → CSSクラス化</strong></div>
            <div>borderRadius: <strong>8px (安全な値)</strong></div>
            <div>レンダリング: <strong>CSS最適化版</strong></div>
            <div>クリック中: <strong>{clickedSkill || "なし"}</strong></div>
            <div>デバイスタイプ: <strong>{isTouchDevice ? "Touch" : "Desktop"}</strong></div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SkillsTestStep14;