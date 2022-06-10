import { RoutersConfig } from 'hzero-boot/lib/typings/IRouterConfig';

const config: RoutersConfig = [
  {
    path: '/himp/commentImport/:code',
    component: '.../routes/CommonImport/CommonImport',
    authorized: true,
  },
  // Insert New Router
  {
    path: '/lwms/on-hand-qty/list', // 现有量查询
    component: () => import('../routes/OnhandQty'),
  },
  {
    path: '/lwms/warehouse-execution-details/list', // 仓库执行明细
    component: () => import('../routes/WarehouseExecutionDetails'),
  },
  {
    path: '/lwms/ship-platform', // 发货单平台
    components: [
      {
        path: '/lwms/ship-platform/list',
        component: () => import('../routes/ShipPlatform/list'),
        models: ['ShipPlatformModel'],
      },
      {
        path: '/lwms/ship-platform/print/:templateCode',
        component: () => import('../routes/Print'),
      },
      {
        path: '/lwms/ship-platform/create/sales',
        component: () => import('../routes/ShipPlatform/detail'),
      },
      {
        path: '/lwms/ship-platform/create/normal',
        component: () => import('../routes/ShipPlatform/detail/normal'),
      },
    ],
  },
  {
    path: '/lwms/transfer-request-platform', // 转移单平台
    components: [
      {
        path: '/lwms/transfer-request-platform/list',
        component: () => import('../routes/TransferRequestPlatform/list'),
        models: ['transferRequestModel'],
      },
      {
        path: '/lwms/transfer-request-platform/create',
        component: () => import('../routes/TransferRequestPlatform/detail'),
        models: ['transferRequestModel'],
      },
      {
        path: '/lwms/transfer-request-platform/detail/:requestId',
        component: () => import('../routes/TransferRequestPlatform/detail'),
        models: ['transferRequestModel'],
      },
    ],
  },
  {
    path: '/lwms/issue-request-platform', // 领料单平台
    components: [
      {
        path: '/lwms/issue-request-platform/list',
        component: () => import('../routes/IssueRequestPlatform/list'),
        models: ['issueRequestPlatformModel'],
      },
      {
        path: '/lwms/issue-request-platform/detail/:requestId/:org',
        component: () => import('../routes/IssueRequestPlatform/detail'),
      },
      {
        path: '/lwms/issue-request-platform/prodNotLimit',
        component: () => import('../routes/IssueRequestPlatform/prdNotLimitCreate'),
        models: ['issueRequestPlatformModel'],
      },
      {
        path: '/lwms/issue-request-platform/costCenter',
        component: () => import('../routes/IssueRequestPlatform/costCenterCreate'),
        models: ['issueRequestPlatformModel'],
      },
      {
        path: '/lwms/issue-request-platform/mixed',
        component: () => import('../routes/IssueRequestPlatform/mulMoCreate/list'),
        models: ['issueRequestPlatformModel'],
      },
      {
        path: '/lwms/issue-request-platform/outSource',
        component: () => import('../routes/IssueRequestPlatform/outSourcePoRequestCreate'),
      },
      {
        path: '/lwms/issue-request-platform/summary',
        component: () => import('../routes/IssueRequestPlatform/summaryPage'),
      },
      {
        path: '/lwms/issue-request-platform/print/:templateCode',
        component: () => import('../routes/Print'),
      },
    ],
  },
  {
    path: '/lwms/tag',
    components: [
      {
        path: '/lwms/tag/list', // 实物标签
        component: () => import('../routes/Tag/list'),
        models: [() => import('../models/TagModel.js')],
      },
      {
        path: '/lwms/tag/history/:tagId', // 实物标签历史
        component: () => import('../routes/Tag/history'),
      },
    ],
  },
  {
    path: '/lwms/tag-history', // 实物标签历史
    component: () => import('../routes/Tag/history'),
  },
  {
    path: '/lwms/lot-number-qty', // 批次查询
    component: () => import('../routes/LotNumberQty'),
  },
  {
    path: '/lwms/reservation-qty', // 库存保留
    component: () => import('../routes/ReservationQty/list'),
  },
  {
    path: '/lwms/reservation-qty', // 库存保留
    components: [
      {
        path: '/lwms/reservation-qty/list',
        component: () => import('../routes/ReservationQty/list'),
      },
      {
        path: '/lwms/reservation-qty/detail/:reservationId',
        component: () => import('../routes/ReservationQty/journal'),
      },
    ],
  },
  {
    path: '/lwms/ticket-platform', // 送货单平台
    components: [
      {
        path: '/lwms/ticket-platform/list',
        component: () => import('../routes/TicketPlatform'),
        models: ['TicketPlatformModel'],
      },
      {
        path: '/lwms/ticket-platform/copy/:ticketId',
        component: () => import('../routes/TicketPlatform/TicketCreate'),
        models: ['TicketPlatformModel'],
      },
      {
        path: '/lwms/ticket-platform/detail/:ticketId',
        component: () => import('../routes/TicketPlatform/TicketCreate'),
        models: ['TicketPlatformModel'],
      },
      {
        path: '/lwms/ticket-platform/create',
        component: () => import('../routes/TicketPlatform/TicketCreate'),
        models: ['TicketPlatformModel'],
      },
      {
        path: '/lwms/ticket-platform/view/:ticketId',
        component: () => import('../routes/TicketPlatform/TicketDetail/index'),
      },
    ],
  },
  {
    authorized: true,
    path: '/pub/lwms/purchase-receipt', // 采购接收
    component: () => import('../routes/PurchaseReceipt/'),
    models: ['purchaseReceiptModel'],
  },
  {
    path: '/lwms/delivery-execution', // 发货执行
    components: [
      {
        path: '/lwms/delivery-execution/list',
        models: ['deliveryExecutionModel'],
        component: () => import('../routes/DeliveryExecution/list'),
      },
      {
        authorized: true,
        path: '/pub/lwms/delivery-execution-detail/:shipOrderId', // 发货执行详情
        models: ['deliveryExecutionModel'],
        component: () => import('../routes/DeliveryExecution/detail'),
      },
    ],
  },

  {
    path: '/lwms/inventory-platform', // 盘点平台
    components: [
      {
        path: '/lwms/inventory-platform/list',
        component: () => import('../routes/InventoryPlatform/list'),
        models: ['inventoryPlatformModel'],
      },
      {
        path: '/lwms/inventory-platform/create',
        component: () => import('../routes/InventoryPlatform/detail/create-and-edit'),
        models: ['inventoryPlatformModel'],
      },
      {
        path: '/lwms/inventory-platform/edit/:countId',
        component: () => import('../routes/InventoryPlatform/detail/create-and-edit'),
        models: ['inventoryPlatformModel'],
      },
      {
        path: '/lwms/inventory-platform/detail/:countId',
        component: () => import('../routes/InventoryPlatform/detail/details'),
        models: ['inventoryPlatformModel'],
      },
      {
        path: '/lwms/inventory-platform/adjustment/:countId',
        component: () => import('../routes/InventoryPlatform/detail/adjustment'),
        models: ['inventoryPlatformModel'],
      },
    ],
  },
  {
    path: '/pub/lwms/inventory-platform/detail', // 盘点明细
    component: () => import('../routes/InventoryPlatform/detail/details'),
    models: ['inventoryPlatformModel'],
    authorized: true,
  },
  {
    path: '/lwms/issue-request-execute', // 领料执行
    component: () => import('../routes/IssueRequestExecute/item'),
  },
  {
    path: '/pub/lwms/issue-request-execute/pick', // 领料执行 - 捡料
    component: () => import('../routes/IssueRequestExecute/pick'),
    authorized: true,
  },
  {
    path: '/pub/lwms/miscellaneous-adjustment',
    component: () => import('../routes/MiscellaneousAdjustment'),
    authorized: true,
  },
  {
    path: '/lwms/single-return-platform', // 退料单平台
    components: [
      {
        path: '/lwms/single-return-platform/list',
        component: () => import('../routes/SingleReturnPlatform/list'),
        models: ['singleReturnPlatformModel'],
      },
      {
        path: '/lwms/single-return-platform/prodIssueReturn',
        // authorized: true,
        component: () => import('../routes/SingleReturnPlatform/prodIssueReturnCreate'),
      },
      {
        path: '/lwms/single-return-platform/requestIssueReturn',
        // authorized: true,
        component: () => import('../routes/SingleReturnPlatform/requestIssueReturnCreate'),
      },
      {
        path: '/lwms/single-return-platform/outSourceIssueReturn',
        // authorized: true,
        component: () => import('../routes/SingleReturnPlatform/outSourceIssueReturnCreate'),
      },
    ],
  },
  {
    path: '/lwms/transfer-order-execution',
    component: () => import('../routes/TransferOrderExecution'),
  },
  {
    path: '/pub/lwms/materiral-return-execution', // 退料执行
    component: () => import('../routes/MaterialReturnExecution'),
    authorized: true,
  },
  {
    path: '/pub/lwms/transfer-order/execute',
    component: () => import('../routes/TransferOrderExecution/execute.js'),
    authorized: true,
  },
  {
    path: '/pub/lwms/arrival-reception', // 到货接收
    component: () => import('../routes/ArrivalReception/index.js'),
    authorized: true,
  },
  {
    path: '/pub/lwms/wip-completion', // 完工入库
    component: () => import('../routes/WipCompletion'),
    authorized: true,
  },
  {
    path: '/pub/lwms/purchase-receive-inventory', // 采购接收入库/到货入库
    component: () => import('../routes/PurchaseReceiveInventory'),
    models: ['purchaseReceiveInventory'],
    authorized: true,
  },
  {
    path: '/lwms/issue-request-receive', // 领料接收
    component: () => import('../routes/IssueRequestReceive/list'),
  },
  {
    path: '/pub/lwms/issue-request-receive/detail/:requestId', // 领料接收 - 捡料
    component: () => import('../routes/IssueRequestReceive/detail'),
    authorized: true,
  },
  {
    path: '/pub/lwms/finished-product-inventory', // 产成品入库
    component: () => import('../routes/FinishedProductInventory'),
    models: ['finishedProductInventory'],
    authorized: true,
  },
  {
    path: '/lwms/ship-return-platform', // 销售退货单平台
    components: [
      {
        path: '/lwms/ship-return-platform/list',
        component: () => import('../routes/ShipReturnPlatform/list'),
        models: ['shipReturnModel'],
      },
      {
        path: '/lwms/ship-return-platform/detail/:shipReturnId',
        component: () => import('../routes/ShipReturnPlatform/detail'),
        models: ['shipReturnModel'],
      },
      {
        path: '/lwms/ship-return-platform/create',
        component: () => import('../routes/ShipReturnPlatform/create'),
        models: ['shipReturnModel'],
      },
    ],
  },
  {
    path: '/pub/lwms/ship-return-receive', // 销售退货接收
    component: () => import('../routes/ShipReturnReceive'),
    authorized: true,
  },
  {
    path: '/pub/lwms/ship-return-execute', // 销售退货单执行
    component: () => import('../routes/ShipReturnExecute'),
    authorized: true,
  },
  {
    path: '/pub/lwms/delivery-return', // 采购退货发出
    component: () => import('../routes/DeliveryReturnReceive'),
    authorized: true,
  },
  {
    path: '/lwms/batch-frozen', // 批次冻结
    component: () => import('../routes/BatchFrozen'),
  },
  {
    path: '/lwms/purchase-return-order-platform', // 退货单平台
    components: [
      {
        path: '/lwms/purchase-return-order-platform/list',
        component: () => import('../routes/PurchaseReturnOrderPlatform/list'),
        models: [() => import('../models/purchaseReturnModel')],
      },
      {
        path: '/lwms/purchase-return-order-platform/create',
        component: () => import('../routes/PurchaseReturnOrderPlatform/create'),
      },
      {
        path: '/lwms/purchase-return-order-platform/print',
        models: [() => import('../models/purchaseReturnOrderPlatformModel')],
        component: () => import('../routes/PurchaseReturnOrderPlatform/print'),
      },
    ],
  },
  {
    path: '/pub/lwms/purchase-return-order-execution', // 采购退货单执行
    component: () => import('../routes/PurchaseReturnOrderExecution'),
    authorized: true,
  },
  {
    path: '/lwms/registered-label', // 注册标签
    components: [
      {
        path: '/lwms/registered-label/list',
        component: () => import('../routes/RegisteredLabel'),
      },
      {
        path: '/lwms/registered-label/print/:templateCode',
        component: () => import('../routes/RegisteredLabel/print'),
      },
    ],
  },
  {
    path: '/lwms/recognition-rule', // 识别规则
    components: [
      {
        path: '/lwms/recognition-rule/list',
        component: () => import('../routes/RecognitionRule/list'),
      },
      {
        path: '/lwms/recognition-rule/create',
        component: () => import('../routes/RecognitionRule/create'),
      },
      {
        path: '/lwms/recognition-rule/edit/:ruleId',
        component: () => import('../routes/RecognitionRule/create'),
      },
    ],
  },
  {
    path: '/lwms/tag-print', // 标签打印
    components: [
      {
        path: '/lwms/tag-print/list',
        component: () => import('../routes/TagPrint/list'),
      },
      {
        path: '/lwms/tag-print/print/:templateCode',
        component: () => import('../routes/TagPrint/print'),
      },
    ],
  },
  {
    path: '/lwms/lot-print', // 标签打印
    components: [
      {
        path: '/lwms/lot-print/list',
        component: () => import('../routes/LotPrint/list'),
      },
      {
        path: '/lwms/lot-print/print/:templateCode',
        component: () => import('../routes/LotPrint/print'),
      },
    ],
  },
  {
    path: '/lwms/product-inventory-platform', // 生产入库单平台
    components: [
      {
        path: '/lwms/product-inventory-platform/list',
        component: () => import('../routes/ProductInventoryPlatform/list'),
        models: [() => import('../models/productInventoryPlatformModel')],
      },
      {
        path: '/lwms/product-inventory-platform/detail/:requestId',
        component: () => import('../routes/ProductInventoryPlatform/create'),
      },
    ],
  },
  {
    path: '/pub/lwms/product-inventory-platform/detail', // 生产入库单平台工作流
    component: () => import('../routes/ProductInventoryPlatform/create'),
    authorized: true,
  },
  {
    path: '/lwms/item/disassemble', // 产品拆解
    components: [
      {
        path: '/lwms/item/disassemble/list',
        component: () => import('../routes/itemDisassemble/list'),
      },
      // {
      //   path: '/lwms/V/:templateCode',
      //   component: () => import('../routes/TagPrint/print'),
      // },
    ],
  },
  {
    path: '/lwms/production-warehousing-execution', // 生产入库执行
    components: [
      {
        path: '/lwms/production-warehousing-execution/list',
        component: () => import('../routes/ProductionWarehousingExecution/list'),
        models: [() => import('../models/productionWarehousingExecutionModel')],
      },
      {
        path: '/pub/lwms/production-warehousing-execution/detail',
        component: () => import('../routes/ProductionWarehousingExecution/detail'),
        models: [() => import('../models/productionWarehousingExecutionModel')],
        authorized: true,
      },
    ],
  },
];

export default config;
