let checkedValue;

const initColumns = [
  {
    align: 'right',
    width: 82,
    name: 'rate',
    renderer: ({ record }) => `${(record.get('rate') * 100).toFixed(2)}%`,
  },
  {
    align: 'left',
    width: 84,
    name: 'itemTypeMeaning',
  },
  {
    align: 'left',
    width: 84,
    name: 'categoryName',
  },
  {
    align: 'right',
    width: 82,
    name: 'batchQty',
  },
  {
    align: 'right',
    width: 82,
    name: 'qcOkQty',
  },
  {
    align: 'right',
    width: 82,
    name: 'qcNgQty',
  },
  {
    align: 'right',
    width: 82,
    name: 'reworkQty',
  },
  {
    align: 'right',
    width: 82,
    name: 'concessionQty',
  },
  {
    align: 'right',
    width: 82,
    name: 'scrappedQty',
  },
  {
    align: 'right',
    width: 82,
    name: 'firstRate',
    renderer: ({ record }) => `${(record.get('firstRate') * 100).toFixed(2)}%`,
  },
  {
    align: 'left',
    width: 100,
    name: 'dayWeekMonth',
    renderer: ({ record }) => {
      const result = record.get('declaredDate').split(' ')[0];
      switch (checkedValue) {
        case 'DAY':
          return result;
        case 'WEEK':
          return `${record.get('x')}周`;
        case 'MONTH':
          return `${record.get('x')}月`;
        default:
          return result;
      }
    },
  },
];
const item = {
  align: 'left',
  width: 128,
  name: 'itemCode',
  lock: true,
};
const description = {
  align: 'left',
  width: 200,
  name: 'itemName',
};
const prodLine = {
  align: 'left',
  width: 128,
  name: 'prodLine',
};
const equipment = {
  align: 'left',
  width: 128,
  name: 'equipment',
};
const worker = {
  align: 'left',
  width: 128,
  name: 'worker',
};
const uomName = {
  align: 'left',
  width: 70,
  name: 'uomName',
};

// 1.按物料维度时，不展示生产线、设备、人员
// 2.按产线维度时，不展示物料、物料描述、单位、设备、人员
// 3.按设备维度时，不展示物料、物料描述、单位、生产线、人员
// 4.按人员维度时，不展示物料、物料描述、单位、生产线、设备
// 多种维度组合时，不展示未选中维度相关列，数据按所选维度展示；

const handleSetColumn = (arg) => {
  const retArr = [...initColumns];
  retArr.unshift(...arg);
  return retArr;
};

export default function handleJudgeColumn(dataTypeArr, checkedVal) {
  checkedValue = checkedVal;
  if (dataTypeArr && dataTypeArr.length > 0) {
    // 1.不展示生产线、设备、人员
    if (dataTypeArr.every((i) => i === 'ITEM')) {
      return handleSetColumn([item, description, uomName]);
    }
    // 1,2  不展示交集   设备、人员
    if (
      dataTypeArr.includes('ITEM') &&
      dataTypeArr.includes('PRODLINE') &&
      !dataTypeArr.includes('EQUIPMENT') &&
      !dataTypeArr.includes('WORKER')
    ) {
      return handleSetColumn([item, description, prodLine, uomName]);
    }
    // 1,3  不展示交集   生产线、人员
    if (
      dataTypeArr.includes('ITEM') &&
      !dataTypeArr.includes('PRODLINE') &&
      dataTypeArr.includes('EQUIPMENT') &&
      !dataTypeArr.includes('WORKER')
    ) {
      return handleSetColumn([item, description, equipment, uomName]);
    }
    // 1,4  不展示交集   生产线、设备
    if (
      dataTypeArr.includes('ITEM') &&
      !dataTypeArr.includes('PRODLINE') &&
      !dataTypeArr.includes('EQUIPMENT') &&
      dataTypeArr.includes('WORKER')
    ) {
      return handleSetColumn([item, description, worker, uomName]);
    }
    // 123 不展示交集   人员
    if (
      dataTypeArr.includes('ITEM') &&
      dataTypeArr.includes('PRODLINE') &&
      dataTypeArr.includes('EQUIPMENT') &&
      !dataTypeArr.includes('WORKER')
    ) {
      return handleSetColumn([item, description, prodLine, equipment, uomName]);
    }
    // 124 不展示交集   设备
    if (
      dataTypeArr.includes('ITEM') &&
      dataTypeArr.includes('PRODLINE') &&
      !dataTypeArr.includes('EQUIPMENT') &&
      dataTypeArr.includes('WORKER')
    ) {
      return handleSetColumn([item, description, prodLine, worker, uomName]);
    }
    // 134 不展示交集   生产线
    if (
      dataTypeArr.includes('ITEM') &&
      !dataTypeArr.includes('PRODLINE') &&
      dataTypeArr.includes('EQUIPMENT') &&
      dataTypeArr.includes('WORKER')
    ) {
      return handleSetColumn([item, description, equipment, worker, uomName]);
    }
    // 1234 都选 都展示
    if (
      dataTypeArr.includes('ITEM') &&
      dataTypeArr.includes('PRODLINE') &&
      dataTypeArr.includes('EQUIPMENT') &&
      dataTypeArr.includes('WORKER')
    ) {
      return handleSetColumn([item, description, prodLine, equipment, worker, uomName]);
    }
    // 2 不展示物料、物料描述、单位、设备、人员
    if (dataTypeArr.every((i) => i === 'PRODLINE')) {
      return handleSetColumn([prodLine]);
    }
    // 23 不展示交集 物料、物料描述、单位、人员
    if (
      !dataTypeArr.includes('ITEM') &&
      dataTypeArr.includes('PRODLINE') &&
      dataTypeArr.includes('EQUIPMENT') &&
      !dataTypeArr.includes('WORKER')
    ) {
      return handleSetColumn([prodLine, equipment]);
    }
    // 24 不展示交集 物料、物料描述、单位、设备
    if (
      !dataTypeArr.includes('ITEM') &&
      dataTypeArr.includes('PRODLINE') &&
      !dataTypeArr.includes('EQUIPMENT') &&
      dataTypeArr.includes('WORKER')
    ) {
      return handleSetColumn([prodLine, worker]);
    }
    // 234 不展示 物料 描述 单位
    if (
      !dataTypeArr.includes('ITEM') &&
      dataTypeArr.includes('PRODLINE') &&
      dataTypeArr.includes('EQUIPMENT') &&
      dataTypeArr.includes('WORKER')
    ) {
      return handleSetColumn([prodLine, equipment, worker]);
    }
    // 3 不展示物料、物料描述、单位、生产线、人员
    if (dataTypeArr.every((i) => i === 'EQUIPMENT')) {
      return handleSetColumn([equipment]);
    }
    // 34 不展示交集 物料、物料描述、单位、生产线
    if (
      !dataTypeArr.includes('ITEM') &&
      !dataTypeArr.includes('PRODLINE') &&
      dataTypeArr.includes('EQUIPMENT') &&
      dataTypeArr.includes('WORKER')
    ) {
      return handleSetColumn([equipment, worker]);
    }
    // 4 不展示物料、物料描述、单位、生产线、设备
    if (dataTypeArr.every((i) => i === 'WORKER')) {
      return handleSetColumn([worker]);
    }
  } else {
    return handleSetColumn([item, description, prodLine, equipment, worker, uomName]);
  }
}
