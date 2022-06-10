/**
 * @Description: 物料制造页面管理信息--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-28 14:21:24
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
import MeListDS from '../stores/MeListDS';

const preCode = 'lmds.item.model';
const commonCode = 'lmds.common.model';

@connect((state) => state)
@withProps(
  () => {
    const tableDS = new DataSet({
      ...MeListDS(),
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
export default class MeList extends PureComponent {
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
    const queryContainer = document.getElementsByClassName('item-bate-list-me-query')[0];
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
        title: intl.get(`${preCode}.itemMeType`).d('物料制造类型'),
        resizable: true,
        dataIndex: 'itemMeTypeMeaning',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.meCategory`).d('物料制造类别'),
        resizable: true,
        dataIndex: 'meCategoryName',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.makeBuyCode`).d('自制外购属性'),
        resizable: true,
        dataIndex: 'makeBuyCodeMeaning',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.supplyType`).d('供应类型'),
        resizable: true,
        dataIndex: 'supplyType',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.outsourcingFlag`).d('委外加工'),
        resizable: true,
        dataIndex: 'outsourcingFlag',
        width: 150,
        align: 'center',
        render: ({ rowData }) => <CheckBox disabled checked={rowData.outsourcingFlag} />,
      },
      {
        title: intl.get(`${preCode}.executeRule`).d('执行规则'),
        resizable: true,
        dataIndex: 'executeRuleName',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.inspectionRule`).d('检验规则'),
        resizable: true,
        dataIndex: 'inspectionRuleName',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.dispatchRule`).d('派工规则'),
        resizable: true,
        dataIndex: 'dispatchRuleName',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.packingRule`).d('装箱打包规则'),
        resizable: true,
        dataIndex: 'packingRuleName',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.reworkRule`).d('返修规则'),
        resizable: true,
        dataIndex: 'reworkRuleName',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.numberRule`).d('编号规则'),
        resizable: true,
        dataIndex: 'numberRuleName',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.lotControlType`).d('批次控制类型'),
        resizable: true,
        dataIndex: 'lotControlTypeMeaning',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.issueControlType`).d('投料限制类型'),
        resizable: true,
        dataIndex: 'issueControlTypeMeaning',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.issueControlValue`).d('投料限制值'),
        resizable: true,
        dataIndex: 'issueControlValue',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.completeControlType`).d('完工限制类型'),
        resizable: true,
        dataIndex: 'completeControlTypeMeaning',
        width: 150,
      },

      {
        title: intl.get(`${preCode}.supplyWm`).d('默认供应仓库'),
        resizable: true,
        dataIndex: 'supplyWarehouseName',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.supplyWmArea`).d('默认供应仓储区域'),
        resizable: true,
        dataIndex: 'supplyWmAreaName',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.issueWm`).d('默认发料仓库'),
        resizable: true,
        dataIndex: 'issueWarehouseName',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.issueWmArea`).d('默认发料仓储区域'),
        resizable: true,
        dataIndex: 'issueWmAreaName',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.completeWm`).d('默认完工仓库'),
        resizable: true,
        dataIndex: 'completeWarehouseName',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.completeWmArea`).d('默认完工仓储区域'),
        resizable: true,
        dataIndex: 'completeWmAreaName',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.invWm`).d('默认入库仓库'),
        resizable: true,
        dataIndex: 'inventoryWarehouseName',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.invWmArea`).d('默认入库仓储区域'),
        resizable: true,
        dataIndex: 'inventoryWmAreaName',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.tagTemplate`).d('标签模板'),
        resizable: true,
        dataIndex: 'tagTemplate',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.referenceDocument`).d('作业指导书'),
        resizable: true,
        dataIndex: 'referenceDocument',
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
        <div className="item-bate-list-me-query">
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
