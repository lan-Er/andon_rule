import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'dva';
import { TextField, Button, NumberField } from 'choerodon-ui/pro';
import { Checkbox, Icon } from 'choerodon-ui';
import intl from 'utils/intl';
import notification from 'utils/notification';
import SupplierIcon from 'hlos-front/lib/assets/icons/supplier-card.svg';
import OrderIcon from 'hlos-front/lib/assets/icons/odd-number.svg';

function InventoryModal(props) {
  const { receivedList } = props;
  const [modalList, setModalList] = useState(receivedList || []);
  const [allChecked, changeAllChecked] = useState(false);
  const [selectedQty, setSelectedQty] = useState(0);

  useEffect(() => {
    let qty = 0;
    modalList.forEach((i) => {
      if (i.checked) {
        if (props.controlType === 'TAG') {
          qty += i.reservationQty;
        } else {
          qty += i.inventoryQty || 0;
        }
      }
    });
    setSelectedQty(qty);
    changeAllChecked(modalList.length ? modalList.every((i) => i.checked) : false);
  });

  const handleInputChange = async (e, type) => {
    e.persist();
    if (e.keyCode === 13) {
      let index;
      let title;
      let params = {
        documentId: props.ticketId,
        documentLineId: props.ticketLineId,
        page: -1,
      };
      if (type === 'LOT') {
        params = {
          ...params,
          lotNumber: e.target.value,
          lotFlag: true,
        };
        title = '批次';
        index = modalList.findIndex((i) => i.lotNumber === e.target.value);
      } else if (type === 'TAG') {
        params = {
          ...params,
          tagCode: e.target.value,
        };

        title = '标签';
        index = modalList.findIndex((i) => i.tagCode === e.target.value);
      }
      if (index !== -1) {
        const list = modalList.slice();
        if (list[index].checked) {
          notification.warning({
            message: `已取消选中${title}：${e.target.value}`,
          });
        }
        list[index].checked = !list[index].checked;
        setModalList(list);
        return;
      }
      const res = await props.dispatch({
        type: 'purchaseReceiveInventory/updateDocReservation',
        payload: params,
      });
      if (res && Array.isArray(res) && res[0]) {
        const _res = res.slice();
        _res[0].checked = true;

        setModalList(_res);
      }
    }
  };

  const handleItemCheck = (data, e) => {
    const index = modalList.findIndex((i) => i.reservationId === data.reservationId);
    const list = [];
    let qty = 0;
    modalList.forEach((i, idx) => {
      if (idx === index) {
        list.push({
          ...i,
          checked: e.target.checked,
        });
      } else {
        list.push(i);
      }
    });
    const _allChecked = list.every((i) => i.checked);
    const selectedList = list.filter((i) => i.checked);
    selectedList.forEach((i) => {
      if (props.controlType === 'TAG') {
        qty += i.reservationQty;
      } else {
        qty += i.inventoryQty || 0;
      }
    });
    changeAllChecked(_allChecked);
    setModalList(list);
    setSelectedQty(qty);
  };

  const handleAllCheck = (e) => {
    const list = modalList.slice();
    let qty = 0;
    list.forEach((i) => {
      const _i = i;
      _i.checked = e.target.checked;
      if (props.controlType === 'TAG') {
        qty += i.reservationQty;
      } else {
        qty += i.inventoryQty || 0;
      }
    });
    changeAllChecked(e.target.checked);
    setModalList(list);
    setSelectedQty(qty);
  };

  const handleQtyChange = (val, data) => {
    const index = modalList.findIndex((i) => i.reservationId === data.reservationId);
    const list = [...modalList];
    list.splice(index, 1, {
      ...data,
      inventoryQty: val,
      checked: true,
    });

    setModalList(list);
    let qty = 0;
    list.forEach((i) => {
      if (i.checked) {
        qty += i.inventoryQty;
      }
    });
    setSelectedQty(qty);
  };

  return (
    <Fragment>
      <Icon type="close" onClick={props.onModalCancel} />
      <div className="order-info">
        <div>
          <img src={SupplierIcon} alt="" />
          <p>{props.partyName}</p>
        </div>
        <div>
          <img src={OrderIcon} alt="" />
          <p>
            {props.poNum}-{props.poLineNum}
          </p>
        </div>
        {props.controlType === 'TAG' && (
          <TextField placeholder="标签号" onKeyDown={(e) => handleInputChange(e, 'TAG')} />
        )}
        {props.controlType === 'LOT' && (
          <TextField placeholder="批次号" onKeyDown={(e) => handleInputChange(e, 'LOT')} />
        )}
      </div>
      <div className="lwms-purchase-receive-inventory-modal-list">
        <table>
          <thead>
            <tr>
              <th>
                <Checkbox checked={allChecked} onChange={handleAllCheck} />
                {props.controlType === 'LOT' ? '批次' : '标签'}数：
                {modalList.filter((i) => i.checked).length}/{props.totalElements}
              </th>
              <th>{props.controlType === 'LOT' ? '批次' : '标签'}信息</th>
              <th>
                {selectedQty}/{props.totalNum}
              </th>
            </tr>
          </thead>
          <tbody>
            {modalList.map((i) => {
              return (
                <tr key={i.reservationId}>
                  <td className="td-left">
                    <Checkbox checked={i.checked} onChange={(e) => handleItemCheck(i, e)} />
                    <div>
                      <p>{props.controlType === 'LOT' ? i.lotNumber : i.tagCode}</p>
                      <p>{props.controlType === 'LOT' ? i.partyLotNumber : i.outerTagCode}</p>
                    </div>
                  </td>
                  <td className="td-center">
                    <div>
                      <p>{props.controlType === 'LOT' ? i.manufactuer : ''}</p>
                      <p>{props.controlType === 'LOT' ? i.material : ''}</p>
                    </div>
                    <div>
                      <p>
                        {props.controlType === 'LOT'
                          ? `${i.materialSupplier || ''}-${i.materialLotNumber || ''}`
                          : ''}
                      </p>
                      <p>
                        {props.controlType === 'LOT'
                          ? `${i.madeDate || ''}-${i.expireDate || ''}`
                          : ''}
                      </p>
                    </div>
                  </td>
                  <td className={`td-right ${props.controlType}`}>
                    {props.controlType === 'LOT' && (
                      <NumberField
                        value={i.inventoryQty}
                        onChange={(val) => handleQtyChange(val, i)}
                      />
                    )}
                    <span>
                      {i.reservationQty}
                      {i.uom}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="lwms-purchase-receive-inventory-modal-footer">
        <Button onClick={props.onModalCancel}>
          {intl.get('hzero.common.button.cancel').d('取消')}
        </Button>
        <Button
          color="primary"
          onClick={() => props.onModalOk(props.ticketLineId, selectedQty, modalList)}
        >
          {intl.get('hzero.common.button.sure').d('确定')}
        </Button>
      </div>
    </Fragment>
  );
}

export default connect(({ purchaseReceiveInventory }) => ({
  modalList: purchaseReceiveInventory?.modalList || [],
  totalNum: purchaseReceiveInventory?.totalNum || 0,
  totalElements: purchaseReceiveInventory?.totalElements || 0,
}))(InventoryModal);
