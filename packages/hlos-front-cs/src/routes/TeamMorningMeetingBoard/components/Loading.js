import { Spin } from 'choerodon-ui';
import React, { Fragment } from 'react';

import style from '../index.module.less';

export default function Loading() {
  return (
    <Fragment>
      <div className={style['my-lazy-loading']}>
        <Spin tip="Loading..." />
      </div>
    </Fragment>
  );
}
