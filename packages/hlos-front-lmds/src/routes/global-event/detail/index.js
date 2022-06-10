/*
 * @Description: 事件查询详情页面--detail
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2019-12-24 18:33:26
 * @LastEditors: 赵敏捷
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { DataSet, Table, Form, Lov, TextField, TimePicker } from 'choerodon-ui/pro';
import { Card } from 'choerodon-ui';

import formatterCollections from 'utils/intl/formatterCollections';
import { DETAIL_CARD_CLASSNAME } from 'utils/constants';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';

import EventListDS from '../stores/EventListDS';
import EventDetailDS from '../stores/EventDetailDS';

const intlPrefix = 'lmds.event';

@connect()
@formatterCollections({
  code: [`${intlPrefix}`],
})
export default class EventList extends Component {
  eventListDS = new DataSet({
    ...EventListDS({ type: 'detail' }),
  });

  eventDetailDS = new DataSet({
    ...EventDetailDS(),
  });

  componentDidMount() {
    const { eventId } = this.props.match.params;
    this.eventListDS.queryParameter = {
      size: 10,
      eventId,
    };
    this.eventDetailDS.queryParameter = { eventId };
    this.eventListDS.query();
    this.eventDetailDS.query();
  }

  get columns() {
    return [
      {
        name: 'objectType',
        width: 150,
        editor: false,
      },
      {
        name: 'objectId',
        width: 150,
        editor: false,
      },
      {
        name: 'object',
        width: 150,
        editor: false,
      },
      {
        name: 'recordType',
        width: 150,
        editor: false,
      },
      {
        name: 'keyValue',
        width: 150,
        editor: false,
      },
      {
        name: 'snapshotRecord',
        width: 150,
        editor: false,
      },
    ];
  }

  get queryFields () {
    return [
      <Lov name="organizationObj" />,
      <TimePicker name="minTime" />,
      <TimePicker name="maxTime" />,
      <Lov name="eventTypeObj" />,
      <Lov name="itemObj" />,
      <Lov name="warehouseObj" />,
      <Lov name="wmAreaObj" />,
      <TextField name="wmUnitCode" />,
      <Lov name="prodLineObj" />,
      <Lov name="workcellObj" />,
      <Lov name="workerObj" />,
      <Lov name="workerGroupObj" />,
      <Lov name="equipmentObj" />,
      <TextField name="eventId" />,
      <TextField name="eventRequestId" />,
      <TextField name="parentEventId" />,
    ];
  }

  render() {
    return (
      <Fragment>
        <Header
          title={intl.get(`${intlPrefix}.view.title.eventDetail`).d('事件明细')}
          backPath="/lmds/event/list"
        />
        <Content>
          <Card
            key="party-detail-header"
            bordered={false}
            className={DETAIL_CARD_CLASSNAME}
            title={
              <h3>{intl.get(`${intlPrefix}.view.title.event`).d('事件查询')}</h3>
            }
          >
            <Form dataSet={this.eventListDS} columns={4}>
              <Lov name="organizationObj" disabled />
              <TimePicker name="eventTime" disabled />
              <Lov name="eventTypeObj" disabled />
              <TextField name="eventRequestId" disabled />
              <TextField name="eventId" disabled />
              <Lov name="warehouseObj" disabled />
              <Lov name="wmAreaObj" disabled />
              <TextField name="wmUnitCode" disabled />
              <Lov name="prodLineObj" disabled />
              <Lov name="workcellObj" disabled />
              <Lov name="workerObj" disabled />
              <Lov name="workerGroupObj" disabled />
              <Lov name="itemObj" disabled />
              <TextField name="parentEventId" disabled />
              <TextField name="inverseEventId" disabled />
            </Form>
          </Card>
          <Card
            key="party-detail-body"
            bordered={false}
            className={DETAIL_CARD_CLASSNAME}
            title={
              <h3>{intl.get(`${intlPrefix}.view.title.eventDetail`).d('事件明细')}</h3>
            }
          >
            <Table
              dataSet={this.eventDetailDS}
              columns={this.columns}
              editMode="inline"
            />
          </Card>
        </Content>
      </Fragment>
    );
  }
}
