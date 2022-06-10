/**
 * @Description: 促销日历列表
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-05-23 10:38:53
 */

import React, { useEffect, Fragment } from 'react';
import { DataSet, Table, Button } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { promotionCalendarListDS } from '../store/indexDS';

const intlPrefix = 'zplan.promotionCalendar';
const ListDS = new DataSet(promotionCalendarListDS());

function ZplanPromotionCalendar({ history }) {
  useEffect(() => {
    ListDS.query();
  }, []);

  function handleToDetail(record) {
    const { salesEntityId } = record.toData();
    history.push({
      pathname: `/zplan/promotion-calendar/detail/${salesEntityId}`,
    });
  }

  const columns = [
    {
      header: intl.get('hzero.common.button.calendar').d('促销日历'),
      command: ({ record }) => {
        return [
          <Button color="primary" funcType="flat" onClick={() => handleToDetail(record)}>
            点击查看
          </Button>,
        ];
      },
      lock: true,
    },
    { name: 'salesEntityCode', align: 'center' },
    { name: 'salesEntityName', align: 'center' },
  ];

  return (
    <Fragment>
      <Header
        title={intl.get(`${intlPrefix}.view.title.promotionCalendarList`).d('促销日历列表')}
      />
      <Content>
        <Table dataSet={ListDS} columns={columns} />
      </Content>
    </Fragment>
  );
}

export default formatterCollections({
  code: [`${intlPrefix}`],
})(ZplanPromotionCalendar);
