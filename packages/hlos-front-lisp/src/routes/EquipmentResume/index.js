/**
 * @Description: 设备履历
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-06-04 13:45:47
 * @LastEditors: yu.na
 */

import React, { Fragment, useEffect, useState } from 'react';
import { Row, Col, Button } from 'choerodon-ui/pro';
import { Modal } from 'choerodon-ui';
import intl from 'utils/intl';
import { Header, Content } from 'components/Page';
import { queryList } from '../../services/api';
import FilterModal from './FilterModal';
import descIcon from './assets/product-desc.svg';
import categoryIcon from './assets/category.svg';
import typeIcon from './assets/type.svg';
import locationIcon from './assets/location.svg';
import dieLogo from './assets/die.jpg';
import arrowIcon from './assets/arrow.svg';
import registerIcon from './assets/register.svg';
import endIcon from './assets/end.svg';
import './style.less';

const preCode = 'lisp.dieResume';

export default () => {
  const [equipmentInfo, setEquipmentInfo] = useState({});
  const [detail, setDetail] = useState({});
  const [resumeArr, setResumeArr] = useState([]);
  const [detailVisible, setDetailVisible] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);

  useEffect(() => {
    request();
  }, []);

  function request(value) {
    queryList({
      functionType: 'EQUIPMENT',
      dataType: 'EQUIPMENT',
      attribute2: value,
    }).then((res) => {
      if (res && res.content && res.content[0]) {
        setEquipmentInfo(res.content[0]);
        queryList({
          functionType: 'EQUIPMENT',
          dataType: 'EQUIPMENT_TRACK',
          attribute1: res.content[0].attribute2,
        }).then((res2) => {
          if (res2 && res2.content) {
            const _resumeArr = [];
            res2.content.forEach((item) => {
              const _item = item;

              _item.text = _item.attribute3.charAt(_item.attribute3.length - 1);
              _item.date = _item.attribute6;
              const dateArr = _item.attribute6.split(' ');
              if (dateArr && dateArr.length && dateArr[1]) {
                const date = dateArr[0];
                const time = dateArr[1];
                _item.date = date;
                _item.datetime = time;
              }

              if (_item.attribute3 === '设备点检') {
                _item.color = 'green';
              } else if (_item.attribute3 === '设备维修') {
                _item.color = 'orange';
              } else if (_item.attribute3 === '设备故障') {
                _item.color = 'red';
              }
              if (_resumeArr.length) {
                if (
                  _item.attribute3 === '设备维修' &&
                  _resumeArr.filter(
                    (el) => el.attribute7 === _item.attribute7 && el.attribute3 === '设备维修'
                  ).length
                ) {
                  _resumeArr.forEach((el) => {
                    const _el = el;
                    if (_el.attribute6 > _item.attribute6) {
                      _el.startTime = _item.attribute6;
                      _el.endTime = _el.attribute6;
                    } else {
                      _el.startTime = _el.attribute6;
                      _el.endTime = _item.attribute6;
                    }
                  });
                  return;
                }
                if (_resumeArr[0].attribute6 > _item.attribute6) {
                  _resumeArr.push(_item);
                } else {
                  _resumeArr.unshift(_item);
                }
              } else {
                _resumeArr.unshift(_item);
              }
            });
            setResumeArr(_resumeArr);
          }
        });
      }
    });
  }

  function showFilterModal() {
    setFilterVisible(true);
  }

  function showDetailModal(record) {
    setDetail(record);
    setDetailVisible(true);
  }

  function handleOk() {
    setDetailVisible(false);
  }

  function handleCancel() {
    setDetailVisible(false);
  }

  function handleFilterOk(data) {
    setFilterVisible(false);
    request(data.attribute2);
  }

  function handleFilterCancel() {
    setFilterVisible(false);
  }

  return (
    <Fragment>
      <Header title={intl.get(`${preCode}.view.title.equipmentResume`).d('设备履历')}>
        <Button color="primary" icon="filter2" onClick={showFilterModal}>
          {intl.get(`hzero.c7nUI.Table.filterTitle`).d('筛选')}
        </Button>
      </Header>
      <Content className="isp-equipment-resume">
        <div className="equipment-header">
          <div className="left-picture">
            <img src={dieLogo} alt="" />
          </div>
          <div className="right">
            <p className="title">
              <span>{equipmentInfo.attribute2}</span>
              <span>{equipmentInfo.attribute3}</span>
              <span className="status">{equipmentInfo.attribute5}</span>
            </p>
            <Row className="info">
              <Col span={8} className="info-item">
                <img src={categoryIcon} alt="" />
                <span>组织：{equipmentInfo.attribute1}</span>
              </Col>
              <Col span={16} className="info-item">
                <img src={typeIcon} alt="" />
                <span>设备类型：{equipmentInfo.attribute4}</span>
              </Col>
              <Col span={8} className="info-item">
                <img src={locationIcon} alt="" />
                <span>
                  设备位置：{equipmentInfo.attribute6} - {equipmentInfo.attribute7}
                </span>
              </Col>
              <Col span={16} className="info-item">
                <img src={descIcon} alt="" />
                <span>设备描述：{equipmentInfo.attribute8}</span>
              </Col>
            </Row>
          </div>
        </div>
        <div className="equipment-resume">
          <div className="resume-items">
            {resumeArr.map((item, index) => {
              return (
                <div className={`resume-item ${index === 0 ? 'create' : null}`} key={item.dataId}>
                  <div className="resume-item-left">
                    <span className={`circle-text ${item.color}`}>{item.text}</span>
                    <div className={`date ${item.datetime ? null : 'notime'}`}>
                      <p>{item.date}</p>
                      <p className="time">{item.datetime}</p>
                    </div>
                  </div>
                  <div className="resume-item-right">
                    {
                      // eslint-disable-next-line no-nested-ternary
                      index === 0 ? (
                        <img className="end" src={endIcon} alt="" />
                      ) : (
                        <div className="block-icon" />
                      )
                    }
                    <Row>
                      <Col span={8}>
                        <span className="title">{item.attribute3}</span>
                        <span className="detail" onClick={() => showDetailModal(item)}>
                          详情
                          <img src={arrowIcon} alt="" />
                        </span>
                      </Col>
                      <Col span={16}>
                        <span>
                          负责人：{item.attribute4} - {item.attribute5}
                        </span>
                      </Col>
                    </Row>
                  </div>
                </div>
              );
            })}
            <div className="resume-item create">
              <div className="resume-item-left">
                <span className="circle-text blue">建</span>
                <span className="date">2019-01-01</span>
              </div>
              <div className="resume-item-right">
                <img className="register" src={registerIcon} alt="" />
                <Row>
                  <Col span={8}>
                    <span className="title">设备创建</span>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        </div>
        <Modal
          wrapClassName="isp-equipment-resume-detail-modal"
          title="设备履历明细"
          visible={detailVisible}
          onCancel={handleCancel}
          footer={null}
          width={456}
          closable
          destroyOnClose
        >
          <Row className="detail">
            <Col span={12}>设备编码：{detail.attribute1}</Col>
            <Col span={12}>执行类型：{detail.attribute3}</Col>
            <Col span={12}>设备名称：{detail.attribute2}</Col>
            <Col span={12}>
              执行人员：{detail.attribute4} - {detail.attribute5}
            </Col>
            {detail.attribute3 === '设备点检' && <Col span={12}>执行时间：{detail.attribute6}</Col>}
            {detail.attribute3 === '设备点检' && <Col span={12}>执行结果：{detail.attribute8}</Col>}
            {detail.startTime && <Col span={12}>开始时间：{detail.startTime}</Col>}
            {detail.endTime && <Col span={12}>结束时间：{detail.endTime}</Col>}
            <Col span={12}>关联单据：{detail.attribute7}</Col>
          </Row>
          <div className="footer">
            <Button color="primary" onClick={handleOk}>
              {intl.get(`hzero.c7nProUI.Modal.ok`).d('确定')}
            </Button>
          </div>
        </Modal>
        <FilterModal visible={filterVisible} onOk={handleFilterOk} onCancel={handleFilterCancel} />
      </Content>
    </Fragment>
  );
};
