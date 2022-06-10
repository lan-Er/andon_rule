/*
 * @Description: 图纸管理
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-07-16 12:45:25
 */

import React, { Fragment, useState } from 'react';
import { Button, Table, DataSet, Modal } from 'choerodon-ui/pro';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import { BUCKET_NAME_MDS } from 'hlos-front/lib/utils/config';
import { Header, Content } from 'components/Page';
import { Button as ButtonPermission } from 'components/Permission';
import notification from 'utils/notification';
import { downloadFile } from 'services/api';
import { HZERO_FILE } from 'utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

import { EsopPlatformDS, EsopPlatformLineDS } from '../store/EsopPlatformDS.js';
import { EsopFileDS } from '../store/EsopEditDS.js';

const organizationId = getCurrentOrganizationId();
const tableDS = new DataSet(EsopPlatformDS());
const lineDS = new DataSet(EsopPlatformLineDS());
const queryEsopFileDS = new DataSet(EsopFileDS());

const directory = 'esop';

function DrawingManagement(props) {
  const [esopId, setEsopId] = useState(null);
  const [inProgress, setInProgress] = useState(false);

  const handleHeadRowClick = (record) => {
    return {
      onClick: () => {
        if (!inProgress) {
          setInProgress(true);
          setEsopId(record.get('esopId'));
          lineDS.setQueryParameter('esopId', record.get('esopId'));
          lineDS.query().then(() => setInProgress(false));
        }
      },
    };
  };

  const handleToDetails = (record, e) => {
    if (e) e.stopPropagation();
    props.history.push({
      pathname: `/lmds/technology-esop-platform/edit/${record.get('esopId')}`,
      state: {
        esopId: record.get('esopId'),
      },
    });
  };

  const getColumns = () => {
    return [
      {
        name: 'esopTypeMeaning',
        width: 128,
        tooltip: 'overflow',
      },
      {
        name: 'esopCode',
        width: 128,
        tooltip: 'overflow',
        renderer: ({ value, record }) => {
          return <a onClick={() => handleToDetails(record)}>{value}</a>;
        },
      },
      {
        name: 'esopName',
        width: 200,
        tooltip: 'overflow',
      },
      {
        name: 'esopAlias',
        width: 128,
        tooltip: 'overflow',
      },
      {
        name: 'description',
        width: 336,
        tooltip: 'overflow',
      },
      {
        name: 'esopCategoryName',
        width: 200,
        tooltip: 'overflow',
      },
      {
        name: 'itemCode',
        width: 128,
        tooltip: 'overflow',
      },
      {
        name: 'itemCategoryName',
        width: 200,
        tooltip: 'overflow',
      },
      {
        name: 'itemDescription',
        width: 336,
        tooltip: 'overflow',
      },
      {
        name: 'productCode',
        width: 128,
        tooltip: 'overflow',
      },
      {
        name: 'productDescription',
        width: 336,
        tooltip: 'overflow',
      },
      {
        name: 'operation',
        width: 128,
        tooltip: 'overflow',
      },
      {
        name: 'operationName',
        width: 200,
        tooltip: 'overflow',
      },
      {
        name: 'projectNum',
        width: 128,
        tooltip: 'overflow',
      },
      {
        name: 'wbsNum',
        width: 128,
        tooltip: 'overflow',
      },
      {
        name: 'partyNumber',
        width: 128,
        tooltip: 'overflow',
      },
      {
        name: 'partyName',
        width: 200,
        tooltip: 'overflow',
      },
      {
        name: 'esopGroup',
        width: 128,
        tooltip: 'overflow',
      },
      {
        name: 'relatedEsop',
        width: 128,
        tooltip: 'overflow',
      },
      {
        name: 'esopLevel',
        width: 128,
        tooltip: 'overflow',
      },
      {
        name: 'relatedDrawing',
        width: 128,
        tooltip: 'overflow',
      },
      {
        name: 'organizationName',
        width: 128,
        tooltip: 'overflow',
      },
      {
        name: 'workflowTemplate',
        width: 128,
        tooltip: 'overflow',
      },
      {
        name: 'assignRule',
        width: 128,
        tooltip: 'overflow',
      },
      {
        name: 'creator',
        width: 128,
        tooltip: 'overflow',
      },
      {
        name: 'creationDate',
        width: 150,
        tooltip: 'overflow',
      },
      {
        name: 'lastUpdateMan',
        width: 128,
        tooltip: 'overflow',
      },
      {
        name: 'lastUpdateDate',
        width: 150,
        tooltip: 'overflow',
      },
      {
        name: 'externalId',
        width: 128,
        tooltip: 'overflow',
      },
      {
        name: 'externalNum',
        width: 128,
        tooltip: 'overflow',
      },
      {
        name: 'enabledFlag',
        width: 82,
        tooltip: 'overflow',
        renderer: yesOrNoRender,
      },
    ];
  };

  const lineColumns = () => {
    return [
      {
        name: 'lineNum',
        width: 70,
        tooltip: 'overflow',
        renderer: ({ record }) => getSerialNum(record),
      },
      {
        name: 'esopVersion',
        width: 128,
        tooltip: 'overflow',
      },
      {
        name: 'description',
        width: 336,
        tooltip: 'overflow',
      },
      {
        name: 'versionStatusMeaning',
        width: 82,
        tooltip: 'overflow',
        renderer: ({ value }) => {
          let color = null;
          if (value === '新建') {
            color = '#03A9F4';
          } else if (value === '审核中') {
            color = '#1976D2';
          } else if (value === '发布') {
            color = '#43A047';
          } else if (value === '发布') {
            color = '#9E9E9E';
          }
          return <span style={{ color }}>{value}</span>;
        },
      },
      {
        name: 'fileUrl',
        width: 200,
        tooltip: 'overflow',
        renderer: ({ record }) => {
          const { fileUrl } = record.data;
          return (
            <span
              style={{
                color: '#29BECE',
                cursor: 'pointer',
              }}
              onClick={() => handleOpenFileModal(fileUrl)}
            >
              查看
            </span>
          );
        },
      },
      {
        name: 'designer',
        width: 128,
        tooltip: 'overflow',
      },
      {
        name: 'auditWorkerFlow',
        width: 200,
        tooltip: 'overflow',
      },
      {
        name: 'approver',
        width: 128,
        tooltip: 'overflow',
      },
      {
        name: 'issuedDate',
        width: 100,
        tooltip: 'overflow',
      },
      {
        name: 'startDate',
        width: 100,
        tooltip: 'overflow',
      },
      {
        name: 'endDate',
        width: 100,
        tooltip: 'overflow',
      },
      {
        name: 'creator',
        width: 128,
        tooltip: 'overflow',
      },
      {
        name: 'creationDate',
        width: 150,
        tooltip: 'overflow',
      },
      {
        name: 'lastUpdateMan',
        width: 128,
        tooltip: 'overflow',
      },
      {
        name: 'lastUpdateDate',
        width: 150,
        tooltip: 'overflow',
      },
      {
        name: 'currentVersionFlag',
        width: 82,
        tooltip: 'overflow',
      },
    ];
  };

  const handleOpenFileModal = (fileUrl) => {
    if (!fileUrl) {
      notification.warning({
        message: '暂无文件可查看',
      });
      return;
    }
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
  };

  /**
   * 获取行序号
   * @param {*} record 当前行记录
   */
  const getSerialNum = (record) => {
    const { index } = record;
    record.set('lineNum', index + 1);
    return index + 1;
  };

  const handleDrawingCreate = () => {
    props.history.push({
      pathname: '/lmds/technology-esop-platform/create',
    });
  };

  return (
    <Fragment>
      <Header title="ESOP平台">
        <Button color="primary" icon="add" onClick={handleDrawingCreate}>
          新建
        </Button>
      </Header>
      <Content>
        <Table
          dataSet={tableDS}
          columns={getColumns()}
          queryFieldsLimit={4}
          columnResizable="true"
          editMode="inline"
          onRow={({ record }) => handleHeadRowClick(record)}
        />
        {esopId && (
          <Table
            dataSet={lineDS}
            columns={lineColumns()}
            columnResizable="true"
            selectionMode="dblclick"
            editMode="inline"
          />
        )}
      </Content>
    </Fragment>
  );
}

export default DrawingManagement;
