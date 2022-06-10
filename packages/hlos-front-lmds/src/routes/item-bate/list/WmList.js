/**
 * @Description: 物料仓储页面管理信息--Index
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
import TableQueryFrom from 'hlos-front/lib/components/TableQueryFrom';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import WmListDS from '../stores/WmListDS';

const preCode = 'lmds.item.model';
const commonCode = 'lmds.common.model';

@connect((state) => state)
@withProps(
  () => {
    const tableDS = new DataSet({
      ...WmListDS(),
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
export default class WmList extends PureComponent {
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
    const queryContainer = document.getElementsByClassName('item-bate-list-wm-query')[0];
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
        title: intl.get(`${preCode}.wmOu`).d('仓储中心'),
        resizable: true,
        dataIndex: 'wmOuName',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.itemWmType`).d('物料仓储类型'),
        resizable: true,
        dataIndex: 'itemWmTypeMeaning',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.wmCategory`).d('物料仓储类别'),
        resizable: true,
        dataIndex: 'wmCategoryName',
        width: 150,
      },
      {
        title: intl.get(`${commonCode}.uom`).d('单位'),
        resizable: true,
        dataIndex: 'uomName',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.wmWorker`).d('仓库管理员工'),
        resizable: true,
        dataIndex: 'wmWorkerName',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.abcType`).d('ABC分类'),
        resizable: true,
        dataIndex: 'abcTypeMeaning',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.sequenceLotControl`).d('序列/批次控制'),
        resizable: true,
        dataIndex: 'sequenceLotControlMeaning',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.tagFlag`).d('条码管理'),
        resizable: true,
        dataIndex: 'tagFlag',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.reservationRule`).d('预留规则'),
        resizable: true,
        dataIndex: 'reservationRuleName',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.fifoRule`).d('FIFO规则'),
        resizable: true,
        dataIndex: 'fifoRuleName',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.storageRule`).d('上架规则'),
        resizable: true,
        dataIndex: 'storageRuleName',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.pickRule`).d('拣货规则'),
        resizable: true,
        dataIndex: 'pickRuleName',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.replenishRule`).d('补货规则'),
        resizable: true,
        dataIndex: 'replenishRuleName',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.waveDeliveryRule`).d('波次规则'),
        resizable: true,
        dataIndex: 'waveDeliveryRuleName',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.packingRule`).d('装箱规则'),
        resizable: true,
        dataIndex: 'packingRuleName',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.wmInspectRule`).d('仓库质检规则'),
        resizable: true,
        dataIndex: 'wmInspectRuleName',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.cycleCountRule`).d('循环盘点规则'),
        resizable: true,
        dataIndex: 'cycleCountRuleName',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.economicQty`).d('经济批量'),
        resizable: true,
        dataIndex: 'economicQty',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.storageMinQty`).d('存储下限'),
        resizable: true,
        dataIndex: 'storageMinQty',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.storageMaxQty`).d('存储上限'),
        resizable: true,
        dataIndex: 'storageMaxQty',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.packingFormat`).d('包装方式'),
        resizable: true,
        dataIndex: 'packingFormatMeaning',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.packingMaterial`).d('包装材料'),
        resizable: true,
        dataIndex: 'packingMaterial',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.minPackingQty`).d('最小包装数'),
        resizable: true,
        dataIndex: 'minPackingQty',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.packingQty`).d('包装数'),
        resizable: true,
        dataIndex: 'packingQty',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.containerQty`).d('装箱数'),
        resizable: true,
        dataIndex: 'containerQty',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.palletContainerQty`).d('托盘箱数'),
        resizable: true,
        dataIndex: 'palletContainerQty',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.storageWarehouse`).d('上架仓库'),
        resizable: true,
        dataIndex: 'storageWarehouseName',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.storageWmArea`).d('上架货位'),
        resizable: true,
        dataIndex: 'storageWmAreaName',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.storageWmUnit`).d('上架货格'),
        resizable: true,
        dataIndex: 'storageWmUnitCode',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.pickWarehouse`).d('拣货仓库'),
        resizable: true,
        dataIndex: 'pickWarehouseName',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.pickWmArea`).d('拣货货位'),
        resizable: true,
        dataIndex: 'pickWmAreaName',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.pickWmUnit`).d('拣货货格'),
        resizable: true,
        dataIndex: 'pickWmUnitCode',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.expireControlFlag`).d('有效期控制'),
        resizable: true,
        dataIndex: 'expireControlFlag',
        align: 'center',
        render: ({ rowData }) => <CheckBox disabled checked={rowData.expireControlFlag} />,
        width: 150,
      },
      {
        title: intl.get(`${preCode}.expireControlType`).d('有效期控制类型'),
        resizable: true,
        dataIndex: 'expireControlTypeMeaning',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.expireDays`).d('有效期'),
        resizable: true,
        dataIndex: 'expireDays',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.expireAlertDays`).d('预警期'),
        resizable: true,
        dataIndex: 'expireAlertDays',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.expireLeadDays`).d('出库提前期'),
        resizable: true,
        dataIndex: 'expireLeadDays',
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
        <div className="item-bate-list-wm-query">
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
