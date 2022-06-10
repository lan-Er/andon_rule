/**
 * @Description: 备件现有量List
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-06-04 13:45:47
 * @LastEditors: yu.na
 */

import React, { Fragment, useContext } from 'react';
import { Table, Lov, Select } from 'choerodon-ui/pro';
import intl from 'utils/intl';
import { Header, Content } from 'components/Page';

import Store from '@/stores/sparePartsOnhandDS';

const preCode = 'lisp.sparePartsOnhand';

export default () => {
  const { listDS } = useContext(Store);

  /**
   *table列
   * @returns
   */
  function columns() {
    return [
      { name: 'attribute1', width: 150, lock: true },
      { name: 'attribute2', width: 150, lock: true },
      { name: 'attribute4', width: 150, lock: true },
      { name: 'attribute6', width: 150, lock: true },
      { name: 'attribute7', width: 150 },
      { name: 'attribute8', width: 150 },
      { name: 'attribute9', width: 150 },
      { name: 'attribute10', width: 150 },
      { name: 'attribute11', width: 150 },
      { name: 'attribute12', width: 150 },
      { name: 'attribute13', width: 150 },
      { name: 'attribute14', width: 150 },
      { name: 'attribute15', width: 150 },
      { name: 'attribute16', width: 150 },
      { name: 'attribute17', width: 150 },
      { name: 'attribute18', width: 150 },
      { name: 'attribute19', width: 150 },
      { name: 'attribute20', width: 150 },
    ];
  }

  return (
    <Fragment>
      <Header title={intl.get(`${preCode}.view.title.sparePartsOnhand`).d('备件现有量')} />
      <Content>
        <Table
          dataSet={listDS}
          columns={columns()}
          border={false}
          columnResizable="true"
          editMode="inline"
          queryFieldsLimit={4}
          queryFields={{
            organizationObj: <Lov name="organizationObj" clearButton noCache />,
            sparePartsObj: <Lov name="sparePartsObj" clearButton noCache />,
            warehouseObj: <Lov name="warehouseObj" clearButton noCache />,
            wmAreaObj: <Lov name="wmAreaObj" clearButton noCache />,
            categoryObj: <Lov name="categoryObj" clearButton noCache />,
            resourceObj: <Lov name="resourceObj" clearButton noCache />,
            attribute11: <Select name="attribute11" />,
          }}
        />
      </Content>
    </Fragment>
  );
};
