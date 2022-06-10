/*
 * @Description: 到货接收
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2020-12-16 19:19:04
 */
import React from 'react';
import {
  DataSet,
  Lov,
  TextField,
  Button,
  Form,
  NumberField,
  DateTimePicker,
  Modal,
} from 'choerodon-ui/pro';
import { Row, Col, Checkbox, Spin } from 'choerodon-ui';
import uuidv4 from 'uuid/v4';
import notification from 'utils/notification';
import moment from 'moment';
import { getResponse } from 'utils/utils';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import { closeTab } from 'utils/menuTab';
import { queryLovData } from 'hlos-front/lib/services/api';

import defaultAvatarIcon from 'hlos-front/lib/assets/img-default-avator.png';
import workerIcon from 'hlos-front/lib/assets/icons/processor.svg';
import lockIcon from 'hlos-front/lib/assets/icons/lock.svg';
import unlockIcon from 'hlos-front/lib/assets/icons/un-lock.svg';
import orgIcon from 'hlos-front/lib/assets/icons/operation.svg';
import warehouseIcon from 'hlos-front/lib/assets/icons/warehouse.svg';
import wmIcon from 'hlos-front/lib/assets/icons/wm-area.svg';
import supplierIcon from 'hlos-front/lib/assets/icons/supplier.svg';
import placeIcon from 'hlos-front/lib/assets/icons/place.svg';
import documentIcon from 'hlos-front/lib/assets/icons/document.svg';
import ReasonIcon from 'hlos-front/lib/assets/icons/reason.svg';
import lotSelected from 'hlos-front/lib/assets/icons/lot-selected.svg';
import lotUnselected from 'hlos-front/lib/assets/icons/lot-unselect.svg';
import numberSelected from 'hlos-front/lib/assets/icons/number-selected.svg';
import numberUnselected from 'hlos-front/lib/assets/icons/number-unselect.svg';
import tagSelected from 'hlos-front/lib/assets/icons/tag-selected.svg';
import tagUnSelected from 'hlos-front/lib/assets/icons/tag-unselect.svg';
import openIcon from 'hlos-front/lib/assets/icons/up-blue.svg';
import closeIcon from 'hlos-front/lib/assets/icons/down-blue.svg';
import { headerSearchDSConfig, lineList } from '../../stores/arrivalReceptionDS.js';
import { LovSelect, TextSelect } from './components/subHeader';
import { Line, ModalChildren } from './components/index';
import { supplierReceive } from '../../services/arrivalReceptionService.js';

import Head from './components/head.js';
import Footer from './components/footer.js';

import './index.less';

