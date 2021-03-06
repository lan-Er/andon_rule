import React, { useState, useEffect, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  DataSet,
  Button,
  Form,
  Modal,
  TextField,
  Select,
  Lov,
  DatePicker,
  Tabs,
  NumberField,
  Table,
} from 'choerodon-ui/pro';
import { Button as HButton } from 'hzero-ui';
import { Header, Content } from 'components/Page';
import queryString from 'query-string';
import { Upload } from 'choerodon-ui';
import intl from 'utils/intl';
import { openTab } from 'utils/menuTab';
import notification from 'utils/notification';
import { HZERO_FILE } from 'utils/config';
import { downloadFile } from 'services/api';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId, getAccessToken } from 'utils/utils';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import statusConfig from '@/common/statusConfig';
import styles from './index.less';

import {
  returnMaintainHeadDS,
  returnMaintainLineDS,
  batchDS,
  serialDS,
  refundLogisticsDS,
  deliveryPrintDS,
} from '../store/MaintainDS';

const { TabPane } = Tabs;
const organizationId = getCurrentOrganizationId();
const {
  importTemplateCode: { itemRefundImport, itemRefundLotTagImport },
} = statusConfig.statusValue.zcom;

const intlPrefix = 'zcom.customerRefund';
const DetailHeadDS = () => new DataSet({ ...returnMaintainHeadDS() });
const DetailLineDS = () => new DataSet({ ...returnMaintainLineDS() });
const DetailLogisticsDS = () => new DataSet({ ...refundLogisticsDS() });
const DeliveryPrintDS = () => new DataSet({ ...deliveryPrintDS() });

const LineBatchDS = () => new DataSet({ ...batchDS() });
const LineSerialDS = () => new DataSet({ ...serialDS() });

const batchKey = Modal.key();
const serialKey = Modal.key();
const printKey = Modal.key();

let currentDS;
let batchModal;
let serialModal;
let printModal;

