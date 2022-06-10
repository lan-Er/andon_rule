/*
 * @Descripttion: 销售预测模型-因子类别列表页
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2021-05-18 14:01:49
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2021-05-18 14:15:15
 */

import React, { useEffect, Fragment } from 'react';
import { DataSet, Button, Table, Modal, CheckBox } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId } from 'utils/utils';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';

import { activityListDS, siphonicEffectListDS } from '../store/indexDS';
import styles from './index.less';

const organizationId = getCurrentOrganizationId();

const intlPrefix = 'zplan.timePredictionModel';
const ListDS = new DataSet(activityListDS());
const SiphonicEffectListDS = new DataSet(siphonicEffectListDS());

let modal;
function ZplanTimePredictionModel() {
  useEffect(() => {
    ListDS.query();
  }, []);

  function handleCreate() {
    ListDS.create(
      {
        tenantId: organizationId,
      },
      0
    );
  }

  function showSiphonicEffect(id, type) {
    SiphonicEffectListDS.setQueryParameter('siphonicEffectId', id);
    SiphonicEffectListDS.setQueryParameter('siphonicSourceType', type);

    SiphonicEffectListDS.query();
    modal = Modal.open({
      title: '虹吸效应',
      maskClosable: true,
      destroyOnClose: true,
      // drawer: true,
      children: <Table dataSet={SiphonicEffectListDS} columns={siphonicEffectColumns} />,
      footer: () => (
        <div>
          <Button onClick={() => modal.close()}>返回</Button>
          <Button onClick={handleSiphonicEffectSave} color="primary">
            保存
          </Button>
        </div>
      ),
    });
  }

  const handleSiphonicEffectSave = () => {
    SiphonicEffectListDS.submit();
  };

  const siphonicEffectColumns = [
    {
      name: 'nearDay',
    },
    { name: 'siphonicEffectValue', editor: true },
  ];

  const columns = [
    {
      name: 'activityCode',
      align: 'center',
      editor: (record) => !record.get('activityId'),
    },
    { name: 'activityName', align: 'center', editor: true },
    {
      name: 'activityId',
      align: 'center',
      renderer: ({ record, value }) => {
        return (
          <a
            disabled={!record.get('activityId')}
            onClick={() => showSiphonicEffect(value, 'PROMOTION')}
          >
            点击查看
          </a>
        );
      },
    },
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
      command: ['edit'],
    },
  ];

  return (
    <Fragment>
      <Header
        backPath="/zplan/causal-type"
        title={intl.get(`${intlPrefix}.view.title.timePredictionModel`).d('促销活动定义')}
      >
        {/* <Button color="primary" onClick={handleSave}>
          保存
        </Button> */}
        <Button color="primary" onClick={handleCreate} icon="add">
          新建
        </Button>
      </Header>
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
