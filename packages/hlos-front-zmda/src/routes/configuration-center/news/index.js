/**
 * @Description: 消息通知
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-05-31 16:05:26
 */

import React, { Fragment, useEffect } from 'react';
import { DataSet, Tabs, Table, CheckBox, Select } from 'choerodon-ui/pro';
import { Popover, Badge } from 'choerodon-ui';
import formatterCollections from 'utils/intl/formatterCollections';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
// import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import intl from 'utils/intl';
import { DefaultNotificationConfigDS } from '../store/defaultNotificationDS';
import styles from './index.less';
import { customizeDS } from '../store/customizeDS';

const { TabPane } = Tabs;
const intlPrefix = 'zmda.configurationCenter';
const createCustomizeDS = () => new DataSet(customizeDS());
const defaultNotificationConfigDS = () => new DataSet(DefaultNotificationConfigDS());

function ZmdaNewsConfigurationCenter() {
  const CustomizeDS = useDataSet(() => createCustomizeDS());
  const defaultNotificationDS = useDataSet(defaultNotificationConfigDS);

  useEffect(() => {
    defaultNotificationDS.query();
  }, []);

  function handleTabChange(key) {
    if (key === 'default') {
      defaultNotificationDS.query();
      return;
    }
    CustomizeDS.query();
  }

  // function handleDefaultAdd() {
  //   defaultNotificationDS.create({}, 0);
  // }

  // function handleDefaultDelete() {
  //   defaultNotificationDS.delete(defaultNotificationDS.selected);
  // }

  const enableRender = (enabledFlag) => {
    switch (enabledFlag) {
      case 1:
        return <Badge status="success" text="启用" />;
      case 0:
        return <Badge status="error" text="禁用" />;
      default:
        return enabledFlag;
    }
  };

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

  const customizeColumns = [
    {
      name: 'notificationOrderType',
      width: 150,
      editor: true,
      lock: 'left',
    },
    {
      name: 'notificationStatusList',
      width: 150,
      editor: (record) =>
        record.editing ? <Select optionsFilter={({ data }) => data.value !== 'NEW'} /> : false,
      renderer: ({ value, record }) => {
        const { notificationStatusList } = record.toData();
        // const content = (
        //   <div>
        //     {notificationStatusList.map((i) => (
        //       <p>{i.notificationStatusMeaning}</p>
        //     ))}
        //   </div>
        // );
        let str = '';
        if (notificationStatusList && notificationStatusList.length) {
          notificationStatusList.forEach((v, index) => {
            str += index !== 0 ? `、${v.notificationStatusMeaning}` : v.notificationStatusMeaning;
          });
        }
        return (
          <Popover content={str}>
            {record.fields.get('notificationStatusList').getText(value)}
          </Popover>
        );
      },
    },
    {
      name: 'notificationTypeList',
      width: 150,
      editor: true,
    },
    {
      name: 'receiverTypeObj',
      editor: true,
      width: 150,
    },
    {
      name: 'receiverUserObj',
      width: 150,
      editor: true,
    },
    {
      name: 'templateObj',
      editor: true,
      width: 150,
    },
    {
      name: 'executeDefaultFlag',
      align: 'left',
      width: 150,
      editor: (record) => (record.editing ? <CheckBox /> : false),
      renderer: ({ value }) => yesOrNoRender(value),
      help:
        '若选择继续执行默认规则，则会使用自定义选择的消息模板，根据默认规则配置发送通知给联系人/操作用户/创建用户。',
    },
    {
      name: 'enabledFlag',
      editor: (record) => (record.editing ? <CheckBox /> : false),
      renderer: ({ value }) => yesOrNoRender(value),
      width: 80,
      align: 'left',
    },
    {
      header: '操作',
      align: 'center',
      lock: 'right',
      command: ['edit'],
    },
  ];

  const defaultColumns = [
    {
      name: 'notificationOrderType',
      width: 150,
      align: 'center',
      editor: true,
      lock: 'left',
    },
    {
      name: 'notificationStatusList',
      width: 150,
      editor: (record) =>
        record.editing && <Select optionsFilter={({ data }) => data.value !== 'NEW'} />,
      renderer: ({ record, value }) => {
        const { notificationStatusList } = record.toData();
        let str = '';
        if (notificationStatusList && notificationStatusList.length) {
          notificationStatusList.forEach((v, index) => {
            str += index !== 0 ? `、${v.notificationStatusMeaning}` : v.notificationStatusMeaning;
          });
        }
        return (
          <Popover content={str}>
            {record.fields.get('notificationStatusList').getText(value)}
          </Popover>
        );
      },
      align: 'center',
    },
    {
      name: 'notificationTypeList',
      width: 140,
      align: 'center',
      editor: true,
    },
    {
      name: 'notificationContactsFlag',
      width: 100,
      editor: (record) => record.editing && <CheckBox />,
      renderer: ({ value }) => yesOrNoRender(value),
      align: 'center',
    },
    {
      name: 'notificationOperatorFlag',
      width: 100,
      editor: (record) => record.editing && <CheckBox />,
      renderer: ({ value }) => yesOrNoRender(value),
      align: 'center',
    },
    {
      name: 'notificationCreatorFlag',
      width: 100,
      editor: (record) => record.editing && <CheckBox />,
      renderer: ({ value }) => yesOrNoRender(value),
      align: 'center',
    },
    {
      name: 'enabledFlag',
      width: 80,
      editor: (record) => record.editing && <CheckBox />,
      renderer: ({ value }) => enableRender(value),
      align: 'center',
    },
    {
      header: intl.get('hzero.common.button.action').d('操作'),
      width: 100,
      command: ['edit'],
      lock: 'right',
    },
  ];

  return (
    <Fragment>
      <div className={styles['news-config']}>
        <Tabs defaultActiveKey="default" onChange={handleTabChange}>
          <TabPane tab="默认通知规则" key="default">
            {/* <div className={styles['default-config-btn']}>
              <Button onClick={handleDefaultDelete}>删除</Button>
              <Button onClick={handleDefaultAdd}>新增</Button>
            </div> */}
            <Table
              dataSet={defaultNotificationDS}
              columns={defaultColumns}
              columnResizable="true"
              editMode="inline"
              buttons={['delete', 'add']}
            />
            <div className={styles['news-desc']}>
              默认通知规则：当单据状态变更时，会对相应用户发送通知，可支持客户/供应商维护的联系人、单据操作用户及单据创建用户。
            </div>
          </TabPane>
          <TabPane tab="自定义通知规则" key="customize">
            <Table
              dataSet={CustomizeDS}
              columns={customizeColumns}
              columnResizable="true"
              editMode="inline"
              buttons={['delete', 'add']}
            />
          </TabPane>
        </Tabs>
      </div>
    </Fragment>
  );
}

export default formatterCollections({
  code: [`${intlPrefix}`],
})(ZmdaNewsConfigurationCenter);
