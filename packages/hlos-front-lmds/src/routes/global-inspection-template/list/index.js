/*
 * @Description: 质量检模板--Index
 * @Author: TJ <jianjun.tan@hand-china.com>
 * @Date: 2019-12-11 9:05:22
 * @Copyright: Copyright(c) 2019, Hand
 * @LastEditors: Please set LastEditors
 */
import React, { useEffect, Fragment } from 'react';
import { Table, Button, DataSet } from 'choerodon-ui/pro';
import { Button as HButton } from 'hzero-ui';
import intl from 'utils/intl';
import ExcelExport from 'components/ExcelExport';
import { Content, Header } from 'components/Page';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import { routerRedux } from 'dva/router';
import { isUndefined } from 'lodash';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { getCurrentOrganizationId, filterNullValueObject, getResponse } from 'utils/utils';
import queryString from 'query-string';
import { openTab } from 'utils/menuTab';

import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import { queryLovData } from 'hlos-front/lib/services/api';
import { syncInspectionTemplate } from '../../../services/inspectionTemplateService';

import statusConfig from '@/common/statusConfig';
import codeConfig from '@/common/codeConfig';
import { inspectionTemListDS } from '../stores/InspectionTemplateDS';

const organizationId = getCurrentOrganizationId();
const {
  importTemplateCode: { inspectionTemplateList },
} = statusConfig.statusValue.lmds;
const { common } = codeConfig.code;

