/*
 * @module: 流转卡打印
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2021-01-26 17:14:05
 * @LastEditTime: 2021-05-20 10:35:07
 * @copyright: Copyright (c) 2020,Hand
 */
import { connect } from 'dva';
import { Spin } from 'choerodon-ui';
import queryString from 'query-string';
import { Button } from 'choerodon-ui/pro';
import React, { Fragment, useRef, useEffect, useState, useCallback } from 'react';

import { Header, Content } from 'components/Page';
import notification from 'utils/notification';
import ReactToPrint from 'hlos-front/lib/components/PrintElement';

import PrintItem from './PrintItem';
import style from './index.module.less';
import ResultPrint from '../components/ResultPrint';

function MyPrint({ location, dispatch }) {
  const printNode = useRef(null);
  const [allowPrint, setAllowPrint] = useState(false);
  const [printMoList, setPrintMoList] = useState([]);
  const [printResultList, setPrintResultList] = useState({});
  const [printResultArr, setPrintResultArr] = useState([]);
  useEffect(() => {
    const { search } = location;
    const params = search ? queryString.parse(search) : {};
    dispatch({
      type: 'moWorkSpace/getMoPrintList',
      payload: { moIdString: params.moId },
    })
      .then((res) => {
        setPrintMoList(res);
        setAllowPrint(true);
      })
      .catch(() => {
        setPrintMoList([]);
        setAllowPrint(false);
      });
  }, []);

  function handlePrint() {
    if (
      printNode &&
      printNode.current &&
      printNode.current.children &&
      printNode.current.children.length > 0
    ) {
      ReactToPrint({ content: printNode && printNode.current });
    } else {
      notification.warning({ message: '没有打印的数据' });
    }
  }

  const getIntegrationData = useCallback(
    (data) => {
      setPrintResultList(Object.assign(printResultList, data));
      setPrintResultArr(Object.values(printResultList));
    },
    [printResultList]
  );

  return (
    <Fragment>
      <Header title="流转卡打印" backPath="/grwl/mo-workspace">
        <Button
          funcType="flat"
          color="primary"
          icon="print"
          onClick={handlePrint}
          title="注意：请选用A4纸，横向打印"
          disabled={!allowPrint}
        >
          打印
        </Button>
      </Header>
      <Content>
        <div>
          {printMoList &&
            printMoList.map((item, index) => {
              return (
                <div className={style['transfer-card-print']} key={index.toString()}>
                  <PrintItem
                    item={item}
                    coordinate={index}
                    handleIntegrationData={getIntegrationData}
                  />
                </div>
              );
            })}
        </div>
        <div
          ref={(node) => {
            printNode.current = node;
          }}
        >
          {printResultArr &&
            printResultArr.map((resultList, index) => {
              return (
                <Fragment key={index.toString()}>
                  <ResultPrint resultList={resultList} />
                </Fragment>
              );
            })}
        </div>
      </Content>
      {!allowPrint ? (
        <div className={style['my-print-loading']}>
          <Spin tip="Loading..." />
        </div>
      ) : null}
    </Fragment>
  );
}
export default connect()(MyPrint);
