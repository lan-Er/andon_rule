import uuidv4 from 'uuid/v4';

function travesalNode(root, level) {
  const stack = [root];
  const res = {};
  function spreadObj(obj, node) {
    return {
      ...obj,
      level: node.level + 1,
    };
  }
  while (stack.length) {
    const node = stack.pop();
    if (node?.level === level || (level === 0 && node.level === undefined)) {
      res[node.title] = node.key;
    }
    if (!node.level) {
      node.level = 0;
    }
    if (node.children?.length && node.level <= level) {
      stack.push(...node.children.map((v) => spreadObj(v, node)));
    }
  }
  return res;
}

export function getNodeRoute(tree, nodeId) {
  const stack = [tree];
  const myRoute = [];
  let level = 0;
  function mapArr(v) {
    return {
      ...v,
      level,
    };
  }
  while (stack.length) {
    const node = stack.pop();
    if (node?.key === nodeId) {
      return [...myRoute.map((i) => i.key), nodeId].slice(1);
    }
    while (myRoute[myRoute.length - 1]?.level >= node?.level && node?.level !== undefined) {
      myRoute.pop();
    }
    myRoute.push({
      key: node.key,
      level: node.level,
    });
    if (node.children?.length) {
      stack.push(...node.children.reverse().map(mapArr));
      level++;
    }
  }
}

