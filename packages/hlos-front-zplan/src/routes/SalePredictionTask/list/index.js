/**
 * @Description: 预测任务列表
 * @Author: qifeng.deng@hand.com
 * @Date: 2021-07-07 13:56:51
 */

import React, { useEffect, Fragment } from 'react';
import { DataSet, Button, Table } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import notification from 'utils/notification';
import { listDS } from '../store/indexDS';
// import { listDS, saleItemRelDS, entityItemRelDS } from '../store/indexDS';
import styles from './index.less';
// 引入日志组件
import LogModal from '@/components/LogModal/index';

const intlPrefix = 'zplan.saleTemlate';
const ListDS = new DataSet(listDS());
// const SaleItemRelDS = new DataSet(saleItemRelDS());
// const EntityItemRelDS = new DataSet(entityItemRelDS());
function ZplanSaleTemplate({ history, dispatch }) {
  useEffect(() => {
    ListDS.query();
  }, []);

  function handleToDetail(id, status) {
    // 路径传参
    history.push({
      pathname: `/zplan/sale-prediction-task/detail/${id}`,
      // 类似params传参
      state: {
        status,
      },
    });
  }

  function handleToVersion(saleTemplateNum) {
    // state传参相当于vue的params传参
    history.push({
      pathname: `/zplan/prediction-version/list`,
      state: { saleTemplateNum },
    });
  }
  function handleCreate() {
    history.push({
      // create为传过去的占位参数
      pathname: `/zplan/sale-prediction-task/create`,
    });
  }

  let gobreak; // 已提示警告退出的标识符
  function handleSubmit() {
    if (!validateData('NEW')) {
      if (gobreak) {
        return;
      }
      notification.warning({
        message: '选中的预测模板有无法提交的预测模板（运行中/已取消），请检查后选择！',
      });
      return;
    }
    return new Promise((resolve) => {
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
    // 判断物料和销售实体是否都有的标识符
  }

  function handleCancel() {
    if (!validateData('RUNNING')) {
      if (gobreak) {
        return;
      }
      notification.warning({
        message: '选中的预测模板有无法取消的预测模板（新建/已取消），请检查后选择！',
      });
      return;
    }

    return new Promise((resolve) => {
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

  function handleDelete() {
    if (!validateData('NEW')) {
      if (gobreak) {
        return;
      }
      notification.warning({
        message: '选中的预测模板有无法删除的预测模板（运行中/已取消），请检查后选择！',
      });
      return;
    }
    // console.log("新建的啦");
    return new Promise((resolve) => {
      dispatch({
        type: `saleTemplateModel/deletePredictionTask`,
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

  // 根据传入的状态进行校验的方法
  function validateData(status) {
    // 首先将标识符置为true
    let validateFlag = true;
    gobreak = false;
    // 如果未选择
    if (!ListDS.selected.length) {
      notification.warning({
        message: intl.get(`hzero.common.message.validation.atLeast`).d('请至少选择一条数据'),
      });
      gobreak = true;
      return;
    }
    // 定义一个params接受数组 对DS中已选的数组数据进行map操作
    const params = ListDS.selected.map((item) => {
      // 如果数组中有非传入的状态则将标识符置反
      if (![status].includes(item.data.saleTemplateStatus)) {
        validateFlag = false;
      }
      // 对数组进行相关操作,添加上RUNNING状态
      return {
        ...item.data,
        saleTemplateStatus: 'RUNNING',
      };
    });
    // 如果数组中有非传入的状态则返回false
    if (!validateFlag) {
      return false;
    }
    // 将map处理后的数组返回
    return params;
  }

  // 列展示的内容 通过name与DS来关联,renderer进行相关的遍历读取数据进行填写
  const columns = [
    {
      name: 'saleTemplateNum',
      width: 150,
      // 这里record表示的是哪一个行?value又是对应的啥,是对应name(saleTemplateNum)吗?
      renderer: ({ record, value }) => {
        const id = record.get('saleTemplateId');
        const status = record.get('saleTemplateStatus');
        return <a onClick={() => handleToDetail(id, status)}>{value}</a>;
      },
      lock: 'left',
      align: 'center',
    },
    {
      name: 'saleTemplateName',
      width: 150,
      editor: (record) => !record.get('saleTemplateId'),
      align: 'center',
    },
    {
      name: 'saleTemplateType',
      editor: (record) => !record.get('saleTemplateId'),
      align: 'center',
    },
    {
      name: 'predictedName',
      editor: (record) => !record.get('saleTemplateId'),
      align: 'center', // 对齐方式
    },
    {
      name: 'predictionStartDate',
      width: 100,
      editor: (record) => !record.get('saleTemplateId'),
      align: 'center',
    },
    {
      header: '预测版本',
      width: 100,
      // 必须写{ record }
      renderer: ({ record }) => {
        const saleTemplateNum = record.get('saleTemplateNum');
        return <a onClick={() => handleToVersion(saleTemplateNum)}>查看</a>;
      },
      align: 'center',
    },
    {
      name: 'saleTemplateStatus',
      align: 'center',
      width: 90,
    },
    {
      header: '日志',
      width: 80,
      align: 'center',
      renderer: ({ record }) => {
        return (
          <LogModal id={record.get('saleTemplateId')}>
            <a>日志</a>
          </LogModal>
        );
      },
      lock: 'right',
    },
  ];

  // 主要的html文档结构
  // fragement内联页面  Header Content是引入的公共组件
  // intl是做多语言开发的(先只拿来用)
  // Button Table DataSet是引入的猪齿鱼UI库
  return (
    <Fragment>
      <Header title={intl.get(`${intlPrefix}.view.title.prodictionTaskList`).d('预测任务列表')}>
        <Button color="primary" onClick={handleCreate}>
          新建任务
        </Button>
        <Button onClick={handleSubmit}>提交</Button>
        <Button onClick={handleCancel}>终止</Button>
        <Button onClick={handleDelete}>删除</Button>
      </Header>
      <Content className={styles['zplan-sales-template-list']}>
        <Table dataSet={ListDS} columns={columns} />
      </Content>
    </Fragment>
  );
}

export default formatterCollections({
  code: [`${intlPrefix}`],
})((props) => {
  return <ZplanSaleTemplate {...props} />;
});
