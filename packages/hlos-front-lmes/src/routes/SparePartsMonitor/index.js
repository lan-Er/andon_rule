/**
 * @Description: 备件监控
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-06-04 13:45:47
 * @LastEditors: yu.na
 */

import React, { Fragment, useEffect, useState } from 'react';
import {
  Row,
  Col,
  Progress,
  DataSet,
  Button,
  Form,
  Modal,
  Lov,
  Select,
  NumberField,
} from 'choerodon-ui/pro';
import { Carousel } from 'choerodon-ui';
import moment from 'moment';
import { chunk } from 'lodash';
import intl from 'utils/intl';
import uuidv4 from 'uuid/v4';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import { getResponse } from 'utils/utils';
import { Header, Content } from 'components/Page';
import {
  countSparePartForMonitor,
  countScrapSparePart,
  countSparePartType,
  countSparePartQuantityForEffectiveDay,
  countSparePartQuantityForInventoryWarn,
} from '@/services/sparePartsMonitorService';
import { ListDS } from '@/stores/sparePartsMonitorDS';
import { userSetting } from 'hlos-front/lib/services/api';
import warehouseIcon from './assets/warehouse.svg';
import meAreaIcon from './assets/me-area.svg';
import otherIcon from './assets/other.svg';
import scrapIcon from './assets/scrap.svg';
import './style.less';

const preCode = 'lmes.sparePartsMonitor';
const modalKey = Modal.key();

const ds = new DataSet(ListDS());

