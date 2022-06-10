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
// import { getCurrentOrganizationId } from 'utils/utils';
// import LogModal from '@/components/LogModal/index';
import { listDS } from '../store/indexDS';

const intlPrefix = 'zplan.timePredictionModel';
const ListDS = new DataSet(listDS());

function ZplanTimePredictionModel({ history, dispatch }) {
  useEffect(() => {
    ListDS.query();
  }, []);

  function handleToDetail(id) {
    history.push({
      pathname: `/zplan/sale-result/detail/${id}`,
    });
  }

  function handleToTemplateDetail(id) {
    history.push({
      pathname: `/zplan/sale-template/detail/${id}`,
    });
  }

  const columns = [
    {
      name: 'saleResultNum',
      // width: 150,
      renderer: ({ record, value }) => {
        const id = record.get('saleResultId');
        return <a onClick={() => handleToDetail(id)}>{value}</a>;
      },
      lock: 'left',
    },
    {
      name: 'salesEntityName',
      // width: 150,
    },
    {
      name: 'lifecycleUom',
      // width: 90,
    },
    {
      name: 'predictionStartDate',
      // width: 120,
    },
    {
      name: 'predictionEndDate',
      // width: 120,
      align: 'left',
    },
    {
      name: 'saleTemplateNum',
      // width: 160,
      renderer: ({ record, value }) => {
        const id = record.get('saleTemplateId');
        return <a onClick={() => handleToTemplateDetail(id)}>{value}</a>;
      },
    },
    // {
    //   header: '日志',
    //   width: 90,
    //   renderer: ({ record }) => {
    //     return (
    //       <LogModal id={record.get('saleTemplateId')}>
    //         <a>日志</a>
    //       </LogModal>
    //     );
    //   },
    // },
    {
      name: 'saleResultStatus',
      lock: 'right',
      // width: 90,
    },
  ];

  function handleDelete() {
    if (!validateData(['CANCELLED'])) {
      notification.warning({
        message: '选中的预测单有无法删除的预测单（已确认/待确认），请检查后选择！',
      });
      return;
    }
    ListDS.delete(ListDS.selected);
  }

  function handleCancel() {
    if (!validateData(['NEW'])) {
      notification.warning({
        message: '选中的预测单有无法取消的预测单（已确认/已取消），请检查后选择！',
      });
      return;
    }

    return new Promise(async (resolve) => {
      dispatch({
        type: `saleResultModel/cancelResults`,
        payload: ListDS.selected.map((i) => ({ ...i.toData() })),
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

  function handleConfirm() {
    if (!validateData(['NEW'])) {
      notification.warning({
        message: '选中的预测单有无法确认的预测单（运行中/已取消），请检查后选择！',
      });
      return;
    }

    return new Promise(async (resolve) => {
      dispatch({
        type: `saleResultModel/saleResults`,
        payload: ListDS.selected.map((i) => ({ ...i.toData(), saleResultStatus: 'CONFIRMED' })),
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
      return false;
    }
    const params = ListDS.selected.map((item) => {
      if (!status.includes(item.data.saleResultStatus)) {
        validateFlag = false;
      }
      return {
        ...item.data,
        saleResultStatus: 'CONFIRMED',
      };
    });

    if (!validateFlag) {
      return false;
    }
    return params;
  }

  return (
    <Fragment>
      <Header
        title={intl.get(`${intlPrefix}.view.title.timePredictionModel`).d('销售预测结果列表')}
      >
        <Button onClick={handleConfirm} color="primary">
          确认
        </Button>
        <Button onClick={handleCancel}>取消</Button>
        <Button onClick={handleDelete}>删除</Button>
      </Header>
      <Content>
        <Table dataSet={ListDS} columns={columns} editMode="inline" rowHeight="auto" />
      </Content>
    </Fragment>
  );
}

export default formatterCollections({
  code: [`${intlPrefix}`],
})((props) => {
  return <ZplanTimePredictionModel {...props} />;
});