export const prodToMaterialTreeData = [
  {
    key: 'TAG202007140001',
    title: 'TAG202007140001',
    children: [
      {
        key: `l1-0-${uuidv4()}`,
        title: 'F202007110001 9C307*ZG82854JD 加强板型材 0058-1100',
        children: [
          {
            key: `l2-0-${uuidv4()}`,
            title: 'L2020071101 BCPPC01 扁钢',
            children: [
              { key: `l3-0-${uuidv4()}`, title: 'YCLPC01 板材元件 L202006090001 L202006090001' },
              {
                key: `l3-1-${uuidv4()}`,
                title: 'YCLPC02 低合金工程结构钢 L202006090002 L202006090002',
              },
            ],
          },
          {
            key: `l2-1-${uuidv4()}`,
            title: 'L2020071102 BCPPC02 六角钢',
            children: [
              {
                key: `l3-0-${uuidv4()}`,
                title: 'YCLPC03 低合金高强度板 L202006090001 L202006090001',
              },
              { key: `l3-1-${uuidv4()}`, title: 'YCLPC04 棒材 L202006090002 L202006090002' },
            ],
          },
        ],
      },
      {
        key: `l1-1-${uuidv4()}`,
        title: 'F202007110002 9C307*LJ82872JD 连接型材 0050-2900',
        children: [
          {
            key: `l2-0-${uuidv4()}`,
            title: 'L2020071101 BCPPC03 工字钢',
            children: [
              {
                key: `l3-0-${uuidv4()}`,
                title: 'YCLPC05 优质碳素结构钢 L202006090001 L202006090001',
              },
              {
                key: `l3-1-${uuidv4()}`,
                title: 'YCLPC06 优质碳素弹簧钢 L202006090002 L202006090002',
              },
            ],
          },
          {
            key: `l2-1-${uuidv4()}`,
            title: 'L2020071101 BCPPC04 槽钢',
            children: [
              { key: `l3-0-${uuidv4()}`, title: 'YCLPC07 连铸板坯 L202006090001 L202006090001' },
              { key: `l3-1-${uuidv4()}`, title: 'YCLPC08 初轧板坯 L202006090002 L202006090002' },
            ],
          },
        ],
      },
      {
        key: `l1-2-${uuidv4()}`,
        title: 'F202007110003 9C307*JD7861JD 侧弯板型材/0060-1987(71)',
        children: [
          {
            key: `l2-0-${uuidv4()}`,
            title: 'L2020071101 BCPPC05 角钢',
            children: [
              { key: `l3-0-${uuidv4()}`, title: 'YCLPC09 铝棒 L202006090001 L202006090001' },
              { key: `l3-1-${uuidv4()}`, title: 'YCLPC10 辙型钢 L202006090002 L202006090002' },
            ],
          },
          {
            key: `l2-1-${uuidv4()}`,
            title: 'L2020071101 BCPPC06 结构钢Q235',
            children: [
              {
                key: `l3-0-${uuidv4()}`,
                title: 'YCLPC11 优质碳素结构钢 L202006090001 L202006090001',
              },
              { key: `l3-1-${uuidv4()}`, title: 'YCLPC12 棒材 L202006090002 L202006090002' },
            ],
          },
        ],
      },
    ],
  },
  {
    key: 'TAG202007140002',
    title: 'TAG202007140002',
    children: [
      {
        key: `l1-0-${uuidv4()}`,
        title: 'F202007110004 9C307*HL7932JD 前端横梁型材 0062-2271',
        children: [
          {
            key: `l2-0-${uuidv4()}`,
            title: 'L2020071101 BCPPC07 角钢',
            children: [
              { key: `l3-0-${uuidv4()}`, title: 'YCLPC09 铝棒 L202006090001 L202006090001' },
              { key: `l3-1-${uuidv4()}`, title: 'YCLPC10 辙型钢 L202006090002 L202006090002' },
            ],
          },
          {
            key: `l2-1-${uuidv4()}`,
            title: 'L2020071102 BCPPC08 工字钢',
            children: [
              {
                key: `l3-0-${uuidv4()}`,
                title: 'YCLPC17 优质碳素结构钢 L202006090001 L202006090001',
              },
              {
                key: `l3-1-${uuidv4()}`,
                title: 'YCLPC18 优质碳素弹簧钢 L202006090002 L202006090002',
              },
            ],
          },
        ],
      },
      {
        key: `l1-1-${uuidv4()}`,
        title: 'F202007110005 9C307*ZL7847JD 中梁型材 0061-400',
        children: [
          {
            key: `l2-0-${uuidv4()}`,
            title: 'L2020071101 BCPPC09 结构钢Q235',
            children: [
              {
                key: `l3-0-${uuidv4()}`,
                title: 'YCLPC11 优质碳素结构钢 L202006090001 L202006090001',
              },
              { key: `l3-1-${uuidv4()}`, title: 'YCLPC12 棒材 L202006090002 L202006090002' },
            ],
          },
          {
            key: `l2-1-${uuidv4()}`,
            title: 'L2020071101 BCPPC10 槽钢',
            children: [
              { key: `l3-0-${uuidv4()}`, title: 'YCLPC19 连铸板坯 L202006090001 L202006090001' },
              { key: `l3-1-${uuidv4()}`, title: 'YCLPC20 初轧板坯 L202006090002 L202006090002' },
            ],
          },
        ],
      },
      {
        key: `l1-2-${uuidv4()}`,
        title: 'F202007110006 9C307*ZC7891JD 地板支撑型材 0056-1220',
        children: [
          {
            key: `l2-0-${uuidv4()}`,
            title: 'L2020071101 BCPPC05 角钢',
            children: [
              { key: `l3-0-${uuidv4()}`, title: 'YCLPC09 铝棒 L202006090001 L202006090001' },
              { key: `l3-1-${uuidv4()}`, title: 'YCLPC10 辙型钢 L202006090002 L202006090002' },
            ],
          },
          {
            key: `l2-1-${uuidv4()}`,
            title: 'L2020071101 BCPPC06 扁钢',
            children: [
              { key: `l3-0-${uuidv4()}`, title: 'YCLPC01 板材元件 L202006090001 L202006090001' },
              {
                key: `l3-1-${uuidv4()}`,
                title: 'YCLPC02 低合金工程结构钢 L202006090002 L202006090002',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    key: 'TAG202007140003',
    title: 'TAG202007140003',
    children: [
      {
        key: `l1-0-${uuidv4()}`,
        title: 'F202007110001 9C307*ZG82854JD 加强板型材 0058-1100',
        children: [
          {
            key: `l2-0-${uuidv4()}`,
            title: 'L2020071101 BCPPC01 扁钢',
            children: [
              { key: `l3-0-${uuidv4()}`, title: 'YCLPC01 板材元件 L202006090001 L202006090001' },
              {
                key: `l3-1-${uuidv4()}`,
                title: 'YCLPC02 低合金工程结构钢 L202006090002 L202006090002',
              },
            ],
          },
          {
            key: `l2-1-${uuidv4()}`,
            title: 'L2020071102 BCPPC02 六角钢',
            children: [
              {
                key: `l3-0-${uuidv4()}`,
                title: 'YCLPC03 低合金高强度板 L202006090001 L202006090001',
              },
              { key: `l3-1-${uuidv4()}`, title: 'YCLPC04 棒材 L202006090002 L202006090002' },
            ],
          },
        ],
      },
      {
        key: `l1-1-${uuidv4()}`,
        title: 'F202007110002 9C307*LJ82872JD 连接型材 0050-2900',
        children: [
          {
            key: `l2-0-${uuidv4()}`,
            title: 'L2020071101 BCPPC03 工字钢',
            children: [
              {
                key: `l3-0-${uuidv4()}`,
                title: 'YCLPC05 优质碳素结构钢 L202006090001 L202006090001',
              },
              {
                key: `l3-1-${uuidv4()}`,
                title: 'YCLPC06 优质碳素弹簧钢 L202006090002 L202006090002',
              },
            ],
          },
          {
            key: `l2-1-${uuidv4()}`,
            title: 'L2020071101 BCPPC04 槽钢',
            children: [
              { key: `l3-0-${uuidv4()}`, title: 'YCLPC07 连铸板坯 L202006090001 L202006090001' },
              { key: `l3-1-${uuidv4()}`, title: 'YCLPC08 初轧板坯 L202006090002 L202006090002' },
            ],
          },
        ],
      },
      {
        key: `l1-2-${uuidv4()}`,
        title: 'F202007110002 9C307*JD7861JD 侧弯板型材/0060-1987(71)',
        children: [
          {
            key: `l2-0-${uuidv4()}`,
            title: 'L2020071101 BCPPC05 角钢',
            children: [
              { key: `l3-0-${uuidv4()}`, title: 'YCLPC09 铝棒 L202006090001 L202006090001' },
              { key: `l3-1-${uuidv4()}`, title: 'YCLPC10 辙型钢 L202006090002 L202006090002' },
            ],
          },
          {
            key: `l2-1-${uuidv4()}`,
            title: 'L2020071101 BCPPC06 结构钢Q235',
            children: [
              {
                key: `l3-0-${uuidv4()}`,
                title: 'YCLPC11 优质碳素结构钢 L202006090001 L202006090001',
              },
              { key: `l3-1-${uuidv4()}`, title: 'YCLPC12 棒材 L202006090002 L202006090002' },
            ],
          },
        ],
      },
    ],
  },
  {
    key: 'TAG202007140004',
    title: 'TAG202007140004',
    children: [
      {
        key: `l1-0-${uuidv4()}`,
        title: 'F202007110001 9C307*HL7932JD 前端横梁型材 0062-2271',
        children: [
          {
            key: `l2-0-${uuidv4()}`,
            title: 'L2020071101 BCPPC07 角钢',
            children: [
              { key: `l3-0-${uuidv4()}`, title: 'YCLPC09 铝棒 L202006090001 L202006090001' },
              { key: `l3-1-${uuidv4()}`, title: 'YCLPC10 辙型钢 L202006090002 L202006090002' },
            ],
          },
          {
            key: `l2-1-${uuidv4()}`,
            title: 'L2020071102 BCPPC08 工字钢',
            children: [
              {
                key: `l3-0-${uuidv4()}`,
                title: 'YCLPC17 优质碳素结构钢 L202006090001 L202006090001',
              },
              {
                key: `l3-1-${uuidv4()}`,
                title: 'YCLPC18 优质碳素弹簧钢 L202006090002 L202006090002',
              },
            ],
          },
        ],
      },
      {
        key: `l1-1-${uuidv4()}`,
        title: 'F202007110002 9C307*ZL7847JD 中梁型材 0061-400',
        children: [
          {
            key: `l2-0-${uuidv4()}`,
            title: 'L2020071101 BCPPC09 结构钢Q235',
            children: [
              {
                key: `l3-0-${uuidv4()}`,
                title: 'YCLPC11 优质碳素结构钢 L202006090001 L202006090001',
              },
              { key: `l3-1-${uuidv4()}`, title: 'YCLPC12 棒材 L202006090002 L202006090002' },
            ],
          },
          {
            key: `l2-1-${uuidv4()}`,
            title: 'L2020071101 BCPPC10 槽钢',
            children: [
              { key: `l3-0-${uuidv4()}`, title: 'YCLPC19 连铸板坯 L202006090001 L202006090001' },
              { key: `l3-1-${uuidv4()}`, title: 'YCLPC20 初轧板坯 L202006090002 L202006090002' },
            ],
          },
        ],
      },
      {
        key: `l1-2-${uuidv4()}`,
        title: 'F202007110002 9C307*ZC7891JD 地板支撑型材 0056-1220',
        children: [
          {
            key: `l2-0-${uuidv4()}`,
            title: 'L2020071101 BCPPC05 角钢',
            children: [
              { key: `l3-0-${uuidv4()}`, title: 'YCLPC09 铝棒 L202006090001 L202006090001' },
              { key: `l3-1-${uuidv4()}`, title: 'YCLPC10 辙型钢 L202006090002 L202006090002' },
            ],
          },
          {
            key: `l2-1-${uuidv4()}`,
            title: 'L2020071101 BCPPC06 扁钢',
            children: [
              { key: `l3-0-${uuidv4()}`, title: 'YCLPC01 板材元件 L202006090001 L202006090001' },
              {
                key: `l3-1-${uuidv4()}`,
                title: 'YCLPC02 低合金工程结构钢 L202006090002 L202006090002',
              },
            ],
          },
        ],
      },
    ],
  },
];

export const materialToProdTreeData = [
  {
    key: `l1-0-${uuidv4()}`,
    title: 'YCLPC01 板材元件 L202006090001 L202006090001',
    children: [
      {
        key: `l2-0-${uuidv4()}`,
        title: 'L2020071101 BCPPC01 扁钢',
        children: [
          {
            key: `l3-0-${uuidv4()}`,
            title: 'F202007110001 9C307*ZG82854JD 加强板型材 0058-1100 TAG202007140001',
          },
          {
            key: `l3-1-${uuidv4()}`,
            title: 'F202007110002 9C307*LJ82872JD 连接型材 0050-2900 TAG202007140002',
          },
        ],
      },
      {
        key: `l2-1-${uuidv4()}`,
        title: 'L2020071102 BCPPC02 六角钢',
        children: [
          {
            key: `l3-0-${uuidv4()}`,
            title: 'F202007110005 9C307*ZL7847JD 中梁型材 0061-400  TAG202007140005',
          },
          {
            key: `l3-1-${uuidv4()}`,
            title: 'F202007110006 9C307*ZC7891JD 地板支撑型材 0056-1220  TAG202007140006',
          },
        ],
      },
    ],
  },
  {
    key: `l1-1-${uuidv4()}`,
    title: 'YCLPC02 低合金工程结构钢 L202006090002 L202006090002',
    children: [
      {
        key: `l2-0-${uuidv4()}`,
        title: 'L2020071101 BCPPC03 工字钢',
        children: [
          {
            key: `l3-0-${uuidv4()}`,
            title: 'F202007110002 9C307*LJ82872JD 连接型材 0050-2900  TAG202007140002',
          },
          {
            key: `l3-1-${uuidv4()}`,
            title: 'F202007110003 9C307*JD7861JD 侧弯板型材/0060-1987(71) TAG202007140003',
          },
        ],
      },
      {
        key: `l2-1-${uuidv4()}`,
        title: 'L2020071101 BCPPC04 槽钢',
        children: [
          {
            key: `l3-0-${uuidv4()}`,
            title: 'F202007110006 9C307*ZC7891JD 地板支撑型材 0056-1220  TAG202007140006',
          },
          {
            key: `l3-1-${uuidv4()}`,
            title: 'F202007110001 9C307*ZG82854JD 加强板型材 0058-1100  TAG202007140001',
          },
        ],
      },
    ],
  },
  {
    key: `l1-2-${uuidv4()}`,
    title: 'YCLPC03 低合金高强度板 L202006090001 L202006090001',
    children: [
      {
        key: `l2-0-${uuidv4()}`,
        title: 'L2020071101 BCPPC05 角钢',
        children: [
          {
            key: `l3-0-${uuidv4()}`,
            title: 'F202007110001 9C307*ZG82854JD 加强板型材 0058-1100  TAG202007140001',
          },
          {
            key: `l3-1-${uuidv4()}`,
            title: 'F202007110003 9C307*JD7861JD 侧弯板型材/0060-1987(71) TAG202007140003',
          },
        ],
      },
      {
        key: `l2-1-${uuidv4()}`,
        title: 'L2020071101 BCPPC06 结构钢Q235',
        children: [
          {
            key: `l3-0-${uuidv4()}`,
            title: 'F202007110004 9C307*HL7932JD 前端横梁型材 0062-2271  TAG202007140004',
          },
          {
            key: `l3-1-${uuidv4()}`,
            title: 'F202007110005 9C307*ZL7847JD 中梁型材 0061-400  TAG202007140005',
          },
        ],
      },
    ],
  },
];

export const prodToMaterialTagPair = prodToMaterialTreeData.reduce(
  (acc, v) => ({
    ...acc,
    ...travesalNode(v, 0),
  }),
  {}
);

export const prodToMaterialProdPair = prodToMaterialTreeData.reduce(
  (acc, v) => ({
    ...acc,
    ...travesalNode(v, 1),
  }),
  {}
);

export const materialToProdPair = materialToProdTreeData.reduce(
  (acc, v) => ({
    ...acc,
    ...travesalNode(v, 2),
  }),
  {}
);

export const materialToProdTreeDataKeyValuePair = materialToProdTreeData.reduce(
  (acc, v) => ({ ...acc, ...travesalNode(v) }),
  {}
);

export const finishedProductDetail = {
  0: [
    ['2020-05-05 12：05：34', '陈思页', '剪裁压制', '300', '300'],
    ['2020-05-20 14：38：21', '唐力', '冲', '300', '300'],
    ['2020-05-22 08：32：42', '方瑶', '复合板材', '300', '300'],
    ['2020-05-27 12：05：37', '黄超', '铆接', '295', '295', '5', '尺寸超差'],
    ['2020-06-04 10：05：45', '张云翔', '拼接', '295', '295', '5', '毛利'],
    ['2020-06-12 15：35：57', '殷伊', '焊接', '280', '280', '15', '操作不当'],
    ['2020-06-18 14：21：37', '吴瑾', '成型', '267', '267', '3', '设备损坏'],
  ],
  1: [
    ['2020-03-05 09：55：21', '崔志斌', '剪裁压制', '400', '400'],
    ['2020-03-20 07：01：54', '陈思页', '冲', '400', '400'],
    ['2020-03-25 12：48：50', '唐力', '复合板材', '390', '390', '10', '毛利'],
    ['2020-05-27 12：05：37', '方瑶', '铆接', '390', '390'],
    ['2020-06-04 16：42：57', '黄超', '拼接', '390', '390'],
    ['2020-06-12 15：35：57', '方严', '焊接', '390', '390'],
    ['2020-06-18 14：21：37', '王茜', '成型', '385', '385', '5', '操作不当'],
  ],
  2: [
    ['2020-04-27 15：12：01', '黄超', '剪裁压制', '500', '500'],
    ['2020-04-27 20：01：17', '张云翔', '冲', '500', '500'],
    ['2020-04-49 17：21：17', '殷伊', '复合板材', '500', '500'],
    ['2020-05-12 08：11：27', '吴瑾', '铆接', '500', '500'],
    ['2020-05-14 16：28：01', '崔志斌', '拼接', '500', '500'],
    ['2020-05-15 12：57：13', '陈思页', '焊接', '500', '500'],
    ['2020-05-16 17：59：21', '唐力', '成型', '491', '491', '9', '尺寸超差'],
  ],
};

export const semiFinishedProductsDetail = {
  0: [
    ['PQC202004050001', 'PQC首检', '抽检10', '合格10'],
    ['PQC202004060001', '铆接', '抽检5', '合格5'],
    ['FQC202004100002', '', '抽检10', '合格10'],
  ],
  1: [
    ['PQC202004050010', 'PQC首检', '抽检15', '合格15'],
    ['PQC202004070002', '拼接', '抽检5', '合格5'],
    ['FQC202004110003', '抽检20', '合格20'],
  ],
  2: [
    ['PQC202004070010', 'PQC首检', '抽检8', '合格8'],
    ['PQC202004150003', 'PQC完工检', '抽检10', '合格10'],
    ['FQC202004200003', '抽检12', '合格12'],
  ],
  3: [
    ['PQC202003290001', 'PQC首检', '抽检10', '合格10'],
    ['PQC202003300001', '冲', '抽检5', '合格5'],
    ['PQC202003270002', 'PQC首检', '抽检5', '合格5'],
  ],
  4: [
    ['PQC202003290001', '剪裁压制', '抽检5', '合格5'],
    ['PQC202003260003', 'PQC首检', '抽检15', '合格15'],
    ['PQC202003280001', '冲', '抽检5', '合格5'],
  ],
};
