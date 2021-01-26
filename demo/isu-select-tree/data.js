const banks = [
  { id: 1, label: '第1个', children: [
      { id: 11, label: '二级第1个', children: [] },
      { id: 12, label: '二级第2个', children: [] },
      { id: 13, label: '二级第3个', children: [] },
      { id: 14, label: '二级第4个', children: [] },
      { id: 15, label: '二级第5个', children: [] }
    ] },
  {
    id: 2,
    label: '第2个',
    children: [
      {
        id: 21,
        label: '二级第1个',
        showSlotBefore: true,
        showSlotAfter: true,
        slotefault: true,
        showLevel1: true,
        level2Show: true,
        children: [
          {
            id: 211,
            label: '三级1第1个',
            showLevel2:true,
            children: [
              { id: 2111, label: '1', children: [] },
              { id: 2112, label: '2', children: [] },
              { id: 2113, label: '3', children: [] },
              { id: 2114, label: '4', children: [] },
              { id: 2115, label: '5', children: [] }
            ]
          },
          { id: 212, label: '三级2第2个', disabled: true, children: [] },
          { id: 213, label: '三级3第3个', children: [] },
          { id: 214, label: '三级4第4个', children: [] },
          { id: 215, label: '三级5第5个', children: [] }
        ]
      },
      { id: 22, label: '二级第2个', children: [] },
      { id: 23, label: '二级第3个', children: [] },
      { id: 24, label: '二级第4个', children: [] },
      { id: 25, label: '二级第5个', children: [] }
    ]
  },
  { id: 3, label: '第3个', children: [ {
      id: 31,
      label: '三级第1个'},{
      id: 32,
      label: '三级第2个'}] },
  { id: 4, label: '第4个', children: [] },
  { id: 5, label: '第5个', children: [] }
];

const companies = [
  {"id": 13, "label": "天猫", "business": "塑料"},
  {"id": 14, "label": "唯品会", "business": "电商"},
  {"id": 15, "label": "腾讯", "business": "游戏"},
  {"id": 16, "label": "京东", "business": "电商"},
  {"id": 17, "label": "淘宝", "business": "电商"}
];
export {banks, companies};
