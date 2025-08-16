import React from "react";
import styles from "./MobileStrengthSection.module.scss";

export default function MobileStrengthSection() {
  // 強みデータ
  const strengthsData = [
    {
      name: "①傾聴力",
      description:
        "相手の話に対して的確なリアクションを返し、会話を円滑に進めることを心がけています。異なる視点や意見を積極的に受け入れ、建設的なコミュニケーションを通じてチーム全体のパフォーマンス向上に貢献します。",
    },
    {
      name: "②継続学習力",
      description:
        "新しい技術や知識に対して常に学習意欲を持ち、自己研鑽を続けています。変化の激しいIT業界において、トレンドをキャッチアップし、実務に活かすことができます。",
    },
    {
      name: "③発想力",
      description:
        "枠にとらわれない独自のアイデアや解決策を生み出すことを得意としています。「0から1を生み出すのが上手い」「独自性がある」とよく評価いただきます。常に多様な分野から情報を吸収し、新しい発想につなげることをこれからも意識していきたいです。",
    },
  ];

  return (
    <div className={styles.sectionContainer} data-section="strength">
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitleContainer}>
          <h2 className={styles.sectionTitle}>Strength</h2>
        </div>
      </div>

      <div className={styles.strengthContentContainer}>
        <div className={styles.strengthList}>
          {strengthsData.map((item, index) => (
            <div key={`strength-${index}`} className={styles.strengthItem}>
              <div className={styles.strengthNameContainer}>
                <div className={styles.strengthName}>{item.name}</div>
              </div>
              <div className={styles.strengthDivider}></div>
              <div className={styles.strengthDescContainer}>
                <div className={styles.strengthDescription}>
                  {item.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
