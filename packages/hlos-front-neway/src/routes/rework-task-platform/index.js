import React, { useState, useEffect, useMemo } from 'react';
import { Header, Content } from 'components/Page';
import { DataSet, Table, Lov } from 'choerodon-ui/pro';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import { yesOrNoRender } from 'utils/renderer';
import { useDataSetEvent, useDataSet } from 'utils/hooks';
import qs from 'querystring';
import { userSetting } from 'hlos-front/lib/services/api';

import { ListTableDs, ReworkOrderDs } from '@/stores/reworkTaskPlatformDs';

import styles from './style.module.less';
import ReworkOrderList from './ReworkOrderList';

// const commonCode = 'lmes.common';
// const organizationId = getCurrentOrganizationId();

const preCode = 'neway.reworkTaskPlatform.model';

const ReworkTaskPlatform = (props) => {
  const listDs = useDataSet(() => new DataSet(ListTableDs()), ReworkTaskPlatform);
  const reworkOrderDs = useMemo(() => new DataSet(ReworkOrderDs()), []);

  const [showLine, setShowLine] = useState(false);

  useDataSetEvent(listDs, 'load', ({ dataSet }) => {
    if (dataSet.current) {
      setShowLine(false);
    }
  });

  useEffect(() => {
    async function getUserInfo() {
      const res = await userSetting({ defaultFlag: 'Y' });
      if (res && res.content && res.content.length) {
        listDs.queryDataSet.current.set('organizationLov', {
          meOuName: res.content[0].meOuName,
          meOuId: res.content[0].meOuId,
        });
        listDs.query();
      }
    }
    getUserInfo();
  }, [listDs]);

  const columns = [
    { name: 'organizationName', width: 130 },
    { name: 'taskNum', width: 130 },
    { name: 'productCode', width: 120 },
    { name: 'itemDesc', width: 150 },
    { name: 'operationName', width: 150 },
    { name: 'uom', width: 80 },
    { name: 'reworkQty', width: 100 },
    { name: 'taskQty', width: 100 },
    { name: 'description', width: 150 },
    { name: 'documentNum', width: 150 },
    { name: 'documentTypeName', width: 130 },
    { name: 'sourceTaskNum', width: 150 },
    { name: 'taskStatus', width: 100 },
    {
      name: 'firstOperationFlag',
      width: 100,
      renderer: ({ value }) => {
        return yesOrNoRender(Number(value));
      },
    },
    {
      name: 'lastOperationFlag',
      width: 100,
      renderer: ({ value }) => {
        return yesOrNoRender(Number(value));
      },
    },
    { name: 'workCenterName', width: 120 },
    { name: 'workGroupName', width: 120 },
    { name: 'workName', width: 120 },
    { name: 'actualStartTime', width: 150 },
    { name: 'actualEndTime', width: 150 },
    {
      header: intl.get('hzero.common.button.action').d('操作'),
      width: 200,
      align: 'center',
      renderer: ({ record }) => {
        return (
          <div className={styles['td-action']}>
            <a onClick={() => handleClickCreate('control', record)}>
              <p>创建工序返修</p>
              <p>(卡控工单)</p>
            </a>
            <a onClick={() => handleClickCreate('unControl', record)}>
              <p>创建工序返修</p>
              <p>(不卡控工单)</p>
            </a>
          </div>
        );
      },
      lock: 'right',
    },
  ];

  function handleClickCreate(type, record) {
    props.history.push({
      pathname: `/neway/rework-task-platform/create`,
      search: qs.stringify({
        type,
      }),
      state: {
        actualReworkQty: record.get('actualReworkQty'),
        taskId: record.get('taskId'),
        taskNum: record.get('taskNum'),
      },
    });
  }

  const handleRowChange = (record) => {
    return {
      onClick: () => {
        setShowLine(true);
        // setMoId(record.get('moId'));
        reworkOrderDs.setQueryParameter('sourceDocId', record.get('taskId'));
        reworkOrderDs.query();
      },
    };
  };

  function handleToDetail(record) {
    props.history.push({
      pathname: `/neway/rework-task-platform/detail/${record.get('moId')}`,
    });
  }

  return (
    <>
      <Header title={intl.get(`${preCode}.view.title.reworkTaskPlatform`).d('返修任务平台')} />
      <Content>
        <div className={styles['table-top']}>
          <Table
            dataSet={listDs}
            columns={columns}
            onRow={({ record }) => handleRowChange(record)}
            columnResizable="true"
            queryFields={{
              moNumLov: <Lov maxTagCount={1} name="moNumLov" />,
            }}
          />
        </div>

        <div style={showLine ? { display: 'block', marginTop: '30px' } : { display: 'none' }}>
          <div style={{ marginBottom: '20px', fontSize: '16px' }}>
            {intl.get(`${preCode}.reworkOrder`).d('返修工单')}
          </div>
          <ReworkOrderList tableDs={reworkOrderDs} handleToDetail={handleToDetail} />
        </div>
      </Content>
    </>
  );
};

export default formatterCollections({ code: 'neway.reworkTaskPlatform' })(ReworkTaskPlatform);
