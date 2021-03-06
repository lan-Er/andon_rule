import { connect } from 'dva';
import QRCode from 'qrcode';
import queryString from 'query-string';
import Barcode from 'react-hooks-barcode';
import React, { Fragment, useRef, useEffect, useState } from 'react';
import { Button } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import notification from 'utils/notification';
import ReactToPrint from 'hlos-front/lib/components/PrintElement';
import style from './index.module.less';

function MyPrint({ location, dispatch }) {
  const printNode = useRef(null);
  const [allowPrint, setAllowPrint] = useState(false);
  const [printItemRefundInfo, setPrintItemRefundInfo] = useState([]);
  const [dataURL, setDataURL] = useState('');
  const [backPath, setBackPath] = useState('');

  const { search } = location;
  const params = search ? queryString.parse(search) : {};

  const config = {
    width: 2,
    height: 40,
    format: 'CODE128',
    displayValue: false,
    fontOptions: '',
    font: 'monospace',
    textAlign: 'center',
    textPosition: 'bottom',
    textMargin: 2,
    fontSize: 14,
    background: '#fff',
    lineColor: '#000',
    margin: 0,
  };

  useEffect(() => {
    setBackPath(`/zcom/customer-return-maintain/detail/${params.itemRefundId}`);
    dispatch({
      type: 'customerRefund/itemRefundPrint',
      payload: { itemRefundId: params.itemRefundId },
    })
      .then((res) => {
        setPrintItemRefundInfo([res]);
        setAllowPrint(true);
        QRCode.toDataURL(res.itemRefundNum)
          .then((url) => {
            setDataURL(url);
            // eslint-disable-next-line no-console
            console.log(url);
          })
          .catch((err) => {
            // eslint-disable-next-line no-console
            console.error(err);
          });
      })
      .catch(() => {
        setPrintItemRefundInfo([]);
        setAllowPrint(false);
      });
  }, [params.itemRefundId]);

  function handlePrint() {
    const pageStyle =
      '@page { size: A4 portrait; margin: 40pt 0; overflow: hidden; } @media print { body { -webkit-print-color-adjust: exact; } } html,body { overflow: auto!important; height: auto!important; }';
    if (
      printNode &&
      printNode.current &&
      printNode.current.children &&
      printNode.current.children.length > 0
    ) {
      ReactToPrint({ content: printNode && printNode.current, pageStyle });
    } else {
      notification.warning({ message: '?????????????????????' });
    }
  }

  function getToday() {
    const myDate = new Date();
    return `${myDate.getFullYear()}-${myDate.getMonth() + 1}-${myDate.getDate()}`;
  }

  return (
    <Fragment>
      <Header title="???????????????" backPath={backPath}>
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
          {printItemRefundInfo &&
            printItemRefundInfo.map((item, index) => {
              return (
                <div className={style['customer-return-print']} key={index.toString()}>
                  <header>
                    <div>
                      ???????????????
                      <br /> {getToday()}
                    </div>
                    <div className={style['return-print-title']}>
                      <p className={style['print-title']}>{item.tenantName}</p>
                      <p>?????????</p>
                    </div>
                    <div>
                      ???????????????
                      <br /> {item.itemRefundNum}
                    </div>
                  </header>
                  <div className={style['transfer-order']}>
                    <div className={style['send-order-info']}>
                      <div>
                        <p>????????????</p>
                        <p>
                          {item.refundContactName} {item.refundContactPhone}
                        </p>
                      </div>
                      <div>
                        <p>????????????</p>
                        <p>
                          {item.receiveContactName} {item.receiveContactPhone}
                        </p>
                      </div>
                      <div>
                        <p>???????????????</p>
                        <p>{item.receiveAddress}</p>
                      </div>
                      <div>
                        <p>?????????</p>
                        <p>{item.customerName}</p>
                      </div>
                      <div>
                        <p>?????????</p>
                        <p>{item.remark}</p>
                      </div>
                    </div>
                    <div className={style['send-order']}>
                      <div>
                        <Barcode value={item.itemRefundNum} {...config} />
                      </div>
                      <div>
                        <img src={dataURL} width="150" alt="QRCode" />
                      </div>
                    </div>
                  </div>
                  <div className={style['transfer-card-print-content']}>
                    <table className={style['transfer-card-print-content-list']} border="1">
                      <tbody>
                        <tr style={{ pageBreakAfter: 'always' }}>
                          <td>???</td>
                          <td>????????????</td>
                          <td>????????????</td>
                          <td>??????</td>
                          <td>????????????</td>
                          <td>????????????</td>
                          <td>????????????</td>
                          <td>????????????</td>
                          <td>??????</td>
                        </tr>
                        {item.itemRefundLineList &&
                          item.itemRefundLineList.length > 0 &&
                          item.itemRefundLineList.map((list, k) => {
                            return (
                              <tr key={k.toString()}>
                                <td>{k + 1}</td>
                                <td>{list.customerItemCode}</td>
                                <td>{list.customerItemDescription}</td>
                                <td>{list.uomName}</td>
                                <td>{list.refundQty}</td>
                                <td />
                                <td />
                                <td>
                                  {item.itemRefundDate ? item.itemRefundDate.substring(0, 10) : ''}
                                </td>
                                <td>{list.lineRemark}</td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                  <div className={style['transfer-card-print-footer']}>
                    <div>
                      <div>??????????????????????????????????????????: </div>
                      <div>??????????????????????????????????????????:</div>
                    </div>
                    <div>
                      <p>?????????</p>
                      <div className={style['transfer-card-print-footer-attention']}>
                        <p>1.????????????????????????????????????????????????????????????????????????????????????????????????</p>
                        <p>
                          2.?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
                        </p>
                        <p>
                          3.?????????????????????(A4?????????)????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
                        </p>
                      </div>
                    </div>
                    <div className={style['transfer-card-print-footer-car']}>
                      <div>???????????????</div>
                      <div>????????????</div>
                      <div>?????????????????????</div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </Content>
    </Fragment>
  );
}
export default connect()(MyPrint);
