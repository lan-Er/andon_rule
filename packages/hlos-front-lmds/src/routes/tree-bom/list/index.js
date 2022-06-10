/**
 * @Description: 树状BOM
 * @Author: tw
 * @Date: 2021-03-16 16:00:00
 * @LastEditors: tw
 */

import React, { useState, useEffect } from 'react';
import { DataSet, Table, Lov, Form, Button, Tree } from 'choerodon-ui/pro';
import formatterCollections from 'utils/intl/formatterCollections';
import { getResponse } from 'utils/utils';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { Header, Content } from 'components/Page';
import { queryLovData } from 'hlos-front/lib/services/api';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import codeConfig from '@/common/codeConfig';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
// import { isEmpty } from 'lodash';
import styles from './index.less';

import BomHeadDS from '../stores/BomHeadDS';
import BomLineDS from '../stores/BomLineDS';
import TreeDS from '../stores/TreeDS';

const preCode = 'lmds.treeBom.model';
const { common } = codeConfig.code;
// const { TreeNode } = Tree;

function TreeBom() {
  const tableDS = useDataSet(() => new DataSet(BomHeadDS()), TreeBom);
  const lineDS = useDataSet(() => new DataSet(BomLineDS()));
  const treeDS = useDataSet(() => new DataSet(TreeDS()));

  const [showLine, setShowLine] = useState(false);
  const [defaultExpandAll, setDefaultExpandAll] = useState(false);

  useEffect(() => {
    defaultLovSetting();
  }, []);

  /**
   *设置默认查询条件
   *
   */
  async function defaultLovSetting() {
    const res = await queryLovData({ lovCode: common.organization, defaultFlag: 'Y' });
    if (getResponse(res)) {
      if (res.content[0]) {
        tableDS.queryDataSet.current.set('organizationObj', {
          meOuId: res.content[0].organizationId,
          organizationName: res.content[0].organizationName,
        });
      }
    }
  }

  function columnsHead() {
    return [
      { name: 'organizationName', width: 128, lock: true },
      {
        name: 'itemCode',
        width: 200,
        lock: true,
        renderer: ({ record }) => (
          <span>
            {record.get('itemCode')} {record.get('itemDescription')}
          </span>
        ),
      },
      { name: 'categoryName', width: 144 },
      {
        name: 'bomCode',
        width: 144,
        align: 'center',
        renderer: ({ record }) => (
          <span>
            {record.get('bomCode')} {record.get('bomDescription')}
          </span>
        ),
      },
      { name: 'bomVersion', width: 82 },
      {
        name: 'primaryFlag',
        width: 82,
        renderer: yesOrNoRender,
      },
      { name: 'startDate', width: 100, align: 'center' },
      { name: 'endDate', width: 100, align: 'center' },
    ];
  }

  function columnsLine() {
    return [
      { name: 'bomLineNum', width: 70, lock: true },
      { name: 'organizationName', width: 128, lock: true },
      {
        name: 'componentItemCode',
        width: 200,
        lock: true,
        renderer: ({ record }) => (
          <span>
            {record.get('componentItemCode')} {record.get('componentItemDescription')}
          </span>
        ),
      },
      {
        name: 'bomUsage',
        width: 84,
        align: 'center',
        renderer: ({ record }) => (
          <span>
            {record.get('bomUsage')} {record.get('uomName')}
          </span>
        ),
      },
      { name: 'componentShrinkage', width: 82 },
      { name: 'operation', width: 82 },
      { name: 'makeBuyCodeMeaning', width: 82 },
      { name: 'supplyTypeMeaning', width: 82 },
      {
        name: 'wmSite',
        width: 200,
        renderer: ({ record }) => (
          <span>
            {record.get('supplyWarehouseName')} {record.get('supplyWmAreaName')}
          </span>
        ),
      },
      { name: 'ecnNum', width: 128 },
      {
        name: 'substitute',
        width: 200,
        renderer: ({ record }) => (
          <span>
            {record.get('substitutePolicyMeaning')} {record.get('substituteGroup')}{' '}
            {record.get('substitutePriority')} {record.get('substitutePercent')}
          </span>
        ),
      },
      { name: 'remark', width: 200 },
      { name: 'startDate', width: 100, align: 'center' },
      { name: 'endDate', width: 100, align: 'center' },
    ];
  }

  /**
   * 头表点击事件
   * @param record
   */
  function handleClick({ record }) {
    // 显示行表
    return {
      onClick: () => {
        setShowLine(true);
        setDefaultExpandAll(false);
        lineDS.queryParameter = { bomId: record.data.bomId };
        lineDS.query();
        treeDS.queryParameter = { itemBomId: record.data.itemBomId };
        treeDS.query();
      },
    };
  }

  /**
   *重置
   *
   */
  function handleReset() {
    tableDS.queryDataSet.current.reset();
  }

  /**
   *查询
   *
   * @returns
   */
  async function handleSearch() {
    const validateValue = await tableDS.validate(false, false);
    if (!validateValue) {
      return;
    }
    if (
      !tableDS.queryDataSet.current.get('itemObj') &&
      !tableDS.queryDataSet.current.get('categoryObj')
    ) {
      notification.warning({
        message: '请输入物料或物料类别查询条件！',
      });
      return;
    }
    await tableDS.query();
    setShowLine(false);
    lineDS.data = [];
    treeDS.data = [];
  }

  function nodeRenderer({ record }) {
    // const data = treeDS.toData()
    return <span onClick={() => onClick(record)}>{record.get('itemCodeAndDescription')}</span>;
    // const data = record.toData();
    // if(!isEmpty(data)){
    //   const returnData = data.itemCodeAndDescription;
    //   if (data.chridlenList.length > 0) {
    //     return (
    //       <TreeNode title={returnData}>
    //         {treeNodeRenderer(data)}
    //       </TreeNode>
    //     );
    //   }
    //   return <TreeNode title={returnData} />;
    // }
    // return null;
  }

  // function treeNodeRenderer(data) {
  //   return data && data.chridlenList.map((item) => {
  //     const returnData = item.itemCodeAndDescription;
  //     if (item.chridlenList.length > 0) {
  //       return (
  //         <TreeNode title={returnData}>
  //           {treeNodeRenderer(item)}
  //         </TreeNode>
  //       );
  //     }
  //     return <TreeNode title={returnData} />;
  //   });
  // }

  function onClick(record) {
    lineDS.queryParameter = { bomId: record.data.bomId };
    lineDS.query();
  }

  // 全部展开
  function handleExpandAll() {
    if (!defaultExpandAll) {
      setDefaultExpandAll(true);
    }
    treeDS.data = [];
    treeDS.query();
  }

  // 全部收起
  function handleUnExpandAll() {
    if (defaultExpandAll) {
      setDefaultExpandAll(false);
    }
    treeDS.data = [];
    treeDS.query();
  }

  return (
    <React.Fragment>
      <Header title={intl.get(`${preCode}.view.title.treeBom`).d('树状BOM')} />
      <Content>
        <div className={styles['lmds-tree-from']}>
          <Form dataSet={tableDS.queryDataSet} columns={3}>
            <Lov name="organizationObj" clearButton noCache />
            <Lov name="itemObj" clearButton noCache />
            <Lov name="categoryObj" clearButton noCache />
          </Form>
          <div style={{ display: 'inline-flex', paddingTop: '11px', paddingLeft: '10px' }}>
            <Button onClick={handleReset}>{intl.get('hzero.common.button.reset').d('重置')}</Button>
            <Button color="primary" onClick={handleSearch}>
              {intl.get('hzero.common.button.search').d('查询')}
            </Button>
          </div>
        </div>
        <div className={styles['tree-content']}>
          <div className={styles['lmds-tree-bom']}>
            {showLine && (
              <div>
                <Button onClick={handleExpandAll}>
                  {intl.get('lmds.common.button.expandAll').d('全部展开')}
                </Button>
                <Button onClick={handleUnExpandAll}>
                  {intl.get('hzero.common.button.unExpandAll').d('全部收起')}
                </Button>
                <Tree
                  dataSet={treeDS}
                  checkable={false}
                  defaultExpandAll={defaultExpandAll}
                  showIcon
                  selectable={false}
                  renderer={nodeRenderer}
                />
              </div>
            )}
          </div>
          <div className={styles.line} />
          <div className={styles['lmds-tree-table']}>
            <Table
              dataSet={tableDS}
              columns={columnsHead()}
              columnResizable="true"
              queryFieldsLimit={3}
              queryBar="none"
              onRow={(record) => handleClick(record)}
              pagination={{
                onChange: () => setShowLine(false),
              }}
              editMode="inline"
            />
            {showLine && (
              <Table
                dataSet={lineDS}
                columns={columnsLine()}
                columnResizable="true"
                editMode="inline"
              />
            )}
          </div>
        </div>
      </Content>
    </React.Fragment>
  );
}

export default formatterCollections({
  code: [`${preCode}`],
})(() => {
  return <TreeBom />;
});
