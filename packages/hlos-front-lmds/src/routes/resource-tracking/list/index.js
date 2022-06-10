/*
 * @Author: chunyan.liang <chunyan.liang@hand-china.com>
 * @Date: 2020-09-04 12:02:18
 * @LastEditTime: 2021-05-13 16:56:33
 * @Description: 资源跟踪开发
 */
import React, { Fragment } from 'react';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import {
  DataSet,
  Modal,
  Form,
  Lov,
  Select,
  DateTimePicker,
  Button,
  TextField,
  PerformanceTable,
  Pagination,
  CheckBox,
} from 'choerodon-ui/pro';
import { queryLovData } from 'hlos-front/lib/services/api';
import { printTag } from '@/services/resourceTrackingService';
import { getResponse, getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import notification from 'utils/notification';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import ExcelExport from 'components/ExcelExport';
import { isUndefined } from 'lodash';

import codeConfig from '@/common/codeConfig';
import ResourceTrackingListDS from '../stores/ResourceTrackingListDS';
import ImagePreviewModalContent from './components/index';
import style from './index.less';

const { common } = codeConfig.code;
const intlPrefix = 'lmds.resource.tracking';
const commonCode = 'lmds.common.model';
const modalKey = Modal.key();
const organizationId = getCurrentOrganizationId();
const tableRef = React.createRef();

export default class ResourceTracking extends React.Component {
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
      checkValues: [],
      checkRecords: [],
      printModel: '',
    };
  }

  ResourceTrackingList = new DataSet({
    ...ResourceTrackingListDS(),
  });

  async componentDidMount() {
    const res = await queryLovData({
      lovCode: common.organization,
      defaultFlag: 'Y',
    });
    if (getResponse(res) && !res.failed && res.content && res.content.length) {
      // 设置查询条件
      this.ResourceTrackingList.queryDataSet.current.set('organizationObj', {
        organizationId: res.content[0].organizationId,
        organizationName: res.content[0].organizationName,
      });
    }
  }

  // 预览图片
  handleImgPreview(imgList) {
    if (imgList.length) {
      Modal.open({
        key: modalKey,
        closable: true,
        footer: null,
        title: intl.get(`${intlPrefix}.view.title.imagePreview`).d('图片预览'),
        children: <ImagePreviewModalContent imgList={imgList} />,
      });
    } else {
      notification.warning({
        message: intl.get(`${intlPrefix}.view.warn.noImageWarning`).d('当前单据没有图片信息'),
      });
    }
  }

  handleClearArea() {
    this.ResourceTrackingList.queryDataSet.current.set('wmAreaObj', null);
  }

  handleClearToArea() {
    this.ResourceTrackingList.queryDataSet.current.set('toWmAreaObj', null);
  }

  get queryFields() {
    return [
      <Lov name="organizationObj" noCache key="organizationObj" />,
      <Lov name="resourceObj" noCache key="resourceObj" />,
      <Select name="resourceClass" key="resourceClass" />,
      <Select name="resourceType" key="resourceType" />,
      <Select name="trackType" key="trackType" />,
      <Lov name="connectResourceObj" noCache key="connectResourceObj" />,
      <DateTimePicker name="trackTimeStart" key="trackTimeStart" />,
      <DateTimePicker name="trackTimeEnd" key="trackTimeEnd" />,
      <Lov
        name="warehouseObj"
        onChange={(record) => this.handleClearArea(record)}
        noCache
        key="warehouseObj"
      />,
      <Lov name="wmAreaObj" noCache key="wmAreaObj" />,
      <Lov name="prodLineObj" noCache key="prodLineObj" />,
      <Lov name="equipmentObj" noCache key="equipmentObj" />,
      <Lov
        name="toWarehouseObj"
        onChange={(record) => this.handleClearToArea(record)}
        noCache
        key="toWarehouseObj"
      />,
      <Lov name="toWmAreaObj" noCache key="toWmAreaObj" />,
      <Lov name="toProdLineObj" noCache key="toProdLineObj" />,
      <Lov name="toEquipmentObj" noCache key="toEquipmentObj" />,
      <Lov name="workerObj" noCache key="workerObj" />,
      <Lov name="itemObj" noCache key="workerObj" />,
      <Lov name="documentObj" noCache key="workerObj" />,
      // add 资源批次
      <TextField name="resourceLot" placeholder="资源批次" />,
    ];
  }

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

  /**
   * 查询
   */
  async handleSearch(page = this.state.currentPage, pageSize = this.state.size) {
    const validateValue = await this.ResourceTrackingList.queryDataSet.current.validate(
      false,
      false
    );
    if (!validateValue) {
      return;
    }
    this.setState({ showLoading: true });
    this.ResourceTrackingList.queryDataSet.current.set('page', page - 1);
    this.ResourceTrackingList.queryDataSet.current.set('size', pageSize);
    const res = await this.ResourceTrackingList.query();
    if (getResponse(res) && res.content) {
      this.setState({
        dataSource: res.content,
        totalElements: res.totalElements || 0,
      });
      this.calcTableHeight(res.content.length);
    }
    this.setState({ showLoading: false });
  }

  calcTableHeight = (dataLength) => {
    const pageContainer = document.getElementsByClassName(style['lmds-tracking-content'])[0];
    const queryContainer = document.getElementsByClassName(style['lmds-tracking-query'])[0];
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

  /**
   * 切换显示隐藏
   */
  handleToggle() {
    this.setState(
      (state) => ({
        showFlag: !state.showFlag,
      }),
      () => this.calcTableHeight(this.state.dataSource.length)
    );
  }

  /**
   * 重置
   */
  handleReset() {
    this.ResourceTrackingList.queryDataSet.current.reset();
  }

  renderBar(queryDataSet) {
    return (
      <div style={{ display: 'flex', marginBottom: '10px', alignItems: 'flex-start' }}>
        <Form dataSet={queryDataSet} columns={4} style={{ flex: 'auto' }}>
          {!this.state.showFlag ? this.queryFields.slice(0, 4) : this.queryFields}
        </Form>
        <div
          style={{
            marginLeft: 8,
            marginTop: 10,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Button onClick={() => this.handleToggle()}>
            {!this.state.showFlag
              ? intl.get('hzero.common.button.viewMore').d('更多查询')
              : intl.get('hzero.common.button.collected').d('收起查询')}
          </Button>
          <Button onClick={() => this.handleReset()}>
            {intl.get('hzero.common.button.reset').d('重置')}
          </Button>
          <Button color="primary" onClick={() => this.handleQuery()}>
            {intl.get('hzero.common.button.search').d('查询')}
          </Button>
        </div>
      </div>
    );
  }

  get columns() {
    const { dataSource, checkValues } = this.state;
    return [
      {
        title: (
          <CheckBox
            name="controlled"
            checked={dataSource.length && checkValues.length === dataSource.length}
            onChange={this.handleCheckAllChange}
          />
        ),
        dataIndex: 'resourceTrackId',
        key: 'resourceTrackId',
        width: 50,
        fixed: true,
        render: ({ rowData, dataIndex, rowIndex }) =>
          this.checkCell({ rowData, dataIndex, rowIndex }),
      },
      {
        title: intl.get(`${intlPrefix}.model.organization`).d('组织'),
        resizable: true,
        dataIndex: 'organizationName',
        editor: false,
        width: 128,
        fixed: true,
      },
      {
        title: intl.get(`${intlPrefix}.model.resource`).d('资源'),
        resizable: true,
        dataIndex: 'resourceCode',
        editor: false,
        width: 128,
        fixed: true,
      },
      {
        title: intl.get(`${intlPrefix}.model.resourceName`).d('资源名称'),
        resizable: true,
        dataIndex: 'resourceName',
        editor: false,
        width: 144,
      },
      {
        title: intl.get(`${intlPrefix}.model.trackType`).d('跟踪类型'),
        resizable: true,
        dataIndex: 'trackTypeMeaning',
        editor: false,
        width: 100,
      },
      {
        title: intl.get(`${intlPrefix}.model.trackTime`).d('跟踪时间'),
        resizable: true,
        dataIndex: 'trackTime',
        editor: false,
        width: 150,
      },
      {
        title: intl.get(`${intlPrefix}.model.uomName`).d('单位'),
        resizable: true,
        dataIndex: 'uomName',
        editor: false,
        width: 70,
      },
      {
        title: intl.get(`${intlPrefix}.model.quantity`).d('数量'),
        resizable: true,
        dataIndex: 'quantity',
        editor: false,
        width: 82,
      },
      {
        title: intl.get(`${intlPrefix}.model.resourceLot`).d('资源批次'),
        resizable: true,
        dataIndex: 'resourceLot',
        editor: false,
        width: 144,
      },
      {
        title: intl.get(`${intlPrefix}.keyValue`).d('关键值'),
        resizable: true,
        dataIndex: 'keyValue',
        editor: false,
        width: 128,
      },
      {
        title: intl.get(`${intlPrefix}.model.trackRecord`).d('详细记录'),
        resizable: true,
        dataIndex: 'trackRecord',
        editor: false,
        width: 200,
      },
      {
        title: intl.get(`${intlPrefix}.model.resourceClass`).d('资源大类'),
        resizable: true,
        dataIndex: 'resourceClassMeaning',
        editor: false,
        width: 100,
      },
      {
        title: intl.get(`${intlPrefix}.model.resourceType`).d('资源类型'),
        resizable: true,
        dataIndex: 'resourceTypeMeaning',
        editor: false,
        width: 128,
      },
      {
        title: intl.get(`${intlPrefix}.model.relatedResourceName`).d('关联资源'),
        resizable: true,
        dataIndex: 'relatedResourceName',
        editor: false,
        width: 128,
      },
      {
        title: intl.get(`${intlPrefix}.model.warehouse`).d('仓库'),
        resizable: true,
        dataIndex: 'warehouseName',
        editor: false,
        width: 128,
      },
      {
        title: intl.get(`${intlPrefix}.model.wmArea`).d('货位'),
        resizable: true,
        dataIndex: 'wmAreaName',
        editor: false,
        width: 128,
      },
      {
        title: intl.get(`${intlPrefix}.model.wmUnit`).d('货格'),
        resizable: true,
        dataIndex: 'wmUnitName',
        editor: false,
        width: 100,
      },
      {
        title: intl.get(`${intlPrefix}.model.prodLineName`).d('生产线'),
        resizable: true,
        dataIndex: 'prodLineName',
        editor: false,
        width: 128,
      },
      {
        title: intl.get(`${intlPrefix}.model.equipment`).d('设备'),
        resizable: true,
        dataIndex: 'equipmentName',
        editor: false,
        width: 128,
      },
      {
        title: intl.get(`${intlPrefix}.model.workcell`).d('工位'),
        resizable: true,
        dataIndex: 'workcellName',
        editor: false,
        width: 128,
      },
      {
        title: intl.get(`${intlPrefix}.model.location`).d('地点'),
        resizable: true,
        dataIndex: 'location',
        editor: false,
        width: 128,
      },
      {
        title: intl.get(`${intlPrefix}.model.outsideLocation`).d('外部地点'),
        resizable: true,
        dataIndex: 'outsideLocation',
        editor: false,
        width: 128,
      },
      {
        title: intl.get(`${intlPrefix}.model.toWarehouse`).d('目标仓库'),
        resizable: true,
        dataIndex: 'toWarehouseName',
        editor: false,
        width: 128,
      },
      {
        title: intl.get(`${intlPrefix}.model.toWmArea`).d('目标货位'),
        resizable: true,
        dataIndex: 'toWmAreaName',
        editor: false,
        width: 128,
      },
      {
        title: intl.get(`${intlPrefix}.model.toWmUnitName`).d('目标货格'),
        resizable: true,
        dataIndex: 'toWmUnitName',
        editor: false,
        width: 100,
      },
      {
        title: intl.get(`${intlPrefix}.model.toProdLine`).d('目标生产线'),
        resizable: true,
        dataIndex: 'toProdLineName',
        editor: false,
        width: 128,
      },
      {
        title: intl.get(`${intlPrefix}.model.toEquipment`).d('目标设备'),
        resizable: true,
        dataIndex: 'toEquipmentName',
        editor: false,
        width: 128,
      },
      {
        title: intl.get(`${intlPrefix}.model.toWorkcell`).d('目标工位'),
        resizable: true,
        dataIndex: 'toWorkcellName',
        editor: false,
        width: 128,
      },
      {
        title: intl.get(`${intlPrefix}.model.toLocation`).d('目标地点'),
        resizable: true,
        dataIndex: 'toLocationName',
        editor: false,
        width: 128,
      },
      {
        title: intl.get(`${intlPrefix}.model.toOutsideLocation`).d('目标外部地点'),
        resizable: true,
        dataIndex: 'toOutsideLocation',
        editor: false,
        width: 128,
      },
      {
        title: intl.get(`${intlPrefix}.model.usedCount`).d('使用计数'),
        resizable: true,
        dataIndex: 'usedCount',
        editor: false,
        width: 82,
      },
      {
        title: intl.get(`${intlPrefix}.model.worker`).d('操作工'),
        resizable: true,
        dataIndex: 'workerName',
        editor: false,
        width: 100,
      },
      {
        title: intl.get(`${intlPrefix}.model.workerGroup`).d('班组'),
        resizable: true,
        dataIndex: 'workerGroupName',
        editor: false,
        width: 128,
      },
      {
        title: intl.get(`${intlPrefix}.model.item`).d('物料'),
        resizable: true,
        dataIndex: 'itemCode',
        editor: false,
        width: 128,
      },
      {
        title: intl.get(`${commonCode}.itemDesc`).d('物料描述'),
        resizable: true,
        dataIndex: 'itemDescription',
        editor: false,
        width: 200,
      },
      {
        title: intl.get(`${intlPrefix}.model.operation`).d('工序'),
        resizable: true,
        dataIndex: 'operationName',
        editor: false,
        width: 128,
      },
      {
        title: intl.get(`${intlPrefix}.model.documentType`).d('单据类型'),
        resizable: true,
        dataIndex: 'documentTypeName',
        editor: false,
        width: 128,
      },
      {
        title: intl.get(`${intlPrefix}.model.documentNum`).d('单据号'),
        resizable: true,
        dataIndex: 'documentNum',
        editor: false,
        width: 144,
      },
      {
        title: intl.get(`${intlPrefix}.model.documentLineNum`).d('单据行号'),
        resizable: true,
        dataIndex: 'documentLineNum',
        editor: false,
        width: 70,
      },
      {
        title: intl.get(`${commonCode}.eventType`).d('事件类型'),
        resizable: true,
        dataIndex: 'eventType',
        editor: false,
        width: 128,
      },
      {
        title: intl.get(`${commonCode}.eventId`).d('事件ID'),
        resizable: true,
        dataIndex: 'eventId',
        editor: false,
        width: 150,
      },
      {
        title: intl.get(`${commonCode}.eventBy`).d('事件提交人'),
        resizable: true,
        dataIndex: 'eventBy',
        editor: false,
        width: 100,
      },
      {
        title: intl.get(`${intlPrefix}.model.pictures`).d('图片'),
        resizable: true,
        dataIndex: 'pictures',
        editor: false,
        width: 128,
        render: ({ rowData }) => {
          const imgList = rowData.pictures && rowData.pictures.split(',');
          return (
            <span
              onClick={() => this.handleImgPreview(imgList)}
              style={{ color: '#29bece', cursor: 'pointer' }}
            >
              {imgList && imgList.length
                ? intl.get(`${intlPrefix}.view.hint.viewPicture`).d('查看图片')
                : ''}
            </span>
          );
        },
      },
      {
        title: intl.get(`${intlPrefix}.model.remark`).d('备注'),
        resizable: true,
        dataIndex: 'remark',
        editor: false,
        width: 200,
      },
    ];
  }

  handleCheckAllChange = (value) => {
    const _dataSource = this.state.dataSource;
    if (value) {
      this.setState({
        checkValues: _dataSource.map((i) => i.resourceTrackId),
        checkRecords: _dataSource,
      });
    } else {
      this.setState({
        checkValues: [],
        checkRecords: [],
      });
    }
  };

  checkCell = ({ rowData, rowIndex }) => {
    const { checkValues } = this.state;
    return (
      <CheckBox
        key={rowIndex}
        name="controlled"
        value={rowData.resourceTrackId}
        checked={checkValues.indexOf(rowData.resourceTrackId) !== -1}
        onClick={(e) => {
          e.stopPropagation();
        }}
        onChange={() => this.handleCheckBoxChange(rowData)}
      />
    );
  };

  handleCheckBoxChange = (rowData) => {
    const _checkValues = this.state.checkValues.slice();
    let _checkRecords = this.state.checkRecords.slice();
    const _dataSource = this.state.dataSource.slice();

    if (_checkValues.indexOf(rowData.resourceTrackId) === -1) {
      _checkValues.push(rowData.resourceTrackId);
      _checkRecords.push(rowData);
      _checkRecords = _checkRecords.map((v) => {
        return {
          ..._dataSource.find((rec) => rec.resourceTrackId === v.resourceTrackId),
        };
      });
    } else {
      _checkValues.splice(_checkValues.indexOf(rowData.resourceTrackId), 1);
      _checkRecords.splice(
        _checkRecords.findIndex((v) => v.resourceTrackId === rowData.resourceTrackId),
        1
      );
    }
    this.setState({
      checkValues: _checkValues,
      checkRecords: _checkRecords,
    });
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

  /**
   *导出字段
   * @returns
   */
  getExportQueryParams() {
    const formObj = this.ResourceTrackingList.queryDataSet.current;
    const fieldsValue = isUndefined(formObj) ? {} : filterNullValueObject(formObj.toJSONData());
    return {
      ...fieldsValue,
    };
  }

  ds = new DataSet({
    autoCreate: true,
    fields: [
      {
        name: 'printModelObj',
        type: 'object',
        label: '模板标签',
        lovCode: 'LMDS.TAG_TEMPLATE',
        textField: 'templateName',
        required: true,
      },
      {
        name: 'templateName',
        type: 'string',
        bind: 'printModelObj.templateName',
      },
      {
        name: 'templateCode',
        type: 'string',
        bind: 'printModelObj.templateCode',
      },
    ],
  });

  handleDataSetChange(record) {
    this.setState({
      printModel: record.templateCode,
    });
  }

  async printData() {
    const { checkRecords, printModel } = this.state;
    if (!printModel) {
      notification.warning({
        message: '请选择模板标签',
      });
      return;
    }
    if (checkRecords.length === 0) {
      notification.warning({
        message: '请选择至少一条数据进行打印',
      });
      return;
    }
    const list = checkRecords.map((ele) => ({
      resourceTrackId: ele.resourceTrackId,
    }));
    const obj = {
      lineList: list,
    };
    const params = [];
    params.push(obj);
    await printTag(params);
    this.props.history.push({
      pathname: `/lmds/resource-tracking/print/${printModel}`,
      search: `tenantId=${getCurrentOrganizationId()}`,
      recordParams: checkRecords,
      tagType: '',
      backPath: '/lmds/resource-tracking/list',
    });
  }

  render() {
    const { ResourceTrackingList, columns } = this;
    const { showLoading, currentPage, size, totalElements, dataSource, tableHeight } = this.state;
    return (
      <Fragment>
        <Header title="资源跟踪">
          <ExcelExport
            requestUrl={`${HLOS_LMDS}/v1/${organizationId}/resource-tracks/export`}
            queryParams={() => this.getExportQueryParams()}
          />
          <Button color="primary" onClick={() => this.printData()}>
            打印
          </Button>
          <Lov
            dataSet={this.ds}
            name="printModelObj"
            key="printModelObj"
            noCache
            onChange={(record) => this.handleDataSetChange(record)}
          />
        </Header>
        <Content className={style['lmds-tracking-content']}>
          <div className={style['lmds-tracking-query']}>
            {this.renderBar(ResourceTrackingList.queryDataSet)}
          </div>
          <PerformanceTable
            virtualized
            rowKey="lotId"
            data={dataSource}
            ref={tableRef}
            columns={columns}
            height={tableHeight}
            loading={showLoading}
          />
          <Pagination
            pageSizeOptions={['100', '200', '500', '1000', '5000', '10000']}
            total={totalElements}
            onChange={this.handlePageChange}
            pageSize={size}
            page={currentPage}
          />
          {/* <Table
            dataSet={ResourceTrackingList}
            columns={columns}
            columnResizable="true"
            queryBar={({ queryDataSet }) => this.renderBar(queryDataSet)}
          /> */}
        </Content>
      </Fragment>
    );
  }
}
