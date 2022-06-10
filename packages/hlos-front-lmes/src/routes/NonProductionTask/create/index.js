/**
 * @Description: 非生产任务--批量新建
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-12-22 10:05:08
 * @LastEditors: yu.na
 */

import React, { Fragment, useMemo, useState, useEffect } from 'react';
import {
  Button,
  Form,
  TextField,
  DatePicker,
  DateTimePicker,
  Lov,
  Select,
  NumberField,
  Table,
  DataSet,
} from 'choerodon-ui/pro';
import { Icon, Upload, Tooltip } from 'choerodon-ui';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { getCurrentOrganizationId, getAccessToken, getResponse } from 'utils/utils';
import { downloadFile } from 'services/api';
import { HZERO_FILE } from 'utils/config';
import { BUCKET_NAME_MDS } from 'hlos-front/lib/utils/config';
import { deleteFile, userSetting, queryLovData } from 'hlos-front/lib/services/api';
import { DetailDS, BatchCreateDS } from '@/stores/nonProductionTaskDS';
import { npTaskSubmit } from '@/services/taskService';
import styles from './index.less';

const preCode = 'lmes.nonProductionTask';
const tenantId = getCurrentOrganizationId();
const directory = 'lmes-non-production-task';

const NonProductionTaskCreate = ({ history }) => {
  const detailDS = useMemo(() => new DataSet(DetailDS()), []);
  const batchCreateDS = useMemo(() => new DataSet(BatchCreateDS()), []);

  const [pictureList, setPictureList] = useState([]);
  const [refenceDocumentList, setRefenceDocumentList] = useState([]);
  const [docProcessRule, setDocProcessRule] = useState(null);

  useEffect(() => {
    async function queryUserSetting() {
      const res = await userSetting({ defaultFlag: 'Y' });
      if (res && res.content && res.content[0]) {
        const { organizationId, organizationCode, organizationName } = res.content[0];
        detailDS.current.set('organizationObj', {
          organizationId,
          organizationCode,
          organizationName,
        });
        batchCreateDS.queryDataSet.current.set('organizationId', organizationId);
      }
      const typeRes = await queryLovData({
        lovCode: 'LMDS.DOCUMENT_TYPE',
        documentTypeCode: 'TRAINING_TASK',
        documentClass: 'NP_TASK',
      });
      if(typeRes && typeRes.content && typeRes.content[0]) {
        detailDS.current.set('taskTypeObj', typeRes.content[0]);
      }
    }
    queryUserSetting();
  }, []);

  const columns = useMemo(() => {
    return [
      {
        name: 'workerObj',
        key: 'workerObj',
        width: 100,
        editor: (record) => record.status === 'add',
        lock: true,
      },
      { name: 'workerName', key: 'workerName', width: 100, lock: true },
      {
        name: 'workerGroupName',
        key: 'workerGroupName',
        width: 150,
      },
      { name: 'phoneNumber', key: 'phoneNumber', width: 150 },
    ];
  }, []);

  async function handleSave() {
    const validateValue = await detailDS.validate(false, false);
    const createValidateValue = await batchCreateDS.validate(false, false);
    if (!validateValue || !createValidateValue) return;
    const list = [];
    if (!batchCreateDS.selected.length) {
      notification.warning({
        message: '请选中操作工',
      });
      return;
    }
    batchCreateDS.selected.forEach((i) => {
      const { workerId, workerCode, workerGroupId, workerGroupCode } = i.toJSONData();
      list.push({
        ...detailDS.current.toJSONData(),
        workerId,
        worker: workerCode,
        workerGroupId,
        workerGroup: workerGroupCode,
      });
    });
    const res = await npTaskSubmit(list);
    if (getResponse(res)) {
      notification.success();
      sessionStorage.setItem('nonProductionTaskQuery', true);
      history.push({
        pathname: '/lmes/non-production-task/list',
      });
    }
  }

  function handleTypeChange(rec) {
    if (rec && rec.documentTypeCode.indexOf('RECORD') === -1) {
      setDocProcessRule(rec.docProcessRule);
      detailDS.fields.get('processedTime').set('disabled', true);
      detailDS.fields.get('actualStartTime').set('disabled', true);
      detailDS.fields.get('actualEndTime').set('disabled', true);
      detailDS.fields.get('processedTime').set('required', false);
      detailDS.fields.get('actualStartTime').set('required', false);
      detailDS.fields.get('actualEndTime').set('required', false);
      detailDS.current.set('processedTime', null);
      detailDS.current.set('actualStartTime', null);
      detailDS.current.set('actualEndTime', null);
    } else {
      detailDS.fields.get('processedTime').set('disabled', false);
      detailDS.fields.get('actualStartTime').set('disabled', false);
      detailDS.fields.get('actualEndTime').set('disabled', false);
      detailDS.fields.get('processedTime').set('required', true);
      detailDS.fields.get('actualStartTime').set('required', true);
      detailDS.fields.get('actualEndTime').set('required', true);
    }
  }

  /**
   * 图片上传成功
   * @param res 返回response
   * @param file 上传文件信息
   */
  async function handleUploadSuccess(res, file, type) {
    if (res && !res.failed) {
      const { current } = detailDS;
      const currentFile = file;
      current.set(`${type}`, res);
      if (current.toData() && current.toData().taskId) {
        await detailDS.submit();
        notification.success({
          message: '上传成功',
        });
      }
      currentFile.url = res;
      if (type === 'referenceDocument') {
        setRefenceDocumentList([currentFile]);
      } else {
        setPictureList([currentFile]);
      }
    } else {
      notification.error({
        message: '上传失败',
      });
    }
  }

  /**
   * 移除文件
   */
  function handleRemove(type) {
    detailDS.current.set(`${type}`, '');
    if (type === 'referenceDocument') {
      deleteFile({ file: refenceDocumentList.url, directory });
      setRefenceDocumentList([]);
    } else {
      deleteFile({ file: pictureList.url, directory });
      setPictureList([]);
    }
  }

  /**
   * 下载
   * @param {object} record - 参考文档
   */
  function downFile(file) {
    const api = `${HZERO_FILE}/v1/${tenantId}/files/download`;
    downloadFile({
      requestUrl: api,
      queryParams: [
        { name: 'bucketName', value: BUCKET_NAME_MDS },
        { name: 'directory', value: directory },
        { name: 'url', value: file.url },
      ],
    });
  }

  function uploadData(file) {
    return {
      fileName: file.name,
      bucketName: BUCKET_NAME_MDS,
      directory,
    };
  }

  function handleOrgChange(rec) {
    if (rec) {
      batchCreateDS.queryDataSet.current.set('organizationId', rec.organizationId);
    } else {
      batchCreateDS.queryDataSet.current.set('organizationId', null);
    }
  }

  async function handleWorkerGroupChange() {
    await batchCreateDS.query();
    batchCreateDS.forEach(i => {
      batchCreateDS.select(i);
    });
  }

  const uploadProps = {
    headers: {
      Authorization: `bearer ${getAccessToken()}`,
    },
    action: `${HZERO_FILE}/v1/${tenantId}/files/multipart`,
    accept: '*',
    onPreview: downFile,
    data: uploadData,
  };

  function handleAddLine() {
    batchCreateDS.create(
      {
        organizationId: batchCreateDS.queryDataSet.current.get('organizationId'),
        workerGroupId: batchCreateDS.queryDataSet.current.get('workerGroupId'),
      },
      0
    );
  }

  return (
    <Fragment>
      <Header
        title={intl.get(`${preCode}.view.title.bacthCreate`).d('非生产任务批量新建')}
        backPath="/lmes/non-production-task/list"
      >
        <Button onClick={handleSave}>{intl.get('hzero.common.button.save').d('保存')}</Button>
      </Header>
      <Content className={styles['lmes-non-production-task']}>
        <div>
          <Lov
            dataSet={batchCreateDS.queryDataSet}
            name="workerGroupObj"
            onChange={handleWorkerGroupChange}
          />
          <Table
            dataSet={batchCreateDS}
            columns={columns}
            columnResizable="true"
            queryFieldsLimit={2}
            buttons={[['add', { onClick: handleAddLine }]]}
            queryBar="none"
          />
        </div>
        <div>
          <Form dataSet={detailDS} columns={2}>
            <Lov name="organizationObj" key="organizationObj" onChange={handleOrgChange} />
            <Lov name="taskTypeObj" key="taskTypeObj" onChange={handleTypeChange} />
            <TextField name="description" colSpan={2} key="description" />
            <Lov name="prodLineObj" key="prodLineObj" />
            <Lov name="equipmentObj" key="equipmentObj" />
            <Lov name="workcellObj" key="workcellObj" />
            <Lov name="locationObj" key="locationObj" />
            <Lov name="supervisorObj" key="supervisorObj" />
            <TextField name="outsideLocation" key="outsideLocation" />
            <DatePicker name="calendarDay" key="calendarDay" />
            <Select name="calendarShiftCode" key="calendarShiftCode" />
            <NumberField name="standardWorkTime" key="standardWorkTime" />
            <NumberField name="processedTime" key="processedTime" />
            <DateTimePicker name="planStartTime" key="planStartTime" />
            <DateTimePicker name="planEndTime" key="planEndTime" />
            <DateTimePicker name="actualStartTime" key="actualStartTime" />
            <DateTimePicker name="actualEndTime" key="actualEndTime" />
            <Lov name="executeRuleObj" key="executeRuleObj" />
            <Lov name="dispatchRuleObj" key="dispatchRuleObj" />
            <TextField colSpan={2} name="instruction" key="instruction" />
            <TextField colSpan={2} name="remark" key="remark" />
          </Form>
          <div className={styles['upload-btn']}>
            <Upload
              {...uploadProps}
              onSuccess={(res, file) => handleUploadSuccess(res, file, 'pictureIds')}
              onRemove={() => handleRemove('pictureIds')}
              fileList={pictureList}
            >
              <Button>
                <Icon type="file_upload" /> {intl.get(`${preCode}.button.fileUpload`).d('上传图片')}
              </Button>
            </Upload>
            <Upload
              {...uploadProps}
              onSuccess={(res, file) => handleUploadSuccess(res, file, 'referenceDocument')}
              onRemove={() => handleRemove('referenceDocument')}
              fileList={refenceDocumentList}
            >
              <Button>
                <Icon type="file_upload" />{' '}
                {intl.get(`${preCode}.button.fileUpload`).d('参考文件上传')}
              </Button>
            </Upload>
            <span>
              <Tooltip placement="top" title={docProcessRule}>
                <a>{intl.get(`${preCode}.model.docProcessRule`).d('单据处理规则')}</a>
              </Tooltip>
            </span>
          </div>
        </div>
      </Content>
    </Fragment>
  );
};

export default NonProductionTaskCreate;
