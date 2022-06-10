/**
 * @Description: 单件流报工--MainRight-绑定序列号
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2021-01-12 11:34:08
 * @LastEditors: yu.na
 */

import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import pinIcon from 'hlos-front/lib/assets/icons/pin.svg';
import styles from './index.less';

export default ({ bindObj }) => {
  const [dataUrl, setUrl] = useState(null);
  useEffect(() => {
    async function getQrCodeUrl() {
      const url = await QRCode.toDataURL(`
        产品号ProductCode：${bindObj.productCode}
        序列号SN Number：${bindObj.snCode}
      `);
      setUrl(url);
    }
    getQrCodeUrl();
  }, [bindObj]);

  return (
    <div className={styles.bind}>
      <div>{bindObj.snCode}</div>
      <div className={styles.pin}>
        <img src={pinIcon} alt="" />
      </div>
      <div>{bindObj.productCode}</div>
      <div className={styles.qr}>
        <img src={dataUrl} alt="" />
      </div>
      <div className={styles.notification}>绑定成功</div>
    </div>
  );
};
