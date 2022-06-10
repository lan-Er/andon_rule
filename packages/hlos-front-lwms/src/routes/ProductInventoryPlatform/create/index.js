/*
 * @Description:生产入库单详情
 * @Author: leying.yan<leying.yan@hand-china.com>
 * @Date: 2021-04-08 11:28:06
 */

import React, { useMemo, useState, useEffect } from 'react';
import { Table, DataSet } from 'choerodon-ui/pro';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { statusRender } from 'hlos-front/lib/utils/renderer';
import notification from 'utils/notification';
import { Header } from 'components/Page';
import { newDetailHeadDS } from '@/stores/productInventoryPlatformDS';
import Icons from 'components/Icons';
import qs from 'query-string';

import styles from './index.less';

const headDataSetFactory = () => new DataSet({ ...newDetailHeadDS() });

const productInventoryDetail = ({ match }) => {
  const headDS = useDataSet(headDataSetFactory, productInventoryDetail);

  const [isExpand, setIsExpand] = useState(false);
  const [headerInfo, setHeaderInfo] = useState({});

  useEffect(() => {
    async function refreshPage() {
      const {
        params: { requestId },
      } = match;
      const { businessKey } = qs.parse(window.location.search) || {};
      headDS.setQueryParameter('requestId', businessKey || requestId);
      const res = await headDS.query();

      if (res && res.content && res.content[0]) {
        setHeaderInfo(res.content[0]);
      }
    }
    refreshPage();
  }, [match]);

  function handleCopyNum(id) {
    const copyDOM = document.getElementById(id);

    const range = document.createRange(); // 创建一个range
    window.getSelection().removeAllRanges(); // 清楚页面中已有的selection
    range.selectNode(copyDOM); // 选中需要复制的节点
    window.getSelection().addRange(range); // 执行选中元素
    const successful = document.execCommand('copy'); // 执行 copy 操作

    if (successful) {
      notification.success({
        message: '复制成功',
      });
    } else {
      notification.error({
        message: '复制失败',
      });
    }
    // 移除选中的元素
    window.getSelection().removeAllRanges();
  }

  const group = useMemo(() => {
    const base = [
      [
        {
          icon: 'danju',
          label: 'MO号',
          valueKey: 'moNum',
          extraIcon: 'copy1',
        },
        {
          icon: 'location',
          label: '完工地点',
          valueKey: ['prodLineName', 'workcellName'],
        },
        {
          icon: 'wangongcangku',
          label: '完工仓库',
          valueKey: ['warehouseName', 'wmAreaName'],
        },
      ],
    ];
    if (isExpand) {
      return base.concat([
        [
          {
            icon: 'rukudane',
            label: '入库执行',
            valueKey: ['executedWorker', 'executedTime'],
            next: {
              valueKey: ['toWarehouseName', 'toWmAreaName'],
            },
          },
          {
            icon: 'danju',
            label: '入库组',
            valueKey: 'requestGroup',
          },
          {
            icon: 'documents',
            label: '项目号',
            valueKey: 'projectNum',
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
            valueKey: ['externalNum', 'externalType'],
            next: {
              extraValue: '(ID）',
              valueKey: 'externalId',
            },
          },
        ],
        [
          {
            icon: 'beizhu',
            label: '备注',
            valueKey: 'remark',
          },
          {
            icon: 'zhidan',
            label: '制单',
            valueKey: ['creator', 'creationDate'],
          },
          {
            icon: 'dayin',
            label: '打印时间',
            valueKey: 'printedDate',
          },
          {
            icon: 'shenpi',
            label: '审批',
            valueKey: 'approvalRuleMeaning',
          },
        ],
      ]);
    }
    return base;
  }, [isExpand]);

  const columns = [
    {
      name: 'requestLineNum',
      width: 70,
      editor: false,
      lock: 'left',
    },
    {
      name: 'itemCode',
      width: 128,
      editor: false,
      lock: 'left',
    },
    {
      name: 'itemDescription',
      width: 200,
      editor: false,
    },
    {
      name: 'uomName',
      width: 70,
      editor: false,
    },
    {
      name: 'applyQty',
      width: 82,
      editor: false,
      align: 'left',
    },
    {
      name: 'executedQty',
      width: 82,
      editor: false,
      align: 'left',
    },
    {
      name: 'requestLineStatusMeaning',
      width: 90,
      editor: false,
      renderer: ({ value, record }) => statusRender(record.data.requestLineStatus, value),
    },
    {
      name: 'toWarehouseName',
      width: 200,
      editor: false,
      tooltip: 'overflow',
      renderer: ({ value, record }) => {
        return `${record.get('toWarehouseCode')} ${value}`.replace(/undefined/g, ' ');
      },
    },
    {
      name: 'toWmAreaName',
      width: 200,
      editor: false,
      tooltip: 'overflow',
      renderer: ({ value, record }) => {
        return `${record.get('toWmAreaCode')} ${value}`.replace(/undefined/g, ' ');
      },
    },
    {
      name: 'warehouseName',
      width: 200,
      editor: false,
      tooltip: 'overflow',
      renderer: ({ value, record }) => {
        return `${record.get('warehouseCode')} ${value}`.replace(/undefined/g, ' ');
      },
    },
    {
      name: 'wmAreaName',
      width: 200,
      editor: false,
      tooltip: 'overflow',
      renderer: ({ value, record }) => {
        return `${record.get('wmAreaCode')} ${value}`.replace(/undefined/g, ' ');
      },
    },
    {
      name: 'projectNum',
      width: 128,
      editor: false,
      tooltip: 'overflow',
    },
    {
      name: 'itemControlTypeMeaning',
      width: 82,
      editor: false,
    },
    {
      name: 'applyPackQty',
      width: 82,
      editor: false,
      align: 'left',
    },
    {
      name: 'applyWeight',
      width: 82,
      editor: false,
    },
    {
      name: 'secondUomName',
      width: 70,
      editor: false,
    },
    {
      name: 'secondApplyQty',
      width: 82,
      editor: false,
      align: 'left',
    },
    {
      name: 'sourceDocType',
      width: 128,
      editor: false,
    },
    {
      name: 'sourceDocNum',
      width: 144,
      editor: false,
    },
    {
      name: 'sourceDocLineNum',
      width: 70,
      editor: false,
    },
    {
      name: 'lineRemark',
      width: 200,
      editor: false,
      tooltip: 'overflow',
    },
    {
      name: 'externalId',
      width: 128,
      editor: false,
    },
    {
      name: 'externalNum',
      width: 128,
      editor: false,
    },
    {
      name: 'externalLineId',
      width: 70,
      editor: false,
      tooltip: 'overflow',
    },
    {
      name: 'externalLineNum',
      width: 70,
      editor: false,
    },
  ];

  const handleToggleExpand = () => {
    setIsExpand(!isExpand);
  };

  const {
    params: { requestId },
  } = match;
  return (
    <div className={styles['lwms-product-inventory-platform-detail']}>
      {requestId && (
        <Header title="生产入库单详情" backPath="/lwms/product-inventory-platform/list" />
      )}
      <div className={styles.main}>
        <div className={styles.header}>
          <div className={styles['header-left']}>
            <div className={styles.bolder}>{headerInfo.requestNum}</div>
            <div className={styles.bolder}>{headerInfo.toWarehouseCode}</div>
            <div className={styles.bolder}>{headerInfo.toWarehouseName}</div>
            <div className={styles.bolder}>{headerInfo.toWmAreaName}</div>
            <div>{headerInfo.organizationName}</div>
            <div>{headerInfo.requestTypeName}</div>
          </div>
          <div className={styles['header-right']}>
            {statusRender(headerInfo.requestStatus, headerInfo.requestStatusMeaning)}
          </div>
        </div>
        <div className={styles.other}>
          {group.map((i) => {
            return (
              <div className={styles.group}>
                {i.map((j) => {
                  return (
                    <div className={styles['group-item']}>
                      <div>
                        <Icons type={j.icon} size="16" color="#666" />
                        <div>
                          <span>{j.label}</span>
                          {Array.isArray(j.valueKey) ? (
                            j.valueKey.map((v) => {
                              return <span>{headerInfo[v]}</span>;
                            })
                          ) : (
                            <span id={j.valueKey}>{headerInfo[j.valueKey]}</span>
                          )}
                        </div>
                        {j.extraIcon && headerInfo[j.valueKey] && (
                          <Icons
                            type={j.extraIcon}
                            size="16"
                            color="#666"
                            onClick={() => handleCopyNum(j.valueKey)}
                          />
                        )}
                      </div>
                      {j.next && (
                        <div className={styles.next}>
                          <div>
                            <span>{j.next?.label}</span>
                            {Array.isArray(j.next.valueKey) ? (
                              j.next.valueKey.map((v) => {
                                return <span>{headerInfo[v]}</span>;
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
            <Icons type={isExpand ? 'up_blue' : 'down_blue'} color="#386BD7" size="15" />
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

export default productInventoryDetail;
