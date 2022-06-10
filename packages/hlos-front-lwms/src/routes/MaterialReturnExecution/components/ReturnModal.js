/**
 * @Description: 退料执行--Modal
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-08-25 10:28:08
 * @LastEditors: yu.na
 */

import React, { Fragment, useState } from 'react';
import { Button, TextField, Spin, CheckBox, Tooltip } from 'choerodon-ui/pro';
import moment from 'moment';
import intl from 'utils/intl';
import { getResponse } from 'utils/utils';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';

import { requestItemByTag, requestItemByLot } from '@/services/materialReturnExecutionService';
import DocumentIcon from 'hlos-front/lib/assets/icons/odd-number.svg';
import ScanIcon from 'hlos-front/lib/assets/icons/scan.svg';
import DownImg from 'hlos-front/lib/assets/icons/down-blue.svg';

export default ({ onModalClose, onModalSure, value, activeTab, list = [] }) => {
  const [isLoading, setLoading] = useState(false);
  const [allChecked, setAllChecked] = useState(false);
  const [checkedList, setCheckedList] = useState([]);
  const [inputValue, setInput] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageDisabled, changePageDisabled] = useState(false);
  const [itemList, setList] = useState(list);
  const [totalNum, setTotalNum] = useState(0);

  function handleCheckItem(record) {
    const checked = checkedList.slice();
    const _list = [];
    let num = 0;
    if (!record.checked) {
      const newList = checked.concat({
        ...record,
        checked: true,
      });
      newList.forEach((i) => {
        if (activeTab === 'LOT') {
          num += i.initialQty;
        } else {
          num += i.quantity;
        }
      });
      setCheckedList(newList);
      setTotalNum(num);
    } else {
      const index = checked.findIndex((i) => i.itemId === record.itemId);
      checked.splice(index, 1);
      checked.forEach((i) => {
        if (activeTab === 'LOT') {
          num += i.initialQty;
        } else {
          num += i.quantity;
        }
      });
      setCheckedList(checked);
      setTotalNum(num);
    }

    itemList.forEach((i) => {
      if (i.itemId === record.itemId) {
        _list.push({
          ...i,
          checked: !i.checked,
        });
      } else {
        _list.push(i);
      }
    });
    setList(_list);
    if (_list.filter((i) => !i.checked).length === 0) {
      setAllChecked(true);
    } else {
      setAllChecked(false);
    }
  }

  function handleCheckAll() {
    const _list = [];
    itemList.forEach((i) => {
      _list.push(i);
    });

    if (allChecked) {
      _list.forEach((el) => {
        const _el = el;
        _el.checked = false;
      });
      setCheckedList([]);
    } else {
      _list.forEach((el) => {
        const _el = el;
        _el.checked = true;
      });
      setCheckedList(_list);
    }
    setAllChecked(!allChecked);
  }

  async function handlePageChange() {
    if (pageDisabled) return;
    setLoading(true);
    let res = {};
    let params = {
      itemCode: inputValue,
      page: currentPage,
    };
    if (activeTab === 'LOT') {
      params = {
        ...params,
        lotNumber: value,
      };
      res = await requestItemByLot(params);
    } else {
      params = {
        ...params,
        tagCode: value,
      };
      res = await requestItemByTag(params);
    }
    if (getResponse(res) && res && res.content && res.content[0]) {
      if (itemList.filter((i) => i.itemId === res.content[0].itemId).length) return;
      res.content.forEach((el) => {
        const _el = el;
        _el.checked = false;
      });
      setList(itemList.concat(res.content));
    }
    const dom = document.getElementById('tbody');
    dom.scrollTop = dom.scrollHeight;

    setLoading(false);
    if ((currentPage + 1) * 6 > totalNum || (currentPage + 1) * 6 === totalNum) {
      changePageDisabled(true);
    }
    setCurrentPage(currentPage + 1);
  }

  async function handleSearch(e) {
    e.persist();
    let res = {};
    if (e.keyCode === 13) {
      let params = {
        itemCode: e.target.value,
        page: 0,
      };
      if (activeTab === 'LOT') {
        params = {
          ...params,
          lotNumber: value,
        };
        res = await requestItemByLot(params);
      } else {
        params = {
          ...params,
          tagCode: value,
        };
        res = await requestItemByTag(params);
      }
      if (getResponse(res) && res && res.content) {
        res.content.forEach((el) => {
          const _el = el;
          _el.checked = false;
        });
        setList(res.content);
      }
      setInput(e.target.value);
      setCheckedList([]);
      setAllChecked(false);
    }
  }

  return (
    <Fragment>
      <div className="header">
        <div className="item-by">
          <img src={DocumentIcon} alt="" />
          {value}
        </div>
        <div className="item-scan">
          <TextField placeholder="请输入/扫描物料编码" onKeyDown={handleSearch} />
          <img src={ScanIcon} alt="" />
        </div>
      </div>
      <Spin spinning={isLoading}>
        <table className="list">
          <thead>
            <tr>
              <th>
                <CheckBox checked={allChecked} onChange={handleCheckAll} />
                物料编码
              </th>
              <th>总数：{totalNum}</th>
              <th>失效日期</th>
            </tr>
          </thead>
          <tbody id="tbody" className="tag">
            {itemList.map((item) => {
              return (
                <tr key={item.itemId}>
                  <td>
                    <CheckBox checked={item.checked} onChange={() => handleCheckItem(item)} />
                    {item.itemCode}
                  </td>
                  <td className="input">
                    <span>
                      <Tooltip title={item.itemDescription}>
                        <div
                          style={{
                            width: '80px',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {item.itemDescription}
                        </div>
                      </Tooltip>
                    </span>
                    <span style={{ marginLeft: 12 }}>
                      {activeTab === 'LOT' ? item.initialQty : item.quantity}
                    </span>
                    <span style={{ marginLeft: 12, fontSize: 18 }}>{item.uomName}</span>
                  </td>
                  <td style={{ fontSize: 18 }}>
                    {moment(item.expireDate).format(DEFAULT_DATE_FORMAT)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Spin>
      <img
        className="down-icon"
        src={DownImg}
        alt=""
        onClick={handlePageChange}
        style={{ cursor: !pageDisabled ? 'pointer' : 'not-allowed' }}
      />
      <div className="footer">
        <Button onClick={onModalClose}>{intl.get('hzero.common.button.cancel').d('取消')}</Button>
        <Button color="primary" onClick={() => onModalSure(checkedList)}>
          {intl.get('hzero.common.button.sure').d('确定')}
        </Button>
      </div>
    </Fragment>
  );
};
