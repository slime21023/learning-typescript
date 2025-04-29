---
date: 2025-04-29
tags: deno
order: 7
---
# 測試策略


測試是確保軟體品質的關鍵環節，一個完善的測試策略能夠提高程式碼可靠性、加速開發流程並降低維護成本。

在 Deno 環境中，我們可以利用其內建測試框架和現代化工具鏈，建立一套全面而高效的測試策略。

## 使用 Deno 內建測試框架

Deno 提供了內建的測試框架，無需額外安裝依賴即可開始測試。

**核心概念**

- **測試函數**：使用 `Deno.test()` 定義測試用例
- **斷言 API**：使用 `assertEquals`、`assertStrictEquals` 等進行結果驗證
- **測試生命週期**：支援測試前置和後置處理

```typescript
// 基本測試示例 (user_service_test.ts)
import { assertEquals } from "https://deno.land/std@0.210.0/assert/mod.ts";
import { findUserById } from "./user_service.ts";

Deno.test("findUserById - 返回存在的用戶", async () => {
  // 安排 (Arrange)
  const userId = "user123";
  
  // 執行 (Act)
  const user = await findUserById(userId);
  
  // 斷言 (Assert)
  assertEquals(user?.id, userId);
  assertEquals(user?.username, "johndoe");
  assertEquals(user?.isActive, true);
});

Deno.test("findUserById - 不存在的用戶返回 null", async () => {
  const user = await findUserById("nonexistent");
  assertEquals(user, null);
});

// 測試組織
Deno.test("用戶服務", async (t) => {
  // 測試組可以包含子測試
  await t.step("創建用戶 - 有效資料", async () => {
    // 測試邏輯...
  });
  
  await t.step("創建用戶 - 無效資料拋出錯誤", async () => {
    // 測試邏輯...
  });
});

// 執行測試
// deno test user_service_test.ts
```

**最佳實踐**

- **採用 AAA 模式**：將測試結構化為「安排 (Arrange)」、「執行 (Act)」和「斷言 (Assert)」三個階段
- **測試檔案命名**：使用 `*_test.ts` 命名約定，便於 Deno 自動識別
- **測試描述清晰**：測試名稱應清楚描述被測功能和預期結果

## 區分單元測試和整合測試

不同類型的測試有不同的目標和執行方式，清晰區分有助於建立更有效的測試策略。

**單元測試**

專注於測試最小的功能單元，通常是單個函數或方法，獨立於外部依賴。

```typescript
// 單元測試示例 (validation_test.ts)
import { assertEquals, assertThrows } from "https://deno.land/std@0.210.0/assert/mod.ts";
import { validateEmail, validatePassword } from "./validation.ts";

Deno.test("validateEmail - 有效的電子郵件", () => {
  assertEquals(validateEmail("user@example.com"), true);
  assertEquals(validateEmail("name.surname@domain.co.uk"), true);
});

Deno.test("validateEmail - 無效的電子郵件", () => {
  assertEquals(validateEmail("not-an-email"), false);
  assertEquals(validateEmail("missing@domain"), false);
  assertEquals(validateEmail("@nodomain.com"), false);
});

Deno.test("validatePassword - 符合強度要求", () => {
  assertEquals(validatePassword("StrongP@ss123"), true);
});

Deno.test("validatePassword - 不符合強度要求", () => {
  assertEquals(validatePassword("weak"), false);
  assertEquals(validatePassword("NoSpecialChar123"), false);
  assertEquals(validatePassword("NoDigits@abc"), false);
});
```

**整合測試**

測試多個組件如何一起工作，包括與外部系統的互動，如資料庫或 API。

```typescript
// 整合測試示例 (user_repository_test.ts)
import { assertEquals, assertExists } from "https://deno.land/std@0.210.0/assert/mod.ts";
import { initDb, closeDb } from "./db.ts";
import { UserRepository } from "./user_repository.ts";

// 使用 Deno.env 獲取測試資料庫連接字串
const TEST_DB_URL = Deno.env.get("TEST_DB_URL") || "postgres://test:test@localhost:5432/testdb";

Deno.test("UserRepository 整合測試", async (t) => {
  // 測試前設置
  const db = await initDb(TEST_DB_URL);
  const userRepo = new UserRepository(db);
  
  // 測試後清理
  t.beforeAll(async () => {
    await db.query("DELETE FROM users");
  });
  
  t.afterAll(async () => {
    await closeDb(db);
  });
  
  await t.step("創建並查詢用戶", async () => {
    // 創建測試用戶
    const userId = await userRepo.createUser({
      username: "testuser",
      email: "test@example.com",
      password: "hashedpassword"
    });
    
    assertExists(userId, "應返回創建的用戶 ID");
    
    // 查詢用戶
    const user = await userRepo.findById(userId);
    assertEquals(user?.username, "testuser");
    assertEquals(user?.email, "test@example.com");
  });
  
  await t.step("更新用戶資料", async () => {
    // 測試邏輯...
  });
});
```

