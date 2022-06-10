/*
 * @Descripttion: 生产程序管理编辑页面
 * @version: 1.0.0
 * @Author: mingbo.zhang@hand-china.com
 * @Date: 2021-03-11 17:00:56
 * @LastEditors: mingbo.zhang@hand-china.com
 * @LastEditTime: 2021-03-15 17:45:03
 */
import React, { Fragment, useEffect, useState } from 'react';
import { Header, Content } from 'components/Page';
import {
  Button,
  Table,
  DataSet,
  Form,
  TextField,
  Lov,
  Select,
  Switch,
  DatePicker,
  CheckBox,
  Tooltip,
  Modal,
} from 'choerodon-ui/pro';
import { Divider, Icon } from 'choerodon-ui';
import uuid from 'uuid/v4';
import intl from 'utils/intl';
import { HZERO_HFLE, HZERO_FILE } from 'utils/config';
import notification from 'utils/notification';
import { getCurrentOrganizationId } from 'utils/utils';
import { BUCKET_NAME_MDS } from 'hlos-front/lib/utils/config';
import { downloadFile } from 'services/api';
import ChunkUploader from 'hlos-front/lib/components/ChunkUploader';
import { ProgressFileDS } from '../store/ProgressManageDS.js';
import { ProgressEditDS } from '../store/ProgressEditDS.js';

import style from '../index.less';

const organizationId = getCurrentOrganizationId();
const editPageDS = new DataSet(ProgressEditDS());
const queryDrawingFileDS = new DataSet(ProgressFileDS());

const directory = 'drawing';

