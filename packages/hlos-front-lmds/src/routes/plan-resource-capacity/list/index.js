/**
 * @Description: 资源能力管理信息--Index
 * @Author: yiping.liu<yiping.liu@hand-china.com>
 * @Date: 2019-12-09 13:42:58
 * @LastEditors: yiping.liu
 */
import React from 'react';
import { Bind } from 'lodash-decorators';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import intl from 'utils/intl';
import { Button, Table, Lov, CheckBox, DataSet } from 'choerodon-ui/pro';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';

import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';

import ResourceCapacityDS from '../stores/ResourceCapacityDS';

const preCode = 'lmds.resourceCapacity';
const commonCode = 'hzero.common.button';
const organizationId = getCurrentOrganizationId();

@formatterCollections({
  code: [`${preCode}`, `${commonCode}`],
})
export default class ResourceCapacity extends React.Component {
  resourceCapacityDS = new DataSet({
    ...ResourceCapacityDS(),
  });

  /**
   *新建
   *
   * @memberof ResourceCapacity
   */
  @Bind
  handleCreate () {
    this.resourceCapacityDS.create({}, 0);
  }

  /**
   *导出
   *
   * @returns
   * @memberof ResourceCapacity
   */
  @Bind
  getExportQueryParams() {
    const {
      resourceCapacityDS: ds,
    } = this;
    const queryDataDs = ds && ds.queryDataSet && ds.queryDataSet.current;
    const queryDataDsValue = queryDataDs ? filterNullValueObject(queryDataDs.toData()) : {};
    return {
      tenantId: organizationId,
      ...queryDataDsValue,
    };
  }

  get columns() {
    return [
      {
        name: 'APSOueObj',
        editor: record => {
          return record.status === 'add' ? <Lov noCache /> : null;
        },
        width: 200,
        lock: 'left',
      },
      {
        name: 'APSResourceObj',
        editor: record => {
          return record.status === 'add' ? <Lov noCache /> : null;
        },
        width: 200,
        lock: 'left',
      },
      {
        name: 'itemObj',
        editor: record => {
          return record.status === 'add' ? <Lov noCache /> : null;
        },
        width: 200,
        lock: 'left',
      },
      {
        name: 'itemDescription',
        editor: false,
        width: 150,
      },
      {
        name: 'categoryObj',
        editor: record => {
          return record.status === 'add' ? <Lov noCache /> : null;
        },
        width: 200,
      },
      {
        name: 'relatedResourceObj',
        editor: record => {
          return record.status === 'add' ? <Lov noCache /> : null;
        },
        width: 200,
      },
      {
        name: 'meOuObj',
        editor: record => {
          return record.status === 'add' ? <Lov noCache /> : null;
        },
        width: 200,
      },
      {
        name: 'prodVersionEnable',
        editor: record => (record.editing ? <CheckBox /> : null),
        width: 100,
        align: 'center',
        renderer: yesOrNoRender,
      },
      {
        name: 'prodVersionObj',
        editor: record => {
          if(record.get('prodVersionEnable')){
            return true;
          }else {
            return false;
          }
        },
        width: 200,
      },
      {
        name: 'bomObj',
        editor: record => {
          if(!record.get('prodVersionEnable')){
            return true;
          }else {
            return false;
          }
        },
        width: 200,
      },
      {
        name: 'routingObj',
        editor: record => {
          if(!record.get('prodVersionEnable')){
            return true;
          }else {
            return false;
          }
        },
        width: 200,
      },
      {
        name: 'capacityType',
        editor: true,
        width: 150,
      },
      {
        name: 'capacityValue',
        editor: true,
        width: 150,
      },
      {
        name: 'activity',
        editor: true,
        width: 150,
      },
      {
        name: 'priority',
        editor: true,
        width: 150,
      },
      {
        name: 'eachProcessOutput',
        editor: true,
        width: 150,
      },
      {
        name: 'standardCapacityType',
        editor: true,
        width: 150,
      },
      {
        name: 'standardCapacityValue',
        editor: true,
        width: 150,
      },
      {
        name: 'preProcessLeadTime',
        editor: true,
        width: 150,
      },
      {
        name: 'processLeadTime',
        editor: true,
        width: 150,
      },
      {
        name: 'postProcessLeadTime',
        editor: true,
        width: 150,
      },
      {
        name: 'safetyLeadTime',
        editor: true,
        width: 150,
      },
      {
        name: 'autoAssignFlag',
        editor: record => (record.editing ? <CheckBox /> : null),
        width: 100,
        align: 'center',
        renderer: yesOrNoRender,
      },
      {
        name: 'enabledFlag',
        editor: record => (record.editing ? <CheckBox /> : null),
        width: 100,
        align: 'center',
        renderer: yesOrNoRender,
      },
      {
        header: intl.get(`${commonCode}.action`).d('操作'),
        width: 120,
        command: ['edit'],
        lock: 'right',
      },
    ];
  };

  get queryFields() {
    return {
      'APSResourceObj': <Lov name='APSResourceObj' clearButton noCache />,
      'itemObj': <Lov name='itemObj' clearButton noCache />,
    };
  }

  render() {
    return (
      <React.Fragment>
        <Header title={intl.get(`${preCode}.view.title.resourceCapacity`).d('资源能力')}>
          <Button icon="add" color="primary" onClick={this.handleCreate}>
            {intl.get(`${commonCode}.create`).d('新建')}
          </Button>
          <ExcelExport
            requestUrl={`${HLOS_LMDS}/v1/${organizationId}/aps-capacitys/excel`}
            queryParams={this.getExportQueryParams}
          />
        </Header>
        <Content>
          <Table
            dataSet={this.resourceCapacityDS}
            columns={this.columns}
            editMode="inline"
            selectionMode="click"
            queryFields={this.queryFields}
          />
        </Content>
      </React.Fragment>
    );
  }
}