**最佳實踐**

- **獨立的測試環境**：為整合測試設置專門的測試資料庫或服務
- **清理測試資料**：每次測試後恢復環境到初始狀態
- **區分測試命令**：使用不同的命令執行單元測試和整合測試

```json
// deno.json
{
  "tasks": {
    "test": "deno test --allow-read",
    "test:unit": "deno test --allow-read tests/unit/",
    "test:integration": "deno test --allow-net --allow-read --allow-env tests/integration/"
  }
}
```

## 模擬 (Mock) 外部依賴

模擬外部依賴是單元測試的關鍵技術，可以隔離被測代碼並控制測試環境。

**手動模擬**

為外部依賴創建替代實現，專門用於測試。

```typescript
// 原始服務 (email_service.ts)
export interface EmailService {
  sendEmail(to: string, subject: string, body: string): Promise<boolean>;
}

export class RealEmailService implements EmailService {
  async sendEmail(to: string, subject: string, body: string): Promise<boolean> {
    // 實際發送電子郵件的邏輯
    return true;
  }
}

// 測試中使用模擬 (user_controller_test.ts)
import { assertEquals } from "https://deno.land/std@0.210.0/assert/mod.ts";
import { UserController } from "./user_controller.ts";
import { EmailService } from "./email_service.ts";

// 模擬電子郵件服務
class MockEmailService implements EmailService {
  public sentEmails: Array<{to: string; subject: string; body: string}> = [];
  
  async sendEmail(to: string, subject: string, body: string): Promise<boolean> {
    this.sentEmails.push({ to, subject, body });
    return true;
  }
}

Deno.test("UserController - 密碼重置發送電子郵件", async () => {
  // 安排
  const mockEmailService = new MockEmailService();
  const userController = new UserController(mockEmailService);
  
  // 執行
  await userController.requestPasswordReset("user@example.com");
  
  // 斷言
  assertEquals(mockEmailService.sentEmails.length, 1);
  assertEquals(mockEmailService.sentEmails[0].to, "user@example.com");
  assertEquals(mockEmailService.sentEmails[0].subject, "密碼重置");
});
```

**使用 Spy 和 Stub**

Deno 標準庫提供了 `testing/mock.ts` 模組，可用於創建 spy 和 stub。

```typescript
// 使用 spy 和 stub (auth_service_test.ts)
import { assertEquals } from "https://deno.land/std@0.210.0/assert/mod.ts";
import { spy, assertSpyCalls, Spy } from "https://deno.land/std@0.210.0/testing/mock.ts";
import { AuthService } from "./auth_service.ts";
import { UserRepository } from "./user_repository.ts";

Deno.test("AuthService - 登入成功", async () => {
  // 創建 stub
  const userRepo = {
    findByUsername: () => Promise.resolve({
      id: "user123",
      username: "testuser",
      passwordHash: "$2a$10$...", // bcrypt hash for "password123"
    }),
  } as UserRepository;
  
  // 創建 spy
  const findByUsernameSpy: Spy = spy(userRepo, "findByUsername");
  
  const authService = new AuthService(userRepo);
  
  // 執行
  const result = await authService.login("testuser", "password123");
  
  // 斷言
  assertEquals(result.success, true);
  assertEquals(result.userId, "user123");
  assertSpyCalls(findByUsernameSpy, 1);
  
  // 清理
  findByUsernameSpy.restore();
});
```

**最佳實踐**

- **只模擬直接依賴**：避免過度模擬，專注於被測單元的直接依賴
- **保持模擬簡單**：模擬應該只實現測試所需的行為
- **驗證模擬互動**：確認被測代碼與依賴的互動方式符合預期

## 設定合理的測試覆蓋率目標

測試覆蓋率是衡量測試完整性的重要指標，但不應成為唯一目標。

**使用 Deno 覆蓋率工具**

Deno 提供了內建的覆蓋率工具，可以生成詳細的覆蓋率報告。

```bash
# 收集覆蓋率資料
deno test --coverage=coverage

# 生成覆蓋率報告
deno coverage coverage
```

**設定優先級**

不同的代碼區域可能需要不同程度的測試覆蓋：

