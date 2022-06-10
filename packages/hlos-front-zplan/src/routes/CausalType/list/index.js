/*
 * @Descripttion: 销售预测模型-因子类别列表页
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2021-05-18 14:01:49
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2021-05-18 14:15:15
 */

import React, { useEffect, Fragment } from 'react';
import { DataSet, Table, CheckBox } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
// import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import { causalTypeListDS } from '../store/indexDS';
// const organizationId = getCurrentOrganizationId();
import styles from './index.less';

const intlPrefix = 'zplan.timePredictionModel';
const ListDS = new DataSet(causalTypeListDS());

function ZplanTimePredictionModel({ history }) {
  useEffect(() => {
    ListDS.query();
  }, []);

  function handleToDetail(value) {
    // 需要根据状态进行跳转页面的判断
    const pathName = `/zplan/causal-type/${value.toLowerCase()}`;
    history.push({
      pathname: pathName,
    });
  }

  const columns = [
    {
      name: 'causalTypeCode',
      align: 'center',
      renderer: ({ value }) => {
        return (
          <a disabled={value === 'WEEK' || value === 'MONTH'} onClick={() => handleToDetail(value)}>
            {value || ''}
          </a>
        );
      },
    },
    { name: 'causalTypeName', align: 'center', editor: true },
    {
      name: 'enabledFlag',
      align: 'center',
      editor: (record) => (record.editing ? <CheckBox /> : false),
      renderer: yesOrNoRender,
    },
    {
      header: '操作',
      lock: 'right',
      align: 'center',
      width: 120,
      command: ['edit'],
    },
  ];

  return (
    <Fragment>
      <Header title={intl.get(`${intlPrefix}.view.title.timePredictionModel`).d('因子类别')} />
      <Content className={styles['zplan-causal-type-content']}>
        <Table dataSet={ListDS} columns={columns} editMode="inline" />
      </Content>
    </Fragment>
  );
}

export default formatterCollections({
  code: [`${intlPrefix}`],
})((props) => {
  return <ZplanTimePredictionModel {...props} />;
});
