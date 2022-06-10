/*
 * 供应商库存明细-content内容
 * date: 2020-06-26
 * author : zhengtao <TAO.ZHENG@HAND-CHINA.com>
 * version : 0.0.1
 * copyright Copyright (c) 2020, Hand
 */
import React from 'react';
import style from './style.less';
import partImg from './assets/part.svg';

function collectData(props) {
  const { detailList, numSort } = props;
  const tmpArr = [];
  if (numSort === '1') {
    detailList.sort((a, b) => b.attribute4 - a.attribute4);
  } else if (numSort === '2') {
    detailList.sort((a, b) => a.attribute4 - b.attribute4);
  }
  for (let i = 0, ind = 0, len = detailList.length; i < len; i++) {
    if (Array.isArray(tmpArr[ind])) {
      tmpArr[ind].push(detailList[i]);
    } else {
      tmpArr[ind] = [];
      tmpArr[ind].push(detailList[i]);
    }
    if (tmpArr[ind].length === 4) {
      ind++;
    }
  }
  return tmpArr;
}

export default (props) => {
  const showData = collectData(props);
  return (
    <div className={style['detail-content']}>
      {showData.map((item) => (
        <div className={style['detail-col']} key={Math.random()}>
          {item.map((inItem) => (
            <div
              className={style['detail-row']}
              key={inItem.dataId}
              style={
                inItem.attribute11 && Number(inItem.attribute11) > Number(inItem.attribute4)
                  ? { border: '1px solid #FF6B6B' }
                  : {}
              }
            >
              <div>
                <h4>
                  <img src={partImg} alt="零件" />
                  {inItem.attribute9}
                </h4>
                <span>{inItem.attribute4}</span>
              </div>
              <div>
                <p>{inItem.attribute3}</p>
                <span>{inItem.attribute11 ? inItem.attribute11 : ''}</span>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
