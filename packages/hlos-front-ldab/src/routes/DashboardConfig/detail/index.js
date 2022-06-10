/*
 * @Description: 看板创建 & 更新--detail
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2020-05-25 14:49:24
 * @LastEditors: 赵敏捷
 */

import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { Card, Upload } from 'choerodon-ui';
import {
  Button,
  DataSet,
  Form,
  Icon,
  Lov,
  Modal,
  Select,
  Switch,
  Table,
  TextField,
  Tooltip,
  TextArea,
} from 'choerodon-ui/pro';
import uuidv4 from 'uuid/v4';

import { getAccessToken, getCurrentOrganizationId } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { Content, Header } from 'components/Page';
import { BUCKET_NAME_DAB } from 'hlos-front/lib/utils/config';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import { DETAIL_CARD_CLASSNAME } from 'utils/constants';
import { downloadFile } from 'services/api';
import { HZERO_FILE } from 'utils/config';
import { getFileName } from 'hlos-front/lib/utils/utils';
import { deleteFile } from 'hlos-front/lib/services/api';

import { createAndEditDashboardConfig } from '@/stores/dashboardConfigDS';

const intlPrefix = 'ldab.dashboardConfig';
const commonPrefix = 'ldab.common';
const commonButtonPrefix = 'hzero.common.button';
const directory = 'dashboard-config';
const organizationId = getCurrentOrganizationId();
const fileServerUrl = `${HZERO_FILE}/v1/${organizationId}/files/multipart`;

function getLineColumns() {
  return [
    {
      name: 'cardNum',
      width: 150,
      editor: false,
    },
    {
      name: 'cardCode',
      width: 150,
      editor: (record) => (record.status === 'add' ? <TextField /> : null),
    },
    {
      name: 'cardTitle',
      width: 150,
      editor: true,
    },
    {
      name: 'cardType',
      width: 150,
      editor: true,
    },
    {
      name: 'displayCardTitle',
      width: 150,
      editor: true,
      renderer: yesOrNoRender,
    },
    {
      name: 'cardTemplate',
      width: 150,
      editor: true,
    },
    {
      name: 'cardDataType',
      width: 150,
      editor: true,
    },
    {
      name: 'cardLength',
      width: 150,
      editor: true,
    },
    {
      name: 'cardWidth',
      width: 150,
      editor: true,
    },
    {
      name: 'cardLocationX',
      width: 150,
      editor: true,
    },
    {
      name: 'cardLocationY',
      width: 150,
      editor: true,
    },
    {
      name: 'refreshType',
      width: 150,
      editor: true,
    },
    {
      name: 'refreshInterval',
      width: 150,
      editor: true,
    },
    {
      name: 'loopDisplay',
      width: 150,
      editor: true,
    },
    {
      name: 'loopDisplayInterval',
      width: 150,
      editor: true,
    },
    {
      name: 'initialValue',
      width: 150,
      editor: true,
    },
    {
      name: 'onlyInitialFlag',
      width: 150,
      editor: true,
    },
    {
      name: 'referenceValue',
      width: 150,
      editor: true,
    },
    {
      name: 'sourceReport',
      width: 150,
      editor: true,
    },
    {
      name: 'cardControl',
      width: 150,
      editor: true,
    },
    {
      name: 'enabledFlag',
      width: 100,
      editor: true,
      align: 'center',
      renderer: yesOrNoRender,
    },
    {
      header: intl.get('hzero.common.button.action').d('操作'),
      width: 120,
      command: ({ dataSet, record }) => {
        return [
          <Tooltip
            key="delete"
            placement="bottom"
            title={intl.get('hzero.common.button.delete').d('删除')}
          >
            <Button
              icon="delete"
              color="primary"
              funcType="flat"
              disabled={record.status !== 'add'}
              onClick={() => dataSet.delete(record)}
            />
          </Tooltip>,
        ];
      },
      lock: 'right',
    },
  ];
}

