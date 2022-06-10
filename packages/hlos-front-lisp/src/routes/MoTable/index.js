/*
 * MO工作台
 * date: 2020-07-23
 * author : zhengtao <TAO.ZHENG@HAND-CHINA.com>
 * version : 0.0.1
 * copyright Copyright (c) 2020, Hand
 */
import React from 'react';
import { Header, Content } from 'components/Page';
import { Button, DataSet, Table } from 'choerodon-ui/pro';
import { moTableDS } from '@/stores/moTableDS';
import { updateList, deleteList } from '@/services/api';
import moment from 'moment';
import notification from 'utils/notification';
import { openTab } from 'utils/menuTab';
import queryString from 'query-string';
import style from './style.less';

import importImg from './assets/import.svg';
import downImg from './assets/down.svg';
import parseImg from './assets/parse.svg';
import stopParseImg from './assets/stopParse.svg';
import cancelImg from './assets/cancel.svg';
import delImg from './assets/del.svg';

/**
 * @name: 下达
 */
async function handleRelease(ds) {
  const data = ds.selected;
  if (data?.length) {
    const status = data.every((item) => item.toData().attribute7 === '已排期');
    if (status) {
      const changedItems = ds.selected.map((i) => ({
        ...i.toJSONData(),
        attribute7: '已下达',
        attribute27: moment().format('YYYY-MM-DD HH:mm:ss'),
      }));
      try {
        await updateList(
          {
            functionType: 'SUPPLIER_CHAIN',
            dataType: 'MAKE_ORDER',
          },
          changedItems
        );
        notification.success({
          message: '提交成功',
        });
        ds.query();
        // eslint-disable-next-line no-empty
      } catch {}
    } else {
      return notification.warning({
        message: '勾选MO必须为已排期状态',
      });
    }
  } else {
    return notification.warning({
      message: '请先勾选',
    });
  }
}
/**
 * @name: 暂挂
 */
async function handlePending(ds) {
  const data = ds.selected;
  if (data?.length) {
    const status = data.every((item) => item.toData().attribute7 === '已下达');
    if (status) {
      const changedItems = ds.selected.map((i) => ({
        ...i.toJSONData(),
        attribute7: '已暂挂',
        attribute30: moment().format('YYYY-MM-DD HH:mm:ss'),
      }));
      try {
        await updateList(
          {
            functionType: 'SUPPLIER_CHAIN',
            dataType: 'MAKE_ORDER',
          },
          changedItems
        );
        notification.success({
          message: '提交成功',
        });
        ds.query();
        // eslint-disable-next-line no-empty
      } catch {}
    } else {
      return notification.warning({
        message: '勾选MO必须为已下达状态',
      });
    }
  } else {
    return notification.warning({
      message: '请先勾选',
    });
  }
}
/**
 * @name: 取消暂挂
 */
async function handleCancelPending(ds) {
  const data = ds.selected;
  if (data?.length) {
    const status = data.every((item) => item.toData().attribute7 === '已暂挂');
    if (status) {
      const changedItems = ds.selected.map((i) => ({
        ...i.toJSONData(),
        attribute7: '已下达',
      }));
      try {
        await updateList(
          {
            functionType: 'SUPPLIER_CHAIN',
            dataType: 'MAKE_ORDER',
          },
          changedItems
        );
        notification.success({
          message: '提交成功',
        });
        ds.query();
        // eslint-disable-next-line no-empty
      } catch {}
    } else {
      return notification.warning({
        message: '勾选MO必须为已暂挂状态',
      });
    }
  } else {
    return notification.warning({
      message: '请先勾选',
    });
  }
}
/**
 * @name: 取消
 */
