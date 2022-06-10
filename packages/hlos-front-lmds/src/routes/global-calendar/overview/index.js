/*
 * @Description: 日历总览视图--Index
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2019-11-18 16:49:24
 * @LastEditors: 赵敏捷
 */

import React from 'react';
import { connect } from 'dva';
import { Modal } from 'choerodon-ui/pro';
import intl from 'utils/intl';

import Calendars from './calendars';
import ModifyCalendarForm from './ModifyCalendarForm';

const key = Modal.key();

@connect(({ calendar }) => ({
  calendar,
}))
export default class Overview extends React.Component {
  // 避免打开多个弹框
  onProcessing = false;

  // 编辑表单的引用
  modifyFormRef = null;

  modalInstance = null;

  componentDidUpdate(prevProps) {
    const { drawVisible } = this.props;
    if (prevProps.drawVisible !== drawVisible) {
      if (drawVisible) {
        this.renderCreateAndModifyDrawer();
      } else if (this.modalInstance) {
        this.modalInstance.close();
        this.modifyFormRef = null;
        this.modalInstance = null;
      }
    }
  }

  handleModalClose = (type) => {
    this.onProcessing = false;
    const { afterSave } = this.props;
    afterSave(type);
  };

  renderCreateAndModifyDrawer = () => {
    const { dispatch, type } = this.props;
    const calendarId = this.props.currentCalendarInfo?.calendarId;
    const { month } = this.props;
    if (!this.onProcessing) {
      this.onProcessing = true;
      this.modalInstance = Modal.open({
        key,
        drawer: true,
        closable: true,
        okText: intl.get('hzero.common.button.save').d('保存'),
        title:
          type === 'NEW'
            ? intl.get('hzero.common.status.create').d('新建')
            : intl.get('hzero.common.status.edit').d('编辑'),
        children: (
          <ModifyCalendarForm
            ref={(node) => {
              this.modifyFormRef = node;
            }}
            type={type}
            calendarId={calendarId}
            month={month}
          />
        ),
        afterClose: () => this.handleModalClose('closeOnly'),
        onOk: () =>
          new Promise(async (resolve, reject) => {
            const ds = this.modifyFormRef?.modifyCalendarFormDS;
            if (ds && ds.dirty) {
              const isDSValidate = await ds.validate(false, false);
              if (!isDSValidate) {
                reject(intl.get('hzero.common.view.message.valid.error').d('数据校验失败'));
                return;
              }
              try {
                await ds.submit();
                resolve();
              } catch {
                reject();
              }
            } else {
              resolve();
            }
          }),
      });
      const { close } = this.modalInstance;
      // 存储关闭弹窗方法
      dispatch({
        type: 'calendar/onCreateOrModifyCalendar',
        payload: {
          closeCreateAndModifyModal: close,
        },
      });
    }
  };

  render() {
    const { month, onScroll, onNextStep, calendars, onSelectCalendar } = this.props;
    return (
      <React.Fragment>
        <Calendars
          month={month}
          onScroll={onScroll}
          onHeaderClick={onNextStep}
          calendars={calendars}
          onCalendarSelect={(code) => {
            if (onSelectCalendar) {
              onSelectCalendar(code);
            }
          }}
        />
      </React.Fragment>
    );
  }
}
