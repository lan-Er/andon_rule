import React, { useState, useEffect } from 'react';
import { Button } from 'choerodon-ui/pro';
import { queryLovData } from 'hlos-front/lib/services/api';
import sourceImg from 'hlos-front/lib/assets/icons/source-star.svg';
import source1Img from 'hlos-front/lib/assets/icons/source4.svg';
import source2Img from 'hlos-front/lib/assets/icons/source.svg';
import styles from './index.less';

export default ({ onModalCancel, onModalOk }) => {
  const [typeList, setTypeList] = useState([]);
  const [returnTypeObj, setReturnTypeObj] = useState({});

  useEffect(() => {
    async function queryType() {
      const typeRes = await queryLovData({
        lovCode: 'LMDS.DOCUMENT_TYPE',
        documentClass: 'SHIP_RETURN',
      });
      if (typeRes && typeRes.content) {
        setReturnTypeObj(typeRes.content.find((i) => i.documentTypeCode === 'SO_RETURN'));
        typeRes.content.map((i) => {
          const _i = i;
          if (_i.documentTypeCode === 'SO_RETURN') {
            _i.active = true;
          }
          return _i;
        });
        setTypeList(typeRes.content);
      }
    }
    queryType();
  }, []);

  const imgRender = (index) => {
    const imgArr = [sourceImg, source1Img, source2Img];
    return imgArr[index];
  };

  const handleItemClick = (rec) => {
    setReturnTypeObj(rec);
    let _typeList = typeList.slice();
    _typeList = _typeList.map((item) => {
      if (item.documentTypeId === rec.documentTypeId) {
        return { ...item, active: true };
      }
      return { ...item, active: false };
    });
    setTypeList(_typeList);
  };

  return (
    <>
      <div className={styles.main}>
        {typeList.map((i, index) => {
          return (
            <div
              key={i.documentTypeId}
              className={i.active ? styles.active : null}
              onClick={() => handleItemClick(i)}
            >
              <img src={imgRender(index)} alt="" />
              <div>
                <p>{i.documentTypeName}</p>
                <p>{i.description}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className={styles['modal-footer']}>
        <Button onClick={onModalCancel}>取消</Button>
        <Button
          color="primary"
          className={styles['confirm-button']}
          onClick={(e) => onModalOk(e, returnTypeObj)}
        >
          确认
        </Button>
      </div>
    </>
  );
};
