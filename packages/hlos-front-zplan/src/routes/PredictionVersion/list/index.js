/**
 * @Description: 预测版本列表
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-06-22 17:22:17
 */

import React, { Fragment, useEffect } from 'react';
import { DataSet, Button, Table } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import LogModal from '@/components/LogModal/index';
import { PredictionVersionListDS } from '../store/indexDS';
import styles from './index.less';

const intlPrefix = 'zplan.predictionVersion';
const predictionVersionListDS = () => new DataSet(PredictionVersionListDS());

function ZplanPredictionVersion({ dispatch, history, location }) {
  const ListDS = useDataSet(predictionVersionListDS);

  const { state = {} } = location;

  useEffect(() => {
    if (!state.saleTemplateNum) {
      ListDS.query();
    }
  }, []);

  useEffect(() => {
    if (state && state.saleTemplateNum) {
      ListDS.queryDataSet.create();
      ListDS.queryDataSet.current.set('saleTemplateNum', state.saleTemplateNum || '');
      ListDS.query();
    }
  }, [state]);

  function handleCreate() {
    const pathName = `/zplan/prediction-version/create`;
    history.push(pathName);
  }

  function handleCopy() {
    return new Promise((resolve) => {
      if (!ListDS.selected.length) {
        notification.warning({
          message: intl.get(`zplan.common.message.validation.select`).d('至少选择一条数据'),
        });
        resolve(false);
        return false;
      }
      let typeFlag = true;
      const arr = ListDS.selected.map((v) => {
        if (v.data.saleTemplateType !== 'MANUAL') {
          typeFlag = false;
        }
        return v.data;
      });
      if (!typeFlag) {
        notification.warning({
          message: intl
            .get(`zplan.common.message.validation.typeValidate`)
            .d('存在预测类型不是人工预测的数据，请检查后选择'),
        });
        resolve(false);
        return false;
      }
      dispatch({
        type: 'predictionVersion/copyVersion',
        payload: arr,
      }).then((res) => {
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

  function handleOperate(action) {
    return new Promise((resolve) => {
      if (!ListDS.selected.length) {
        notification.warning({
          message: intl.get(`zplan.common.message.validation.select`).d('至少选择一条数据'),
        });
        resolve(false);
        return false;
      }
      let statusFlag = true;
      let statusNotify = '';
      const arr = ListDS.selected.map((v) => {
        if (action === 'deleteVersion' && !['NEW'].includes(v.data.saleVersionStatus)) {
          statusFlag = false;
          statusNotify = '存在不是新建状态的预测版本';
        }
        if (
          action === 'CANCELLED' &&
          !['NEW', 'TOBECONF', 'REJECTED'].includes(v.data.saleVersionStatus)
        ) {
          statusFlag = false;
          statusNotify = '选中的订单中有无法取消的订单（已确认/已取消），请检查后选择';
        }
        if (action === 'TOBECONF' && !['NEW', 'REJECTED'].includes(v.data.saleVersionStatus)) {
          statusFlag = false;
          statusNotify = '存在不是新建或已退回状态的预测版本';
        }
        return {
          ...v.data,
          objectVersionNumber: v.data.psvObjectVersionNumber,
          saleVersionStatus: action === 'deleteVersion' ? v.data.saleVersionStatus : action,
        };
      });
      if (!statusFlag) {
        notification.warning({
          message: intl.get(`zplan.common.message.validation.statusValidate`).d(statusNotify),
        });
        resolve(false);
        return false;
      }
      dispatch({
        type: `predictionVersion/${action === 'deleteVersion' ? action : 'operateVersion'}`,
        payload: arr,
      }).then((res) => {
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

  function handleToTemplateDetail(record) {
    const { saleTemplateId, saleTemplateStatus } = record.toData();
    history.push({
      pathname: `/zplan/sale-prediction-task/detail/${saleTemplateId}`,
      state: {
        status: saleTemplateStatus,
      },
    });
  }

  function handleToDetail(record) {
    const { saleVersionId, saleTemplateType, saleVersionStatus } = record.toData();
    dispatch({
      type: 'predictionVersion/updateState',
      payload: {
        predictionType: saleTemplateType,
        versionStatus: saleVersionStatus,
      },
    });
    history.push({
      pathname: `/zplan/prediction-version/detail/${saleVersionId}`,
      state: {
        saleTemplateType,
        saleVersionStatus,
      },
    });
  }

  const columns = [
    {
      name: 'saleVersionNum',
      width: 150,
      lock: 'left',
      renderer: ({ record, value }) => <a onClick={() => handleToDetail(record)}>{value}</a>,
    },
    {
      name: 'saleTemplateNum',
      width: 150,
      renderer: ({ record, value }) => (
        <a onClick={() => handleToTemplateDetail(record)}>{value}</a>
      ),
    },
    { name: 'saleTemplateName', width: 150 },
    { name: 'saleTemplateType', width: 100 },
    { name: 'predictedName', width: 150 },
    {
      name: 'predictionStartDate',
      width: 120,
      renderer: ({ value }) => {
        return <span>{value ? value.substring(0, 10) : ''}</span>;
      },
    },
    {
      name: 'predictionEndDate',
      width: 120,
      renderer: ({ value }) => {
        return <span>{value ? value.substring(0, 10) : ''}</span>;
      },
    },
    { name: 'predictionGap', width: 140, minWidth: 140 },
    { name: 'saleVersionStatus', width: 90, lock: 'right' },
    {
      header: '日志',
      width: 80,
      lock: 'right',
      renderer: ({ record }) => {
        return (
          <LogModal id={record.get('saleVersionId')}>
            <a>日志</a>
          </LogModal>
        );
      },
    },
  ];

  return (
    <Fragment>
      <Header title={intl.get(`${intlPrefix}.view.title.predictionVersionList`).d('预测版本列表')}>
        <Button color="primary" onClick={handleCopy}>
          复制
        </Button>
        <Button onClick={handleCreate}>新建</Button>
        <Button onClick={() => handleOperate('TOBECONF')}>提交</Button>
        <Button onClick={() => handleOperate('CANCELLED')}>取消</Button>
        <Button onClick={() => handleOperate('deleteVersion')}>删除</Button>
      </Header>
      <Content className={styles['zplan-prediction-version-content']}>
        <Table dataSet={ListDS} columns={columns} queryFieldsLimit={3} columnResizable="true" />
      </Content>
    </Fragment>
  );
}

export default formatterCollections({
  code: [`${intlPrefix}`],
})(ZplanPredictionVersion);
