/**
 * 食譜查詢網頁應用程式 - 共用 JavaScript 邏輯
 * 功能：首頁搜尋、結果頁過濾渲染、資料載入與備援
 */

// ========================================
// 常數與狀態
// ========================================
const RECIPES_URL = 'data/recipes.json';
const FALLBACK_RECIPES = [
  {
    id: 1,
    title: "紅燒牛肉麵",
    image: "https://picsum.photos/seed/recipe1/400/300",
    description: "濃郁牛肉湯頭搭配Q彈麵條，佐以青菜與香菜，是經典台式美食代表",
    cookTime: "60 分鐘",
    ingredients: ["牛腱", "牛肉麵條", "青菜", "香菜", "蔥", "薑", "八角", "桂皮", "醬油", "冰糖"]
  },
  {
    id: 2,
    title: "宮保雞丁",
    image: "https://picsum.photos/seed/recipe2/400/300",
    description: "酸甜微辣的經典川菜，雞肉鮮嫩搭配花生酥脆口感，下飯神菜",
    cookTime: "25 分鐘",
    ingredients: ["雞腿肉", "花生", "乾辣椒", "花椒", "青蔥", "醬油", "醋", "糖", "玉米澱粉"]
  },
  {
    id: 3,
    title: "梅干扣肉",
    image: "https://picsum.photos/seed/recipe3/400/300",
    description: "肥而不膩的客家經典菜色，梅干菜吸飽豬肉油香，軟糯入味",
    cookTime: "90 分鐘",
    ingredients: ["五花肉", "梅干菜", "薑", "蔥", "八角", "醬油", "米酒", "冰糖"]
  },
  {
    id: 4,
    title: "清蒸鮮魚",
    image: "https://picsum.photos/seed/recipe4/400/300",
    description: "保留魚肉原味的廣式清蒸做法，肉質鮮嫩滑順，蒸魚豉油提鮮",
    cookTime: "20 分鐘",
    ingredients: ["白鯧魚/鱸魚", "薑絲", "蔥絲", "蒸魚豉油", "熱油", "香菜"]
  },
  {
    id: 5,
    title: "椒鹽酥炸蝦",
    image: "https://picsum.photos/seed/recipe5/400/300",
    description: "殼酥肉嫩的椒鹽蝦，殼可連吃，椒鹽香氣濃郁，啤酒最佳拍檔",
    cookTime: "15 分鐘",
    ingredients: ["草蝦", "椒鹽粉", "蛋液", "澱粉", "蒜末", "九層塔", "辣椒"]
  },
  {
    id: 6,
    title: "麻婆豆腐",
    image: "https://picsum.photos/seed/recipe6/400/300",
    description: "麻辣鮮香的川式經典素食，嫩豆腐吸飽醬汁，米飯終結者",
    cookTime: "15 分鐘",
    ingredients: ["嫩豆腐", "豆瓣醬", "花椒粉", "蒜", "薑", "蔥花", "水澱粉", "香油"]
  },
  {
    id: 7,
    title: "日式咖哩飯",
    image: "https://picsum.photos/seed/recipe7/400/300",
    description: "濃郁咖哩醬汁包裹軟糯馬鈴薯、胡蘿蔔與雞肉，大人小孩都愛",
    cookTime: "40 分鐘",
    ingredients: ["雞腿肉", "馬鈴薯", "胡蘿蔔", "洋蔥", "日式咖哩塊", "白飯"]
  },
  {
    id: 8,
    title: "番茄牛肉湯麵",
    image: "https://picsum.photos/seed/recipe8/400/300",
    description: "酸甜番茄湯頭燉煮牛肉，湯汁濃郁鮮美，搭配手工麵條暖心暖胃",
    cookTime: "50 分鐘",
    ingredients: ["牛腩", "番茄", "麵條", "洋蔥", "蒜", "高湯", "羅勒葉", "黑胡椒"]
  },
  {
    id: 9,
    title: "糖醋排骨",
    image: "https://picsum.photos/seed/recipe9/400/300",
    description: "酸甜適度的江浙名菜，排骨炸至酥脆再裹醬，骨肉分離不乾柴",
    cookTime: "45 分鐘",
    ingredients: ["豬排骨", "糖", "醋", "醬油", "薑", "蔥", "料酒", "玉米澱粉"]
  },
  {
    id: 10,
    title: "綠豆沙湯",
    image: "https://picsum.photos/seed/recipe10/400/300",
    description: "消暑解熱的傳統甜點，綠豆煮至開花沙糯，冰鎮後口感最佳",
    cookTime: "40 分鐘",
    ingredients: ["綠豆", "冰糖", "水", "薄荷葉(裝飾)"]
  }
];

let recipesCache = null;

// ========================================
// 工具函式
// ========================================

/**
 * 從 URL 取得 keyword 參數
 * @returns {string} 解碼後的關鍵字，若無則回傳空字串
 */
