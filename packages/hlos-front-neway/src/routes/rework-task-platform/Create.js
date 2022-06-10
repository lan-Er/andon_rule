import React, { useEffect, useMemo, useState } from 'react';
import { Header, Content } from 'components/Page';
import { DataSet, Table, Lov, Form, TextField, CheckBox, Button } from 'choerodon-ui/pro';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import qs from 'querystring';
import { getFileName } from 'hlos-front/lib/utils/utils';

import { CreateFormDs } from '@/stores/reworkTaskPlatformDs';
import { queryRouting } from '@/services/reworkTaskService';

// const commonCode = 'lmes.common';
// const organizationId = getCurrentOrganizationId()

const preCode = 'neway.reworkTaskPlatform.model';

const Create = (props) => {
  const formDs = useMemo(() => new DataSet(CreateFormDs()), []);

  const searchProps = props.location.search || {};
  const state = props.location.state || {};
  const { type } = qs.parse(searchProps.substr(1));

  const [spinFlag, setSpinFlag] = useState(false);

  // const isSelected = useDataSetIsSelected(reworkOrderDs);

  useEffect(() => {
    const { actualReworkQty, taskNum, taskId } = state;
    formDs.create({
      reworkQty: actualReworkQty,
      actualReworkQty,
      taskId,
      taskNum,
    });
  }, [formDs]);

  const columns = [
    { name: 'sequenceNum', width: 100, editor: true },
    { name: 'operationLov', width: 150, editor: <Lov /> },
    { name: 'operationName', width: 150 },
    { name: 'description', width: 120 },
    { name: 'operationTypeMeaning', width: 100 },
    { name: 'keyOperationFlag', width: 100, editor: <CheckBox />, align: 'center' },
    { name: 'firstOperationFlag', width: 100, editor: <CheckBox /> },
    { name: 'lastOperationFlag', width: 100, editor: <CheckBox /> },
    { name: 'preSequenceNum', width: 150, editor: true },
    { name: 'standardWorkTime', width: 130, editor: true },
    { name: 'processTime', width: 130, editor: true },
    {
      name: 'referenceDocument',
      width: 120,
      renderer: ({ value }) => {
        return (
          <>
            {value && (
              <a
                title={intl.get('hzero.common.button.download').d('下载')}
                href={value}
                rel="noopener noreferrer"
                target="_blank"
                download={getFileName(value)}
              >
                {getFileName(value)}
              </a>
            )}
          </>
        );
      },
    },
    { name: 'instruction', width: 150 },
    { name: 'executeRuleLov', width: 120, editor: true },
    { name: 'inspectionRuleLov', width: 120, editor: true },
    { name: 'attributeString3', width: 120 },
    { name: 'remark', width: 130, editor: true },
  ];

  async function handleSave() {
    const validateFlag = await formDs.validate(false, false);

    if (!validateFlag) {
      return;
    }
    const moControlFlag = type === 'control' ? 1 : 0;
    formDs.current.set('moControlFlag', moControlFlag);
    await formDs.submit();
    props.history.replace({
      pathname: `/neway/rework-task-platform/list`,
    });
  }

  async function handleRoutingChange(record) {
    if (record) {
      try {
        const { routingId } = record;
        setSpinFlag(true);
        const res = await queryRouting({ routingId });
        if (res) {
          setSpinFlag(false);
          formDs.children.moOperationList.reset();
          res.forEach((item) => {
            formDs.children.moOperationList.create(
              {
                sequenceNum: item.sequenceNum,
                operationCode: item.operationCode,
                operationName: item.operationName,
                description: item.description,
                operationType: item.operationType,
                operationTypeMeaning: item.operationTypeMeaning,
                keyOperationFlag: item.keyOperationFlag ? 1 : 0,
                firstOperationFlag: item.firstOperationFlag ? 1 : 0,
                lastOperationFlag: item.lastOperationFlag ? 1 : 0,
                preSequenceNum: item.preSequenceNum,
                standardWorkTime: item.standardWorkTime,
                processTime: item.processTime,
                referenceDocument: item.referenceDocument,
                instruction: item.instruction,
                executeRuleName: item.executeRuleName,
                executeRuleId: item.executeRuleId,
                inspectionRuleName: item.inspectionRuleName,
                inspectionRuleId: item.inspectionRuleId,
                attributeString3: item.attributeString3,
              },
              0
            );
          });
        }
      } catch {
        return false;
      }
    } else {
      formDs.children.moOperationList.reset();
    }
  }

  const buttons = ['add', ['delete', { disabled: false }]];

  return (
    <>
      <Header
        title={
          type === 'control'
            ? intl.get(`${preCode}.view.title.createControlRework`).d('创建返修(卡控工单)')
            : intl.get(`${preCode}.view.title.createUnControlRework`).d('创建返修(不卡控工单)')
        }
        backPath="/neway/rework-task-platform/list"
      >
        <Button color="primary" onClick={handleSave}>
          {intl.get('hzero.common.button.save').d('生成')}
        </Button>
      </Header>
      <Content>
        <Form dataSet={formDs} columns={3}>
          <TextField name="reworkQty" />
          <TextField name="actualReworkQty" disabled />
          <Lov name="routingLov" onChange={handleRoutingChange} />
        </Form>
        <Table
          columns={columns}
          dataSet={formDs.children.moOperationList}
          buttons={buttons}
          spin={{ spinning: spinFlag }}
        />
      </Content>
    </>
  );
};

export default formatterCollections({ code: 'neway.reworkTaskPlatform' })(Create);
