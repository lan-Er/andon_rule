/*
 * @module: 二次封装大数据table组件
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2021-05-31 11:16:30
 * @LastEditTime: 2021-06-23 17:28:46
 * @copyright: Copyright (c) 2020,Hand
 */
import { Button, TextField } from 'choerodon-ui/pro';
import React, { useMemo, useState, Fragment, useRef } from 'react';
import { Header, Content } from 'components/Page';

import BigDataTable from '@/components/BigDataTable';

export default function Index() {
  // const Modal = useModal;
  const [total, setTotal] = useState(0);
  const [selfPage, setSelfPage] = useState(1);
  const [selfPageSize, setSelfPageSize] = useState(20);
  const textOne = useRef();
  const textTwo = useRef();
  const pageConfig = useMemo(() => {
    return {
      total,
      page: selfPage,
      pageSize: selfPageSize,
    };
  }, [total, selfPage, selfPageSize]);

  const columns = useMemo(
    () => [
      { title: '城市', dataIndex: 'city', key: 'city', width: 200, resizable: true },
      {
        title: '星座',
        dataIndex: 'constellation',
        key: 'constellation',
        resizable: true,
        width: 600,
      },
      { title: '年龄', dataIndex: 'age', key: 'age', resizable: true },
    ],
    []
  );
  const data = [
    { city: '上海', constellation: '双子', age: 20 },
    { city: '北京', constellation: '双子', age: 22 },
    { city: '深圳', constellation: '双子', age: 20 },
    { city: '广东', constellation: '双子', age: 22 },
    { city: '福建', constellation: '双子', age: 20 },
    { city: '浙江', constellation: '双子', age: 22 },
    { city: '河北', constellation: '双子', age: 20 },
    { city: '河南', constellation: '双子', age: 22 },
    { city: '新疆', constellation: '双子', age: 20 },
    { city: '石河子', constellation: '双子', age: 22 },
    { city: '石家庄', constellation: '双子', age: 20 },
    { city: '郑州', constellation: '双子', age: 22 },
    { city: '周口', constellation: '双子', age: 20 },
    { city: '平顶山', constellation: '双子', age: 22 },
    { city: '漯河', constellation: '双子', age: 20 },
    { city: '安徽', constellation: '双子', age: 22 },
    { city: '阜南', constellation: '双子', age: 30 },
    { city: '阜阳', constellation: '双子', age: 22 },
  ];
  function query(page = selfPage, pageSize = selfPageSize) {
    console.log(page, pageSize);
    // 查询成功后将分页信息传递出去
    setTotal(2);
    setSelfPage(1);
    setSelfPageSize(20);
  }
  function changePage(page, pageSize) {
    query(page, pageSize);
  }
  const config = { columns, data, pageChange: changePage, showPage: true };

  return (
    <Fragment>
      <Header>
        <Button>测试</Button>
      </Header>
      <Content>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <TextField ref={textOne} />
          <TextField ref={textTwo} />
          <section>
            <div>123</div>
            <div>123</div>
            <div>123</div>
          </section>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <BigDataTable config={{ ...config }} pageConfig={pageConfig} />
          </div>
        </div>
      </Content>
    </Fragment>
  );
}
