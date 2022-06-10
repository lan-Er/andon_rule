import React from 'react';
import { Tooltip } from 'choerodon-ui/pro';
import { Checkbox } from 'choerodon-ui';
import CommonInput from 'hlos-front/lib/components/CommonInput';
import TagImg from 'hlos-front/lib/assets/icons/rec-tag.svg';
import LotImg from 'hlos-front/lib/assets/icons/rec-lot.svg';
import NumImg from 'hlos-front/lib/assets/icons/rec-quantity.svg';

export default ({ data = {}, onCheck, onNumChange, onControlTypeClick }) => {
  function imgRender() {
    let imgSrc = NumImg;
    if (data.itemControlType === 'LOT') {
      imgSrc = LotImg;
    } else if (data.itemControlType === 'TAG') {
      imgSrc = TagImg;
    }
    return <img src={imgSrc} alt="" onClick={() => onControlTypeClick(data)} />;
  }
  return (
    <div className="lwms-finished-product-inventory-list-item">
      <div className="item-left">
        <Checkbox checked={data.checked || false} onChange={(e) => onCheck(data, e)} />
        {imgRender()}
        {data.itemControlType === 'QUANTITY' ? (
          <CommonInput
            step={0.000001}
            record={data}
            value={data.productionWmQty || 0}
            onChange={onNumChange}
          />
        ) : (
          <span className="qty-block">{data.productionWmQty || 0}</span>
        )}
        <Tooltip title={data.onhandQty}>
          <span className="on-hand-qty">{data.onhandQty}</span>
        </Tooltip>
        <span>{data.uomName}</span>
      </div>
      <div className="item-center">
        <p>{data.itemDescription}</p>
        <p>{data.itemCode}</p>
      </div>
      {/* {data.itemControlType === 'QUANTITY' && (
        <div className="item-right">
          {data.warehouseName}
          {data.wmAreaName && <span> -{data.wmAreaName}</span>}
          {data.wmUnitCode && <span> -{data.wmUnitCode}</span>}
        </div>
      )} */}
    </div>
  );
};
