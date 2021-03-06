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

  // ?????????
  const columns = [
    {
      title: intl.get(`${preCode}.org`).d('??????'),
      dataIndex: 'organization',
      key: 'organization',
      width: 128,
      fixed: 'left',
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.item`).d('??????'),
      dataIndex: 'item',
      key: 'item',
      width: 128,
      fixed: 'left',
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.itemDesc`).d('????????????'),
      dataIndex: 'itemDescription',
      key: 'itemDescription',
      width: 200,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.uom`).d('??????'),
      dataIndex: 'uomName',
      key: 'uomName',
      width: 70,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.reservationQty`).d('????????????'),
      dataIndex: 'reservationQty',
      key: 'reservationQty',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.lotNumber`).d('??????'),
      dataIndex: 'lotNumber',
      key: 'lotNumber',
      width: 144,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.tagCode`).d('??????'),
      dataIndex: 'tagCode',
      key: 'tagCode',
      width: 144,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.warehouse`).d('??????'),
      dataIndex: 'warehouse',
      key: 'warehouse',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.wmArea`).d('??????'),
      dataIndex: 'wmArea',
      key: 'wmArea',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.wmUnit`).d('??????'),
      dataIndex: 'wmUnit',
      key: 'wmUnit',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.documentType`).d('????????????'),
      dataIndex: 'documentType',
      key: 'documentType',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.documentNum`).d('??????'),
      dataIndex: 'documentNum',
      key: 'documentNum',
      width: 144,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.documentLineNum`).d('????????????'),
      dataIndex: 'documentLineNum',
      key: 'documentLineNum',
      width: 70,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.sourceDocType`).d('??????????????????'),
      dataIndex: 'sourceDocType',
      key: 'sourceDocType',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.sourceDocNum`).d('????????????'),
      dataIndex: 'sourceDocNum',
      key: 'sourceDocNum',
      width: 144,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.sourceDocLineNum`).d('??????????????????'),
      dataIndex: 'sourceDocLineNum',
      key: 'sourceDocLineNum',
      width: 70,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.ownerType`).d('???????????????'),
      dataIndex: 'ownerTypeMeaning',
      key: 'ownerTypeMeaning',
      width: 92,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.owner`).d('?????????'),
      dataIndex: 'ownerName',
      key: 'ownerName',
      width: 200,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.featureType`).d('???????????????'),
      dataIndex: 'featureTypeMeaning',
      key: 'featureTypeMeaning',
      width: 92,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.featureValue`).d('?????????'),
      dataIndex: 'featureValue',
      key: 'featureValue',
      width: 100,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.sourceNum`).d('????????????'),
      dataIndex: 'sourceNum',
      key: 'sourceNum',
      width: 144,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.projectNum`).d('?????????'),
      dataIndex: 'projectNum',
      key: 'projectNum',
      width: 144,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.secondReservationQty`).d('???????????????'),
      dataIndex: 'secondReservationQty',
      key: 'secondReservationQty',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.qcOkQty`).d('????????????'),
      dataIndex: 'qcOkQty',
      key: 'qcOkQty',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.qcNgQty`).d('???????????????'),
      dataIndex: 'qcNgQty',
      key: 'qcNgQty',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.reservationStatus`).d('????????????'),
      dataIndex: 'reservationStatusMeaning',
      key: 'reservationStatusMeaning',
      width: 100,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.reservationType`).d('????????????'),
      dataIndex: 'reservationTypeMeaning',
      key: 'reservationTypeMeaning',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.reservationRule`).d('????????????'),
      dataIndex: 'reservationRule',
      key: 'reservationRule',
      width: 120,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.remark`).d('??????'),
      dataIndex: 'remark',
      key: 'remark',
      width: 200,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.enabledFlag`).d('????????????'),
      dataIndex: 'enabledFlag',
      key: 'enabledFlag',
      width: 70,
      resizable: true,
      render: yesOrNoRender,
    },
    {
      title: intl.get(`${preCode}.externalId`).d('??????ID'),
      dataIndex: 'externalId',
      key: 'externalId',
      width: 144,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.externalNum`).d('????????????'),
      dataIndex: 'externalNum',
      key: 'externalNum',
      width: 144,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.creationDate`).d('????????????'),
      dataIndex: 'creationDate',
      key: 'creationDate',
      width: 150,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.view.title.journal`).d('??????'),
      dataIndex: 'reservationId',
      key: 'action',
      width: 90,
      fixed: 'right',
      render: ({ rowData }) => commands(rowData),
    },
  ];

  /**
   *?????????
   * @param {*} { record }
   * @returns
   */
  function commands(record) {
    return (
      <Tooltip placement="bottom" title={intl.get('hzero.common.button.cancel').d('??????')}>
        <Button color="primary" funcType="flat" onClick={() => TurnOther(record)}>
          ??????
        </Button>
      </Tooltip>
    );
  }

  function TurnOther(record) {
    history.push(`/lwms/reservation-qty/detail/${record.get('reservationId')}`);
  }

  /**
   *tab????????????
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
   *????????????   *
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
   * ??????
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
      // ?????????????????????????????????80
      setTableHeight(80);
    } else if (dataLength * 33 < maxTableHeight) {
      // ?????????????????????????????????????????? 30???????????????33???????????????, 10: ???????????????
      setTableHeight(dataLength * 30 + 33 + 10);
    } else {
      setTableHeight(maxTableHeight < 80 ? 80 : maxTableHeight);
    }
  }

  // ????????????
  function handlePageChange(page, pageSize) {
    // ??????????????????????????????????????????
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
   * ??????
   */
  function handleReset() {
    dataSet.queryDataSet.current.reset();
  }

  /**
   * ??????????????????
   */
  function handleToggle() {
    setShowFlag(!showFlag);
  }

  return (
    <React.Fragment>
      <Header title={intl.get(`${preCode}.view.title.reservation`).d('????????????')}>
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
              {intl.get('hzero.common.button.more').d('??????')}
              <Icon type={!showFlag ? 'expand_more' : 'expand_less'} />
            </Button>
            <Button onClick={handleReset}>{intl.get('hzero.common.button.reset').d('??????')}</Button>
            <Button color="primary" onClick={() => handleSearch(0, size, true)}>
              {intl.get('hzero.common.button.search').d('??????')}
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
