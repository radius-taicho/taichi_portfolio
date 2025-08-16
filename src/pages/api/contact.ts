import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";
import validator from "validator";
import DOMPurify from "isomorphic-dompurify";

// レート制限用のメモリストア（本番環境ではRedisを推奨）
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// レート制限チェック
const checkRateLimit = (ip: string): boolean => {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15分
  const maxRequests = 5; // 15分間に最大5回

  const record = rateLimitStore.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count++;
  return true;
};

// IPアドレス取得
const getClientIP = (req: NextApiRequest): string => {
  const forwarded = req.headers["x-forwarded-for"];
  const ip = forwarded
    ? Array.isArray(forwarded)
      ? forwarded[0]
      : forwarded.split(",")[0]
    : req.connection.remoteAddress || req.socket.remoteAddress || "unknown";
  return ip;
};

// 入力値バリデーション
const validateInput = (name: string, email: string, contents: string) => {
  const errors: string[] = [];

  // 名前のバリデーション
  if (!name || name.trim().length === 0) {
    errors.push("名前は必須です");
  } else if (name.length > 100) {
    errors.push("名前は100文字以内で入力してください");
  }

  // メールアドレスのバリデーション
  if (!email || email.trim().length === 0) {
    errors.push("メールアドレスは必須です");
  } else if (!validator.isEmail(email)) {
    errors.push("有効なメールアドレスを入力してください");
  } else if (email.length > 255) {
    errors.push("メールアドレスは255文字以内で入力してください");
  }

  // 内容のバリデーション
  if (!contents || contents.trim().length === 0) {
    errors.push("お問い合わせ内容は必須です");
  } else if (contents.length > 5000) {
    errors.push("お問い合わせ内容は5000文字以内で入力してください");
  }

  // スパム検知（簡易版）
  const spamKeywords = [
    "viagra",
    "casino",
    "lottery",
    "million dollars",
    "urgent business",
  ];
  const contentLower = contents.toLowerCase();
  const hasSpamKeywords = spamKeywords.some((keyword) =>
    contentLower.includes(keyword)
  );

  if (hasSpamKeywords) {
    errors.push("不適切な内容が含まれています");
  }

  return errors;
};

// HTMLエスケープとサニタイゼーション
const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] });
};

// データベース保存
const saveContactToDatabase = async (
  name: string,
  email: string,
  contents: string
) => {
  try {
    const contact = await prisma.contact.create({
      data: {
        name: sanitizeInput(name),
        email: sanitizeInput(email),
        message: sanitizeInput(contents),
        isRead: false,
      },
    });
    console.log(`✅ Contact saved to database with ID: ${contact.id}`);
    return contact;
  } catch (error) {
    console.error("❌ Database save error:", error);
    throw new Error("データベースへの保存に失敗しました");
  }
};

// Nodemailer設定
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || "587"),
    secure: false, // STARTTLS使用
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      ciphers: "SSLv3",
      rejectUnauthorized: true,
    },
  });
};

// メール送信
const sendEmail = async (name: string, email: string, contents: string) => {
  const transporter = createTransporter();

  // 送信先への通知メール
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_TO,
    subject: `【お問い合わせ】${sanitizeInput(name)}様より`,
    text: `
お名前: ${sanitizeInput(name)}
メールアドレス: ${sanitizeInput(email)}
お問い合わせ内容:
${sanitizeInput(contents)}

---
送信日時: ${new Date().toLocaleString("ja-JP")}
IP: ${process.env.CLIENT_IP || "unknown"}
    `,
    html: `
<h2>お問い合わせ</h2>
<p><strong>お名前:</strong> ${sanitizeInput(name)}</p>
<p><strong>メールアドレス:</strong> ${sanitizeInput(email)}</p>
<p><strong>お問い合わせ内容:</strong></p>
<div style="border-left: 3px solid #667eea; padding-left: 16px; margin: 16px 0;">
  ${sanitizeInput(contents).replace(/\n/g, "<br>")}
</div>
<hr>
<p style="color: #666; font-size: 12px;">
  送信日時: ${new Date().toLocaleString("ja-JP")}<br>
  IP: ${process.env.CLIENT_IP || "unknown"}
</p>
    `,
  };

  // 送信者への自動返信メール
  const autoReplyOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "お問い合わせありがとうございます - Taichi Portfolio",
    text: `
${sanitizeInput(name)} 様

この度はお問い合わせいただき、ありがとうございます。
以下の内容でお問い合わせを承りました。

---
お名前: ${sanitizeInput(name)}
メールアドレス: ${sanitizeInput(email)}
お問い合わせ内容:
${sanitizeInput(contents)}
---

ご返信まで2日ほどお時間をいただく場合がございます。
お急ぎの場合は、直接メールにてご連絡ください。

このメールは自動配信です。

稲永太一
    `,
    html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2 style="color: #667eea;">お問い合わせありがとうございます</h2>
  
  <p>${sanitizeInput(name)} 様</p>
  
  <p>この度はお問い合わせいただき、ありがとうございます。<br>
  以下の内容でお問い合わせを承りました。</p>
  
  <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <p><strong>お名前:</strong> ${sanitizeInput(name)}</p>
    <p><strong>メールアドレス:</strong> ${sanitizeInput(email)}</p>
    <p><strong>お問い合わせ内容:</strong></p>
    <div style="border-left: 3px solid #667eea; padding-left: 16px; margin-top: 8px;">
      ${sanitizeInput(contents).replace(/\n/g, "<br>")}
    </div>
  </div>
  
  <p>ご返信まで2-3営業日ほどお時間をいただく場合がございます。<br>
  お急ぎの場合は、直接メールにてご連絡ください。</p>
  
  <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
  
  <p style="color: #666; font-size: 12px;">
    このメールは自動配信です。<br><br>
    稲永太一<br>
    Taichi Portfolio
  </p>
</div>
    `,
  };

  // メール送信実行
  await transporter.sendMail(mailOptions);
  await transporter.sendMail(autoReplyOptions);
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // CORS設定
  res.setHeader(
    "Access-Control-Allow-Origin",
    process.env.NEXT_PUBLIC_SITE_URL || "*"
  );
  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // IPアドレス取得とレート制限チェック
    const clientIP = getClientIP(req);
    process.env.CLIENT_IP = clientIP; // ログ用に保存

    if (!checkRateLimit(clientIP)) {
      console.warn(`Rate limit exceeded for IP: ${clientIP}`);
      return res.status(429).json({
        error: "リクエストが多すぎます。15分後に再度お試しください。",
      });
    }

    // 入力値取得
    const { name, email, contents } = req.body;

    if (!name || !email || !contents) {
      return res.status(400).json({ error: "必要な項目が入力されていません" });
    }

    // バリデーション
    const validationErrors = validateInput(name, email, contents);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        error: "入力内容に問題があります",
        details: validationErrors,
      });
    }

    // データベースに保存
    await saveContactToDatabase(name, email, contents);

    // メール送信
    await sendEmail(name, email, contents);

    // 成功ログ
    console.log(
      `Contact form submitted successfully from IP: ${clientIP}, Email: ${email}`
    );

    res.status(200).json({
      message: "お問い合わせを受け付けました。ありがとうございます！",
    });
  } catch (error) {
    // エラーログ（本番環境では詳細なエラー情報は返さない）
    console.error("Contact form error:", error);

    res.status(500).json({
      error:
        "メールの送信に失敗しました。しばらく経ってから再度お試しください。",
    });
  }
}
