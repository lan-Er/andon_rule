/**
 * @Description: 报价单维护-详情页
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-03-26 17:19:08
 */

import moment from 'moment';
import React, { useState, useEffect, Fragment } from 'react';
import { Upload } from 'choerodon-ui';
import {
  DataSet,
  Button,
  Tabs,
  Table,
  Form,
  DatePicker,
  Select,
  TextField,
  Lov,
  Modal,
  SelectBox,
  TextArea,
} from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import { HZERO_FILE } from 'utils/config';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentUser, getAccessToken, getCurrentOrganizationId } from 'utils/utils';
import ItemAttributeSelect from '@/components/ItemAttributeSelect/index';
import { downloadFile } from 'services/api';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { QuotationHeadDS, QuotationLineDS } from '../store/QuotationMaintainDS';
import styles from './index.less';

const { TabPane } = Tabs;
const { Option } = SelectBox;
const withdrawnKey = Modal.key();
const intlPrefix = 'zcom.quotationMaintain';
const organizationId = getCurrentOrganizationId();
const QuotationDetailHeadDS = () => new DataSet(QuotationHeadDS());
const QuotationDetailLineDS = () => new DataSet(QuotationLineDS());

let withdrawnReason = ''; // 撤回原因
let withdrawnRemark = ''; // 撤回补充说明

