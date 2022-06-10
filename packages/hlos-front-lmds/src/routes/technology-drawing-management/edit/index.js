/*
 * @Description: 图纸编辑
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-07-30 17:36:06
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
  Spin,
} from 'choerodon-ui/pro';
import { Button as ButtonPermission } from 'components/Permission';
import { Divider, Icon } from 'choerodon-ui';
import uuid from 'uuid/v4';
import intl from 'utils/intl';
import { HZERO_HFLE, HZERO_FILE } from 'utils/config';
import notification from 'utils/notification';
import { getCurrentOrganizationId } from 'utils/utils';
import { BUCKET_NAME_MDS } from 'hlos-front/lib/utils/config';
import { downloadFile } from 'services/api';
import { DrawingEditDS, DrawingFileDS } from '../store/DrawingEditDS.js';

import ChunkUploader from '@/components/ChunkUploader';
import style from '../index.less';
import { submitApproval } from '@/services/technologyDrawingManagement';

const organizationId = getCurrentOrganizationId();
const editPageDS = new DataSet(DrawingEditDS());
const queryDrawingFileDS = new DataSet(DrawingFileDS());

const directory = 'drawing';

function DrawingEdit(props) {
  const [showFlag, setShowFlag] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [approvalLoading, setApprovalLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);

  const refreshPage = async (drawingId) => {
    editPageDS.setQueryParameter('drawingId', drawingId);
    await editPageDS.query().then((res) => {
      if (res && res.content && res.content.length) {
        let drawingCodeArr;
        if (res.content[0].relatedDrawing) {
          drawingCodeArr = res.content[0].relatedDrawing.split(';');
        }
        const drawingResult =
          drawingCodeArr &&
          drawingCodeArr.length &&
          drawingCodeArr.map((v) => ({ drawingCode: v }));

        editPageDS.current.set('drawingObj', drawingResult);
        editPageDS.current.set('productObj', {
          itemId: res.content[0].productId,
          itemCode: res.content[0].productCode,
          itemName: res.content[0].productName,
          description: res.content[0].productDescription,
          item: `${res.content[0].productCode || ''}_${res.content[0].productDescription || ''}`,
        });
        // editPageDS.current.set(
        //   'productObj',
        //   `${res.content[0].productCode || ''}_${res.content[0].productName || ''}`
        // );
        editPageDS.current.set(
          'supplierObj',
          `${res.content[0].partyCode || ''}_${res.content[0].partyName || ''}`
        );
      }
    });
  };

  useEffect(() => {
    const data = props.location.state || {};
    if (data.drawingId) {
      setIsEdit(true);
      refreshPage(data.drawingId);
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
        <Select name="drawingType" disabled={isEdit} />,
        <TextField name="drawingCode" disabled={isEdit} />
        <TextField name="drawingName" />
        <TextField name="drawingAlias" />
        <TextField name="description" colSpan={2} />
        <Lov name="drawingCategoryObj" />
        <TextField name="drawingGroup" />
        <Lov name="itemObj" colSpan={2} />
        <Lov name="operationObj" />
        <Lov name="itemCategoryObj" />
        <Lov name="productObj" colSpan={2} />
        <TextField name="projectNum" />
        <TextField name="wbsNum" />
      </Form>
    );
  };

  const renderMoreForm = () => {
    return (
      <Form dataSet={editPageDS} columns={4}>
        <Lov name="supplierObj" colSpan={2} />
        <Lov name="organizationObj" />
        <TextField name="drawingLevel" />
        <Lov name="drawingObj" />
        <TextField name="externalId" />
        <TextField name="externalNum" />
        <Switch name="auditWorkflowFlag" />
        <Lov name="examineObj" />
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
            // <Button onClick={() => handleFileDownLoad(record.get('fileUrl'))}>下载</Button>,
            <ButtonPermission
              onClick={() => handleFileDownLoad(record.get('fileUrl'))}
              permissionList={[
                {
                  code: 'hlos.lmds.technology.drawing.management.ps.button.download',
                  type: 'button',
                  meaning: '下载',
                },
              ]}
            >
              下载
            </ButtonPermission>,
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
        name: 'drawingVersion',
        width: 128,
        tooltip: 'overflow',
        lock: 'left',
        editor: (record) => (record.status === 'add' ? <TextField /> : null),
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
                callback={(val) => {
                  setUploadLoading(!val);
                }}
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
    const { lineList } = editPageDS.children;
    if (record.toData().drawingVersionId) {
      lineList.current.reset();
    } else {
      lineList.remove(record);
      if (lineList.length) {
        const _line = lineList.data[lineList.length - 1];
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
    const _data = editPageDS.children.lineList;
    _data.forEach((ele) => {
      ele.set('currentVersionFlag', false);
    });
    editPageDS.children.lineList.create({ fileUrl: `${directory}/${uuid()}/` });
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
        await refreshPage(res.content[0].drawingId);
      } else {
        notification.warning({
          message: '未修改数据',
        });
      }
    }
  };

  /**
   * @description: 提交审批
   * @param {*}
   * @return {*}
   */
  function handleApproval() {
    const { selected } = editPageDS.children.lineList;
    if (selected.length > 0) {
      setApprovalLoading(true);
      const params = selected.map((item) => item.toJSONData());
      submitApproval(params)
        .then((res) => {
          if (res && res.failed) {
            setApprovalLoading(false);
            notification.error({ message: `${res.message}` });
          } else {
            notification.success({ message: '提交审批成功' });
            editPageDS.query();
            setApprovalLoading(false);
          }
        })
        .catch(() => {
          setApprovalLoading(false);
        });
    } else {
      notification.warning({ message: '请至少选择一行数据' });
    }
  }

  return (
    <Fragment>
      <Header title="图纸编辑" backPath="/lmds/technology-drawing-management/list">
        <Button color="primary" onClick={handleSave}>
          {intl.get('hzero.common.button.save').d('保存')}
        </Button>
        <Button onClick={handleApproval} disabled={!isEdit} loading={approvalLoading}>
          提交审批
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
          <Spin spinning={uploadLoading}>
            <Table
              dataSet={editPageDS.children.lineList}
              columns={getColumns()}
              columnResizable="true"
            />
          </Spin>
        </div>
      </Content>
    </Fragment>
  );
}

export default DrawingEdit;
