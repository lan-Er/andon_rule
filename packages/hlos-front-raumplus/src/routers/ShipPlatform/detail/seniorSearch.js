import React from 'react';
import { Table, Switch, NumberField, Select } from 'choerodon-ui/pro';

const { Option } = Select;

// import { userSetting } from 'hlos-front/lib/services/api';

export default function SeniorSearch(props) {
  const columns = [
    {
      header: '序列',
      width: 70,
      lock: 'left',
      renderer: ({ record: { index } }) => index + 1,
    },
    {
      name: 'externalNum',
    },
    {
      name: 'soNum',
    },
    {
      name: 'soLineNum',
    },
    {
      name: 'itemCode',
    },
    {
      name: 'promiseShipDate',
      editor: true,
    },
    {
      name: 'demandQty',
    },
    {
      name: 'avaliableQty',
    },
    {
      name: 'applyQty',
      editor: (record, name) => <NumberField onChange={(e) => handleValue(e, record, name)} />,
    },
  ];

  const handleValue = (val, record, name) => {
    const result = record.get('demandQty') || 0;
    if (val <= result) {
      return;
    }
    record.set(name, null);
  };

  const tableProps = {
    dataSet: props.ds,
    columns,
    columnResizable: true,
    queryFieldsLimit: 4,
    queryFields: {
      completedFlag: <Switch />,
      productFlag: (
        <Select>
          <Option value="1">生产</Option>
          <Option value="0">非生产</Option>
        </Select>
      ),
    },
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <Table {...tableProps} />
    </div>
  );
}
