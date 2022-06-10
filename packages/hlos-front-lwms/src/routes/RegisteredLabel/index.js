/*
 * @Description:注册标签
 * @Author: hongming。zhang@hand-china.com
 * @Date: 2020-12-21 12:53:30
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-02-02 14:24:58
 */
import React, { Fragment, useMemo, useState, useCallback, useEffect, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import { Header, Content } from 'components/Page';
import notification from 'utils/notification';
import {
  Lov,
  DataSet,
  Radio,
  Button,
  TextField,
  Select,
  Switch,
  NumberField,
  Icon,
  Modal,
} from 'choerodon-ui/pro';
import { Table, Row, Col } from 'choerodon-ui';
import { userSetting } from 'hlos-front/lib/services/api';
import { submitRegisteredLabel, queryRegisteredLabel } from '@/services/registeredLabel';

import { getCurrentOrganizationId } from 'utils/utils';
import { queryDs, inputQueryDs } from '@/stores/registeredLabelDS';
import { printTag } from '@/services/tagPrintService';

import './index.less';

const { Option } = Select;
function EmhStatisticsReport(props) {
  const [checkedValue, setCheckedValue] = useState('autogeneration');
  const [checkedBoxValue, setCheckedBoxValue] = useState('EMPTY_TAG');
  const [customCodingList, setCustomCodingList] = useState([]);
  const [codeRuleDisabled, setCodeRuleDisabled] = useState(true);
  const loginQueryDS = useMemo(() => new DataSet(queryDs()), []);
  const inputQueryDS = useMemo(() => new DataSet(inputQueryDs()), []);
  const tagNumRef = useRef();

  const handleRadioChange = (val) => {
    inputQueryDS.current.reset();
    loginQueryDS.current.reset();
    loginQueryDS.current.set('radioList', val);
    setCustomCodingList([]);
    if (val) setCheckedValue(val);
  };
  const handleCodeRuleChange = (val) => {
    if (checkedValue === 'autogeneration') {
      setCodeRuleDisabled(!val);
    }
  };
  const handleChange = (val) => setCheckedBoxValue(val);
  if (checkedValue === 'externalCode') {
    inputQueryDS.current.getField('inputLabelNum').set('required', true);
    inputQueryDS.current.getField('startRunningWater').set('required', false);
    inputQueryDS.current.getField('labelNum').set('required', false);
    inputQueryDS.current.getField('labelCodingRule').set('required', false);
  }
  if (checkedValue === 'autogeneration') {
    inputQueryDS.current.getField('inputLabelNum').set('required', false);
    inputQueryDS.current.getField('labelCodingRule').set('required', true);
    inputQueryDS.current.getField('startRunningWater').set('required', false);
    inputQueryDS.current.getField('labelNum').set('required', true);
  }
  if (checkedValue === 'customCoding') {
    inputQueryDS.current.getField('inputLabelNum').set('required', false);
    inputQueryDS.current.getField('labelCodingRule').set('required', false);
    inputQueryDS.current.getField('labelNum').set('required', true);
  }

  /**
   * @description: 首次进入设置默认组织并查询
   */
  useEffect(() => {
    async function getUserInfo() {
      const res = await userSetting({ defaultFlag: 'Y' });
      if (res && res.content && res.content.length) {
        loginQueryDS.current.set('organizationObj', {
          organizationId: res.content[0].organizationId,
          organizationCode: res.content[0].organizationCode,
          organizationName: res.content[0].organizationName,
        });
      }
      handleSearch();
    }
    getUserInfo();
  }, []);
  /**
   * @description: 清空按钮
   */
  const handleClear = () => {
    Modal.confirm({
      children: <p>是否清空?</p>,
    }).then((button) => {
      if (button === 'ok') {
        setCustomCodingList([]);
      }
    });
  };
  /**
   * @description: 查询按钮
   */
  const handleSearch = useCallback(async () => {
    let newParams = {};
    const loginQueryDSValidate = await inputQueryDS.validate(false, false);
    if (!loginQueryDSValidate) {
      return;
    }
    if (inputQueryDS.current && inputQueryDS.current.data) {
      const {
        labelNum,
        inputLabelNum,
        editThePrefix,
        startRunningWater,
        labelCodingRule,
      } = inputQueryDS.current.data;
      let runningWaterList = [];
      if (checkedValue === 'autogeneration') {
        newParams = {
          times: labelNum,
          code: labelCodingRule?.ruleCode ? labelCodingRule.ruleCode : undefined,
        };
        queryRegisteredLabel(newParams).then((res) => {
          if (res) {
            if (!res.failed) {
              runningWaterList = res;
              setCustomCodingList((k) => [...k, ...runningWaterList]);
            } else {
              notification.error({
                message: res.message,
              });
            }
          }
        });
      } else if (checkedValue === 'customCoding') {
        newParams = {
          labelNum,
          editThePrefix,
          startRunningWater,
        };
        const num = labelNum;
        const prefix = editThePrefix === undefined ? '' : editThePrefix;
        const start = startRunningWater - 0;
        for (let i = 0; i < num; i++) {
          runningWaterList.push(`${prefix}${start + i}`);
        }
        setCustomCodingList(runningWaterList);
      } else {
        customCodingList.forEach((item) => {
          runningWaterList.push(item);
        });
        const index = runningWaterList.indexOf(inputLabelNum);
        if (index > -1) {
          Modal.confirm({
            children: <p>该标签号已录入，是否删除？</p>,
            okText: '是',
            cancelText: '否',
            onOk: () => {
              runningWaterList.splice(index, 1);
              setCustomCodingList(runningWaterList);
            },
          });
          inputQueryDS.current.set('inputLabelNum', '');
        } else {
          runningWaterList.unshift(inputLabelNum);
          setCustomCodingList(runningWaterList);
        }
        tagNumRef.current.focus();
      }
      inputQueryDS.current.set('startRunningWater', null);
    }
  }, [checkedValue, customCodingList]);

  const columns = [
    {
      title: '序号',
      dataIndex: 'no',
      width: 50,
    },
    {
      title: '标签号',
      dataIndex: 'tagNumber',
      width: 360,
    },
  ];
  const data = [];
  customCodingList.forEach((item, index) => {
    data.push({
      key: index,
      tagNumber: item,
      no: index + 1,
    });
  });
  /**
   * @description: 遍历标签
   */
  const LabelList = () => {
    return (
      <>
        <p>
          <span style={{ color: '#0066FF' }}>标签数: {data.length}</span>
        </p>
        <div className="label-List">
          <Table columns={columns} dataSource={data} bordered pagination={false} />
        </div>
      </>
    );
  };
  /**
   * @description: 提交按钮
   */
  const handleSubmit = useCallback(async () => {
    // const loginQueryDSValidate = await loginQueryDS.validate(false, false);
    // const inputQueryDSValidate = await inputQueryDS.validate(false, false);
    // if (!loginQueryDSValidate || !inputQueryDSValidate) {
    //   return;
    // }
    if (customCodingList.length === 0) {
      return;
    }
    if (loginQueryDS.current && loginQueryDS.current.data) {
      const {
        organizationObj,
        tagType,
        labelCategory,
        methodEnabledFlag,
        innerTagMethod,
        containerType,
        fullAmount,
        ownerType,
        owner,
      } = loginQueryDS.current.data;
      const tagList = [];
      customCodingList.forEach((item) => {
        const oneTags = {
          organizationId: organizationObj?.organizationId
            ? organizationObj.organizationId
            : undefined,
          organizationCode: organizationObj?.organizationCode
            ? organizationObj.organizationCode
            : undefined,
          tagType,
          tagCode: item,
          tagCategoryId: labelCategory?.categoryId ? labelCategory.categoryId : undefined,
          tagCategoryCode: labelCategory?.categoryCode ? labelCategory.categoryCode : undefined,
          methodEnabledFlag,
          innerTagMethod,
          containerTypeId: containerType?.containerTypeId
            ? containerType.containerTypeId
            : undefined,
          containerTypeCode: containerType?.containerTypeCode
            ? containerType.containerTypeCode
            : undefined,
          capacityQty: fullAmount,
          containerOwnerType: ownerType,
          containerOwnerId: owner?.partyId ? owner.partyId : undefined,
          containerOwnerNumber: owner?.partyNumber ? owner.partyNumber : undefined,
        };
        tagList.push(oneTags);
      });
      await submitRegisteredLabel(tagList).then((res) => {
        if (res) {
          if (!res.failed) {
            notification.success({
              message: '注册成功',
            });
            setCustomCodingList([]);
          } else {
            notification.error({
              message: res.message,
            });
          }
        }
      });
    }
  }, [customCodingList]);

  /**
   * @description: 提交并打印按钮
   */
  const handlePrint = useCallback(async () => {
    // const loginQueryDSValidate = await loginQueryDS.validate(false, false);
    // const inputQueryDSValidate = await inputQueryDS.validate(false, false);
    // if (!loginQueryDSValidate || !inputQueryDSValidate) {
    //   return;
    // }
    if (customCodingList.length === 0) {
      return;
    }
    const templateCode = inputQueryDS.current.data?.printModel?.templateCode;
    if (templateCode) {
      if (loginQueryDS.current && loginQueryDS.current.data) {
        const {
          organizationObj,
          tagType,
          labelCategory,
          methodEnabledFlag,
          innerTagMethod,
          containerType,
          fullAmount,
          ownerType,
          owner,
        } = loginQueryDS.current.data;
        const tagList = [];
        customCodingList.forEach((item) => {
          const oneTags = {
            organizationId: organizationObj?.organizationId
              ? organizationObj.organizationId
              : undefined,
            organizationCode: organizationObj?.organizationCode
              ? organizationObj.organizationCode
              : undefined,
            tagType,
            tagCode: item,
            tagCategoryId: labelCategory?.categoryId ? labelCategory.categoryId : undefined,
            tagCategoryCode: labelCategory?.categoryCode ? labelCategory.categoryCode : undefined,
            methodEnabledFlag,
            innerTagMethod,
            containerTypeId: containerType?.containerTypeId
              ? containerType.containerTypeId
              : undefined,
            containerTypeCode: containerType?.containerTypeCode
              ? containerType.containerTypeCode
              : undefined,
            capacityQty: fullAmount,
            containerOwnerType: ownerType,
            containerOwnerId: owner?.partyId ? owner.partyId : undefined,
            containerOwnerNumber: owner?.partyNumber ? owner.partyNumber : undefined,
          };
          tagList.push(oneTags);
        });
        await submitRegisteredLabel(tagList).then(async (res) => {
          if (res) {
            if (!res.failed) {
              setCustomCodingList([]);
              await printTag(tagList);
              props.history.push({
                pathname: `/lwms/registered-label/print/${templateCode}`,
                search: `tenantId=${getCurrentOrganizationId()}`,
                tagParams: tagList,
                tagType,
                backPath: '/lwms/registered-label/list',
              });
            } else {
              notification.error({
                message: res.message,
              });
            }
          }
        });
      }
    } else {
      notification.warning({
        message: '请选择标签打印模板',
      });
    }
  }, [customCodingList]);
  const RenderBar = () => {
    return (
      <div className="registered-label-page">
        <Row>
          <Col span={14}>
            <div className="page-left">
              <div>
                <Radio
                  mode="button"
                  name="radioList"
                  dataSet={loginQueryDS}
                  value="autogeneration"
                  defaultChecked
                  onChange={handleRadioChange}
                  style={{ marginRight: 10 }}
                >
                  自动生成
                </Radio>
                <Radio
                  mode="button"
                  name="radioList"
                  dataSet={loginQueryDS}
                  value="externalCode"
                  onChange={handleRadioChange}
                  style={{ marginRight: 10 }}
                >
                  外部编码
                </Radio>
                <Radio
                  mode="button"
                  name="radioList"
                  dataSet={loginQueryDS}
                  value="customCoding"
                  onChange={handleRadioChange}
                  style={{ marginRight: 25 }}
                >
                  自定义编码
                </Radio>
                <Lov
                  name="labelCodingRule"
                  disabled={checkedValue !== 'autogeneration'}
                  dataSet={inputQueryDS}
                  style={{ width: 266 }}
                  onChange={handleCodeRuleChange}
                />
              </div>
              <div className="page-left-line">
                <Lov
                  name="organizationObj"
                  focus
                  dataSet={loginQueryDS}
                  style={{ width: 266, marginRight: 25 }}
                />
                <Select
                  name="logonMode"
                  dataSet={loginQueryDS}
                  value={checkedBoxValue}
                  onChange={handleChange}
                  style={{ width: 266 }}
                  placeholder="注册方式"
                >
                  <Option value="EMPTY_TAG">空标签</Option>
                  <Option value="CONTAINER_TAG">容器标签</Option>
                </Select>
              </div>
              <div className="page-left-line">
                <Select
                  name="tagType"
                  dataSet={loginQueryDS}
                  style={{ width: 266, marginRight: 25 }}
                  placeholder="标签类型"
                />
                <Lov name="labelCategory" dataSet={loginQueryDS} style={{ width: 266 }} />
              </div>

              <div className="page-left-line">
                是否跟随移动:
                <Switch
                  style={{ marginLeft: 10 }}
                  dataSet={loginQueryDS}
                  name="methodEnabledFlag"
                />
                <Select
                  name="innerTagMethod"
                  dataSet={loginQueryDS}
                  style={{ width: 266, marginRight: 25, marginLeft: 153 }}
                  placeholder="标签类型"
                />
              </div>

              <div className="page-left-line" style={{ marginTop: 40 }}>
                <Lov
                  name="containerType"
                  disabled={checkedBoxValue !== 'CONTAINER_TAG'}
                  dataSet={loginQueryDS}
                  style={{ width: 266, marginRight: 25 }}
                />
                <NumberField
                  name="fullAmount"
                  disabled={checkedBoxValue !== 'CONTAINER_TAG'}
                  min={0.0001}
                  dataSet={loginQueryDS}
                  style={{ width: 266 }}
                  placeholder="满载数量"
                />
              </div>
              <div className="page-left-line">
                <Select
                  name="ownerType"
                  disabled={checkedBoxValue !== 'CONTAINER_TAG'}
                  dataSet={loginQueryDS}
                  style={{ width: 266, marginRight: 25 }}
                  placeholder="所有者类型"
                />
                <Radio
                  name="tag"
                  value="tag"
                  disabled={checkedBoxValue !== 'CONTAINER_TAG'}
                  dataSet={loginQueryDS}
                >
                  同步注册容器
                </Radio>
              </div>
              <Lov
                name="owner"
                disabled={checkedBoxValue !== 'CONTAINER_TAG'}
                dataSet={loginQueryDS}
                style={{ width: 557, marginRight: 25, marginTop: 16 }}
                placeholder="所有者"
              />
            </div>
          </Col>
          <Col span={10}>
            <div className="page-right">
              <Row>
                <Col span={18}>
                  {checkedValue === 'autogeneration' || checkedValue === 'customCoding' ? (
                    <NumberField
                      name="labelNum"
                      min={1}
                      style={{ width: 70 }}
                      dataSet={inputQueryDS}
                      placeholder="标签数"
                      disabled={codeRuleDisabled}
                    />
                  ) : null}
                  {checkedValue === 'externalCode' ? (
                    <TextField
                      ref={tagNumRef}
                      name="inputLabelNum"
                      onBlur={handleSearch}
                      dataSet={inputQueryDS}
                      style={{ width: 266 }}
                      placeholder="扫描/输入标签号"
                      suffix={<Icon type="crop_free" />}
                    />
                  ) : null}
                  {checkedValue === 'customCoding' ? (
                    <TextField
                      name="editThePrefix"
                      style={{ width: 110, marginLeft: 16, marginRight: 16 }}
                      dataSet={inputQueryDS}
                      placeholder="编辑前缀"
                    />
                  ) : null}
                  {checkedValue === 'customCoding' ? (
                    <NumberField
                      name="startRunningWater"
                      style={{ width: 110 }}
                      dataSet={inputQueryDS}
                      placeholder="起始流水"
                      min={1}
                    />
                  ) : null}
                </Col>
                <Col span={6}>
                  <Row>
                    <Col span={12}>
                      {checkedValue === 'externalCode' ? null : (
                        <Button onClick={handleClear}>清空</Button>
                      )}
                    </Col>
                    <Col span={12}>
                      {checkedValue === 'externalCode' ? null : (
                        <Button color="primary" onClick={handleSearch} disabled={codeRuleDisabled}>
                          确认
                        </Button>
                      )}
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
            <LabelList />
          </Col>
        </Row>
      </div>
    );
  };
  return (
    <Fragment>
      <Header title="注册标签" backPath={() => props.history.go(-1)}>
        <Button color="primary" onClick={handleSubmit}>
          提交
        </Button>
        <Button color="primary" onClick={handlePrint}>
          提交并打印
        </Button>
        <Lov dataSet={inputQueryDS} name="printModel" noCache style={{ marginRight: '10px' }} />
      </Header>
      <Content>
        <RenderBar />
      </Content>
    </Fragment>
  );
}
export default withRouter(EmhStatisticsReport);
