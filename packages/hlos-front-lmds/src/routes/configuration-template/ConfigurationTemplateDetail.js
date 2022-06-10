/*
 * @Description: 配置模版明细
 * @Author: liangkun, <kun.liang01@hand-china.com>
 * @Date: 2020-06-03 15:58:31
 * @LastEditors: liangkun
 * @LastEditTime: 2020-06-03 16:12:01
 * @Copyright: Copyright (c) 2018, Hand
 */

import React, { Fragment, useState, useEffect } from 'react';
import {
  Lov,
  Tabs,
  Form,
  Spin,
  Table,
  Button,
  Switch,
  Select,
  DataSet,
  TextField,
  notification,
} from 'choerodon-ui/pro';
import { connect } from 'dva';
import { isEmpty } from 'lodash';
import { Header, Content } from 'components/Page';
import { useDataSet } from 'hzero-front/lib/utils/hooks';

import {
  configurationTemplateDetailHeadDS,
  configurationTemplateDetailDLineS,
} from './stores/configurationTemplateDS';

const { TabPane } = Tabs;

const todoLineDataSetFactory = () => new DataSet(configurationTemplateDetailDLineS());
const todoHeadDataSetFactory = () =>
  new DataSet({
    ...configurationTemplateDetailHeadDS(),
    children: {
      map: todoLineDataSetFactory(),
    },
  });
const ConfigurationTemplateDetailPage = (props) => {
  const headDS = useDataSet(todoHeadDataSetFactory);
  const lineDS = useDataSet(todoLineDataSetFactory);

  const [saveLoading, setSaveLoading] = useState(false);
  const [queryTemplateId, setQueryTemplateId] = useState('');
  const [isDisabled, setIsDisabled] = useState(true);
  const [tabList, setTabList] = useState({ exist: [] });
  const [curKey, setCurKey] = useState('');

  useEffect(() => {
    let { id } = props.match.params;
    if (id === 'create') {
      id = '';
      setIsDisabled(false);
      return;
    }
    setQueryTemplateId(id);
    handleSearch(id);
  }, [props.match.params.id]);

  /**
   * 查询
   * @param {number} id 模版id
   */
  function handleSearch(id) {
    return new Promise(() => {
      headDS.setQueryParameter('templateId', id);
      headDS.query().then((res) => {
        if (res && !res.failed) {
          const {
            categoryTemplateId,
            categoryTemplateCode,
            categoryTemplateName,
            createdBy,
            creationDate,
            enabledFlag,
            lastUpdateDate,
            lastUpdatedBy,
            map,
            objectVersionNumber,
            templateCode,
            templateFunction,
            templateId,
            templateName,
            templateTable,
          } = res;
          lineDS.data = !isEmpty(map) && Object.values(map)[0] ? [...Object.values(map)[0]] : [];
          headDS.data = [
            {
              objectVersionNumber,
              templateCode,
              templateFunction,
              templateId,
              templateName,
              templateTable,
              categoryTemplateId,
              categoryTemplateCode,
              categoryTemplateName,
              createdBy,
              creationDate,
              enabledFlag,
              lastUpdateDate,
              lastUpdatedBy,
            },
          ];
          setTabList(map);
          setCurKey(Object.keys(map)[0]);
        }
      });
    });
  }

  /**
   * table列
   * @returns
   */
  function columns() {
    return [
      { name: 'customizationCode' },
      { name: 'customizationName' },
      { name: 'customizationDesc' },
      { name: 'mustInputFlag' },
      { name: 'enabledFlag', editor: true },
    ];
  }

  /**
   * 保存
   */
  function handleSave() {
    setSaveLoading(true);
    return new Promise((resolve) => {
      const newTabDataList = {
        ...tabList,
        [curKey]: lineDS.toData(),
      };
      const lineData = lineDS.toData();
      if (!lineData.length) {
        notification.warning({
          message: '请进行字段同步',
          placement: 'bottomRight',
        });
        resolve(setSaveLoading(false));
        return false;
      }
      const {
        match: {
          params: { id },
        },
        dispatch,
      } = props;
      dispatch({
        type: 'configuration/saveTemplate',
        payload: {
          data: {
            ...headDS.toData()[0],
            map: newTabDataList,
          },
          method: 'POST',
        },
      }).then((res) => {
        resolve(setSaveLoading(false));
        if (res && !res.failed) {
          notification.success({
            message: '保存成功',
            placement: 'bottomRight',
          });
          if (id === 'create') {
            const pathname = `/lmds/configuration-template/detail/${res.templateId}`;
            props.history.push(pathname);
          } else {
            handleSearch(id);
          }
        }
      });
    });
  }

  /**
   * 字段同步
   */
  function handleFieldAsync() {
    return new Promise((resolve) => {
      headDS.setQueryParameter('type', 'init');
      headDS.validate(false, false).then((validate) => {
        if (!validate) {
          resolve();
          return false;
        }
        handleSearch(queryTemplateId);
        resolve();
      });
    });
  }

  /**
   * 头表
   * @returns
   */
  function formFields() {
    return [
      <TextField name="templateCode" key="templateCode" disabled={isDisabled} />,
      <TextField name="templateName" key="templateName" />,
      <Select name="templateFunction" key="templateFunction" disabled={isDisabled} />,
      <Lov name="category" key="category" disabled={isDisabled} />,
      <TextField name="templateTable" key="templateTable" disabled={isDisabled} />,
      <Switch name="enabledFlag" key="enabledFlag" />,
    ];
  }

  /**
   * 切换页签设置对应表格数据
   * @param {*} key 页签唯一标示 - 对应表名
   */
  function handleTabsChange(key) {
    const curLineData = lineDS.toData();
    const tabData = tabList[key];
    const newTabDataList = {
      ...tabList,
      [curKey]: curLineData,
    };
    setTabList(newTabDataList);
    setCurKey(key);
    lineDS.data = tabData;
  }

  return (
    <Fragment>
      <Spin dataSet={headDS}>
        <Header title="配置模版明细" backPath="/lmds/configuration-template/list">
          <Button onClick={handleSave} loading={saveLoading} color="primary">
            保存
          </Button>
          <Button onClick={handleFieldAsync}>字段同步</Button>
        </Header>
        <Content>
          <Form dataSet={headDS} columns={4} style={{ flex: 'auto' }} header="功能配置">
            {formFields()}
          </Form>
          <p className="c7n-pro-form-header">配置详情</p>
          <Tabs defaultActiveKey={Object.keys(tabList)[0]} onChange={handleTabsChange}>
            {Object.entries(tabList).map((tab) => (
              <TabPane tab={tab[0]} key={tab[0]}>
                <Table
                  dataSet={lineDS}
                  columns={columns()}
                  border={false}
                  columnResizable="true"
                  pagination={false}
                />
              </TabPane>
            ))}
          </Tabs>
        </Content>
      </Spin>
    </Fragment>
  );
};

export default connect()((props) => ConfigurationTemplateDetailPage(props));
