import { Carousel } from 'choerodon-ui';
import React, { useRef, useEffect, useState } from 'react';

import style from '../index.module.less';

export default function MyImgLoading({ src, alt }) {
  const myImgContent = useRef('null');
  const [imgList, setImgList] = useState([]);
  useEffect(() => {
    if (myImgContent && src) {
      const isHaveOwnMoreImg = src.includes('|');
      const imageArr = isHaveOwnMoreImg ? src.split('|') : [src];
      setImgList(imageArr);
    }
  }, [src, myImgContent]);

  return (
    <div className={style['my-img-loading']}>
      <Carousel autoplay>
        {imgList &&
          imgList.map((item, index) => {
            return (
              <div key={index.toString()} className={style['my-img-loading-list']}>
                <img src={item} alt={alt} />
              </div>
            );
          })}
      </Carousel>
    </div>
  );
}
