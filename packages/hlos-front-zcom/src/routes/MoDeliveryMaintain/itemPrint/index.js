import { connect } from 'dva';
import QRCode from 'qrcode';
import queryString from 'query-string';
import Barcode from 'react-hooks-barcode';
import { Button } from 'choerodon-ui/pro';
import React, { Fragment, useRef, useEffect, useState } from 'react';
import { Header, Content } from 'components/Page';
import notification from 'utils/notification';
import ReactToPrint from 'hlos-front/lib/components/PrintElement';
import style from './index.module.less';

function ItemPrint({ location }) {
  const printNode = useRef(null);
  const [allowPrint, setAllowPrint] = useState(false);
  const [printList, setPrintList] = useState([]);
  const [dataURL, setDataURL] = useState('');
  const [backPath, setBackPath] = useState('');

  const { search } = location;
  const params = search ? queryString.parse(search) : {};

  const config = {
    width: 3.2,
    height: 60,
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
    marginTop: 5,
    marginBottom: 5,
  };

  useEffect(() => {
    setBackPath(`/zcom/mo-delivery-maintain/detail/${params.deliveryOrderId}`);
    const { state } = location;
    if (state.length) {
      setPrintList(state);
      setAllowPrint(true);
      QRCode.toDataURL(state[0].itemCode)
        .then((url) => {
          setDataURL(url);
          // eslint-disable-next-line no-console
          console.log(url);
        })
        .catch((err) => {
          // eslint-disable-next-line no-console
          console.error(err);
        });
    } else {
      setPrintList([]);
      setAllowPrint(false);
    }
  }, [params.deliveryOrderId]);

  function handlePrint() {
    // const pageStyle = `
    //   @page {
    //     size: 9.5cm 7cm;
    //     margin: 0;
    //     margin-bottom: -1cm;
    //     overflow: hidden;
    //   }`;

    const pageStyle =
      '@page { size: A4 landscape; margin: 40pt 0; overflow: hidden;} @media print { body { -webkit-print-color-adjust: exact; } } html,body { overflow: auto!important; height: auto!important; }';
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

  return (
    <Fragment>
      <Header title="?????????????????????" backPath={backPath}>
        <Button
          funcType="flat"
          color="primary"
          icon="print"
          onClick={handlePrint}
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
          {printList &&
            printList.map((item, index) => {
              return (
                <div className={style['delivery-item-print']} key={index.toString()}>
                  <header>
                    <div>???????????????</div>
                    <div>RoHS</div>
                  </header>
                  <div className={style['item-print-info']}>
                    <div>?????????{item.itemCode}</div>
                    <div>?????????{item.version}</div>
                  </div>
                  <div>
                    <Barcode value={item.itemCode} {...config} />
                  </div>
                  <div>???????????????{item.itemDescription}</div>
                  <div className={style['item-print-info']}>
                    <div>??????????????????{item.supplierItemCode}</div>
                    <div>???????????????{item.humidityLevel}</div>
                  </div>
                  <div className={style['item-print-otherinfo']}>
                    <div className={style['otherinfo-left']}>
                      <div>??????????????????{item.supplierNumber}</div>
                      <div>?????????{item.perBoxAmount + item.uom}</div>
                    </div>
                    <div className={style['otherinfo-right']}>
                      ?????????/??????{`${item.deliveryOrderNum}/${item.deliveryOrderLineNum}`}
                    </div>
                  </div>
                  <div className={style['item-print-bottominfo']}>
                    <div className={style['bottominfo-left']}>
                      <div>???????????????{item.productionDate}</div>
                      <div className={style['bottominfo-left-flex']}>
                        <div>???????????????{item.maturityDate}</div>
                        <div>????????????{item.validPeriod}</div>
                      </div>
                      <div className={style['bottominfo-left-flex']}>
                        <div>Date Code???{item.DateCode}</div>
                        <div>
                          ???{index + 1}/{item.boxQty}???
                        </div>
                      </div>
                      <div>Lot No???{item.lotNo}</div>
                    </div>
                    <div className={style['bottominfo-qrcode']}>
                      <img src={dataURL} width="200" alt="QRCode" />
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

export default connect()(ItemPrint);
