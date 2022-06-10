/**
 * @Description: 业务单据 -- 头表
 * @Author: yiping.liu<yiping.liu@hand-china.com>
 * @Date: 2020-02-11 13:58:33
 * @LastEditors: yiping.liu
 */
import React, { useState, useEffect } from 'react';
import intl from 'utils/intl';
import ExcelExport from 'components/ExcelExport';
import { Header, Content } from 'components/Page';
import { Table, Button, Lov, Form, Select, DataSet, Pagination } from 'choerodon-ui/pro';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId, filterNullValueObject, getResponse } from 'utils/utils';
import { orderStatusRender } from 'hlos-front/lib/utils/renderer';
import formatterCollections from 'utils/intl/formatterCollections';
import { queryLovData } from 'hlos-front/lib/services/api';

import codeConfig from '@/common/codeConfig';
import { headDS, lineDS } from '../stores/businessDocumentDS';
import LineTable from './businessDocumentLine';
import styles from './index.less';

const organizationId = getCurrentOrganizationId();

const preCode = 'lmds.businessDocument';
const { common } = codeConfig.code;

let headDataSet = new DataSet(headDS());
const lineDataSet = new DataSet(lineDS());

function BusinessDocument() {
  const [moreQuery, setMoreQuery] = useState(false);
  const [documentId, setDocumentId] = useState(-1);
  useEffect(() => {
    defaultLovSetting();
    return () => {
      headDataSet = new DataSet(headDS());
    };
  }, []);

  /**
   *设置默认查询条件
   *
   */
  async function defaultLovSetting() {
    const res = await queryLovData({ lovCode: common.organization, defaultFlag: 'Y' });

    if (getResponse(res)) {
      if (res && res.content && headDataSet.queryDataSet && headDataSet.queryDataSet.current) {
        headDataSet.queryDataSet.current.set('organizationObj', {
          organizationId: res.content[0].organizationId,
          organizationName: res.content[0].organizationName,
        });
      }
    }
  }

  const columns = [
    { name: 'organization', editor: false, width: 150, lock: 'left' },
    { name: 'documentTypeObj', editor: false, width: 150, lock: 'left' },
    {
      name: 'documentNumObj',
      editor: false,
      width: 150,
      lock: 'left',
      renderer: ({ value }) => (
        <span
          style={{ cursor: 'pointer', color: 'blue' }}
          onClickCapture={(e) => {
            // prevent trigger query line data
            e.stopPropagation();
            // go to detail
            // ...
          }}
        >
          {value.documentNumber || ''}
        </span>
      ),
    },
    {
      name: 'documentStatusMeaning',
      editor: false,
      width: 120,
      align: 'center',
      renderer: ({ value, record }) => orderStatusRender(record.data.documentStatus, value),
    },
    { name: 'sourceDocTypeObj', editor: false, width: 150 },
    { name: 'sourceDocNumObj', editor: false, width: 150 },
    { name: 'sourceDocLineNum', editor: false, width: 150 },
  ];

  /**
   *头点击事件
   *
   * @param {*} { record }
   * @returns
   */
  function handleClick({ record }) {
    return {
      onClick: () => {
        setDocumentId(record.data.documentId);
        lineDataSet.queryParameter = { documentId: record.data.documentId };
        lineDataSet.query();
      },
    };
  }

  /**
   *导出
   *
   * @returns
   */
  function getExportQueryParams() {
    const queryDataDs = headDataSet && headDataSet.queryDataSet && headDataSet.queryDataSet.current;
    const queryDataDsValue = queryDataDs ? filterNullValueObject(queryDataDs.toData()) : {};
    return {
      tenantId: organizationId,
      ...queryDataDsValue,
    };
  }

  /**
   *重置
   *
   */
  function handleReset() {
    headDataSet.queryDataSet.current.reset();
  }

  /**
   *查询
   *
   * @returns
   */
  async function handleSearch() {
    setDocumentId(-1);
    const validateValue = await headDataSet.validate(false, false);
    if (!validateValue) {
      return;
    }
    await headDataSet.query();
  }

  return (
    <React.Fragment>
      <Header title={intl.get(`${preCode}.view.title.businessDocument`).d('业务单据')}>
        <ExcelExport
          requestUrl={`${HLOS_LMDS}/v1/${organizationId}/documents/excel`}
          queryParams={getExportQueryParams}
        />
      </Header>
      <Content>
        <div className={styles['lwms-global-business-document']}>
          <Form dataSet={headDataSet.queryDataSet} columns={3}>
            <Lov name="organizationObj" clearButton noCache />
            <Lov name="documentNumObj" clearButton noCache />
            <Lov name="documentTypeObj" clearButton noCache />
            {moreQuery && <Lov name="sourceDocTypeObj" clearButton noCache />}
            {moreQuery && <Lov name="sourceDocNumObj" clearButton noCache />}
            {moreQuery && <Select name="documentStatus" />}
          </Form>
          <div style={{ display: 'inline-flex', paddingTop: '11px' }}>
            <Button
              onClick={() => {
                setMoreQuery(!moreQuery);
              }}
            >
              {moreQuery
                ? intl.get('hzero.common.button.collected').d('收起查询')
                : intl.get('hzero.common.button.viewMore').d('更多查询')}
            </Button>
            <Button onClick={handleReset}>{intl.get('hzero.common.button.reset').d('重置')}</Button>
            <Button color="primary" onClick={handleSearch}>
              {intl.get('hzero.common.button.search').d('查询')}
            </Button>
          </div>
        </div>
        <Table
          dataSet={headDataSet}
          border={false}
          columnResizable="true"
          editMode="inline"
          columns={columns}
          queryBar="none"
          onRow={(record) => handleClick(record)}
        />
        <Pagination
          dataSet={headDataSet}
          style={{ textAlign: 'right' }}
          onChange={() => setDocumentId(-1)}
        />
        {documentId !== -1 && <LineTable tableDS={lineDataSet} />}
      </Content>
    </React.Fragment>
  );
}

export default formatterCollections({
  code: [`${preCode}`],
})(BusinessDocument);
