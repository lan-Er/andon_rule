/*
 * @Author: chunyan.liang <chunyan.liang@hand-china.com>
 * @Date: 2020-09-09 12:09:05
 * @LastEditTime: 2020-10-20 11:11:52
 * @Description:
 */
import React, { useState } from 'react';
import {
  NumberField,
  Row,
  Col,
  TextField,
  Form,
  DateTimePicker,
  CheckBox,
  Tooltip,
  DataSet,
  Modal,
} from 'choerodon-ui/pro';
import uuidv4 from 'uuid/v4';
import notification from 'utils/notification';
import ImgUpload from 'hlos-front/lib/components/ImgUpload';
import Icons from 'components/Icons';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';

import quantityIcon from 'hlos-front/lib/assets/icons/rec-quantity.svg';
import lotIcon from 'hlos-front/lib/assets/icons/rec-lot.svg';
import tagIcon from 'hlos-front/lib/assets/icons/rec-tag.svg';
import openIcon from 'hlos-front/lib/assets/icons/up-blue.svg';
import closeIcon from 'hlos-front/lib/assets/icons/down-blue.svg';
import modalDocument from 'hlos-front/lib/assets/icons/odd-number.svg';
import modalSupplier from 'hlos-front/lib/assets/icons/supplier-card.svg';
import { modalDS } from '../../../stores/arrivalReceptionDS.js';
import { BUCKET_NAME_WMS } from '../../../../../hlos-front/lib/utils/config';

// const props.modalLineDS = new DataSet(lineList());
const modalFormDS = new DataSet(modalDS());

const Line = (props) => {
  let icon = tagIcon;
  switch (props.itemControlType) {
    case 'QUANTITY':
      icon = quantityIcon;
      break;
    case 'LOT':
      icon = lotIcon;
      break;
    case 'TAG':
      icon = tagIcon;
      break;
    default:
      break;
  }

  const handleChange = (value) => {
    props.onChecked(value);
  };
  const handleChangeQuantity = (value) => {
    props.onChangeQuantity(value);
  };
  const handleOpenModal = () => {
    props.handleOpenModal(props);
  };
  const ImgUploader = () => {
    return (
      <Col span={4} className="upload">
        <Icons type="ziyuan60" size="20" />
        <span>上传图片</span>
      </Col>
    );
  };
  const handleOnChange = (data) => {
    props.onChangePictures(data);
  };
  const handleRemark = () => {
    modalFormDS.current.set('lineRemark', props.lineRemark);
    const oldRemark = props.lineRemark;
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
      onOk: () => props.onChangeRemark(modalFormDS.current.get('lineRemark')),
      onCancel: () => modalFormDS.current.set('lineRemark', oldRemark),
    });
  };
  return (
    <div
      className={`table-line ${props.even ? 'table-line-even' : 'table-line-odd'} ${
        props.checked ? 'table-line-height' : ''
      }`}
    >
      <Row>
        <Col span={1} className="table-col">
          <CheckBox checked={props.checkedFlag} onChange={handleChange} />
        </Col>
        <Col span={2} className="table-col">
          <img src={icon} alt="" onClick={handleOpenModal} />
        </Col>
        <Col span={6} className="table-col input-number">
          <div className="arrival-reception-common-input">
            <NumberField
              value={props.receivedQty || 0}
              step={1}
              disabled={props.itemControlType !== 'QUANTITY'}
              onChange={handleChangeQuantity}
            />
          </div>
          {props.uomName}
        </Col>
        <Col span={5} className="table-col">
          <div className="material-name">
            <span>{props.description}</span>
            <span>{props.itemCode}</span>
          </div>
        </Col>
        <Col span={5} className="table-col">
          <div className="material-name">
            <span>{props.partyObj.partyName}</span>
            <span>{props.partyDocumentNumber}</span>
          </div>
        </Col>
        <Col span={5} className="table-col">
          <div className="imgRemark">
            <ImgUpload
              pictures={props.pictures}
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
        </Col>
      </Row>
    </div>
  );
};

const ModalLine = (props) => {
  const handleModalSingleCheck = (value) => {
    props.handleModalSingleCheck(value);
  };

  return (
    <div
      className={`table-line ${props.even ? 'table-line-even' : 'table-line-odd'} ${
        props.checked ? 'table-line-height' : ''
      }`}
    >
      <Row>
        <Col span={1} className="table-col">
          <CheckBox checked={props.checkedFlag} onChange={handleModalSingleCheck} />
        </Col>
        <Col span={5} className="table-col">
          <div className="material-name">
            <span className="span-ellipsis">{props.tagCode || props.lotNumber}</span>
            <span className="span-ellipsis font-grey">{props.partyLotNumber}</span>
          </div>
        </Col>
        <Col span={6} className="table-col">
          <div className="material-name">
            <span className="span-ellipsis">{props.manufacturer}</span>
            <span className="span-ellipsis font-grey">{props.material}</span>
          </div>
        </Col>
        <Col span={8} className="table-col">
          <div className="material-name">
            <Tooltip title={`${props.materialSupplier || ''} - ${props.partyLotNumber || ''}`}>
              <span className="span-ellipsis">
                {`${props.materialSupplier || ''} - ${props.partyLotNumber || ''}`}
              </span>
            </Tooltip>
            <Tooltip
              title={`${props.madeDate ? props.madeDate.format(DEFAULT_DATETIME_FORMAT) : ''} - ${
                props.expireDate ? props.expireDate.format(DEFAULT_DATETIME_FORMAT) : ''
              }`}
            >
              <span className="span-ellipsis font-grey">
                {`${props.madeDate ? props.madeDate.format(DEFAULT_DATETIME_FORMAT) : ''} - ${
                  props.expireDate ? props.expireDate.format(DEFAULT_DATETIME_FORMAT) : ''
                }`}
              </span>
            </Tooltip>
          </div>
        </Col>
        <Col span={4} className="table-col">
          <div className="material-number">{`${props.receivedQty} ${props.uom}`}</div>
        </Col>
      </Row>
    </div>
  );
};

