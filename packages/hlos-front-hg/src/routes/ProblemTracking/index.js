/*
 * @Author: chunyan.liang <chunyan.liang@hand-china.com>
 * @Date: 2020-08-17 10:39:18
 * @LastEditTime: 2020-09-07 17:10:02
 * @Description:
 */
import React, { Fragment, useState, useEffect } from 'react';
import { Header, Content } from 'components/Page';
import { isEmpty } from 'lodash';
import {
  Button,
  Table,
  DataSet,
  Modal,
  Pagination,
  Form,
  Lov,
  Select,
  DatePicker,
  TextField,
} from 'choerodon-ui/pro';
import { Tag } from 'choerodon-ui';
import notification from 'utils/notification';
import moment from 'moment';

import intl from 'utils/intl';
import { getResponse } from 'utils/utils';
import { queryLovData } from 'hlos-front/lib/services/api';
import { ListDS, DetailDS } from '../../stores/problemTrackingDS';
import { CreateModal } from './components/createModal';
import { DetailModal } from './components/detailModal';
import { surnamesRender } from '@/utils/renderer';
import { issuesClosed } from '../../services/problemTrackingServices';
// import descIcon from '../../assets/problemTracking/desc.svg';
// import ascIcon from '../../assets/problemTracking/asc.svg';
import './index.less';

const ModalKey = Modal.key();
const detailModalKey = Modal.key();
const modalKey = Modal.key();
const intlPrefix = 'lmds.problem.tracking';
let modal;
const tableDS = new DataSet({ ...ListDS() });
const DetailLineDS = new DataSet({ ...DetailDS() });
const renderRank = (value) => {
  let textRender;
  switch (true) {
    case Number(value) >= 90:
      textRender = (
        <span style={{ color: '#F5222D', background: '#FFF1F0', padding: '5px' }}>{value}</span>
      );
      break;
    case Number(value) >= 80 && Number(value) < 90:
      textRender = (
        <span style={{ color: '#52C41A', background: '#BCEE68', padding: '5px' }}>{value}</span>
      );
      break;
    case Number(value) < 80:
      textRender = (
        <span style={{ color: '#333', background: '#eee', padding: '5px' }}>{value}</span>
      );
      break;
    default:
      textRender = value;
  }
  return textRender;
};

// ??????????????????

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

