/*
 * @Author: zilong.wei01@hand-china.com
 * @Date: 2020-08-21 16:22:04
 * @LastEditors: zilong.wei01@hand-china.com
 * @LastEditTime: 2020-09-09 13:58:41
 */

import React, { Fragment, Component } from 'react';
import { Button, Table, DataSet, CheckBox } from 'choerodon-ui/pro';
import moment from 'moment';
import { getResponse } from 'utils/utils';
import { Content, Header } from 'components/Page';
import { getSerialNum } from '@/utils/renderer';
import { connect } from 'dva';
import notification from 'utils/notification';
import { Bind } from 'lodash-decorators';
import './index.less';
import { updateAPI, generateAPI } from '@/services/requirementReplenishmentService';

import { ListDS, rowCombineArr } from '@/stores/requirementReplenishmentDS';
import { getdiffdate, getPrevDate } from '@/utils/timeServer';

@connect()
export default class RequirementReplenishment extends Component {
  constructor(props) {
    super(props);
    this.minDate = moment(new Date()).format('YYYY-MM-DD');
    this.maxDate = getPrevDate(this.minDate, -14);
    this.timeList = getdiffdate(this.minDate, this.maxDate);
    this.startDate = this.minDate;
    this.endDate = this.maxDate;
    this.total = 0;
    this.itemList = [];
    this.state = {
      columns: this.getColumns(),
    };
  }

  listDS = new DataSet({
    ...ListDS(),
  });

  dateInRange(startDate, endDate, curretDate) {
    if (startDate <= curretDate && curretDate <= endDate) {
      return false;
    }
    return true;
  }

  @Bind
  subTotal(record) {
    // 改变查询时间
    if (undefined === this.listDS.queryDataSet) {
      if (undefined === this.listDS.queryDataSet.current.get('searchDate.start')) {
        this.startDate = this.minDate;
      } else {
        this.startDate = this.listDS.queryDataSet.current.get('searchDate.start')._i;
      }
      if (undefined === this.listDS.queryDataSet.current.get('searchDate.end')) {
        this.endDate = this.maxDate;
      } else {
        this.endDate = this.listDS.queryDataSet.current.get('searchDate.end')._i;
      }
    }

    let num = 0;
    if (!this.dateInRange(this.startDate, this.endDate, this.timeList[0])) {
      if (record.data.attribute7 !== undefined && record.data.attribute7 !== '') {
        num = parseInt(record.data.attribute7, 10);
      }
    }
    if (!this.dateInRange(this.startDate, this.endDate, this.timeList[1])) {
      if (record.data.attribute8 !== undefined && record.data.attribute8 !== '') {
        num += parseInt(record.data.attribute8, 10);
      }
    }
    if (!this.dateInRange(this.startDate, this.endDate, this.timeList[2])) {
      if (record.data.attribute9 !== undefined && record.data.attribute9 !== '') {
        num += parseInt(record.data.attribute9, 10);
      }
    }
    if (!this.dateInRange(this.startDate, this.endDate, this.timeList[3])) {
      if (record.data.attribute10 !== undefined && record.data.attribute10 !== '') {
        num += parseInt(record.data.attribute10, 10);
      }
    }
    if (!this.dateInRange(this.startDate, this.endDate, this.timeList[4])) {
      if (record.data.attribute11 !== undefined && record.data.attribute11 !== '') {
        num += parseInt(record.data.attribute11, 10);
      }
    }
    if (!this.dateInRange(this.startDate, this.endDate, this.timeList[5])) {
      if (record.data.attribute12 !== undefined && record.data.attribute12 !== '') {
        num += parseInt(record.data.attribute12, 10);
      }
    }
    if (!this.dateInRange(this.startDate, this.endDate, this.timeList[6])) {
      if (record.data.attribute13 !== undefined && record.data.attribute13 !== '') {
        num += parseInt(record.data.attribute13, 10);
      }
    }
    if (!this.dateInRange(this.startDate, this.endDate, this.timeList[7])) {
      if (record.data.attribute14 !== undefined && record.data.attribute14 !== '') {
        num += parseInt(record.data.attribute14, 10);
      }
    }
    if (!this.dateInRange(this.startDate, this.endDate, this.timeList[8])) {
      if (record.data.attribute15 !== undefined && record.data.attribute15 !== '') {
        num += parseInt(record.data.attribute15, 10);
      }
    }
    if (!this.dateInRange(this.startDate, this.endDate, this.timeList[9])) {
      if (record.data.attribute16 !== undefined && record.data.attribute16 !== '') {
        num += parseInt(record.data.attribute16, 10);
      }
    }
    if (!this.dateInRange(this.startDate, this.endDate, this.timeList[10])) {
      if (record.data.attribute17 !== undefined && record.data.attribute17 !== '') {
        num += parseInt(record.data.attribute17, 10);
      }
    }
    if (!this.dateInRange(this.startDate, this.endDate, this.timeList[11])) {
      if (record.data.attribute18 !== undefined && record.data.attribute18 !== '') {
        num += parseInt(record.data.attribute18, 10);
      }
    }
    if (!this.dateInRange(this.startDate, this.endDate, this.timeList[12])) {
      if (record.data.attribute19 !== undefined && record.data.attribute19 !== '') {
        num += parseInt(record.data.attribute19, 10);
      }
    }
    if (!this.dateInRange(this.startDate, this.endDate, this.timeList[13])) {
      if (record.data.attribute20 !== undefined && record.data.attribute20 !== '') {
        num += parseInt(record.data.attribute20, 10);
      }
    }
    return num;
  }

