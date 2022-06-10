/*
 * @Description:
 * @Author: Zhong Kailong
 * @LastEditTime: 2021-03-30 13:38:10
 */

import React, { Component, Fragment } from 'react';
import { Card, Popconfirm } from 'choerodon-ui';
import { Button, Form } from 'choerodon-ui/pro';
import notification from 'utils/notification';
import { Content } from 'components/Page';
import { getResponse } from 'utils/utils';
// import { DataSet, Table, Button, TextField, Form, Modal } from 'choerodon-ui/pro';
// import intl from 'utils/intl';
import { DETAIL_CARD_CLASSNAME } from 'utils/constants';
import { updateCache } from '../../services/systemToolService';
// import styles from './index.less';

export default class WhiteList extends Component {
  async updateCache(item) {
    switch (item) {
      case '刷新资源':
        getResponse(await updateCache('RESOURCE'));
        notification.success({
          message: '刷新成功',
        });
        break;
      case '刷新组织':
        getResponse(await updateCache('ORGANIZATION'));
        notification.success({
          message: '刷新成功',
        });
        break;
      case '刷新物料':
        getResponse(await updateCache('ITEM'));
        notification.success({
          message: '刷新成功',
        });
        break;
      case '刷新商业实体':
        getResponse(await updateCache('PARTY'));
        notification.success({
          message: '刷新成功',
        });
        break;
      case '刷新单位':
        getResponse(await updateCache('UOM'));
        notification.success({
          message: '刷新成功',
        });
        break;
      case '刷新单据类型':
        getResponse(await updateCache('DOCUMENT_TYPE'));
        notification.success({
          message: '刷新成功',
        });
        break;
      case '刷新商业实体地点':
        getResponse(await updateCache('PARTY_SITE'));
        notification.success({
          message: '刷新成功',
        });
        break;
      case '刷新移动类型':
        getResponse(await updateCache('WM_MOVE_TYPE'));
        notification.success({
          message: '刷新成功',
        });
        break;
      case '刷新类别':
        getResponse(await updateCache('CATEGORY'));
        notification.success({
          message: '刷新成功',
        });
        break;
      case '刷新异常':
        getResponse(await updateCache('EXCEPTION'));
        notification.success({
          message: '刷新成功',
        });
        break;
      case '刷新安灯':
        getResponse(await updateCache('ANDON'));
        notification.success({
          message: '刷新成功',
        });
        break;
      case '刷新异常组':
        getResponse(await updateCache('EXCEPTION_GROUP'));
        notification.success({
          message: '刷新成功',
        });
        break;
      case '刷新规则':
        getResponse(await updateCache('RULE'));
        notification.success({
          message: '刷新成功',
        });
        break;
      case '刷新成本中心':
        getResponse(await updateCache('COST_CENTER'));
        notification.success({
          message: '刷新成功',
        });
        break;
      case '刷新事件类型':
        getResponse(await updateCache('EVENT_TYPE'));
        notification.success({
          message: '刷新成功',
        });
        break;
      default:
        notification.error({
          message: `出错了`,
        });
    }
  }

  listOne = ['刷新资源', '刷新组织', '刷新物料', '刷新商业实体', '刷新单位'];

  listTwo = ['刷新单据类型', '刷新商业实体地点', '刷新移动类型', '刷新类别', '刷新异常'];

  listThree = ['刷新安灯', '刷新异常组', '刷新规则', '刷新成本中心', '刷新事件类型'];

  listBox = [...this.listOne, ...this.listTwo, ...this.listThree];

  render() {
    return (
      <Fragment>
        <Content>
          <Card bordered={false} title="基础数据服务" className={DETAIL_CARD_CLASSNAME}>
            <Form columns={5}>
              {this.listBox.map((item) => {
                return (
                  <Popconfirm
                    key={item}
                    title={`是否${item}`}
                    onConfirm={() => {
                      this.updateCache(item);
                    }}
                  >
                    <Button icon="sync">{item}</Button>
                  </Popconfirm>
                );
              })}
            </Form>
          </Card>
        </Content>
      </Fragment>
    );
  }
}
