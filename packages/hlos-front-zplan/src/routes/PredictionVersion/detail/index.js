/**
 * @Description: 预测版本详情
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-06-23 15:06:03
 */

import React, { useState, useEffect, Fragment } from 'react';
import {
  DataSet,
  Button,
  Tabs,
  Table,
  Form,
  Select,
  TextField,
  Lov,
  DatePicker,
} from 'choerodon-ui/pro';
import { isUndefined } from 'lodash';
import { filterNullValueObject, getCurrentOrganizationId } from 'utils/utils';
import ExcelExport from 'components/ExcelExport';
import { Header, Content } from 'components/Page';
import { openTab } from 'utils/menuTab';
import queryString from 'query-string';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { HLOS_ZPLAN } from 'hlos-front/lib/utils/config';
import formatterCollections from 'utils/intl/formatterCollections';
import { useDataSet, useDataSetEvent } from 'hzero-front/lib/utils/hooks';
import ItemAttributeSelect from '@/components/ItemAttributeSelect/index';
import ItemAttributeSelectQuery from '@/components/ItemAttributeSelectQuery/index';

import {
  PredictionVersionHeadDS,
  PredictionVersionLineQueryDS,
  PredictionVersionLineDS,
  PredictionVersionSourceDS,
} from '../store/indexDS';
import styles from './index.less';
import statusConfig from '@/common/statusConfig';

const {
  importTemplateCode: { saleVersion },
} = statusConfig.statusValue.zmda;

const { TabPane } = Tabs;
const intlPrefix = 'zplan.predictionVersion';
const predictionVersionHeadDS = () => new DataSet(PredictionVersionHeadDS());
const predictionVersionLineQueryDS = () => new DataSet(PredictionVersionLineQueryDS());
const predictionVersionSourceDS = () => new DataSet(PredictionVersionSourceDS());

