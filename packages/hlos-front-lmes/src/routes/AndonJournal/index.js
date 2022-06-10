/*
 * @Description: 安灯履历
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2020-04-03 16:59:13
 * @LastEditors: Please set LastEditors
 */
import intl from 'utils/intl';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Button,
  DataSet,
  DateTimePicker,
  NumberField,
  Form,
  Lov,
  Select,
  Table,
  Modal,
  notification,
  Pagination,
} from 'choerodon-ui/pro';
import { Content, Header } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import { filterNullValueObject, getCurrentOrganizationId, getResponse } from 'utils/utils';

import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import { HLOS_LMES } from 'hlos-front/lib/utils/config';
import { queryLovData } from 'hlos-front/lib/services/api';
import codeConfig from '@/common/codeConfig';
import {
  andonJournalDS,
  andonQueryFieldsDS,
  andonJournalDetailDS,
} from '../../stores/andonJournalDS';
import './index.less';

const modalKey = Modal.key();
const {
  code: { common },
} = codeConfig;
const intlPrefix = 'lmes.andonJournal';
const commonBtnPre = 'hzero.common.button';
const organizationId = getCurrentOrganizationId();

// 履历查询和表格字段
const queryFields = [
  <Lov name="organizationObj" key="organizationObj" />,
  <Lov name="andonBinObj" key="andonBinObj" />,
  <Lov name="andonObj" key="andonObj" />,
  <Select name="status" key="status" />,
  <Lov name="prodLineObj" key="prodLineObj" />,
  <Lov name="workcellObj" key="workcellObj" />,
  <Lov name="andonClassObj" key="andonClassObj" />,
  <Lov name="sourceDocNumObj" key="sourceDocNumObj" />,
  <Lov name="triggeredByObj" key="triggeredByObj" />,
  <Lov name="respondedByObj" key="respondedByObj" />,
  <Lov name="closedByObj" key="closedByObj" />,
  <Lov name="equipmentObj" key="equipmentObj" />,
  <DateTimePicker name="startTriggeredTime" key="startTriggeredTime" />,
  <DateTimePicker name="endTriggeredTime" key="endTriggeredTime" />,
  <DateTimePicker name="startResponsedTime" key="startResponsedTime" />,
  <DateTimePicker name="endResponsedTime" key="endResponsedTime" />,
  <DateTimePicker name="startClosedTime" key="startClosedTime" />,
  <DateTimePicker name="endClosedTime" key="endClosedTime" />,
  <NumberField name="startResponseDuration" key="startResponseDuration" />,
  <NumberField name="endResponseDuration" key="endResponseDuration" />,
  <NumberField name="startCloseDuration" key="startCloseDuration" />,
  <NumberField name="endCloseDuration" key="endCloseDuration" />,
  <NumberField name="startTriggeredDuration" key="startTriggeredDuration" />,
  <NumberField name="endTriggeredDuration" key="endTriggeredDuration" />,
];
const tableColumns = [
  {
    name: 'organizationName',
    width: 150,
    editor: false,
    lock: 'left',
  },
  {
    name: 'andonName',
    width: 150,
    editor: false,
    lock: 'left',
  },
  {
    name: 'andonBinName',
    width: 150,
    editor: false,
    lock: 'left',
  },
  {
    name: 'prodLineName',
    width: 150,
    editor: false,
  },
  {
    name: 'workcellName',
    width: 150,
    editor: false,
  },
  {
    name: 'locationName',
    width: 150,
    editor: false,
  },
  {
    name: 'currentStatus',
    width: 120,
    editor: false,
    align: 'center',
    renderer({ text, record }) {
      return (
        <span
          style={{
            backgroundColor: record.get('currentColor'),
            padding: '0px 10px',
            borderRadius: '4px',
            height: '0.25rem',
            lineHeight: '0.25rem',
            color: '#FFF',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translateX(-50%) translateY(-50%)',
          }}
        >
          {text}
        </span>
      );
    },
  },
  {
    name: 'currentColor',
    width: 120,
    editor: false,
    renderer({ value }) {
      return (
        <div
          style={{
            height: '50%',
            width: '50%',
            position: 'relative',
            top: '25%',
            left: '25%',
            backgroundColor: value,
            borderRadius: '2px',
          }}
        />
      );
    },
    align: 'center',
  },
  {
    name: 'andonClassName',
    width: 150,
    editor: false,
  },
  {
    name: 'pressedTimes',
    width: 150,
    editor: false,
  },
  {
    name: 'triggeredHour',
    width: 150,
    editor: false,
    renderer({ value }) {
      return <span>{(value && Number.parseFloat(value, 10).toFixed(2)) || '0.00'}</span>;
    },
  },
  {
    name: 'triggeredTime',
    width: 180,
    editor: false,
  },
  {
    name: 'triggeredByName',
    width: 150,
    editor: false,
  },
  {
    name: 'triggeredEventId',
    width: 150,
    editor: false,
  },
  {
    name: 'responseHour',
    width: 150,
    editor: false,
    renderer({ value }) {
      return <span>{(value && Number.parseFloat(value, 10).toFixed(2)) || '0.00'}</span>;
    },
  },
  {
    name: 'responsedTime',
    width: 180,
    editor: false,
  },
  {
    name: 'responsedByName',
    width: 150,
    editor: false,
  },
  {
    name: 'responsedEventId',
    width: 150,
    editor: false,
  },
  {
    name: 'closeHour',
    width: 150,
    editor: false,
    renderer({ value }) {
      return <span>{(value && Number.parseFloat(value, 10).toFixed(2)) || '0.00'}</span>;
    },
  },
  {
    name: 'closedTime',
    width: 180,
    editor: false,
  },
  {
    name: 'closedByName',
    width: 150,
    editor: false,
  },
  {
    name: 'closedEventId',
    width: 150,
    editor: false,
  },
  {
    name: 'dataCollectType',
    width: 150,
    editor: false,
  },
  {
    name: 'equipmentName',
    width: 150,
    editor: false,
  },
  {
    name: 'andonRelTypeMeaning',
    width: 150,
    editor: false,
  },
  {
    name: 'andonRelCode',
    width: 150,
    editor: false,
  },
  {
    name: 'responseRankCodeMeaning',
    width: 150,
    editor: false,
  },
  {
    name: 'andonRule',
    width: 150,
    editor: false,
  },
  {
    name: 'exceptionGroupName',
    width: 150,
    editor: false,
  },
  {
    name: 'exceptionName',
    width: 150,
    editor: false,
  },
  {
    name: 'quantity',
    width: 150,
    editor: false,
  },
  {
    name: 'uomName',
    width: 150,
    editor: false,
  },
  {
    name: 'stopProductionFlag',
    width: 150,
    renderer: yesOrNoRender,
    editor: false,
  },
  {
    name: 'sourceDocTypeCode',
    width: 150,
    editor: false,
  },
  {
    name: 'sourceDocNum',
    width: 150,
    editor: false,
  },
  {
    name: 'targetDocTypeName',
    width: 150,
    editor: false,
  },
  {
    name: 'targetDocNum',
    width: 150,
    editor: false,
  },
  {
    name: 'picture',
    width: 150,
    editor: false,
    renderer: ({ text }) => {
      const imgList = text && text.split(',');
      return (
        <span
          onClick={() => handleImgPreview(imgList)}
          style={{ color: 'blue', cursor: 'pointer' }}
        >
          {intl.get(`${intlPrefix}.view.hint.viewPicture`).d('查看图片')}
        </span>
      );
    },
  },
  {
    name: 'processRule',
    width: 150,
    editor: false,
  },
  {
    name: 'remark',
    width: 150,
    editor: false,
  },
  {
    name: 'andonJournalId',
    width: 150,
    editor: false,
    renderer: ({ text }) => {
      return (
        <span onClick={() => handleViewJournal(text)} style={{ color: 'blue', cursor: 'pointer' }}>
          {text}
        </span>
      );
    },
  },
];

