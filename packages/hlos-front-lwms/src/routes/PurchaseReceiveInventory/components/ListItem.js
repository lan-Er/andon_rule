import React from 'react';
import ImgUpload from 'hlos-front/lib/components/ImgUpload';
import Icons from 'components/Icons';
import { Checkbox } from 'choerodon-ui';
import { Col, TextField, DataSet, Modal } from 'choerodon-ui/pro';
import { modalDS } from '@/stores/purchaseReceiveInventoryDS';
import TagImg from 'hlos-front/lib/assets/icons/rec-tag.svg';
import LotImg from 'hlos-front/lib/assets/icons/rec-lot.svg';
import NumImg from 'hlos-front/lib/assets/icons/rec-quantity.svg';
import CommonInput from './CommonInput';
import { BUCKET_NAME_WMS } from '../../../../../hlos-front/lib/utils/config';

// const modalFormDS = new DataSet(modalDS());

export default ({
  data = {},
  onCheck,
  onNumChange,
  onControlTypeClick,
  onChangePictures,
  onChangeRemark,
}) => {
  const modalFormDS = new DataSet(modalDS());
  function imgRender() {
    let imgSrc = NumImg;
    if (data.itemControlType === 'LOT') {
      imgSrc = LotImg;
    } else if (data.itemControlType === 'TAG') {
      imgSrc = TagImg;
    }
    return <img src={imgSrc} alt="" onClick={() => onControlTypeClick(data)} />;
  }
  const ImgUploader = () => {
    return (
      <Col span={4} className="upload">
        <Icons type="ziyuan60" size="20" />
        <span>上传图片</span>
      </Col>
    );
  };
  const handleOnChange = (value) => {
    onChangePictures(value);
  };
  const handleRemark = () => {
    modalFormDS.current.set('lineRemark', data.lineRemark);
    const oldRemark = data.lineRemark;
    Modal.open({
      key: 'lwms-purchase-receive-remark-modal',
      title: '备注',
      className: 'lwms-purchase-receive-remark-modal',
      children: (
        <TextField
          dataSet={modalFormDS}
          name="lineRemark"
          style={{ marginTop: 30, height: 48, width: '100%' }}
        />
      ),
      onOk: () => onChangeRemark(modalFormDS.current.get('lineRemark')),
      onCancel: () => modalFormDS.current.set('lineRemark', oldRemark),
    });
  };
  return (
    <div className="lwms-purchase-receive-inventory-list-item">
      <div className="lwms-purchase-receive-inventory-list-item-left">
        <div className="item-left-input">
          <Checkbox checked={data.checked || false} onChange={(e) => onCheck(data, e)} />
          {imgRender()}
          {data.itemControlType === 'QUANTITY' ? (
            <CommonInput
              step={0.000001}
              record={data}
              value={data.inventoryQty1 || 0}
              onChange={onNumChange}
            />
          ) : (
            <span className="qty-block">{data.inventoryQty1 || 0}</span>
          )}
        </div>
        <div className="item-left-qty">
          <p className="qty">
            {data.qcOkQty} {data.uom}
          </p>
          <p>检验合格</p>
        </div>
      </div>
      <div className="lwms-purchase-receive-inventory-list-item-center">
        <div>
          <p>{data.itemDescription}</p>
          <p>{data.itemCode}</p>
        </div>
        <div>
          <p>
            {data.receivedQty || 0} {data.uom}
          </p>
          <p>已接收</p>
        </div>
      </div>
      <div className="lwms-purchase-receive-inventory-list-item-right">
        <div>
          <p>{data.partyName}</p>
          <p>
            {data.poNum}-{data.poLineNum}
          </p>
        </div>
        <div>
          <div className="po-status">{data.ticketLineStatusMeaning}</div>
          <p>{data.demandDate}</p>
        </div>
      </div>
      <div className="lwms-purchase-receive-inventory-list-item-upload">
        <ImgUpload
          pictures={data.pictures}
          bucketName={BUCKET_NAME_WMS}
          directory="purchase-receipt"
          onChange={handleOnChange}
          maxPicture={9}
          childrens={ImgUploader()}
        />
        <a style={{ color: '#1c879c', marginTop: '2px' }} onClick={handleRemark}>
          备注
        </a>
      </div>
    </div>
  );
};
