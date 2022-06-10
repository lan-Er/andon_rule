/*
 * @Descripttion: 销售预测模型 - 时间序列预测模型
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2021-05-18 14:01:49
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2021-05-18 14:15:15
 */

import React, { useState, useEffect, Fragment } from 'react';
import {
  DataSet,
  Button,
  Form,
  Table,
  TextField,
  Select,
  DatePicker,
  CheckBox,
  Modal,
  Progress,
  Lov,
} from 'choerodon-ui/pro';
import { Icon } from 'choerodon-ui';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import notification from 'utils/notification';
import { isUndefined } from 'lodash';
import { useDataSet, useDataSetEvent } from 'hzero-front/lib/utils/hooks';
import ExcelExport from 'components/ExcelExport';
import { HLOS_ZPLAN } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import ItemAttributeSelect from '@/components/ItemAttributeSelect/index';
import ItemAttributeSelectQuery from '@/components/ItemAttributeSelectQuery/index';
import styles from './index.less';

import {
  headDS,
  versionListDS,
  saleDataListDS,
  selectVersionListDS,
  selectHeadDS,
} from '../store/indexDS';

const intlPrefix = 'zplan.timePredictionModel';
const organizationId = getCurrentOrganizationId();

const CreateHeadDS = () => new DataSet(headDS());
const CreateVersionListDS = () => new DataSet(versionListDS());
const CreateSelectVersionListDS = () => new DataSet(selectVersionListDS());
const CreateSelectHeadDS = () => new DataSet(selectHeadDS());

