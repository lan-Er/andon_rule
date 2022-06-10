/*
 * @Description: 发货执行列表
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2020-07-10 15:34:28
 * @LastEditors: 赵敏捷
 */

import React, { useState, useEffect } from 'react';
import { Button, CheckBox, DataSet, Lov, SelectBox, Spin, TextField } from 'choerodon-ui/pro';
import { connect } from 'dva';
import { debounce, isEmpty } from 'lodash';
import moment from 'moment';

import intl from 'utils/intl';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import { getResponse } from 'utils/utils';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import { userSetting } from 'hlos-front/lib/services/api';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { headerSearchDSConfig } from '@/stores/deliveryExecutionDS';
import { pickedShipOrder } from '@/services/deliveryExecutionService';
import { Content, Header } from 'components/Page';

import issueIcon from 'hlos-front/lib/assets/icons/issue.svg';
import { InfiniteList } from '../component';
import styles from '../index.module.less';

const { Option } = SelectBox;
const intlPrefix = 'lwms.deliveryExecution';
const commonPrefix = 'lwms.common';
const headerSearchDS = () => new DataSet(headerSearchDSConfig());

const DeliveryExecution = ({ dispatch, selectedIds, history }) => {
  const [count, setCount] = useState({
    RELEASED: 0,
    PICKED: 0,
  });
  const [onload, setOnLoad] = useState(false);
  const [checkAll, setCheckAll] = useState(false);
  // const [shipOrderNum, setShipOrderNum] = useState('');
  const [recList, setRecList] = useState({
    RELEASED: [],
    PICKED: [],
  });
  const [searchFlag, setSearchFlag] = useState({
    RELEASED: true,
    PICKED: true,
  });
  const [workObj, setWorker] = useState({});
  // const [shipOrderStatus, setShipOrderStatus] = useState('RELEASED'); // RELEASED - 待挑库 / PICKED 待发出
  const searchDS = useDataSet(headerSearchDS, DeliveryExecution);

  useEffect(() => {
    async function queryDefaultSetting() {
      const res = await userSetting({
        defaultFlag: 'Y',
      });
      if (getResponse(res) && res.content && res.content[0]) {
        const { workerId, workerCode, workerName } = res.content[0];
        if (workerId && workerName) {
          setWorker({
            workerId,
            workerCode,
            workerName,
          });
        }
        searchDS.current.set('organizationId', res.content[0].organizationId);
      }
    }
    const flag = sessionStorage.getItem('deliveryExecutionSubmit') || false;
    if (
      (location.pathname === '/lwms/delivery-execution/list' && flag) ||
      !sessionStorage.getItem('headResultList')
    ) {
      queryDefaultSetting().then(() => {
        handleSearch('other');
      });
    } else {
      setRecList(JSON.parse(JSON.stringify(sessionStorage.getItem('headResultList'))));
    }
    return () => {
      sessionStorage.removeItem('deliveryExecutionSubmit');
      sessionStorage.removeItem('headResultList');
    };
  }, [location.pathname]);

  const handleCheckAllChange = (v) => {
    let _selectedIds = [];
    if (v) {
      _selectedIds = recList[searchDS.current.get('shipOrderStatus')].map((i) => i.shipOrderId);
    }
    dispatch({
      type: 'deliveryExecution/updateState',
      payload: {
        selectedIds: _selectedIds,
      },
    });
  };

  const clearList = () => {
    setRecList({
      ...recList,
      [searchDS.current.get('shipOrderStatus')]: [],
    });
    setCount({
      ...count,
      [searchDS.current.get('shipOrderStatus')]: 0,
    });
  };

  const handleSearch = debounce(async (searchType) => {
    const { current } = searchDS;
    let payload = {};
    const { shipOrderNum, shipOrderStatus } = current.toJSONData();
    if (current) {
      payload = {
        page: -1,
        organizationId: current.get('organizationId'),
        shipOrderStatus,
        documentTypeId: current.get('documentTypeId') || '',
        customerId: current.get('customerId') || '',
        salesmanId: current.get('salesmanId') || '',
        warehouseId: current.get('warehouseId') || '',
      };
    }
    // if (searchType === 'other') {
    //   const { current } = searchDS;
    //   if (current) {
    //     payload = {
    //       ...payload,
    //       documentTypeId: current.get('documentTypeId') || '',
    //       customerId: current.get('customerId') || '',
    //       salesmanId: current.get('salesmanId') || '',
    //       warehouseId: current.get('warehouseId') || '',
    //     };
    //   }
    // }
    if (shipOrderNum) {
      // if (!shipOrderNum) {
      //   notification.warning({
      //     message: intl.get(`${intlPrefix}.view.message.input.number`).d('请输入单号'),
      //   });
      //   return;
      // }
      payload = {
        ...payload,
        shipOrderNum,
      };
    }
    setOnLoad(true);
    const list = await dispatch({
      type: 'deliveryExecution/fetchLines',
      payload,
    });
    if (Array.isArray(list?.content)) {
      // 切换页签是否查询标示
      setSearchFlag({
        ...searchFlag,
        [shipOrderStatus]: false,
      });
      if (searchType === 'mo') {
        if (list.content.length === 0) {
          notification.warning({
            message: intl
              .get(`${intlPrefix}.view.message.no.shipOrder.found`)
              .d('该发货单号不存在'),
          });
          setOnLoad(false);
          clearList();
          return;
        }
        if (shipOrderStatus === 'PICKED') {
          const { shipOrderId } = list.content?.[0] || {};
          if (
            list.content.length === 1 &&
            recList[shipOrderStatus].find((i) => i.shipOrderId === shipOrderId)
          ) {
            notification.warning({
              message: intl.get(`${intlPrefix}.view.message.number.has.scanned`).d('单据已扫描'),
            });
            setOnLoad(false);
            return;
          }
          await dispatch({
            type: 'deliveryExecution/updateState',
            payload: {
              selectedIds: [...selectedIds],
            },
          });
          setRecList({
            ...recList,
            [shipOrderStatus]: [...recList[shipOrderStatus], list.content?.[0]],
          });
        }
        setRecList({
          ...recList,
          [shipOrderStatus]: list.content,
        });
      } else {
        setRecList({
          ...recList,
          [shipOrderStatus]: list?.content,
        });
        setCount({
          ...count,
          [shipOrderStatus]: list.content?.length,
        });
      }
    } else {
      clearList();
    }
    setOnLoad(false);
  }, 300);

  const handleSubmit = async () => {
    if (selectedIds.length === 0) {
      notification.warning({
        message: intl
          .get(`${intlPrefix}.view.message.select.delivery.ticket`)
          .d('请选中要发出的发货单'),
      });
      return;
    }
    const arr = [];
    let params = {};
    if (!isEmpty(workObj)) {
      params = {
        executedWorkerId: workObj.workerId,
        executedWorker: workObj.workerName,
      };
    }
    recList[searchDS.current.get('shipOrderStatus')].forEach((i) => {
      if (selectedIds.filter((el) => el === i.shipOrderId).length) {
        arr.push({
          ...params,
          shipOrderId: i.shipOrderId,
          shipOrderNum: i.shipOrderNum,
          executedTime: moment(new Date()).format(DEFAULT_DATETIME_FORMAT),
        });
      }
    });

    const res = await pickedShipOrder(arr);
    if (getResponse(res) && !res.failed) {
      notification.success();
      handleSearch('other');
    }
  };

  function handleChange(value, type) {
    if (type === 'shipOrderStatus') {
      searchDS.current.set('shipOrderStatus', value);
      if (searchFlag[searchDS.current.get('shipOrderStatus')]) {
        clearList();
        handleSearch('other');
      } else {
        setRecList({
          ...recList,
        });
      }
    } else if (type === 'shipOrderNum') {
      searchDS.current.set('shipOrderNum', value);
      clearList();
      handleSearch('other');
    }
    // handleSearch('other');
  }

  function handleQueryChange() {
    setSearchFlag({
      ...searchFlag,
      RELEASED: true,
      PICKED: true,
    });
  }

  return (
    <div className={styles['delivery-execution']}>
      <Header>
        <SelectBox
          dataSet={searchDS}
          mode="button"
          name="shipOrderStatus"
          onChange={(v) => handleChange(v, 'shipOrderStatus')}
        >
          <Option value="RELEASED">待挑库</Option>
          <Option value="PICKED">待发出</Option>
        </SelectBox>
        <div className={styles['search-conditions']}>
          <Lov
            dataSet={searchDS}
            name="documentTypeObj"
            onChange={() => handleQueryChange()}
            placeholder={intl
              .get(`${intlPrefix}.view.message.select.record.type`)
              .d('请选择单据类型')}
          />
          <Lov
            dataSet={searchDS}
            name="customerObj"
            onChange={() => handleQueryChange()}
            placeholder={intl.get(`${intlPrefix}.view.message.select.customer`).d('请选择客户')}
          />
          <Lov
            dataSet={searchDS}
            name="sellerObj"
            onChange={() => handleQueryChange()}
            placeholder={intl.get(`${intlPrefix}.view.message.select.seller`).d('请选择销售员')}
          />
          <Lov
            dataSet={searchDS}
            name="warehouseObj"
            onChange={() => handleQueryChange()}
            placeholder={intl.get(`${intlPrefix}.view.message.select.seller`).d('请选择发出仓库')}
          />
          <Button color="primary" onClick={() => handleSearch('other')}>
            {intl.get('hzero.common.button.search').d('查询')}
          </Button>
        </div>
      </Header>
      <div className={styles['result-count']}>
        {`${intl.get(`${intlPrefix}.find`).d('共搜索到')} ${
          count[searchDS.current.get('shipOrderStatus')]
        } ${intl.get(`${intlPrefix}.data`).d('条数据')}`}
      </div>
      <Content>
        <Spin spinning={onload}>
          <div className={styles['search-part']}>
            <div>
              <TextField
                dataSet={searchDS}
                name="shipOrderNum"
                onChange={(v) => handleChange(v, 'shipOrderNum')}
                style={{ marginRight: '16px' }}
                placeholder={intl.get(`${intlPrefix}.view.message.input.po`).d('请输入发货单号')}
              />
              <Button color="primary" onClick={() => handleSearch('mo')}>
                {intl.get(`${intlPrefix}.button.search`).d('查询')}
              </Button>
            </div>
            {searchDS.current.get('shipOrderStatus') === 'PICKED' && (
              <div>
                <CheckBox
                  id="deliveryExecutionCheckAll"
                  checked={checkAll}
                  onClick={() => setCheckAll(!checkAll)}
                  onChange={handleCheckAllChange}
                />
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control,jsx-a11y/label-has-for */}
                <label
                  htmlFor="deliveryExecutionCheckAll"
                  style={{ marginLeft: '6px', marginRight: '21px' }}
                >
                  全选
                </label>
                <Button color="primary" onClick={handleSubmit}>
                  <img src={issueIcon} alt="" style={{ paddingRight: '10px' }} />
                  {intl.get(`${intlPrefix}.button.delivery`).d('一键发出')}
                </Button>
              </div>
            )}
          </div>
          <InfiniteList
            recList={recList[searchDS.current.get('shipOrderStatus')]}
            workerObj={workObj}
            onSearch={handleSearch}
            history={history}
          />
        </Spin>
      </Content>
    </div>
  );
};

export default connect(({ deliveryExecution: { selectedIds } }) => ({ selectedIds }))(
  formatterCollections({
    code: [`${intlPrefix}`, `${commonPrefix}`],
  })(DeliveryExecution)
);
