/*
 * @Description: 投料弹框
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-03-16 14:47:04
 */

import React, { useEffect, useState } from 'react';
import { TextField, NumberField, Spin, CheckBox } from 'choerodon-ui/pro';
import { Tooltip } from 'choerodon-ui';

import uuidv4 from 'uuid/v4';
import notification from 'utils/notification';
import { itemLotNumber, itemTagThing } from '@/services/taskService';

// import TagIcon from 'hlos-front/lib/assets/icons/tag-icon.svg';
// import LotIcon from 'hlos-front/lib/assets/icons/lot-icon.svg';
import LotIcon from 'hlos-front/lib/assets/icons/rec-lot.svg';
import TagIcon from 'hlos-front/lib/assets/icons/rec-tag.svg';
import ItemDescIcon from 'hlos-front/lib/assets/icons/item-icon2.svg';
import Scan from 'hlos-front/lib/assets/icons/scan.svg';
// import Down from '../assets/down-blue.svg';

import styles from '../style.less';

export default (props) => {
  const [lineList, setLineList] = useState([]);
  const [totalInputQty, setTotalInputQty] = useState(0);
  // const [lotNumber, setLotNumber] = useState('');
  // const [tagCode, setTagCode] = useState('');
  const [detailsInputQty, setDetailsInputQty] = useState(0);
  const [loading, setLoading] = useState(false);
  const [tagCheckedQty, setTagCheckedQty] = useState(0);

  useEffect(() => {
    if (props.headerInfo.itemControlType === 'LOT' && !props.headerInfo.lineList) {
      handleItemLotNumber(props.headerInfo);
    } else if (props.headerInfo.itemControlType === 'TAG' && !props.headerInfo.lineList) {
      handleItemTagThing(props.headerInfo);
    } else {
      setLineList(props.headerInfo.lineList || []);
      setTotalInputQty(props.headerInfo.issuedOkQty);
    }
  }, []);

  // 获取物料关联的批次
  async function handleItemLotNumber(record, value) {
    setLoading(true);
    const res = await itemLotNumber({
      itemCode: record.itemCode,
      organizationId: props.orgObj.organizationId,
      warehouseId: record.warehouseId || '',
      wmAreaId: record.wmAreaId || '',
      lotNumber: value,
    });
    if (res && res.content && res.content.length) {
      const list = res.content.map((v) => ({ ...v, issuedOkQty: detailsInputQty, checked: false }));
      if (value) {
        let flag = true;
        lineList.some((v) => {
          if (v.lotNumber === value) {
            flag = false;
          }
          return flag;
        });
        if (flag) {
          setLineList([...lineList, ...list]);
        } else {
          notification.warning({
            message: '已存在该批次',
          });
        }
      } else {
        setLineList([...lineList, ...list]);
      }
      setLoading(false);
      props.queryLineList(list);
    } else {
      notification.warning({
        message: '暂无符合条件数据',
      });
      setLoading(false);
    }
  }

  // 获取物料关联的标签
  async function handleItemTagThing(record, value) {
    setLoading(true);
    const res = await itemTagThing({
      itemCode: record.itemCode,
      organizationId: props.orgObj.organizationId,
      warehouseId: record.warehouseId || '',
      wmAreaId: record.wmAreaId || '',
      tagCode: value,
    });
    if (res && res.content && res.content.length) {
      let total = 0;
      const list = res.content.map((v) => {
        total += v.quantity;
        return { ...v, issuedOkQty: v.quantity, checked: false };
      });
      if (value) {
        let flag = true;
        lineList.some((v) => {
          if (v.tagCode === value) {
            flag = false;
          }
          return flag;
        });
        if (flag) {
          setLineList([...lineList, ...list]);
          setTotalInputQty(total);
        } else {
          notification.warning({
            message: '已存在该标签',
          });
        }
      } else {
        setLineList([...lineList, ...list]);
        setTotalInputQty(total);
      }
      setLoading(false);
      props.queryLineList(list);
    } else {
      notification.warning({
        message: '暂无符合条件数据',
      });
      setLoading(false);
    }
  }

  // // 数量加减
  // function handleUpdateDetailsCount(type, lineIndex) {
  //   const list = lineList.slice();
  //   let total = 0;
  //   const maxQty =
  //     props.headerInfo.itemControlType === 'LOT'
  //       ? list[lineIndex].initialQty
  //       : list[lineIndex].quantity;
  //   if (type === 'add') {
  //     if (list[lineIndex].issuedOkQty >= maxQty) {
  //       return;
  //     }
  //     list[lineIndex].issuedOkQty++;
  //     list[lineIndex].checked = true;
  //   } else {
  //     if (list[lineIndex].issuedOkQty <= 0) {
  //       return;
  //     }
  //     list[lineIndex].issuedOkQty--;
  //     list[lineIndex].checked = true;
  //   }
  //   let checkedQty = 0;
  //   list.forEach((ele) => {
  //     total += ele.issuedOkQty;
  //     if (ele.checked) {
  //       checkedQty += ele.issuedOkQty;
  //     }
  //   });
  //   setTagCheckedQty(checkedQty);
  //   setLineList(list);
  //   setTotalInputQty(total);
  //   props.queryLineList(list);
  // }

  // 数量直接更改
  function handleInputChange(value, lineIndex) {
    let list = lineList.slice();
    let total = 0;
    let inputValue = 0;
    const maxQty =
      props.headerInfo.itemControlType === 'LOT'
        ? list[lineIndex].initialQty
        : list[lineIndex].quantity;
    if (value > maxQty) {
      inputValue = 0;
    } else {
      inputValue = value;
    }
    list = list.map((v, i) => {
      if (i === lineIndex) {
        return { ...v, issuedOkQty: inputValue, checked: true };
      }
      return { ...v };
    });
    let checkedQty = 0;
    list.forEach((ele) => {
      total += ele.issuedOkQty;
      if (ele.checked) {
        checkedQty += ele.issuedOkQty;
      }
    });
    setTagCheckedQty(checkedQty);
    setLineList(list);
    setTotalInputQty(total);
    props.queryLineList(list);
  }

  function handleDetailsQtyChange(value) {
    setDetailsInputQty(value);
  }

  function handleSearch(value) {
    if (props.headerInfo.itemControlType === 'LOT') {
      // if (!lotNumber) {
      //   setLineList([]);
      // }
      // setLotNumber(value);
      handleItemLotNumber(props.headerInfo, value);
    } else {
      // if (!tagCode) {
      //   setLineList([]);
      // }
      // setTagCode(value);
      handleItemTagThing(props.headerInfo, value);
    }
  }

  // 复选框
  function handleCheckChange(value, i) {
    const list = lineList.slice();
    let checkedQty = 0;
    list[i].checked = value;
    const checkedArr = list.filter((v) => v.checked);
    checkedArr.forEach((ele) => {
      checkedQty += ele.issuedOkQty;
    });
    setTagCheckedQty(checkedQty);
    setLineList(list);
    props.queryLineList(list);
  }

  return (
    <>
      <div className={styles['details-modal-header']}>
        <div className={styles['details-item-desc']}>
          <img src={ItemDescIcon} alt="" />
          <span>{props.headerInfo.itemCode}</span>
          <span>{props.headerInfo.itemDescription}</span>
        </div>
        <div className={styles['details-tag']}>
          <img src={TagIcon} alt="" />
          <span>指定标签</span>
        </div>
        {props.headerInfo.itemControlType === 'TAG' && (
          <div className={styles['details-lot']}>
            <img src={LotIcon} alt="" />
            <span>指定批次</span>
          </div>
        )}
      </div>
      <div className={styles['details-header-info']}>
        <div className={styles['demand-number']}>
          <span>工单需求量</span>
          <span className={styles.value}>{props.headerInfo.taskQty}</span>
        </div>
        <div className={styles['feeding-number']}>
          <span>已投料量</span>
          <span className={styles.value}>
            {props.headerInfo.itemControlType === 'LOT'
              ? props.headerInfo.processOkQty || 0 + totalInputQty
              : tagCheckedQty}
          </span>
        </div>
        {props.headerInfo.itemControlType === 'LOT' && (
          <div className={`${styles['input-number']} ${styles['header-info']}`}>
            <NumberField
              value={detailsInputQty}
              step={0.000001}
              onChange={handleDetailsQtyChange}
              placeholder="请输入数量"
            />
          </div>
        )}
        <div className={`${styles['input-scan']} ${styles['header-info']}`}>
          <TextField
            placeholder={`请输入或扫描${
              props.headerInfo.itemControlType === 'LOT' ? '批次' : '标签'
            }号`}
            onChange={(value) => handleSearch(value)}
          />
          <img src={Scan} alt="scan" />
        </div>
      </div>
      <div className={styles['details-modal-content']}>
        <Spin spinning={loading}>
          {lineList.length ? (
            lineList.map((v, i) => {
              return (
                <div className={styles['details-line']} key={uuidv4()}>
                  {props.headerInfo.itemControlType === 'TAG' && (
                    <div className={styles['details-line-info']}>
                      <CheckBox
                        style={{
                          marginBottom: '6px',
                          marginRight: '20px',
                        }}
                        checked={v.checked}
                        onChange={(value) => handleCheckChange(value, i)}
                      />
                      <img src={TagIcon} alt="" />
                      <Tooltip title={v.tagCode}>{v.tagCode}</Tooltip>
                    </div>
                  )}
                  {v.lotNumber && (
                    <div className={styles['details-line-info']}>
                      <CheckBox
                        style={{
                          marginBottom: '6px',
                          marginRight: '20px',
                        }}
                        checked={v.checked}
                        onChange={(value) => handleCheckChange(value, i)}
                      />
                      <img src={LotIcon} alt="" />
                      <Tooltip title={v.lotNumber}>{v.lotNumber}</Tooltip>
                    </div>
                  )}
                  <div className={styles['details-line-input']}>
                    {/* <span
                      className={styles['counter-button']}
                      onClick={() => handleUpdateDetailsCount('minus', i)}
                    >
                      -
                    </span> */}
                    <NumberField
                      className={styles['counter-content']}
                      value={v.issuedOkQty || 0}
                      step={0.000001}
                      min={0}
                      onChange={(value) => handleInputChange(value, i)}
                    />
                    {/* <span
                      className={styles['counter-button']}
                      onClick={() => handleUpdateDetailsCount('add', i)}
                    >
                      +
                    </span> */}
                  </div>
                  <div className={styles['details-line-info']}>
                    现有量：{props.headerInfo.itemControlType === 'LOT' ? v.initialQty : v.quantity}{' '}
                    {v.uomName}
                  </div>
                </div>
              );
            })
          ) : (
            <div className={styles['details-no-data']}>暂无数据</div>
          )}
        </Spin>
      </div>
      <div className={styles['details-modal-footer']}>
        <span>总计: </span>
        <span className={styles.value}>{totalInputQty}</span>
      </div>
    </>
  );
};
