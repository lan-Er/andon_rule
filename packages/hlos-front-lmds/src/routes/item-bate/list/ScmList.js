/**
 * @Description: 物料采购页面管理信息--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-27 10:35:43
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
import ScmListDS from '../stores/ScmListDS';

const preCode = 'lmds.item.model';
const commonCode = 'lmds.common.model';

@connect((state) => state)
@withProps(
  () => {
    const tableDS = new DataSet({
      ...ScmListDS(),
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
export default class ScmList extends PureComponent {
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
    const queryContainer = document.getElementsByClassName('item-bate-list-scm-query')[0];
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
        dataIndex: 'organizationName',
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
        title: intl.get(`${preCode}.scmOuName`).d('采购中心'),
        resizable: true,
        dataIndex: 'scmOuName',
        width: 150,
        fixed: 'left',
      },
      {
        title: intl.get(`${preCode}.itemScmType`).d('物料采购类型'),
        resizable: true,
        dataIndex: 'itemScmTypeMeaning',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.scmCategory`).d('物料采购类别'),
        resizable: true,
        dataIndex: 'scmCategoryName',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.buyer`).d('采购员'),
        resizable: true,
        dataIndex: 'buyerName',
        width: 150,
      },
      {
        title: intl.get(`${commonCode}.uom`).d('单位'),
        resizable: true,
        dataIndex: 'uomName',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.scmPlanRule`).d('供应链计划规则'),
        resizable: true,
        dataIndex: 'scmPlanRuleMeaning',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.eoq`).d('经济订货批量'),
        resizable: true,
        dataIndex: 'eoq',
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
        title: intl.get(`${preCode}.fixedLotFlag`).d('固定批次'),
        resizable: true,
        dataIndex: 'fixedLotFlag',
        width: 150,
        align: 'center',
        render: ({ rowData }) => <CheckBox disabled checked={rowData.fixedLotFlag} />,
      },
      {
        resizable: true,
        dataIndex: 'vmiFlag',
        title: 'VMI',
        width: 150,
        align: 'center',
        render: ({ rowData }) => <CheckBox disabled checked={rowData.vmiFlag} />,
      },
      {
        title: intl.get(`${preCode}.marketPrice`).d('市场价格'),
        resizable: true,
        dataIndex: 'marketPrice',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.purchasePrice`).d('采购价格'),
        resizable: true,
        dataIndex: 'purchasePrice',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.taxable`).d('含税'),
        resizable: true,
        dataIndex: 'taxable',
        width: 150,
        render: ({ rowData }) => <CheckBox disabled checked={rowData.taxable} />,
      },
      {
        title: intl.get(`${preCode}.currency`).d('币种'),
        resizable: true,
        dataIndex: 'currencyName',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.priceTolerance`).d('价格允差'),
        resizable: true,
        dataIndex: 'priceTolerance',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.receiveToleranceType`).d('收货允差类型'),
        resizable: true,
        dataIndex: 'receiveToleranceTypeMeaning',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.receiveTolerance`).d('收货允差'),
        resizable: true,
        dataIndex: 'receiveTolerance',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.invoiceTolerance`).d('开票允差'),
        resizable: true,
        dataIndex: 'invoiceTolerance',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.aslFlag`).d('合格供应商'),
        resizable: true,
        dataIndex: 'aslFlag',
        width: 150,
        render: ({ rowData }) => <CheckBox disabled checked={rowData.aslFlag} />,
      },
      {
        title: intl.get(`${preCode}.rfqFlag`).d('报价'),
        resizable: true,
        dataIndex: 'rfqFlag',
        width: 150,
        render: ({ rowData }) => <CheckBox disabled checked={rowData.rfqFlag} />,
      },
      {
        title: intl.get(`${preCode}.bondedFlag`).d('保税物料'),
        resizable: true,
        dataIndex: 'bondedFlag',
        width: 150,
        render: ({ rowData }) => <CheckBox disabled checked={rowData.bondedFlag} />,
      },
      {
        title: intl.get(`${preCode}.maxDayOrder`).d('最大日供量'),
        resizable: true,
        dataIndex: 'maxDayOrder',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.leadTime`).d('采购提前期'),
        resizable: true,
        dataIndex: 'leadTime',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.receiveRule`).d('接收入库规则'),
        resizable: true,
        dataIndex: 'receiveRuleMeaning',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.receiveWarehouse`).d('默认接收仓库'),
        resizable: true,
        dataIndex: 'receiveWarehouseName',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.receiveWmArea`).d('默认接收货位'),
        resizable: true,
        dataIndex: 'receiveWmAreaName',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.inventoryWarehouse`).d('默认入库仓库'),
        resizable: true,
        dataIndex: 'inventoryWarehouseName',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.inventoryWmArea`).d('默认入库货位'),
        resizable: true,
        dataIndex: 'inventoryWmAreaName',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.defaultSupplier`).d('默认供应商'),
        resizable: true,
        dataIndex: 'supplierName',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.defaultSupplierItem`).d('默认供应商物料'),
        resizable: true,
        dataIndex: 'supplierItemCode',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.defaultSupplierItemDesc`).d('默认供应商物料描述'),
        resizable: true,
        dataIndex: 'supplierItemDesc',
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
      JSON.stringify({ meOuId: rowData.meOuId })
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
        <div className="item-bate-list-scm-query">
          <TableQueryFrom
            dataSet={this.props.tableDS.queryDataSet}
            showNumber={3}
            onClickQueryCallback={this.handleSearch}
          >
            <Lov name="meOuObj" />
            <TextField name="itemCode" />
            <TextField name="description" />
            <Lov name="itemCategoryObj" />
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
