/**
 * @Description: 飞达料车--detail
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-12-07 15:23:29
 * @LastEditors: yu.na
 */

import React, { Fragment, useEffect, useState } from 'react';
import { DataSet } from 'choerodon-ui/pro';
import { Header } from 'components/Page';
import intl from 'utils/intl';
import { getResponse } from 'utils/utils';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import editIcon from 'hlos-front/lib/assets/icons/edit-icon.svg';
import orgIcon from 'hlos-front/lib/assets/icons/org-icon.svg';
import orderIcon from 'hlos-front/lib/assets/icons/order-icon2.svg';
import itemIcon from 'hlos-front/lib/assets/icons/item-icon1.svg';
import meOuIcon from 'hlos-front/lib/assets/icons/me-ou-icon.svg';
import dateIcon from 'hlos-front/lib/assets/icons/date-icon.svg';
import docIcon from 'hlos-front/lib/assets/icons/doc-icon.svg';
import copyIcon from 'hlos-front/lib/assets/icons/copy-icon.svg';
import seatIcon from 'hlos-front/lib/assets/icons/seat-icon.svg';
import { DetailDS } from '../stores/ListDS';
import styles from './index.less';

const preCode = 'lmds.feeder';
const dsFactory = () => new DataSet(DetailDS());

const FeederDetail = (props) => {
  const detailDS = useDataSet(dsFactory, FeederDetail);

  const [data, setData] = useState({});

  useEffect(() => {
    async function queryData() {
      const { match } = props;
      const { trolleyId } = match.params;
      detailDS.queryParameter = {
        trolleyId,
      };
      const res = await detailDS.query();
      if (getResponse(res) && res.content && res.content[0]) {
        setData(res.content[0]);
      }
    }
    queryData();
  }, []);

  const enableRender = (flag) => {
    if (flag) {
      return <span className={styles.block}>有效</span>;
    } else if (flag !== undefined && flag !== null) {
      return <span className={`${styles.block} ${styles.red}`}>无效</span>;
    }
    return null;
  };

  const feederRender = (feeder) => {
    if (feeder) {
      const feederArr = feeder.split(';');
      return feederArr.map((i) => {
        return (
          <span key={i} className={styles['feeder-item']}>
            {i}
          </span>
        );
      });
    }
  };

  const numberRender = (value) => {
    if (value !== undefined && value !== null) {
      return value;
    }
    return '-';
  };

  return (
    <Fragment key="feeder-trolley-detail">
      <Header
        title={intl.get(`${preCode}.view.title.trolleyDetail`).d('料车明细')}
        backPath="/lmds/resource-feeder-trolley/list"
      />
      <div className={styles.content}>
        <div className={styles.main}>
          <div className={styles['main-top']}>
            <div>
              <img src={data.fileUrl} alt="" />
            </div>
            <div>
              <div className={styles.title}>
                {data.trolleyName || '-'}
                {data.trolleyAlias && <span>{data.trolleyAlias}</span>}
              </div>
              <div className={styles.desc}>
                <span>{data.description || '-'}</span>
                <span>
                  <img src={editIcon} alt="" />
                  {data.remark || '-'}
                </span>
              </div>
              <div className={styles.area}>
                <span>
                  <img src={orgIcon} alt="" />
                  {data.organizationName || '-'}
                </span>
                <span>
                  <img src={orderIcon} alt="" />
                  {data.trolleyId || '-'}
                </span>
                <span>
                  <img src={itemIcon} alt="" />
                  {data.trolleyTypeMeaning || '-'}
                </span>
                <span>
                  <img src={meOuIcon} alt="" />
                  {data.trolleyCategoryName || '-'}
                </span>
                <span>
                  <img src={orderIcon} alt="" />
                  <span>{data.trolleyGroup}</span>
                  {enableRender(data.enabledFlag)}
                  {data.trolleyStatus && (
                    <span className={`${styles.block} ${styles.blue}`}>
                      {data.trolleyStatusMeaning || data.trolleyStatus}
                    </span>
                  )}
                </span>
              </div>
              <div className={styles.date}>
                <span>
                  <img src={dateIcon} alt="" />
                  <span>采购日期</span>
                  <span>{data.purchaseDate || '-'}</span>
                </span>
                <span>
                  <img src={dateIcon} alt="" />
                  <span>开始使用日期</span>
                  <span>{data.startUseDate || '-'}</span>
                </span>
                <span>
                  <img src={docIcon} alt="" />
                  <span>料车BOM</span>
                  <span>{data.bomVersion || '-'}</span>
                </span>
                <span>
                  <img src={seatIcon} alt="" />
                  <span>站位数量</span>
                  <span>{numberRender(data.loadSeatQty)}</span>
                </span>
              </div>
            </div>
          </div>
          <div className={styles['main-bottom']}>
            <div>
              <p>
                <span>部门</span>
                <span className={styles.bold}>{data.departmentName || '-'}</span>
              </p>
              <p>
                <span>主管岗位</span>
                <span className={styles.bold}>{data.chiefPositionName || '-'}</span>
              </p>
              <p>
                <span>责任人</span>
                <span className={styles.bold}>{data.supervisorName || '-'}</span>
              </p>
            </div>
            <div>
              <p>
                <span>所有类型</span>
                <span className={styles.bold}>{data.ownerTypeMeaning || '-'}</span>
              </p>
              <p>
                <span>所有者</span>
                <span className={styles.bold}>{data.ownerName || '-'}</span>
              </p>
              <p>
                <span>资产编号</span>
                <span className={styles.bold}>{data.assetNumber || '-'}</span>
              </p>
            </div>
            <div>
              <p>
                <span>供应商</span>
                <span className={styles.bold}>{data.supplier || '-'}</span>
              </p>
              <p>
                <span>制造商</span>
                <span className={styles.bold}>{data.manufacturer || '-'}</span>
              </p>
              <p>
                <span>维修电话</span>
                <span className={styles.bold}>
                  {data.servicePhone || '-'}
                  {data.servicePhone && <img src={copyIcon} alt="" />}
                </span>
              </p>
            </div>
            <div>
              <p>
                <span>估值币种</span>
                <span className={styles.bold}>{data.currencyName || '-'}</span>
              </p>
              <p>
                <span>初始价值</span>
                <span className={styles.bold}>{numberRender(data.initialValue)}</span>
              </p>
              <p>
                <span>当前价值</span>
                <span className={styles.bold}>{numberRender(data.currentValue)}</span>
              </p>
            </div>
          </div>
        </div>
        <div className={styles.other}>
          <div className={styles.location}>
            <p className={styles.title}>料车位置</p>
            <div className={styles.item}>
              <div>
                <p>
                  <span>生产线</span>
                  <span className={styles.bold}>{data.prodLineName || '-'}</span>
                </p>
                <p>
                  <span>设备</span>
                  <span className={styles.bold}>{data.equipmentName || '-'}</span>
                </p>
                <p>
                  <span>工位</span>
                  <span className={styles.bold}>{data.workcellName || '-'}</span>
                </p>
                <p>
                  <span>班组</span>
                  <span className={styles.bold}>{data.workerGroupName || '-'}</span>
                </p>
                <p>
                  <span>操作工</span>
                  <span className={styles.bold}>{data.workerName || '-'}</span>
                </p>
              </div>
              <div>
                <p>
                  <span>仓库</span>
                  <span className={styles.bold}>{data.warehouseName || '-'}</span>
                </p>
                <p>
                  <span>货位</span>
                  <span className={styles.bold}>{data.wmAreaName || '-'}</span>
                </p>
                <p>
                  <span>货格</span>
                  <span className={styles.bold}>{data.wmUnitCode || '-'}</span>
                </p>
                <p>
                  <span>地点</span>
                  <span className={styles.bold}>{data.locationName || '-'}</span>
                </p>
                <p>
                  <span>外部地点</span>
                  <span className={styles.bold}>{data.outsideLocation || '-'}</span>
                </p>
              </div>
            </div>
            <div className={styles.instruction}>
              <span>飞达</span>
              <div className={styles.feeder}>{feederRender(data.loadFeeder || '')}</div>
            </div>
          </div>
          <div className={styles.tpm}>
            <p className={styles.title}>料车TPM</p>
            <div className={styles.item}>
              <div>
                <p>
                  <span>维护班组</span>
                  <span className={styles.bold}>{data.tpmGroupName || '-'}</span>
                </p>
                <p>
                  <span>维护员工</span>
                  <span className={styles.bold}>{data.tpmWorkerName || '-'}</span>
                </p>
                <p>
                  <span>图纸编码</span>
                  <span>
                    <a
                      href={data.drawingCode}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ margin: '3px 10px' }}
                    >
                      {data.drawingCode || '-'}
                    </a>
                  </span>
                </p>
                <p>
                  <span>作业指导</span>
                  <span>
                    <a
                      href={data.referenceDocument}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ margin: '3px 10px' }}
                    >
                      {data.referenceDocument || '-'}
                    </a>
                  </span>
                </p>
              </div>
              <div>
                <p>
                  <span>已使用次数</span>
                  <span className={styles.bold}>{numberRender(data.trolleyUsedCount)}</span>
                </p>
                <p>
                  <span>检修次数</span>
                  <span className={styles.bold}>{numberRender(data.maintenancedTimes)}</span>
                </p>
                <p>
                  <span>上次检验时间</span>
                  <span className={styles.bold}>{data.lastTpmDate || '-'}</span>
                </p>
                <p>
                  <span>上次检修人</span>
                  <span className={styles.bold}>{data.lastTpmManName || '-'}</span>
                </p>
              </div>
            </div>
            <div className={styles.instruction}>
              <span>操作说明</span>
              <span>{data.instruction || '-'}</span>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default FeederDetail;