function InspectionTemplateList(props) {
  const tableDS = useDataSet(() => new DataSet(inspectionTemListDS()), InspectionTemplateList);
  useEffect(() => {
    tableDS.queryDataSet.addEventListener('update', ({ name, record }) => {
      if (name === 'organizationObj') {
        record.set('itemObj', null);
        record.set('inspectionGroupObj', null);
        record.set('operationObj', null);
        record.set('resourceObj', null);
      }
    });
    queryDefaultOrg();
    const myQuery = sessionStorage.getItem('globalInspectionTemplate') || false;
    if (myQuery) {
      tableDS.query().then(() => {
        sessionStorage.removeItem('globalInspectionTemplate');
      });
    }
    return () => {
      tableDS.queryDataSet.removeEventListener('update');
      sessionStorage.removeItem('globalInspectionTemplate');
    };
  }, []);

  async function queryDefaultOrg() {
    const res = await queryLovData({
      lovCode: common.organization,
      defaultFlag: 'Y',
    });
    if (res && res.content && res.content[0]) {
      tableDS.queryDataSet.current.set('organizationObj', res.content[0]);
    }
  }

  /**
   * 组织名拼接
   * @param {*} record 当前行记录
   */
  function getOrganization(record) {
    return `${record.get('organizationCode') ? record.get('organizationCode') : ''} ${
      record.get('organizationName') ? record.get('organizationName') : ''
    }`;
  }
  /**
   * 图纸超链接
   * @param {*} record 当前行记录
   */
  function linkDrawingCodeRender(record) {
    return (
      <a onClick={() => window.open(record.get('drawingCode'))}>{record.get('drawingCode')}</a>
    );
  }

  /**
   * 参考文件超链接
   * @param {*} record 当前行记录
   */
  function linkReferenceDocumentRender(record) {
    return (
      <a onClick={() => window.open(record.get('referenceDocument'))}>
        {record.get('referenceDocument')}
      </a>
    );
  }

  /**
   * getExportQueryParams - 获取导出字段查询参数
   */
  function getExportQueryParams() {
    const formObj = tableDS.queryDataSet.current;
    const fieldsValue = isUndefined(formObj) ? {} : filterNullValueObject(formObj.toData());
    return {
      ...fieldsValue,
    };
  }

  function handleBatchExport() {
    try {
      openTab({
        key: `/himp/commentImport/${inspectionTemplateList}`,
        title: intl
          .get('lmds.inspectionTemplate.view.title.inspectionTemplateImport')
          .d('质检模板导入'),
        search: queryString.stringify({
          action: 'himp.commentImport.view.button.templateImport',
        }),
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e.message);
    }
  }

  function columns() {
    return [
      {
        name: 'organizationName',
        width: 128,
        renderer: ({ record }) => getOrganization(record),
        lock: true,
      },
      { name: 'inspectionGroupName', width: 128, lock: true },
      { name: 'inspectionTemplateTypeMeaning', width: 128, lock: true },
      {
        name: 'itemCode',
        width: 128,
        lock: true,
      },
      { name: 'itemDescription', width: 200 },
      { name: 'categoryName', width: 128 },
      { name: 'operationName', width: 128 },
      { name: 'routingOperationName', width: 128 },
      { name: 'partyName', width: 200 },
      { name: 'resourceName', width: 128 },
      { name: 'inspectorGroupName', width: 128 },
      { name: 'inspectorName', width: 128 },
      { name: 'inspectionStandard', width: 128 },
      { name: 'samplingTypeMeaning', width: 84 },
      { name: 'samplingStandardMeaning', width: 128 },
      { name: 'sampleValue', width: 100 },
      { name: 'sampleJudgeModeMeaning', width: 100 },
      { name: 'frequencyTypeMeaning', width: 100 },
      { name: 'frequencyValue', width: 100 },
      { name: 'standardInspectTime', width: 128 },
      { name: 'docProcessRuleName', width: 128 },
      { name: 'autoFeedbackResult', width: 70, renderer: yesOrNoRender },
      {
        name: 'referenceDocument',
        width: 128,
        renderer: ({ record }) => linkReferenceDocumentRender(record),
      },
      { name: 'instruction', width: 128 },
      {
        name: 'drawingCode',
        width: 128,
        renderer: ({ record }) => linkDrawingCodeRender(record),
      },
      { name: 'autoJudgeFlag', width: 70, renderer: yesOrNoRender },
      { name: 'syncFlag', width: 70, renderer: yesOrNoRender },
      { name: 'enabledFlag', width: 84, renderer: yesOrNoRender },
      {
        name: 'action',
        width: 90,
        header: intl.get('hzero.common.button.action').d('操作'),
        align: 'center',
        lock: 'right',
        renderer: ({ record }) => (
          <span className="action-link">
            <a onClick={() => handleToDetail(`/lmds/inspection-template/detail`, record)}>
              {intl.get('hzero.common.button.edit').d('编辑')}
            </a>
          </span>
        ),
      },
    ];
  }
  function handleToDetail(url, record, e) {
    if (e) e.stopPropagation();
    props.dispatch(
      routerRedux.push({
        pathname: `${url}/${record.get('templateId')}`,
      })
    );
  }

  /**
   * @description 跳转到创建页面
   * @param recode
   * @param e
   */

  function handleCreate(url, e) {
    if (e) e.stopPropagation();
    props.dispatch(
      routerRedux.push({
        pathname: url,
      })
    );
  }
  async function handleSync() {
    // /v1/{tenantId}/inspection-templates/sync-inspection-template
    const orgArr = tableDS.selected.map((ele) => ({
      organizationId: ele.get('organizationId'),
      templateId: ele.get('templateId'),
      inspectionGroupId: ele.get('inspectionGroupId'),
    }));
    const res = await syncInspectionTemplate(orgArr);
    if (getResponse(res)) {
      notification.success({
        message: '同步成功',
      });
      tableDS.query();
    }
  }

  return (
    <Fragment>
      <Header
        title={intl.get('lmds.inspectionTemplate.view.title.inspecti.template').d('质检模板')}
      >
        <Button
          icon="add"
          color="primary"
          onClick={() => handleCreate('/lmds/inspection-template/create')}
        >
          {intl.get('hzero.common.button.create').d('新建')}
        </Button>
        <Button icon="sync" onClick={handleSync}>
          {intl.get('lmds.inspectionTemplate.button.sync').d('同步')}
        </Button>
        <HButton icon="upload" onClick={handleBatchExport}>
          {intl.get('lmds.common.button.import').d('导入')}
        </HButton>
        <ExcelExport
          requestUrl={`${HLOS_LMDS}/v1/${organizationId}/inspection-templates/excel`}
          queryParams={getExportQueryParams}
        />
      </Header>
      <Content>
        <Table
          dataSet={tableDS}
          columns={columns()}
          columnResizable="true"
          queryFieldsLimit={4}
          editMode="inline"
        />
      </Content>
    </Fragment>
  );
}

export default formatterCollections({
  code: ['lmds.inspectionTemplate', 'lmds.common'],
})((props) => {
  return <InspectionTemplateList {...props} />;
});
