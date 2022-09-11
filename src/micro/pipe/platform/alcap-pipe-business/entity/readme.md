# 使用文档
【管道说明】

## 参数
共【请修改】个参数:
- `【参数名】`,是【参数类型】,【是否必填】,例如:`【例子】`
entityId, schemaType,operationType = 'retrieve'
- `【entityId】`,是实体id，必填
- `【schemaType】`,在组件package.json中的schemaType，必填
- `【params】`,参数：参数有区别，可以使用Map类型的进行筛选，相同则直接接收参数，必填
## 使用方法

```
获取实体接口
pipe.entity.getEntityData([参数])
```

## 使用例子

```
const ctx = this;
const paramsMap = new Map([
  ['db', {
      entityId: ctx.entityId,
      orders: [],
      pageNum: ctx.currentPage,
      pageSize: ctx.pageSize,
      query: {},
      ranges: [],
      retrieveId: "paging"
      } 
  ],
  ['data_source', {
      entityId: ctx.entityId,
      fields: []
    }
  ]
])
pipe.entity.getEntityData(ctx.entityId, pck.docs.schemaType, paramsMap).then(res=> {})
```