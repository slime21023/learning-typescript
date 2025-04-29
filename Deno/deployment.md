---
date: 2025-04-29
tags: deno
order: 9
---

# 部署與發佈


將 Deno 應用程式從開發環境順利過渡到生產環境是整個開發生命週期中的關鍵階段。

Deno 作為一個現代化的 JavaScript/TypeScript 執行環境，提供了多種部署選項和工具，使發佈過程更加靈活和高效。

## 使用 deno compile 創建獨立執行檔

Deno 提供了強大的編譯功能，可將應用程式打包成單一的獨立執行檔，無需安裝 Deno 運行時即可執行。

- **跨平台編譯**：支援為不同作業系統（Windows、macOS、Linux）生成執行檔
- **權限控制**：在編譯時指定應用程式所需的權限
- **自包含**：生成的執行檔包含所有依賴，無需額外安裝
- **執行效率**：編譯後的執行檔啟動速度更快，適合生產環境

**最佳實踐**

- 在編譯前確保應用程式通過所有測試，確保穩定性
- 明確指定應用程式所需的最小權限，遵循最小權限原則
- 為不同目標平台分別編譯執行檔，確保最佳兼容性
- 在編譯時使用 `--lock` 選項確保依賴版本一致性
- 考慮使用 CI/CD 流程自動化編譯過程

```bash
# 基本編譯命令示例
deno compile --allow-net --allow-read --allow-env main.ts

# 為特定平台編譯
deno compile --target x86_64-unknown-linux-gnu --allow-net main.ts

# 使用依賴鎖定檔案
deno compile --lock=deno.lock --allow-net main.ts
```

## 利用 Docker 容器化應用

容器化是現代應用程式部署的主流方式，為 Deno 應用程式提供了一致的運行環境和更好的隔離性。

- **環境一致性**：確保開發、測試和生產環境的一致性
- **隔離性**：應用程式在容器內運行，與主機系統隔離
- **可擴展性**：便於實現水平擴展和負載均衡
- **部署靈活性**：可部署到任何支援 Docker 的平台

**最佳實踐**

- 使用官方 Deno Docker 映像作為基礎
- 採用多階段構建減小最終映像大小
- 使用非 root 用戶運行容器，提高安全性
- 正確處理容器內的信號轉發，確保應用程式可以優雅關閉
- 將配置通過環境變數注入容器，遵循十二要素應用原則

```dockerfile
# 基本 Dockerfile 示例
FROM denoland/deno:latest

WORKDIR /app

# 複製依賴描述檔案
COPY import_map.json deno.json ./

# 快取依賴
RUN deno cache --import-map=import_map.json main.ts

# 複製應用程式程式碼
COPY . .

# 設定使用者
USER deno

# 設定環境變數
ENV PORT=8000

# 暴露連接埠
EXPOSE 8000

# 啟動應用程式
CMD ["run", "--allow-net", "--allow-env", "--allow-read", "main.ts"]
```

## 實作健康檢查和監控

確保應用程式在生產環境中的可靠運行，需要實作有效的健康檢查和監控機制。


- **健康檢查端點**：提供 API 端點供基礎設施檢查應用程式狀態
- **就緒探針**：區分應用程式是否已準備好處理請求
- **活性探針**：檢測應用程式是否仍在運行
- **指標收集**：收集關鍵性能和業務指標，用於監控和警報

**最佳實踐**

- 實作專門的健康檢查端點，回應應用程式和依賴服務的狀態
- 區分就緒狀態和活性狀態，適應不同的基礎設施需求
- 收集關鍵指標如響應時間、錯誤率、資源使用等
- 設置適當的警報閾值，及時發現並解決問題
- 實作分佈式追蹤，便於排查複雜系統中的問題

```typescript
// 健康檢查端點示例
router.get("/health", async (ctx) => {
  // 檢查資料庫連接
  const dbStatus = await checkDatabaseConnection();
  
  // 檢查快取服務
  const cacheStatus = await checkCacheService();
  
  // 回應健康狀態
  ctx.response.body = {
    status: dbStatus && cacheStatus ? "healthy" : "unhealthy",
    timestamp: new Date().toISOString(),
    services: {
      database: dbStatus ? "connected" : "disconnected",
      cache: cacheStatus ? "connected" : "disconnected"
    },
    version: APP_VERSION,
    uptime: process.uptime()
  };
  
  // 設置適當的狀態碼
  ctx.response.status = dbStatus && cacheStatus ? 200 : 503;
});
```

## 考慮使用 Deno Deploy 簡化部署

