/**
 * @Description: 单件流报工--MainLeft-查看详情Modal
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 20201-01-14 14:36:08
 * @LastEditors: yu.na
 */

import React, { Fragment } from 'react';

export default ({ list }) => {
  return (
    <Fragment>
      <table>
        <thead>
          <tr>
            <th>工序</th>
            <th>操作工</th>
            <th>生产线</th>
            <th>工位</th>
            <th>时间</th>
          </tr>
        </thead>
        <tbody>
          {list.map((i) => {
            return (
              <tr key={i.eventId}>
                <td>{i.operation}</td>
                <td>{i.worker}</td>
                <td>{i.prodLine}</td>
                <td>{i.workcell}</td>
                <td>{i.executeTime}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Fragment>
  );
};
