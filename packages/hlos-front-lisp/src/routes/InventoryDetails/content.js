/*
 * 库存明细-content内容
 * date: 2020-06-26
 * author : zhengtao <TAO.ZHENG@HAND-CHINA.com>
 * version : 0.0.1
 * copyright Copyright (c) 2020, Hand
 */
import React from 'react';
import { Modal, Button, Row, Col } from 'choerodon-ui/pro';
import style from './style.less';
import moreImg from './assets/more.svg';
import partImg from './assets/part.svg';
import companyImg from './assets/company.svg';

const modalKey = Modal.key();

function collectData(props) {
  const { detailList, numSort } = props;
  const obj = {};
  detailList.forEach((item) => {
    const key = item.attribute9;
    if (!Reflect.has(obj, key)) {
      obj[key] = {
        itemCode: item.attribute3,
        itemDes: item.attribute9,
        children: [
          {
            supplier: item.attribute1,
            num: Number(item.attribute4),
          },
        ],
      };
    } else {
      obj[key].children.push({ supplier: item.attribute1, num: Number(item.attribute4) });
    }
  });
  Reflect.ownKeys(obj).forEach((key) => {
    let total = 0;
    obj[key].children.forEach((item) => {
      total += item.num;
    });
    obj[key].total = total;
  });
  const tmpArr = [];
  const values = Object.values(obj);
  if (numSort === '1') {
    values.sort((a, b) => b.total - a.total);
  } else if (numSort === '2') {
    values.sort((a, b) => a.total - b.total);
  }
  for (let i = 0, ind = 0, len = values.length; i < len; i++) {
    if (Array.isArray(tmpArr[ind])) {
      tmpArr[ind].push(values[i]);
    } else {
      tmpArr[ind] = [];
      tmpArr[ind].push(values[i]);
    }
    if (tmpArr[ind].length === 4) {
      ind++;
    }
  }
  return tmpArr;
}

export default (props) => {
  let modal = null;
  const showData = collectData(props);
  const closeModal = () => {
    modal.close();
  };
  const handleShowMore = (arr) => {
    const tmpArr = [];
    for (let i = 0, ind = 0, len = arr.length; i < len; i++) {
      if (Array.isArray(tmpArr[ind])) {
        tmpArr[ind].push(arr[i]);
      } else {
        tmpArr[ind] = [];
        tmpArr[ind].push(arr[i]);
      }
      if (tmpArr[ind].length === 2) {
        ind++;
      }
    }
    modal = Modal.open({
      key: modalKey,
      maskClosable: true,
      closable: true,
      title: <h2>更多</h2>,
      children: (
        <div>
          {tmpArr.map((item) => (
            <Row key={Math.random()} style={{ lineHeight: '28px' }}>
              {item.map((inItem) => (
                <Col offset={1} span={11} key={Math.random()}>
                  <Row>
                    <Col span={18}>
                      <img
                        src={companyImg}
                        alt="公司"
                        style={{ display: 'inline-block', margin: '-1px 4px 0 0' }}
                      />
                      <span>{inItem.supplier}</span>
                    </Col>
                    <Col span={6}>
                      <span>{inItem.num}</span>
                    </Col>
                  </Row>
                </Col>
              ))}
            </Row>
          ))}
        </div>
      ),
      footer: (
        <Button className={style['modal-more-btn']} onClick={closeModal}>
          确认
        </Button>
      ),
    });
  };
  return (
    <div>
      {showData.map((item) => (
        <div className={style['detail-col']} key={Math.random()}>
          {item.map((inItem) => (
            <div className={style['detail-row']} key={inItem.itemCode}>
              <div className={style['detail-row-top']}>
                <div>
                  <h4>
                    <img src={partImg} alt="零件" />
                    {inItem.itemDes}
                  </h4>
                  <span>{inItem.total}</span>
                </div>
                <div>
                  <span>{inItem.itemCode}</span>
                  {
                    <img
                      style={
                        inItem.children.length > 4
                          ? { visibility: 'visible' }
                          : { visibility: 'hidden' }
                      }
                      src={moreImg}
                      alt="更多"
                      onClick={() => handleShowMore(inItem.children)}
                    />
                  }
                </div>
              </div>
              <div className={style['detail-row-bottom']}>
                <div>
                  {inItem.children.slice(0, 2).map((childItem) => (
                    <span className={style['company-item']} key={`${childItem.supplier}1`}>
                      <span className={style['company-item-top']}>
                        <img src={companyImg} alt="公司" />
                        <span>{childItem.supplier}</span>
                      </span>
                      <span className={style['company-item-bottom']}>{childItem.num}</span>
                    </span>
                  ))}
                </div>
                <div>
                  {inItem.children.slice(2, 4).map((childItem) => (
                    <span className={style['company-item']} key={`${childItem.supplier}2`}>
                      <span className={style['company-item-top']}>
                        <img src={companyImg} alt="公司" />
                        <span>{childItem.supplier}</span>
                      </span>
                      <span className={style['company-item-bottom']}>{childItem.num}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
