/*
 * 供应商库存明细
 * date: 2020-06-25
 * author : zhengtao <TAO.ZHENG@HAND-CHINA.com>
 * version : 0.0.1
 * copyright Copyright (c) 2020, Hand
 */
import React, { useState, useEffect } from 'react';
import { Header, Content } from 'components/Page';
import { Tabs } from 'choerodon-ui';
import notification from 'utils/notification';
import { Form, Modal, Select, Row, Col, Button, DataSet } from 'choerodon-ui/pro';
import { queryList, querySortList } from '@/services/api';
import { withRouter } from 'react-router-dom';
import style from './style.less';
import DetailContent from './content.js';
import { ListDS } from '@/stores/inevntoryDetailsDS';
import chooseImg from './assets/choose.svg';
import sortImg from './assets/sort.svg';
import downImg from './assets/down.svg';
import upImg from './assets/up.png';

const { TabPane } = Tabs;
const { Option } = Select;

function changeImg(type) {
  if (type === '0') {
    return <img src={sortImg} alt="排序" />;
  } else if (type === '1') {
    return <img src={downImg} alt="排序" />;
  } else {
    return <img src={upImg} alt="排序" />;
  }
}
const filterDS = new DataSet(ListDS());

const SupplierInventory = () => {
  const modalKey = Modal.key();
  const [itemTypeList, setItemTypeList] = useState([]);
  const [tabKey, setTabKey] = useState('原材料');
  const [supplier] = useState('富奥');
  const [detailList, setDetailList] = useState({});
  const [itemSort, setItemSort] = useState('0');
  const [numSort, setNumSort] = useState('0');
  const [itemBtnType, setItemBtnType] = useState(false);
  // 收集数据
  const collectData = (arr) => {
    const obj = {};
    arr.forEach((item) => {
      if (!obj[item.attribute2]) {
        obj[item.attribute2] = [];
      }
      obj[item.attribute2].push(item);
    });
    return obj;
  };
  useEffect(() => {
    queryList({
      functionType: 'SUPPLIER_CHAIN_OVERALL',
      dataType: 'ITEM_TYPE',
    }).then((res) => {
      if (res && res.content.length) {
        setItemTypeList(res.content);
      }
    });
    queryList({
      functionType: 'SUPPLIER_CHAIN_OVERALL',
      dataType: 'ONHAND_INVENTORY',
      attribute1: supplier,
      attribute8: '',
      // attribute2: tabKey,
      attribute10: '0',
      size: 1000000,
    }).then((res) => {
      if (res && res.content.length) {
        setDetailList(collectData(res.content));
      } else if (res && !res.content.length) {
        notification.warning({
          message: '无数据！',
        });
        setDetailList({});
      }
    });
  }, [supplier]);
  // 切换Tab查询
  const handleChangeTab = (key) => {
    setTabKey(key);
    queryList({
      functionType: 'SUPPLIER_CHAIN_OVERALL',
      dataType: 'ONHAND_INVENTORY',
      attribute1: supplier,
      attribute8: filterDS.toData()[0]?.attribute8,
      // attribute2: key,
      attribute10: '0',
      size: 1000000,
    }).then((res) => {
      if (res && res.content.length) {
        setDetailList(collectData(res.content));
      } else if (res && !res.content.length) {
        notification.warning({
          message: '无数据！',
        });
        setDetailList({});
      }
    });
  };

  // 模态框render
  const modalRender = () => {
    return (
      <Form className={style['id-modal-form-box']} dataSet={filterDS}>
        <Select label="物料类别" name="attribute8">
          {itemTypeList.map((item) => (
            <Option value={item.attribute1} key={item.dataId}>
              {item.attribute1}
            </Option>
          ))}
        </Select>
      </Form>
    );
  };
  // 重置
  const handleReset = () => {
    filterDS.current.reset();
    return false;
  };

  // 查询
  const handleSearch = () => {
    queryList({
      functionType: 'SUPPLIER_CHAIN_OVERALL',
      dataType: 'ONHAND_INVENTORY',
      attribute1: supplier,
      attribute8: filterDS.toData()[0]?.attribute8,
      attribute10: '0',
      size: 1000000,
    }).then((res) => {
      if (res && res.content.length) {
        setDetailList(collectData(res.content));
      } else if (res && !res.content.length) {
        notification.warning({
          message: '无数据！',
        });
        setDetailList({});
      }
    });
  };

  // 打开模态框
  const openModal = () => {
    Modal.open({
      key: modalKey,
      title: '筛选',
      children: modalRender(),
      onOk: handleSearch,
      onCancel: handleReset,
      cancelText: '重置',
      closable: true,
      drawer: true,
    });
  };

  const tabArr = ['原材料', '半成品', '在制品', '成品', '在途', '不合格品'];
  // 排序
  const handleSort = (type) => {
    if (detailList.length === 0) {
      return notification.warning({
        message: '请先筛选！',
      });
    }
    if (type === 'item') {
      setItemBtnType(true);
      if (itemSort === '0') {
        setItemSort('1');
        setNumSort('0');
        querySortList({
          functionType: 'SUPPLIER_CHAIN_OVERALL',
          dataType: 'ONHAND_INVENTORY',
          attribute1: supplier,
          attribute8: filterDS.toData()[0]?.attribute8,
          // attribute2: tabKey,
          attribute10: '0',
          size: 1000000,
          sortFlag: false,
          field: 'attribute3',
        }).then((res) => {
          setItemBtnType(false);
          if (res && res.content.length) {
            setDetailList(collectData(res.content));
          } else if (res && !res.content.length) {
            notification.warning({
              message: '无数据！',
            });
            setDetailList({});
          }
        });
      } else if (itemSort === '1') {
        setItemSort('2');
        setNumSort('0');
        querySortList({
          functionType: 'SUPPLIER_CHAIN_OVERALL',
          dataType: 'ONHAND_INVENTORY',
          attribute1: supplier,
          attribute8: filterDS.toData()[0]?.attribute8,
          // attribute2: tabKey,
          attribute10: '0',
          size: 1000000,
          sortFlag: true,
          field: 'attribute3',
        }).then((res) => {
          setItemBtnType(false);
          if (res && res.content.length) {
            setDetailList(collectData(res.content));
          } else if (res && !res.content.length) {
            notification.warning({
              message: '无数据！',
            });
            setDetailList({});
          }
        });
      } else {
        setItemSort('1');
        setNumSort('0');
        querySortList({
          functionType: 'SUPPLIER_CHAIN_OVERALL',
          dataType: 'ONHAND_INVENTORY',
          attribute1: supplier,
          attribute8: filterDS.toData()[0]?.attribute8,
          // attribute2: tabKey,
          attribute10: '0',
          size: 1000000,
          sortFlag: false,
          field: 'attribute3',
        }).then((res) => {
          setItemBtnType(false);
          if (res && res.content.length) {
            setDetailList(collectData(res.content));
          } else if (res && !res.content.length) {
            notification.warning({
              message: '无数据！',
            });
            setDetailList({});
          }
        });
      }
    } else if (type === 'num') {
      if (numSort === '0') {
        setNumSort('1');
        setItemSort('0');
      } else if (numSort === '1') {
        setNumSort('2');
        setItemSort('0');
      } else {
        setNumSort('1');
        setItemSort('0');
      }
    }
  };
  return (
    <div className={style['supplier-in-detail-box']}>
      <Header>
        <Row>
          <Col span={4} className={style['head-sort-btn']}>
            <Button onClick={() => handleSort('item')} disabled={itemBtnType}>
              物料
              {changeImg(itemSort)}
            </Button>
            <Button onClick={() => handleSort('num')}>
              数量
              {changeImg(numSort)}
            </Button>
          </Col>
          <Col offset={18} span={2}>
            <Button className={style['head-choose-btn']} onClick={openModal}>
              <img src={chooseImg} alt="筛选" />
              筛选
            </Button>
          </Col>
        </Row>
      </Header>
      <Content>
        <Tabs defaultActiveKey={tabKey} onChange={handleChangeTab}>
          {tabArr.map((item) => (
            <TabPane tab={`${item}(${detailList[item] ? detailList[item].length : 0})`} key={item}>
              {detailList[item] ? (
                <DetailContent detailList={detailList[item]} numSort={numSort} />
              ) : null}
            </TabPane>
          ))}
        </Tabs>
      </Content>
    </div>
  );
};

export default withRouter(SupplierInventory);
