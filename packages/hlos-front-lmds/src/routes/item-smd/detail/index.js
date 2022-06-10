/**
 * @Description: SMD清单--Detail
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-12-08 10:13:29
 * @LastEditors: yu.na
 */

import React, { Fragment, useState, useEffect, useMemo } from 'react';
import {
  Button,
  Form,
  Lov,
  TextField,
  Switch,
  Select,
  NumberField,
  DataSet,
  DatePicker,
  Modal,
} from 'choerodon-ui/pro';
import { Divider, Icon, Upload } from 'choerodon-ui';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { getCurrentOrganizationId, getAccessToken, getResponse } from 'utils/utils';
import { downloadFile } from 'services/api';
import uuidv4 from 'uuid/v4';
import { HZERO_FILE } from 'utils/config';
import { useDataSetEvent } from 'hzero-front/lib/utils/hooks';
import { getFileName } from 'hlos-front/lib/utils/utils';
import { BUCKET_NAME_MDS } from 'hlos-front/lib/utils/config';
import { deleteFile, queryDefaultMeOu } from 'hlos-front/lib/services/api';

import { DetailDS } from '../stores/ListDS';
import LineList from './LineList';
import styles from './index.less';

const preCode = 'lmds.itemSmd';
const organizationId = getCurrentOrganizationId();
const directory = 'item-smd';
// const listFactory = () => new DataSet(DetailDS());

