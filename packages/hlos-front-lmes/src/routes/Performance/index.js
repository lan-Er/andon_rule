/*
 * @Description: 任务报工-员工实绩
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2020-11-25 10:08:49
 */

import React, { useState, useMemo, useEffect } from 'react';
import { DataSet, Table } from 'choerodon-ui/pro';
import { isEmpty } from 'lodash';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import defaultAvatarIcon from 'hlos-front/lib/assets/img-default-avator.png';
import LogoImg from 'hlos-front/lib/assets/icons/logo.svg';
import Time from 'hlos-front/lib/components/Time.js';
import { PerformanceDS } from '@/stores/performanceDS';
import SubHeader from './SubHeader';
import './style.less';

const per = () => new DataSet(PerformanceDS());

function EmployeePerformance(props) {
  const perDS = useDataSet(per, EmployeePerformance);
  const [fileUrl, setFileUrl] = useState(null);
  const timeComponent = useMemo(() => <Time />, []);

  const handleQueryChange = async (value) => {
    const isValid = await perDS.queryDataSet.validate(false, false);
    if (!isValid) {
      return;
    }

    if (value && value.workerId && value.fileUrl) {
      setFileUrl(value.fileUrl);
    }
    perDS.query();
  };

  useEffect(() => {
    const {
      location: { search },
    } = props;
    if (!isEmpty(search)) {
      const obj = JSON.parse(decodeURIComponent(search.substring(1)));
      if (perDS.queryDataSet.current) {
        perDS.queryDataSet.current.set('workerObj', obj);
        perDS.queryDataSet.current.set('executeTime', new Date());
      } else {
        perDS.queryDataSet.create({
          workerObj: obj,
          executeTime: new Date(),
        });
      }
    }
  }, []);

  const getColumns = () => {
    return [
      {
        name: 'executeTime',
        width: 120,
        tooltip: 'overflow',
      },
      {
        name: 'itemCode&itemDescription',
        width: 120,
        tooltip: 'overflow',
        renderer: ({ record }) => `${record.get('itemCode')}-${record.get('itemDescription')}`,
      },
      {
        name: 'operationName',
        width: 120,
        tooltip: 'overflow',
      },
      {
        name: 'uomName',
        width: 120,
        tooltip: 'overflow',
      },
      {
        name: 'executeQty',
        width: 120,
        tooltip: 'overflow',
      },
      {
        name: 'executeNgQty',
        width: 120,
        tooltip: 'overflow',
      },
      {
        name: 'scrappedQty',
        width: 120,
        tooltip: 'overflow',
      },
      {
        name: 'reworkQty',
        width: 120,
        tooltip: 'overflow',
      },
      {
        name: 'pendingQty',
        width: 120,
        tooltip: 'overflow',
      },
      {
        name: 'executeTypeMeaning',
        width: 120,
        tooltip: 'overflow',
      },
      {
        name: 'documentNumber',
        width: 120,
        tooltip: 'overflow',
        renderer: ({ record }) => `${record.get('moNum')}-${record.get('taskNum')}`,
      },
      {
        name: 'tagCode',
        width: 120,
        tooltip: 'overflow',
      },
      {
        name: 'lotNumber',
        width: 120,
        tooltip: 'overflow',
      },
      {
        name: 'position',
        width: 120,
        tooltip: 'overflow',
        renderer: ({ record }) => {
          let str = '';
          if (record.get('prodLineName')) {
            str += `${record.get('prodLineName')}-`;
          }
          if (record.get('workcellName')) {
            str += `${record.get('workcellName')}-`;
          }
          if (record.get('equipmentName')) {
            str += record.get('equipmentName');
          }
          return str;
        },
      },
      {
        name: 'projectNum',
        width: 120,
        tooltip: 'overflow',
      },
      {
        name: 'wbsNum',
        width: 120,
        tooltip: 'overflow',
      },
    ];
  };

  const handleCancel = () => {
    // to do
  };

  const handleBack = () => {
    window.close();
  };

  return (
    <div className="employee-performance">
      <div className="lmes-task-report-header">
        <div className="header-left">
          <img src={LogoImg} alt="" />
        </div>
        <div className="header-right">
          <span className="date-time">{timeComponent}</span>
        </div>
      </div>
      <div className="employee-performance-sub-header">
        <div className="avator-img">
          <img src={fileUrl || defaultAvatarIcon} alt="" />
        </div>
        <div className="right-part">
          <SubHeader headerDS={perDS.queryDataSet} onQuery={handleQueryChange} />
        </div>
      </div>
      <div className="employee-performance-content">
        <Table
          dataSet={perDS}
          columns={getColumns()}
          columnResizable="true"
          editMode="inline"
          queryBar="none"
        />
      </div>
      <div className="employee-performance-buttons">
        <div className="button-text button-cancel" onClick={handleCancel}>
          撤销
        </div>
        <div className="button-text button-back" onClick={handleBack}>
          返回
        </div>
      </div>
    </div>
  );
}

export default EmployeePerformance;