async function handleCancel(ds) {
  const data = ds.selected;
  if (data?.length) {
    const status = data.every((item) =>
      ['新建', '已排期', '已下达'].includes(item.toData().attribute7)
    );
    if (status) {
      const changedItems = ds.selected.map((i) => ({
        ...i.toJSONData(),
        attribute7: '已取消',
        attribute31: moment().format('YYYY-MM-DD HH:mm:ss'),
      }));
      try {
        await updateList(
          {
            functionType: 'SUPPLIER_CHAIN',
            dataType: 'MAKE_ORDER',
          },
          changedItems
        );
        notification.success({
          message: '提交成功',
        });
        ds.query();
        // eslint-disable-next-line no-empty
      } catch {}
    } else {
      return notification.warning({
        message: '勾选MO必须为新建、已排期、已下达状态',
      });
    }
  } else {
    return notification.warning({
      message: '请先勾选',
    });
  }
}
/**
 * @name: 删除
 */
async function handleDelete(ds) {
  const data = ds.selected;
  if (data?.length) {
    const changedItems = ds.selected.map((i) => ({
      ...i.toJSONData(),
    }));
    try {
      await deleteList(
        {
          functionType: 'SUPPLIER_CHAIN',
          dataType: 'MAKE_ORDER',
        },
        changedItems
      );
      notification.success({
        message: '删除成功',
      });
      ds.query();
      // eslint-disable-next-line no-empty
    } catch {}
  } else {
    return notification.warning({
      message: '请先勾选',
    });
  }
}
const handleBatchImport = () => {
  openTab({
    // 编码是后端给出的
    key: `/himp/commentImport/LISP_DEMO_MO`,
    title: 'MO工作台数据导入',
    search: queryString.stringify({
      action: 'MO工作台数据导入',
    }),
  });
};
const MoTable = () => {
  const ds = new DataSet(moTableDS());
  const columns = [
    {
      header: 'No.',
      width: 50,
      lock: 'left',
      renderer({ record }) {
        return <span>{record.index + 1}</span>;
      },
    },
    { name: 'attribute1', lock: 'left', align: 'left', width: 120, tooltip: 'overflow' },
    { name: 'attribute2', lock: 'left', align: 'left', width: 130, tooltip: 'overflow' },
    {
      name: 'attribute3&4',
      align: 'left',
      width: 120,
      lock: 'left',
      renderer({ record }) {
        return (
          <div>
            <div>{record.get('attribute3')}</div>
            <div style={{ color: '#999' }}>{record.get('attribute4')}</div>
          </div>
        );
      },
    },
    {
      name: 'attribute5&6',
      align: 'left',
      width: 80,
      renderer({ record }) {
        return (
          <div>
            {record.get('attribute5')} {record.get('attribute6')}
          </div>
        );
      },
    },
    {
      name: 'attribute7',
      align: 'left',
      width: 80,
      renderer({ record }) {
        const attribute7 = record.get('attribute7');
        let bgColor;
        let fontColor;
        switch (attribute7) {
          case '已确认':
            bgColor = 'rgba(0,180,216, .1)';
            fontColor = 'rgba(0,180,216)';
            break;
          case '已回复':
            bgColor = 'rgba(3,150,199, .1)';
            fontColor = 'rgba(3,150,199)';
            break;
          case '已计划':
            bgColor = 'rgba(0,119,182, .1)';
            fontColor = 'rgba(0,119,182)';
            break;
          case '已下达':
            bgColor = 'rgba(221,223,3, .1)';
            fontColor = 'rgba(221,223,3)';
            break;
          case '运行中':
            bgColor = 'rgba(127,184,24, .1)';
            fontColor = 'rgba(127,184,24)';
            break;
          case '已完工':
            bgColor = '#F6FFED';
            fontColor = '#52C41A';
            break;
          case '已发运':
            bgColor = 'rgba(171,204,2, .1)';
            fontColor = 'rgba(171,204,2)';
            break;
          case '已接收':
            bgColor = 'rgba(127,184,24, .1)';
            fontColor = 'rgba(127,184,24)';
            break;
          case '已退货':
            bgColor = '#FFF1F0';
            fontColor = '#F5222D';
            break;
          default:
            bgColor = 'rgba(72,202,228, .1)';
            fontColor = '#48CAE4';
        }
        return (
          <span
            style={{
              padding: '4px 8px',
              borderRadius: '8px',
              backgroundColor: bgColor,
              textAlign: 'center',
              color: fontColor,
            }}
          >
            {attribute7}
          </span>
        );
      },
    },
    { name: 'attribute8', align: 'left', width: 120 },
    { name: 'attribute9', align: 'left', width: 120 },
    { name: 'attribute10', align: 'left', width: 80 },
    { name: 'attribute15', align: 'left', width: 120 },
    { name: 'attribute16', align: 'left', width: 120 },
    { name: 'attribute17', align: 'left', width: 120 },
    { name: 'attribute18', align: 'left', width: 120 },
    { name: 'attribute19', align: 'left', width: 120 },
    { name: 'attribute20', align: 'left', width: 120 },
    { name: 'attribute21', align: 'left', width: 120 },
    { name: 'attribute11', align: 'left', width: 120 },
    { name: 'attribute12', align: 'left', width: 120 },
    { name: 'attribute13', align: 'left', width: 120 },
    { name: 'attribute14', align: 'left', width: 80 },
    { name: 'attribute22', align: 'left', width: 100 },
    { name: 'attribute23', align: 'left', width: 120 },
    { name: 'attribute24', align: 'left', width: 100 },
    { name: 'attribute25', align: 'left', width: 100 },
    { name: 'attribute26', align: 'left', width: 140 },
    { name: 'attribute27', align: 'left', width: 140 },
    { name: 'attribute28', align: 'left', width: 140 },
    { name: 'attribute29', align: 'left', width: 140 },
    { name: 'attribute30', align: 'left', width: 140 },
    { name: 'attribute31', align: 'left', width: 140 },
    { name: 'attribute32', align: 'left', width: 80 },
    {
      name: 'attribute33',
      align: 'left',
      width: 160,
      renderer({ record }) {
        return (
          <div>
            <span>{record.get('attribute33')}-</span>
            <span>{record.get('attribute34')}</span>
          </div>
        );
      },
    },
    {
      name: 'attribute35&36',
      align: 'left',
      width: 120,
      renderer({ record }) {
        return (
          <div>
            <div>{record.get('attribute35')}</div>
            <div>{record.get('attribute36')}</div>
          </div>
        );
      },
    },
    {
      name: 'attribute37',
      align: 'left',
      width: 160,
      renderer({ record }) {
        return (
          <div>
            <span>{record.get('attribute37')}-</span>
            <span>{record.get('attribute38')}</span>
          </div>
        );
      },
    },
  ];
  return (
    <div className={style['mo-table']}>
      <Header title="MO工作台">
        <div className={style['btn-box']}>
          <Button className={style['btn-green']} onClick={handleBatchImport}>
            <img src={importImg} alt="导入" />
            导入
          </Button>
          {/* <Button onClick={() => handleScheduling(ds)}>
            <img src={outImg} alt="排产" />
            排产
          </Button> */}
          <Button onClick={() => handleRelease(ds)}>
            <img src={downImg} alt="下达" />
            下达
          </Button>
          <Button onClick={() => handlePending(ds)}>
            <img src={parseImg} alt="暂挂" />
            暂挂
          </Button>
          <Button onClick={() => handleCancelPending(ds)}>
            <img src={stopParseImg} alt="取消暂挂" />
            取消暂挂
          </Button>
          <Button onClick={() => handleCancel(ds)}>
            <img src={cancelImg} alt="取消" />
            取消
          </Button>
          <Button onClick={() => handleDelete(ds)} className={style['btn-red']}>
            <img src={delImg} alt="删除" />
            删除
          </Button>
        </div>
      </Header>
      <Content>
        <div className={style['content-box']}>
          <Table
            dataSet={ds}
            columns={columns}
            queryFieldsLimit={3}
            columnResizable="true"
            editMode="inline"
            border={false}
            rowHeight="52px"
          />
        </div>
      </Content>
    </div>
  );
};

export default MoTable;
