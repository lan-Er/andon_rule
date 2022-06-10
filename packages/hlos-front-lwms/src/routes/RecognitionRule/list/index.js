/*
 * @Description: 识别规则
 * @Author: leying.yan@hand-china.com
 * @Date: 2021-01-14
 * @LastEditors: leying.yan
 */

import React, { Fragment, useMemo, useEffect } from 'react';
import { Button, Table, DataSet } from 'choerodon-ui/pro';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import { HeadDS, LineDS } from '@/stores/recognitionRuleDS';

const preCode = 'lwms.recognitionRule';

const listFactory = () => new DataSet(HeadDS());
const lineFactory = () => new DataSet(LineDS());

const RecognitionRule = ({ history }) => {
  const headDS = useDataSet(listFactory, RecognitionRule);
  const lineDS = useDataSet(lineFactory, []);

  const columns = useMemo(() => {
    return [
      { name: 'identifyRuleClass', width: 84, lock: true },
      { name: 'identifyRuleType', width: 84, lock: true },
      { name: 'identifyRuleCode', width: 128, lock: true, renderer: linkRenderer },
      { name: 'identifyRuleName', width: 128, lock: true },
      { name: 'identifyRuleAlias', width: 128, lock: true },
      { name: 'description', width: 200 },
      { name: 'ruleSeparator', width: 82 },
      { name: 'identifyMethod', width: 128 },
      { name: 'identifyApi', width: 200 },
      { name: 'organizationName', width: 128 },
      { name: 'partyName', width: 200 },
      { name: 'onceIdentifyNumber', width: 82 },
      { name: 'priority', width: 82 },
      {
        name: 'enabledFlag',
        width: 82,
        renderer: yesOrNoRender,
      },
    ];
  }, []);

  const lineColumns = useMemo(() => {
    return [
      { name: 'lineNum', width: 70, lock: true },
      { name: 'identifyContentType', width: 144, lock: true },
      { name: 'prefixCode', width: 128 },
      { name: 'postfixCode', width: 128 },
      { name: 'lengthFrom', width: 82 },
      { name: 'lengthTo', width: 82 },
      { name: 'maskCode', width: 200 },
      { name: 'subSeparator', width: 82 },
      {
        name: 'enabledFlag',
        width: 82,
        renderer: yesOrNoRender,
      },
    ];
  }, []);

  useEffect(() => {
    const myQuery = sessionStorage.getItem('recognitionRuleQuery');
    if (myQuery) {
      headDS.query().then(() => {
        sessionStorage.removeItem('recognitionRuleQuery');
      });
    }
  });

  function handleCreate(params) {
    history.push({
      pathname: params ? `/lwms/recognition-rule/edit/${params}` : `/lwms/recognition-rule/create`,
    });
  }

  // 点击头设置头 ID 并查询行
  const handleClick = ({ record }) => {
    return {
      onClick: () => {
        const identifyRuleId = record.get('identifyRuleId');
        lineDS.setQueryParameter('identifyRuleId', identifyRuleId);
        lineDS.query();
      },
    };
  };

  /** 显示超链接
   * @returns
   */
  function linkRenderer({ value, record }) {
    return <a onClick={() => handleCreate(record.data.identifyRuleId)}>{value}</a>;
  }
  return (
    <Fragment>
      <Header title={intl.get(`${preCode}.view.title.recognitionRule`).d('识别规则')}>
        <Button icon="add" color="primary" onClick={() => handleCreate()}>
          {intl.get('hzero.common.button.create').d('新建')}
        </Button>
      </Header>
      <Content>
        <Table
          dataSet={headDS}
          columns={columns}
          columnResizable="true"
          onRow={(record) => handleClick(record)}
        />
        <Table dataSet={lineDS} columns={lineColumns} columnResizable="true" />
      </Content>
    </Fragment>
  );
};

export default RecognitionRule;
