/*
 * @Description: 仓库看板--Index
 * @Author: tw
 * @Date: 2021-05-26 11:05:22
 * @LastEditors: tw
 */

import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'dva';
import {
  // Header,
  Content,
} from 'components/Page';
import { DataSet } from 'choerodon-ui/pro';
import { getResponse } from 'utils/utils';
import intl from 'utils/intl';
import DashboardHeader from '@/common/DashboardHeader';
import { queryLovData } from 'hlos-front/lib/services/api';
import codeConfig from '@/common/codeConfig';
import { selectedDS } from '@/stores/warehouseSpectacularsDs';
import { getKanban } from '@/services/warehouseSpectacularsService';
import './index.less';
import { useDataSet } from 'hzero-front/lib/utils/hooks';

const { common } = codeConfig.code;
const preCode = 'lwms.warehouseSpectaculars.model';

const todoLineDataSetFactory = () => new DataSet(selectedDS());

const WarehouseSpectaculars = (props) => {
  // const selectDS = () => new DataSet(selectedDS());
  const selectDS = useDataSet(todoLineDataSetFactory);
  // SR页
  const [SR01ListTr, setSR01ListTr] = useState([]);
  const [SR01ListTrColor, setSR01ListTrColor] = useState([]);
  const [SR01List, setSR01List] = useState([]);

  const [SR02ListTr, setSR02ListTr] = useState([]);
  const [SR02ListTrColor, setSR02ListTrColor] = useState([]);
  const [SR02List, setSR02List] = useState([]);

  const [SR03ListTr, setSR03ListTr] = useState([]);
  const [SR03ListTrColor, setSR03ListTrColor] = useState([]);
  const [SR03List, setSR03List] = useState([]);

  const [SR04ListTr, setSR04ListTr] = useState([]);
  const [SR04ListTrColor, setSR04ListTrColor] = useState([]);
  const [SR04List, setSR04List] = useState([]);

  const [SR05ListTr, setSR05ListTr] = useState([]);
  const [SR05ListTrColor, setSR05ListTrColor] = useState([]);
  const [SR05List, setSR05List] = useState([]);

  const [SR06ListTr, setSR06ListTr] = useState([]);
  const [SR06ListTrColor, setSR06ListTrColor] = useState([]);
  const [SR06List, setSR06List] = useState([]);

  const [SR07ListTr, setSR07ListTr] = useState([]);
  const [SR07ListTrColor, setSR07ListTrColor] = useState([]);
  const [SR07List, setSR07List] = useState([]);
  // SRD页
  const [SRD01ListTr, setSRD01ListTr] = useState([]);
  const [SRD01ListTrColor, setSRD01ListTrColor] = useState([]);
  const [SRD01List, setSRD01List] = useState([]);

  const [SRD02ListTr, setSRD02ListTr] = useState([]);
  const [SRD02ListTrColor, setSRD02ListTrColor] = useState([]);
  const [SRD02List, setSRD02List] = useState([]);
  // FNC页
  const [FNC01ListTr, setFNC01ListTr] = useState([]);
  const [FNC01ListTrColor, setFNC01ListTrColor] = useState([]);
  const [FNC01List, setFNC01List] = useState([]);

  const [FNC02ListTr, setFNC02ListTr] = useState([]);
  const [FNC02ListTrColor, setFNC02ListTrColor] = useState([]);
  const [FNC02List, setFNC02List] = useState([]);

  const [FNC03ListTr, setFNC03ListTr] = useState([]);
  const [FNC03ListTrColor, setFNC03ListTrColor] = useState([]);
  const [FNC03List, setFNC03List] = useState([]);

  const [FNC04ListTr, setFNC04ListTr] = useState([]);
  const [FNC04ListTrColor, setFNC04ListTrColor] = useState([]);
  const [FNC04List, setFNC04List] = useState([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    async function queryDefaultOrg() {
      const res = await queryLovData({
        lovCode: common.organization,
        defaultFlag: 'Y',
      });
      if (getResponse(res) && res && res.content && res.content[0]) {
        const { organizationId, organizationName } = res.content[0];
        if (organizationId && organizationName) {
          // ds.queryDataSet.current.set('organizationObj', {
          //   meOuId: organizationId,
          //   meOuName: organizationName,
          // });
          // await ds.query();
        }
      }
    }
    queryDefaultOrg();
    queryKanbanData();
  }, [active]);

  // useEffect(() => {
  //   window.setTimeout(function () {
  //     let copyActive = active;
  //     if (copyActive < 2) {
  //       copyActive += 1;
  //     } else {
  //       copyActive = 0;
  //     }
  //     setActive(copyActive);
  //   }, 60000);
  //   // 去除定时器
  //   // window.clearInterval(time);
  // }, [active]);

  async function queryKanbanData() {
    // 料道、平台表数据
    const data = [
      'SR-001',
      'SR-002',
      'SR-003',
      'SR-004',
      'SR-005',
      'SR-006',
      'SR-007',
      'SR-008',
      'SR-009',
      'SR-010',
      'SR-011',
      'SR-012',
      'SR-013',
      'SR-014',
      'SR-015',
      'SR-016',
      'SR-017',
      'SR-018',
      'SR-019',
      'SR-020',
      'SR-021',
      'SR-022',
      'SR-023',
      'SR-024',
      'SR-025',
      'SR-026',
      'SR-027',
      'SR-028',
      'SR-029',
      'SR-030',
      'SR-031',
      'SR-032',
      'SR-033',
      'SR-034',
      'SR-035',
      'SR-036',
      'SR-037',
      'SR-038',
      'SR-039',
      'SR-040',
      'SR-041',
      'SR-042',
      'SR-043',
      'SR-044',
      'SR-045',
      'SR-046',
      'SR-047',
      'SR-048',
      'SR-049',
      'SR-050',
      'SR-051',
      'SR-052',
      'SR-053',
      'SR-054',
      'SR-055',
      'SR-056',
      'SR-057',
      'SR-058',
      'SR-059',
      'SR-060',
      'SR-061',
      'SR-062',
      'SR-063',
      'SR-064',
      'SR-065',
      'SR-066',
      'SR-067',
      'SR-068',
      'SR-069',
      'SR-070',
      'SR-071',
      'SR-072',
    ];
    const srParams = {
      warehouseCode: 'SR',
      wmAreaCodes: data,
    };
    const res = await getKanban(srParams);
    const feedingTrColor = [];
    const feedingListArr = [[], [], [], [], [], [], [], []];
    data.forEach((i, index) => {
      if (res) {
        res.forEach((item) => {
          if (item.wmAreaCode === i) {
            feedingListArr[0][index] = item.itemCodes[0] ? item.itemCodes[0] : '';
            feedingListArr[1][index] = item.itemCodes[1] ? item.itemCodes[1] : '';
            feedingListArr[2][index] = item.tfrclTagColors[0] || {};
            feedingListArr[3][index] = item.tfrclTagColors[1] || {};
            feedingListArr[4][index] = item.tfrclTagColors[2] || {};
            feedingListArr[5][index] = item.tfrclTagColors[3] || {};
            feedingListArr[6][index] = item.tfrclTagColors[4] || {};
            feedingListArr[7][index] = item.tfrclTagColors[5] || {};
            feedingTrColor[index] = item.showColorFlag ? item.showColorFlag : '';
          }
        });
      }
    });
    const SR01 = data.slice(0, 10);
    const SR02 = data.slice(10, 20);
    const SR03 = data.slice(20, 30);
    const SR04 = data.slice(30, 42);
    const SR05 = data.slice(42, 52);
    const SR06 = data.slice(52, 62);
    const SR07 = data.slice(62, 72);

    const SRListArr01 = [
      feedingListArr[0].slice(0, 10),
      feedingListArr[1].slice(0, 10),
      feedingListArr[2].slice(0, 10),
      feedingListArr[3].slice(0, 10),
      feedingListArr[4].slice(0, 10),
      feedingListArr[5].slice(0, 10),
      feedingListArr[6].slice(0, 10),
      feedingListArr[7].slice(0, 10),
    ];
    const SRListArr02 = [
      feedingListArr[0].slice(10, 20),
      feedingListArr[1].slice(10, 20),
      feedingListArr[2].slice(10, 20),
      feedingListArr[3].slice(10, 20),
      feedingListArr[4].slice(10, 20),
      feedingListArr[5].slice(10, 20),
      feedingListArr[6].slice(10, 20),
      feedingListArr[7].slice(10, 20),
    ];
    const SRListArr03 = [
      feedingListArr[0].slice(20, 30),
      feedingListArr[1].slice(20, 30),
      feedingListArr[2].slice(20, 30),
      feedingListArr[3].slice(20, 30),
      feedingListArr[4].slice(20, 30),
      feedingListArr[5].slice(20, 30),
      feedingListArr[6].slice(20, 30),
      feedingListArr[7].slice(20, 30),
    ];
    const SRListArr04 = [
      feedingListArr[0].slice(30, 42),
      feedingListArr[1].slice(30, 42),
      feedingListArr[2].slice(30, 42),
      feedingListArr[3].slice(30, 42),
      feedingListArr[4].slice(30, 42),
      feedingListArr[5].slice(30, 42),
      feedingListArr[6].slice(30, 42),
      feedingListArr[7].slice(30, 42),
    ];
    const SRListArr05 = [
      feedingListArr[0].slice(42, 52),
      feedingListArr[1].slice(42, 52),
      feedingListArr[2].slice(42, 52),
      feedingListArr[3].slice(42, 52),
      feedingListArr[4].slice(42, 52),
      feedingListArr[5].slice(42, 52),
      feedingListArr[6].slice(42, 52),
      feedingListArr[7].slice(42, 52),
    ];
    const SRListArr06 = [
      feedingListArr[0].slice(52, 62),
      feedingListArr[1].slice(52, 62),
      feedingListArr[2].slice(52, 62),
      feedingListArr[3].slice(52, 62),
      feedingListArr[4].slice(52, 62),
      feedingListArr[5].slice(52, 62),
      feedingListArr[6].slice(52, 62),
      feedingListArr[7].slice(52, 62),
    ];
    const SRListArr07 = [
      feedingListArr[0].slice(62, 72),
      feedingListArr[1].slice(62, 72),
      feedingListArr[2].slice(62, 72),
      feedingListArr[3].slice(62, 72),
      feedingListArr[4].slice(62, 72),
      feedingListArr[5].slice(62, 72),
      feedingListArr[6].slice(62, 72),
      feedingListArr[7].slice(62, 72),
    ];

    const SRTrColor01 = feedingTrColor.slice(0, 10);
    const SRTrColor02 = feedingTrColor.slice(10, 20);
    const SRTrColor03 = feedingTrColor.slice(20, 30);
    const SRTrColor04 = feedingTrColor.slice(30, 42);
    const SRTrColor05 = feedingTrColor.slice(42, 52);
    const SRTrColor06 = feedingTrColor.slice(52, 62);
    const SRTrColor07 = feedingTrColor.slice(62, 72);

    setSR01ListTr(SR01);
    setSR02ListTr(SR02);
    setSR03ListTr(SR03);
    setSR04ListTr(SR04);
    setSR05ListTr(SR05);
    setSR06ListTr(SR06);
    setSR07ListTr(SR07);
    setSR01List(SRListArr01);
    setSR02List(SRListArr02);
    setSR03List(SRListArr03);
    setSR04List(SRListArr04);
    setSR05List(SRListArr05);
    setSR06List(SRListArr06);
    setSR07List(SRListArr07);
    setSR01ListTrColor(SRTrColor01);
    setSR02ListTrColor(SRTrColor02);
    setSR03ListTrColor(SRTrColor03);
    setSR04ListTrColor(SRTrColor04);
    setSR05ListTrColor(SRTrColor05);
    setSR06ListTrColor(SRTrColor06);
    setSR07ListTrColor(SRTrColor07);

    // 地面表数据
    const groundData = [
      'SRD-01',
      'SRD-02',
      'SRD-03',
      'SRD-04',
      'SRD-05',
      'SRD-06',
      'SRD-07',
      'SRD-08',
      'SRD-09',
      'SRD-10',
      'SRD-11',
      'SRD-12',
      'SRD-13',
      'SRD-14',
      'SRD-15',
      'SRD-16',
      'SRD-17',
      'SRD-18',
      'SRD-19',
      'SRD-20',
      'SRD-21',
      'SRD-22',
      'SRD-23',
    ];
    const srdParams = {
      warehouseCode: 'SR',
      wmAreaCodes: groundData,
    };
    const groundRes = await getKanban(srdParams);
    const groundTrColor = [];
    const groundListArr = [[], [], []];
    groundData.forEach((i, index) => {
      if (groundRes) {
        groundRes.forEach((item) => {
          if (item.wmAreaCode === i) {
            groundListArr[0][index] = item.itemCodes[0] ? item.itemCodes[0] : '';
            groundListArr[1][index] = item.tfrclTagColors[0] || {};
            groundListArr[2][index] = item.tfrclTagColors[1] || {};
            groundTrColor[index] = item.showColorFlag ? item.showColorFlag : '';
          }
        });
      }
    });
    const SRD01 = groundData.slice(0, 12);
    const SRD02 = groundData.slice(12, 23);
    const SRDListArr01 = [
      groundListArr[0].slice(0, 12),
      groundListArr[1].slice(0, 12),
      groundListArr[2].slice(0, 12),
    ];
    const SRDListArr02 = [
      groundListArr[0].slice(12, 23),
      groundListArr[1].slice(12, 23),
      groundListArr[2].slice(12, 23),
    ];
    const SRDTrColor01 = groundTrColor.slice(0, 12);
    const SRDTrColor02 = groundTrColor.slice(12, 23);
    setSRD01ListTr(SRD01);
    setSRD02ListTr(SRD02);
    setSRD01List(SRDListArr01);
    setSRD02List(SRDListArr02);
    setSRD01ListTrColor(SRDTrColor01);
    setSRD02ListTrColor(SRDTrColor02);

    // 氮化成品看板数据
    const nitrideData = [
      'FNC-032',
      'FNC-033',
      'FNC-034',
      'FNC-035',
      'FNC-036',
      'FNC-037',
      'FNC-038',
      'FNC-039',
      'FNC-040',
      'FNC-041',
      'FNC-042',
      'FNC-043',
      'FNC-044',
      'FNC-045',
      'FNC-046',
      'FNC-047',
      'FNC-048',
      'FNC-049',
      'FNC-050',
      'FNC-051',
      'FNC-052',
      'FNC-053',
      'FNC-054',
      'FNC-055',
      'FNC-056',
      'FNC-057',
      'FNC-058',
      'FNC-059',
      'FNC-060',
      'FNC-061',
      'FNC-062',
      'FNC-063',
      'FNC-064',
      'FNC-065',
      'FNC-066',
      'FNC-067',
      'FNC-068',
      'FNC-069',
      'FNC-070',
      'FNC-071',
      'FNC-072',
      'FNC-073',
      'FNC-074',
      'FNC-075',
      'FNC-076',
    ];
    const fncParams = {
      warehouseCode: 'FNC',
      wmAreaCodes: nitrideData,
    };
    const nitrideRes = await getKanban(fncParams);
    const nitrideTrColor = [];
    const nitrideListArr = [[], [], [], [], [], []];
    nitrideData.forEach((i, index) => {
      if (nitrideRes) {
        nitrideRes.forEach((item) => {
          if (item.wmAreaCode === i) {
            nitrideListArr[0][index] = item.itemCodes[0] ? item.itemCodes[0] : '';
            nitrideListArr[1][index] = item.tagCount ? item.tagCount : '';
            nitrideListArr[2][index] = item.tfrclTagColors[0] || {};
            nitrideListArr[3][index] = item.tfrclTagColors[1] || {};
            nitrideListArr[4][index] = item.tfrclTagColors[2] || {};
            nitrideListArr[5][index] = item.tfrclTagColors[3] || {};
            nitrideTrColor[index] = item.showColorFlag ? item.showColorFlag : '';
          }
        });
      }
    });
    const FNC01 = nitrideData.slice(0, 11);
    const FNC02 = nitrideData.slice(11, 22);
    const FNC03 = nitrideData.slice(22, 33);
    const FNC04 = nitrideData.slice(33, 45);
    const FNCListArr01 = [
      nitrideListArr[0].slice(0, 11),
      nitrideListArr[1].slice(0, 11),
      nitrideListArr[2].slice(0, 11),
      nitrideListArr[3].slice(0, 11),
      nitrideListArr[4].slice(0, 11),
      nitrideListArr[5].slice(0, 11),
    ];
    const FNCListArr02 = [
      nitrideListArr[0].slice(11, 22),
      nitrideListArr[1].slice(11, 22),
      nitrideListArr[2].slice(11, 22),
      nitrideListArr[3].slice(11, 22),
      nitrideListArr[4].slice(11, 22),
      nitrideListArr[5].slice(11, 22),
    ];
    const FNCListArr03 = [
      nitrideListArr[0].slice(22, 33),
      nitrideListArr[1].slice(22, 33),
      nitrideListArr[2].slice(22, 33),
      nitrideListArr[3].slice(22, 33),
      nitrideListArr[4].slice(22, 33),
      nitrideListArr[5].slice(22, 33),
    ];
    const FNCListArr04 = [
      nitrideListArr[0].slice(33, 45),
      nitrideListArr[1].slice(33, 45),
      nitrideListArr[2].slice(33, 45),
      nitrideListArr[3].slice(33, 45),
      nitrideListArr[4].slice(33, 45),
      nitrideListArr[5].slice(33, 45),
    ];
    const FNCTrColor01 = nitrideTrColor.slice(0, 12);
    const FNCTrColor02 = nitrideTrColor.slice(11, 22);
    const FNCTrColor03 = nitrideTrColor.slice(22, 33);
    const FNCTrColor04 = nitrideTrColor.slice(33, 45);

    setFNC01ListTr(FNC01);
    setFNC02ListTr(FNC02);
    setFNC03ListTr(FNC03);
    setFNC04ListTr(FNC04);
    setFNC01List(FNCListArr01);
    setFNC02List(FNCListArr02);
    setFNC03List(FNCListArr03);
    setFNC04List(FNCListArr04);
    setFNC01ListTrColor(FNCTrColor01);
    setFNC02ListTrColor(FNCTrColor02);
    setFNC03ListTrColor(FNCTrColor03);
    setFNC04ListTrColor(FNCTrColor04);
  }

  const getColor = () => {
    return [
      <span className="lwms-warehouse-spectaculars-feeding-table-desc">
        <span className="colorDesc" style={{ color: 'white' }}>
          <div
            style={{ height: '0.2rem', width: '0.2rem', background: '#1B5E20', margin: '0.05rem' }}
          />
          <p>：&nbsp;&nbsp;</p>
          <p>检测合格</p>
        </span>
        <span className="colorDesc" style={{ color: 'white' }}>
          <div
            style={{ height: '0.2rem', width: '0.2rem', background: '#01579B', margin: '0.05rem' }}
          />
          <p>：&nbsp;&nbsp;</p>
          <p>寿命满12h</p>
        </span>
        <span className="colorDesc" style={{ color: 'white' }}>
          <div
            style={{ height: '0.2rem', width: '0.2rem', background: '#D32F2F', margin: '0.05rem' }}
          />
          <p>：&nbsp;&nbsp;</p>
          <p>质量异常</p>
        </span>
        <span className="colorDesc" style={{ color: 'white' }}>
          <div
            style={{ height: '0.2rem', width: '0.2rem', background: '#311B92', margin: '0.05rem' }}
          />
          <p>：&nbsp;&nbsp;</p>
          <p>物料切换</p>
        </span>
        <span className="colorDesc" style={{ color: 'white' }}>
          <div
            style={{ height: '0.2rem', width: '0.2rem', background: 'white', margin: '0.05rem' }}
          />
          <p>：&nbsp;&nbsp;</p>
          <p>完工入库</p>
        </span>
        <span className="colorDesc" style={{ color: 'white' }}>
          <div
            style={{ height: '0.2rem', width: '0.2rem', background: '#9C27B0', margin: '0.05rem' }}
          />
          <p>：&nbsp;&nbsp;</p>
          <p>先入</p>
        </span>
        <span className="colorDesc" style={{ color: 'white' }}>
          <div
            style={{ height: '0.2rem', width: '0.2rem', background: '#FF6F00', margin: '0.05rem' }}
          />
          <p>：&nbsp;&nbsp;</p>
          <p>先出</p>
        </span>
      </span>,
    ];
  };

  function handleOnChange() {
    const value = selectDS.toData()[0].kanban;
    switch (value) {
      case 'LWMS.TF.KANBAN_LD_SR01':
        setActive(0);
        break;
      case 'LWMS.TF.KANBAN_LD_SR02':
        setActive(1);
        break;
      case 'LWMS. TF.KANBAN_LD_SR03':
        setActive(2);
        break;
      case 'LWMS. TF.KANBAN_LD_SR04':
        setActive(3);
        break;
      case 'LWMS.TF.KANBAN_PT_SR01':
        setActive(4);
        break;
      case 'LWMS.TF.KANBAN_PT_SR02':
        setActive(5);
        break;
      case 'LWMS.TF.KANBAN_PT_SR03':
        setActive(6);
        break;
      case 'LWMS.TF.KANBAN_SRD01':
        setActive(7);
        break;
      case 'LWMS.TF.KANBAN_FNC01':
        setActive(8);
        break;
      case 'LWMS.TF.KANBAN_FNC02':
        setActive(9);
        break;
      case 'LWMS.TF.KANBAN_FNC03':
        setActive(10);
        break;
      case 'LWMS.TF.KANBAN_FNC04':
        setActive(11);
        break;
      default:
        break;
    }
  }

  return (
    <Fragment>
      <div className="warehouse-spectaculars-kanban">
        <DashboardHeader
          title={intl.get(`${preCode}.view.title.index`).d('仓库看板')}
          history={props.history}
          ds={selectDS}
          onChange={handleOnChange}
        />
        {active === 0 && (
          <Content className="lwms-warehouse-spectaculars">
            <table className="lwms-warehouse-spectaculars-feeding-table" border="1">
              <caption>
                已退火货位看板（料道）
                {getColor()}
              </caption>
              <tbody>
                <tr className="lwms-warehouse-spectaculars-table-header">
                  {SR01ListTr &&
                    SR01ListTr.map((item, index) => {
                      return <td className={SR01ListTrColor[index] ? `color6` : ``}>{item}</td>;
                    })}
                </tr>
                {SR01List &&
                  SR01List.map((list, index) => {
                    return (
                      <tr className="lwms-warehouse-spectaculars-table-list">
                        {list &&
                          list.map((item) => {
                            return (
                              <td className={index < 2 ? `color-item` : `color${item.color}`}>
                                {index < 2
                                  ? item || ''
                                  : (
                                      <div>
                                        <span style={{ display: 'block' }}>{item.tagCode}</span>
                                        <span style={{ display: 'block' }}>{item.traceNum}</span>
                                      </div>
                                    ) || ''}
                              </td>
                            );
                          })}
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </Content>
        )}
        {active === 1 && (
          <Content className="lwms-warehouse-spectaculars">
            <table className="lwms-warehouse-spectaculars-feeding-table" border="1">
              <caption>
                已退火货位看板（料道）
                {getColor()}
              </caption>
              <tbody>
                <tr className="lwms-warehouse-spectaculars-table-header">
                  {SR02ListTr &&
                    SR02ListTr.map((item, index) => {
                      return <td className={SR02ListTrColor[index] ? `color6` : ``}>{item}</td>;
                    })}
                </tr>
                {SR02List &&
                  SR02List.map((list, index) => {
                    return (
                      <tr className="lwms-warehouse-spectaculars-table-list">
                        {list &&
                          list.map((item) => {
                            return (
                              <td className={index < 2 ? `color-item` : `color${item.color}`}>
                                {index < 2
                                  ? item || ''
                                  : (
                                      <div>
                                        <span style={{ display: 'block' }}>{item.tagCode}</span>
                                        <span style={{ display: 'block' }}>{item.traceNum}</span>
                                      </div>
                                    ) || ''}
                              </td>
                            );
                          })}
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </Content>
        )}
        {active === 2 && (
          <Content className="lwms-warehouse-spectaculars">
            <table className="lwms-warehouse-spectaculars-feeding-table" border="1">
              <caption>
                已退火货位看板（料道）
                {getColor()}
              </caption>
              <tbody>
                <tr className="lwms-warehouse-spectaculars-table-header">
                  {SR03ListTr &&
                    SR03ListTr.map((item, index) => {
                      return <td className={SR03ListTrColor[index] ? `color6` : ``}>{item}</td>;
                    })}
                </tr>
                {SR03List &&
                  SR03List.map((list, index) => {
                    return (
                      <tr className="lwms-warehouse-spectaculars-table-list">
                        {list &&
                          list.map((item) => {
                            return (
                              <td className={index < 2 ? `color-item` : `color${item.color}`}>
                                {index < 2
                                  ? item || ''
                                  : (
                                      <div>
                                        <span style={{ display: 'block' }}>{item.tagCode}</span>
                                        <span style={{ display: 'block' }}>{item.traceNum}</span>
                                      </div>
                                    ) || ''}
                              </td>
                            );
                          })}
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </Content>
        )}
        {active === 3 && (
          <Content className="lwms-warehouse-spectaculars">
            <table className="lwms-warehouse-spectaculars-feeding-table-two" border="1">
              <caption>
                已退火货位看板（料道）
                {getColor()}
              </caption>
              <tbody>
                <tr className="lwms-warehouse-spectaculars-table-header">
                  {SR04ListTr &&
                    SR04ListTr.map((item, index) => {
                      return <td className={SR04ListTrColor[index] ? `color6` : ``}>{item}</td>;
                    })}
                </tr>
                {SR04List &&
                  SR04List.map((list, index) => {
                    return (
                      <tr className="lwms-warehouse-spectaculars-table-list">
                        {list &&
                          list.map((item) => {
                            return (
                              <td className={index < 2 ? `color-item` : `color${item.color}`}>
                                {index < 2
                                  ? item || ''
                                  : (
                                      <div>
                                        <span style={{ display: 'block' }}>{item.tagCode}</span>
                                        <span style={{ display: 'block' }}>{item.traceNum}</span>
                                      </div>
                                    ) || ''}
                              </td>
                            );
                          })}
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </Content>
        )}
        {active === 4 && (
          <Content className="lwms-warehouse-spectaculars">
            <table className="lwms-warehouse-spectaculars-feeding-table" border="1">
              <caption>
                已退火货位看板（平台）
                {getColor()}
              </caption>
              <tbody>
                <tr className="lwms-warehouse-spectaculars-table-header">
                  {SR05ListTr &&
                    SR05ListTr.map((item, index) => {
                      return <td className={SR05ListTrColor[index] ? `color6` : ``}>{item}</td>;
                    })}
                </tr>
                {SR05List &&
                  SR05List.map((list, index) => {
                    return (
                      <tr className="lwms-warehouse-spectaculars-table-list">
                        {list &&
                          list.map((item) => {
                            return (
                              <td className={index < 2 ? `color-item` : `color${item.color}`}>
                                {index < 2
                                  ? item || ''
                                  : (
                                      <div>
                                        <span style={{ display: 'block' }}>{item.tagCode}</span>
                                        <span style={{ display: 'block' }}>{item.traceNum}</span>
                                      </div>
                                    ) || ''}
                              </td>
                            );
                          })}
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </Content>
        )}
        {active === 5 && (
          <Content className="lwms-warehouse-spectaculars">
            <table className="lwms-warehouse-spectaculars-feeding-table" border="1">
              <caption>
                已退火货位看板（平台）
                {getColor()}
              </caption>
              <tbody>
                <tr className="lwms-warehouse-spectaculars-table-header">
                  {SR06ListTr &&
                    SR06ListTr.map((item, index) => {
                      return <td className={SR06ListTrColor[index] ? `color6` : ``}>{item}</td>;
                    })}
                </tr>
                {SR06List &&
                  SR06List.map((list, index) => {
                    return (
                      <tr className="lwms-warehouse-spectaculars-table-list">
                        {list &&
                          list.map((item) => {
                            return (
                              <td className={index < 2 ? `color-item` : `color${item.color}`}>
                                {index < 2
                                  ? item || ''
                                  : (
                                      <div>
                                        <span style={{ display: 'block' }}>{item.tagCode}</span>
                                        <span style={{ display: 'block' }}>{item.traceNum}</span>
                                      </div>
                                    ) || ''}
                              </td>
                            );
                          })}
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </Content>
        )}
        {active === 6 && (
          <Content className="lwms-warehouse-spectaculars">
            <table className="lwms-warehouse-spectaculars-feeding-table" border="1">
              <caption>
                已退火货位看板（平台）
                {getColor()}
              </caption>
              <tbody>
                <tr className="lwms-warehouse-spectaculars-table-header">
                  {SR07ListTr &&
                    SR07ListTr.map((item, index) => {
                      return <td className={SR07ListTrColor[index] ? `color6` : ``}>{item}</td>;
                    })}
                </tr>
                {SR07List &&
                  SR07List.map((list, index) => {
                    return (
                      <tr className="lwms-warehouse-spectaculars-table-list">
                        {list &&
                          list.map((item) => {
                            return (
                              <td className={index < 2 ? `color-item` : `color${item.color}`}>
                                {index < 2
                                  ? item || ''
                                  : (
                                      <div>
                                        <span style={{ display: 'block' }}>{item.tagCode}</span>
                                        <span style={{ display: 'block' }}>{item.traceNum}</span>
                                      </div>
                                    ) || ''}
                              </td>
                            );
                          })}
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </Content>
        )}
        {active === 7 && (
          <Content className="lwms-warehouse-spectaculars">
            <table className="lwms-warehouse-spectaculars-ground-table" border="1">
              <caption>
                已退火货位看板（地面）
                {getColor()}
              </caption>
              <tbody>
                <tr className="lwms-warehouse-spectaculars-table-header">
                  {SRD01ListTr &&
                    SRD01ListTr.map((item, index) => {
                      return <td className={SRD01ListTrColor[index] ? `color6` : ``}>{item}</td>;
                    })}
                </tr>
                {SRD01List &&
                  SRD01List.map((list, index) => {
                    return (
                      <tr className="lwms-warehouse-spectaculars-table-list">
                        {list &&
                          list.map((item) => {
                            return (
                              <td className={index < 1 ? `color-item` : `color${item.color}`}>
                                {index < 1
                                  ? item || ''
                                  : (
                                      <div>
                                        <span style={{ display: 'block' }}>{item.tagCode}</span>
                                        <span style={{ display: 'block' }}>{item.traceNum}</span>
                                      </div>
                                    ) || ''}
                              </td>
                            );
                          })}
                      </tr>
                    );
                  })}
                <tr className="lwms-warehouse-spectaculars-table-header">
                  {SRD02ListTr &&
                    SRD02ListTr.map((item, index) => {
                      return <td className={SRD02ListTrColor[index] ? `color6` : ``}>{item}</td>;
                    })}
                </tr>
                {SRD02List &&
                  SRD02List.map((list, index) => {
                    return (
                      <tr className="lwms-warehouse-spectaculars-table-list">
                        {list &&
                          list.map((item) => {
                            return (
                              <td className={index < 1 ? `color-item` : `color${item.color}`}>
                                {index < 1
                                  ? item || ''
                                  : (
                                      <div>
                                        <span style={{ display: 'block' }}>{item.tagCode}</span>
                                        <span style={{ display: 'block' }}>{item.traceNum}</span>
                                      </div>
                                    ) || ''}
                              </td>
                            );
                          })}
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </Content>
        )}
        {active === 8 && (
          <Content className="lwms-warehouse-spectaculars">
            <table className="lwms-warehouse-spectaculars-nitride-table" border="1">
              <caption>
                氮化成品看板
                {getColor()}
              </caption>
              <tbody>
                <tr className="lwms-warehouse-spectaculars-table-header">
                  {FNC01ListTr &&
                    FNC01ListTr.map((item, index) => {
                      return <td className={FNC01ListTrColor[index] ? `color6` : ``}>{item}</td>;
                    })}
                </tr>
                {FNC01List &&
                  FNC01List.map((list, index) => {
                    return (
                      <tr className="lwms-warehouse-spectaculars-table-list">
                        {list &&
                          list.map((item) => {
                            return (
                              <td className={index < 2 ? `color-item` : `color${item.color}`}>
                                {index < 2
                                  ? item || ''
                                  : (
                                      <div>
                                        <span style={{ display: 'block' }}>{item.tagCode}</span>
                                        <span style={{ display: 'block' }}>{item.traceNum}</span>
                                      </div>
                                    ) || ''}
                              </td>
                            );
                          })}
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </Content>
        )}
        {active === 9 && (
          <Content className="lwms-warehouse-spectaculars">
            <table className="lwms-warehouse-spectaculars-nitride-table" border="1">
              <caption>
                氮化成品看板
                {getColor()}
              </caption>
              <tbody>
                <tr className="lwms-warehouse-spectaculars-table-header">
                  {FNC02ListTr &&
                    FNC02ListTr.map((item, index) => {
                      return <td className={FNC02ListTrColor[index] ? `color6` : ``}>{item}</td>;
                    })}
                </tr>
                {FNC02List &&
                  FNC02List.map((list, index) => {
                    return (
                      <tr className="lwms-warehouse-spectaculars-table-list">
                        {list &&
                          list.map((item) => {
                            return (
                              <td className={index < 2 ? `color-item` : `color${item.color}`}>
                                {index < 2
                                  ? item || ''
                                  : (
                                      <div>
                                        <span style={{ display: 'block' }}>{item.tagCode}</span>
                                        <span style={{ display: 'block' }}>{item.traceNum}</span>
                                      </div>
                                    ) || ''}
                              </td>
                            );
                          })}
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </Content>
        )}
        {active === 10 && (
          <Content className="lwms-warehouse-spectaculars">
            <table className="lwms-warehouse-spectaculars-nitride-table" border="1">
              <caption>
                氮化成品看板
                {getColor()}
              </caption>
              <tbody>
                <tr className="lwms-warehouse-spectaculars-table-header">
                  {FNC03ListTr &&
                    FNC03ListTr.map((item, index) => {
                      return <td className={FNC03ListTrColor[index] ? `color6` : ``}>{item}</td>;
                    })}
                </tr>
                {FNC03List &&
                  FNC03List.map((list, index) => {
                    return (
                      <tr className="lwms-warehouse-spectaculars-table-list">
                        {list &&
                          list.map((item) => {
                            return (
                              <td className={index < 2 ? `color-item` : `color${item.color}`}>
                                {index < 2
                                  ? item || ''
                                  : (
                                      <div>
                                        <span style={{ display: 'block' }}>{item.tagCode}</span>
                                        <span style={{ display: 'block' }}>{item.traceNum}</span>
                                      </div>
                                    ) || ''}
                              </td>
                            );
                          })}
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </Content>
        )}
        {active === 11 && (
          <Content className="lwms-warehouse-spectaculars">
            <table className="lwms-warehouse-spectaculars-nitride-table" border="1">
              <caption>
                氮化成品看板
                {getColor()}
              </caption>
              <tbody>
                <tr className="lwms-warehouse-spectaculars-table-header">
                  {FNC04ListTr &&
                    FNC04ListTr.map((item, index) => {
                      return <td className={FNC04ListTrColor[index] ? `color6` : ``}>{item}</td>;
                    })}
                </tr>
                {FNC04List &&
                  FNC04List.map((list, index) => {
                    return (
                      <tr className="lwms-warehouse-spectaculars-table-list">
                        {list &&
                          list.map((item) => {
                            return (
                              <td className={index < 2 ? `color-item` : `color${item.color}`}>
                                {index < 2
                                  ? item || ''
                                  : (
                                      <div>
                                        <span style={{ display: 'block' }}>{item.tagCode}</span>
                                        <span style={{ display: 'block' }}>{item.traceNum}</span>
                                      </div>
                                    ) || ''}
                              </td>
                            );
                          })}
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </Content>
        )}
      </div>
    </Fragment>
  );
};

export default connect()((props) => WarehouseSpectaculars(props));
