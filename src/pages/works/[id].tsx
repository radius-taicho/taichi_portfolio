import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RotatingCarousel from "@/components/RotatingCarousel";
import ScrollTopBubble from "@/components/common/ScrollTopBubble";
import { Work } from "@/types";
import styles from "@/styles/websitework.module.scss";
import mobileStyles from "@/styles/components/top_page_mobile.module.scss";

interface WorkDetailData {
  work: Work;
  otherWorks: Work[];
}

export default function WorkDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [data, setData] = useState<WorkDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentWorkIndex, setCurrentWorkIndex] = useState(0);

  // ページトップへスクロールする関数
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // 元のシンプルな実装に戻す

  useEffect(() => {
    if (!id) return;

    const fetchWorkDetail = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/works/${id}`);

        if (response.ok) {
          const workData = await response.json();
          setData(workData);
        } else if (response.status === 404) {
          setError("作品が見つかりませんでした");
        } else {
          throw new Error("Failed to fetch work detail");
        }
      } catch (err) {
        console.error("Error fetching work detail:", err);
        setError("作品の読み込みでエラーが発生しました");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkDetail();
  }, [id]);

  if (loading) {
    return (
      <div className={styles.pc}>
        <Header />
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>読み込み中...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={styles.pc}>
        <Header />
        <div className={styles.errorContainer}>
          <h1>エラー</h1>
          <p>{error || "作品が見つかりませんでした"}</p>
          <Link href="/" className={styles.backButton}>
            ホームに戻る
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const { work, otherWorks } = data;

  // デバッグ用：コンソールに作品データを出力
  console.log("Work data:", {
    id: work.id,
    title: work.title,
    name: work.name,
    nameType: typeof work.name,
    nameLength: work.name ? work.name.length : 0,
    hasMainImage: !!work.mainImage,
    hasDesignImage: !!work.designImage,
    mainImageUrl: work.mainImage,
    designImageUrl: work.designImage,
  });

  return (
    <>
      <Head>
        <title>{work.title} - Taichi Portfolio</title>
        <meta
          name="description"
          content={work.concept || `${work.title}の詳細ページ`}
        />
        {/* プリロードを無効化 */}
      </Head>
      <div className={styles.pc}>
        <Header />
        <div className={styles.content}>
          {/* ヒーローセクション */}
          <div className={styles.heroSection}>
            <div className={styles.imageSection}>
              {work.mainImage ? (
                <div className={styles.image}>
                  <Image
                    src={work.mainImage}
                    alt={work.title}
                    fill
                    style={{ objectFit: "cover" }}
                    priority
                    quality={85}
                    loading="eager"
                    placeholder="blur"
                    blurDataURL="data:image/webp;base64,UklGRkwAAABXRUJQVlA4IEAAAAAwAgCdASoKAAYAAkA4JaQAA3AA/v3AgAA="
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, (max-width: 1600px) 100vw, 1600px"
                  />
                </div>
              ) : (
                <div className={styles.imagePlaceholder}>
                  <span>No Image</span>
                </div>
              )}
            </div>
            <div className={styles.infoSection}>
              <div className={styles.projectDescription}>
                <div className={styles.descriptionText}>
                  {(work.name && work.name.trim()) || work.title}
                </div>
              </div>
              <div className={styles.projectDetails}>
                <div className={styles.detailsGrid}>
                  <div className={styles.detailCard}>
                    <div className={styles.cardHeader}>
                      <div className={styles.title}>title:</div>
                    </div>
                    <div className={styles.cardContent}>{work.title}</div>
                  </div>

                  <div className={styles.detailCard}>
                    <div className={styles.cardHeader}>
                      <div className={styles.labelText}>type:</div>
                    </div>
                    <div className={styles.cardContent}>{work.type}</div>
                  </div>

                  <div className={styles.detailCard}>
                    <div className={styles.cardHeader}>
                      <div className={styles.labelText}>status:</div>
                    </div>
                    <div className={styles.cardContent}>
                      {work.status === "completed" && "開発済み"}
                      {work.status === "in_progress" && "開発中"}
                      {work.status === "planning" && "企画段階"}
                    </div>
                  </div>

                  <div className={styles.detailCard}>
                    <div className={styles.cardHeader}>
                      <div className={styles.labelText}>client:</div>
                    </div>
                    <div className={styles.cardContent}>
                      {work.client || "個人制作"}
                    </div>
                  </div>

                  {work.link && (
                    <div className={`${styles.detailCard} ${styles.linkCard}`}>
                      <div className={styles.cardHeader}>
                        <div className={styles.labelText}>link:</div>
                      </div>
                      <div className={styles.cardContent}>
                        <a
                          href={work.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.projectLink}
                        >
                          {work.link}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* プロジェクト詳細セクション - データが存在する場合のみ表示 */}
          {(work.concept ||
            work.target ||
            work.challenge ||
            work.purpose ||
            work.informationDesign ||
            work.design ||
            work.implementation ||
            work.planningDays ||
            work.designDays ||
            work.codingDays) && (
            <div className={styles.detailsSection}>
              <div className={styles.projectSections}>
                {work.concept && (
                  <div className={styles.sectionRow}>
                    <div className={styles.sectionLabel}>
                      <div className={styles.labelText2}>コンセプト</div>
                    </div>
                    <div className={styles.conceptValue}>
                      <div className={styles.conceptText}>{work.concept}</div>
                    </div>
                  </div>
                )}
                {work.target && (
                  <div className={styles.sectionRow}>
                    <div className={styles.sectionLabel}>
                      <div className={styles.labelText2}>ターゲット</div>
                    </div>
                    <div className={styles.sectionContent}>
                      <div className={styles.contentText}>{work.target}</div>
                    </div>
                  </div>
                )}
                {work.challenge && (
                  <div className={styles.sectionRow}>
                    <div className={styles.sectionLabel}>
                      <div className={styles.issue}>課題</div>
                    </div>
                    <div className={styles.issueValue}>
                      <div className={styles.contentText}>{work.challenge}</div>
                    </div>
                  </div>
                )}
                {work.purpose && (
                  <div className={styles.sectionRow}>
                    <div className={styles.sectionLabel}>
                      <div className={styles.labelText2}>目的</div>
                    </div>
                    <div className={styles.sectionContent}>
                      <div className={styles.contentText}>{work.purpose}</div>
                    </div>
                  </div>
                )}
                {work.informationDesign && (
                  <div className={styles.sectionRow}>
                    <div className={styles.infoDesignLabel}>
                      <div className={styles.labelText2}>情報設計</div>
                    </div>
                    <div className={styles.sectionContent}>
                      <div className={styles.contentText}>
                        {work.informationDesign}
                      </div>
                    </div>
                  </div>
                )}
                {work.design && (
                  <div className={styles.sectionRow}>
                    <div className={styles.sectionLabel}>
                      <div className={styles.labelText2}>デザイン</div>
                    </div>
                    <div className={styles.sectionContent}>
                      <div className={styles.contentText}>{work.design}</div>
                    </div>
                  </div>
                )}
                {work.implementation && (
                  <div className={styles.sectionRow}>
                    <div className={styles.sectionLabel}>
                      <div className={styles.labelText2}>実装予定</div>
                    </div>
                    <div className={styles.sectionContent}>
                      <div className={styles.contentText}>
                        {work.implementation}
                      </div>
                    </div>
                  </div>
                )}
                {/* 制作期間セクション */}
                {(work.planningDays || work.designDays || work.codingDays) && (
                  <div className={styles.sectionRow}>
                    <div className={styles.sectionLabel}>
                      <div className={styles.labelText2}>制作期間</div>
                    </div>
                    <div className={styles.sectionContent}>
                      <div className={styles.productionPeriod}>
                        {work.planningDays && (
                          <div className={styles.periodItem}>
                            <span className={styles.periodLabel}>企画&WF:</span>
                            <span className={styles.periodValue}>
                              {work.planningDays}日
                            </span>
                          </div>
                        )}
                        {work.designDays && (
                          <div className={styles.periodItem}>
                            <span className={styles.periodLabel}>
                              デザイン:
                            </span>
                            <span className={styles.periodValue}>
                              {work.designDays}日
                            </span>
                          </div>
                        )}
                        {work.codingDays && (
                          <div className={styles.periodItem}>
                            <span className={styles.periodLabel}>
                              コーディング:
                            </span>
                            <span className={styles.periodValue}>
                              {work.codingDays}日
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* プロジェクト画像セクション */}
          {work.designImage && (
            <div className={styles.projectImageSection}>
              <Image
                src={work.designImage}
                alt={`${work.title} デザイン画像`}
                width={627}
                height={836}
                style={{ width: "100%", height: "auto" }}
                quality={85}
                loading="eager"
                priority
                placeholder="blur"
                blurDataURL="data:image/webp;base64,UklGRkwAAABXRUJQVlA4IEAAAAAwAgCdASoKAAYAAkA4JaQAA3AA/v3AgAA="
                sizes="(max-width: 768px) 100vw, 627px"
              />
            </div>
          )}

          {/* その他の作品セクション */}
          {otherWorks.length > 0 && (
            <div className={styles.otherWorksSection}>
              <div className={styles.container}>
                <div className={styles.container2}>
                  <div className={styles.sectionTitle}>Other Works</div>
                </div>
              </div>
              <RotatingCarousel
                works={otherWorks}
                currentIndex={currentWorkIndex}
                onIndexChange={setCurrentWorkIndex}
              />
            </div>
          )}
        </div>
        {/* sm以上用装飾セクション */}
        <div className={styles.bottomSection}>
          <div
            className={styles.decorativeCircle}
            onClick={scrollToTop}
            style={{ cursor: "pointer", position: "relative" }}
          >
            <Image
              src="/images/tothetop.GIF"
              alt="Top of page"
              width={320}
              height={320}
              loading="eager"
              priority
              quality={85}
              sizes="320px"
              style={{ objectFit: 'contain' }}
            />
            {/* デスクトップ用吹き出し */}
            <ScrollTopBubble
              targetSelector={`.${styles.decorativeCircle}`}
              isMobile={false}
            />
          </div>
        </div>

        {/* sm未満用プロフィールセクション */}
        <div className={mobileStyles.mobileProfileSection}>
          <div
            className={mobileStyles.mobileProfileImage}
            onClick={scrollToTop}
            style={{ cursor: "pointer", position: "relative" }}
          >
            <Image
              src="/images/tothetop.GIF"
              alt="Top of page"
              width={192}
              height={192}
              loading="eager"
              priority
              quality={85}
              sizes="192px"
              style={{ objectFit: 'contain' }}
            />
            {/* モバイル用吹き出し */}
            <ScrollTopBubble
              targetSelector={`.${mobileStyles.mobileProfileImage}`}
              isMobile={true}
            />
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
