---
date: 2025-04-29
tags: deno
order: 6
---

# 安全性實踐

## 核心安全理念

Deno 應用程式的安全性建立在多層防禦策略上，透過以下核心原則來保護您的應用程式：

## 遵循最小權限原則

僅授予程式運行所需的最小權限集合，減少潛在攻擊面。

```typescript
// 明確指定所需權限
// deno run --allow-net=api.example.com --allow-read=./config main.ts

// 運行時權限檢查
const netStatus = await Deno.permissions.query({
  name: "net",
  host: "api.example.com"
});

if (netStatus.state !== "granted") {
  console.error("需要網路權限才能連接到 API");
  Deno.exit(1);
}
```

## 驗證所有外部輸入

所有外部資料都是不可信的，必須經過嚴格驗證才能使用。

```typescript
// 使用 Zod 進行資料驗證
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const UserSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email().optional(),
  age: z.number().int().positive(),
});

// 在 API 中使用
try {
  const body = await request.json();
  const validatedUser = UserSchema.parse(body);
  // 安全地使用已驗證的資料
} catch (error) {
  // 處理驗證錯誤
}
```

## 防止注入攻擊

使用參數化查詢和適當的轉義機制，避免直接拼接 SQL 或 HTML。

```typescript
// 安全的參數化 SQL 查詢
const query = `SELECT * FROM users WHERE username = $1`;
const result = await db.query(query, [username]);

// 安全的 HTML 處理
import { escapeHTML } from "../utils/html.ts";
function renderComment(comment: string) {
  return `<div class="comment">${escapeHTML(comment)}</div>`;
}
```

## 安全管理敏感資訊

妥善保護密碼、API 金鑰和個人資料，避免在程式碼或日誌中暴露。

```typescript
// 使用環境變數存儲敏感資訊
import { load } from "https://deno.land/std@0.200.0/dotenv/mod.ts";
await load({ export: true });

const apiKey = Deno.env.get("API_KEY");

// 安全的密碼處理
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(12));
```

## 實施多層次防禦

結合多種安全機制提供深度防禦，即使一層被突破，其他層仍能提供保護。

```typescript
// 內容安全政策 (CSP)
ctx.response.headers.set("Content-Security-Policy", 
  "default-src 'self'; script-src 'self' 'nonce-" + nonce + "'");

// CSRF 保護
const token = await generateCsrfToken(sessionId);
if (!token || !(await validateCsrfToken(token, sessionId))) {
  ctx.response.status = 403;
  return;
}

// 速率限制
const loginLimiter = new RateLimiter(5, 15 * 60 * 1000); // 15分鐘內5次嘗試
if (!loginLimiter.check(ip)) {
  ctx.response.status = 429; // Too Many Requests
  return;
}
```

## 定期更新與監控

安全是持續的過程，需要定期更新依賴、掃描漏洞並監控應用程式行為。

```typescript
// deno.json - 配置更新和安全檢查任務
{
  "tasks": {
    "check-updates": "deno run --allow-net=deno.land udd deps.ts",
    "security-check": "deno run --allow-net audit-deps.ts"
  }
}
```

---

透過這些核心安全實踐，您可以顯著提高 Deno 應用程式的安全性，防止常見的安全漏洞，並建立一個更加穩健的安全架構。記住，安全不是一次性的工作，而是開發過程中持續關注的重點。

