import { connect } from 'dva';
import React, { Fragment, useRef, useEffect, useState } from 'react';
import QRCode from 'qrcode';
import uuidv4 from 'uuid/v4';
import { Button, Spin } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import notification from 'utils/notification';
import ReactToPrint from 'hlos-front/lib/components/PrintElement';
import { queryPrintData } from '@/services/ticketReportService.js';
import { getResponse } from 'utils/utils';
import style from './index.module.less';

function MyPrint({ location }) {
  const printNode = useRef(null);
  const [allowPrint, setAllowPrint] = useState(false);
  const [prodData, setProdData] = useState({});
  const [nonProdData, setNonProdData] = useState({});
  const [prodUrl, setProdUrl] = useState('');
  const [nonProdUrl, setNonProdUrl] = useState('');

  useEffect(() => {
    async function handleQueryPrintData() {
      const { state } = location;
      const resp = await queryPrintData({
        attributeString2: state,
      });
      if (getResponse(resp)) {
        handlePrintData(resp);
      }
    }

    handleQueryPrintData();
  }, []);

  function handlePrintData(resp) {
    if (!resp.shipOrderNonProduct && !resp.shipOrderProduction) {
      setAllowPrint(false);
      return;
    }
    if (resp?.shipOrderProduction && Object.keys(resp.shipOrderProduction).length) {
      const map = new Map();
      let arr = resp.shipOrderProduction.shipOrderProductionLineList;
      QRCode.toDataURL(resp.shipOrderProduction.deliveryNo)
        .then((url) => {
          setProdUrl(url);
        })
        .catch((err) => {
          notification.error({
            message: err,
          });
        });
      resp.shipOrderProduction.shipOrderProductionLineList.forEach((v) => {
        if (v.outerTagId) {
          map.set(v.outerTagId, v.outerTagId);
          const rowSpan = resp.shipOrderProduction.shipOrderProductionLineList.filter(
            (val) => val.outerTagId === v.outerTagId
          ).length;
          const _index = resp.shipOrderProduction.shipOrderProductionLineList.findIndex(
            (val) => val.outerTagId === v.outerTagId
          );
          arr[_index] = { ...arr[_index], rowSpan };
        }
      });
      arr = arr.map((ele) => {
        if (!ele.rowSpan && map.get(ele.outerTagId) === ele.outerTagId) {
          return { ...ele, isRender: false };
        }
        return {
          ...ele,
          isRender: true,
        };
      });
      setProdData({ ...resp.shipOrderProduction, shipOrderProductionLineList: arr });
      setAllowPrint(true);
    }
    if (resp?.shipOrderNonProduct && Object.keys(resp.shipOrderNonProduct).length) {
      QRCode.toDataURL(resp.shipOrderNonProduct.deliveryNo)
        .then((url) => {
          setNonProdUrl(url);
        })
        .catch((err) => {
          notification.error({
            message: err,
          });
        });
      setNonProdData(resp.shipOrderNonProduct);
      setAllowPrint(true);
    }
  }

  function handlePrint() {
    const pageStyle = `
        @page {
          size: A4 landscape;
          margin: 40pt 0;
          overflow: hidden;
        }
        @media print {
          body {
            -webkit-print-color-adjust: exact; 
          } 
        } 
        html,body {
          overflow: auto!important;
          height: auto!important;
        }
      `;
    if (pageStyle) {
      ReactToPrint({ content: printNode && printNode.current, pageStyle });
    } else {
      notification.warning({ message: '?????????????????????' });
    }
  }

  return (
    <Fragment>
      <Header title="???????????????" backPath="/raumplus/ticket-report/list">
        <Button
          funcType="flat"
          color="primary"
          icon="print"
          onClick={handlePrint}
          title="??????????????????A4??????????????????"
          disabled={!allowPrint}
        >
          ??????
        </Button>
      </Header>
      <Content>
        <div
          ref={(node) => {
            printNode.current = node;
          }}
        >
          {/* ?????????(?????????) */}
          {prodData?.shipOrderProductionLineList?.length && (
            <div className={style['ticket-report-order-prod']}>
              <header>
                <span>?????????(?????????)</span>
                <div className={style['ticket-report-bar-code']}>
                  <img src={prodUrl} width="100" alt="QRCode" />
                </div>
              </header>
              <div className={style['ticket-report-print-content']}>
                <table className={style['ticket-report-print-content-list']} border="1">
                  <tbody>
                    <tr>
                      <td>??????</td>
                      <td colSpan={5}>{prodData.brand}</td>
                      <td>????????????</td>
                      <td colSpan={10}>{prodData.shipDate}</td>
                    </tr>
                    <tr>
                      <td>????????????</td>
                      <td colSpan={15}>{prodData.deliveryLogisticsMeaning}</td>
                    </tr>
                    <tr>
                      <td>????????????</td>
                      <td colSpan={5}>{prodData.attributeString6}</td>
                      <td>?????????</td>
                      <td colSpan={10}>{prodData.attributeString5}</td>
                    </tr>
                    <tr>
                      <td>??????</td>
                      <td>crm???</td>
                      <td>erp???</td>
                      <td>?????????</td>
                      <td>????????????</td>
                      <td>??????</td>
                      <td>(???)MM</td>
                      <td>(???)MM</td>
                      <td>(???)MM</td>
                      <td>(??????)CBM</td>
                      <td>????????????KG</td>
                      <td>???????????????</td>
                      <td>???????????????</td>
                      <td>???????????????</td>
                      <td>????????????</td>
                      <td>????????????</td>
                    </tr>
                    {prodData.shipOrderProductionLineList.map((v, index) => (
                      <tr key={uuidv4()}>
                        <td>{index + 1}</td>
                        <td>{v.customerPo}</td>
                        <td>{v.soNum}</td>
                        <td>{v.customerName}</td>
                        <td>{v.orderName}</td>
                        {v.isRender && (
                          <>
                            <td rowSpan={v.rowSpan || 1}>{v.woodenCase}</td>
                            <td rowSpan={v.rowSpan || 1}>{v.length}</td>
                            <td rowSpan={v.rowSpan || 1}>{v.width}</td>
                            <td rowSpan={v.rowSpan || 1}>{v.height}</td>
                            <td rowSpan={v.rowSpan || 1}>{v.volume}</td>
                            <td rowSpan={v.rowSpan || 1}>{v.grossWeight}</td>
                          </>
                        )}
                        <td>{v.gtQty}</td>
                        <td>{v.ymQty}</td>
                        <td>{v.nmQty}</td>
                        <td>{v.countQty}</td>
                        <td>{v.shippingMethodMeaning}</td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan={5}>??????</td>
                      <td>{prodData.woodenCaseTotal}</td>
                      <td />
                      <td />
                      <td />
                      <td />
                      <td>{prodData.grossWeightTotal}</td>
                      <td>{prodData.gtQtyTotal}</td>
                      <td>{prodData.ymQtyTotal}</td>
                      <td>{prodData.nmQtyTotal}</td>
                      <td>{prodData.countQtyTotal}</td>
                      <td />
                    </tr>
                    <tr>
                      <td colSpan={2}>???????????????</td>
                      <td colSpan={3} />
                      <td colSpan={2}>?????????????????????</td>
                      <td colSpan={3} />
                      <td colSpan={2}>???????????????</td>
                      <td colSpan={4} />
                    </tr>
                    <tr>
                      <td colSpan={2}>??????</td>
                      <td colSpan={3} />
                      <td colSpan={2}>??????</td>
                      <td colSpan={3} />
                      <td colSpan={2}>??????</td>
                      <td colSpan={4} />
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {/* ?????????(????????????) */}
          {nonProdData?.shipOrderNonProductiveLineList?.length && (
            <div className={style['ticket-report-order-non-prod']}>
              <header>
                <span>?????????(????????????)</span>
                <div className={style['ticket-report-bar-code']}>
                  <img src={nonProdUrl} width="100" alt="QRCode" />
                </div>
              </header>
              <div className={style['ticket-report-print-content']}>
                <table className={style['ticket-report-print-content-list']} border="1">
                  <tbody>
                    <tr>
                      <td>??????</td>
                      <td colSpan={5}>{nonProdData.brand}</td>
                      <td>????????????</td>
                      <td colSpan={7}>{nonProdData.shipDate}</td>
                    </tr>
                    <tr>
                      <td>????????????</td>
                      <td colSpan={13}>{nonProdData.deliveryLogisticsMeaning}</td>
                    </tr>
                    <tr>
                      <td>????????????</td>
                      <td colSpan={5}>{nonProdData.attributeString6}</td>
                      <td>?????????</td>
                      <td colSpan={7}>{nonProdData.attributeString5}</td>
                    </tr>
                    <tr>
                      <td>??????</td>
                      <td>crm???</td>
                      <td>erp???</td>
                      <td>?????????</td>
                      <td>?????????</td>
                      <td>????????????</td>
                      <td>??????</td>
                      <td>(???)MM</td>
                      <td>(???)MM</td>
                      <td>(???)MM</td>
                      <td>(??????)CBM</td>
                      <td>????????????KG</td>
                      <td>????????????</td>
                      <td>????????????</td>
                    </tr>
                    {nonProdData.shipOrderNonProductiveLineList.map((v, index) => (
                      <tr key={uuidv4()}>
                        <td>{index + 1}</td>
                        <td>{v.customerPo}</td>
                        <td>{v.soNum}</td>
                        <td>{v.customerName}</td>
                        <td>{v.itemCode}</td>
                        <td>{v.itemDescription}</td>
                        <td>{v.woodenCase}</td>
                        <td>{v.length}</td>
                        <td>{v.width}</td>
                        <td>{v.height}</td>
                        <td>{v.volume}</td>
                        <td>{v.grossWeight}</td>
                        <td>{v.quantity}</td>
                        <td>{v.shippingMethodMeaning}</td>
                      </tr>
                    ))}
                    <tr>
                      <td>????????????</td>
                      <td colSpan={13}>{nonProdData.total}</td>
                    </tr>
                    <tr>
                      <td>???????????????</td>
                      <td colSpan={4} />
                      <td colSpan={2}>?????????????????????</td>
                      <td colSpan={3} />
                      <td>???????????????</td>
                      <td colSpan={3} />
                    </tr>
                    <tr>
                      <td>??????</td>
                      <td colSpan={4} />
                      <td colSpan={2}>??????</td>
                      <td colSpan={3} />
                      <td>??????</td>
                      <td colSpan={3} />
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </Content>
      {!allowPrint ? (
        <div className={style['ticket-print-loading']}>
          <Spin tip="Loading..." />
        </div>
      ) : null}
    </Fragment>
  );
}
export default connect()(MyPrint);
