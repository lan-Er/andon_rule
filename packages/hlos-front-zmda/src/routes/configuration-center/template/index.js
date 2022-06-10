/**
 * @Description: 打印模板设置
 * @Author: qifeng.deng@hand.com
 * @Date: 2021-07-06 18:17:32
 */

import React, { Fragment, useEffect } from 'react';
import { DataSet, Table, CheckBox, Select } from 'choerodon-ui/pro';
// import { Popover, Badge } from 'choerodon-ui';
import { Badge } from 'choerodon-ui';
import formatterCollections from 'utils/intl/formatterCollections';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
// import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import intl from 'utils/intl';
import styles from './index.less';
import { templateDS } from '../store/templateDS';

const intlPrefix = 'zmda.configurationCenter';
const createTemplateDS = () => new DataSet(templateDS());

function ZmdaNewsConfiguration() {
  const TemplateDS = useDataSet(() => createTemplateDS());

  useEffect(() => {
    TemplateDS.query();
  }, []);

  const yesOrNoRender = (enabledFlag) => {
    switch (enabledFlag) {
      case 1:
        return <Badge status="success" text="是" />;
      case 0:
        return <Badge status="error" text="否" />;
      default:
        return enabledFlag;
    }
  };

  const templateColumns = [
    {
      name: 'defaultFlag',
      editor: (record) => (record.editing ? <CheckBox /> : false),
      renderer: ({ value }) => yesOrNoRender(value),
      width: 130,
      align: 'center',
      lock: 'left',
    },
    {
      name: 'printRuleType',
      align: 'center',
      width: 150,
      editor: (record) =>
        record.editing ? <Select optionsFilter={({ data }) => data.value !== 'NEW'} /> : false,
    },
    {
      name: 'templateCode',
      align: 'center',
      width: 130,
      editor: true,
    },
    {
      name: 'templateName',
      align: 'center',
      editor: true,
      width: 150,
    },
    {
      name: 'targetNumber',
      align: 'center',
      editor: true,
      width: 130,
    },
    {
      name: 'enabledFlag',
      editor: (record) => (record.editing ? <CheckBox /> : false),
      renderer: ({ value }) => yesOrNoRender(value),
      width: 80,
      align: 'center',
    },
    {
      header: '操作',
      align: 'center',
      lock: 'right',
      command: ['edit'],
    },
  ];

  return (
    <Fragment>
      <div className={styles['template-config']}>
        <div className={styles['template-config-header']}>
          <div>{intl.get(`${intlPrefix}.view.title.templateConfiguration`).d('打印模板配置')}</div>
        </div>
        <div>
          <Table
            dataSet={TemplateDS}
            columns={templateColumns}
            columnResizable="true"
            editMode="inline"
            buttons={['delete', 'add']}
          />
        </div>
      </div>
    </Fragment>
  );
}

export default formatterCollections({
  code: [`${intlPrefix}`],
})(ZmdaNewsConfiguration);
