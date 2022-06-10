/**
 * @Description: 备件监控
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-06-04 13:45:47
 * @LastEditors: yu.na
 */

import React, { Fragment } from 'react';
import { Table, DataSet } from 'choerodon-ui/pro';
import { Modal } from 'choerodon-ui';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { ListDS } from '@/stores/equipmentResumeDS';
import './style.less';

const dieResumeStore = () => new DataSet(ListDS());

const FilterModal = (props) => {
  const listDS = useDataSet(dieResumeStore, FilterModal);

  /**
   *table列
   * @returns
   */
  function columns() {
    return [{ name: 'attribute2' }, { name: 'attribute3' }];
  }

  function handleOK() {
    if (listDS.selected[0]) {
      listDS.query();
      props.onOk(listDS.selected[0].data);
    }
  }

  function handleCancel() {
    if (listDS.selected[0]) {
      listDS.query();
    }
    props.onCancel();
  }

  return (
    <Fragment>
      <Modal
        wrapClassName="isp-die-resume-filter-modal"
        title="筛选"
        visible={props.visible}
        onOk={handleOK}
        onCancel={handleCancel}
        width={692}
        closable
        destroyOnClose
      >
        <Table dataSet={listDS} columns={columns()} columnResizable="true" queryFieldsLimit={2} />
      </Modal>
    </Fragment>
  );
};

export default FilterModal;
