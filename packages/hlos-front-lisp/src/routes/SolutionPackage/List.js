/**
 * @Description: 方案包基础数据
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-05-28 16:36:54
 * @LastEditors: yu.na
 */

import React, { Fragment, useContext, useState } from 'react';
import { Table, Button } from 'choerodon-ui/pro';
import intl from 'utils/intl';
import { Header, Content } from 'components/Page';

import Store from '@/stores/solutionPackageDS';
import { initialApi } from '@/services/api';

const preCode = 'lisp.solutionPackage';

export default () => {
  const { listDS } = useContext(Store);
  const [loading, setLoading] = useState(false);

  /**
   *table列
   * @returns
   */
  function columns() {
    return [
      { name: 'user', width: 150, lock: true },
      { name: 'functionType', width: 150, lock: true },
      { name: 'dataType', width: 150, lock: true },
      { name: 'attribute1', width: 150 },
      { name: 'attribute2', width: 150 },
      { name: 'attribute3', width: 150 },
      { name: 'attribute4', width: 150 },
      { name: 'attribute5', width: 150 },
      { name: 'attribute6', width: 150 },
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
      { name: 'attribute21', width: 150 },
      { name: 'attribute22', width: 150 },
      { name: 'attribute23', width: 150 },
      { name: 'attribute24', width: 150 },
      { name: 'attribute25', width: 150 },
      { name: 'attribute26', width: 150 },
      { name: 'attribute27', width: 150 },
      { name: 'attribute28', width: 150 },
      { name: 'attribute29', width: 150 },
      { name: 'attribute30', width: 150 },
      { name: 'attribute31', width: 150 },
      { name: 'attribute32', width: 150 },
      { name: 'attribute33', width: 150 },
      { name: 'attribute34', width: 150 },
      { name: 'attribute35', width: 150 },
      { name: 'attribute36', width: 150 },
      { name: 'attribute37', width: 150 },
      { name: 'attribute38', width: 150 },
      { name: 'attribute39', width: 150 },
      { name: 'attribute40', width: 150 },
      { name: 'attribute41', width: 150 },
      { name: 'attribute42', width: 150 },
      { name: 'attribute43', width: 150 },
      { name: 'attribute44', width: 150 },
      { name: 'attribute45', width: 150 },
      { name: 'attribute46', width: 150 },
      { name: 'attribute47', width: 150 },
      { name: 'attribute48', width: 150 },
      { name: 'attribute49', width: 150 },
      { name: 'attribute50', width: 150 },
    ];
  }

  function handleInitial() {
    setLoading(true);
    initialApi().then((res) => {
      if (res) {
        setLoading(false);
      }
    });
  }

  return (
    <Fragment>
      <Header title={intl.get(`${preCode}.view.title.solutionPackage`).d('方案包数据列表')}>
        <Button onClick={handleInitial} loading={loading}>
          {intl.get('hpfm.flexModel.view.button.init').d('初始化')}
        </Button>
      </Header>
      <Content>
        <Table
          dataSet={listDS}
          columns={columns()}
          border={false}
          columnResizable="true"
          editMode="inline"
        />
      </Content>
    </Fragment>
  );
};
