/**
 * 食譜查詢網頁應用程式 - 共用 JavaScript 邏輯
 * 功能：首頁搜尋、結果頁過濾渲染、資料載入與備援
 */

// ========================================
// 常數與狀態
// ========================================
const RECIPES_URL = 'data/my_recipes.json';
const FALLBACK_RECIPES = [
  {
    id: 2,
    title: "香料茄子馬鈴薯（純素）",
    ingredients: [
      "茄子",
      "中型馬鈴薯",
      "適量香料、油、鹽和醬油"
    ],
    cookTime: "40分鐘",
    servings: "5人份",
    recipe_link: "https://cookpad.com/tw/%E9%A3%9F%E8%AD%9C/23950614",
    image: "https://img-global.cpcdn.com/recipes/97300b86783f9267/120x160f0.469949_0.5_1.0q50/%E9%A6%99%E6%96%99%E8%8C%84%E5%AD%90%E9%A6%AC%E9%88%B4%E8%96%AF%E7%B4%94%E7%B4%A0-%E9%A3%9F%E8%AD%9C%E6%88%90%E5%93%81%E7%85%A7%E7%89%87.jpg"
  },
  {
    id: 3,
    title: "九層塔茄子炒豆包和豆腐（純素）",
    ingredients: [
      "豆包",
      "豆腐",
      "茄子",
      "青龍",
      "九層塔適量",
      "適量油、鹽、醬油"
    ],
    cookTime: "30分鐘",
    servings: "5人份",
    recipe_link: "https://cookpad.com/tw/%E9%A3%9F%E8%AD%9C/22660023",
    image: "https://img-global.cpcdn.com/recipes/2482ba1b52d64ef5/120x160f0.512295_0.5_1.0q50/%E4%B9%9D%E5%B1%A4%E5%A1%94%E8%8C%84%E5%AD%90%E7%82%92%E8%B1%86%E5%8C%85%E5%92%8C%E8%B1%86%E8%85%90%E7%B4%94%E7%B4%A0-%E9%A3%9F%E8%AD%9C%E6%88%90%E5%93%81%E7%85%A7%E7%89%87.jpg"
  },
  {
    id: 4,
    title: "香料番茄茄子炒豆腸（純素）",
    ingredients: [
      "豆腸",
      "蕃茄",
      "茄子",
      "少許羅勒葉、九層塔",
      "少許油、鹽、醬油"
    ],
    cookTime: "20分鐘",
    servings: "5人份",
    recipe_link: "https://cookpad.com/tw/%E9%A3%9F%E8%AD%9C/22613976",
    image: "https://img-global.cpcdn.com/recipes/361310e69f572db6/120x160f0.5_0.5_1.0q50/%E9%A6%99%E6%96%99%E7%95%AA%E8%8C%84%E8%8C%84%E5%AD%90%E7%82%92%E8%B1%86%E8%85%B8%E7%B4%94%E7%B4%A0-%E9%A3%9F%E8%AD%9C%E6%88%90%E5%93%81%E7%85%A7%E7%89%87.jpg"
  },
  {
    id: 5,
    title: "手撕茄子（五辛素）",
    ingredients: [],
    cookTime: "30 分鐘",
    servings: "3 人份",
    recipe_link: "https://cookpad.com/tw/%E9%A3%9F%E8%AD%9C/22601147",
    image: "https://img-global.cpcdn.com/recipes/7b0c79b54d0a2a71/120x160cq50/%E6%89%8B%E6%92%95%E8%8C%84%E5%AD%90%E4%BA%94%E8%BE%9B%E7%B4%A0-%E9%A3%9F%E8%AD%9C%E6%88%90%E5%93%81%E7%85%A7%E7%89%87.jpg"
  },
  {
    id: 6,
    title: "蕃茄茄子炒豆腸（純素）",
    ingredients: [
      "中型蕃茄",
      "茄子",
      "豆腸",
      "少許羅勒葉粉、鹽、油、醬油"
    ],
    cookTime: "30分鐘",
    servings: "5人份",
    recipe_link: "https://cookpad.com/tw/%E9%A3%9F%E8%AD%9C/22557636",
    image: "https://img-global.cpcdn.com/recipes/b05a09ea9b30e277/120x160f0.523189_0.5_1.0q50/%E8%95%83%E8%8C%84%E8%8C%84%E5%AD%90%E7%82%92%E8%B1%86%E8%85%B8%E7%B4%94%E7%B4%A0-%E9%A3%9F%E8%AD%9C%E6%88%90%E5%93%81%E7%85%A7%E7%89%87.jpg"
  },
  {
    id: 7,
    title: "茄子豆腐素咖哩",
    ingredients: [
      "好侍素食咖哩",
      "茄子",
      "豆腐",
      "洋蔥"
    ],
    cookTime: "20分鐘",
    servings: "4人份",
    recipe_link: "https://cookpad.com/tw/%E9%A3%9F%E8%AD%9C/17391340",
    image: "https://img-global.cpcdn.com/recipes/0ca28bc40a00987f/120x160cq50/%E8%8C%84%E5%AD%90%E8%B1%86%E8%85%90%E7%B4%A0%E5%92%96%E5%93%A9-%E9%A3%9F%E8%AD%9C%E6%88%90%E5%93%81%E7%85%A7%E7%89%87.jpg"
  },
  {
    id: 8,
    title: "胡麻茄絲（素食料理）（簡單料理）",
    ingredients: [
      "茄子",
      "白芝麻",
      "芝麻醬",
      "黑醋",
      "香油",
      "二砂",
      "熱水"
    ],
    cookTime: "10分鐘",
    servings: "未提供",
    recipe_link: "https://cookpad.com/tw/%E9%A3%9F%E8%AD%9C/24292907",
    image: "https://img-global.cpcdn.com/recipes/422699f12e6933f1/120x160cq50/%E8%83%A1%E9%BA%BB%E8%8C%84%E7%B5%B2%E7%B4%A0%E9%A3%9F%E6%96%99%E7%90%86%E7%B0%A1%E5%96%AE%E6%96%99%E7%90%86-%E9%A3%9F%E8%AD%9C%E6%88%90%E5%93%81%E7%85%A7%E7%89%87.jpg"
  },
  {
    id: 9,
    title: "蕃茄茄子芹菜炒蛋（蛋素）",
    ingredients: [
      "中牛番茄",
      "茄子",
      "蛋",
      "少許芹菜",
      "少許油、鹽、紅冰糖"
    ],
    cookTime: "30分鐘",
    servings: "2人份",
    recipe_link: "https://cookpad.com/tw/%E9%A3%9F%E8%AD%9C/17276119",
    image: "https://img-global.cpcdn.com/recipes/c26dac643aa01e26/120x160f0.507536_0.5_1.0q50/%E8%95%83%E8%8C%84%E8%8C%84%E5%AD%90%E8%8A%B9%E8%8F%9C%E7%82%92%E8%9B%8B%E8%9B%8B%E7%B4%A0-%E9%A3%9F%E8%AD%9C%E6%88%90%E5%93%81%E7%85%A7%E7%89%87.jpg"
  },
  {
    id: 10,
    title: "吃素真幸福🥰 美味可口純素咖哩飯🍛",
    ingredients: [
      "綠花椰菜",
      "茄子",
      "紅蘿蔔",
      "豆包",
      "豆腸",
      "白飯",
      "馬鈴薯",
      "油",
      "鹽",
      "水",
      "1/3鍋",
      "咖哩"
    ],
    cookTime: "60 分鐘",
    servings: "2人份",
    recipe_link: "https://cookpad.com/tw/%E9%A3%9F%E8%AD%9C/24032306",
    image: "https://img-global.cpcdn.com/recipes/f138cba5a1c30e09/120x160cq50/%E5%90%83%E7%B4%A0%E7%9C%9F%E5%B9%B8%E7%A6%8F%F0%9F%A5%B0-%E7%BE%8E%E5%91%B3%E5%8F%AF%E5%8F%A3%E7%B4%94%E7%B4%A0%E5%92%96%E5%93%A9%E9%A3%AF%F0%9F%8D%9B-%E9%A3%9F%E8%AD%9C%E6%88%90%E5%93%81%E7%85%A7%E7%89%87.jpg"
  },
  {
    id: 11,
    title: "芝麻炸茄（素食料理）（簡單料理）",
    ingredients: [
      "茄子(小)",
      "黑芝麻",
      "鹽",
      "酥炸粉",
      "水",
      "調理油"
    ],
    cookTime: "10分鐘",
    servings: "未提供",
    recipe_link: "https://cookpad.com/tw/%E9%A3%9F%E8%AD%9C/23954013",
    image: "https://img-global.cpcdn.com/recipes/bece42a67bebc081/120x160cq50/%E8%8A%9D%E9%BA%BB%E7%82%B8%E8%8C%84%E7%B4%A0%E9%A3%9F%E6%96%99%E7%90%86%E7%B0%A1%E5%96%AE%E6%96%99%E7%90%86-%E9%A3%9F%E8%AD%9C%E6%88%90%E5%93%81%E7%85%A7%E7%89%87.jpg"
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
    // const descMatch = recipe.description.toLowerCase().includes(kw);
    const ingredientMatch = recipe.ingredients.some(ing =>
      ing.toLowerCase().includes(kw)
    );
    // return titleMatch || descMatch || ingredientMatch;
    return titleMatch || ingredientMatch;
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
        <!-- <p class="recipe-card__description">${escapeHtml(recipe.ingredients)}</p> -->
        <div class="recipe-card__meta">
          <span class="recipe-card__time">${escapeHtml(recipe.cookTime)}</span>
          <a href="${escapeHtml(recipe.recipe_link)}" class="btn">了解更多</a>
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