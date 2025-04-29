---

date: 2025-04-29
tags: deno
order: 5
---

# 錯誤處理機制

有效的錯誤處理是建立穩健應用程式的基石。

在 Deno 環境中使用 TypeScript 時，良好的錯誤處理策略不僅能提高應用程式的可靠性，還能簡化除錯過程並提供更好的用戶體驗。

## 創建自定義錯誤類別

建立繼承自 `Error` 的自定義錯誤類別，以區分不同類型的錯誤並攜帶更多上下文資訊。

```typescript
// errors.ts
export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = this.constructor.name;
    // 確保堆疊追蹤正確顯示
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class NotFoundError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, "NOT_FOUND", 404, details);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, "VALIDATION_FAILED", 400, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, "UNAUTHORIZED", 401, details);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, "FORBIDDEN", 403, details);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, "DATABASE_ERROR", 500, details);
  }
}
```

### 使用範例
```typescript
import { NotFoundError } from "./errors.ts";

async function getUserById(id: string): Promise<User> {
  const user = await db.users.findOne({ id });
  
  if (!user) {
    throw new NotFoundError(`User with ID ${id} not found`);
  }
  
  return user;
}
```


自定義錯誤類別提供了更多上下文資訊，使錯誤處理更加精確。它們允許根據錯誤類型採取不同的處理策略，並能夠在 HTTP API 中映射到適當的狀態碼。

## 正確處理異步錯誤

在處理 Promise 和異步函數時，使用 try/catch 與 async/await 組合來捕獲錯誤。避免未處理的 Promise 拒絕。


```typescript
// 不推薦：未處理的 Promise 拒絕
function fetchData() {
  fetch("https://api.example.com/data")
    .then(response => response.json())
    .then(data => processData(data));
    // 缺少 .catch() 處理錯誤
}

// 推薦：使用 async/await 與 try/catch
async function fetchData() {
  try {
    const response = await fetch("https://api.example.com/data");
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const data = await response.json();
    return processData(data);
  } catch (error) {
    logger.error("Failed to fetch data", { error });
    // 重新拋出或返回錯誤結果
    throw new AppError("Failed to fetch data", "API_ERROR", 500, { cause: error });
  }
}

// 在 API 路由處理中
router.get("/data", async (ctx) => {
  try {
    const data = await fetchData();
    ctx.response.body = data;
  } catch (error) {
    if (error instanceof AppError) {
      ctx.response.status = error.statusCode;
      ctx.response.body = {
        error: error.code,
        message: error.message,
        details: error.details,
      };
    } else {
      ctx.response.status = 500;
      ctx.response.body = {
        error: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred",
      };
      // 記錄未預期的錯誤
      logger.error("Unhandled error in API route", { error });
    }
  }
});
```

使用 async/await 與 try/catch 使異步錯誤處理更加直觀和可靠。這種方式確保錯誤不會被忽略，並且可以在適當的層級進行處理，同時保持程式碼的可讀性。

## 實作結構化日誌記錄

使用結構化日誌記錄，包含錯誤上下文、堆疊追蹤和相關元數據，以便更容易分析和除錯問題。


```typescript
// logger.ts
import { format } from "https://deno.land/std@0.200.0/datetime/mod.ts";

export enum LogLevel {
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
}

type LogMetadata = Record<string, unknown>;

export class Logger {
  constructor(private context: string) {}

  debug(message: string, metadata?: LogMetadata): void {
    this.log(LogLevel.DEBUG, message, metadata);
  }

  info(message: string, metadata?: LogMetadata): void {
    this.log(LogLevel.INFO, message, metadata);
  }

  warn(message: string, metadata?: LogMetadata): void {
    this.log(LogLevel.WARN, message, metadata);
  }

  error(message: string, metadata?: LogMetadata): void {
    this.log(LogLevel.ERROR, message, metadata);
  }

  private log(level: LogLevel, message: string, metadata?: LogMetadata): void {
    const timestamp = format(new Date(), "yyyy-MM-dd HH:mm:ss.SSS");
    const logEntry = {
      timestamp,
      level,
      context: this.context,
      message,
      ...this.processMetadata(metadata),
    };

    const output = JSON.stringify(logEntry);
    
    // 根據日誌級別輸出到不同的流
    switch (level) {
      case LogLevel.ERROR:
      case LogLevel.WARN:
        console.error(output);
        break;
      default:
        console.log(output);
    }
  }

  private processMetadata(metadata?: LogMetadata): Record<string, unknown> {
    if (!metadata) return {};

    const processed: Record<string, unknown> = {};

    // 特殊處理錯誤對象
    if (metadata.error instanceof Error) {
      const error = metadata.error;
      processed.error = {
        name: error.name,
        message: error.message,
        stack: error.stack,
        ...(error instanceof AppError ? {
          code: error.code,
          statusCode: error.statusCode,
          details: error.details,
        } : {}),
      };
      
      // 移除原始錯誤對象以避免循環引用
      const { error: _, ...rest } = metadata;
      Object.assign(processed, rest);
    } else {
      Object.assign(processed, metadata);
    }

    return processed;
  }
}

// 創建默認 logger 實例
export const logger = new Logger("app");
```

