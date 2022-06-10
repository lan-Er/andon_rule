/*
 * @Author: 徐雨 <yu.xu02@hand-china.com>
 * @Date: 2021-07-02 16:36:59
 * @LastEditTime: 2021-07-06 12:42:08
 */
import React, { useEffect } from 'react';
import { Modal, Select, DataSet, Lov, TextField, Table, DatePicker } from 'choerodon-ui/pro';
import { useDataSet, useDataSetEvent } from 'hzero-front/lib/utils/hooks';

import { OtherQueryDS } from '@/stores/batchReportDS';
import TableQueryFrom from '@/components/TableQueryFrom';

const key = Modal.key();
const { Column } = Table;

export default function MoLovModal(props) {
  const tableDs = useDataSet(() => new DataSet(OtherQueryDS()), 'bathReportLoModal');
  const { dataSet, orgObj = {}, onChange } = props;

  useEffect(() => {
    localStorage.removeItem('moNum');
  }, []);

  const handleSelect = () => {
    const { selected } = tableDs;

    const _moNum = selected.map((item) => {
      return item.data.moNum;
    });
    const _moId = selected.map((item) => {
      return item.data.moId;
    });

    localStorage.setItem('moNum', _moNum);
    localStorage.setItem('moId', _moId);
  };

  useDataSetEvent(tableDs, 'select', handleSelect);
  useDataSetEvent(tableDs, 'unSelect', handleSelect);
  useDataSetEvent(tableDs, 'selectAll', handleSelect);
  useDataSetEvent(tableDs, 'unSelectAll', handleSelect);

  const handleClick = () => {
    Modal.open({
      key,
      title: 'MO',
      style: {
        width: '65%',
      },
      children: (
        <React.Fragment>
          <TableQueryFrom
            dataSet={tableDs.queryDataSet}
            showNumber={2}
            onClickQueryCallback={() => {
              tableDs.setQueryParameter('organizationId', orgObj.organizationId);
              tableDs.query();
            }}
          >
            <TextField name="moNum" />
            <Lov name="moTypeObj" />
            <Lov name="itemList" />
            <Select name="moStatus" />
            <DatePicker name="demandDateStart" />
            <DatePicker name="demandDateEnd" />
            <DatePicker name="releasedDateStart" />
            <DatePicker name="releasedDateEnd" />
          </TableQueryFrom>
          <Table dataSet={tableDs} queryBar="none">
            <Column name="moNum" width={140} />
            <Column name="itemCode" />
            <Column name="itemDescription" width={180} />
            <Column name="moStatusMeaning" width={80} />
            <Column name="demandQty" width={80} />
            <Column name="demandDate" width={150} />
            <Column name="releasedDate" width={150} />
          </Table>
        </React.Fragment>
      ),
      onOk: () => {
        const moId = localStorage.getItem('moId');
        dataSet.current.set('moIdList', moId.split(','));
        onChange();
      },
      closable: true,
    });
  };

  return (
    <Lov
      placeholder="请选择MO号"
      onClick={handleClick}
      {...props}
      value={localStorage.getItem('moNum')}
    />
  );
}
