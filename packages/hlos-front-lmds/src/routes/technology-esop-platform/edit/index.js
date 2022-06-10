/*
 * @Description: 图纸编辑
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-07-30 11:34:14
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
import { Button as ButtonPermission } from 'components/Permission';
import { Divider, Icon } from 'choerodon-ui';
import notification from 'utils/notification';
import { getCurrentOrganizationId } from 'utils/utils';
import uuid from 'uuid/v4';
import intl from 'utils/intl';
import { downloadFile } from 'services/api';
import { HZERO_HFLE, HZERO_FILE } from 'utils/config';
import ChunkUploader from 'hlos-front/lib/components/ChunkUploader';
import { BUCKET_NAME_MDS } from 'hlos-front/lib/utils/config';

import style from '../index.less';
import { EsopEditDS, EsopFileDS } from '../store/EsopEditDS.js';
import { submitApproval } from '@/services/technologyEsopPlatform';

const organizationId = getCurrentOrganizationId();
const editPageDS = new DataSet(EsopEditDS());
const queryEsopFileDS = new DataSet(EsopFileDS());

const directory = 'esop';
const processType = 'process';

function DrawingEdit(props) {
  const [showFlag, setShowFlag] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [pageType, setPageType] = useState('');
  const [approvalLoading, setApprovalLoading] = useState(false);

  const refreshPage = async (esopId) => {
    editPageDS.setQueryParameter('esopId', esopId);
    await editPageDS.query().then((res) => {
      if (res && res.content && res.content.length) {
        let drawingCodeArr;
        let esopCodeArr;
        if (res.content[0].relatedDrawing) {
          drawingCodeArr = res.content[0].relatedDrawing.split(';');
        }
        if (res.content[0].relatedEsop) {
          esopCodeArr = res.content[0].relatedEsop.split(';');
        }
        const drawingResult =
          drawingCodeArr &&
          drawingCodeArr.length &&
          drawingCodeArr.map((v) => ({ drawingCode: v }));
        const esopResult =
          esopCodeArr && esopCodeArr.length && esopCodeArr.map((v) => ({ esopCode: v }));

        editPageDS.current.set('drawingObj', drawingResult || {});
        editPageDS.current.set('esopObj', esopResult || {});
        editPageDS.current.set('esopCategoryObj', {
          categoryId: res.content[0].esopCategoryId || null,
          categoryCode: res.content[0].esopCategoryCode || null,
          categoryName: res.content[0].esopCategoryName || null,
        });
        if (res.content[0].itemCode && res.content[0].itemDescription) {
          editPageDS.current.set(
            'itemObj',
            `${res.content[0].itemCode}_${res.content[0].itemDescription}`
          );
        }
        if (res.content[0].productCode && res.content[0].productDescription) {
          editPageDS.current.set(
            'productObj',
            `${res.content[0].productCode}_${res.content[0].productDescription}`
          );
        }
        if (res.content[0].partyNumber && res.content[0].partyName) {
          editPageDS.current.set(
            'supplierObj',
            `${res.content[0].partyNumber}_${res.content[0].partyName}`
          );
        }
      }
    });
  };

  useEffect(() => {
    const str = props.location.pathname;
    const lastIndex = str.lastIndexOf('/');
    const esopId = str.slice(lastIndex + 1);
    const typeIndex = str.lastIndexOf('/', lastIndex - 1);
    const type = str.slice(typeIndex + 1, lastIndex);
    setPageType(type);

    const data = props.location.state || {};

    if (data.esopId || esopId) {
      setIsEdit(true);
      refreshPage(data.esopId || esopId);
    } else {
      editPageDS.create({});
    }
    return () => {
      if (editPageDS.current) {
        editPageDS.records.clear();
      }
    };
  }, []);

  const renderForm = () => {
    return (
      <Form dataSet={editPageDS} columns={4}>
        <Select name="esopType" disabled={pageType === processType || isEdit} />,
        <TextField name="esopCode" disabled={pageType === processType || isEdit} />
        <TextField name="esopName" disabled={pageType === processType} />
        <TextField name="esopAlias" disabled={pageType === processType} />
        <TextField name="description" colSpan={2} disabled={pageType === processType} />
        <Lov name="esopCategoryObj" disabled={pageType === processType} />
        <TextField name="esopGroup" disabled={pageType === processType} />
        <Lov name="itemObj" colSpan={2} disabled={pageType === processType} />
        <Lov name="operationObj" disabled={pageType === processType} />
        <Lov name="itemCategoryObj" disabled={pageType === processType} />
        <Lov name="productObj" colSpan={2} disabled={pageType === processType} />
        <TextField name="projectNum" disabled={pageType === processType} />
        <TextField name="wbsNum" disabled={pageType === processType} />
      </Form>
    );
  };

  const renderMoreForm = () => {
    return (
      <Form dataSet={editPageDS} columns={4}>
        <Lov name="supplierObj" colSpan={2} disabled={pageType === processType} />
        <Lov name="organizationObj" disabled={pageType === processType} />
        <TextField name="esopLevel" disabled={pageType === processType} />
        <Lov name="esopObj" disabled={pageType === processType} />
        <Lov name="drawingObj" disabled={pageType === processType} />
        <TextField name="externalId" disabled={pageType === processType} />
        <TextField name="externalNum" disabled={pageType === processType} />
        <Switch name="auditWorkflowFlag" disabled={pageType === processType} />
        <Lov name="examineObj" disabled={pageType === processType} />
        <Switch name="enabledFlag" disabled={pageType === processType} />
      </Form>
    );
  };

  const handleOpenFileModal = (fileUrl) => {
    queryEsopFileDS.queryParameter = { directory: fileUrl };
    queryEsopFileDS.query();
    Modal.open({
      key: 'technology-esop-platform-modal',
      title: '文件列表',
      footer: null,
      closable: true,
      width: 900,
      children: (
        <div>
          <Table dataSet={queryEsopFileDS} columns={getColumnsFile()} />
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
                  code: 'hlos.lmds.technology.esop.platform.ps.button.download',
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
        renderer: ({ record }) => getSerialNum(record),
      },
      {
        name: 'esopVersion',
        width: 128,
        tooltip: 'overflow',
        editor: ({ status }) => (status === 'add' ? <TextField /> : null),
      },
      {
        name: 'description',
        width: 336,
        tooltip: 'overflow',
        editor: (record) => {
          if (record.get('versionStatus') !== 'NEW' && record.get('auditWorkerFlowObj')) {
            return false;
          } else {
            return <TextField />;
          }
        },
      },
      {
        name: 'versionStatus',
        width: 128,
        tooltip: 'overflow',
        editor: (record) => {
          if (record.status === 'add') {
            if (editPageDS.get('auditWorkflowId') && editPageDS.get('auditWorkflowFlag')) {
              return false;
            } else {
              return <Select />;
            }
          } else if (record.status !== 'add') {
            if (record.get('versionStatus') !== 'NEW' && record.get('auditWorkerFlowObj')) {
              return false;
            } else {
              return <Select />;
            }
          }
        },
      },
      {
        name: 'fileUrl',
        width: 300,
        align: 'center',
        renderer: ({ record }) => {
          let { fileUrl } = record.data;
          if (fileUrl === undefined) {
            fileUrl = `${directory}/${uuid()}/`;
            record.set('fileUrl', fileUrl);
          }
          if (record.get('versionStatus') !== 'NEW' && record.get('auditWorkerFlowObj')) {
            return (
              <span
                style={{
                  color: '#29BECE',
                  cursor: 'pointer',
                }}
                onClick={() => handleOpenFileModal(fileUrl)}
              >
                {intl.get('hzero.common.button.view').d('查看')}
              </span>
            );
          } else {
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
          }
        },
      },
      {
        name: 'designer',
        width: 128,
        tooltip: 'overflow',
        editor: (record) => {
          if (record.get('versionStatus') !== 'NEW' && record.get('auditWorkerFlowObj')) {
            return false;
          } else {
            return <TextField />;
          }
        },
      },
      {
        name: 'auditWorkerFlowObj',
        width: 200,
        tooltip: 'overflow',
      },
      {
        name: 'approver',
        width: 128,
        tooltip: 'overflow',
        editor: (record) => {
          if (record.status === 'add') {
            if (editPageDS.get('auditWorkflowId') && editPageDS.get('auditWorkflowFlag')) {
              return false;
            } else {
              return <TextField />;
            }
          } else if (record.status !== 'add') {
            if (record.get('versionStatus') !== 'NEW' && record.get('auditWorkerFlowObj')) {
              return false;
            } else {
              return <TextField />;
            }
          }
        },
      },
      {
        name: 'issuedDate',
        width: 100,
        tooltip: 'overflow',
        editor: (record) => {
          if (record.status === 'add') {
            if (editPageDS.get('auditWorkflowId') && editPageDS.get('auditWorkflowFlag')) {
              return false;
            } else {
              return <DatePicker />;
            }
          } else if (record.status !== 'add') {
            if (record.get('versionStatus') !== 'NEW' && record.get('auditWorkerFlowObj')) {
              return false;
            } else {
              return <DatePicker />;
            }
          }
        },
      },
      {
        name: 'startDate',
        width: 100,
        tooltip: 'overflow',
        editor: (record) => {
          if (record.get('versionStatus') !== 'NEW' && record.get('auditWorkerFlowObj')) {
            return false;
          } else {
            return <DatePicker />;
          }
        },
      },
      {
        name: 'endDate',
        width: 100,
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
    const { esopVersionList } = editPageDS.children;
    if (record.toData().drawingVersionId) {
      esopVersionList.current.reset();
    } else {
      esopVersionList.remove(record);
      if (esopVersionList.length) {
        const _line = esopVersionList.data[esopVersionList.length - 1];
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
    const _data = editPageDS.children.esopVersionList;
    _data.forEach((ele) => {
      ele.set('currentVersionFlag', false);
    });
    if (editPageDS.get('auditWorkflowId') && editPageDS.get('auditWorkflowFlag')) {
      editPageDS.children.esopVersionList.create({ versionStatus: 'NEW' });
    } else {
      editPageDS.children.esopVersionList.create({});
    }
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
        props.history.push({
          pathname: `/lmds/technology-esop-platform/edit/${res.content[0].esopId}`,
          state: {
            esopId: res.content[0].esopId,
          },
        });
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
    const { selected } = editPageDS.children.esopVersionList;
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
      <Header
        title={pageType === processType ? 'ESOP审批' : 'ESOP编辑'}
        backPath="/lmds/technology-esop-platform/list"
      >
        <Button onClick={handleSave} color="primary">
          保存
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
          <Button
            style={{ marginBottom: '15px' }}
            onClick={handleCreateNewVersion}
            disabled={pageType === processType}
          >
            新建版本
          </Button>
          <Table
            dataSet={editPageDS.children.esopVersionList}
            columns={getColumns()}
            columnResizable="true"
          />
        </div>
      </Content>
    </Fragment>
  );
}

export default DrawingEdit;
