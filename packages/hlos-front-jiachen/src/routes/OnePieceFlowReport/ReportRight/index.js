import React from 'react';
import styles from './index.less';

import leftImg from '../../../assets/img/arrow-left-white-click.png';
import rightImg from '../../../assets/img/arrow-right-white-click.png';
import leftImgDis from '../../../assets/img/arrow-left-white.png';
import rightImgDis from '../../../assets/img/arrow-right-white.png';

export default ({
  technologyFiles,
  currentFile,
  currentIndex,
  handleChangeFilePrevious,
  handleChangeFileNext,
  pdfRef,
}) => {
  return (
    <div className={styles['jiachen-opfr-report-right']}>
      {currentFile ? (
        <div>
          {technologyFiles.length > 1 && (
            <div className={styles.left} onClick={handleChangeFilePrevious}>
              <img
                src={!technologyFiles.length || currentIndex === 0 ? leftImgDis : leftImg}
                alt="上一个"
              />
            </div>
          )}
          {technologyFiles.length > 1 && (
            <div className={styles.right} onClick={handleChangeFileNext}>
              <img
                src={
                  !technologyFiles.length || currentIndex === technologyFiles.length - 1
                    ? rightImgDis
                    : rightImg
                }
                alt="下一个"
              />
            </div>
          )}
          {currentFile.fileType && currentFile.fileType === 'pdf' ? (
            <embed
              ref={pdfRef}
              className={styles.embed}
              // key={currentFile.fileId}
              src={currentFile.fileUrl}
              type="application/pdf"
              width="100%"
            />
          ) : (
            <img src={currentFile.fileUrl} alt="" style={{ height: 'calc(100vh - 160px)' }} />
          )}
        </div>
      ) : (
        <div />
      )}
    </div>
  );
};
