/*
 * @Description: 图纸总览
 * @Author: liangkun, <kun.liang01@hand-china.com>
 * @Date: 2020-06-03 15:58:31
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-06-19 10:13:19
 * @Copyright: Copyright (c) 2018, Hand
 */

import React, { Fragment, useState, useEffect } from 'react';
import { Table, Button, DataSet } from 'choerodon-ui/pro';
import intl from 'utils/intl';
import { isEmpty } from 'lodash';
import { Header, Content } from 'components/Page';
import { useDataSet } from 'hzero-front/lib/utils/hooks';

import { getSerialNum } from '@/utils/renderer';
import { headDS, lineDS } from '@/stores/drawingPlatformDS';

const preCode = 'lisp.solutionPackage';

const DrawingPlatformListPage = (props) => {
  const todoHeadDataSetFactory = () =>
    new DataSet({
      ...headDS(),
      events: {
        load: ({ dataSet }) => {
          dataSet.setQueryParameter('headId', '');
          setRefresh(!refresh);
        },
      },
    });
  const todoLineDataSetFactory = () => new DataSet(lineDS());
  const HeadDS = useDataSet(todoHeadDataSetFactory, DrawingPlatformListPage);
  const lineListDS = useDataSet(todoLineDataSetFactory);

  const [refresh, setRefresh] = useState(false);

  const { headId } = HeadDS.queryParameter;

  useEffect(() => {
    if (!isEmpty(headId)) {
      lineListDS.setQueryParameter('attribute1', headId);
      lineListDS.query();
    }
  }, [headId]);

  /**
   * 跳转编辑详情界面
   * @param {*} id 行id
   */
  function handleToEditPage(dataId) {
    const pathName = `/lisp/drawing-platform/detail/${dataId}`;
    props.history.push(pathName);
  }

  /**
   * 跳转历史界面
   * @param {*} record 行记录
   */
  function handleToHistoryPage(record) {
    const pathName = `/lisp/drawing-platform/history/${headId}/${record.get('attribute2')}`;
    props.history.push(pathName);
  }

  /**
   *table列
   * @returns
   */
  function columns() {
    return [
      { name: 'attribute1', width: 150, lock: 'left' },
      {
        name: 'attribute2',
        width: 150,
        renderer: ({ record, value }) => (
          <a onClick={() => handleToEditPage(record.get('dataId'))}>{value}</a>
        ),
        lock: 'left',
        tooltip: 'overflow',
      },
      { name: 'attribute3', width: 150, tooltip: 'overflow' },
      { name: 'attribute4', width: 150, tooltip: 'overflow' },
      { name: 'attribute5', width: 150, tooltip: 'overflow' },
      { name: 'attribute6', width: 150, tooltip: 'overflow' },
      { name: 'attribute7', width: 150, tooltip: 'overflow' },
      { name: 'attribute8', width: 150, tooltip: 'overflow' },
      { name: 'attribute9', width: 150, tooltip: 'overflow' },
      { name: 'attribute10', width: 150, tooltip: 'overflow' },
      { name: 'attribute11', width: 150, tooltip: 'overflow' },
      { name: 'attribute12', width: 150, tooltip: 'overflow' },
      { name: 'attribute13', width: 150, tooltip: 'overflow' },
      { name: 'attribute14', width: 150, tooltip: 'overflow' },
      { name: 'attribute15', width: 150, tooltip: 'overflow' },
      { name: 'attribute16', width: 150, tooltip: 'overflow' },
      { name: 'attribute17', width: 150, tooltip: 'overflow' },
      { name: 'attribute18', width: 150, tooltip: 'overflow' },
      { name: 'attribute19', width: 150, tooltip: 'overflow' },
      { name: 'attribute20', width: 150, tooltip: 'overflow' },
      { name: 'attribute21', width: 150, tooltip: 'overflow' },
      { name: 'attribute22', width: 150, tooltip: 'overflow' },
      { name: 'attribute23', width: 150, tooltip: 'overflow' },
      { name: 'attribute24', width: 150, lock: 'right' },
    ];
  }

  /**
   * 行table列
   * @returns
   */
  function lineColumns() {
    return [
      { header: 'No.', width: 50, lock: 'left', renderer: ({ record }) => getSerialNum(record) },
      { name: 'attribute1', width: 150, lock: 'left', tooltip: 'overflow' },
      { name: 'attribute2', width: 150, lock: 'left', tooltip: 'overflow' },
      { name: 'attribute3', width: 150, tooltip: 'overflow' },
      { name: 'attribute4', width: 150, tooltip: 'overflow' },
      {
        name: 'attribute5',
        width: 150,
        renderer: ({ record }) => handlePreview(record),
        tooltip: 'always',
      },
      { name: 'attribute6', width: 150, tooltip: 'overflow' },
      { name: 'attribute7', width: 150, tooltip: 'overflow' },
      { name: 'attribute8', width: 150, tooltip: 'overflow' },
      { name: 'attribute9', width: 150, tooltip: 'overflow' },
      { name: 'attribute10', width: 150, tooltip: 'overflow' },
      { name: 'attribute11', width: 150, tooltip: 'overflow' },
      { name: 'attribute12', width: 150, lock: 'right', tooltip: 'overflow' },
      {
        header: '操作',
        lock: 'right',
        width: 150,
        command: ({ record }) => {
          return [<a onClick={() => handleToHistoryPage(record)}>查看明细</a>];
        },
      },
    ];
  }

  /**
   * 头点击事件
   *
   * @param {*} { record }
   * @returns
   */
  function handleClick(drawingCode) {
    return {
      onClick: async () => {
        HeadDS.setQueryParameter('headId', drawingCode);
        lineListDS.setQueryParameter('attribute1', drawingCode);
        await lineListDS.query();
        setRefresh(!refresh);
      },
    };
  }

  /**
   * 图纸预览列表
   * @param {*} record 当前行记录
   */
  function handlePreview(record) {
    const fileList = record.get('attribute5');
    if (isEmpty(fileList)) return fileList;
    const links = fileList.split(';').map((item) => {
      return (
        <>
          <a href={item} target="_blank" rel="noopener noreferrer" style={{ margin: '3px 10px' }}>
            {item.split('@').pop()}
          </a>
          <br />
        </>
      );
    });
    return links;
  }

  return (
    <Fragment>
      <Header title={intl.get(`${preCode}.view.title.drawingPlatform.overviewList`).d('图纸平台')}>
        <Button onClick={() => handleToEditPage('create')} color="primary">
          {intl.get('hzero.common.button.create').d('新增')}
        </Button>
      </Header>
      <Content>
        <Table
          dataSet={HeadDS}
          columns={columns()}
          border={false}
          columnResizable="true"
          editMode="inline"
          onRow={({ record }) => handleClick(record.get('attribute2'))}
        />
        {!isEmpty(headId) && (
          <Table
            dataSet={lineListDS}
            columns={lineColumns()}
            border={false}
            columnResizable="true"
            editMode="inline"
            header="图纸版本"
          />
        )}
      </Content>
    </Fragment>
  );
};

export default DrawingPlatformListPage;
