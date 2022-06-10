/**
 * @Description: SMD清单--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-12-07 19:53:29
 * @LastEditors: yu.na
 */

import React, { Fragment, useMemo } from 'react';
import { Table, DataSet, Button } from 'choerodon-ui/pro';
import { Button as HButton } from 'hzero-ui';
import queryString from 'query-string';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import { openTab } from 'utils/menuTab';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import { ExportButton } from 'hlos-front/lib/components';
import { ListDS } from '../stores/ListDS';
import LineList from './LineList';

const dsFactory = () => new DataSet(ListDS());

const preCode = 'lmds.smd';

const Smd = (props) => {
  const listDS = useDataSet(dsFactory, Smd);

  function codeRender({ value, record }) {
    return <a onClick={() => handleToDetailPage(record.data.smdHeaderId)}>{value.itemCode}</a>;
  }

  const columns = useMemo(() => {
    return [
      {
        name: 'organizationObj',
        width: 128,
        lock: true,
      },
      {
        name: 'itemObj',
        width: 128,
        renderer: codeRender,
        lock: true,
      },
      {
        name: 'itemDescription',
        width: 200,
      },
      {
        name: 'categoryObj',
        width: 128,
      },
      {
        name: 'pcbMountSide',
        width: 82,
      },
      {
        name: 'pcbProductQty',
        width: 82,
      },
      {
        name: 'deviceSumQty',
        width: 82,
      },
      {
        name: 'mountMethod',
        width: 82,
      },
      {
        name: 'mounterPosition',
        width: 82,
      },
      {
        name: 'prepareMethod',
        width: 82,
      },
      {
        name: 'primaryFlag',
        width: 82,
        renderer: yesOrNoRender,
      },
      {
        name: 'prodLineObj',
        width: 128,
      },
      {
        name: 'productObj',
        width: 336,
      },
      {
        name: 'partyObj',
        width: 200,
      },
      {
        name: 'ruleObj',
        width: 128,
      },
      {
        name: 'smdVersion',
        width: 128,
      },
      {
        name: 'smtProgram',
        width: 128,
      },
      {
        name: 'designer',
        width: 128,
      },
      {
        name: 'designedDate',
        width: 100,
      },
      {
        name: 'reviser',
        width: 128,
      },
      {
        name: 'revisedDate',
        width: 100,
      },
      {
        name: 'auditor',
        width: 128,
      },
      {
        name: 'auditedDate',
        width: 100,
      },
      {
        name: 'referenceDocument',
        width: 200,
      },
      {
        name: 'remark',
        width: 200,
      },
      {
        name: 'externalId',
        width: 128,
      },
      {
        name: 'externalNum',
        width: 128,
      },
      {
        name: 'startDate',
        width: 100,
      },
      {
        name: 'endDate',
        width: 100,
      },
      {
        name: 'enabledFlag',
        width: 82,
        align: 'center',
        renderer: yesOrNoRender,
      },
    ];
  }, []);

  function handleToDetailPage(val) {
    props.history.push({
      pathname: `/lmds/item-smd/detail/${val}`,
    });
  }

  function handleCreate() {
    props.history.push({
      pathname: `/lmds/item-smd/create`,
    });
  }

  function handleBatchImport() {
    openTab({
      key: `/himp/commentImport/LMDS.SMD`,
      title: intl.get(`${preCode}.view.title.import`).d('导入'),
      search: queryString.stringify({
        action: intl.get(`${preCode}.view.title.import`).d('导入'),
      }),
    });
  }

  return (
    <Fragment key="smd">
      <Header title={intl.get(`${preCode}.view.title.list`).d('SMD清单')}>
        <Button icon="add" color="primary" onClick={handleCreate}>
          {intl.get('hzero.common.button.create').d('新建')}
        </Button>
        <HButton icon="upload" onClick={handleBatchImport}>
          {intl.get('hzero.common.button.import').d('导入')}
        </HButton>
        <ExportButton
          reportCode={['LMDS_SMT_SMD_HEADER', 'LMDS_SMT_SMD_LINE']}
          exportTitle={intl.get(`${preCode}.buton.export`).d('SMD导出')}
        />
      </Header>
      <Content>
        <Table
          dataSet={listDS}
          bordered="false"
          columns={columns}
          columnResizable="true"
          editMode="inline"
        />
        <LineList ds={listDS.children.lineList} />
      </Content>
    </Fragment>
  );
};

export default Smd;
