/**
 * @Description: 物料详情页面--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-27 17:04:00
 * @LastEditors: yu.na
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Bind } from 'lodash-decorators';
import { isEmpty } from 'lodash';
import {
  DataSet,
  Lov,
  Form,
  Select,
  TextField,
  IntlField,
  Switch,
  Button,
  NumberField,
} from 'choerodon-ui/pro';
import request from 'utils/request';
import notification from 'utils/notification';
import { getResponse } from 'utils/utils';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import { Header, Content } from 'components/Page';
import { versionUp, requestItem } from '@/services/itemService';

import { DetailDS } from '@/stores/itemDS';

@connect()
@formatterCollections({
  code: ['hg.item', 'hg.common'],
})
export default class DetailPage extends Component {
  state = {
    orgDisabled: false,
    isVersionUp: false,
    hisList: [],
    allDisabled: false,
  };

  detailDS = new DataSet({
    ...DetailDS(),
  });

  get isCreatePage() {
    const { match } = this.props;
    const { itemId } = match.params;
    return !itemId;
  }

  async componentDidMount() {
    if (this.isCreatePage) {
      await Promise.all([
        this.detailDS.create({}),
        this.detailDS.children.itemAps.create({ enabledFlag: true, planFlag: true }, 0),
        this.detailDS.children.itemScm.create({ enabledFlag: true }, 0),
        this.detailDS.children.itemSop.create({ enabledFlag: true }, 0),
        this.detailDS.children.itemMe.create({ enabledFlag: true }, 0),
        this.detailDS.children.itemWm.create({ enabledFlag: true }, 0),
      ]);
      const res = await request(`${HLOS_LMDS}/v1/lovs/sql/data?lovCode=LMDS.RULE&`, {
        method: 'GET',
        query: {
          ruleCode: 'MO_TASK_EXECUTE',
        },
      });
      if (res && res.content && res.content[0]) {
        this.detailDS.current.set('executeRuleObj', res.content[0]);
        this.handleRuleChange(res.content[0]);
      }
    } else {
      await this.refreshPage();
    }
  }

  /**
   * 刷新页面数据
   */
  @Bind()
  async refreshPage() {
    const { itemId } = this.props.match.params;
    this.detailDS.queryParameter = { itemId };
    const res = await this.detailDS.query();
    if (getResponse(res) && res.content && res.content[0]) {
      const hisRes = await requestItem({
        itemId,
        itemHisId: -1,
      });
      if (getResponse(hisRes) && !hisRes.failed && hisRes.content) {
        const list = [];
        hisRes.content.forEach((item) => {
          list.push({
            itemHisId: item.itemHisId,
            attributeBigint1: item.attributeBigint1,
          });
        });
        this.setState({
          hisList: list,
        });
      }
    }
  }

  /**
   * 保存
   */
  @Bind()
  async handleSubmit() {
    const { dispatch } = this.props;
    const {
      current,
      children: { itemAps, itemScm, itemSop, itemWm, itemMe },
    } = this.detailDS;
    const validateValue = await this.detailDS.validate(false, false);

    if (!validateValue) {
      notification.error({
        message: intl.get('hg.item.view.message.valid.error').d('存在必输字段没有填写完毕，请完善'),
      });
      return;
    }

    if (itemWm.current && !itemWm.current.get('wmOuId')) {
      notification.error({
        message: intl.get('lmds.item.view.message.valid.WmOu').d('当前选中工厂没有对应的仓储中心'),
      });
      return;
    }

    if (this.isCreatePage) {
      itemAps.current.set('itemCode', current.get('itemCode'));
      itemScm.current.set('itemCode', current.get('itemCode'));
      itemSop.current.set('itemCode', current.get('itemCode'));
      itemWm.current.set('itemCode', current.get('itemCode'));
      itemMe.current.set('itemCode', current.get('itemCode'));
    }

    const res = await this.detailDS.submit(false, false);
    if (res && res.failed && res.message) {
      notification.error({
        message: res.message,
      });
      throw new Error(res);
    } else if (res === undefined) {
      notification.info({
        message: intl.get('hzero.common.view.message.title.noChange').d('未修改数据'),
      });
      return;
    }

    if (this.isCreatePage && res && res.content && res.content[0]) {
      // 新建页面创建数据成功后跳转到详情页面
      const pathname = `/hg/item/detail/${res.content[0].itemId}`;
      dispatch(
        routerRedux.push({
          pathname,
        })
      );
    } else if (!this.isCreatePage) {
      await this.refreshPage();
    }
  }

  /**
   * 确认升级
   */
  @Bind()
  async handleUpgradeConfirm() {
    const { itemAps, itemWm, itemScm, itemSop, itemMe } = this.detailDS.children;
    const res = await versionUp({
      ...this.detailDS.current.toJSONData(),
      itemAps: itemAps.data[0].toJSONData(),
      itemScm: {
        ...itemScm.data[0].toJSONData(),
        organizationId: this.detailDS.current.get('meOuId'),
        organizationCode: this.detailDS.current.get('meOuCode'),
      },
      itemSop: {
        ...itemSop.data[0].toJSONData(),
        organizationId: this.detailDS.current.get('meOuId'),
        organizationCode: this.detailDS.current.get('meOuCode'),
      },
      itemWm: {
        ...itemWm.data[0].toJSONData(),
        organizationId: this.detailDS.current.get('meOuId'),
        organizationCode: this.detailDS.current.get('meOuCode'),
      },
      itemMe: {
        ...itemMe.data[0].toJSONData(),
        organizationId: this.detailDS.current.get('meOuId'),
        organizationCode: this.detailDS.current.get('meOuCode'),
      },
    });
    if (getResponse(res) && !res.failed) {
      notification.success();
      this.setState({
        isVersionUp: false,
      });
      await this.refreshPage();
    }
  }

  /**
   * 升级版本
   */
  @Bind()
  handleUpgrade() {
    this.setState(
      {
        orgDisabled: true,
        attributeBigint1: Number(this.detailDS.current.get('attributeBigint1')) + 1,
        isVersionUp: true,
      },
      () => {
        const { attributeBigint1 } = this.state;
        this.detailDS.current.set('attributeBigint1', attributeBigint1);
      }
    );
  }

  /**
   * 查看版本
   */
  @Bind()
  async handleShowVersionChange(value) {
    if (value) {
      this.detailDS.queryParameter = { itemHisId: value };
      this.detailDS.children.itemAps.queryParameter = { itemHisId: value, hisFlag: 'Y' };
      this.detailDS.children.itemWm.queryParameter = { itemHisId: value, hisFlag: 'Y' };
      this.detailDS.children.itemMe.queryParameter = { itemHisId: value, hisFlag: 'Y' };
      this.detailDS.children.itemScm.queryParameter = { itemHisId: value, hisFlag: 'Y' };
      this.detailDS.children.itemSop.queryParameter = { itemHisId: value, hisFlag: 'Y' };
      this.setState({
        allDisabled: true,
      });
    } else {
      const { match } = this.props;
      const { itemId } = match.params;
      this.detailDS.queryParameter = { itemId };
      this.detailDS.children.itemAps.queryParameter = { hisFlag: null };
      this.detailDS.children.itemWm.queryParameter = { hisFlag: null };
      this.detailDS.children.itemSop.queryParameter = { hisFlag: null };
      this.detailDS.children.itemMe.queryParameter = { hisFlag: null };
      this.detailDS.children.itemScm.queryParameter = { hisFlag: null };
      this.setState({
        allDisabled: false,
      });
    }
    const res = await this.detailDS.query();
    if (value && res && res.content && res.content[0]) {
      const { descriptionHis } = res.content[0];
      this.detailDS.current.set('description', descriptionHis);
    }
  }

  @Bind()
  handleMeOuChange(record) {
    const {
      current,
      children: { itemAps, itemScm, itemSop, itemWm, itemMe },
    } = this.detailDS;
    if (itemMe.current) {
      itemMe.current.set('meOuObj', record);
    }
    if (itemAps.current && itemScm.current && itemSop.current && itemWm.current) {
      if (!isEmpty(record)) {
        itemAps.current.set('apsOuName', current.get('meOuObj').apsOu || '');
        itemAps.current.set('apsOuId', current.get('meOuObj').apsOuId || '');
        itemAps.current.set('apsOuCode', current.get('meOuObj').apsOuCode || '');
        itemScm.current.set('scmOuName', current.get('meOuObj').scmOu || '');
        itemScm.current.set('scmOuId', current.get('meOuObj').scmOuId || '');
        itemScm.current.set('scmOuCode', current.get('meOuObj').scmOuCode || '');
        itemWm.current.set('wmOuName', current.get('meOuObj').wmOuName || '');
        itemWm.current.set('wmOuId', current.get('meOuObj').wmOuId || '');
        itemWm.current.set('wmOuCode', current.get('meOuObj').wmOuCode || '');
        itemSop.current.set('sopOuName', current.get('meOuObj').sopOu || '');
        itemSop.current.set('sopOuId', current.get('meOuObj').sopOuId || '');
        itemSop.current.set('sopOuCode', current.get('meOuObj').sopOuCode || '');
        itemSop.current.set('apsOuName', current.get('meOuObj').apsOu || '');
        itemSop.current.set('apsOuId', current.get('meOuObj').apsOuId || '');
        itemSop.current.set('apsOuCode', current.get('meOuObj').apsOuCode || '');
      } else {
        itemAps.current.set('apsOuName', '');
        itemAps.current.set('apsOuId', '');
        itemAps.current.set('apsOuCode', '');
        itemScm.current.set('scmOuName', '');
        itemScm.current.set('scmOuId', '');
        itemScm.current.set('scmOuCode', '');
        itemWm.current.set('wmOuName', '');
        itemWm.current.set('wmOuId', '');
        itemWm.current.set('wmOuCode', '');
        itemSop.current.set('sopOuName', '');
        itemSop.current.set('sopOuId', '');
        itemSop.current.set('sopOuCode', '');
        itemSop.current.set('apsOuName', '');
        itemSop.current.set('apsOuId', '');
        itemSop.current.set('apsOuCode', '');
      }
    }
  }

  @Bind()
  handleUomChange(record) {
    const {
      current,
      children: { itemWm },
    } = this.detailDS;
    if (itemWm.current) {
      if (!isEmpty(record)) {
        itemWm.current.set('uomId', current.get('uomObj').uomId || '');
        itemWm.current.set('uom', current.get('uomObj').uomCode || '');
        itemWm.current.set('uomName', current.get('uomObj').uomName || '');
      } else {
        itemWm.current.set('uomId', '');
        itemWm.current.set('uom', '');
        itemWm.current.set('uomName', '');
      }
    }
  }

  @Bind()
  handleWarehouseChange(record) {
    const {
      children: { itemMe },
    } = this.detailDS;
    if (itemMe.current) {
      if (!isEmpty(record)) {
        itemMe.current.set('warehouseObj', record);
      } else {
        itemMe.current.set('warehouseObj', null);
      }
    }
  }

  @Bind()
  handleMtoChange(val) {
    const {
      children: { itemAps },
    } = this.detailDS;
    if (itemAps.current) {
      itemAps.current.set('mtoFlag', val);
    }
  }

  @Bind()
  handleRuleChange(record) {
    const {
      children: { itemMe },
    } = this.detailDS;
    if (itemMe.current) {
      if (!isEmpty(record)) {
        itemMe.current.set('executeRuleId', record.ruleId);
      } else {
        itemMe.current.set('executeRuleId', null);
      }
    }
  }

  render() {
    const { isVersionUp, orgDisabled, hisList, allDisabled } = this.state;
    return (
      <Fragment>
        <Header
          title={
            this.isCreatePage
              ? intl.get('hzero.common.status.create').d('创建')
              : intl.get('hzero.common.status.edit').d('编辑')
          }
          backPath="/hg/item/list"
        >
          {!isVersionUp && (
            <Button icon="save" color="primary" onClick={this.handleSubmit} disabled={allDisabled}>
              {intl.get('hzero.common.button.save').d('保存')}
            </Button>
          )}
          {isVersionUp && (
            <Button onClick={this.handleUpgradeConfirm}>
              {intl.get('hg.item.button.upgrade.confirm').d('确认升级')}
            </Button>
          )}
          {!isVersionUp && (
            <Button onClick={this.handleUpgrade} disabled={allDisabled || this.isCreatePage}>
              {intl.get('hg.item.button.upgrade').d('升级版本')}
            </Button>
          )}
          {!isVersionUp && (
            <Select
              onChange={this.handleShowVersionChange}
              placeholder={intl.get('hg.item.button.version').d('查看版本')}
              disabled={this.isCreatePage}
            >
              {hisList.map((item) => {
                return (
                  <Select.Option key={item.itemHisId} value={item.itemHisId}>
                    {item.attributeBigint1}
                  </Select.Option>
                );
              })}
            </Select>
          )}
        </Header>
        <Content className="item-content">
          <Form dataSet={this.detailDS} columns={4}>
            <Lov
              name="meOuObj"
              noCache
              disabled={orgDisabled || allDisabled}
              onChange={this.handleMeOuChange}
            />
            <TextField name="itemCode" disabled={!this.isCreatePage || allDisabled} />
            <IntlField name="description" disabled={allDisabled} />
            <IntlField name="itemAlias" disabled={allDisabled} />
            <Select name="itemType" disabled={allDisabled} />
            <Lov name="uomObj" noCache disabled={allDisabled} onChange={this.handleUomChange} />
            <Lov
              name="warehouseObj"
              noCache
              disabled={allDisabled}
              onChange={this.handleWarehouseChange}
            />
            <TextField name="specification" disabled={allDisabled} />
            <TextField name="featureCode" disabled={allDisabled} />
            <TextField name="featureDesc" disabled={allDisabled} />
            <TextField name="designCode" disabled={allDisabled} />
            <NumberField name="length" disabled={allDisabled} />
            <NumberField name="width" disabled={allDisabled} />
            <NumberField name="height" disabled={allDisabled} />
            <TextField name="attributeBigint1" disabled />
            <TextField name="attributeString1" colSpan={2} disabled={allDisabled} />
            <Lov
              name="executeRuleObj"
              noCache
              disabled={allDisabled}
              onChange={this.handleRuleChange}
            />
            <TextField name="lastUpdatedName" disabled />
            <Switch name="attributeTinyint1" disabled={allDisabled} />
            <Switch name="mtoFlag" disabled={allDisabled} onChange={this.handleMtoChange} />
            <Switch name="enabledFlag" disabled={allDisabled} />
          </Form>
        </Content>
      </Fragment>
    );
  }
}
