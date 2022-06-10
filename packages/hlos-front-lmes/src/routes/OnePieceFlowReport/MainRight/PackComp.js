/**
 * @Description: 单件流报工--MainRight-装箱
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2021-01-12 10:54:08
 * @LastEditors: yu.na
 */

import React, { useEffect, useMemo, useState } from 'react';
import { Modal, NumberField, Lov, DataSet, Icon, TextField } from 'choerodon-ui/pro';
import { queryReportData } from 'hlos-front/lib/services/api';
import Icons from 'components/Icons';
import { getCurrentOrganizationId, getAccessToken, getRequestId } from 'utils/utils';
import { HZERO_RPT, API_HOST } from 'utils/config';
import notification from 'utils/notification';
import intl from 'utils/intl';
import { TemplateDS } from '@/stores/onePieceFlowReportDS';
import ListItem from './ListItem';
import styles from './index.less';

const organizationId = getCurrentOrganizationId();
const preCode = 'lmes.onePieceFlowReport';

export default ({
  outTagInfo,
  outTagList,
  tagCode,
  limitLength,
  autoPrint,
  setAutoPrint,
  onDeleteOutTagItem,
  onLimitChange,
  onOutTagCodeChange,
}) => {
  const templateDS = useMemo(() => new DataSet(TemplateDS()), []);
  const { capacityQty } = outTagInfo;
  const [currentQty, setCurrentQty] = useState(0);

  useEffect(() => {
    async function getTemplate(reportCode) {
      templateDS.current.set('tagTemplateObj', {
        reportCode,
      });
    }
    if (outTagList.length) {
      const { printTemplate } = outTagList[outTagList.length - 1];
      if (printTemplate) {
        getTemplate(printTemplate);
      }
    }
    setCurrentQty(outTagList.length);
  }, [outTagList]);

  useEffect(() => {
    if (autoPrint) {
      handlePrint();
    }
  }, [autoPrint]);

  async function handlePrint() {
    const reportCode = templateDS.current.get('reportCode');
    // const { tagCode: tag } = outTagList[outTagList.length - 1];
    if (!reportCode) {
      notification.warning({
        message: '请先进行打印设置',
      });
      return;
    }
    const res = await queryReportData(reportCode);
    if (res && res.content && res.content.length > 0) {
      const { reportUuid } = res.content[0];
      const url = `${HZERO_RPT}/v1/${organizationId}/reports/export/${reportUuid}/PRINT`;
      const requestUrl = `${API_HOST}${url}?access_token=${getAccessToken()}&H-Request-Id=${getRequestId()}&labelTemplateCode=${reportCode}&tagCodes=${tagCode}`;
      window.open(requestUrl);
      setAutoPrint(false);
    } else {
      notification.error({
        message: intl.get(`${preCode}}.message.validation.print`).d('未获取当前模板的打印样式'),
      });
      return false;
    }
  }

  async function handlePrintSetting() {
    Modal.open({
      key: 'lmes-one-piece-flow-report-template-modal',
      title: intl.get(`${preCode}.model.chooseTemplate`).d('模板选择'),
      className: styles['lmes-one-piece-flow-report-template-modal'],
      children: (
        <Lov
          dataSet={templateDS}
          name="tagTemplateObj"
          placeholder={intl.get(`${preCode}.view.message.chooseTemplate`).d('请选择模板')}
        />
      ),
    });
  }

  return (
    <>
      <div className={`${styles['tabs-wrapper']} ${styles.pack}`}>
        <div>
          <TextField value={tagCode} onChange={onOutTagCodeChange} />
          {tagCode && (
            <>
              <span className={styles['print-btn']} onClick={handlePrint}>
                <Icons type="print" color="#1C879C" size="28" />
                打印
              </span>
              <span className={styles['print-btn']} onClick={handlePrintSetting}>
                <Icon type="settings-o" style={{ fontSize: 28 }} />
                打印设置
              </span>
            </>
          )}
        </div>
        {tagCode && (
          <div>
            <span>{currentQty}/</span>
            {capacityQty || <NumberField value={limitLength} onChange={onLimitChange} />}
          </div>
        )}
      </div>
      <div className={styles.list}>
        {outTagList
          ? outTagList.map((i) => {
              return (
                <ListItem key={i.tagId} data={i} packFlag onDeleteOutTagItem={onDeleteOutTagItem} />
              );
            })
          : null}
      </div>
    </>
  );
};
