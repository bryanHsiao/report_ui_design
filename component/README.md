# Report Tabs Component — 層疊卡片式頁籤

純 UI 外皮元件，提供頁籤切換 + 層疊卡片動畫 + loading 過渡效果。
**不包含 jqGrid**，請自行在 callback 中初始化 grid。

---

## 檔案

```
component/
  css/report-tabs.css   — 樣式（CSS Variables 以 --rt- 前綴避免衝突）
  js/report-tabs.js     — 頁籤切換邏輯（依賴 jQuery）
  index.html            — 預覽頁（用 HTML table 模擬 grid）
```

## 快速開始

### 1. 引入檔案

```html
<link rel="stylesheet" href="css/report-tabs.css">
<script src="js/report-tabs.js"></script>
```

### 2. HTML 結構

```html
<div class="report-container">
  <header class="report-header">
    <h1>外部法規查詢結果</h1>
  </header>
  <nav id="tab-bar" class="report-tab-bar"></nav>
  <main class="report-cards-area">
    <div id="cards-stack" class="report-cards-stack"></div>
  </main>
</div>
```

### 3. 初始化

```javascript
ReportTabs.init({
  tabBarEl: "#tab-bar",
  stackEl: "#cards-stack",
  tabs: ["法規資料", "函釋資料", "裁罰案件"],

  // 頁籤首次被點擊時觸發（用來撈資料 + 初始化 jqGrid）
  onTabSwitch: function (tabName, $card, gridId, pagerId) {
    $.ajax({
      url: "/api/query",
      data: { type: tabName },
      success: function (data) {
        // 初始化你的 jqGrid
        $("#" + gridId).jqGrid({
          datatype: "local",
          data: data,
          colModel: [...],
          // ...你的 grid 設定
        });

        // 標記載入完成（隱藏 loading，顯示內容）
        ReportTabs.markLoaded(tabName);
      }
    });
  },

  // 視窗大小改變時觸發（用來重算 grid 寬高）
  onResize: function ($card, gridId) {
    var w = ReportTabs.getCardContentWidth($card);
    $("#" + gridId).jqGrid("setGridWidth", w, true);
  }
});
```

## API

| 方法 | 說明 |
|------|------|
| `ReportTabs.init(config)` | 初始化元件 |
| `ReportTabs.markLoaded(tabName)` | 標記頁籤載入完成（隱藏 loading） |
| `ReportTabs.getCardContentWidth($card)` | 取得卡片可用寬度（px） |
| `ReportTabs.isLoaded(tabName)` | 判斷頁籤是否已載入 |
| `ReportTabs.getActiveTab()` | 取得目前 active 頁籤名稱 |

## Config 參數

| 參數 | 必填 | 說明 |
|------|------|------|
| `tabBarEl` | Y | 頁籤容器選擇器 |
| `stackEl` | Y | 卡片堆疊容器選擇器 |
| `tabs` | N | 頁籤名稱陣列（省略則從 URL `?type=` 解析） |
| `onTabSwitch` | Y | 頁籤首次點擊 callback |
| `onResize` | N | 視窗 resize callback |
| `onTabLoaded` | N | 載入完成後 callback |

## CSS Class 對照

| Class | 用途 |
|-------|------|
| `.report-container` | 最外層容器 |
| `.report-header` | 標題區 |
| `.report-tab-bar` | 頁籤列 |
| `.report-tab-btn` | 單一頁籤按鈕 |
| `.report-cards-area` | 卡片區域 |
| `.report-cards-stack` | 卡片堆疊容器 |
| `.report-card` | 單一卡片 |
| `.report-card-body` | 卡片內容區（放 grid） |
| `.report-card-loading` | loading 狀態 |

## 注意事項

- CSS Variables 使用 `--rt-` 前綴，不會與系統樣式衝突
- 頁籤顏色透過 `data-type` 屬性對應，可自行擴充
- `report-container` 預設 `height: 100%`，需要父元素有明確高度
