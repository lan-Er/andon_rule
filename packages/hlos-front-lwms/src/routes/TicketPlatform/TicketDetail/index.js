/*
 * @Description:送货单详情
 * @Author: yu.na<yu.na1@hand-china.com>
 * @Date: 2021-04-06 15:28:06
 */

import React, { useMemo, useState, useEffect } from 'react';
import { Table, DataSet } from 'choerodon-ui/pro';
import uuidv4 from 'uuid/v4';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { getSerialNum, statusRender } from 'hlos-front/lib/utils/renderer';
import { Header } from 'components/Page';
import { newDetailHeadDS } from '@/stores/ticketDetailDS';
import Icons from 'components/Icons';
import styles from './index.less';

const headDataSetFactory = () => new DataSet({ ...newDetailHeadDS() });

const TicketDetail = ({ match }) => {
  const headDS = useDataSet(headDataSetFactory, TicketDetail);

  const [isExpand, setIsExpand] = useState(false);
  const [headerInfo, setHeaderInfo] = useState({});

  useEffect(() => {
    async function refreshPage() {
      const {
        params: { ticketId },
      } = match;

      headDS.setQueryParameter('ticketId', ticketId);
      const res = await headDS.query();

      if (res && res.content && res.content[0]) {
        setHeaderInfo(res.content[0]);
      }
    }
    refreshPage();
  }, [match]);

  const group = useMemo(() => {
    const base = [
      [
        {
          icon: 'quantity2',
          label: '采购中心',
          valueKey: 'scmOuName',
        },
        {
          icon: 'danju',
          label: '采购订单',
          valueKey: ['poNum', 'poLineNum'],
          extraIcon: 'copy1',
        },
        {
          icon: 'caigouyuan',
          label: '采购员',
          valueKey: 'buyer',
        },
        {
          icon: 'location',
          label: '收货区域',
          valueKey: 'deliveryArea',
        },
      ],
      [
        {
          icon: 'date1',
          label: '发货',
          valueKey: 'shippedDate',
          next: {
            label: '预计到达',
            valueKey: 'expectedArrivalDate',
          },
        },
        {
          icon: 'chengyun',
          label: '承运人',
          valueKey: 'carrier',
          next: {
            label: '电话',
            valueKey: 'carrierContact',
          },
        },
        {
          icon: 'danju',
          label: '发运单号',
          valueKey: 'shipTicket',
          extraIcon: 'copy1',
          next: {
            label: '运费',
            valueKey: ['freight', 'currencyName'],
          },
        },
        {
          icon: 'chepaihao',
          label: '车牌号',
          valueKey: 'plateNum',
        },
      ],
    ];
    if (isExpand) {
      return base.concat([
        [
          {
            icon: 'jieshou',
            label: '接收',
            valueKey: ['receiveWorkerName', 'actualArrivalTime'],
            next: {
              valueKey: ['receiveWarehouseName', 'receiveWmAreaName'],
            },
          },
          {
            icon: 'rukudane',
            label: '入库',
            valueKey: ['inventoryWorkerName', 'inventoryTime'],
            next: {
              valueKey: ['inventoryWarehouseName', 'inventoryWmAreaName'],
            },
          },
          {
            icon: 'jianyan',
            label: '检验',
            valueKey: ['inspectorName', 'inspectedTime'],
          },
        ],
        [
          {
            icon: 'danju',
            label: '来源单据',
            valueKey: ['sourceDocNum', 'sourceDocLineNum'],
            extraIcon: 'copy1',
            next: {
              valueKey: 'sourceDocTypeName',
            },
          },
          {
            icon: 'danju',
            label: '外部单据',
            extraValue: '(单号）',
            valueKey: ['externalNum', 'externalTicketType'],
            next: {
              extraValue: '(ID）',
              valueKey: 'externalId',
            },
          },
        ],
        [
          {
            icon: 'jianyan',
            label: '备注',
            valueKey: 'remark',
          },
          {
            icon: 'jianyan',
            label: '制单',
            valueKey: ['creator', 'ticketCreatedDate'],
          },
          {
            icon: 'dayin',
            label: '打印时间',
            valueKey: 'printedDate',
          },
          {
            icon: 'jianyan',
            label: '审批',
            valueKey: ['approvalRule', 'approvalWorkflow'],
          },
        ],
      ]);
    }
    return base;
  }, [isExpand]);

  const columns = useMemo(() => {
    return [
      { header: '行号', width: 70, lock: 'left', renderer: ({ record }) => getSerialNum(record) },
      {
        name: 'itemCode',
        width: 250,
        lock: 'left',
        tooltip: 'overflow',
      },
      {
        name: 'poNum',
        width: 150,
      },
      {
        name: 'ticketLineStatusMeaning',
        align: 'center',
        renderer: ({ value, record }) => statusRender(record.get('ticketLineStatus'), value),
      },
      { name: 'uom', width: 70 },
      { name: 'deliveryQty', width: 84 },
      { name: 'receivedQty', width: 84 },
      { name: 'inventoryQty', width: 84 },
      { name: 'qcOkQty', width: 84 },
      { name: 'qcNgQty', width: 84 },
      { name: 'returnedQty', width: 84 },
      { name: 'secondUomName', width: 70 },
      { name: 'secondDeliveryQty', width: 84 },
      { name: 'demandDate', width: 100 },
      { name: 'promiseDate', width: 100 },
      { name: 'inspect', width: 336 },
      { name: 'qcNgReason', width: 200 },
      { name: 'receiveInfo', width: 200 },
      { name: 'receiveWm', width: 200 },
      { name: 'inventoryInfo', width: 200 },
      { name: 'inventoryWm', width: 128 },
      { name: 'recieveRuleMeaning', width: 100 },
      { name: 'tolerance', width: 84 },
      { name: 'partyLotNumber', width: 128 },
      { name: 'lotNumber', width: 128 },
      { name: 'tagCode', width: 128 },
      { name: 'packingQty', width: 84 },
      { name: 'containerQty', width: 84 },
      { name: 'sourceDoc', width: 250 },
      { name: 'externalDoc', width: 336 },
      { name: 'itemControlTypeMeaning', width: 84 },
      { name: 'lineRemark', width: 200 },
    ];
  }, []);

  const handleToggleExpand = () => {
    setIsExpand(!isExpand);
  };

  return (
    <div className={styles['lwms-ticket-platform-detail']}>
      <Header title="送货单详情" backPath="/lwms/ticket-platform/list" />
      <div className={styles.main}>
        <div className={styles.header}>
          <div className={styles['header-left']}>
            <div className={styles.bolder}>{headerInfo.ticketNum}</div>
            <div className={styles.bolder}>{headerInfo.partyName}</div>
            <div className={styles.bolder}>{headerInfo.partySiteName}</div>
            <div>{headerInfo.organizationName}</div>
            <div>{headerInfo.ticketTypeName}</div>
          </div>
          <div className={styles['header-right']}>
            {statusRender(headerInfo.ticketStatus, headerInfo.ticketStatusMeaning)}
          </div>
        </div>
        <div className={styles.other}>
          {group.map((i) => {
            return (
              <div key={uuidv4()} className={styles.group}>
                {i.map((j) => {
                  return (
                    <div className={styles['group-item']} key={j.valueKey}>
                      <div>
                        <Icons type={j.icon} size="16" color="#666" />
                        <div>
                          <span>{j.label}</span>
                          {Array.isArray(j.valueKey) ? (
                            j.valueKey.map((v) => {
                              return <span key={v}>{headerInfo[v]}</span>;
                            })
                          ) : (
                            <span>{headerInfo[j.valueKey]}</span>
                          )}
                        </div>
                        {j.extraIcon && headerInfo[j.valueKey] && (
                          <Icons type={j.extraIcon} size="16" color="#666" />
                        )}
                      </div>
                      {j.next && (
                        <div className={styles.next}>
                          <div>
                            <span>{j.next?.label}</span>
                            {Array.isArray(j.next.valueKey) ? (
                              j.next.valueKey.map((v) => {
                                return <span key={v}>{headerInfo[v]}</span>;
                              })
                            ) : (
                              <span>{headerInfo[j.next.valueKey]}</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
          <div className={styles.expand} onClick={handleToggleExpand}>
            {isExpand ? '收起' : '展开'}
            <Icons type={isExpand ? 'down_blue' : 'up_blue'} color="#386BD7" size="16" />
          </div>
        </div>
      </div>
      <div className={styles['line-wrapper']}>
        <Table
          dataSet={headDS.children.lineDS}
          columns={columns}
          columnResizable="true"
          queryBar="none"
        />
      </div>
    </div>
  );
};

export default TicketDetail;
