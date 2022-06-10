/*
 * @Description: 安灯统计
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2020-06-01 10:10:00
 * @LastEditors: 赵敏捷
 */

import { DataSet, Lov, Radio, DatePicker } from 'choerodon-ui/pro';
import React, { useEffect, useMemo, useCallback, Fragment, useState } from 'react';

import intl from 'utils/intl';
import codeConfig from '@/common/codeConfig';
import { Header } from 'components/Page';
import { getResponse } from 'hzero-front/lib/utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import { queryLovData } from 'hlos-front/lib/services/api';

import { andonStatisticDSConfig } from '../../stores/andonStatisticDS';
import styles from './index.module.less';
import Charts from './components/Charts';
import List from './components/List';
import { debounce } from './components/utils';

const intlPrefix = 'lmes.andonStatistic';
const { lmesAndonStatistic } = codeConfig.code;

function AndonStatistic({ dispatch }) {
  const ds = useMemo(() => new DataSet(andonStatisticDSConfig()), []);
  const [filterOptionsValid, setFilterOptionsValid] = useState(false);
  const [filterData, setFilterData] = useState({});

  useEffect(() => {
    validateDS();
  }, [validateDS]);

  useEffect(() => {
    async function queryDefaultFactory() {
      const res = await queryLovData({ lovCode: lmesAndonStatistic.factory, defaultFlag: 'Y' });
      if (getResponse(res)) {
        if (res.content[0]) {
          ds.current.set('factoryObj', {
            meOuId: res.content[0].meOuId,
            meOuCode: res.content[0].meOuCode,
            meOuName: res.content[0].meOuName,
          });
          handleDSUpdate();
        }
      }
    }
    queryDefaultFactory();
    const handleDSUpdate = debounce(validateDS, 500);
    ds.addEventListener('update', handleDSUpdate);
    return () => {
      ds.removeEventListener('update', handleDSUpdate);
    };
  }, [ds, dispatch, validateDS]);

  const validateDS = useCallback(async () => {
    setFilterData(ds.current);
    const dsValid = await ds.validate(false, false);
    setFilterOptionsValid(dsValid);
    if (dsValid) {
      dispatch({
        type: 'andonStatistic/toggleFilterChange',
      }).then(() => {
        setTimeout(() => {
          dispatch({
            type: 'andonStatistic/toggleFilterChange',
          });
        });
      });
    }
  }, [ds, dispatch]);

  return (
    <div className={styles.andonStatistic}>
      <Header
        title={
          <Fragment>
            <Lov name="factoryObj" dataSet={ds} style={{ marginRight: '16px', fontSize: '12px' }} />
            <Lov name="prodLineObj" dataSet={ds} style={{ fontSize: '12px' }} />
          </Fragment>
        }
      >
        <DatePicker
          dataSet={ds}
          name="endDate"
          placeholder={intl.get(`${intlPrefix}.view.button.dateEnd`).d('结束时间')}
        />
        <DatePicker
          dataSet={ds}
          name="startDate"
          style={{ marginRight: '12px' }}
          placeholder={intl.get(`${intlPrefix}.view.button.dateStart`).d('开始日期')}
        />
        <Radio
          dataSet={ds}
          mode="button"
          name="period"
          value="MONTH"
          style={{ marginRight: '12px' }}
        >
          {intl.get(`${intlPrefix}.view.button.currentMonth`).d('当月')}
        </Radio>
        <Radio dataSet={ds} mode="button" name="period" value="WEEK">
          {intl.get(`${intlPrefix}.view.button.currentWeek`).d('当周')}
        </Radio>
        <Radio dataSet={ds} mode="button" name="period" value="DAY">
          {intl.get(`${intlPrefix}.view.button.currentDay`).d('当天')}
        </Radio>
      </Header>
      <div className={styles.wrapper}>
        <Charts
          filterData={filterData}
          filterOptionsValid={filterOptionsValid}
          period={filterData.get?.('period') || 'WEEK'}
        />
        <List filterData={filterData} filterOptionsValid={filterOptionsValid} />
      </div>
    </div>
  );
}

export default formatterCollections({ code: [`${intlPrefix}`] })(AndonStatistic);
