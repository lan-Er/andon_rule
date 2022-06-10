/*
 * @Descripttion: 销售预测模型 - 时间序列预测模型
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2021-05-18 14:01:49
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2021-05-18 14:15:15
 */

import React, { useState, useEffect, Fragment } from 'react';
import { DataSet, Button, Form, Table, TextField, Select, DatePicker } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import notification from 'utils/notification';
import { getSerialNum } from '@/utils/renderer';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import ItemAttributeSelect from '@/components/ItemAttributeSelect/index';

import { headDS, lineDS } from '../store/indexDS';

const intlPrefix = 'zplan.timePredictionModel';

const CreateHeadDS = () => new DataSet(headDS());
const CreateLineDS = () => new DataSet(lineDS());

function ZplanTimePredictionModel({ match, dispatch, history }) {
  const HeadDS = useDataSet(CreateHeadDS);
  const LineDS = useDataSet(CreateLineDS);

  const {
    params: { saleResultId },
  } = match;

  const [canEdit, setCanEdit] = useState(true); // 是否可编辑

  useEffect(() => {
    HeadDS.setQueryParameter('saleResultId', null);
    LineDS.setQueryParameter('saleResultId', null);
    HeadDS.data = [];
    HeadDS.create();
    LineDS.data = [];
    LineDS.clearCachedSelected();

    handleSearch();
  }, [saleResultId]);

  async function handleSearch() {
    HeadDS.setQueryParameter('saleResultId', saleResultId);
    await HeadDS.query();
    LineDS.setQueryParameter('saleResultId', saleResultId);
    LineDS.query();
    setCanEdit(HeadDS.current.data.saleResultStatus === 'NEW');
  }

  async function handleSave(status) {
    return new Promise(async (resolve) => {
      const headers = HeadDS.current.toData();

      dispatch({
        type: `saleResultModel/saleResults`,
        payload: [
          {
            ...headers,
            saleResultStatus: status,
            planSaleResultLineList: LineDS.toData(),
          },
        ],
      }).then(async (res) => {
        if (res && !res.failed) {
          notification.success({
            message: '操作成功',
          });

          // const pathName = status === 'RUNNING' ? `/zplan/sale-result` : `/zplan/sale-result/detail/${res[0].saleResultId}`;
          // const pathName = `/zplan/sale-template`;

          // history.push(pathName);

          if (status === 'NEW') {
            handleSearch();
          } else {
            history.push({
              pathname: `/zplan/sale-result`,
            });
          }
        }
        resolve();
      });
    });
  }

  function handleSure(obj) {
    const { itemCode, itemId } = LineDS.current.toData();
    LineDS.current.set('itemAttr', {
      ...LineDS.current.toData(),
      ...obj,
      itemId,
      itemCode,
    });
  }

  const columns = [
    // {
    //   name: 'saleResultLineNum',
    //   // lock: 'left',
    //   width: 90,
    // },
    {
      header: '序号',
      renderer: ({ record }) => getSerialNum(record),
      width: 90,
      lock: 'left',
    },
    {
      name: 'itemCode',
      width: 150,
    },
    {
      name: 'itemDesc',
      width: 150,
    },
    {
      name: 'itemAttr',
      width: 150,
      renderer: ({ record, value }) => {
        return (
          <ItemAttributeSelect
            data={value}
            handleSure={handleSure}
            ds={LineDS}
            itemId={record.get('itemId')}
            itemDesc={record.get('itemDesc')}
            disabled={!record.editing}
          />
        );
      },
    },
    {
      name: 'uomCode',
      width: 90,
    },
    {
      name: 'saleDate',
      width: 150,
    },
    {
      name: 'predictionBasicCount',
      width: 120,
    },
    {
      name: 'monthCount',
      width: 90,
    },
    {
      name: 'weekCount',
      width: 90,
    },
    {
      name: 'festivalCount',
      width: 90,
    },
    {
      name: 'activityCount',
      width: 120,
    },
    {
      name: 'discountCount',
      width: 90,
    },
    {
      name: 'lifecycleCount',
      width: 120,
    },
    {
      name: 'manualDesc',
      width: 150,
      editor: () => HeadDS.current.get('saleResultStatus') === 'NEW',
    },
    {
      name: 'manualCount',
      width: 150,
      align: 'left',
      editor: () => HeadDS.current.get('saleResultStatus') === 'NEW',
      lock: 'right',
    },
    {
      name: 'totalPredictionCount',
      width: 120,
      lock: 'right',
    },
  ];

  return (
    <Fragment>
      <Header
        backPath="/zplan/sale-result"
        title={intl.get(`${intlPrefix}.view.title.timePredictionModel`).d('销售预测结果详情')}
      >
        {canEdit && (
          <>
            <Button color="primary" onClick={() => handleSave('CONFIRMED')}>
              保存并提交
            </Button>
            <Button onClick={() => handleSave('NEW')}>保存</Button>
          </>
        )}
      </Header>
      <Content>
        <Form dataSet={HeadDS} columns={4} labelWidth={120}>
          <TextField name="saleResultNum" key="saleResultNum" disabled />
          <TextField name="salesEntityName" key="salesEntityName" disabled />
          <Select name="lifecycleUom" key="lifecycleUom" disabled />
          <DatePicker name="predictionStartDate" key="predictionStartDate" disabled />
          <DatePicker name="predictionEndDate" key="predictionEndDate" disabled />
          <TextField name="saleTemplateNum" key="saleTemplateNum" disabled />
          <Select name="saleResultStatus" key="saleResultStatus" disabled />

          <DatePicker name="runStartDate" key="runStartDate" disabled />
        </Form>

        <Table dataSet={LineDS} columns={columns} rowHeight="auto" />
      </Content>
    </Fragment>
  );
}

export default formatterCollections({
  code: [`${intlPrefix}`],
})((props) => {
  return <ZplanTimePredictionModel {...props} />;
});
