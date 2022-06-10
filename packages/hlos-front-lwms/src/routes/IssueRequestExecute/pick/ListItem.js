import React, { useEffect, useState } from 'react';
import { Tooltip, NumberField } from 'choerodon-ui/pro';
// import moment from 'moment';
import Lov from 'components/Lov';
import TagImg from 'hlos-front/lib/assets/icons/rec-tag.svg';
import NumImg from 'hlos-front/lib/assets/icons/rec-quantity.svg';
import LotImg from 'hlos-front/lib/assets/icons/rec-lot.svg';
// import { DEFAULT_DATE_FORMAT } from 'utils/constants';

export default ({
  data,
  headerData,
  inputDisabled,
  handleItemClick,
  handleNumChange,
  onWarehouseChange,
  onWmAreaChange,
}) => {
  const [warehouseObj, setWarehouseObj] = useState({});
  const [wmAreaObj, setWmAreaObj] = useState({});

  useEffect(() => {
    if (data.warehouseId) {
      setWarehouseObj({
        warehouseId: data.warehouseId,
        warehouseCode: data.warehouseCode,
        warehouseName: data.warehouseName,
      });
    } else {
      setWmAreaObj({});
    }
    if (data.wmAreaId) {
      setWmAreaObj({
        wmAreaId: data.wmAreaId,
        wmAreaCode: data.wmAreaCode,
        wmAreaName: data.wmAreaName,
      });
    } else {
      setWmAreaObj({});
    }
  }, [data]);

  function imgEle(el) {
    if (el.itemControlType === 'QUANTITY') {
      return <img src={NumImg} alt="" />;
    } else if (el.itemControlType === 'TAG') {
      return <img src={TagImg} alt="" onClick={() => handleItemClick(el)} />;
    }
    return <img src={LotImg} alt="" onClick={() => handleItemClick(el)} />;
  }

  function numberRender(rec) {
    if (inputDisabled) {
      return rec.pickedQty;
    }
    if (rec.pickedQty1 !== undefined && rec.pickedQty1 !== null) {
      return rec.pickedQty1;
    }
    return rec.applyQty;
  }

  return (
    <div className={`list-item ${data.active ? 'active' : null}`}>
      <div className="item-input">
        {imgEle(data)}
        {data.itemControlType === 'QUANTITY' ? (
          <NumberField
            // step={0.000001}
            // record={data}
            value={numberRender(data)}
            disabled={inputDisabled}
            onChange={(val) => handleNumChange(val, data)}
          />
        ) : (
          <span className="total">
            {inputDisabled ? data.pickedQty || 0 : data.pickedQty1 || 0}
          </span>
        )}
        <Tooltip title={data.applyQty} placement="top">
          <span className="apply">{data.applyQty}</span>
        </Tooltip>
        <span className="uom">{data.uomName}</span>
      </div>
      {status === 'RELEASED' && (
        <div className="item-pick">
          <p>
            <span className="num">{data.pickedQty || 0}</span>
            <span className="uom">{data.uomName}</span>
          </p>
          <p>已拣料</p>
        </div>
      )}
      <div className="item-main">
        <Tooltip placement="top" title={data.itemDescription}>
          <p>{data.itemDescription}</p>
        </Tooltip>
        <Tooltip placement="bottom" title={data.itemCode}>
          <p>{data.itemCode}</p>
        </Tooltip>
      </div>
      {headerData.requestStatus === 'RELEASED' ? (
        <div className="item-right">
          <Lov
            className="house-info"
            style={{ marginRight: '8px' }}
            value={warehouseObj?.warehouseId}
            textValue={warehouseObj?.warehouseName}
            code="LMDS.WAREHOUSE"
            queryParams={{
              organizationId: headerData.organizationId,
            }}
            onChange={(val, item) => onWarehouseChange(item, data)}
            allowClear={false}
          />
          <Lov
            className="area-info"
            value={wmAreaObj?.wmAreaId}
            textValue={wmAreaObj?.wmAreaName}
            code="LMDS.WM_AREA"
            readOnly={!warehouseObj.warehouseId}
            queryParams={{
              warehouseId: warehouseObj.warehouseId,
            }}
            onChange={(val, item) => onWmAreaChange(item, data)}
            allowClear={false}
          />
        </div>
      ) : (
        ''
      )}
      {/* <div>
          <p className="status">{data.requestLineStatusMeaning}</p>
          <p>{moment(headerData.planDemandDate).format(DEFAULT_DATE_FORMAT)}</p>
        </div> */}
    </div>
  );
};
