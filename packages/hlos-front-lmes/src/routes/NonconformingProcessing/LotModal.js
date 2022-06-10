/**
 * @Description: 不合格品处理--批次Modal
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2021-01-22 10:28:08
 * @LastEditors: yu.na
 */

import React, { useState } from 'react';
import { connect } from 'dva';
import { NumberField, TextField, Button, Tooltip } from 'choerodon-ui/pro';
import Icons from 'components/Icons';
import intl from 'utils/intl';
import styles from './index.less';

const LotModal = ({
  inspectionDocId,
  arr,
  lotList,
  dispatch,
  onModalCancel,
  onModalOk,
  handlePicturesLotModal,
  data,
  lineList,
}) => {
  const [lotArr, setLotArr] = useState(lineList || lotList);

  const handleValueChange = (val, type, rec) => {
    const idx = lotArr.findIndex((i) => i.inspectionDocLotId === rec.inspectionDocLotId);
    const _list = [...lotArr];
    let params = { ...rec };
    if (type === 'processRemark') {
      params = {
        ...rec,
        processRemark: val,
        checked: true,
      };
    } else {
      const ngQty = rec.qcNgQty || 0;
      const sumQty =
        val +
        (rec.concessionQty || 0) +
        (rec.reworkQty || 0) +
        (rec.scrappedQty || 0) +
        (rec.returnedQty || 0);
      // const diffQty =
      //   ngQty -
      //   val -
      //   (rec.concessionQty || 0) -
      //   (rec.reworkQty || 0) -
      //   (rec.scrappedQty || 0) -
      //   (rec.returnedQty || 0);
      params = {
        ...rec,
        [type]: sumQty > ngQty ? 0 : val,
        checked: true,
      };
      if(type === 'concessionQty' && params.concessionQty > 0) {
        params = {
          ...params,
          processResult: 'CONCESSION',
        };
      }
    }
    // const nullList = [];
    // arr.forEach((i) => {
    //   if (!rec[i.key] && i.key !== type) {
    //     nullList.push(i.key);
    //   }
    // });
    // if (nullList.length === 1) {
    //   params = {
    //     ...params,
    //     [nullList[0]]: diffQty < 0 ? 0 : diffQty,
    //   };
    // }
    _list.splice(idx, 1, params);
    dispatch({
      type: 'nonconformingProcessing/updateState',
      payload: {
        lotList: _list,
      },
    });
    setLotArr(_list);
  };

  return (
    <div>
      <div className={styles['table-header']}>
        <div>批次/标签号</div>
        <div>不合格数量</div>
        <div>备注</div>
      </div>
      <div className={styles['table-body']}>
        {lotArr.map((el) => {
          return (
            <div className={styles['table-line']} key={el.inspectionDocLotId}>
              <div>
                <Tooltip title={el.tagCode || el.lotNumber}>{el.tagCode || el.lotNumber}</Tooltip>
              </div>
              <div>
                <div className={styles.num}>
                  <span>{el.qcNgQty}</span>/{el.batchQty}
                </div>
                {arr.map((i) => {
                  return (
                    <div key={i.key}>
                      <div className={styles['input-title']}>
                        <span className={styles.circle} style={{ backgroundColor: i.color }} />{' '}
                        {i.title}
                      </div>
                      <NumberField
                        min={0}
                        // step={1}
                        value={el[i.key]}
                        style={{ border: `1px solid ${i.color}`, borderRadius: '4px' }}
                        // placeholder={i.title}
                        className={styles.block}
                        onChange={(val) => handleValueChange(val, i.key, el)}
                      />
                    </div>
                  );
                })}
                {/* {arr.map((i) => {
                  return (
                    <div key={i.key}>
                      <NumberField
                        style={{ border: `1px solid ${i.color}`, borderRadius: '4px' }}
                        min={0}
                        step={1}
                        value={el[i.key]}
                        placeholder={i.title}
                        onChange={(val) => handleValueChange(val, i.key, el)}
                      />
                    </div>
                  );
                })} */}
              </div>
              <div className={styles.remark}>
                <div>备注</div>
                <TextField
                  value={el.processRemark}
                  onChange={(val) => handleValueChange(val, 'processRemark', el)}
                />
              </div>
              <div className={styles.Detailupload} onClick={() => handlePicturesLotModal(data, el)}>
                <Icons type="ziyuan60" size="20" />
                <span>上传图片</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className={styles['table-footer']}>
        <Button onClick={onModalCancel}>{intl.get('hzero.common.button.cancel').d('取消')}</Button>
        <Button color="primary" onClick={() => onModalOk(inspectionDocId, lotArr)}>
          {intl.get('lwms.common.button.sure').d('确认')}
        </Button>
      </div>
    </div>
  );
};

export default connect(({ nonconformingProcessing }) => ({
  inspectDocList: nonconformingProcessing?.inspectDocList || [],
  lotList: nonconformingProcessing?.lotList || [],
}))(LotModal);
