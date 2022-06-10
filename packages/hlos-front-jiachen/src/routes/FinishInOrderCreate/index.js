import React, { Fragment, useState, useEffect } from 'react';
import { Header, Content } from 'components/Page';
import { DataSet, Button, Table } from 'choerodon-ui/pro';
import moment from 'moment';
import notification from 'utils/notification';
import { getCurrentOrganizationId } from 'utils/utils';
import { userSetting } from 'hlos-front/lib/services/api';
import { queryHeadDS } from '../../stores/finishInOrderCreateDS';
import { generateButton } from '../../services/finishInOrderCreateService';

const headDS = new DataSet(queryHeadDS());

const FinishInOrderCreate = () => {
  const [loadingFlag, setLoadingFlag] = useState(false);

  useEffect(() => {
    async function getUser() {
      const res = await userSetting({ defaultFlag: 'Y' });
      if (res && res.content) {
        const { meOuId, organizationId } = res.content[0];
        headDS.queryDataSet.getField('areaObj').setLovPara('meOuId', meOuId);
        headDS.getField('warehouseObj').setLovPara('organizationId', organizationId);
      }
    }
    getUser();
  }, []);

  async function submit() {
    const selectedData = headDS.selected;
    if (!selectedData.length) {
      notification.info({
        message: '请至少选择一条数据进行操作',
      });
      return;
    }
    const noWarehouseIdIndex = selectedData.findIndex((item) => {
      return !item.get('warehouseId');
    });
    if (noWarehouseIdIndex >= 0) {
      notification.error({
        message: '所选操作数据必须填写入库仓库',
      });
      return;
    }
    try {
      setLoadingFlag(true);
      const params = selectedData.map((item) => {
        return {
          attributeDecimal1: item.get('attributeDecimal1'),
          completedQty: item.get('completedQty'),
          description: item.get('description'),
          inventoryQuantity: item.get('inventoryQuantity'),
          itemCode: item.get('itemCode'),
          itemId: item.get('itemId'),
          makeQty: item.get('makeQty'),
          moId: item.get('moId'),
          moNum: item.get('moNum'),
          orgnizationName: item.get('orgnizationName'),
          planStartDate: item.get('planStartDate')
            ? moment(item.get('planStartDate')).format('YYYY-MM-DD HH:mm:ss')
            : '',
          remake: item.get('remake'),
          tenantId: getCurrentOrganizationId(),
          warehouseCode: item.get('warehouseCode'),
          warehouseId: item.get('warehouseId'),
          warehouseName: item.get('warehouseName'),
          wmAreaCode: item.get('wmAreaCode'),
          wmAreaId: item.get('wmAreaId'),
          wmAreaName: item.get('wmAreaName'),
        };
      });
      const res = await generateButton(params);
      if (res && Object.keys(res).indexOf('failed') !== -1 && res.failed) {
        notification.error({
          message: res.message,
        });
        setLoadingFlag(false);
      } else {
        notification.success({
          message: '操作成功',
        });
        setLoadingFlag(false);
        headDS.query();
      }
    } catch (error) {
      notification.error({
        message: error.message,
      });
      setLoadingFlag(false);
    }
  }

  const HeadColumns = [
    { name: 'orgnizationName' },
    { name: 'planStartDate' },
    { name: 'moNum', width: 150 },
    { name: 'itemCode', width: 150 },
    { name: 'description' },
    { name: 'makeQty' },
    { name: 'completedQty' },
    { name: 'attributeDecimal1' },
    { name: 'inventoryQuantity', editor: true },
    { name: 'warehouseObj', editor: true },
    { name: 'wmAreaObj', editor: true },
    { name: 'remake', editor: true },
  ];

  return (
    <Fragment>
      <Header title="完工入库单生成">
        <Button color="primary" loading={loadingFlag} disabled={loadingFlag} onClick={submit}>
          生成
        </Button>
      </Header>
      <Content>
        <Table dataSet={headDS} columns={HeadColumns} queryFieldsLimit={4} />
      </Content>
    </Fragment>
  );
};

export default FinishInOrderCreate;
