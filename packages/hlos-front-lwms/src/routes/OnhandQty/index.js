/**
 * @Description: 仓库现有量管理信息--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-12-17 12:22:15
 * @LastEditors: yu.na
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import queryString from 'query-string';
import { openTab } from 'utils/menuTab';
import {
  DataSet,
  Lov,
  Switch,
  PerformanceTable,
  TextField,
  NumberField,
  Form,
  Button,
  Pagination,
} from 'choerodon-ui/pro';
import { Button as HButton } from 'hzero-ui';
import { getResponse, getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import { isUndefined } from 'lodash';

import { HLOS_LWMS } from 'hlos-front/lib/utils/config';
import { queryLovData } from 'hlos-front/lib/services/api';
import { onhandQtyListDS } from '@/stores/onhandQtyListDS';
import codeConfig from '@/common/codeConfig';
import style from './index.less';

const { common } = codeConfig.code;

const preCode = 'lwms.onHandQty.model';
const organizationId = getCurrentOrganizationId();
const tableRef = React.createRef();
const commonCode = 'lwms.common.model';

@connect()
@formatterCollections({
  code: ['lwms.onHandQty', 'lwms.common'],
})
export default class OnhandQty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showEnabled: false,
      showFlag: false,
      showLoading: false,
      currentPage: 1,
      size: 100,
      totalElements: 0,
      dataSource: [],
      tableHeight: 80,
    };
    this.tableDS = new DataSet({
      ...onhandQtyListDS,
    });
  }

  async componentDidMount() {
    this.tableDS.addEventListener('query', () => {
      const availableFlag = this.tableDS.queryDataSet.current.get('availableFlag');
      this.setState({
        showEnabled: !!availableFlag,
      });
    });
    const res = await Promise.all([
      queryLovData({ lovCode: common.organization, defaultFlag: 'Y' }),
      queryLovData({ lovCode: common.warehouse, defaultFlag: 'Y' }),
    ]);
    const fail = res.find((item) => item.fail);
    if (getResponse(res) && !fail) {
      if (res[0] && res[0].content[0]) {
        this.tableDS.queryDataSet.current.set('organizationObj', {
          organizationId: res[0].content[0].organizationId,
          organizationName: res[0].content[0].organizationName,
        });
      }
      if (res[1] && res[1].content[0]) {
        this.tableDS.queryDataSet.current.set('warehouseObj', {
          warehouseId: res[1].content[0].warehouseId,
          warehouseName: res[1].content[0].warehouseName,
        });
      }
    }
  }

  get columns() {
    return [
      {
        title: intl.get(`${commonCode}.org`).d('组织'),
        dataIndex: 'organization',
        width: 128,
        fixed: true,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.warehouse`).d('仓库'),
        dataIndex: 'warehouse',
        width: 128,
        fixed: true,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.wmArea`).d('货位'),
        dataIndex: 'wmArea',
        width: 128,
        fixed: true,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.item`).d('物料'),
        dataIndex: 'itemCode',
        width: 128,
        fixed: true,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.featureCode`).d('特性值'),
        dataIndex: 'featureCode',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.itemDesc`).d('物料描述'),
        dataIndex: 'itemDescription',
        width: 200,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.itemWarehouseType`).d('物料仓储类型'),
        dataIndex: 'itemTypeMeaning',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.onhandQty`).d('现有量'),
        dataIndex: 'quantity',
        width: 82,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.enabledQty`).d('可用量'),
        dataIndex: 'availableQty',
        width: this.state.showEnabled ? 82 : 0,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.uom`).d('单位'),
        dataIndex: 'uomName',
        width: 70,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.lot`).d('批次'),
        dataIndex: 'lotNumber',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.wmUnit`).d('货格'),
        dataIndex: 'wmUnitCode',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.itemCategory`).d('物料类别'),
        dataIndex: 'itemCategoryName',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.warehouseCategory`).d('仓库类别'),
        dataIndex: 'warehouseCategoryName',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.ownerType`).d('所有者类型'),
        dataIndex: 'ownerTypeMeaning',
        width: 82,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.owner`).d('所有者'),
        dataIndex: 'owner',
        width: 200,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.secondUom`).d('辅助单位'),
        dataIndex: 'secondUomName',
        width: 70,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.secondApplyQty`).d('辅助单位数量'),
        dataIndex: 'secondQuantity',
        width: 82,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.featureType`).d('特征值类型'),
        dataIndex: 'featureTypeMeaning',
        width: 82,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.featureValue`).d('特征值'),
        dataIndex: 'featureValue',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.sourceNum`).d('关联单据'),
        dataIndex: 'sourceNum',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.projectNum`).d('项目号'),
        dataIndex: 'projectNum',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.location`).d('地理位置'),
        dataIndex: 'locationName',
        width: 128,
        resizable: true,
      },
    ];
  }

  // 导入
  @Bind()
  handleBatchImport() {
    openTab({
      key: `/himp/commentImport/LMDS.ONHAND_INITIAL`,
      title: intl.get(`${preCode}.view.title.onhandImport`).d('现有量导入'),
      search: queryString.stringify({
        action: intl.get(`${preCode}.view.title.onhandImport`).d('现有量导入'),
      }),
    });
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
    const pageContainer = document.getElementsByClassName(style['lwms-onhand'])[0];
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

  queryFields = [
    <Lov name="organizationObj" />,
    <Lov name="itemObj" />,
    <Lov name="warehouseObj" />,
    <Lov name="wmAreaObj" />,
    <TextField name="featureCode" />,
    <Lov name="lotObj" />,
    <Lov name="ownerObj" />,
    <TextField name="projectNum" />,
    <TextField name="wmUnitCode" />,
    <NumberField name="minQuantity" />,
    <NumberField name="maxQuantity" />,
    <Switch name="availableFlag" />,
  ];

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
    console.log('现有量', this.tableDS.queryDataSet.current.get('availableFlag'));
    // this.tableDS.queryDataSet.current.set('availableFlag', availableFlag);
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
        <Header title={intl.get(`${preCode}.view.title.onhandQty`).d('现有量查询')}>
          <ExcelExport
            requestUrl={`${HLOS_LWMS}/v1/${organizationId}/onhand-quantitys/excel`}
            queryParams={this.getExportQueryParams}
          />
          <HButton icon="upload" onClick={this.handleBatchImport}>
            {intl.get('hzero.common.button.import').d('导入')}
          </HButton>
        </Header>
        <Content className={style['lwms-onhand']}>
          <div className={style['query-options']}>
            <Form dataSet={this.tableDS.queryDataSet} columns={4} style={{ flex: 'auto' }}>
              <Lov name="organizationObj" label={intl.get(`${commonCode}.org`).d('组织')} />
              <Lov name="itemObj" label={intl.get(`${preCode}.item`).d('物料')} />
              <Lov name="warehouseObj" label={intl.get(`${preCode}.warehouse`).d('仓库')} />
              <Lov name="wmAreaObj" label={intl.get(`${preCode}.wmArea`).d('货位')} />
              {showFlag && (
                <TextField
                  name="featureCode"
                  label={intl.get(`${preCode}.itemFeatureCode`).d('物料特性值')}
                />
              )}
              {showFlag && <Lov name="lotObj" label={intl.get(`${preCode}.lot`).d('批次')} />}
              {showFlag && <Lov name="ownerObj" label={intl.get(`${preCode}.owner`).d('所有者')} />}
              {showFlag && (
                <TextField
                  name="featureCode"
                  label={intl.get(`${preCode}.projectNum`).d('项目号')}
                />
              )}
              {showFlag && (
                <TextField name="featureCode" label={intl.get(`${preCode}.wmUnit`).d('货格')} />
              )}
              {showFlag && (
                <NumberField
                  name="minQuantity"
                  label={`${intl.get(`${preCode}.qty`).d('数量')}>`}
                />
              )}
              {showFlag && (
                <NumberField
                  name="maxQuantity"
                  label={`${intl.get(`${preCode}.qty`).d('数量')}<=`}
                />
              )}
              {showFlag && (
                <Switch
                  name="availableFlag"
                  label={intl.get(`${preCode}.enabledQty`).d('可用量')}
                />
              )}
              {/* {!showFlag ? this.queryFields.slice(0, 4) : this.queryFields} */}
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
