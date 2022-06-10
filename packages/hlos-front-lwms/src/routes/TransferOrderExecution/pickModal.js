/*
 * @Description: 转移单执行 -- 拣料弹框
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-03-31 10:01:26
 */
import React, { Fragment } from 'react';
import { TextField, Button, NumberField, Tooltip, Table, Spin } from 'choerodon-ui/pro';
import notification from 'utils/notification';
import { accAdd } from '@/utils/renderer';

import document from 'hlos-front/lib/assets/icons/odd-number.svg';
import place from 'hlos-front/lib/assets/icons/location.svg';
import quantityImg from 'hlos-front/lib/assets/icons/quantity.svg';
import scan from 'hlos-front/lib/assets/icons/scan.svg';
import intl from 'utils/intl';
import style from './index.less';

const intlPrefix = 'lwms.transferOrder';
export default class PickModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: null,
      loading: false,
    };
  }

  async componentDidMount() {
    await this.handlePickSearch();
  }

  handlePickSearch = async (inputValue = this.state.inputValue) => {
    const arr = ['ADVISE', 'ENFORCE'];
    let _adviseFlag = null;
    let _useAdvise = false;
    if (
      this.props.data.pickRule &&
      JSON.parse(this.props.data.pickRule) &&
      arr.includes(JSON.parse(this.props.data.pickRule).pick_advise)
    ) {
      _useAdvise = true;
      if (JSON.parse(this.props.data.pickRule).pick_advise === 'ENFORCE') {
        _adviseFlag = 1;
      }
    }
    this.setState(() => ({ loading: true }));
    const {
      itemControlType,
      itemId,
      itemCode,
      warehouseId,
      wmAreaId,
      applyQty,
      pickedQty,
      requestPickDetailList,
    } = this.props.data;
    // const modalTableDS = this.props.modalTableDS;
    let res = [];
    this.props.modalTableDS.setQueryParameter('itemId', itemId);
    this.props.modalTableDS.setQueryParameter('itemCode', itemCode);
    this.props.modalTableDS.setQueryParameter('itemControlType', itemControlType);
    this.props.modalTableDS.setQueryParameter(
      'organizationId',
      this.props.headerInfo.organizationId
    );
    this.props.modalTableDS.setQueryParameter('warehouseId', warehouseId);
    this.props.modalTableDS.setQueryParameter('wmAreaId', wmAreaId);
    this.props.modalTableDS.setQueryParameter('page', -1);
    this.props.modalTableDS.setQueryParameter(
      itemControlType === 'LOT' ? 'lotNumber' : 'tagCode',
      inputValue
    );
    this.props.modalTableDS.setQueryParameter('demandQty', (applyQty || 0) - (pickedQty || 0));
    this.props.modalTableDS.setQueryParameter('useAdvise', _useAdvise);
    this.props.modalTableDS.setQueryParameter('advisedFlag', _adviseFlag);
    res = await this.props.modalTableDS.query();
    if (res && res.content) {
      if (requestPickDetailList && requestPickDetailList.length) {
        // 上次选中结果
        requestPickDetailList.forEach((receive) => {
          let selectIndex = -1;
          if (itemControlType === 'LOT') {
            selectIndex = res.content.findIndex((i) => i.lotId === receive.lotId);
            if (selectIndex > -1) {
              this.props.modalTableDS.get(selectIndex).set('advisedQty', receive.advisedQty || 0);
              this.props.modalTableDS.get(selectIndex).set('pickedQty', receive.pickedQty || 0);
            }
          } else {
            selectIndex = res.content.findIndex((i) => i.tagId === receive.tagId);
          }
          this.props.modalTableDS.select(selectIndex);
        });
      } else {
        // 默认选中结果
        res.content.forEach((item, index) => {
          if (item.advisedFlag === '1') {
            this.props.modalTableDS.select(index);
          }
        });
      }
      this.setState({
        loading: false,
      });
    } else {
      this.setState({
        loading: false,
      });
    }
  };

  // 输入框查询
  handleSearch = async (value) => {
    await this.handlePickSearch(value);
    this.setState({
      inputValue: value,
    });
  };

  // 确定
  handleConfirm = () => {
    const checkedArr = this.props.modalTableDS.selected;
    this.props.modalConfirm(checkedArr);
  };

  getTableColumns = (type, uomName) => {
    // 输入框更改数量
    function handleChange(dataSet, rec, value) {
      let curVal = 0;
      if (value) {
        curVal = value;
      }
      const maxVal = rec.get('initialQty') || rec.get('quantity') || 0;
      if (curVal > maxVal) {
        notification.warning({
          message: '数量不可大于批次数量',
        });
        rec.set('pickedQty', 0);
        rec.set('advisedQty', 0);
        dataSet.unSelect(rec);
      } else {
        rec.set('pickedQty', curVal);
        rec.set('advisedQty', curVal);
        if (curVal === 0) {
          dataSet.unSelect(rec);
        } else {
          dataSet.select(rec);
        }
      }
    }
    const tableColumns = [
      {
        name: 'tagOrLotNumber',
        editor: false,
        width: 300,
        renderer({ record }) {
          return (
            <div className={style['first-column']}>
              {record.get(type === 'TAG' ? 'tagCode' : 'lotNumber')}
            </div>
          );
        },
        header: (dataSet) => {
          const partialContent =
            type === 'TAG'
              ? intl.get(`${intlPrefix}.view.title.tagCount`).d('标签数')
              : intl.get(`${intlPrefix}.view.title.lotCount`).d('批次数');
          return (
            <Fragment>
              <span>{`${partialContent}：${dataSet.selected.length} / ${dataSet.records.length}`}</span>
            </Fragment>
          );
        },
      },
      {
        name: 'count',
        editor: false,
        align: 'left',
        width: 250,
        renderer({ record, dataSet }) {
          return type === 'TAG' ? (
            <span>{`${record.get('quantity')} ${uomName || ''}`}</span>
          ) : (
            <div className={style['custom-counter']}>
              <NumberField
                className={style['counter-content']}
                value={record.get('advisedQty') || 0}
                onChange={(value) => handleChange(dataSet, record, value)}
              />
            </div>
          );
        },
        header: (dataSet) => {
          const totalCount = dataSet.records.reduce((acc, rec) => {
            return accAdd(acc, rec.get('initialQty') || rec.get('quantity') || 0);
          }, 0);
          const selectedCount = dataSet.selected.reduce((acc, rec) => {
            return accAdd(acc, (type === 'LOT' ? rec.get('advisedQty') : rec.get('quantity')) || 0);
          }, 0);
          return (
            <Fragment>
              <span>{`${selectedCount} / ${totalCount} ${uomName || ''}`}</span>
            </Fragment>
          );
        },
      },
      {
        name: 'wmAreaName',
        editor: false,
        width: 250,
        header: <span>{intl.get(`${intlPrefix}.view.message.invalidateDate`).d('库位')}</span>,
        renderer({ record }) {
          return (
            <div className={style['first-column']}>
              {record.get('wmAreaName')} {record.get('wmUnitCode')}
            </div>
          );
        },
      },
    ];
    // 批次明细展示现有量
    if (type === 'LOT') {
      tableColumns.push(
        {
          name: 'quantity',
          editor: false,
          align: 'left',
          width: 200,
          header: <span>{intl.get(`${intlPrefix}.view.message.invalidateDate`).d('现有量')}</span>,
          renderer({ record }) {
            return <div className={style['first-column']}>{record.get('quantity')}</div>;
          },
        },
        {
          name: 'receivedDate',
          editor: false,
          width: 200,
          header: (
            <span>{intl.get(`${intlPrefix}.view.message.invalidateDate`).d('接收时间')}</span>
          ),
        }
      );
    } else {
      tableColumns.push(
        {
          name: 'lotNumber',
          editor: false,
          width: 200,
          header: <span>{intl.get(`${intlPrefix}.view.message.invalidateDate`).d('批次')}</span>,
          renderer({ record }) {
            return <div className={style['first-column']}>{record.get('lotNumber')}</div>;
          },
        },
        {
          name: 'assignedTime',
          editor: false,
          width: 200,
          header: (
            <span>{intl.get(`${intlPrefix}.view.message.invalidateDate`).d('接收时间')}</span>
          ),
        }
      );
    }
    tableColumns.push(
      {
        name: 'expireDate',
        editor: false,
        width: 200,
        header: <span>{intl.get(`${intlPrefix}.view.message.invalidateDate`).d('失效时间')}</span>,
      },
      {
        name: 'madeDate',
        editor: false,
        width: 200,
        header: <span>{intl.get(`${intlPrefix}.view.message.invalidateDate`).d('制造时间')}</span>,
      }
    );
    return tableColumns;
  };

  render() {
    const { data } = this.props;
    return (
      <div className={style['pick-modal']}>
        <div className={style['modal-header']}>
          <div className={`${style.item} ${style['header-info']}`}>
            <img src={document} alt="document" />
            <Tooltip
              title={
                data.itemCode && data.itemDescription
                  ? `${data.itemCode}-${data.itemDescription}`
                  : `${data.itemCode || '' || data.itemDescription || ''}`
              }
            >
              {data.itemCode && data.itemDescription
                ? `${data.itemCode}-${data.itemDescription}`
                : `${data.itemCode || '' || data.itemDescription || ''}`}
            </Tooltip>
          </div>
          <div className={`${style['warehouse-area']}`}>
            <div className={`${style.warehouse} ${style['header-info']}`}>
              <img src={place} alt="place" />
              <Tooltip
                title={
                  data.warehouseName && data.wmAreaName
                    ? `${data.warehouseName}-${data.wmAreaName}`
                    : `${data.warehouseName || '' || data.wmAreaName || ''}`
                }
              >
                {data.warehouseName && data.wmAreaName
                  ? `${data.warehouseName}-${data.wmAreaName}`
                  : `${data.warehouseName || '' || data.wmAreaName || ''}`}
              </Tooltip>
            </div>
            <div className={`${style.quantity} ${style['header-info']}`}>
              <img src={quantityImg} alt="quantity" />
              <span>
                {data.applyQty} {data.uomName}
              </span>
            </div>
            <div className={`${style['input-scan']} ${style['header-info']}`}>
              <TextField
                placeholder="请扫描物料标签号/查找标签"
                onChange={(value) => this.handleSearch(value)}
              />
              <img src={scan} alt="scan" />
            </div>
          </div>
        </div>
        <div className={style['modal-content']}>
          <Spin spinning={this.state.loading}>
            <Table
              className={style['modal-table']}
              dataSet={this.props.modalTableDS}
              columns={this.getTableColumns(this.props.type, this.props.data.uomName)}
              rowHeight="auto"
            />
          </Spin>
        </div>
        <div className={style['modal-footer']}>
          <Button onClick={this.props.handleCloseModal}>取消</Button>
          <Button className={style.confirm} onClick={this.handleConfirm}>
            确定
          </Button>
        </div>
      </div>
    );
  }
}