Deno Deploy 是 Deno 官方提供的雲端部署平台，專為 Deno 應用程式優化，提供全球分佈式部署能力。

- **無伺服器架構**：無需管理伺服器，自動擴展
- **全球分佈**：應用程式部署到全球邊緣節點，降低延遲
- **與 GitHub 整合**：支援直接從 GitHub 倉庫部署
- **簡化部署流程**：無需配置容器或伺服器環境

**最佳實踐**

- 優化應用程式以適應無伺服器環境的限制
- 使用 GitHub Actions 自動化部署流程
- 利用環境變數管理不同環境的配置
- 實作漸進式部署策略，減少發佈風險
- 使用自定義域名和 HTTPS 提升專業形象和安全性

```typescript
// Deno Deploy 友好的應用程式入口點
import { serve } from "https://deno.land/std/http/server.ts";
import { app } from "./app.ts";

// 從環境變數獲取連接埠，默認為 8000
const port = parseInt(Deno.env.get("PORT") || "8000");

console.log(`Starting server on port ${port}...`);
await serve(app.fetch, { port });
```

## 自動化部署流程

自動化部署流程可以提高發佈效率，減少人為錯誤，確保部署一致性。

- **CI/CD 管道**：自動化測試、構建和部署過程
- **環境管理**：區分開發、測試、預生產和生產環境
- **版本控制**：確保每次部署的可追溯性
- **回滾機制**：在部署失敗時能夠快速回滾到穩定版本

**最佳實踐**

- 使用 GitHub Actions、GitLab CI 等工具建立 CI/CD 管道
- 實作自動化測試，確保每次部署的程式碼質量
- 使用環境變數管理不同環境的配置
- 實作藍綠部署或金絲雀發佈策略，降低部署風險
- 保留部署歷史記錄，便於問題排查和版本回滾

```yaml
# GitHub Actions 工作流示例
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: denoland/setup-deno@v1
        with:
          deno-version: v1.x
      - name: Run tests
        run: deno test --allow-net --allow-read

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: denoland/setup-deno@v1
        with:
          deno-version: v1.x
      - name: Build application
        run: deno compile --allow-net --allow-read --allow-env -o app main.ts
      - name: Upload artifact
        uses: actions/upload-artifact@v3
        with:
          name: app
          path: app

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v3
        with:
          name: app
      - name: Deploy to server
        run: |
          chmod +x app
          # 部署腳本
```

## 為不同目標平台準備編譯版本

Deno 應用程式可能需要在不同的作業系統和架構上運行，為這些平台準備專用的編譯版本可以提供最佳的兼容性和性能。

- **跨平台編譯**：為不同作業系統（Windows、macOS、Linux）生成執行檔
- **架構支援**：支援不同 CPU 架構（x86_64、ARM64 等）
- **優化選項**：針對特定平台的優化設置
- **發佈管理**：管理和分發不同平台的執行檔

**最佳實踐**

- 使用 CI/CD 系統自動為所有目標平台構建執行檔
- 對每個平台版本進行充分測試，確保兼容性
- 使用一致的命名規則，便於用戶識別適合的版本
- 提供清晰的安裝和使用說明，降低用戶使用門檻
- 考慮使用自動更新機制，便於用戶獲取最新版本

```bash
# 為多個平台編譯的腳本示例
#!/bin/bash

VERSION="1.0.0"
APP_NAME="my-deno-app"

# 為 Linux (x86_64) 編譯
deno compile --target x86_64-unknown-linux-gnu --allow-net --allow-read main.ts
mv main "${APP_NAME}-${VERSION}-linux-x86_64"

# 為 macOS (x86_64) 編譯
deno compile --target x86_64-apple-darwin --allow-net --allow-read main.ts
mv main "${APP_NAME}-${VERSION}-macos-x86_64"

# 為 macOS (ARM64) 編譯
deno compile --target aarch64-apple-darwin --allow-net --allow-read main.ts
mv main "${APP_NAME}-${VERSION}-macos-arm64"

# 為 Windows 編譯
deno compile --target x86_64-pc-windows-msvc --allow-net --allow-read main.ts
mv main.exe "${APP_NAME}-${VERSION}-windows-x86_64.exe"

# 創建發佈壓縮檔
for file in ${APP_NAME}-${VERSION}-*; do
  tar -czf "${file}.tar.gz" "${file}"
done
```

---

隨著 Deno 生態系統的不斷發展，部署選項和工具也在持續改進。保持對最新實踐和工具的關注，將有助於不斷優化部署流程，提升應用程式的可用性和用戶體驗。