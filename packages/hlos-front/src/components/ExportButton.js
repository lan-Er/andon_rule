/*
 * @Description: 异步导出按钮
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2020-06-18 14:19:28
 * @LastEditors: 赵敏捷
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Select, DataSet } from 'choerodon-ui/pro';
import { Button } from 'hzero-ui';
import intl from 'utils/intl';
import { openTab } from 'utils/menuTab';
import notification from 'utils/notification';
import { queryReportData } from 'hlos-front/lib/services/api';

const { Option } = Select;
const key = Modal.key();
const ds = new DataSet({
  autoCreate: true,
  fields: [{ name: 'report', type: 'string' }],
});

function errorOccur() {
  notification.error({
    message: intl.get('hzero.common.message.globalError').d('很抱歉！出现预料之外的错误'),
  });
}

/**
 * @param {Object} props - properties
 * @param {string} props.iconType - icon type
 * @param {string[]} props.reportCode - code array
 * @param {string[]} props.exportTitle - export tab title
 * @param {string[]} props.cache - cache report info
 */
export function ExportButton({
  buttonText = intl.get('hzero.common.button.export').d('导出'),
  iconType = 'export',
  reportCode = [],
  exportTitle = intl.get('hzero.common.button.export').d('导出'),
  cache = true,
}) {
  const [reportInfo, setReportInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [queryExportData, setQueryExportData] = useState(false);

  useEffect(() => {
    function resetState() {
      setLoading(false);
      setQueryExportData(false);
    }
    if (!queryExportData) {
      resetState();
      return;
    }
    if (cache && reportInfo !== null) {
      resetState();
      handleExport();
      return;
    }
    if (reportCode.length) {
      _queryReportData();
      setQueryExportData(false);
    }
    async function _queryReportData() {
      try {
        const res = await Promise.all(reportCode.map((code) => queryReportData(code)));
        const reportData =
          res.map((data, index) => {
            const formattedInfo = {
              // 模糊查询需要匹配
              ...(data.content?.find?.((item) => item.reportCode === reportCode[index]) || {}),
            };
            const { reportUuid, reportName: name } = formattedInfo;
            if (reportUuid && name) {
              formattedInfo.reportUrl = `/hrpt/report-query/detail/${reportUuid}/${name}`;
            }
            return formattedInfo;
          }) || [];
        setReportInfo(reportData);
      } catch (e) {
        errorOccur();
      }
      setLoading(false);
    }
  }, [reportCode, reportInfo, queryExportData, handleExport, cache]);

  useEffect(() => {
    if (reportInfo !== null) {
      handleExport();
    }
  }, [reportInfo, handleExport]);

  const openExportTab = useCallback(
    (url) => {
      const reportUrl = url || ds.current.get('report');
      ds.current.set('report', null);
      if (reportUrl) {
        openTab({
          key: reportUrl,
          title: exportTitle,
        });
      } else {
        errorOccur();
      }
    },
    [exportTitle]
  );

  const handleClick = () => {
    setLoading(true);
    setQueryExportData(true);
  };

  const handleExport = useCallback(() => {
    const multipleExport = reportCode.length > 1;
    if (multipleExport) {
      Modal.open({
        key,
        title: intl.get('hzero.common.button.export').d('导出'),
        children: (
          <React.Fragment>
            <Select dataSet={ds} name="report">
              {reportInfo
                .filter((i) => i.reportUrl && i.reportName)
                .map((i) => {
                  const { reportName = '', reportUrl } = i;
                  return (
                    <Option value={reportUrl} key={reportName + reportUrl}>
                      {reportName}
                    </Option>
                  );
                })}
            </Select>
          </React.Fragment>
        ),
        onOk: () => {
          const { current } = ds;
          if (!current.get('report')) {
            notification.error({
              message: '请选择一条数据',
            });
            return;
          }
          openExportTab();
        },
        closable: true,
      });
    } else if (reportCode.length === 1) {
      const { reportUrl } = reportInfo?.[0] || {};
      openExportTab(reportUrl);
    }
  }, [reportInfo, reportCode, openExportTab]);

  return (
    <Button onClick={handleClick} icon={iconType} loading={loading}>
      {buttonText}
    </Button>
  );
}
