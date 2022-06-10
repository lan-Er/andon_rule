import { connect } from 'dva';
// import queryString from 'query-string';
import { Button } from 'choerodon-ui/pro';
// import Barcode from 'react-hooks-barcode';
import React, { Fragment, useRef, useEffect, useState } from 'react';
import QRCode from 'qrcode';

import { Header, Content } from 'components/Page';
import notification from 'utils/notification';
import ReactToPrint from 'hlos-front/lib/components/PrintElement';
import { getReportData } from '@/services/otherWarehousingService';
import styles from './index.less';

function MyPrint({ location }) {
  const printNode = useRef(null);
  const [allowPrint, setAllowPrint] = useState(false);
  const [printDeliveryInfo, setPrintDeliveryInfo] = useState([]);
  // const [dataURL, setDataURL] = useState('');
  const [backPath, setBackPath] = useState('');
  const [sumObj, setSumObj] = useState({});
  const [headObj, setHeadObj] = useState({});

  // const { search } = location;
  // const params = search ? queryString.parse(search) : {};
  const { state = {} } = location;
  const params = state;

  useEffect(async () => {
    setBackPath(`/raumplus/other-warehousing/list`);
    try {
      const res = await getReportData(params);
      if (res && !res.failed) {
        setHeadObj(res);
        setPrintDeliveryInfo(res.orderLineVOList || []);
        setAllowPrint(true);
        QRCode.toDataURL(res.invTransactionNum).catch((err) => {
          console.error(err);
        });
        let sumNm = 0; // 内门
        let sumGt = 0; // 柜体
        let sumYm = 0; // 移门
        let sumCount = 0; // 件数总计
        if (res.orderLineVOList && res.orderLineVOList.length) {
          res.orderLineVOList.forEach((item) => {
            // eslint-disable-next-line no-multi-assign
            sumNm += Number(item.nm || 0);
            sumGt += Number(item.gt || 0);
            sumYm += Number(item.ym || 0);
            sumCount += Number(item.sum || 0);
          });
        }
        setSumObj({
          sumNm,
          sumGt,
          sumYm,
          sumCount,
        });
      } else {
        setPrintDeliveryInfo([]);
        setAllowPrint(false);
      }
    } catch (err) {
      setPrintDeliveryInfo([]);
      setAllowPrint(false);
    }
  }, [params.invTransactionId, params.invTransactionLineIds]);

  function handlePrint() {
    const pageStyle =
      '@page { size: A4 landscape;  margin: 40pt 0; overflow: hidden; } @media print { body { -webkit-print-color-adjust: exact; } } html,body { overflow: auto!important; height: auto!important; }';
    if (
      printNode &&
      printNode.current &&
      printNode.current.children &&
      printNode.current.children.length > 0
    ) {
      ReactToPrint({ content: printNode && printNode.current, pageStyle });
    } else {
      notification.warning({ message: '没有打印的数据' });
    }
  }
  return (
    <Fragment className={styles['delivery-maintain-print-page']}>
      <Header title="其他出入库打印" backPath={backPath}>
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
        <div
          ref={(node) => {
            printNode.current = node;
          }}
        >
          <div className={styles['delivery-maintain-print']}>
            <header>
              <div className={styles['delivery-maintain-title']}>
                <p>出货单（生产类）</p>
              </div>
            </header>

            <div className={styles['transfer-card-print-content']}>
              <table className={styles['transfer-card-print-content-list']} border="1">
                <tbody>
                  {/* style={{ pageBreakAfter: 'always' }} */}
                  <tr>
                    <td>品牌</td>
                    <td colSpan="4">{headObj.brand}</td>
                    <td>出库时间</td>
                    <td colSpan="5">{headObj.executedTime}</td>
                    <td>单据号</td>
                    <td colSpan="4">{headObj.invTransactionNum}</td>
                  </tr>
                  <tr>
                    <td>费用部门</td>
                    <td colSpan="4">{headObj.departmentName}</td>
                    <td>用途</td>
                    <td colSpan="10">{headObj.requestOperationTypeMeaning}</td>
                  </tr>
                  <tr>
                    <td>序号</td>
                    <td>crm号</td>
                    <td>erp号</td>
                    <td>经销商</td>
                    <td>订单名称</td>
                    <td>木箱</td>
                    <td>长</td>
                    <td>宽</td>
                    <td>高</td>
                    <td>体积</td>
                    <td>重量</td>
                    <td>柜体总件数</td>
                    <td>移门总件数</td>
                    <td>内门总件数</td>
                    <td>件数合计</td>
                    <td>发货方式</td>
                  </tr>
                  {printDeliveryInfo &&
                    printDeliveryInfo.length > 0 &&
                    printDeliveryInfo.map((item, k) => {
                      return (
                        <tr key={k.toString()}>
                          <td>{k + 1}</td>
                          <td>{item.crmNum}</td>
                          <td>{item.erpNum}</td>
                          <td>{item.customerName}</td>
                          <td>{item.orderName}</td>
                          <td />
                          <td />
                          <td />
                          <td />
                          <td />
                          <td />
                          <td>{item.gt}</td>
                          <td>{item.ym}</td>
                          <td>{item.nm}</td>
                          <td>{item.sum}</td>
                          <td />
                        </tr>
                      );
                    })}
                  <tr>
                    <td colSpan="5">总计</td>
                    <td />
                    <td />
                    <td />
                    <td />
                    <td />
                    <td />
                    <td>{sumObj.sumGt}</td>
                    <td>{sumObj.sumYm}</td>
                    <td>{sumObj.sumNm}</td>
                    <td>{sumObj.sumCount}</td>
                    <td />
                  </tr>
                  <tr>
                    <td>发货人签名</td>
                    <td colSpan="4" />
                    <td colSpan="3">使用人签名</td>
                    <td colSpan="8" />
                  </tr>
                  <tr>
                    <td>日期</td>
                    <td colSpan="4" />
                    <td colSpan="3">日期</td>
                    <td colSpan="8" />
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Content>
    </Fragment>
  );
}
export default connect()(MyPrint);
