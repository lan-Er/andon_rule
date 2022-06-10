export interface FoData {
  foId: string;
  foNumber: string;
  qty: string;
  uom: string;
  description: string;
  poList: PoData[];
}

export interface PoData {
  poId: string;
  poNumber: string;
  demandQty: string;
  subQty: string;
  zaiTuQty: string;
  unReciveQty: string;
  replyDate?: string;
  moList: MoData[];
}

export interface MoData {
  moId: string;
  moNumber: string;
  makeQty: string;
  unCheckQty: string;
  ngQty: string;
}

export function getFalseData() {
  const data: FoData[] = [
    {
      foId: '1',
      foNumber: '2020008-001',
      qty: '10',
      uom: 'KG',
      description: '测试1',
      poList: [
        {
          poId: '21',
          poNumber: 'po2213444',
          demandQty: '21',
          subQty: '23',
          zaiTuQty: '11',
          unReciveQty: '44',
          moList: [
            {
              moId: '100',
              moNumber: 'MO231234',
              makeQty: '32',
              unCheckQty: '21',
              ngQty: '11',
            },
            {
              moId: '101',
              moNumber: 'MO231234',
              makeQty: '32',
              unCheckQty: '22',
              ngQty: '11',
            },
            {
              moId: '102',
              moNumber: 'MO231234',
              makeQty: '32',
              unCheckQty: '22',
              ngQty: '12',
            },
          ],
        },
        {
          poId: '22',
          poNumber: 'po441234',
          demandQty: '53',
          subQty: '234',
          zaiTuQty: '77',
          unReciveQty: '11',
          moList: [
            {
              moId: '200',
              moNumber: 'MO231124555',
              makeQty: '1245',
              unCheckQty: '3542',
              ngQty: '234',
            },
            {
              moId: '201',
              moNumber: '234556',
              makeQty: '32',
              unCheckQty: '22',
              ngQty: '11',
            },
            {
              moId: '203',
              moNumber: '235666',
              makeQty: '2355',
              unCheckQty: '22',
              ngQty: '11',
            },
          ],
        },
        {
          poId: '23',
          poNumber: 'PO231344',
          demandQty: '1',
          subQty: '2',
          zaiTuQty: '123',
          unReciveQty: '22',
          moList: [
            {
              moId: '100',
              moNumber: 'MO23144123',
              makeQty: '12',
              unCheckQty: '22',
              ngQty: '44',
            },
            {
              moId: '101',
              moNumber: 'MO231234',
              makeQty: '32',
              unCheckQty: '22',
              ngQty: '114',
            },
            {
              moId: '102',
              moNumber: 'MO231234',
              makeQty: '32',
              unCheckQty: '22',
              ngQty: '55`',
            },
          ],
        },
      ],
    },
    {
      foId: '2',
      foNumber: 'F202009013',
      qty: '22',
      uom: 'KG',
      description: '测试1',
      poList: [
        {
          poId: '212',
          poNumber: 'PO-0013',
          demandQty: '18',
          subQty: '2',
          zaiTuQty: '115',
          unReciveQty: '1',
          moList: [
            {
              moId: '100',
              moNumber: 'MO231234',
              makeQty: '32',
              unCheckQty: '21',
              ngQty: '11',
            },
            {
              moId: '101',
              moNumber: 'MO231234',
              makeQty: '32',
              unCheckQty: '22',
              ngQty: '11',
            },
            {
              moId: '102',
              moNumber: 'MO231234',
              makeQty: '32',
              unCheckQty: '22',
              ngQty: '12',
            },
          ],
        },
        {
          poId: '229',
          poNumber: 'PO20200988',
          demandQty: '11',
          subQty: '7',
          zaiTuQty: '123',
          unReciveQty: '8',
          moList: [
            {
              moId: '200',
              moNumber: 'MO231124555',
              makeQty: '1245',
              unCheckQty: '3542',
              ngQty: '234',
            },
            {
              moId: '201',
              moNumber: '234556',
              makeQty: '32',
              unCheckQty: '22',
              ngQty: '11',
            },
            {
              moId: '203',
              moNumber: '235666',
              makeQty: '2355',
              unCheckQty: '22',
              ngQty: '11',
            },
          ],
        },
        {
          poId: '2311',
          poNumber: 'PO2020080233',
          demandQty: '4',
          subQty: '22',
          zaiTuQty: '12',
          unReciveQty: '44',
          moList: [
            {
              moId: '100',
              moNumber: 'MO23144123',
              makeQty: '12',
              unCheckQty: '22',
              ngQty: '44',
            },
            {
              moId: '101',
              moNumber: 'MO231234',
              makeQty: '32',
              unCheckQty: '22',
              ngQty: '114',
            },
            {
              moId: '102',
              moNumber: 'MO231234',
              makeQty: '32',
              unCheckQty: '22',
              ngQty: '55`',
            },
          ],
        },
      ],
    },
  ];

  return data;
}
