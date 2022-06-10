/**
 * @Description: 非生产任务--新增/明细页面
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-12-22 15:28:08
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
  DataSet,
  Modal,
} from 'choerodon-ui/pro';
import { Icon, Upload, Tooltip } from 'choerodon-ui';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { getCurrentOrganizationId, getAccessToken, getResponse } from 'utils/utils';
import { downloadFile } from 'services/api';
import uuidv4 from 'uuid/v4';
import { HZERO_FILE } from 'utils/config';
import { getFileName } from 'hlos-front/lib/utils/utils';
import { BUCKET_NAME_MDS } from 'hlos-front/lib/utils/config';
import { deleteFile, queryLovData, userSetting } from 'hlos-front/lib/services/api';
import { DetailDS } from '@/stores/nonProductionTaskDS';
import { cancelTask, closeTask, releaseTask } from '@/services/taskService';

import styles from './index.less';

const preCode = 'lmes.nonProductionTask';
const tpmCode = 'lmes.tpmTask';
const tenantId = getCurrentOrganizationId();
const directory = 'lmes-non-production-task';

const NonProductionTaskDetail = ({ match, history }) => {
  const detailDS = useMemo(() => new DataSet(DetailDS()), []);

  const [createFlag, setCreateFlag] = useState(true);
  const [pictureList, setPictureList] = useState([]);
  const [refenceDocumentList, setRefenceDocumentList] = useState([]);
  const [docProcessRule, setDocProcessRule] = useState(null);
  const [disabledFlag, setDisabledFlag] = useState(false);

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
    const { params } = match;
    if (params.taskId) {
      setCreateFlag(false);
      refreshPage(params.taskId);
    } else {
      queryUserSetting();
    }
  }, []);

  async function handleSave() {
    if (detailDS.current.status !== 'add') {
      notification.warning({
        message: '更新接口未开发',
      });
      return;
    }
    const validateValue = await detailDS.validate(false, false);
    if (!validateValue) {
      notification.error({
        message: intl.get('hzero.common.view.message.valid.error').d('数据校验失败'),
      });
      return;
    }
    const res = await detailDS.submit(false, false);
    if (res === undefined) {
      notification.info({
        message: intl.get('hzero.common.view.message.title.noChange').d('未修改数据'),
      });
      return;
    }
    sessionStorage.setItem('nonProductionTaskQuery', true);
    if (getResponse(res)) {
      if (createFlag) {
        history.push(`/lmes/non-production-task/detail/${res.content[0].taskId}`);
      } else {
        refreshPage(res.content[0].taskId);
      }
    }
  }

  /**
   * 下达
   */
  function handleRelease() {
    if (detailDS.current.data.taskStatus !== 'NEW') {
      notification.error({
        message: intl
          .get(`${tpmCode}.view.message.submitLimit`)
          .d('只有新增状态的任务才允许下达！'),
      });
      return;
    }
    releaseTask([detailDS.current.data.taskId]).then(async (res) => {
      if (res && res.failed && res.message) {
        notification.error({
          message: res.message,
        });
      } else {
        notification.success({
          message: '下达成功',
        });
        await detailDS.query();
      }
    });
  }

  /**
   * 取消
   */
  function handleCancel() {
    if (
      detailDS.current.data.taskStatus !== 'CANCELLED' &&
      detailDS.current.data.taskStatus !== 'CLOSED' &&
      detailDS.current.data.taskStatus !== 'COMPLETED'
    ) {
      Modal.confirm({
        children: <p>{intl.get(`${tpmCode}.view.message.cancelTask`).d('是否取消任务？')}</p>,
        onOk: () =>
          cancelTask([detailDS.current.data.taskId]).then(async (res) => {
            if (res && res.failed && res.message) {
              notification.error({
                message: res.message,
              });
            } else {
              notification.success({
                message: '取消成功',
              });
              await detailDS.query();
            }
          }),
      });
    } else {
      notification.error({
        message: intl
          .get(`${tpmCode}.view.message.cancelLimit`)
          .d('已完成、已关闭、已取消状态的任务不允许取消！'),
      });
    }
  }

  /**
   * 关闭
   */
  function handleClose() {
    if (
      (detailDS.current.data.taskStatus !== 'CANCELLED' &&
        detailDS.current.data.taskStatus !== 'CLOSED') ||
      detailDS.current.data.taskStatus !== 'NEW'
    ) {
      Modal.confirm({
        children: <p>{intl.get(`${tpmCode}.view.message.closeTask`).d('是否关闭任务？')}</p>,
        onOk: () =>
          closeTask([detailDS.current.data.taskId]).then(async (res) => {
            if (res && res.failed && res.message) {
              notification.error({
                message: res.message,
              });
            } else {
              notification.success({
                message: '关闭成功',
              });
              await detailDS.query();
            }
          }),
      });
    } else {
      notification.error({
        message: intl
          .get(`${tpmCode}.view.message.closeLimit`)
          .d('新增、已取消、已关闭状态的任务不允许关闭！'),
      });
    }
  }

  async function refreshPage(taskId) {
    detailDS.queryParameter = {
      taskId,
    };
    const res = await detailDS.query();
    if (res && res.content && res.content[0]) {
      if (res.content[0].taskStatus !== 'NEW') {
        setDisabledFlag(true);
      }
      if (res.content[0].referenceDocument) {
        setRefenceDocumentList([
          {
            uid: uuidv4(),
            name: getFileName(res.content[0].referenceDocument),
            url: res.content[0].referenceDocument,
          },
        ]);
      }
      if (res.content[0].pictureIds) {
        setPictureList([
          {
            uid: uuidv4(),
            name: getFileName(res.content[0].pictureIds),
            url: res.content[0].pictureIds,
          },
        ]);
      }
      if (res.content[0].docProcessRule) {
        setDocProcessRule(res.content[0].docProcessRule);
      }
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
      deleteFile({ file: refenceDocumentList[0].url, directory });
      setRefenceDocumentList([]);
    } else {
      deleteFile({ file: pictureList[0].url, directory });
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

  const uploadProps = {
    headers: {
      Authorization: `bearer ${getAccessToken()}`,
    },
    action: `${HZERO_FILE}/v1/${tenantId}/files/multipart`,
    accept: '*',
    onPreview: downFile,
    data: uploadData,
  };

  return (
    <Fragment key="lmes-non-production-task-detail">
      <Header
        title={intl.get(`${preCode}.view.title.detail`).d('非生产任务明细')}
        backPath="/lmes/non-production-task/list"
      >
        <Button onClick={handleSave}>{intl.get('hzero.common.button.save').d('保存')}</Button>
        <Button onClick={handleRelease} disabled={createFlag}>
          {intl.get('lmes.common.button.release').d('下达')}
        </Button>
        <Button onClick={handleCancel} disabled={createFlag}>
          {intl.get('hzero.common.button.cancel').d('取消')}
        </Button>
        <Button onClick={handleClose} disabled={createFlag}>
          {intl.get('hzero.common.button.close').d('关闭')}
        </Button>
      </Header>
      <Content>
        <Form dataSet={detailDS} columns={4}>
          <Lov name="organizationObj" key="organizationObj" disabled={!createFlag} />
          <Lov
            name="taskTypeObj"
            key="taskTypeObj"
            onChange={handleTypeChange}
            disabled={!createFlag}
          />
          <TextField name="taskNum" key="taskNum" />
          <Select name="taskStatus" key="taskStatus" />
          <Lov name="workerGroupObj" key="workerGroupObj" disabled={!createFlag} />
          <Lov name="workerObj" key="workerObj" disabled={!createFlag} />
          <TextField name="description" colSpan={2} key="description" disabled={disabledFlag} />
          <Lov name="prodLineObj" key="prodLineObj" disabled={disabledFlag} />
          <Lov name="workcellObj" key="workcellObj" disabled={disabledFlag} />
          <Lov name="equipmentObj" key="equipmentObj" disabled={disabledFlag} />
          <Lov name="locationObj" key="locationObj" disabled={disabledFlag} />
          <DatePicker name="calendarDay" key="calendarDay" disabled={disabledFlag} />
          <Select name="calendarShiftCode" key="calendarShiftCode" disabled={disabledFlag} />
          <Lov name="supervisorObj" key="supervisorObj" disabled={disabledFlag} />
          <TextField name="outsideLocation" key="outsideLocation" disabled={disabledFlag} />
          <NumberField name="standardWorkTime" key="standardWorkTime" disabled={disabledFlag} />
          <DateTimePicker name="planStartTime" key="planStartTime" disabled={disabledFlag} />
          <DateTimePicker name="planEndTime" key="planEndTime" disabled={disabledFlag} />
          <Lov name="executeRuleObj" key="executeRuleObj" disabled={disabledFlag} />
          <NumberField name="processedTime" key="processedTime" disabled={disabledFlag} />
          <DateTimePicker name="actualStartTime" key="actualStartTime" disabled={disabledFlag} />
          <DateTimePicker name="actualEndTime" key="actualEndTime" disabled={disabledFlag} />
          <Lov name="dispatchRuleObj" key="dispatchRuleObj" disabled={disabledFlag} />
          <TextField colSpan={2} name="instruction" key="instruction" disabled={disabledFlag} />
          <TextField colSpan={2} name="remark" key="remark" disabled={disabledFlag} />
        </Form>
        <div className={styles['upload-btn']}>
          <Upload
            {...uploadProps}
            onSuccess={(res, file) => handleUploadSuccess(res, file, 'pictureIds')}
            onRemove={() => handleRemove('pictureIds')}
            fileList={pictureList}
            disabled={disabledFlag}
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
            disabled={disabledFlag}
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
      </Content>
    </Fragment>
  );
};

export default NonProductionTaskDetail;
