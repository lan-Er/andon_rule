/*
 * @Description: 项目新增Model
 * @Author: jianjun.tan, <jianjun.tan@hand-china.com>
 * @Date: 2020-06-09 15:58:31
 * @LastEditors: jianjun.tan
 * @LastEditTime: 2020-06-09 16:12:01
 * @Copyright: Copyright (c) 2018, Hand
 */

import React from 'react';
import { Table, Tooltip, Button, TextField, CheckBox } from 'choerodon-ui/pro';
import { Modal } from 'choerodon-ui';
import intl from 'utils/intl';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';

const ProjectPage = (props) => {
  function getProjectColumns() {
    return [
      {
        name: 'projectCode',
        width: 100,
        editor: true,
      },
      {
        name: 'projectName',
        width: 150,
        editor: true,
      },
      {
        name: 'domainUrl',
        width: 250,
        editor: true,
      },
      {
        name: 'userName',
        width: 100,
        editor: (record) => (record.editing ? <TextField /> : null),
      },
      {
        name: 'password',
        width: 150,
        editor: (record) => (record.editing ? <TextField /> : null),
        renderer: () => <span>*******</span>,
      },
      {
        name: 'enabledFlag',
        editor: (record) => (record.editing ? <CheckBox /> : false),
        align: 'center',
        width: 100,
        renderer: yesOrNoRender,
      },
      {
        header: intl.get('hzero.common.button.action').d('操作'),
        width: 100,
        command: ({ record }) => {
          return [
            'edit',
            <Tooltip
              key="delete"
              placement="bottom"
              title={intl.get('hzero.common.button.delete').d('删除')}
            >
              <Button
                icon="delete"
                color="primary"
                funcType="flat"
                onClick={() => handleDeleteProject(record)}
              />
            </Tooltip>,
          ];
        },
        lock: 'right',
      },
    ];
  }

  /**
   * 取消
   */
  function handleClearOk() {
    props.onModea(false);
  }

  const { visible, dataSet, title } = props;

  /**
   * 项目对应项目列表
   * @param {object} roject 项目
   */
  const handleDeleteProject = async (roject) => {
    dataSet.delete(roject);
  };

  return (
    <Modal.Sidebar
      key="project"
      title={title}
      visible={visible}
      onOk={handleClearOk}
      onCancel={handleClearOk}
      footer={null}
      width={1000}
      closable
      destroyOnClose
    >
      <Table
        selectionMode="click"
        key="project"
        dataSet={dataSet}
        columns={getProjectColumns()}
        columnResizable="true"
        editMode="inline"
        buttons={['add']}
      />
    </Modal.Sidebar>
  );
};

export default ProjectPage;
