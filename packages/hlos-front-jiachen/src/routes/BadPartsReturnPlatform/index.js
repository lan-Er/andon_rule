import React, { Fragment, useState, useEffect } from 'react';
import { Header, Content } from 'components/Page';
import { DataSet, Button, Table } from 'choerodon-ui/pro';
import notification from 'utils/notification';
import { userSetting } from 'hlos-front/lib/services/api';
import { queryHeadDS, queryLineDS } from '../../stores/badPartsReturnPlatformDS';
import {
  deleteButton,
  closeButton,
  warehouseExecuteButton,
  qualityAuditButton,
  workshopExecuteButton,
} from '../../services/badPartsReturnPlatformService';

const headDS = new DataSet(queryHeadDS());
const lineDS = new DataSet(queryLineDS());

const BadPartsReturnPlatform = ({ history }) => {
  const [userMsg, setUserMsg] = useState({});
  const [isShowLine, setIsShowLine] = useState(false);

  useEffect(() => {
    headDS.addEventListener('query', () => setIsShowLine(false));
    headDS.query();

    async function getUser() {
      const res = await userSetting({ defaultFlag: 'Y' });
      if (res && res.content) {
        const { meOuId } = res.content[0];
        headDS.queryDataSet.getField('areaObj').setLovPara('meOuId', meOuId);
        setUserMsg(res.content[0]);
      }
    }
    getUser();
  }, []);

  function checkChooseData() {
    const selectedData = headDS.selected;
    if (!selectedData.length) {
      notification.warning({
        message: '请至少选择一条数据进行操作',
      });
      return [];
    }
    const requestIds = selectedData.map((item) => {
      return item.get('requestId');
    });
    return requestIds;
  }

  function goAdd() {
    history.push({
      pathname: '/jc/bad-parts-return-platform/add',
      state: {
        backPath: '/jc/bad-parts-return-platform/list',
        meOuId: userMsg.meOuId,
        organizationId: userMsg.organizationId,
      },
    });
  }

  async function headOptions(type) {
    const chooseRequestIds = checkChooseData();
    if (chooseRequestIds.length === 0) {
      return;
    }
    const params = chooseRequestIds;
    let res = null;
    if (type === 'delete') {
      // 删除
      res = await deleteButton(params);
    } else if (type === 'close') {
      // 关闭
      res = await closeButton(params);
    } else if (type === 'workshop') {
      // 车间执行
      res = await workshopExecuteButton(params);
    } else if (type === 'warehouse') {
      // 仓库执行
      res = await warehouseExecuteButton(params);
    } else if (type === 'quality') {
      // 质检审批
      res = await qualityAuditButton(params);
    }
    if (res && Object.keys(res).indexOf('failed') !== -1 && res.failed) {
      notification.error({
        message: res.message,
        duration: 5,
      });
    } else if (res) {
      notification.success({
        message: '操作成功',
      });
      headDS.query();
    }
  }

  function handleClick({ record }) {
    return {
      onClick: () => {
        setIsShowLine(true);
        lineDS.queryParameter = { requestId: record.data.requestId };
        lineDS.query();
      },
    };
  }

  function handleEdit(record) {
    if (record.data.requestStatus !== 'NEW') {
      notification.warning({
        message: '只有新建状态的退换单可以修改',
      });
      return;
    }
    history.push({
      pathname: `/jc/bad-parts-return-platform/edit/${record.data.requestId}`,
      state: {
        backPath: '/jc/bad-parts-return-platform/list',
        meOuId: userMsg.meOuId,
        organizationId: userMsg.organizationId,
        headData: record.data, // 头表数据
      },
    });
  }

  const HeadColumns = [
    {
      name: 'requestNum',
      width: 150,
      renderer: ({ record }) => {
        const { requestNum } = record.data;
        return (
          <div>
            <a onClick={() => handleEdit(record)}>{`${requestNum}`}</a>
          </div>
        );
      },
    },
    { name: 'requestStatusMeaning' },
    { name: 'requestDepartmentName' },
    { name: 'toWarehouseName' },
    { name: 'toWmAreaName' },
    { name: 'warehouseName' },
    { name: 'wmAreaName' },
  ];

  const LineColumns = [
    { name: 'requestLineNum' },
    { name: 'moNum', width: 150 },
    { name: 'itemCode', width: 150 },
    { name: 'description' },
    { name: 'componentItemCode', width: 150 },
    { name: 'componentDescription' },
    { name: 'tagCode', width: 150 },
    { name: 'lotNumber', width: 150 },
    { name: 'applyQty' },
    { name: 'remark' },
  ];

  return (
    <Fragment>
      <Header title="坏件退换平台">
        <Button color="primary" onClick={() => headOptions('quality')}>
          质检审批
        </Button>
        <Button color="primary" onClick={() => headOptions('warehouse')}>
          仓库执行
        </Button>
        <Button color="primary" onClick={() => headOptions('workshop')}>
          车间执行
        </Button>
        <Button color="primary" onClick={() => headOptions('close')}>
          关闭
        </Button>
        <Button color="primary" onClick={() => headOptions('delete')}>
          删除
        </Button>
        <Button color="primary" onClick={goAdd}>
          新建
        </Button>
      </Header>
      <Content>
        <Table
          dataSet={headDS}
          columns={HeadColumns}
          queryFieldsLimit={4}
          onRow={(record) => handleClick(record)}
          pagination={{
            onChange: () => setIsShowLine(false),
          }}
        />
        {isShowLine && <Table selectionMode="none" dataSet={lineDS} columns={LineColumns} />}
      </Content>
    </Fragment>
  );
};

export default BadPartsReturnPlatform;
