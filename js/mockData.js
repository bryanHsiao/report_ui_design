/**
 * 假資料 — 三種查詢類別共用欄位結構
 * 欄位：法規名稱、最後修正日期、主管機關、相關聯內規
 */
var MOCK_DATA = {
  "法規資料": [
    {
      id: 1,
      lawName: "曾會計師違反洗錢防制法處分案",
      lastModified: "2026/03/10",
      authority: "金融監督管理委員會證券期貨局會計審計組",
      relatedRule: "-"
    },
    {
      id: 2,
      lawName: "萬會計師違反洗錢防制法處分案",
      lastModified: "2026/03/09",
      authority: "金融監督管理委員會證券期貨局會計審計組",
      relatedRule: "-"
    },
    {
      id: 3,
      lawName: "施會計師違反洗錢防制法處分案",
      lastModified: "2026/03/02",
      authority: "金融監督管理委員會證券期貨局會計審計組",
      relatedRule: "-"
    },
    {
      id: 4,
      lawName: "洗錢防制法第二十二條第六項帳戶帳號暫停限制功能或逕予關閉管理辦法",
      lastModified: "2025/05/01",
      authority: "法務部檢察司",
      relatedRule: "查詢"
    },
    {
      id: 5,
      lawName: "洗錢防制法第十七條第四項申報通報資料管理運用辦法",
      lastModified: "2024/11/28",
      authority: "法務部檢察司",
      relatedRule: "查詢"
    },
    {
      id: 6,
      lawName: "資恐防制法施行細則",
      lastModified: "2024/08/15",
      authority: "法務部檢察司",
      relatedRule: "-"
    },
    {
      id: 7,
      lawName: "金融機構防制洗錢辦法",
      lastModified: "2024/06/20",
      authority: "金融監督管理委員會銀行局",
      relatedRule: "查詢"
    },
    {
      id: 8,
      lawName: "銀行業及電子支付機構電子票證發行機構防制洗錢及打擊資恐內部控制要點",
      lastModified: "2024/03/12",
      authority: "金融監督管理委員會銀行局",
      relatedRule: "-"
    }
  ],

  "函釋資料": [
    {
      id: 1,
      lawName: "有關洗錢防制法第六條第三項授權訂定辦法之適用疑義函釋",
      lastModified: "2026/02/18",
      authority: "法務部",
      relatedRule: "查詢"
    },
    {
      id: 2,
      lawName: "金融機構對達一定金額以上通貨交易申報相關疑義函釋",
      lastModified: "2025/11/05",
      authority: "金融監督管理委員會銀行局",
      relatedRule: "-"
    },
    {
      id: 3,
      lawName: "有關保險業防制洗錢及打擊資恐注意事項適用疑義函釋",
      lastModified: "2025/08/22",
      authority: "金融監督管理委員會保險局",
      relatedRule: "查詢"
    },
    {
      id: 4,
      lawName: "證券商對疑似洗錢交易申報作業之補充函釋",
      lastModified: "2025/05/14",
      authority: "金融監督管理委員會證券期貨局",
      relatedRule: "-"
    },
    {
      id: 5,
      lawName: "關於虛擬資產服務提供者防制洗錢規範適用函釋",
      lastModified: "2025/02/28",
      authority: "金融監督管理委員會",
      relatedRule: "-"
    },
    {
      id: 6,
      lawName: "電子支付機構客戶身分確認機制相關函釋",
      lastModified: "2024/12/10",
      authority: "金融監督管理委員會銀行局",
      relatedRule: "查詢"
    }
  ],

  "裁罰案件": [
    {
      id: 1,
      lawName: "三商美邦人壽保險股份有限公司辦理保險業務，查有違反洗錢防制法及保險法相關規定，依保險法核處罰鍰計新臺幣120萬元整，並予以2項糾正。",
      lastModified: "2019/12/11",
      authority: "金融監督管理委員會保險局",
      relatedRule: "-"
    },
    {
      id: 2,
      lawName: "遠雄人壽保險事業股份有限公司辦理不動產投資開發及銷售作業、利害關係人交易、內部稽核單位查核作業，以及防制洗錢作業等業務，查有違反保險法及洗錢防制法相關規定，核處罰鍰新臺幣(下同)850萬元，並予以16項糾正處分。",
      lastModified: "2019/10/24",
      authority: "金融監督管理委員會保險局",
      relatedRule: "-"
    },
    {
      id: 3,
      lawName: "合作金庫商業銀行辦理潤寅集團關聯戶存匯相關作業，未落實確認客戶身分程序及帳戶或交易之持續監控作業，核有違反洗錢防制法第7條第1項規定，依洗錢防制法第7條第5項規定，核處新臺幣50萬元罰鍰",
      lastModified: "2019/10/17",
      authority: "金融監督管理委員會銀行局",
      relatedRule: "-"
    },
    {
      id: 4,
      lawName: "第一商業銀行辦理潤寅集團關聯戶存匯相關作業，未落實確認客戶身分程序及帳戶或交易之持續監控作業，核有違反洗錢防制法第7條第1項規定，依洗錢防制法第7條第5項規定，核處新臺幣100萬元罰鍰",
      lastModified: "2019/10/17",
      authority: "金融監督管理委員會銀行局",
      relatedRule: "-"
    },
    {
      id: 5,
      lawName: "兆豐國際商業銀行紐約分行因防制洗錢法令遵循缺失案，核處罰鍰新臺幣1000萬元",
      lastModified: "2018/08/20",
      authority: "金融監督管理委員會銀行局",
      relatedRule: "-"
    }
  ]
};
