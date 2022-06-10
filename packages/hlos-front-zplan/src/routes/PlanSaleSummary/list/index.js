/*
 * @Descripttion: 销售预测模型 - 时间序列预测模型
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2021-05-18 14:01:49
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2021-05-18 14:15:15
 */

import React, { useEffect, Fragment } from 'react';
import { DataSet, Button, Table } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import notification from 'utils/notification';
import { listDS } from '../store/indexDS';
import styles from './index.less';

const intlPrefix = 'zplan.timePredictionModel';
const ListDS = new DataSet(listDS());

function ZplanSaleTemplate({ history, dispatch }) {
  useEffect(() => {
    ListDS.query();
  }, []);

  function handleToDetail(id) {
    history.push({
      pathname: `/zplan/plan-sale-summary/detail/${id}`,
    });
  }

  function handleCreate() {
    history.push({
      pathname: `/zplan/plan-sale-summary/create`,
    });
  }

  function handleDelete() {
    if (!ListDS.selected.length) {
      notification.error({
        message: intl.get(`hzero.common.message.validation.atLeast`).d('请至少选择一条数据'),
      });
      return;
    }

    if (!validateData('NEW')) {
      notification.warning({
        message: '选中的预测模板有无法删除的预测模板（运行中/已取消），请检查后选择！',
      });
      return;
    }
    ListDS.delete(ListDS.selected);
  }

  function handleSubmit() {
    let validateFlag = true;
    let validateSuccess = true;

    if (!ListDS.selected.length) {
      notification.error({
        message: intl.get(`hzero.common.message.validation.atLeast`).d('请至少选择一条数据'),
      });
      return;
    }

    const params = ListDS.selected.map((item) => {
      if (!['NEW'].includes(item.data.saleSummaryStatus)) {
        validateFlag = false;
      }

      if (!['SUCCESS'].includes(item.data.cleaningStatus)) {
        validateSuccess = false;
      }
      return {
        ...item.data,
        saleSummaryStatus: 'CONFIRMED',
      };
    });

    if (!validateFlag) {
      notification.warning({
        message: '选中的预测汇总有无法提交的预测汇总（已提交），请检查后选择！',
      });
      return;
    }

    if (!validateSuccess) {
      notification.warning({
        message: '有汇总计算未完成，请检查后选择！',
      });
      return;
    }

    return new Promise(async (resolve) => {
      dispatch({
        type: `saleSummaryModel/saleSummarys`,
        payload: params,
      }).then(async (res) => {
        if (res && !res.failed) {
          notification.success({
            message: '操作成功',
          });
          ListDS.query();
        }
        resolve();
      });
    });
  }

  function validateData(status) {
    let validateFlag = true;
    const params = ListDS.selected.map((item) => {
      if (![status].includes(item.data.saleSummaryStatus)) {
        validateFlag = false;
      }
      return {
        ...item.data,
        saleSummaryStatus: 'CONFIRMED',
      };
    });

    if (!validateFlag) {
      return false;
    }
    return params;
  }

  const columns = [
    {
      name: 'saleSummaryNum',
      width: 150,
      renderer: ({ record, value }) => {
        const id = record.get('saleSummaryId');
        return <a onClick={() => handleToDetail(id)}>{value}</a>;
      },
      lock: 'left',
    },
    {
      name: 'saleSummaryName',
      width: 150,
    },
    {
      name: 'predictionCalibrationFlag',
      renderer: yesOrNoRender,
      align: 'left',
      width: 120,
    },
    {
      name: 'predictionStartDate',
      width: 120,
    },
    {
      name: 'predictionEndDate',
      width: 120,
    },
    {
      name: 'predictionGap',
      width: 160,
    },
    {
      name: 'cleaningStatus',
      width: 120,
    },
    {
      name: 'saleSummaryStatusMeaning',
      width: 120,
    },
  ];

  return (
    <Fragment>
      <Header title={intl.get(`${intlPrefix}.view.title.timePredictionModel`).d('预测汇总列表')}>
        <Button color="primary" onClick={handleCreate}>
          新建
        </Button>
        <Button onClick={handleSubmit}>提交</Button>
        <Button onClick={handleDelete}>删除</Button>
      </Header>
      <Content className={styles['zplan-sales-template-list']}>
        <Table dataSet={ListDS} columns={columns} rowHeight="auto" />
      </Content>
    </Fragment>
  );
}

export default formatterCollections({
  code: [`${intlPrefix}`],
})((props) => {
  return <ZplanSaleTemplate {...props} />;
});
