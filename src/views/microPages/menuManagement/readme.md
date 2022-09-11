# 菜单管理

## 组件参数

### platformTypeList
参数platformTypeList为Array类型，作用是展示已选平台类型内对应的菜单内容。需传入如：["AUTH", "AFA"]，数组内每一项为平台类型的code码，默认通过JSON.parse(
window.localStorage.getItem("authEnums")).PlatformType获取数组，数组内每项为{code: "", name: ""}格式

### menuExtraSetting
参数menuExtraSetting为Array类型，作用是新增或编辑菜单时，展示传入的值对应的表单项，需传入如：["url", "codelessType", "pageContent", "pageType"]，最多为这四项，其余项会被忽略。


| 名字 | 类型 | 描述 |
| ----- | ----- | ---------------------------------------------------------------- |
| platformTypeList | Array | ["AUTH", "AFA"]，平台类型的code码，通过JSON.parse(window.localStorage.getItem("authEnums")).PlatformType获取数组，数组内每项为{code: "",name: ""}格式 |
| menuExtraSetting | Array | 作用是新增或编辑菜单时，展示传入的值对应的表单项，需传入如：["url", "codelessType", "pageContent", "pageType"]，最多为这四项，其余项会被忽略 |