function getUrlKeyword() {
  const params = new URLSearchParams(window.location.search);
  return params.get('keyword')?.trim() || '';
}

/**
 * 將關鍵字顯示在結果頁標題
 * @param {string} keyword
 */
function showKeyword(keyword) {
  const el = document.getElementById('keywordDisplay');
  if (el) {
    el.textContent = keyword || '（無關鍵字）';
  }
}

/**
 * 全欄位模糊比對過濾食譜
 * @param {string} keyword - 搜尋關鍵字
 * @param {Array} list - 食譜陣列
 * @returns {Array} 符合條件的食譜陣列
 */
function filterRecipes(keyword, list) {
  if (!keyword) return [];
  const kw = keyword.toLowerCase().trim();
  return list.filter(recipe => {
    const titleMatch = recipe.title.toLowerCase().includes(kw);
    const descMatch = recipe.description.toLowerCase().includes(kw);
    const ingredientMatch = recipe.ingredients.some(ing =>
      ing.toLowerCase().includes(kw)
    );
    return titleMatch || descMatch || ingredientMatch;
  });
}

/**
 * 渲染食譜卡片到容器
 * @param {Array} recipes - 食譜陣列
 * @param {HTMLElement} container - 目標容器
 */
function renderCards(recipes, container) {
  if (!container) return;
  container.innerHTML = recipes.map(recipe => `
    <article class="recipe-card" data-id="${recipe.id}">
      <img
        class="recipe-card__image"
        src="${recipe.image}"
        alt="${recipe.title}"
        loading="lazy"
        width="400"
        height="300"
      >
      <div class="recipe-card__content">
        <h2 class="recipe-card__title">${escapeHtml(recipe.title)}</h2>
        <p class="recipe-card__description">${escapeHtml(recipe.description)}</p>
        <div class="recipe-card__meta">
          <span class="recipe-card__time">${escapeHtml(recipe.cookTime)}</span>
        </div>
      </div>
    </article>
  `).join('');
}

/**
 * 切換「查無結果」訊息顯示
 * @param {boolean} show - 是否顯示
 */
function showNoResult(show) {
  const el = document.getElementById('noResult');
  if (el) {
    el.classList.toggle('hidden', !show);
  }
}

/**
 * HTML 轉義防止 XSS
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/'/g, '&#039;');
}

// ========================================
// 資料載入
// ========================================

/**
 * 載入食譜資料（優先 fetch JSON，失敗則用備援資料）
 * @returns {Promise<Array>} 食譜陣列
 */
async function loadRecipes() {
  if (recipesCache) return recipesCache;

  try {
    const response = await fetch(RECIPES_URL);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    recipesCache = await response.json();
    console.log('[Recipe] 成功從 JSON 載入資料', recipesCache.length, '筆');
  } catch (error) {
    console.warn('[Recipe] JSON 載入失敗，使用備援資料:', error.message);
    recipesCache = FALLBACK_RECIPES;
  }
  return recipesCache;
}

// ========================================
// 首頁初始化 (index.html)
// ========================================

/**
 * 綁定搜尋頁事件
 */
function initSearchPage() {
  const input = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  const clearBtn = document.getElementById('clearBtn');

  // 不在搜尋頁則跳過
  if (!input || !searchBtn || !clearBtn) return;

  // 查詢按鈕：跳轉至結果頁
  searchBtn.addEventListener('click', () => {
    const keyword = input.value.trim();
    if (keyword) {
      const url = `recipe.html?keyword=${encodeURIComponent(keyword)}`;
      window.location.href = url;
    } else {
      input.focus();
    }
  });

  // 取消按鈕：清空輸入框並聚焦
  clearBtn.addEventListener('click', () => {
    input.value = '';
    input.focus();
  });

  // Enter 鍵觸發查詢
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      searchBtn.click();
    }
  });

  // 頁面載入時自動聚焦
  input.focus();
}

// ========================================
// 結果頁初始化 (recipe.html)
// ========================================

/**
 * 初始化結果頁：解析參數、載入資料、過濾、渲染
 */
async function initResultPage() {
  const container = document.getElementById('cardContainer');
  const noResultEl = document.getElementById('noResult');

  // 不在結果頁則跳過
  if (!container || !noResultEl) return;

  const keyword = getUrlKeyword();
  showKeyword(keyword);

  // 載入資料
  const recipes = await loadRecipes();

  // 過濾
  const filtered = filterRecipes(keyword, recipes);

  // 渲染結果
  if (filtered.length > 0) {
    renderCards(filtered, container);
    showNoResult(false);
  } else {
    container.innerHTML = '';
    showNoResult(true);
  }
}

// ========================================
// 統一啟動
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  initSearchPage();
  initResultPage();
});

// ========================================
// 暴露給全域（方便除錯）
// ========================================
window.RecipeApp = {
  loadRecipes,
  filterRecipes,
  getUrlKeyword,
  recipesCache: () => recipesCache
};