```typescript
import { logger } from "./logger.ts";

try {
  await processUserData(userData);
} catch (error) {
  logger.error("Failed to process user data", {
    error,
    userId: userData.id,
    operation: "processUserData",
  });
}
```


結構化日誌記錄將錯誤信息組織成一致的格式，包含關鍵上下文信息，便於過濾、搜索和分析。這對於生產環境中的問題診斷尤為重要。

## 使用合適的日誌級別


根據信息的重要性和用途，選擇適當的日誌級別：
- **DEBUG**：詳細的開發信息，僅在開發或調試時使用
- **INFO**：常規操作信息，表示應用程式正常運行
- **WARN**：潛在問題或即將發生的錯誤，但不影響當前操作
- **ERROR**：錯誤事件，可能導致功能失敗但應用程式仍能運行


```typescript
// 配置日誌級別
const LOG_LEVEL = Deno.env.get("LOG_LEVEL") || "INFO";

function isLevelEnabled(level: LogLevel): boolean {
  const levels = {
    [LogLevel.DEBUG]: 0,
    [LogLevel.INFO]: 1,
    [LogLevel.WARN]: 2,
    [LogLevel.ERROR]: 3,
  };
  
  return levels[level] >= levels[LOG_LEVEL as LogLevel];
}

// 在 logger.ts 中使用
private log(level: LogLevel, message: string, metadata?: LogMetadata): void {
  if (!isLevelEnabled(level)) return;
  
  // 日誌記錄邏輯...
}
```

適當的日誌級別有助於控制日誌輸出的詳細程度，在不同環境（開發、測試、生產）中可以設置不同的級別。這樣既可以在需要時獲取詳細信息，又能避免在生產環境中產生過多的日誌。

## 集中處理全域錯誤

實作全域錯誤處理機制，捕獲未處理的錯誤和拒絕的 Promise，確保應用程式不會因未捕獲的錯誤而崩潰。

```typescript
// main.ts
import { logger } from "./logger.ts";

// 處理未捕獲的錯誤
addEventListener("error", (event) => {
  logger.error("Uncaught error", {
    error: event.error,
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
  });
});

// 處理未處理的 Promise 拒絕
addEventListener("unhandledrejection", (event) => {
  const reason = event.reason;
  logger.error("Unhandled Promise rejection", {
    error: reason instanceof Error ? reason : new Error(String(reason)),
  });
});

// 在 Oak 中間件中處理錯誤
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    logger.error("Unhandled error in request", {
      error,
      path: ctx.request.url.pathname,
      method: ctx.request.method,
    });
    
    if (error instanceof AppError) {
      ctx.response.status = error.statusCode;
      ctx.response.body = {
        error: error.code,
        message: error.message,
        ...(Deno.env.get("ENVIRONMENT") !== "production" && { details: error.details }),
      };
    } else {
      ctx.response.status = 500;
      ctx.response.body = {
        error: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred",
      };
    }
  }
});
```


全域錯誤處理提供了一個安全網，確保未被本地 try/catch 塊捕獲的錯誤仍然能夠被記錄和適當處理。這對於提高應用程式的健壯性和可靠性至關重要。

## 提供有意義的錯誤訊息

錯誤訊息應該清晰、具體，並提供足夠的上下文，幫助開發者和使用者理解問題的性質和可能的解決方案。

```typescript
// 不推薦：模糊的錯誤訊息
throw new Error("Failed");

// 推薦：具體且有上下文的錯誤訊息
throw new ValidationError(
  "Invalid email format",
  { field: "email", value: input.email, pattern: EMAIL_REGEX }
);

// API 響應中返回有用的錯誤信息
ctx.response.status = 400;
ctx.response.body = {
  error: "VALIDATION_ERROR",
  message: "The request contains invalid data",
  details: [
    { field: "email", message: "Invalid email format" },
    { field: "age", message: "Must be at least 18" }
  ]
};
```

有意義的錯誤訊息能夠加速問題診斷和解決過程。對於 API，清晰的錯誤響應有助於客戶端開發者理解問題並做出適當的處理。在生產環境中，應該避免暴露敏感的內部錯誤細節，但仍然提供足夠的信息以便用戶理解發生了什麼。
