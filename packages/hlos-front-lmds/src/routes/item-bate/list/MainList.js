/**
 * @Description: 物料主页面管理信息--Index
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
} from 'choerodon-ui/pro';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import withProps from 'utils/withProps';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import TableQueryFrom from 'hlos-front/lib/components/TableQueryFrom';

import MainListDS from '../stores/MainListDS';

const preCode = 'lmds.item.model';
const commonCode = 'lmds.common.model';
@connect((state) => state)
@withProps(
  () => {
    const tableDS = new DataSet({
      ...MainListDS(),
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
export default class MainList extends PureComponent {
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
    const queryContainer = document.getElementsByClassName('item-bate-list-main-query')[0];
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
        title: intl.get(`${preCode}.itemAlias`).d('物料别名'),
        resizable: true,
        dataIndex: 'itemAlias',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.shortCode`).d('物料简码'),
        resizable: true,
        dataIndex: 'shortCode',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.itemAlias`).d('物料别名'),
        resizable: true,
        dataIndex: 'itemAlias',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.itemType`).d('物料类型'),
        resizable: true,
        dataIndex: 'itemTypeMeaning',
        width: 150,
      },
      {
        title: '物料类别',
        resizable: true,
        dataIndex: 'mdsCategoryName',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.designCode`).d('产品图号'),
        resizable: true,
        dataIndex: 'designCode',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.specification`).d('型号'),
        resizable: true,
        dataIndex: 'specification',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.uom`).d('主单位'),
        resizable: true,
        dataIndex: 'uomName',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.secondUom`).d('辅助单位'),
        resizable: true,
        dataIndex: 'secondUomName',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.uomConversionValue`).d('主辅单位换算'),
        resizable: true,
        dataIndex: 'uomConversionValue',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.length`).d('长'),
        resizable: true,
        dataIndex: 'length',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.width`).d('宽'),
        resizable: true,
        dataIndex: 'width',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.height`).d('高'),
        resizable: true,
        dataIndex: 'height',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.uolCode`).d('长度单位'),
        resizable: true,
        dataIndex: 'uolCode',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.area`).d('面积'),
        resizable: true,
        dataIndex: 'area',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.uoaCode`).d('面积单位'),
        resizable: true,
        dataIndex: 'uoaCode',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.volume`).d('体积'),
        resizable: true,
        dataIndex: 'volume',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.uovCode`).d('体积单位'),
        resizable: true,
        dataIndex: 'uovCode',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.unitWeight`).d('单重'),
        resizable: true,
        dataIndex: 'unitWeight',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.grossWeight`).d('毛重'),
        resizable: true,
        dataIndex: 'grossWeight',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.uowCode`).d('重量单位'),
        resizable: true,
        dataIndex: 'uowCode',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.itemIdentifyCode`).d('物料识别码'),
        resizable: true,
        dataIndex: 'itemIdentifyCode',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.drawingCode`).d('产品图纸编号'),
        resizable: true,
        dataIndex: 'drawingCode',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.featureCode`).d('特征值编码'),
        resizable: true,
        dataIndex: 'featureCode',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.featureDesc`).d('特征描述'),
        resizable: true,
        dataIndex: 'featureDesc',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.packingGroup`).d('装箱组'),
        resizable: true,
        dataIndex: 'packingGroup',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.hazardClass`).d('危险品标识'),
        resizable: true,
        dataIndex: 'hazardClassMeaning',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.unNumber`).d('UN号'),
        resizable: true,
        dataIndex: 'unNumber',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.standardCost`).d('标准成本'),
        resizable: true,
        dataIndex: 'standardCost',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.standardSalesPrice`).d('标准售价'),
        resizable: true,
        dataIndex: 'standardSalesPrice',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.externalItemCode`).d('对应外部物料编码'),
        resizable: true,
        dataIndex: 'externalItemCode',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.externalItemDescription`).d('对应外部物料描述'),
        resizable: true,
        dataIndex: 'externalItemDescription',
        width: 150,
      },
      {
        title: intl.get(`${preCode}.file`).d('文件'),
        resizable: true,
        dataIndex: 'fileUrl',
        width: 150,
      },
      {
        title: intl.get(`${commonCode}.enabledFlag`).d('是否有效'),
        resizable: true,
        dataIndex: 'enabledFlag',
        width: 100,
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
    sessionStorage.setItem('item-bate-detail-before-meouObj', false);
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
        <div className="item-bate-list-main-query">
          <TableQueryFrom
            dataSet={this.props.tableDS.queryDataSet}
            showNumber={3}
            onClickQueryCallback={this.handleSearch}
          >
            <TextField name="itemCode" />
            <TextField name="description" />
            <Lov name="mdsCategoryObj" />
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
