import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { action } = req.body;

    if (action !== 'fix-filenames') {
      return res.status(400).json({ message: 'Invalid action' });
    }

    const publicImagesPath = path.join(process.cwd(), 'public', 'images');
    const imageFiles = fs.readdirSync(publicImagesPath);

    // 修正が必要なファイル名のマッピング
    const corrections = [
      // 大文字拡張子を小文字に修正
      { pattern: /\.PNG$/, replacement: '.png' },
      { pattern: /\.GIF$/, replacement: '.gif' },
      { pattern: /\.WEBP$/, replacement: '.webp' },
      { pattern: /\.JPG$/, replacement: '.jpg' },
      { pattern: /\.JPEG$/, replacement: '.jpeg' },
    ];

    const fixedFiles = [];
    const errors = [];

    for (const file of imageFiles) {
      for (const correction of corrections) {
        if (correction.pattern.test(file)) {
          const newFileName = file.replace(correction.pattern, correction.replacement);
          const oldPath = path.join(publicImagesPath, file);
          const newPath = path.join(publicImagesPath, newFileName);

          try {
            // ファイル名を変更
            fs.renameSync(oldPath, newPath);
            fixedFiles.push({
              old: file,
              new: newFileName,
              path: `/images/${newFileName}`
            });
            console.log(`✅ Renamed: ${file} → ${newFileName}`);
            break; // 一つの修正が完了したら次のファイルへ
          } catch (error) {
            errors.push({
              file,
              error: error instanceof Error ? error.message : 'Unknown error'
            });
            console.error(`❌ Failed to rename ${file}:`, error);
          }
        }
      }
    }

    res.status(200).json({
      success: true,
      message: `ファイル名の修正が完了しました`,
      results: {
        fixedCount: fixedFiles.length,
        errorCount: errors.length,
        fixedFiles,
        errors,
      },
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Fix filenames error:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
