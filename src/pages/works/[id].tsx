import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RotatingCarousel from "@/components/RotatingCarousel";
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

  // Cloudinary URL 最適化関数（最高品質版）
  const optimizeCloudinaryUrl = (
    url: string,
    width?: number,
    height?: number
  ) => {
    if (!url || !url.includes("cloudinary.com")) return url;

    // Cloudinary URL の最適化パラメータを追加
    const params = [
      "f_auto", // 自動フォーマット選択（WebP、AVIF等）
      "q_100", // 品質100%（最高品質・非圧縮レベル）
      "c_fill", // クロップ方式
      width ? `w_${width}` : null,
      height ? `h_${height}` : null,
      "dpr_auto", // デバイスピクセル比対応
      "fl_progressive", // プログレッシブ読み込み
      "fl_immutable_cache", // キャッシュ最適化
      "fl_preserve_transparency" // 透明度保持
    ]
      .filter(Boolean)
      .join(",");

    // URLに最適化パラメータを挿入
    return url.replace("/upload/", `/upload/${params}/`);
  };

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
        {/* 画像プリロード */}
        {work.mainImage && (
          <link
            rel="preload"
            as="image"
            href={optimizeCloudinaryUrl(work.mainImage, 1200, 800)}
          />
        )}
        {work.designImage && (
          <link
            rel="preload"
            as="image"
            href={optimizeCloudinaryUrl(work.designImage, 1200, 800)}
          />
        )}
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
                    src={optimizeCloudinaryUrl(work.mainImage, 1600, 1000)}
                    alt={work.title}
                    fill
                    style={{ objectFit: "cover" }}
                    priority
                    quality={100}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, (max-width: 1600px) 100vw, 1600px"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
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
                  {work.name || "作品の説明がありません"}
                </div>
              </div>
              <div className={styles.projectDetails}>
                <div className={styles.detailRow}>
                  <div className={styles.detailLabel}>
                    <div className={styles.title}>title:</div>
                  </div>
                  <div className={styles.detailValue}>{work.title}</div>
                </div>
                <div className={styles.detailRow}>
                  <div className={styles.detailLabel}>
                    <div className={styles.labelText}>type:</div>
                  </div>
                  <div className={styles.detailValue}>
                    {work.type}
                    <span className={styles.statusBadge}>
                      {work.status === 'completed' && '🚀 開発済み'}
                      {work.status === 'in_progress' && '⚡ 開発中'}
                      {work.status === 'planning' && '💡 企画段階'}
                    </span>
                  </div>
                </div>
                <div className={styles.detailRow}>
                  <div className={styles.detailLabel}>
                    <div className={styles.labelText}>client:</div>
                  </div>
                  <div className={styles.clientValue}>
                    {work.client || "個人制作"}
                  </div>
                </div>
                {work.link && (
                  <div className={styles.linkContainer}>
                    <div className={styles.detailLabel}>
                      <div className={styles.labelText}>link:</div>
                    </div>
                    <div className={styles.detailValue}>
                      <a
                        href={work.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {work.link}
                      </a>
                    </div>
                  </div>
                )}
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
                      <div className={styles.contentText}>{work.implementation}</div>
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
              <div className={styles.projectImage}>
                <div className={styles.imageContainer}>
                  <Image
                  src={optimizeCloudinaryUrl(work.designImage, 2000, 1400)}
                  alt={`${work.title} デザイン画像`}
                  fill
                  style={{ objectFit: "cover" }}
                  quality={100}
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, (max-width: 2000px) 100vw, 2000px"
                  placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                    onError={(e) => {
                      console.error("Design image load error:", e);
                      console.error("Design image URL:", work.designImage);
                    }}
                    onLoad={() => {
                      console.log(
                        "Design image loaded successfully:",
                        work.designImage
                      );
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* その他の作品セクション */}
          {otherWorks.length > 0 && (
            <div className={styles.otherWorksSection}>
              <div className={styles.container}>
                <div className={styles.container2}>
                  <div className={styles.sectionTitle}>Other Works Website</div>
                </div>
              </div>
              <RotatingCarousel
                works={otherWorks}
                currentIndex={currentWorkIndex}
                onIndexChange={setCurrentWorkIndex}
                optimizeCloudinaryUrl={optimizeCloudinaryUrl}
              />
            </div>
          )}

          {/* sm以上用装飾セクション */}
          <div className={styles.bottomSection}>
            <div className={styles.decorativeCircle}></div>
          </div>

          {/* sm未満用プロフィールセクション */}
          <div className={mobileStyles.mobileProfileSection}>
            <div className={mobileStyles.mobileProfileImage} />
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
