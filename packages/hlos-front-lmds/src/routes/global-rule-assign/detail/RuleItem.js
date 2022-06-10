/*
 * @Author: zhang yang
 * @Description: 规则项 - 列表
 * @E-mail: yang.zhang14@hand-china.com
 * @Date: 2019-11-26 14:40:12
 */

import React, { PureComponent, Fragment } from 'react';
import { Table, CheckBox } from 'choerodon-ui/pro';
import { Bind } from 'lodash-decorators';

export default class RuleItem extends PureComponent {

  @Bind
  handleCheckBox() {
    const { ruleDetailDS, onSubmit } = this.props;
    const currentData = ruleDetailDS.children.ruleItemDS.current.toData();
    if (currentData && currentData.assignValueId) {
      onSubmit();
    }
  }

  get columns() {
    return [
      { name: 'keyCode', width: 100 },
      { name: 'ruleKeyName' },
      { name: 'description' },
      { name: 'keyTypeMeaning' },
      { name: 'keyValue', editor: true },
      {
        name: 'enabledFlag',
        editor: <CheckBox onChange={this.handleCheckBox} />,
        align: 'center',
        width: 100,
      },
    ];
  }

  render() {
    const { ruleDetailDS } = this.props;
    const tableProps = {
      columns: this.columns,
      dataSet: ruleDetailDS.children.ruleItemDS,
    };
    return (
      <Fragment>
        <Table {...tableProps} />
      </Fragment>
    );
  }
}