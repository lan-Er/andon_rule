/*
 * @module: 客户采购明细
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2021-06-23 09:47:08
 * @LastEditTime: 2021-06-25 20:31:43
 * @copyright: Copyright (c) 2020,Hand
 */

import React, { Fragment, useMemo, useState, useEffect } from 'react';
import { Table, DataSet, Button, TextField, DateTimePicker, Lov, Select } from 'choerodon-ui/pro';

import codeConfig from '@src/common/codeConfig';
import { isUndefined, isEmpty } from 'lodash';
import { myModule } from '@src/common/index';
import notification from 'utils/notification';
import ExcelExport from 'components/ExcelExport';
import { Header, Content } from 'components/Page';
import TableQueryFrom from '@src/components/TableQueryFrom';
import {
  handleSaveServices,
  handleGenerateServices,
} from '@src/services/customerPurchaseDetailsServices';
import { queryLovData } from 'hlos-front/lib/services/api';
import { useDataSet, useDataSetEvent, useClearDataSet } from '@src/utils/hook';
import { filterNullValueObject, getCurrentOrganizationId, getResponse } from 'utils/utils';

import formDs from './store';

const { common } = codeConfig.code;
const organizationId = getCurrentOrganizationId();
export default function CustomerPurchaseDetails() {
  const [generateLoading, setGenerateLoading] = useState<boolean>(false);
  const [buttonColor] = useState<any>('primary');
  const [queryBar] = useState<any>('none');
  const [queryLoading, setQueryLoading] = useState<boolean>(false);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const tableDs: any = useDataSet(() => new DataSet(formDs()), 'grwlCustomerPurchaseDetails');

  const getColumns: object[] = useMemo(() => {
    return [
      { name: 'soLineStatusMeaning', lock: true, width: 128 },
      { name: 'poNum', width: 138, lock: true },
      { name: 'customerNumber' },
      { name: 'customerName', width: 180 },
      { name: 'poLineNum' },
      { name: 'itemCode' },
      { name: 'itemDescription', width: 160, tooltip: 'overflow' },
      { name: 'demandQty' },
      { name: 'inventoryQty' },
      { name: 'notInventoryQty' },
      { name: 'notReceiveQty' },
      { name: 'returnedQty', editor: (editor) => editor.isSelected },
      { name: 'notGeneratedReturnedQty' },
      { name: 'returnWarehouseObj', editor: (editor) => editor.isSelected, width: 120 },
      { name: 'generatedReturnedQty' },
      { name: 'shippedQty', editor: (editor) => editor.isSelected },
      { name: 'unitPrice' },
      { name: 'lineAmount' },
      { name: 'uom' },
      { name: 'demandDate', width: 160 },
      { name: 'promiseDate', width: 160 },
      { name: 'designCode' },
      { name: 'specification' },
      { name: 'remark' },
      { name: 'buyer' },
      { name: 'publishDate', width: 160 },
      { name: 'confirmDate', width: 160 },
      { name: 'creationDate', width: 160 },
      { name: 'externalNum', width: 120 },
    ];
  }, []);

  useEffect(() => {
    async function defaultLovSetting() {
      const res = await queryLovData({ lovCode: common.organization, defaultFlag: 'Y' });
      if (getResponse(res)) {
        if (!isEmpty(res.content)) {
          const organizationObjGrwl = res.content[0].organizationId;
          sessionStorage.setItem('organizationObjGrwl', organizationObjGrwl);
        }
      }
    }
    defaultLovSetting();
  }, []);
  /**
   * @description: 改变查询条件
   * @param {*} param1
   * @return {*}
   */
  function handleChangeQuery({ name, record }): void {
    if (name === 'poNum') {
      record.set('poLineNum', '');
    }
  }

  useDataSetEvent(tableDs.queryDataSet, 'update', handleChangeQuery);

  useEffect(() => {
    return () => {
      useClearDataSet('grwlCustomerPurchaseDetails');
    };
  }, []);

  /**
   * @description: 查询
   * @param {*}
   * @return {*}
   */
  function handleQuery(): void {
    setQueryLoading(true);
    tableDs
      .query()
      .then(() => {
        setQueryLoading(false);
      })
      .catch((err) => {
        setQueryLoading(false);
        console.log(err, 'err');
      });
  }

  /**
   * @description: 导出
   * @param {*}
   * @return {*}
   */
  function getExportQueryParams(): object {
    const formObj = tableDs.queryDataSet.current;
    const fieldsValue = isUndefined(formObj) ? {} : filterNullValueObject(formObj.toJSONData());
    return {
      ...fieldsValue,
    };
  }

  /**
   * @description: 保存
   * @param {*}
   * @return {*}
   */
  function handleSave(): void {
    const { selected } = tableDs;
    if (selected.length < 1) {
      notification.warning({ message: '请至少选择一条数据', placement: 'bottomRight' });
      return;
    }
    setSaveLoading(true);
    const params = selected.map((item) => {
      return { shippedQty: item.get('shippedQty'), soLineId: item.get('soLineId') };
    });
    handleSaveServices(params)
      .then((res) => {
        if (res && res.failed) {
          notification.error({ message: res.message });
        } else {
          notification.success({ message: '保存成功' });
          handleQuery();
        }
        setSaveLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setSaveLoading(false);
      });
  }

  /**
   * @description: 生成退货单
   * @param {*}
   * @return {*}
   */
  function handleGenerate(): void {
    const { selected } = tableDs;
    if (selected.length < 1) {
      notification.warning({ message: '请至少选择一条数据', placement: 'bottomRight' });
      return;
    }
    setGenerateLoading(true);
    const params = selected.map((item) => {
      return {
        returnQty: item.get('returnedQty'),
        returnWarehouseCode: item.get('returnWarehouseCode'),
        returnWarehouseId: item.get('returnWarehouseId'),
        soLineId: item.get('soLineId'),
      };
    });
    handleGenerateServices(params)
      .then((res) => {
        if (res && res.failed) {
          notification.error({ message: res.message });
        } else {
          notification.success({ message: '生成退货单成功' });
          handleQuery();
        }
        setGenerateLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setGenerateLoading(false);
      });
  }
  return (
    <Fragment>
      <Header title="客户采购明细">
        <Button loading={generateLoading} color={buttonColor} onClick={handleGenerate}>
          生成退货单
        </Button>
        <Button onClick={handleSave} loading={saveLoading}>
          保存
        </Button>
        <ExcelExport
          requestUrl={`${myModule.lsops}/v1/${organizationId}/grwl-so-lines/customer-po-detail-export`}
          queryParams={getExportQueryParams}
          exportAsync="true"
        />
      </Header>
      <Content>
        <TableQueryFrom
          dataSet={tableDs.queryDataSet}
          onClickQueryCallback={handleQuery}
          queryLoading={queryLoading}
        >
          <TextField name="customerName" />
          <TextField name="poNum" />
          <TextField name="poLineNum" />
          <DateTimePicker name="creationDateStart" />
          <DateTimePicker name="creationDateEnd" />
          <DateTimePicker name="demandDateStart" />
          <DateTimePicker name="demandDateEnd" />
          <TextField name="buyer" />
          <Select name="soLineStatusList" />
          <Lov name="itemObject" noCache />
          <TextField name="inventoryQty" />
          <TextField name="notGeneratedReturnedQty" />
        </TableQueryFrom>
        <Table dataSet={tableDs} columns={getColumns} queryBar={queryBar} />
      </Content>
    </Fragment>
  );
}
