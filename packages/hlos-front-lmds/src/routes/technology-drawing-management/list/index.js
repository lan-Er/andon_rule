/*
 * @Description: 图纸管理
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-01-28 18:54:28
 */

import React, { Fragment, useState } from 'react';
import { Button, Table, DataSet, Modal } from 'choerodon-ui/pro';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import { BUCKET_NAME_MDS } from 'hlos-front/lib/utils/config';
import { Button as ButtonPermission } from 'components/Permission';
import { Header, Content } from 'components/Page';
import notification from 'utils/notification';
import { downloadFile } from 'services/api';
import { HZERO_FILE } from 'utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

import { DrawingManagementDS, DrawingManagementLineDS } from '../store/DrawingManagementDS.js';
import { DrawingFileDS } from '../store/DrawingEditDS.js';

const tableDS = new DataSet(DrawingManagementDS());
const lineDS = new DataSet(DrawingManagementLineDS());
const queryDrawingFileDS = new DataSet(DrawingFileDS());

const organizationId = getCurrentOrganizationId();
const directory = 'drawing';

function DrawingManagement(props) {
  const [drawingId, setDrawingId] = useState(null);
  const [inProgress, setInProgress] = useState(false);

  const handleHeadRowClick = (record) => {
    return {
      onClick: () => {
        if (!inProgress) {
          setInProgress(true);
          setDrawingId(record.get('drawingId'));
          lineDS.setQueryParameter('drawingId', record.get('drawingId'));
          lineDS.query().then(() => setInProgress(false));
        }
      },
    };
  };

  const handleToDetails = (record, e) => {
    if (e) e.stopPropagation();
    props.history.push({
      pathname: `/lmds/technology-drawing-management/edit/${record.get('drawingId')}`,
      state: {
        drawingId: record.get('drawingId'),
      },
    });
  };

  const getColumns = () => {
    return [
      {
        name: 'drawingTypeMeaning',
        width: 128,
        tooltip: 'overflow',
        lock: 'left',
      },
      {
        name: 'drawingCode',
        width: 128,
        tooltip: 'overflow',
        lock: 'left',
        renderer: ({ value, record }) => {
          return <a onClick={() => handleToDetails(record)}>{value}</a>;
        },
      },
      {
        name: 'drawingName',
        width: 200,
        tooltip: 'overflow',
        lock: 'left',
      },
      {
        name: 'drawingAlias',
        width: 128,
        tooltip: 'overflow',
      },
      {
        name: 'description',
        width: 336,
        tooltip: 'overflow',
      },
      {
        name: 'drawingCategoryName',
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
        name: 'drawingLevel',
        width: 128,
        tooltip: 'overflow',
      },
      {
        name: 'drawingGroup',
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
        name: 'drawingVersion',
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
        name: 'auditor',
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
    queryDrawingFileDS.queryParameter = { directory: fileUrl };
    queryDrawingFileDS.query();
    Modal.open({
      key: 'technology-drawing-management-modal',
      title: '文件列表',
      footer: null,
      closable: true,
      width: 900,
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
      pathname: '/lmds/technology-drawing-management/edit',
    });
  };

  return (
    <Fragment>
      <Header title="图纸管理">
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
        {drawingId && (
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
