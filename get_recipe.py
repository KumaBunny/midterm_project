# 爬取動態載入頁面的套件
from selenium import webdriver
from selenium.webdriver import ActionChains
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from selenium.common.exceptions import TimeoutException,ElementNotInteractableException, NoSuchElementException

# 解析 HTML / XML，將字串轉成可以操作的樹狀結構
from bs4 import BeautifulSoup as bs
import lxml

# 將 Unicode 特殊空白轉換成標準的半形空白的套件
import unicodedata

# 其他
# import pandas as pd
from time import sleep
import json

def init_spider(keyword):
    # 設定 Chrome 瀏覽器的選項
    options = webdriver.ChromeOptions()
    options.add_argument("--start-maximized") # Chrome 瀏覽器在啟動時最大化視窗
    options.add_argument("--incognito") # 無痕模式
    options.add_argument("--disable-popup-blocking") # 停用 Chrome 的彈窗阻擋功能。

    # 建立 Chrome 瀏覽器物件
    driver = webdriver.Chrome(options=options)
    driver.implicitly_wait(10) # 隱性等待
    driver.get('https://cookpad.com/tw/搜尋/'+keyword)

    # 初始化 ActionChains
    action = ActionChains(driver)

    return action, driver

def load_dynamic_content(action, driver):
    print("load dynamic content")
    # 初始化前一次抓取的食譜數量
    last_count = 0

    while True:
        # 取得目前頁面上的所有食譜元素
        recipe_list_whole = driver.find_elements(By.CSS_SELECTOR, 'li.ranked-list__item')
        current_count = len(recipe_list_whole)
        # print(current_count)

        # 判斷新資料是否有載入
        if current_count == last_count:
            print("數量未增加，故終止迴圈(已到達底部)")
            break

        # 找出目前清單的「最後一個元素」
        last_element = recipe_list_whole[-1]

        # 使用ActionChains 滾動到最後一個元素
        action.scroll_to_element(last_element).perform()
        
        # 等待載入
        sleep(2)
        
        # 更新狀態 : 將目前的數量記錄下來，供下一輪比對
        last_count = current_count

    return recipe_list_whole

def clear_data(recipe_list_whole):
    print("clear_data")
    # 建立一個空的容器，放置食譜資訊
    recipe_list = []

    # 遍歷所有食譜元素並提取詳細的食譜資訊
    for i, element in enumerate(recipe_list_whole):
        try:
            # 取得食譜標題
            title = element.find_element(By.CSS_SELECTOR, 'a.block-link__main').text

            # 取得食材及調味料
            try:
                ingredients_elem = element.find_element(By.CSS_SELECTOR, 'div.line-clamp-2.break-words')

                # 取得該 div 的 innerHTML 原始碼
                html_content = ingredients_elem.get_attribute('innerHTML')

                # 用 BeautifulSoup 解析
                soup = bs(html_content, 'lxml')

                # 找出所有 span.text-cookpad-gray5 並將其從樹狀結構中自毀/刪除 (.decompose)
                for unwanted in soup.select('span.text-cookpad-gray5'):
                    unwanted.decompose()

                # 取得文字並進行 Unicode 正規化 (NFKC)
                ingredients_text = soup.get_text()
                normalized_text = unicodedata.normalize('NFKC', ingredients_text)

                # 利用 split() 將字串切開，同時剔除空白、隱形控制字元
                ingredients_list = []
                for item in normalized_text.split():
                    # 清除字串前後的空白及跳脫字元
                    clean_item = item.strip()
                    
                    # 確保清理後的字串不是空的，且長度 > 0 才加入 List
                    if clean_item and clean_item.isprintable():
                        ingredients_list.append(clean_item)

            except NoSuchElementException:
                ingredients_list = []
            
            # 取得製作時間和份量
            cooking_time = "未提供"
            servings = "未提供"

            info_items = element.find_elements(By.CSS_SELECTOR, 'li.inline.mr-rg span.mise-icon-text')
            
            for item in info_items:
                item_text = item.text.strip()

                if '分鐘' in item_text or '小時' in item_text:
                    cooking_time = item_text
                elif '人' in item_text:
                    servings = item_text

            # 取得食譜連結
            url = element.find_element(By.CSS_SELECTOR, 'li.ranked-list__item a.block-link__main')
            recipe_link = url.get_attribute('href')

            # 取得食譜圖片
            img_element = element.find_element(By.CSS_SELECTOR, 'div.flex-none picture img.h-full')

            img_url = img_element.get_attribute('src')

            # 處理 Lazy Loading 情況：如果 src 是預載圖或空的，嘗試抓取 data-src
            if not img_url or 'data:image' in img_url:
                img_url = img_element.get_attribute('data-src')

            # print(f"[{i+1}] 食譜標題: {title}")
            # print(f"     圖片連結: {img_url}")
            # print("-" * 50)

            # 整合成一筆資料
            recipe_dict = {
                "id": i+1,
                "title": title,
                "ingredients": ingredients_list,
                "cookTime": cooking_time,
                "servings": servings,
                "recipe_link": recipe_link,
                "image": img_url
            }

            recipe_list.append(recipe_dict)
        except Exception as e:
            print(e)

        # print(f"{i+1}, {title}, 食材及調味料:{ingredients_list}, 製作時間:{cookTime}, 份量:{servings}, 食譜連結:{recipe_link}, 圖片連結:{image}")
    return recipe_list

def save_list_to_json(recipe_list):
    with open('project-interface/data/my_recipes.json', 'w', encoding='utf-8') as f:
        # ensure_ascii=False 確保中文能正常顯示（不會變成 \uXXXX）
        # indent=4 讓 JSON 檔案格式化縮排，方便人類閱讀
        json.dump(recipe_list, f, ensure_ascii=False, indent=4)

if __name__ == '__main__':
    action, driver = init_spider('素食 茄子')
    sleep(1)

    recipe_list_whole = load_dynamic_content(action, driver)
    # print(len(recipe_list_whole))
    
    clean_recipe_list = clear_data(recipe_list_whole)
    print(len(clean_recipe_list))

    save_list_to_json(clean_recipe_list)

    driver.quit()
    print("驅動程式已關閉")