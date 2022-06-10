import React, { Component } from 'react';
import style from './index.less';
import Echart from './Echart.js';

export default class DeContent extends Component {
  render() {
    const { contentInfo } = this.props;
    return (
      <div className={style.content}>
        <div>
          <div>近一周工单齐套分析</div>
          <div className={style['content-bar-right']}>
            <div>
              <span>时间区间:{this.props.dateRangeStr}</span>
            </div>
            <div onClick={this.props.doAfterDate}>后一天</div>
            <div onClick={this.props.doPreDate}>前一天</div>
          </div>
        </div>
        <div>
          <Echart data={contentInfo} curDate={this.props.curDate} xData={this.props.xData} />
        </div>
      </div>
    );
  }
}
