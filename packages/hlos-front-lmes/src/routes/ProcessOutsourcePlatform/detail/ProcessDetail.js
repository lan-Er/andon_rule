/**
 * @Description: 新增任务外协
 * @Author: leying.yan<leying.yan@hand-china.com>
 * @Date: 2021-01-21
 * @LastEditors: leying.yan
 */

import React, { useContext, Fragment, useState, useEffect } from 'react';
import {
  Lov,
  Form,
  Table,
  Select,
  TextField,
  Button,
  CheckBox,
  Modal,
  Tooltip,
} from 'choerodon-ui/pro';
import { Divider, Card, Icon } from 'choerodon-ui';
import { filterNullValueObject, getResponse } from 'utils/utils';
import { queryLovData } from 'hlos-front/lib/services/api';
import intl from 'utils/intl';
import { DETAIL_CARD_CLASSNAME, DETAIL_CARD_TABLE_CLASSNAME } from 'utils/constants';
import { Header, Content } from 'components/Page';
import codeConfig from '@/common/codeConfig';
import Store from '@/stores/processOutsourcePlatformDS';
import './style.less';

const preCode = 'lmes.processOutsourcePlatform';
const { common } = codeConfig.code;

export default () => {
  const { detailQueryDS, headDetailDS, lineDetailDS } = useContext(Store);
  const [showQueryMore, changeShowQueryMore] = useState(false);
  const [showHeadMore, changeShowHeadMore] = useState(false);
  const [isChange, setIsChange] = useState(false);

  useEffect(() => {
    detailQueryDS.create({}, 0);
    headDetailDS.create({}, 0);
    async function defaultLovSetting() {
      const res = await queryLovData({ lovCode: common.organization, defaultFlag: 'Y' });

      if (getResponse(res)) {
        if (res && res.content && res.content[0]) {
          detailQueryDS.current.set('organizationObj', {
            organizationId: res.content[0].organizationId,
            organizationCode: res.content[0].organizationCode,
            organizationName: res.content[0].organizationName,
          });
        }
      }
    }
    function updateDSDirty() {
      setIsChange(headDetailDS.dirty || lineDetailDS.dirty);
    }
    function addDirtyListener() {
      headDetailDS.addEventListener('update', updateDSDirty);
      lineDetailDS.addEventListener('update', updateDSDirty);
    }
    defaultLovSetting().then(addDirtyListener);
  }, []);
  /**
   *查询条件
   * @returns
   */
  function queryFields() {
    return [
      <Lov name="organizationObj" noCache />,
      <Lov name="moNumObj" noCache />,
      <Lov name="taskObj" noCache />,
      <TextField name="operation" />,
      <Lov name="itemObj" noCache />,
      <Lov name="taskTypeObj" noCache />,
      <Select name="taskStatus" key="taskStatus" />,
      <CheckBox name="outsourceFlag" />,
    ];
  }

  function headColumns() {
    return [
      <Lov name="partyObj" noCache key="partyObj" />,
      <Lov name="partySiteObj" noCache key="partySiteObj" onChange={handlePartySiteChange} />,
      <TextField name="remark" key="remark" />,
      <TextField name="partyContact" key="partyContact" />,
      <TextField name="contactPhone" key="contactPhone" />,
      <TextField name="contactEmail" key="contactEmail" />,
      <TextField name="partyAddress" key="partyAddress" />,
      <TextField name="carrier" key="carrier" />,
      <TextField name="carrierContact" key="carrierContact" />,
      <TextField name="shipTicket" key="shipTicket" />,
      <TextField name="plateNum" key="plateNum" />,
      <TextField name="projectNum" key="projectNum" />,
      <Lov name="currencyObj" noCache key="currencyObj" />,
    ];
  }

  const lineColumns = [
    {
      name: 'task',
      width: 200,
      renderer: (data) => {
        return `${data.record.get('documentNum')} ${data.record.get('taskNum')} `;
      },
      editor: false,
    },
    {
      name: 'operation',
      width: 150,
      renderer: (data) => {
        return `${data.record.get('documentLineNum')} ${data.value} `;
      },
      editor: false,
    },
    {
      name: 'itemObj',
      width: 200,
      renderer: (data) => {
        return `${data.record.get('itemCode')} ${data.record.get('description')}`;
      },
      editor: false,
    },
    { name: 'taskQty', width: 100, align: 'left' },
    { name: 'applyQty', width: 100, align: 'left', editor: true },
    { name: 'demandDate', width: 150, editor: true },
    { name: 'promiseDate', width: 150, editor: true },
    { name: 'unitPrice', width: 100, align: 'left', editor: true },
    { name: 'lineAmount', width: 100, align: 'left', editor: true },
    { name: 'lineRemark', width: 200, editor: true },
    {
      name: 'planTime',
      width: 200,
      renderer: (data) => {
        return `${data.record.get('planStartTime')} - ${data.record.get('planEndTime')}`;
      },
      editor: false,
    },
    { name: 'executableQty', width: 120, editor: false },
    {
      name: 'executeQty',
      width: 200,
      renderer: (data) => (
        <div>
          {`合格：${data.record.get('processOkQty')}`} <br />
          {`报废：${data.record.get('scrappedQty')}`} <br />
          {`返修：${data.record.get('reworkQty')}`} <br />
          {`待检：${data.record.get('pendingQty')}`} <br />
          {`在制：${data.record.get('wipQty')}`}
        </div>
      ),
      editor: false,
    },
    { name: 'taskStatusMeaning', width: 100, editor: false },
    {
      name: 'executeRule',
      width: 150,
      editor: false,
      renderer: (data) => (
        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          <Tooltip placement="topLeft" title={data.record.get('executeRule')}>
            {data.record.get('executeRule')}
          </Tooltip>
        </div>
      ),
    },
    {
      name: 'inspectionRule',
      editor: false,
      renderer: (data) => (
        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          <Tooltip placement="topLeft" title={data.record.get('inspectionRule')}>
            {data.record.get('inspectionRule')}
          </Tooltip>
        </div>
      ),
    },
    { name: 'itemControlType', width: 150, editor: false },
    { name: 'remark', width: 200, editor: false },
  ];

  function handleToggle() {
    changeShowQueryMore(!showQueryMore);
  }
  function handleHeadToggle() {
    changeShowHeadMore(!showHeadMore);
  }
  function handleReset() {
    if (isChange) {
      Modal.confirm({
        children: (
          <p>{intl.get(`${preCode}.view.message.resetData`).d('当前新增未保存，是否确定重置?')}</p>
        ),
        okText: '是',
        cancelText: '否',
        onOk: () => {
          lineDetailDS.data = [];
          headDetailDS.current.reset();
          detailQueryDS.current.reset();
        },
      });
    } else {
      detailQueryDS.current.reset();
    }
  }
  async function handleSearch() {
    const validateValue = await detailQueryDS.validate(false, false);
    if (validateValue) {
      lineDetailDS.queryParameter = detailQueryDS.current.toJSONData();
      await lineDetailDS.query();
      lineDetailDS.records.forEach((record) => {
        record.set('applyQty', record.get('outsourceQty'));
      });
    }
  }
  /**
   *伙伴地点改变
   */
  function handlePartySiteChange(record) {
    console.log(record.get('partySiteId'));
  }
  /**
   *提交
   */

  async function handleSubmit() {
    const queryValidateValue = await detailQueryDS.validate(false, false);
    const headValidateValue = await headDetailDS.validate(false, false);
    const lineValidateValue = await lineDetailDS.validate(false, false);
    if (queryValidateValue && headValidateValue && lineValidateValue) {
      const {
        organizationId,
        organizationCode,
        moId,
        moNum,
        taskId,
        taskNum,
        validateLevel,
      } = detailQueryDS.current.toJSONData();
      const queryData = filterNullValueObject({
        organizationId,
        organizationCode,
        moId,
        moNum,
        taskId,
        taskNum,
        validateLevel,
      });
      headDetailDS.current.set({ ...queryData });
      headDetailDS.current.addField('createTaskOutsourceLines');
      const taskOutsourceLines = [];
      lineDetailDS.records.forEach((record) => {
        taskOutsourceLines.push(record.toJSONData());
      });
      headDetailDS.current.set('createTaskOutsourceLines', taskOutsourceLines);
      await headDetailDS.submit();
    }
  }

  return (
    <Fragment>
      <Header
        title={intl.get(`${preCode}.view.title.addTaskOutsource`).d('新增任务外协')}
        backPath="/lmes/process-outsource-platform/list"
      >
        <Button onClick={handleSearch}>{intl.get('hzero.common.button.search').d('查询')}</Button>
        <Button onClick={handleReset}>{intl.get('hzero.common.button.reset').d('重置')}</Button>
        <Button onClick={handleSubmit}>{intl.get('hzero.common.button.save').d('保存')}</Button>
      </Header>
      <Content className="lmes-process-outsource-detail-content">
        <Card key="outsource-detail-query" bordered={false} className={DETAIL_CARD_CLASSNAME}>
          <Form dataSet={detailQueryDS} columns={4}>
            {queryFields().slice(0, 4)}
          </Form>
          <Divider>
            <div>
              <span onClick={handleToggle} style={{ cursor: 'pointer' }}>
                {showQueryMore
                  ? `${intl.get(`hzero.common.button.hidden`).d('隐藏')}`
                  : `${intl.get('hzero.common.button.expand').d('展开')}`}
              </span>
              <Icon type={showQueryMore ? 'expand_less' : 'expand_more'} />
            </div>
          </Divider>
          <div style={showQueryMore ? { display: 'block' } : { display: 'none' }}>
            <Form dataSet={detailQueryDS} columns={4}>
              {showQueryMore ? queryFields().slice(4, queryFields().length) : ''}
            </Form>
          </div>
        </Card>
        <Card key="outsource-detail-head" bordered={false} className={DETAIL_CARD_CLASSNAME}>
          <Form dataSet={headDetailDS} columns={4}>
            {headColumns().slice(0, 4)}
          </Form>
          <Divider>
            <div>
              <span onClick={handleHeadToggle} style={{ cursor: 'pointer' }}>
                {showHeadMore
                  ? `${intl.get(`hzero.common.button.hidden`).d('隐藏')}`
                  : `${intl.get('hzero.common.button.expand').d('展开')}`}
              </span>
              <Icon type={showHeadMore ? 'expand_less' : 'expand_more'} />
            </div>
          </Divider>
          <div style={showHeadMore ? { display: 'block' } : { display: 'none' }}>
            <Form dataSet={headDetailDS} columns={4}>
              {showHeadMore ? headColumns().slice(4, headColumns().length) : ''}
            </Form>
          </div>
        </Card>
        <Card key="outsource-detail-line" bordered={false} className={DETAIL_CARD_TABLE_CLASSNAME}>
          <Table
            dataSet={lineDetailDS}
            columns={lineColumns}
            rowHeight="auto"
            columnResizable="true"
          />
        </Card>
      </Content>
    </Fragment>
  );
};
