import React, { Component } from 'react';
import style from './index.less';

export default class DeHeader extends Component {
  render() {
    const { headerInfo } = this.props;
    return (
      <div className={style['de-header']}>
        <section>
          <span>今日缺料工单汇总</span>
          <span>{headerInfo.attribute1}</span>
        </section>
        <section>
          <span>今日齐套率</span>
          <span>{headerInfo.attribute2}</span>
        </section>
        <section>
          <span>本周齐套率</span>
          <span>{headerInfo.attribute3}</span>
        </section>
        <section>
          <span>生产合格率</span>
          <span>{headerInfo.attribute4}</span>
        </section>
      </div>
    );
  }
}
