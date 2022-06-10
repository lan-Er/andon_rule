/*
 * @Description: 设备履历行
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-07-20 14:09:18
 */
import React from 'react';
import arrowIcon from 'hlos-front/lib/assets/icons/arrow.svg';
import endIcon from 'hlos-front/lib/assets/icons/end.svg';
import registerIcon from 'hlos-front/lib/assets/icons/register.svg';
import styles from './index.less';

export default function ResumeLine({ item, index, length, showDetailModal }) {
  let showIcon = endIcon;
  if (index === length - 1) {
    showIcon = registerIcon;
  }
  return (
    <div className={styles['resume-item']}>
      <div className={styles['resume-item-left']}>
        <span className={`${styles['circle-text']} ${styles[item.trackType.toLocaleLowerCase()]}`}>
          {item.trackTypeMeaning.substr(0, 1)}
        </span>
        <div className={styles.date}>
          <p>{item._date}</p>
          <p className={styles.time}>{item._dateTime}</p>
        </div>
      </div>
      <div className={styles['resume-item-right']}>
        {index === 0 || index === length - 1 ? (
          <img className={styles.end} src={showIcon} alt="" />
        ) : (
          <div className={styles['block-icon']} />
        )}
        <div className={styles['line-info']}>
          <div className={styles['ds-ai-center']}>
            <span
              className={
                index === 0 || index === length - 1 ? styles['strong-title'] : styles.title
              }
            >
              {`${item.trackTypeMeaning}：`}
            </span>
            <span className={styles.value}>
              {`${item.prodLineName || ''} ` +
                `${item.equipmentName || ''} ` +
                `${item.workcellName || ''} ` +
                `${item.locationName || ''} ` +
                `${item.outsideLocation || ''} `}
              {item.toProdLineName ? `至${item.toProdLineName} ` : ''}
              {item.toEquipmentName ? `至${item.toEquipmentName} ` : ''}
              {item.toWorkcellName ? `至${item.toWorkcellName} ` : ''}
              {item.toLocationName ? `至${item.toLocationName} ` : ''}
              {item.toOutsideLocation ? `至${item.toOutsideLocation} ` : ''}
            </span>
            <span className={styles.detail} onClick={() => showDetailModal(item)}>
              详情
              <img src={arrowIcon} alt="" />
            </span>
          </div>
          <div className={styles.worker}>
            <span>负责人：{`${item.workerName}（工号: ${item.worker}）`}</span>
          </div>
        </div>
        {/* <Row>
          <Col span={8}>
            <span className="title">{item.attribute3}</span>
            <span className="detail" onClick={() => showDetailModal(item)}>
              详情
              <img src={arrowIcon} alt="" />
            </span>
          </Col>
          <Col span={16}>
            <span>
              负责人：{`${item.workerName}（工号: ${item.worker}）`}
            </span>
          </Col>
        </Row> */}
      </div>
    </div>
  );
}
