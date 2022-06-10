/**
 * @Description: MO组件
 * @Author: yangzhang
 * @Date: 2020-02-08 10:28:08
 * @LastEditors: yangzhang
 */

import React, { useEffect, useMemo, useState } from 'react';
import { connect } from 'dva';
import { withRouter } from 'react-router-dom';
import {
  Table,
  Lov,
  Form,
  Button,
  TextField,
  // DatePicker,
  CheckBox,
  DataSet,
  // Select,
} from 'choerodon-ui/pro';
import { isEmpty } from 'lodash';
import intl from 'utils/intl';
import queryString from 'query-string';
import ExcelExport from 'components/ExcelExport';
import Icons from 'components/Icons';
import { Header, Content } from 'components/Page';
import { MoComponentDS } from '@/stores/moComponentDS';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import { Button as ButtonPermission } from 'components/Permission';
import { HLOS_LMES } from 'hlos-front/lib/utils/config';
import { yesOrNoRender, statusRender } from 'hlos-front/lib/utils/renderer';

import styles from './index.less';

const organizationId = getCurrentOrganizationId();

const preCode = 'lwms.moComponent';

const moComponent = ({ location }) => {
  const dataSet = useMemo(() => new DataSet(MoComponentDS()), []);

  const [disabledFlag, changeDisable] = useState(true);
  const [moInfo, setMoInfo] = useState({});

  useEffect(() => {
    function paramSetting() {
      if (location) {
        const { search = {}, data = {} } = location;
        if (!isEmpty(data)) {
          const params = search ? queryString.parse(search) : {};
          if (!dataSet.queryDataSet.current) {
            dataSet.queryDataSet.create({});
          }
          if (data.ownerOrganizationId) {
            dataSet.queryDataSet.current.set('organzationObj', {
              organizationId: data.ownerOrganizationId,
              organizationCode: data.ownerOrganizationCode,
              organizationName: data.organizationName,
            });
          }
          if (params.moId) {
            dataSet.queryDataSet.current.set('moNumObj', {
              moId: params.moId,
              moNum: params.moNum,
              makeQty: data?.makeQty,
            });
            handleChangeFlag(data);
          }
        }
      }
    }
    paramSetting();
  }, [location]);

  /**
   *表格
   * @returns
   */
  function columns() {
    return [
      { name: 'lineNum', width: 70, lock: true },
      {
        name: 'organizationObj',
        width: 128,
        lock: true,
        editor: (record) =>
          record.status === 'add' ? <Lov noCache onChange={handleOrgChange} /> : null,
      },
      {
        name: 'componentItemObj',
        width: 128,
        lock: true,
        editor: (record) => (record.status === 'add' ? <Lov noCache /> : null),
      },
      { name: 'componentDescription', width: 200, lock: true },
      {
        name: 'operation',
        width: 70,
        editor: (record) => (record.editing ? <TextField /> : null),
      },
      { name: 'uomName', width: 70 },
      { name: 'demandQty', width: 82, editor: !disabledFlag },
      { name: 'demandDate', width: 150, editor: !disabledFlag },
      { name: 'componentUsage', width: 82 },
      { name: 'bomUsage', width: 82, editor: !disabledFlag },
      { name: 'issuedQty', width: 82 },
      { name: 'componentNgQty', width: 82 },
      { name: 'processScrapedQty', width: 82 },
      { name: 'backflushQty', width: 82 },
      {
        name: 'keyComponentFlag',
        width: 82,
        renderer: yesOrNoRender,
        editor: (record) => (record.editing ? <CheckBox /> : false),
      },
      { name: 'supplyType', width: 100, editor: !disabledFlag },
      { name: 'supplyWarehouseObj', width: 128, editor: !disabledFlag },
      { name: 'supplyWmAreaObj', width: 128, editor: !disabledFlag },
      { name: 'issueControlType', width: 100, editor: !disabledFlag },
      { name: 'issueControlValue', width: 82, editor: !disabledFlag },
      { name: 'substitutePolicy', width: 100, editor: !disabledFlag },
      { name: 'substituteGroup', width: 100, editor: !disabledFlag },
      { name: 'substitutePriority', width: 82, editor: !disabledFlag },
      { name: 'substitutePercent', width: 82, editor: !disabledFlag },
      { name: 'departmentObj', width: 128, editor: !disabledFlag },
      { name: 'ecnNum', width: 128, editor: !disabledFlag },
      { name: 'specifySupplierObj', width: 200, editor: !disabledFlag },
      { name: 'specifyLotNumber', width: 144, editor: !disabledFlag },
      { name: 'specifyTagCode', width: 144, editor: !disabledFlag },
      { name: 'itemControlType', width: 100 },
      { name: 'remark', width: 200, editor: !disabledFlag },
      { name: 'externalId', width: 144, editor: !disabledFlag },
      { name: 'externalNum', width: 144, editor: !disabledFlag },
      {
        header: intl.get('hzero.common.button.action').d('操作'),
        width: 120,
        command: ['edit', ['delete']],
        lock: 'right',
        permissionList: [
          {
            code: 'hlos.lmes.mo.component.ps.buttons',
            type: 'button',
            meaning: '新建',
          },
        ],
      },
    ];
  }

  function handleOrgChange(rec) {
    dataSet.current.set('organizationObj', rec || {});
  }

  /**
   *取消表格自带的查询栏。
   * @returns
   */
  function renderBar() {
    return <div />;
  }

  /**
   *导出字段   *
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
    // const status = dataSet.queryDataSet.current.get('moStatus');
    const status = value?.moStatus;

    if (status) {
      if (status !== 'PENDING' && status !== 'CANCELLED' && status !== 'CLOSED') {
        changeDisable(false);
      } else changeDisable(true);
    } else changeDisable(true);
    if (value !== null) {
      setMoInfo({
        item: value?.item,
        demandDate: value?.demandDate,
        demandQty: value?.demandQty,
        makeQty: value?.makeQty,
        moStatus: value?.moStatus,
        moStatusMeaning: value?.moStatusMeaning,
        planStartDate: value?.planStartDate,
        planEndDate: value?.planEndDate,
        bomVersion: value?.bomVersion,
        moTypeName: value?.moTypeName,
      });
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
    dataSet.create(
      {
        lineNum: getLineNum(),
        organizationId: dataSet.queryDataSet.current.get('organizationId'),
        organizationCode: dataSet.queryDataSet.current.get('organizationCode'),
        organization: dataSet.queryDataSet.current.get('organizationName'),
        moId: dataSet.queryDataSet.current.get('moId'),
        moNum: dataSet.queryDataSet.current.get('moNum'),
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

  return (
    <React.Fragment>
      <Header title={intl.get(`${preCode}.view.title.moComponent`).d('MO组件')}>
        <Button color="primary" onClick={handleSearch}>
          {intl.get('hzero.common.button.search').d('查询')}
        </Button>
        <ExcelExport
          requestUrl={`${HLOS_LMES}/v1/${organizationId}/mo-components/excel`}
          queryParams={getExportQueryParams}
        />
        <Button color="primary" onClick={handleSearch} disabled={disabledFlag}>
          {intl.get('hzero.common.button.stress').d('重读')}
        </Button>
        <ButtonPermission
          color="primary"
          onClick={() => handleAddChildrenList()}
          disabled={disabledFlag}
          permissionList={[
            {
              code: 'hlos.lmes.mo.component.ps.buttons',
              type: 'button',
              meaning: '新建',
            },
          ]}
        >
          {intl.get('hzero.common.button.create').d('新建')}
        </ButtonPermission>
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
            {/* <TextField name="item" disabled />
             <DatePicker name="demandDate" disabled />
             <TextField name="demandQty" disabled />
             <TextField name="makeQty" disabled />
             <Select name="moStatus" disabled />
             <DatePicker name="planStartDate" disabled />
             <DatePicker name="planEndDate" disabled />
             <TextField name="bomVersion" disabled />
             <TextField name="moTypeName" disabled /> */}
          </Form>
        </div>
        {!isEmpty(moInfo) && (
          <div className={styles['mo-info']}>
            <div className={styles['info-top']}>
              <div>
                <span className={styles.item}>{moInfo?.item}</span>
                <span className={styles.type}>{moInfo?.moTypeName}</span>
              </div>
              {moInfo.moStatus && (
                <div className={styles.status}>
                  {statusRender(moInfo.moStatus, moInfo.moStatusMeaning)}
                </div>
              )}
            </div>
            <div className={styles['info-bottom']}>
              <div>
                <Icons type="quantity1" size="16" color="#666" />
                <span className={styles.label}>需求数量</span>
                <span>{moInfo?.demandQty}</span>
              </div>
              <div>
                <Icons type="quantity1" size="16" color="#666" />
                <span className={styles.label}>制造数量</span>
                <span>{moInfo?.makeQty}</span>
              </div>
              <div>
                <Icons type="documents" size="16" color="#666" />
                <span className={styles.label}>BOM版本</span>
                <span>{moInfo?.bomVersion}</span>
              </div>
              <div>
                <Icons type="date1" size="16" color="#666" />
                <span className={styles.label}>需求时间</span>
                <span>{moInfo?.demandDate}</span>
              </div>
              <div>
                <Icons type="date1" size="16" color="#666" />
                <span className={styles.label}>计划时间</span>
                <span>
                  {moInfo?.planStartDate} ~ {moInfo?.planStartDate}
                </span>
              </div>
            </div>
          </div>
        )}
        {/* <TablePermission> */}
        <Table
          dataSet={dataSet}
          border={false}
          columns={columns()}
          columnResizable="true"
          editMode="inline"
          queryBar={renderBar()}
        />
        {/* </TablePermission> */}
      </Content>
    </React.Fragment>
  );
};

export default connect()(withRouter(moComponent));
