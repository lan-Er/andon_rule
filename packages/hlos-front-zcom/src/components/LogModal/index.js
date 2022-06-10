/*
 * @Descripttion:日志弹框
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2021-05-04 15:04:29
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2021-05-04 16:53:38
 */

import React, { useState, useEffect } from 'react';
import { DataSet, Modal, Table, Button } from 'choerodon-ui/pro';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { logListDS } from './indexDS';
import styles from './index.less';

let selectModal;
const selectModalKey = Modal.key();
const LogListDS = () => new DataSet(logListDS());

export default ({ id = '', children }) => {
  const [visible, setVisible] = useState(false);

  const ListDS = useDataSet(() => LogListDS());
  useEffect(() => {
    if (visible) {
      handleSearch();
    }
  }, [visible]);

  async function handleSearch() {
    openModal();
    ListDS.setQueryParameter('operationOrderId', id);
    ListDS.query();
  }

  function handleCancel() {
    selectModal.close();
    setVisible(false);
  }

  const columns = [
    {
      name: 'operationUserName',
      width: 90,
    },
    { name: 'operationDate', width: 150 },
    { name: 'beforeStatusMeaning', width: 90 },
    { name: 'statusMeaning', width: 90 },
    { name: 'operationOpinion' },
  ];

  function openModal() {
    selectModal = Modal.open({
      title: '日志',
      key: selectModalKey,
      style: { width: 800 },
      children: <Table dataSet={ListDS} columns={columns} columnResizable="true" />,
      onOk: handleCancel,
      onCancel: handleCancel,
      maskClosable: true,
      className: styles['zcom-log-modal'],
    });
  }

  function handleClick() {
    setVisible(true);
  }

  return <div onClick={handleClick}>{children || <Button>日志</Button>}</div>;
};
