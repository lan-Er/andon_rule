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
      pathname: `/zplan/sale-template/detail/${id}`,
    });
  }

  function handleCreate() {
    history.push({
      pathname: `/zplan/sale-template/create`,
    });
  }

  function handleDelete() {
    if (!validateData('NEW')) {
      notification.warning({
        message: '选中的预测模板有无法删除的预测模板（运行中/已取消），请检查后选择！',
      });
      return;
    }
    ListDS.delete(ListDS.selected);
  }

  function handleSubmit() {
    if (!validateData('NEW')) {
      notification.warning({
        message: '选中的预测模板有无法提交的预测模板（运行中/已取消），请检查后选择！',
      });
      return;
    }

    return new Promise(async (resolve) => {
      dispatch({
        type: `saleTemplateModel/saleTemplates`,
        payload: validateData('NEW'),
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
    // ListDS.submit(validateData('RUNNING'));
  }

  function handleCancel() {
    if (!validateData('RUNNING')) {
      notification.warning({
        message: '选中的预测模板有无法取消的预测模板（新建/已取消），请检查后选择！',
      });
      return;
    }

    return new Promise(async (resolve) => {
      dispatch({
        type: `saleTemplateModel/cancelTemplates`,
        payload: ListDS.selected.map((i) => i.toData()),
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
    if (!ListDS.selected.length) {
      notification.error({
        message: intl.get(`hzero.common.message.validation.atLeast`).d('请至少选择一条数据'),
      });
      return;
    }
    const params = ListDS.selected.map((item) => {
      if (![status].includes(item.data.saleTemplateStatus)) {
        validateFlag = false;
      }
      return {
        ...item.data,
        saleTemplateStatus: 'RUNNING',
      };
    });

    if (!validateFlag) {
      return false;
    }
    return params;
  }

  const columns = [
    {
      name: 'saleTemplateNum',
      width: 150,
      renderer: ({ record, value }) => {
        const id = record.get('saleTemplateId');
        return <a onClick={() => handleToDetail(id)}>{value}</a>;
      },
      lock: 'left',
    },
    {
      name: 'remark',
      width: 150,
      editor: (record) => !record.get('saleTemplateId'),
    },
    {
      name: 'lifecycleUom',
      editor: (record) => !record.get('saleTemplateId'),
    },
    {
      name: 'lifecycleLength',
      editor: (record) => !record.get('saleTemplateId'),
      align: 'left',
    },
    {
      name: 'runGap',
      width: 120,
      editor: (record) => !record.get('saleTemplateId'),
      align: 'left',
    },
    {
      name: 'runStartDate',
      width: 160,
      editor: (record) => !record.get('saleTemplateId'),
    },
    {
      name: 'runEndDate',
      width: 160,
      editor: (record) => !record.get('saleTemplateId'),
    },
    {
      name: 'lastRunDate',
      width: 160,
    },
    {
      name: 'nextRunDate',
      width: 160,
    },
    {
      name: 'saleTemplateStatus',
      lock: 'right',
    },
  ];

  return (
    <Fragment>
      <Header
        title={intl.get(`${intlPrefix}.view.title.timePredictionModel`).d('销售预测模板列表')}
      >
        <Button onClick={handleCreate}>新建模板</Button>
        <Button color="primary" onClick={handleSubmit}>
          提交
        </Button>
        <Button onClick={handleCancel}>取消</Button>
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
