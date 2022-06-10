/* eslint-disable no-nested-ternary */
/*
 * @Description: 质量追溯
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2020-06-27 13:02:28
 * @LastEditors: 赵敏捷
 */
import React, { useState, useMemo, Fragment, useEffect, useCallback } from 'react';
import { SelectBox, DataSet, Lov, Icon, Radio, Spin } from 'choerodon-ui/pro';

import { Tree } from 'choerodon-ui';

// import notification from 'utils/notification';
import { Header } from 'components/Page';
import {
  prodToMaterialTreeData,
  materialToProdTreeData,
  finishedProductDetail,
  semiFinishedProductsDetail,
  prodToMaterialTagPair,
  prodToMaterialProdPair,
  materialToProdPair,
  getNodeRoute,
} from './mockData';

import noDataImg from '../../assets/qualityTraceability/nodata.svg';

import { filterDSConfig } from '@/stores/qualityTraceabilityDS';
import styles from './index.module.less';

const { Option } = SelectBox;
const { TreeNode } = Tree;

function renderTreeNodes(data) {
  return data.map((item) => {
    if (item.children) {
      return (
        <TreeNode title={item.title} key={item.key} dataRef={item}>
          {renderTreeNodes(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode key={item.key} {...item} />;
  });
}

function LineIcon() {
  return (
    <div className={styles['line-icon']}>
      <div className={styles['dash-line']} />
      <div className={styles.square} />
    </div>
  );
}

function Line({ info }) {
  return (
    <div className={styles['production-info-line']}>
      <LineIcon />
      <span>{info[0]}</span>
      <span>{info[1]}</span>
      <span>{info[2]}</span>
      <span style={{ color: '#2ABECF' }}>完工{info[3]}</span>
      <span style={{ color: '#52C41B' }}>合格{info[4]}</span>
      <span style={{ color: '#52C41B' }}>{info[5] ? `报废: ${info[5]}` : ''}</span>
      <span>{info[6] ? `报废原因：${info[6]}` : ''}</span>
    </div>
  );
}

function ValidationInfoLine({ info }) {
  return (
    <div className={styles['validation-info-line']}>
      <span style={{ color: '#52C41B' }}>{info[0]}</span>
      <span>{info[1]}</span>
      <span>{info[2]}</span>
      <span>{info[3]}</span>
      <span>{info[4]}</span>
    </div>
  );
}

export default function QualityTraceability() {
  const [loading, setLoading] = useState(false);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [selectedKey, setSelectedKey] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [finishedIndex, setFinishedIndex] = useState(-1);
  const [semiFinishedIndex, setSemiFinishedIndex] = useState(-1);
  const [treeDataSource, setTreeDataSource] = useState([]);
  const [finishedProductionDetailDataSource, setFinishedProductionDetailDataSource] = useState([]);
  const [semiFinishedProductsDetailDataSource, setSemiFinishedProductsDetailDataSource] = useState(
    []
  );
  const [toggleProductionInfo, setToggleProductionInfo] = useState(true);
  const [toggleValidationInfo, setToggleValidationInfo] = useState(true);
  const [baseType, setBaseType] = useState('prodToMaterial');
  const filterDS = useMemo(() => new DataSet(filterDSConfig()), []);
  const [type, setType] = useState('销售订单');
  const [noData, setNoData] = useState(false);

  function clearData() {
    setToggleProductionInfo(true);
    setToggleValidationInfo(true);
    setTreeDataSource([]);
    setSelectedKey([]);
    setFinishedProductionDetailDataSource([]);
    setSemiFinishedProductsDetailDataSource([]);
    filterDS.current.clear();
  }

  function handleChange(value) {
    setType(value);
    clearData();
  }

  function handleToggle(toggleType) {
    if (toggleType === 'production') {
      setToggleProductionInfo(!toggleProductionInfo);
    } else {
      setToggleValidationInfo(!toggleValidationInfo);
    }
  }

  function handleBaseTypeChange() {
    setBaseType(baseType === 'prodToMaterial' ? 'materialToProd' : 'prodToMaterial');
    clearData();
    filterDS.current.clear();
  }

  useEffect(() => {
    filterDS.addEventListener('update', ({ record, name, value }) => {
      if (value && record.get('soNum')) {
        const { attribute1: trueVal } = value;
        setLoading(true);
        if (name === 'soNum' && treeDataSource.length === 0) {
          setTreeDataSource(
            baseType === 'prodToMaterial' ? prodToMaterialTreeData : materialToProdTreeData
          );
        }
        if (name === 'prod' || name === 'tag') {
          setNoData(false);
          const treeTitles =
            baseType === 'prodToMaterial'
              ? Object.keys(name === 'prod' ? prodToMaterialProdPair : prodToMaterialTagPair)
              : Object.keys(materialToProdPair);
          const title = treeTitles.find((i) => i.includes(trueVal));
          if (title) {
            const tmpKey =
              baseType === 'prodToMaterial'
                ? [(name === 'prod' ? prodToMaterialProdPair : prodToMaterialTagPair)[title]]
                : [materialToProdPair[title]];
            setSelectedKey(tmpKey);
            // console.log('find key: ', [prodToMaterialProdPair[title]]);
            if (tmpKey) {
              const route = getNodeRoute(
                {
                  key: 'root',
                  children:
                    baseType === 'prodToMaterial' ? prodToMaterialTreeData : materialToProdTreeData,
                },
                tmpKey[0]
              );
              console.log('route: ', route);
              setExpandedKeys(route);
              onSelect(tmpKey);
            }
          } else {
            setNoData(true);
          }
        }
        setTimeout(() => setLoading(false), 500);
      } else {
        if (name === 'soNum') {
          setTreeDataSource([]);
        }
        setSelectedKey([]);
        setExpandedKeys([]);
        setToggleProductionInfo(true);
        setToggleValidationInfo(true);
        setFinishedIndex(-1);
        setSemiFinishedIndex(-1);
      }
    });
  }, [filterDS, baseType, treeDataSource, onSelect]);

  const onSelect = useCallback(
    (selectedKeys) => {
      const _clearData = () => {
        setFinishedIndex(-1);
        setSemiFinishedIndex(-1);
        setFinishedProductionDetailDataSource([]);
        setSemiFinishedProductsDetailDataSource([]);
        setToggleProductionInfo(true);
        setToggleValidationInfo(true);
      };
      // console.log('selectedKeys', selectedKeys);
      const _key = selectedKeys[0];
      const l1 = _key?.includes('l1');
      const l2 = _key?.includes('l2');
      const l3 = _key?.includes('l3');
      if (baseType === 'prodToMaterial') {
        if (l1) {
          const index = _key.includes('l1-0')
            ? 2
            : _key.includes('l1-1')
            ? 1
            : _key.includes('l1-2')
            ? 0
            : 0;
          setFinishedIndex(index);
          setSemiFinishedIndex(index);
          setFinishedProductionDetailDataSource(finishedProductDetail);
          setSemiFinishedProductsDetailDataSource(semiFinishedProductsDetail);
          setToggleProductionInfo(false);
          setToggleValidationInfo(false);
        } else if (l2) {
          const index = _key.includes('l2-0')
            ? 0
            : _key.includes('l2-1')
            ? 1
            : _key.includes('l2-2')
            ? 2
            : 0;
          setFinishedIndex(index);
          setSemiFinishedIndex(index);
          setFinishedProductionDetailDataSource(finishedProductDetail);
          setSemiFinishedProductsDetailDataSource(semiFinishedProductsDetail);
          setToggleProductionInfo(false);
          setToggleValidationInfo(false);
        } else {
          _clearData();
        }
      } else if (l3) {
        if (l3) {
          const index = _key?.[3] || 2;
          setFinishedIndex(index);
          setSemiFinishedIndex(index);
          setFinishedProductionDetailDataSource(finishedProductDetail);
          setSemiFinishedProductsDetailDataSource(semiFinishedProductsDetail);
          setToggleProductionInfo(false);
          setToggleValidationInfo(false);
        } else {
          _clearData();
        }
      }
      setSelectedKey(selectedKeys);
    },
    [baseType]
  );

  return (
    <div className={styles['quality-tracebility']}>
      <Spin spinning={loading}>
        <Header
          title={
            <Fragment>
              <Radio
                mode="button"
                name="baseType"
                value="prodToMaterial"
                checked={baseType === 'prodToMaterial'}
                onChange={handleBaseTypeChange}
              >
                {'成品>材料'}
              </Radio>
              <Radio
                mode="button"
                name="baseType"
                value="materialToProd"
                checked={baseType === 'materialToProd'}
                onChange={handleBaseTypeChange}
              >
                {'材料>成品'}
              </Radio>
            </Fragment>
          }
        />
        <div className={styles.body}>
          <div className={styles['search-part']}>
            <SelectBox onChange={handleChange} value={type}>
              <Option value="销售订单">销售订单</Option>
              <Option value="发货单">发货单</Option>
              <Option value="包装条码">包装条码</Option>
              <Option value="产品条码">产品条码</Option>
            </SelectBox>
            <div>
              <Lov
                placeholder="销售订单"
                style={{ marginRight: '16px' }}
                dataSet={filterDS}
                name="soNum"
              />
              <Lov
                placeholder="选择产品"
                style={{ marginRight: '16px' }}
                dataSet={filterDS}
                name="prod"
              />
              <Lov placeholder="选择条码" dataSet={filterDS} name="tag" />
            </div>
          </div>
          <div className={styles['top-part']}>
            <div className={styles.head}>追溯链</div>
            <div className={styles.progress}>
              {(baseType === 'prodToMaterial'
                ? [
                    '销售订单',
                    '发货单',
                    '包装条码',
                    '产品条码',
                    '生产批次',
                    '材料批次',
                    '供应商批次',
                  ]
                : [
                    '销售订单',
                    '发货单',
                    '包装条码',
                    '产品条码',
                    '生产批次',
                    '材料批次',
                    '供应商批次',
                  ].reverse()
              ).map((v, i) => (
                <div className={styles.item} key={v}>
                  <div className={styles.index}>{i + 1}</div>
                  <div className={styles.value}>{v}</div>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.other}>
            {noData ? (
              <div className={styles['no-data']}>
                <div className={styles.wrap}>
                  <img src={noDataImg} alt="" />
                  <span className={styles.hint}>暂无内容</span>
                  <span className={styles.message}>请输入查询条件后查询内容</span>
                </div>
              </div>
            ) : (
              <div className={styles['other-body']}>
                <div className={styles['other-body-left']}>
                  <Tree
                    checkable={false}
                    selectedKeys={selectedKey}
                    expandedKeys={expandedKeys}
                    autoExpandParent={autoExpandParent}
                    onSelect={onSelect}
                    onExpand={(keys) => {
                      setExpandedKeys(keys);
                      setAutoExpandParent(false);
                    }}
                    showLine
                  >
                    {renderTreeNodes(treeDataSource)}
                  </Tree>
                </div>
                <div className={styles['other-body-right']}>
                  <div
                    className={`${styles['other-body-right-production-info']} ${
                      toggleProductionInfo ? styles.hidden : ''
                    }`}
                  >
                    <div
                      className={styles['togglable-part']}
                      onClick={() => handleToggle('production')}
                    >
                      <Icon
                        type="baseline-arrow_right"
                        className={`${
                          toggleProductionInfo ? '' : styles['togglable-part-title-toggled']
                        }`}
                      />
                      <span className={`${styles['togglable-part-title']} `}>生产信息</span>
                    </div>
                    <div
                      className={`${styles['info-part']} ${
                        toggleProductionInfo ? styles['no-border'] : ''
                      }`}
                    >
                      {finishedProductionDetailDataSource[finishedIndex]?.map((i) => (
                        <Line info={i} key={i.key} />
                      ))}
                    </div>
                  </div>
                  <div
                    className={`${styles['other-body-right-validation-info']} ${
                      toggleValidationInfo ? styles.hidden : ''
                    }`}
                  >
                    <div
                      className={styles['togglable-part']}
                      onClick={() => handleToggle('validation')}
                    >
                      <Icon
                        type="baseline-arrow_right"
                        className={`${
                          toggleValidationInfo ? '' : styles['togglable-part-title-toggled']
                        }`}
                      />
                      <span className={`${styles['togglable-part-title']}`}>检验信息</span>
                    </div>
                    <div
                      className={`${styles['info-part']} ${
                        toggleValidationInfo ? styles['no-border'] : ''
                      }`}
                    >
                      {semiFinishedProductsDetailDataSource[semiFinishedIndex]?.map((i) => (
                        <ValidationInfoLine info={i} key={i.key} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Spin>
    </div>
  );
}
