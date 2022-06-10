/**
 * @Description: 领料执行--捡料modal
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-07-13 15:40:08
 * @LastEditors: yu.na
 */

import React, { Fragment, useState, useEffect } from 'react';
import { TextField, CheckBox, Spin, Button } from 'choerodon-ui/pro';
import { Tooltip } from 'choerodon-ui';
import moment from 'moment';
import { getResponse } from 'utils/utils';
import intl from 'utils/intl';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import { requestItemLot, requestItemTag } from '@/services/issueRequestExecuteService';
import OrderImg from 'hlos-front/lib/assets/icons/odd-number.svg';
import LocationImg from 'hlos-front/lib/assets/icons/location.svg';
import NumImg from 'hlos-front/lib/assets/icons/quantity.svg';
import ScanImg from 'hlos-front/lib/assets/icons/scan.svg';
// import DownImg from 'hlos-front/lib/assets/icons/down.svg';
import CommonInput from 'hlos-front/lib/components/CommonInput';

export default (props) => {
  const { data = {}, inputDisabled, headerData = {} } = props;
  const [selectedQty, setSelectedQty] = useState(0);
  // const [inputValue, setInput] = useState(null);
  // const [currentPage, setCurrentPage] = useState(1);
  const [pickList, setPickList] = useState([]);
  const [totalNum, setTotalNum] = useState([]);
  const [allChecked, setAllChecked] = useState(false);
  const [checkedList, setCheckedList] = useState([]);
  const [isLoading, setLoading] = useState(false);
  // const [pageDisabled, changePageDisabled] = useState(false);
  const [adviseFlag, changeAdviseFlag] = useState(null);
  const [useAdvise, setUseAdvise] = useState(false);

  useEffect(() => {
    if (data.requestPickDetailList) {
      setCheckedList(data.requestPickDetailList);
      let qty = 0;
      data.requestPickDetailList.forEach((i) => {
        qty += i.pickedQty;
      });
      setSelectedQty(qty);
    }
    let _adviseFlag = null;
    let _useAdvise = false;
    const arr = ['ADVISE', 'ENFORCE'];
    if (
      data.pickRule &&
      JSON.parse(data.pickRule) &&
      arr.includes(JSON.parse(data.pickRule).pick_advise)
    ) {
      setUseAdvise(true);
      _useAdvise = true;
      if (JSON.parse(data.pickRule).pick_advise === 'ENFORCE') {
        changeAdviseFlag(1);
        _adviseFlag = 1;
      }
    }
    async function query() {
      let res = {};
      setLoading(true);
      if (data.itemControlType === 'LOT') {
        res = await requestItemLot({
          page: -1,
          size: 6,
          itemId: data.itemId,
          itemCode: data.itemCode,
          organizationId: headerData.organizationId,
          warehouseId: data.warehouseId,
          wmAreaId: data.wmAreaId,
          itemControlType: 'LOT',
          demandQty: (data.applyQty || 0) - (data.pickedQty || 0),
          advisedFlag: _adviseFlag,
          useAdvise: _useAdvise,
        });
      } else if (data.itemControlType === 'TAG') {
        res = await requestItemTag({
          page: -1,
          size: 10,
          itemCode: data.itemCode,
          organizationId: headerData.organizationId,
          warehouseId: data.warehouseId,
          demandQty: (data.applyQty || 0) - (data.pickedQty || 0),
          wmAreaId: data.wmAreaId,
          advisedFlag: _adviseFlag,
          useAdvise: _useAdvise,
        });
      }
      if (getResponse(res) && res) {
        const resArr = res.content || res;
        if (resArr.length) {
          resArr.forEach((el) => {
            const _el = el;
            if (_useAdvise) {
              _el.initialQty = _el.advisedQty || 0;
            } else if (data.itemControlType === 'LOT') {
              _el.initialQty = 0;
            } else {
              _el.initialQty = _el.quantity || 0;
            }
            if (data.requestPickDetailList) {
              if (data.itemControlType === 'LOT') {
                const lotIdx = data.requestPickDetailList.findIndex(
                  (i) => i.lotNumber === _el.lotNumber
                );
                if (lotIdx !== -1) {
                  _el.checked = true;
                  _el.initialQty = data.requestPickDetailList[lotIdx].pickedQty;
                } else {
                  _el.checked = false;
                }
              } else if (data.itemControlType === 'TAG') {
                const tagIds = data.requestPickDetailList.findIndex(
                  (i) => i.tagCode === _el.tagCode
                );
                if (tagIds !== -1) {
                  _el.checked = true;
                } else {
                  _el.checked = false;
                }
              }
            } else {
              _el.pickedQty = _el.initialQty;
            }
          });
          if (!data.requestPickDetailList) {
            let num = 0;
            resArr.forEach((i) => {
              const _i = i;
              if (_i.pickedQty) {
                _i.checked = true;
                num += _i.pickedQty;
              }
            });
            if (num) {
              setSelectedQty(num);
              setCheckedList(resArr);
            }
          }
          setPickList(resArr);
          setAllChecked(resArr.every((i) => i.checked));
          setTotalNum(res.content ? res.totalElements : res.length);
        }
      }
      setLoading(false);
    }
    query();
  }, [data]);

  function handleNumChange(value, record) {
    const index = pickList.findIndex((item) => item.lotId === record.lotId);
    const list = pickList.slice();
    list.splice(index, 1, {
      ...record,
      initialQty: value,
      pickedQty: value,
      checked: value > 0,
    });
    setPickList(list);
    let num = 0;
    list.forEach((i) => {
      if (i.checked) {
        num += i.initialQty;
      }
    });
    setSelectedQty(num);
    setCheckedList(list.filter((i) => i.checked));
  }

  async function handleSearch(e) {
    e.persist();
    let res = {};
    let _selectedQty = 0;
    const _pickList = pickList.slice();
    if (e.keyCode === 13) {
      if (data.itemControlType === 'LOT') {
        if (pickList.every((i) => i.lotNumber === e.target.value)) {
          _pickList.forEach((el) => {
            const _el = el;
            _el.checked = !_el.checked;
            _selectedQty += _el.initialQty;
          });
          setPickList(_pickList);
          setAllChecked(_pickList.every((i) => i.checked));
          setSelectedQty(_pickList[0] && _pickList[0].checked ? _selectedQty : 0);
          setCheckedList(_pickList.filter((i) => i.checked));
          return;
        }
        res = await requestItemLot({
          itemCode: data.itemCode,
          itemId: data.itemId,
          lotNumber: e.target.value,
          page: -1,
          size: 6,
          organizationId: headerData.organizationId,
          warehouseId: data.warehouseId,
          wmAreaId: data.wmAreaId,
          itemControlType: 'LOT',
          demandQty: (data.applyQty || 0) - (data.pickedQty || 0),
          advisedFlag: adviseFlag,
          useAdvise,
        });
      } else if (data.itemControlType === 'TAG') {
        if (pickList.every((i) => i.tagCode === e.target.value)) {
          _pickList.forEach((el) => {
            const _el = el;
            _el.checked = !_el.checked;
            _selectedQty += _el.initialQty;
          });
          setPickList(_pickList);
          setAllChecked(_pickList.every((i) => i.checked));
          setSelectedQty(_pickList[0] && _pickList[0].checked ? _selectedQty : 0);
          setCheckedList(_pickList.filter((i) => i.checked));
          return;
        }
        res = await requestItemTag({
          tagCode: e.target.value,
          page: -1,
          size: 10,
          itemCode: data.itemCode,
          organizationId: headerData.organizationId,
          warehouseId: data.warehouseId,
          wmAreaId: data.wmAreaId,
          demandQty: (data.applyQty || 0) - (data.pickedQty || 0),
          advisedFlag: adviseFlag,
          useAdvise,
        });
      }
      if (getResponse(res) && res) {
        const resArr = res.content || res;
        resArr.forEach((el) => {
          const _el = el;
          if (e.target.value.trim()) {
            _el.checked = true;
          } else {
            _el.checked = false;
          }
          _selectedQty += _el.initialQty;
        });
        setPickList(resArr);
        if (e.target.value.trim()) {
          setAllChecked(true);
          setSelectedQty(_selectedQty);
          setCheckedList(resArr.filter((i) => i.checked));
        } else {
          setAllChecked(false);
          setSelectedQty(0);
          setCheckedList([]);
        }
      }
      // setInput(e.target.value);
    }
  }

  function handleCheckItem(record) {
    const checked = checkedList.slice();
    const _list = [];
    if (!record.checked) {
      const newList = checked.concat({
        ...record,
        record: true,
      });
      let num = 0;
      newList.forEach((i) => {
        num += i.initialQty || 0;
      });

      setSelectedQty(num);
      setCheckedList(newList);
    } else {
      let num = 0;
      let index = -1;
      if (data.itemControlType === 'LOT') {
        index = checked.findIndex((i) => i.lotId === record.lotId);
      } else {
        index = checked.findIndex((i) => i.tagId === record.tagId);
      }
      checked.splice(index, 1);
      checked.forEach((i) => {
        num += i.initialQty || 0;
      });
      setSelectedQty(num);
      setCheckedList(checked);
    }
    if (data.itemControlType === 'LOT') {
      pickList.forEach((i) => {
        if (i.lotId === record.lotId) {
          _list.push({
            ...i,
            checked: !i.checked,
          });
        } else {
          _list.push(i);
        }
      });
    } else {
      pickList.forEach((i) => {
        if (i.tagId === record.tagId) {
          _list.push({
            ...i,
            checked: !i.checked,
          });
        } else {
          _list.push(i);
        }
      });
    }
    if (_list.filter((i) => !i.checked).length === 0) {
      setAllChecked(true);
    } else {
      setAllChecked(false);
    }
    setPickList(_list);
  }

  function handleCheckAll() {
    const _list = [];
    pickList.forEach((i) => {
      _list.push(i);
    });

    if (allChecked) {
      _list.forEach((el) => {
        const _el = el;
        _el.checked = false;
      });
      setSelectedQty(0);
      setCheckedList([]);
    } else {
      let num = 0;
      _list.forEach((el) => {
        const _el = el;
        _el.checked = true;
        num += el.initialQty;
      });
      setSelectedQty(num);
      setCheckedList(pickList);
    }
    setAllChecked(!allChecked);
  }

  // async function handlePageChange() {
  //   if (pageDisabled) return;
  //   let res = {};
  //   setLoading(true);
  //   if (data.itemControlType === 'LOT') {
  //     res = await requestItemLot({
  //       itemId: data.itemId,
  //       itemCode: data.itemCode,
  //       lotNumber: inputValue,
  //       page: currentPage,
  //       size: 6,
  //       organizationId: headerData.organizationId,
  //       warehouseId: data.warehouseId,
  //       wmAreaId: data.wmAreaId,
  //       itemControlType: 'LOT',
  //       demandQty: (data.applyQty || 0) - (data.pickedQty || 0),
  //       advisedFlag: adviseFlag,
  //       useAdvise,
  //     });
  //   } else if (data.itemControlType === 'TAG') {
  //     res = await requestItemTag({
  //       itemCode: data.itemCode,
  //       tagCode: inputValue,
  //       page: currentPage,
  //       size: 10,
  //       organizationId: headerData.organizationId,
  //       warehouseId: data.warehouseId,
  //       wmAreaId: data.wmAreaId,
  //       demandQty: (data.applyQty || 0) - (data.pickedQty || 0),
  //       advisedFlag: adviseFlag,
  //       useAdvise,
  //     });
  //   }
  //   setLoading(false);
  //   if (getResponse(res) && res && res.content && res.content[0]) {
  //     // if (pickList.filter((i) => i.lotId === res.content[0].lotId).length) return;
  //     res.content.forEach((el) => {
  //       const _el = el;
  //       if (data.requestPickDetailList) {
  //         // const lotIdx = data.requestPickDetailList.findIndex(i => i.lotNumber === _el.lotNumber);
  //         const tagIds = data.requestPickDetailList.findIndex((i) => i.tagCode === _el.tagCode);
  //         if (data.itemControlType === 'TAG' && tagIds !== -1) {
  //           _el.checked = true;
  //         } else {
  //           _el.checked = false;
  //         }
  //       }
  //     });
  //     setPickList(pickList.concat(res.content));
  //   }
  //   const dom = document.getElementById('tbody');
  //   dom.scrollTop = dom.scrollHeight;

  //   if ((currentPage + 1) * 6 > totalNum || (currentPage + 1) * 6 === totalNum) {
  //     changePageDisabled(true);
  //   }
  //   setCurrentPage(currentPage + 1);
  // }

  return (
    <Fragment>
      <div className="query">
        <Tooltip
          title={`${data.itemCode}${data.itemDescription ? `-${data.itemDescription}` : ''}`}
        >
          <div className="item">
            <img src={OrderImg} alt="" />
            {data.itemCode} {data.itemDescription && <span>- {data.itemDescription}</span>}
          </div>
        </Tooltip>
      </div>
      <div className="query">
        <Tooltip
          title={`${data.warehouseName}${data.wmAreaName ? `-${data.wmAreaName}` : ''}${
            data.workcellName ? `-${data.workcellName}` : ''
          }`}
        >
          <div className="location">
            <img src={LocationImg} alt="" />
            {data.warehouseName} {data.wmAreaName && <span>-{data.wmAreaName}</span>}
            {data.workcellName && <span>-{data.workcellName}</span>}
          </div>
        </Tooltip>
        <div>
          <img src={NumImg} alt="" />
          {data.applyQty} {data.uomName}
        </div>
        <div className="input-scan">
          <TextField
            placeholder={`请扫描物料${data.itemControlType === 'LOT' ? '批次' : '标签'}号/查找`}
            onKeyDown={handleSearch}
          />
          <img src={ScanImg} alt="" />
        </div>
      </div>
      <Spin spinning={isLoading}>
        <table className="list">
          <thead>
            <tr>
              <th>
                <CheckBox checked={allChecked} onChange={handleCheckAll} />
                {data.itemControlType === 'LOT' ? '批次数' : '标签数'}：{checkedList.length}/
                {totalNum}
              </th>
              <th>总数：{selectedQty}</th>
              <th>失效日期</th>
              <th>库位</th>
              <th>现有量</th>
            </tr>
          </thead>
          {data.itemControlType === 'LOT' ? (
            <tbody id="tbody">
              {pickList.map((item) => {
                return (
                  <tr key={item.lotId}>
                    <td>
                      <CheckBox checked={item.checked} onChange={() => handleCheckItem(item)} />
                      {item.lotNumber}
                    </td>
                    <td className="input">
                      <CommonInput
                        step={0.000001}
                        record={item}
                        value={item.initialQty || 0}
                        disabled={inputDisabled}
                        onChange={handleNumChange}
                      />
                      <span style={{ marginLeft: 12, color: '#333' }}>{item.uomName}</span>
                    </td>
                    <td style={{ fontSize: 18 }}>
                      {moment(item.expireDate).format(DEFAULT_DATE_FORMAT)}
                    </td>
                    <td>
                      {item.wmAreaName}
                      {item.wmUnitCode && <span>-{item.wmUnitCode}</span>}
                    </td>
                    <td>{item.quantity || 0}</td>
                  </tr>
                );
              })}
            </tbody>
          ) : (
            <tbody id="tbody" className="tag">
              {pickList.map((item) => {
                return (
                  <tr key={item.tagCode}>
                    <td>
                      <CheckBox checked={item.checked} onChange={() => handleCheckItem(item)} />
                      {item.tagCode}
                    </td>
                    <td className="input">
                      <span>{item.initialQty}</span>
                      <span style={{ marginLeft: 12, fontSize: 18 }}>{item.uomName}</span>
                    </td>
                    <td style={{ fontSize: 18 }}>
                      {moment(item.expireDate).format(DEFAULT_DATE_FORMAT)}
                    </td>
                    <td>
                      {item.wmAreaName}
                      {item.wmUnitCode && <span>-{item.wmUnitCode}</span>}
                    </td>
                    <td>{item.quantity || 0}</td>
                  </tr>
                );
              })}
            </tbody>
          )}
        </table>
      </Spin>
      {/* <img
        className="down-icon"
        src={DownImg}
        alt=""
        onClick={handlePageChange}
        style={{ cursor: !pageDisabled ? 'pointer' : 'not-allowed' }}
      /> */}
      <div className="footer">
        <Button onClick={props.onModalClose}>
          {intl.get('hzero.common.button.cancel').d('取消')}
        </Button>
        <Button color="primary" onClick={() => props.onModalSure(data, selectedQty, checkedList)}>
          {intl.get('hzero.common.button.sure').d('确定')}
        </Button>
      </div>
    </Fragment>
  );
};
