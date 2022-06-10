/**
 * @Description: 领料执行--捡料modal
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-07-13 15:40:08
 * @LastEditors: yu.na
 */

import React, { Fragment, useState, useEffect } from 'react';
import { TextField, Spin, Button, NumberField, Table } from 'choerodon-ui/pro';
import { Tooltip } from 'choerodon-ui';
import { getResponse } from 'utils/utils';
import intl from 'utils/intl';
import { accAdd } from '@/utils/renderer';
import OrderImg from 'hlos-front/lib/assets/icons/odd-number.svg';
import LocationImg from 'hlos-front/lib/assets/icons/location.svg';
import NumImg from 'hlos-front/lib/assets/icons/quantity.svg';
import ScanImg from 'hlos-front/lib/assets/icons/scan.svg';

const intlPrefix = 'lwms.issueRequestExecute';

export default (props) => {
  const { data = {}, headerData = {}, modalTableDS = {} } = props;
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    handleQuery();
  }, []);

  async function handleQuery(inputValue) {
    let res = {};
    setLoading(true);
    const {
      itemControlType,
      itemId,
      itemCode,
      warehouseId,
      wmAreaId,
      applyQty,
      pickedQty,
      requestPickDetailList,
    } = data;
    let _adviseFlag = null;
    let _useAdvise = false;
    const arr = ['ADVISE', 'ENFORCE'];
    if (
      data.pickRule &&
      JSON.parse(data.pickRule) &&
      arr.includes(JSON.parse(data.pickRule).pick_advise)
    ) {
      _useAdvise = true;
      if (JSON.parse(data.pickRule).pick_advise === 'ENFORCE') {
        _adviseFlag = 1;
      }
    }
    modalTableDS.setQueryParameter('itemId', itemId);
    modalTableDS.setQueryParameter('itemCode', itemCode);
    modalTableDS.setQueryParameter('itemControlType', itemControlType);
    modalTableDS.setQueryParameter('organizationId', headerData.organizationId);
    modalTableDS.setQueryParameter('warehouseId', warehouseId);
    modalTableDS.setQueryParameter('wmAreaId', wmAreaId);
    modalTableDS.setQueryParameter('page', -1);
    modalTableDS.setQueryParameter(itemControlType === 'LOT' ? 'lotNumber' : 'tagCode', inputValue);
    modalTableDS.setQueryParameter('demandQty', (applyQty || 0) - (pickedQty || 0));
    modalTableDS.setQueryParameter('useAdvise', _useAdvise);
    modalTableDS.setQueryParameter('advisedFlag', _adviseFlag);
    res = await modalTableDS.query();
    if (getResponse(res) && res && res.content) {
      const resArr = res.content || res;
      if (resArr.length) {
        if (requestPickDetailList && requestPickDetailList.length) {
          // 上次选中结果
          requestPickDetailList.forEach((receive) => {
            let selectIndex = -1;
            if (itemControlType === 'LOT') {
              selectIndex = resArr.findIndex((i) => i.lotId === receive.lotId);
              modalTableDS.get(selectIndex).set('advisedQty', receive.advisedQty || 0);
              modalTableDS.get(selectIndex).set('pickedQty', receive.pickedQty || 0);
            } else {
              selectIndex = resArr.findIndex((i) => i.tagId === receive.tagId);
            }
            modalTableDS.select(selectIndex);
          });
        } else {
          // 默认选中结果
          resArr.forEach((item, index) => {
            if (item.advisedFlag === '1') {
              modalTableDS.select(index);
            }
          });
        }
      }
      setLoading(false);
    } else {
      setLoading(false);
    }
  }
  async function handleSearch(e) {
    e.persist();
    if (e.keyCode === 13) {
      await handleQuery(e.target.value);
    }
  }

  function getTableColumns(type, uom) {
    function handleSetCount(dataSet, rec, value) {
      const maxVal = rec.get('initialQty') || rec.get('quantity') || 0;
      const formattedVal = value;
      if (!isNaN(formattedVal)) {
        if (formattedVal < maxVal || formattedVal === maxVal) {
          rec.set('advisedQty', formattedVal);
          rec.set('pickedQty', formattedVal);
          if (formattedVal === 0) {
            dataSet.unSelect(rec);
          } else {
            dataSet.select(rec);
          }
        }
      } else {
        rec.set('pickedQty', 0);
        rec.set('advisedQty', 0);
        dataSet.unSelect(rec);
      }
    }
    const tableColumns = [
      {
        name: 'tagOrLotNumber',
        editor: false,
        width: 300,
        renderer({ record }) {
          return (
            <div className="first-column">
              {record.get(type === 'TAG' ? 'tagCode' : 'lotNumber')}
            </div>
          );
        },
        header: (dataSet) => {
          const partialContent =
            type === 'TAG'
              ? intl.get(`${intlPrefix}.view.title.tagCount`).d('标签数')
              : intl.get(`${intlPrefix}.view.title.lotCount`).d('批次数');
          return (
            <Fragment>
              <span>{`${partialContent}：${dataSet.selected.length} / ${dataSet.records.length}`}</span>
            </Fragment>
          );
        },
      },
      {
        name: 'count',
        editor: false,
        align: 'left',
        width: 250,
        renderer({ record, dataSet }) {
          return type === 'TAG' ? (
            <span>{`${record.get('quantity')} ${uom || ''}`}</span>
          ) : (
            <div className="custom-counter">
              <NumberField
                className="counter-content"
                value={record.get('advisedQty') || 0}
                onChange={(value) => handleSetCount(dataSet, record, value)}
              />
            </div>
          );
        },
        header: (dataSet) => {
          const totalCount = dataSet.records.reduce((acc, rec) => {
            return accAdd(acc, rec.get('initialQty') || rec.get('quantity') || 0);
          }, 0);
          const selectedCount = dataSet.selected.reduce((acc, rec) => {
            return accAdd(acc, (type === 'LOT' ? rec.get('advisedQty') : rec.get('quantity')) || 0);
          }, 0);
          return (
            <Fragment>
              <span>{`${selectedCount} / ${totalCount} ${uom || ''}`}</span>
            </Fragment>
          );
        },
      },
      {
        name: 'wmAreaName',
        editor: false,
        width: 250,
        header: <span>{intl.get(`${intlPrefix}.view.message.invalidateDate`).d('库位')}</span>,
        renderer({ record }) {
          return (
            <div className="first-column">
              {record.get('wmAreaName')} {record.get('wmUnitCode')}
            </div>
          );
        },
      },
    ];
    // 批次明细展示现有量
    if (type === 'LOT') {
      tableColumns.push(
        {
          name: 'quantity',
          align: 'left',
          editor: false,
          width: 200,
          header: <span>{intl.get(`${intlPrefix}.view.message.invalidateDate`).d('现有量')}</span>,
          renderer({ record }) {
            return <div className="first-column">{record.get('quantity')}</div>;
          },
        },
        {
          name: 'receivedDate',
          editor: false,
          width: 200,
          header: (
            <span>{intl.get(`${intlPrefix}.view.message.invalidateDate`).d('接收时间')}</span>
          ),
        }
      );
    } else {
      tableColumns.push(
        {
          name: 'lotNumber',
          editor: false,
          width: 200,
          header: <span>{intl.get(`${intlPrefix}.view.message.invalidateDate`).d('批次')}</span>,
          renderer({ record }) {
            return <div className="first-column">{record.get('lotNumber')}</div>;
          },
        },
        {
          name: 'assignedTime',
          editor: false,
          width: 200,
          header: (
            <span>{intl.get(`${intlPrefix}.view.message.invalidateDate`).d('接收时间')}</span>
          ),
        }
      );
    }
    tableColumns.push(
      {
        name: 'expireDate',
        editor: false,
        width: 200,
        header: <span>{intl.get(`${intlPrefix}.view.message.invalidateDate`).d('失效时间')}</span>,
      },
      {
        name: 'madeDate',
        editor: false,
        width: 200,
        header: <span>{intl.get(`${intlPrefix}.view.message.invalidateDate`).d('制造时间')}</span>,
      }
    );
    return tableColumns;
  }

  return (
    <div className="pick-modal">
      <div className="modal-header">
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
      </div>
      <div className="modal-content">
        <Spin spinning={isLoading}>
          <Table
            className="modal-table"
            dataSet={modalTableDS}
            columns={getTableColumns(props.type, data.uomName)}
            rowHeight="auto"
          />
        </Spin>
      </div>
      <div className="footer">
        <Button onClick={props.onModalClose}>
          {intl.get('hzero.common.button.cancel').d('取消')}
        </Button>
        <Button color="primary" onClick={() => props.onModalSure(data)}>
          {intl.get('hzero.common.button.sure').d('确定')}
        </Button>
      </div>
    </div>
  );
};
