/*
 * @Description: 识别规则-识别规则维护
 * @Author: leying.yan@hand-china.com
 * @Date: 2021-01-14
 * @LastEditors: leying.yan
 */

import React, { Fragment, useMemo, useEffect, useState } from 'react';
import {
  Form,
  Button,
  Table,
  DataSet,
  NumberField,
  Lov,
  TextField,
  IntlField,
  Select,
  CheckBox,
} from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { OperationHeadDS, OperationLineDS } from '@/stores/recognitionRuleDS';

const preCode = 'lmes.recognitionRule';

const RecognitionRule = (history) => {
  const headDS = useMemo(() => new DataSet(OperationHeadDS()), []);
  const lineDS = useMemo(() => new DataSet(OperationLineDS()), []);
  const [allDisabled, setAllDisabled] = useState(false);
  const [identifyRuleId, setIdentifyRuleId] = useState();

  useEffect(() => {
    const { ruleId } = history.match.params;
    if (ruleId) {
      headDS.setQueryParameter('id', ruleId);
      lineDS.setQueryParameter('identifyRuleId', ruleId);
      headDS.query();
      lineDS.query();
      setAllDisabled(true);
      setIdentifyRuleId(ruleId);
    } else {
      headDS.current.set({
        enabledFlag: 1,
      });
    }
  }, [history, headDS, lineDS]);

  function headerFields() {
    return [
      <Select name="identifyRuleClass" key="identifyRuleClass" disabled={allDisabled} />,
      <Select name="identifyRuleType" key="identifyRuleType" disabled={allDisabled} />,
      <TextField name="identifyRuleCode" key="identifyRuleCode" disabled={allDisabled} />,
      <IntlField name="identifyRuleName" key="identifyRuleName" />,
      <IntlField name="identifyRuleAlias" key="identifyRuleAlias" />,
      <IntlField name="description" key="description" />,
      <TextField name="ruleSeparator" key="ruleSeparator" />,
      <Select name="identifyMethod" key="identifyMethod" />,
      <TextField name="identifyApi" key="identifyApi" />,
      <Lov name="organizationObj" key="organizationObj" />,
      <Lov name="partyObj" key="partyObj" />,
      <NumberField
        name="onceIdentifyNumber"
        key="onceIdentifyNumber"
        placeholder="请输入正整数"
        step={1}
        min={0}
      />,
      <NumberField name="priority" key="priority" placeholder="请输入正数" min={0} />,
      <CheckBox name="enabledFlag" key="enabledFlag" />,
    ];
  }
  const lineColumns = useMemo(() => {
    return [
      { name: 'lineNum', width: 70, editor: true, align: 'left', lock: true },
      { name: 'identifyContentType', width: 144, editor: true, lock: true },
      { name: 'prefixCode', width: 128, editor: true },
      { name: 'postfixCode', width: 128, editor: true },
      { name: 'lengthFrom', width: 82, editor: true, align: 'left' },
      { name: 'lengthTo', width: 82, editor: true, align: 'left' },
      { name: 'maskCode', width: 200, editor: true },
      { name: 'subSeparator', width: 82, editor: true },
      {
        name: 'enabledFlag',
        width: 82,
        editor: () => <CheckBox />,
      },
    ];
  }, []);

  async function handleSubmit() {
    const headValidateValue = await headDS.validate(false, false);
    const lineValidateValue = await lineDS.validate(false, false);
    if (headValidateValue && lineValidateValue) {
      headDS.addField('identifyRuleLines');
      const identifyRuleLines = [];
      lineDS.records.forEach((record) => {
        identifyRuleLines.push(record.toJSONData());
      });
      headDS.current.set('identifyRuleLines', identifyRuleLines);
      await headDS
        .submit()
        .then((res) => {
          if (!res.failed) {
            headDS.setQueryParameter('id', res.content[0].identifyRuleId);
            lineDS.setQueryParameter('identifyRuleId', res.content[0].identifyRuleId);
            headDS.query();
            lineDS.query();
            sessionStorage.setItem('recognitionRuleQuery', true);
            setAllDisabled(true);
          }
        })
        .catch((err) => {
          notification.error({
            message: err.message,
          });
        });
    }
  }

  // 新建行
  const handleAddLine = async () => {
    const validateValue = await lineDS.validate();
    if (validateValue) {
      let maxLineNum = 0;
      lineDS.forEach((record) => {
        if (record.get('lineNum') > maxLineNum) {
          maxLineNum = record.get('lineNum');
        }
      });
      lineDS.create({
        lineNum: maxLineNum + 1,
        enabledFlag: 1,
        identifyRuleId,
      });
    }
  };

  // 删除行
  const handleDeleteLine = async () => {
    const { selected } = lineDS;
    if (selected.length < 1) {
      notification.warning({
        message: '请至少选择一行数据进行删除',
      });
      return;
    }
    await lineDS.delete(selected);
  };

  return (
    <Fragment>
      <Header
        title={intl.get(`${preCode}.view.title.recognitionRuleEdit`).d('识别规则维护')}
        backPath="/lwms/recognition-rule/list"
      >
        <Button color="primary" onClick={handleSubmit}>
          {intl.get('hzero.common.button.save').d('保存')}
        </Button>
      </Header>
      <Content>
        <Form dataSet={headDS} columns={4} style={{ flex: 'flex-start' }}>
          {headerFields()}
        </Form>
        <Button
          key="add"
          icon="playlist_add"
          funcType="flat"
          color="primary"
          onClick={handleAddLine}
        >
          {intl.get('hzero.common.button.add').d('新增')}
        </Button>
        <Button
          key="delete"
          icon="delete"
          funcType="flat"
          color="primary"
          onClick={handleDeleteLine}
        >
          {intl.get('hzero.common.button.delete').d('删除')}
        </Button>
        <Table dataSet={lineDS} columns={lineColumns} columnResizable="true" border={false} />
      </Content>
    </Fragment>
  );
};

export default RecognitionRule;
