/*
 * @Description: 构件工艺BOM
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2020-04-30 10:33:00
 * @LastEditors: 赵敏捷
 */
import intl from 'utils/intl';
import React, { useMemo } from 'react';
import { Table, Modal, Button, DataSet } from 'choerodon-ui/pro';
import notification from 'utils/notification';
import queryString from 'query-string';
import QRCode from 'qrcode';

import { Content, Header } from 'components/Page';
import { openTab } from 'utils/menuTab';
import { getCurrentOrganizationId } from 'utils/utils';
import { componentTechnologyBOMDS } from '@/stores/componentTechnologyBOMDS';

import Print from './Print';
import '../style.less';

const modalKey = Modal.key();
const intlPrefix = 'lmes.componentTechnology';

const handleDownloadQRCode = () => {
  Print(document.getElementById('QRCode'));
};

const handleGenerateQRCode = async (record) => {
  const finalStrings = [];
  const qrCodeText = new URLSearchParams();
  const keys = ['projectNum', 'wbsNum', 'itemCode'];
  const otherKeys = [
    'operationOne',
    'operationTwo',
    'operationThree',
    'operationFour',
    'operationFive',
  ];
  keys.forEach((key) => {
    const val = record.get(key);
    if (val) {
      qrCodeText.append(key, val);
    }
  });
  otherKeys.forEach((key) => {
    const val = record.get(key);
    if (val) {
      qrCodeText.append('operation', val);
      finalStrings.push(encodeURIComponent(qrCodeText.toString()));
      qrCodeText.delete('operation');
    }
  });
  try {
    const res = await Promise.all(finalStrings.map((str) => QRCode.toDataURL(str)));
    const QRInstance = ({ dataURL, index }) => {
      let operationName = '';
      switch (index) {
        case 0:
          operationName = 'operationOne';
          break;
        case 1:
          operationName = 'operationTwo';
          break;
        case 2:
          operationName = 'operationThree';
          break;
        case 3:
          operationName = 'operationFour';
          break;
        case 4:
          operationName = 'operationFive';
          break;
        default:
          break;
      }
      return (
        <div className="QRInstance">
          <div className="top">
            <div className="keys">
              <div className="key">工程代号：</div>
              <div className="key">子项名称：</div>
              <div className="key">构件号：</div>
              <div className="key">构件类型：</div>
              <div className="key">工序：</div>
            </div>
            <div className="values">
              <div>{record.get('projectNum')}</div>
              <div>{record.get('wbsNum')}</div>
              <div>{record.get('itemCode')}</div>
              <div>{record.get('itemType')}</div>
              <div>{record.get(operationName)}</div>
            </div>
          </div>
          <div className="QRCode">
            <img src={dataURL} width="100" alt="QRCode" />
          </div>
        </div>
      );
    };
    Modal.open({
      key: modalKey,
      title: '二维码',
      footer: <Button onClick={handleDownloadQRCode}>下载</Button>,
      closable: true,
      children: (
        <div id="QRCode">
          {res.map((url, i) => (
            <QRInstance dataURL={url} index={i} />
          ))}
        </div>
      ),
    });
  } catch (err) {
    notification.warning({
      message: '二维码生成失败！',
    });
    // eslint-disable-next-line no-console
    console.error(err);
  }
};

const tableColumns = [
  {
    name: 'seqNum',
    editor: false,
  },
  {
    name: 'projectNum',
    editor: false,
  },
  {
    name: 'wbsNum',
    editor: false,
  },
  {
    name: 'itemCode',
    editor: false,
  },
  {
    name: 'itemType',
    editor: false,
  },
  {
    name: 'quantity',
    editor: false,
  },
  {
    name: 'workerGroup',
    editor: false,
  },
  {
    name: 'operationOne',
    editor: false,
  },
  {
    name: 'operationTwo',
    editor: false,
  },
  {
    name: 'operationThree',
    editor: false,
  },
  {
    name: 'operationFour',
    editor: false,
  },
  {
    name: 'operationFive',
    editor: false,
  },
  {
    name: 'remark',
    editor: false,
  },
  {
    header: intl.get('hzero.common.button.action').d('操作'),
    width: 150,
    command: ({ record }) => {
      return [
        <Button
          key="edit"
          color="primary"
          funcType="flat"
          onClick={() => handleGenerateQRCode(record)}
        >
          {intl.get(`${intlPrefix}.button.generateQRCode`).d('生成二维码')}
        </Button>,
      ];
    },
    align: 'center',
    lock: 'right',
  },
];

const handleSearch = (ds) => {
  ds.query();
};

const handleBatchExport = () => {
  try {
    openTab({
      // 编码是后端给出的
      key: `/himp/commentImport/EXECUTE_LINE_TMP`,
      // MenuTab 的国际化必须使用 hzero.common 开头(或者其他公用多语言)
      title: 'hzero.common.title.templateImport',
      search: queryString.stringify({
        title: 'hzero.common.title.templateImport',
        action: 'himp.commentImport.view.button.templateImport',
        tenantId: getCurrentOrganizationId(),
        prefixPath: '',
        templateType: 'S',
      }),
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e.message);
  }
};

export default () => {
  const ds = useMemo(() => new DataSet(componentTechnologyBOMDS()), []);
  return (
    <React.Fragment>
      <Header title={intl.get(`${intlPrefix}.view.title.componentTechnology`).d('构件工艺BOM')}>
        <Button onClick={handleBatchExport}>
          {intl.get(`${intlPrefix}.button.import`).d('导入')}
        </Button>
        <Button color="primary" onClick={() => handleSearch(ds)}>
          {intl.get('hzero.common.button.search').d('查询')}
        </Button>
      </Header>
      <Content>
        <Table columns={tableColumns} dataSet={ds} />
      </Content>
    </React.Fragment>
  );
};
