import React, { useEffect, useState } from "react";
import Head from "next/head";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styles from "@/styles/aboutme.module.scss";

export default function AboutPage() {
  // 強み/弱み切り替え状態
  const [isShowingWeakness, setIsShowingWeakness] = useState(false);

  // 強みデータ
  const strengthsData = [
    {
      name: "傾聴力",
      description:
        "チームメンバーと積極的にコミュニケーションを取り、プロジェクトを円滑に進めることができます。相手の立場を理解し、建設的な議論を通じて最適な解決策を見つけることが得意です。",
    },
    {
      name: "継続学習力",
      description:
        "新しい技術や知識に対して常に学習意欲を持ち、自己研鑽を続けています。変化の激しいIT業界において、トレンドをキャッチアップし、実務に活かすことができます。",
    },
    {
      name: "問題解決力",
      description:
        "複雑な問題に直面した際も、論理的思考で問題を分析し、段階的にアプローチして解決策を導き出すことができます。チーム全体の生産性向上に貢献します。",
    },
  ];

  // 弱みデータ
  const weaknessesData = [
    {
      name: "完璧主義",
      description:
        "細部にこだわりすぎて時間をかけすぎることがあります。品質は重要ですが、適切なタイミングでの妥協点を見つけることの重要性を学んでいます。",
    },
    {
      name: "新しい環境への適応",
      description:
        "新しい環境や人間関係に慣れるまで少し時間がかかることがあります。ただし、一度慣れれば安定したパフォーマンスを発揮できます。",
    },
    {
      name: "プレゼンテーション",
      description:
        "大勢の前での発表にはまだ緊張してしまうことがあります。場数を踏んで徐々に改善していくよう努めています。",
    },
  ];

  // 現在表示すべきデータ
  const currentData = isShowingWeakness ? weaknessesData : strengthsData;

  // ボタンクリック時の切り替え処理
  const handleToggle = () => {
    setIsShowingWeakness(!isShowingWeakness);
  };

  useEffect(() => {
    // デスクトップ版careerステップのホバーイベントを設定
    const careerSteps = document.querySelectorAll("[data-step]");
    const careerTexts = document.querySelectorAll("[data-text]");

    // モバイル版careerステップのタップイベントを設定
    const mobileCareerSteps = document.querySelectorAll("[data-mobile-step]");
    const mobileCareerTexts = document.querySelectorAll("[data-mobile-text]");

    const handleStepHover = (stepNumber: string) => {
      // 全てのステップからホバークラスを削除
      careerSteps.forEach((step) => {
        step.classList.remove("hovered");
      });

      // 現在のステップにホバークラスを追加
      const currentStep = document.querySelector(`[data-step="${stepNumber}"]`);
      if (currentStep) {
        currentStep.classList.add("hovered");
      }

      // 全てのテキストを非表示
      careerTexts.forEach((text) => {
        (text as HTMLElement).style.opacity = "0";
        (text as HTMLElement).style.visibility = "hidden";
      });

      // 対応するテキストを表示
      const targetText = document.querySelector(
        `[data-text="${stepNumber}"]`
      ) as HTMLElement;
      if (targetText) {
        targetText.style.opacity = "1";
        targetText.style.visibility = "visible";
      }
    };

    const handleStepLeave = () => {
      // 全てのステップからホバークラスを削除
      careerSteps.forEach((step) => {
        step.classList.remove("hovered");
      });

      // デフォルトの状態に戻す（最初のテキストを表示）
      careerTexts.forEach((text) => {
        (text as HTMLElement).style.opacity = "0";
        (text as HTMLElement).style.visibility = "hidden";
      });

      const defaultText = document.querySelector(
        '[data-text="1"]'
      ) as HTMLElement;
      if (defaultText) {
        defaultText.style.opacity = "1";
        defaultText.style.visibility = "visible";
      }
    };

    // モバイル版のタップイベント処理
    const handleMobileStepClick = (stepNumber: string) => {
      // 全てのモバイルステップからactiveクラスを削除
      mobileCareerSteps.forEach((step) => {
        step.classList.remove("active");
      });

      // 現在のステップにactiveクラスを追加
      const currentStep = document.querySelector(
        `[data-mobile-step="${stepNumber}"]`
      );
      if (currentStep) {
        currentStep.classList.add("active");
      }

      // 全てのモバイルテキストを非表示
      mobileCareerTexts.forEach((text) => {
        (text as HTMLElement).style.opacity = "0";
        (text as HTMLElement).style.visibility = "hidden";
      });

      // 対応するテキストを表示
      const targetText = document.querySelector(
        `[data-mobile-text="${stepNumber}"]`
      ) as HTMLElement;
      if (targetText) {
        targetText.style.opacity = "1";
        targetText.style.visibility = "visible";
      }
    };

    // デスクトップ版イベントリスナーを追加
    careerSteps.forEach((step) => {
      const stepNumber = step.getAttribute("data-step");
      if (stepNumber) {
        step.addEventListener("mouseenter", () => handleStepHover(stepNumber));
        step.addEventListener("mouseleave", handleStepLeave);
      }
    });

    // モバイル版イベントリスナーを追加
    mobileCareerSteps.forEach((step) => {
      const stepNumber = step.getAttribute("data-mobile-step");
      if (stepNumber) {
        step.addEventListener("click", () => handleMobileStepClick(stepNumber));
        step.addEventListener("touchstart", () =>
          handleMobileStepClick(stepNumber)
        );
      }
    });

    // 初期状態で最初のステップをアクティブに設定
    const initialMobileStep = document.querySelector('[data-mobile-step="1"]');
    if (initialMobileStep) {
      initialMobileStep.classList.add("active");
    }

    // クリーンアップ関数
    return () => {
      careerSteps.forEach((step) => {
        const stepNumber = step.getAttribute("data-step");
        if (stepNumber) {
          step.removeEventListener("mouseenter", () =>
            handleStepHover(stepNumber)
          );
          step.removeEventListener("mouseleave", handleStepLeave);
        }
      });

      mobileCareerSteps.forEach((step) => {
        const stepNumber = step.getAttribute("data-mobile-step");
        if (stepNumber) {
          step.removeEventListener("click", () =>
            handleMobileStepClick(stepNumber)
          );
          step.removeEventListener("touchstart", () =>
            handleMobileStepClick(stepNumber)
          );
        }
      });
    };
  }, []);

  return (
    <>
      <Head>
        <title>About Me - Taichi Portfolio</title>
        <meta
          name="description"
          content="稲永太一のプロフィール、スキル、経歴について"
        />
      </Head>
      <div className={styles.pageContainer}>
        <Header />

        {/* モバイルレイアウト（デフォルト: sm未満） */}
        <div className={styles.mobileContainer}>
          <div className={styles.sectionFrame}>
            {/* About Me タイトル + Heroグループ */}
            <div className={styles.titleHeroGroup}>
              {/* About Me タイトル */}
              <div className={styles.pageTitleContainer}>
                <div className={styles.pageTitleWrapper}>
                  <h1 className={styles.pageTitle}>About Me</h1>
                </div>
              </div>

              {/* Hero セクション */}
              <div className={styles.heroContainer}>
                <div className={styles.heroImageContainer}>
                  <div className={styles.heroImage}>
                    {/* ここにヒーロー画像を配置 */}
                  </div>
                </div>
              </div>
            </div>

            {/* Profile セクション */}
            <div className={styles.sectionContainer}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionTitleContainer}>
                  <h2 className={styles.sectionTitle}>Profile</h2>
                </div>
              </div>
              <div className={styles.profileContentContainer}>
                <div className={styles.profileImageContainer}>
                  <div className={styles.profileImage}></div>
                </div>
                <div className={styles.profileTextContainer}>
                  <div className={styles.profileText}>
                    テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト
                  </div>
                </div>
              </div>
            </div>

            {/* Skills セクション */}
            <div className={styles.sectionContainer}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionTitleContainer}>
                  <h2 className={styles.sectionTitle}>Skills</h2>
                </div>
              </div>
              <div className={styles.profileContentContainer}>
                <div className={styles.skillsContentContainer}>
                  <div className={styles.skillsRowContainer}>
                    <div className={styles.skillCircleSmall}>
                      <div className={styles.skillIcon}>🎯</div>
                      <div className={styles.skillText}>Figma</div>
                    </div>
                  </div>
                  <div className={styles.skillsRowContainer}>
                    <div className={styles.skillCircleMedium1}>
                      <div className={styles.skillIcon}>🖌️</div>
                      <div className={styles.skillText}>Illustrator</div>
                    </div>
                    <div className={styles.skillCircleMedium1}>
                      <div className={styles.skillIcon}>📸</div>
                      <div className={styles.skillText}>Photoshop</div>
                    </div>
                  </div>
                  <div className={styles.skillsRowContainer}>
                    <div className={styles.skillCircleMedium2}>
                      <div className={styles.skillIcon}>⚡</div>
                      <div className={styles.skillText}>Next.js</div>
                    </div>
                    <div className={styles.skillCircleMedium2}>
                      <div className={styles.skillIcon}>💎</div>
                      <div className={styles.skillText}>Rails</div>
                    </div>
                    <div className={styles.skillCircleMedium2}>
                      <div className={styles.skillIcon}>JS</div>
                      <div className={styles.skillText}>JavaScript</div>
                    </div>
                  </div>
                  <div className={styles.skillsRowContainer}>
                    <div className={styles.skillCircleLarge}>
                      <div className={styles.skillIcon}>🌐</div>
                      <div className={styles.skillText}>HTML</div>
                    </div>
                    <div className={styles.skillCircleLarge}>
                      <div className={styles.skillIcon}>🎨</div>
                      <div className={styles.skillText}>CSS</div>
                    </div>
                    <div className={styles.skillCircleLarge}>
                      <div className={styles.skillIcon}>⚙️</div>
                      <div className={styles.skillText}>SCSS</div>
                    </div>
                    <div className={styles.skillCircleLarge}>
                      <div className={styles.skillIcon}>🌊</div>
                      <div className={styles.skillText}>Tailwind</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Strength & Weakness セクション */}
            <div className={styles.sectionContainer}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionTitleContainer}>
                  <h2 className={styles.strengthWeaknessTitle}>
                    {isShowingWeakness ? (
                      <>
                        <span
                          className={`${styles.weaknessTitleSpan} ${styles.emphasized}`}
                        >
                          Weakness
                        </span>
                        <span
                          className={`${styles.strengthTitleSpan} ${styles.deemphasized}`}
                        >
                          {" "}
                          &amp;Strength
                        </span>
                      </>
                    ) : (
                      <>
                        <span
                          className={`${styles.strengthTitleSpan} ${styles.emphasized}`}
                        >
                          Strength
                        </span>
                        <span
                          className={`${styles.weaknessTitleSpan} ${styles.deemphasized}`}
                        >
                          {" "}
                          &amp;Weakness
                        </span>
                      </>
                    )}
                  </h2>
                </div>
              </div>
              <div className={styles.profileContentContainer}>
                <div className={styles.strengthWeaknessContentContainer}>
                  <div className={styles.sectionTitleContainer}></div>
                  <div
                    key={isShowingWeakness ? "weakness-list" : "strength-list"}
                    className={`${styles.strengthList} ${styles.fadeIn}`}
                  >
                    {currentData.map((item, index) => (
                      <div
                        key={`${
                          isShowingWeakness ? "weakness" : "strength"
                        }-${index}`}
                        className={styles.strengthItem}
                      >
                        <div className={styles.strengthNameContainer}>
                          <div className={styles.strengthName}>{item.name}</div>
                        </div>
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
              <div className={styles.weaknessButtonWrapper}>
                <div
                  className={styles.weaknessButtonContainer}
                  onClick={handleToggle}
                >
                  <div className={styles.weaknessButtonText}>
                    {isShowingWeakness ? "S" : "W"}
                  </div>
                </div>
              </div>
            </div>

            {/* Career セクション */}
            <div className={styles.sectionContainer}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionTitleContainer}>
                  <h2 className={styles.sectionTitle}>Career</h2>
                </div>
              </div>
              <div className={styles.profileContentContainer}>
                <div className={styles.careerInteractiveWrapper}>
                  {/* 左側: ステップアイコンエリア */}
                  <div className={styles.careerStepsContainer}>
                    <div className={styles.careerStep} data-mobile-step="1">
                      <div className={styles.stepNumber}>1</div>
                      <div className={styles.stepIcon}>💻</div>
                    </div>
                    <div className={styles.careerStep} data-mobile-step="2">
                      <div className={styles.stepNumber}>2</div>
                      <div className={styles.stepIcon}>🎨</div>
                    </div>
                    <div className={styles.careerStep} data-mobile-step="3">
                      <div className={styles.stepNumber}>3</div>
                      <div className={styles.stepIcon}>🛠️</div>
                    </div>
                    <div className={styles.careerStep} data-mobile-step="4">
                      <div className={styles.stepNumber}>4</div>
                      <div className={styles.stepIcon}>💼</div>
                    </div>
                    <div className={styles.careerStep} data-mobile-step="5">
                      <div className={styles.stepNumber}>5</div>
                      <div className={styles.stepIcon}>🌟</div>
                    </div>
                  </div>

                  {/* 右側: テキスト表示エリア */}
                  <div className={styles.careerTextDisplay}>
                    <div className={styles.careerTextItem} data-mobile-text="1">
                      <div className={styles.textTitle}>
                        プログラミングの基礎
                      </div>
                      <div className={styles.textContent}>
                        テックキャンプでプログラミングを学び、Web開発の基礎を身につけました。
                      </div>
                    </div>
                    <div className={styles.careerTextItem} data-mobile-text="2">
                      <div className={styles.textTitle}>デザインスキル習得</div>
                      <div className={styles.textContent}>
                        Figmaの使い方を覚えながらデザインについて学び、UI/UXの基本を理解しました。
                      </div>
                    </div>
                    <div className={styles.careerTextItem} data-mobile-text="3">
                      <div className={styles.textTitle}>実務経験</div>
                      <div className={styles.textContent}>
                        テックキャンプで実際の案件に携わり、より深くデザインやツールについて学びました。
                      </div>
                    </div>
                    <div className={styles.careerTextItem} data-mobile-text="4">
                      <div className={styles.textTitle}>
                        プロフェッショナルへ
                      </div>
                      <div className={styles.textContent}>
                        Webデザイン会社に就職し、実務経験を積みながらスキルに磨きをかけています。
                      </div>
                    </div>
                    <div className={styles.careerTextItem} data-mobile-text="5">
                      <div className={styles.textTitle}>社会貢献へ</div>
                      <div className={styles.textContent}>
                        自分のサービスのデザインをより洗練された興味深いものにして、得た資金で社会貢献したいです。
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* モバイル専用 プロフィール & フッターセクション */}
        <div className={styles.bottomProfileSection}>
          <div className={styles.bottomProfileImage}></div>
        </div>

        {/* デスクトップレイアウト（sm以上） */}
        <div className={styles.desktopContainer}>
          {/* About Me タイトル + Heroグループ */}
          <div className={styles.desktopTitleHeroGroup}>
            {/* About Me タイトルセクション */}
            <div className={styles.desktopPageTitleSection}>
              <h1 className={styles.desktopPageTitle}>About Me</h1>
            </div>

            {/* Hero セクション */}
            <div className={styles.desktopHeroSection}>
              <div className={styles.desktopHeroContainer}>
                <div className={styles.desktopHeroImage}>
                  {/* ここにヒーロー画像を配置 */}
                </div>
              </div>
            </div>
          </div>

          {/* Profile セクション */}
          <div className={styles.desktopProfileSection}>
            <div className={styles.desktopSectionHeader}>
              <div className={styles.desktopSectionTitleContainer}>
                <h2 className={styles.desktopSectionTitle}>Profile</h2>
              </div>
            </div>
            <div className={styles.desktopProfileContent}>
              <div className={styles.desktopProfileImageWrapper}>
                <div className={styles.desktopProfileIcon}></div>
                <div className={styles.desktopProfileMainImage}></div>
              </div>
              <div className={styles.desktopProfileInfoWrapper}>
                <div className={styles.desktopProfileTextWrapper}>
                  <div className={styles.desktopProfileNameContainer}>
                    <div className={styles.desktopNameEnglishContainer}>
                      <div className={styles.desktopNameEnglish}>
                        Taichi Inenaga
                      </div>
                    </div>
                    <div className={styles.desktopNameJapaneseContainer}>
                      <div className={styles.desktopNameJapanese}>稲永太一</div>
                    </div>
                  </div>
                  <div className={styles.desktopProfileDescContainer}>
                    <div className={styles.desktopProfileDescription}>
                      テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Skills セクション */}
          <div className={styles.desktopSection}>
            <div className={styles.desktopSectionHeader}>
              <div className={styles.desktopSectionTitleContainer}>
                <h2 className={styles.desktopSectionTitle}>Skills</h2>
              </div>
            </div>
            <div className={styles.desktopSkillsContent}>
              <div className={styles.desktopSkillsRow}>
                <div className={styles.desktopSkillCircle1}>
                  <div className={styles.desktopSkillIcon}>🎯</div>
                  <div className={styles.desktopSkillText}>Figma</div>
                </div>
              </div>
              <div className={styles.desktopSkillsRow}>
                <div className={styles.desktopSkillCircle2}>
                  <div className={styles.desktopSkillIcon}>🖌️</div>
                  <div className={styles.desktopSkillText}>Illustrator</div>
                </div>
                <div className={styles.desktopSkillCircle2}>
                  <div className={styles.desktopSkillIcon}>📸</div>
                  <div className={styles.desktopSkillText}>Photoshop</div>
                </div>
              </div>
              <div className={styles.desktopSkillsRow}>
                <div className={styles.desktopSkillCircle3}>
                  <div className={styles.desktopSkillIcon}>⚡</div>
                  <div className={styles.desktopSkillText}>Next.js</div>
                </div>
                <div className={styles.desktopSkillCircle3}>
                  <div className={styles.desktopSkillIcon}>💎</div>
                  <div className={styles.desktopSkillText}>Rails</div>
                </div>
                <div className={styles.desktopSkillCircle3}>
                  <div className={styles.desktopSkillIcon}>JS</div>
                  <div className={styles.desktopSkillText}>JavaScript</div>
                </div>
              </div>
              <div className={styles.desktopSkillsRow}>
                <div className={styles.desktopSkillCircle4}>
                  <div className={styles.desktopSkillIcon}>🌐</div>
                  <div className={styles.desktopSkillText}>HTML</div>
                </div>
                <div className={styles.desktopSkillCircle4}>
                  <div className={styles.desktopSkillIcon}>🎨</div>
                  <div className={styles.desktopSkillText}>CSS</div>
                </div>
                <div className={styles.desktopSkillCircle4}>
                  <div className={styles.desktopSkillIcon}>⚙️</div>
                  <div className={styles.desktopSkillText}>SCSS</div>
                </div>
                <div className={styles.desktopSkillCircle4}>
                  <div className={styles.desktopSkillIcon}>🌊</div>
                  <div className={styles.desktopSkillText}>Tailwind</div>
                </div>
              </div>
            </div>
          </div>

          {/* Strength & Weakness セクション */}
          <div className={styles.desktopSection}>
            <div className={styles.desktopSectionHeader}>
              <div className={styles.desktopSectionTitleContainer}>
                <h2 className={styles.desktopStrengthWeaknessTitle}>
                  {isShowingWeakness ? (
                    <>
                      <span
                        className={`${styles.desktopWeaknessSpan} ${styles.emphasized}`}
                      >
                        Weakness
                      </span>
                      <span
                        className={`${styles.desktopStrengthSpan} ${styles.deemphasized}`}
                      >
                        {" "}
                        &amp;Strength
                      </span>
                    </>
                  ) : (
                    <>
                      <span
                        className={`${styles.desktopStrengthSpan} ${styles.emphasized}`}
                      >
                        Strength
                      </span>
                      <span
                        className={`${styles.desktopWeaknessSpan} ${styles.deemphasized}`}
                      >
                        {" "}
                        &amp;Weakness
                      </span>
                    </>
                  )}
                </h2>
              </div>
            </div>
            <div className={styles.desktopStrengthWeaknessContent}>
              <div className={styles.desktopStrengthContainer}>
                <div
                  key={
                    isShowingWeakness
                      ? "desktop-weakness-list"
                      : "desktop-strength-list"
                  }
                  className={`${styles.desktopStrengthList} ${styles.fadeIn}`}
                >
                  {currentData.map((item, index) => (
                    <div
                      key={`desktop-${
                        isShowingWeakness ? "weakness" : "strength"
                      }-${index}`}
                      className={styles.desktopStrengthItem}
                    >
                      <div className={styles.desktopStrengthNameWrapper}>
                        <div className={styles.desktopStrengthName}>
                          {item.name}
                        </div>
                      </div>
                      <div className={styles.desktopStrengthDescWrapper}>
                        <div className={styles.desktopStrengthDescription}>
                          {item.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className={styles.desktopWeaknessHeader}>
              <div
                className={styles.desktopWeaknessContainer}
                onClick={handleToggle}
              >
                <div className={styles.desktopWeaknessTitle}>
                  {isShowingWeakness ? "S" : "W"}
                </div>
              </div>
            </div>
          </div>

          {/* Career セクション */}
          <div className={styles.desktopSection}>
            <div className={styles.desktopSectionHeader}>
              <div className={styles.desktopSectionTitleContainer}>
                <h2 className={styles.desktopSectionTitle}>Career</h2>
              </div>
            </div>
            <div className={styles.desktopCareerContainer}>
              <div className={styles.desktopCareerSteps}>
                <div className={styles.desktopCareerStep} data-step="1">
                  <div className={styles.desktopStepNumber}>1</div>
                </div>
                <div className={styles.desktopCareerStep} data-step="2">
                  <div className={styles.desktopStepNumber}>2</div>
                </div>
                <div className={styles.desktopCareerStep} data-step="3">
                  <div className={styles.desktopStepNumber}>3</div>
                </div>
                <div className={styles.desktopCareerStep} data-step="4">
                  <div className={styles.desktopStepNumber}>4</div>
                </div>
                <div className={styles.desktopCareerStep} data-step="5">
                  <div className={styles.desktopStepNumber}>5</div>
                </div>
              </div>
              <div className={styles.desktopCareerTextDisplay}>
                <div className={styles.desktopCareerText} data-text="1">
                  テックキャンプでプログラミングを学ぶ
                </div>
                <div className={styles.desktopCareerText} data-text="2">
                  Figmaの使い方を覚えながらデザインについて学ぶ
                </div>
                <div className={styles.desktopCareerText} data-text="3">
                  テックキャンプで実際の案件に携わり、より深くデザインやツールについて学ぶ
                </div>
                <div className={styles.desktopCareerText} data-text="4">
                  Webデザイン会社に就職し実務経験を積みながらスキルに磨きをかける
                </div>
                <div className={styles.desktopCareerText} data-text="5">
                  自分のサービスのデザインをより洗練された興味深いものにして、得た資金で社会貢献する
                </div>
              </div>
            </div>
          </div>

          {/* デスクトップ専用 デコレーションセクション */}
          <div className={styles.desktopBottomSection}>
            <div className={styles.desktopBottomCircle}></div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
