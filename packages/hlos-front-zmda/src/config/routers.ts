import { RoutersConfig } from 'hzero-boot/lib/typings/IRouterConfig';

const config: RoutersConfig = [
  {
    path: '/zmda/item',
    component: () => import('../routes/Item'),
    authorized: true,
    title: '物料',
  },
  {
    path: '/zmda/item-search',
    component: () => import('../routes/item-search'),
    authorized: true,
    title: '物料',
  },
  {
    path: '/zmda/core-company-item',
    component: () => import('../routes/core-company-item'),
    authorized: true,
    title: '核企物料',
  },
  {
    path: '/zmda/customer',
    component: () => import('../routes/customer'),
    authorized: true,
    title: '客户',
  },
  {
    path: '/zmda/supplier',
    component: () => import('../routes/supplier'),
    authorized: true,
    title: '供应商',
  },
  {
    path: '/zmda/customer-item',
    component: () => import('../routes/customer-item'),
    authorized: true,
    title: '客户物料',
  },
  {
    path: '/zmda/enterprise',
    component: () => import('../routes/organization-enterprise/list'),
    authorized: true,
    title: '集团',
  },
  {
    path: '/zmda/organization',
    component: () => import('../routes/organization/list'),
    authorized: true,
    title: '组织',
  },
  {
    path: '/zmda/meou',
    component: () => import('../routes/organization-me-ou/list'),
    authorized: true,
    title: '工厂',
  },
  {
    path: '/zmda/me-area',
    component: () => import('../routes/organization-me-area/list'),
    authorized: true,
    title: '车间',
  },
  {
    path: '/zmda/wm-ou',
    component: () => import('../routes/organization-wm-ou/list'),
    authorized: true,
    title: '仓储中心',
  },
  {
    path: '/zmda/warehouse',
    component: () => import('../routes/organization-warehouse/list'),
    authorized: true,
    title: '仓库',
  },
  {
    path: '/zmda/sop-ou',
    component: () => import('../routes/organization-sop-ou/list'),
    authorized: true,
    title: '销售中心',
  },
  {
    path: '/zmda/sop-group',
    component: () => import('../routes/organization-sop-group/list'),
    authorized: true,
    title: '销售组',
  },
  {
    path: '/zmda/resource',
    component: () => import('../routes/resource'),
    authorized: true,
    title: '资源',
  },
  {
    path: '/zmda/workcell',
    component: () => import('../routes/resource-workcell'),
    authorized: true,
    title: '工作单元',
  },
  {
    path: '/zmda/equipment',
    component: () => import('../routes/resource-equipment'),
    authorized: true,
    title: '设备',
  },
  {
    path: '/zmda/prod-line',
    component: () => import('../routes/resource-prod-line'),
    authorized: true,
    title: '生产线',
  },
  {
    path: '/zmda/tenant-affiliation-supplier',
    component: () => import('../routes/tenant-affiliation-supplier/indexTree'),
    authorized: true,
    title: '租户隶属关系配置',
  },
  {
    path: '/zmda/warehouse-receive',
    component: () => import('../routes/warehouse-receive/list'),
    authorized: true,
    title: '仓库收货信息维护',
  },
  {
    path: '/zmda/warehouse-receive-personalise',
    component: () => import('../routes/warehouse-receive-personalise/list'),
    authorized: true,
    title: '仓库收货信息维护个性化',
  },
  {
    path: '/zmda/org-info',
    component: () => import('../routes/org-info'),
    components: [
      {
        path: '/zmda/org-info/group',
        component: () => import('../routes/org-info/group/list'),
      },
      {
        path: '/zmda/org-info/company',
        component: () => import('../routes/org-info/company/list'),
      },
      {
        path: '/zmda/org-info/operation-unit',
        component: () => import('../routes/org-info/operation-unit/list'),
      },
      {
        path: '/zmda/org-info/inventory-org',
        component: () => import('../routes/org-info/inventory-org/list'),
      },
      {
        path: '/zmda/org-info/store-room',
        component: () => import('../routes/org-info/store-room/list'),
      },
      {
        path: '/zmda/org-info/library-position',
        component: () => import('../routes/org-info/library-position/list'),
      },
    ],
    authorized: true,
    title: '组织信息',
  },
  {
    path: '/zmda/uom',
    component: () => import('../routes/uom/list'),
    authorized: true,
    title: '单位',
  },
  {
    path: '/zmda/item-maindata',
    authorized: true,
    title: '物料',
    components: [
      {
        path: '/zmda/item-maindata/list',
        component: () => import('../routes/item-maindata/list'),
      },
      {
        path: '/zmda/item-maindata/:type/:itemId?',
        component: () => import('../routes/item-maindata/detail'),
      },
    ],
  },
  {
    path: '/zmda/supplier-maintain',
    authorized: true,
    title: '供应商',
    components: [
      {
        path: '/zmda/supplier-maintain/list',
        component: () => import('../routes/supplier-maintain/list'),
      },
      {
        path: '/zmda/supplier-maintain/:type/:supplierId?',
        component: () => import('../routes/supplier-maintain/create'),
      },
    ],
  },
  {
    path: '/zmda/customer-maintain',
    authorized: true,
    title: '客户',
    components: [
      {
        path: '/zmda/customer-maintain/list',
        component: () => import('../routes/customer-maintain/list'),
      },
      {
        path: '/zmda/customer-maintain/:type/:customerId?',
        component: () => import('../routes/customer-maintain/create'),
      },
    ],
  },
  {
    path: '/zmda/item-key-attribute',
    authorized: true,
    title: '物料关键属性',
    components: [
      {
        path: '/zmda/item-key-attribute/list',
        component: () => import('../routes/item-key-attribute/list'),
      },
      {
        path: '/zmda/item-key-attribute/:type/:attributeId?',
        component: () => import('../routes/item-key-attribute/detail'),
      },
    ],
  },
  {
    path: '/zmda/category-set', // 类别集
    authorized: true,
    title: '类别',
    components: [
      {
        path: '/zmda/category-set/list',
        component: () => import('../routes/global-category-set/list'),
      },
      {
        path: '/zmda/category-set/detail',
        component: () => import('../routes/global-category-set/detail'),
      },
    ],
  },
  {
    path: '/zmda/configuration-center',
    authorized: true,
    title: '配置中心',
    component: () => import('../routes/configuration-center'),
    components: [
      {
        path: '/zmda/configuration-center/delivery',
        component: () => import('../routes/configuration-center/delivery'),
      },
      {
        path: '/zmda/configuration-center/news',
        component: () => import('../routes/configuration-center/news'),
      },
      {
        path: '/zmda/configuration-center/template',
        component: () => import('../routes/configuration-center/template'),
      },
    ],
  },
];

export default config;
