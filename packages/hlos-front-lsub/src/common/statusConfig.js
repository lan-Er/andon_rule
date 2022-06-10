/**
 * 前端全局变量配置
 * @since: 2020-07-03 16:57:52
 * @author: wei.zhou05@hand-china.com
 */

const statusValue = {
  lsub: {
    dataStatus: {
      // 数据当前状态
      suspend: 'SUSPEND', // 暂挂
      followUp: 'FOLLOW_UP', // 跟进
      send: 'SEND', // 发送
    },
  },
};

export default {
  // 快码状态值配置
  statusValue,
};