function DrawingEdit(props) {
  const [showFlag, setShowFlag] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const refreshPage = async (programId) => {
    editPageDS.setQueryParameter('programId', programId);
    await editPageDS.query().then((res) => {
      if (res && res.content && res.content.length) {
        editPageDS.current.set(
          'itemObj',
          `${res.content[0].itemCode || ''} ${res.content[0].itemDescription || ''}`
        );
        editPageDS.current.set(
          'productObj',
          `${res.content[0].productCode || ''} ${res.content[0].productDescription || ''}`
        );
      }
    });
  };

  useEffect(() => {
    const data = props.location.state || {};
    if (data.programId) {
      setIsEdit(true);
      refreshPage(data.programId);
    } else {
      editPageDS.create({});
    }
    return () => {
      if (editPageDS.current) {
        editPageDS.remove(editPageDS.current);
      }
    };
  }, []);

  const renderForm = () => {
    return (
      <Form dataSet={editPageDS} columns={4}>
        <Select name="programType" required disabled={isEdit} />,
        <TextField name="programCode" required disabled={isEdit} />
        <TextField name="programName" required />
        <TextField name="programAlias" />
        <TextField name="description" colSpan={2} />
        <Lov name="programCategoryObj" />
        <TextField name="programGroup" />
        <Lov name="itemObj" />
        <Lov name="itemCategoryObj" />
        <Lov name="operationObj" />
        <Lov name="productObj" />
        <TextField name="projectNum" />
        <TextField name="wbsNum" />
        <Lov name="partyObj" />
        <TextField name="programLevel" />
      </Form>
    );
  };

  const renderMoreForm = () => {
    return (
      <Form dataSet={editPageDS} columns={4}>
        {/* <TextField name="programGroup" /> */}
        <Lov name="relatedProgramObj" />
        <Lov name="organizationObj" />
        <Lov name="prodLineObj" />
        <Lov name="equipmentObj" />
        <Lov name="auditWorkflowObj" />
        <TextField name="externalId" />
        <TextField name="externalNum" />
        <TextField name="assignRule" />
        <Switch name="enabledFlag" />
      </Form>
    );
  };

  const handleOpenFileModal = (fileUrl) => {
    queryDrawingFileDS.queryParameter = { directory: fileUrl };
    queryDrawingFileDS.query();
    Modal.open({
      key: 'technology-drawing-management-modal',
      title: '文件列表',
      footer: null,
      closable: true,
      style: {
        width: '700px',
      },
      children: (
        <div>
          <Table dataSet={queryDrawingFileDS} columns={getColumnsFile()} />
        </div>
      ),
    });
  };

  const getColumnsFile = () => {
    return [
      {
        name: 'fileName',
        width: 120,
      },
      {
        name: 'realName',
        width: 120,
      },
      {
        name: 'creationDate',
        width: 120,
      },
      {
        header: '操作',
        width: 150,
        lock: 'right',
        command: ({ record }) => {
          return [
            <Button
              display={record.data.fileType === 'image/jpeg'}
              onClick={() => handleFileView(record.get('fileUrl'))}
            >
              预览
            </Button>,
            <Button onClick={() => handleFileDownLoad(record.get('fileUrl'))}>下载</Button>,
          ];
        },
      },
    ];
  };

  // 下载文件
  const handleFileDownLoad = (fileUrl) => {
    if (fileUrl) {
      const api = `${HZERO_FILE}/v1/${organizationId}/files/download`;
      downloadFile({
        requestUrl: api,
        queryParams: [
          { name: 'bucketName', value: BUCKET_NAME_MDS },
          { name: 'directory', value: directory },
          { name: 'url', value: fileUrl },
        ],
      });
    }
  };

  // 预览文件
  const handleFileView = (fileUrl) => {
    if (fileUrl) {
      window.open(fileUrl);
    }
    // window.open(`${HZERO_FILE}/v1/${organizationId}/file-preview/by-url?url=${encodeURIComponent(fileUrl)}&bucketName=${BUCKET_NAME_MDS}&storageCode=""&access_token=${getAccessToken()}`);
  };

  const getColumns = () => {
    const params = {
      tenantId: organizationId,
      bucketName: BUCKET_NAME_MDS,
    };
    return [
      {
        header: '行号',
        width: 70,
        tooltip: 'overflow',
        lock: 'left',
        renderer: ({ record }) => getSerialNum(record),
      },
      {
        name: 'programVersion',
        width: 128,
        tooltip: 'overflow',
        lock: 'left',
        // editor: () => (isEdit ? null : <TextField />),
        editor: <TextField />,
      },
      {
        name: 'description',
        width: 336,
        tooltip: 'overflow',
        editor: <TextField />,
      },
      {
        name: 'versionStatus',
        width: 128,
        tooltip: 'overflow',
        editor: <Select />,
      },
      {
        name: 'fileUrl',
        width: 200,
        align: 'center',
        renderer: ({ record }) => {
          let { fileUrl } = record.data;
          if (fileUrl === undefined) {
            fileUrl = `${directory}/${uuid()}/`;
            record.set('fileUrl', fileUrl);
          }
          return (
            <div className={style['file-td']}>
              <ChunkUploader
                paramsData={{ directory: fileUrl, ...params }}
                showUploadList
                prefixPatch={HZERO_HFLE}
              />
              <span
                style={{
                  color: '#29BECE',
                  cursor: 'pointer',
                }}
                onClick={() => handleOpenFileModal(fileUrl)}
              >
                {intl.get('hzero.common.button.view').d('查看')}
              </span>
            </div>
          );
        },
      },
      {
        name: 'designer',
        width: 128,
        tooltip: 'overflow',
        editor: <TextField />,
      },
      {
        name: 'auditWorkerFlowObj',
        width: 200,
        tooltip: 'overflow',
        editor: <Lov />,
      },
      {
        name: 'auditor',
        width: 128,
        tooltip: 'overflow',
        editor: <TextField />,
      },
      {
        name: 'issuedDate',
        width: 150,
        tooltip: 'overflow',
        editor: <DatePicker />,
      },
      {
        name: 'startDate',
        width: 150,
        tooltip: 'overflow',
        editor: <DatePicker />,
      },
      {
        name: 'endDate',
        width: 150,
        tooltip: 'overflow',
        editor: <DatePicker />,
      },
      {
        name: 'currentVersionFlag',
        width: 82,
        tooltip: 'overflow',
        editor: <CheckBox />,
      },
      {
        header: '操作',
        width: 150,
        lock: 'right',
        command: ({ record }) => {
          return [
            <Tooltip placement="bottom" title="取消">
              <Button
                icon="cancle_a"
                color="primary"
                funcType="flat"
                onClick={() => removeData(record)}
              />
            </Tooltip>,
          ];
        },
      },
    ];
  };

  const removeData = (record) => {
    const { programVersionList } = editPageDS.children;
    if (record.toData().programVersionId) {
      programVersionList.current.reset();
    } else {
      programVersionList.remove(record);
      if (programVersionList.length) {
        const _line = programVersionList.data[programVersionList.length - 1];
        _line.set('currentVersionFlag', true);
      }
    }
  };

  /**
   * 获取行序号
   * @param {*} record 当前行记录
   */
  const getSerialNum = (record) => {
    const { index } = record;
    return index + 1;
  };

  const handleCreateNewVersion = () => {
    const data = props.location.state || {};
    const _data = editPageDS.children.programVersionList;
    _data.forEach((ele) => {
      ele.set('currentVersionFlag', false);
    });
    editPageDS.children.programVersionList.create({
      programId: data && data.programId,
      fileUrl: `${directory}/${uuid()}/`,
    });
  };

  const handleSave = async () => {
    const isValid = await editPageDS.validate(false, false);
    if (isValid) {
      const res = await editPageDS.submit(false, false);
      if (res && res.failed) {
        notification.error({
          message: res.message,
        });
      } else if (res && res.content && res.content.length) {
        await refreshPage(res.content[0].programId);
      } else {
        notification.warning({
          message: '未修改数据',
        });
      }
    }
  };

  return (
    <Fragment>
      <Header title="生产程序编辑" backPath="/lmds/production-program/list">
        <Button color="primary" onClick={handleSave}>
          {intl.get('hzero.common.button.save').d('保存')}
        </Button>
      </Header>
      <Content>
        {renderForm()}
        <Divider>
          <div onClick={() => setShowFlag(!showFlag)}>
            <span>{showFlag ? '隐藏' : '展开'}</span>
            <Icon type={!showFlag ? 'expand_more' : 'expand_less'} />
          </div>
        </Divider>
        {showFlag ? renderMoreForm() : null}
        <div className={style['drawing-management']}>
          <Button style={{ marginBottom: '15px' }} onClick={handleCreateNewVersion}>
            新建版本
          </Button>
          <Table
            dataSet={editPageDS.children.programVersionList}
            columns={getColumns()}
            columnResizable="true"
          />
        </div>
      </Content>
    </Fragment>
  );
}

export default DrawingEdit;