  @Bind
  handleChange(value, record) {
    if (value) {
      this.itemList.push(record.get('attribute1'));
    } else {
      this.itemList.splice(this.itemList.indexOf(record.get('attribute1')), 1);
    }
  }

  // table 列
  @Bind
  getColumns() {
    return [
      {
        header: 'No.',
        width: 60,
        lock: 'left',
        align: 'center',
        renderer: ({ record }) => getSerialNum(record),
      },
      {
        name: 'checkBox',
        width: 50,
        align: 'center',
        lock: 'left',
        renderer: ({ record }) => (
          <CheckBox onChange={(value) => this.handleChange(value, record)} />
        ),
        onCell({ record }) {
          const { index } = record;
          const rowSpan = rowCombineArr[index];
          return {
            rowSpan,
            hidden: rowSpan === 0,
          };
        },
      },
      {
        name: 'attribute1',
        value: '物料',
        width: 120,
        align: 'center',
        lock: 'left',
        renderer({ record }) {
          return (
            <div>
              <p style={{ wordWrap: 'break-word' }}>{record.get('attribute1')}</p>
              <p style={{ wordWrap: 'break-word' }}>{record.get('attribute21')}</p>
            </div>
          );
        },
        onCell({ record }) {
          const { index } = record;
          const rowSpan = rowCombineArr[index];
          return {
            rowSpan,
            hidden: rowSpan === 0,
          };
        },
      },
      { name: 'attribute2', value: '要素类型', width: 120, lock: 'left', align: 'center' },
      { name: 'attribute3', value: '值', width: 60, lock: 'left', align: 'center' },
      { name: 'attribute4', value: '预计下单数量', width: 120, lock: 'left', align: 'center' },
      { name: 'attribute5', value: '今日库存数量', width: 120, lock: 'left', align: 'center' },
      {
        name: 'attribute6',
        value: '建议补货供应商排序',
        width: 150,
        lock: 'left',
        align: 'center',
        renderer({ record }) {
          return (
            <span style={{ color: '#F96F68', fontWeight: '800' }}>{record.get('attribute6')}</span>
          );
        },
      },
      {
        name: 'attribute7',
        value: this.timeList[0],
        tooltip: 'overflow',
        hidden: this.dateInRange(this.startDate, this.endDate, this.timeList[0]),
        minWidth: 100,
        align: 'center',
      },
      {
        name: 'attribute8',
        value: this.timeList[1],
        tooltip: 'overflow',
        hidden: this.dateInRange(this.startDate, this.endDate, this.timeList[1]),
        minWidth: 100,
        align: 'center',
      },
      {
        name: 'attribute9',
        value: this.timeList[2],
        tooltip: 'overflow',
        hidden: this.dateInRange(this.startDate, this.endDate, this.timeList[2]),
        minWidth: 100,
        align: 'center',
      },
      {
        name: 'attribute10',
        value: this.timeList[3],
        tooltip: 'overflow',
        hidden: this.dateInRange(this.startDate, this.endDate, this.timeList[3]),
        minWidth: 100,
        align: 'center',
      },
      {
        name: 'attribute11',
        value: this.timeList[4],
        tooltip: 'overflow',
        hidden: this.dateInRange(this.startDate, this.endDate, this.timeList[4]),
        minWidth: 100,
        align: 'center',
      },
      {
        name: 'attribute12',
        value: this.timeList[5],
        tooltip: 'overflow',
        hidden: this.dateInRange(this.startDate, this.endDate, this.timeList[5]),
        minWidth: 100,
        align: 'center',
      },
      {
        name: 'attribute13',
        value: this.timeList[6],
        tooltip: 'overflow',
        hidden: this.dateInRange(this.startDate, this.endDate, this.timeList[6]),
        minWidth: 100,
        align: 'center',
      },
      {
        name: 'attribute14',
        value: this.timeList[7],
        tooltip: 'overflow',
        hidden: this.dateInRange(this.startDate, this.endDate, this.timeList[7]),
        minWidth: 100,
        align: 'center',
      },
      {
        name: 'attribute15',
        value: this.timeList[8],
        tooltip: 'overflow',
        hidden: this.dateInRange(this.startDate, this.endDate, this.timeList[8]),
        minWidth: 100,
        align: 'center',
      },
      {
        name: 'attribute16',
        value: this.timeList[9],
        tooltip: 'overflow',
        hidden: this.dateInRange(this.startDate, this.endDate, this.timeList[9]),
        minWidth: 100,
        align: 'center',
      },
      {
        name: 'attribute17',
        value: this.timeList[10],
        tooltip: 'overflow',
        hidden: this.dateInRange(this.startDate, this.endDate, this.timeList[10]),
        minWidth: 100,
        align: 'center',
      },
      {
        name: 'attribute18',
        value: this.timeList[11],
        tooltip: 'overflow',
        hidden: this.dateInRange(this.startDate, this.endDate, this.timeList[11]),
        minWidth: 100,
        align: 'center',
      },
      {
        name: 'attribute19',
        value: this.timeList[12],
        tooltip: 'overflow',
        hidden: this.dateInRange(this.startDate, this.endDate, this.timeList[12]),
        minWidth: 100,
        align: 'center',
      },
      {
        name: 'attribute20',
        value: this.timeList[13],
        tooltip: 'overflow',
        hidden: this.dateInRange(this.startDate, this.endDate, this.timeList[13]),
        minWidth: 100,
        align: 'center',
      },
      {
        header: '小计',
        width: 70,
        renderer: ({ record }) => this.subTotal(record),
        lock: 'right',
        align: 'center',
      },
    ];
  }

