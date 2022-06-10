/**
 * @Description: 任务报工--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-07-02 10:28:08
 * @LastEditors: Please set LastEditors
 */

import React from 'react';
import { Fields } from 'components/Permission';
import Icons from 'components/Icons';

import SwitchReportImg from 'hlos-front/lib/assets/icons/switch-reoprt.svg';
import SwitchReturnImg from 'hlos-front/lib/assets/icons/switch-reurn.svg';
import MoReturnImg from 'hlos-front/lib/assets/icons/mo-return-item.svg';
import EmployeePerformanceImg from 'hlos-front/lib/assets/icons/employee-performance.svg';

import styles from './style.less';

export default (props) => {
  return (
    <div className={styles.footer}>
      <div>
        <Fields
          permissionList={[
            {
              code: 'hlos.lmes.task-report.ps.button.change',
              type: 'button',
              meaning: '切换报工模式',
            },
          ]}
        >
          <div className={[`${styles.switch} ${props.isReturn && styles.return}`]}>
            <img
              src={props.isReturn ? SwitchReturnImg : SwitchReportImg}
              alt=""
              onClick={props.onSwitchMode}
            />
            <span className={`${props.isReturn ? styles.return : styles.report}`}>
              {props.isReturn ? '退回' : '报工'}
            </span>
          </div>
        </Fields>
        <div className={styles.icon} onClick={props.onClose}>
          <span>
            <Icons type="exit" size="48" />
          </span>
          <div className={styles.line} />
          <p className={styles.text}>退出</p>
        </div>
      </div>
      {/* <div className={styles.icon} onClick={props.onRejectedMaterial}>
        <img src={ChangeImg} alt="" />
        <div className={styles.line} />
        <p className={styles.text}>退料</p>
      </div> */}
      <div>
        {props.footerExtraBtnArr.findIndex((i) => i === 'issue') !== -1 && (
          <div className={styles.icon} onClick={props.onFeeding}>
            <span>
              <Icons type="component" size="48" color="#333" />
            </span>
            <div className={styles.line} />
            <p className={styles.text}>组件</p>
          </div>
        )}
        <div className={styles['more-wrapper']}>
          {props.showMoreBtn && (
            <div className={styles['more-btn-wrapper']}>
              <div onClick={props.onPerformance}>
                <img src={EmployeePerformanceImg} alt="" />
                员工实绩
              </div>
              <div onClick={props.onRejectedMaterial}>
                <img src={MoReturnImg} alt="" />
                任务退料
              </div>
              <div onClick={props.onByProduct}>
                <img src={MoReturnImg} alt="" />
                副产品报工
              </div>
              <div className={styles['triangle-down']} />
            </div>
          )}
          <div className={styles.icon} onClick={props.onMore}>
            <span>
              <Icons type="more-btn" size="48" color="#333" />
            </span>
            <div className={styles.line} />
            <p className={styles.text}>更多</p>
          </div>
        </div>
        {props.footerExtraBtnArr.findIndex((i) => i === 'document') !== -1 && (
          <div className={styles.icon} onClick={props.onDrawing}>
            <span>
              <Icons type="image-paper" size="48" color="#333" />
            </span>
            <div className={styles.line} />
            <p className={styles.text}>图纸</p>
          </div>
        )}
        {props.footerExtraBtnArr.findIndex((i) => i === 'instruction') !== -1 && (
          <div className={styles.icon} onClick={props.onInstruction}>
            <span>
              <Icons type="gongyiwenjian1" size="48" color="#333" />
            </span>
            <div className={styles.line} />
            <p className={styles.text}>工艺文件</p>
          </div>
        )}
        {props.footerExtraBtnArr.findIndex((i) => i === 'report') !== -1 && (
          <div className={styles.icon} onClick={props.onReport}>
            <span>
              <Icons type="check" size="48" color="#333" />
            </span>
            <div className={styles.line} />
            <p className={styles.text}>报检</p>
          </div>
        )}
        <div className={styles.icon} onClick={() => props.onChangeLogin(props.loginCheckArr)}>
          <span>
            <Icons type="change" size="48" color="#333" />
          </span>
          <div className={styles.line} />
          <p className={styles.text}>切换</p>
        </div>
        <div className={styles.icon} onClick={props.onRemarkClick}>
          <span>
            <Icons type="remark" size="48" color="#333" />
          </span>
          <div className={styles.line} />
          <p className={styles.text}>备注</p>
        </div>
      </div>
      <div>
        <div className={styles.icon} onClick={props.onStart}>
          <span>
            <Icons type="start" size="48" color="#333" />
          </span>
          <div className={styles.line} />
          <p className={styles.text}>开工</p>
        </div>
        <div className={styles.icon} onClick={props.onPause}>
          <span>
            <Icons type="zanting1" size="48" color="#333" />
          </span>
          <div className={styles.line} />
          <p className={styles.text}>暂停</p>
        </div>
        <div className={styles.icon} onClick={props.onReset}>
          <span>
            <Icons type="reset" size="48" color="#333" />
          </span>
          <div className={styles.line} />
          <p className={styles.text}>重置</p>
        </div>
        <div
          className={styles.icon}
          onClick={props.isReturn ? props.onReturnSubmit : props.onSubmit}
        >
          <span>
            <Icons type="submit" size="48" color="#333" />
          </span>
          <div className={styles.line} />
          <p className={styles.text}>提交</p>
        </div>
      </div>
    </div>
  );
};
