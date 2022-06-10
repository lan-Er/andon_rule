/*
 * @Descripttion: 异常处理订单列表页
 * @version: 1.0.0
 * @Author: mingbo.zhang@hand-china.com
 * @Date: 2021-04-07 15:04:45
 * @LastEditors: mingbo.zhang@hand-china.com
 * @LastEditTime: 2021-04-12 16:28:28
 */
import React, { Fragment, useEffect } from 'react';
import { Header, Content } from 'components/Page';
import { Button, Table, DataSet } from 'choerodon-ui/pro';
import notification from 'utils/notification';
import { userSetting } from 'hlos-front/lib/services/api';
import { ListDS } from './listDS.js';

const listDS = new DataSet(ListDS());

function ExceptionOrder(props) {
  useEffect(() => {
    async function queryDefaultOrg() {
      listDS.queryDataSet.create({});
      const res = await userSetting({ defaultFlag: 'Y' });
      if (res && res.content && res.content[0]) {
        const { meOuId, meOuCode, meOuName } = res.content[0];
        listDS.queryDataSet.current.set('organizationObj', {
          organizationId: meOuId,
          organizationCode: meOuCode,
          organizationName: meOuName,
        });
      }
    }
    queryDefaultOrg();
  }, []);

  const getColumns = () => {
    return [
      {
        name: 'organizationName',
        width: 128,
        tooltip: 'overflow',
      },
      {
        name: 'invAbnormalNum',
        width: 128,
        tooltip: 'overflow',
      },
      {
        name: 'processCardTypeMeaning',
        width: 128,
        tooltip: 'overflow',
      },
      {
        name: 'exceptiomHandler',
        width: 128,
        tooltip: 'overflow',
      },
      {
        name: 'findTime',
        width: 128,
        tooltip: 'overflow',
      },
      {
        name: 'foundDepartmentName',
        width: 128,
        tooltip: 'overflow',
      },
      {
        name: 'problemLevelMeaning',
        width: 128,
        tooltip: 'overflow',
      },
      {
        name: 'discoverProcess',
        width: 128,
        tooltip: 'overflow',
      },
    ];
  };

  const handleRow = (record) => {
    return {
      onClick: () => {
        // props.history.push({
        //   pathname: `/raumplus/exception-handle-order/detail/${record.get('invAbnormalId')}`
        // });
        const pathname = `/raumplus/exception-handle-order/detail/${record.get('invAbnormalId')}`;
        props.history.push({
          pathname,
          state: {
            invAbnormalId: record.get('invAbnormalId'),
          },
        });
      },
    };
  };

  const handleCreate = () => {
    props.history.push({
      pathname: `/raumplus/exception-handle-order/detail`,
      state: {},
    });
  };

  // 提交
  // const handleSubmit = ()=>{
  //   console.log('handleSubmit');
  // };

  // 删除
  const handleDelete = async () => {
    const { selected } = listDS;
    // const validateValue = await listDS.validate(true, false);
    // if (!validateValue) {
    //   notification.warning({
    //     message: '您有必输项没有输入，或者输入有误，请输入必输项或者修改有误信息后重新提交',
    //   });
    //   return;
    // }
    if (!selected[0]) {
      return notification.warning({ message: '请勾选需要删除的数据！' });
    }
    try {
      if (selected && selected.length > 0) {
        const res = await listDS.delete(selected);
        console.log('res', res);
        if (!res || !res.failed) {
          listDS.query();
        }
      }
    } catch (err) {
      console.log('err', err);
    }
  };

  // 取消
  // const handleCancel = ()=>{
  //   console.log('handleCancel');
  // };

  // 关闭
  // const handleClose = ()=>{
  //   console.log('handleClose');
  // };

  return (
    <Fragment>
      <Header title="异常处理订单">
        <Button color="primary" icon="add" onClick={handleCreate}>
          新增
        </Button>
        {/* <Button onClick={handleClose}>关闭</Button> */}
        {/* <Button onClick={handleCancel}>取消</Button> */}
        <Button onClick={handleDelete}>删除</Button>
        {/* <Button onClick={handleSubmit}>提交</Button> */}
      </Header>
      <Content>
        <Table
          dataSet={listDS}
          columns={getColumns()}
          queryFieldsLimit={4}
          columnResizable="true"
          editMode="inline"
          onRow={({ record }) => handleRow(record)}
        />
      </Content>
    </Fragment>
  );
}
export default ExceptionOrder;
