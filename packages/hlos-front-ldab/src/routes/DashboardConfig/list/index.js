/*
 * @Description: 看板配置--list
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2020-05-25 09:51:28
 * @LastEditors: 赵敏捷
 */

import React, { Fragment, useEffect, useState } from 'react';
import { DataSet, Table, Button, Modal } from 'choerodon-ui/pro';
import { Button as HButton } from 'hzero-ui';
import queryString from 'query-string';

import intl from 'utils/intl';
import { openTab } from 'utils/menuTab';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import { HLOS_LDAB } from 'hlos-front/lib/utils/config';
import { getFileName } from 'hlos-front/lib/utils/utils';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import statusConfig from '@/common/statusConfig';

import { dashboardCardDSConfig, dashboardSettingDSConfig } from '@/stores/dashboardConfigDS';
import defaultLogo from 'hlos-front/lib/assets/onestep-img.png';

const key = Modal.key();
const intlPrefix = 'ldab.dashboardConfig';
const commonPrefix = 'ldab.common';
const organizationId = getCurrentOrganizationId();
const {
  importTemplateCode: { dashboardConfig },
} = statusConfig.statusValue.ldab;
const headDS = new DataSet(dashboardSettingDSConfig());
const lineDS = new DataSet(dashboardCardDSConfig());

// 获取导出字段查询参数
function getExportQueryParams() {
  const queryDataDs = headDS.queryDataSet?.current;
  const queryDataDsValue = queryDataDs ? filterNullValueObject(queryDataDs.toData()) : {};
  return {
    tenantId: organizationId,
    ...queryDataDsValue,
  };
}

// 导入
function handleBatchImport() {
  openTab({
    key: `/himp/commentImport/${dashboardConfig}`,
    title: intl.get(`${intlPrefix}.view.title.customerImport`).d('客户导入'),
    search: queryString.stringify({
      action: intl.get(`${intlPrefix}.view.title.customerImport`).d('客户导入'),
    }),
  });
}

function getHeadColumns(handleGoDetail) {
  return [
    {
      name: 'dashboardClass',
      width: 150,
      editor: false,
      lock: 'left',
    },
    {
      name: 'dashboardType',
      width: 150,
      editor: false,
      lock: 'left',
    },
    {
      name: 'dashboardCode',
      width: 150,
      editor: false,
      lock: 'left',
      renderer: ({ value, record }) => (
        <span
          style={{ cursor: 'pointer', color: 'blue' }}
          onClickCapture={(e) => {
            e.stopPropagation();
            handleGoDetail(record);
          }}
        >
          {value || ''}
        </span>
      ),
    },
    {
      name: 'dashboardName',
      width: 150,
      editor: false,
    },
    {
      name: 'dashboardAlias',
      width: 150,
      editor: false,
    },
    {
      name: 'description',
      width: 150,
      editor: false,
    },
    {
      name: 'displayTerminalType',
      width: 150,
      editor: false,
    },
    {
      name: 'displayTerminal',
      width: 150,
      editor: false,
    },
    {
      name: 'fixedResolution',
      width: 150,
      editor: false,
    },
    {
      name: 'logoUrl',
      width: 150,
      editor: false,
      renderer: ({ value }) => {
        const fileName = (value && getFileName(value)) || 'LOGO';
        return (
          <span
            style={{ cursor: 'pointer', color: 'blue' }}
            onClickCapture={(e) => {
              e.stopPropagation();
              handleImagePreview(value);
            }}
          >
            {fileName || ''}
          </span>
        );
      },
    },
    {
      name: 'noticeMsg',
      width: 150,
      editor: false,
    },
    {
      name: 'organizationObj',
      width: 150,
      editor: false,
    },
    {
      name: 'dashboardControl',
      width: 150,
      editor: false,
    },
    {
      name: 'enabledFlag',
      width: 150,
      editor: false,
      renderer: yesOrNoRender,
    },
  ];
}