// 履历明细表格字段
const journalDetailColumns = [
  {
    name: 'andonRankName',
    width: 150,
    editor: false,
  },
  {
    name: 'relatedPositionName',
    width: 150,
    editor: false,
  },
  {
    name: 'realName',
    width: 150,
    editor: false,
  },
  {
    name: 'phoneNumber',
    width: 150,
    editor: false,
  },
  {
    name: 'email',
    width: 150,
    editor: false,
  },
  {
    name: 'sendMsgStatus',
    width: 150,
    editor: false,
  },
  {
    name: 'sendedTime',
    width: 180,
    editor: false,
  },
  {
    name: 'remark',
    width: 150,
    editor: false,
  },
];

const ImagePreviewModalContent = ({ imgList }) => {
  const [curPageImages, setCurImages] = useState(imgList);
  const [page, setPage] = useState(1);

  function handlePageChange(curPage) {
    setPage(curPage);
    setCurImages(imgList.slice((curPage - 1) * 6));
  }

  return (
    <React.Fragment>
      <div className="imagePreview">
        {curPageImages.map((url) => (
          <img src={url} alt="img here" />
        ))}
      </div>
      <Pagination
        showPager
        sizeChangerPosition="right"
        total={imgList.length}
        pageSize={6}
        pageSizeOptions={['6']}
        hideOnSinglePage
        page={page}
        onChange={handlePageChange}
      />
    </React.Fragment>
  );
};

