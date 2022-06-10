import { RoutersConfig } from 'hzero-boot/lib/typings/IRouterConfig';

const config: RoutersConfig = [
  {
    path: '/zcom/purchase-requirement-release',
    component: () => import('../routes/PurchaseRequirementRelease'),
    authorized: true,
    title: '需求发布',
  },
  {
    path: '/zcom/requirement-release',
    authorized: true,
    title: '需求发布',
    components: [
      {
        path: '/zcom/requirement-release/list',
        component: () => import('../routes/RequirementRelease/list'),
      },
      {
        path: '/zcom/requirement-release/detail/:poHeaderId',
        component: () => import('../routes/RequirementRelease/detail'),
      },
    ],
  },
  {
    path: '/zcom/requirement-confirm',
    authorized: true,
    title: '采购需求确认',
    components: [
      {
        path: '/zcom/requirement-confirm/list',
        models: [() => import('../models/requirementConfirm.js')],
        component: () => import('../routes/RequirementConfirm/list'),
      },
      {
        path: '/zcom/requirement-confirm/detail/:tabType/:poHeaderId',
        component: () => import('../routes/RequirementConfirm/detail'),
      },
    ],
  },
  {
    path: '/zcom/delivery-maintain',
    authorized: true,
    title: '送货单维护',
    components: [
      {
        path: '/zcom/delivery-maintain/list',
        models: [() => import('../models/deliveryMaintainModel.js')],
        component: () => import('../routes/DeliveryMaintain/list'),
      },
      {
        path: '/zcom/delivery-maintain/:type/:deliveryOrderId?',
        models: [() => import('../models/deliveryMaintainModel.js')],
        component: () => import('../routes/DeliveryMaintain/detail'),
      },
    ],
  },
  {
    path: '/zcom/delivery-review',
    authorized: true,
    title: '送货单审核',
    components: [
      {
        path: '/zcom/delivery-review/list',
        component: () => import('../routes/DeliveryReview/list'),
      },
      {
        path: '/zcom/delivery-review/detail/:deliveryOrderId',
        component: () => import('../routes/DeliveryReview/detail'),
      },
    ],
  },
  {
    path: '/zcom/delivery-receive',
    authorized: true,
    title: '送货单接收',
    components: [
      {
        path: '/zcom/delivery-receive/list',
        models: [() => import('../models/deliveryReceiveModel.js')],
        component: () => import('../routes/DeliveryReceive/list'),
      },
      {
        path: '/zcom/delivery-receive/detail',
        models: [() => import('../models/deliveryReceiveModel.js')],
        component: () => import('../routes/DeliveryReceive/detail'),
      },
    ],
  },
  {
    path: '/zcom/delivery-writeoff',
    authorized: true,
    title: '送货单冲销',
    components: [
      {
        path: '/zcom/delivery-writeoff/list',
        models: [() => import('../models/deliveryWriteoffModel.js')],
        component: () => import('../routes/DeliveryWriteoff/list'),
      },
      {
        path: '/zcom/delivery-writeoff/detail',
        models: [() => import('../models/deliveryWriteoffModel.js')],
        component: () => import('../routes/DeliveryWriteoff/detail'),
      },
    ],
  },
  {
    path: '/zcom/mo-delivery-review',
    authorized: true,
    title: '送货单审核',
    components: [
      {
        path: '/zcom/mo-delivery-review/list',
        component: () => import('../routes/MoDeliveryReview/list'),
      },
      {
        path: '/zcom/mo-delivery-review/detail/:deliveryOrderId',
        component: () => import('../routes/MoDeliveryReview/detail'),
      },
    ],
  },
  {
    path: '/zcom/mo-delivery-receive',
    authorized: true,
    title: '送货单接收',
    components: [
      {
        path: '/zcom/mo-delivery-receive/list',
        models: [() => import('../models/moDeliveryReceiveModel.js')],
        component: () => import('../routes/MoDeliveryReceive/list'),
      },
      {
        path: '/zcom/mo-delivery-receive/detail',
        models: [() => import('../models/moDeliveryReceiveModel.js')],
        component: () => import('../routes/MoDeliveryReceive/detail'),
      },
    ],
  },
  {
    path: '/zcom/mo-delivery-writeoff',
    authorized: true,
    title: '送货单冲销',
    components: [
      {
        path: '/zcom/mo-delivery-writeoff/list',
        models: [() => import('../models/moDeliveryWriteoffModel.js')],
        component: () => import('../routes/MoDeliveryWriteoff/list'),
      },
      {
        path: '/zcom/mo-delivery-writeoff/detail',
        models: [() => import('../models/moDeliveryWriteoffModel.js')],
        component: () => import('../routes/MoDeliveryWriteoff/detail'),
      },
    ],
  },
  // 配置中心
  {
    path: '/zcom/configuration-center',
    authorized: true,
    title: '配置中心',
    components: [
      {
        path: '/zcom/configuration-center/entrance',
        component: () => import('../routes/ConfigurationCenter/entrance'),
      },
      {
        path: '/zcom/configuration-center/list',
        component: () => import('../routes/ConfigurationCenter/list'),
      },
      {
        path: '/zcom/configuration-center/detail/:tabType/:orderConfigId',
        models: [() => import('../models/configurationCenterModel.js')],
        component: () => import('../routes/ConfigurationCenter/detail'),
      },
      {
        path: '/zcom/configuration-center/price-list',
        component: () => import('../routes/ConfigurationCenter/priceList'),
      },
      {
        path: '/zcom/configuration-center/price-detail/:orderConfigId',
        models: [() => import('../models/configurationCenterModel.js')],
        component: () => import('../routes/ConfigurationCenter/priceDetail'),
      },
    ],
  },
  // 对账单维护---供应商
  {
    path: '/zcom/statement-maintain/supplier',
    authorized: true,
    title: '对账单维护',
    components: [
      {
        path: '/zcom/statement-maintain/supplier/list',
        models: [() => import('../models/statementMaintainModel.js')],
        component: () => import('../routes/StatementMaintain/list'),
      },
      {
        path: '/zcom/statement-maintain/supplier/:type/:verificationOrderId?',
        models: [() => import('../models/statementMaintainModel.js')],
        component: () => import('../routes/StatementMaintain/detail'),
      },
    ],
  },
  // 对账单维护---核企
  {
    path: '/zcom/statement-maintain/coreCompany',
    authorized: true,
    title: '对账单维护',
    components: [
      {
        path: '/zcom/statement-maintain/coreCompany/list',
        models: [() => import('../models/statementMaintainModel.js')],
        component: () => import('../routes/StatementMaintain/list'),
      },
      {
        path: '/zcom/statement-maintain/coreCompany/:type/:verificationOrderId?',
        models: [() => import('../models/statementMaintainModel.js')],
        component: () => import('../routes/StatementMaintain/detail'),
      },
    ],
  },
  // 对账单审核---供应商
  {
    path: '/zcom/statement-review/supplier',
    authorized: true,
    title: '对账单审核',
    components: [
      {
        path: '/zcom/statement-review/supplier/list',
        component: () => import('../routes/StatementReview/list'),
      },
      {
        path: '/zcom/statement-review/supplier/detail/:verificationOrderId',
        component: () => import('../routes/StatementReview/detail'),
      },
    ],
  },
  // 对账单审核---核企
  {
    path: '/zcom/statement-review/coreCompany',
    authorized: true,
    title: '对账单审核',
    components: [
      {
        path: '/zcom/statement-review/coreCompany/list',
        component: () => import('../routes/StatementReview/list'),
      },
      {
        path: '/zcom/statement-review/coreCompany/detail/:verificationOrderId',
        component: () => import('../routes/StatementReview/detail'),
      },
    ],
  },
  // 送货单维护-MO
  {
    path: '/zcom/mo-delivery-maintain',
    authorized: true,
    title: '送货单维护',
    components: [
      {
        path: '/zcom/mo-delivery-maintain/list',
        component: () => import('../routes/MoDeliveryMaintain/list'),
        models: [() => import('../models/moDeliveryMaintainModel.js')],
      },
      {
        path: '/zcom/mo-delivery-maintain/delivery',
        component: () => import('../routes/MoDeliveryMaintain/myPrint'),
        models: [() => import('../models/moDeliveryMaintainModel.js')],
      },
      {
        path: '/zcom/mo-delivery-maintain/item-print',
        component: () => import('../routes/MoDeliveryMaintain/itemPrint'),
        models: [() => import('../models/moDeliveryMaintainModel.js')],
      },
      {
        path: '/zcom/mo-delivery-maintain/:type/:deliveryOrderId?',
        component: () => import('../routes/MoDeliveryMaintain/detail'),
        models: [() => import('../models/moDeliveryMaintainModel.js')],
      },
    ],
  },
  // 客供料接收平台
  {
    path: '/zcom/customer-item-receive',
    authorized: true,
    title: '客供料接收平台',
    components: [
      {
        path: '/zcom/customer-item-receive/list',
        models: [() => import('../models/deliveryMaintainModel.js')],
        component: () => import('../routes/CustomerItemReceive/list'),
      },
    ],
  },
  // MO组件
  {
    path: '/zcom/mo-component',
    component: () => import('../routes/MoComponent/list'),
    authorized: true,
    title: 'MO组件',
  },
  // 用户个性化demo
  {
    path: '/zcom/personalise-demo',
    component: () => import('../routes/PersonaliseDemo/list'),
    authorized: true,
    title: '用户个性化demo',
  },
  // 客供料退料维护
  {
    path: '/zcom/customer-return-maintain',
    authorized: true,
    title: '客供料退料维护',
    components: [
      {
        path: '/zcom/customer-return-maintain/list',
        component: () => import('../routes/CustomerReturnMaintain/list'),
        models: [() => import('../models/customerRefundModel.js')],
      },
      {
        path: '/zcom/customer-return-maintain/print',
        component: () => import('../routes/CustomerReturnMaintain/myPrint'),
        models: [() => import('../models/customerRefundModel.js')],
      },
      {
        path: '/zcom/customer-return-maintain/item-print',
        component: () => import('../routes/CustomerReturnMaintain/itemPrint'),
      },
      {
        path: '/zcom/customer-return-maintain/:type/:itemRefundId?',
        component: () => import('../routes/CustomerReturnMaintain/detail'),
        models: [() => import('../models/customerRefundModel.js')],
      },
    ],
  },
  {
    path: '/zcom/customer-item-return-review',
    authorized: true,
    title: '客供料退料审核',
    components: [
      {
        path: '/zcom/customer-item-return-review/list',
        component: () => import('../routes/CustomerItemReturnReview/list'),
      },
      {
        path: '/zcom/customer-item-return-review/:itemRefundId',
        component: () => import('../routes/CustomerItemReturnReview/detail'),
      },
    ],
  },
  {
    path: '/zcom/vmi-apply-review',
    authorized: true,
    title: 'VMI申领单审核',
    components: [
      {
        path: '/zcom/vmi-apply-review/list',
        component: () => import('../routes/VmiApplyReview/list'),
      },
      {
        path: '/zcom/vmi-apply-review/:vmiApplyId',
        component: () => import('../routes/VmiApplyReview/detail'),
      },
    ],
  },
  {
    path: '/zcom/vmi-materials-apply',
    authorized: true,
    title: 'VMI物料申请平台',
    components: [
      {
        path: '/zcom/vmi-materials-apply/list',
        component: () => import('../routes/VmiMaterialsApply/list'),
        models: [() => import('../models/vmiMaterialsApplyModel.js')],
      },
      {
        path: '/zcom/vmi-materials-apply/apply/:type/:vmiApplyId?',
        component: () => import('../routes/VmiMaterialsApply/create'),
        models: [() => import('../models/vmiMaterialsApplyModel.js')],
      },
      {
        path: '/zcom/vmi-materials-apply/detail/:status/:vmiApplyId',
        component: () => import('../routes/VmiMaterialsApply/detail'),
        models: [() => import('../models/vmiMaterialsApplyModel.js')],
      },
    ],
  },
  // 配置中心（MO）
  {
    path: '/zcom/mo-configuration-center',
    authorized: true,
    title: '配置中心',
    components: [
      {
        path: '/zcom/mo-configuration-center/entrance',
        component: () => import('../routes/MoConfigurationCenter/entrance'),
      },
      {
        path: '/zcom/mo-configuration-center/foundry-list',
        component: () => import('../routes/MoConfigurationCenter/list'),
      },
    ],
  },
  // 对账单审核（MO）
  {
    path: '/zcom/mo-statement-review',
    authorized: true,
    title: '对账单审核',
    components: [
      {
        path: '/zcom/mo-statement-review/list',
        component: () => import('../routes/MoStatementReview/list'),
      },
      {
        path: '/zcom/mo-statement-review/detail/:verificationOrderId',
        component: () => import('../routes/MoStatementReview/detail'),
      },
    ],
  },
  {
    path: '/zcom/mo-statement-maintain',
    authorized: true,
    title: '对账单维护',
    components: [
      {
        path: '/zcom/mo-statement-maintain/list',
        models: [() => import('../models/moStatementMaintainModel.js')],
        component: () => import('../routes/MoStatementMaintain/list'),
      },
      {
        path: '/zcom/mo-statement-maintain/:type/:verificationOrderId?',
        models: [() => import('../models/moStatementMaintainModel.js')],
        component: () => import('../routes/MoStatementMaintain/detail'),
      },
    ],
  },
  {
    path: '/zcom/maintenance-monitor',
    authorized: true,
    title: '维修履历监控报表',
    components: [
      {
        path: '/zcom/maintenance-monitor/list',
        component: () => import('../routes/MaintenanceMonitor/list'),
      },
    ],
  },
  {
    path: '/zcom/quotation-maintain',
    authorized: true,
    title: '报价单维护',
    components: [
      {
        path: '/zcom/quotation-maintain/list',
        models: [() => import('../models/quotationMaintainModel.js')],
        component: () => import('../routes/QuotationMaintain/list'),
      },
      {
        path: '/zcom/quotation-maintain/:type/:quotationOrderId?',
        models: [() => import('../models/quotationMaintainModel.js')],
        component: () => import('../routes/QuotationMaintain/detail'),
      },
    ],
  },
  {
    path: '/zcom/quotation-review',
    authorized: true,
    title: '报价单审核',
    components: [
      {
        path: '/zcom/quotation-review/list',
        models: [() => import('../models/quotationReviewModel.js')],
        component: () => import('../routes/QuotationReview/list'),
      },
      {
        path: '/zcom/quotation-review/:quotationOrderId',
        models: [() => import('../models/quotationReviewModel.js')],
        component: () => import('../routes/QuotationReview/detail'),
      },
    ],
  },
  {
    path: '/zcom/po-maintain',
    authorized: true,
    title: '采购订单列表',
    components: [
      {
        path: '/zcom/po-maintain/list',
        models: [() => import('../models/poMaintainModel.js')],
        component: () => import('../routes/PoMaintain/list'),
      },
      {
        path: '/zcom/po-maintain/:type/:poId?',
        models: [() => import('../models/poMaintainModel.js')],
        component: () => import('../routes/PoMaintain/detail'),
      },
    ],
  },
  {
    path: '/zcom/customer-order',
    authorized: true,
    title: '客户订单列表',
    components: [
      {
        path: '/zcom/customer-order/list',
        models: [() => import('../models/customerOrderModel.js')],
        component: () => import('../routes/CustomerOrder/list'),
      },
      {
        path: '/zcom/customer-order/detail/:poId?',
        models: [() => import('../models/customerOrderModel.js')],
        component: () => import('../routes/CustomerOrder/detail'),
      },
    ],
  },
  // 送货单配置中心入口
  {
    path: '/zcom/mo-delivery-configuration-center',
    authorized: true,
    title: '配置中心',
    components: [
      {
        path: '/zcom/mo-delivery-configuration-center/entrance',
        component: () => import('../routes/MoDeliveryConfigurationCenter/entrance'),
      },
      {
        path: '/zcom/mo-delivery-configuration-center/foundry-list',
        component: () => import('../routes/MoDeliveryConfigurationCenter/list'),
      },
    ],
  },
  // 预约单列表---客户
  {
    path: '/zcom/delivery-apply/customer',
    authorized: true,
    title: '预约单列表',
    components: [
      {
        path: '/zcom/delivery-apply/customer/list',
        models: [() => import('../models/deliveryApplyModel.js')],
        component: () => import('../routes/DeliveryApply/list'),
      },
      {
        path: '/zcom/delivery-apply/customer/out/:type/:deliveryApplyId?',
        models: [() => import('../models/deliveryApplyModel.js')],
        component: () => import('../routes/DeliveryApply/outDetail'),
      },
      {
        path: '/zcom/delivery-apply/customer/:type/:deliveryApplyId?',
        models: [() => import('../models/deliveryApplyModel.js')],
        component: () => import('../routes/DeliveryApply/detail'),
      },
    ],
  },
  // 向供应商发货预约
  {
    path: '/zcom/delivery-apply-select/customer',
    authorized: true,
    title: '向供应商发货预约',
    components: [
      {
        path: '/zcom/delivery-apply-select/customer/list',
        models: [() => import('../models/deliveryApplyModel.js')],
        component: () => import('../routes/DeliveryApply/selectList'),
      },
    ],
  },
  // 预约单列表---供应商
  {
    path: '/zcom/delivery-apply/supplier',
    authorized: true,
    title: '预约单列表',
    components: [
      {
        path: '/zcom/delivery-apply/supplier/list',
        models: [() => import('../models/deliveryApplyModel.js')],
        component: () => import('../routes/DeliveryApply/list'),
      },
      {
        path: '/zcom/delivery-apply/supplier/out/:type/:deliveryApplyId?',
        models: [() => import('../models/deliveryApplyModel.js')],
        component: () => import('../routes/DeliveryApply/outDetail'),
      },
      {
        path: '/zcom/delivery-apply/supplier/:type/:deliveryApplyId?',
        models: [() => import('../models/deliveryApplyModel.js')],
        component: () => import('../routes/DeliveryApply/detail'),
      },
    ],
  },
  // 向客户发货预约
  {
    path: '/zcom/delivery-apply-select/supplier',
    authorized: true,
    title: '向客户发货预约',
    components: [
      {
        path: '/zcom/delivery-apply-select/supplier/list',
        models: [() => import('../models/deliveryApplyModel.js')],
        component: () => import('../routes/DeliveryApply/selectList'),
      },
    ],
  },
  // 发货创建---供应商
  {
    path: '/zcom/delivery-order',
    authorized: true,
    title: '发货单列表',
    components: [
      {
        path: '/zcom/delivery-order/list',
        models: [() => import('../models/deliveryOrderModel.js')],
        component: () => import('../routes/DeliveryOrderCreate/list'),
      },
      {
        path: '/zcom/delivery-order/:type/:deliveryOrderId?',
        models: [() => import('../models/deliveryOrderModel.js')],
        component: () => import('../routes/DeliveryOrderCreate/detail'),
        // title: '发货单',
      },
    ],
  },
  // 待收货列表---客户/第三方接收视角
  {
    path: '/zcom/delivery-to-receipt',
    authorized: true,
    title: '待收货列表',
    components: [
      {
        path: '/zcom/delivery-to-receipt/list',
        models: [() => import('../models/deliveryApplyModel.js')],
        component: () => import('../routes/DeliveryToReceipt/list'),
      },
      {
        path: '/zcom/delivery-to-receipt/supply/:deliveryOrderId?',
        models: [() => import('../models/supplyItemShipModel.js')],
        component: () => import('../routes/DeliveryToReceipt/supplyDetail'),
      },
      {
        path: '/zcom/delivery-to-receipt/:type/:deliveryOrderId?',
        models: [() => import('../models/deliveryApplyModel.js')],
        component: () => import('../routes/DeliveryToReceipt/detail'),
      },
    ],
  },
  // 收货单--第三方接收
  {
    path: '/zcom/third-party-reception',
    authorized: true,
    title: '第三方接收',
    components: [
      {
        path: '/zcom/third-party-reception/list',
        models: [() => import('../models/thirdPartyReceptionModel.js')],
        component: () => import('../routes/ThirdPartyReception/list'),
      },
      {
        path: '/zcom/third-party-reception/detail',
        models: [() => import('../models/thirdPartyReceptionModel.js')],
        component: () => import('../routes/ThirdPartyReception/detail'),
      },
    ],
  },
  // 收货记录
  {
    path: '/zcom/delivery-receipt-record',
    authorized: true,
    title: '收货记录',
    components: [
      {
        path: '/zcom/delivery-receipt-record/list',
        models: [() => import('../models/deliveryApplyModel.js')],
        component: () => import('../routes/DeliveryReceiptRecord/list'),
      },
    ],
  },
  // 采购接收
  {
    path: '/zcom/purchase-accept',
    authorized: true,
    title: '采购接收',
    components: [
      {
        path: '/zcom/purchase-accept/list',
        models: [() => import('../models/purchaseAcceptModel.js')],
        component: () => import('../routes/PurchaseAccept/list'),
      },
      {
        path: '/zcom/purchase-accept/detail',
        models: [() => import('../models/purchaseAcceptModel.js')],
        component: () => import('../routes/PurchaseAccept/detail'),
      },
    ],
  },
  // 扣款单创建--客户方 WithholdingOrderReview
  {
    path: '/zcom/withholding-order-create',
    authorized: true,
    title: '发起的扣款单列表',
    components: [
      {
        path: '/zcom/withholding-order-create/list',
        models: [() => import('../models/withholdingOrderModel.js')],
        component: () => import('../routes/WithholdingOrderCreate/list'),
      },
      {
        path: '/zcom/withholding-order-create/:type/:withholdingOrderId?',
        models: [() => import('../models/withholdingOrderModel.js')],
        component: () => import('../routes/WithholdingOrderCreate/detail'),
      },
    ],
  },
  // 扣款单审核--供应商方 WithholdingOrderReview
  {
    path: '/zcom/withholding-order-review',
    authorized: true,
    title: '收到的扣款单列表',
    components: [
      {
        path: '/zcom/withholding-order-review/list',
        models: [() => import('../models/withholdingOrderModel.js')],
        component: () => import('../routes/WithholdingOrderReview/list'),
      },
      {
        path: '/zcom/withholding-order-review/:type/:withholdingOrderId?',
        models: [() => import('../models/withholdingOrderModel.js')],
        component: () => import('../routes/WithholdingOrderReview/detail'),
      },
    ],
  },
  // 对账单发起--客户
  {
    path: '/zcom/statement-initiate',
    authorized: true,
    title: '发起的对账单',
    components: [
      {
        path: '/zcom/statement-initiate/list',
        models: [() => import('../models/statementInitiateModel.js')],
        component: () => import('../routes/StatementInitiate/list'),
      },
      {
        path: '/zcom/statement-initiate/detail/:verificationOrderId',
        models: [() => import('../models/statementInitiateModel.js')],
        component: () => import('../routes/StatementInitiate/detail'),
      },
    ],
  },
  // 对账单发起--选择业务单据
  {
    path: '/zcom/statement-select-document',
    authorized: true,
    title: '选择业务单据',
    components: [
      {
        path: '/zcom/statement-select-document/list',
        models: [() => import('../models/statementInitiateModel.js')],
        component: () => import('../routes/StatementInitiate/selectList'),
      },
    ],
  },
  // 收到的对账单--审核（供应商）
  {
    path: '/zcom/statement-verify',
    authorized: true,
    title: '收到的对账单',
    components: [
      {
        path: '/zcom/statement-verify/list',
        models: [() => import('../models/statementVerifyModel.js')],
        component: () => import('../routes/StatementVerify/list'),
      },
      {
        path: '/zcom/statement-verify/detail/:verificationOrderId',
        models: [() => import('../models/statementVerifyModel.js')],
        component: () => import('../routes/StatementVerify/detail'),
      },
    ],
  },
  // 发货单创建--供应商
  {
    path: '/zcom/delivery-create-by',
    authorized: true,
    title: '发货单创建',
    components: [
      {
        path: '/zcom/delivery-create-by/list',
        models: [() => import('../models/deliveryCreateByModel.js')],
        component: () => import('../routes/DeliveryCreateBy/list'),
      },
      {
        path: '/zcom/delivery-create-by/:type/:deliveryOrderId?',
        models: [() => import('../models/deliveryCreateByModel.js')],
        component: () => import('../routes/DeliveryCreateBy/detail'),
      },
    ],
  },
  // 收货单--采购方供料接收
  {
    path: '/zcom/purchase-supply-accept',
    authorized: true,
    title: '采购方供料接收',
    components: [
      {
        path: '/zcom/purchase-supply-accept/list',
        models: [() => import('../models/thirdPartyReceptionModel.js')],
        component: () => import('../routes/PurchaseSupplyAccept/list'),
      },
      {
        path: '/zcom/purchase-supply-accept/detail',
        models: [() => import('../models/thirdPartyReceptionModel.js')],
        component: () => import('../routes/PurchaseSupplyAccept/detail'),
      },
    ],
  },
  // 采购方供料发货
  {
    path: '/zcom/supply-item-ship',
    authorized: true,
    title: '采购方供料发货',
    components: [
      {
        path: '/zcom/supply-item-ship/list',
        models: [() => import('../models/supplyItemShipModel.js')],
        component: () => import('../routes/SupplyItemShip/list'),
      },
      {
        path: '/zcom/supply-item-ship/detail/:deliveryOrderId?',
        models: [() => import('../models/supplyItemShipModel.js')],
        component: () => import('../routes/SupplyItemShip/detail'),
      },
    ],
  },
];

export default config;