let timer = null;
let salefieldList = [];
function ZplanTimePredictionModel({ match, dispatch, history }) {
  const [constactShow, setConstactShow] = useState(true);
  const [saleDataShow, setSaleDataShow] = useState(true);
  const [SaleDataListDS, setSaleDataListDS] = useState(new DataSet(saleDataListDS(salefieldList)));
  const [salecolumns, setSalecolumns] = useState(entitycolumns);
  const [showFlag, setShowFlag] = useState(false);
  const [itemAttrData, setItemAttrData] = useState(false);

  const HeadDS = useDataSet(CreateHeadDS, ZplanTimePredictionModel);
  const VersionListDS = useDataSet(CreateVersionListDS);
  const SelectVersionListDS = useDataSet(CreateSelectVersionListDS);
  const SelectHeadDS = useDataSet(CreateSelectHeadDS);
  // const SelectHeadDS = new DataSet(selectHeadDS());

  const {
    params: { type, saleSummaryId },
  } = match;

  const [canEdit, setCanEdit] = useState(true); // 是否可编辑

  useEffect(() => {
    HeadDS.data = [];
    HeadDS.create();
    if (type === 'detail') {
      handleSearch();
    }

    if (type === 'create') {
      HeadDS.current.set('saleSummaryStatus', 'NEW');
    }
  }, [saleSummaryId]);

  useEffect(() => {
    if (type === 'create') {
      return;
    }

    SaleDataListDS.queryParameter = {
      ...SelectHeadDS.current.toData(),
      ...SelectHeadDS.current.toData().itemAttr,
      itemAttr: null,
      itemObj: null,
      saleSummaryId,
    };
    SaleDataListDS.query();
    const columnsList =
      salefieldList &&
      salefieldList.length &&
      salefieldList.map((i) => ({
        name: i,
        width: 100,
      }));
    setSalecolumns(entitycolumns.concat(columnsList || []));
  }, [SaleDataListDS]);

  useDataSetEvent(SelectHeadDS, 'update', ({ record, name }) => {
    if (name === 'startDate' || name === 'endDate') {
      handleChangeTable();
    }

    if (name === 'itemAttr') {
      setItemAttrData(record.get('itemAttr'));
    }

    if (name === 'itemObj') {
      record.set('itemAttr', {});
      setItemAttrData({});
    }
  });

  async function handleSearch() {
    HeadDS.setQueryParameter('saleSummaryId', saleSummaryId);
    await HeadDS.query();
    setCanEdit(HeadDS.current.data.saleSummaryStatus === 'NEW' || type === 'create');
    VersionListDS.setQueryParameter('saleSummaryId', saleSummaryId);
    SaleDataListDS.setQueryParameter('saleSummaryId', saleSummaryId);
    VersionListDS.query();
    handleChangeTable();
  }

  const handleChangeTable = async (flag = true) => {
    SaleDataListDS.queryParameter = {
      ...SelectHeadDS.current.toData(),
      ...SelectHeadDS.current.toData().itemAttr,
      itemAttr: null,
      itemObj: null,
      saleSummaryId,
    };
    const saleDataList = await SaleDataListDS.query();

    if (saleDataList && saleDataList.content.length && flag) {
      salefieldList = saleDataList.content[0].planSaleSummaryDayList.map(
        (i) => i.saleDate.split(' ')[0]
      );
      setSaleDataListDS(new DataSet(saleDataListDS(salefieldList)));
    }
  };

  async function handleSave(status) {
    const validateValue = await HeadDS.validate(false, false);
    if (!validateValue) {
      notification.error({
        message: '存在必输字段未填写或字段输入不合法！',
      });
      return;
    }

    const params = {
      ...HeadDS.current.toData(),
      saleSummaryStatus: status,
    };

    const apiName = type === 'create' ? 'createSaleSummarys' : 'saleSummarys';
    const queryParams = type === 'create' ? params : [params];
    return new Promise(async (resolve) => {
      dispatch({
        type: `saleSummaryModel/${apiName}`,
        payload: queryParams,
      }).then(async (res) => {
        if (res && !res.failed) {
          notification.success({
            message: '操作成功',
          });
          const pathName =
            status === 'CONFIRMED'
              ? `/zplan/plan-sale-summary`
              : `/zplan/plan-sale-summary/detail/${res.saleSummaryId}`;

          if (type === 'create' || status === 'CONFIRMED') {
            history.push({
              pathname: pathName,
            });
            resolve();
            return;
          }
          handleSearch();
        }
        resolve();
      });
    });
  }

  const columns = [
    {
      name: 'saleTemplateNum',
      width: 150,
      lock: 'left',
    },
    {
      name: 'saleTemplateName',
      width: 150,
      lock: 'left',
    },
    {
      name: 'saleVersionNum',
      width: 150,
      lock: 'left',
    },
    {
      name: 'saleTemplateTypeMeaning',
      width: 120,
    },
    {
      name: 'predictedName',
      width: 120,
    },
    {
      name: 'predictionStartDate',
      width: 120,
    },
    {
      name: 'predictionEndDate',
      width: 120,
    },
    {
      name: 'predictionGap',
      minWidth: 140,
      width: 140,
    },
  ];

  const entitycolumns = [
    {
      name: 'salesEntityName',
      width: 120,
      lock: 'left',
    },
    {
      name: 'itemCode',
      width: 150,
      lock: 'left',
    },
    {
      name: 'itemAttr',
      width: 150,
      lock: 'left',
      renderer: ({ record, value }) => {
        return value && value.attributeValue1 ? (
          <ItemAttributeSelect
            data={value}
            itemId={record.get('ItemId')}
            itemDesc={record.get('ItemDesc')}
            disabled
          />
        ) : null;
      },
    },
    {
      name: 'itemDesc',
      width: 150,
    },
    {
      name: 'uomName',
      width: 70,
    },
    // {
    //   name: 'correctRate',
    //   width: 90,
    // },
  ];

  const selectColumns = [
    {
      name: 'saleTemplateNum',
      width: 150,
    },
    {
      name: 'saleTemplateName',
      width: 150,
    },
    {
      name: 'saleTemplateStatusMeaning',
      width: 150,
    },
    {
      name: 'saleVersionNum',
      width: 150,
    },
    {
      name: 'saleVersionStatusMeaning',
      width: 150,
    },
    {
      name: 'saleTemplateTypeMeaning',
      width: 150,
    },
    {
      name: 'predictedName',
      width: 150,
    },
    {
      name: 'predictionStartDate',
      width: 150,
    },
    {
      name: 'predictionEndDate',
      width: 150,
    },
    {
      name: 'predictionGap',
      width: 150,
    },
  ];

  function handleToggle(setMethod, value) {
    setMethod(!value);
  }

  const handleOk = () => {
    if (!SelectVersionListDS.selected.length) {
      notification.error({
        message: intl.get(`hzero.common.message.validation.atLeast`).d('请至少选择一条数据'),
      });
      return;
    }

    const { saleSummaryNum } = HeadDS.current.data;
    const params = SelectVersionListDS.selected.map((i) => ({
      ...i.toData(),
      saleSummaryId,
      saleSummaryNum,
    }));
    return new Promise(async (resolve) => {
      dispatch({
        type: `saleSummaryModel/createSaleSummaryLines`,
        payload: params,
      }).then(async (res) => {
        if (res && !res.failed) {
          notification.success({
            message: '操作成功',
          });
          VersionListDS.query();
        }
        resolve();
      });
    });
  };

  const handleAddTask = () => {
    SelectVersionListDS.query();
    Modal.open({
      title: '选择预测任务',
      maskClosable: true,
      destroyOnClose: true,
      style: { width: 1000 },
      children: (
        <Table
          className={styles['zplan-sales-summary-modal']}
          dataSet={SelectVersionListDS}
          columns={selectColumns}
          rowHeight="auto"
        />
      ),
      onOk: handleOk,
    });
  };

  const handleCreateResults = () => {
    return new Promise(async (resolve) => {
      dispatch({
        type: `saleSummaryModel/createSaleSummaryResults`,
        payload: { saleSummaryId },
      }).then(async (res) => {
        if (res && !res.failed) {
          notification.success({
            message: '操作成功',
          });
          handleChangeTable();
        }
        resolve();
      });
      clearInterval(timer);
      timer = setInterval(async () => {
        const logRes = await HeadDS.query();
        if (logRes && logRes.cleaningStatus === 'SUCCESS') {
          if (timer) {
            clearInterval(timer);
          }
        }
      }, 2000);
    });
  };

  const handleLineDelete = () => {
    if (!VersionListDS.selected.length) {
      notification.error({
        message: intl.get(`hzero.common.message.validation.atLeast`).d('请至少选择一条数据'),
      });
      return;
    }
    VersionListDS.delete(VersionListDS.selected);
  };

  const handleSubmit = async () => {
    const validateValue = await HeadDS.validate(false, false);
    if (!validateValue) {
      notification.error({
        message: '存在必输字段未填写或字段输入不合法！',
      });
      return;
    }

    const { cleaningStatus } = HeadDS.current.toData();

    if (!['SUCCESS'].includes(cleaningStatus)) {
      notification.warning({
        message: '有汇总计算未完成，请检查后选择！',
      });
      return;
    }

    const modal = Modal.open({
      title: '温馨提示：',
      maskClosable: true,
      destroyOnClose: true,
      children: (
        <div>
          <p>提交前请您确认：</p> <p>预测汇总的数据是否已更新至最新？</p>
        </div>
      ),
      footer: () => (
        <div>
          <Button onClick={() => handleSave('CONFIRMED')}>继续提交</Button>
          <Button onClick={() => modal.close()} color="primary">
            返回更新
          </Button>
        </div>
      ),
    });
  };

  function handleSure(obj) {
    const { itemCode, itemId } = SelectHeadDS.current.toData();

    SelectHeadDS.current.set('itemAttr', {
      ...obj,
      itemId,
      itemCode,
    });
  }

  /**
   * 头查询条件
   * @returns
   */
  function queryFields() {
    return [
      <DatePicker name="startDate" key="startDate" />,
      <Lov name="salesEntityObj" noCache key="salesEntityObj" />,
      <Lov name="itemObj" noCache key="itemObj" />,
      <ItemAttributeSelectQuery
        name="itemAttr"
        data={itemAttrData}
        handleSure={handleSure}
        ds={SelectHeadDS}
        required={false}
      />,
    ];
  }

  /**
   * 重置
   */
  function handleReset() {
    SelectHeadDS.current.set('itemAttr', {});
    SelectHeadDS.current.reset();
  }

  /**
   * 获取导出字段查询参数
   */
  const getExportQueryParams = () => {
    const formObj = SelectHeadDS.current;
    const fieldsValue = isUndefined(formObj)
      ? {}
      : filterNullValueObject({
          ...formObj.toData(),
          ...formObj.toData().itemAttr,
          itemAttr: null,
          itemObj: null,
        });
    return {
      ...fieldsValue,
      saleSummaryId,
    };
  };

  return (
    <Fragment>
      <Header
        backPath="/zplan/plan-sale-summary"
        title={
          type === 'create'
            ? intl.get(`${intlPrefix}.view.title.vmiMaterialsApplyCreate`).d('新建预测汇总')
            : intl.get(`${intlPrefix}.view.title.vmiMaterialsApplyEdit`).d('预测汇总详情')
        }
      >
        {canEdit && (
          <>
            <Button
              color="primary"
              disabled={type !== 'detail'}
              onClick={() => handleSubmit('CONFIRMED')}
            >
              保存并提交
            </Button>
            <Button color="primary" onClick={() => handleSave('NEW')}>
              保存
            </Button>
          </>
        )}
      </Header>
      <Content className={styles['zplan-sales-summary']}>
        <Form dataSet={HeadDS} columns={4} labelWidth={120}>
          <TextField name="saleSummaryNum" key="saleSummaryNum" disabled />
          <TextField name="saleSummaryName" key="saleSummaryName" disabled={!canEdit} />
          <Select name="saleSummaryStatus" key="saleSummaryStatus" disabled />
          <CheckBox
            name="predictionCalibrationFlag"
            key="predictionCalibrationFlag"
            disabled={!canEdit}
          />
          <DatePicker name="predictionStartDate" key="predictionStartDate" disabled={!canEdit} />
          <DatePicker name="predictionEndDate" key="predictionEndDate" disabled={!canEdit} />
          <TextField name="predictionGap" key="predictionGap" disabled={!canEdit} />
          <Select name="saleSummaryRule" key="saleSummaryRule" disabled={!canEdit} />
          <Select name="cleaningStatus" key="cleaningStatus" disabled />
          <Progress name="cleaningProgress" key="cleaningProgress" />
        </Form>

        <div className={styles['zplan-sales-summary-headInfo']}>
          <span>预测任务</span>
          <span
            className={styles['headInfo-toggle']}
            onClick={() => handleToggle(setConstactShow, constactShow)}
          >
            {constactShow ? (
              <span>
                收起 <Icon type="expand_more" />
              </span>
            ) : (
              <span>
                展开 <Icon type="expand_less" />
              </span>
            )}
          </span>
        </div>

        {constactShow ? (
          <>
            {canEdit ? (
              <div style={{ textAlign: 'right', marginTop: '10px' }}>
                <Button disabled={type !== 'detail'} onClick={() => handleLineDelete('NEW')}>
                  删除
                </Button>
                <Button
                  disabled={type !== 'detail'}
                  color="primary"
                  onClick={() => handleAddTask('NEW')}
                >
                  添加
                </Button>
                <Button
                  disabled={type !== 'detail'}
                  color="primary"
                  onClick={() => handleCreateResults('CONFIRMED')}
                >
                  生成/更新数据
                </Button>
              </div>
            ) : null}
            <Table dataSet={VersionListDS} columns={columns} editMode="inline" rowHeight="auto" />
          </>
        ) : null}

        <div className={styles['zplan-sales-summary-headInfo']}>
          <span>预测数据</span>
          <span
            className={styles['headInfo-toggle']}
            onClick={() => handleToggle(setSaleDataShow, saleDataShow)}
          >
            {saleDataShow ? (
              <span>
                收起 <Icon type="expand_more" />
              </span>
            ) : (
              <span>
                展开 <Icon type="expand_less" />
              </span>
            )}
          </span>
        </div>

        {saleDataShow && type === 'detail' ? (
          <>
            <div className={styles['zplan-sales-summary-query']}>
              <Form dataSet={SelectHeadDS} columns={3} style={{ flex: 'auto' }}>
                {!showFlag ? queryFields().slice(0, 3) : queryFields()}
              </Form>
              <div className={styles['query-btns']}>
                <Button onClick={() => handleToggle(setShowFlag, showFlag)}>
                  {!showFlag
                    ? intl.get('hzero.common.button.viewMore').d('')
                    : intl.get('hzero.common.button.collected').d('收起查询')}
                </Button>
                <Button onClick={handleReset}>
                  {intl.get('hzero.common.button.reset').d('重置')}
                </Button>
                <Button color="primary" onClick={() => handleChangeTable(false)}>
                  {intl.get('hzero.common.button.search').d('查询')}
                </Button>
              </div>
            </div>

            <div style={{ marginBottom: 10, textAlign: 'right' }}>
              <ExcelExport
                requestUrl={`${HLOS_ZPLAN}/v1/${organizationId}/plan-sale-summary-results/export`}
                queryParams={getExportQueryParams}
              />
            </div>
            <Table
              dataSet={SaleDataListDS}
              columns={salecolumns}
              editMode="inline"
              rowHeight="auto"
              queryBar="none"
              // buttons={[
              //   <ExcelExport
              //     requestUrl={`${HLOS_ZPLAN}/v1/${organizationId}/plan-sale-summary-results/export`}
              //     queryParams={getExportQueryParams}
              //   />,
              // ]}
            />
          </>
        ) : null}
      </Content>
    </Fragment>
  );
}

export default formatterCollections({
  code: [`${intlPrefix}`],
})((props) => {
  return <ZplanTimePredictionModel {...props} />;
});