function getCardColumns() {
  return [
    {
      name: 'cardNum',
      width: 150,
      editor: false,
      lock: 'left',
    },
    {
      name: 'cardCode',
      width: 150,
      editor: false,
      lock: 'left',
    },
    {
      name: 'cardTitle',
      width: 150,
      editor: false,
    },
    {
      name: 'cardType',
      width: 150,
      editor: false,
    },
    {
      name: 'displayCardTitle',
      width: 150,
      editor: false,
      renderer: yesOrNoRender,
    },
    {
      name: 'cardTemplate',
      width: 150,
      editor: false,
    },
    {
      name: 'cardDataType',
      width: 150,
      editor: false,
    },
    {
      name: 'cardLength',
      width: 150,
      editor: false,
    },
    {
      name: 'cardWidth',
      width: 150,
      editor: false,
    },
    {
      name: 'cardLocationX',
      width: 150,
      editor: false,
    },
    {
      name: 'cardLocationY',
      width: 150,
      editor: false,
    },
    {
      name: 'refreshType',
      width: 150,
      editor: false,
    },
    {
      name: 'refreshInterval',
      width: 150,
      editor: false,
    },
    {
      name: 'loopDisplay',
      width: 150,
      editor: false,
      renderer: yesOrNoRender,
    },
    {
      name: 'loopDisplayInterval',
      width: 150,
      editor: false,
    },
    {
      name: 'initialValue',
      width: 150,
      editor: false,
    },
    {
      name: 'onlyInitialFlag',
      width: 150,
      editor: false,
      renderer: yesOrNoRender,
    },
    {
      name: 'referenceValue',
      width: 150,
      editor: false,
    },
    {
      name: 'sourceReport',
      width: 150,
      editor: false,
    },
    {
      name: 'cardControl',
      width: 150,
      editor: false,
    },
    {
      name: 'enabledFlag',
      width: 100,
      editor: false,
      align: 'center',
      renderer: yesOrNoRender,
    },
  ];
}

function handleImagePreview(imgUrl) {
  Modal.open({
    key,
    children: <img alt="logo" style={{ width: '100%' }} src={imgUrl || defaultLogo} />,
    footer: null,
    closable: true,
  });
}

function DashboardConfig({ history }) {
  const [headId, setHeadId] = useState(null);
  const [onProcess, toggleOnProcess] = useState(false);

  useEffect(() => {
    headDS.addEventListener('query', () => setHeadId(null));
    return () => {
      headDS.removeEventListener('query');
    };
  }, []);

  // 跳转详情页面
  function handleGoDetail(record) {
    const { dashboardId } = record.data;
    history.push({
      pathname: `/ldab/dashboard-config/detail/${dashboardId}`,
      state: { mode: 'edit', dashboardId },
    });
  }

  // 头行点击
  const handleHeadRowClick = (record) => {
    return {
      onClick: () => {
        if (!onProcess) {
          toggleOnProcess(true);
          const curClickHeadId = record.get('dashboardId');
          if (headId !== curClickHeadId) {
            setHeadId(curClickHeadId);
            lineDS.setQueryParameter('dashboardId', curClickHeadId);
            lineDS.query().then(() => toggleOnProcess(false));
          }
        }
      },
    };
  };

  // 新建单据
  function handleCreateDashboardConfig() {
    history.push({
      pathname: '/ldab/dashboard-config/create',
      state: { mode: 'create' },
    });
  }

  return (
    <Fragment>
      <Header title={intl.get(`${intlPrefix}.view.title.dashboardConfig`).d('看板配置')}>
        <Button icon="add" color="primary" onClick={handleCreateDashboardConfig}>
          {intl.get('hzero.common.button.create').d('新建')}
        </Button>
        <HButton icon="upload" onClick={handleBatchImport}>
          {intl.get('hzero.common.button.import').d('导入')}
        </HButton>
        <ExcelExport
          requestUrl={`${HLOS_LDAB}/v1/${organizationId}/dashboard-settings/excel`}
          queryParams={getExportQueryParams}
        />
      </Header>
      <Content>
        <Table
          dataSet={headDS}
          columns={getHeadColumns(handleGoDetail)}
          columnResizable="true"
          queryFieldsLimit={4}
          onRow={({ record }) => handleHeadRowClick(record)}
        />
        {headId && <Table dataSet={lineDS} columns={getCardColumns()} columnResizable="true" />}
      </Content>
    </Fragment>
  );
}

export default formatterCollections({
  code: [`${intlPrefix}`, `${commonPrefix}`],
})(DashboardConfig);
