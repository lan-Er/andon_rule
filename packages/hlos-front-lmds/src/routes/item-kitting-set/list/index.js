/**
 * @Description: 齐套配置--list
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2021-03-11 10:13:09
 * @LastEditors: yu.na
 */

import React, { Fragment, useCallback, useEffect } from 'react';
import { Button, Table, DataSet } from 'choerodon-ui/pro';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import { queryLovData } from 'hlos-front/lib/services/api';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import codeConfig from '@/common/codeConfig';
import ListDS from '../stores/ListDS';
import styles from './index.less';

const { common } = codeConfig.code;
const preCode = 'lmds.itemKittingSet';
const ListFactory = () => new DataSet(ListDS());

const KittingSet = ({ history }) => {
  const listDS = useDataSet(ListFactory, KittingSet);

  useEffect(() => {
    async function queryDefaultOrg() {
      const res = await queryLovData({ lovCode: common.organization, defaultFlag: 'Y' });
      if (res && res.content && res.content[0]) {
        listDS.queryDataSet.current.set('organizationObj', res.content[0]);
        await listDS.query();
      }
    }
    queryDefaultOrg();
  }, []);

  const columns = useCallback(() => {
    return [
      { name: 'organizationName', width: 128, lock: true },
      { name: 'kittingReviewTypeMeaning', width: 100, lock: true },
      { name: 'kittingSetCode', width: 128, lock: true, renderer: linkRender },
      { name: 'description', width: 150 },
      { name: 'kittingReviewRuleMeaning', width: 100 },
      { name: 'itemCode', width: 200 },
      { name: 'categoryName', width: 150 },
      { name: 'partyName', width: 200 },
      { name: 'ruleName', width: 128 },
      { name: 'primaryFlag', width: 82, renderer: yesOrNoRender },
      { name: 'enabledFlag', width: 82, renderer: yesOrNoRender },
    ];
  }, []);

  const lineColumns = useCallback(() => {
    return [
      { name: 'setLineNum', width: 70, lock: true },
      { name: 'setLineTypeMeaning', width: 100, lock: true },
      { name: 'reviewItemType', width: 100 },
      { name: 'reviewItemCode', width: 200 },
      { name: 'categoryName', width: 150 },
      { name: 'enabledFlag', width: 82, renderer: yesOrNoRender },
    ];
  }, []);

  const detailLineColumns = useCallback(() => {
    return [
      { name: 'supplyLineNum', width: 70, lock: true },
      { name: 'kittingSupplyTypeMeaning', width: 100, lock: true },
      // { name: 'kittingTypeMeaning', width: 100 },
      { name: 'organizationName', width: 128 },
      { name: 'warehouseName', width: 128 },
      // { name: 'wmAreaName', width: 128 },
      { name: 'documentTypeName', width: 128 },
      { name: 'priority', width: 84 },
      { name: 'enabledFlag', width: 82, renderer: yesOrNoRender },
    ];
  }, []);

  function linkRender({ value, record }) {
    const pathname = `/lmds/kitting-set/detail/${record.data.kittingSetId}`;
    return <a onClick={() => handleToDetailPage(pathname)}>{value}</a>;
  }

  function handleToDetailPage(pathname) {
    history.push(pathname);
  }

  /**
   *通过点击来查行,并且在此设置行颜色。
   * @param {*} { record }
   * @returns
   */
  function handleLineRowClick({ record }) {
    return {
      onClick: () => {
        listDS.children.lineDTOList.children.detailDTOList.queryParameter = {
          kittingSetId: record.data.kittingSetId,
        };
      },
    };
  }

  return (
    <Fragment>
      <Header title={intl.get(`${preCode}.view.title.list`).d('齐套配置')}>
        <Button
          icon="add"
          color="primary"
          onClick={() => handleToDetailPage('/lmds/kitting-set/create')}
        >
          {intl.get('hzero.common.button.create').d('新建')}
        </Button>
      </Header>
      <Content className={styles['lmds-kitting-set-content']}>
        <Table dataSet={listDS} columns={columns()} queryFieldsLimit={2} />
        <div className={styles['lmds-kitting-set-line-table']}>
          <Table
            dataSet={listDS.children.lineDTOList}
            columns={lineColumns()}
            onRow={handleLineRowClick}
          />
          <Table
            dataSet={listDS.children.lineDTOList.children.detailDTOList}
            columns={detailLineColumns()}
          />
        </div>
      </Content>
    </Fragment>
  );
};

export default KittingSet;
