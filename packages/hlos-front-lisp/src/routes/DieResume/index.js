/**
 * @Description: 模具履历
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-06-04 13:45:47
 * @LastEditors: yu.na
 */

import React, { Fragment, useEffect, useState } from 'react';
import { Row, Col, Button } from 'choerodon-ui/pro';
import { Modal, Radio } from 'choerodon-ui';
import intl from 'utils/intl';
import { Header, Content } from 'components/Page';
import { queryList } from '../../services/api';
import FilterModal from './FilterModal';
import descIcon from './assets/product-desc.svg';
import categoryIcon from './assets/die-category.svg';
import typeIcon from './assets/die-type.svg';
import locationIcon from './assets/location.svg';
import dieLogo from './assets/die.jpg';
import arrowIcon from './assets/arrow.svg';
import registerIcon from './assets/register.svg';
import endIcon from './assets/end.svg';
import './style.less';

const preCode = 'lisp.dieResume';
const RadioGroup = Radio.Group;

export default (props) => {
  const [dieInfo, setDieInfo] = useState({});
  const [resumeArr, setResumeArr] = useState([]);
  const [detailVisible, setDetailVisible] = useState(false);
  const [detail, setDetail] = useState({});
  const [filterVisible, setFilterVisible] = useState(false);
  const [resumeFilterVisible, setResumeFilterVisible] = useState(false);

  useEffect(() => {
    const {
      location: { search },
    } = props;
    request();
    const searchStr = new URLSearchParams(search).get('moldCode');
    if (searchStr) {
      const moldCode = JSON.parse(decodeURIComponent(searchStr));
      request(moldCode);
    }
  }, [props]);

  function request(value) {
    queryList({
      functionType: 'DIE',
      dataType: 'DIE',
      attribute1: value,
    }).then((res) => {
      if (res && res.content && res.content[0]) {
        setDieInfo(res.content[0]);
        queryList({
          functionType: 'DIE',
          dataType: 'RESUME',
          attribute1: res.content[0].attribute1,
        }).then((res2) => {
          if (res2 && res2.content) {
            const _resumeArr = [];
            res2.content.forEach((item) => {
              const _item = item;
              if (_item.attribute2 === '模具注册') {
                _item.text = '注';
              } else if (_item.attribute2 === '模具转移') {
                _item.text = '移';
                _item.color = 'green';
              } else if (_item.attribute2 === '模具使用') {
                _item.text = '用';
                _item.color = 'red';
              } else if (_item.attribute2 === '模具维修') {
                _item.text = '修';
                _item.color = 'blue';
              } else if (_item.attribute2 === '模具报废') {
                _item.text = '废';
                _item.color = 'orange';
              }

              if (_resumeArr.length && _resumeArr[0].attribute8 > _item.attribute8) {
                _resumeArr.push(_item);
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

  function showDetailModal(item) {
    setDetail(item);
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
    request(data.attribute1);
  }

  function handleFilterCancel() {
    setFilterVisible(false);
  }

  function handleResumeFilter() {
    setResumeFilterVisible(true);
  }

  function handleResumeCancel() {
    setResumeFilterVisible(false);
  }

  function handleResumeOk() {
    setResumeFilterVisible(false);
  }

  return (
    <Fragment>
      <Header title={intl.get(`${preCode}.view.title.dieResume`).d('模具履历')}>
        <Button color="primary" icon="filter2" onClick={showFilterModal}>
          {intl.get(`hzero.c7nUI.Table.filterTitle`).d('筛选')}
        </Button>
      </Header>
      <Content className="isp-die-resume">
        <div className="die-header">
          <div className="left-picture">
            <img src={dieLogo} alt="" />
          </div>
          <div className="right">
            <p className="title">
              <span>{dieInfo.attribute1}</span>
              <span>{dieInfo.attribute2}</span>
              <span className="status">{dieInfo.attribute3}</span>
            </p>
            <Row className="info">
              <Col span={8} className="info-item">
                <img src={categoryIcon} alt="" />
                <span>模具分类：{dieInfo.attribute11}</span>
              </Col>
              <Col span={16} className="info-item">
                <img src={typeIcon} alt="" />
                <span>模具类型：{dieInfo.attribute7}</span>
              </Col>
              <Col span={8} className="info-item">
                <img src={locationIcon} alt="" />
                <span>所在位置：{dieInfo.attribute4}</span>
              </Col>
              <Col span={16} className="info-item">
                <img src={descIcon} alt="" />
                <span>产品描述：{dieInfo.attribute12}</span>
              </Col>
            </Row>
          </div>
        </div>
        <div className="die-resume">
          <div className="resume-filter-btn">
            <Button icon="filter2" onClick={handleResumeFilter}>
              {intl.get(`hzero.c7nUI.Table.filterTitle`).d('筛选')}
            </Button>
          </div>
          <div className="resume-items">
            {resumeArr.map((item, index) => {
              return (
                <div className="resume-item" key={item.dataId}>
                  <div className="resume-item-left">
                    <span className={`circle-text ${item.color}`}>{item.text}</span>
                    <span className="date">{item.attribute8}</span>
                  </div>
                  <div className="resume-item-right">
                    {
                      // eslint-disable-next-line no-nested-ternary
                      index === 0 ? (
                        <img className="end" src={endIcon} alt="" />
                      ) : index === resumeArr.length - 1 ? (
                        <img className="register" src={registerIcon} alt="" />
                      ) : (
                        <div className="block-icon" />
                      )
                    }
                    <Row>
                      <Col span={8}>
                        <span>
                          {item.attribute2}：{item.attribute4}
                        </span>
                        <span className="detail" onClick={() => showDetailModal(item)}>
                          详情
                          <img src={arrowIcon} alt="" />
                        </span>
                      </Col>
                      <Col span={16}>
                        <span>负责人：{item.attribute3}</span>
                      </Col>
                    </Row>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <Modal
          wrapClassName="isp-die-resume-detail-modal"
          title="模具履历明细"
          visible={detailVisible}
          onCancel={handleCancel}
          footer={null}
          width={456}
          closable
          destroyOnClose
        >
          <Row className="detail">
            {dieInfo.attribute1 && <Col span={12}>模具编码：{dieInfo.attribute1}</Col>}
            {detail.attribute3 && <Col span={12}>执行人：{detail.attribute3}</Col>}
            {dieInfo.attribute2 && <Col span={12}>模具名称：{dieInfo.attribute2}</Col>}
            {detail.attribute8 && <Col span={12}>执行时间：{detail.attribute8}</Col>}
            {dieInfo.attribute11 && <Col span={12}>模具分类：{dieInfo.attribute11}</Col>}
            {detail.attribute4 && <Col span={12}>发出地点：{detail.attribute4}</Col>}
            {dieInfo.attribute7 && <Col span={12}>模具类型：{dieInfo.attribute7}</Col>}
            {detail.attribute5 && <Col span={12}>目标地点：{detail.attribute5}</Col>}
            {detail.attribute6 && <Col span={12}>生产产品：{detail.attribute6}</Col>}
            {detail.attribute7 && <Col span={12}>产品数量：{detail.attribute7}</Col>}
            {dieInfo.attribute3 && <Col span={12}>模具状态：{dieInfo.attribute3}</Col>}
          </Row>
          <div className="footer">
            <Button color="primary" onClick={handleOk}>
              {intl.get(`hzero.c7nProUI.Modal.ok`).d('确定')}
            </Button>
          </div>
        </Modal>
        <Modal
          wrapClassName="isp-die-resume-modal"
          title="筛选"
          visible={resumeFilterVisible}
          onCancel={handleResumeCancel}
          onOk={handleResumeOk}
          width={338}
          closable
          destroyOnClose
        >
          <Row style={{ marginBottom: 25 }}>
            选择时间：
            <RadioGroup>
              <Radio value={1}>当天</Radio>
              <Radio value={2}>本周</Radio>
              <Radio value={3}>本月</Radio>
            </RadioGroup>
          </Row>
          <Row>
            选择状态：
            <RadioGroup>
              <Radio value={1}>转移</Radio>
              <Radio value={2}>维修</Radio>
            </RadioGroup>
          </Row>
        </Modal>
        <FilterModal visible={filterVisible} onOk={handleFilterOk} onCancel={handleFilterCancel} />
      </Content>
    </Fragment>
  );
};
