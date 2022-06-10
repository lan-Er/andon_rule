import React, { Fragment, useState, useEffect } from 'react';
import { Header, Content } from 'components/Page';
import { DataSet, Table } from 'choerodon-ui/pro';
import { Button as ButtonPermission } from 'components/Permission';
import notification from 'utils/notification';
import { userSetting } from 'hlos-front/lib/services/api';
import { closeButton, submitButton } from '../../services/finishInOrderPlatformService';
import { queryHeadDS, queryLineDS } from '../../stores/finishInOrderPlatformDS';

const headDS = new DataSet(queryHeadDS());
const lineDS = new DataSet(queryLineDS());

const FinishInOrderPlatform = () => {
  const [isShowLine, setIsShowLine] = useState(false);

  useEffect(() => {
    headDS.addEventListener('query', () => setIsShowLine(false));
    async function getUser() {
      const res = await userSetting({ defaultFlag: 'Y' });
      if (res && res.content) {
        const { meOuId } = res.content[0];
        headDS.queryDataSet.getField('areaObj').setLovPara('meOuId', meOuId);
      }
    }
    getUser();
  }, []);

  async function close() {
    const selectedData = headDS.selected;
    if (!selectedData.length) {
      notification.info({
        message: '请至少选择一条数据进行操作',
      });
      return;
    }
    const chooseRequestIds = selectedData.map((item) => {
      return item.get('requestId');
    });
    const params = chooseRequestIds.map((item) => {
      return {
        requestId: item,
      };
    });
    const res = await closeButton(params);
    if (res && Object.keys(res).indexOf('failed') !== -1 && res.failed) {
      notification.error({
        message: res.message,
      });
    } else {
      notification.success({
        message: '操作成功',
      });
      setIsShowLine(false);
      headDS.query();
    }
  }
  async function submit() {
    const selectedData = headDS.selected;
    if (!selectedData.length) {
      notification.info({
        message: '请至少选择一条数据进行操作',
      });
      return;
    }
    const chooseRequestIds = selectedData.map((item) => {
      return item.get('requestId');
    });
    const params = chooseRequestIds.map((item) => {
      return {
        requestId: item,
      };
    });
    const res = await submitButton(params);
    if (res && Object.keys(res).indexOf('failed') !== -1 && res.failed) {
      notification.error({
        message: res.message,
      });
    } else {
      notification.success({
        message: '操作成功',
      });
      setIsShowLine(false);
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

  const HeadColumns = [
    { name: 'requestNum', width: 150 },
    { name: 'organizationName' },
    { name: 'moNum', width: 150 },
    { name: 'assemblyItemCode', width: 150 },
    { name: 'description' },
    { name: 'requestStatusMeaning' },
    { name: 'applyQty' },
    { name: 'executedQty' },
    { name: 'resourceName' },
    { name: 'creationDate' },
    { name: 'operator' },
    { name: 'executedTime' },
    { name: 'attributeName' },
    { name: 'attributeDatetime1' },
    { name: 'shutDownPeople' },
    { name: 'attributeDatetime2' },
  ];

  return (
    <Fragment>
      <Header title="完工入库单平台">
        <ButtonPermission
          color="primary"
          onClick={submit}
          type="c7n-pro"
          permissionList={[
            {
              code: `hlos.lwms.wip.completion.ps.button.platfrom.submit`,
              type: 'button',
              meaning: '完工入库单提交按钮',
            },
          ]}
        >
          提交
        </ButtonPermission>
        <ButtonPermission
          color="primary"
          onClick={close}
          type="c7n-pro"
          permissionList={[
            {
              code: `hlos.lwms.wip.completion.ps.button.platfrom.close`,
              type: 'button',
              meaning: '完工入库单关闭按钮',
            },
          ]}
        >
          关闭
        </ButtonPermission>
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
        {isShowLine && (
          <Table
            dataSet={lineDS}
            columns={[{ name: 'tagCode' }, { name: 'lotNumber' }, { name: 'executedQty' }]}
          />
        )}
      </Content>
    </Fragment>
  );
};

export default FinishInOrderPlatform;
