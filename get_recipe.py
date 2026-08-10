# 爬取動態載入頁面的套件
from selenium import webdriver
from selenium.webdriver import ActionChains
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from selenium.common.exceptions import TimeoutException,ElementNotInteractableException, NoSuchElementException

import pandas as pd
from time import sleep

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
                "title": title,
                "cooking_time": cooking_time,
                "servings": servings,
                "recipe_link": recipe_link,
                "img_url": img_url
            }

            recipe_list.append(recipe_dict)
        except Exception as e:
            print(e)

        # print(f"{i+1}, {title}, 製作時間:{cooking_time}, 份量:{servings}, 食譜連結:{recipe_link}, 圖片連結:{img_url}")
    return recipe_list

if __name__ == '__main__':
    action, driver = init_spider('素食 茄子')
    sleep(1)

    recipe_list_whole = load_dynamic_content(action, driver)
    # print(len(recipe_list_whole))
    
    clean_recipe_list = clear_data(recipe_list_whole)
    print(len(clean_recipe_list))

    driver.quit()
    print("驅動程式已關閉")