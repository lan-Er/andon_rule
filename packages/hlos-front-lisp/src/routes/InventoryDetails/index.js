/*
 * 库存明细
 * date: 2020-06-25
 * author : zhengtao <TAO.ZHENG@HAND-CHINA.com>
 * version : 0.0.1
 * copyright Copyright (c) 2020, Hand
 */
import React, { useState, useEffect } from 'react';
import { Header, Content } from 'components/Page';
import { Form, Select, Modal, Button, Col, Row, DataSet } from 'choerodon-ui/pro';
import notification from 'utils/notification';
import { withRouter } from 'react-router-dom';
import style from './style.less';
import { queryList, querySortList } from '@/services/api';
import { ListDS } from '@/stores/inevntoryDetailsDS';
import chooseImg from './assets/choose.svg';
import sortImg from './assets/sort.svg';
import DetailContent from './content';
import downImg from './assets/down.svg';
import upImg from './assets/up.png';

const { Option } = Select;

const modalKey = Modal.key();

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

const InventoryDetails = (props) => {
  const [supplierList, setSupplierList] = useState([]);
  const [itemTypeList, setItemTypeList] = useState([]);
  const [detailList, setDetailList] = useState([]);
  const [itemSort, setItemSort] = useState('0');
  const [numSort, setNumSort] = useState('0');
  const [itemBtnType, setItemBtnType] = useState(false);
  useEffect(() => {
    queryList({
      functionType: 'SUPPLIER_CHAIN_OVERALL',
      dataType: 'SUPPLIER',
      size: 1000000,
    }).then((res) => {
      if (res && res.content.length) {
        setSupplierList(res.content);
      }
    });
    queryList({
      functionType: 'SUPPLIER_CHAIN_OVERALL',
      dataType: 'ITEM_TYPE',
      size: 1000000,
    }).then((res) => {
      if (res && res.content.length) {
        setItemTypeList(res.content);
      }
    });
  }, []);

  // 模态框render
  const modalRender = () => {
    return (
      <Form className={style['id-modal-form-box']} dataSet={filterDS}>
        <Select
          label="供应商"
          name={
            typeof props.location.supplier === 'string' && props.location.supplier !== ''
              ? ''
              : 'attribute1'
          }
          defaultValue={props.location.supplier}
          disabled={typeof props.location.supplier === 'string' && props.location.supplier !== ''}
        >
          {supplierList.map((item) => (
            <Option value={item.attribute1} key={item.dataId}>
              {item.attribute1}
            </Option>
          ))}
        </Select>
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
    if (filterDS.current) {
      filterDS.current.reset();
    }
    return false;
  };

  // 查询
  const handleSearch = () => {
    queryList({
      functionType: 'SUPPLIER_CHAIN_OVERALL',
      dataType: 'ONHAND_INVENTORY',
      attribute1: props.location.supplier || filterDS.toData()[0]?.attribute1,
      attribute8: filterDS.toData()[0]?.attribute8,
      attribute10: '1',
      size: 1000000,
    }).then((res) => {
      if (res && res.content.length) {
        setDetailList(res.content);
      } else if (res && !res.content.length) {
        notification.warning({
          message: '无数据！',
        });
        setDetailList([]);
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
          attribute1: props.location.supplier || filterDS.toData()[0]?.attribute1,
          attribute8: filterDS.toData()[0]?.attribute8,
          sortFlag: false,
          field: 'attribute3',
          attribute10: '1',
          size: 1000000,
        }).then((res) => {
          setItemBtnType(false);
          if (res && res.content.length) {
            setDetailList(res.content);
          } else if (res && !res.content.length) {
            notification.warning({
              message: '无数据！',
            });
            setDetailList([]);
          }
        });
      } else if (itemSort === '1') {
        setItemSort('2');
        setNumSort('0');
        querySortList({
          functionType: 'SUPPLIER_CHAIN_OVERALL',
          dataType: 'ONHAND_INVENTORY',
          attribute1: props.location.supplier || filterDS.toData()[0]?.attribute1,
          attribute8: filterDS.toData()[0]?.attribute8,
          sortFlag: true,
          field: 'attribute3',
          attribute10: '1',
          size: 1000000,
        }).then((res) => {
          setItemBtnType(false);
          if (res && res.content.length) {
            setDetailList(res.content);
          } else if (res && !res.content.length) {
            notification.warning({
              message: '无数据！',
            });
            setDetailList([]);
          }
        });
      } else {
        setItemSort('1');
        setNumSort('0');
        querySortList({
          functionType: 'SUPPLIER_CHAIN_OVERALL',
          dataType: 'ONHAND_INVENTORY',
          attribute1: props.location.supplier || filterDS.toData()[0]?.attribute1,
          attribute8: filterDS.toData()[0]?.attribute8,
          sortFlag: false,
          field: 'attribute3',
          attribute10: '1',
          size: 1000000,
        }).then((res) => {
          setItemBtnType(false);
          if (res && res.content.length) {
            setDetailList(res.content);
          } else if (res && !res.content.length) {
            notification.warning({
              message: '无数据！',
            });
            setDetailList([]);
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
    <div className={style['in-detail-box']}>
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
      <Content className={style['detail-content']}>
        <DetailContent detailList={detailList} numSort={numSort} />
      </Content>
    </div>
  );
};

export default withRouter(InventoryDetails);
