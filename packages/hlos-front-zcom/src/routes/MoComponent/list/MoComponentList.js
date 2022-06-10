/**
 * @Description: MO组件
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-01-27 15:13:29
 */

import React, { useContext, useEffect, useState } from 'react';
import ExcelExport from 'components/ExcelExport';
import { Header, Content } from 'components/Page';
import {
  Table,
  Lov,
  Form,
  Button,
  TextField,
  DatePicker,
  CheckBox,
  Select,
  TextArea,
} from 'choerodon-ui/pro';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { getCurrentOrganizationId, filterNullValueObject, getResponse } from 'utils/utils';
import { HLOS_ZCOM } from 'hlos-front/lib/utils/config';
import { queryLovData } from 'hlos-front/lib/services/api';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import codeConfig from '@/common/codeConfig';
import { moSave, moSubmit } from '@/services/moComponentService';
import Store from '../store/MoComponentDS';

const preCode = 'zcom.moComponent';
const { common } = codeConfig.code;
const organizationId = getCurrentOrganizationId();

export default () => {
  const { dataSet } = useContext(Store);
  const [disabledFlag, changeDisable] = useState(true);
  const [typeEditable, setTypeEditable] = useState(false);

  useEffect(() => {
    async function defaultLovSetting() {
      const res = await Promise.all([
        queryLovData({ lovCode: common.organization, defaultFlag: 'Y' }),
        queryLovData({ lovCode: common.moNum, defaultFlag: 'Y' }),
      ]);
      const fail = res.find((item) => item.fail);
      if (getResponse(res) && !fail) {
        if (res[0] && res[0].content[0]) {
          dataSet.queryDataSet.current.set('organzationObj', {
            organizationId: res[0].content[0].organizationId,
            organizationCode: res[0].content[0].organizationCode,
            organizationName: res[0].content[0].organizationName,
          });
        }
        if (res[1] && res[1].content && res[1].content[0]) {
          dataSet.queryDataSet.current.set('moNumObj', {
            moId: res[1].content[0].moId,
            moNum: res[1].content[0].moNum,
          });
        }
      }
    }
    defaultLovSetting();
  }, [dataSet]);

  /**
   *表格
   * @returns
   */
  function columns() {
    const arr = [
      { name: 'lineNum', width: 150, lock: true, align: 'left' },
      {
        name: 'organizationObj',
        width: 150,
        lock: true,
        editor: (record) => (record.status === 'add' ? <Lov noCache /> : null),
      },
      {
        name: 'componentItemObj',
        width: 150,
        lock: true,
        editor: (record) => (record.status === 'add' ? <Lov noCache /> : null),
      },
      { name: 'componentDescription', width: 150 },
      {
        name: 'operation',
        width: 150,
        editor: (record) => (record.status === 'add' ? <TextField /> : null),
      },
      { name: 'uomName', width: 150 },
      { name: 'demandQty', width: 150, editor: !disabledFlag },
      { name: 'demandDate', width: 180, editor: !disabledFlag },
      { name: 'price', width: 150, editor: !disabledFlag },
      // { name: 'approvalOpinion', width: 150 },
      { name: 'componentUsage', width: 150 },
      { name: 'bomUsage', width: 150, editor: !disabledFlag },
      { name: 'issuedQty', width: 150 },
      { name: 'componentNgQty', width: 150 },
      { name: 'processScrapedQty', width: 150 },
      { name: 'backflushQty', width: 150 },
      {
        name: 'keyComponentFlag',
        width: 100,
        renderer: yesOrNoRender,
        editor: (record) => (record.editing ? <CheckBox /> : false),
      },
      { name: 'supplyType', width: 150, editor: !disabledFlag },
      { name: 'supplyWarehouseObj', width: 150, editor: !disabledFlag },
      { name: 'supplyWmAreaObj', width: 150, editor: !disabledFlag },
      { name: 'substitutePolicy', width: 150, editor: !disabledFlag },
      { name: 'substituteGroup', width: 150, editor: !disabledFlag },
      { name: 'substitutePriority', width: 150, editor: !disabledFlag },
      { name: 'substitutePercent', width: 150, editor: !disabledFlag },
      { name: 'departmentObj', width: 150, editor: !disabledFlag },
      { name: 'ecnNum', width: 150, editor: !disabledFlag },
      { name: 'specifySupplierObj', width: 150, editor: !disabledFlag },
      { name: 'specifyLotNumber', width: 150, editor: !disabledFlag },
      { name: 'specifyTagCode', width: 150, editor: !disabledFlag },
      { name: 'remark', width: 150, editor: !disabledFlag },
      // {
      //   header: intl.get('hzero.common.button.action').d('操作'),
      //   width: 120,
      //   command: ['edit', ['delete']],
      //   lock: 'right',
      // },
    ];
    return typeEditable
      ? arr.concat({
          header: intl.get('hzero.common.button.action').d('操作'),
          width: 120,
          command: ['edit', ['delete']],
          lock: 'right',
        })
      : arr;
  }

  /**
   *取消表格自带的查询栏。
   * @returns
   */
  function renderBar() {
    return <div />;
  }

  /**
   *导出字段
   * @returns
   */
  function getExportQueryParams() {
    const queryDataDs = dataSet && dataSet.queryDataSet && dataSet.queryDataSet.current;
    const queryDataDsValue = queryDataDs ? filterNullValueObject(queryDataDs.toData()) : {};
    return {
      tenantId: organizationId,
      ...queryDataDsValue,
    };
  }

  /**
   * 查询
   */
  async function handleSearch() {
    const validateValue = await dataSet.validate(false, false);
    if (!validateValue) {
      return;
    }
    await dataSet.query();
    const res = dataSet.toData();
    if (res && res[0]) {
      setTypeEditable(
        ['CREATED', 'REFUSED'].includes(res[0].moComponentStatus) || !res[0].moComponentStatus
      );
      dataSet.queryDataSet.current.set('moFixedStatus', res[0].moFixedStatus);
      dataSet.queryDataSet.current.set('moComponentStatusMeaning', res[0].moComponentStatusMeaning);
      dataSet.queryDataSet.current.set('approvalOpinion', res[0].approvalOpinion);
    }
  }

  /*
    清空操作
  */
  function handleChange() {
    dataSet.queryDataSet.current.set('moNumObj', null);
    const status = dataSet.queryDataSet.current.get('moStatus');
    if (status !== null && status !== undefined) {
      if (status !== 'PENDING' && status !== 'CANCELLED' && status !== 'CLOSED') {
        changeDisable(false);
      } else changeDisable(true);
    } else changeDisable(true);
    dataSet.reset();
  }

  /*
    根据状态设置可用
  */
  function handleChangeFlag(value) {
    const status = dataSet.queryDataSet.current.get('moStatus');
    if (status !== null && status !== undefined) {
      if (status !== 'PENDING' && status !== 'CANCELLED' && status !== 'CLOSED') {
        changeDisable(false);
      } else changeDisable(true);
    } else changeDisable(true);
    if (value !== null) {
      if (
        dataSet.queryDataSet.current.get('organzationObj') !== undefined &&
        dataSet.queryDataSet.current.get('organzationObj') !== null
      ) {
        handleSearch();
      }
    }
  }

  /*
    设置新增初始值
  */
  function handleAddChildrenList() {
    if (!dataSet.queryDataSet.current.get('moFixedStatus')) {
      notification.warning({
        message: '请选择维修类型',
      });
      return;
    }
    dataSet.create(
      {
        lineNum: getLineNum(),
        organizationObj: getDefaultOrg(),
        organizationId: dataSet.queryDataSet.current.get('organizationId'),
        organizationCode: dataSet.queryDataSet.current.get('organizationCode'),
        moId: dataSet.queryDataSet.current.get('moId'),
        moNum: dataSet.queryDataSet.current.get('moNum'),
        moFixedStatus: dataSet.queryDataSet.current.get('moFixedStatus'),
      },
      0
    );
  }

  /*
    设置新增行号
   */
  function getLineNum() {
    const lineNum = dataSet.data.length;
    if (lineNum === 0) {
      return 1;
    } else {
      const numArray = dataSet.toData();
      const realNum = numArray[lineNum - 1].lineNum + 1;
      return realNum;
    }
  }

  /*
    设置新增初始值:组织字段
   */
  function getDefaultOrg() {
    const defauleOrg = dataSet.queryDataSet.current.get('organzationObj');
    if (defauleOrg !== null && defauleOrg !== undefined) {
      return defauleOrg;
    }
  }

  async function handleOperate(type) {
    const validateValue = await dataSet.validate(false, false);
    if (!validateValue) {
      return;
    }
    if (!dataSet.queryDataSet.current.get('moFixedStatus')) {
      notification.warning({
        message: '请选择维修类型',
      });
      return;
    }
    try {
      const obj = {
        tenantId: organizationId,
        moId: dataSet.queryDataSet.current.get('moId'),
        organizationId: dataSet.queryDataSet.current.get('organizationId'),
        moFixedStatus: dataSet.queryDataSet.current.get('moFixedStatus'),
      };
      const res = type === 'save' ? await moSave(obj) : await moSubmit(obj);
      if (res && !res.failed) {
        notification.success({
          message: `${type === 'save' ? '保存' : '提交'}成功`,
        });
        await dataSet.query();
        const resp = dataSet.toData();
        if (resp && resp[0]) {
          setTypeEditable(
            ['CREATED', 'REFUSED'].includes(resp[0].moComponentStatus) || !resp[0].moComponentStatus
          );
          dataSet.queryDataSet.current.set('moFixedStatus', resp[0].moFixedStatus);
          dataSet.queryDataSet.current.set(
            'moComponentStatusMeaning',
            resp[0].moComponentStatusMeaning
          );
          dataSet.queryDataSet.current.set('approvalOpinion', resp[0].approvalOpinion);
        }
      } else {
        notification.error({
          message: res.message,
        });
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }
  }

  return (
    <React.Fragment>
      <Header title={intl.get(`${preCode}.view.title.moComponent`).d('维修用料回复平台')}>
        <Button color="primary" onClick={handleSearch}>
          {intl.get('hzero.common.button.search').d('查询')}
        </Button>
        <ExcelExport
          requestUrl={`${HLOS_ZCOM}/v1/${organizationId}/mo-components/excel`}
          queryParams={getExportQueryParams}
        />
        <Button color="primary" onClick={handleSearch} disabled={disabledFlag}>
          {intl.get('hzero.common.button.stress').d('重读')}
        </Button>
        <Button
          color="primary"
          onClick={() => handleAddChildrenList()}
          disabled={disabledFlag || !typeEditable}
        >
          {intl.get('hzero.common.button.create').d('新增')}
        </Button>
        <Button
          color="primary"
          onClick={() => handleOperate('save')}
          disabled={disabledFlag || !typeEditable}
        >
          {intl.get('hzero.common.button.save').d('保存')}
        </Button>
        <Button
          color="primary"
          onClick={() => handleOperate('submit')}
          disabled={disabledFlag || !typeEditable}
        >
          {intl.get('hzero.common.button.submit').d('提交')}
        </Button>
      </Header>
      <Content>
        <div>
          <Form dataSet={dataSet.queryDataSet} columns={4}>
            <Lov name="organzationObj" clearButton noCache onChange={handleChange} />
            <Lov
              name="moNumObj"
              clearButton
              noCache
              onChange={(value) => handleChangeFlag(value)}
            />
            <TextField name="item" disabled />
            <DatePicker name="demandDate" disabled />
            <TextField name="demandQty" disabled />
            <TextField name="makeQty" disabled />
            <Select name="moStatus" disabled />
            <DatePicker name="planStartDate" disabled />
            <DatePicker name="planEndDate" disabled />
            <TextField name="bomVersion" disabled />
            <TextField name="moTypeName" disabled />
            <Select name="moFixedStatus" disabled={!typeEditable} />
            <TextField name="moComponentStatusMeaning" disabled />
            <Lov name="componentItemObj" clearButton noCache />
            <TextField name="componentDescription" />
            <TextArea name="approvalOpinion" disabled newLine colSpan={2} rows={3} />
          </Form>
        </div>
        <Table
          dataSet={dataSet}
          border={false}
          columns={columns()}
          columnResizable="true"
          editMode="inline"
          queryBar={renderBar()}
        />
      </Content>
    </React.Fragment>
  );
};
