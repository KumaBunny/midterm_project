# README

# 📌 專題名稱：食譜搜尋與動態爬蟲展示系統 (Recipe Search Web App)

## 📖 專題目錄

- [1. 專題簡介與目標](#1-專題簡介與目標)
- [2. 系統架構與專案結構](#2-系統架構與專案結構)
- [3. 後端爬蟲與資料處理 (Python)](#3-後端爬蟲與資料處理-python)
    - [3.1 自動化動態載入 (Selenium)](#31-自動化動態載入-selenium)
    - [3.2 資料解析與清洗 (BeautifulSoup & Unicodedata)](#32-資料解析與清洗-beautifulsoup--unicodedata)
    - [3.3 資料儲存 (JSON Export)](#33-資料儲存-json-export)
- [4. 前端介面與互動設計 (Web Interface)](#4-前端介面與互動設計-web-interface)
    - [4.1 頁面佈局與路由 (HTML/CSS)](#41-頁面佈局與路由-htmlcss)
    - [4.2 前端檢索與動態渲染 (JavaScript)](#42-前端檢索與動態渲染-javascript)
    - [4.3 備援機制 (Fallback Data)](#43-備援機制-fallback-data)
- [5. 系統亮點與技術特色](#5-系統亮點與技術特色)
- [6. 安裝與執行說明](#6-安裝與執行說明)
- [7. 未來擴充與改進計畫](#7-未來擴充與改進計畫)

## 1. 專題簡介與目標

- **專題背景**：隨著蔬食與素食文化的普及，使用者對素食食譜的檢索需求日益增加。
- **專題目標**：
    - 建構自動化網絡爬蟲，從網路平台（Cookpad）抓取動態載入的素食食譜資料[cite: 1]。
    - 進行嚴謹的資料清洗，過濾不必要的 HTML 標籤與特殊字元[cite: 1]。
    - 開發輕量且直覺的前端搜尋介面，提供關鍵字即時比對與結果卡片渲染功能[cite: 2, 3, 4]。

## 2. 系統架構與專案結構

### 📁 檔案樹狀結構

Plaintext

```
midterm_project/
│
├── get_recipe.py          # Python 爬蟲主程式（Selenium + BeautifulSoup）
│
└── project-interface/     # 前端網頁應用程式
    ├── index.html         # 首頁：搜尋輸入介面
    ├── recipe.html        # 結果頁：卡片式列表展示
    │
    ├── css/
    │   └── style.css      # 全站視覺樣式與卡片佈局
    │
    ├── js/
    │   └── script.js       # 前端互動邏輯、Fetch API 與過濾比對
    │
    └── data/
        ├── my_recipes.json # 爬蟲抓取並清洗後的正式食譜資料
        └── recipes.json    # 備用/初始食譜資料集
```

## 3. 後端爬蟲與資料處理 (Python)

### 3.1 自動化動態載入 (Selenium)

- **自動化操作**：使用 Chrome Headless/無痕模式開啟目標網頁[cite: 1]。
- **無窮滾動處理 (`load_dynamic_content`)**：透過 `ActionChains` 捲動至頁面最後一個元素，直到抓取的食譜數量停止增加為止，有效解決 Lazy Loading 與動態載入問題[cite: 1]。

### 3.2 資料解析與清洗 (BeautifulSoup & Unicodedata)

- **標籤清理與分解**：運用 BeautifulSoup 的 `.decompose()` 移除無用的 DOM 節點（如灰色說明標籤）[cite: 1]。
- **文字正規化**：透過 `unicodedata.normalize('NFKC', ...)` 清除特殊空白及非列印控制字元[cite: 1]。
- **特徵抽取**：精準提取食譜標題、食材清單、烹飪時間、份量、食譜連結與圖片 URL[cite: 1]。

### 3.3 資料儲存 (JSON Export)

- 格式化輸出為 JSON 檔，設置 `ensure_ascii=False` 與 `indent=4` 確保中文字元正常顯示並維持良好的閱讀性[cite: 1]。

## 4. 前端介面與互動設計 (Web Interface)

### 4.1 頁面佈局與路由 (HTML/CSS)

- **搜尋首頁 (`index.html`)**：簡潔的搜尋框設計，支援 Enter 鍵快速提交與一鍵清空功能[cite: 2, 4]。
- **結果展示頁 (`recipe.html`)**：響應式卡片網格（Card Grid），標示關鍵字與返回首頁按鈕[cite: 3]。

### 4.2 前端檢索與動態渲染 (JavaScript)

- **資料獲取 (`loadRecipes`)**：以非同步 `fetch()` 讀取 JSON 資料檔[cite: 4]。
- **多欄位模糊搜尋 (`filterRecipes`)**：同時針對「食譜標題」與「食材清單」進行不分大小寫的關鍵字比對[cite: 4]。
- **動態 DOM 渲染 (`renderCards`)**：建立語意化的 `<article>` 結構，包含 Lazy-loading 圖片、標題、烹飪時間及延伸連結[cite: 4]。

### 4.3 備援機制 (Fallback Data)

- 當 `fetch('data/my_recipes.json')` 失敗或於本地伺服器環境（如 CORS 限制）運行時，自動切換至內建的 `FALLBACK_RECIPES` 靜態陣列，確保系統的高可用性與使用者體驗不中斷[cite: 4]。

## 5. 系統亮點與技術特色

1. **動態爬蟲防護處理**：結合 Selenium 捲動與 BeautifulSoup 解析，順利抓取動態載入內容[cite: 1]。
2. **高容錯性防護 (Error Handling & Fallback)**：完整考量爬蟲例外（如缺漏欄位）與前端 Fetch 網路失敗備援[cite: 1, 4]。
3. **高傳輸安全與乾淨 DOM**：實作 HTML 轉義（`escapeHtml`）防範 XSS 攻擊[cite: 4]。
4. **無障礙設計 (Accessibility)**：HTML 導入 `aria-label`、`aria-live` 等 accessibility 屬性[cite: 2, 3]。

## 6. 安裝與執行說明

### 步驟 1：安裝 Python 依賴套件

Bash

```
pip install selenium beautifulsoup4 lxml
```

### 步驟 2：執行爬蟲獲取最新食譜

Bash

```
python get_recipe.py
```

> 執行完畢後，產生的資料將自動更新至 `project-interface/data/my_recipes.json`[cite: 1]。
> 

### 步驟 3：啟動前端介面

可使用 VS Code 的 `Live Server` 套件或 Python 本地 HTTP 伺服器開啟：

Bash

```
cd project-interface
python -m http.server 8000
```

開啟瀏覽器訪問 `http://localhost:8000` 即可使用搜尋系統。

## 7. 未來擴充與改進計畫

- [ ]  **多標籤篩選**：新增依據「烹飪時間」或「素食類別（純素/蛋素/五辛素）」的篩選器。
- [ ]  **分頁與無限滾動**：當搜尋結果過多時，提供前端分頁（Pagination）以優化渲染效能。
- [ ]  **我的最愛功能**：利用 `localStorage` 允許使用者收藏喜愛的食譜。
- [ ]  **自動化排程**：透過 GitHub Actions 或 Cron Job 設定自動定期執行 Python 爬蟲更新 JSON 資料。