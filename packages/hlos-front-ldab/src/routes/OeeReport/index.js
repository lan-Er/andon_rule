/*
 * @Description: 设备稼动率报表
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2021-03-22 15:44:22
 */

import React, { Fragment, useMemo, useState, useEffect } from 'react';
import { Table, DataSet } from 'choerodon-ui/pro';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import { useDataSetEvent } from 'hzero-front/lib/utils/hooks';
import { userSetting } from 'hlos-front/lib/services/api';
import { ListDS, LineDS } from '@/stores/oeeReportDS';
import styles from './index.less';

const preCode = 'ldab.oeeReport';

const OeeReport = () => {
  const listDS = useMemo(() => new DataSet(ListDS()), []);
  const lineDS = useMemo(() => new DataSet(LineDS()), []);

  const [currentEquipment, setCurrentEquipment] = useState({});
  const [selectMonthDate, setSelectMonthDate] = useState(moment().daysInMonth());

  useEffect(() => {
    async function queryDefaultOrg() {
      const res = await userSetting({ defaultFlag: 'Y' });
      if (res && res.content && res.content[0]) {
        listDS.queryDataSet.current.set('organizationObj', {
          meOuId: res.content[0].meOuId,
          meOuName: res.content[0].meOuName,
        });
      }
    }
    queryDefaultOrg();
  }, []);

  useDataSetEvent(listDS.queryDataSet, 'update', ({ name, record }) => {
    if (name === 'calendarMonth') {
      setSelectMonthDate(moment(record.get('calendarMonth')).daysInMonth());
    }
  });

  useDataSetEvent(listDS, 'load', () => {
    setCurrentEquipment({});
  });

  const handleRateClick = async () => {
    const {
      organizationId,
      prodLineId,
      equipmentId,
      calendarShiftCode,
      workTime,
      targetOee,
      actualOee,
    } = currentEquipment;
    lineDS.queryParameter = {
      organizationId,
      prodLineId,
      equipmentId,
      calendarShiftCode,
      workTime,
      targetOee,
      actualOee,
    };
    await lineDS.query();
  };

  const rateRender = ({ value, record }) => {
    setCurrentEquipment(record.data);
    let style = {};
    if (record.data.targetOee > value) {
      style = {
        color: 'red',
      };
    }
    return (
      <a style={style} onClick={handleRateClick}>
        {value}
      </a>
    );
  };

  const dateColumns = useMemo(() => {
    const arr = [];
    for (let i = 0; i < selectMonthDate; i++) {
      arr.push({
        header: `${i + 1}日`,
        name: `actualOee${i + 1}`,
        width: 100,
        renderer: rateRender,
      });
    }
    return arr;
  }, [selectMonthDate]);

  const columns = useMemo(() => {
    return [
      {
        name: 'organizationName',
        width: 128,
      },
      {
        name: 'prodLineName',
        width: 128,
      },
      {
        name: 'equipmentName',
        width: 128,
      },
      {
        name: 'calendarShiftCodeMeaning',
        width: 82,
      },
      ...dateColumns,
      {
        name: 'workTime',
        width: 128,
      },
      {
        name: 'targetOee',
        width: 84,
      },
    ];
  }, [selectMonthDate]);

  const lineColumns = useMemo(() => {
    return [
      {
        name: 'organizationName',
        width: 128,
      },
      {
        name: 'prodLineName',
        width: 128,
      },
      {
        name: 'equipmentName',
        width: 128,
      },
      {
        name: 'productName',
        width: 128,
      },
      {
        name: 'taskQty',
        width: 84,
      },
      {
        name: 'standardTime',
        width: 128,
      },
      {
        name: 'actualStartTime',
        width: 128,
      },
      {
        name: 'actuaLEndTime',
        width: 128,
      },
      {
        name: 'processedTime',
        width: 128,
      },
      {
        name: 'singleRate',
        width: 100,
      },
      {
        name: 'workerName',
        width: 128,
      },
    ];
  }, []);

  return (
    <Fragment>
      <Header title={intl.get(`${preCode}.view.title.index`).d('设备稼动率报表')} />
      <Content>
        <Table dataSet={listDS} columns={columns} columnResizable="true" queryFieldsLimit={5} />
        {!isEmpty(currentEquipment) && (
          <div>
            <div className={styles['line-title']}>
              <div>
                {currentEquipment?.equipmentName}-
                {intl.get(`${preCode}.model.oeeDetail`).d('稼动明细')}
              </div>
              <div>
                <span>{intl.get(`${preCode}.model.date`).d('日期')}</span>
                <span>{currentEquipment.date}</span>
              </div>
              <div>
                <span>{intl.get(`${preCode}.model.machineWorkTime`).d('机床加工时间')}</span>
                <span>{currentEquipment.workTime}</span>
              </div>
              <div>
                <span>{currentEquipment.calendarShiftCodeMeaning}</span>
              </div>
              <div>
                <span>{intl.get(`${preCode}.model.actualOee`).d('机床稼动率')}</span>
                <span>{currentEquipment.actualOee}</span>
              </div>
              <div>
                <span>{intl.get(`${preCode}.model.targetOee`).d('标准稼动率')}</span>
                <span>{currentEquipment.targetOee}</span>
              </div>
            </div>
            <Table dataSet={lineDS} columns={lineColumns} columnResizable="true" />
          </div>
        )}
      </Content>
    </Fragment>
  );
};

export default OeeReport;
