/*
 * @Descripttion:
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2021-01-25 10:29:54
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2021-03-12 10:01:22
 */
import React, { useState, Fragment } from 'react';
import { connect } from 'dva';
import {
  DataSet,
  Button,
  Tabs,
  Table,
  Modal,
  Lov,
  DatePicker,
  NumberField,
  TextField,
} from 'choerodon-ui/pro';
import notification from 'utils/notification';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import moment from 'moment';
import intl from 'utils/intl';
import { HLOS_ZCOM } from 'hlos-front/lib/utils/config';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import {
  customerItemRevDS,
  batchDS,
  serialDS,
  customerItemReceivedListDS,
  lotNumberListDS,
  serialNumListDS,
} from '../store/CustomerItemReceiveDS';
import { certStorageLines, triggerApi } from '@/services/customerItemReceiveService';
import styles from './index.less';

const { TabPane } = Tabs;
const intlPrefix = 'zcom.deliveryMaintain';
const MaintainListDS = new DataSet(customerItemRevDS());
const BatchDS = new DataSet(batchDS());
const SerialDS = new DataSet(serialDS());
const receivedListDS = new DataSet(customerItemReceivedListDS());
const lotNumberDS = new DataSet(lotNumberListDS());
const serialNumDS = new DataSet(serialNumListDS());

const batchKey = Modal.key();
const serialKey = Modal.key();
const receiveKey = Modal.key();
const organizationId = getCurrentOrganizationId();

let currentDS;
let batchModal;
let serialModal;

