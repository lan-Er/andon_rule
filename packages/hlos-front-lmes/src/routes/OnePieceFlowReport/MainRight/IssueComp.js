/**
 * @Description: 单件流报工--MainRight-投料
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-12-15 18:54:08
 * @LastEditors: yu.na
 */

import React, { useState } from 'react';
import { connect } from 'dva';
import { isEmpty } from 'lodash';
import { TextField, Lov, NumberField } from 'choerodon-ui/pro';
import uuidv4 from 'uuid/v4';
import { getResponse } from 'utils/utils';
import notification from 'utils/notification';
import historyIcon from 'hlos-front/lib/assets/icons/history.svg';
import scanIcon from 'hlos-front/lib/assets/icons/scan.svg';
import deleteIcon from 'hlos-front/lib/assets/icons/delete.svg';
import { queryItemTagThing } from '@/services/taskService';
import { getQuantity } from '@/services/onePieceFlowReportService';
import styles from './index.less';

const IssueComp = ({
  currentTab,
  tabs = [],
  onChangeTab,
  onShowHistoryModal,
  ds,
  loginData,
  tagList,
  lotList,
  quantityList,
  dispatch,
  issueData,
  currentList,
}) => {
  // const [list, setlist] = useState([]);
  const [taskQty, setTaskQty] = useState(0);
  // const [okQty, setOkQty] = useState(0);
  const [processOkQty, setProcessOkQty] = useState(0);

  async function handleInputChange(e) {
    e.persist();
    if (e.keyCode === 13 && e.target.value.trim()) {
      let res = {};
      if (currentTab === 'tag') {
        if (tagList.findIndex((i) => i.tagCode === e.target.value) >= 0) {
          notification.warning({
            message: '标签已录入',
          });
          return;
        }
        res = await queryItemTagThing({
          tagCode: e.target.value,
          itemCode: ds.current.get('itemCode'),
          organizationId: loginData?.organizationId,
          warehouseId: issueData?.warehouseId,
        });
      } else if (currentTab === 'lot') {
        if (lotList.findIndex((i) => i.lotNumber === e.target.value) >= 0) {
          notification.warning({
            message: '批次已录入',
          });
          return;
        }
        res = await getQuantity({
          lotNumber: e.target.value,
          itemCode: ds.current.get('itemCode'),
          itemId: ds.current.get('itemId'),
          organizationId: loginData.organizationId,
          warehouseId: issueData?.warehouseId,
        });
      }
      if (getResponse(res)) {
        const arr = Array.isArray(res) ? res : res.content;
        if (!arr.length) {
          notification.warning({
            message: `${currentTab === 'tag' ? '标签' : '批次'}不存在`,
          });
          return;
        }

        const _arr = arr.map((i) => ({
          ...i,
          itemControlType: currentTab.toUpperCase(),
          issuedOkQty: 0,
        }));
        if (currentTab === 'tag') {
          dispatch({
            type: 'onePieceFlowReport/updateState',
            payload: {
              tagList: tagList.concat(..._arr),
            },
          });
        } else if (currentTab === 'lot') {
          dispatch({
            type: 'onePieceFlowReport/updateState',
            payload: {
              lotList: lotList.concat(..._arr),
            },
          });
        }
        dispatch({
          type: 'onePieceFlowReport/updateState',
          payload: {
            currentList: currentList.concat(..._arr),
          },
        });
        // setlist(list.concat(..._arr));
        ds.current.set('input', null);
      }
    }
  }

  function handleTabChange(type) {
    let arr = [];
    if (type === 'quantity') {
      arr = [...quantityList];
    } else if (type === 'lot') {
      arr = [...lotList];
    } else if (type === 'tag') {
      arr = [...tagList];
    }
    dispatch({
      type: 'onePieceFlowReport/updateState',
      payload: {
        currentList: arr,
      },
    });
    onChangeTab(type);
    ds.current.set('itemObj', null);
  }

  async function handleItemChange(rec) {
    if (rec) {
      setTaskQty(rec.taskQty || 0);
      setProcessOkQty(rec.processOkQty || 0);
      let res = {};
      if (currentTab === 'tag') {
        res = await queryItemTagThing({
          itemCode: rec.itemCode,
          organizationId: loginData?.organizationId,
          warehouseId: issueData?.warehouseId,
          page: -1,
        });
      } else if (currentTab === 'lot') {
        res = await getQuantity({
          itemCode: rec.itemCode,
          itemId: rec.itemId,
          organizationId: loginData.organizationId,
          warehouseId: issueData?.warehouseId,
          page: -1,
        });
      }
      if (getResponse(res) && !isEmpty(res)) {
        const arr = Array.isArray(res) ? res : res.content;
        if (!arr.length) return;

        const _arr = arr.map((i) => ({
          ...i,
          itemControlType: currentTab.toUpperCase(),
          issuedOkQty: 0,
        }));
        if (currentTab === 'tag') {
          dispatch({
            type: 'onePieceFlowReport/updateState',
            payload: {
              tagList: tagList.concat(..._arr),
            },
          });
        } else if (currentTab === 'lot') {
          dispatch({
            type: 'onePieceFlowReport/updateState',
            payload: {
              lotList: lotList.concat(..._arr),
            },
          });
        }
        dispatch({
          type: 'onePieceFlowReport/updateState',
          payload: {
            currentList: currentList.concat(..._arr),
          },
        });
      }
    }
  }

  function handleOtherNumChange(val, rec) {
    let idx = -1;
    if (currentTab === 'tag') {
      idx = currentList.findIndex((i) => i.tagId === rec.tagId);
    } else {
      idx = currentList.findIndex((i) => i.lotId === rec.lotId);
    }
    if (idx >= 0) {
      const _list = [...currentList];
      _list.splice(idx, 1, {
        ...rec,
        issuedOkQty: val,
      });
      dispatch({
        type: 'onePieceFlowReport/updateState',
        payload: {
          currentList: _list,
        },
      });
      if (currentTab === 'tag') {
        dispatch({
          type: 'onePieceFlowReport/updateState',
          payload: {
            tagList: _list,
          },
        });
      } else {
        dispatch({
          type: 'onePieceFlowReport/updateState',
          payload: {
            lotList: _list,
          },
        });
      }
    }
  }

  function handleNumChange(val, rec) {
    const idx = currentList.findIndex((i) => i.itemId === rec.itemId);
    const _list = [...currentList];
    _list.splice(idx, 1, {
      ...rec,
      issuedOkQty: val,
    });
    dispatch({
      type: 'onePieceFlowReport/updateState',
      payload: {
        currentList: _list,
      },
    });
    dispatch({
      type: 'onePieceFlowReport/updateState',
      payload: {
        quantityList: _list,
      },
    });
  }

  function handleDelItem(rec) {
    let idx = -1;
    if (currentTab === 'tag') {
      idx = currentList.findIndex((i) => i.tagId === rec.tagId);
    } else {
      idx = currentList.findIndex((i) => i.lotId === rec.lotId);
    }
    if (idx >= 0) {
      const _list = [...currentList];
      _list.splice(idx, 1);
      if (currentTab === 'tag') {
        dispatch({
          type: 'onePieceFlowReport/updateState',
          payload: {
            tagList: _list,
          },
        });
      } else {
        dispatch({
          type: 'onePieceFlowReport/updateState',
          payload: {
            lotList: _list,
          },
        });
      }
      dispatch({
        type: 'onePieceFlowReport/updateState',
        payload: {
          currentList: _list,
        },
      });
    }
  }

  return (
    <>
      <div className={styles['tabs-wrapper']}>
        <div className={`${styles.tabs} ${styles.issue}`}>
          {tabs.includes('tag') && (
            <div
              className={currentTab === 'tag' ? `${styles.active}` : null}
              onClick={() => handleTabChange('tag')}
            >
              标签
            </div>
          )}
          {tabs.includes('lot') && (
            <div
              className={currentTab === 'lot' ? `${styles.active}` : null}
              onClick={() => handleTabChange('lot')}
            >
              批次
            </div>
          )}
          <div
            className={currentTab === 'quantity' ? `${styles.active}` : null}
            onClick={() => handleTabChange('quantity')}
          >
            数量
          </div>
        </div>
        {(currentTab === 'lot' || currentTab === 'tag') && (
          <span>
            {processOkQty}/{taskQty}
          </span>
        )}
        <img src={historyIcon} alt="" onClick={onShowHistoryModal} />
      </div>
      {(currentTab === 'lot' || currentTab === 'tag') && (
        <div className={styles['input-area']}>
          <div>
            <TextField
              dataSet={ds}
              name="input"
              placeholder={`请扫描${currentTab === 'tag' ? '标签' : '批次'}`}
              onKeyDown={handleInputChange}
              suffix={<img src={scanIcon} alt="" />}
            />
            <Lov dataSet={ds} name="itemObj" onChange={handleItemChange} />
          </div>
        </div>
      )}
      <div className={styles.list}>
        {currentList.map((i) => {
          return (
            <div
              key={uuidv4()}
              className={`${styles['issue-list-item']} ${
                currentTab === 'quantity' ? styles.quantity : null
              }`}
            >
              <div className={styles['list-item-left']}>
                <div>
                  {currentTab === 'lot' || currentTab === 'tag' ? (
                    <p>{i.tagCode || i.lotNumber}</p>
                  ) : (
                    <p>{i.itemCode}</p>
                  )}
                  {(currentTab === 'lot' || currentTab === 'tag') && (
                    <p>
                      {i.itemDescription}
                      <span>{i.itemCode}</span>
                    </p>
                  )}
                </div>
                {currentTab === 'quantity' && <p style={{ marginLeft: 29 }}>{i.itemDescription}</p>}
              </div>
              {currentTab === 'quantity' && (
                <p>
                  {i.processOkQty}/{i.taskQty}
                </p>
              )}
              <div className={styles.block}>{i.quantity || i.onhandQty || 0}</div>
              <div className={styles.input}>
                <NumberField
                  value={i.issuedOkQty || 0}
                  onChange={(val) =>
                    currentTab === 'quantity'
                      ? handleNumChange(val, i)
                      : handleOtherNumChange(val, i)
                  }
                  min={0}
                />
              </div>
              {(currentTab === 'lot' || currentTab === 'tag') && (
                <div>
                  <img src={deleteIcon} alt="" onClick={() => handleDelItem(i)} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};
export default connect(
  ({ onePieceFlowReport: { lotList, tagList, quantityList, currentList } }) => ({
    lotList,
    tagList,
    quantityList,
    currentList,
  })
)(IssueComp);
