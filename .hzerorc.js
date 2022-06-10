module.exports =  {
  "packages": [
    {
      "name": "hzero-front-hpfm"
    },
    {
      "name": "hzero-front-hiam"
    },
    {
      "name": "hzero-front-hmsg"
    },
    {
      "name": "hzero-front-himp"
    },
    {
      "name": "hzero-front-hfile"
    },
    {
      "name": "hzero-front-hadm"
    },
    {
      "name": "hzero-front-hrpt"
    },
    {
      "name": "hzero-front-hsdr"
    },
    {
      "name": "hzero-front-hwfp"
    },
    {
      "name": "hzero-front-hmnt"
    },
    {
      "name": "hzero-front-hitf"
    },
    {
      "name": "hzero-front-hmde"
    },
    {
      "name": "hzero-front-hlod"
    },
    {
      "name": "hippius-front-analyse"
    },
    {
      "name": "hippius-front-app"
    },
    {
      "name": "hippius-front-contact"
    },
    {
      "name": "hippius-front-msggroup"
    },
    {
      "name": "hippius-front-subapp"
    },
    {
      "name": "hippius-front-qnr"
    },
    {
      "name": "hlos-front-lscm"
    },
    {
      "name": "hlos-front-laps"
    },
    {
      "name": "hlos-front-lsop"
    },
    {
      "name": "hlos-front-lwms"
    },
    {
      "name": "hlos-front-lmes"
    },
    {
      "name": "hlos-front-lmds"
    },
    {
      "name": "hlos-front-ldtt"
    },
    {
      "name": "hlos-front-ldab"
    },
    {
      "name": "hlos-front-zexe"
    },
    {
      "name": "hlos-front-zcom"
    },
    {
      "name": "hlos-front-zmda"
    },
    {
      "name": "hlos-front-grwl"
    },
    {
      "name": "hlos-front-zplan"
    },
    {
      "name": "hlos-front-zmdc"
    },
  ],
  "hzeroBoot": "hzero-boot/lib/pathInfo",
  "common": ['hlos-front'],
  // 下面这块webpackConfig是这个文档的5.4新增的
  webpackConfig: (config, webpackConfigType) => { // webpack 配置修改
    // console.log(webpackConfigType); // string webpack配置类型: 'dll' | 'base' | 'ms' ;
    if (webpackConfigType === 'ms') {
      config.externals = {
        ...config.externals,
        'choerodon-ui/lib/get-config': 'choerodonUi[\'getConfig\']',
      }
    }
    // 下面这段是加上的
    const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
    // hlod1.5.0 开始引入monaco h5代码编辑器
    config.plugins = [
      ...(config.plugins || []),
      new MonacoWebpackPlugin(['apex', 'azcli', 'bat', 'clojure', 'coffee', 'cpp', 'csharp', 'csp', 'css', 'dockerfile', 'fsharp', 'go', 'handlebars', 'html', 'ini', 'java', 'javascript', 'json', 'less', 'lua', 'markdown', 'msdax', 'mysql', 'objective', 'perl', 'pgsql', 'php', 'postiats', 'powerquery', 'powershell', 'pug', 'python', 'r', 'razor', 'redis', 'redshift', 'ruby', 'rust', 'sb', 'scheme', 'scss', 'shell', 'solidity', 'sql', 'st', 'swift', 'typescript', 'vb', 'xml', 'yaml']),
    ];
    // 上面这段是加上的
    return config;
  },
  // webpackConfig: (config, webpackConfigType) => { // webpack 配置修改
  //   console.log(webpackConfigType); // string webpack配置类型: 'dll' | 'base' | 'ms' ;
  //   config.externals = {
  //     ..config.externals,
  //     jQuery: 'window["jQuery"]',
  //     $: 'window["jQuery"]',
  //   }
  //   return config;
  // },
  // alias: {}, // webpack alias 配置, alias 的值可以是 string 表示指向配置文件
  // theme: {}, // less 变量配置, theme 的值可以是 string 表示指向配置文件
  // hzeroBoot: 'hzero-boot/lib/pathInfo', // hzero入口文件信息配置
  // dllConfig: { // dllConfig 配置
  //   common: {
  //     priority: 100,
  //     packages: ['react','react-dom','dva','hzero-ui','choerodon-ui','choerodon-ui/pro','core-js'],
  //   },
  //   vendorsGraph: {
  //     packages: ['echarts'],
  //   },
  //   vendors: {
  //     packages: ['lodash','lodash-decorators','react-intl-universal','axios','uuid','numeral','react-cropper','cropperjs',]
  //   }
  // },
  // splitChunks:{ /* ... */} // chunks 优化配置 参考: https://webpack.js.org/plugins/split-chunks-plugin/#optimizationsplitchunks
};

