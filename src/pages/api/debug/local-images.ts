import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // publicフォルダ内の画像ファイルをすべて取得
    const publicImagesPath = path.join(process.cwd(), "public", "images");
    const imageFiles = fs.readdirSync(publicImagesPath);

    // コードで参照されている画像パス一覧
    const referencedImages = [
      // HeroSection
      "taichi-portfolio-top.png",

      // MainSection (想定)
      "tothetop.GIF",

      // SkillsSection
      "figma_img.png",
      "illustrator_img.png",
      "photoshop_img.png",
      "Next.js_img.png",
      "rails_img.png",
      "htmlcssjs_img.png",
      "sass_img.png",
      "tailwind_img.png",
      "github_img.png",
      "swift_img.png",

      // Profile/About画像（想定）
      "about-taichi-main.webp",
      "about-taichi2-main.webp",
      "about-taichi-ma.webp",
      "img_profile-taichi2.PNG",
      "taichi-hello.PNG",
      "taichi-silent.PNG",
      "taichi-talking.GIF",

      // Step/Career画像（想定）
      "img_step1.PNG",
      "img_step2.PNG",
      "img_step3.PNG",
      "img_step4.PNG",
      "img_step5.PNG",

      // その他
      "img_ruby-skill.PNG",
      "img_denwa-bug.webp",
      "instagram-background.png",
      "instagram2background.png",
      "x-background.png",
    ];

    // 画像ファイルの存在チェック
    const imageAnalysis = referencedImages.map((imageName) => ({
      filename: imageName,
      exists: imageFiles.includes(imageName),
      actualFile:
        imageFiles.find(
          (file) => file.toLowerCase() === imageName.toLowerCase()
        ) || null,
      caseMatch: imageFiles.includes(imageName),
      extensionMatch: imageFiles.some(
        (file) =>
          file.replace(/\.[^/.]+$/, "") === imageName.replace(/\.[^/.]+$/, "")
      ),
    }));

    // 存在しないファイルまたは大文字小文字が一致しないファイル
    const missingImages = imageAnalysis.filter((img) => !img.exists);
    const caseMismatch = imageAnalysis.filter(
      (img) => !img.caseMatch && img.actualFile !== null
    );

    // publicフォルダにあるが参照されていない画像
    const unreferencedImages = imageFiles.filter(
      (file) => !referencedImages.includes(file)
    );

    console.log("=== Local Images Analysis ===");
    console.log("Missing images:", missingImages);
    console.log("Case mismatches:", caseMismatch);
    console.log("Unreferenced images:", unreferencedImages);

    res.status(200).json({
      summary: {
        totalReferencedImages: referencedImages.length,
        totalExistingImages: imageFiles.length,
        missingCount: missingImages.length,
        caseMismatchCount: caseMismatch.length,
        unreferencedCount: unreferencedImages.length,
      },
      details: {
        existingImages: imageFiles,
        missingImages: missingImages.map((img) => ({
          requested: img.filename,
          suggestion: img.actualFile || "File not found",
        })),
        caseMismatches: caseMismatch,
        unreferencedImages,
      },
      recommendations: [
        missingImages.length > 0 &&
          `${missingImages.length} 個の画像ファイルが見つかりません`,
        caseMismatch.length > 0 &&
          `${caseMismatch.length} 個の画像で大文字小文字の不一致があります`,
        unreferencedImages.length > 0 &&
          `${unreferencedImages.length} 個の未使用画像があります`,
      ].filter(Boolean),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Local images analysis error:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
