/**
 * @Description: 物料计划页面管理信息--Index
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
import ApsListDS from '../stores/ApsListDS';

const preCode = 'lmds.item.model';
const commonCode = 'lmds.common.model';

@connect((state) => state)
@withProps(
  () => {
    const tableDS = new DataSet({
      ...ApsListDS(),
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
export default class ApsList extends PureComponent {
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
    const queryContainer = document.getElementsByClassName('item-bate-list-aps-query')[0];
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
        title: intl.get(`${commonCode}.apsOu`).d('计划中心'),
        resizable: true,
        dataIndex: 'apsOuName',
        width: 150,
        fixed: 'left',
      },
      {
        title: intl.get(`${preCode}.itemApsType`).d('物料计划类型'),
        resizable: true,
        dataIndex: 'itemApsTypeMeaning',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.apsCategory`).d('物料计划类别'),
        resizable: true,
        dataIndex: 'apsCategoryName',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.planCode`).d('计划物料编码'),
        resizable: true,
        dataIndex: 'planCode',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.planner`).d('计划员'),
        resizable: true,
        dataIndex: 'plannerName',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.resourceRule`).d('资源分配规则'),
        resizable: true,
        dataIndex: 'resourceRule',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.apsResource`).d('默认计划资源'),
        resizable: true,
        dataIndex: 'apsResourceName',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.releaseRule`).d('下达策略'),
        resizable: true,
        dataIndex: 'releaseRuleName',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.mtoFlag`).d('按单生产'),
        resizable: true,
        dataIndex: 'mtoFlag',
        width: 150,
        render: ({ rowData }) => <CheckBox disabled checked={rowData.mtoFlag} />,
      },
      {
        title: intl.get(`${preCode}.planFlag`).d('参与计划'),
        resizable: true,
        dataIndex: 'planFlag',
        width: 150,
        render: ({ rowData }) => <CheckBox disabled checked={rowData.planFlag} />,
      },
      {
        title: intl.get(`${preCode}.keyComponentFlag`).d('关键组件'),
        resizable: true,
        dataIndex: 'keyComponentFlag',
        width: 150,
        render: ({ rowData }) => <CheckBox disabled checked={rowData.keyComponentFlag} />,
      },
      {
        title: intl.get(`${preCode}.preProcessLeadTime`).d('前处理提前期'),
        resizable: true,
        dataIndex: 'preProcessLeadTime',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.processLeadTime`).d('处理提前期'),
        resizable: true,
        dataIndex: 'processLeadTime',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.postProcessLeadTime`).d('后处理提前期'),
        resizable: true,
        dataIndex: 'postProcessLeadTime',
        width: 150,
      },

      {
        title: intl.get(`${preCode}.safetyLeadTime`).d('安全生产周期'),
        resizable: true,
        dataIndex: 'safetyLeadTime',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.exceedLeadTime`).d('最大提前生产周期'),
        resizable: true,
        dataIndex: 'exceedLeadTime',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.demandTF`).d('需求时间栏'),
        resizable: true,
        dataIndex: 'demandTimeFence',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.orderTF`).d('订单时间栏'),
        resizable: true,
        dataIndex: 'orderTimeFence',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.releaseTF`).d('下达时间栏'),
        resizable: true,
        dataIndex: 'releaseTimeFence',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.demandMergeTF`).d('需求合并时间栏'),
        resizable: true,
        dataIndex: 'demandMergeTimeFence',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.supplyMergeTF`).d('供应合并时间栏'),
        resizable: true,
        dataIndex: 'supplyMergeTimeFence',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.safetyStockMethod`).d('安全库存法'),
        resizable: true,
        dataIndex: 'safetyStockMethod',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.safetyStockPeriod`).d('安全库存周期'),
        resizable: true,
        dataIndex: 'safetyStockPeriod',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.safetyStockValue`).d('安全库存值'),
        resizable: true,
        dataIndex: 'safetyStockValue',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.maxStockQty`).d('最大库存量'),
        resizable: true,
        dataIndex: 'maxStockQty',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.minStockQty`).d('最小库存量'),
        resizable: true,
        dataIndex: 'minStockQty',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.capacityTF`).d('能力限制时间栏'),
        resizable: true,
        dataIndex: 'capacityTimeFence',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.capacityValue`).d('能力限制值'),
        resizable: true,
        dataIndex: 'capacityValue',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.assemblyShrinkage`).d('生产损耗率'),
        resizable: true,
        dataIndex: 'assemblyShrinkage',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.economicLotSize`).d('经济批量'),
        resizable: true,
        dataIndex: 'economicLotSize',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.economicSplitParameter`).d('批量舍入比例'),
        resizable: true,
        dataIndex: 'economicSplitParameter',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.minOrderQty`).d('最小订单数量'),
        resizable: true,
        dataIndex: 'minOrderQty',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.fixedLotMultiple`).d('圆整批量'),
        resizable: true,
        dataIndex: 'fixedLotMultiple',
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
        <div className="item-bate-list-aps-query">
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
