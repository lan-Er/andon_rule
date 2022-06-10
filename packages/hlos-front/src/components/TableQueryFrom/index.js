/*
 * @module: 表格查询条件组件
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2021-04-29 14:07:16
 * @LastEditTime: 2021-05-11 16:22:59
 * @copyright: Copyright (c) 2020,Hand
 */
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { Form, Button } from 'choerodon-ui/pro';
import { useObserver, useLocalStore } from 'mobx-react-lite';

import style from './index.module.less';

function TableQuery(props) {
  const store = useLocalStore(() => {
    return {
      showMore: false,
      resultNumber: 3,
      setShowMore(status) {
        this.showMore = status;
      },
      setResultNumber(number) {
        this.resultNumber = number;
      },
    };
  });
  useEffect(() => {
    store.setResultNumber(props.showNumber || 3);
  }, []);

  useEffect(() => {
    if (store.showMore) {
      store.setResultNumber(props.children.length);
    } else {
      store.setResultNumber(props.showNumber || 3);
    }
  }, [store.showMore]);

  /**
   * @description: 更多查询
   * @param {*}
   * @return {*}
   */
  function handleMoreQuery() {
    store.setShowMore(!store.showMore);
  }

  /**
   * @description: 重置
   * @param {*}
   * @return {*}
   */
  function handleReset() {
    if (props.dataSet && props.dataSet.current) {
      props.dataSet.current.reset();
    }
  }
  return useObserver(() => (
    <div className={style['table-query-from']}>
      <div className={style['from-left-queryparams']}>
        <Form dataSet={props.dataSet} columns={props.showNumber || 3}>
          {props.children && props.children.length > 0
            ? props.children.slice(0, store.resultNumber)
            : props.children}
        </Form>
      </div>
      <div className={style['from-right-button']}>
        {props.children && props.children.length > (props.showNumber || 3) ? (
          <Button onClick={handleMoreQuery}>{store.showMore ? '收起查询' : '更多查询'}</Button>
        ) : null}
        <Button onClick={handleReset}>重置</Button>
        <Button color="primary" onClick={props.onClickQueryCallback} loading={props.queryLoading}>
          查询
        </Button>
      </div>
    </div>
  ));
}

TableQuery.propTypes = {
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.element]),
  dataSet: PropTypes.object,
  onClickQueryCallback: PropTypes.func,
  queryLoading: PropTypes.bool,
  showNumber: PropTypes.number,
};
export default TableQuery;