- **核心業務邏輯**：接近 100% 的覆蓋率
- **錯誤處理路徑**：高覆蓋率，確保異常情況得到處理
- **基礎設施代碼**：適度覆蓋，專注於關鍵路徑
- **第三方整合**：使用整合測試覆蓋主要場景

```typescript
// 優先測試核心業務邏輯 (pricing_engine_test.ts)
import { assertEquals } from "https://deno.land/std@0.210.0/assert/mod.ts";
import { calculatePrice } from "./pricing_engine.ts";

Deno.test("calculatePrice - 基本價格計算", () => {
  assertEquals(calculatePrice(100, 0), 100);
  assertEquals(calculatePrice(100, 10), 90);
  assertEquals(calculatePrice(100, 100), 0);
});

Deno.test("calculatePrice - 處理無效輸入", () => {
  assertEquals(calculatePrice(-100, 10), 0);
  assertEquals(calculatePrice(100, -10), 100);
  assertEquals(calculatePrice(100, 110), 0);
});

Deno.test("calculatePrice - 處理小數", () => {
  assertEquals(calculatePrice(100, 33.33), 66.67);
  assertEquals(calculatePrice(99.99, 10), 89.991);
});
```

**最佳實踐**

- **設定合理目標**：根據專案性質設定適當的覆蓋率目標，如 80%
- **關注質量而非數量**：高覆蓋率不等於高質量，確保測試有意義
- **持續監控覆蓋率**：在 CI 流程中追蹤覆蓋率變化，防止退化

## 建立測試輔助函數提高效率

重複的測試設置和斷言可以抽取為輔助函數，提高測試效率和可讀性。

**測試工廠函數**

創建測試數據的工廠函數，簡化測試設置。

```typescript
// 測試工廠 (test_factories.ts)
export interface User {
  id: string;
  username: string;
  email: string;
  isActive: boolean;
  createdAt: Date;
}

export function createTestUser(overrides: Partial<User> = {}): User {
  return {
    id: "user123",
    username: "testuser",
    email: "test@example.com",
    isActive: true,
    createdAt: new Date("2023-01-01"),
    ...overrides
  };
}

export interface Product {
  id: string;
  name: string;
  price: number;
  // 其他屬性...
}

export function createTestProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: "prod123",
    name: "Test Product",
    price: 99.99,
    ...overrides
  };
}

// 在測試中使用
import { assertEquals } from "https://deno.land/std@0.210.0/assert/mod.ts";
import { createTestUser, createTestProduct } from "./test_factories.ts";
import { calculateOrderTotal } from "./order_service.ts";

Deno.test("calculateOrderTotal - 基本計算", () => {
  const user = createTestUser({ isActive: true });
  const product1 = createTestProduct({ price: 100 });
  const product2 = createTestProduct({ price: 50 });
  
  const total = calculateOrderTotal(user, [product1, product2]);
  
  assertEquals(total, 150);
});
```

**自定義斷言**

創建特定領域的斷言函數，使測試更具表達力。

```typescript
// 自定義斷言 (custom_asserts.ts)
import { assert } from "https://deno.land/std@0.210.0/assert/mod.ts";

export interface ApiResponse<T> {
  status: number;
  data?: T;
  error?: string;
}

export function assertSuccessResponse<T>(
  response: ApiResponse<T>,
  expectedStatus = 200
): T {
  assert(
    response.status === expectedStatus,
    `Expected status ${expectedStatus}, got ${response.status}`
  );
  assert(response.data !== undefined, "Expected data in success response");
  assert(response.error === undefined, `Unexpected error: ${response.error}`);
  return response.data as T;
}

export function assertErrorResponse(
  response: ApiResponse<unknown>,
  expectedStatus = 400
): string {
  assert(
    response.status === expectedStatus,
    `Expected status ${expectedStatus}, got ${response.status}`
  );
  assert(response.error !== undefined, "Expected error in error response");
  return response.error as string;
}

// 在測試中使用
import { assertSuccessResponse, assertErrorResponse } from "./custom_asserts.ts";
import { fetchUserData } from "./api_client.ts";

Deno.test("fetchUserData - 返回用戶資料", async () => {
  const response = await fetchUserData("user123");
  
  const userData = assertSuccessResponse(response);
  assertEquals(userData.id, "user123");
  assertEquals(userData.username, "johndoe");
});

Deno.test("fetchUserData - 處理不存在的用戶", async () => {
  const response = await fetchUserData("nonexistent");
  
  const errorMessage = assertErrorResponse(response, 404);
  assertEquals(errorMessage, "User not found");
});
```

**最佳實踐**

- **保持輔助函數簡單**：專注於減少重複代碼，避免過度抽象
- **放在專用目錄**：將測試輔助工具放在 `tests/helpers` 或類似目錄中
- **考慮測試可讀性**：輔助函數應提高而非降低測試的可讀性

