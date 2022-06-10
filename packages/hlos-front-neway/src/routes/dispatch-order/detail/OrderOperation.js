/*
 * @Author: zhang yang
 * @Description: 检验项目组-行表详情
 * @E-mail: yang.zhang14@hand-china.com
 * @Date: 2019-11-25 17:18:36
 */
import React, { PureComponent, Fragment } from 'react';
import { Table, Button, Tooltip, Modal, DataSet } from 'choerodon-ui/pro';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import notification from 'utils/notification';

import { assignModalDS } from '@/stores/dispatchOrderDs';
import AssignModal from './AssignModal';
import { saveLine } from '@/services/dispatchOrderService';

const preCode = 'neway.dispatchOrder';
let modalObj;

export default class OrderOperation extends PureComponent {
  modalDs = new DataSet({
    ...assignModalDS(),
  });

  @Bind()
  async handleAssign(record) {
    const validateLine = await this.props.detailDs.children.taskList.validate(false, false);
    if (!validateLine) {
      return;
    }
    this.modalDs.setQueryParameter('operation', record.get('operation'));
    this.modalDs.setQueryParameter('documentId', this.props.detailDs.current.get('moId'));
    await this.modalDs.query();
    modalObj = Modal.open({
      key: Modal.key(),
      closable: true,
      destroyOnClose: true,
      footer: null,
      title: intl.get(`${preCode}.view.title.operationAssign`).d('工序分配'),
      children: (
        <AssignModal modalDs={this.modalDs} handleSaveLine={() => this.handleSaveLine(record)} />
      ),
    });
  }

  get columns() {
    const { valueIncludeMoType } = this.props;
    return [
      {
        name: 'operationObj',
        editor: (record) => record?.status === 'add',
        width: 150,
      },
      {
        name: 'standardWorkTime',
        editor: () => valueIncludeMoType,
        width: 120,
      },
      {
        header: intl.get('hzero.common.button.action').d('操作'),
        width: 90,
        command: ({ record }) => {
          return [
            record?.status === 'add' && !valueIncludeMoType ? (
              <>
                <Tooltip
                  placement="bottom"
                  title={intl.get('hzero.common.button.cancel').d('取消')}
                >
                  <Button
                    icon="cancle_a"
                    color="primary"
                    funcType="flat"
                    onClick={() => this.removeData(record)}
                  />
                </Tooltip>
                <Button color="primary" funcType="flat" onClick={() => this.handleAssign(record)}>
                  {intl.get('hzero.common.button.assign').d('分配')}
                </Button>
              </>
            ) : (
              <Button color="primary" funcType="flat" onClick={() => this.handleAssign(record)}>
                {intl.get('hzero.common.button.assign').d('分配')}
              </Button>
            ),
          ];
        },
        lock: 'right',
      },
    ];
  }

  /**
   * 取消当前对象操作
   * @param {json} record 当前对象
   */
  @Bind()
  removeData(record) {
    const { taskList } = this.props.detailDs.children;
    if (record.toData().lineId) {
      taskList.current.reset();
    } else {
      taskList.remove(record);
    }
  }

  /**
   * 保存行
   * @param {*} record 工序行
   */
  @Bind()
  async handleSaveLine(record) {
    const { detailDs } = this.props;
    const validateModal = await this.modalDs.validate(false, false);
    if (!validateModal) {
      return;
    }
    const newList = this.modalDs.map((item) => {
      if (item.status === 'add') {
        return {
          ...record.toJSONData(),
          ...item.toJSONData(),
          taskNum: null,
          taskId: null,
        };
      }
      return {
        ...record.toJSONData(),
        ...item.toJSONData(),
      };
    });

    const data = {
      ...detailDs.current.toJSONData(),
      assignList: null,
      taskList: newList,
    };
    const res = await saveLine(data);
    if (res && res.failed && res.message) {
      notification.error({
        message: res.message,
      });
      return;
    }
    notification.success({
      message: intl.get('hzero.common.notification.success').d('操作成功'),
    });
    modalObj.close();
    await detailDs.query();
  }

  render() {
    const { detailDs, valueIncludeMoType } = this.props;
    const { taskList } = detailDs.children;
    // const buttons = [!valueIncludeMoType ? ['add'] : []];
    const buttons = [['add', { disabled: valueIncludeMoType }]];
    const tableProps = {
      buttons,
      columns: this.columns,
      dataSet: taskList,
    };
    return (
      <Fragment>
        <Table {...tableProps} />
      </Fragment>
    );
  }
}
