const mockjs = require('mockjs');

const data = [
  {
    'companyName': "0001",//公司名称
    'customerName': '张三',//客户名称
    'sellNumber': '1234566374987865',//销售订单号
    'itemCode': 'ico',//物料
    'itemDesc': '苹果',//物料描述
    'orderQuantityUom': '个',//产品单位
    'orderQuantity': '32',//数量
    'unitSellingPrice': '5',//销售单价
    'price': '160',//金额
    'description':'备注一',//备注
    'orderState':'New',//订单状态
    'creationDate':'2021-01-07',//订单日期
    'orderMoney':'213'//订单金额
  },
  {
    'companyName': "0002",//公司名称
    'customerName': '成都市',//客户名称
    'sellNumber': '1293867890987865',//销售订单号
    'itemCode': 'ico',//物料
    'itemDesc': '苹果',//物料描述
    'orderQuantityUom': '个',//产品单位
    'orderQuantity': '32',//数量
    'unitSellingPrice': '5',//销售单价
    'price': '160',//金额
    'description':'备注一',//备注
    'orderState':'New',//订单状态
    'creationDate':'2021-01-06',//订单日期
    'orderMoney':'123'//订单金额
  },
  {
    'companyName': "0003",//公司名称
    'customerName': '非额',//客户名称
    'sellNumber': '1234567899486865',//销售订单号
    'itemCode': 'ico',//物料
    'itemDesc': '苹果',//物料描述
    'orderQuantityUom': '个',//产品单位
    'orderQuantity': '32',//数量
    'unitSellingPrice': '5',//销售单价
    'price': '160',//金额
    'description':'备注一',//备注
    'orderState':'New',//订单状态
    'creationDate':'2021-01-05',//订单日期
    'orderMoney':'223'//订单金额
  },{
    'companyName': "0004",//公司名称
    'customerName': '方式',//客户名称
    'sellNumber': '8374567890987865',//销售订单号
    'itemCode': 'ico',//物料
    'itemDesc': '苹果',//物料描述
    'orderQuantityUom': '个',//产品单位
    'orderQuantity': '32',//数量
    'unitSellingPrice': '5',//销售单价
    'price': '160',//金额
    'description':'备注一',//备注
    'orderState':'New',//订单状态
    'creationDate':'2021-01-04',//订单日期
    'orderMoney':'233'//订单金额
  },{
    'companyName': "0005",//公司名称
    'customerName': '方式非',//客户名称
    'sellNumber': '1565567890989865',//销售订单号
    'itemCode': 'ico',//物料
    'itemDesc': '苹果',//物料描述
    'orderQuantityUom': '个',//产品单位
    'orderQuantity': '32',//数量
    'unitSellingPrice': '5',//销售单价
    'price': '160',//金额
    'description':'备注一',//备注
    'orderState':'New',//订单状态
    'creationDate':'2021-01-03',//订单日期
    'orderMoney':'232'//订单金额
  },{
    'companyName': "0006",//公司名称
    'customerName': '隔热',//客户名称
    'sellNumber': '10987890987865',//销售订单号
    'itemCode': 'ico',//物料
    'itemDesc': '苹果',//物料描述
    'orderQuantityUom': '个',//产品单位
    'orderQuantity': '32',//数量
    'unitSellingPrice': '5',//销售单价
    'price': '160',//金额
    'description':'备注一',//备注
    'orderState':'New',//订单状态
    'creationDate':'2021-01-02',//订单日期
    'orderMoney':'234'//订单金额
  },
]

module.exports = {
  name: 'order',
  desc: 'order service',
  apis: [
    {
      name: 'query',
      desc: '获取数据',
      method: 'GET',
      url: `/_api/index-page/query`,
      handle(req) {
        // 分页和查询
        const { query = {} } = req;
        const filterFun = (obj) =>
          Object.entries(query).every(([key, value]) =>
            obj[key] ? obj[key].toString().match(value) : true
          );
        const [page, size] = [Number(query.page), Number(query.size)];
        return {
          status: 200,
          data: {
            content: data.filter(filterFun).slice(page * size, (page + 1) * size),//使用了过滤器
            totalElements: data.length,
            success:true,
          }
        }
      },
    },
  ]
}