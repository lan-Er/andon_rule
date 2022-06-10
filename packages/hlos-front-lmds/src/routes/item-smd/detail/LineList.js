/**
 * @Description: SMD清单-LineList
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-12-08 10:53:29
 * @LastEditors: yu.na
 */
import React, { useMemo, Fragment } from 'react';
import { Table, Button, NumberField, Lov, Form } from 'choerodon-ui/pro';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import intl from 'utils/intl';

import styles from './index.less';

const LineList = ({ ds }) => {
  const columns = useMemo(() => {
    return [
      {
        name: 'smdLineNum',
        width: 70,
        lock: true,
      },
      {
        name: 'organizationObj',
        width: 128,
        lock: true,
      },
      {
        name: 'deviceItemObj',
        width: 128,
        lock: true,
        editor: true,
      },
      {
        name: 'deviceItemDescription',
        width: 200,
      },
      {
        name: 'loadSeat',
        width: 82,
        editor: true,
      },
      {
        name: 'deviceQty',
        width: 82,
        editor: true,
      },
      {
        name: 'pcbMountPosition',
        width: 200,
        editor: true,
      },
      {
        name: 'deviceSubstituteGroup',
        width: 82,
        editor: true,
      },
      {
        name: 'deviceSubstituteFlag',
        width: 82,
        editor: true,
      },
      {
        name: 'mouterPosition',
        width: 82,
        editor: true,
      },
      {
        name: 'mouterGroup',
        width: 82,
        editor: true,
      },
      {
        name: 'trolleyCategoryObj',
        width: 128,
        editor: true,
      },
      {
        name: 'feederCategoryObj',
        width: 128,
        editor: true,
      },
      {
        name: 'feederLayLength',
        width: 82,
        editor: true,
      },
      {
        name: 'warningQty',
        width: 128,
        editor: true,
      },
      {
        name: 'remark',
        width: 200,
        editor: true,
      },
      {
        name: 'externalLineId',
        width: 128,
        editor: true,
      },
      {
        name: 'externalLineNum',
        width: 128,
        editor: true,
      },
      {
        name: 'enabledFlag',
        width: 82,
        align: 'center',
        editor: true,
        renderer: yesOrNoRender,
      },
    ];
  }, []);

  function handleAddLine() {
    const { organizationObj } = ds.current.data;
    let params = {
      smdLineNum: ds.children.lineList.length + 1,
    };
    if (organizationObj && organizationObj.meOuId) {
      params = {
        ...params,
        organizationObj,
      };
    }
    ds.children.lineList.create(params, 0);
  }

  async function handleDelLine() {
    await ds.children.lineList.delete(ds.children.lineList.selected);
  }

  async function handleSearch() {
    await ds.children.lineList.query();
  }

  return (
    <Fragment>
      <div className={styles['query-area']}>
        <div className={styles.btn}>
          <Button onClick={handleAddLine}>{intl.get('hzero.common.button.add').d('新增')}</Button>
          <Button onClick={handleDelLine}>
            {intl.get('hzero.common.button.delete').d('删除')}
          </Button>
        </div>
        <div className={styles.form}>
          <Form dataSet={ds.children.lineList.queryDataSet} columns={2}>
            <Lov name="deviceItemObj" />
            <NumberField name="loadSeat" />
          </Form>
          <Button onClick={handleSearch}>{intl.get('hzero.common.button.search').d('查询')}</Button>
        </div>
      </div>
      <Table
        dataSet={ds.children.lineList}
        bordered="false"
        columns={columns}
        columnResizable="true"
        queryBar="none"
      />
    </Fragment>
  );
};

export default LineList;