const JournalDetailModalContent = ({ id }) => {
  const ds = useMemo(() => new DataSet(andonJournalDetailDS(id)), [id]);
  return <Table dataSet={ds} columns={journalDetailColumns} />;
};

function handleImgPreview(imgList) {
  if (imgList.length) {
    Modal.open({
      key: modalKey,
      closable: true,
      footer: null,
      title: intl.get(`${intlPrefix}.view.title.imagePreview`).d('图片预览'),
      children: <ImagePreviewModalContent imgList={imgList} />,
    });
  } else {
    notification.warning({
      message: intl.get(`${intlPrefix}.view.warn.noImageWarning`).d('当前单据没有图片信息'),
    });
  }
}

function handleViewJournal(id) {
  Modal.open({
    key: modalKey,
    closable: true,
    footer: null,
    title: intl.get(`${intlPrefix}.view.title.journalDetail`).d('履历明细'),
    children: <JournalDetailModalContent id={id} />,
  });
}

async function handleSetDefaultOrg(ds) {
  const res = await queryLovData({ lovCode: common.organization, defaultFlag: 'Y' });
  if (getResponse(res)) {
    if (res && res.content && res.content[0]) {
      ds.current.set('organizationObj', {
        organizationId: res.content[0].organizationId,
        organizationName: res.content[0].organizationName,
      });
    }
  }
}

export default () => {
  const ds = useMemo(() => new DataSet(andonJournalDS()), []);
  const queryDs = useMemo(() => new DataSet(andonQueryFieldsDS()), []);
  const [hiddenQueryFields, toggleShowQueryFields] = useState(true);

  useEffect(() => {
    handleSetDefaultOrg(queryDs);
  }, [queryDs]);

  const handleToggle = () => {
    toggleShowQueryFields(!hiddenQueryFields);
  };

  const handleReset = () => {
    queryDs.reset();
    handleSetDefaultOrg(queryDs);
  };

  const handleSearch = () => {
    queryDs.validate(false, true).then((res) => {
      if (res) {
        ds.queryParameter = queryDs.current.toJSONData();
        ds.query();
      } else {
        notification.error({
          message: intl.get('hzero.common.view.message.valid.error').d('数据校验失败'),
        });
      }
    });
  };
  const getExportQueryParams = () => {
    const formObj = queryDs.current;
    const fieldsValue = !formObj ? {} : filterNullValueObject(formObj.toJSONData());
    return {
      ...fieldsValue,
    };
  };

  return (
    <React.Fragment>
      <Header title={intl.get(`${intlPrefix}.view.title.andonJournal`).d('安灯履历')}>
        <ExcelExport
          requestUrl={`${HLOS_LMES}/v1/${organizationId}/andon-journals/excel`}
          queryParams={getExportQueryParams}
        />
      </Header>
      <Content className="lmes-andon-journal">
        <div style={{ display: 'flex', marginBottom: 10, alignItems: 'flex-start' }}>
          <Form dataSet={queryDs} columns={4} style={{ flex: '1 1 auto' }}>
            {hiddenQueryFields ? queryFields.slice(0, 8) : queryFields}
          </Form>
          <div style={{ marginLeft: 8, flexShrink: 0, display: 'flex', alignItems: 'center' }}>
            <Button onClick={handleToggle}>
              {hiddenQueryFields
                ? intl.get(`${commonBtnPre}.viewMore`).d('更多查询')
                : intl.get(`${commonBtnPre}.collected`).d('收起查询')}
            </Button>
            <Button onClick={handleReset}>{intl.get(`${commonBtnPre}.reset`).d('重置')}</Button>
            <Button color="primary" onClick={handleSearch}>
              {intl.get(`${commonBtnPre}.search`).d('查询')}
            </Button>
          </div>
        </div>
        <Table columns={tableColumns} dataSet={ds} queryFieldsLimit={4} />
      </Content>
    </React.Fragment>
  );
};
