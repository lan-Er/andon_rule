import { overWriteConfig } from 'hzero-boot';
// import { getEnvConfig } from 'hzero-front/lib/utils/iocUtils';
// import { getCurrentUserId, getCurrentOrganizationId } from 'hzero-front/lib/utils/utils';
// import _getConfig from 'choerodon-ui/lib/get-config';
// import { configure } from 'choerodon-ui';
// import axios from 'axios';

// const withTokenAxios = _getConfig('axios') || axios;

// const tableCustomizedLoad = async (customizedCode) => {
//   const { HZERO_PLATFORM } = getEnvConfig();
//   const tenantId = getCurrentOrganizationId();
//   const userId = getCurrentUserId();
//   const code = `table.customized.${customizedCode}`;
//   const localCode = `${code}.${tenantId}.${userId}`;
//   const serializedCustomized = localStorage.getItem(localCode);
//   if (serializedCustomized) {
//     try {
//       const customized = JSON.parse(serializedCustomized);
//       if (tenantId === 0 || Date.now() - customized.lastUpdateTime < 60 * 60000) {
//         return customized;
//       }
//     } catch (e) {
//       console.error(e);
//     }
//   }
//   if (tenantId !== 0) {
//     // try {
//     const res = await withTokenAxios({
//       url: `${HZERO_PLATFORM}/v1/${tenantId}/personal-tables`,
//       method: 'GET',
//       params: {
//         code,
//         tenantId,
//         userId,
//       },
//     });
//     if (res && res.dataJson) {
//       const remoteCustomized = {
//         ...JSON.parse(res.dataJson),
//         lastUpdateTime: Date.now(),
//       };
//       const newSerializedCustomized = JSON.stringify(remoteCustomized);
//       localStorage.setItem(localCode, newSerializedCustomized);
//       return remoteCustomized;
//     }
//     //   const { dataJson } = await request(`${HZERO_PLATFORM}/v1/${tenantId}/personal-tables`, {
//     //     method: 'GET',
//     //     query: {
//     //       code,
//     //       tenantId,
//     //       userId,
//     //     },
//     //   });
//     //   if (dataJson) {
//     //     const remoteCustomized = {
//     //       ...JSON.parse(dataJson),
//     //       lastUpdateTime: Date.now(),
//     //     };
//     //     const newSerializedCustomized = JSON.stringify(remoteCustomized);
//     //     localStorage.setItem(localCode, newSerializedCustomized);
//     //     return remoteCustomized;
//     //   }
//     // } catch (e) {
//     //   console.error(e);
//     // }
//   }
//   return {
//     columns: {},
//   };
// };

// const tableCustomizedSave = async (customizedCode, customized) => {
//   const { HZERO_PLATFORM } = getEnvConfig();
//   const code = `table.customized.${customizedCode}`;
//   const tenantId = getCurrentOrganizationId();
//   const userId = getCurrentUserId();
//   const localCode = `${code}.${tenantId}.${userId}`;
//   const serializedCustomized = JSON.stringify({
//     ...customized,
//     lastUpdateTime: Date.now(),
//   });
//   localStorage.setItem(localCode, serializedCustomized);
//   if (tenantId !== 0) {
//     withTokenAxios({
//       url: `${HZERO_PLATFORM}/v1/${tenantId}/personal-tables`,
//       method: 'POST',
//       data: {
//         code,
//         tenantId,
//         userId,
//         dataJson: serializedCustomized,
//       },
//     })
//       .then((res) => {
//         if (res) {
//           console.log(res);
//         }
//       })
//       .catch((err) => {
//         console.log(err);
//         // notification.error({
//         //   message: err.message,
//         // });
//       });
//   }
// };

overWriteConfig({
  // 在 dva 对象实例化之后调用，可以在这里添加 dva 插件，注意，这个引入的文件dvaPluginForMicroFront和非微前端的不一样
  dvaAppInit: (app) => {
    app.use(require('hzero-front-hlod/lib/utils/dvaPluginForMicroFront').default(app));
  },

  // 在这个文件内可以重新 c7nUi 配置
  // initC7nUiConfig: () => {
  //   configure({ tableCustomizedLoad });

  //   configure({ tableCustomizedSave });
  //   return require('hzero-front/lib/utils/c7nUiConfig');
  // },
});