const ModalChildren = (props) => {
  const checkedList = props.record.receivedList.filter((v) => v.checkedFlag);
  let checkedQua = 0;
  let totalQua = 0;
  checkedList.forEach((val) => {
    checkedQua += parseFloat(val.receivedQty);
    return checkedQua;
  });
  props.record.receivedList.forEach((val) => {
    totalQua += parseFloat(val.receivedQty);
    return totalQua;
  });

  const { itemControlType } = props.record;
  props.modalLineDS.current.reset();
  props.modalLineDS.current.set('itemControlType', itemControlType);

  const [openFlag, setOpenFlag] = useState(false);

  const changeOpenFlag = () => {
    setOpenFlag(() => {
      return !openFlag;
    });
  };

  const handleModalCodeChange = async () => {
    if (!props.modalLineDS.current.get('receivedQty')) {
      notification.warning({
        message: '请先输入数量!',
      });
      return;
    }
    props.handleModalCodeChange(props.modalLineDS);
    props.modalLineDS.current.set('tagCode', '');
    props.modalLineDS.current.set('lotNumber', '');
  };

  // 全选
  const handleModalCheckAll = (value) => {
    props.handleModalCheckAll(value);
  };

  const handleModalSingleCheck = (value, index) => {
    props.handleModalSingleCheck(value, index);
  };

  return (
    <div className="arrival-reception-modal-box">
      <div className="header-message">
        <Row>
          <Col span={8} className="ds-ai-center">
            <img src={modalDocument} alt="" />
            {props.partyObj ? props.partyObj.partyName : ''}
          </Col>
          <Col span={8} className="ds-ai-center">
            <img src={modalSupplier} alt="" />
            {props.partyDocumentNumber}
          </Col>
        </Row>
      </div>
      <div className="search-list">
        <Form dataSet={props.modalLineDS} labelLayout="placeholder" columns={3}>
          <TextField
            colSpan={1}
            name={itemControlType === 'LOT' ? 'lotNumber' : 'tagCode'}
            label={itemControlType === 'LOT' ? '批次号' : '标签号'}
            onChange={handleModalCodeChange}
          />
          <NumberField colSpan={1} name="receivedQty" label="数量" />
          <TextField colSpan={1} name="partyLotNumber" label="供应商批次" />
        </Form>
        {openFlag ? (
          <Form dataSet={props.modalLineDS} labelLayout="placeholder" columns={3}>
            <DateTimePicker colSpan={1} name="madeDate" label="制造日期" />
            <DateTimePicker colSpan={1} name="expireDate" label="失效日期" />
            <TextField colSpan={1} name="manufacturer" label="制造商" />
            <TextField colSpan={1} name="material" label="材料" />
            <TextField colSpan={1} name="materialSupplier" label="材料供应商" />
            <TextField colSpan={1} name="materialLotNumber" label="材料批次" />
            {openFlag && (
              <div colSpan={3} className="flag-icon-box">
                <img
                  className="flag-icon"
                  src={openFlag ? openIcon : closeIcon}
                  alt=""
                  onClick={changeOpenFlag}
                />
              </div>
            )}
          </Form>
        ) : (
          <div className="flag-icon-box">
            <img
              className="flag-icon"
              src={openFlag ? openIcon : closeIcon}
              alt=""
              onClick={changeOpenFlag}
            />
          </div>
        )}
      </div>
      <div className="table-list">
        <div className="table-list-header">
          <Col span={1} className="table-col">
            <CheckBox checked={props.record.checkedFlag} onChange={handleModalCheckAll} />
          </Col>
          <Col span={5} className="table-col">
            <div>
              {itemControlType === 'TAG' ? '标签' : '批次'}数：
              {`${checkedList.length}/${props.record.receivedList.length}`}
            </div>
          </Col>
          <Col span={6} className="table-col">
            <div>{itemControlType === 'TAG' ? '标签' : '批次'}信息</div>
          </Col>
          <Col span={8} className="table-col" />
          <Col span={4} className="table-col">
            <div>
              {`${checkedQua || 0}/${totalQua || 0}`} {`${props.record.uomName}`}
            </div>
          </Col>
        </div>
        {props.record.receivedList.length
          ? props.record.receivedList.map((v, index) => {
              const even = index % 2 === 1 ? 'even' : null;
              return (
                <ModalLine
                  key={uuidv4()}
                  even={even}
                  {...v}
                  uom={props.record.uomName}
                  handleModalSingleCheck={(value) => handleModalSingleCheck(value, index)}
                />
              );
            })
          : null}
      </div>
    </div>
  );
};

export { Line, ModalChildren };
