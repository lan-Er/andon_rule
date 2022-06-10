import React, { useEffect } from 'react';
import intl from 'utils/intl';

import ExcelExport from 'components/ExcelExport';
import { Header, Content } from 'components/Page';
import { Table, Form, TextField } from 'choerodon-ui/pro';
import { Card } from 'choerodon-ui';
import { fromDS, journalDS } from '@/stores/reservationQtyListDS';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';

import { HLOS_LWMS } from 'hlos-front/lib/utils/config';
import { DETAIL_CARD_TABLE_CLASSNAME } from 'utils/constants';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';

const organizationId = getCurrentOrganizationId();

const { Column } = Table;

const preCode = 'lwms.reservation';

export default ({ match }) => {
  useEffect(() => {
    const { params: { reservationId = '' } = {} } = match;
    fromDS.queryParameter = { reservationId };
    fromDS.query();
    journalDS.queryParameter = { reservationId };
    journalDS.query();
  }, [fromDS, journalDS, match]);

  function FromList() {
    return (
      <Form dataSet={fromDS} columns={4}>
        <TextField name="organization" disabled />
        <TextField name="item" disabled />
        <TextField name="uomName" disabled />
        <TextField name="warehouse" disabled />
        <TextField name="wmArea" disabled />
        <TextField name="wmUnit" disabled />
        <TextField name="lotNumber" disabled />
        <TextField name="reservationTypeMeaning" disabled />
        <TextField name="reservationRule" disabled />
        <TextField name="tagCode" disabled />
      </Form>
    );
  }

  /**
   *表格
   * @returns
   */
  function TableList() {
    return (
      <Table dataSet={journalDS} border={false} columnResizable="true" editMode="inline">
        <Column name="eventId" editor={false} lock width={144} />
        <Column name="eventType" editor={false} lock width={130} />
        <Column name="eventTime" editor={false} width={150} lock align="center" />
        <Column name="directTypeMeaning" editor={false} width={84} />
        <Column name="eventQty" editor={false} width={82} />
        <Column name="reservationQty" editor={false} width={82} />
        <Column name="reservationStatusMeaning" editor={false} width={100} />
        <Column name="documentType" editor={false} width={130} />
        <Column name="documentNum" editor={false} width={144} />
        <Column name="documentLineNum" editor={false} width={70} />
        <Column name="sourceDocType" editor={false} width={130} />
        <Column name="sourceDocNum" editor={false} width={144} />
        <Column name="sourceDocLineNum" editor={false} width={70} />
        <Column name="ownerTypeMeaning" editor={false} width={92} />
        <Column name="ownerName" editor={false} width={200} />
        <Column name="featureTypeMeaning" editor={false} width={92} />
        <Column name="featureValue" editor={false} width={100} />
        <Column name="sourceNum" editor={false} width={144} />
        <Column name="projectNum" editor={false} width={144} />
        <Column name="secondUomName" editor={false} width={70} />
        <Column name="secondReservationQty" editor={false} width={82} />
        <Column name="qcOkQty" editor={false} width={82} />
        <Column name="qcNgQty" editor={false} width={82} />
        <Column name="remark" editor={false} width={200} />
        <Column name="externalId" editor={false} width={144} />
        <Column name="externalNum" editor={false} width={144} />
        <Column name="enabledFlag" editor={false} width={70} renderer={yesOrNoRender} />
      </Table>
    );
  }

  /**
   *导出字段   *
   * @returns
   */
  function getExportQueryParams() {
    const queryDataDs = journalDS && journalDS.queryDataSet && journalDS.queryDataSet.current;
    const queryDataDsValue = queryDataDs ? filterNullValueObject(queryDataDs.toData()) : {};
    const { params: { reservationId = '' } = {} } = match;
    return {
      reservationId,
      tenantId: organizationId,
      ...queryDataDsValue,
    };
  }

  return (
    <React.Fragment>
      <Header
        title={intl.get(`${preCode}.view.title.reservationJournal`).d('库存保留履历')}
        backPath="/lwms/reservation-qty/list"
      >
        <ExcelExport
          requestUrl={`${HLOS_LWMS}/v1/${organizationId}/reservation-journals/excel`}
          queryParams={getExportQueryParams}
        />
      </Header>
      <Content>
        <Card
          key="party-detail-header"
          bordered={false}
          className={DETAIL_CARD_TABLE_CLASSNAME}
          title={<h3>{intl.get(`${preCode}.view.title.reservation`).d('库存保留')}</h3>}
        >
          <FromList />
        </Card>
        <Card
          key="party-detail-header"
          bordered={false}
          className={DETAIL_CARD_TABLE_CLASSNAME}
          title={<h3>{intl.get(`${preCode}.view.title.reservationJournal`).d('库存保留履历')}</h3>}
        >
          <TableList />
        </Card>
      </Content>
    </React.Fragment>
  );
};
