import React, { Component } from 'react';
import { Bind } from 'lodash-decorators';
import { withRouter } from 'react-router-dom';
import style from './index.module.less';
import TableLeft from './TableLeft';
import TableRight from './TableRight';
import imgBuHuo from '../../assets/buhuo.svg';
import tableContentImg from '../../assets/tablecontent.svg';

let selectedPoDom;
let tableLeft;
let tableRight;
let foId;

class DeFooter extends Component {
  openRequireModel = () => {
    const { history } = this.props;
    history.push('/lisp/requirement-replenishment');
  };

  @Bind
  renderFo(foData) {
    return (
      <div key={foData.foId} onClick={() => this.selectFo(foData, event)}>
        <span>{foData.foNumber}</span>
        <span>
          {foData.qty}
          {foData.uom}
        </span>
        <span>{foData.description}</span>
      </div>
    );
  }

  @Bind
  selectFo(foData, event) {
    let curDom;
    if (event.target.tagName === 'DIV') {
      curDom = event.target;
    } else {
      curDom = event.target.parentNode;
    }
    if (selectedPoDom !== null && selectedPoDom !== undefined) {
      selectedPoDom.removeAttribute('class', 'po-selected-ds');
    }
    curDom.setAttribute('class', 'po-selected-ds');
    selectedPoDom = curDom;
    if (this.tableLeft && this.tableLeft.state && this.tableLeft.state.tableDS) {
      console.log(tableRight, tableLeft, foId);
      this.tableLeft.state.tableDS.data = foData.poList;
    }
    this.foId = foData.foId;
  }

  @Bind
  leftTableSelect(poId) {
    const { footerData } = this.props;
    footerData.forEach((fo) => {
      if (fo.foId === this.foId) {
        fo.poList.forEach((po) => {
          if (po.poId === poId) {
            const { moList } = po;
            if (this.tableRight && this.tableRight.state && this.tableRight.state.tableDS) {
              this.tableRight.state.tableDS.data = moList;
              debugger;
            }
          }
        });
      }
    });
  }

  render() {
    const { footerData } = this.props;
    return (
      <div className={style.footer}>
        <div>
          <div>MO_未齐套物料分析</div>
          <div>
            <div>
              <img
                src={imgBuHuo}
                alt="捕获"
                style={{ display: 'inline-block', width: '12px', height: '12px' }}
              />
              <div
                style={{ display: 'inline-block', color: '#F96F68', padding: '0px 0px 0px 3px' }}
                onClick={this.openRequireModel}
              >
                马上补货
              </div>
            </div>
            <div>|</div>
            <div>时间区间:{this.props.dateRangeStr}</div>
          </div>
        </div>
        <div style={{ width: '100%' }}>
          <div className={style.moCardGroup} style={{ width: '15%' }}>
            {footerData.map((foData) => this.renderFo(foData))}
          </div>
          <div style={{ width: '40%', position: 'relative' }}>
            <TableLeft
              ref={(node) => {
                this.tableLeft = node;
              }}
              leftTableSelect={this.leftTableSelect}
            />
            <img
              src={tableContentImg}
              style={{ position: 'absolute', top: '10px', right: '-29px' }}
              alt="logo"
            />
          </div>
          <div style={{ width: '40%' }}>
            <TableRight
              ref={(node) => {
                this.tableRight = node;
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}
export default withRouter(DeFooter);
