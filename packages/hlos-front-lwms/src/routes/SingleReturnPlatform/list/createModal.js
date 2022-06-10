/*
 * @Description:退料单新建弹窗
 * @Author: leying.yan@hand-china.com
 * @Date: 2021-06-01 16:25:32
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-06-01 21:46:44
 */

import React, { useState, useEffect } from 'react';
import { Button } from 'choerodon-ui/pro';
import notification from 'utils/notification';
import uuidv4 from 'uuid/v4';
import sourceImg from 'hlos-front/lib/assets/icons/source.svg';
import style from './index.less';

import { getRequestType } from '@/services/singleReturnService';

let timer = null;

function SingleReturnCreateModal(props) {
  const [documentTypeList, setDocumentTypeList] = useState([]);
  const [prevent, setPrevent] = useState(false);

  useEffect(() => {
    handleQueryTypeList();
  }, []);

  const handleQueryTypeList = async () => {
    const res = await getRequestType();
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
    timer = setTimeout(() => {
      if (!prevent) {
        let typeList = documentTypeList.slice();
        typeList = typeList.map((v) => {
          if (v.documentTypeId === record.documentTypeId) {
            return { ...v, active: true };
          }
          return { ...v, active: false };
        });
        setDocumentTypeList(typeList);
      }
      setPrevent(false);
    }, 200);
  };

  const handleCancel = () => {
    let typeList = documentTypeList.slice();
    typeList = typeList.map((v) => ({ ...v, active: false }));
    setDocumentTypeList(typeList);
    props.modal.close();
  };

  const handleConfirm = (rec) => {
    clearTimeout(timer);
    setPrevent(true);
    let activeRecord = [];
    if (rec) {
      activeRecord = [rec];
    } else {
      const typeList = documentTypeList.slice();
      activeRecord = typeList.filter((v) => v.active);
    }
    const arr = ['ME_REQUEST_RETURN', 'ME_RETURN', 'OUT_SOURCE_REQUEST_RETURN'];
    if (!arr.includes(activeRecord[0].documentTypeCode)) {
      notification.warning({
        message: '当前单据类型不支持',
      });
      return;
    }
    let pathname = '/lwms/single-return-platform/list';
    if (activeRecord[0].documentTypeCode === 'ME_REQUEST_RETURN') {
      pathname = '/lwms/single-return-platform/prodIssueReturn';
    } else if (activeRecord[0].documentTypeCode === 'ME_RETURN') {
      pathname = '/lwms/single-return-platform/requestIssueReturn';
    } else if (activeRecord[0].documentTypeCode === 'OUT_SOURCE_REQUEST_RETURN') {
      pathname = '/lwms/single-return-platform/outSourceIssueReturn';
    }
    props.history.push({
      pathname,
      state: {
        orderStatus: props.orderStatus,
        returnOrderObj: activeRecord[0],
      },
    });
    const myState = JSON.stringify({
      orderStatus: props.orderStatus,
      returnOrderObj: activeRecord[0],
    });
    sessionStorage.setItem('singleReturnState', myState);
    props.onModalOk();
  };

  return (
    <div className={style['lwms-single-return-modal-wrapper']}>
      <div className={style['modal-content']}>
        {documentTypeList.map((record) => (
          <div
            className={
              record.active
                ? `${style['order-type-card']} ${style['order-type-card-active']}`
                : style['order-type-card']
            }
            onClick={() => handleTypeClick(record)}
            onDoubleClick={() => handleConfirm(record)}
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
        <Button className={style['confirm-button']} onClick={() => handleConfirm()}>
          确认
        </Button>
      </div>
    </div>
  );
}

export default SingleReturnCreateModal;
