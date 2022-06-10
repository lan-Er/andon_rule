/*
 * @module: 预加载打印界面
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2021-05-26 10:19:09
 * @LastEditTime: 2021-06-10 16:50:35
 * @copyright: Copyright (c) 2020,Hand
 */
import qs from 'query-string';
import { Spin } from 'choerodon-ui';
import { Button } from 'choerodon-ui/pro';
import React, { Fragment, useRef, useCallback, useState, useEffect } from 'react';

import notification from 'utils/notification';
import { Header, Content } from 'components/Page';
import ReactToPrint from 'hlos-front/lib/components/PrintElement';

import PrintItem from './PrintItem';
import style from './index.module.less';
import ResultPrint from '../resultPrint';
import { getPrintList, updatePrintFlag } from '@/services/shipPlatformService';

export default function PrePrint({ history }) {
  const printNode = useRef(null);
  const [printLoading, setPrintLoading] = useState(false);
  const [clickPrintDisabled, setClickPrintDisabled] = useState(false);
  const [printBeforeData, setPrintBeforeData] = useState([]);
  const [printResultList, setPrintResultList] = useState({});
  const [printResultArr, setPrintResultArr] = useState([]);

  const getIntegrationData = useCallback(
    (data) => {
      setPrintResultList(Object.assign(printResultList, data));
      setPrintResultArr(Object.values(printResultList));
    },
    [printResultList]
  );

  useEffect(() => {
    function initPrint() {
      const {
        location: { search = {} },
      } = history;
      const { shipOrderId = {} } = qs.parse(search);
      if (shipOrderId) {
        setPrintLoading(true);
        getPrintList({ shipOrderIdList: shipOrderId })
          .then((res) => {
            if (res && res.length && res.length > 0) {
              setPrintBeforeData(res);
              setTimeout(() => {
                setPrintLoading(false);
              }, 0);
            } else {
              notification.error({ message: '查询数据存在错误或者没有打印数据' });
              setPrintLoading(false);
            }
          })
          .catch(() => {
            setPrintLoading(false);
          });
      } else {
        notification.warning({ message: '参数丢失' });
      }
    }
    initPrint();
  }, []);

  /**
   * @description: 打印后回传打印标识
   * @param {*}
   * @return {*}
   */
  function handAfterPrint() {
    const {
      location: { search = {} },
    } = history;
    const { shipOrderId = {} } = qs.parse(search);
    updatePrintFlag(shipOrderId.split(','));
    sessionStorage.setItem('shipPlatformParentQuery', true);
  }

  /**
   * @description: 实际打印操作
   * @param {*}
   * @return {*}
   */
  function handlePrint() {
    setClickPrintDisabled(true);
    if (
      printNode &&
      printNode.current &&
      printNode.current.children &&
      printNode.current.children.length > 0
    ) {
      ReactToPrint({ content: printNode && printNode.current, onAfterPrint: handAfterPrint });
    } else {
      notification.warning({ message: '无打印数据' });
    }
    setTimeout(() => {
      setClickPrintDisabled(false);
    }, 1000);
  }
  return (
    <Fragment>
      <Header title="发货单打印" backPath="/grwl/ship-platform/list">
        <Button
          onClick={handlePrint}
          funcType="flat"
          color="primary"
          icon="print"
          loading={clickPrintDisabled}
        >
          打印
        </Button>
      </Header>
      <Content>
        <div className={style['ship-platform-list-content']}>
          <div className={style['ship-platform-print-list']}>
            {printBeforeData &&
              printBeforeData.length > 0 &&
              printBeforeData.map((item, index) => {
                return (
                  <PrintItem
                    item={item}
                    coordinate={index}
                    key={index.toString()}
                    handleIntegrationData={getIntegrationData}
                  />
                );
              })}
          </div>
          <div className={style['result-print']} ref={printNode}>
            {printResultArr &&
              printResultArr.length > 0 &&
              printResultArr.map((resultList, j) => {
                return <ResultPrint resultList={resultList} key={j.toString()} />;
              })}
          </div>
          {printLoading && (
            <div className={style['query-loading']}>
              <Spin tip="Loading..." />
            </div>
          )}
        </div>
      </Content>
    </Fragment>
  );
}