function ZcomMoDeliveryDetail({ dispatch, match, history }) {
  const HeadDS = useDataSet(DetailHeadDS, ZcomMoDeliveryDetail);
  const LineDS = useDataSet(DetailLineDS);
  const BatchDS = useDataSet(LineBatchDS);
  const SerialDS = useDataSet(LineSerialDS);
  const LogisticsDS = useDataSet(DetailLogisticsDS);
  const PrintDS = useDataSet(DeliveryPrintDS);

  const {
    params: { type, itemRefundId },
  } = match;

  const [saveLoading, setSaveLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [canEdit, setCanEdit] = useState(true);
  const [canPrint, setCanPrint] = useState(false);
  const [itemheadRefundStatus, setItemHeadRefundStatus] = useState('');
  const [logisticsCanEdit, setLogisticsCanEdit] = useState(true);
  const [logisticsLoading, setLogisticsLoading] = useState(false);
  const [headShow, setHeadShow] = useState(true);
  const [headFile, setHeadFile] = useState(null);
  const [revocableLoading, setRevocableLoading] = useState(false);

  useEffect(() => {
    HeadDS.setQueryParameter('itemRefundId', null);
    LineDS.setQueryParameter('itemRefundId', null);
    HeadDS.data = [];
    LineDS.data = [];
    HeadDS.create();
    LineDS.clearCachedSelected();
    if (type === 'detail') {
      HeadDS.setQueryParameter('itemRefundId', itemRefundId);
      LineDS.setQueryParameter('itemRefundId', itemRefundId);
      LogisticsDS.setQueryParameter('itemRefundId', itemRefundId);
    }
    handleSearch();
  }, [itemRefundId]);

  const lineColumns = [
    {
      name: 'refundLineNum',
      align: 'center',
      width: 150,
      lock: true,
    },
    { name: 'refundItemObj', align: 'center', width: 150, editor: canEdit },
    { name: 'refundItemDescription', align: 'center', width: 150 },
    { name: 'refundQty', align: 'center', width: 150, editor: canEdit },
    { name: 'totalReceivedQty', align: 'center', width: 150 },
    { name: 'lineRemark', align: 'center', width: 150, editor: canEdit },
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
            {canEdit ? '??????' : '??????'}
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
            {canEdit ? '??????' : '??????'}
          </a>
        );
      },
    },
    {
      header: '????????????',
      align: 'center',
      width: 150,
      lock: 'right',
      command: ({ record }) => {
        return [
          <Button
            key="print"
            color="primary"
            funcType="flat"
            disabled={type === 'create'}
            onClick={() => handleDeliveryPrint(record)}
          >
            ????????????
          </Button>,
        ];
      },
    },
  ];

  function handleDeliveryPrint(record) {
    const { supplierName, itemRefundNum, supplierNumber } = HeadDS.current.toData();
    const {
      customerItemCode,
      customerItemDescription,
      refundLineNum,
      refundQty,
      uom,
      uomName,
    } = record.toData();
    PrintDS.current.set('supplierNumber', supplierNumber);
    PrintDS.current.set('supplierName', supplierName);
    PrintDS.current.set('itemCode', customerItemCode);
    PrintDS.current.set('itemDescription', customerItemDescription);
    PrintDS.current.set('itemRefundNum', itemRefundNum);
    PrintDS.current.set('refundLineNum', refundLineNum);
    PrintDS.current.set('refundQty', refundQty);
    PrintDS.current.set('uom', uom);
    PrintDS.current.set('uomName', uomName);

    printModal = Modal.open({
      key: printKey,
      title: '???????????????????????????',
      children: (
        <div>
          <Form dataSet={PrintDS} columns={4}>
            <TextField name="supplierName" key="supplierName" disabled colSpan={2} />
            <TextField name="itemCode" key="itemCode" disabled colSpan={2} />
            <TextField name="itemRefundNum" key="itemRefundNum" disabled />
            <TextField name="refundLineNum" key="refundLineNum" disabled />
            <TextField name="refundQty" key="refundQty" disabled />
            <TextField name="uomName" key="uomName" disabled />
            <DatePicker name="productionDate" key="productionDate" colSpan={2} />
            <Select name="humidityLevelObj" key="humidityLevelObj" colSpan={2} />
            <DatePicker name="maturityDate" key="maturityDate" colSpan={2} />
            <TextField name="lotNo" key="lotNo" colSpan={2} />
            <TextField name="DateCode" key="DateCode" rowSpan={5} />
            <TextField name="version" key="version" />
            <TextField name="supplierItemCode" key="supplierItemCode" colSpan={2} />
            <TextField name="boxQtyOne" key="boxQtyOne" />
            <TextField name="perBoxAmountOne" key="perBoxAmountOne" />
            <TextField name="boxQtyTwo" key="boxQtyTwo" newLine />
            <TextField name="perBoxAmountTwo" key="perBoxAmountTwo" />
            <TextField name="boxQtyThree" key="boxQtyThree" newLine />
            <TextField name="perBoxAmountThree" key="perBoxAmountThree" />
            <TextField name="boxQtyFour" key="boxQtyFour" newLine />
            <TextField name="perBoxAmountFour" key="perBoxAmountFour" />
          </Form>
        </div>
      ),
      className: styles['zcom-return-print-page'],
      footer: (_, cancelBtn) => (
        <div>
          <Button color="primary" onClick={handleGoPrint}>
            ??????
          </Button>
          {cancelBtn}
        </div>
      ),
    });
  }

  async function handleGoPrint() {
    const validatePrintForm = await PrintDS.current.validate(true, false);
    if (!validatePrintForm) {
      notification.warning({
        message: '?????????????????????',
      });
      return;
    }
    const {
      refundQty,
      productionDate,
      maturityDate,
      boxQtyOne,
      boxQtyTwo,
      boxQtyThree,
      boxQtyFour,
      perBoxAmountOne,
      perBoxAmountTwo,
      perBoxAmountThree,
      perBoxAmountFour,
    } = PrintDS.current.toData();
    // ????????????*??????????????????????????????????????????????????????????????????
    const total =
      (boxQtyOne || 0) * (perBoxAmountOne || 0) +
      (boxQtyTwo || 0) * (perBoxAmountTwo || 0) +
      (boxQtyThree || 0) * (perBoxAmountThree || 0) +
      (boxQtyFour || 0) * (perBoxAmountFour || 0);
    if (total !== refundQty * 1) {
      notification.warning({
        message: '??????*???????????????????????????????????????',
      });
      return;
    }
    const printData = [];
    const validPeriodDay =
      (new Date(maturityDate).getTime() - new Date(productionDate).getTime()) /
      (1000 * 60 * 60 * 24); // ??????????????????
    const validPeriod =
      Math.floor(validPeriodDay / 30) > 0
        ? `${Math.floor(validPeriodDay / 30)}??????`
        : `${validPeriodDay}???`;
    const boxQty = (boxQtyOne || 0) + (boxQtyTwo || 0) + (boxQtyThree || 0) + (boxQtyFour || 0); // ?????????

    for (let i = 0; i < boxQty; i++) {
      let perBoxAmount; // ????????????
      if (boxQtyOne && i + 1 <= boxQtyOne) {
        perBoxAmount = perBoxAmountOne;
      } else if (boxQtyTwo && i + 1 <= boxQtyTwo + (boxQtyOne || 0)) {
        perBoxAmount = perBoxAmountTwo;
      } else if (boxQtyThree && i + 1 <= boxQtyThree + (boxQtyTwo || 0) + (boxQtyOne || 0)) {
        perBoxAmount = perBoxAmountThree;
      } else if (boxQtyFour && i + 1 <= boxQty) {
        perBoxAmount = perBoxAmountFour;
      }
      const obj = {
        ...PrintDS.current.toData(),
        validPeriod,
        boxQty,
        perBoxAmount,
      };
      printData.push(obj);
    }

    history.push({
      pathname: `/zcom/customer-return-maintain/item-print`,
      search: `tenantId=${getCurrentOrganizationId()}&itemRefundId=${itemRefundId}`,
      state: printData,
    });
    printModal.close();
  }

  const batchColumns = [
    { name: 'refundLineNum', width: 150, align: 'center' },
    { name: 'refundItemCode', width: 150, align: 'center' },
    { name: 'refundItemDescription', width: 150, align: 'center' },
    { name: 'batchQty', width: 150, align: 'center', editor: <NumberField disabled={!canEdit} /> },
    { name: 'batchNum', width: 150, align: 'center', editor: <TextField disabled={!canEdit} /> },
  ];

  const serialColumns = [
    { name: 'refundLineNum', width: 150, align: 'center' },
    { name: 'refundItemCode', width: 150, align: 'center' },
    { name: 'refundItemDescription', width: 150, align: 'center' },
    { name: 'serialQty', width: 150, align: 'center', editor: <NumberField disabled={!canEdit} /> },
    { name: 'serialNum', width: 150, align: 'center', editor: <TextField disabled={!canEdit} /> },
  ];

  async function handleSearch() {
    if (type === 'create') {
      setCanEdit(true);
      setLogisticsCanEdit(false);
      return;
    }
    await HeadDS.query();
    const { itemRefundStatus, fileUrl } = HeadDS.current.toData();

    setHeadFile(fileUrl);
    setCanPrint(['CONFIRMEND', 'RETURNED'].includes(itemRefundStatus));
    setCanEdit(['NEW', 'REFUSED'].includes(itemRefundStatus));
    setLogisticsCanEdit(['CONFIRMEND', 'RETURNED'].includes(itemRefundStatus));
    setItemHeadRefundStatus(itemRefundStatus);

    await LineDS.query();
    await LogisticsDS.query();
  }

  // ???????????????
  const handleHeadUploadSuccess = (res) => {
    if (res && !res.failed) {
      notification.success({
        message: '????????????',
      });
      HeadDS.current.set('fileUrl', res);
      setHeadFile(res);
    } else {
      notification.error({
        message: '????????????',
      });
    }
  };

  function deleteHeadFile() {
    HeadDS.current.set('fileUrl', '');
    setHeadFile('');
    notification.success({
      message: '????????????',
    });
  }

  const uploadData = (file) => {
    return {
      fileName: file.name,
      bucketName: 'zcom',
      directory: 'zcom',
    };
  };

  const uploadHeadProps = {
    headers: {
      Authorization: `bearer ${getAccessToken()}`,
    },
    accept: '*',
    action: `${HZERO_FILE}/v1/${organizationId}/files/multipart`,
    data: uploadData,
    onSuccess: handleHeadUploadSuccess,
    showUploadList: false,
  };

  function hanldeUpdateLogistics() {
    setLogisticsLoading(true);
    return new Promise(async (resolve) => {
      dispatch({
        type: 'customerRefund/updateLogisticss',
        payload: {
          ...LogisticsDS.current.data,
          sourceOrderId: HeadDS.current.get('itemRefundId'),
          sourceOrderNum: HeadDS.current.get('itemRefundNum'),
          tenantId: HeadDS.current.get('tenantId'),
          orderLogisticsType: 'REFUND',
        },
      })
        .then((res) => {
          if (res && !res.failed) {
            notification.success({
              message: '????????????',
            });
            const pathName = `/zcom/customer-return-maintain`;
            history.push(pathName);
          }
          resolve(setLogisticsLoading(false));
        })
        .catch(() => {
          resolve(setLogisticsLoading(false));
        });
    });
  }

  function handleSave(itemRefundStatus, changeStatus) {
    changeStatus(true);
    return new Promise(async (resolve) => {
      const validateHead = await HeadDS.current.validate(false, false);
      const validateLine = await LineDS.validate(false, false);
      let validateValue = true;
      let validateSerial = true;
      let validateBatch = true;
      const headData = HeadDS.current.toData();
      const deliveryOrderLineList = LineDS.data.map((item) => {
        const {
          tagFlag,
          sequenceLotControl,
          refundBatchList,
          refundSerialList,
          refundQty,
        } = item.toData();

        if (tagFlag && !refundSerialList) {
          validateValue = false;
        }

        if (tagFlag && refundSerialList?.length && validateSerial) {
          validateSerial = validateBatchOrserial(refundSerialList, 'serialQty', refundQty);
        }

        if (sequenceLotControl === 'LOT' && !refundBatchList) {
          validateValue = false;
        }

        if (sequenceLotControl === 'LOT' && refundBatchList?.length && validateBatch) {
          validateBatch = validateBatchOrserial(refundBatchList, 'batchQty', refundQty);
        }

        return item.toData();
      });

      if (!validateHead || !validateLine || !validateValue) {
        notification.warning({
          message: '??????????????????????????????????????????????????????',
        });
        resolve(changeStatus(false));
        return false;
      }

      if (!validateBatch) {
        notification.warning({
          message: `?????????????????????????????????????????????`,
        });
        resolve(changeStatus(false));
        return false;
      }

      if (!validateSerial) {
        notification.warning({
          message: `????????????????????????????????????????????????`,
        });
        resolve(changeStatus(false));
        return false;
      }

      dispatch({
        type: 'customerRefund/saveItemRefunds',
        payload: {
          ...headData,
          itemRefundLineList: deliveryOrderLineList,
          itemRefundStatus,
          itemRefundDate: headData.itemRefundDate
            ? moment(headData.itemRefundDate).format('YYYY-MM-DD HH:mm:ss')
            : null,
        },
      })
        .then((res) => {
          if (res && !res.failed) {
            notification.success({
              message: '????????????',
            });
            const pathName = `/zcom/customer-return-maintain`;
            history.push(pathName);
          }
          resolve(changeStatus(false));
        })
        .catch(() => {
          resolve(changeStatus(false));
        });
    });
  }

  /**
   * ????????????????????????????????????????????????????????????????????????
   */
  function validateBatchOrserial(list, filed, refundQty) {
    let totalNum = 0;

    if (list && list.length) {
      list.forEach((item) => {
        totalNum += item[filed];
      });
    }

    if (Number(totalNum) !== Number(refundQty)) {
      return false;
    }
    return true;
  }

  function handlePrint() {
    history.push({
      pathname: `/zcom/customer-return-maintain/print`,
      search: `tenantId=${getCurrentOrganizationId()}&itemRefundId=${itemRefundId}`,
    });
  }

  /**
   * ????????????
   */
  const batchMaintain = (record, typeMaintain) => {
    if (!LineDS.current.get('refundQty')) {
      notification.warning({
        message: '???????????????????????????',
      });
      return false;
    }
    const {
      refundItemCode,
      refundItemDescription,
      refundLineNum,
      refundBatchList,
    } = record.toData();
    currentDS = typeMaintain;

    BatchDS.reset();
    if (refundBatchList && refundBatchList.length) {
      const list = refundBatchList.map((item) => {
        return {
          ...item,
          refundItemCode,
          refundItemDescription,
          refundLineNum,
        };
      });
      BatchDS.data = list;
    } else {
      BatchDS.data = [];
      BatchDS.create({}, 0);
      BatchDS.current.set('refundItemCode', refundItemCode);
      BatchDS.current.set('refundItemDescription', refundItemDescription);
      BatchDS.current.set('refundLineNum', refundLineNum);
    }

    batchModal = Modal.open({
      key: batchKey,
      title: '????????????',
      children: (
        <div>
          <div className={styles['receive-button']}>
            <Button
              color="primary"
              className={styles['receive-button-save']}
              onClick={saveBatch}
              disabled={!canEdit}
            >
              ??????
            </Button>
            <Button color="primary" onClick={deleteBatch} disabled={!canEdit}>
              ??????
            </Button>

            <Button color="primary" onClick={() => addBatch(record)} disabled={!canEdit}>
              ??????
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
   * ???????????????
   */
  const serialMaintain = (record, typeMaintain) => {
    if (!LineDS.current.get('refundQty')) {
      notification.warning({
        message: '???????????????????????????',
      });
      return false;
    }

    currentDS = typeMaintain;
    SerialDS.reset();

    const {
      refundItemCode,
      refundItemDescription,
      refundLineNum,
      refundSerialList,
    } = record.toData();

    if (refundSerialList && refundSerialList.length) {
      const list = refundSerialList.map((item) => {
        return {
          ...item,
          refundItemCode,
          refundItemDescription,
          refundLineNum,
        };
      });

      SerialDS.data = list;
    } else {
      SerialDS.data = [];
      SerialDS.create({}, 0);
      SerialDS.current.set('refundItemCode', refundItemCode);
      SerialDS.current.set('refundItemDescription', refundItemDescription);
      SerialDS.current.set('refundLineNum', refundLineNum);
    }

    serialModal = Modal.open({
      key: serialKey,
      title: '???????????????',
      children: (
        <div>
          <div className={styles['receive-button']}>
            <Button
              className={styles['receive-button-save']}
              color="primary"
              onClick={saveBatch}
              disabled={!canEdit}
            >
              ??????
            </Button>
            <Button color="primary" onClick={deleteSerial} disabled={!canEdit}>
              ??????
            </Button>
            <Button color="primary" onClick={() => addBatch(record)} disabled={!canEdit}>
              ??????
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
   * ????????????/?????????
   */
  const saveBatch = async () => {
    const ds = currentDS === 'sequenceLotControl' ? BatchDS : SerialDS;
    const modal = currentDS === 'sequenceLotControl' ? batchModal : serialModal;
    const refundQty = LineDS.current.get('refundQty');

    const continueFlag = await ds.validate(false, false);
    if (!continueFlag) {
      return;
    }

    let totalNum = 0;

    const refundBatchList = ds.data.map((record) => {
      // ??????
      if (currentDS === 'sequenceLotControl') {
        const { batchQty } = record.toData();
        totalNum += batchQty;
        return record.toData();
      } else {
        // ?????????
        const { serialQty } = record.toData();
        totalNum += serialQty;
        return record.toData();
      }
    });

    if (Number(totalNum) !== Number(refundQty)) {
      notification.error({
        message: `?????????${
          currentDS === 'sequenceLotControl' ? '??????' : '?????????'
        }??????????????????????????????`,
      });
      return;
    }

    if (currentDS === 'sequenceLotControl') {
      LineDS.current.set('refundBatchList', refundBatchList);
    } else {
      LineDS.current.set('refundSerialList', refundBatchList);
    }

    modal.close();
  };

  /**
   * ????????????
   */
  const addBatch = async (record) => {
    const ds = currentDS === 'sequenceLotControl' ? BatchDS : SerialDS;

    const { refundItemCode, refundItemDescription, refundLineNum } = record.toData();
    ds.create({ refundItemCode, refundItemDescription, refundLineNum }, 0);
  };

  const deleteBatch = () => {
    const list = BatchDS.selected;
    BatchDS.delete(list);
  };

  const deleteSerial = () => {
    const list = SerialDS.selected;

    SerialDS.delete(list);
  };

  const handleHeadDelete = () => {
    const list = LineDS.selected;
    if (!list.length) {
      notification.warning({
        message: intl.get(`zcom.common.message.validation.select`).d('????????????????????????'),
      });
      return false;
    }
    const unSubmitList = [];
    const submitList = [];
    list.forEach((record) => {
      const { refundLineId } = record.toData();
      if (refundLineId) {
        submitList.push(record.toData());
      } else {
        unSubmitList.push(record);
      }
    });

    if (unSubmitList.length) {
      LineDS.delete(unSubmitList);
    }

    if (submitList.length) {
      dispatch({
        type: 'customerRefund/deleteLineItemRefunds',
        payload: submitList,
      }).then((res) => {
        if (res && !res.failed) {
          notification.success({
            message: '????????????',
          });
          LineDS.query();
        }
      });
    }
  };

  // ???????????????
  function downloadLineFile(file) {
    const api = `${HZERO_FILE}/v1/${organizationId}/files/download`;
    downloadFile({
      requestUrl: api,
      queryParams: [
        { name: 'bucketName', value: 'zcom' },
        { name: 'directory', value: 'zcom' },
        { name: 'url', value: file },
      ],
    });
  }

  const handleCreate = () => {
    if (!canEdit) {
      return;
    }
    LineDS.create({}, 0);
  };

  function handleToggle() {
    setHeadShow(!headShow);
  }

  function handleBatchExport(code, title) {
    try {
      openTab({
        key: `/himp/commentImport/${code}`,
        title: intl.get(`${intlPrefix}.view.title.customerRefund`).d(`${title}`),
        search: queryString.stringify({
          action: 'himp.commentImport.view.button.templateImport',
        }),
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e.message);
    }
  }

  // ??????
  function handleRevocable() {
    return new Promise(async (resolve) => {
      setRevocableLoading(true);
      dispatch({
        type: 'customerRefund/revocable',
        payload: {
          ...HeadDS.current.data,
        },
      })
        .then((res) => {
          if (res && !res.failed) {
            notification.success({
              message: '????????????',
            });
            const pathName = `/zcom/customer-return-maintain`;
            history.push(pathName);
          }
          resolve(setRevocableLoading(false));
        })
        .catch(() => {
          resolve(setRevocableLoading(false));
        });
    });
  }

  return (
    <Fragment>
      <Header
        title={
          type === 'create'
            ? intl.get(`${intlPrefix}.view.title.deliveryCreate`).d('?????????????????????')
            : intl.get(`${intlPrefix}.view.title.deliveryMaintain`).d('?????????????????????')
        }
        backPath="/zcom/customer-return-maintain/list"
      >
        <Button
          onClick={hanldeUpdateLogistics}
          loading={logisticsLoading}
          disabled={!logisticsCanEdit}
        >
          ??????????????????
        </Button>
        <Button color="primary" onClick={handlePrint} disabled={!canPrint}>
          ???????????????
        </Button>
        <Button
          color="primary"
          onClick={() => handleSave('RELEASED', setSubmitLoading)}
          loading={submitLoading}
          disabled={!canEdit}
        >
          ???????????????
        </Button>
        <Button
          color="primary"
          onClick={() => handleSave('NEW', setSaveLoading)}
          loading={saveLoading}
          disabled={!canEdit}
        >
          ??????
        </Button>
        <Button color="primary" onClick={handleHeadDelete} disabled={!canEdit}>
          ????????????
        </Button>
        {type !== 'create' && (
          <Button
            onClick={handleRevocable}
            loading={revocableLoading}
            disabled={
              HeadDS.current.data.itemRefundStatus === 'CONFIRMEND' ||
              HeadDS.current.data.itemRefundStatus === 'REFUSED' ||
              HeadDS.current.data.itemRefundStatus === 'RELEASED'
                ? null
                : true
            }
          >
            ??????
          </Button>
        )}
        {canEdit && (
          <Upload {...uploadHeadProps}>
            <Button>{headFile ? '????????????' : '????????????'}</Button>
          </Upload>
        )}
        {headFile && (
          <Button
            onClick={() => downloadLineFile(headFile)}
            style={{ marginRight: '10px', marginTop: '3px' }}
          >
            ????????????
          </Button>
        )}
        {headFile && canEdit && (
          <Button style={{ marginLeft: '10px', marginTop: '3px' }} onClick={deleteHeadFile}>
            ????????????
          </Button>
        )}
        {type === 'create' && (
          <>
            <HButton
              icon="upload"
              onClick={() => handleBatchExport(itemRefundImport, '???????????????')}
            >
              {intl.get('zcom.common.button.import').d('???????????????')}
            </HButton>
            <HButton
              icon="upload"
              onClick={() => handleBatchExport(itemRefundLotTagImport, '?????????????????????')}
            >
              {intl.get('zcom.common.button.import').d('?????????????????????')}
            </HButton>
          </>
        )}
      </Header>
      <Content>
        <div className={styles['zcom-customer-delivery-headInfo']}>
          <span>???????????????</span>
          <span className={styles['headInfo-toggle']} onClick={handleToggle}>
            {headShow ? '??????' : '??????'}
          </span>
        </div>
        {headShow ? (
          <Form dataSet={HeadDS} columns={4}>
            <Lov name="refundOuObj" key="meOuObj" disabled={!canEdit} />
            {type === 'detail' ? (
              <TextField name="itemRefundNum" key="itemRefundNum" disabled />
            ) : null}
            <Lov name="customerObj" key="customerObj" disabled={!canEdit} />
            {type === 'detail' ? (
              <Select name="itemRefundStatus" key="itemRefundStatus" disabled />
            ) : null}
            <DatePicker name="itemRefundDate" key="itemRefundDate" disabled={!canEdit} />
            <Lov name="refundWarehouseObj" key="refundWarehouseObj" disabled={!canEdit} />
            <Lov name="customerWarehouseObj" key="customerWarehouseObj" disabled={!canEdit} />
            <TextField name="itemRefundAddress" key="itemRefundaddress" disabled={!canEdit} />
            <TextField newLine colSpan={2} name="remark" key="remark" disabled={!canEdit} />
            {itemheadRefundStatus === 'REFUSED' || itemheadRefundStatus === 'CONFIRMEND' ? (
              <TextField
                newLine
                colSpan={2}
                name="approvalOpinion"
                key="approvalOpinion"
                disabled
              />
            ) : null}
          </Form>
        ) : null}
        <Tabs defaultActiveKey="material">
          <TabPane tab="????????????" key="material">
            <Table
              dataSet={LineDS}
              columns={lineColumns}
              columnResizable="true"
              buttons={[['add', { onClick: () => handleCreate() }]]}
            />
          </TabPane>
          <TabPane tab="????????????" key="logistics">
            <div className="base-line">
              <div className="base-line-tag" />
              <div className="base-line-title">????????????</div>
            </div>
            <Form dataSet={LogisticsDS} columns={3}>
              <TextField name="courierNumber" key="courierNumber" disabled={!logisticsCanEdit} />
              <TextField name="deliveryStaff" key="deliveryStaff" disabled={!logisticsCanEdit} />
              <TextField
                name="addresseeContact"
                key="addresseeContact"
                disabled={!logisticsCanEdit}
              />
              <TextField
                name="logisticsCompany"
                key="logisticsCompany"
                disabled={!logisticsCanEdit}
              />
              <TextField
                name="deliveryContact"
                key="deliveryContact"
                disabled={!logisticsCanEdit}
              />
              <TextField name="freight" key="freight" disabled={!logisticsCanEdit} />
            </Form>
          </TabPane>
        </Tabs>
      </Content>
    </Fragment>
  );
}

export default connect(({ customerRefund: { ids } }) => ({ ids }))(
  formatterCollections({
    code: [`${intlPrefix}`],
  })(ZcomMoDeliveryDetail)
);
