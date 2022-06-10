/**
 * @Description: 检验单平台--头表
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-04-02 19:42:14
 * @LastEditors: yu.na
 */

import React, { Fragment, useContext, useEffect, useState } from 'react';
import {
  Table,
  Lov,
  Form,
  Button,
  DatePicker,
  Select,
  DateTimePicker,
  Modal,
} from 'choerodon-ui/pro';
import { Tag, Popover } from 'choerodon-ui';
import intl from 'utils/intl';
import { getResponse } from 'utils/utils';
// import { ExportButton } from 'hlos-front/lib/components';
import { Header, Content } from 'components/Page';

import { queryLovData } from 'hlos-front/lib/services/api';
import Store from '@/stores/inspectionDocDS';
import { requestException } from '@/services/inspectionDocService';

import LineList from './InspectionDocLine';
import './index.less';

const preCode = 'lmes.inspectionDoc';

export default () => {
  const { listDS, lineDS } = useContext(Store);
  const [inspectionDocId, setInspectionDocId] = useState(-1);
  const [showFlag, setShowFlag] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  /**
   *设置默认查询条件
   */
  useEffect(() => {
    async function defaultLovSetting() {
      const res = await queryLovData({ lovCode: 'LMDS.ORGANIZATION', defaultFlag: 'Y' });

      if (getResponse(res)) {
        if (res && res.content && res.content[0]) {
          listDS.queryDataSet.current.set('organizationObj', {
            organizationId: res.content[0].organizationId,
            organizationName: res.content[0].organizationName,
          });
        }
      }
    }
    defaultLovSetting();
  }, [listDS]);

  function orderStatusRender(value, meaning) {
    let actionText = meaning;
    switch (value) {
      case 'NEW': // 浅蓝色
        actionText = <Tag color="#2db7f5">{meaning}</Tag>;
        break;
      case 'CONCESSION': // 黄色
        actionText = <Tag color="yellow">{meaning}</Tag>;
        break;
      case 'PASS':
      case 'ONGOING': // 绿色
        actionText = <Tag color="green">{meaning}</Tag>;
        break;
      case 'COMPLETED': // 灰色
        actionText = <Tag color="gray">{meaning}</Tag>;
        break;
      case 'FAILED':
      case 'CANCELLED': // 浅红色
        actionText = <Tag color="#f50">{meaning}</Tag>;
        break;
      default:
        break;
    }
    return actionText;
  }

  /**
   *table列
   * @returns
   */
  function columns() {
    return [
      { name: 'organization', width: 150, lock: true },
      { name: 'inspectionDocNum', width: 150, renderer: linkRenderer, lock: true },
      { name: 'inspectionTemplateTypeMeaning', width: 150 },
      {
        name: 'qcStatusMeaning',
        width: 100,
        renderer: ({ value, record }) => orderStatusRender(record.data.qcStatus, value),
      },
      { name: 'party', width: 150 },
      { name: 'operation', width: 150 },
      { name: 'itemCode', width: 150 },
      { name: 'description', width: 150 },
      { name: 'batchQty', width: 85 },
      { name: 'qcOkQty', width: 85 },
      { name: 'concessionQty', width: 85 },
      { name: 'returnedQty', width: 85 },
      { name: 'declarer', width: 150 },
      { name: 'startDate', width: 155 },
      { name: 'judgedDate', width: 155 },
      { name: 'duration', width: 150 },
      { name: 'inspector', width: 150, tooltip: 'overflow' },
      { name: 'createDate', width: 155 },
      { name: 'sourceDocNum', width: 150 },
      { name: 'inspectionGroupName', width: 150 },
      { name: 'remark', width: 150, renderer: remarkRender },
      { name: 'processRemark', width: 150, renderer: remarkRender },
      {
        header: intl.get('hzero.common.button.action').d('操作'),
        width: 120,
        command: ({ record }) => {
          return [
            <Button
              // icon="delete"
              // color="primary"
              funcType="flat"
              onClick={(e) => handleShowException(record.data, e)}
            >
              不良原因
            </Button>,
          ];
        },
        lock: 'right',
      },
    ];
  }

  function remarkRender({ value }) {
    return (
      <Popover content={value} placement="top">
        {value}
      </Popover>
    );
  }

  /**
   *显示超链接
   * @returns
   */
  function linkRenderer({ value }) {
    return <a>{value}</a>;
  }

  /**
   *tab查询条件
   * @returns
   */
  function queryFields() {
    return [
      <Lov name="organizationObj" noCache key="organizationObj" />,
      <Lov name="inspectionDocObj" noCache key="inspectionDocObj" />,
      <Select name="inspectionTemplateType" key="inspectionTemplateType" />,
      <Select name="qcStatus" key="qcStatus" />,
      <Lov name="sourceDocObj" noCache key="sourceDocObj" />,
      <Lov name="itemObj" noCache key="itemObj" />,
      <Lov name="partyObj" noCache key="partyObj" />,
      <Lov name="declarerObj" noCache key="declarerObj" />,
      <DatePicker name="createDateMin" key="createDateMin" />,
      <DatePicker name="createDateMax" key="createDateMax" />,
      <DateTimePicker name="judgedDateMin" key="judgedDateMin" />,
      <DateTimePicker name="judgedDateMax" key="judgedDateMax" />,
      <Lov name="operationObj" noCache key="operationObj" />,
    ];
  }

  /**
   *通过点击来查行,并且在此设置行颜色。
   * @param {*} { record }
   * @returns
   */
  function handleRowChange({ record }) {
    return {
      onClick: () => {
        setInspectionDocId(record.data.inspectionDocId);
        lineDS.queryParameter = { inspectionDocId: record.data.inspectionDocId };
        lineDS.query();
      },
    };
  }

  /**
   * 查询
   */
  async function handleSearch() {
    const validateValue = await listDS.validate(false, false);
    if (!validateValue) {
      return;
    }

    await listDS.query();
    setInspectionDocId(-1);
  }

  /**
   * 重置
   */
  function handleReset() {
    listDS.queryDataSet.current.reset();
  }

  /**
   * 切换显示隐藏
   */
  function handleToggle() {
    setShowFlag(!showFlag);
  }

  /**
   * 分页变化
   */
  function handlePageChange(page) {
    if (page !== currentPage) {
      setCurrentPage(page);
      setInspectionDocId(-1);
    }
  }

  async function handleShowException(record = {}, e) {
    if (e) e.stopPropagation();
    const res = await requestException({
      inspectionDocId: record.inspectionDocId,
    });
    if (getResponse(res) && !res.failed && Array.isArray(res) && res.length) {
      Modal.open({
        key: 'hg-inspection-doc-exception-modal',
        title: '不良原因',
        footer: null,
        closable: true,
        children: (
          <table className="hg-inspection-doc-exception-modal">
            <thead>
              <tr>
                <th>序号</th>
                <th>不良原因</th>
                <th>数量</th>
              </tr>
            </thead>
            {res.map((i, index) => {
              return (
                <tbody>
                  <tr>
                    <td>{index + 1}</td>
                    <td>{i.exceptionName}</td>
                    <td>{i.exceptionQty}</td>
                  </tr>
                </tbody>
              );
            })}
          </table>
        ),
      });
    }
  }

  /**
   *渲染表格查询条件
   * @returns
   */
  function renderBar(queryDataSet) {
    return (
      <div style={{ display: 'flex', marginBottom: '10px', alignItems: 'flex-start' }}>
        <Form dataSet={queryDataSet} columns={4} style={{ flex: 'auto' }}>
          {!showFlag ? queryFields().slice(0, 4) : queryFields()}
        </Form>
        <div style={{ marginLeft: 8, flexShrink: 0, display: 'flex', alignItems: 'center' }}>
          <Button onClick={handleToggle}>
            {!showFlag
              ? intl.get('hzero.common.button.viewMore').d('更多查询')
              : intl.get('hzero.common.button.collected').d('收起查询')}
          </Button>
          <Button onClick={handleReset}>{intl.get('hzero.common.button.reset').d('重置')}</Button>
          <Button color="primary" onClick={() => handleSearch()}>
            {intl.get('hzero.common.button.search').d('查询')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Fragment>
      <Header title={intl.get(`${preCode}.view.title.inspectionDoc`).d('检验单平台')}>
        {/* <ExportButton
          reportCode={['HG.LMES.INSPECTION_DOC']}
          exportTitle={
            intl.get(`${preCode}.view.title.inspectionDoc`).d('检验单平台') +
            intl.get('hzero.common.button.export').d('导出')
          }
        /> */}
      </Header>
      <Content className="lmes-inspectionDoc-content">
        <Table
          dataSet={listDS}
          columns={columns()}
          border={false}
          columnResizable="true"
          editMode="inline"
          queryBar={({ queryDataSet }) => renderBar(queryDataSet)}
          onRow={(record) => handleRowChange(record)}
          pagination={{
            onChange: (page) => handlePageChange(page),
          }}
        />
        {inspectionDocId !== -1 && <LineList tableDS={lineDS} />}
      </Content>
    </Fragment>
  );
};
