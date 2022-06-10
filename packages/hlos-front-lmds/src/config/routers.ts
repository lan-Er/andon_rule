import { RoutersConfig } from 'hzero-boot/lib/typings/IRouterConfig';

const config: RoutersConfig = [
  {
    path: '/himp/commentImport/:code',
    component: () => import('../routes/CommonImport/CommonImport'),
    authorized: true,
  },
  // Insert New Router
  {
    path: '/lmds/demo', // demo
    authorized: true,
    title: 'demo',
    components: [
      {
        path: '/lmds/demo/list',
        component: () => import('../routes/demo/list'),
      },
      {
        path: '/lmds/demo/create',
        component: () => import('../routes/demo/list/detail.js'),
      },
      {
        path: '/lmds/demo/detail/:andonRuleId',
        component: () => import('../routes/demo/list/detail.js'),
      },
    ],
  },
  {
    path: '/lmds/mould', // 模具
    component: () => import('../routes/resource-mould/list'),
  },
  {
    path: '/lmds/business-document', // 业务单据
    component: () => import('../routes/global-business-document/list'),
  },
  {
    path: '/lmds/psielement', // PSI要素
    component: () => import('../routes/global-psielement/list'),
  },
  {
    path: '/lmds/resource-bom-assigns', // 资源BOM分配
    component: () => import('../routes/resource-bom-assigns/list'),
  },
  {
    path: '/lmds/resource-capacity', // 资源能力
    component: () => import('../routes/plan-resource-capacity/list'),
  },
  {
    path: '/lmds/production-version', // 生产版本
    component: () => import('../routes/item-production-version/list'),
  },
  {
    path: '/lmds/container-type', // 容器类型
    component: () => import('../routes/global-container-type/list'),
  },
  {
    path: '/lmds/warehouse', // 仓库
    component: () => import('../routes/organization-warehouse/list'),
  },
  {
    path: '/lmds/wm-area', // 货位
    component: () => import('../routes/organization-wm-area/list'),
  },
  {
    path: '/lmds/wm-unit', // 货格
    component: () => import('../routes/organization-wm-unit/list'),
  },
  {
    path: '/lmds/me-area', // 车间
    component: () => import('../routes/organization-me-area/list'),
  },
  {
    path: '/lmds/wm-ou', //  仓储中心
    component: () => import('../routes/organization-wm-ou/list'),
  },
  {
    path: '/lmds/meou', // 工厂
    component: () => import('../routes/organization-me-ou/list'),
  },
  {
    path: '/lmds/enterprise', // 集团
    component: () => import('../routes/organization-enterprise/list'),
  },
  {
    path: '/lmds/organization', // 组织
    component: () => import('../routes/organization/list'),
  },
  {
    path: '/lmds/resource', // 资源
    component: () => import('../routes/resource/list'),
  },
  {
    path: '/lmds/equipment', // 设备
    component: () => import('../routes/resource-equipment/list'),
  },
  {
    path: '/lmds/equipment-resume', // 设备履历
    component: () => import('../routes/resource-equipment-resume/list'),
  },
  {
    path: '/lmds/prod-line', // 生产线
    component: () => import('../routes/resource-prod-line/list'),
  },
  {
    path: '/lmds/worker-group', // 班组
    component: () => import('../routes/resource-worker-group/list'),
  },
  {
    path: '/lmds/worker', // 操作工
    component: () => import('../routes/resource-worker/list'),
  },
  {
    path: '/lmds/location', // 地理位置
    component: () => import('../routes/global-location/list'),
  },
  {
    path: '/lmds/inspection-standard', // 检验标准
    component: () => import('../routes/global-inspection-standard/list'),
    authorized: true,
  },
  {
    path: '/lmds/calendar', // 工作日历
    component: () => import('../routes/global-calendar'),
    models: [() => import('../models/calendarModel')],
  },
  {
    path: '/lmds/party',
    components: [
      {
        path: '/lmds/party/list',
        component: () => import('../routes/global-party/list'),
      },
      {
        path: '/lmds/party/detail/:partyId',
        component: () => import('../routes/global-party/detail'),
      },
    ],
  },
  {
    path: '/lmds/resource-group', // 资源组
    components: [
      {
        path: '/lmds/resource-group/list',
        component: () => import('../routes/resource-group/list'),
      },
      {
        path: '/lmds/resource-group/detail/:resourceGroupId',
        component: () => import('../routes/resource-group/detail'),
      },
    ],
  },
  {
    path: '/lmds/uom', // 单位
    component: () => import('../routes/global-uom/list'),
  },
  {
    path: '/lmds/workcell', // 工作单元
    component: () => import('../routes/resource-workcell/list'),
  },
  {
    path: '/lmds/category-set', // 类别集
    components: [
      {
        path: '/lmds/category-set/list',
        component: () => import('../routes/global-category-set/list'),
      },
      {
        path: '/lmds/category-set/detail',
        component: () => import('../routes/global-category-set/detail'),
      },
    ],
  },
  {
    path: '/lmds/resource-relation', // 资源关系
    component: () => import('../routes/resource-relation/list'),
  },
  {
    path: '/lmds/scm-ou', // 采购中心
    component: () => import('../routes/organization-scm-ou/list'),
  },
  {
    path: '/lmds/scm-group', // 采购组
    component: () => import('../routes/organization-scm-group/list'),
  },
  {
    path: '/lmds/transaction-type', // 事务类型
    component: () => import('../routes/global-transaction-type/list'),
  },
  {
    path: '/lmds/event-type', // 事件类型
    component: () => import('../routes/global-event-type/list'),
  },
  {
    path: '/lmds/sop-ou', // 销售中心
    component: () => import('../routes/organization-sop-ou/list'),
  },
  {
    path: '/lmds/sop-group', // 销售组
    component: () => import('../routes/organization-sop-group/list'),
  },
  {
    path: '/lmds/exception', // 异常
    component: () => import('../routes/global-exception/list'),
  },
  {
    path: '/lmds/exception-group', // 异常组
    components: [
      {
        path: '/lmds/exception-group/list',
        component: () => import('../routes/global-exception-group/list'),
      },
      {
        path: '/lmds/exception-group/detail',
        component: () => import('../routes/global-exception-group/detail'),
      },
    ],
  },
  {
    path: '/lmds/exception-assign', // 异常分配
    component: () => import('../routes/global-exception-assign/list'),
  },
  {
    path: '/lmds/inspection-item', // 检验项目
    component: () => import('../routes/global-inspection-item/list'),
  },
  {
    path: '/lmds/aps-ou', // 计划中心
    component: () => import('../routes/organization-aps-ou/list'),
  },
  {
    path: '/lmds/org-relation', // 组织关系
    component: () => import('../routes/organization-relation/list'),
  },
  {
    path: '/lmds/document-type', // 单据类型
    component: () => import('../routes/global-document-type/list'),
  },
  {
    path: '/lmds/inspection-group', // 检验项目组
    components: [
      {
        path: '/lmds/inspection-group/list',
        component: () => import('../routes/global-inspection-group/list'),
      },
      {
        path: '/lmds/inspection-group/create',
        component: () => import('../routes/global-inspection-group/detail'),
      },
      {
        path: '/lmds/inspection-group/detail/:inspectionGroupId',
        component: () => import('../routes/global-inspection-group/detail'),
      },
    ],
  },
  {
    path: '/lmds/aps-group', // 计划组
    component: () => import('../routes/organization-aps-group/list'),
  },
  {
    path: '/lmds/privilege', // 权限
    components: [
      {
        path: '/lmds/privilege/',
        component: () => import('../routes/global-privilege'),
        models: [() => import('../models/privilege')],
      },
      {
        path: '/lmds/privilege/line',
        component: () => import('../routes/global-privilege/line'),
      },
      {
        path: '/lmds/privilege/assign',
        component: () => import('../routes/global-privilege/assign'),
      },
    ],
  },
  {
    path: '/lmds/item-bom', // 物料BOM
    component: () => import('../routes/item-itembom/list'),
  },
  {
    path: '/lmds/bom', // bom
    components: [
      {
        path: '/lmds/bom/list',
        component: () => import('../routes/item-bom/list'),
      },
      {
        path: '/lmds/bom/create',
        component: () => import('../routes/item-bom/detail'),
      },
      {
        path: '/lmds/bom/detail/:bomId',
        component: () => import('../routes/item-bom/detail'),
      },
    ],
  },
  {
    path: '/lmds/tree-bom', // 树状bom
    component: () => import('../routes/tree-bom/list'),
  },
  {
    path: '/lmds/rule', // 规则
    components: [
      {
        path: '/lmds/rule/list',
        component: () => import('../routes/global-rule/list'),
      },
      {
        path: '/lmds/rule/create',
        component: () => import('../routes/global-rule/detail'),
      },
      {
        path: '/lmds/rule/detail/:ruleId',
        component: () => import('../routes/global-rule/detail'),
      },
    ],
  },
  {
    path: '/lmds/move-type', // 移动类型
    component: () => import('../routes/global-move-type/list'),
  },
  {
    path: '/lmds/customer', // 客户
    components: [
      {
        path: '/lmds/customer/list',
        component: () => import('../routes/sale-customer/list'),
      },
      {
        path: '/lmds/customer/create',
        component: () => import('../routes/sale-customer/detail'),
      },
      {
        path: '/lmds/customer/detail/:customerId',
        component: () => import('../routes/sale-customer/detail'),
      },
    ],
  },
  {
    path: '/lmds/andon', // 安灯
    component: () => import('../routes/andon/list'),
  },
  {
    path: '/lmds/andon-rank', // 安灯等级
    component: () => import('../routes/andon-rank/list'),
  },
  {
    path: '/lmds/andon-rule', // 安灯规则
    components: [
      {
        path: '/lmds/andon-rule/list',
        component: () => import('../routes/andon-rule/list'),
      },
      {
        path: '/lmds/andon-rule/create',
        component: () => import('../routes/andon-rule/detail'),
      },
      {
        path: '/lmds/andon-rule/detail/:andonRuleId',
        component: () => import('../routes/andon-rule/detail'),
      },
    ],
  },
  {
    path: '/lmds/andon-bin', // 安灯灯箱
    component: () => import('../routes/andon-bin/list'),
  },
  {
    path: '/lmds/andon-class', // 安灯类型
    component: () => import('../routes/andon-class/list'),
  },
  {
    path: '/lmds/rule-assign', // 规则分配
    components: [
      {
        path: '/lmds/rule-assign/list',
        component: () => import('../routes/global-rule-assign/list'),
      },
      {
        path: '/lmds/rule-assign/create',
        component: () => import('../routes/global-rule-assign/detail'),
      },
      {
        path: '/lmds/rule-assign/detail/:assignId',
        component: () => import('../routes/global-rule-assign/detail'),
      },
    ],
  },
  {
    path: '/lmds/item', // 物料
    components: [
      {
        path: '/lmds/item/list',
        component: () => import('../routes/item/list'),
      },
      {
        path: '/lmds/item/create',
        component: () => import('../routes/item/detail'),
      },
      {
        path: '/lmds/item/detail/:itemId',
        component: () => import('../routes/item/detail'),
      },
    ],
  },
  {
    path: '/lmds/item-multiplant', // 物料迭代版
    components: [
      {
        path: '/lmds/item-multiplant/list',
        component: () => import('../routes/item-bate/list'),
      },
      {
        path: '/lmds/item-multiplant/create',
        component: () => import('../routes/item-bate/detail'),
      },
      {
        path: '/lmds/item-multiplant/detail/:itemId',
        component: () => import('../routes/item-bate/detail'),
      },
    ],
  },
  {
    path: '/lmds/supplier', // 供应商
    components: [
      {
        path: '/lmds/supplier/list',
        component: () => import('../routes/purchase-supplier/list'),
      },
      {
        path: '/lmds/supplier/create',
        component: () => import('../routes/purchase-supplier/detail'),
      },
      {
        path: '/lmds/supplier/detail/:supplierId',
        component: () => import('../routes/purchase-supplier/detail'),
      },
    ],
  },
  {
    path: '/lmds/andon-exception', // 安灯异常
    component: () => import('../routes/andon-exception/list'),
  },
  {
    path: '/lmds/collector', // 数据收集项
    components: [
      {
        path: '/lmds/collector/list',
        component: () => import('../routes/technology-collector/list'),
      },
      {
        path: '/lmds/collector/create',
        component: () => import('../routes/technology-collector/detail'),
      },
      {
        path: '/lmds/collector/detail/:collectorId',
        component: () => import('../routes/technology-collector/detail'),
      },
    ],
  },
  {
    path: '/lmds/qualification', // 资质
    components: [
      {
        path: '/lmds/qualification/list',
        component: () => import('../routes/global-qualification/list'),
      },
      {
        path: '/lmds/qualification/create',
        component: () => import('../routes/global-qualification/detail'),
      },
      {
        path: '/lmds/qualification/detail/:qualificationId',
        component: () => import('../routes/global-qualification/detail'),
      },
    ],
  },
  {
    path: '/lmds/user-setting', // 用户设置
    components: [
      {
        path: '/lmds/user-setting/list',
        component: () => import('../routes/global-user-setting/list'),
      },
      {
        path: '/lmds/user-setting/create',
        component: () => import('../routes/global-user-setting/detail'),
      },
      {
        path: '/lmds/user-setting/detail/:settingId',
        component: () => import('../routes/global-user-setting/detail'),
      },
    ],
  },
  {
    path: '/lmds/tools', // 工装
    component: () => import('../routes/resource-tools/list'),
  },
  {
    path: '/lmds/cutter', // 刀具
    component: () => import('../routes/resource-cutter/list'),
  },
  {
    path: '/lmds/item-routing', // 产品工艺路线
    component: () => import('../routes/technology-item-routing/list'),
  },
  {
    path: '/lmds/gauge', // 量具
    component: () => import('../routes/resource-gauge/list'),
  },
  {
    path: '/lmds/spare-parts', // 备品备件
    component: () => import('../routes/resource-spare-parts/list'),
  },
  {
    path: '/lmds/operation', // 工序
    components: [
      {
        path: '/lmds/operation/list',
        component: () => import('../routes/technology-operation/list'),
      },
      {
        path: '/lmds/operation/create',
        component: () => import('../routes/technology-operation/detail'),
      },
      {
        path: '/lmds/operation/detail/:operationId',
        component: () => import('../routes/technology-operation/detail'),
      },
    ],
  },
  {
    path: '/lmds/period', // 时段
    components: [
      {
        path: '/lmds/period/list',
        component: () => import('../routes/global-period/list'),
      },
      {
        path: '/lmds/period/create',
        component: () => import('../routes/global-period/detail'),
      },
      {
        path: '/lmds/period/detail/:periodId',
        component: () => import('../routes/global-period/detail'),
      },
    ],
  },
  {
    path: '/lmds/resource-bom', // 资源BOM
    components: [
      {
        path: '/lmds/resource-bom/list',
        component: () => import('../routes/resource-bom/list'),
      },
      {
        path: '/lmds/resource-bom/create',
        component: () => import('../routes/resource-bom/detail'),
      },
      {
        path: '/lmds/resource-bom/detail/:resourceBomId',
        component: () => import('../routes/resource-bom/detail'),
      },
    ],
  },
  {
    path: '/lmds/routing', // 工艺路线
    components: [
      {
        path: '/lmds/routing/list',
        component: () => import('../routes/technology-routing/list'),
      },
      {
        path: '/lmds/routing/create',
        component: () => import('../routes/technology-routing/detail'),
      },
      {
        path: '/lmds/routing/detail/:routingId',
        component: () => import('../routes/technology-routing/detail'),
      },
      {
        path: '/lmds/routing/operation/:routingId/:routingOperationId',
        component: () => import('../routes/technology-routing/operation'),
      },
      {
        path: '/lmds/routing/operation-create/:routingId',
        component: () => import('../routes/technology-routing/operation'),
      },
    ],
  },
  {
    path: '/lmds/aps-switch-time/list', // 计划切换时间
    component: () => import('../routes/plan-aps-swith-time/list'),
  },
  {
    path: '/lmds/aps-resource-relation/list', // 计划资源关系
    component: () => import('../routes/plan-aps-resource-relation/list'),
  },
  {
    path: '/lmds/aps-resource/list', // 计划资源
    component: () => import('../routes/plan-aps-resource/list'),
  },
  {
    path: '/lmds/item-container/list', // 物料容器
    component: () => import('../routes/item-container/list'),
  },
  {
    path: '/lmds/customer-item/list', // 客户物料
    component: () => import('../routes/sale-customer-item/list'),
  },
  {
    path: '/lmds/inspection-template',
    components: [
      {
        path: '/lmds/inspection-template/list',
        component: () => import('../routes/global-inspection-template/list'),
      },
      {
        path: '/lmds/inspection-template/create',
        component: () => import('../routes/global-inspection-template/detail'),
      },
      {
        path: '/lmds/inspection-template/detail/:templateId',
        component: () => import('../routes/global-inspection-template/detail'),
      },
    ],
  },
  {
    path: '/lmds/psi-element-assign', // PSI要素分配
    components: [
      {
        path: '/lmds/psi-element-assign/list',
        component: () => import('../routes/global-psi-element-assign/list'),
      },
      {
        path: '/lmds/psi-element-assign/initial',
        component: () => import('../routes/global-psi-element-assign/initial'),
      },
    ],
  },
  {
    path: '/lmds/resource-container/list', // 容器
    component: () => import('../routes/resource-container/list'),
  },
  {
    path: '/lmds/item-asl/list', // 货源清单
    component: () => import('../routes/purchase-item-asl/list'),
  },
  {
    path: '/lmds/resource-tpm', // 资源TPM设置
    component: () => import('../routes/resource-tpm/list'),
  },
  {
    path: '/lmds/event', // 事件查询
    components: [
      {
        path: '/lmds/event/list',
        component: () => import('../routes/global-event/list'),
      },
      {
        path: '/lmds/event/detail/:eventId',
        component: () => import('../routes/global-event/detail'),
      },
    ],
  },
  {
    path: '/lmds/transaction/list', // 事务查询
    component: () => import('../routes/global-transaction/list'),
  },
  {
    path: '/lmds/configuration-category', // 配置类别
    component: () => import('../routes/configuration-category'),
  },
  {
    path: '/lmds/configuration-template', // 配置模版
    components: [
      {
        path: '/lmds/configuration-template/list', // 配置模版
        component: () => import('../routes/configuration-template'),
      },
      {
        path: '/lmds/configuration-template/detail/:id', // 配置模版明细
        component: () => import('../routes/configuration-template/ConfigurationTemplateDetail'),
        models: [() => import('../models/configurationModel')],
      },
    ],
  },
  {
    path: '/lmds/configuration-assign', // 配置分配
    components: [
      {
        path: '/lmds/configuration-assign/list', // 配置分配
        component: () => import('../routes/configuration-assign'),
      },
      {
        path: '/lmds/configuration-assign/detail/:id', // 配置分配明细
        component: () => import('../routes/configuration-assign/ConfigurationAssignDetail'),
        models: [() => import('../models/configurationModel')],
      },
    ],
  },
  {
    path: '/lmds/environment', // 海马汇 API 配置
    component: () => import('../routes/environment/list'),
    authorized: true,
    title: 'API配置',
  },
  {
    path: '/lmds/cost-center', // 成本中心
    component: () => import('../routes/organization-cost-center/list'),
  },
  {
    path: '/lmds/resource-tracking', // 资源跟踪
    components: [
      {
        path: '/lmds/resource-tracking/list',
        component: () => import('../routes/resource-tracking/list'),
      },
      {
        path: '/lmds/resource-tracking/print/:templateCode',
        component: () => import('../routes/resource-tracking/print'),
      },
    ],
  },
  {
    path: '/lmds/resource-feeder', // 飞达
    components: [
      {
        path: '/lmds/resource-feeder/list',
        component: () => import('../routes/resource-feeder/list'),
      },
      {
        path: '/lmds/resource-feeder/detail/:feederId',
        component: () => import('../routes/resource-feeder/detail'),
      },
    ],
  },
  {
    path: '/lmds/resource-feeder-trolley', // 飞达料车
    components: [
      {
        path: '/lmds/resource-feeder-trolley/list',
        component: () => import('../routes/resource-feeder-trolley/list'),
      },
      {
        path: '/lmds/resource-feeder-trolley/detail/:trolleyId',
        component: () => import('../routes/resource-feeder-trolley/detail'),
      },
    ],
  },
  {
    path: '/lmds/item-smd', // SMD清单
    components: [
      {
        path: '/lmds/item-smd/list',
        component: () => import('../routes/item-smd/list'),
      },
      {
        path: '/lmds/item-smd/create',
        component: () => import('../routes/item-smd/detail'),
      },
      {
        path: '/lmds/item-smd/detail/:smdHeaderId',
        component: () => import('../routes/item-smd/detail'),
      },
    ],
  },
  {
    path: '/lmds/technology-drawing-management', // 图纸管理
    components: [
      {
        path: '/lmds/technology-drawing-management/list',
        component: () => import('../routes/technology-drawing-management/list'),
      },
      {
        path: '/lmds/technology-drawing-management/edit',
        component: () => import('../routes/technology-drawing-management/edit'),
      },
      {
        path: '/lmds/technology-drawing-management/edit/:drawingId',
        component: () => import('../routes/technology-drawing-management/edit'),
      },
    ],
  },
  {
    path: '/lmds/technology-drawing-query', // 图纸查看
    component: () => import('../routes/technology-drawing-query'),
    authorized: true,
    title: '图纸查看',
  },
  {
    path: '/lmds/technology-esop-query', // sop
    component: () => import('../routes/technology-esop-query'),
    authorized: true,
    title: 'sop',
  },
  {
    path: '/lmds/technology-esop-platform', // esop平台
    components: [
      {
        path: '/lmds/technology-esop-platform/list',
        component: () => import('../routes/technology-esop-platform/list'),
      },
      {
        path: '/lmds/technology-esop-platform/create',
        component: () => import('../routes/technology-esop-platform/edit'),
      },
      {
        path: '/lmds/technology-esop-platform/edit/:drawingId',
        component: () => import('../routes/technology-esop-platform/edit'),
      },
    ],
  },
  {
    path: '/pub/lmds/technology-esop-platform/process/:drawingId', // esop平台审批流
    component: () => import('../routes/technology-esop-platform/edit'),
    authorized: true,
  },
  {
    path: '/lmds/unit-price',
    components: [
      {
        path: '/lmds/unit-price/list',
        component: () => import('../routes/unitPrice/index'),
      },
      {
        path: '/lmds/unit-price/create',
        component: () => import('../routes/unitPrice/details/index'),
      },
      {
        path: '/lmds/unit-price/edit/:workPriceId',
        component: () => import('../routes/unitPrice/details/index'),
      },
    ],
  },
  {
    path: '/lmds/white', // 租户白名单
    component: () => import('../routes/white'),
  },
  {
    path: '/lmds/sys-tools', // 租户白名单
    component: () => import('../routes/system-tool'),
  },
  {
    path: '/lmds/kitting-set', // 齐套配置
    components: [
      {
        path: '/lmds/kitting-set/list',
        component: () => import('../routes/item-kitting-set/list'),
      },
      {
        path: '/lmds/kitting-set/create',
        component: () => import('../routes/item-kitting-set/detail'),
      },
      {
        path: '/lmds/kitting-set/detail/:kittingSetId',
        component: () => import('../routes/item-kitting-set/detail'),
      },
    ],
  },
  {
    path: '/lmds/production-program', // 生产程序
    components: [
      {
        path: '/lmds/production-program/list',
        component: () => import('../routes/production-program/list'),
      },
      {
        path: '/lmds/production-program/edit',
        component: () => import('../routes/production-program/edit'),
      },
      {
        path: '/lmds/production-program/edit/:drawingId',
        component: () => import('../routes/production-program/edit'),
      },
    ],
    authorized: true,
    title: '程序管理',
  },
  {
    path: '/lmds/task-processing', // 任务处理
    component: () => import('../routes/task-processing/list'),
    authorized: true,
    title: '任务处理',
  },
];

export default config;
