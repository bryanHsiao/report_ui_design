$(function () {
  // ===== 解析 URL 參數 =====
  function getTabsFromURL() {
    var params = new URLSearchParams(window.location.search);
    var typeParam = params.get("type");
    if (!typeParam) {
      return ["法規資料", "函釋資料", "裁罰案件"];
    }
    return typeParam.split(",").filter(function (t) {
      return t.trim() !== "";
    });
  }

  // ===== 動態產生頁籤 =====
  function renderTabs(tabs) {
    var $tabBar = $("#tab-bar");
    $tabBar.empty();
    tabs.forEach(function (tabName) {
      $("<button>")
        .addClass("tab-btn")
        .attr("data-type", tabName)
        .text(tabName)
        .appendTo($tabBar);
    });
  }

  // ===== jqGrid 欄位定義 =====
  var colModel = [
    {
      name: "lawName",
      label: "法規名稱",
      width: 400,
      sortable: true
    },
    {
      name: "lastModified",
      label: "最後修正日期",
      width: 140,
      align: "center",
      sortable: true
    },
    {
      name: "authority",
      label: "主管機關",
      width: 220,
      align: "center",
      sortable: true
    },
    {
      name: "relatedRule",
      label: "相關聯內規",
      width: 120,
      align: "center",
      sortable: false,
      formatter: function (cellValue) {
        if (cellValue === "查詢") {
          return '<a href="javascript:void(0);" class="link-query" style="color:#1a73e8;text-decoration:none;">查詢</a>';
        }
        return "-";
      }
    }
  ];

  // ===== 狀態管理 =====
  var activeTab = null;
  var loadedTabs = {}; // 記錄已載入資料的頁籤

  // ===== 建立空卡片殼（不載入 Grid） =====
  function createCards(tabs) {
    var $stack = $("#cards-stack");
    $stack.empty();

    tabs.forEach(function (tabName, index) {
      var $card = $("<div>")
        .addClass("card-panel")
        .attr("data-type", tabName)
        .attr("data-index", index);

      // 初始顯示 loading 狀態
      var $loading = $("<div>").addClass("card-loading")
        .append($("<div>").addClass("spinner"))
        .append($("<div>").addClass("loading-text").text("載入中..."));

      // Grid 容器（初始隱藏）
      var $body = $("<div>").addClass("card-body").hide();
      var gridId = "grid-" + index;
      var pagerId = "pager-" + index;
      $body.append($("<table>").attr("id", gridId));
      $body.append($("<div>").attr("id", pagerId));

      $card.append($loading);
      $card.append($body);
      $stack.append($card);
    });
  }

  // ===== 載入單一卡片的 Grid 資料 =====
  function loadCardData(tabName, callback) {
    var $card = $(".card-panel[data-type='" + tabName + "']");
    var index = $card.attr("data-index");
    var gridId = "grid-" + index;
    var pagerId = "pager-" + index;

    // 模擬 API 請求延遲（之後替換成真實 API）
    setTimeout(function () {
      var data = MOCK_DATA[tabName] || [];

      var initWidth = $card.find(".card-body").innerWidth() - 24;
      $("#" + gridId).jqGrid({
        datatype: "local",
        data: data,
        colModel: colModel,
        width: initWidth > 0 ? initWidth : undefined,
        shrinkToFit: true,
        height: "auto",
        rowNum: 20,
        pager: "#" + pagerId,
        viewrecords: true,
        caption: tabName + "查詢結果",
        emptyrecords: "無符合條件的資料",
        loadonce: true,
        gridComplete: function () {
          $("#" + gridId).closest(".card-panel").find(".link-query")
            .off("click").on("click", function () {
              var rowId = $(this).closest("tr").attr("id");
              var rowData = $("#" + gridId).jqGrid("getRowData", rowId);
              alert("查詢相關聯內規：" + rowData.lawName);
            });
        }
      });

      // 隱藏 loading，顯示 grid
      $card.find(".card-loading").hide();
      $card.find(".card-body").show().addClass("fade-in");

      loadedTabs[tabName] = true;

      // 等 DOM 完全渲染後調整尺寸
      setTimeout(function () {
        var $body = $card.find(".card-body");
        var bodyWidth = $body.innerWidth();
        if (bodyWidth > 0) {
          $("#" + gridId).jqGrid("setGridWidth", bodyWidth - 24, true);
        }
        fitGridHeight(gridId, $card);
        if (callback) callback();
      }, 50);
    }, 800);
  }

  // ===== 顯示 loading 狀態（重新查詢時用） =====
  function showLoading($card) {
    $card.find(".card-body").hide().removeClass("fade-in");
    $card.find(".card-loading").show();
  }

  // ===== 更新卡片堆疊位置 =====
  function updateStack(activeIndex, tabs) {
    var order = [activeIndex];
    for (var i = 0; i < tabs.length; i++) {
      if (i !== activeIndex) {
        order.push(i);
      }
    }

    $(".card-panel").each(function () {
      var idx = parseInt($(this).attr("data-index"));
      var stackPos = order.indexOf(idx);

      $(this).removeClass("stack-0 stack-1 stack-2 stack-hidden");

      if (stackPos === 0) {
        $(this).addClass("stack-0");
      } else if (stackPos === 1) {
        $(this).addClass("stack-1");
      } else if (stackPos === 2) {
        $(this).addClass("stack-2");
      } else {
        $(this).addClass("stack-hidden");
      }
    });

  }

  // ===== 頁籤切換事件 =====
  $("#tab-bar").on("click", ".tab-btn", function () {
    var $btn = $(this);
    var tabName = $btn.data("type");

    if (tabName === activeTab) return;

    // 更新 active 狀態
    $(".tab-btn").removeClass("active");
    $btn.addClass("active");
    activeTab = tabName;

    // 找到對應的 index
    var targetIndex = parseInt(
      $(".card-panel[data-type='" + tabName + "']").attr("data-index")
    );

    // 先切換卡片位置（動畫）
    updateStack(targetIndex, tabs);

    // 如果尚未載入，先顯示 loading 再撈資料
    if (!loadedTabs[tabName]) {
      loadCardData(tabName, function () {
        fixGridWidth();
      });
    } else {
      // 已載入過，直接修正寬度
      setTimeout(fixGridWidth, 50);
    }
  });

  // ===== 修正 active card 的 grid 寬度 =====
  function fixGridWidth() {
    var $activeCard = $(".card-panel.stack-0");
    var $body = $activeCard.find(".card-body");
    var gridId = $body.find("table").attr("id");
    if (!gridId) return;
    var $grid = $("#" + gridId);
    if ($grid.length && $grid[0].grid) {
      var w = $body.innerWidth() - 24;
      $grid.jqGrid("setGridWidth", w, true);
      fitGridHeight(gridId, $activeCard);
    }
  }

  // ===== 動態計算 grid 高度填滿卡片 =====
  function fitGridHeight(gridId, $card) {
    var $grid = $("#" + gridId);
    if (!$grid.length || !$grid[0].grid) return;

    var $body = $card.find(".card-body");
    var bodyH = $body.innerHeight();

    // 扣除 caption、header、pager、padding
    var captionH = $card.find(".ui-jqgrid-titlebar").outerHeight(true) || 0;
    var headerH = $card.find(".ui-jqgrid-hdiv").outerHeight(true) || 0;
    var pagerH = $card.find(".ui-jqgrid-pager").outerHeight(true) || 0;
    var bodyPad = 20; // card-body top+bottom padding (8+12)

    var available = bodyH - captionH - headerH - pagerH - bodyPad;
    if (available > 100) {
      $grid.jqGrid("setGridHeight", available);
    }
  }

  // ===== 視窗大小調整 — 所有已載入的 grid 都重算 =====
  var resizeTimer;
  $(window).on("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      $(".card-panel").each(function () {
        var $card = $(this);
        var tabName = $card.attr("data-type");
        if (!loadedTabs[tabName]) return;

        var $body = $card.find(".card-body");
        var gridId = $body.find("table").attr("id");
        if (!gridId) return;
        var $grid = $("#" + gridId);
        if (!$grid.length || !$grid[0].grid) return;

        var w = $body.innerWidth() - 24;
        if (w > 0) {
          $grid.jqGrid("setGridWidth", w, true);
        }
        fitGridHeight(gridId, $card);
      });
    }, 150);
  });

  // ===== 初始化 =====
  var tabs = getTabsFromURL();
  if (tabs.length === 0) return;

  renderTabs(tabs);
  createCards(tabs);

  // 自動選中第一個頁籤
  $(".tab-btn").first().trigger("click");
});
