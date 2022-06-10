/* eslint-disable no-undef */
/*
 * @Description: OQC检验
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-03-23 14:07:50
 */

import React, { Fragment, useState, useEffect } from 'react';
import { Header } from 'components/Page';
import { DataSet, Form, Lov, Button, CheckBox, Pagination, Icon, Spin } from 'choerodon-ui/pro';
import { Row, Col } from 'choerodon-ui';

import uuidv4 from 'uuid/v4';
import notification from 'utils/notification';
import { getResponse } from 'utils/utils';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { userSetting } from 'hlos-front/lib/services/api';
import { oqcQueryDS, pageDS } from '@/stores/oqcInspectionDS';
import moment from 'moment';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';

import down from 'hlos-front/lib/assets/icons/sort-down.svg';
import up from 'hlos-front/lib/assets/icons/sort-up.svg';
import { passInspectionDocGroup } from '@/services/oqcInspectionService.js';
import Card from './card';
import style from './index.less';

const queryFactory = () => new DataSet(oqcQueryDS());
const dataFactory = () => new DataSet(pageDS());

function OqcInspection(props) {
  const queryDS = useDataSet(queryFactory, OqcInspection);
  const dataDS = useDataSet(dataFactory);

  const [timeToggle, setTimeToggle] = useState('DESC');
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    async function getUserInfo() {
      const res = await userSetting({ defaultFlag: 'Y' });
      if (res && res.content && res.content.length) {
        queryDS.queryDataSet.current.set('organizationObj', {
          organizationId: res.content[0].organizationId,
          organizationCode: res.content[0].organizationCode,
          organizationName: res.content[0].organizationName,
        });
        if (dataDS.current) {
          dataDS.current.set('judgeObj', {
            workerId: res.content[0].workerId,
            workerCode: res.content[0].workerCode,
            workerName: res.content[0].workerName,
          });
        }
      }
      handleQuery();
    }
    getUserInfo();
  }, []);

  const queryFields = [
    <Lov name="organizationObj" key="organizationObj" placeholder="组织" />,
    <Lov name="documentObj" key="documentObj" placeholder="来源单据号" />,
    <Lov name="partyObj" key="partyObj" placeholder="客户" />,
    <Lov name="workerObj" key="workerObj" placeholder="报检人" />,
  ];

  // 二级头
  function SubHeader() {
    return (
      <Row className={style['sub-header']}>
        <Col span={2}>
          <div style={{ marginRight: '20px' }} onClick={handleTimeToggle}>
            时间
            <img
              style={{ marginLeft: '8px' }}
              src={timeToggle === 'DESC' ? down : up}
              alt="down-up"
            />
          </div>
        </Col>
        <Col span={6}>
          <div className={style['ds-ai-center']}>
            判定
            <Lov
              style={{ marginLeft: '10px', width: '45%' }}
              dataSet={dataDS}
              name="judgeObj"
              key="judgeObj"
            />
          </div>
        </Col>
        <Col span={8} offset={8} style={{ textAlign: 'right', paddingRight: '12px' }}>
          <CheckBox name="allChecked" dataSet={dataDS} onChange={handleAllChecked}>
            全选
          </CheckBox>
          <Button color="primary" onClick={handleBatchOperation}>
            合格
          </Button>
        </Col>
      </Row>
    );
  }

  // 卡片内容区域
  function CardContent() {
    const _list = list.slice();
    return _list.map((v, i) => (
      <Card
        key={uuidv4()}
        data={v}
        onChange={(value) => handleSingleChange(value, i)}
        onToDetails={() => handleToDetails(v)}
      />
    ));
  }

  // 批量合格
  function handleAllChecked() {
    const isAllChecked = dataDS.current.get('allChecked');
    let _list = list.slice();
    _list = _list.map((v) => ({
      ...v,
      checked: isAllChecked,
    }));
    setList(_list);
  }

  // 卡片选中切换
  function handleSingleChange(value, index) {
    const _list = list.slice();
    _list[index].checked = !_list[index].checked;
    dataDS.current.set(
      'allChecked',
      _list.every((v) => v.checked)
    );
    setList(_list);
  }

  // 点击卡片跳转至执行页面
  function handleToDetails(item) {
    const _data = dataDS.toJSONData() || [];
    props.history.push({
      pathname: `/pub/lmes/oqc-inspection/execute`,
      state: { ...item, ..._data[0] },
    });
  }

  // 升序 倒序切换
  function handleTimeToggle() {
    queryDS.setQueryParameter('sortDirection', timeToggle === 'DESC' ? 'ASC' : 'DESC');
    setTimeToggle(timeToggle === 'DESC' ? 'ASC' : 'DESC');
    handleQuery();
  }

  // 批量合格判定
  async function handleBatchOperation() {
    const _list = list.slice();
    const _data = dataDS.toJSONData();
    const _queryData = queryDS.queryDataSet.toJSONData();
    let checkedArray = _list.filter((ele) => ele.checked);
    checkedArray = checkedArray.map((ele) => ({
      ...ele,
      inspectionDocGroups: ele.inspectionDocGroup,
      inspectionDocType: 'OQC',
      organizationId: _queryData[0].organizationId,
      organizationCode: _queryData[0].organizationCode,
      inspectorId: _data[0].workerId,
      inspector: _data[0].workerCode,
      judgedDate: moment().format(DEFAULT_DATETIME_FORMAT),
      remark: null,
    }));
    if (checkedArray.length) {
      const res = await passInspectionDocGroup(checkedArray);
      if(getResponse(res)) {
        notification.success({
          message: '提交成功',
        });
        handleQuery();
      }
    } else {
      notification.warning({
        message: '没有勾选项',
      });
    }
  }

  function sizeChangerRenderer({ text }) {
    return `${text} 条/页`;
  }

  function pagerRenderer(page, type) {
    switch (type) {
      case 'first':
        return <Icon type="fast_rewind" />;
      case 'last':
        return <Icon type="fast_forward" />;
      case 'prev':
        return <Icon type="navigate_before" />;
      case 'next':
        return <Icon type="navigate_next" />;
      case 'jump-prev':
      case 'jump-next':
        return '•••';
      default:
        return page;
    }
  }

  // 页码更改
  function handlePageChange(value) {
    setCurrentPage(value - 1);
    handleQuery(value - 1);
  }

  // 查询
  async function handleQuery(curPage = currentPage) {
    setLoading(true);
    queryDS.setQueryParameter('page', curPage);
    // queryDS.setQueryParameter('sortDirection', timeToggle);
    const res = await queryDS.query();
    if (getResponse(res) && res.content && res.content.length) {
      const _resData = res.content.map((rec) => ({
        ...rec,
        checked: false,
      }));
      setList(_resData);
      setTotalCount(res.totalElements);
    }
    setLoading(false);
  }

  return (
    <Fragment>
      <Header title="OQC检验" />
      <div className={style['oqc-inspection-content']}>
        <div className={style['oqc-header']}>
          <Form dataSet={queryDS.queryDataSet} columns={4} labelLayout="placeholder">
            {queryFields}
          </Form>
          <Button color="primary" style={{ marginLeft: '20px' }} onClick={handleQuery}>
            查询
          </Button>
        </div>
        <div className={style['oqc-sub-header']}>
          <SubHeader />
        </div>
        <div className={style['oqc-card-list']}>
          <CardContent />
          {loading ? (
            <div className={style['my-loading-yes-no']}>
              <Spin tip="Loading..." />
            </div>
          ) : null}
        </div>
        <div className={style['oqc-footer']}>
          <Pagination
            showSizeChangerLabel={false}
            showTotal={false}
            showPager
            sizeChangerPosition="center"
            sizeChangerOptionRenderer={sizeChangerRenderer}
            itemRender={pagerRenderer}
            total={totalCount}
            onChange={handlePageChange}
            pageSize={20}
            page={currentPage + 1}
          />
        </div>
      </div>
    </Fragment>
  );
}

export default OqcInspection;
