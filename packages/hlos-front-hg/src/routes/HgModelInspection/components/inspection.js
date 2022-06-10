/*
 * @Description: 恒光-试模检-执行页面-检验项判定
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2020-08-24 14:36:44
 */
import React from 'react';

import result from '../../../assets/InspectionJudgment/result.svg';
// import judgeResult from '../../../assets/InspectionJudgment/judge-result.svg';
import inspectionItem from '../../../assets/InspectionJudgment/inspection-item.svg';

export default function Inspection(props) {
  let iconImg;
  switch (props.title) {
    case '试模检验':
      iconImg = inspectionItem;
      break;
    default:
      iconImg = result;
      break;
  }
  return (
    <div className="hg-inspection">
      <div className="top">
        <img src={iconImg} alt="iconImg" />
        <span className="title">{props.title}</span>
      </div>
      <div className="inspection-content">{props.children}</div>
    </div>
  );
}