let modal = null;
class ArrivalReception extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      workerLock: true,
      orgLock: true,
      warehouseLock: true,
      wmALock: true,
      partyLock: true,
      placeLock: true,
      partyDocNumLock: true,
      itemControlType: 'QUANTITY',
      openFlag: false,
      checkedAll: true,
      fileUrl: '',
      leftLineList: [],
      submitLineList: [],
      loading: false,
    };
  }

  arDS = new DataSet(headerSearchDSConfig());

  lineListDS = new DataSet(lineList());

  modalLineDS = new DataSet(lineList());

  async componentDidMount() {
    if (!this.state.submitLineList.length) {
      notification.warning({
        message: '左侧录入接收数量信息',
      });
    }

    const res = await queryLovData({
      lovCode: 'LMDS.WORKER',
      defaultFlag: 'Y',
      showOrganization: 'Y',
    });
    if (res && Array.isArray(res.content) && res.content.length) {
      this.arDS.current.set('workerName', res.content[0].workerName);
      this.arDS.current.set('workerCode', res.content[0].workerCode);
      this.arDS.current.set('workerId', res.content[0].workerId);
      this.arDS.current.set('organizationId', res.content[0].organizationId);
      this.arDS.current.set('organizationName', res.content[0].organizationName);
      this.arDS.current.set('organizationCode', res.content[0].organizationCode);

      this.setState({
        fileUrl: res.content[0].fileUrl,
      });
    }
  }

  handleQueryChange = (value, name) => {
    if (value && name === 'organizationObj') {
      this.lineListDS.fields.get('itemObj').setLovPara('organizationId', value.organizationId);
      this.arDS.current.set('warehouseObj', {});
    } else if (value && name === 'warehouseObj') {
      this.arDS.current.set('wmAreaObj', {});
    } else if (value && name === 'workerObj') {
      this.setState({
        fileUrl: value.fileUrl,
      });
    }
  };

  /**
   * 选择接收类型
   * @param {*} value
   */

  selectItemControlType = (value) => {
    this.lineListDS.current.set('itemControlType', value);
    this.setState({
      itemControlType: value,
      leftLineList: [],
    });

    this.lineListDS.current.set('tagCode', '');
    this.lineListDS.current.set('lotNumber', '');
  };

  // 行 --- 物料号/批次号输入
  handleCodeChange = async () => {
    const lineValid = await this.lineListDS.validate();
    if (!lineValid) {
      this.lineListDS.current.set('tagCode', '');
      this.lineListDS.current.set('lotNumber', '');
      notification.warning({
        message: '请先输入物料和数量!',
      });
      return;
    }

    const leftLineList = this.state.leftLineList.slice();
    let value = '';
    let flag = false;

    if (this.state.itemControlType === 'LOT') {
      if (!this.lineListDS.current.get('lotNumber')) {
        return;
      }
      value = this.lineListDS.current.get('lotNumber');
      leftLineList.some((v) => {
        if (v.lotNumber === value) {
          flag = true;
          return false;
        }
        return false;
      });
    } else if (this.state.itemControlType === 'TAG') {
      if (!this.lineListDS.current.get('tagCode')) {
        return;
      }
      value = this.lineListDS.current.get('tagCode');
      leftLineList.some((v) => {
        if (v.tagCode === value) {
          flag = true;
          return false;
        }
        return false;
      });
    }

    if (!flag) {
      leftLineList.unshift({
        ...this.lineListDS.current.data,
        ...this.lineListDS.current.data.itemObj,
        itemObj: null,
        today: null,
      });
      this.setState({
        leftLineList,
      });
      this.lineListDS.current.set('tagCode', '');
      this.lineListDS.current.set('lotNumber', '');
      const textNode = document.getElementById('textNode');
      textNode.focus();
    } else {
      notification.warning({
        message: '编码已存在',
      });
      this.lineListDS.current.set('tagCode', '');
      this.lineListDS.current.set('lotNumber', '');
      const textNode = document.getElementById('textNode');
      textNode.focus();
    }
  };

  // 左侧复选框
  handleCheckbox = (type, index) => {
    if (type === 'all') {
      this.setState({
        checkedAll: !this.state.checkedAll,
        leftLineList: this.state.leftLineList.map((v) => ({
          ...v,
          checkedFlag: !this.state.checkedAll,
        })),
      });
    } else {
      const newLeftLineList = this.state.leftLineList.map((v, i) => {
        if (i === index) {
          return { ...v, checkedFlag: !v.checkedFlag };
        }
        return { ...v };
      });
      this.setState({
        leftLineList: newLeftLineList,
        checkedAll: newLeftLineList.every((v) => v.checkedFlag),
      });
    }
  };

  /**
   * 点击确认暂存数据
   */
  stageState = async () => {
    const arValid = await this.arDS.validate();
    const lineValid = await this.lineListDS.validate();
    if (!arValid) {
      notification.warning({
        message: '请先完成上方必输字段!',
      });
      return;
    }

    const headerInfo = this.arDS.current.data;
    const { itemControlType } = this.state;
    const submitLineList = this.state.submitLineList.slice();
    if (
      (itemControlType === 'TAG' || itemControlType === 'LOT') &&
      this.state.leftLineList.length
    ) {
      const leftCheckedList = this.state.leftLineList.filter((v) => v.checkedFlag);
      let checkedQuantity = 0;
      leftCheckedList.forEach((val) => {
        checkedQuantity += parseFloat(val.receivedQty);
        return checkedQuantity;
      });
      submitLineList.unshift({
        ...leftCheckedList[0],
        ...headerInfo.warehouseObj,
        ...headerInfo.wmAreaObj,
        ...headerInfo.organizationObj,
        receivedQty: checkedQuantity,
        receivedList: leftCheckedList,
      });
    } else if (itemControlType === 'QUANTITY') {
      if (!lineValid) {
        notification.warning({
          message: '请输入物料和数量!',
        });
        return;
      } else {
        submitLineList.unshift({
          ...headerInfo.warehouseObj,
          ...headerInfo.wmAreaObj,
          ...this.lineListDS.current.data,
          ...this.lineListDS.current.data.itemObj,
          ...headerInfo.organizationObj,
          itemObj: null,
          today: null,
          receivedList: [
            {
              ...this.lineListDS.current.data,
              ...this.lineListDS.current.data.itemObj,
              itemObj: null,
              today: null,
            },
          ],
        });
      }
    }
    this.setState({
      submitLineList,
      leftLineList: [],
    });
    this.lineListDS.current.reset();
    this.lineListDS.current.set('itemControlType', this.state.itemControlType);
    setTimeout(() => {
      const textNode = document.getElementById('textNode');
      textNode.focus();
    }, 500);
  };

  onLockChange = (value) => {
    if (value === 'workerObj') {
      this.setState((state) => ({
        workerLock: !state.workerLock,
      }));
    } else if (value === 'organizationObj') {
      this.setState((state) => ({
        orgLock: !state.orgLock,
      }));
    } else if (value === 'warehouseObj') {
      this.setState((state) => ({
        warehouseLock: !state.warehouseLock,
      }));
    } else if (value === 'wmAreaObj') {
      this.setState((state) => ({
        wmALock: !state.wmALock,
      }));
    } else if (value === 'partyObj') {
      this.setState((state) => ({
        partyLock: !state.partyLock,
      }));
    } else if (value === 'placeObj') {
      this.setState((state) => ({
        placeLock: !state.placeLock,
      }));
    } else if (value === 'partyDocumentNumber') {
      this.setState((state) => ({
        partyDocNumLock: !state.partyDocNumLock,
      }));
    }
  };

  // 右侧 --- 复选框
  handleRightCheck = (value, itemIndex) => {
    const submitLineList = this.state.submitLineList.slice();
    submitLineList[itemIndex].checkedFlag = value;
    this.setState({
      submitLineList,
    });
  };

  // 更新弹框
  handleUpdateModal = (record, itemIndex) => {
    modal.update({
      children: (
        <ModalChildren
          {...this.arDS.current.data}
          modalLineDS={this.modalLineDS}
          record={record}
          handleModalCodeChange={(newDS) => this.handleModalCodeChange(newDS, itemIndex, record)}
          handleModalCheckAll={(isCheckedAll) =>
            this.handleModalCheckAll(isCheckedAll, itemIndex, record)
          }
          handleModalSingleCheck={(value, modalLineIndex) =>
            this.handleModalSingleCheck(value, modalLineIndex, itemIndex, record)
          }
        />
      ),
    });
  };

  // 弹框更新数量
  handleChangeQuantity = (value, itemIndex) => {
    const submitLineList = this.state.submitLineList.slice();
    submitLineList[itemIndex].receivedQty = value;
    this.setState({
      submitLineList,
    });
  };

  // 行更新图片
  handleChangePictures = (value, itemIndex) => {
    const submitLineList = this.state.submitLineList.slice();
    submitLineList[itemIndex].pictures = value;
    this.setState({
      submitLineList,
    });
  };

  // 行更新备注
  handleChangeRemark = (value, itemIndex) => {
    const submitLineList = this.state.submitLineList.slice();
    submitLineList[itemIndex].lineRemark = value;
    this.setState({
      submitLineList,
    });
  };

  // 弹框新增数据
  handleModalCodeChange = async (ds, itemIndex, record) => {
    let submitLineList = this.state.submitLineList.slice();
    const { itemControlType } = this.state;
    let flag = false;
    submitLineList[itemIndex].receivedList.some((object) => {
      if (
        itemControlType === 'TAG'
          ? object.tagCode === ds.current.get('tagCode')
          : object.lotNumber === ds.current.get('lotNumber')
      ) {
        flag = true;
      }
      return flag;
    });

    if (flag) {
      notification.warning({
        message: '编码已存在',
      });
      ds.current.set('tagCode', '');
      ds.current.set('lotNumber', '');
      return;
    }

    submitLineList = submitLineList.map((v, i) => {
      if (i === itemIndex) {
        v.receivedList.unshift({ ...ds.current.data, isConfirmAdd: false });
      }
      return v;
    });
    this.setState(
      {
        submitLineList,
      },
      () => {
        this.modalLineDS.create({
          ...ds.current.data,
        });
        this.handleUpdateModal(record, itemIndex);
      }
    );
  };

  // 标签/批次打开弹框
  handleOpenModal = (record, itemIndex) => {
    if (this.state.itemControlType === 'QUANTITY') {
      return;
    }

    modal = Modal.open({
      key: Modal.key(),
      title: '添加数量',
      className: 'lwms-arrival-reception-modal',
      style: {
        width: '70%',
      },
      closable: true,
      children: (
        <ModalChildren
          {...this.arDS.current.data}
          modalLineDS={this.modalLineDS}
          record={record}
          handleModalCodeChange={(ds) => this.handleModalCodeChange(ds, itemIndex, record)}
          handleModalCheckAll={(isCheckedAll) =>
            this.handleModalCheckAll(isCheckedAll, itemIndex, record)
          }
          handleModalSingleCheck={(value, modalLineIndex) =>
            this.handleModalSingleCheck(value, modalLineIndex, itemIndex, record)
          }
        />
      ),
      onOk: () => this.handleModalAddNewList(itemIndex),
      onCancel: () => this.openSubModal(itemIndex),
    });
  };

  // 弹框 === 确认
  handleModalAddNewList = (itemIndex) => {
    const submitLineList = this.state.submitLineList.slice();
    let changedList = [];
    let total = 0;
    // changedList = submitLineList[itemIndex].receivedList.filter((v) => v.checkedFlag);
    changedList = submitLineList[itemIndex].receivedList.map((v) => {
      let _isConfirmAdd = false;
      if (v.checkedFlag) {
        total += v.receivedQty;
        _isConfirmAdd = true;
      }
      return { ...v, isConfirmAdd: _isConfirmAdd };
    });
    submitLineList[itemIndex].receivedQty = total;
    submitLineList[itemIndex].receivedList = [...changedList];
    this.setState({
      submitLineList,
    });
  };

  // 弹框 --- 取消
  openSubModal = async (itemIndex) => {
    const isClose = (await Modal.confirm('退出后不保存当前编辑，确认退出?')) === 'ok';
    const submitLineList = this.state.submitLineList.slice();
    if (isClose) {
      let changedList = [];
      changedList = submitLineList[itemIndex].receivedList.filter((v) => v.isConfirmAdd !== false);
      submitLineList[itemIndex].receivedList = [...changedList];
      this.setState({
        submitLineList,
      });
    }
    return isClose;
  };

  // 弹框 --- 全选
  handleModalCheckAll = (isCheckedAll, itemIndex, record) => {
    const submitLineList = this.state.submitLineList.slice();
    let changedList = [];
    changedList = submitLineList[itemIndex].receivedList.map((val) => ({
      ...val,
      checkedFlag: isCheckedAll,
    }));
    submitLineList[itemIndex].receivedList = [...changedList];
    submitLineList[itemIndex].checkedFlag = isCheckedAll;
    this.setState(
      {
        submitLineList,
      },
      () => {
        this.handleUpdateModal(record, itemIndex);
      }
    );
  };

  // 弹框 --- 单选
  handleModalSingleCheck = (value, modalLineIndex, itemIndex, record) => {
    const submitLineList = this.state.submitLineList.slice();
    submitLineList[itemIndex].receivedList[modalLineIndex].checkedFlag = value;
    const checkedAll = submitLineList[itemIndex].receivedList.every((v) => v.checkedFlag);
    submitLineList[itemIndex].checkedFlag = checkedAll;
    this.setState(
      {
        submitLineList,
      },
      () => {
        this.handleUpdateModal(record, itemIndex);
      }
    );
  };

  /**
   * 改变展开状态
   */
  changeOpenFlag = () => {
    this.setState((state) => ({
      openFlag: !state.openFlag,
    }));
  };

  // 物料选择
  handleItemChoose = (value) => {
    if (!this.arDS.current.get('organizationId')) {
      notification.warning({
        message: '请先选择组织!',
      });
      this.lineListDS.current.set('itemObj', null);
      return;
    }
    // 左侧标签列表有标签时，切换物料后添加提示：“物料已切换为{物料编码+物料描述}”
    const tagList = this.state.leftLineList.filter((v) => v.itemControlType === 'TAG');
    if (value && tagList.length > 0) {
      notification.info({
        message: `物料已切换为{${value.itemCode} ${value.description || ''}}`,
      });
    }
  };

  // 退出
  handleClose = async () => {
    const flag = (await Modal.confirm('退出后不保存当前编辑，确认退出?')) === 'ok';
    if (flag) {
      this.props.history.push('/workplace');
      closeTab('/pub/lwms/arrival-reception');
    }
  };

  // 重置
  handleReset = () => {
    const {
      workerLock,
      orgLock,
      warehouseLock,
      wmALock,
      partyLock,
      placeLock,
      partyDocNumLock,
    } = this.state;
    if (!workerLock) {
      this.arDS.current.set('workerObj', null);
    }
    if (!orgLock) {
      this.arDS.current.set('organizationObj', null);
    }
    if (!warehouseLock) {
      this.arDS.current.set('warehouseObj', null);
    }
    if (!wmALock) {
      this.arDS.current.set('wmAreaObj', null);
    }
    if (!partyLock) {
      this.arDS.current.set('partyObj', null);
    }
    if (!placeLock) {
      this.arDS.current.set('placeObj', null);
    }
    if (!partyDocNumLock) {
      this.arDS.current.set('partyDocumentNumber', '');
    }
  };

  // 提交
  handleSubmit = async () => {
    if (!this.state.submitLineList.length) {
      notification.warning({
        message: '请先录入数据!',
      });
      return;
    }

    const headerInfo = this.arDS.current.data;
    let checkedList = this.state.submitLineList.filter((v) => v.checkedFlag);
    checkedList = checkedList.map((v) => {
      const _receivedList = v.receivedList.filter((item) => item.checkedFlag === true);
      let processPictures = '';
      if (v.pictures) {
        v.pictures.forEach((item) => {
          processPictures = processPictures === '' ? item.url : `${processPictures}#${item.url}`;
        });
      }
      return {
        ...v,
        pictures: processPictures,
        receivedList: _receivedList,
      };
    });

    if (!checkedList.length) {
      notification.warning({
        message: '请选中接收信息, 校验不通过!',
      });
      return;
    }

    const params = [
      {
        ...headerInfo.organizationObj,
        receiveWorkerId: headerInfo.workerObj.workerId,
        receiveWorker: headerInfo.workerObj.workerCode,
        partyId: headerInfo.partyObj.partyId,
        partyNumber: headerInfo.partyObj.partyNumber,
        partySiteId: headerInfo.placeObj ? headerInfo.placeObj.supplierSiteId : '',
        partySiteNumber: headerInfo.placeObj ? headerInfo.placeObj.supplierSiteNumber : '',
        shipTicket: headerInfo.partyDocumentNumber || '',
        remark: headerInfo.remark || '',
        actualArrivalTime: moment().format(DEFAULT_DATETIME_FORMAT),
        lineList: checkedList,
      },
    ];
    this.setState({
      loading: true,
    });
    const res = await supplierReceive(params);
    if (getResponse(res) && !res.failed) {
      notification.success({
        message: '完成接收，送货单已生成!',
      });
    }
    this.handleReset();
    this.setState({
      submitLineList: this.state.submitLineList.filter((v) => !v.checkedFlag),
      loading: false,
    });
  };

  render() {
    const headerObj = this.arDS.current.data;
    const { itemControlType, submitLineList, leftLineList } = this.state;
    const checkedList = leftLineList.filter((v) => v.checkedFlag);
    let checkedQua = 0;
    let totalQua = 0;
    checkedList.forEach((val) => {
      checkedQua += parseFloat(val.receivedQty);
      return checkedQua;
    });
    leftLineList.forEach((val) => {
      totalQua += parseFloat(val.receivedQty);
      return totalQua;
    });
    return (
      <div className="lwms-arrival-reception">
        <Spin spinning={this.state.loading}>
          <div id="lwms-arrival-reception-wrapper">
            <div className="lwms-arrival-reception-header">
              <Head />
            </div>
            <div className="arrival-reception-sub-header">
              <div className="avator-img">
                <img src={this.state.fileUrl || defaultAvatarIcon} alt="" />
              </div>
              <div className="sub-header-right">
                <Row>
                  <Col className="gutter-row" span={6}>
                    <LovSelect
                      leftIcon={workerIcon}
                      rightIcon={this.state.workerLock ? lockIcon : unlockIcon}
                      headerDS={this.arDS}
                      name="workerObj"
                      placeholder="操作工"
                      onQuery={(value) => this.handleQueryChange(value, 'workerObj')}
                      onLockChange={this.onLockChange}
                    />
                  </Col>
                  <Col className="gutter-row" span={6}>
                    <LovSelect
                      leftIcon={orgIcon}
                      rightIcon={this.state.orgLock ? lockIcon : unlockIcon}
                      headerDS={this.arDS}
                      name="organizationObj"
                      onLockChange={this.onLockChange}
                      onQuery={(value) => this.handleQueryChange(value, 'organizationObj')}
                      placeholder="组织"
                    />
                  </Col>
                  <Col className="gutter-row" span={6}>
                    <LovSelect
                      leftIcon={warehouseIcon}
                      rightIcon={this.state.warehouseLock ? lockIcon : unlockIcon}
                      headerDS={this.arDS}
                      name="warehouseObj"
                      placeholder="执行仓库"
                      onQuery={(value) => this.handleQueryChange(value, 'warehouseObj')}
                      onLockChange={this.onLockChange}
                    />
                  </Col>
                  <Col className="gutter-row" span={6}>
                    <LovSelect
                      leftIcon={wmIcon}
                      rightIcon={this.state.wmALock ? lockIcon : unlockIcon}
                      headerDS={this.arDS}
                      name="wmAreaObj"
                      onLockChange={this.onLockChange}
                      placeholder="货位"
                    />
                  </Col>
                </Row>
                <Row className="row-second">
                  <Col className="gutter-row" span={6}>
                    <LovSelect
                      leftIcon={supplierIcon}
                      rightIcon={this.state.partyLock ? lockIcon : unlockIcon}
                      headerDS={this.arDS}
                      name="partyObj"
                      placeholder="供应商"
                      onQuery={(value) => this.handleQueryChange(value, 'partyObj')}
                      onLockChange={this.onLockChange}
                    />
                  </Col>
                  <Col className="gutter-row" span={6}>
                    <LovSelect
                      leftIcon={placeIcon}
                      rightIcon={this.state.placeLock ? lockIcon : unlockIcon}
                      headerDS={this.arDS}
                      name="placeObj"
                      placeholder="供应商地点"
                      onQuery={(value) => this.handleQueryChange(value, 'placeObj')}
                      onLockChange={this.onLockChange}
                    />
                  </Col>
                  <Col className="gutter-row" span={6}>
                    <TextSelect
                      leftIcon={documentIcon}
                      rightIcon={this.state.partyDocNumLock ? lockIcon : unlockIcon}
                      headerDS={this.arDS}
                      name="partyDocumentNumber"
                      placeholder="供方单据号"
                      onQuery={(value) => this.handleQueryChange(value, 'partyDocumentNumber')}
                      onLockChange={this.onLockChange}
                    />
                  </Col>
                  <Col className="gutter-row" span={6}>
                    <TextSelect
                      leftIcon={ReasonIcon}
                      headerDS={this.arDS}
                      name="remark"
                      placeholder="备注"
                    />
                  </Col>
                </Row>
              </div>
            </div>
            <div className="lwms-arrival-reception-content">
              <div className="arrival-reception-content-left">
                <div className="reception-content-left-top">
                  <div>
                    <Button
                      className={this.state.itemControlType === 'QUANTITY' ? 'active-button' : ''}
                      onClick={() => this.selectItemControlType('QUANTITY')}
                    >
                      <img
                        src={
                          this.state.itemControlType === 'QUANTITY'
                            ? numberSelected
                            : numberUnselected
                        }
                        alt=""
                      />
                      数量
                    </Button>
                    <Button
                      className={this.state.itemControlType === 'LOT' ? 'active-button' : ''}
                      onClick={() => this.selectItemControlType('LOT')}
                    >
                      <img
                        src={this.state.itemControlType === 'LOT' ? lotSelected : lotUnselected}
                        alt=""
                      />
                      批次
                    </Button>
                    <Button
                      className={this.state.itemControlType === 'TAG' ? 'active-button' : ''}
                      onClick={() => this.selectItemControlType('TAG')}
                    >
                      <img
                        src={this.state.itemControlType === 'TAG' ? tagSelected : tagUnSelected}
                        alt=""
                      />
                      标签
                    </Button>
                  </div>
                  <Button onClick={() => this.stageState()} className="active-button submit-button">
                    确认
                  </Button>
                </div>
                <div className="reception-content-left-list">
                  <Form dataSet={this.lineListDS} labelLayout="placeholder" columns={2}>
                    <TextField
                      id="textNode"
                      name={itemControlType === 'LOT' ? 'lotNumber' : 'tagCode'}
                      colSpan={2}
                      label={itemControlType === 'TAG' ? '标签号' : '批次号'}
                      onChange={this.handleCodeChange}
                    />
                    <Lov name="itemObj" colSpan={1} label="物料" onChange={this.handleItemChoose} />
                    <NumberField name="receivedQty" colSpan={1} label="数量" />
                  </Form>
                  {this.state.openFlag ? (
                    <>
                      <Form dataSet={this.lineListDS} labelLayout="placeholder" columns={2}>
                        <DateTimePicker name="madeDate" colSpan={1} label="制造日期" />
                        <DateTimePicker name="expireDate" colSpan={1} label="失效日期" />
                        <TextField name="partyLotNumber" colSpan={1} label="供应商批次" />
                        <TextField name="manufacturer" colSpan={1} label="制造商" />
                        <TextField name="material" colSpan={1} label="材料" />
                        <TextField name="materialSupplier" colSpan={1} label="材料供应商" />
                        <TextField name="materialLotNumber" colSpan={1} label="材料批次" />
                      </Form>
                      <div colSpan={2} className="flag-icon-box">
                        <img
                          className="flag-icon"
                          src={this.state.openFlag ? openIcon : closeIcon}
                          alt=""
                          onClick={this.changeOpenFlag}
                        />
                      </div>
                    </>
                  ) : (
                    <div colSpan={2} className="flag-icon-box">
                      <img
                        className="flag-icon"
                        src={this.state.openFlag ? openIcon : closeIcon}
                        alt=""
                        onClick={this.changeOpenFlag}
                      />
                    </div>
                  )}
                  {itemControlType !== 'QUANTITY' && leftLineList.length ? (
                    <div className="tag-list">
                      <table className="tag-table">
                        <thead>
                          <tr>
                            <th>
                              <Checkbox
                                name="checkedAll"
                                checked={this.state.checkedAll}
                                onChange={() => this.handleCheckbox('all')}
                              />
                            </th>
                            <th>
                              {itemControlType === 'TAG' ? '标签' : '批次'}数：
                              {`${checkedList.length}/${leftLineList.length}`}
                            </th>
                            <th>{`${checkedQua || 0}/${totalQua || 0}`}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {leftLineList.map((v, index) => {
                            return (
                              <tr key={uuidv4()}>
                                <td>
                                  <Checkbox
                                    name="checkedFlag"
                                    checked={v.checkedFlag}
                                    onChange={() => this.handleCheckbox('single', index)}
                                  />
                                </td>
                                <td>{v.tagCode || v.lotNumber}</td>
                                <td>{v.receivedQty}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="arrival-reception-content-right">
                {submitLineList.length
                  ? submitLineList.map((v, index) => {
                      const even = index % 2 === 1 ? 'even' : null;
                      return (
                        <Line
                          key={uuidv4()}
                          even={even}
                          {...v}
                          {...headerObj}
                          onChecked={(value) => this.handleRightCheck(value, index)}
                          onChangeQuantity={(value) => this.handleChangeQuantity(value, index)}
                          handleOpenModal={() => this.handleOpenModal(v, index)}
                          onChangePictures={(value) => this.handleChangePictures(value, index)}
                          onChangeRemark={(value) => this.handleChangeRemark(value, index)}
                        />
                      );
                    })
                  : null}
              </div>
            </div>
            <div className="lwms-arrival-reception-footer">
              <Footer
                onClose={this.handleClose}
                onReset={this.handleReset}
                onSubmit={this.handleSubmit}
              />
            </div>
          </div>
        </Spin>
      </div>
    );
  }
}

export default ArrivalReception;
