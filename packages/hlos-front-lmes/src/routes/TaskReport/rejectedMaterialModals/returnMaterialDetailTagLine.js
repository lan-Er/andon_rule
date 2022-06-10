/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: mingbo.zhang@hand-china.com
 * @Date: 2021-03-09 17:07:43
 * @LastEditors: mingbo.zhang@hand-china.com
 * @LastEditTime: 2021-03-09 19:43:51
 */
import React, { useState, useEffect } from 'react';
import notification from 'utils/notification';
import { TextField, NumberField } from 'choerodon-ui/pro';
import { Row, Col } from 'choerodon-ui';
import LotIcon from 'hlos-front/lib/assets/icons/lot-icon.svg';
import ShouqiIcon from 'hlos-front/lib/assets/icons/triangle2.svg';
import zhankaiIcon from 'hlos-front/lib/assets/icons/triangle1.svg';
import Icons from 'components/Icons';
import styles from '../style.less';

const ReturnMaterialDetailTagLine = (props) => {
  const { detailObj, keyList, lotNumberIndex, changeFlag } = props;
  const [openTagFlag, setOpenTagFlag] = useState(false);
  const [addFlag, setAddFlag] = useState(false);
  const [addTagObj, setAddTagObj] = useState({
    tagCode: null,
    lotNumber: null,
    returnedOkQty: 0,
    addFlag: true,
  });
  const [lotNumberExecuteQty, setLotNumberExecuteQty] = useState(0);
  const [tagList, setTagList] = useState([]);
  const [lotNumber, setLotNumber] = useState(null);
  const [lineTotalNumber, setLineTotalNumber] = useState(0);
  useEffect(() => {
    keyList.map((ele) => {
      if (ele === 'lotNumberExecuteQty') {
        return setLotNumberExecuteQty(detailObj[ele]);
      } else {
        setLotNumber(ele);
        const newList = detailObj[ele].map((el) => ({
          ...el,
          returnedOkQty: el.returnedOkQty || 0,
        }));
        const putLineTotalNumber = newList.reduce((total, el) => {
          return total + el.returnedOkQty;
        }, 0);
        setLineTotalNumber(putLineTotalNumber);
        return setTagList(newList);
      }
    });
  }, [changeFlag]);
  function openTagDetail() {
    setOpenTagFlag(!openTagFlag);
  }
  function handleChangeQuantity(index, value) {
    props.onChangeQuantity(index, value, lotNumberIndex, lotNumber);
  }
  function handleAddTag() {
    setOpenTagFlag(true);
    setAddFlag(true);
  }
  function addTag(value) {
    const newObj = {
      ...addTagObj,
      lotNumber: lotNumber || null,
      tagCode: value,
      addFlag: true,
    };
    setAddTagObj(newObj);
  }
  function changeAddQty(value) {
    const newObj = {
      ...addTagObj,
      returnedOkQty: value,
    };
    setAddTagObj(newObj);
  }
  function saveAddTag() {
    if (!addTagObj.tagCode || !addTagObj.returnedOkQty) {
      notification.warning({
        message: '请输入新增标签号或数量',
      });
      return;
    }
    props.onAddTag(addTagObj, lotNumberIndex, lotNumber);
    setAddFlag(false);
    setAddTagObj({});
  }
  function cancelAddTag() {
    setAddFlag(false);
  }
  function handleDelLine(lineIndex) {
    props.onDelTag(lineIndex, lotNumberIndex, lotNumber);
  }
  return (
    <div
      className={`${styles['return-material-detail-line-box']} ${openTagFlag ? styles['return-material-detail-tag-box'] : ''
        }`}
    >
      <Row className={styles['return-material-detail-line']}>
        <Col
          span={1}
          className={`${styles['return-material-line-col']} ${styles['tag-show-icon']}`}
        >
          <div className={styles['return-material-icon']} onClick={openTagDetail}>
            <img src={openTagFlag ? zhankaiIcon : ShouqiIcon} alt="" />
          </div>
        </Col>
        <Col span={9} className={styles['return-material-line-col']}>
          <div>
            <img src={LotIcon} alt="" /> {lotNumber || '无批次标签'}
          </div>
        </Col>
        <Col span={10} className={styles['return-material-line-col']} />
        <Col span={4} className={styles['return-material-line-col']}>
          <span style={{ color: '#1C879C' }}>
            {lineTotalNumber}/{lotNumberExecuteQty}
          </span>
          <span
            style={{ color: '#1C879C', cursor: 'pointer', fontSize: '30px', marginLeft: '15px' }}
            onClick={handleAddTag}
          >
            +
          </span>
        </Col>
        {/* <Col span={1} className="return-material-line-col">

        </Col> */}
      </Row>
      {addFlag && (
        <Row className={styles['tag-line-row']}>
          <Col span={1} />
          <Col span={12} className={styles['material-tag-line']}>
            <TextField
              value={addTagObj?.tagCode}
              className={styles['add-tag-code-text']}
              placeholder="请输入标签号"
              onChange={addTag}
            />
            <span className={styles['span-button']} onClick={cancelAddTag}>
              取消
            </span>
            <span
              className={`${styles['span-button']} ${styles['save-button']}`}
              onClick={saveAddTag}
            >
              保存
            </span>
          </Col>
          <Col
            span={11}
            className={`${styles['material-tag-line']} ${styles['material-tag-number-line']}`}
          >
            <div className={styles['common-input']}>
              <NumberField
                step={props.step || 1}
                min={props.min || 0}
                max={addTagObj.executeQty || null}
                value={addTagObj.returnedOkQty || 0}
                onChange={changeAddQty}
              />
              {/* <span className={`${styles.sign} ${styles.left}`}>-</span>
              <span className={`${styles.sign} ${styles.right}`}>+</span> */}
            </div>
          </Col>
        </Row>
      )}
      {openTagFlag &&
        tagList &&
        tagList.length &&
        tagList.map((ele, index) => (
          <Row className={styles['tag-line-row']}>
            <Col span={1} />
            <Col span={12} className={styles['material-tag-line']}>
              {ele.tagCode}
            </Col>
            <Col
              span={11}
              className={`${styles['material-tag-line']} ${styles['material-tag-number-line']}`}
            >
              <div className={styles['common-input']}>
                <NumberField
                  // step={props.step || 1}
                  min={ele.min || 0}
                  max={ele.executeQty || null}
                  value={ele.returnedOkQty || 0}
                  onChange={(value) => handleChangeQuantity(index, value)}
                // disabled
                />
                {/* <span className={`${styles.sign} ${styles.left}`}>-</span>
                <span className={`${styles.sign} ${styles.right}`}>+</span> */}
              </div>
              {ele.addFlag && (
                <Icons
                  type="delete"
                  size="24"
                  color="#505050"
                  style={{marginLeft: 8, cursor: 'point'}}
                  onClick={() => handleDelLine(index)}
                />
              )}
            </Col>
          </Row>
        ))}
    </div>
  );
};

export default ReturnMaterialDetailTagLine;
