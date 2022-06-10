import React from 'react';
import { Table, Tooltip } from 'choerodon-ui/pro';
import { Icon, Row, Col } from 'choerodon-ui';
import { isEmpty } from 'lodash';
import { getSerialNum } from '@/utils/renderer';
import QiIcon from '../StatementCreate/assets/qi.svg';

export default ({ ds, tabType }) => {
  /**
   * table列
   * @returns
   */
  function columns() {
    return [
      { header: 'No.', width: 60, lock: 'left', renderer: ({ record }) => getSerialNum(record) },
      {
        name: 'attribute1',
        width: 110,
        tooltip: 'overflow',
        lock: 'left',
      },
      { name: 'attribute2', width: 135, tooltip: 'overflow', lock: 'left' },
      // {
      //   name: 'attribute14',
      //   width: 110,
      //   tooltip: 'overflow',
      //   lock: 'left',
      // },
      {
        name: 'attribute15',
        width: 115,
        tooltip: 'overflow',
        className: 'line-feed',
        lock: 'left',
        renderer: ({ value, record }) => {
          return (
            <div>
              <p>{value}</p>
              <p>{record.get('attribute16')}</p>
              {value}
            </div>
          );
        },
      },
      {
        name: 'attribute6',
        width: 210,
        className: 'line-feed',
        tooltip: 'overflow',
        renderer: ({ record, value }) => (
          <div>
            <p>
              <img src={QiIcon} alt="" />
              {value}
            </p>
            <p>
              <Icon type="location_on-o" />
              {record.get('attribute7')}
            </p>
            {value}
          </div>
        ),
      },
      {
        name: 'attribute19',
        width: 100,
        tooltip: 'overflow',
      },
      {
        name: 'attribute24',
        width: 100,
        hidden: tabType === 'wait',
        tooltip: 'overflow',
      },
      {
        name: 'attribute5',
        width: 90,
        tooltip: 'overflow',
        renderer: ({ value }) => {
          if (value) {
            const firstName = value.substring(0, 1);
            return (
              <span>
                {firstName && <span className="first-name">{firstName}</span>}
                {value}
              </span>
            );
          }
        },
      },
      {
        name: 'attribute9',
        width: 90,
        tooltip: 'overflow',
      },
      {
        name: 'attribute18-17',
        width: 90,
        tooltip: 'overflow',
      },
      { name: 'attribute20-10', width: 80, tooltip: 'overflow' },
      { name: 'attribute21-10', width: 90, tooltip: 'overflow' },
      { name: 'attribute11', width: 60, tooltip: 'overflow' },
      { name: 'attribute13', width: 90, tooltip: 'overflow' },
      {
        name: 'attribute4',
        width: 90,
        tooltip: 'overflow',
        renderer: ({ value }) => {
          let status = '';
          if (value === '已确认') {
            status = '';
          } else if (value === '已回复') {
            status = 'blue';
          } else if (value === '已发布') {
            status = 'darkblue';
          } else if (value === '已完成') {
            status = 'green';
          }
          return <div className={`order-status ${status}`}>{value}</div>;
        },
      },
      { name: 'attribute3', width: 120, tooltip: 'overflow' },
      {
        name: 'attribute8',
        width: 120,
        tooltip: 'overflow',
        renderer: ({ value }) => {
          if (value) {
            const firstName = value.substring(0, 1);
            return (
              <span>
                {firstName && <span className="first-name">{firstName}</span>}
                {value}
              </span>
            );
          }
        },
      },
      {
        name: 'attribute22',
        width: 120,
        tooltip: 'overflow',
      },
      {
        name: 'attribute23',
        width: 90,
        tooltip: 'overflow',
        renderer: ({ value }) => handlePreview(value),
      },
      {
        name: 'progress',
        width: 300,
        className: 'line-feed',
        hidden: tabType === 'wait',
        renderer: ({ record }) => {
          return (
            <div className="lisp-delivery-result-progress">
              <p className="legend">
                <span>
                  <span className="circle plan" />
                  计划
                </span>
                <span>
                  <span className="circle release" />
                  下达
                </span>
                <span>
                  <span className="circle complete" />
                  完工
                </span>
                <span>
                  <span className="circle inventory" />
                  入库
                </span>
                <span>
                  <span className="circle ship" />
                  发运
                </span>
              </p>
              <Row className="chart">
                <Col span={record.get('a')} className="plan" />
                <Col span={record.get('b')} className="release" />
                <Col span={record.get('a')} className="complete" />
                <Col span={record.get('a')} className="inventory" />
                <Col span={record.get('b')} className="ship" />
              </Row>
            </div>
          );
        },
      },
    ];
  }

  /**
   * 图纸预览列表
   * @param {*} record 当前行记录
   */
  function handlePreview(fileList) {
    if (isEmpty(fileList)) return fileList;
    const links = fileList.split(';').map((item) => {
      return (
        <>
          <a href={item} target="_blank" rel="noopener noreferrer" style={{ margin: '3px 10px' }}>
            {item.split('@').pop()}
          </a>
          <br />
        </>
      );
    });
    return (
      <Tooltip title={links}>
        <span className="text-wrap">
          <a>查看附件</a>
        </span>
      </Tooltip>
    );
  }

  return (
    <Table
      dataSet={ds}
      columns={columns()}
      border={false}
      columnResizable="true"
      editMode="inline"
      queryBar="none"
    />
  );
};
