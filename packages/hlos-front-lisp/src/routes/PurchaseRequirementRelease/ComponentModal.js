import React, { Fragment } from 'react';
import { Table } from 'choerodon-ui/pro';
import QiImg from './assets/qi.svg';
import LocationImg from './assets/location.svg';
import styles from './index.less';

export default ({ ds, data }) => {
  /**
   *table列
   * @returns
   */
  function columns() {
    return [
      { name: 'attribute3', width: 70, lock: true },
      {
        name: 'attribute4&5',
        width: 200,
        className: styles['component-table-item'],
        renderer: itemRender,
      },
      { name: 'attribute6', width: 100 },
      { name: 'attribute7', width: 80 },
      { name: 'attribute8', width: 100 },
      { name: 'attribute9', width: 100 },
      { name: 'attribute11', width: 100 },
      { name: 'attribute12', width: 80, renderer: rateRender },
    ];
  }

  function itemRender({ record }) {
    return (
      <div>
        <p>{record.data.attribute4}</p>
        <p>{record.data.attribute5}</p>
      </div>
    );
  }

  function rateRender({ value }) {
    return <span>{value && Number(value) * 100}%</span>;
  }

  return (
    <Fragment>
      <div className={styles['component-modal-base-info']}>
        <p>{data.attribute2}</p>
        <p>{data.attribute3}</p>
        <div>
          <p>{data.attribute15}</p>
          <p>{data.attribute16}</p>
        </div>
        <div>
          <p>
            <img src={QiImg} alt="" />
            {data.attribute6}
          </p>
          <p>
            <img src={LocationImg} alt="" />
            {data.attribute7}
          </p>
        </div>
      </div>
      <Table
        dataSet={ds}
        columns={columns()}
        border={false}
        columnResizable="true"
        editMode="inline"
      />
    </Fragment>
  );
};
