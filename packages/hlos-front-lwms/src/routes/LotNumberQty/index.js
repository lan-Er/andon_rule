/*
 * @Author: zhang yang
 * @Description: 批次查询
 * @E-mail: yang.zhang14@hand-china.com
 * @Date: 2019-12-19 09:29:40
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { isUndefined } from 'lodash';
import {
  DataSet,
  Form,
  Lov,
  Select,
  Pagination,
  PerformanceTable,
  Button,
  TextField,
  DatePicker,
} from 'choerodon-ui/pro';
import { getResponse, getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import { queryLovData } from 'hlos-front/lib/services/api';
import { HLOS_LWMS } from 'hlos-front/lib/utils/config';

import { lotnumberQtyListDS } from '@/stores/lotnumberQtyListDS';
import codeConfig from '@/common/codeConfig';
import style from './index.less';

const preCode = 'lwms.lotnumberQty';
const commonCode = 'lwms.common.model';
const { common } = codeConfig.code;
const tableRef = React.createRef();

@connect(({ lotnumberQty }) => ({
  lotnumberQty,
}))
@formatterCollections({
  code: ['lwms.lotnumberQty', 'lwms.common'],
})
export default class LotNumberList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showFlag: false,
      showLoading: false,
      currentPage: 1,
      size: 100,
      totalElements: 0,
      dataSource: [],
      tableHeight: 80,
    };
    this.tableDS = new DataSet({
      ...lotnumberQtyListDS,
    });
  }

  async componentDidMount() {
    const res = await Promise.all([
      queryLovData({ lovCode: common.organization, defaultFlag: 'Y' }),
    ]);
    if (getResponse(res)) {
      if (res[0] && res[0].content[0]) {
        this.tableDS.queryDataSet.current.set('organizationObj', {
          organizationId: res[0].content[0].organizationId,
          organizationName: res[0].content[0].organizationName,
        });
      }
    }
  }

  get columns() {
    return [
      {
        title: intl.get(`${commonCode}.org`).d('组织'),
        resizable: true,
        dataIndex: 'organization',
        width: 128,
        fixed: true,
      },
      {
        title: intl.get(`${commonCode}.item`).d('物料'),
        resizable: true,
        dataIndex: 'item',
        width: 128,
        fixed: true,
      },
      {
        title: intl.get(`${preCode}.lotNumber`).d('批次'),
        resizable: true,
        dataIndex: 'lotNumber',
        width: 128,
        fixed: true,
      },
      {
        title: intl.get(`${preCode}.itemDesc`).d('物料描述'),
        resizable: true,
        dataIndex: 'itemDescription',
        width: 200,
      },
      {
        title: intl.get(`${preCode}.initialQty`).d('初始数量'),
        resizable: true,
        dataIndex: 'initialQty',
        width: 82,
      },
      {
        title: intl.get(`${preCode}.uom`).d('单位'),
        resizable: true,
        dataIndex: 'uomName',
        width: 82,
      },
      {
        title: intl.get(`${preCode}.lotStatus`).d('批次状态'),
        resizable: true,
        dataIndex: 'lotStatusMeaning',
        width: 90,
      },
      {
        title: intl.get(`${preCode}.sourceLot`).d('来源批次'),
        resizable: true,
        dataIndex: 'sourceLotNumber',
        width: 128,
      },
      {
        title: intl.get(`${preCode}.parentLotNumber`).d('父批次'),
        resizable: true,
        dataIndex: 'parentLotNumber',
        width: 128,
      },
      {
        title: intl.get(`${preCode}.receivedDate`).d('接收日期'),
        resizable: true,
        dataIndex: 'receivedDate',
        width: 144,
        align: 'center',
      },
      {
        title: intl.get(`${preCode}.madeDate`).d('生产日期'),
        resizable: true,
        dataIndex: 'madeDate',
        width: 144,
        align: 'center',
      },
      {
        title: intl.get(`${preCode}.expireDate`).d('失效日期'),
        resizable: true,
        dataIndex: 'expireDate',
        width: 144,
        align: 'center',
      },
      {
        title: intl.get(`${preCode}.supplier`).d('供应商'),
        resizable: true,
        dataIndex: 'supplier',
        width: 128,
      },
      {
        title: intl.get(`${preCode}.supplierLotNumber`).d('供应商批次'),
        resizable: true,
        dataIndex: 'supplierLotNumber',
        width: 128,
      },
      {
        title: intl.get(`${preCode}.material`).d('材质'),
        resizable: true,
        dataIndex: 'material',
        width: 128,
      },
      {
        title: intl.get(`${preCode}.materialSupplier`).d('材料供应商'),
        resizable: true,
        dataIndex: 'materialSupplier',
        width: 128,
      },
      {
        title: intl.get(`${preCode}.materialLotNumber`).d('材料批次'),
        resizable: true,
        dataIndex: 'materialLotNumber',
        width: 128,
      },
      {
        title: intl.get(`${preCode}.manufacturer`).d('制造商'),
        resizable: true,
        dataIndex: 'manufacturer',
        width: 200,
      },
      {
        title: intl.get(`${preCode}.lotType`).d('批次类型'),
        resizable: true,
        dataIndex: 'lotTypeMeaning',
        width: 82,
      },
      {
        title: intl.get(`${preCode}.featureType`).d('特征值类型'),
        resizable: true,
        dataIndex: 'featureTypeMeaning',
        width: 128,
      },
      {
        title: intl.get(`${preCode}.featureValue`).d('特征值'),
        resizable: true,
        dataIndex: 'featureValue',
        width: 128,
      },
      {
        title: intl.get(`${preCode}.remark`).d('备注'),
        resizable: true,
        dataIndex: 'remark',
        width: 200,
      },
    ];
  }

  get queryFields() {
    return [
      <Lov name="organizationObj" clearButton noCache />,
      <Lov name="item" clearButton noCache />,
      <Lov name="lot" clearButton noCache />,
      <Select name="lotStatus" />,
      <Lov name="sourceLot" clearButton noCache />,
      <Lov name="supplier" clearButton noCache />,
      <TextField name="supplierLotNumber" />,
      <DatePicker name="receivedDateStart" />,
      <DatePicker name="receivedDateEnd" />,
      <DatePicker name="expireDateStart" />,
      <DatePicker name="expireDateEnd" />,
    ];
  }

  /**
   *导出字段
   * @returns
   */
  @Bind()
  getExportQueryParams() {
    const formObj = this.tableDS.queryDataSet.current;
    const fieldsValue = isUndefined(formObj) ? {} : filterNullValueObject(formObj.toJSONData());
    return {
      ...fieldsValue,
    };
  }

  calcTableHeight = (dataLength) => {
    const pageContainer = document.getElementsByClassName(style['lot-number'])[0];
    const queryContainer = document.getElementsByClassName(style['query-options'])[0];
    const maxTableHeight = pageContainer.offsetHeight - queryContainer.offsetHeight - 75;
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

  handleQuery = () => {
    this.setState(
      {
        currentPage: 1,
      },
      () => {
        this.handleSearch();
      }
    );
  };

  handleSearch = async (page = this.state.currentPage, pageSize = this.state.size) => {
    const isValid = await this.tableDS.queryDataSet.validate(false, false);
    if (!isValid) {
      return;
    }
    this.setState({ showLoading: true });
    this.tableDS.queryDataSet.current.set('page', page - 1);
    this.tableDS.queryDataSet.current.set('size', pageSize);
    const res = await this.tableDS.query();
    if (getResponse(res) && res.content) {
      this.setState({
        dataSource: res.content,
        totalElements: res.totalElements || 0,
      });
      this.calcTableHeight(res.content.length);
    }
    this.setState({ showLoading: false });
  };

  handleReset = () => {
    this.tableDS.queryDataSet.current.reset();
  };

  handleToggle = () => {
    this.setState(
      {
        showFlag: !this.state.showFlag,
      },
      () => this.calcTableHeight(this.state.dataSource.length)
    );
  };

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

  render() {
    const {
      showFlag,
      showLoading,
      dataSource,
      totalElements,
      size,
      currentPage,
      tableHeight,
    } = this.state;
    return (
      <Fragment>
        <Header title={intl.get(`${preCode}.view.title.lotnumberQty`).d('批次')}>
          <ExcelExport
            requestUrl={`${HLOS_LWMS}/v1/${getCurrentOrganizationId()}/lots/excel`}
            queryParams={this.getExportQueryParams}
          />
        </Header>
        <Content className={style['lot-number']}>
          <div className={style['query-options']}>
            <Form dataSet={this.tableDS.queryDataSet} columns={4} style={{ flex: 'auto' }}>
              {!showFlag ? this.queryFields.slice(0, 4) : this.queryFields}
            </Form>
            <div
              style={{
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                marginLeft: 8,
                marginTop: 10,
              }}
            >
              <Button onClick={this.handleToggle}>
                {!showFlag
                  ? intl.get('hzero.common.button.viewMore').d('更多查询')
                  : intl.get('hzero.common.button.collected').d('收起查询')}
              </Button>
              <Button onClick={this.handleReset}>
                {intl.get('hzero.common.button.reset').d('重置')}
              </Button>
              <Button color="primary" onClick={() => this.handleQuery()}>
                {intl.get('hzero.common.button.search').d('查询')}
              </Button>
            </div>
          </div>
          <PerformanceTable
            virtualized
            data={dataSource}
            ref={tableRef}
            height={tableHeight}
            columns={this.columns}
            loading={showLoading}
          />
          <Pagination
            pageSizeOptions={['100', '200', '500', '1000', '5000', '10000']}
            total={totalElements}
            onChange={this.handlePageChange}
            pageSize={size}
            page={currentPage}
          />
        </Content>
      </Fragment>
    );
  }
}
