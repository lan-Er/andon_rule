export default () => ({
  fields: [
    {
      name: 'id',
      label: '客户ID',
      required: false,
    },
    {
      name: 'objectVersionNumber',
      label: '版本号',
      required: false,
    },
    {
      name: 'companyCode',
      label: '公司编码',
      labelWidth: 150,
      required: true,
    },
    {
      name: 'companyName',
      label: '公司名称',
      labelWidth: 150,
      required: true,
    },
    {
      name: 'address',
      label: '公司地址',
      labelWidth: 150,
      required: false,
    },
    {
      name: 'contactPerson',
      label: '联系人',
      labelWidth: 150,
      required: false,
    },
    {
      name: 'phone',
      label: '联系电话',
      labelWidth: 150,
      required: false,
    },
    {
      name: 'enableFlag',
      label: '是否启用',
      labelWidth: 150,
      required: false,
    },
  ],
});
