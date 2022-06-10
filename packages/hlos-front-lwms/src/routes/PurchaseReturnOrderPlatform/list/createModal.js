/*
 * @Description: 新建订单
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-05-08 15:48:56
 */

import React, { useState, useEffect } from 'react';
import { Button } from 'choerodon-ui/pro';
import request from 'utils/request';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import notification from 'utils/notification';
import uuidv4 from 'uuid/v4';
import sourceImg from 'hlos-front/lib/assets/icons/source.svg';
import style from '../index.less';

let count = 0;
function OrderTypeCard(props) {
  const [documentTypeList, setDocumentTypeList] = useState([]);

  useEffect(() => {
    handleQueryTypeList();
  }, []);

  const handleQueryTypeList = async () => {
    const res = await request(`${HLOS_LMDS}/v1/lovs/sql/data?lovCode=LMDS.DOCUMENT_TYPE`, {
      method: 'GET',
      query: {
        documentClass: 'DELIVERY_RETURN',
      },
    });
    if (res && res.content && res.content.length) {
      const list = res.content.map((v, i) => {
        if (i === 0) {
          return { ...v, active: true };
        }
        return { ...v, active: false };
      });
      setDocumentTypeList(list);
    }
  };

  const handleTypeClick = (record) => {
    count += 1;
    setTimeout(() => {
      if (count === 1) {
        handleTypeSingleClick(record);
      } else if (count === 2) {
        handleTypeDoubleClick(record);
      }
      count = 0;
    }, 300);
  };

  const handleTypeSingleClick = (record) => {
    let typeList = documentTypeList.slice();
    typeList = typeList.map((v) => {
      if (v.documentTypeId === record.documentTypeId) {
        return { ...v, active: true };
      }
      return { ...v, active: false };
    });
    setDocumentTypeList(typeList);
  };

  const handleTypeDoubleClick = (record) => {
    let typeList = documentTypeList.slice();
    typeList = typeList.map((v) => {
      if (v.documentTypeId === record.documentTypeId) {
        return { ...v, active: true };
      }
      return { ...v, active: false };
    });
    setDocumentTypeList(typeList);
    handleConfirm(typeList);
  };

  const handleCancel = () => {
    let typeList = documentTypeList.slice();
    typeList = typeList.map((v) => ({ ...v, active: false }));
    setDocumentTypeList(typeList);
    props.modal.close();
  };

  const handleConfirm = (list) => {
    let typeList = [];
    if (list.length) {
      typeList = list;
    } else {
      typeList = documentTypeList.slice();
    }
    const activeRecord = typeList.filter((v) => v.active);
    if (
      activeRecord[0].documentTypeCode === 'RECEIVE_RETURN' ||
      activeRecord[0].documentTypeCode === 'INVENTORY_RETURN'
    ) {
      props.toCreatePage(activeRecord[0]);
    } else {
      notification.warning({
        message: '当前单据类型不支持',
      });
    }
  };

  return (
    <div className={style['modal-wrapper']}>
      <div className={style['modal-content']}>
        {documentTypeList.map((record) => (
          <div
            className={
              record.active
                ? `${style['order-type-card']} ${style['order-type-card-active']}`
                : style['order-type-card']
            }
            onClick={() => handleTypeClick(record)}
            key={uuidv4()}
          >
            <div className={style.left}>
              <img src={sourceImg} alt="" />
            </div>
            <div className={style.right}>
              <div className={style.title}>{record.documentTypeName}</div>
              <div className={style.description}>{record.description}</div>
            </div>
          </div>
        ))}
      </div>
      <div className={style['modal-footer']}>
        <Button onClick={handleCancel}>取消</Button>
        <Button className={style['confirm-button']} onClick={handleConfirm}>
          确认
        </Button>
      </div>
    </div>
  );
}

export default OrderTypeCard;
