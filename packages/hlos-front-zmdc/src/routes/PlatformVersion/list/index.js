/*
 * @Descripttion: 平台版本定义列表
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2021-07-28 10:33:55
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2021-07-28 14:55:09
 */

import React, { useEffect, Fragment } from 'react';
import { DataSet, Button, Table, CheckBox, DatePicker } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import { listDS } from '../store/indexDS';
import styles from './index.less';

const intlPrefix = 'zmdc.platformVersion';
const ListDS = new DataSet(listDS());

function ZmdcPlatformVersion() {
  useEffect(() => {
    ListDS.query();
  }, []);

  const handleDelete = (record) => {
    ListDS.delete(record);
  };

  const columns = [
    {
      name: 'versionCode',
      width: 150,
      lock: 'left',
    },
    {
      name: 'versionName',
      width: 150,
      lock: 'left',
      editor: (record) => record.status === 'add',
      align: 'left',
    },
    {
      name: 'versionRemark',
      lock: 'left',
      editor: true,
      align: 'left',
    },
    {
      name: 'segment1',
      editor: (record) => record.status === 'add',
      width: 110,
      align: 'left',
    },
    {
      name: 'segment2',
      editor: (record) => record.status === 'add',
      width: 110,
      align: 'left',
    },
    {
      name: 'segment3',
      editor: (record) => record.status === 'add',
      width: 110,
      align: 'left',
    },
    {
      name: 'segment4',
      editor: (record) => (record.status === 'add' ? <DatePicker /> : false),
      width: 110,
      align: 'left',
    },
    {
      name: 'enabledFlag',
      editor: (record) => (record.editing ? <CheckBox /> : false),
      width: 110,
      renderer: yesOrNoRender,
      align: 'center',
    },
    {
      header: '操作',
      width: 110,
      command: ({ record }) => {
        return [
          'edit',
          <Button key="update" color="primary" funcType="flat" onClick={() => handleDelete(record)}>
            删除
          </Button>,
        ];
      },
      lock: 'right',
    },
  ];

  return (
    <Fragment>
      <Header title={intl.get(`${intlPrefix}.view.title.timePredictionModel`).d('平台版本定义')} />
      <Content className={styles['zplan-sales-template-list']}>
        <Table
          dataSet={ListDS}
          columns={columns}
          rowHeight="auto"
          editMode="inline"
          buttons={['add']}
        />
      </Content>
    </Fragment>
  );
}

export default formatterCollections({
  code: [`${intlPrefix}`],
})((props) => {
  return <ZmdcPlatformVersion {...props} />;
});
