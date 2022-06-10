/*
 * @Description: 图纸总览
 * @Author: liangkun, <kun.liang01@hand-china.com>
 * @Date: 2020-06-03 15:58:31
 * @LastEditors: liangkun
 * @LastEditTime: 2020-06-03 16:12:01
 * @Copyright: Copyright (c) 2018, Hand
 */

import React, { Fragment, useEffect } from 'react';
import { isEmpty } from 'lodash';
import { Table, DataSet } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import { useDataSet } from 'hzero-front/lib/utils/hooks';

import { getSerialNum } from '@/utils/renderer';
import { historyDS } from '@/stores/drawingPlatformDS';

const todoDataSetFactory = () => new DataSet({ ...historyDS() });

const DrawingPlatformHistoryPage = (props) => {
  const HistoryDS = useDataSet(todoDataSetFactory, DrawingPlatformHistoryPage);

  const { code, version } = props.match.params;

  useEffect(() => {
    HistoryDS.setQueryParameter('attribute1', code);
    HistoryDS.setQueryParameter('attribute2', version);
    HistoryDS.query();
  });

  /**
   * 图纸预览
   * @params {string}
   * @return {Array} dataList 图纸列表
   */
  function handlePreview(data) {
    if (isEmpty(data)) return data;
    const urlList = data.split(';');
    const links = urlList.map((item) => {
      return (
        <>
          <a href={item} target="_blank" rel="noopener noreferrer">
            {item.split('@').pop()}
          </a>
          <br />
        </>
      );
    });
    return links;
  }

  /**
   * table列
   * @returns
   */
  function columns() {
    return [
      { header: 'No.', width: 50, lock: 'left', renderer: ({ record }) => getSerialNum(record) },
      {
        name: 'attribute1',
        width: 150,
        tooltip: 'overflow',
      },
      { name: 'attribute2', width: 150, tooltip: 'overflow' },
      {
        name: 'attribute3',
        width: 150,
        renderer: ({ record }) => handlePreview(record.get('attribute3')),
        tooltip: 'always',
      },
      { name: 'attribute4', width: 150, tooltip: 'overflow' },
    ];
  }

  return (
    <Fragment>
      <Header title="图纸版本历史" backPath="/lisp/drawing-platform/list" />
      <Content>
        <Table dataSet={HistoryDS} columns={columns()} columnResizable="true" editMode="inline" />
      </Content>
    </Fragment>
  );
};

export default DrawingPlatformHistoryPage;
