/*
 * @Description: 商业实体管理信息--detail
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2019-11-27 15:57:22
 * @LastEditors: 赵敏捷
 */


import React, { Component, Fragment } from 'react';
import { DataSet, Table, TextField, Switch, Form, Select } from 'choerodon-ui/pro';
import { Card } from 'choerodon-ui';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { DETAIL_CARD_CLASSNAME } from 'utils/constants';

import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import PartyDetailDS from '../stores/PartySiteDS';
import PartyDS from '../stores/PartyDS';

const intlPrefix = 'lmds.party';
const commonPrefix = 'lmds.common';

@formatterCollections({
  code: [`${intlPrefix}`, `${commonPrefix}`],
})
export default class PartyDetail extends Component {
  partyDS = new DataSet({
    ...PartyDS(),
  });

  partyDetailDS = new DataSet({
    ...PartyDetailDS(),
  });

  componentDidMount() {
    const { partyId } = this.props.match.params;
    this.partyDetailDS.setQueryParameter('partyId', partyId) ;
    this.partyDS.setQueryParameter('partyId', partyId);
    this.partyDetailDS.query();
    this.partyDS.query();
  }

  get columns() {
    return [
      {
        name: 'partySiteType',
        width: 150,
      },
      {
        name: 'partySiteNumber',
        width: 150,
      },
      {
        name: 'partySiteName',
        width: 150,
      },
      {
        name: 'partySiteAlias',
        width: 150,
      },
      {
        name: 'description',
        width: 150,
      },
      {
        name: 'partySiteStatus',
        width: 150,
      },
      {
        name: 'countryRegion',
        width: 150,
      },
      {
        name: 'provinceState',
        width: 150,
      },
      {
        name: 'city',
        width: 150,
      },
      {
        name: 'address',
        width: 150,
      },
      {
        name: 'zipcode',
        width: 150,
      },
      {
        name: 'contact',
        width: 150,
      },
      {
        name: 'phoneNumber',
        width: 150,
      },
      {
        name: 'email',
        width: 150,
      },
      {
        name: 'startDate',
        width: 150,
        align: 'center',
      },
      {
        name: 'endDate',
        width: 150,
        align: 'center',
      },
      {
        name: 'externalId',
        width: 150,
      },
      {
        name: 'externalNum',
        width: 150,
      },
      {
        name: 'enabledFlag',
        width: 100,
        align: 'center',
        renderer: yesOrNoRender,
      },
    ];
  }

  render () {
    return (
      <Fragment>
        <Header
          title={intl.get(`${intlPrefix}.view.title.partyNumberInfo`).d('商业实体地点')}
          backPath="/lmds/party/list"
        />
        <Content>
          <Card
            key="party-detail-header"
            bordered={false}
            className={DETAIL_CARD_CLASSNAME}
            title={
              <h3>{intl.get(`${intlPrefix}.view.title.party`).d('商业实体')}</h3>
            }
          >
            <Form dataSet={this.partyDS} columns={4}>
              <Select name="partyType" disabled />
              <TextField name="partyNumber" disabled />
              <TextField name="partyName" disabled />
              <TextField name="partyAlias" disabled />
              <TextField name="description" disabled />
              <TextField name="societyNumber" disabled />
              <Select name="partyStatus" disabled />
              <TextField name="countryRegion" disabled />
              <TextField name="provinceState" disabled />
              <TextField name="city" disabled />
              <TextField name="address" disabled />
              <TextField name="zipcode" disabled />
              <TextField name="contact" disabled />
              <TextField name="phoneNumber" disabled />
              <TextField name="email" disabled />
              <TextField name="startDate" disabled />
              <TextField name="endDate" disabled />
              <TextField name="externalId" disabled />
              <TextField name="externalNum" disabled />
              <Switch name="enabledFlag" disabled />
            </Form>
          </Card>
          <Card
            key="party-detail-body"
            bordered={false}
            className={DETAIL_CARD_CLASSNAME}
            title={
              <h3>{intl.get(`${intlPrefix}.view.title.partyNumberInfo`).d('商业实体地点')}</h3>
            }
          >
            <Table
              dataSet={this.partyDetailDS}
              columns={this.columns}
              columnResizable="true"
              editMode="inline"
            />
          </Card>
        </Content>
      </Fragment>
    );
  }
}
