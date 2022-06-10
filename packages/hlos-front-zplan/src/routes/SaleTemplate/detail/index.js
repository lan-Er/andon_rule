/*
 * @Descripttion: 销售预测模型 - 时间序列预测模型
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2021-05-18 14:01:49
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2021-05-18 14:15:15
 */

import React, { useState, useEffect, Fragment } from 'react';
import {
  DataSet,
  Button,
  Form,
  Table,
  TextField,
  Select,
  DateTimePicker,
  Tabs,
} from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import notification from 'utils/notification';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
// import { getCurrentOrganizationId } from 'utils/utils';
import { getSerialNum } from '@/utils/renderer';
import ItemAttributeSelect from '@/components/ItemAttributeSelect/index';
import styles from './index.less';

import { headDS, saleItemRelDS, entityItemRelDS } from '../store/indexDS';

const intlPrefix = 'zplan.timePredictionModel';
// const organizationId = getCurrentOrganizationId();

const { TabPane } = Tabs;
const CreateHeadDS = () => new DataSet(headDS());
const CreateSaleItemRelDS = () => new DataSet(saleItemRelDS());
const CreateEntityItemRelDS = () => new DataSet(entityItemRelDS());

function ZplanTimePredictionModel({ match, dispatch, history }) {
  const HeadDS = useDataSet(CreateHeadDS, ZplanTimePredictionModel);
  const SaleItemRelDS = useDataSet(CreateSaleItemRelDS);
  const EntityItemRelDS = useDataSet(CreateEntityItemRelDS);

  const {
    params: { type, saleTemplateId },
  } = match;

  const [canEdit, setCanEdit] = useState(true); // 是否可编辑
  let currentTab = 'item';
  // const [currentTab, setCurrentTab] = useState('item'); // 是否可编辑

  useEffect(() => {
    HeadDS.data = [];
    HeadDS.create();
    // SaleItemRelDS.data = [];
    // SaleItemRelDS.create();
    // EntityItemRelDS.data = [];
    // EntityItemRelDS.create();
    if (type === 'detail') {
      handleSearch();
    }

    if (type === 'create') {
      HeadDS.current.set('saleTemplateStatus', 'NEW');
    }
  }, [saleTemplateId]);

  async function handleSearch() {
    HeadDS.setQueryParameter('saleTemplateId', saleTemplateId);
    await HeadDS.query();
    setCanEdit(HeadDS.current.data.saleTemplateStatus === 'NEW' || type === 'create');
    SaleItemRelDS.setQueryParameter('saleTemplateId', saleTemplateId);
    EntityItemRelDS.setQueryParameter('saleTemplateId', saleTemplateId);
    SaleItemRelDS.query();
    EntityItemRelDS.query();
  }

  async function handleSave(status) {
    const validateValue = await HeadDS.validate(false, false);
    if (!validateValue) {
      notification.error({
        message: '存在必输字段未填写或字段输入不合法！',
      });
      return;
    }

    const apiName = type === 'create' ? 'createSaleTemplates' : 'saleTemplates';
    return new Promise(async (resolve) => {
      const headers = HeadDS.current.toData();
      const params =
        type === 'create'
          ? headers
          : [
              {
                ...headers,
                saleTemplateStatus: status,
              },
            ];

      dispatch({
        type: `saleTemplateModel/${apiName}`,
        payload: params,
      }).then(async (res) => {
        if (res && !res.failed) {
          notification.success({
            message: '操作成功',
          });

          let id;
          if (type === 'create') {
            id = res.saleTemplateId;
          } else {
            id = res[0].saleTemplateId;
          }
          const pathName =
            status === 'RUNNING' ? `/zplan/sale-template` : `/zplan/sale-template/detail/${id}`;

          if (type === 'create' || status === 'RUNNING') {
            history.push({
              pathname: pathName,
            });
            resolve();
            return;
          }
          handleSearch();

          // const pathName = `/zplan/sale-template`;
          // if (status === 'RUNNING') {
          //   history.push({
          //     pathname: '/zplan/sale-template',
          //   });
          // } else {
          //   handleSearch();
          // }
        }
        resolve();
      });
    });
  }

  function handleSure(obj) {
    const { itemCode, itemId } = SaleItemRelDS.current.toData();
    SaleItemRelDS.current.set('itemAttr', {
      ...SaleItemRelDS.current.toData(),
      ...obj,
      itemId,
      itemCode,
    });
  }

  function handleLineCreate() {
    const { saleTemplateNum } = HeadDS.current.toData();

    const ds = currentTab === 'item' ? SaleItemRelDS : EntityItemRelDS;
    ds.create({
      saleTemplateId,
      saleTemplateNum,
    });
  }

  function handleTabChange(key) {
    // if(type === 'create'){
    //   return;
    // }
    currentTab = key;
    const ds = key === 'item' ? SaleItemRelDS : EntityItemRelDS;
    ds.query();
  }

  function handleLineDelete() {
    const ds = currentTab === 'item' ? SaleItemRelDS : EntityItemRelDS;
    if (!ds.selected.length) {
      notification.error({
        message: intl.get(`hzero.common.message.validation.atLeast`).d('请至少选择一条数据'),
      });
      return;
    }
    ds.delete(ds.selected);
  }

  const columns = [
    // {
    //   name: 'saleItemRelNum',
    //   lock: 'left',
    //   width: 90,
    // },
    {
      header: '序号',
      renderer: ({ record }) => getSerialNum(record),
      width: 90,
      lock: 'left',
    },
    {
      name: 'itemObj',
      width: 150,
      editor: () => HeadDS.current.get('saleTemplateStatus') === 'NEW',
    },
    {
      name: 'itemAttr',
      width: 150,
      renderer: ({ record, value }) => {
        return (
          <ItemAttributeSelect
            data={value}
            handleSure={handleSure}
            ds={SaleItemRelDS}
            itemId={record.get('itemId')}
            itemDesc={record.get('itemDesc')}
            disabled={!record.editing || HeadDS.current.get('saleTemplateStatus') !== 'NEW'}
          />
        );
      },
    },
    {
      name: 'itemDesc',
      width: 150,
    },
    {
      header: '操作',
      lock: 'right',
      align: 'center',
      width: 120,
      command: ['edit'],
    },
  ];

  const entitycolumns = [
    // {
    //   name: 'saleEntityRelNum',
    //   width: 90,
    //   lock: 'left',
    // },
    {
      header: '序号',
      renderer: ({ record }) => getSerialNum(record),
      width: 90,
      lock: 'left',
    },
    {
      name: 'salesEntityObj',
      width: 200,
      editor: () => HeadDS.current.get('saleTemplateStatus') === 'NEW',
    },
    {
      name: 'salesEntityName',
    },
    {
      header: '操作',
      lock: 'right',
      align: 'center',
      width: 120,
      command: ['edit'],
    },
  ];

  const operations = (
    <div>
      <Button disabled={!canEdit || type === 'create'} color="primary">
        读取历史销售记录
      </Button>
      <Button disabled={!canEdit || type === 'create'} color="primary">
        读取新品上市计划
      </Button>
      <Button disabled={!canEdit || type === 'create'}>导入</Button>
      <Button disabled={!canEdit || type === 'create'}>导出</Button>
      <Button disabled={!canEdit || type === 'create'} onClick={handleLineDelete}>
        删除
      </Button>
      <Button disabled={!canEdit || type === 'create'} icon="add" onClick={handleLineCreate}>
        新建
      </Button>
    </div>
  );

  return (
    <Fragment>
      <Header
        backPath="/zplan/sale-template"
        title={
          type === 'create'
            ? intl.get(`${intlPrefix}.view.title.vmiMaterialsApplyCreate`).d('新建销售预测模板')
            : intl.get(`${intlPrefix}.view.title.vmiMaterialsApplyEdit`).d('销售预测模板详情')
        }
      >
        {canEdit && (
          <>
            <Button color="primary" onClick={() => handleSave('RUNNING')}>
              保存并提交
            </Button>
            <Button onClick={() => handleSave('NEW')}>保存</Button>
          </>
        )}
      </Header>
      <Content className={styles['zplan-sales-template']}>
        <Form dataSet={HeadDS} columns={4} labelWidth={120}>
          <TextField name="saleTemplateNum" key="saleTemplateNum" disabled />
          <TextField name="remark" key="remark" disabled={!canEdit} />
          <Select name="lifecycleUom" key="lifecycleUom" disabled={!canEdit} />
          <TextField name="lifecycleLength" key="lifecycleLength" disabled={!canEdit} />

          <DateTimePicker name="runStartDate" key="runStartDate" disabled={!canEdit} />
          <DateTimePicker name="runEndDate" key="runEndDate" disabled={!canEdit} />
          <TextField name="runGap" key="runGap" disabled={!canEdit} />
          <Select name="saleTemplateStatus" key="saleTemplateStatus" disabled />

          <DateTimePicker name="lastRunDate" key="lastRunDate" disabled />
          <DateTimePicker name="nextRunDate" key="nextRunDate" disabled />
        </Form>

        <Tabs
          defaultActiveKey={currentTab}
          tabBarExtraContent={operations}
          onChange={handleTabChange}
        >
          <TabPane tab="预测物料" key="item">
            <Table dataSet={SaleItemRelDS} columns={columns} editMode="inline" rowHeight="auto" />
          </TabPane>
          <TabPane tab="销售实体" key="sales">
            <Table
              className={styles['zplan-sales-template-entity']}
              width={700}
              dataSet={EntityItemRelDS}
              columns={entitycolumns}
              editMode="inline"
              rowHeight="auto"
            />
          </TabPane>
        </Tabs>
      </Content>
    </Fragment>
  );
}

export default formatterCollections({
  code: [`${intlPrefix}`],
})((props) => {
  return <ZplanTimePredictionModel {...props} />;
});
