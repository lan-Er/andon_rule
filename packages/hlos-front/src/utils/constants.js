/**
 * Constants 常量
 * @date: 2019-11-15
 * @author: jianjun.tan <jianjun.tan@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */

/* 类别集段数, 最小值 */
const SEGMENT_NUMBER_MIN = 1;

/* 类别集段数, 最大值 */
const SEGMENT_NUMBER_MAX = 10;

/* CODE字段长度, 最大值 */
const CODE_MAX_LENGTH = 30;

/* 当前日期 */
const NOW_DATE = new Date();
/* 当前日期起始结束 */

const NOW_DATE_START = new Date(new Date(new Date().toLocaleDateString()).getTime());
const NOW_DATE_END = new Date(
  new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1
);

export {
  SEGMENT_NUMBER_MIN,
  SEGMENT_NUMBER_MAX,
  CODE_MAX_LENGTH,
  NOW_DATE,
  NOW_DATE_START,
  NOW_DATE_END,
};
