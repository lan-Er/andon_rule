import React, { useState, useEffect } from 'react';
import { Header, Content } from 'components/Page';
import { DataSet, Form, Lov, TextField } from 'choerodon-ui/pro';
import { Divider, Icon } from 'choerodon-ui';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import { useDataSet } from 'hzero-front/lib/utils/hooks';

import { FormDs } from '@/stores/moOperationDs';

const preCode = 'neway.moOperation.model';

const MoOperationDeatil = (props) => {
  const formDs = useDataSet(() => new DataSet(FormDs()), []);
  const moId = props.match?.params?.moId;

  const [showLine, setShowLine] = useState(false);

  useEffect(() => {
    formDs.setQueryParameter('moId', moId);
    formDs.query();
  }, [formDs]);

  /**
   * 切换显示隐藏
   */
  function handleLineToggle() {
    setShowLine(!showLine);
  }

  return (
    <>
      <Header
        title={intl.get(`${preCode}.view.title.moOperation`).d('MO工序')}
        backPath="/neway/mo-operation/list"
      />
      <Content>
        <Form dataSet={formDs} columns={4} disabled>
          <Lov name="organizationLov" />
          <Lov name="moNumLov" />
          <TextField name="itemDescription" colSpan={2} />
        </Form>
        <Divider>
          <div>
            <span onClick={handleLineToggle} style={{ cursor: 'pointer' }}>
              {intl.get(`${preCode}.view.title.operationDetail`).d('工序明细')}
            </span>
            <Icon type={!showLine ? 'expand_more' : 'expand_less'} />
          </div>
        </Divider>
        <div style={!showLine ? { display: 'none' } : { display: 'block' }}>
          <Form dataSet={formDs} columns={4} disabled>
            <TextField name="demandDate" />
            <TextField name="demandQty" />
            <TextField name="makeQty" />
            <TextField name="moStatus" />
            <TextField name="planStartDate" />
            <TextField name="planEndDate" />
            <TextField name="routingVersion" />
            <TextField name="moTypeName" />
          </Form>
        </div>
      </Content>
    </>
  );
};

export default formatterCollections({ code: 'neway.moOperation' })(MoOperationDeatil);
