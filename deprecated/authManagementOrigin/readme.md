# 权限管理

## 组件参数

### platformTypeList
参数platformTypeList为Array类型，作用是展示已选平台类型内对应的菜单内容。需传入如：["AUTH", "AFA"]，数组内每一项为平台类型的code码，默认通过JSON.parse(
window.localStorage.getItem("authEnums")).PlatformType获取数组，数组内每项为{code: "", name: ""}格式。

### authLevel
参数authLevel为Number类型，作用为设置权限树第N层权限内可新增其子权限，默认值为2。

### showRightMenu
参数showRightMenu为Boolean类型，作用为设置是否在权限树上使用右键菜单，默认值为true。

### showTreeButton
参数showTreeButton为Boolean类型，作用为设置是否在权限树的树节点上显示菜单内操作按钮，默认值为false。



| 名字 | 类型 | 描述 |
| ----- | ----- | ---------------------------------------------------------------- |
| platformTypeList | Array | ["AUTH", "AFA"]，平台类型的code码，通过JSON.parse(window.localStorage.getItem("authEnums")).PlatformType获取数组，数组内每项为{code: "", name: ""}格式 |
| authLevel | Number | 作用为设置权限树第N层权限内可新增其子权限，默认值为2 |
| showRightMenu | Boolean | 作用为设置是否在权限树上使用右键菜单，默认值为true |
| showTreeButton | Boolean | 作用为设置是否在权限树的树节点上显示菜单内操作按钮，默认值为false |
