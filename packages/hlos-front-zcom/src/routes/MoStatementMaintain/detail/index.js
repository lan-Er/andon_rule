/**
 * @Description: 对账单创建/维护明细
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2020-12-15 14:15:19
 */

import React, { useState, useEffect, Fragment } from 'react';
import { connect } from 'dva';
import {
  DataSet,
  Button,
  Form,
  TextField,
  Select,
  TextArea,
  Tabs,
  Table,
  DatePicker,
} from 'choerodon-ui/pro';
import { Upload } from 'choerodon-ui';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import { HZERO_FILE } from 'utils/config';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId, getAccessToken } from 'utils/utils';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { downloadFile } from 'services/api';
import { getSerialNum } from '@/utils/renderer';
import { statementDetailHeadDS, statementDetailLineDS } from '../store/StatementMaintainDS';
import styles from './index.less';

const { TabPane } = Tabs;
const intlPrefix = 'zcom.statementMaintain';
const organizationId = getCurrentOrganizationId();
const DetailHeadDS = () => new DataSet({ ...statementDetailHeadDS() });
const DetailLineDS = () => new DataSet({ ...statementDetailLineDS() });

function ZcomStatementDetail({ dispatch, match, history, location }) {
  const HeadDS = useDataSet(() => DetailHeadDS(), ZcomStatementDetail);
  const LineDS = useDataSet(() => DetailLineDS());
  const {
    params: { type, verificationOrderId },
  } = match;
  const [headShow, setHeadShow] = useState(true);
  const [canEdit, setCanEdit] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [poLoading, setPoLoading] = useState(false);
  const [headFile, setHeadFile] = useState(null);
  const [verificationOrderStatus, setVerificationOrderStatus] = useState(null);

  useEffect(() => {
    const { state } = location;
    HeadDS.setQueryParameter('verificationOrderId', null);
    LineDS.setQueryParameter('verificationOrderId', null);
    HeadDS.data = [];
    LineDS.data = [];
    HeadDS.create();
    LineDS.clearCachedSelected();
    if (type === 'create') {
      HeadDS.setQueryParameter('executeLineIdList', state.arr);
      LineDS.setQueryParameter('executeLineIdList', state.arr);
    } else {
      HeadDS.setQueryParameter('verificationOrderId', verificationOrderId);
      LineDS.setQueryParameter('verificationOrderId', verificationOrderId);
    }
    handleSearch();
  }, [verificationOrderId]);

  async function handleSearch() {
    await HeadDS.query();
    setHeadFile(HeadDS.current.get('fileUrl'));
    setVerificationOrderStatus(HeadDS.current.get('verificationOrderStatus'));
    setCanEdit(
      type === 'create' || ['NEW', 'REFUSED'].includes(HeadDS.current.data.verificationOrderStatus)
    );
    if (type === 'create') {
      const { receiveDateTo } = location.state || '';
      if (receiveDateTo) {
        HeadDS.current.set('postingDate', receiveDateTo);
      }
    }
    LineDS.query();
  }

  function handleToggle() {
    setHeadShow(!headShow);
  }

  function handleSave(setLoading, apiName) {
    setLoading(true);
    return new Promise(async (resolve) => {
      const validateHead = await HeadDS.current.validate(true, false);
      if (!validateHead) {
        notification.warning({
          message: '数据校验不通过',
        });
        resolve(setLoading(false));
        return false;
      }
      const headData = HeadDS.current.toData();

      const verificationOrderLineList = LineDS.data.map((item) => {
        const obj = Object.assign({}, item.toData(), {});
        if (verificationOrderId) {
          return obj;
        } else {
          return {
            ...obj,
            verificationUomId: obj.uomId,
            verificationUom: obj.uom,
            sourceExecuteLineId: obj.executeLineId,
          };
        }
      });

      const params = {
        ...headData,
        postingDate: `${headData.postingDate} 00:00:00`,
        verificationOrderStatus: verificationOrderId ? headData.verificationOrderStatus : 'NEW',
        verificationOrderLineList,
      };

      dispatch({
        type: `moStatementMaintain/${apiName}`,
        payload: apiName === 'submitVerificationOrder' ? [params] : params,
      }).then((res) => {
        if (res && !res.failed) {
          notification.success({
            message: '操作成功',
          });
          // if (verificationOrderId) {
          //   handleSearch();
          // } else {
          const pathName =
            type === 'create'
              ? `/zcom/mo-statement-maintain/detail/${res.verificationOrderId}`
              : '/zcom/mo-statement-maintain';
          history.push(pathName);
          // }
        } else if (type === 'create') {
          const pathname = `/zcom/mo-statement-maintain/list`;
          const setCurrentTab = 'maintain';
          history.push({
            pathname,
            state: {
              setCurrentTab,
            },
          });
          resolve(setLoading(false));
        } else {
          HeadDS.query();
          LineDS.query();
        }
        resolve(setLoading(false));
      });
    });
  }

  const uploadData = (file) => {
    return {
      fileName: file.name,
      bucketName: 'zcom',
      directory: 'zcom',
    };
  };

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

  function deleteLineFile() {
    LineDS.current.set('fileUrl', '');
    notification.success({
      message: '删除成功',
    });
  }

  const uploadProps = {
    headers: {
      Authorization: `bearer ${getAccessToken()}`,
    },
    accept: '*',
    action: `${HZERO_FILE}/v1/${organizationId}/files/multipart`,
    data: uploadData,
    onSuccess: handleLineUploadSuccess,
  };

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

  const lineColumns = [
    {
      header: '行号',
      width: 60,
      lock: true,
      renderer: ({ record }) => getSerialNum(record),
    },
    { name: 'sourceOrderNum', width: 150 },
    { name: 'moTypeName', width: 150 },
    { name: 'customerItemCode', width: 150 },
    { name: 'customerItemDescription', width: 150 },
    { name: 'supplierItemCode', width: 150 },
    { name: 'supplierItemDescription', width: 150 },
    { name: 'sourceOrderQty', width: 150 },
    { name: 'completionQty', width: 150 },
    { name: 'verificationQty', width: 150 },
    { name: 'moVerificationTotal', width: 150 },
    { name: 'uom', width: 150 },
    { name: 'beforeExcludingTaxPrice', width: 150 },
    { name: 'beforeExcludingTaxAmount', width: 150 },
    { name: 'currencyCode', width: 150 },
    { name: 'externalOrderNum', width: 150 },
    { name: 'externalOrderLineNum', width: 150 },
    { name: 'attributeString1', width: 150 },
    { name: 'taxRate', width: 150 },
    { name: 'remark', width: 150, editor: canEdit },
    {
      name: 'fileUrl',
      width: 250,
      command: ({ record }) => {
        const value = record.data.fileUrl;
        if (canEdit) {
          return value
            ? [
              <Upload {...uploadProps}>
                <span style={{ cursor: 'pointer', color: '#29bece' }}>修改附件</span>
              </Upload>,
              <Button
                style={{ marginLeft: '5px', marginTop: '-2px' }}
                onClick={() => downloadLineFile(value)}
              >
                  查看附件
              </Button>,
              <Button style={{ marginLeft: '-5px', marginTop: '-2px' }} onClick={deleteLineFile}>
                  删除附件
              </Button>,
              ]
            : [
              <Upload {...uploadProps}>
                <span style={{ cursor: 'pointer', color: '#29bece' }}>上传附件</span>
              </Upload>,
              ];
        } else {
          return [
            <Button onClick={() => downloadLineFile(value)}>{value ? '查看附件' : ''}</Button>,
          ];
        }
      },
    },
  ];

  // 上传头附件
  const handleHeadUploadSuccess = (res) => {
    if (res && !res.failed) {
      notification.success({
        message: '上传成功',
      });
      HeadDS.current.set('fileUrl', res);
      setHeadFile(res);
    } else {
      notification.error({
        message: '上传失败',
      });
    }
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

  function deleteHeadFile() {
    HeadDS.current.set('fileUrl', '');
    setHeadFile('');
    notification.success({
      message: '删除成功',
    });
  }

  return (
    <Fragment>
      <Header
        title={
          type === 'create'
            ? intl.get(`${intlPrefix}.view.title.statementCreate`).d('对账单创建')
            : intl.get(`${intlPrefix}.view.title.statementMaintain`).d('对账单维护')
        }
        backPath="/zcom/mo-statement-maintain/list"
      >
        <Button
          color="primary"
          onClick={() => handleSave(setSaveLoading, 'saveVerificationOrder')}
          loading={saveLoading}
          disabled={!canEdit}
        >
          保存
        </Button>
        <Button
          color="primary"
          onClick={() => handleSave(setPoLoading, 'saveCreatePo')}
          loading={poLoading}
          disabled={!canEdit}
        >
          保存并创建PO
        </Button>
        {type !== 'create' && (
          <Button
            color="primary"
            onClick={() => handleSave(setSubmitLoading, 'submitVerificationOrder')}
            loading={submitLoading}
            disabled={verificationOrderStatus !== 'CREATED'}
          >
            提交
          </Button>
        )}
        {canEdit && (
          <Upload {...uploadHeadProps}>
            <Button>{headFile ? '修改附件' : '上传附件'}</Button>
          </Upload>
        )}
        {headFile && (
          <Button
            onClick={() => downloadLineFile(headFile)}
            style={{ marginRight: '10px', marginTop: '3px' }}
          >
            查看附件
          </Button>
        )}
        {headFile && canEdit && (
          <Button style={{ marginLeft: '10px', marginTop: '3px' }} onClick={deleteHeadFile}>
            删除附件
          </Button>
        )}
      </Header>
      <Content className={styles['zcom-mo-statement-maintain']}>
        <div className={styles['zcom-statement-headInfo']}>
          <span>对账单表头</span>
          <span className={styles['headInfo-toggle']} onClick={handleToggle}>
            {headShow ? '收起' : '展开'}
          </span>
        </div>
        {headShow ? (
          <Form dataSet={HeadDS} columns={3}>
            <TextField name="verificationOrderNum" key="verificationOrderNum" disabled />
            <Select name="verificationOrderType" key="verificationOrderType" disabled={!canEdit} />
            <TextField name="supplierDescription" key="supplierDescription" disabled />
            <TextField name="customerDescription" key="customerDescription" disabled />
            <TextField name="amount" key="amount" disabled />
            <TextField name="excludingTaxAmount" key="excludingTaxAmount" disabled />
            <TextField name="creationDate" key="creationDate" disabled />
            <TextField name="createdByName" key="createdByName" disabled />
            <DatePicker name="postingDate" key="postingDate" />
            <TextArea newLine name="remark" key="remark" colSpan={2} disabled={!canEdit} />
            {['CONFIRMED', 'REFUSED'].includes(verificationOrderStatus) ? (
              <TextArea newLine name="approvalOpinion" key="approvalOpinion" colSpan={2} disabled />
            ) : null}
          </Form>
        ) : null}
        <Tabs defaultActiveKey="detail">
          <TabPane tab="对账明细" key="detail">
            <Table dataSet={LineDS} columns={lineColumns} columnResizable="true" />
          </TabPane>
        </Tabs>
      </Content>
    </Fragment>
  );
}

export default connect(({ moStatementMaintain: { ids } }) => ({ ids }))(
  formatterCollections({
    code: [`${intlPrefix}`],
  })(ZcomStatementDetail)
);