export default () => {
  const [totalNum, setTotalNum] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  // const [uom, setUom] = useState(null);
  // const [currency, setCurrency] = useState('');
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
    async function queryDefaultOrg() {
      const res = await userSetting({
        defaultFlag: 'Y',
      });
      if (getResponse(res) && res.content && res.content[0]) {
        ds.current.set('organizationObj', {
          meOuId: res.content[0].meOuId,
          organizationName: res.content[0].meOuName,
        });

        dealData(res.content[0].meOuId, 'MONTH', 3);
      } else {
        dealData();
      }
    }
    queryDefaultOrg();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function dealData(organizationId, period, effectiveDay) {
    const res = await countSparePartForMonitor({
      organizationId,
    });
    if (getResponse(res) && res) {
      if (res.warehouseList) {
        let _warehouseArr = res.warehouseList;
        const concatArr = new Array(3 - (res.warehouseList.length % 3)).fill('').map(() => ({
          key: uuidv4(),
          display: true,
        }));
        if (res.warehouseList.length % 3 !== 0) {
          _warehouseArr = res.warehouseList.concat(...concatArr);
        }
        setWarehouseArr(chunk(_warehouseArr, 3));
      }
      if (res.warehouseList) {
        let _workArr = res.workList;
        const concatArr = new Array(3 - (res.workList.length % 3)).fill('').map(() => ({
          key: uuidv4(),
          display: true,
        }));
        if (res.workList.length % 3 !== 0) {
          _workArr = res.workList.concat(...concatArr);
        }
        setMeAreaArr(chunk(_workArr, 3));
      }
      if (res.otherList) {
        let _otherArr = res.otherList;
        const concatArr = new Array(3 - (res.otherList.length % 3)).fill('').map(() => ({
          key: uuidv4(),
          display: true,
        }));
        if (res.otherList.length % 3 !== 0) {
          _otherArr = res.otherList.concat(...concatArr);
        }
        setElseArr(chunk(_otherArr, 3));
      }
      setWarehouseTotal(res.warehouseQuantity);
      setMeAreaTotal(res.workQuantity);
      setElseTotal(res.otherQuantity);
      setTotalNum(res.warehouseQuantity + res.workQuantity + res.otherQuantity);
      setTotalPrice(res.warehouseMarketPrice + res.workMarketPrice + res.otherMarketPrice);
    }

    const scrapRes = await countScrapSparePart({
      organizationId,
      period,
    });
    if (getResponse(scrapRes) && scrapRes) {
      if (scrapRes.scrapList) {
        let _scrapArr = scrapRes.scrapList;
        const concatArr = new Array(3 - (scrapRes.scrapList.length % 3)).fill('').map(() => ({
          key: uuidv4(),
          display: true,
        }));
        if (scrapRes.scrapList.length % 3 !== 0) {
          _scrapArr = scrapRes.scrapList.concat(...concatArr);
        }
        setScrapArr(chunk(_scrapArr, 3));
      }
      setScrapTotal(scrapRes.scrapQuantity);
    }

    const typeRes = await countSparePartType({
      organizationId,
    });
    if (getResponse(typeRes) && typeRes) {
      setTypeArr(typeRes);
    }

    const numWarnRes = await countSparePartQuantityForInventoryWarn({
      organizationId,
      effectiveDay,
    });
    if (getResponse(numWarnRes) && numWarnRes) {
      setNumWarnArr(chunk(numWarnRes, 4));
    }

    const dateWarnRes = await countSparePartQuantityForEffectiveDay({
      organizationId,
      effectiveDay,
    });
    if (getResponse(dateWarnRes) && dateWarnRes) {
      setDateWarnArr(chunk(dateWarnRes, 4));
    }
  }

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

  const handleReset = () => {
    ds.current.set('organizationObj', null);
    ds.current.set('period', null);
    ds.current.set('effectiveDay', null);
    return false;
  };

  const handleSearch = async () => {
    const validateVal = await ds.validate(false, false);
    if (!validateVal) return false;
    const { organizationId, period, effectiveDay } = ds.current.toJSONData();
    dealData(organizationId, period, effectiveDay);
  };

  const showFilterModal = () => {
    Modal.open({
      key: modalKey,
      title: intl.get(`hzero.c7nUI.Table.filterTitle`).d('筛选'),
      drawer: true,
      drawerTransitionName: 'slide-right',
      children: (
        <Form dataSet={ds}>
          <Lov name="organizationObj" noCache />
          <Select name="period" />
          <NumberField name="effectiveDay" />
        </Form>
      ),
      onOk: handleSearch,
      onCancel: handleReset,
      cancelText: intl.get('hzero.common.button.reset').d('重置'),
      okText: intl.get('hzero.common.button.search').d('查询'),
    });
  };

  return (
    <Fragment>
      <Header title={intl.get(`${preCode}.view.title.sparePartsMonitor`).d('备件监控')}>
        <Button color="primary" icon="filter2" onClick={showFilterModal}>
          {intl.get(`hzero.c7nUI.Table.filterTitle`).d('筛选')}
        </Button>
      </Header>
      <Content className="lmes-spare-parts-monitor">
        <div className="monitor-top">
          <p className="total-info">
            在用备件（总量：
            <span className="number">{totalNum}</span>
            {/* {uom} */}
            <span style={{ marginLeft: 20 }}>
              价值：<span className="number">{totalPrice}</span>
              {/* {currency}） */}）
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
                        <Carousel vertical dots={false} autoplay speed={5000}>
                          {item.list &&
                            item.list.map((group) => {
                              return (
                                <div key={uuidv4()}>
                                  {group.length &&
                                    group.map((el) => {
                                      return (
                                        <p
                                          className="item"
                                          key={el.sparePartId}
                                          style={el.display && { background: '#fff' }}
                                        >
                                          <span>{el.sparePartCode}</span>
                                          <span>{el.sparePartName}</span>
                                          <span>{el.sparePartTypeMeaning}</span>
                                          <span className="number">{el.quantity}</span>
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
                <span>数量</span>
              </p>
              <div className="spareparts-num">
                {typeArr.map((item) => {
                  return (
                    <Row className="type-item" key={item.sparePartType}>
                      <Col span={6}>{item.sparePartTypeMeaning}</Col>
                      <Col span={14} className="color-block">
                        <Col span={Math.round((item.quantity / typeArr[0].quantity) * 24)} />
                      </Col>
                      <Col span={4} className="num" style={{ textAlign: 'right' }}>
                        {item.quantity}
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
            <p className="title">数量预警</p>
            <div className="components">
              <Carousel vertical dots={false} autoplay speed={50000}>
                {numWarnArr.map((groupItem) => {
                  return (
                    <div className="component-group" key={uuidv4()}>
                      {groupItem.map((item) => {
                        return (
                          <div className="component-item" key={item.sparePartId}>
                            <div className="left">
                              <p className="left-title">{item.sparePartName}</p>
                              <p>
                                {item.sparePartGroup}
                                <span className="item-type">{item.sparePartTypeMeaning}</span>
                              </p>
                              <p>
                                失效日期：
                                {item.expireDate
                                  ? moment(item.expireDate).format(DEFAULT_DATE_FORMAT)
                                  : null}
                              </p>
                            </div>
                            <div className="right-circle">
                              <Progress
                                type="circle"
                                percent={item.quantity}
                                width={61}
                                format={(percent) => percent}
                              />
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
          <div className="monitor-item" style={{ marginLeft: 8 }}>
            <p className="title">有效日期（少于{ds.current.get('effectiveDay')}天）</p>
            <div className="components">
              <Carousel vertical dots={false} autoplay speed={50000}>
                {dateWarnArr.map((groupItem) => {
                  return (
                    <div className="component-group" key={uuidv4()}>
                      {groupItem.map((item) => {
                        return (
                          <div className="component-item" key={item.sparePartId}>
                            <div className="left">
                              <p className="left-title">{item.sparePartName}</p>
                              <p>
                                {item.sparePartGroup}
                                <span className="item-type">{item.sparePartTypeMeaning}</span>
                              </p>
                              <p>
                                失效日期：
                                {item.expireDate
                                  ? moment(item.expireDate).format(DEFAULT_DATE_FORMAT)
                                  : null}
                              </p>
                            </div>
                            <div className="right">
                              <p>
                                剩<span className="right-num">{item.effectiveDay}</span>天
                              </p>
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