const SmdDetail = ({ match, history }) => {
  const detailDS = useMemo(() => new DataSet(DetailDS()), []);
  const [hidden, changeHide] = useState(true);
  const [fileList, setFileList] = useState([]);
  const [createFlag, setCreateFlag] = useState(true);
  const [defaultOrg, setDefaultOrg] = useState({});
  const [dsDirty, setDSDirty] = useState(false);

  const uploadProps = {
    headers: {
      Authorization: `bearer ${getAccessToken()}`,
    },
    action: `${HZERO_FILE}/v1/${organizationId}/files/multipart`,
    accept: '*',
    onSuccess: handleUploadSuccess,
    onRemove: handleRemove,
    onPreview: downFile,
    data: uploadData,
    fileList,
  };

  useEffect(() => {
    const { params } = match;
    async function queryDefaultSetting() {
      const res = await queryDefaultMeOu({ defaultFlag: 'Y' });
      if (res && res.content && res.content[0]) {
        detailDS.current.set('organizationObj', res.content[0]);
        setDefaultOrg(res.content[0]);
      }
    }
    if (params.smdHeaderId) {
      setCreateFlag(false);
      refreshPage(params.smdHeaderId);
    } else {
      setCreateFlag(true);
      queryDefaultSetting();
    }
  }, []);

  useDataSetEvent(detailDS, 'update', ({ dataSet }) => {
    setDSDirty(dataSet.dirty);
  });

  useDataSetEvent(detailDS.children.lineList, 'update', ({ dataSet }) => {
    setDSDirty(dataSet.dirty);
  });

  async function refreshPage(smdHeaderId) {
    detailDS.queryParameter = {
      smdHeaderId,
    };
    const res = await detailDS.query();
    if (res && res.content && res.content[0] && res.content[0].referenceDocument) {
      const arr = res.content[0].referenceDocument.split(',');
      const _fileList = [];
      arr.forEach((i) => {
        _fileList.push({
          uid: uuidv4(),
          name: getFileName(i),
          url: i,
        });
      });
      setFileList(_fileList);
    }
  }

  /**
   * 图片上传成功
   * @param res 返回response
   * @param file 上传文件信息
   */
  async function handleUploadSuccess(res, file) {
    const { current } = detailDS;
    const currentFile = file;
    if (res && !res.failed) {
      if (current.get('referenceDocument')) {
        current.set('referenceDocument', `${current.get('referenceDocument')},${res}`);
      } else {
        current.set('referenceDocument', res);
      }
      if (current.toData() && current.toData().smdHeaderId) {
        await detailDS.submit();
        notification.success({
          message: '上传成功',
        });
      }
      currentFile.url = res;
      setFileList(fileList.concat(currentFile));
    } else {
      notification.error({
        message: '上传失败',
      });
    }
  }

  /**
   * 移除文件
   */
  function handleRemove(file) {
    const { uid } = file;
    const idx = fileList.findIndex((i) => i.uid === uid);
    if (idx !== -1) {
      deleteFile({ file: fileList[idx].url, directory });
    }
    const _fileList = fileList.slice();
    _fileList.splice(idx, 1);
    detailDS.current.set('referenceDocument', _fileList.join(','));
    setFileList(_fileList);
  }

  /**
   * 下载
   * @param {object} record - 参考文档
   */
  function downFile(file) {
    const api = `${HZERO_FILE}/v1/${organizationId}/files/download`;
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

  function handleCreate() {
    if (dsDirty) {
      Modal.confirm({
        children: <p>{intl.get(`${preCode}.view.message.saveData`).d('是否保存当前数据？')}</p>,
        okText: '是',
        cancelText: '否',
        onOk: handleSave,
        onCancel: () => handleReset(),
      });
    } else {
      handleReset();
    }
  }

  function handleReset() {
    detailDS.current.reset();
    detailDS.current.set('organizationObj', defaultOrg);
  }

  async function handleSave() {
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
    if (getResponse(res)) {
      if (createFlag) {
        history.push(`/lmds/item-smd/detail/${res.content[0].smdHeaderId}`);
      } else {
        refreshPage(res.content[0].smdHeaderId);
      }
    }
  }

  function handleToggle() {
    changeHide(!hidden);
  }

  function handleItemChange(rec) {
    const { organizationObj } = detailDS.current.data;
    detailDS.current.reset();
    detailDS.current.set('organizationObj', organizationObj);
    detailDS.current.set('itemObj', rec);
  }

  function handleOrgChange(rec) {
    detailDS.current.reset();
    detailDS.current.set('organizationObj', rec);
  }

  return (
    <Fragment key="smd-detail">
      <Header
        title={intl.get(`${preCode}.view.title.detail`).d('SMD清单维护')}
        backPath="/lmds/item-smd/list"
      >
        <Button color="primary" onClick={handleCreate}>
          {intl.get('hzero.common.button.create').d('新建')}
        </Button>
        <Button onClick={handleSave}>{intl.get('hzero.common.button.save').d('保存')}</Button>
      </Header>
      <Content>
        <div className={styles['lmds-item-smd-header']}>
          <Form dataSet={detailDS} columns={4}>
            <Lov name="organizationObj" disabled={!createFlag} onChange={handleOrgChange} />
            <Lov name="itemObj" disabled={!createFlag} onChange={handleItemChange} />
            <TextField name="itemDescription" disabled colSpan={2} />
            <Lov name="categoryObj" />
            <Select name="pcbMountSide" />
            <NumberField name="pcbProductQty" />
            <Select name="mountMethod" />
            <Select name="mounterPosition" />
            <NumberField name="deviceSumQty" />
            <Lov name="prodLineObj" />
            <Lov name="productObj" />
            <Lov name="partyObj" />
            <Select name="prepareMethod" />
            <Lov name="ruleObj" />
            <TextField name="smdVersion" />
            <TextField name="smtProgram" />
          </Form>
          <Divider>
            <div>
              <span onClick={handleToggle} style={{ cursor: 'pointer' }}>
                {hidden
                  ? `${intl.get('hzero.common.button.expand').d('展开')}`
                  : `${intl.get(`hzero.common.button.hidden`).d('隐藏')}`}
              </span>
              <Icon type={hidden ? 'expand_more' : 'expand_less'} />
            </div>
          </Divider>
          <div style={hidden ? { display: 'none' } : { display: 'block' }}>
            <Form dataSet={detailDS} columns={4}>
              <TextField name="designer" />
              <DatePicker name="designedDate" />
              <TextField name="reviser" />
              <DatePicker name="revisedDate" />
              <TextField name="auditor" />
              <DatePicker name="auditedDate" />
              <TextField name="externalId" />
              <TextField name="externalNum" />
              <TextField name="remark" colSpan={2} />
              <DatePicker name="startDate" />
              <DatePicker name="endDate" />
            </Form>
            <div className={styles.reference}>
              <div className={styles['upload-btn']}>
                <span className={styles.text}>参考文件：</span>
                <Upload colSpan={2} {...uploadProps}>
                  <Button>
                    <Icon type="file_upload" />{' '}
                    {intl.get(`${preCode}.button.fileUpload`).d('上传参考文件')}
                  </Button>
                </Upload>
              </div>
              <Form dataSet={detailDS} columns={2}>
                <Switch name="primaryFlag" />
                <Switch name="enabledFlag" />
              </Form>
            </div>
          </div>
        </div>
        <div className={styles['lmds-item-smd-line']}>
          <LineList ds={detailDS} />
        </div>
      </Content>
    </Fragment>
  );
};

export default SmdDetail;
