/**
 * @Description: 产品追溯--index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2021-06-29 09:58:47
 * @LastEditors: yu.na
 */

import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { Form, Radio, DataSet, Select, TextField, Lov, Button, Modal } from 'choerodon-ui/pro';
import { Timeline, Tooltip, Spin } from 'choerodon-ui';
import { Tree } from 'hzero-ui';
import { isEmpty } from 'lodash';
import { Content } from 'components/Page';
import Icons from 'components/Icons';
import { getResponse } from 'utils/utils';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { userSetting } from 'hlos-front/lib/services/api';
// import defaultAvatorImg from 'hlos-front/lib/assets/img-default-avator.png';
import { TreeDS } from '@/stores/productTracingDS';
import {
  productTraceDetails,
  createProductTraceHeaders,
  productTraceHistory,
  productTraceHeaders,
} from '@/services/productTracingService';
import HistoryModal from './HistoryModal';
import styles from './index.less';

const preCode = 'lmes.productTracing';
const { TreeNode } = Tree;
let modal = null;

const ProductTracing = () => {
  const ds = useMemo(() => new DataSet(TreeDS()), []);

  const [currentCondition, setCondition] = useState('');
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [initialLineList, setInitialLineList] = useState([]);
  const [treeData, setTreeData] = useState([]);
  const [timeNodeList, setTimeNodeList] = useState([]);
  const [currentSelected, setCurrentSelected] = useState({});
  const [lineLoading, setLineLoading] = useState(false);
  const [currenDirection, setCurrenDirection] = useState(false);
  const [orderLabel, setOrderLabel] = useState('');

  useEffect(() => {
    async function getDefaultOrg() {
      const res = await userSetting({
        defaultFlag: 'Y',
      });
      if (res && res.content && res.content[0]) {
        const { meOuId, meOuCode, meOuName, workerId, workerCode, workerName } = res.content[0];
        ds.queryDataSet.current.set('meOuObj', {
          meOuId,
          meOuCode,
          organizationName: meOuName,
        });
        ds.queryDataSet.current.set('workerObj', {
          workerId,
          workerCode,
          workerName,
        });
      }
    }
    getDefaultOrg();
  }, []);

  function handleConditionChange(val) {
    setCondition(val);
    const arr = ['soObj', 'itemObj', 'shipOrderObj', 'tagCode'];
    let requireArr = [];
    let _orderLabel = '';
    switch (val) {
      case 'SO.ITEM':
        requireArr = ['soObj', 'itemObj'];
        _orderLabel = '销售订单';
        break;
      case 'SO':
        requireArr = ['soObj'];
        _orderLabel = '销售订单';
        break;
      case 'SHO.ITEM':
        requireArr = ['shipOrderObj', 'itemObj'];
        _orderLabel = '发货单';
        break;
      case 'SHO':
        requireArr = ['shipOrderObj'];
        _orderLabel = '发货单';
        break;
      case 'TAG':
        requireArr = ['tagCode'];
        _orderLabel = '标签';
        break;
      default:
        break;
    }
    setOrderLabel(_orderLabel);
    arr.forEach((i) => {
      if (requireArr.includes(i)) {
        ds.queryDataSet.getField(i).set('required', true);
        ds.queryDataSet.current.set(i, null);
      } else {
        ds.queryDataSet.getField(i).set('required', false);
        ds.queryDataSet.current.set(i, null);
      }
    });
  }

  function handleDirectionChange(val) {
    setCurrenDirection(val);
    if (val) {
      ds.queryDataSet.getField('traceType0').set('required', true);
      ds.queryDataSet.getField('traceType1').set('required', false);
      ds.queryDataSet.current.set('traceType1', null);
    } else {
      ds.queryDataSet.getField('traceType0').set('required', false);
      ds.queryDataSet.getField('traceType1').set('required', true);
      ds.queryDataSet.current.set('traceType0', null);
    }
    handleConditionChange();
  }

  function handleSetTraceNum() {
    const {
      soNum,
      shipOrderNum,
      itemCode,
      tagCode,
      traceType,
    } = ds.queryDataSet.current.toJSONData();
    let traceNum = '';

    if (traceType === 'SO') {
      traceNum = soNum;
    } else if (traceType === 'SHO') {
      traceNum = shipOrderNum;
    } else if (traceType === 'SO.ITEM') {
      traceNum = `${soNum}.${itemCode}`;
    } else if (traceType === 'SHO.ITEM') {
      traceNum = `${shipOrderNum}.${itemCode}`;
    } else if (traceType === 'TAG') {
      traceNum = tagCode;
    }
    return traceNum;
  }

  function renderTreeNodes(data) {
    return data.map((item) => {
      let title = '';
      if (
        item.traceLineType === 'SO' ||
        item.traceLineType === 'SHIP' ||
        item.traceLineType === 'SHO'
      ) {
        title = `${item?.traceLineTypeMeaning || ''} ${item?.documentNum || ''} ${item?.partyName || ''
          }`;
      } else if (
        item.traceLineType === 'SO_LINE' ||
        item.traceLineType === 'SHIP_LINE' ||
        item.traceLineType === 'SHO_LINE'
      ) {
        title = `${item?.traceLineTypeMeaning || ''} ${item?.documentLineNum || ''} ${item?.itemCode || ''
          } ${item?.itemDescription || ''}`;
      } else if (item.traceLineType === 'ITEM') {
        title = `${item?.relationTypeMeaning || ''} ${item?.tagCode || ''} ${item?.itemCode || ''
          } ${item?.itemDescription || ''}`;
      }
      const commonProps = {
        title,
        key: item.traceLineId,
        dataRef: item,
      };
      if (item.children) {
        return (
          <TreeNode {...commonProps}>
            {renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...commonProps} />;
    });
  }

  function handleLineClick(_, { node }) {
    setCurrentSelected(node.props.dataRef);
    getLineInfo(node.props.dataRef.traceLineId);
  }

  async function getLineInfo(traceLineId) {
    setLineLoading(true);
    const res = await productTraceDetails({ traceLineId });
    setLineLoading(false);
    if (getResponse(res) && Array.isArray(res)) {
      setTimeNodeList(res);
    }
  }

  async function handleShowTraceModal(list, headerInfo) {
    modal = Modal.open({
      key: 'lmes-product-tracing-history-modal',
      title: '追溯记录',
      className: styles['lmes-product-tracing-history-modal'],
      children: (
        <HistoryModal headerInfo={headerInfo} onItemClick={handleHistoryItemClick} list={list} />
      ),
      onOk: handleSearch,
    });
  }

  async function handleTrace() {
    const {
      organizationId,
      organizationCode,
      organizationName,
      soId,
      shipOrderId,
      itemId,
      tagCode,
      traceDirection,
      traceType,
      workerId,
      workerCode,
      workerName,
    } = ds.queryDataSet.current.toJSONData();
    const traceNum = handleSetTraceNum();
    const res = await createProductTraceHeaders({
      organizationId,
      organizationCode,
      organizationName,
      soId,
      shipOrderId,
      itemId,
      tagCode,
      traceType,
      traceDirection,
      traceNum,
      workerId,
      worker: workerCode,
      workerName,
    });
    if (res && res.failed && res.message) {
      notification.error({
        message: res.message,
      });
    } else {
      notification.success({
        message: '追溯成功',
      });
      if(res.traceId) {
        handleSearch(res);
      }
    }
  }

  async function handleTraceClick() {
    const validateValue = await ds.queryDataSet.validate(false, false);
    if (!validateValue) return;
    const { traceDirection, traceType, itemCode } = ds.queryDataSet.current.toJSONData();
    const traceNum = handleSetTraceNum();
    const res = await productTraceHistory({
      traceNum,
      traceDirection,
      traceType,
    });
    if (getResponse(res) && Array.isArray(res)) {
      if (res.length) {
        const traceArr = traceNum.split('.');
        const headerInfo = {
          orderLabel,
          traceNum: traceArr[0],
          itemCode,
        };
        Modal.confirm({
          children: <p>{intl.get(`${preCode}.view.message.searchRecord`).d('是否查询以往追溯记录？')}</p>,
          okText: '是',
          cancelText: '否',
          onOk: () => handleShowTraceModal(res, headerInfo),
          onCancel: handleTrace,
        });
      } else {
        handleTrace();
      }
    }
  }

  function handleHistoryItemClick(rec, list) {
    const cloneHisList = [...list];
    cloneHisList.forEach((i) => {
      if (i.traceId === rec.traceId) {
        i.active = true;
      } else {
        i.active = false;
      }
    });
    const traceArr = rec.traceNum.split('.');
    const headerInfo = {
      orderLabel,
      traceNum: traceArr[0],
      itemCode: ds.queryDataSet.current.get('itemCode'),
    };
    modal.update({
      key: 'lmes-product-tracing-history-modal',
      title: '追溯记录',
      className: styles['lmes-product-tracing-history-modal'],
      children: (
        <HistoryModal
          headerInfo={headerInfo}
          onItemClick={handleHistoryItemClick}
          list={cloneHisList}
        />
      ),
      onOk: () => handleSearch(rec),
    });
  }

  async function handleSearch(rec) {
    const { traceType, traceDirection, organizationId } = ds.queryDataSet.current.toJSONData();
    const res = await productTraceHeaders({
      traceType,
      traceDirection,
      organizationId,
      traceId: rec.traceId,
    });
    if (getResponse(res) && res.productTraceLineList) {
      setExpandedKeys([]);
      setInitialLineList(res.productTraceLineList);
      getTreeList(res.productTraceLineList);
    }
  }

  function findChild(node, current) {
    const index = node.findIndex((i) => i.traceLineId === current.parentLineId);
    if (index >= 0) {
      if (node[index].children) {
        node[index].children.push(current);
      } else {
        node[index].children = [current];
      }
    } else {
      node.forEach((j) => {
        if (j.children) {
          findChild(j.children, current);
        }
      });
    }
  }
  function getTreeList(arr) {
    const newTreeList = [];
    for (let i = 0; i < arr.length; i++) {
      if (!newTreeList.length) {
        newTreeList.push(arr[i]);
      } else {
        findChild(newTreeList, arr[i]);
      }
    }
    setTreeData(newTreeList);
  }
  function handleExpandAll() {
    const keys = initialLineList.map((i) => i.traceLineId);
    setExpandedKeys(keys);
  }

  function handleCollapseAll() {
    setExpandedKeys([]);
  }

  function qtyRender(rec) {
    const commonStyle = {
      display: 'inline-block',
      width: 6,
      height: 6,
      borderRadius: '50%',
    };
    return (
      <div style={{ padding: '4px 8px' }}>
        <div style={{ marginBottom: 4 }}>
          <span
            style={{
              ...commonStyle,
              background: '#2D9558',
            }}
          />
          <span style={{ margin: '0 24px 0 8px' }}>合格</span>
          <span>{rec.okQty || 0}</span>
        </div>
        <div>
          <span
            style={{
              ...commonStyle,
              background: '#EF6C00',
            }}
          />
          <span style={{ margin: '0 24px 0 8px' }}>返修</span>
          <span>{rec.reworkQty || 0}</span>
        </div>
      </div>
    );
  }

  function handleLineExpand(_, { node }) {
    const newExpandKeys = [...expandedKeys];
    const idx = expandedKeys.findIndex((i) => i === node.props.dataRef.traceLineId);
    if (idx > -1) {
      newExpandKeys.splice(idx, 1);
    } else {
      newExpandKeys.push(node.props.dataRef.traceLineId);
    }
    setExpandedKeys(newExpandKeys);
  }

  return (
    <Fragment>
      <div className={styles['lmes-product-tracing-header']}>
        <Radio
          dataSet={ds.queryDataSet}
          mode="button"
          name="traceDirection"
          value={false}
          onChange={handleDirectionChange}
        >
          {'成品->原材料'}
        </Radio>
        <Radio
          dataSet={ds.queryDataSet}
          mode="button"
          name="traceDirection"
          value={Boolean(1)}
          onChange={handleDirectionChange}
        >
          {'原材料->成品'}
        </Radio>
      </div>
      <Content className={styles['lmes-product-tracing-content']}>
        <div className={styles['lmes-product-tracing-form']}>
          <Form dataSet={ds.queryDataSet} columns={4} labelLayout="placeholder">
            <Lov name="meOuObj" />
            <Select
              name={currenDirection ? 'traceType0' : 'traceType1'}
              onChange={handleConditionChange}
            />
            {(currentCondition === 'SO.ITEM' || currentCondition === 'SO') && <Lov name="soObj" />}
            {(currentCondition === 'SHO.ITEM' || currentCondition === 'SHO') && (
              <Lov name="shipOrderObj" />
            )}
            {(currentCondition === 'SHO.ITEM' || currentCondition === 'SO.ITEM') && (
              <Lov name="itemObj" />
            )}
            {currentCondition === 'TAG' && <TextField name="tagCode" />}
          </Form>
          <div>
            {/* <Button color="primary" onClick={handleShowTraceModal}>
              {intl.get(`hzero.common.button.search`).d('查询')}
            </Button> */}
            <Button color="primary" onClick={handleTraceClick}>
              {intl.get(`${preCode}.button.trace`).d('追溯')}
            </Button>
          </div>
        </div>
        <div className={styles['tree-detail-wrapper']}>
          {treeData.length ? (
            <div className={styles['tree-wrapper']}>
              <div className={styles['expand-collapse-btn']}>
                <div onClick={handleExpandAll}>
                  <Icons type="icon-wrapper" size="24" />
                  {intl.get('hzero.common.button.expandAll').d('全部展开')}
                </div>
                <div onClick={handleCollapseAll}>
                  <Icons type="a-icon-wrapper1" size="24" />
                  {intl.get('hzero.common.button.collapseAll').d('全部收起')}
                </div>
              </div>
              <Tree
                showLine
                expandedKeys={expandedKeys}
                onExpand={handleLineExpand}
                onSelect={handleLineClick}
              >
                {renderTreeNodes(treeData)}
              </Tree>
            </div>
          ) : null}
          {!isEmpty(currentSelected) && (
            <div className={styles['detail-wrapper']}>
              <div className={styles['item-info']}>
                <div>
                  <div className={styles.item}>
                    {currentSelected.itemCode}
                  </div>
                  <div className={styles.item}>
                    {currentSelected.itemDescription}
                  </div>
                  <div className={styles.tag}>标签：{currentSelected.tagCode}</div>
                </div>
                {/* <div className={styles['lot-gropup']}>
                  <div>
                    <Icons type="lot" size="16" />
                    <span className={styles['lot-label']}>采购/生产批次</span>
                    <span>T202105241429</span>
                  </div>
                  <div>
                    <Icons type="lot" size="16" />
                    <span className={styles['lot-label']}>供应商批次</span>
                    <span>T202105241429</span>
                  </div>
                  <div>
                    <Icons type="lot" size="16" />
                    <span className={styles['lot-label']}>材料批次</span>
                    <span>T202105241429</span>
                  </div>
                </div> */}
              </div>
              <Spin spinning={lineLoading}>
                <div className={styles['lifecycle-node']}>
                  <Timeline>
                    {timeNodeList.map((i, index) => {
                      return (
                        <Timeline.Item color={index === 0 ? '#1890FF' : '#ccc'}>
                          <div className={styles.time}>{i.executeTime}</div>
                          <div className={styles['lifecycle-node-content']}>
                            <div>
                              {/* <img src={defaultAvatorImg} alt="" /> */}
                              <Tooltip title={i.worker}>{i.workerName}</Tooltip>
                            </div>
                            <div>
                              <div>
                                {i.executeTypeMeaning} {i.operationName}
                              </div>
                              <div>
                                <span>商业伙伴：</span>
                                {i.partyName}
                              </div>
                            </div>
                            <div>
                              <div>
                                <Tooltip title={qtyRender(i)}>
                                  <span>执行数量：</span>
                                  <span>{i.executeQty}</span>
                                </Tooltip>
                              </div>
                              <div>
                                <span>仓储地点：</span>
                                {i.executeWmSite}
                              </div>
                            </div>
                            <div>
                              <div>
                                <span className={styles.mo}>{i.documnetNum}</span>
                                {i.documentTypeName && (
                                  <span className={styles['doc-type']}>{i.documentTypeName}</span>
                                )}
                              </div>
                              <div>
                                <span>生产地点：</span>
                                {i.executeMeSite}
                              </div>
                            </div>
                          </div>
                        </Timeline.Item>
                      );
                    })}
                  </Timeline>
                </div>
              </Spin>
            </div>
          )}
        </div>
      </Content>
    </Fragment>
  );
};

export default ProductTracing;
