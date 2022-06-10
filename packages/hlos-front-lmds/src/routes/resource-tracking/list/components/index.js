/*
 * @Author: chunyan.liang <chunyan.liang@hand-china.com>
 * @Date: 2020-09-07 09:53:06
 * @LastEditTime: 2020-09-07 09:54:57
 * @Description:
 */
import React, { useState } from 'react';
import { Pagination } from 'choerodon-ui/pro';

const ImagePreviewModalContent = ({ imgList }) => {
  const [curPageImages, setCurImages] = useState(imgList);
  const [page, setPage] = useState(1);

  function handlePageChange(curPage) {
    setPage(curPage);
    setCurImages(imgList.slice((curPage - 1) * 6));
  }

  return (
    <React.Fragment>
      <div className="imagePreview">
        {curPageImages.map((url) => (
          <img src={url} alt="img here" />
        ))}
      </div>
      <Pagination
        showPager
        sizeChangerPosition="right"
        total={imgList.length}
        pageSize={6}
        pageSizeOptions={['6']}
        hideOnSinglePage
        page={page}
        onChange={handlePageChange}
      />
    </React.Fragment>
  );
};

export default ImagePreviewModalContent;