function ZcomQuotationMaintainDetail({ match, location, history, dispatch }) {
  const HeadDS = useDataSet(QuotationDetailHeadDS, ZcomQuotationMaintainDetail);
  const LineDS = useDataSet(QuotationDetailLineDS);
  const {
    params: { type, quotationOrderId },
  } = match;
  const { state } = location;
  const stateObj = state || {};

  const [canEdit, setCanEdit] = useState(true);
  const [canWithdrawn, setCanWithrawn] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    HeadDS.setQueryParameter('quotationOrderId', null);
    LineDS.setQueryParameter('quotationOrderId', null);
    HeadDS.data = [];
    LineDS.data = [];
    HeadDS.create();
    LineDS.clearCachedSelected();
    if (type === 'create') {
      const { realName } = getCurrentUser();
      HeadDS.current.set('createdByName', realName);
    } else {
      setCanEdit(['NEW', 'WITHDRAWN', 'RETURNED'].includes(stateObj.quotationOrderStatus));
      setCanWithrawn(['RETURNED', 'QUOTED'].includes(stateObj.quotationOrderStatus));
      HeadDS.setQueryParameter('quotationOrderId', quotationOrderId);
      LineDS.setQueryParameter('quotationOrderId', quotationOrderId);
      handleSearch();
    }
  }, [quotationOrderId]);

  function handleSearch() {
    HeadDS.query();
    LineDS.query();
  }

  const handleLineCreate = () => {
    LineDS.create({
      quotationOrderId,
      quotationOrderNum: HeadDS.current.get('quotationOrderNum'),
    });
  };

  function lineValidate() {
    const arr = [];
    LineDS.data.forEach((v) => {
      arr.push(v.validate(true, false));
    });
    return arr;
  }

  function handleSave() {
    setSaveLoading(true);
    return new Promise(async (resolve) => {
      const validateHead = await HeadDS.current.validate(true, false);
      if (!validateHead) {
        notification.warning({
          message: '数据校验不通过',
        });
        resolve(setSaveLoading(false));
        return false;
      }
      const headData = HeadDS.current.toData();

      dispatch({
        type: 'quotationMaintain/quotationOrderSave',
        payload: {
          ...headData,
          supplierPromiseDate: headData.supplierPromiseDate
            ? moment(headData.supplierPromiseDate).format('YYYY-MM-DD HH:mm:ss')
            : null,
        },
      }).then((res) => {
        if (res && !res.failed) {
          notification.success({
            message: '保存成功',
          });
          if (quotationOrderId) {
            handleSearch();
          } else {
            const pathname = `/zcom/quotation-maintain/detail/${res.quotationOrderId}`;
            history.push({
              pathname,
              state: {
                quotationOrderNum: res.quotationOrderNum,
                quotationOrderStatus: res.quotationOrderStatus,
              },
            });
          }
        }
        resolve(setSaveLoading(false));
      });
    });
  }

  function handleSubmit() {
    setSubmitLoading(true);
    return new Promise(async (resolve) => {
      const validateHead = await HeadDS.current.validate(true, false);
      const validateLineResult = await Promise.all(lineValidate());
      if (!validateHead || validateLineResult.findIndex((v) => !v) !== -1) {
        notification.warning({
          message: '数据校验不通过',
        });
        resolve(setSubmitLoading(false));
        return false;
      }
      if (!LineDS.data.length) {
        notification.warning({
          message: '至少有一行有效的物料',
        });
        resolve(setSubmitLoading(false));
        return false;
      }
      const headData = HeadDS.current.toData();
      const quotationOrderLineList = LineDS.data.map((item) => {
        const obj = Object.assign({}, item.toData(), {
          excludingTaxAmount: item.toData().excludingTaxPrice * item.toData().quotationQty,
        });
        return obj;
      });
      dispatch({
        type: 'quotationMaintain/quotationOrderSubmit',
        payload: [
          {
            ...headData,
            quotationOrderStatus: 'QUOTED',
            supplierPromiseDate: headData.supplierPromiseDate
              ? moment(headData.supplierPromiseDate).format('YYYY-MM-DD HH:mm:ss')
              : null,
            quotationOrderLineList,
          },
        ],
      }).then((res) => {
        if (res && !res.failed) {
          notification.success({
            message: '提交成功',
          });
          const pathName = `/zcom/quotation-maintain`;
          history.push(pathName);
        }
        resolve(setSubmitLoading(false));
      });
    });
  }

  function handleWithdrawnSure() {
    return new Promise(async (resolve) => {
      if (!withdrawnReason) {
        notification.warning({
          message: '请选择您撤回报价的原因',
        });
        resolve(false);
        return;
      }
      dispatch({
        type: 'quotationMaintain/quotationOrderRecall',
        payload: [
          {
            ...HeadDS.current.toData(),
            operationOpinion: `${withdrawnReason}${withdrawnRemark ? `:${withdrawnRemark}` : ''}`,
          },
        ],
      }).then((res) => {
        if (res && !res.failed) {
          notification.success({
            message: '撤回成功',
          });
          const pathName = `/zcom/quotation-maintain`;
          history.push(pathName);
        }
        resolve();
      });
    });
  }

  function handleReasonChange(e) {
    let str;
    switch (e) {
      case 'fix':
        str = '修改报价';
        break;
      case 'cancel':
        str = '取消报价';
        break;
      case 'other':
        str = '其他';
        break;
      default:
        str = '';
        break;
    }
    withdrawnReason = str;
  }

  function handleRemarkChange(e) {
    withdrawnRemark = e;
  }

  function handleWithdrawn() {
    withdrawnReason = '';
    withdrawnRemark = '';
    Modal.open({
      key: withdrawnKey,
      title: '撤回报价',
      children: (
        <div>
          <div className={styles['withdrawn-title']}>请选择您撤回报价的原因（必选）</div>
          <SelectBox onChange={handleReasonChange}>
            <Option value="fix">修改报价</Option>
            <Option value="cancel">取消报价</Option>
            <Option value="other">其他</Option>
          </SelectBox>
          <TextArea placeholder="补充说明" cols={60} onChange={handleRemarkChange} />
        </div>
      ),
      className: styles['zcom-quotation-maintain-detail-withdrawn'],
      onOk: () => handleWithdrawnSure(),
    });
  }

  function handleLineDelete() {
    const list = LineDS.selected;
    LineDS.delete(list);
  }

  function deleteLineFile() {
    LineDS.current.set('fileUrl', '');
    notification.success({
      message: '删除成功',
    });
  }

  // 查看行附件
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

  // 上传行附件
  const handleLineUploadSuccess = (res) => {
    if (res && !res.failed) {
      notification.success({
        message: '上传成功',
      });
      LineDS.current.set('fileUrl', res);
    } else {
      notification.error({
        message: '上传失败',
      });
    }
  };

  const uploadData = (file) => {
    return {
      fileName: file.name,
      bucketName: 'zcom',
      directory: 'zcom',
    };
  };

  const uploadProps = {
    headers: {
      Authorization: `bearer ${getAccessToken()}`,
    },
    accept: '*',
    action: `${HZERO_FILE}/v1/${organizationId}/files/multipart`,
    data: uploadData,
    onSuccess: handleLineUploadSuccess,
    showUploadList: false,
  };

  function handleSure(obj) {
    const ds = LineDS;
    ds.current.set('itemAttr', {
      ...ds.current.toData(),
      ...obj,
      itemId: ds.current.get('supplierItemId'),
      itemCode: ds.current.get('supplierItemCode'),
    });
  }

  const handleDelete = () => {
    return new Promise(async (resolve) => {
      dispatch({
        type: 'quotationMaintain/quotationOrderDelete',
        payload: [
          {
            ...HeadDS.current.toData(),
          },
        ],
      }).then((res) => {
        if (res && !res.failed) {
          notification.success({
            message: '删除成功',
          });
          const pathname = `/zcom/quotation-maintain`;
          history.push({
            pathname,
          });
        }
        resolve();
      });
    });
  };

  const lineColumns = [
    { name: 'quotationOrderLineNum', width: 50, lock: true },
    { name: 'supplierItemObj', width: 150, editor: canEdit, lock: true },
    { name: 'supplierItemDesc', width: 150, lock: true },
    {
      name: 'customerItemCode',
      width: 150,
      renderer: ({ record }) => {
        return (
          <>
            <div>{record.get('customerItemCode')}</div>
            <div>{record.get('customerItemDesc')}</div>
          </>
        );
      },
    },
    {
      name: 'itemAttr',
      width: 150,
      renderer: ({ record, value }) => {
        return (
          <ItemAttributeSelect
            handleSure={handleSure}
            ds={LineDS}
            data={value}
            itemId={record.get('supplierItemId')}
            itemDesc={record.get('supplierItemDesc')}
            disabled={!canEdit || !record.editing}
          />
        );
      },
    },
    { name: 'customerUomCode', align: 'left' },
    { name: 'customerQuotationQty', align: 'left', editor: canEdit },
    { name: 'customerPrice', editor: canEdit },
    {
      name: 'taxRateObj',
      editor: canEdit,
    },
    { name: 'specification', width: 150, editor: canEdit },
    { name: 'processingTechnic', width: 150, editor: canEdit },
    { name: 'customerCounterOfferPrice', width: 150 },
    { name: 'counterOfferReason', width: 150 },
    { name: 'remark', width: 150, editor: canEdit },
    {
      name: 'fileUrl',
      width: 210,
      renderer: ({ record }) => {
        const value = record.data.fileUrl;
        if (canEdit) {
          return value
            ? [
              <Upload disabled={!record.editing} {...uploadProps}>
                <span style={{ cursor: 'pointer', color: '#29bece' }}>修改附件</span>
              </Upload>,
              <a
                disabled={!record.editing}
                style={{ marginLeft: '5px' }}
                onClick={() => downloadLineFile(value)}
              >
                  查看附件
              </a>,
              <a
                disabled={!record.editing}
                style={{ marginLeft: '5px' }}
                onClick={deleteLineFile}
              >
                  删除附件
              </a>,
              ]
            : [
              <Upload disabled={!record.editing} {...uploadProps}>
                <span style={{ cursor: 'pointer', color: '#29bece' }}>上传附件</span>
              </Upload>,
              ];
        } else {
          return value
            ? [
              <a disabled={!record.editing} onClick={() => downloadLineFile(value)}>
                  查看附件
              </a>,
              ]
            : null;
        }
      },
    },
    {
      header: '操作',
      command: ['edit'],
      lock: 'right',
    },
  ];

  return (
    <Fragment>
      <Header title="报价单详情" backPath="/zcom/quotation-maintain">
        {canEdit && (
          <>
            <Button color="primary" onClick={handleSubmit} loading={submitLoading}>
              提交
            </Button>
            <Button onClick={handleSave} loading={saveLoading}>
              保存
            </Button>
          </>
        )}
        {canWithdrawn && <Button onClick={handleWithdrawn}>撤回</Button>}
        {canEdit && <Button onClick={handleDelete}>删除</Button>}
      </Header>
      <Content className={styles['zcom-quotation-maintain-detail']}>
        <Form dataSet={HeadDS} columns={4} labelWidth={120}>
          <Lov
            name="companyObj"
            key="companyObj"
            clearButton
            noCache
            disabled={type === 'detail'}
          />
          <Select name="quotationOrderType" key="quotationOrderType" disabled />
          <Lov
            name="customerObj"
            key="customerObj"
            clearButton
            noCache
            disabled={type === 'detail'}
          />
          <TextField
            name="quotationOrderName"
            key="quotationOrderName"
            disabled={type === 'detail'}
          />
          <TextField name="quotationOrderNum" key="quotationOrderNum" disabled />
          <TextField name="quotationOrderStatus" key="quotationOrderStatus" disabled />
          <Lov
            name="currencyObj"
            key="currencyObj"
            clearButton
            noCache
            disabled={type === 'detail'}
          />
          <TextField name="productionCycle" key="productionCycle" disabled={!canEdit} />
          <DatePicker
            mode="date"
            name="supplierPromiseDate"
            key="supplierPromiseDate"
            disabled={!canEdit}
          />
          <Select name="quotationSourceType" key="quotationSourceType" disabled={!canEdit} />
          <TextField name="sourceDocNum" key="sourceDocNum" disabled={!canEdit} />
          <TextArea
            newLine
            colSpan={2}
            name="remark"
            key="remark"
            disabled={!canEdit}
            resize="both"
            autoSize
          />
        </Form>
        <Tabs defaultActiveKey="detail">
          <TabPane tab="报价明细" key="detail">
            <Table
              dataSet={LineDS}
              columns={lineColumns}
              columnResizable="true"
              editMode="inline"
              rowHeight="auto"
              buttons={
                canEdit && type !== 'create'
                  ? [
                      ['add', { onClick: () => handleLineCreate() }],
                      ['delete', { onClick: () => handleLineDelete() }],
                    ]
                  : null
              }
            />
          </TabPane>
        </Tabs>
      </Content>
    </Fragment>
  );
}

export default formatterCollections({
  code: [`${intlPrefix}`],
})(ZcomQuotationMaintainDetail);
