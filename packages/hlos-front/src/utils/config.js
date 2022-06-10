/* eslint-disable no-shadow,camelcase,import/no-mutable-exports,no-console */
// TODO: 自动生成的 src/utils/config 禁用了部分 eslint, 请查看 scripts/genConfig.js
/**
 * 不要直接修改这个文件, 请修改 config/apiConfig 文件
 * Config - 全局统一配置
 * @date: 2020-1-14
 * @author: hzero <hzero@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

// #region initConfig HLOS
let HLOS_LMDS = '/lmds';
let HLOS_LAPS = '/laps';
let HLOS_LMES = '/lmes';
let HLOS_LSCM = '/lscm';
let HLOS_LSOP = '/lsop';
let HLOS_LWMS = '/lwms';
let HLOS_LDAB = '/ldab';
let HLOS_LISP = '/lisp';
let HLOS_LSUB = '/lsub';
let HLOS_LWHS = '/lwhs';
let HLOS_LETL = '/letl';
let HLOS_LDTF = '/ldtf';
let HLOS_LCSV = '/lcsv';
let HLOS_LRPT = '/lrpt';
let HLOS_LTCC = '/ltcc';
let HLOS_LWMSS = '/lwmss';
let HLOS_LMDSS = '/lmdss';
let HLOS_LMESS = '/lmess';
// 协同服务
let HLOS_ZMDA = '/zmda';
let HLOS_ZCOM = '/zcom';
let HLOS_ZEXE = '/zexe';
let HLOS_ZPLAN = '/zplan';
let HLOS_ZMDC = '/zmdc';

// #endregion

let LMDS_LANGUAGE_URL = changeLMDS_LANGUAGE(HLOS_LMDS);

// #region changeConfig Funcs
function changeLMDS_LANGUAGE(HLOS_LMDS) {
  return `${HLOS_LMDS}/v1/multi-language`;
}

// 存储桶
const BUCKET_NAME_MDS = 'mds';
const BUCKET_NAME_APS = 'aps';
const BUCKET_NAME_MES = 'mes';
const BUCKET_NAME_SCM = 'scm';
const BUCKET_NAME_SOP = 'sop';
const BUCKET_NAME_WMS = 'wms';
const BUCKET_NAME_DAB = 'dab';
const BUCKET_NAME_SUB = 'sub';
const BUCKET_NAME_WHS = 'whs';
const BUCKET_NAME_CSV = 'csv';
// #endregion

// #region changeRoute
window.changeRoute = function changeRoute(key, value) {
  if (key && value) {
    switch (key) {
      case 'HLOS_LMDS':
        HLOS_LMDS = value;
        LMDS_LANGUAGE_URL = changeLMDS_LANGUAGE(HLOS_LMDS);
        break;
      case 'HLOS_LAPS':
        HLOS_LAPS = value;
        break;
      case 'HLOS_LMES':
        HLOS_LMES = value;
        break;
      case 'HLOS_LSCM':
        HLOS_LSCM = value;
        break;
      case 'HLOS_LSOP':
        HLOS_LSOP = value;
        break;
      case 'HLOS_LWMS':
        HLOS_LWMS = value;
        break;
      case 'HLOS_LDAB':
        HLOS_LDAB = value;
        break;
      case 'HLOS_LISP':
        HLOS_LISP = value;
        break;
      case 'HLOS_LSUB':
        HLOS_LSUB = value;
        break;
      case 'HLOS_LWHS':
        HLOS_LWHS = value;
        break;
      case 'HLOS_LRPT':
        HLOS_LRPT = value;
        break;
      case 'HLOS_LETL':
        HLOS_LETL = value;
        break;
      case 'HLOS_LDTF':
        HLOS_LDTF = value;
        break;
      case 'HLOS_LCSV':
        HLOS_LCSV = value;
        break;
      case 'HLOS_ZMDA':
        HLOS_ZMDA = value;
        break;
      case 'HLOS_ZCOM':
        HLOS_ZCOM = value;
        break;
      case 'HLOS_ZEXE':
        HLOS_ZEXE = value;
        break;
      case 'HLOS_LWMSS':
        HLOS_LWMSS = value;
        break;
      case 'HLOS_LMDSS':
        HLOS_LMDSS = value;
        break;
      case 'HLOS_LMESS':
        HLOS_LMESS = value;
        break;
      case 'HLOS_LTCC':
        HLOS_LTCC = value;
        break;
      case 'HLOS_ZPLAN':
        HLOS_ZPLAN = value;
        break;
      case 'HLOS_ZMDC':
        HLOS_ZMDC = value;
        break;
      default:
        console.error(`${key} is not exists`);
        helpMethod();
        break;
    }
  } else {
    helpMethod(key);
  }
};
// #endregion

// #region helpMethod
const helpMethodAssist = {
  HLOS_LMDS: { changeConfig: ['HLOS_LMDS'], depBy: [] },
  HLOS_LAPS: { changeConfig: ['HLOS_LAPS'], depBy: [] },
  HLOS_LMES: { changeConfig: ['HLOS_LMES'], depBy: [] },
  HLOS_LSCM: { changeConfig: ['HLOS_LSCM'], depBy: [] },
  HLOS_LSOP: { changeConfig: ['HLOS_LSOP'], depBy: [] },
  HLOS_LWMS: { changeConfig: ['HLOS_LWMS'], depBy: [] },
  HLOS_LDAB: { changeConfig: ['HLOS_LDAB'], depBy: [] },
  HLOS_LISP: { changeConfig: ['HLOS_LISP'], depBy: [] },
  HLOS_LSUB: { changeConfig: ['HLOS_LSUB'], depBy: [] },
  HLOS_LWHS: { changeConfig: ['HLOS_LWHS'], depBy: [] },
  HLOS_LRPT: { changeConfig: ['HLOS_LRPT'], depBy: [] },
  HLOS_LETL: { changeConfig: ['HLOS_LETL'], depBy: [] },
  HLOS_LDTF: { changeConfig: ['HLOS_LDTF'], depBy: [] },
  HLOS_LCSV: { changeConfig: ['HLOS_LCSV'], depBy: [] },
  HLOS_ZMDA: { changeConfig: ['HLOS_ZMDA'], depBy: [] },
  HLOS_ZCOM: { changeConfig: ['HLOS_ZCOM'], depBy: [] },
  HLOS_ZEXE: { changeConfig: ['HLOS_ZEXE'], depBy: [] },
  HLOS_LWMSS: { changeConfig: ['HLOS_LWMSS'], depBy: [] },
  HLOS_LMDSS: { changeConfig: ['HLOS_LMDSS'], depBy: [] },
  HLOS_LMESS: { changeConfig: ['HLOS_LMESS'], depBy: [] },
  HLOS_LTCC: { changeConfig: ['HLOS_LTCC'], depBy: [] },
  HLOS_ZPLAN: { changeConfig: ['HLOS_ZPLAN'], depBy: [] },
  HLOS_ZMDC: { changeConfig: ['HLOS_ZMDC'], depBy: [] },
};
function helpMethod(key) {
  if (key && helpMethodAssist[key]) {
    console.error(
      `${key} 会更改: [${helpMethodAssist[key].changeConfig.join(
        ', '
      )}], 被级连更改: [${helpMethodAssist[key].depBy.join(', ')}]`
    );
  } else {
    console.error('使用 changeRoute() 查看可以更改的参数');
    console.error('使用 changeRoute("参数") 查看具体改变');
    console.error('使用 changeRoute("参数", "参数值") 更改参数');
    console.error(`可以更改的配置: [${Object.keys(helpMethodAssist).join(', ')}]`);
  }
}
// #endregion

// #regioin exportsConfig
export {
  HLOS_LMDS,
  HLOS_LAPS,
  HLOS_LMES,
  HLOS_LSCM,
  HLOS_LSOP,
  HLOS_LWMS,
  HLOS_LDAB,
  HLOS_LISP,
  HLOS_LSUB,
  HLOS_LWHS,
  HLOS_LRPT,
  HLOS_LETL,
  HLOS_LDTF,
  HLOS_LCSV,
  HLOS_ZMDA,
  HLOS_ZCOM,
  HLOS_ZEXE,
  HLOS_LTCC,
  HLOS_LWMSS,
  HLOS_LMDSS,
  HLOS_LMESS,
  HLOS_ZPLAN,
  HLOS_ZMDC,
  LMDS_LANGUAGE_URL,
  BUCKET_NAME_MDS,
  BUCKET_NAME_APS,
  BUCKET_NAME_MES,
  BUCKET_NAME_SCM,
  BUCKET_NAME_SOP,
  BUCKET_NAME_WMS,
  BUCKET_NAME_DAB,
  BUCKET_NAME_SUB,
  BUCKET_NAME_WHS,
  BUCKET_NAME_CSV,
};
// #endregion
