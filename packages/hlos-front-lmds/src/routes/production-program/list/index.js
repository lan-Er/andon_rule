/*
 * @Descripttion: 生产程序管理首页
 * @version: 1.0.0
 * @Author: mingbo.zhang@hand-china.com
 * @Date: 2021-03-11 17:01:05
 * @LastEditors: mingbo.zhang@hand-china.com
 * @LastEditTime: 2021-03-16 09:45:29
 */
import React, { Fragment, useState } from 'react';
import { Header, Content } from 'components/Page';
import { Button, Table, DataSet, Modal } from 'choerodon-ui/pro';
import notification from 'utils/notification';
import { downloadFile } from 'services/api';
import { HZERO_FILE } from 'utils/config';
import { getCurrentOrganizationId } from 'utils/utils';
import { BUCKET_NAME_MDS } from 'hlos-front/lib/utils/config';

import { ProgressManageDS, ProgressLineDS, ProgressFileDS } from '../store/ProgressManageDS.js';
// import { ProgressFileDS } from '../store/ProgressEditDS.js';

const tableDS = new DataSet(ProgressManageDS());
const lineDS = new DataSet(ProgressLineDS());
const queryProgressFileDS = new DataSet(ProgressFileDS());

const organizationId = getCurrentOrganizationId();
const directory = 'drawing';

function ProgressManage(props) {
  const [programId, setProgramId] = useState(null);
  const [inProgress, setInProgress] = useState(false);

  const handleHeadRowClick = (record) => {
    return {
      onClick: () => {
        if (!inProgress) {
          setInProgress(true);
          setProgramId(record.get('programId'));
          lineDS.setQueryParameter('programId', record.get('programId'));
          lineDS.query().then(() => setInProgress(false));
        }
      },
    };
  };

  const handleToDetails = (record, e) => {
    if (e) e.stopPropagation();
    props.history.push({
      pathname: `/lmds/production-program/edit/${record.get('programId')}`,
      state: {
        programId: record.get('programId'),
      },
    });
  };

  const getColumns = () => {
    return [
      {
        name: 'programType',
        width: 128,
        tooltip: 'overflow',
        lock: 'left',
      },
      {
        name: 'programCode',
        width: 128,
        lock: 'left',
        renderer: ({ value, record }) => {
          return <a onClick={() => handleToDetails(record)}>{value}</a>;
        },
      },
      {
        name: 'programName',
        width: 128,
        tooltip: 'overflow',
      },
      {
        name: 'programAlias',
        width: 128,
        tooltip: 'overflow',
      },
      {
        name: 'description',
        width: 128,
        tooltip: 'overflow',
      },
      {
        name: 'programCategory',
        width: 128,
        tooltip: 'overflow',
      },
      {
        name: 'itemCode',
        width: 128,
        tooltip: 'overflow',
      },
      {
        name: 'itemDescription',
        width: 128,
        tooltip: 'overflow',
      },
      {
        name: 'itemCategory',
        width: 128,
        tooltip: 'overflow',
      },
      {
        name: 'productCode',
        width: 128,
        tooltip: 'overflow',
      },
      {
        name: 'productDescription',
        width: 128,
        tooltip: 'overflow',
      },
      {
        name: 'operationName',
        width: 128,
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
        name: 'partyName',
        width: 128,
        tooltip: 'overflow',
      },
      {
        name: 'programLevel',
        width: 128,
        tooltip: 'overflow',
      },
      {
        name: 'programGroup',
        width: 128,
        tooltip: 'overflow',
      },
      {
        name: 'relatedProgram',
        width: 128,
        tooltip: 'overflow',
      },
      {
        name: 'organizationName',
        width: 128,
        tooltip: 'overflow',
      },
      {
        name: 'prodLine',
        width: 128,
        tooltip: 'overflow',
      },
      {
        name: 'equmentName',
        width: 128,
        tooltip: 'overflow',
      },
      {
        name: 'auditWorkflow',
        width: 128,
        tooltip: 'overflow',
      },
      {
        name: 'assignRule',
        width: 128,
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
        width: 128,
        tooltip: 'overflow',
      },
    ];
  };

  const lineColumns = () => {
    return [
      {
        name: 'lineNum',
        width: 128,
        tooltip: 'overflow',
        renderer: ({ record }) => getSerialNum(record),
      },
      {
        name: 'programVersion',
        width: 128,
        tooltip: 'overflow',
      },
      {
        name: 'description',
        width: 128,
        tooltip: 'overflow',
      },
      {
        name: 'currentVersionFlag',
        width: 128,
        tooltip: 'overflow',
      },
      {
        name: 'versionStatusMeaning',
        width: 128,
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
        name: 'auditor',
        width: 128,
        tooltip: 'overflow',
      },
      {
        name: 'auditWorkerFlow',
        width: 128,
        tooltip: 'overflow',
      },
      {
        name: 'issuedDate',
        width: 128,
        tooltip: 'overflow',
      },
      {
        name: 'startDate',
        width: 128,
        tooltip: 'overflow',
      },
      {
        name: 'endDate',
        width: 128,
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
    queryProgressFileDS.queryParameter = { directory: fileUrl };
    queryProgressFileDS.query();
    Modal.open({
      key: 'production-program-management-modal',
      title: '文件列表',
      footer: null,
      closable: true,
      width: 900,
      children: (
        <div>
          <Table dataSet={queryProgressFileDS} columns={getColumnsFile()} />
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
      pathname: '/lmds/production-program/edit',
    });
  };

  return (
    <Fragment>
      <Header title="生产程序">
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
        {programId && (
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

export default ProgressManage;
