/*
 * @module: 单元格渲染
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2021-05-20 15:02:57
 * @LastEditTime: 2021-05-20 15:08:36
 * @copyright: Copyright (c) 2020,Hand
 */
import React from 'react';
import { Badge } from 'choerodon-ui';
import intl from 'utils/intl';

export function yesOrNoRender(v, text) {
  let value = false;
  if (v) {
    value = v;
  }
  return (
    <Badge
      status={value ? 'success' : 'error'}
      text={
        text === '是'
          ? intl.get('hzero.common.status.yes').d('是')
          : intl.get('hzero.common.status.no').d('否')
      }
    />
  );
}
