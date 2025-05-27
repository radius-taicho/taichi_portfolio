import React from "react";
import Head from "next/head";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styles from "@/styles/aboutme.module.scss";

export default function AboutPage() {
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
                    <div className={styles.skillCircleSmall}></div>
                  </div>
                  <div className={styles.skillsRowContainer}>
                    <div className={styles.skillCircleMedium1}></div>
                    <div className={styles.skillCircleMedium1}></div>
                  </div>
                  <div className={styles.skillsRowContainer}>
                    <div className={styles.skillCircleMedium2}></div>
                    <div className={styles.skillCircleMedium2}></div>
                    <div className={styles.skillCircleMedium2}></div>
                  </div>
                  <div className={styles.skillsRowContainer}>
                    <div className={styles.skillCircleLarge}></div>
                    <div className={styles.skillCircleLarge}></div>
                    <div className={styles.skillCircleLarge}></div>
                    <div className={styles.skillCircleLarge}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Strength & Weakness セクション */}
            <div className={styles.sectionContainer}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionTitleContainer}>
                  <h2 className={styles.strengthWeaknessTitle}>
                    <span className={styles.strengthTitleSpan}>
                      Strength&amp;
                    </span>
                    <span className={styles.weaknessTitleSpan}> Weakness</span>
                  </h2>
                </div>
              </div>
              <div className={styles.profileContentContainer}>
                <div className={styles.strengthWeaknessContentContainer}>
                  <div className={styles.sectionTitleContainer}></div>
                  <div className={styles.strengthList}>
                    <div className={styles.strengthItem}>
                      <div className={styles.strengthNameContainer}>
                        <div className={styles.strengthName}>なんたら力</div>
                      </div>
                      <div className={styles.strengthDescContainer}>
                        <div className={styles.strengthDescription}>
                          テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト
                        </div>
                      </div>
                    </div>
                    <div className={styles.strengthItem}>
                      <div className={styles.strengthNameContainer}>
                        <div className={styles.strengthName}>なんたら力</div>
                      </div>
                      <div className={styles.strengthDescContainer}>
                        <div className={styles.strengthDescription}>
                          テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト
                        </div>
                      </div>
                    </div>
                    <div className={styles.strengthItem}>
                      <div className={styles.strengthNameContainer}>
                        <div className={styles.strengthName}>なんたら力</div>
                      </div>
                      <div className={styles.strengthDescContainer}>
                        <div className={styles.strengthDescription}>
                          テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.weaknessButtonWrapper}>
                <div className={styles.weaknessButtonContainer}>
                  <div className={styles.weaknessButtonText}>B</div>
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
                <div className={styles.strengthWeaknessContentContainer}>
                  <div className={styles.careerTimelineContainer}>
                    <div className={styles.careerStep1}>
                      <div className={styles.careerText1}>
                        自分のサービスのデザインをより洗練された興味深いものにして、得た資金で社会貢献する
                      </div>
                    </div>
                    <div className={styles.careerStep2}>
                      <div className={styles.careerText2}>
                        Webデザイン会社に就職し、実務経験を積みながらスキルに磨きをかける
                      </div>
                    </div>
                    <div className={styles.careerStep3}>
                      <div className={styles.careerText3}>
                        テックキャンプで実際の案件に携わり、より深くデザインやツールについて学ぶ
                      </div>
                    </div>
                    <div className={styles.careerStep4}>
                      <div className={styles.careerText4}>
                        Figmaの使い方を覚えながらデザインについて学ぶ
                      </div>
                    </div>
                    <div className={styles.careerStep5}>
                      <div className={styles.careerText5}>
                        テックキャンプでプログラミングを学ぶ
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
                <div className={styles.desktopSkillCircle1}></div>
              </div>
              <div className={styles.desktopSkillsRow}>
                <div className={styles.desktopSkillCircle2}></div>
                <div className={styles.desktopSkillCircle2}></div>
              </div>
              <div className={styles.desktopSkillsRow}>
                <div className={styles.desktopSkillCircle3}></div>
                <div className={styles.desktopSkillCircle3}></div>
                <div className={styles.desktopSkillCircle3}></div>
              </div>
              <div className={styles.desktopSkillsRow}>
                <div className={styles.desktopSkillCircle4}></div>
                <div className={styles.desktopSkillCircle4}></div>
                <div className={styles.desktopSkillCircle4}></div>
                <div className={styles.desktopSkillCircle4}></div>
              </div>
            </div>
          </div>

          {/* Strength & Weakness セクション */}
          <div className={styles.desktopSection}>
            <div className={styles.desktopSectionHeader}>
              <div className={styles.desktopSectionTitleContainer}>
                <h2 className={styles.desktopStrengthWeaknessTitle}>
                  <span className={styles.desktopStrengthSpan}>
                    Strength&amp;
                  </span>
                  <span className={styles.desktopWeaknessSpan}> Weakness</span>
                </h2>
              </div>
            </div>
            <div className={styles.desktopStrengthWeaknessContent}>
              <div className={styles.desktopStrengthContainer}>
                <div className={styles.desktopStrengthList}>
                  <div className={styles.desktopStrengthItem}>
                    <div className={styles.desktopStrengthNameWrapper}>
                      <div className={styles.desktopStrengthName}>
                        なんたら力
                      </div>
                    </div>
                    <div className={styles.desktopStrengthDescWrapper}>
                      <div className={styles.desktopStrengthDescription}>
                        テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト
                      </div>
                    </div>
                  </div>
                  <div className={styles.desktopStrengthItem}>
                    <div className={styles.desktopStrengthNameWrapper}>
                      <div className={styles.desktopStrengthName}>
                        なんたら力
                      </div>
                    </div>
                    <div className={styles.desktopStrengthDescWrapper}>
                      <div className={styles.desktopStrengthDescription}>
                        テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト
                      </div>
                    </div>
                  </div>
                  <div className={styles.desktopStrengthItem}>
                    <div className={styles.desktopStrengthNameWrapper}>
                      <div className={styles.desktopStrengthName}>
                        なんたら力
                      </div>
                    </div>
                    <div className={styles.desktopStrengthDescWrapper}>
                      <div className={styles.desktopStrengthDescription}>
                        テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.desktopWeaknessHeader}>
              <div className={styles.desktopWeaknessContainer}>
                <div className={styles.desktopWeaknessTitle}>B</div>
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
            <div className={styles.desktopCareerList}>
              <div className={styles.desktopCareerContent}>
                <div className={styles.desktopCareerIndicators}>
                  <div className={styles.desktopCareerBar1}></div>
                  <div className={styles.desktopCareerBar2}></div>
                  <div className={styles.desktopCareerBar3}></div>
                </div>
                <div className={styles.desktopCareerPoints}>
                  <div className={styles.desktopCareerPoint1}></div>
                  <div className={styles.desktopCareerPoint2}></div>
                </div>
              </div>
              <div className={styles.desktopCareerTexts}>
                <div className={styles.desktopCareerTextItem1}>
                  <div className={styles.desktopCareerText1}>
                    テックキャンプでプログラミングを学ぶ
                  </div>
                </div>
                <div className={styles.desktopCareerTextItem2}>
                  <div className={styles.desktopCareerText2}>
                    Figmaの使い方を覚えながらデザインについて学ぶ
                  </div>
                </div>
                <div className={styles.desktopCareerTextItem3}>
                  <div className={styles.desktopCareerText3}>
                    テックキャンプで実際の案件に携わり、より深くデザインやツールについて学ぶ
                  </div>
                </div>
                <div className={styles.desktopCareerTextItem4}>
                  <div className={styles.desktopCareerText4}>
                    Webデザイン会社に就職し実務経験を積みながらスキルに磨きをかける
                  </div>
                </div>
                <div className={styles.desktopCareerTextItem5}>
                  <div className={styles.desktopCareerText5}>
                    自分のサービスのデザインをより洗練された興味深いものにして、得た資金で社会貢献する
                  </div>
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
