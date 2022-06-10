/**
 * @Description: 物料销售页面管理信息--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-28 15:31:46
 * @LastEditors: yu.na
 */

import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Bind } from 'lodash-decorators';
import {
  DataSet,
  Button,
  PerformanceTable,
  Pagination,
  Lov,
  TextField,
  Select,
  CheckBox,
} from 'choerodon-ui/pro';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import withProps from 'utils/withProps';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import TableQueryFrom from 'hlos-front/lib/components/TableQueryFrom';
import SopListDS from '../stores/SopListDS';

const preCode = 'lmds.item.model';
const commonCode = 'lmds.common.model';

@connect((state) => state)
@withProps(
  () => {
    const tableDS = new DataSet({
      ...SopListDS(),
      autoQuery: true,
    });
    return {
      tableDS,
    };
  },
  { cacheState: true }
)
@formatterCollections({
  code: ['lmds.item', 'lmds.common'],
})
export default class SopList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showLoading: false,
      currentPage: 1,
      size: 100,
      totalElements: 0,
      dataSource: [],
      tableHeight: 80,
    };
  }

  componentDidMount() {
    this.handleSearch(1, 100);
  }

  /**
   * 查询
   */
  @Bind()
  async handleSearch(page = this.state.currentPage, pageSize = this.state.size) {
    this.setState({ showLoading: true });
    if (this.props.tableDS && this.props.tableDS.queryDataSet.current) {
      this.props.tableDS.queryDataSet.current.set('page', page - 1);
      this.props.tableDS.queryDataSet.current.set('size', pageSize);
    }

    const res = await this.props.tableDS.query();

    if (res && res.content) {
      this.setState({
        dataSource: res.content,
        totalElements: res.totalElements || 0,
      });
      this.calcTableHeight(res.content.length);
      this.props.setExportQueryParams(this.props.tableDS.queryDataSet.current.data);
    }
    this.setState({ showLoading: false });
  }

  calcTableHeight = (dataLength) => {
    const pageContainer = document.getElementsByClassName('item-bate-list-content')[0];
    const queryContainer = document.getElementsByClassName('item-bate-list-sop-query')[0];
    const maxTableHeight = pageContainer.offsetHeight - queryContainer.offsetHeight - 127;
    if (dataLength === 0) {
      // 无数据时设置表格高度为80
      this.setState({ tableHeight: 80 });
    } else if (dataLength * 33 < maxTableHeight) {
      // 数据量较少时按数据量显示高度 30：行高度，33：表格高度, 10: 滚动条高度
      this.setState({ tableHeight: dataLength * 30 + 33 + 10 });
    } else {
      this.setState({ tableHeight: maxTableHeight });
    }
  };

  @Bind()
  handlePageChange = (page, pageSize) => {
    // 当切换展示数量时，回到第一页
    let pageValue = page;
    const pageSizeValue = pageSize;
    if (pageSize !== this.state.size) {
      pageValue = 1;
    }
    this.setState({
      currentPage: pageValue,
      size: pageSizeValue,
    });
    this.handleSearch(pageValue, pageSizeValue);
  };

  get columns() {
    return [
      {
        title: intl.get(`${preCode}.meOu`).d('工厂'),
        resizable: true,
        dataIndex: 'meOuName',
        width: 150,
        fixed: 'left',
      },
      {
        title: intl.get(`${preCode}.itemCode`).d('物料编码'),
        resizable: true,
        dataIndex: 'itemCode',
        width: 150,
        fixed: 'left',
      },
      {
        title: intl.get(`${commonCode}.itemDesc`).d('物料描述'),
        resizable: true,
        dataIndex: 'description',
        width: 150,
        fixed: 'left',
      },
      {
        title: intl.get(`${preCode}.apsOu`).d('仓储中心'),
        resizable: true,
        dataIndex: 'apsOuName',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.itemSopType`).d('物料销售类型'),
        resizable: true,
        dataIndex: 'itemSopTypeMeaning',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.sopCategory`).d('物料销售类别'),
        resizable: true,
        dataIndex: 'sopCategoryName',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.salesman`).d('销售员'),
        resizable: true,
        dataIndex: 'salesmanName',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.salesUom`).d('销售单位'),
        resizable: true,
        dataIndex: 'uomName',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.sopPlanRule`).d('销售计划规则'),
        resizable: true,
        dataIndex: 'sopPlanRuleMeaning',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.forecastRule`).d('销售预测规则'),
        resizable: true,
        dataIndex: 'forecastRuleName',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.minStockQty`).d('最小库存量'),
        resizable: true,
        dataIndex: 'minStockQty',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.maxStockQty`).d('最大库存量'),
        resizable: true,
        dataIndex: 'maxStockQty',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.safetyStockQty`).d('安全库存量'),
        resizable: true,
        dataIndex: 'safetyStockQty',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.roundQty`).d('圆整包装数量'),
        resizable: true,
        dataIndex: 'roundQty',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.minStartOrderQty`).d('最小起订量'),
        resizable: true,
        dataIndex: 'minOrderQty',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.maxStartOrderQty`).d('最大起订量'),
        resizable: true,
        dataIndex: 'maxOrderQty',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.fixedOrderQty`).d('固定订货量'),
        resizable: true,
        dataIndex: 'fixedOrderQty',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.fixedOrderLotFlag`).d('固定订货标识'),
        resizable: true,
        dataIndex: 'fixedLotFlag',
        width: 150,
        align: 'center',
        render: ({ rowData }) => <CheckBox disabled checked={rowData.fixedLotFlag} />,
      },
      {
        title: intl.get(`${preCode}.deliveryLeadTime`).d('交货提前期'),
        resizable: true,
        dataIndex: 'deliveryLeadTime',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.priceListFlag`).d('启用价目表'),
        resizable: true,
        dataIndex: 'priceListFlag',
        width: 150,
        align: 'center',
        render: ({ rowData }) => <CheckBox disabled checked={rowData.priceListFlag} />,
      },
      {
        title: intl.get(`${preCode}.priceList`).d('价目表'),
        resizable: true,
        dataIndex: 'priceList',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.shipRule`).d('发运规则'),
        resizable: true,
        dataIndex: 'shipRuleName',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.transportType`).d('运输方式'),
        resizable: true,
        dataIndex: 'transportTypeMeaning',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.maxDayOrder`).d('最大日供量'),
        resizable: true,
        dataIndex: 'maxDayOrder',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.shipWm`).d('默认发货仓库'),
        resizable: true,
        dataIndex: 'shipWarehouseName',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.shipWmArea`).d('默认发货货位'),
        resizable: true,
        dataIndex: 'shipWmAreaName',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.defaultCustomer`).d('默认客户'),
        resizable: true,
        dataIndex: 'customerName',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.defaultCustomerItem`).d('默认客户物料'),
        resizable: true,
        dataIndex: 'customerItemCode',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.defaultCustomerItemDesc`).d('默认客户物料描述'),
        resizable: true,
        dataIndex: 'customerItemDesc',
        width: 150,
      },
      {
        title: intl.get(`${commonCode}.enabledFlag`).d('是否有效'),
        resizable: true,
        dataIndex: 'enabledFlag',
        width: 150,
        render: yesOrNoRender,
      },
      {
        title: '操作',
        fixed: 'right',
        render: ({ rowData }) => (
          <Button
            color="primary"
            funcType="flat"
            onClick={() => this.handleToDetailPage('/lmds/item-multiplant/detail', rowData)}
          >
            编辑
          </Button>
        ),
      },
    ];
  }

  /**
   *
   *跳转到详情
   * @param recode
   * @param service
   * @param e
   */
  @Bind()
  handleToDetailPage(url, rowData, e) {
    if (e) e.stopPropagation();
    sessionStorage.setItem(
      'item-bate-detail-before-meouObj',
      JSON.stringify({
        meOuId: rowData.meOuId,
        meOuCode: rowData.meOuCode,
        meOuName: rowData.meOuName,
      })
    );
    this.props.dispatch(
      routerRedux.push({
        pathname: `${url}/${rowData.itemId}`,
      })
    );
  }

  render() {
    const { showLoading, currentPage, size, totalElements, dataSource, tableHeight } = this.state;

    return (
      <Fragment>
        <div className="item-bate-list-sop-query">
          <TableQueryFrom
            dataSet={this.props.tableDS.queryDataSet}
            showNumber={3}
            onClickQueryCallback={this.handleSearch}
          >
            <Lov name="meOuObj" />
            <TextField name="itemCode" />
            <TextField name="description" />
            <Select name="enabledFlag" />
          </TableQueryFrom>
        </div>
        <PerformanceTable
          virtualized
          rowKey="lotId"
          data={dataSource}
          columns={this.columns}
          height={tableHeight}
          loading={showLoading}
        />
        <div style={{ textAlign: 'right' }}>
          <Pagination
            pageSizeOptions={['100', '200', '500', '1000', '5000', '10000']}
            total={totalElements}
            onChange={this.handlePageChange}
            pageSize={size}
            page={currentPage}
          />
        </div>
      </Fragment>
    );
  }
}
