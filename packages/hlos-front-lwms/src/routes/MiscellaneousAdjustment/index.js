/*
 * @Author: chunyan.liang <chunyan.liang@hand-china.com>
 * @Date: 2020-07-09 15:30:04
 * @LastEditTime: 2021-03-06 16:50:37
 * @Description:杂项调整
 */
import React, { Component } from 'react';
import { Button, DataSet, Row, Col, Lov, TextField, NumberField } from 'choerodon-ui/pro';
import { isEmpty } from 'lodash';
import { Spin } from 'choerodon-ui';

import intl from 'utils/intl';
import { getCurrentOrganizationId, getCurrentUserId, getResponse } from 'utils/utils';
import moment from 'moment';
import notification from 'utils/notification';

import {
  getQuantityPicking,
  getsundrySendOut,
  getSundryAccept,
  costCenterIn,
  costCenterOut,
  userSetting,
  checkControlType,
} from '@/services/miscellaneousAdjustmentService';
// import { getCurrentOrganizationId } from 'utils/utils';

import { miscellaneousAdjustmentDS } from '@/stores/miscellaneousAdjustmentDS';
import logo from 'hlos-front/lib/assets/icons/logo.svg';
import allSelectButton from 'hlos-front/lib/assets/icons/check.svg';
import deletButton from 'hlos-front/lib/assets/icons/delete-button.svg';
import submitButton from 'hlos-front/lib/assets/icons/submit.svg';
import lock from 'hlos-front/lib/assets/icons/lock.svg';
import unLock from 'hlos-front/lib/assets/icons/un-lock.svg';
import warehouseIcon from 'hlos-front/lib/assets/icons/warehouse.svg';
import wmAreaImg from 'hlos-front/lib/assets/icons/wm-area.svg';
import userImg from 'hlos-front/lib/assets/icons/user.svg';
import reasonImg from 'hlos-front/lib/assets/icons/reason.svg';
import organizationImg from 'hlos-front/lib/assets/icons/operation.svg';
import worker from 'hlos-front/lib/assets/icons/processor.svg';
// import lotSelected from 'hlos-front/lib/assets/icons/lot-selected.svg';
// import lotUnselected from 'hlos-front/lib/assets/icons/lot-unselect.svg';
// import tagSelected from 'hlos-front/lib/assets/icons/tag-selected.svg';
// import tagUnselected from 'hlos-front/lib/assets/icons/tag-unselect.svg';
// import numberSeleced from 'hlos-front/lib/assets/icons/number-selected.svg';
// import numberUnseleced from 'hlos-front/lib/assets/icons/number-unselect.svg';
import scan from 'hlos-front/lib/assets/icons/scan.svg';
import defaultAvator from 'hlos-front/lib/assets/img-default-avator.png';
import buttonExit from 'hlos-front/lib/assets/icons/exit.svg';
import { Clock, Line, TagLine } from './components';
import styles from './index.module.less';

const intlPrefix = 'lwms.miscellaneousAdjustment.model';
const organizationId = getCurrentOrganizationId();
const userId = getCurrentUserId();