## 在 CI 流程中自動化測試執行

將測試整合到持續整合 (CI) 流程中，確保每次代碼變更都經過測試驗證。

**使用 GitHub Actions**

為 Deno 專案設置 GitHub Actions 工作流。

```yaml
# .github/workflows/test.yml
name: Test

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Deno
        uses: denoland/setup-deno@v1
        with:
          deno-version: v1.x

      - name: Verify formatting
        run: deno fmt --check

      - name: Run linter
        run: deno lint

      - name: Run unit tests
        run: deno test --allow-read tests/unit/

      - name: Run integration tests
        run: deno test --allow-net --allow-read --allow-env tests/integration/
        env:
          TEST_DB_URL: ${{ secrets.TEST_DB_URL }}

      - name: Generate coverage report
        run: |
          deno test --coverage=coverage --allow-all
          deno coverage coverage --lcov > coverage.lcov

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage.lcov
          fail_ci_if_error: true
```

**測試矩陣**

對多個 Deno 版本或作業系統進行測試。

```yaml
jobs:
  test:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        deno-version: [1.32.x, 1.33.x, 1.34.x]

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Deno ${{ matrix.deno-version }}
        uses: denoland/setup-deno@v1
        with:
          deno-version: ${{ matrix.deno-version }}

      # 其他步驟...
```

**最佳實踐**

- **快速反饋**：優化測試執行速度，提供快速反饋
- **測試緩存**：利用 CI 系統的緩存功能加速測試
- **並行執行**：將測試分組並行執行以縮短總時間
- **可靠的測試環境**：使用容器或臨時服務確保測試環境一致性

```yaml
# 使用容器服務進行整合測試
services:
  postgres:
    image: postgres:14
    env:
      POSTGRES_USER: test
      POSTGRES_PASSWORD: test
      POSTGRES_DB: testdb
    ports:
      - 5432:5432
    options: >-
      --health-cmd pg_isready
      --health-interval 10s
      --health-timeout 5s
      --health-retries 5
```

## 測試驅動開發 (TDD)

測試驅動開發是一種開發方法，先編寫測試再實現功能，有助於提高代碼質量和測試覆蓋率。

**TDD 流程**

1. **紅燈**：編寫一個失敗的測試
2. **綠燈**：實現最簡單的代碼使測試通過
3. **重構**：優化代碼，保持測試通過

```typescript
// 步驟 1: 編寫測試 (string_utils_test.ts)
import { assertEquals } from "https://deno.land/std@0.210.0/assert/mod.ts";
import { truncate } from "./string_utils.ts";

Deno.test("truncate - 短於最大長度的字串保持不變", () => {
  assertEquals(truncate("Hello", 10), "Hello");
});

Deno.test("truncate - 長於最大長度的字串被截斷並添加省略號", () => {
  assertEquals(truncate("Hello World", 8), "Hello...");
});

Deno.test("truncate - 自定義省略號", () => {
  assertEquals(truncate("Hello World", 8, "---"), "Hello---");
});

// 步驟 2: 實現功能 (string_utils.ts)
export function truncate(str: string, maxLength: number, ellipsis = "..."): string {
  if (str.length <= maxLength) {
    return str;
  }
  
  const truncateLength = maxLength - ellipsis.length;
  if (truncateLength <= 0) {
    return ellipsis.substring(0, maxLength);
  }
  
  return str.substring(0, truncateLength) + ellipsis;
}

// 步驟 3: 重構和添加更多測試
Deno.test("truncate - 處理邊界情況", () => {
  assertEquals(truncate("Hello", 5), "Hello");
  assertEquals(truncate("Hello", 3), "...");
  assertEquals(truncate("Hello", 0), "");
});
```

**最佳實踐**

- **小步前進**：編寫小而具體的測試，逐步構建功能
- **專注於行為**：測試應關注代碼的行為而非實現細節
- **平衡速度與品質**：TDD 可能初期較慢，但長期提高代碼品質

---

一個全面的測試策略是構建可靠 Deno 應用程式的基石。通過結合 Deno 內建測試框架、區分測試類型、模擬外部依賴、設定合理覆蓋率目標、創建測試輔助工具、自動化測試執行以及採用 TDD 方法，您可以建立一個強大的測試體系，確保應用程式的穩定性和可靠性。

記住，好的測試不僅是捕捉錯誤的工具，也是設計和文檔的工具，能夠幫助開發者更好地理解和維護代碼。投資於測試策略將在整個專案生命週期中帶來持續的回報。

