import React, { createRef, useEffect, useState } from 'react';
import intl from 'utils/intl';
// import withProps from 'utils/withProps';

import ExcelExport from 'components/ExcelExport';
import { Header, Content } from 'components/Page';
import {
  PerformanceTable,
  Button,
  Tooltip,
  Lov,
  Switch,
  Form,
  TextField,
  Pagination,
  Select,
  Icon,
} from 'choerodon-ui/pro';
import { useDataSetEvent } from 'hzero-front/lib/utils/hooks';
import { queryLovData } from 'hlos-front/lib/services/api';
import { HLOS_LWMS } from 'hlos-front/lib/utils/config';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import { getCurrentOrganizationId, filterNullValueObject, getResponse } from 'utils/utils';
import { dataSet } from '@/stores/reservationQtyListDS';
import codeConfig from '@/common/codeConfig';

import styles from './index.less';

const organizationId = getCurrentOrganizationId();

const { common } = codeConfig.code;

const preCode = 'lwms.reservation';
const tableRef = createRef();

export default ({ history }) => {
  const [dataSource, setDataSource] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [totalElements, setTotalElements] = useState(0);
  const [size, setSize] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [tableHeight, setTableHeight] = useState(80);
  const [showFlag, setShowFlag] = useState(false);

  useEffect(() => {
    async function defaultLovSetting() {
      const res = await queryLovData({ lovCode: common.organization, defaultFlag: 'Y' });
      if (getResponse(res)) {
        if (res.content[0]) {
          dataSet.queryDataSet.current.set('organizationObj', {
            organizationId: res.content[0].organizationId,
            organizationName: res.content[0].organizationName,
          });
        }
      }
    }
    defaultLovSetting();
  }, [dataSet]);

  useEffect(() => {
    function handleResize() {
      calcTableHeight(dataSource.length);
    }
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [dataSource]);

  useDataSetEvent(dataSet.queryDataSet, 'update', ({ name, record }) => {
    if (name === 'organizationObj') {
      record.set('warehouseObj', null);
      record.set('documentObj', null);
      record.set('sourceDocObj', null);
    } else if (name === 'warehouseObj') {
      record.set('wmAreaObj', null);
    }
  });

  // 头表行
  const columns = [
    {
      title: intl.get(`${preCode}.org`).d('组织'),
      dataIndex: 'organization',
      key: 'organization',
      width: 128,
      fixed: 'left',
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.item`).d('物料'),
      dataIndex: 'item',
      key: 'item',
      width: 128,
      fixed: 'left',
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.itemDesc`).d('物料描述'),
      dataIndex: 'itemDescription',
      key: 'itemDescription',
      width: 200,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.uom`).d('单位'),
      dataIndex: 'uomName',
      key: 'uomName',
      width: 70,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.reservationQty`).d('保留数量'),
      dataIndex: 'reservationQty',
      key: 'reservationQty',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.lotNumber`).d('批次'),
      dataIndex: 'lotNumber',
      key: 'lotNumber',
      width: 144,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.tagCode`).d('标签'),
      dataIndex: 'tagCode',
      key: 'tagCode',
      width: 144,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.warehouse`).d('仓库'),
      dataIndex: 'warehouse',
      key: 'warehouse',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.wmArea`).d('货位'),
      dataIndex: 'wmArea',
      key: 'wmArea',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.wmUnit`).d('货格'),
      dataIndex: 'wmUnit',
      key: 'wmUnit',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.documentType`).d('单据类型'),
      dataIndex: 'documentType',
      key: 'documentType',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.documentNum`).d('单据'),
      dataIndex: 'documentNum',
      key: 'documentNum',
      width: 144,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.documentLineNum`).d('单据行号'),
      dataIndex: 'documentLineNum',
      key: 'documentLineNum',
      width: 70,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.sourceDocType`).d('来源单据类型'),
      dataIndex: 'sourceDocType',
      key: 'sourceDocType',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.sourceDocNum`).d('来源单据'),
      dataIndex: 'sourceDocNum',
      key: 'sourceDocNum',
      width: 144,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.sourceDocLineNum`).d('来源单据行号'),
      dataIndex: 'sourceDocLineNum',
      key: 'sourceDocLineNum',
      width: 70,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.ownerType`).d('所有者类型'),
      dataIndex: 'ownerTypeMeaning',
      key: 'ownerTypeMeaning',
      width: 92,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.owner`).d('所有者'),
      dataIndex: 'ownerName',
      key: 'ownerName',
      width: 200,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.featureType`).d('特征值类型'),
      dataIndex: 'featureTypeMeaning',
      key: 'featureTypeMeaning',
      width: 92,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.featureValue`).d('特征值'),
      dataIndex: 'featureValue',
      key: 'featureValue',
      width: 100,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.sourceNum`).d('关联单据'),
      dataIndex: 'sourceNum',
      key: 'sourceNum',
      width: 144,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.projectNum`).d('项目号'),
      dataIndex: 'projectNum',
      key: 'projectNum',
      width: 144,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.secondReservationQty`).d('辅单位数量'),
      dataIndex: 'secondReservationQty',
      key: 'secondReservationQty',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.qcOkQty`).d('合格数量'),
      dataIndex: 'qcOkQty',
      key: 'qcOkQty',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.qcNgQty`).d('不合格数量'),
      dataIndex: 'qcNgQty',
      key: 'qcNgQty',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.reservationStatus`).d('保留状态'),
      dataIndex: 'reservationStatusMeaning',
      key: 'reservationStatusMeaning',
      width: 100,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.reservationType`).d('保留类型'),
      dataIndex: 'reservationTypeMeaning',
      key: 'reservationTypeMeaning',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.reservationRule`).d('保留规则'),
      dataIndex: 'reservationRule',
      key: 'reservationRule',
      width: 120,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.remark`).d('备注'),
      dataIndex: 'remark',
      key: 'remark',
      width: 200,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.enabledFlag`).d('是否有效'),
      dataIndex: 'enabledFlag',
      key: 'enabledFlag',
      width: 70,
      resizable: true,
      render: yesOrNoRender,
    },
    {
      title: intl.get(`${preCode}.externalId`).d('外部ID'),
      dataIndex: 'externalId',
      key: 'externalId',
      width: 144,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.externalNum`).d('外部单号'),
      dataIndex: 'externalNum',
      key: 'externalNum',
      width: 144,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.creationDate`).d('保留时间'),
      dataIndex: 'creationDate',
      key: 'creationDate',
      width: 150,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.view.title.journal`).d('履历'),
      dataIndex: 'reservationId',
      key: 'action',
      width: 90,
      fixed: 'right',
      render: ({ rowData }) => commands(rowData),
    },
  ];

  /**
   *操作列
   * @param {*} { record }
   * @returns
   */
  function commands(record) {
    return (
      <Tooltip placement="bottom" title={intl.get('hzero.common.button.cancel').d('详情')}>
        <Button color="primary" funcType="flat" onClick={() => TurnOther(record)}>
          详情
        </Button>
      </Tooltip>
    );
  }

  function TurnOther(record) {
    history.push(`/lwms/reservation-qty/detail/${record.get('reservationId')}`);
  }

  /**
   *tab查询条件
   * @returns
   */
  function queryFields() {
    return [
      <Lov name="organizationObj" noCache key="organizationObj" />,
      <Lov name="itemObj" noCache key="itemObj" />,
      <Lov name="warehouseObj" noCache key="warehouseObj" />,
      <TextField name="lotNumber" key="lotNumber" />,
      <Lov name="wmAreaObj" noCache key="wmAreaObj" />,
      <TextField name="wmUnit" key="wmUnit" />,
      <TextField name="tagCode" key="tagCode" />,
      <Select name="reservationType" key="reservationType" />,
      <Select name="reservationStatus" key="reservationStatus" />,
      <Lov name="documentObj" noCache key="documentObj" />,
      <Lov name="sourceDocObj" noCache key="sourceDocObj" />,
      <Switch name="enabledFlag" key="enabledFlag" />,
    ];
  }

  /**
   *导出字段   *
   * @returns
   */
  function getExportQueryParams() {
    const queryDataDs = dataSet && dataSet.queryDataSet && dataSet.queryDataSet.current;
    const queryDataDsValue = queryDataDs ? filterNullValueObject(queryDataDs.toData()) : {};
    return {
      tenantId: organizationId,
      ...queryDataDsValue,
    };
  }

  /**
   * 查询
   */
  async function handleSearch(page = 0, pageSize = 100, flag) {
    const validateValue = await dataSet.validate(false, false);
    if (!validateValue) {
      return;
    }
    dataSet.queryParameter = {
      ...dataSet.queryDataSet.current.toJSONData(),
      page,
      size: pageSize,
    };
    if (flag) {
      setCurrentPage(1);
    }
    setListLoading(true);
    const res = await dataSet.query();
    setListLoading(false);
    if (res && res.content) {
      setDataSource(res.content);
      setTotalElements(res.totalElements || 0);
      calcTableHeight(res.content.length);
    }
  }

  function calcTableHeight(dataLength) {
    const pageContainer = document.getElementsByClassName(styles['lwms-reservation-qty'])[0];
    const queryContainer = document.getElementById('reservationQtyHeaderQuery');
    const maxTableHeight = pageContainer.offsetHeight - queryContainer.offsetHeight - 75;
    if (dataLength === 0) {
      // 无数据时设置表格高度为80
      setTableHeight(80);
    } else if (dataLength * 33 < maxTableHeight) {
      // 数据量较少时按数据量显示高度 30：行高度，33：表格高度, 10: 滚动条高度
      setTableHeight(dataLength * 30 + 33 + 10);
    } else {
      setTableHeight(maxTableHeight < 80 ? 80 : maxTableHeight);
    }
  }

  // 页码更改
  function handlePageChange(page, pageSize) {
    // 当切换展示数量时，回到第一页
    let pageValue = page;
    const pageSizeValue = pageSize;
    if (pageSize !== size) {
      pageValue = 1;
    }
    setCurrentPage(pageValue);
    setSize(pageSizeValue);
    handleSearch(pageValue - 1, pageSizeValue);
  }

  /**
   * 重置
   */
  function handleReset() {
    dataSet.queryDataSet.current.reset();
  }

  /**
   * 切换显示隐藏
   */
  function handleToggle() {
    setShowFlag(!showFlag);
  }

  return (
    <React.Fragment>
      <Header title={intl.get(`${preCode}.view.title.reservation`).d('库存保留')}>
        <ExcelExport
          requestUrl={`${HLOS_LWMS}/v1/${organizationId}/reservations/excel`}
          queryParams={getExportQueryParams}
        />
      </Header>
      <Content className={styles['lwms-reservation-qty']}>
        <div
          style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 10 }}
          id="reservationQtyHeaderQuery"
        >
          <Form dataSet={dataSet.queryDataSet} columns={4} style={{ flex: 'auto' }}>
            {!showFlag ? queryFields().slice(0, 4) : queryFields()}
          </Form>
          <div
            style={{
              marginLeft: 8,
              flexShrink: 0,
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.1rem 0',
            }}
          >
            <Button onClick={handleToggle} className={styles['more-btn']}>
              {intl.get('hzero.common.button.more').d('更多')}
              <Icon type={!showFlag ? 'expand_more' : 'expand_less'} />
            </Button>
            <Button onClick={handleReset}>{intl.get('hzero.common.button.reset').d('重置')}</Button>
            <Button color="primary" onClick={() => handleSearch(0, size, true)}>
              {intl.get('hzero.common.button.search').d('查询')}
            </Button>
          </div>
        </div>
        <PerformanceTable
          virtualized
          rowKey="reservationId"
          data={dataSource}
          ref={tableRef}
          columns={columns}
          height={tableHeight}
          loading={listLoading}
        />
        <Pagination
          pageSizeOptions={['100', '200', '500', '1000', '5000', '10000']}
          total={totalElements}
          onChange={handlePageChange}
          pageSize={size}
          page={currentPage}
        />
      </Content>
    </React.Fragment>
  );
};