function ZplanPredictionVersionDetail({ match, history, dispatch, location }) {
  const HeadDS = useDataSet(predictionVersionHeadDS, ZplanPredictionVersionDetail);
  const LineQueryDS = useDataSet(predictionVersionLineQueryDS);
  const sourceLineDS = useDataSet(predictionVersionSourceDS);

  const { state } = location;
  const stateObj = state || {};
  const {
    params: { type, saleVersionId },
  } = match;

  const [curTab, setCurTab] = useState('prediction');
  const [canEdit, setCanEdit] = useState(
    type === 'create' || ['NEW', 'REJECTED'].includes(stateObj.saleVersionStatus)
  ); // 是否可以编辑
  const [canVerify, setCanVerify] = useState(['TOBECONF'].includes(stateObj.saleVersionStatus)); // 是否可以审核（确认或者退回）
  const [isArtificial, setIsArtificial] = useState(
    type === 'create' || stateObj.saleTemplateType === 'MANUAL'
  ); // 预测类型是否是人工预测
  const [moreQuery, setMoreQuery] = useState(false);
  const [sourceMoreQuery, setSourceMoreQuery] = useState(false);
  const [isQuery, setIsQuery] = useState(false); // 是否查询明细行
  const [predictionColumns, setPredictionColumns] = useState([]);
  const [predictionLineDS, setPredictionLineDS] = useState(new DataSet(PredictionVersionLineDS()));
  const [itemAttrData, setItemAttrData] = useState(false);

  useEffect(() => {
    HeadDS.setQueryParameter('saleVersionId', null);
    sourceLineDS.setQueryParameter('saleVersionId', null);
    HeadDS.data = [];
    HeadDS.create();
    LineQueryDS.data = [];
    LineQueryDS.create();
    sourceLineDS.data = [];
    if (type === 'create') {
      handleInitData();
    }
    if (type === 'detail') {
      HeadDS.setQueryParameter('saleVersionId', saleVersionId);
      sourceLineDS.setQueryParameter('saleVersionId', saleVersionId);
      handleSearch();
    }
  }, [saleVersionId]);

  useEffect(() => {
    if (isQuery) {
      handlePredictionSearch();
    }
    setIsQuery(false);
  }, [predictionLineDS]);

  // useEffect(() => {
  //   console.log('q1111');
  // }, [LineQueryDS]);

  const commonColumns = [
    {
      name: 'salesEntityObj',
      width: 150,
      editor: canEdit && isArtificial,
      // editor: (record) => canEdit && !record.get('saleVersionDetailId'),
      lock: true,
    },
    {
      name: 'itemObj',
      width: 150,
      editor: canEdit && isArtificial,
      lock: true,
    },
    {
      name: 'itemAttr',
      width: 150,
      renderer: ({ record, value }) => {
        return (
          <ItemAttributeSelect
            data={value}
            handleSure={(obj) => handleSure(obj, record)}
            itemId={record.get('itemId')}
            itemDesc={record.get('itemDesc')}
            disabled={!canEdit || !record.editing || !isArtificial}
          />
        );
      },
      lock: true,
    },
    { name: 'itemDesc', width: 150 },
    { name: 'uomName', width: 80 },
    {
      name: 'correctRate',
      width: 100,
      renderer: ({ value }) => {
        return value ? `${value} %` : null;
      },
    },
    {
      header: intl.get('hzero.common.button.action').d('操作'),
      width: 100,
      command: canEdit ? ['edit'] : null,
      lock: 'right',
    },
  ];

  function handleInitData() {
    setPredictionColumns(commonColumns);
  }

  useDataSetEvent(LineQueryDS, 'update', ({ record, name }) => {
    if (name === 'itemAttr') {
      setItemAttrData(record.get('itemAttr'));
    }

    if (name === 'itemObj') {
      record.set('itemAttr', {});
      setItemAttrData({});
    }
  });

  async function handleSearch() {
    await HeadDS.query();
    const { saleTemplateType, saleVersionStatus } = HeadDS.current.toData();
    setIsArtificial(saleTemplateType === 'MANUAL' || type === 'create');
    setCanVerify(['TOBECONF'].includes(saleVersionStatus));
    setCanEdit(type === 'create' || ['NEW', 'REJECTED'].includes(saleVersionStatus));
    setIsQuery(true);
    await updateLineTable();
  }

  function updateLineTable() {
    return new Promise((resolve) => {
      dispatch({
        type: 'predictionVersion/createDateGap',
        payload: {
          predictionStartDate: `${HeadDS.current.get('predictionStartDate')} 00:00:00`,
          predictionGap: isArtificial ? HeadDS.current.get('predictionGap') : 1,
          dateStart: LineQueryDS.current.toData().saleDateStart,
          dateEnd: LineQueryDS.current.toData().saleDateEnd,
        },
      }).then((res) => {
        if (res && !res.failed) {
          const arr = res.map((v) => ({
            name: v,
            type: 'string',
            label: v,
          }));
          const columnsArr = res.map((v) => ({
            name: v,
            width: 100,
            editor: canEdit,
            renderer: ({ record, value }) => {
              return value ? (
                <span style={{ color: record.get(`manualFlag${v}`) === '1' ? 'red' : null }}>
                  {value}
                </span>
              ) : null;
            },
          }));
          setPredictionLineDS(
            new DataSet({
              ...PredictionVersionLineDS(),
              fields: PredictionVersionLineDS().fields.slice(0, 13).concat(arr),
            })
          );
          setPredictionColumns(commonColumns.concat(columnsArr));
        }
        resolve();
      });
    });
  }

  function handleTemplateChange(e) {
    if (e && e.saleTemplateId) {
      updateLineTable();
    }
  }

  async function handleTabChange(key) {
    setCurTab(key);
    let ds;
    if (key === 'prediction') {
      ds = predictionLineDS;
      const { saleDateStart, saleDateEnd } = LineQueryDS.current.toData();
      if (saleDateStart && saleDateEnd) {
        setIsQuery(true);
        await updateLineTable();
      }
    }
    if (key === 'source') {
      ds = sourceLineDS;
    }
    ds.setQueryParameter('queryObj', {
      ...LineQueryDS.current.toData(),
      itemObj: null,
      itemAttr: null,
      ...LineQueryDS.current.toData().itemAttr,
    });
    ds.query();
  }

  function handleSubmit() {
    return new Promise(async (resolve) => {
      if (!saleVersionId || !predictionLineDS.data.length) {
        notification.warning({
          message: '请先维护行信息',
        });
        resolve(false);
        return false;
      }
      dispatch({
        type: 'predictionVersion/operateVersion',
        payload: [
          {
            ...HeadDS.current.toData(),
            objectVersionNumber: HeadDS.current.toData().psvObjectVersionNumber,
            saleVersionStatus: 'TOBECONF',
          },
        ],
      }).then((res) => {
        if (res && !res.failed) {
          notification.success({
            message: '操作成功',
          });
          const pathName = `/zplan/prediction-version`;
          history.push(pathName);
        }
        resolve();
      });
    });
  }

  function handleSave() {
    return new Promise(async (resolve) => {
      const validateHead = await HeadDS.current.validate(true, false);
      if (!validateHead) {
        notification.warning({
          message: '数据校验不通过',
        });
        resolve(false);
        return false;
      }
      dispatch({
        type: `predictionVersion/${saleVersionId ? 'updateVersion' : 'createVersion'}`,
        payload: {
          ...HeadDS.current.toData(),
          objectVersionNumber: HeadDS.current.toData().psvObjectVersionNumber,
          latestFlag: 1,
        },
      }).then((res) => {
        if (res && !res.failed) {
          notification.success({
            message: '操作成功',
          });
          if (saleVersionId) {
            HeadDS.query();
            resolve();
            return;
          }
          history.push({
            pathname: `/zplan/prediction-version/detail/${res.saleVersionId}`,
            state: {
              saleTemplateType: res.saleTemplateType,
              saleVersionStatus: res.saleVersionStatus,
            },
          });
        }
        resolve();
      });
    });
  }

  function handleVerify(status) {
    return new Promise((resolve) => {
      dispatch({
        type: 'predictionVersion/operateVersion',
        payload: [
          {
            ...HeadDS.current.toData(),
            objectVersionNumber: HeadDS.current.toData().psvObjectVersionNumber,
            saleVersionStatus: status,
          },
        ],
      }).then((res) => {
        if (res && !res.failed) {
          notification.success({
            message: '操作成功',
          });
          const pathName = '/zplan/prediction-version';
          history.push(pathName);
        }
        resolve();
      });
    });
  }

  function handleSourceSave() {
    return new Promise((resolve) => {
      dispatch({
        type: 'predictionVersion/saveSource',
        payload: sourceLineDS.toData(),
      }).then((res) => {
        if (res && !res.failed) {
          notification.success({
            message: '操作成功',
          });
          sourceLineDS.query();
        }
        resolve();
      });
    });
  }

  function handleSure(obj, record) {
    record.set('itemAttr', {
      ...record.toData(),
      ...obj,
    });
  }

  function handlePredictionReset() {
    LineQueryDS.current.set('itemAttr', {});
    LineQueryDS.current.reset();
  }

  function handlePredictionSearch() {
    predictionLineDS.setQueryParameter('saleVersionId', saleVersionId);
    predictionLineDS.setQueryParameter('queryObj', {
      ...LineQueryDS.current.toData(),
      itemObj: null,
      itemAttr: null,
      ...LineQueryDS.current.toData().itemAttr,
    });
    predictionLineDS.query();
  }

  function handleSourceSearch() {
    sourceLineDS.setQueryParameter('queryObj', {
      ...LineQueryDS.current.toData(),
      itemObj: null,
      itemAttr: null,
      ...LineQueryDS.current.toData().itemAttr,
    });
    sourceLineDS.query();
  }

  async function handleDateChange(e) {
    if (e && e.start && e.end) {
      setIsQuery(true);
      await updateLineTable();
    }
  }

  function handleCreateLine() {
    const { saleVersionNum } = HeadDS.current.toData();
    predictionLineDS.create(
      {
        saleVersionId,
        saleVersionNum,
      },
      0
    );
  }

  function handleLineDelete() {
    if (!predictionLineDS.selected.length) {
      notification.warning({
        message: intl.get(`zplan.common.message.validation.select`).d('至少选择一条数据'),
      });
      return;
    }
    predictionLineDS.delete(predictionLineDS.selected);
  }

  function handleClearLine() {
    return new Promise((resolve) => {
      dispatch({
        type: 'predictionVersion/clearVersionLine',
        payload: { saleVersionId },
      }).then((res) => {
        if (res && !res.failed) {
          notification.success({
            message: '清空成功',
          });
          predictionLineDS.query();
        }
        resolve();
      });
    });
  }

  /**
   * 获取导出字段查询参数
   */
  const getExportQueryParams = () => {
    const formObj = LineQueryDS.current;
    const fieldsValue = isUndefined(formObj)
      ? {}
      : filterNullValueObject({
          ...formObj.toData(),
          itemObj: null,
          itemAttr: null,
          ...formObj.toData().itemAttr,
        });
    return {
      ...fieldsValue,
      saleVersionId,
    };
  };

  const handleBatchExport = () => {
    const params = { saleVersionId };
    try {
      openTab({
        key: `/himp/commentImport/${saleVersion}`,
        title: intl.get(`${intlPrefix}.view.title.exceptionImport`).d('销售版本导入'),
        search: queryString.stringify({
          action: 'himp.commentImport.view.button.templateImport',
          args: JSON.stringify(params),
        }),
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e.message);
    }
  };

  const sourceColumns = [
    { name: 'salesEntityName', width: 150 },
    { name: 'itemCode', width: 150 },
    { name: 'itemDesc', width: 150 },
    {
      name: 'itemAttr',
      width: 150,
      renderer: ({ record, value }) => {
        return (
          <ItemAttributeSelect
            data={value}
            itemId={record.get('itemId')}
            itemDesc={record.get('itemDesc')}
            disabled
          />
        );
      },
    },
    { name: 'uomName', width: 150 },
    { name: 'saleDate', width: 150 },
    { name: 'predictionBasicCount', width: 150 },
    { name: 'monthCount', width: 150 },
    { name: 'weekCount', width: 150 },
    { name: 'festivalCount', width: 150 },
    { name: 'activityCount', width: 150 },
    { name: 'discountCount', width: 150 },
    { name: 'lifecycleCount', width: 150 },
    { name: 'aiQty', width: 150 },
    { name: 'manualCount', width: 150 },
    { name: 'manualDesc', width: 150, editor: canEdit && !isArtificial },
  ];

  function getBtns() {
    if (isArtificial) {
      return canEdit && saleVersionId
        ? [
            <Button style={{ marginRight: 10 }} onClick={handleClearLine}>
              清空
            </Button>,
            <ExcelExport
              requestUrl={`${HLOS_ZPLAN}/v1/${getCurrentOrganizationId()}/plan-sale-version-days/version-day-export`}
              queryParams={getExportQueryParams}
            />,
            <Button style={{ marginLeft: 10 }} icon="upload" onClick={handleBatchExport}>
              导入
            </Button>,
            <Button onClick={handleCreateLine}>新建</Button>,
            <Button onClick={handleLineDelete}>删除</Button>,
          ]
        : [
            <ExcelExport
              requestUrl={`${HLOS_ZPLAN}/v1/${getCurrentOrganizationId()}/plan-sale-version-days/version-day-export`}
              queryParams={getExportQueryParams}
            />,
          ];
    }
    if (!isArtificial) {
      if (curTab === 'prediction') {
        return canEdit
          ? [
              <ExcelExport
                requestUrl={`${HLOS_ZPLAN}/v1/${getCurrentOrganizationId()}/plan-sale-version-days/version-day-export`}
                queryParams={getExportQueryParams}
              />,
              <Button style={{ marginLeft: 10 }} color="primary">
                保存
              </Button>,
            ]
          : [
              <ExcelExport
                requestUrl={`${HLOS_ZPLAN}/v1/${getCurrentOrganizationId()}/plan-sale-version-days/version-day-export`}
                queryParams={getExportQueryParams}
              />,
            ];
      }
      return canEdit
        ? [
            <ExcelExport
              requestUrl={`${HLOS_ZPLAN}/v1/${getCurrentOrganizationId()}/plan-sale-version-days/version-day-auto-export`}
              queryParams={getExportQueryParams}
            />,
            <Button style={{ marginLeft: 10 }} color="primary" onClick={handleSourceSave}>
              保存
            </Button>,
          ]
        : [
            <ExcelExport
              requestUrl={`${HLOS_ZPLAN}/v1/${getCurrentOrganizationId()}/plan-sale-version-days/version-day-auto-export`}
              queryParams={getExportQueryParams}
            />,
          ];
    }
  }

  function handleQuerySure(obj) {
    const { itemCode, itemId } = LineQueryDS.current.toData();

    LineQueryDS.current.set('itemAttr', {
      ...obj,
      itemId,
      itemCode,
    });
  }

  return (
    <Fragment>
      <Header
        title={
          type === 'create'
            ? intl.get(`${intlPrefix}.view.title.predictionVersionCreate`).d('新建预测版本')
            : intl.get(`${intlPrefix}.view.title.predictionVersionDetail`).d('预测版本详情')
        }
        backPath="/zplan/prediction-version"
      >
        {canEdit && saleVersionId && (
          <Button color="primary" onClick={handleSubmit}>
            提交
          </Button>
        )}
        {canEdit && isArtificial && !saleVersionId && (
          <Button onClick={handleSave} color="primary">
            保存
          </Button>
        )}
        {canVerify && (
          <>
            <Button color="primary" onClick={() => handleVerify('CONFIRMED')}>
              确认
            </Button>
            <Button onClick={() => handleVerify('REJECTED')}>退回</Button>
          </>
        )}
      </Header>
      <Content className={styles['zplan-prediction-version-detail-content']}>
        <Form dataSet={HeadDS} columns={4} labelWidth={120}>
          <TextField name="saleVersionNum" key="saleVersionNum" disabled />
          <Select name="saleVersionStatus" key="saleVersionStatus" disabled />
          <Lov
            name="saleTemplateObj"
            key="saleTemplateObj"
            clearButton
            noCache
            disabled={!canEdit || saleVersionId || !isArtificial}
            onChange={handleTemplateChange}
          />
          <TextField name="saleTemplateName" key="saleTemplateName" disabled />
          <TextField name="predictedName" key="predictedName" disabled />
          <TextField name="predictionStartDate" key="predictionStartDate" disabled />
          <TextField name="predictionEndDate" key="predictionEndDate" disabled />
          <TextField name="predictionGap" key="predictionGap" disabled />
          <TextField name="newestSaleVersionNum" key="newestSaleVersionNum" disabled />
          <TextField
            name="newestSaleVersionStatusMeaning"
            key="newestSaleVersionStatusMeaning"
            disabled
          />
        </Form>
        <Tabs defaultActiveKey={curTab} onChange={handleTabChange}>
          <TabPane tab="每日预测数量" key="prediction">
            <div className={styles['zplan-prediction-version-line-query']}>
              <Form dataSet={LineQueryDS} columns={3}>
                <DatePicker mode="date" name="saleDateStart" onChange={handleDateChange} />
                <Lov name="salesEntityObj" clearButton noCache />
                <Lov name="itemObj" clearButton noCache />
                {moreQuery && (
                  <ItemAttributeSelectQuery
                    name="itemAttr"
                    data={itemAttrData}
                    handleSure={handleQuerySure}
                    ds={LineQueryDS}
                    required={false}
                  />
                )}
              </Form>
              <div style={{ display: 'inline-flex', paddingTop: '11px' }}>
                <Button
                  onClick={() => {
                    setMoreQuery(!moreQuery);
                  }}
                >
                  {moreQuery
                    ? intl.get('hzero.common.button.collected').d('收起查询')
                    : intl.get('hzero.common.button.viewMore').d('更多查询')}
                </Button>
                <Button onClick={handlePredictionReset}>
                  {intl.get('hzero.common.button.reset').d('重置')}
                </Button>
                <Button color="primary" onClick={handlePredictionSearch}>
                  {intl.get('hzero.common.button.search').d('查询')}
                </Button>
              </div>
            </div>
            <div className={styles['table-btns']}>{getBtns()}</div>
            <Table
              dataSet={predictionLineDS}
              columns={predictionColumns}
              columnResizable="true"
              editMode="inline"
              rowHeight="auto"
              queryBar="none"
            />
          </TabPane>
          {!isArtificial && (
            <TabPane tab="数据来源" key="source">
              <div className={styles['zplan-prediction-version-line-query']}>
                <Form dataSet={LineQueryDS} columns={3}>
                  <DatePicker mode="date" name="saleDateStart" />
                  <Lov name="salesEntityObj" clearButton noCache />
                  <Lov name="itemObj" clearButton noCache />
                  {sourceMoreQuery && (
                    <ItemAttributeSelectQuery
                      name="itemAttr"
                      data={itemAttrData}
                      handleSure={handleQuerySure}
                      ds={LineQueryDS}
                      required={false}
                    />
                  )}
                </Form>
                <div style={{ display: 'inline-flex', paddingTop: '11px' }}>
                  <Button
                    onClick={() => {
                      setSourceMoreQuery(!sourceMoreQuery);
                    }}
                  >
                    {sourceMoreQuery
                      ? intl.get('hzero.common.button.collected').d('收起查询')
                      : intl.get('hzero.common.button.viewMore').d('更多查询')}
                  </Button>
                  <Button onClick={handlePredictionReset}>
                    {intl.get('hzero.common.button.reset').d('重置')}
                  </Button>
                  <Button color="primary" onClick={handleSourceSearch}>
                    {intl.get('hzero.common.button.search').d('查询')}
                  </Button>
                </div>
              </div>
              <div className={styles['table-btns']}>{getBtns()}</div>
              <Table
                dataSet={sourceLineDS}
                columns={sourceColumns}
                columnResizable="true"
                rowHeight="auto"
                queryBar="none"
              />
            </TabPane>
          )}
        </Tabs>
      </Content>
    </Fragment>
  );
}

export default formatterCollections({
  code: [`${intlPrefix}`],
})(ZplanPredictionVersionDetail);