function CustomerItemReceive() {
  const [curTab, setCurTab] = useState('willReceive');
  const [receiveLoading, setReceiveLoading] = useState(false);
  const [getLoading, setGetLoading] = useState(false);

  const maintainColumns = [
    { name: 'itemCertHeadText', width: 150, align: 'center' },
    { name: 'customerItemCode', width: 150, align: 'center' },
    { name: 'customerItemDescription', width: 150, align: 'center' },
    {
      name: 'deliveryQty',
      width: 150,
      align: 'center',
      footer: () => footerRender('deliveryQty', MaintainListDS),
    },
    {
      name: 'receivedQty',
      width: 150,
      align: 'center',
      footer: () => footerRender('receivedQty', MaintainListDS),
    },
    {
      name: 'storageQty',
      width: 150,
      align: 'center',
      editor: (record) => (record.get('storageStatus') !== 'RECEIVED' ? <NumberField /> : null),
      footer: () => footerRender('storageQty', MaintainListDS),
    },
    {
      name: 'operatorName',
      width: 150,
      align: 'center',
      editor: (record) => (record.get('storageStatus') !== 'RECEIVED' ? <TextField /> : null),
    },
    {
      name: 'lineRemark',
      width: 150,
      align: 'center',
      editor: (record) => (record.get('storageStatus') !== 'RECEIVED' ? <TextField /> : null),
    },
    {
      name: 'meOuObj',
      width: 150,
      align: 'center',
      editor: (record) => (record.get('storageStatus') !== 'RECEIVED' ? <Lov noCache /> : null),
    },
    {
      name: 'warehouseObj',
      width: 150,
      align: 'center',
      editor: (record) => (record.get('storageStatus') !== 'RECEIVED' ? <Lov noCache /> : null),
    },
    {
      name: 'storageDate',
      align: 'center',
      width: 150,
      editor: (record) => (record.get('storageStatus') !== 'RECEIVED' ? <DatePicker /> : null),
    },
    { name: 'shipmentNo', width: 150, align: 'center' },
    { name: 'storageStatusMeaning', width: 150, align: 'center' },
    {
      name: 'itemCertPostDate',
      align: 'center',
      width: 150,
      renderer: ({ value }) => {
        return <span>{value ? value.substring(0, 10) : ''}</span>;
      },
    },
    { name: 'itemCertNum', width: 150, align: 'center' },
    { name: 'projectNum', width: 150, align: 'center' },
    { name: 'moveType', width: 150, align: 'center' },
    {
      name: 'sequenceLotControl',
      align: 'center',
      width: 150,
      lock: 'right',
      renderer: ({ record, value }) => {
        return (
          <a
            disabled={value !== 'LOT'}
            onClick={() => {
              batchMaintain(record, 'sequenceLotControl');
            }}
          >
            维护
          </a>
        );
      },
    },
    {
      name: 'tagFlag',
      align: 'center',
      width: 150,
      lock: 'right',
      renderer: ({ record, value }) => {
        return (
          <a
            disabled={!value}
            onClick={() => {
              serialMaintain(record, 'tagFlag');
            }}
          >
            维护
          </a>
        );
      },
    },
  ];

  const footerRender = (field, ds) => {
    let total = 0;
    ds.selected.forEach((item) => {
      total = Number(item.get(field)) + total;
    });
    return <span>合计：{total}</span>;
  };

  const batchColumns = [
    { name: 'itemCertHeadText', width: 150, align: 'center' },
    { name: 'customerItemCode', width: 150, align: 'center' },
    { name: 'customerItemDescription', width: 150, align: 'center' },
    { name: 'batchQty', width: 150, align: 'center', editor: <NumberField noCache /> },
    { name: 'batchNum', width: 150, align: 'center', editor: <TextField noCache /> },
  ];

  const serialColumns = [
    { name: 'itemCertHeadText', width: 150, align: 'center' },
    { name: 'customerItemCode', width: 150, align: 'center' },
    { name: 'customerItemDescription', width: 150, align: 'center' },
    { name: 'serialQty', width: 150, align: 'center', editor: <NumberField noCache /> },
    { name: 'serialNum', width: 150, align: 'center', editor: <TextField noCache /> },
  ];

  const receivedColumns = [
    { name: 'certStorageNum', width: 150, align: 'center', lock: 'left' },
    { name: 'storageLineNum', width: 150, align: 'center', lock: 'left' },
    { name: 'itemCertHeadText', width: 150, align: 'center' },
    { name: 'customerItemCode', width: 150, align: 'center' },
    { name: 'customerItemDescription', width: 150, align: 'center' },
    {
      name: 'deliveryQty',
      width: 150,
      align: 'center',
      footer: () => footerRender('deliveryQty', receivedListDS),
    },
    {
      name: 'storageQty',
      width: 150,
      align: 'center',
      footer: () => footerRender('storageQty', receivedListDS),
    },
    { name: 'operatorName', width: 150, align: 'center' },
    { name: 'lineRemark', width: 150, align: 'center' },
    { name: 'meOuName', width: 150, align: 'center' },
    { name: 'warehouseName', width: 150, align: 'center' },
    {
      name: 'storageDate',
      align: 'center',
      width: 150,
      renderer: ({ value }) => {
        return <span>{value ? value.substring(0, 10) : ''}</span>;
      },
    },
    { name: 'shipMentNo', width: 150, align: 'center' },
    { name: 'storageStatusMeaning', width: 150, align: 'center' },
    {
      name: 'itemCertPostDate',
      width: 150,
      align: 'center',
      renderer: ({ value }) => {
        return <span>{value ? value.substring(0, 10) : ''}</span>;
      },
    },
    { name: 'itemCertNum', width: 150, align: 'center' },
    { name: 'projectNum', width: 150, align: 'center' },
    { name: 'moveType', width: 150, align: 'center' },
    {
      name: 'sequenceLotControl',
      width: 150,
      align: 'center',
      lock: 'right',
      renderer: ({ record, value }) => {
        return (
          <a disabled={value !== 'LOT'} onClick={() => handleSearch(record, 'storageBatchList')}>
            查询
          </a>
        );
      },
    },
    {
      name: 'tagFlag',
      width: 150,
      align: 'center',
      lock: 'right',
      renderer: ({ record, value }) => {
        return (
          <a disabled={!value} onClick={() => handleSearch(record, 'storageSerialList')}>
            查询
          </a>
        );
      },
    },
  ];

  const lotNumberColumns = [
    { name: 'itemCertHeadText', width: 150, align: 'center' },
    { name: 'customerItemCode', width: 150, align: 'center' },
    { name: 'batchQty', width: 150, align: 'center' },
    { name: 'batchNum', width: 150, align: 'center' },
  ];

  const serialNumColumns = [
    { name: 'itemCertHeadText', width: 150, align: 'center' },
    { name: 'customerItemCode', width: 150, align: 'center' },
    { name: 'serialQty', width: 150, align: 'center' },
    { name: 'serialNum', width: 150, align: 'center' },
  ];

  function handleSearch(record, type) {
    if (type === 'storageBatchList') {
      lotNumberDS.data = record.toData().storageBatchList;
    }
    if (type === 'storageSerialList') {
      serialNumDS.data = record.toData().storageSerialList;
    }
    Modal.open({
      key: receiveKey,
      closable: true,
      title: `${type === 'storageBatchList' ? '批次' : '序列号'}查询`,
      children: (
        <div>
          <Table
            dataSet={type === 'storageBatchList' ? lotNumberDS : serialNumDS}
            columns={type === 'storageBatchList' ? lotNumberColumns : serialNumColumns}
            columnResizable="true"
          />
        </div>
      ),
      okText: '确定',
      className: styles['zcom-customer-item-receive'],
    });
  }

  /**
   * 维护批次
   */
  const batchMaintain = (record, type) => {
    const {
      customerItemCode,
      customerItemDescription,
      itemCertHeadText,
      storageBatchList,
    } = record.toData();
    currentDS = type;

    BatchDS.reset();

    if (storageBatchList && storageBatchList.length) {
      const list = storageBatchList.map((item) => {
        return {
          ...item,
          customerItemCode,
          customerItemDescription,
          itemCertHeadText,
        };
      });
      BatchDS.data = list;
    } else {
      BatchDS.data = [];
      BatchDS.create({}, 0);
      BatchDS.current.set('customerItemCode', customerItemCode);
      BatchDS.current.set('customerItemDescription', customerItemDescription);
      BatchDS.current.set('itemCertHeadText', itemCertHeadText);
    }

    batchModal = Modal.open({
      key: batchKey,
      title: '分配批次',
      children: (
        <div>
          <div className={styles['receive-button']}>
            <Button color="primary" className={styles['receive-button-save']} onClick={saveBatch}>
              保存
            </Button>
            <Button color="primary" onClick={deleteBatch}>
              删除
            </Button>

            <Button color="primary" onClick={() => addBatch(record)}>
              新建
            </Button>
          </div>
          <Table
            className={styles['receive-table']}
            dataSet={BatchDS}
            columns={batchColumns}
            columnResizable="true"
            queryFieldsLimit={4}
          />
        </div>
      ),
      className: styles['zcom-customer-item-receive'],
      footer: (_, cancelBtn) => <div>{cancelBtn}</div>,
    });
  };

  /**
   * 维护序列号
   */
  const serialMaintain = (record, type) => {
    currentDS = type;
    SerialDS.reset();

    const {
      customerItemCode,
      customerItemDescription,
      itemCertHeadText,
      storageSerialList,
    } = record.toData();

    if (storageSerialList && storageSerialList.length) {
      const list = storageSerialList.map((item) => {
        return {
          ...item,
          customerItemCode,
          customerItemDescription,
          itemCertHeadText,
        };
      });

      SerialDS.data = list;
    } else {
      SerialDS.data = [];
      SerialDS.create({}, 0);
      SerialDS.current.set('customerItemCode', customerItemCode);
      SerialDS.current.set('customerItemDescription', customerItemDescription);
      SerialDS.current.set('itemCertHeadText', itemCertHeadText);
    }

    serialModal = Modal.open({
      key: serialKey,
      title: '分配序列号',
      children: (
        <div>
          <div className={styles['receive-button']}>
            <Button className={styles['receive-button-save']} color="primary" onClick={saveBatch}>
              保存
            </Button>
            <Button color="primary" onClick={deleteSerial}>
              删除
            </Button>
            <Button color="primary" onClick={() => addBatch(record)}>
              新建
            </Button>
          </div>
          <Table
            className={styles['receive-table']}
            dataSet={SerialDS}
            columns={serialColumns}
            columnResizable="true"
            queryFieldsLimit={4}
          />
        </div>
      ),
      className: styles['zcom-customer-item-receive'],
      footer: (_, cancelBtn) => <div>{cancelBtn}</div>,
    });
  };

  /**
   * 保存批次/序列号
   */
  const saveBatch = async () => {
    const ds = currentDS === 'sequenceLotControl' ? BatchDS : SerialDS;
    const modal = currentDS === 'sequenceLotControl' ? batchModal : serialModal;
    const storageQty = MaintainListDS.current.get('storageQty');

    const continueFlag = await ds.validate(false, false);
    if (!continueFlag) {
      return;
    }

    let totalNum = 0;

    const storageBatchList = ds.data.map((record) => {
      // 批次
      if (currentDS === 'sequenceLotControl') {
        const { batchQty, batchNum } = record.toData();
        totalNum += batchQty;
        return {
          batchQty,
          batchNum,
        };
      } else {
        // 序列号
        const { serialQty, serialNum } = record.toData();
        totalNum += serialQty;
        return {
          serialQty,
          serialNum,
        };
      }
    });

    if (Number(totalNum) !== Number(storageQty)) {
      notification.error({
        message: `拆分后${
          currentDS === 'sequenceLotControl' ? '批次' : '序列号'
        }数量相加不等于行数量`,
      });
      return;
    }

    if (currentDS === 'sequenceLotControl') {
      MaintainListDS.current.set('storageBatchList', storageBatchList);
    } else {
      MaintainListDS.current.set('storageSerialList', storageBatchList);
    }

    modal.close();
  };

  /**
   * 新增批次
   */
  const addBatch = async (record) => {
    const ds = currentDS === 'sequenceLotControl' ? BatchDS : SerialDS;

    const { customerItemCode, customerItemDescription, itemCertHeadText } = record.toData();
    ds.create({ customerItemCode, customerItemDescription, itemCertHeadText }, 0);
  };

  const deleteBatch = () => {
    const list = BatchDS.selected;
    BatchDS.delete(list);
  };

  const deleteSerial = () => {
    const list = SerialDS.selected;

    SerialDS.delete(list);
  };

  /**
   * 确认接收
   */
  const handleReceive = async () => {
    const list = [];
    let validateValue = true;
    setReceiveLoading(true);
    return new Promise(async (resolve) => {
      if (!MaintainListDS.selected.length) {
        notification.error({
          message: intl.get(`hzero.common.message.validation.atLeast`).d('请至少选择一条数据'),
        });
        resolve(setReceiveLoading(false));
        return;
      }

      const firstMoveType = MaintainListDS.selected[0].moveType;
      for (let index = 0; index < MaintainListDS.selected.length; index++) {
        if (MaintainListDS.selected[index].moveType !== firstMoveType) {
          notification.error({
            message: intl
              .get(`hzero.common.message.validation.moveType`)
              .d('303业务和313业务不能同时接收，请仅选择一种业务进行确认接收'),
          });
          resolve(setReceiveLoading(false));
          return;
        }
      }

      MaintainListDS.selected.forEach((item) => {
        const {
          storageQty,
          meOuId,
          meOuCode,
          warehouseId,
          warehouseCode,
          storageDate,
          storageBatchList,
          storageSerialList,
          tagFlag,
          sequenceLotControl,
          acceptableQty,
        } = item.toData();

        if (
          !storageQty ||
          !meOuId ||
          !meOuCode ||
          !warehouseId ||
          !warehouseCode ||
          !storageDate ||
          Number(storageQty) > Number(acceptableQty)
        ) {
          validateValue = false;
        }

        if (tagFlag && !storageSerialList) {
          validateValue = false;
        }

        if (sequenceLotControl === 'LOT' && !storageBatchList) {
          validateValue = false;
        }

        list.push({
          ...item.toData(),
          storageDate: moment(item.get('storageDate'))
            .format(DEFAULT_DATE_FORMAT)
            .concat(' 23:59:59'),
        });
      });

      if (!validateValue) {
        notification.error({
          message: '存在必输字段未填写或字段输入不合法！',
        });
        resolve(setReceiveLoading(false));
        return;
      }

      certStorageLines(list).then((res) => {
        resolve(setReceiveLoading(false));
        if (res && res.failed) {
          notification.error({
            message: res.message,
          });
        } else {
          notification.success({
            message: '操作成功！',
          });
          MaintainListDS.query();
        }
      });
    });
  };

  /**
   * 客供料同步
   */
  const handleGetList = async () => {
    setGetLoading(true);
    return new Promise(async (resolve) => {
      triggerApi().then((res) => {
        resolve(setGetLoading(false));
        if (res && res.failed) {
          notification.error({
            message: res.message,
          });
        } else {
          MaintainListDS.query();
        }
      });
    });
  };

  /**
   * 导出
   * @returns
   */
  function getExportQueryParams(ds) {
    const queryDataDs = ds && ds.queryDataSet && ds.queryDataSet.current;
    const queryDataDsValue = queryDataDs ? queryDataDs.toData() : {};
    const {
      itemCertPostDateStart,
      itemCertPostDateEnd,
      storageDateStart,
      storageDateEnd,
    } = queryDataDsValue;
    return filterNullValueObject({
      tenantId: organizationId,
      ...queryDataDsValue,
      itemCertPostDateStart: itemCertPostDateStart
        ? itemCertPostDateStart.concat(' 00:00:00')
        : null,
      itemCertPostDateEnd: itemCertPostDateEnd ? itemCertPostDateEnd.concat(' 59:59:59') : null,
      storageDateStart: storageDateStart ? storageDateStart.concat(' 00:00:00') : null,
      storageDateEnd: storageDateEnd ? storageDateEnd.concat(' 59:59:59') : null,
    });
  }

  function handleTabChange(key) {
    setCurTab(key);
  }

  return (
    <Fragment>
      <Header title={intl.get(`${intlPrefix}.view.title.deliveryMaintain`).d('客供料接收平台')}>
        {curTab === 'willReceive' ? (
          <>
            <Button color="primary" onClick={handleReceive} loading={receiveLoading}>
              确认接收
            </Button>
            <Button color="primary" onClick={handleGetList} loading={getLoading}>
              客供料同步
            </Button>
            <ExcelExport
              requestUrl={`${HLOS_ZCOM}/v1/${organizationId}/item-cert-lines/export`}
              queryParams={() => getExportQueryParams(MaintainListDS)}
            />
          </>
        ) : (
          <ExcelExport
            requestUrl={`${HLOS_ZCOM}/v1/${organizationId}/cert-storage-lines/excel`}
            queryParams={() => getExportQueryParams(receivedListDS)}
          />
        )}
      </Header>
      <Content>
        <Tabs
          defaultActiveKey="willReceive"
          className={styles['page-tabs']}
          onChange={handleTabChange}
        >
          <TabPane tab="客供料接收" key="willReceive">
            <Table
              dataSet={MaintainListDS}
              columns={maintainColumns}
              columnResizable="true"
              queryFieldsLimit={4}
              // footer="user"
              // autoFootHeight
            />
          </TabPane>
          <TabPane tab="客供料已接收查询" key="maintain">
            <Table
              dataSet={receivedListDS}
              columns={receivedColumns}
              columnResizable="true"
              queryFieldsLimit={4}
            />
          </TabPane>
        </Tabs>
      </Content>
    </Fragment>
  );
}

export default connect(({ deliveryMaintain: { currentTab } }) => ({ currentTab }))(
  formatterCollections({
    code: [`${intlPrefix}`],
  })(CustomerItemReceive)
);