const ProblemTracking = () => {
  const [userData, setUserData] = useState({});
  const [showFlag, setShowFlag] = useState(false);
  /**
   * ????????????????????????
   */
  const fatchData = async (ds) => {
    const res = await queryLovData({
      lovCode: 'LMDS.WORKER',
      defaultFlag: 'Y',
      showOrganization: 'Y',
    });
    if (getResponse(res) && !res.failed && res.content && res.content.length) {
      setUserData({
        ...res.content[0],
      });
      // ??????????????????
      ds.queryDataSet.current.set('organizationObj', {
        organizationId: res.content[0].organizationId,
        organizationName: res.content[0].organizationName,
      });
    }
  };

  useEffect(() => {
    tableDS.addEventListener('query', () => {});
    if (!tableDS.current) {
      fatchData(tableDS);
    }
    return () => {
      tableDS.removeEventListener('query');
    };
  }, []);

  /**
   *??????????????????
   *
   * @param {*} record
   */
  const detailTitle = (data) => {
    return (
      <>
        {renderRank(data.issuePriority)}
        <span className="issueTopic-modal">
          {data.issueTypeMeaning} ???{data.issueTopic}???
        </span>
      </>
    );
  };

  // ????????????
  function handleImgPreview(imgList) {
    if (imgList.length) {
      Modal.open({
        key: modalKey,
        closable: true,
        footer: null,
        title: intl.get(`${intlPrefix}.view.title.imagePreview`).d('????????????'),
        children: <ImagePreviewModalContent imgList={imgList} />,
      });
    } else {
      notification.warning({
        message: intl.get(`${intlPrefix}.view.warn.noImageWarning`).d('??????????????????????????????'),
      });
    }
  }

  // ??????
  function handleUpdate() {
    DetailLineDS.submit(false, false);
    // ????????????
    closeModal();
  }

  // ??????????????????

  async function handleCloseIssue() {
    const { selected } = tableDS;
    // ??????????????????
    if (!selected.length) {
      notification.error({
        message: intl.get(`hzero.common.message.validation.atLeast`).d('???????????????????????????'),
      });
      return;
    }
    const statusFlag = selected.every((element) => element.data.issueStatus === 'NEW');
    if (statusFlag) {
      const changedItems = selected.map((i) => ({
        ...i.toJSONData(),
        closedTime: moment().format('YYYY-MM-DD HH:mm:SS'),
        closedBy: userData.workerId,
        closedWorker: userData.workerName,
      }));
      await issuesClosed(changedItems);
      tableDS.query();
    } else {
      notification.error({
        message: '????????????????????????????????????',
      });
    }
  }

  async function handleGoDetail(record) {
    DetailLineDS.queryParameter = { issueId: record.data.issueId };
    DetailLineDS.query();
    // if(record.get('issueStatus') === 'NEW'){
    //     record.set('closedWorkerObj', {
    //       closedBy: userData.workerId,
    //       closedWorker: userData.workerName,
    //     });
    // }
    modal = Modal.open({
      key: detailModalKey,
      title: detailTitle(record.data),
      maskClosable: true,
      destroyOnClose: true,
      drawer: true,
      style: {
        width: 800,
      },
      children: (
        <DetailModal
          newListDS={DetailLineDS}
          picture={record.get('picture')}
          closedWorker={record.get('issueStatus') === 'NEW' ? userData.workerName : ''}
          issueStatus={record.get('issueStatus')}
        />
      ),
      footer: (
        <div>
          <Button color="primary" onClick={handleUpdate}>
            ??????
          </Button>
          <Button onClick={() => modal.close()}>??????</Button>
        </div>
      ),
    });
  }

  const columns = () => {
    return [
      {
        name: 'issueTopic',
        width: 250,
        renderer: ({ value, record }) => (
          <span
            className="showTooltip"
            style={{ cursor: 'pointer' }}
            onClickCapture={(e) => {
              e.stopPropagation();
              handleGoDetail(record);
            }}
          >
            {value || ''}
          </span>
        ),
        tooltip: 'overflow',
        lock: 'left',
      },
      { name: 'issueNum', width: 150 },
      { name: 'issueType', width: 100 },
      {
        name: 'issueStatus',
        width: 150,
        renderer: ({ record }) => {
          let actionText;
          switch (record.get('issueStatusMeaning')) {
            case '??????':
              actionText = (
                <Tag color="#2db7f5">
                  <span>{record.get('issueStatusMeaning')}</span>
                </Tag>
              );
              break;
            case '?????????':
              actionText = (
                <Tag color="gray">
                  <span>{record.get('issueStatusMeaning')}</span>
                </Tag>
              );
              break;
            default:
              actionText = record.get('issueStatusMeaning');
          }
          return actionText;
        },
        align: 'center',
      },
      // {
      //   name: 'issuePriority',
      //   width: 150,
      //   renderer: ({ value }) => renderRank(value),
      //   sortable: true,
      //   header(dataset, name) {
      //     const field = dataset.getField(name);
      //     return (
      //       <div className="header-cell" onClick={() => handleSort()}>
      //         <span>{field ? field.get('label') : ''}</span>
      //         <span className="sort">
      //           <img src={upSort ? ascIcon : descIcon} alt="order" />
      //         </span>
      //       </div>
      //     );
      //   },
      // },
      {
        name: 'issueRank',
        width: 150,
      },
      { name: 'docObj', width: 150 },
      { name: 'resourceObj', width: 150 },
      {
        name: 'picture',
        width: 150,
        renderer: ({ text }) => {
          const imgList = text && text.split(',');
          return (
            <span
              onClick={() => handleImgPreview(imgList)}
              style={{ color: '#29bece', cursor: 'pointer' }}
            >
              {imgList.length ? intl.get(`${intlPrefix}.view.hint.viewPicture`).d('????????????') : ''}
            </span>
          );
        },
      },
      {
        name: 'workerObj',
        width: 150,
        renderer: ({ record }) => surnamesRender(record.get('submittedWorker')),
      },
      // { name: 'phoneNumber', width: 150 },
      { name: 'submittedTime', width: 180, sortable: true },
    ];
  };

  /**
   *????????????????????????
   *
   */
  function closeModal() {
    modal.close();
    tableDS.removeAll();
    tableDS.query();
  }

  async function handleAdd() {
    const validateValue = await tableDS.validate(false, false);

    if (!validateValue) {
      notification.error({
        message: intl.get('hzero.common.view.message.valid.error').d('??????????????????'),
      });
      return;
    }
    // const organizationObj = await setDefaultDSValue();
    await tableDS.submit(false, false);
    closeModal();
  }
  /**
   *??????
   ??????????????????
   *
   */
  // function handleSort() {
  //   const upSortFlag = !upSort;
  //   setUpSort(upSortFlag);
  // }

  function handleOpenModal() {
    tableDS.create({}, 0);
    tableDS.current.set('organizationId', userData.organizationId);
    tableDS.current.set('workerObj', {
      workerId: userData.workerId,
      workerName: userData.workerName,
    });
    modal = Modal.open({
      key: ModalKey,
      title: '????????????',
      drawer: true,
      style: {
        width: 800,
      },
      children: <CreateModal newListDS={tableDS} />,
      footer: (
        <div>
          <Button color="primary" onClick={handleAdd}>
            ??????
          </Button>
          <Button onClick={closeModal}>??????</Button>
        </div>
      ),
    });
  }

  // ??????
  async function handleDelete() {
    const { selected } = tableDS;
    if (!selected.length) {
      notification.error({
        message: intl.get(`hzero.common.message.validation.atLeast`).d('???????????????????????????'),
      });
      return;
    }
    const statusFlag = selected.every((element) => element.data.issueStatus === 'NEW');
    if (statusFlag) {
      const res = await tableDS.delete(selected);
      if (!isEmpty(res) && res.failed && res.message) {
        notification.error({
          message: res.message,
        });
      } else {
        tableDS.query();
      }
    } else {
      notification.error({
        message: '????????????????????????????????????',
      });
    }
  }

  /**
   *tab????????????
   * @returns
   */
  function queryFields() {
    return [
      <Lov name="organizationObj" noCache key="organizationObj" />,
      <TextField name="issueNum" noCache key="inspectionDocObj" />,
      <TextField name="issueTopic" key="inspectionTemplateType" />,
      <Select name="issueType" key="issueType" />,
      <Select name="issueStatus" key="issueStatus" />,
      <Select name="issueRank" key="issueRank" />,
      <Lov name="sourceDocNumObj" noCache key="sourceDocNumObj" />,
      <Lov name="resourceObj" noCache key="resourceObj" />,
      <Lov name="submittedWorkerObj" noCache key="submittedWorkerObj" />,
      <DatePicker name="submittedTime" key="submittedTime" />,
    ];
  }

  /**
   * ??????????????????
   */
  function handleToggle() {
    setShowFlag(!showFlag);
  }

  /**
   * ??????
   */
  function handleReset() {
    tableDS.queryDataSet.current.reset();
  }

  /**
   * ??????
   */
  async function handleSearch() {
    const validateValue = await tableDS.queryDataSet.current.validate(false, false);
    if (!validateValue) {
      notification.warning({
        message: '?????????????????????????????????',
      });
      return;
    }

    await tableDS.query();
  }

  /**
   *????????????????????????
   * @returns
   */
  function renderBar(queryDataSet) {
    return (
      <div style={{ display: 'flex', marginBottom: '10px', alignItems: 'flex-start' }}>
        <Form dataSet={queryDataSet} columns={4} style={{ flex: 'auto' }}>
          {!showFlag ? queryFields().slice(0, 4) : queryFields()}
        </Form>
        <div
          style={{
            marginLeft: 8,
            marginTop: 10,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Button onClick={handleToggle}>
            {!showFlag
              ? intl.get('hzero.common.button.viewMore').d('????????????')
              : intl.get('hzero.common.button.collected').d('????????????')}
          </Button>
          <Button onClick={handleReset}>{intl.get('hzero.common.button.reset').d('??????')}</Button>
          <Button color="primary" onClick={() => handleSearch()}>
            {intl.get('hzero.common.button.search').d('??????')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Fragment>
      <Header title="????????????">
        <Button icon="add" color="primary" onClick={handleOpenModal}>
          ??????
        </Button>
        <Button onClick={handleDelete}>??????</Button>
        <Button onClick={() => handleCloseIssue(DetailLineDS)}>??????</Button>
      </Header>
      <Content>
        <Table
          dataSet={tableDS}
          columns={columns()}
          columnResizable="true"
          queryBar={({ queryDataSet }) => renderBar(queryDataSet)}
        />
      </Content>
    </Fragment>
  );
};

export default ProblemTracking;
