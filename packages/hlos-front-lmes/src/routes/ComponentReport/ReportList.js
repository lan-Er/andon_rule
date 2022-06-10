/**
 * @Description: xxxx管理信息--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-05-06 12:43:45
 * @LastEditors: yu.na
 */

import React, { Fragment, useContext, useEffect } from 'react';
import { Table, Lov } from 'choerodon-ui/pro';
import intl from 'utils/intl';
import { Header, Content } from 'components/Page';
import Store from '@/stores/componentReportDS';
import './style.less';

const preCode = 'lmes.componentReport';
const { Column } = Table;

export default () => {
  const { listDS } = useContext(Store);

  useEffect(() => {
    /**
     *设置默认查询条件
     */
    async function defaultLovSetting() {
      listDS.queryDataSet.current.set('organizationObj', {
        organizationId: '42655554034409472',
        organizationName: '沪宁钢机总厂',
      });
    }

    defaultLovSetting();
  }, [listDS]);

  /**
   *tab查询条件
   * @returns
   */
  function queryFields() {
    return {
      organizationObj: <Lov name="organizationObj" noCache />,
    };
  }

  return (
    <Fragment>
      <Header title={intl.get(`${preCode}.view.title.componentReport`).d('构件报工报表')} />
      <Content className="lmes-component-report-content">
        <Table
          dataSet={listDS}
          border={false}
          columnResizable="true"
          editMode="inline"
          queryFieldsLimit={4}
          queryFields={queryFields()}
        >
          <Column name="projectNum" width={150} lock />
          <Column name="wbsNum" width={150} lock />
          <Column name="itemCode" width={150} lock />
          <Column name="itemType" width={150} />
          <Column name="quantity" width={150} />
          <Column header="U型拼装">
            <Column name="complatedStatus-1" width={150} />
            <Column name="confirmStatus-1" width={150} />
            <Column name="qcStatus-1" width={150} />
            <Column name="workerGroup-1" width={150} />
            <Column name="workcellCode-1" width={150} />
            <Column name="worker-1" width={150} />
            <Column name="executeTime-1" width={150} />
            <Column name="confirmWorker-1" width={150} />
            <Column name="qcWorker-1" width={150} />
          </Column>
          <Column header="U型焊接">
            <Column name="complatedStatus-2" width={150} />
            <Column name="confirmStatus-2" width={150} />
            <Column name="qcStatus-2" width={150} />
            <Column name="workerGroup-2" width={150} />
            <Column name="workcellCode-2" width={150} />
            <Column name="worker-2" width={150} />
            <Column name="executeTime-2" width={150} />
            <Column name="confirmWorker-2" width={150} />
            <Column name="qcWorker-2" width={150} />
          </Column>
          <Column header="本体焊接">
            <Column name="complatedStatus-3" width={150} />
            <Column name="confirmStatus-3" width={150} />
            <Column name="qcStatus-3" width={150} />
            <Column name="workerGroup-3" width={150} />
            <Column name="workcellCode-3" width={150} />
            <Column name="worker-3" width={150} />
            <Column name="executeTime-3" width={150} />
            <Column name="confirmWorker-3" width={150} />
            <Column name="qcWorker-3" width={150} />
          </Column>
          <Column header="牛腿安装">
            <Column name="complatedStatus-4" width={150} />
            <Column name="confirmStatus-4" width={150} />
            <Column name="qcStatus-4" width={150} />
            <Column name="workerGroup-4" width={150} />
            <Column name="workcellCode-4" width={150} />
            <Column name="worker-4" width={150} />
            <Column name="executeTime-4" width={150} />
            <Column name="confirmWorker-4" width={150} />
            <Column name="qcWorker-4" width={150} />
          </Column>
          <Column header="牛腿焊接">
            <Column name="complatedStatus-5" width={150} />
            <Column name="confirmStatus-5" width={150} />
            <Column name="qcStatus-5" width={150} />
            <Column name="workerGroup-5" width={150} />
            <Column name="workcellCode-5" width={150} />
            <Column name="worker-5" width={150} />
            <Column name="executeTime-5" width={150} />
            <Column name="confirmWorker-5" width={150} />
            <Column name="qcWorker-5" width={150} />
          </Column>
        </Table>
      </Content>
    </Fragment>
  );
};
