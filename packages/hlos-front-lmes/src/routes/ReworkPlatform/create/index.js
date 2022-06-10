/*
 * @Description: 返修任务平台-创建返修
 * @Author: yu.na@hand-china.com
 * @Date: 2021-01-11 14:50:51
 * @LastEditors: yu.na
 */

import React, { Fragment, useMemo, useEffect, useState } from 'react';
import { Button, Table, DataSet, NumberField, Icon, Spin } from 'choerodon-ui/pro';
import { Upload, Tag, Popconfirm } from 'choerodon-ui';
import { getFileName } from 'hlos-front/lib/utils/utils';
import { deleteFile } from 'hlos-front/lib/services/api';
import { BUCKET_NAME_MDS } from 'hlos-front/lib/utils/config';
import { Header, Content } from 'components/Page';
import { HZERO_FILE } from 'utils/config';
import { getCurrentOrganizationId, getAccessToken, getResponse } from 'utils/utils';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { OperationDS } from '@/stores/reworkPlatformDS';
import { getReworkProcessedQty, getMoOperation, createReworkTask } from '@/services/taskService';

import styles from './index.less';

const preCode = 'lmes.reworkPlatform';
const teantId = getCurrentOrganizationId();
const directory = 'rework-task';

const ReworkPlatform = ({ location, history }) => {
  const listDS = useMemo(() => new DataSet(OperationDS()), []);
  const [preReworkQty, setReworkQty] = useState(0);
  const [processedQty, setProcessedQty] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function init() {
      const { state } = location;
      const { reworkQty, sourceTaskId, sourceItemId, moNum, organizationId } = state;
      if (sourceItemId) {
        listDS.current.set('sourceItemId', sourceItemId);
      }
      if (sourceTaskId) {
        listDS.current.set('sourceTaskId', sourceTaskId);
      }
      if (reworkQty) {
        setReworkQty(reworkQty);
      }
      const res = await getReworkProcessedQty({
        sourceTaskId,
        sourceItemId,
      });
      if (res && res.reworkProcessedQty) {
        setProcessedQty(res.reworkProcessedQty);
      }
      if (moNum && organizationId) {
        setLoading(true);
        const moRes = await getMoOperation({
          organizationId,
          moNum,
          page: -1,
        });
        if (moRes && moRes.content && moRes.content.length) {
          moRes.content.forEach((i) => {
            listDS.children.createReworkTaskLineDTOList.create({
              ...i,
              operationObj: {
                operationId: i.operationId,
                operationCode: i.operationCode,
                operationName: i.operationName,
              },
              executeRuleObj: {
                executeRuleId: i.executeRuleId,
                executeRule: i.executeRule,
              },
              inspectionRuleObj: {
                inspectionRuleId: i.inspectionRuleId,
                inspectionRule: i.inspectionRule,
              },
              collectorObj: {
                collectorId: i.collectorId,
                collector: i.collector,
              },
              dispatchRuleObj: {
                dispatchRuleId: i.dispatchRuleId,
                dispatchRule: i.dispatchRule,
              },
              packingRuleObj: {
                packingRuleId: i.packingRuleId,
                packingRule: i.packingRule,
              },
              reworkRuleObj: {
                reworkRuleId: i.reworkRuleId,
                reworkRule: i.reworkRule,
              },
            });
          });
        }
        setLoading(false);
      }
    }
    init();
  }, []);

  const uploadProps = {
    headers: {
      Authorization: `bearer ${getAccessToken()}`,
    },
    accept: '*',
    action: `${HZERO_FILE}/v1/${teantId}/files/multipart`,
    data: uploadData,
    showUploadList: false,
  };

  const columns = useMemo(() => {
    return [
      { name: 'sequenceNum', width: 70, lock: true, editor: true },
      { name: 'operationObj', width: 150, lock: true, editor: true },
      { name: 'operation', width: 150, lock: true, editor: true },
      { name: 'operationAlias', width: 150, editor: true },
      { name: 'description', width: 150, editor: true },
      { name: 'operationType', width: 150, editor: true },
      {
        name: 'keyOperationFlag',
        width: 100,
        editor: true,
      },
      {
        name: 'firstOperationFlag',
        width: 100,
        editor: true,
      },
      {
        name: 'lastOperationFlag',
        width: 100,
        editor: true,
      },
      { name: 'executeRuleObj', width: 150, editor: true },
      { name: 'inspectionRuleObj', width: 150, editor: true },
      { name: 'preSequenceNum', width: 150, editor: true },
      { name: 'downstreamOperation', width: 150, editor: true },
      { name: 'operationGroup', width: 100, editor: true },
      { name: 'reworkOperation', width: 100, editor: true },
      { name: 'processTime', width: 100, editor: true },
      { name: 'standardWorkTime', width: 150, editor: true },
      {
        name: 'referenceDocument',
        renderer: (record) => {
          const file = record.value;
          return fileRender(file, 'referenceDocument');
        },
      },
      {
        name: 'processProgram',
        renderer: (record) => {
          const file = record.value;
          return fileRender(file, 'processProgram');
        },
      },
      { name: 'collectorObj', width: 100, editor: true },
      { name: 'instruction', width: 150, editor: true },
      { name: 'dispatchRuleObj', width: 150, editor: true },
      { name: 'packingRuleObj', width: 150, editor: true },
      { name: 'reworkRuleObj', width: 150, editor: true },
      { name: 'externalId', width: 150, editor: true },
      { name: 'externalNum', width: 150, editor: true },
    ];
  }, []);

  /**
   * 下载
   * @param {object} file - 文件
   */
  function downloadFile(file) {
    const api = `${HZERO_FILE}/v1/${teantId}/files/download`;
    downloadFile({
      requestUrl: api,
      queryParams: [
        { name: 'bucketName', value: BUCKET_NAME_MDS },
        { name: 'directory', value: directory },
        { name: 'url', value: file },
      ],
    });
  }

  /**
   * 删除该文件
   * @param {*} file 待删除文件
   */
  function handleDeleteFile(file, type) {
    deleteFile({ file, directory });
    listDS.children.createReworkTaskLineDTOList.current.set(`${type}`, '');
  }

  function uploadData(file) {
    return {
      fileName: file.name,
      bucketName: BUCKET_NAME_MDS,
      directory,
    };
  }

  /**
   * 文件上传回调
   * @param res
   * @returns {Promise<void>}
   */
  async function handleSuccess(res, type) {
    if (res && !res.failed) {
      const { current } = listDS.children.createReworkTaskLineDTOList;
      current.set(`${type}`, res);
      // 对处于编辑状态的单据(包含新建)自动提交
      if (!current.editing) {
        notification.success({
          message: '上传成功',
        });
      }
    } else {
      notification.error({
        message: '上传失败',
      });
    }
  }

  function fileRender(file, type) {
    return (
      <div>
        {file ? (
          <span
            className="action-link"
            style={{
              display: 'block',
              width: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            <Popconfirm
              okText={intl.get('hzero.common.button.sure').d('确定')}
              cancelText={intl.get('hzero.common.button.cancel').d('取消')}
              title={intl.get('lmds.common.view.message.confirm.remove').d('是否删除此条记录？')}
              onConfirm={() => handleDeleteFile(file, type)}
            >
              <a>
                <Icon type="delete" />
              </a>
            </Popconfirm>
            <a
              style={{ marginLeft: '5px' }}
              title={intl.get('hzero.common.button.download').d('下载')}
              onClick={() => downloadFile(file)}
            >
              {getFileName(file)}
            </a>
          </span>
        ) : (
          <Tag title="选择本地图片上传">
            <Upload {...uploadProps} onSuccess={(res) => handleSuccess(res, type)}>
              <a>{intl.get('hzero.common.button.upload').d('上传')}</a>
            </Upload>
          </Tag>
        )}
      </div>
    );
  }

  async function handleGenerate() {
    const validateValue = await listDS.validate(false, false);
    if (!validateValue) return;
    const submitLine = listDS.children.createReworkTaskLineDTOList.selected.map((i) =>
      i.toJSONData()
    );
    const res = await createReworkTask([
      {
        ...listDS.current.toJSONData(),
        createReworkTaskLineDTOList: submitLine,
      },
    ]);
    if (getResponse(res)) {
      notification.success();
      history.push({
        pathname: '/lmes/rework-platform/list',
      });
    }
  }

  return (
    <Fragment>
      <Header
        title={intl.get(`${preCode}.view.title.operation`).d('返修工序')}
        backPath="/lmes/rework-platform/list"
      >
        <Button onClick={handleGenerate}>{intl.get(`${preCode}.button.generate`).d('生成')}</Button>
      </Header>
      <Content>
        <div className={styles['rework-operation-top']}>
          <div>
            本次返修：
            <NumberField dataSet={listDS} name="reworkQty" min={0} required />
          </div>
          <div>返修数量：{preReworkQty}</div>
          <div>处理数量：{processedQty}</div>
        </div>
        <Spin spinning={loading}>
          <Table
            dataSet={listDS.children.createReworkTaskLineDTOList}
            columns={columns}
            buttons={['add']}
            columnResizable="true"
            queryFieldsLimit={4}
          />
        </Spin>
      </Content>
    </Fragment>
  );
};

export default ReworkPlatform;
