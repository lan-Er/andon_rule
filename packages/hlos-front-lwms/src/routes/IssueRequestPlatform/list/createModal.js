/*
 * @Description:领料单新建弹窗
 * @Author: taotao.zhu@hand-china.com
 * @Date: 2020-12-11 15:25:32
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-03-08 21:46:44
 */

import React, { useState, useEffect } from 'react';
import { Button } from 'choerodon-ui/pro';
import notification from 'utils/notification';
import uuidv4 from 'uuid/v4';
import { connect } from 'dva';
import sourceImg from 'hlos-front/lib/assets/icons/source.svg';
import style from './style.less';

import { getRequestTypeSer } from '@/services/issueRequestService';

let timer = null;

function IssueReqCreateModal(props) {
  const [documentTypeList, setDocumentTypeList] = useState([]);
  const [prevent, setPrevent] = useState(false);

  useEffect(() => {
    handleQueryTypeList();
  }, []);

  const handleQueryTypeList = async () => {
    const res = await getRequestTypeSer();
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
    props.addData(activeRecord[0]);
    const arr = [
      'COMMON_REQUEST',
      'COST_CENTER_REQUEST',
      'MIXED_REQUEST',
      'MO_ISSUE_REQUEST',
      'PLANNED_MO_ISSUE_REQUEST',
      'PLANNED_REQUEST',
      'OUT_SOURCE_PO_REQUEST',
    ];
    if (!arr.includes(activeRecord[0].documentTypeCode)) {
      notification.warning({
        message: '当前单据类型不支持',
      });
      return;
    }
    let pathname = '/lwms/issue-request-platform/list';
    if (
      activeRecord[0].documentTypeCode === 'COMMON_REQUEST' ||
      activeRecord[0].documentTypeCode === 'MO_ISSUE_REQUEST' ||
      activeRecord[0].documentTypeCode === 'PLANNED_MO_ISSUE_REQUEST' ||
      activeRecord[0].documentTypeCode === 'PLANNED_REQUEST'
    ) {
      pathname = '/lwms/issue-request-platform/prodNotLimit';
    } else if (activeRecord[0].documentTypeCode === 'COST_CENTER_REQUEST') {
      pathname = '/lwms/issue-request-platform/costCenter';
    } else if (activeRecord[0].documentTypeCode === 'MIXED_REQUEST') {
      pathname = '/lwms/issue-request-platform/mixed';
    } else if (activeRecord[0].documentTypeCode === 'OUT_SOURCE_PO_REQUEST') {
      pathname = '/lwms/issue-request-platform/outSource';
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
    sessionStorage.setItem('initMyState', myState);
    props.onModalOk();
  };

  return (
    <div className={style['lwms-issue-request-modal-wrapper']}>
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

const mapDispatchToProps = (dispatch) => ({
  addData: (payload) => {
    dispatch({
      type: 'issueRequestPlatform/addData',
      payload,
    });
  },
});

export default connect(null, mapDispatchToProps)(IssueReqCreateModal);