  /**
   *查询
   * @returns
   */
  @Bind
  async handleSearch() {
    if (undefined === this.listDS.queryDataSet.current.get('searchDate.start')) {
      this.startDate = this.minDate;
    } else {
      this.startDate = this.listDS.queryDataSet.current.get('searchDate.start')._i;
    }
    if (undefined === this.listDS.queryDataSet.current.get('searchDate.end')) {
      this.endDate = this.maxDate;
    } else {
      this.endDate = this.listDS.queryDataSet.current.get('searchDate.end')._i;
    }

    this.setState({
      columns: this.getColumns(),
    });
  }

  @Bind
  async handleDetail(ds) {
    const generateData = [];
    const updateData = [];
    ds.forEach((i) => {
      console.log(i);
      if (this.itemList.indexOf(i.data.attribute1) !== -1) {
        if (
          i.data.attribute6 !== undefined &&
          i.data.attribute6 !== '' &&
          (i.data.attribute22 === undefined || i.data.attribute22 === '')
        ) {
          generateData.push({
            attribute2: i.data.attribute1,
            attribute3: 'Y',
            attribute4: i.data.attribute2,
            attribute5: i.data.attribute5,
            attribute8: 'EA',
            attribute9: '1001',
            attribute11: i.data.attribute21,
          });
          updateData.push({
            ...i.data,
            attribute22: '已分析',
          });
        }
      }
    });
    if (generateData.length) {
      const res = await generateAPI(generateData);
      if (getResponse(res) && !res.failed) {
        const res2 = await updateAPI(updateData);
        if (getResponse(res2) && !res2.failed) {
          this.toRequirementReplenishmentLine();
        }
      }
    } else {
      this.toRequirementReplenishmentLine();
    }
  }

  @Bind
  async toRequirementReplenishmentLine() {
    if (this.itemList.length) {
      const list = this.itemList;
      console.log(list);
      const pathname = '/lisp/requirement-replenishment/line';
      this.props.history.push({
        pathname,
        list,
      });
      // this.props.dispatch(
      //   routerRedux.push({
      //     pathname,
      //     list,
      //   })
      // );
    } else {
      notification.warning({
        message: '至少选择一条数据',
      });
    }
  }

  render() {
    return (
      <div className="requirement-replenishment">
        <Fragment>
          <Header title="需求补货感知平台" />
          <div className="sub-header">
            <Button onClick={this.handleSearch}>查询</Button>
            <Button onClick={() => this.handleDetail(this.listDS)}>补货计划分析</Button>
          </div>
          <Content>
            <Table
              dataSet={this.listDS}
              columns={this.state.columns}
              border={false}
              queryBar="advancedBar"
              rowHeight="auto"
              queryFieldsLimit={4}
            />
          </Content>
        </Fragment>
      </div>
    );
  }
}
