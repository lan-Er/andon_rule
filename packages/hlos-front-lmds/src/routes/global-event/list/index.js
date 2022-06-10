/*
 * @Description: 事件查询管理信息--list
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2019-12-24 14:10:34
 * @LastEditors: 赵敏捷
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Bind } from 'lodash-decorators';
import {
  DataSet,
  Table,
  Button,
  Tooltip,
  Form,
  Lov,
  TextField,
  DateTimePicker,
} from 'choerodon-ui/pro';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import withProps from 'utils/withProps';

import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';

import EventListDS from '../stores/EventListDS';
import EventListQueryParamDS from '../stores/EventListQueryParamDS';
import './style.less';

const intlPrefix = 'lmds.event';
const organizationId = getCurrentOrganizationId();

@formatterCollections({
  code: [`${intlPrefix}`],
})
@connect()
@withProps(
  () => {
    const eventListQueryParamDS = new DataSet({
      ...EventListQueryParamDS(),
    });
    const eventListDS = new DataSet({
      ...EventListDS({ type: 'list' }),
    });
    return {
      eventListDS,
      eventListQueryParamDS,
    };
  },
  { cacheState: true }
)
export default class EventList extends Component {
  state = {
    hiddenQueryFields: true,
  };

  get columns() {
    return [
      {
        name: 'organizationObj',
        width: 150,
        lock: true,
      },
      {
        name: 'eventTime',
        width: 180,
        align: 'center',
        lock: true,
      },
      {
        name: 'eventTypeObj',
        width: 150,
        lock: true,
      },
      {
        name: 'eventId',
        width: 150,
      },
      {
        name: 'parentEventId',
        width: 150,
      },
      {
        name: 'eventRequestId',
        width: 150,
      },
      {
        name: 'workerObj',
        width: 150,
      },
      {
        name: 'workerGroupObj',
        width: 150,
      },
      {
        name: 'prodLineObj',
        width: 150,
      },
      {
        name: 'workcellObj',
        width: 150,
      },
      {
        name: 'equipmentObj',
        width: 150,
      },
      {
        name: 'locationObj',
        width: 150,
      },
      {
        name: 'itemObj',
        width: 150,
      },
      {
        name: 'itemDescription',
        width: 150,
      },
      {
        name: 'warehouseObj',
        width: 150,
      },
      {
        name: 'wmAreaObj',
        width: 150,
      },
      {
        name: 'wmUnitCode',
        width: 150,
      },
      {
        name: 'calendarDay',
        width: 150,
      },
      {
        name: 'calendarShiftCode',
        width: 150,
      },
      {
        name: 'inverseEventId',
        width: 150,
      },
      {
        name: 'remark',
        width: 150,
      },
      {
        name: 'syncStatus',
        width: 150,
      },
      {
        name: 'syncGroup',
        width: 150,
      },
      {
        name: 'eventByObj',
        width: 150,
      },
      {
        header: intl.get('hzero.common.button.action').d('操作'),
        width: 90,
        command: ({ record }) => {
          return [
            <Tooltip placement="bottom" title={intl.get(`${intlPrefix}.button.detail`).d('明细')}>
              <Button
                key="framework"
                color="primary"
                funcType="flat"
                onClick={() => this.handleGoDetail(record)}
              >
                {intl.get(`${intlPrefix}.button.detail`).d('明细')}
              </Button>
            </Tooltip>,
          ];
        },
        lock: 'right',
      },
    ];
  }

  get queryFields() {
    return [
      <Lov name="organizationObj" noCache />,
      <DateTimePicker name="minTime" />,
      <DateTimePicker name="maxTime" />,
      <Lov name="eventTypeObj" noCache />,
      <Lov name="itemObj" noCache />,
      <Lov name="warehouseObj" noCache />,
      <Lov name="wmAreaObj" noCache />,
      <TextField name="wmUnitCode" />,
      <Lov name="prodLineObj" noCache />,
      <Lov name="workcellObj" noCache />,
      <Lov name="workerObj" noCache />,
      <Lov name="workerGroupObj" noCache />,
      <Lov name="equipmentObj" noCache />,
      <TextField name="eventId" />,
      <TextField name="eventRequestId" />,
      <TextField name="parentEventId" />,
    ];
  }

  /**
   * 跳转详情页面
   * @param record
   */
  @Bind
  handleGoDetail(record) {
    const { dispatch } = this.props;
    const { eventId } = record.data;
    dispatch(
      routerRedux.push({
        pathname: `/lmds/event/detail/${eventId}`,
      })
    );
  }

  /**
   * getExportQueryParams - 获取导出字段查询参数
   */
  @Bind
  getExportQueryParams() {
    const {
      props: { eventListDS: ds },
    } = this;
    const queryDataDs = ds && ds.queryDataSet && ds.queryDataSet.current;
    const queryDataDsValue = queryDataDs ? filterNullValueObject(queryDataDs.toData()) : {};
    return {
      tenantId: organizationId,
      ...queryDataDsValue,
    };
  }

  /**
   * 切换查询条件的显示与隐藏
   */
  @Bind
  handleToggle() {
    this.setState({ hiddenQueryFields: !this.state.hiddenQueryFields });
  }

  /**
   * 重置查询条件
   */
  @Bind
  handleReset() {
    this.props.eventListQueryParamDS.reset();
  }

  /**
   * 查询
   */
  @Bind
  async handleSearch() {
    const { eventListQueryParamDS, eventListDS } = this.props;
    const validateValue = await eventListQueryParamDS.validate(false, false);
    if (!validateValue) {
      return;
    }
    const { current } = eventListQueryParamDS;
    eventListDS.queryParameter = current.toJSONData();
    eventListDS.query();
  }

  render() {
    const { hiddenQueryFields } = this.state;
    const { eventListQueryParamDS, eventListDS } = this.props;
    return (
      <Fragment>
        <Header title={intl.get(`${intlPrefix}.view.title.event`).d('事件查询')}>
          <ExcelExport
            requestUrl={`${HLOS_LMDS}/v1/${organizationId}/events/excel`}
            queryParams={this.getExportQueryParams}
          />
        </Header>
        <Content className="lmds-global-event-query">
          <div style={{ display: 'flex', marginBottom: 10, alignItems: 'flex-start' }}>
            <Form dataSet={eventListQueryParamDS} columns={3} style={{ flex: '1 1 auto' }}>
              {hiddenQueryFields ? this.queryFields.slice(0, 3) : this.queryFields}
            </Form>
            <div style={{ marginLeft: 8, flexShrink: 0, display: 'flex', alignItems: 'center' }}>
              <Button onClick={this.handleToggle}>
                {hiddenQueryFields
                  ? intl.get('hzero.common.button.viewMore').d('更多查询')
                  : intl.get('hzero.common.button.collected').d('收起查询')}
              </Button>
              <Button onClick={this.handleReset}>
                {intl.get('hzero.common.button.reset').d('重置')}
              </Button>
              <Button color="primary" onClick={this.handleSearch}>
                {intl.get('hzero.common.button.search').d('查询')}
              </Button>
            </div>
          </div>
          <Table dataSet={eventListDS} columns={this.columns} />
        </Content>
      </Fragment>
    );
  }
}
