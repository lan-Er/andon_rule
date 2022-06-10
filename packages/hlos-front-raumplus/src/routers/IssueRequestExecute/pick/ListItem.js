import React, { useMemo, useEffect } from 'react';
import { Tooltip, Lov, DataSet, NumberField } from 'choerodon-ui/pro';
import { Popover } from 'choerodon-ui';
import Icons from 'components/Icons';
// import moment from 'moment';
import { LineDS } from '@/stores/issueRequestExecuteDS';
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
  defaultWmAreaObj,
}) => {
  const lineDS = useMemo(() => new DataSet(LineDS()), []);

  useEffect(() => {
    // if (data.warehouseId) {
    if (defaultWmAreaObj && defaultWmAreaObj.warehouseId) {
      lineDS.current.set('warehouseObj', {
        // warehouseId: data.warehouseId,
        // warehouseCode: data.warehouseCode,
        // warehouseName: data.warehouseName,
        warehouseId: defaultWmAreaObj.warehouseId,
        warehouseCode: defaultWmAreaObj.warehouseCode,
        warehouseName: defaultWmAreaObj.warehouseName,
      });
    }
    if (defaultWmAreaObj && defaultWmAreaObj.wmAreaId) {
      lineDS.current.set('wmAreaObj', {
        // wmAreaId: data.wmAreaId,
        // wmAreaCode: data.wmAreaCode,
        // wmAreaName: data.wmAreaName,
        wmAreaId: defaultWmAreaObj.wmAreaId,
        wmAreaCode: defaultWmAreaObj.wmAreaCode,
        wmAreaName: defaultWmAreaObj.wmAreaName,
      });
    }
    if (headerData && headerData.organizationId) {
      lineDS.current.set('organizationId', headerData.organizationId);
    }
  }, []);

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

  function moreContent() {
    return (
      <div className="lwms-issue-request-execute-content-more-modal">
        <Lov dataSet={lineDS} name="wmAreaObj" onChange={(rec) => onWmAreaChange(rec, data)} />
      </div>
    );
  }

  return (
    <div className={`list-item ${data.active ? 'active' : null}`}>
      <div className="item-input">
        {imgEle(data)}
        {data.itemControlType === 'QUANTITY' ? (
          <NumberField
            // step={0.000001}
            record={data}
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
      <div className="item-right">
        <Lov
          dataSet={lineDS}
          name="warehouseObj"
          onChange={(rec) => onWarehouseChange(rec, data)}
        />
        <div className="more">
          <Popover content={moreContent()} trigger="click" placement="topRight">
            <Icons type="more1" size={32} color="#1c879c" />
          </Popover>
        </div>
        {/* <div>
          <p className="status">{data.requestLineStatusMeaning}</p>
          <p>{moment(headerData.planDemandDate).format(DEFAULT_DATE_FORMAT)}</p>
        </div> */}
      </div>
    </div>
  );
};
