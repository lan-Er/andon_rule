/*
 * @module: 创建Ds以及清除Ds副作用
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2021-06-07 17:41:02
 * @LastEditTime: 2021-06-23 14:15:46
 * @copyright: Copyright (c) 2020,Hand
 */
import { useMemo, useEffect } from 'react';
import { DataSet } from 'choerodon-ui/pro';

export type DataSetFactory = () => DataSet;

class TimedMap extends Map {
  // todo 时间缓存
}

const DataSetStoreGrwl: any = new TimedMap();

export const useDataSet = (dataSetFactory: DataSetFactory, cacheKey: any = false): DataSet => {
  const ds = useMemo<DataSet>(() => {
    if (cacheKey) {
      let cacheDS = DataSetStoreGrwl.get(cacheKey);
      if (!cacheDS) {
        cacheDS = dataSetFactory();
        DataSetStoreGrwl.set(cacheKey, cacheDS);
      }
      return cacheDS;
    }
    return dataSetFactory();
  }, []);
  return ds;
};

export const useClearDataSet = (cacheKey: any = false): void => {
  if (DataSetStoreGrwl.has(cacheKey)) {
    DataSetStoreGrwl.delete(cacheKey);
  }
};

export const useDataSetEvent = (
  ds: DataSet,
  eventName: string,
  // CallableFunction is define in lib.es5.d.ts
  // eslint-disable-next-line no-undef
  eventListener: CallableFunction
) => {
  useEffect(() => {
    ds.addEventListener(eventName, eventListener);
    return () => {
      ds.removeEventListener(eventName, eventListener);
    };
  }, []);
};
