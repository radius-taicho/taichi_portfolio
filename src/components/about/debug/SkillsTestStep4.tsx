import React, { useState, useCallback, useEffect, useRef } from "react";
import styles from "@/styles/aboutme.module.scss";

// 🔥 Step 4: 高速タップ問題を解決 - タイマー管理とデバウンス処理
const skillsData = [
  { id: "figma", name: "Figma", image: "/images/figma_img.png" },
  { id: "illustrator", name: "Illustrator", image: "/images/illustrator_img.png" },
  { id: "photoshop", name: "Photoshop", image: "/images/photoshop_img.png" },
  { id: "nextjs", name: "Next.js", image: "/images/Next.js_img.png" },
  { id: "rails", name: "Rails", image: "/images/rails_img.png" },
  { id: "html", name: "HTML/CSS/JS", image: "/images/htmlcssjs_img.png" },
];

const SkillsTestStep4: React.FC = () => {
  const [clickedSkill, setClickedSkill] = useState<string | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  
  // 🔥 重要: タイマー管理用のRef
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastTapTime = useRef<number>(0);

  // デバイス判定（マウント時のみ実行）
  useEffect(() => {
    const checkDevice = () => {
      const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      const isMobileSize = window.innerWidth <= 768;
      return hasTouch || isMobileSize;
    };
    
    setIsTouchDevice(checkDevice());
    console.log(`Device Type: ${checkDevice() ? "Touch Device" : "Desktop"}`);
  }, []);

  // 🔥 タイマーをクリアする関数
  const clearTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // 🔥 改良版: タイマー管理付きのスキルリセット
  const resetSkillWithTimer = useCallback((delay: number = 1000) => {
    clearTimer(); // 既存のタイマーをクリア
    
    timeoutRef.current = setTimeout(() => {
      setClickedSkill(null);
      timeoutRef.current = null;
      console.log("🕐 Skill reset by timer");
    }, delay);
  }, [clearTimer]);

  // 🔥 高速タップ防止機能付きのタッチハンドラー
  const handleSkillTouch = useCallback((skillId: string, e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // 🔥 高速タップ防止（300ms以内の連続タップを無視）
    const currentTime = Date.now();
    const timeSinceLastTap = currentTime - lastTapTime.current;
    
    if (timeSinceLastTap < 300) {
      console.log(`⚡ Fast tap ignored: ${timeSinceLastTap}ms`);
      return; // 高速タップを無視
    }
    
    lastTapTime.current = currentTime;
    
    console.log(`✋ Touch: ${skillId} (${timeSinceLastTap}ms since last)`);
    
    // 状態を即座に更新
    setClickedSkill(skillId);
    
    // タイマー付きリセット（既存のタイマーは自動的にクリアされる）
    resetSkillWithTimer(1000);
    
  }, [resetSkillWithTimer]);

  // 🔥 デスクトップ用クリックハンドラー
  const handleSkillClick = useCallback((skillId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log(`🖱️ Click: ${skillId}`);
    setClickedSkill(skillId);
    resetSkillWithTimer(1000);
  }, [resetSkillWithTimer]);

  // 🔥 コンポーネントがアンマウントされる時にタイマーをクリーンアップ
  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, [clearTimer]);

  return (
    <div className={styles.sectionContainer}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitleContainer}>
          <h2 className={styles.sectionTitle}>
            Skills Test Step 4 ({isTouchDevice ? "Touch Mode" : "Desktop Mode"})
          </h2>
          <div style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
            高速タップ防止 + タイマー管理強化版 | 
            赤表示: 1秒間 | 高速タップ制限: 300ms
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
            // デバイスに応じてイベントハンドラーを分ける
            {...(isTouchDevice 
              ? {
                  onTouchStart: (e: React.TouchEvent) => handleSkillTouch(skill.id, e)
                }
              : {
                  onClick: (e: React.MouseEvent) => handleSkillClick(skill.id, e)
                }
            )}
            style={{
              width: "80px",
              height: "80px",
              border: clickedSkill === skill.id ? "3px solid red" : "1px solid #ddd",
              borderRadius: "8px",
              padding: "10px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: clickedSkill === skill.id ? "#ffe0e0" : "#f9f9f9",
              cursor: "pointer",
              // より強力なタッチ最適化
              WebkitTapHighlightColor: "transparent",
              WebkitTouchCallout: "none",
              WebkitUserSelect: "none",
              userSelect: "none",
              // 🔥 アクティブ時は少し強調
              transform: clickedSkill === skill.id ? "scale(1.05)" : "scale(1)",
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
              color: clickedSkill === skill.id ? "#d00" : "#333",
              fontWeight: clickedSkill === skill.id ? "bold" : "normal",
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
          color: "red",
          fontWeight: "bold"
        }}>
          🎯 Active: {clickedSkill}
        </div>
      )}
      
      {/* より詳細なデバッグ情報 */}
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
        maxWidth: "200px"
      }}>
        <div>{isTouchDevice ? "Touch Events Only" : "Click Events Only"}</div>
        <div>Timer: {timeoutRef.current ? "⏱️ Active" : "❌ None"}</div>
        <div>Fast Tap Protection: 300ms</div>
      </div>
    </div>
  );
};

export default SkillsTestStep4;