import React, { useState } from "react";
import Head from "next/head";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styles from "@/styles/contact.module.scss";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contents: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [messageType, setMessageType] = useState<
    "success" | "error" | "warning"
  >("success");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessageType("success");
        setSubmitMessage(
          data.message || "メッセージを送信いたしました。ありがとうございます！"
        );
        setFormData({ name: "", email: "", contents: "" });
      } else {
        // エラーメッセージの表示
        setMessageType(response.status === 429 ? "warning" : "error");
        if (data.details && Array.isArray(data.details)) {
          setSubmitMessage(
            `入力内容をご確認ください: ${data.details.join(", ")}`
          );
        } else {
          setSubmitMessage(
            data.error || "送信に失敗しました。もう一度お試しください。"
          );
        }
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setMessageType("error");
      setSubmitMessage(
        "ネットワークエラーが発生しました。しばらく経ってから再度お試しください。"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Contact - Taichi Portfolio</title>
        <meta name="description" content="稲永太一へのお問い合わせページ" />
      </Head>
      <div className={styles.pageContainer}>
        <Header />
        <div className={styles.mainContent}>
          {/* Contact タイトルセクション */}
          <section className={styles.titleSection}>
            <div className={styles.titleContainer}>
              <h1 className={styles.pageTitle}>Contact</h1>
            </div>
          </section>

          {/* コンタクトフォーム */}
          <section className={styles.contactForm}>
            <form onSubmit={handleSubmit}>
              {/* ソーシャルリンクセクション */}
              <div className={styles.socialLinksSection}>
                <div className={styles.socialIconsContainer}>
                  <div className={styles.socialIconsGroup}>
                    <div className={styles.socialIcon}></div>
                    <div className={styles.socialIcon}></div>
                    <div className={styles.socialIcon}></div>
                    <div className={styles.socialIcon}></div>
                  </div>
                </div>
                <div className={styles.socialTextContainer}>
                  <div className={styles.socialText}>コチラからもどうぞ</div>
                </div>
              </div>

              <div className={styles.formFields}>
                {/* 名前フィールド */}
                <div className={styles.nameFieldGroup}>
                  <div className={styles.nameFieldContainer}>
                    <div className={styles.nameLabelContainer}>
                      <div className={styles.labelWrapper}>
                        <label htmlFor="name" className={styles.fieldLabel}>
                          Name
                        </label>
                      </div>
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={styles.nameInput}
                      required
                    />
                  </div>

                  {/* メールアドレスフィールド */}
                  <div className={styles.emailFieldGroup}>
                    <div className={styles.emailLabelContainer}>
                      <div className={styles.labelWrapper}>
                        <label htmlFor="email" className={styles.fieldLabel}>
                          E-mail Address
                        </label>
                      </div>
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={styles.emailInput}
                      required
                    />
                  </div>

                  {/* 内容フィールド */}
                  <div className={styles.contentsFieldGroup}>
                    <div className={styles.contentsLabelContainer}>
                      <div className={styles.labelWrapper}>
                        <label htmlFor="contents" className={styles.fieldLabel}>
                          Contents
                        </label>
                      </div>
                    </div>
                    <textarea
                      id="contents"
                      name="contents"
                      value={formData.contents}
                      onChange={handleInputChange}
                      className={styles.contentsInput}
                      rows={6}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* 送信ボタン */}
              <div className={styles.submitButtonContainer}>
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={isSubmitting}
                >
                  <span className={styles.buttonText}>
                    {isSubmitting ? "送信中..." : "Submit"}
                  </span>
                </button>
              </div>

              {/* 送信メッセージ */}
              {submitMessage && (
                <div
                  className={`${styles.submitMessage} ${
                    messageType === "error"
                      ? styles.error
                      : messageType === "warning"
                      ? styles.warning
                      : ""
                  }`}
                >
                  {submitMessage}
                </div>
              )}
            </form>
          </section>

          {/* デコレーションセクション */}
          <div className={styles.decorationSection}></div>
        </div>
        <Footer />
      </div>
    </>
  );
}
