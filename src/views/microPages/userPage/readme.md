# 权限管理

## 组件参数

### searchType
平台类型，例如门户的为“PORTAL”， devSecOps的为“DEVOPS”。 // DEVOPS, PORTAL, ASC, AFA

### columnWidth
列表的宽度自定义，如数组数据对应它的列，“min”为设定最小宽度['55', 'min160', 'min110', 'min100', '150', 'min100', '150', '190', '48']

### 操作按钮的显示控制：如表格所示

| 名字 | 类型 | 描述 |
| ----- | ----- | ---------------------------------------------------------------- |
| searchType | String | 平台类型 |
| columnWidth | Array | 列表的宽度自定义 |
| isCreateUser | Boolean | 是否显示新增用户按钮，默认true|
| isDeleteUser  | Boolean | 是否显示删除用户按钮，默认true |
| isEditUser | Boolean | 是否显示编辑用户按钮，默认true |
| isRelatedCertificate | Boolean | 是否显示关联证书按钮，默认true |
| isRelatedRole | Boolean | 是否显示关联角色按钮，默认true |