class MiscellaneousAdjustment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      adjustDirectionFlag: 1, // 1 杂入 0 杂出
      pickingType: 'QUANTITY',
      numberList: [],
      tagList: [],
      lotList: [],
      allSelectFlag: false,
      workerUrl: '',
      wareHouseClockFlag: false,
      itemClockFlag: false,
      loading: false, // 加载数据
    };
  }

  ds = new DataSet(miscellaneousAdjustmentDS());

  adjustDirection(value) {
    if (this.state.numberList.length || this.state.tagList.length || this.state.lotList.length) {
      notification.warning({
        message: '数量，批次或标签下有值，请先执行提交',
      });
    } else {
      this.setState({
        adjustDirectionFlag: value,
      });
    }
  }

  // 根据物料选择的控制类型切换输入框
  async handleItemChange(value) {
    if (!value) return;
    const _data = this.ds.toJSONData();

    const resp = await checkControlType([
      {
        organizationId: _data[0].organizationObj.organizationId,
        warehouseId: _data[0].warehouseObj.warehouseId,
        itemId: value.itemId,
        tenantId: getCurrentOrganizationId(),
        groupId: '2021', // 传入的值不做参考
      },
    ]);
    if (getResponse(resp) && resp.length) {
      const _itemControlType = resp[0].itemControlType;
      this.setState({
        pickingType: _itemControlType,
      });
      this.ds.current.set('pickingType', _itemControlType);

      // 切换方式重置数据
      this.ds.current.set('lotObj', {});
      this.ds.current.set('tagObj', {});
      this.ds.current.set('existQuantity', null);
      if (_itemControlType === 'QUANTITY') {
        this.ds.fields.get('warehouseObj').set('dynamicProps', {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        });
      } else if (_itemControlType === 'TAG') {
        this.ds.fields.get('warehouseObj').set('dynamicProps', {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
            tagFlag: 1,
          }),
        });
      } else if (_itemControlType === 'LOT') {
        this.ds.fields.get('warehouseObj').set('dynamicProps', {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
            lotFlag: 1,
          }),
        });
      }
    }
  }

  async defaultUserSetting(ds) {
    await userSetting({
      userId,
      queryCodeFlag: 'Y',
    }).then((res) => {
      if (res && res.content && res.content[0]) {
        ds.current.set('meOuId', res.content[0].meOuId);
        ds.current.set('meOuName', res.content[0].meOuName);
        ds.current.set('organizationObj', {
          organizationId: res.content[0].organizationId,
          organizationName: res.content[0].organizationName,
          organizationCode: res.content[0].organizationCode,
        });
        ds.current.set('workerObj', {
          workerId: res.content[0].workerId,
          workerName: res.content[0].workerName,
          workerCode: res.content[0].workerCode,
          workerUrl: res.content[0].fileUrl,
        });
        this.setState({
          workerUrl: res.content[0].fileUrl,
        });
      }
    });
  }

  /**
   *请求数量获取批次的数据
   *
   * @memberof MiscellaneousAdjustment
   */
  async queryQuantityPicking(value) {
    let result = {};
    await getQuantityPicking({
      warehouseId: this.ds.current.get('warehouseId'),
      wmAreaId: this.ds.current.get('wmAreaId'),
      itemId: this.ds.current.get('itemId'),
      lotNumber: this.ds.current.get('lotNumber'),
      pickingType: value || '',
    }).then((res) => {
      if (res.failed) {
        notification.error({
          message: res.message,
        });
      }
      result = res;
    });
    return result;
  }

  /**
   *标签杂发 发出
   *
   * @memberof MiscellaneousAdjustment
   */

  async queryTagSendOut() {
    let result = {};
    await getsundrySendOut({
      tagCode: this.ds.current.get('tagCode'),
      organizationId,
      defaultOrganizationId: this.ds.current.get('organizationId'),
      warehouseId: this.ds.current.get('warehouseId'),
      wmAreaId: this.ds.current.get('wmAreaId'),
      itemId: this.ds.current.get('itemId'),
    }).then((res) => {
      if (res.failed) {
        notification.error({
          message: res.message,
        });
      }
      result = res;
    });
    return result;
  }

  async queryTagAccept() {
    let result = {};
    await getSundryAccept({
      tagCode: this.ds.current.get('tagCode'),
      organizationId,
      itemId: this.ds.current.get('itemId'),
    }).then((res) => {
      if (res.failed) {
        notification.error({
          message: res.message,
        });
      }
      result = res;
    });
    return result;
  }

  async handleAdd() {
    if (
      !this.ds.current.get('warehouseId') ||
      !this.ds.current.get('itemId') ||
      !this.ds.current.get('workerId') ||
      !this.ds.current.get('costCenterId')
    ) {
      notification.error({
        message: '请完整填写必输项',
      });
      return;
    }
    if (this.state.pickingType === 'LOT' && !this.ds.current.get('lotNumber')) {
      return;
    }
    let resp = {};
    if (!this.state.adjustDirectionFlag) {
      const params = this.state.pickingType === 'QUANTITY' ? 'quantity' : 'lot';
      resp = await this.queryQuantityPicking(params);
      if (resp.failed) {
        return;
      }
    }
    if (this.state.pickingType === 'QUANTITY') {
      if (this.state.adjustDirectionFlag) {
        resp = {
          quantity: this.ds.current.get('existQuantity'),
          itemCode: this.ds.current.get('itemCode'),
          itemName: this.ds.current.get('itemDescription'),
          itemDesc: this.ds.current.get('itemDescription'),
          itemId: this.ds.current.get('itemId'),
          expireDate: null,
          supplierId: null,
          supplierName: null,
          uomName: this.ds.current.get('uomName'),
          uom: this.ds.current.get('uom'),
          uomId: this.ds.current.get('uomId'),
        };
        // return;
        if (isEmpty(resp)) {
          return;
        }
      }
      if (this.ds.current.get('existQuantity') > resp.quantity) {
        notification.warning({
          message: `输入数量不可大于现有量${resp.quantity}`,
        });
      } else {
        const addList = this.state.numberList.filter((element) => element.itemId === resp.itemId);
        if (!addList.length) {
          const newObj = {
            checked: true,
            ...resp,
            existQuantity: resp.quantity,
            quantity: this.ds.current.get('existQuantity'),
          };
          this.setState({
            numberList: [newObj, ...this.state.numberList],
          });
        } else {
          notification.warning({
            message: `物料 ${resp.itemCode} 已添加，请勿重复添加`,
          });
        }
      }
    } else if (this.state.pickingType === 'LOT') {
      if (this.ds.current.get('lotNumber')) {
        if (isEmpty(resp) && this.state.adjustDirectionFlag) {
          resp = {
            lotNumber: this.ds.current.get('lotNumber'),
            quantity: 0,
            itemCode: this.ds.current.get('itemCode'),
            itemName: this.ds.current.get('itemDescription'),
            itemId: this.ds.current.get('itemId'),
            expireDate: null,
            supplierId: null,
            supplierName: null,
            uomName: this.ds.current.get('uomName'),
            uom: this.ds.current.get('uom'),
            uomId: this.ds.current.get('uomId'),
          };
        }
        if (isEmpty(resp)) {
          notification.warning({
            message: `当前批次库存为0，无法发出！`,
          });
          return;
        }
        const addFlag = this.state.lotList.every(
          (element) => element.lotNumber !== resp.lotNumber || element.itemId !== resp.itemId
        );
        if (addFlag) {
          const newObj = {
            checked: true,
            ...resp,
            itemName: resp.itemDesc || resp.itemName,
            existQuantity: resp.quantity,
          };
          this.setState({
            lotList: [newObj, ...this.state.lotList],
          });
        } else {
          notification.error({
            message: `批次 ${resp.lotNumber} 已添加，请勿重复添加`,
          });
        }
        // 添加后活无批次清空
        if (this.state.adjustDirectionFlag) {
          this.ds.current.set('lotNumber', '');
        }
      }
    }
  }

  async handleTagAdd() {
    if (this.state.adjustDirectionFlag && this.ds.current.get('tagCode')) {
      // tag 杂入
      // 判断必输项
      if (
        !this.ds.current.get('warehouseId') ||
        !this.ds.current.get('itemId') ||
        !this.ds.current.get('workerId') ||
        !this.ds.current.get('costCenterId')
      ) {
        notification.error({
          message: '请完整填写必输项',
        });
        return;
      }
      const resp = {
        tagCode: this.ds.current.get('tagCode'),
        quantity: 0,
        itemCode: this.ds.current.get('itemCode'),
        itemName: this.ds.current.get('itemDescription'),
        itemId: this.ds.current.get('itemId'),
        expireDate: null,
        supplierId: null,
        supplierName: null,
        uomName: this.ds.current.get('uomName'),
        uom: this.ds.current.get('uom'),
        uomId: this.ds.current.get('uomId'),
      };
      if (isEmpty(resp)) {
        return;
      }
      const addFlag = this.state.tagList.every(
        (element) => element.tagCode !== resp.tagCode || element.itemId !== resp.itemId
      );
      if (addFlag) {
        const newObj = {
          checked: true,
          itemName: resp.itemDescription,
          ...resp,
        };
        this.setState({
          tagList: [newObj, ...this.state.tagList],
        });
      } else {
        notification.warning({
          message: `标签 ${resp.tagCode} 已添加，请勿重复添加`,
        });
      }
      this.ds.current.set('tagCode', '');
    } else if (!this.adjustDirectionFlag && this.ds.current.get('tagCode')) {
      if (!this.ds.current.get('warehouseId') || !this.ds.current.get('workerId')) {
        notification.error({
          message: '请完整填写必输项',
        });
        return;
      }
      const resp = await this.queryTagSendOut();
      if (resp.failed) {
        return;
      }
      if (!isEmpty(resp)) {
        const addList = this.state.tagList.filter((element) => element.tagCode === resp.tagCode);
        if (!addList.length) {
          const newList = [];
          resp.forEach((item) => {
            newList.push({
              checked: true,
              ...item,
            });
          });
          // const newObj = {
          //   checked: true,
          //   ...resp,
          // };
          this.setState({
            tagList: [...newList, ...this.state.tagList],
          });
          this.ds.current.set('tagObj', null);
        } else {
          notification.warning({
            message: `标签 ${resp.tagCode} 已添加，请勿重复添加`,
          });
        }
      } else {
        notification.warning({
          message: `当前标签库存为0，无法发出！`,
        });
      }
    }
  }

  handleChecked = (index, checkFlag) => {
    if (this.state.pickingType === 'QUANTITY') {
      const newList = this.state.numberList.slice();
      newList[index].checked = checkFlag;
      this.setState({
        numberList: newList,
      });
    } else if (this.state.pickingType === 'LOT') {
      const newList = this.state.lotList.slice();
      newList[index].checked = checkFlag;
      this.setState({
        lotList: newList,
      });
    } else if (this.state.pickingType === 'TAG') {
      const newList = this.state.tagList.slice();
      newList[index].checked = checkFlag;
      this.setState({
        tagList: newList,
      });
    }
  };

  handleChangeQuantity = (index, value) => {
    if (this.state.pickingType === 'QUANTITY') {
      const newList = this.state.numberList.slice();
      newList[index].quantity = value;
      this.setState({
        numberList: newList,
      });
    } else if (this.state.pickingType === 'LOT') {
      const newList = this.state.lotList.slice();
      newList[index].quantity = value;
      this.setState({
        lotList: newList,
      });
    } else if (this.state.pickingType === 'TAG') {
      const newList = this.state.tagList.slice();
      newList[index].quantity = value;
      this.setState({
        tagList: newList,
      });
    }
    if (value && value !== 0) {
      this.handleChecked(index, true);
    } else {
      this.handleChecked(index, false);
    }
  };

  /**
   *修改后的现有量
   *
   * @memberof MiscellaneousAdjustment
   */
  ChangeExistQuantity() {}

  async allSelect() {
    await this.setState({
      allSelectFlag: !this.state.allSelectFlag,
    });
    if (this.state.pickingType === 'QUANTITY') {
      const newList = this.state.numberList.slice();
      newList.forEach((element) => {
        const changeObj = element;
        changeObj.checked = this.state.allSelectFlag;
      });
      this.setState({
        numberList: newList,
      });
    } else if (this.state.pickingType === 'LOT') {
      const newList = this.state.lotList.slice();
      newList.forEach((element) => {
        const changeObj = element;
        changeObj.checked = this.state.allSelectFlag;
      });
      this.setState({
        lotList: newList,
      });
    } else if (this.state.pickingType === 'TAG') {
      const newList = this.state.tagList.slice();
      newList.forEach((element) => {
        const changeObj = element;
        changeObj.checked = this.state.allSelectFlag;
      });
      this.setState({
        tagList: newList,
      });
    }
  }

  // 退出

  handleExit() {
    history.back();
  }

  handleDelet() {
    this.ds.current.set('lotObj', {});
    this.ds.current.set('tagObj', {});
    if (this.state.pickingType === 'QUANTITY') {
      const newList = this.state.numberList.slice();
      const keepArray = newList.filter((element) => !element.checked);
      this.setState({
        numberList: keepArray,
      });
    } else if (this.state.pickingType === 'LOT') {
      const newList = this.state.lotList.slice();
      const keepArray = newList.filter((element) => !element.checked);
      this.setState({
        lotList: keepArray,
      });
    } else if (this.state.pickingType === 'TAG') {
      const newList = this.state.tagList.slice();
      const keepArray = newList.filter((element) => !element.checked);
      this.setState({
        tagList: keepArray,
      });
    }
    this.setState({
      allSelectFlag: false,
    });
  }

  /**
   *提交执行
   *
   * @memberof MiscellaneousAdjustment
   */
  async handleSubmit() {
    let checkedFlag = false;
    let submitList = [];
    if (this.state.pickingType === 'QUANTITY') {
      checkedFlag = this.state.numberList.some((ele) => ele.checked);
      submitList = this.state.numberList.slice();
    } else if (this.state.pickingType === 'TAG') {
      checkedFlag = this.state.tagList.some((ele) => ele.checked);
      submitList = this.state.tagList.slice();
    } else if (this.state.pickingType === 'LOT') {
      checkedFlag = this.state.lotList.some((ele) => ele.checked);
      submitList = this.state.lotList.slice();
    }
    if (checkedFlag) {
      await this.handleInProcessData(submitList);
    } else {
      notification.warning({
        message: '请选择要提交的数据',
      });
    }
  }

  // 处理数据，并调接口
  async handleInProcessData(list) {
    this.setState({
      loading: true,
    });
    const submitList = list.map((i) => ({
      ...i,
      organizationId: this.ds.current.get('organizationId'),
      organizationCode: this.ds.current.get('organizationCode'),
      itemControlType: this.state.pickingType,
      costCenterId: this.ds.current.get('costCenterId'),
      costCenterCode: this.ds.current.get('costCenterCode'),
      warehouseId: this.ds.current.get('warehouseId'),
      warehouseCode: this.ds.current.get('warehouseCode'),
      wmAreaId: this.ds.current.get('wmAreaId'),
      wmAreaCode: this.ds.current.get('wmAreaCode'),
      workerId: this.ds.current.get('workerId'),
      worker: this.ds.current.get('workerName'),
      wmInTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      remark: this.ds.current.get('remark'),
      [this.state.adjustDirectionFlag
        ? 'costCenterInDetailDtoList'
        : 'costCenterOutDetailDtoList']: [
        {
          lotNumber: i.lotNumber || null,
          lotId: i.lotId || null,
          tagCode: i.tagCode || null,
          tagId: i.tagId || null,
          [this.state.adjustDirectionFlag ? 'wmInQty' : 'wmOutQty']: i.quantity || 0,
        },
      ],
    }));
    let res;
    if (this.state.adjustDirectionFlag) {
      res = await costCenterIn(submitList);
    } else {
      res = await costCenterOut(submitList);
    }
    this.setState({
      loading: false,
    });
    if (res && res.failed) {
      notification.error({
        message: res.message,
      });
    } else {
      notification.success({
        message: '执行成功',
      });
      this.handleDelet();
    }
  }

  // 选择工作人员
  handleChangeWorker() {
    const workerUrl = this.ds.current.get('workerUrl');
    this.setState({
      workerUrl,
    });
    this.ds.current.set('warehouseObj', {});
    if (!this.ds.current.get('workerId')) {
      this.setState({
        wareHouseClockFlag: true,
      });
      this.ds.fields.get('warehouseObj').set('dynamicProps', {
        disabled: () => {
          return true;
        },
      });
    } else {
      this.setState({
        wareHouseClockFlag: false,
      });
      this.ds.fields.get('warehouseObj').set('dynamicProps', {
        disabled: () => {
          return false;
        },
      });
    }
  }

  async changeClock(value) {
    if (value === 'wareHouse') {
      await this.setState({
        wareHouseClockFlag: !this.state.wareHouseClockFlag,
      });
      if (this.state.wareHouseClockFlag) {
        this.ds.fields.get('warehouseObj').set('dynamicProps', {
          disabled: () => {
            return true;
          },
        });
      } else {
        this.ds.fields.get('warehouseObj').set('dynamicProps', {
          disabled: () => {
            return false;
          },
        });
      }
    } else if (value === 'item') {
      await this.setState({
        itemClockFlag: !this.state.itemClockFlag,
      });
      if (this.state.itemClockFlag) {
        this.ds.fields.get('itemObj').set('dynamicProps', {
          disabled: () => {
            return true;
          },
        });
      } else {
        this.ds.fields.get('itemObj').set('dynamicProps', {
          disabled: () => {
            return false;
          },
        });
      }
    }
  }

  componentDidMount() {
    this.defaultUserSetting(this.ds);
  }

  render() {
    return (
      <div className={styles['miscellaneous-adjustment']}>
        <div className={styles.header}>
          <img src={logo} alt="logo图" />
          <Clock />
        </div>
        <div className={styles.content}>
          <div className={styles['content-header']}>
            <img src={this.state.workerUrl ? this.state.workerUrl : defaultAvator} alt="logo图" />
            <div className={styles.filter}>
              <div className={styles['filter-first-line']}>
                <Row gutter={10} className={styles['line-row']}>
                  <Col span={6}>
                    <div className={styles['adjust-direction']}>
                      <span>调整方向 </span>
                      <Button
                        icon="arrow_downward"
                        className={
                          this.state.adjustDirectionFlag ? `${styles['active-button']}` : ''
                        }
                        onClick={() => this.adjustDirection(1)}
                      >
                        入
                      </Button>
                      <Button
                        icon="arrow_upward"
                        className={
                          !this.state.adjustDirectionFlag ? `${styles['active-button']}` : ''
                        }
                        onClick={() => this.adjustDirection(0)}
                      >
                        出
                      </Button>
                    </div>
                  </Col>
                  <Col span={6}>
                    <div className={styles['lov-select']}>
                      <img src={organizationImg} alt="" className={styles['left-icon']} />
                      <Lov placeholder="组织" dataSet={this.ds} name="organizationObj" disabled />
                    </div>
                  </Col>
                  <Col span={6}>
                    <div
                      className={`${styles['lov-select']} ${styles['have-right-icon']} ${
                        this.state.wareHouseClockFlag ? styles['lov-select-disabled'] : ''
                      }`}
                    >
                      <img src={warehouseIcon} alt="" className={styles['left-icon']} />
                      <Lov
                        placeholder="执行仓库"
                        dataSet={this.ds}
                        name="warehouseObj"
                        noCache
                        className={styles['lov-content']}
                      />
                      <img
                        src={this.state.wareHouseClockFlag ? lock : unLock}
                        alt=""
                        className={styles['right-icon']}
                        onClick={() => this.changeClock('wareHouse')}
                      />
                    </div>
                  </Col>
                  <Col span={6}>
                    <div className={styles['lov-select']}>
                      <img src={wmAreaImg} alt="" className={styles['left-icon']} />
                      <Lov
                        disabled={this.ds.current.data.wmAreaFlag}
                        dataSet={this.ds}
                        name="wmAreaObj"
                        noCache
                        className={styles['lov-content']}
                      />
                    </div>
                  </Col>
                </Row>
              </div>
              <div className={styles['filter-second-line']}>
                <Row gutter={10} className={styles['line-row']}>
                  <Col span={6}>
                    <div className={styles['lov-select']}>
                      <img src={worker} alt="" className={styles['left-icon']} />
                      <Lov
                        placeholder="操作工"
                        dataSet={this.ds}
                        name="workerObj"
                        noCache
                        className={styles['lov-content']}
                        onChange={() => this.handleChangeWorker()}
                      />
                    </div>
                  </Col>
                  <Col span={6}>
                    <div className={styles['lov-select']}>
                      <img src={userImg} alt="" className={styles['left-icon']} />
                      <Lov placeholder="调整账户" dataSet={this.ds} name="costCenterObj" noCache />
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className={styles['lov-select']}>
                      <img src={reasonImg} alt="" className={styles['left-icon']} />
                      <TextField placeholder="调整原因" dataSet={this.ds} name="remark" />
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
          <div className={styles['content-container']}>
            <div className={styles['container-header']}>
              <Row gutter={10}>
                {(this.state.pickingType === 'QUANTITY' ||
                  this.state.pickingType === 'LOT' ||
                  this.state.pickingType === 'TAG') && (
                  <Col span={6}>
                    <div
                      className={`${styles['lov-select']} ${styles['have-right-icon']} ${
                        this.state.itemClockFlag ? styles['lov-select-disabled'] : ''
                      }`}
                    >
                      <Lov
                        dataSet={this.ds}
                        name="itemObj"
                        noCache
                        className={styles['lov-content']}
                        placeholder="物料"
                        onChange={(value) => this.handleItemChange(value)}
                      />
                      <img
                        src={this.state.itemClockFlag ? lock : unLock}
                        alt=""
                        className={styles['right-icon']}
                        onClick={() => this.changeClock('item')}
                      />
                    </div>
                  </Col>
                )}
                {(this.state.pickingType === 'TAG' || this.state.pickingType === 'LOT') &&
                  !this.state.adjustDirectionFlag && (
                    <Col span={8}>
                      <div className={`${styles['lov-select']} ${styles['have-right-icon']}`}>
                        <Lov
                          dataSet={this.ds}
                          name={this.state.pickingType === 'LOT' ? 'lotObj' : 'tagObj'}
                          onChange={
                            this.state.pickingType === 'TAG'
                              ? () => this.handleTagAdd()
                              : () => this.handleAdd()
                          }
                          placeholder={
                            this.state.pickingType === 'LOT'
                              ? '请扫描物料批次号/查找批次'
                              : '请扫描物料标签号/查找标签'
                          }
                        />
                        <img src={scan} alt="" className={styles['right-icon']} />
                      </div>
                    </Col>
                  )}
                {(this.state.pickingType === 'TAG' || this.state.pickingType === 'LOT') &&
                  this.state.adjustDirectionFlag && (
                    <Col span={8}>
                      <div className={styles['lov-select']}>
                        <TextField
                          dataSet={this.ds}
                          name={this.state.pickingType === 'LOT' ? 'lotNumber' : 'tagCode'}
                          onEnterDown={
                            this.state.pickingType === 'TAG'
                              ? () => this.handleTagAdd()
                              : () => this.handleAdd()
                          }
                          placeholder={
                            this.state.pickingType === 'LOT'
                              ? '请扫描物料批次号/查找批次'
                              : '请扫描物料标签号/查找标签'
                          }
                        />
                        <img src={scan} alt="" className={styles['right-icon']} />
                      </div>
                    </Col>
                  )}
                {this.state.pickingType === 'QUANTITY' && (
                  <Col span={6}>
                    <div className={`${styles['lov-select']} ${styles['have-right-icon']}`}>
                      <NumberField
                        dataSet={this.ds}
                        name="existQuantity"
                        onChange={() => {
                          this.ChangeExistQuantity();
                        }}
                        onEnterDown={() => this.handleAdd()}
                        placeholder="请输入数量"
                      />
                    </div>
                  </Col>
                )}
                <Col span={2}>
                  {/* <Button */}
                  {/* style={{ */}
                  {/* background: '#1c879c', */}
                  {/* color: '#fff', */}
                  {/* padding: '0 30px', */}
                  {/* border: 'none', */}
                  {/* }} */}
                  {/* onClick={ */}
                  {/* this.state.pickingType === 'TAG' */}
                  {/* ? () => this.handleTagAdd() */}
                  {/* : () => this.handleAdd() */}
                  {/* } */}
                  {/* > */}
                  {/* 确定 */}
                  {/* </Button> */}
                </Col>
              </Row>
            </div>
            <div className={styles['container-table']}>
              <Spin size="large" spinning={this.state.loading}>
                {this.state.pickingType === 'QUANTITY' &&
                  this.state.numberList.map((element, index) => {
                    return (
                      <Line
                        index={index}
                        key={element.itemId}
                        even={!!(index % 2)}
                        itemCode={element.itemCode}
                        itemName={element.itemDesc}
                        lotNumber={element.lotNumber}
                        quantity={element.quantity}
                        existQuantity={element.existQuantity}
                        supplierName={element.supplierName}
                        uomName={element.uomName}
                        expireDate={element.expireDate}
                        checked={element.checked}
                        onChecked={this.handleChecked}
                        onChangeQuantity={this.handleChangeQuantity}
                      />
                    );
                  })}
                {this.state.pickingType === 'TAG' && this.state.adjustDirectionFlag
                  ? this.state.tagList.map((element, index) => {
                      return (
                        <Line
                          key={element.tagCode}
                          index={index}
                          even={!!(index % 2)}
                          itemCode={element.itemCode}
                          itemName={element.itemName}
                          lotNumber={element.tagCode}
                          quantity={element.quantity}
                          existQuantity={element.existQuantity}
                          supplierName={element.supplierName}
                          uomName={element.uomName}
                          expireDate={element.expireDate}
                          checked={element.checked}
                          onChecked={this.handleChecked}
                          onChangeQuantity={this.handleChangeQuantity}
                        />
                      );
                    })
                  : ''}
                {this.state.pickingType === 'TAG' &&
                  !this.state.adjustDirectionFlag &&
                  this.state.tagList.map((element, index) => {
                    return (
                      <TagLine
                        index={index}
                        key={element.tagId}
                        even={!!(index % 2)}
                        itemCode={element.itemCode}
                        itemName={element.itemDescription}
                        tagCode={element.tagCode}
                        quantity={element.quantity}
                        supplierName={element.supplierName}
                        uomName={element.uomName}
                        checked={element.checked}
                        onChecked={this.handleChecked}
                      />
                    );
                  })}
                {this.state.pickingType === 'LOT' &&
                  this.state.lotList.map((element, index) => {
                    return (
                      <Line
                        key={element.lotNumber}
                        index={index}
                        even={!!(index % 2)}
                        itemCode={element.itemCode}
                        itemName={element.itemName}
                        lotNumber={element.lotNumber}
                        quantity={element.quantity}
                        existQuantity={element.existQuantity}
                        supplierName={element.supplierName}
                        uomName={element.uomName}
                        expireDate={element.expireDate}
                        checked={element.checked}
                        onChecked={this.handleChecked}
                        onChangeQuantity={this.handleChangeQuantity}
                      />
                    );
                  })}
              </Spin>
            </div>
          </div>
        </div>
        <div className={styles.footer}>
          <div
            className={styles.button}
            style={{ marginRight: '5.5%' }}
            onClick={() => {
              this.handleExit();
            }}
          >
            <img src={buttonExit} alt="" />
            <div className={styles['split-line']} />
            <span>{intl.get(`${intlPrefix}.button.exit`).d('退出')}</span>
          </div>
          <div
            className={styles.button}
            onClick={() => {
              this.allSelect();
            }}
          >
            <img src={allSelectButton} alt="" />
            <div className={styles['split-line']} />
            <span>{intl.get(`${intlPrefix}.button.exit`).d('全选')}</span>
          </div>
          <div
            className={`${styles.button} ${styles['center-button']}`}
            onClick={() => {
              this.handleDelet();
            }}
          >
            <img src={deletButton} alt="" />
            <div className={styles['split-line']} />
            <span>{intl.get(`${intlPrefix}.button.exit`).d('删除')}</span>
          </div>
          <div
            className={styles.button}
            onClick={() => {
              this.handleSubmit();
            }}
          >
            <img src={submitButton} alt="" />
            <div className={styles['split-line']} />
            <span>{intl.get(`${intlPrefix}.button.exit`).d('执行')}</span>
          </div>
        </div>
      </div>
    );
  }
}
export default MiscellaneousAdjustment;
