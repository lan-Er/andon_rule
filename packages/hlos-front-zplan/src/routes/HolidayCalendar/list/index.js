/**
 * @Description: 节日日历列表
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-05-19 14:17:26
 */

import React, { useEffect, Fragment } from 'react';
import { DataSet, Button, Table, TextField } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { holidayCalendarListDS } from '../store/indexDS';

const intlPrefix = 'zplan.holidayCalendar';
const ListDS = new DataSet(holidayCalendarListDS());

function ZplanHolidayCalendar({ history }) {
  useEffect(() => {
    ListDS.query();
  }, []);

  function handleToDetail(calendarId, value) {
    history.push({
      pathname: `/zplan/holiday-calendar/detail/${value}/${calendarId}`,
    });
  }

  function handleAdd() {
    ListDS.create({}, 0);
  }

  const columns = [
    {
      name: 'calendarCode',
      align: 'center',
      editor: (record) => (record.status === 'add' ? <TextField /> : null),
      renderer: ({ record, value }) => {
        const calendarId = record.get('calendarId');
        return <a onClick={() => handleToDetail(calendarId, value)}>{value}</a>;
      },
    },
    { name: 'calendarName', align: 'center', editor: true },
    { name: 'enabledFlag', align: 'center', editor: true },
    {
      header: intl.get('hzero.common.button.action').d('操作'),
      width: 100,
      command: ['edit'],
      lock: 'right',
    },
  ];

  return (
    <Fragment>
      <Header title={intl.get(`${intlPrefix}.view.title.holidayCalendarList`).d('节日日历列表')}>
        <Button color="primary" onClick={handleAdd}>
          新建
        </Button>
      </Header>
      <Content>
        <Table dataSet={ListDS} columns={columns} editMode="inline" />
      </Content>
    </Fragment>
  );
}

export default formatterCollections({
  code: [`${intlPrefix}`],
})(ZplanHolidayCalendar);
