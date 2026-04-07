/**
 * Report Tabs Component — 層疊卡片式頁籤切換
 *
 * 使用方式：
 *   ReportTabs.init({
 *     tabBarEl: "#tab-bar",
 *     stackEl: "#cards-stack",
 *     tabs: ["法規資料", "函釋資料", "裁罰案件"],  // 或從 URL 自動解析
 *     onTabSwitch: function(tabName, $card, gridId, pagerId) {
 *       // 在此初始化你的 jqGrid 或其他內容
 *     },
 *     onResize: function($card, gridId) {
 *       // 在此處理 resize（例如 setGridWidth）
 *     },
 *     onTabLoaded: function(tabName, $card) {
 *       // 資料載入完成後的 callback
 *     }
 *   });
 */
var ReportTabs = (function ($) {
  "use strict";

  var _config = {};
  var _activeTab = null;
  var _loadedTabs = {};
  var _tabs = [];

  // ===== 解析 URL 參數 =====
  function getTabsFromURL() {
    var params = new URLSearchParams(window.location.search);
    var typeParam = params.get("type");
    if (!typeParam) return null; // 回傳 null 表示未指定
    return typeParam.split(",").filter(function (t) {
      return t.trim() !== "";
    });
  }

  // ===== 動態產生頁籤 =====
  function renderTabs(tabs) {
    var $tabBar = $(_config.tabBarEl);
    $tabBar.empty();
    tabs.forEach(function (tabName) {
      $("<button>")
        .addClass("report-tab-btn")
        .attr("data-type", tabName)
        .text(tabName)
        .appendTo($tabBar);
    });
  }

  // ===== 建立空卡片殼 =====
  function createCards(tabs) {
    var $stack = $(_config.stackEl);
    $stack.empty();

    tabs.forEach(function (tabName, index) {
      var $card = $("<div>")
        .addClass("report-card")
        .attr("data-type", tabName)
        .attr("data-index", index);

      // Loading 狀態
      var $loading = $("<div>").addClass("report-card-loading")
        .append($("<div>").addClass("spinner"))
        .append($("<div>").addClass("loading-text").text("載入中..."));

      // 內容容器（初始隱藏）
      var $body = $("<div>").addClass("report-card-body").hide();
      var gridId = "grid-" + index;
      var pagerId = "pager-" + index;
      $body.append($("<div>").attr("id", gridId).addClass("report-grid-slot"));
      $body.append($("<div>").attr("id", pagerId).addClass("report-pager-slot"));

      $card.append($loading);
      $card.append($body);
      $stack.append($card);
    });
  }

  // ===== 更新卡片堆疊位置 =====
  function updateStack(activeIndex) {
    var order = [activeIndex];
    for (var i = 0; i < _tabs.length; i++) {
      if (i !== activeIndex) order.push(i);
    }

    $(".report-card").each(function () {
      var idx = parseInt($(this).attr("data-index"));
      var stackPos = order.indexOf(idx);
      $(this).removeClass("stack-0 stack-1 stack-2 stack-hidden");

      if (stackPos === 0) $(this).addClass("stack-0");
      else if (stackPos === 1) $(this).addClass("stack-1");
      else if (stackPos === 2) $(this).addClass("stack-2");
      else $(this).addClass("stack-hidden");
    });
  }

  // ===== 標記載入完成 =====
  function markLoaded(tabName) {
    var $card = $(".report-card[data-type='" + tabName + "']");
    $card.find(".report-card-loading").hide();
    $card.find(".report-card-body").show().addClass("fade-in");
    _loadedTabs[tabName] = true;

    if (typeof _config.onTabLoaded === "function") {
      _config.onTabLoaded(tabName, $card);
    }
  }

  // ===== 頁籤切換事件 =====
  function bindTabEvents() {
    $(_config.tabBarEl).on("click", ".report-tab-btn", function () {
      var $btn = $(this);
      var tabName = $btn.data("type");
      if (tabName === _activeTab) return;

      // 更新 active 狀態
      $(".report-tab-btn").removeClass("active");
      $btn.addClass("active");
      _activeTab = tabName;

      // 切換卡片位置
      var targetIndex = parseInt(
        $(".report-card[data-type='" + tabName + "']").attr("data-index")
      );
      updateStack(targetIndex);

      // 觸發 callback
      if (!_loadedTabs[tabName]) {
        var $card = $(".report-card[data-type='" + tabName + "']");
        var index = $card.attr("data-index");
        var gridId = "grid-" + index;
        var pagerId = "pager-" + index;

        if (typeof _config.onTabSwitch === "function") {
          _config.onTabSwitch(tabName, $card, gridId, pagerId);
        }
      } else {
        // 已載入過，觸發 resize 調整寬度
        var $card = $(".report-card.stack-0");
        var gridId = "grid-" + $card.attr("data-index");
        if (typeof _config.onResize === "function") {
          setTimeout(function () {
            _config.onResize($card, gridId);
          }, 50);
        }
      }
    });
  }

  // ===== 視窗大小調整 =====
  function bindResize() {
    var resizeTimer;
    $(window).on("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        if (typeof _config.onResize !== "function") return;
        $(".report-card").each(function () {
          var $card = $(this);
          var tabName = $card.attr("data-type");
          if (!_loadedTabs[tabName]) return;
          var gridId = "grid-" + $card.attr("data-index");
          _config.onResize($card, gridId);
        });
      }, 150);
    });
  }

  // ===== 公開 API =====
  return {
    /**
     * 初始化元件
     * @param {Object} config
     * @param {string} config.tabBarEl — 頁籤容器選擇器
     * @param {string} config.stackEl — 卡片堆疊容器選擇器
     * @param {string[]} [config.tabs] — 頁籤名稱陣列（省略則從 URL ?type= 解析）
     * @param {Function} config.onTabSwitch — 頁籤切換 callback(tabName, $card, gridId, pagerId)
     * @param {Function} [config.onResize] — 視窗大小改變 callback($card, gridId)
     * @param {Function} [config.onTabLoaded] — 資料載入完成 callback(tabName, $card)
     */
    init: function (config) {
      _config = config || {};
      _tabs = config.tabs || getTabsFromURL() || [];

      if (_tabs.length === 0) return;

      renderTabs(_tabs);
      createCards(_tabs);
      bindTabEvents();
      bindResize();

      // 自動點擊第一個頁籤
      $(".report-tab-btn").first().trigger("click");
    },

    /** 標記某個頁籤已載入完成（隱藏 loading，顯示內容） */
    markLoaded: markLoaded,

    /** 取得卡片可用內容寬度（扣除 border + padding） */
    getCardContentWidth: function ($card) {
      return $card[0].clientWidth - 28;
    },

    /** 判斷某個頁籤是否已載入 */
    isLoaded: function (tabName) {
      return !!_loadedTabs[tabName];
    },

    /** 取得目前 active 的頁籤名稱 */
    getActiveTab: function () {
      return _activeTab;
    }
  };
})(jQuery);
