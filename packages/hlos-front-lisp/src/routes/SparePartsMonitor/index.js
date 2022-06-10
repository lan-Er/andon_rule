/**
 * @Description: 备件监控
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-06-04 13:45:47
 * @LastEditors: yu.na
 */

import React, { Fragment, useEffect, useState } from 'react';
import { Row, Col, Progress } from 'choerodon-ui/pro';
import { Carousel } from 'choerodon-ui';
import moment from 'moment';
import { chunk } from 'lodash';
import intl from 'utils/intl';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import { Header, Content } from 'components/Page';
import { queryList } from '../../services/api';
import warehouseIcon from './assets/warehouse.svg';
import meAreaIcon from './assets/me-area.svg';
import otherIcon from './assets/other.svg';
import scrapIcon from './assets/scrap.svg';
import './style.less';

const preCode = 'lisp.sparePartsMonitor';

export default () => {
  const [totalNum, setTotalNum] = useState(0);
  const [uom, setUom] = useState(null);
  const [currency, setCurrency] = useState('RMB');
  const [typeArr, setTypeArr] = useState([]);
  const [warehouseTotal, setWarehouseTotal] = useState(0);
  const [warehouseArr, setWarehouseArr] = useState([]);
  const [meAreaTotal, setMeAreaTotal] = useState(0);
  const [meAreaArr, setMeAreaArr] = useState([]);
  const [elseTotal, setElseTotal] = useState(0);
  const [elseArr, setElseArr] = useState([]);
  const [scrapTotal, setScrapTotal] = useState(0);
  const [scrapArr, setScrapArr] = useState([]);
  const [numWarnArr, setNumWarnArr] = useState([]);
  const [dateWarnArr, setDateWarnArr] = useState([]);

  useEffect(() => {
    queryList({
      functionType: 'SPARE_PARTS',
      dataType: 'SPARE_PARTS_ONHAND',
    }).then((res) => {
      if (res && res.content) {
        let _totalNum = 0;
        const _typeArr = [];
        let _warehouseTotal = 0;
        let _meAreaTotal = 0;
        let _elseTotal = 0;
        let _scrapTotal = 0;
        const _warehouseArr = [];
        const _meAreaArr = [];
        const _elseArr = [];
        const _scrapArr = [];
        const _numWarnArr = [];
        const _dateWarnArr = [];
        res.content.forEach((item) => {
          _totalNum += Number(item.attribute9);
          if (_typeArr.filter((el) => el.name === item.attribute11).length) {
            _typeArr.forEach((el) => {
              const _el = el;
              if (_el.name === item.attribute11) {
                _el.number += Number(item.attribute9);
              }
            });
          } else {
            _typeArr.push({
              name: item.attribute11,
              number: Number(item.attribute9),
            });
          }

          if (item.attribute22 === 'WAREHOUSE') {
            _warehouseTotal += Number(item.attribute9);
            _warehouseArr.push({
              code: item.attribute6,
              name: item.attribute7,
              type: item.attribute11,
              number: item.attribute9,
            });
          } else if (item.attribute22 === 'RESOURCE') {
            _meAreaTotal += Number(item.attribute9);
            _meAreaArr.push({
              code: item.attribute6,
              name: item.attribute7,
              type: item.attribute11,
              number: item.attribute9,
            });
          } else if (item.attribute22 === 'ELSE') {
            _elseTotal += Number(item.attribute9);
            _elseArr.push({
              code: item.attribute6,
              name: item.attribute7,
              type: item.attribute11,
              number: item.attribute9,
            });
          }
          if (item.attribute23 === 'SCRAP') {
            _scrapTotal += Number(item.attribute9);
            _scrapArr.push({
              code: item.attribute6,
              name: item.attribute7,
              type: item.attribute11,
              number: item.attribute9,
            });
          }

          if (Number(item.attribute9) < 100) {
            if (_numWarnArr.length && Number(item.attribute9) < Number(_numWarnArr[0].attribute9)) {
              _numWarnArr.unshift({
                code: item.attribute6,
                name: item.attribute7,
                group: item.attribute13,
                type: item.attribute11,
                number: Number(item.attribute9),
                date: item.attribute19,
              });
            } else {
              _numWarnArr.push({
                code: item.attribute6,
                name: item.attribute7,
                group: item.attribute13,
                type: item.attribute11,
                number: Number(item.attribute9),
                date: item.attribute19,
              });
            }
          }

          if (item.attribute24) {
            _dateWarnArr.push({
              code: item.attribute6,
              name: item.attribute7,
              group: item.attribute13,
              type: item.attribute11,
              day: item.attribute24,
              date: moment().add(Number(item.attribute24), 'days').format(DEFAULT_DATE_FORMAT),
            });
          }
        });

        _typeArr.sort((a, b) => {
          return b.number - a.number;
        });
        _numWarnArr.sort((a, b) => {
          return a.number - b.number;
        });

        setTotalNum(_totalNum);
        setTypeArr(_typeArr);
        setWarehouseTotal(_warehouseTotal);
        setWarehouseArr(chunk(_warehouseArr, 3));
        setMeAreaTotal(_meAreaTotal);
        setMeAreaArr(chunk(_meAreaArr, 3));
        setElseTotal(_elseTotal);
        setElseArr(chunk(_elseArr, 3));
        setScrapTotal(_scrapTotal);
        setScrapArr(chunk(_scrapArr, 3));
        setDateWarnArr(chunk(_dateWarnArr, 4));
        setNumWarnArr(_numWarnArr);
      }
    });
    queryList({
      functionType: 'SPARE_PARTS',
      dataType: 'SPARE_PARTS_OPE_UOM',
    }).then((res) => {
      if (res && res.content && res.content[0]) {
        setUom(res.content[0].attribute2);
      }
    });
    queryList({
      functionType: 'SPARE_PARTS',
      dataType: 'SPARE_PARTS_CURRENCY',
    }).then((res) => {
      if (res && res.content && res.content[0]) {
        setCurrency(res.content[0].attribute1);
      }
    });
  }, []);

  const sparepartsArr = () => {
    return [
      {
        name: '仓库',
        imgSrc: warehouseIcon,
        total: warehouseTotal,
        list: warehouseArr,
      },
      {
        name: '车间',
        imgSrc: meAreaIcon,
        total: meAreaTotal,
        list: meAreaArr,
      },
      {
        name: '其他',
        imgSrc: otherIcon,
        total: elseTotal,
        list: elseArr,
      },
      {
        name: '报废',
        imgSrc: scrapIcon,
        total: scrapTotal,
        list: scrapArr,
      },
    ];
  };

  return (
    <Fragment>
      <Header title={intl.get(`${preCode}.view.title.sparePartsMonitor`).d('备件监控')} />
      <Content className="isp-spare-parts-monitor">
        <div className="monitor-top">
          <p className="total-info">
            在用备件（总量：
            <span className="number">{totalNum}</span>
            {uom}
            <span style={{ marginLeft: 20 }}>
              价值：<span className="number">{totalNum * 120}</span>
              {currency}）
            </span>
          </p>
          <Row>
            <Col span={17} className="spareparts-board">
              {sparepartsArr().map((item) => {
                return (
                  <Row className="board-item" key={item.name}>
                    <Col span={6} className="icon">
                      <img src={item.imgSrc} alt="" />
                      <p>{item.name}</p>
                    </Col>
                    <Col span={18} className="components">
                      <p>
                        总量：<span>{item.total}</span>
                      </p>
                      <div className="item-list">
                        <Carousel vertical dots={false} autoplay speed={10000}>
                          {item.list &&
                            item.list.map((group, index) => {
                              return (
                                // eslint-disable-next-line react/no-array-index-key
                                <div key={index}>
                                  {group.length &&
                                    group.map((el, index1) => {
                                      return (
                                        // eslint-disable-next-line react/no-array-index-key
                                        <p className="item" key={index1}>
                                          <span>{el.code}</span>
                                          <span>{el.name}</span>
                                          <span>{el.type}</span>
                                          <span className="number">{el.number}</span>
                                        </p>
                                      );
                                    })}
                                </div>
                              );
                            })}
                        </Carousel>
                      </div>
                    </Col>
                  </Row>
                );
              })}
            </Col>
            <Col span={7} className="spareparts-type">
              <p className="title">
                <span>备件类型</span>
                <span>数量({uom})</span>
              </p>
              <div className="spareparts-num">
                {typeArr.map((item) => {
                  return (
                    <Row className="type-item" key={item.name}>
                      <Col span={6}>{item.name}</Col>
                      <Col span={14} className="color-block">
                        <Col span={Math.round((item.number / typeArr[0].number) * 24)} />
                      </Col>
                      <Col span={4} className="num" style={{ textAlign: 'right' }}>
                        {item.number}
                      </Col>
                    </Row>
                  );
                })}
              </div>
            </Col>
          </Row>
        </div>
        <div className="monitor-bottom">
          <div className="monitor-item">
            <p className="title">数量预警(数量少于20%)</p>
            <div className="components">
              {numWarnArr.map((item, index) => {
                if (item.number) {
                  return (
                    // eslint-disable-next-line react/no-array-index-key
                    <div className="component-item" key={index}>
                      <div className="left">
                        <p className="left-title">{item.name}</p>
                        <p>
                          {item.group}
                          <span className="item-type">{item.type}</span>
                        </p>
                        <p>失效日期：{item.date}</p>
                      </div>
                      <div className="right-circle">
                        <Progress
                          type="circle"
                          percent={item.number}
                          width={61}
                          format={(percent) => percent}
                        />
                      </div>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
          <div className="monitor-item" style={{ marginLeft: 8 }}>
            <p className="title">有效日期（少于7天）</p>
            <div className="components">
              <Carousel vertical dots={false} autoplay speed={10000}>
                {dateWarnArr.map((groupItem, index) => {
                  return (
                    // eslint-disable-next-line react/no-array-index-key
                    <div className="component-group" key={index}>
                      {groupItem.map((item, index1) => {
                        return (
                          // eslint-disable-next-line react/no-array-index-key
                          <div className="component-item" key={index1}>
                            <div className="left">
                              <p className="left-title">{item.name}</p>
                              <p>
                                {item.group}
                                <span className="item-type">{item.type}</span>
                              </p>
                              <p>失效日期：{item.date}</p>
                            </div>
                            <div className="right">
                              <p>剩余(天)</p>
                              <p className="right-num">{item.day}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </Carousel>
            </div>
          </div>
        </div>
      </Content>
    </Fragment>
  );
};