function DashboardConfig({ history, location }) {
  const headDS = useMemo(() => new DataSet(createAndEditDashboardConfig()), []);
  const lineDS = headDS.children.cardLineList;
  const [lineNum, setLineNum] = useState(1);
  const [isDSDirty, setDSDirty] = useState(false);
  const [isHeadValid, setHeadValid] = useState(false);
  const [mode, setMode] = useState(null);
  const [fileChange, setFileChange] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [deleteFileUrl, setDeleteFileUrl] = useState('');
  const uploadProps = {
    accept: 'image/*',
    multiple: false,
    fileList,
    // 关闭自动上传所有提交操作先走保存图片逻辑
    beforeUpload: () => false,
    onChange: handleUploadFileChange,
    onRemove: handleRemove,
    onPreview: _downloadFile,
  };

  useEffect(() => {
    const { mode: _mode = 'create' } = location?.state || {};
    setMode(_mode);
    headDS.addEventListener('update', async ({ name }) => {
      if (['dashboardCode', 'dashboardName', 'dashboardClass', 'dashboardType'].includes(name)) {
        const _isHeadValid = await headDS.validate(false, false);
        setHeadValid(!!_isHeadValid);
      }
      setDSDirty(true);
    });
    headDS.addEventListener('load', ({ dataSet }) => {
      const logoUrl = dataSet?.current?.get('logoUrl');
      if (logoUrl) {
        setFileList([
          {
            uid: uuidv4(),
            name: getFileName(logoUrl),
            url: logoUrl,
          },
        ]);
      }
      const _isHeadValid = headDS.validate(false, false);
      setHeadValid(!!_isHeadValid);
    });
    lineDS.addEventListener('load', ({ dataSet }) => {
      const { totalCount } = dataSet;
      setLineNum(totalCount + 1 || 1);
    });
    lineDS.addEventListener('create', () => setDSDirty(true));
    lineDS.addEventListener('remove', () => setDSDirty(true));
    lineDS.addEventListener('update', () => setDSDirty(true));
    return () => {
      headDS.removeEventListener('update');
      headDS.removeEventListener('load');
      lineDS.removeEventListener('load');
      lineDS.removeEventListener('create');
      lineDS.removeEventListener('remove');
      lineDS.removeEventListener('update');
    };
  }, [headDS, lineDS, location]);

  useEffect(() => {
    if (mode === 'edit') {
      handleQuery();
    }
  }, [headDS, lineDS, mode, handleQuery]);

  const handleQuery = useCallback(async () => {
    const { pathname } = location;
    const { dashboardId = pathname.substring(pathname.lastIndexOf('/') + 1) } =
      location?.state || {};
    if (dashboardId) {
      headDS.setQueryParameter('dashboardId', dashboardId);
      lineDS.setQueryParameter('dashboardId', dashboardId);
      headDS.query();
      await headDS.ready();
      lineDS.query();
    }
  }, [headDS, lineDS, location]);

  // 上传文件变更
  function handleUploadFileChange({ fileList: _list }) {
    setFileChange(true);
    // 文件变更说明需要删除已有文件
    handleRemove();
    setFileList(_list.slice(0, 1));
  }

  // 文件上传
  async function handleUpload() {
    // 判断是否需要先删除旧文件
    handleDeleteFile();
    if (fileChange && fileList.length) {
      setFileChange(false);
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const formData = new FormData();
        formData.append('bucketName', BUCKET_NAME_DAB);
        formData.append('directory', directory);
        formData.append('file', fileList[0]);
        xhr.onload = async () => {
          const isSuccessful = xhr.status.toString().startsWith('2');
          if (isSuccessful) {
            resolve(xhr.responseText);
          } else {
            reject();
          }
        };
        xhr.open('post', fileServerUrl);
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.setRequestHeader('Authorization', `bearer ${getAccessToken()}`);
        xhr.send(formData);
      });
    } else {
      setFileChange(false);
      return Promise.resolve(true);
    }
  }

  // 从文件列表中移除文件
  function handleRemove() {
    if (mode === 'edit') {
      const { current } = headDS;
      const url = current?.get('logoUrl');
      setDeleteFileUrl(url);
    } else {
      setFileList([]);
    }
  }

  // 删除文件
  function handleDeleteFile() {
    if (mode === 'edit' && deleteFileUrl) {
      const { current } = headDS;
      const url = current?.get('logoUrl');
      if (url) {
        deleteFile({ file: url, directory });
      }
      setDeleteFileUrl('');
    }
  }

  // 下载
  function _downloadFile(file) {
    if (file.url) {
      const api = `${HZERO_FILE}/v1/${organizationId}/files/download`;
      downloadFile({
        requestUrl: api,
        queryParams: [
          { name: 'bucketName', value: BUCKET_NAME_DAB },
          { name: 'directory', value: directory },
          { name: 'url', value: file.url },
        ],
      });
    } else {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(file);
      link.download = file.name;
      link.click();
    }
  }

  // 新增行
  function handleAddLine() {
    if (isHeadValid && lineDS) {
      lineDS.create(
        {
          cardNum: lineNum,
        },
        0
      );
      setLineNum((n) => n + 1);
    }
  }

  // 保存 / 更新行
  async function handleSave() {
    const dsValid = await Promise.all([
      headDS.validate(false, false),
      lineDS.validate(false, false),
    ]);
    if (dsValid.every((valid) => valid === true)) {
      try {
        const uploadFileRes = await handleUpload();
        if (uploadFileRes) {
          if (typeof uploadFileRes === 'string') {
            headDS.current.set('logoUrl', uploadFileRes);
          } else {
            headDS.current.set('logoUrl', '');
          }
        }
      } catch {
        notification.error({
          message: intl.get(`${intlPrefix}.view.message.uploadFileError`).d('文件上传失败'),
        });
        return Promise.resolve(false);
      }
      try {
        const headRes = await headDS.submit();
        if (mode === 'create') {
          const { dashboardId } = headRes?.content[0] || {};
          history.push({
            pathname: `/ldab/dashboard-config/detail/${dashboardId}`,
            state: { mode: 'edit', dashboardId },
          });
        } else {
          handleQuery();
        }
        setDSDirty(false);
        return Promise.resolve(true);
      } catch {
        return Promise.resolve(false);
      }
    } else {
      notification.error({
        message: intl.get('hzero.common.view.message.valid.error').d('数据校验失败'),
      });
      return Promise.resolve(false);
    }
  }

  // 新建
  async function handleCreate() {
    if (headDS.dirty || lineDS.dirty) {
      const warningMessage = intl
        .get(`${intlPrefix}.view.warning.saveOrNot`)
        .d('是否保存当前数据？');
      const action = await Modal.confirm({
        title: intl.get(`${intlPrefix}.view.warning.warning`).d('警告'),
        children: <p>{warningMessage}</p>,
      });
      if (action === 'ok') {
        const saveSuccess = await handleSave();
        if (saveSuccess && mode !== 'create') {
          history.push('/ldab/dashboard-config/create');
        }
      } else if (mode === 'create') {
        headDS.reset();
        lineDS.clear();
        const logoUrl = headDS.current.get('logoUrl');
        setFileList(logoUrl ? [logoUrl] : []);
        setFileChange(false);
      } else {
        history.push('/ldab/dashboard-config/create');
      }
    } else if (mode !== 'create') {
      history.push('/ldab/dashboard-config/create');
    }
  }

  return (
    <Fragment>
      <Header
        title={intl.get(`${intlPrefix}.view.title.dashboardConfig`).d('看板配置')}
        backPath="/ldab/dashboard-config/list"
        isChange={isDSDirty}
      >
        <Button icon="add" color="primary" onClick={handleCreate}>
          {intl.get(`${commonButtonPrefix}.create`).d('新建')}
        </Button>
        <Button onClick={handleSave}>{intl.get(`${commonButtonPrefix}.save`).d('保存')}</Button>
      </Header>
      <Content>
        <Card
          key="party-detail-header"
          bordered={false}
          className={DETAIL_CARD_CLASSNAME}
          title={<h3>{intl.get(`${intlPrefix}.view.title.dashboardConfig`).d('看板配置')}</h3>}
        >
          <Form dataSet={headDS} columns={4}>
            <TextField name="dashboardCode" disabled={mode === 'edit'} required />
            <TextField name="dashboardName" required />
            <TextField name="dashboardAlias" />
            <TextField name="description" />
            <Select name="dashboardClass" required />
            <Select name="dashboardType" required />
            <Select name="displayTerminalType" />
            <TextField name="displayTerminal" />
            <TextField name="fixedResolution" />
            <Lov name="organizationObj" />
            <TextField name="dashboardControl" />
            <Switch name="enabledFlag" />
            <TextArea name="noticeMsg" colSpan={2} />
          </Form>
          <Upload {...uploadProps}>
            <Button>
              <Icon type="file_upload" />
              {intl.get(`${intlPrefix}.button.uploadLogo`).d('上传LOGO')}
            </Button>
          </Upload>
        </Card>
        <Card
          key="party-detail-body"
          bordered={false}
          className={DETAIL_CARD_CLASSNAME}
          title={<h3>{intl.get(`${intlPrefix}.view.title.cardConfig`).d('卡片配置')}</h3>}
        >
          <Button
            key="add"
            icon="playlist_add"
            funcType="flat"
            color="primary"
            onClick={handleAddLine}
            disabled={!isHeadValid}
          >
            {intl.get(`${commonButtonPrefix}.create`).d('新增')}
          </Button>
          <Table
            dataSet={lineDS}
            columns={getLineColumns()}
            columnResizable="true"
            border={false}
          />
        </Card>
      </Content>
    </Fragment>
  );
}

export default formatterCollections({
  code: [`${intlPrefix}`, `${commonPrefix}`],
})(DashboardConfig);
