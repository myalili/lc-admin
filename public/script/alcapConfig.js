window.alcapConfig = {
	"env": "serve-dev",
	"layout": "@micro-page/defaultLayout",
	"login": "@micro-page/alcapDefaultLogin",
	"logo": "",
	"projectName": "",
	"projectVersion": "",
	"theme": "",
	"needArm": true,
	"preload": [
		"@v2-lib/vue.spa.plugin",
		"@micro-pipe-platform/alcap-request-axios",
		"@micro-pipe-platform/alcap-pipe-core",
		"@micro-pipe-platform/alcap-pipe-business",
		"@micro-pipe-platform/alcap-api-aac",
		"@micro-pipe-platform/alcap-api-bff",
		"@micro-pipe-platform/alcap-api-arm",
		"@micro-pipe-platform/alcap-pipe-aac",
		"@micro-pipe-platform/alcap-store-core",
		"@micro-component-solution/alcap-api-aops",
		"@micro-component-solution/alcap-pipe-aops",
		"@micro-component-solution/alcap-store-aops",
		"@micro-component-platform/alcap-component-core",
		"@micro-component-platform/alcap-component-base",
		"@micro-component-platform/alcap-component-aac",
		"@micro-style-solution/alcap-stytle-aops",
		"@micro-component-solution/alcap-component-aops"
	],
	"libs": [
		{
			"name": "@micro-component-platform/alcap-component-aac",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/micro/component/platform/alcap-component-aac/index.js",
			"package": "{\r\n\t\"name\": \"@micro-component-platform/alcap-component-aac\",\r\n\t\"version\": \"1.0.0\",\r\n\t\"description\": \"低代码平台认证中心组件库\",\r\n\t\"main\": \"index.js\",\r\n\t\"scripts\": {\r\n\t\t\"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n\t},\r\n\t\"author\": \"\",\r\n\t\"license\": \"ISC\",\r\n\t\"dependencies\": {}\r\n}"
		},
		{
			"name": "@micro-component-platform/alcap-component-base",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/micro/component/platform/alcap-component-base/index.js",
			"package": "{\r\n\t\"name\": \"@micro-component-platform/alcap-component-base\",\r\n\t\"version\": \"1.0.0\",\r\n\t\"description\": \"低代码平台级组件库\",\r\n\t\"main\": \"index.js\", \r\n\t\"scripts\": {\r\n\t\t\"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n\t},\r\n\t\"author\": \"\",\r\n\t\"license\": \"ISC\",\r\n\t\"dependencies\": {}\r\n}"
		},
		{
			"name": "@micro-component-platform/alcap-component-core",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/micro/component/platform/alcap-component-core/index.js",
			"package": "{\r\n\t\"name\": \"@micro-component-platform/alcap-component-core\",\r\n\t\"version\": \"1.0.0\",\r\n\t\"description\": \"低代码平台级组件库\",\r\n\t\"main\": \"index.js\",\r\n\t\"scripts\": {\r\n\t\t\"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n\t},\r\n\t\"author\": \"\",\r\n\t\"license\": \"ISC\",\r\n\t\"dependencies\": {}\r\n}"
		},
		{
			"name": "@micro-component-solution/alcap-component-aops",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/micro/component/solution/alcap-component-aops/index.js",
			"package": "{\r\n\t\"name\": \"@micro-component-solution/alcap-component-aops\",\r\n\t\"version\": \"1.0.0\",\r\n\t\"description\": \"低代码平台aops公共组件库\",\r\n\t\"main\": \"index.js\",\r\n\t\"scripts\": {\r\n\t\t\"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n\t},\r\n\t\"author\": \"\",\r\n\t\"license\": \"ISC\",\r\n\t\"dependencies\": {}\r\n}"
		},
		{
			"name": "@micro-pipe-platform/alcap-api-aac",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/micro/pipe/platform/alcap-api-aac/index.js",
			"package": "{\r\n\t\"name\": \"@micro-pipe-platform/alcap-api-aac\",\r\n\t\"version\": \"1.0.0\",\r\n\t\"description\": \"认证中心api请求定义\",\r\n\t\"main\": \"index.js\",\r\n\t\"scripts\": {\r\n\t\t\"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n\t},\r\n\t\"author\": \"\",\r\n\t\"license\": \"ISC\",\r\n\t\"dependencies\": {}\r\n}"
		},
		{
			"name": "@micro-pipe-platform/alcap-api-arm",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/micro/pipe/platform/alcap-api-arm/index.js",
			"package": "{\r\n\t\"name\": \"@micro-pipe-platform/alcap-api-arm\",\r\n\t\"version\": \"1.0.0\",\r\n\t\"description\": \"资源市场api请求定义\",\r\n\t\"main\": \"index.js\",\r\n\t\"scripts\": {\r\n\t\t\"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n\t},\r\n\t\"author\": \"\",\r\n\t\"license\": \"ISC\",\r\n\t\"dependencies\": {}\r\n}"
		},
		{
			"name": "@micro-pipe-platform/alcap-api-bff",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/micro/pipe/platform/alcap-api-bff/index.js",
			"package": "{\r\n\t\"name\": \"@micro-pipe-platform/alcap-api-bff\",\r\n\t\"version\": \"1.0.0\",\r\n\t\"description\": \"bff api请求定义\",\r\n\t\"main\": \"index.js\",\r\n\t\"scripts\": {\r\n\t\t\"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n\t},\r\n\t\"author\": \"\",\r\n\t\"license\": \"ISC\",\r\n\t\"dependencies\": {}\r\n}"
		},
		{
			"name": "@micro-pipe-platform/alcap-pipe-aac",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/micro/pipe/platform/alcap-pipe-aac/index.js",
			"package": "{\r\n\t\"name\": \"@micro-pipe-platform/alcap-pipe-aac\",\r\n\t\"version\": \"1.0.0\",\r\n\t\"description\": \"认证中心公共方法包\",\r\n\t\"main\": \"index.js\",\r\n\t\"scripts\": {\r\n\t\t\"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n\t},\r\n\t\"author\": \"\",\r\n\t\"license\": \"ISC\",\r\n\t\"dependencies\": {}\r\n}"
		},
		{
			"name": "@micro-pipe-platform/alcap-pipe-business",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/micro/pipe/platform/alcap-pipe-business/index.js",
			"package": "{\r\n\t\"name\": \"@micro-pipe-platform/alcap-pipe-business\",\r\n\t\"version\": \"1.0.0\",\r\n\t\"description\": \"低代码平台级公共方法包\",\r\n\t\"main\": \"index.js\",\r\n\t\"scripts\": {\r\n\t\t\"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n\t},\r\n\t\"author\": \"\",\r\n\t\"license\": \"ISC\",\r\n\t\"dependencies\": {}\r\n}"
		},
		{
			"name": "@micro-pipe-platform/alcap-pipe-core",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/micro/pipe/platform/alcap-pipe-core/index.js",
			"package": "{\r\n\t\"name\": \"@micro-pipe-platform/alcap-pipe-core\",\r\n\t\"version\": \"1.0.0\",\r\n\t\"description\": \"平台级核心方法包\",\r\n\t\"main\": \"index.js\",\r\n\t\"scripts\": {\r\n\t\t\"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n\t},\r\n\t\"author\": \"\",\r\n\t\"license\": \"ISC\",\r\n\t\"dependencies\": {}\r\n}"
		},
		{
			"name": "@micro-pipe-platform/alcap-request-axios",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/micro/pipe/platform/alcap-request-axios/index.js",
			"package": "{\r\n\t\"name\": \"@micro-pipe-platform/alcap-request-axios\",\r\n\t\"version\": \"1.0.0\",\r\n\t\"description\": \"低代码平台级axios请求拦截\",\r\n\t\"main\": \"index.js\",\r\n\t\"scripts\": {\r\n\t\t\"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n\t},\r\n\t\"author\": \"\",\r\n\t\"license\": \"ISC\",\r\n\t\"dependencies\": {}\r\n}"
		},
		{
			"name": "@micro-pipe-platform/alcap-store-core",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/micro/pipe/platform/alcap-store-core/index.js",
			"package": "{\r\n\t\"name\": \"@micro-pipe-platform/alcap-store-core\",\r\n\t\"version\": \"1.0.0\",\r\n\t\"description\": \"低代码平台级store\",\r\n\t\"main\": \"index.js\",\r\n\t\"scripts\": {\r\n\t\t\"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n\t},\r\n\t\"author\": \"\",\r\n\t\"license\": \"ISC\",\r\n\t\"dependencies\": {}\r\n}"
		},
		{
			"name": "@micro-component-solution/alcap-api-aops",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/micro/pipe/solution/alcap-api-aops/index.js",
			"package": "{\r\n\t\"name\": \"@micro-component-solution/alcap-api-aops\",\r\n\t\"version\": \"1.0.0\",\r\n\t\"description\": \"低代码aops公共方法\",\r\n\t\"main\": \"index.js\",\r\n\t\"scripts\": {\r\n\t\t\"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n\t},\r\n\t\"author\": \"\",\r\n\t\"license\": \"ISC\",\r\n\t\"dependencies\": {}\r\n}"
		},
		{
			"name": "@micro-component-solution/alcap-pipe-aops",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/micro/pipe/solution/alcap-pipe-aops/index.js",
			"package": "{\r\n\t\"name\": \"@micro-component-solution/alcap-pipe-aops\",\r\n\t\"version\": \"1.0.0\",\r\n\t\"description\": \"低代码aops公共方法\",\r\n\t\"main\": \"index.js\",\r\n\t\"scripts\": {\r\n\t\t\"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n\t},\r\n\t\"author\": \"\",\r\n\t\"license\": \"ISC\",\r\n\t\"dependencies\": {}\r\n}"
		},
		{
			"name": "@micro-component-solution/alcap-store-aops",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/micro/pipe/solution/alcap-store-aops/index.js",
			"package": "{\r\n\t\"name\": \"@micro-component-solution/alcap-store-aops\",\r\n\t\"version\": \"1.0.0\",\r\n\t\"description\": \"低代码aops公共方法\",\r\n\t\"main\": \"index.js\",\r\n\t\"scripts\": {\r\n\t\t\"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n\t},\r\n\t\"author\": \"\",\r\n\t\"license\": \"ISC\",\r\n\t\"dependencies\": {}\r\n}"
		},
		{
			"name": "@micro-style-solution/alcap-stytle-aops",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/micro/style/solution/alcap-style-aops/index.css",
			"package": "{\r\n\t\"name\": \"@micro-style-solution/alcap-stytle-aops\",\r\n\t\"version\": \"1.0.0\",\r\n\t\"description\": \"低代码平台aops公共样式库\",\r\n\t\"main\": \"index.css\",\r\n\t\"scripts\": {\r\n\t\t\"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n\t},\r\n\t\"author\": \"\",\r\n\t\"license\": \"ISC\",\r\n\t\"dependencies\": {}\r\n}"
		},
		{
			"name": "@alcap-component/v2-a-article",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/v2Components/v2-a-article/index.vue",
			"package": "{\r\n  \"docs\": {\r\n    \"name\": \"文章\",\r\n    \"detail\": \"文章\",\r\n    \"href\": \"v2-a-article\",\r\n    \"__wrapper\": \"v2cpt\",\r\n    \"type\": \"base\",\r\n    \"icon\": \"icontongyong\",\r\n    \"accept\": [\r\n      \"page\"\r\n    ],\r\n    \"schemaType\": \"contentString\",\r\n    \"option\": [\r\n      {\r\n        \"name\": \"content\",\r\n        \"desp\": \"自定义\",\r\n        \"defaultValue\": {\r\n          \"entityId\": \"\",\r\n          \"value\": \"\",\r\n          \"syncParam\": \"\",\r\n          \"type\": \"entity\"\r\n        },\r\n        \"type\": \"custom_component\",\r\n        \"details\": \"自定义\",\r\n        \"component\": \"v2-a-article-edit\"\r\n      }\r\n    ],\r\n    \"slot\": [],\r\n    \"events\": [],\r\n    \"style\": {\r\n      \"width\": \"100%\",\r\n      \"height\": \"100%\"\r\n    }\r\n  },\r\n  \"main\": \"index.vue\",\r\n  \"noUse\": false,\r\n  \"scripts\": {\r\n    \"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n  },\r\n  \"author\": \"zhangzexin01@agree.com.cn\",\r\n  \"license\": \"ISC\",\r\n  \"name\": \"@alcap-component/v2-a-article\",\r\n  \"version\": \"1.0.0\",\r\n  \"description\": \"文章\"\r\n}\r\n"
		},
		{
			"name": "@alcap-component/v2-a-auto-complete",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/v2Components/v2-a-auto-complete/index.vue",
			"package": "{\r\n  \"docs\": {\r\n    \"name\": \"带提示输入框\",\r\n    \"detail\": \"带提示输入框\",\r\n    \"href\": \"v2-a-auto-complete\",\r\n    \"__wrapper\": \"v2cpt\",\r\n    \"type\": \"base\",\r\n    \"icon\": \"icontongyong\",\r\n    \"accept\": [\"page\"],\r\n    \"schemaType\": \"ALCAP_LIST\",\r\n    \"option\": [\r\n      {\r\n        \"name\": \"entityId\",\r\n        \"codeLessType\": \"dto\",\r\n        \"desp\": \"实体\",\r\n        \"type\": \"string_dto\",\r\n        \"details\": \"实体\",\r\n        \"defaultValue\": \"\"\r\n      },\r\n      {\r\n        \"name\": \"label\",\r\n        \"codeLessType\":\"label\",\r\n        \"desp\": \"显示字段\",\r\n        \"type\": \"string_label\",\r\n        \"details\": \"显示字段\",\r\n        \"defaultValue\": \"\"\r\n      },\r\n      {\r\n        \"name\": \"placeholder\",\r\n        \"desp\": \"输入框占位文本\",\r\n        \"type\": \"string_input\",\r\n        \"details\": \"输入框占位文本\",\r\n        \"defaultValue\": \"\"\r\n      },\r\n      {\r\n        \"name\": \"value\",\r\n        \"desp\": \"当前选中的条目\",\r\n        \"type\": \"string_input\",\r\n        \"details\": \"当前选中的条目\",\r\n        \"defaultValue\": \"\",\r\n        \"sync\": true\r\n      }\r\n    ],\r\n    \"slot\": [],\r\n    \"events\": []\r\n  },\r\n  \"main\": \"index.vue\",\r\n  \"noUse\": false,\r\n  \"scripts\": {\r\n    \"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n  },\r\n  \"author\": \"zhangzexin01@agree.com.cn\",\r\n  \"license\": \"ISC\",\r\n  \"name\": \"@alcap-component/v2-a-auto-complete\",\r\n  \"version\": \"1.0.0\",\r\n  \"description\": \"带提示输入框\"\r\n}\r\n"
		},
		{
			"name": "@alcap-component/v2-a-button-form",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/v2Components/v2-a-button-form/index.vue",
			"package": "{\r\n  \"docs\": {\r\n    \"name\": \"操作按钮\",\r\n    \"detail\": \"操作按钮\",\r\n    \"href\": \"v2-a-button-form\",\r\n    \"__wrapper\": \"v2cpt\",\r\n    \"type\": \"base\",\r\n    \"icon\": \"icontongyong\",\r\n    \"accept\": [\r\n      \"page\"\r\n    ],\r\n    \"option\": [\r\n      {\r\n        \"name\": \"formData\",\r\n        \"desp\": \"自定义\",\r\n        \"defaultValue\": {\r\n          \"opr\": [\r\n            {\r\n              \"name\": \"提交\",\r\n              \"icon\": \"\",\r\n              \"color\": \"\",\r\n              \"isThematic\": true,\r\n              \"type\": {\r\n                \"label\": \"通用方法\",\r\n                \"value\": \"publicMethod\"\r\n              },\r\n              \"entityId\": \"\",\r\n              \"opr\": {\r\n                \"id\": \"confirm\",\r\n                \"name\": \"提交内容\"\r\n              },\r\n              \"wid\": 1\r\n            },\r\n            {\r\n              \"name\": \"重置\",\r\n              \"icon\": \"\",\r\n              \"color\": \"\",\r\n              \"isThematic\": true,\r\n              \"type\": {\r\n                \"label\": \"通用方法\",\r\n                \"value\": \"publicMethod\"\r\n              },\r\n              \"entityId\": \"\",\r\n              \"opr\": {\r\n                \"id\": \"reset\",\r\n                \"name\": \"重置表单\"\r\n              },\r\n              \"wid\": 2\r\n            }\r\n          ]\r\n        },\r\n        \"type\": \"custom_component\",\r\n        \"details\": \"自定义\",\r\n        \"component\": \"v2-a-button-form-edit\"\r\n      }\r\n    ],\r\n    \"slot\": [],\r\n    \"events\": [],\r\n    \"style\": {\r\n      \"width\": \"100%\",\r\n      \"height\": \"50px\"\r\n    }\r\n  },\r\n  \"main\": \"index.vue\",\r\n  \"noUse\": false,\r\n  \"scripts\": {\r\n    \"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n  },\r\n  \"author\": \"zhangzexin01@agree.com.cn\",\r\n  \"license\": \"ISC\",\r\n  \"name\": \"@alcap-component/v2-a-button-form\",\r\n  \"version\": \"1.0.0\",\r\n  \"description\": \"按钮\"\r\n}\r\n"
		},
		{
			"name": "@alcap-component/v2-a-button-page",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/v2Components/v2-a-button-page/index.vue",
			"package": "{\r\n  \"docs\": {\r\n    \"name\": \"按钮\",\r\n    \"detail\": \"按钮\",\r\n    \"href\": \"v2-a-button-page\",\r\n    \"__wrapper\": \"v2cpt\",\r\n    \"type\": \"base\",\r\n    \"icon\": \"icontongyong\",\r\n    \"accept\": [\"page\"],\r\n    \"option\": [\r\n      {\r\n        \"name\": \"title\",\r\n        \"desp\": \"标题\",\r\n        \"type\": \"string_input\",\r\n        \"details\": \"标题\",\r\n        \"defaultValue\": \"按钮\"\r\n      },\r\n      {\r\n        \"name\": \"page\",\r\n        \"desp\": \"页面\",\r\n        \"type\": \"string_page\",\r\n        \"details\": \"页面\",\r\n        \"defaultValue\": {}\r\n      },\r\n      {\r\n        \"name\": \"type\",\r\n        \"desp\": \"类型\",\r\n        \"type\": \"string_select\",\r\n        \"details\": \"类型\",\r\n        \"defaultValue\": \"primary\",\r\n        \"doc\": \"#\",\r\n        \"valueArray\": [\r\n          \"primary\",\r\n          \"success\",\r\n          \"warning\",\r\n          \"danger\",\r\n          \"info\",\r\n          \"text\"\r\n        ],\r\n        \"despArray\": [\r\n          \"主题\",\r\n          \"成功\",\r\n          \"警告\",\r\n          \"危险\",\r\n          \"普通\",\r\n          \"文字\"\r\n        ]\r\n      },\r\n      {\r\n        \"name\": \"size\",\r\n        \"desp\": \"尺寸\",\r\n        \"type\": \"string_select\",\r\n        \"details\": \"尺寸\",\r\n        \"defaultValue\": \"mini\",\r\n        \"doc\": \"#\",\r\n        \"valueArray\": [\r\n          \"medium\",\r\n          \"small\",\r\n          \"mini\"\r\n        ],\r\n        \"despArray\": [\r\n          \"中等\",\r\n          \"小\",\r\n          \"迷你\"\r\n        ]\r\n      }\r\n      \r\n    ],\r\n    \"slot\": [],\r\n    \"events\": []\r\n  },\r\n  \"main\": \"index.vue\",\r\n  \"noUse\": false,\r\n  \"scripts\": {\r\n    \"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n  },\r\n  \"author\": \"zhangzexin01@agree.com.cn\",\r\n  \"license\": \"ISC\",\r\n  \"name\": \"@alcap-component/v2-a-button-page\",\r\n  \"version\": \"1.0.0\",\r\n  \"description\": \"按钮\"\r\n}\r\n"
		},
		{
			"name": "@alcap-component/v2-a-cascader",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/v2Components/v2-a-cascader/index.vue",
			"package": "{\r\n  \"docs\": {\r\n    \"name\": \"级联选择\",\r\n    \"detail\": \"级联选择\",\r\n    \"href\": \"v2-a-cascader\",\r\n    \"__wrapper\": \"v2cpt\",\r\n    \"type\": \"form\",\r\n    \"icon\": \"icontongyong\",\r\n    \"accept\": [\"page\"],\r\n    \"schemaType\": \"ALCAP_LIST\",\r\n    \"option\": [\r\n      {\r\n        \"name\": \"entityId\",\r\n        \"codeLessType\":\"dto\",\r\n        \"desp\": \"实体\",\r\n        \"type\": \"string_dto\",\r\n        \"details\": \"实体\",\r\n        \"defaultValue\": \"\"\r\n      },\r\n      {\r\n        \"name\": \"placeholder\",\r\n        \"desp\": \"输入框占位文本\",\r\n        \"type\": \"string_input\",\r\n        \"details\": \"输入框占位文本\",\r\n        \"defaultValue\": \"请选择\"\r\n      },\r\n      {\r\n        \"name\": \"value\",\r\n        \"desp\": \"选择框内容\",\r\n        \"type\": \"string_input\",\r\n        \"details\": \"选择框内容\",\r\n        \"defaultValue\": \"\",\r\n        \"sync\": true\r\n      },\r\n      {\r\n        \"name\": \"label\",\r\n        \"codeLessType\":\"label\",\r\n        \"desp\": \"显示字段\",\r\n        \"type\": \"string_label\",\r\n        \"details\": \"显示字段\",\r\n        \"defaultValue\": \"\"\r\n      },\r\n      {\r\n        \"name\": \"labelValue\",\r\n        \"codeLessType\":\"labelValue\",\r\n        \"desp\": \"显示字段值\",\r\n        \"type\": \"string_label\",\r\n        \"details\": \"显示字段值\",\r\n        \"defaultValue\": \"\"\r\n      },\r\n      {\r\n        \"name\": \"parentId\",\r\n        \"codeLessType\":\"parentId\",\r\n        \"desp\": \"父字段\",\r\n        \"type\": \"string_label\",\r\n        \"details\": \"父字段\",\r\n        \"defaultValue\": \"\"\r\n      },\r\n      {\r\n        \"name\": \"syncParam\",\r\n        \"desp\": \"\",\r\n        \"details\": \"\",\r\n        \"defaultValue\": {}\r\n      }\r\n    ],\r\n    \"slot\": [],\r\n    \"events\": [],\r\n    \"style\": {\r\n      \"height\": \"30px\"\r\n    }\r\n  },\r\n  \"main\": \"index.vue\",\r\n  \"noUse\": false,\r\n  \"scripts\": {\r\n    \"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n  },\r\n  \"author\": \"zhangzexin01@agree.com.cn\",\r\n  \"license\": \"ISC\",\r\n  \"name\": \"@alcap-component/v2-a-cascader\",\r\n  \"version\": \"1.0.0\",\r\n  \"description\": \"级联选择\"\r\n}\r\n"
		},
		{
			"name": "@alcap-component/v2-a-checkbox",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/v2Components/v2-a-checkbox/index.vue",
			"package": "{\r\n  \"docs\": {\r\n    \"name\": \"复选框\",\r\n    \"detail\": \"复选框\",\r\n    \"href\": \"v2-a-checkbox\",\r\n    \"__wrapper\": \"v2cpt\",\r\n    \"type\": \"form\",\r\n    \"icon\": \"icontongyong\",\r\n    \"accept\": [\"page\"],\r\n    \"schemaType\": \"ALCAP_LIST\",\r\n    \"option\": [\r\n      {\r\n        \"name\": \"checkboxType\",\r\n        \"desp\": \"样式\",\r\n        \"codeLessType\":\"handleChange\",\r\n        \"defaultValue\": \"el-checkbox\",\r\n        \"type\": \"string_select\",\r\n        \"doc\": \"#\",\r\n        \"valueArray\": [\r\n          \"el-checkbox\",\r\n          \"el-checkbox-button\"\r\n        ],\r\n        \"despArray\": [\r\n          \"初始\",\r\n          \"按钮\"\r\n        ]\r\n      },\r\n      {\r\n        \"name\": \"dataSource\",\r\n        \"desp\": \"数据源\",\r\n        \"codeLessType\":\"handleChange\",\r\n        \"defaultValue\": \"entityId\",\r\n        \"type\": \"string_select\",\r\n        \"doc\": \"#\",\r\n        \"valueArray\": [\r\n          \"entityId\",\r\n          \"enumCode\"\r\n        ],\r\n        \"despArray\": [\r\n          \"实体\",\r\n          \"枚举\"\r\n        ]\r\n      },\r\n      {\r\n        \"name\": \"enumCode\",\r\n        \"codeLessType\":\"enum\",\r\n        \"desp\": \"枚举数据源\",\r\n        \"type\": \"string_code\",\r\n        \"details\": \"枚举数据源\",\r\n        \"defaultValue\": \"\"\r\n      },\r\n      {\r\n        \"name\": \"entityId\",\r\n        \"codeLessType\":\"dto\",\r\n        \"desp\": \"实体\",\r\n        \"type\": \"string_dto\",\r\n        \"exclude\": [ \"data_factory\" ],\r\n        \"details\": \"实体\",\r\n        \"defaultValue\": \"\"\r\n      },\r\n      {\r\n        \"name\": \"label\",\r\n        \"codeLessType\":\"label\",\r\n        \"desp\": \"显示字段\",\r\n        \"type\": \"string_label\",\r\n        \"details\": \"显示字段\",\r\n        \"defaultValue\": \"\"\r\n      },\r\n      {\r\n        \"name\": \"labelValue\",\r\n        \"codeLessType\":\"labelValue\",  \r\n        \"desp\": \"显示字段值\",\r\n        \"type\": \"string_label\",\r\n        \"details\": \"显示字段值\",\r\n        \"defaultValue\": \"\"\r\n      },\r\n      {\r\n        \"name\": \"syncParam\",\r\n        \"desp\": \"\",\r\n        \"details\": \"\",\r\n        \"defaultValue\": {}\r\n      }\r\n    ],\r\n    \"slot\": [],\r\n    \"events\": [],\r\n    \"style\": {\r\n      \"height\": \"30px\"\r\n    }\r\n  },\r\n  \"main\": \"index.vue\",\r\n  \"noUse\": false,\r\n  \"scripts\": {\r\n    \"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n  },\r\n  \"author\": \"zhangzexin01@agree.com.cn\",\r\n  \"license\": \"ISC\",\r\n  \"name\": \"@alcap-component/v2-a-checkbox\",\r\n  \"version\": \"1.0.0\",\r\n  \"description\": \"复选框\"\r\n}\r\n"
		},
		{
			"name": "@alcap-component/v2-a-checkbox-item",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/v2Components/v2-a-checkbox-item/index.vue",
			"package": "{\r\n  \"docs\": {\r\n    \"name\": \"单选确认框\",\r\n    \"detail\": \"单选确认框\",\r\n    \"href\": \"v2-a-checkbox-item\",\r\n    \"__wrapper\": \"v2cpt\",\r\n    \"type\": \"form\",\r\n    \"icon\": \"icontongyong\",\r\n    \"accept\": [\r\n      \"page\"\r\n    ],\r\n    \"option\": [\r\n      {\r\n        \"name\": \"value\",\r\n        \"desp\": \"指定选中的选项\",\r\n        \"type\": \"boolean\",\r\n        \"details\": \"指定选中的选项\",\r\n        \"defaultValue\": false,\r\n        \"sync\": true\r\n      },\r\n      {\r\n        \"name\": \"label\",\r\n        \"desp\": \"选项标题\",\r\n        \"type\": \"string_input\",\r\n        \"details\": \"选项标题\",\r\n        \"defaultValue\": \"\"\r\n      },\r\n      {\r\n        \"name\": \"tip\",\r\n        \"desp\": \"确认提示文本\",\r\n        \"type\": \"string_input\",\r\n        \"details\": \"确认提示文本\",\r\n        \"defaultValue\": \"\"\r\n      },\r\n      {\r\n        \"name\": \"syncParam\",\r\n        \"desp\": \"\",\r\n        \"details\": \"\",\r\n        \"defaultValue\": {}\r\n      }\r\n    ],\r\n    \"slot\": [],\r\n    \"events\": [],\r\n    \"style\": {\r\n      \"height\": \"30px\"\r\n    }\r\n  },\r\n  \"main\": \"index.vue\",\r\n  \"noUse\": false,\r\n  \"scripts\": {\r\n    \"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n  },\r\n  \"author\": \"zhanghaixian@agree.com.cn\",\r\n  \"license\": \"ISC\",\r\n  \"name\": \"@alcap-component/v2-a-checkbox-item\",\r\n  \"version\": \"1.0.0\",\r\n  \"description\": \"单选确认框\"\r\n}\r\n"
		},
		{
			"name": "@alcap-component/v2-a-container",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/v2Components/v2-a-container/index.vue",
			"package": "{\r\n  \"docs\": {\r\n    \"name\": \"容器\",\r\n    \"detail\": \"容器\",\r\n    \"href\": \"v2-a-container\",\r\n    \"__wrapper\": \"v2cpt\",\r\n    \"icon\": \"icontongyong\",\r\n    \"accept\": [\r\n      \"page\",\r\n      \"workbench\"\r\n    ],\r\n    \"schemaType\": \"\",\r\n    \"option\": [],\r\n    \"slot\": [],\r\n    \"events\": [],\r\n    \"style\": {\r\n      \"width\": \"100%\",\r\n      \"height\": \"100%\"\r\n    }\r\n  },\r\n  \"description\": \"容器\",\r\n  \"name\": \"@alcap-component/v2-a-container\",\r\n  \"version\": \"1.0.0\"\r\n}"
		},
		{
			"name": "@alcap-component/v2-a-dashboard1",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/v2Components/v2-a-dashboard1/index.vue",
			"package": "{\r\n      \"docs\": {\r\n            \"name\": \"仪表盘-1\",\r\n            \"detail\": \"仪表盘-1\",\r\n            \"href\": \"v2-a-dashboard1\",\r\n            \"__wrapper\": \"v2cpt\",\r\n            \"type\": \"dashboard\",\r\n            \"icon\": \"icontongyong\",\r\n            \"accept\": [\"page\"],\r\n            \"option\": [\r\n              {\r\n                \"name\": \"showData\",\r\n                \"desp\": \"数据展示\",\r\n                \"type\": \"object\",\r\n                \"details\": \"数据展示\",\r\n                \"defaultValue\": {\r\n                  \"title\": \"应用群组\",\r\n                  \"total\": \"3726\",\r\n                  \"value1\": \"78\",\r\n                  \"value2\": \"0\"\r\n                },\r\n                \"attrInEachElement\": [\r\n                  {\r\n                    \"name\": \"title\",\r\n                    \"desp\": \"标题\",\r\n                    \"type\": \"string_input\",\r\n                    \"details\": \"标题\",\r\n                    \"defaultValue\": \"应用群组\"\r\n                  },\r\n                  {\r\n                    \"name\": \"value1\",\r\n                    \"desp\": \"成功率\",\r\n                    \"type\": \"string_input\",\r\n                    \"details\": \"成功率\",\r\n                    \"defaultValue\": \"78\"\r\n                  },\r\n                  {\r\n                    \"name\": \"value2\",\r\n                    \"desp\": \"失败率\",\r\n                    \"type\": \"string_input\",\r\n                    \"details\": \"失败率\",\r\n                    \"defaultValue\": \"0\"\r\n                  },\r\n                  {\r\n                    \"name\": \"total\",\r\n                    \"desp\": \"总量\",\r\n                    \"type\": \"string_input\",\r\n                    \"details\": \"总量\",\r\n                    \"defaultValue\": \"3726\"\r\n                  }\r\n                ]\r\n              }\r\n              \r\n            ],\r\n            \"slot\": [],\r\n            \"events\": []\r\n      },\r\n      \"description\": \"仪表盘-1\",\r\n      \"name\": \"@alcap-component/v2-a-dashboard1\",\r\n      \"version\": \"1.0.0\"\r\n}"
		},
		{
			"name": "@alcap-component/v2-a-dashboard2",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/v2Components/v2-a-dashboard2/index.vue",
			"package": "{\r\n  \"docs\": {\r\n    \"name\": \"仪表盘-2\",\r\n    \"detail\": \"仪表盘-2\",\r\n    \"href\": \"v2-a-dashboard2\",\r\n    \"__wrapper\": \"v2cpt\",\r\n    \"type\": \"dashboard\",\r\n    \"icon\": \"icontongyong\",\r\n    \"accept\": [\r\n      \"page\"\r\n    ],\r\n    \"option\": [\r\n      {\r\n        \"name\": \"showData\",\r\n        \"desp\": \"数据展示\",\r\n        \"type\": \"object\",\r\n        \"details\": \"数据展示\",\r\n        \"defaultValue\": {\r\n          \"title\": \"应用群组\",\r\n          \"total\": \"3726\",\r\n          \"value1\": \"78\",\r\n          \"value2\": \"0\"\r\n        },\r\n        \"attrInEachElement\": [\r\n          {\r\n            \"name\": \"title\",\r\n            \"desp\": \"标题\",\r\n            \"type\": \"string_input\",\r\n            \"details\": \"标题\",\r\n            \"defaultValue\": \"----\"\r\n          },\r\n          {\r\n            \"name\": \"value\",\r\n            \"desp\": \"成功率\",\r\n            \"type\": \"string_input\",\r\n            \"details\": \"成功率\",\r\n            \"defaultValue\": \"32\"\r\n          },\r\n          {\r\n            \"name\": \"unit\",\r\n            \"desp\": \"失败率\",\r\n            \"type\": \"string_input\",\r\n            \"details\": \"失败率\",\r\n            \"defaultValue\": \"--\"\r\n          },\r\n          {\r\n            \"name\": \"icon\",\r\n            \"desp\": \"图标\",\r\n            \"type\": \"string_input\",\r\n            \"details\": \"图标\",\r\n            \"defaultValue\": \"--\"\r\n          }\r\n        ]\r\n      }\r\n    ],\r\n    \"slot\": [],\r\n    \"events\": []\r\n  },\r\n  \"description\": \"仪表盘-2\",\r\n  \"name\": \"@alcap-component/v2-a-dashboard2\",\r\n  \"version\": \"1.0.0\"\r\n}\r\n"
		},
		{
			"name": "@alcap-component/v2-a-date-picker",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/v2Components/v2-a-date-picker/index.vue",
			"package": "{\r\n  \"docs\": {\r\n    \"name\": \"日期选择框\",\r\n    \"detail\": \"日期选择框\",\r\n    \"href\": \"v2-a-date-picker\",\r\n    \"__wrapper\": \"v2cpt\",\r\n    \"type\": \"form\",\r\n    \"icon\": \"icontongyong\",\r\n    \"accept\": [\"page\"],\r\n    \"option\": [\r\n      {\r\n        \"name\": \"value\",\r\n        \"desp\": \"日期\",\r\n        \"type\": \"string_input\",\r\n        \"details\": \"日期\",\r\n        \"defaultValue\": \"\",\r\n        \"sync\": true\r\n      },\r\n      {\r\n        \"name\": \"valueFormat\",\r\n        \"desp\": \"日期格式\",\r\n        \"codeLessType\": \"valueFormat\",\r\n        \"defaultValue\": \"timestamp\",\r\n        \"type\": \"string_select\",\r\n        \"doc\": \"#\",\r\n        \"valueArray\": [\r\n          \"timestamp\",\r\n          \"yyyy-MM-dd\"\r\n        ],\r\n        \"despArray\": [\r\n          \"时间戳\",\r\n          \"日期\"\r\n        ]\r\n      },\r\n      {\r\n        \"name\": \"syncParam\",\r\n        \"desp\": \"\",\r\n        \"details\": \"\",\r\n        \"defaultValue\": {}\r\n      }\r\n      \r\n    ],\r\n    \"slot\": [],\r\n    \"events\": [],\r\n    \"style\": {\r\n      \"height\": \"30px\"\r\n    }\r\n  },\r\n  \"main\": \"index.vue\",\r\n  \"noUse\": false,\r\n  \"scripts\": {\r\n    \"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n  },\r\n  \"author\": \"zhangzexin01@agree.com.cn\",\r\n  \"license\": \"ISC\",\r\n  \"name\": \"@alcap-component/v2-a-date-picker\",\r\n  \"version\": \"1.0.0\",\r\n  \"description\": \"日期选择框\"\r\n}"
		},
		{
			"name": "@alcap-component/v2-a-date-picker-month",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/v2Components/v2-a-date-picker-month/index.vue",
			"package": "{\r\n  \"docs\": {\r\n    \"name\": \"月份选择框\",\r\n    \"detail\": \"月份选择框\",\r\n    \"href\": \"v2-a-date-picker-month\",\r\n    \"__wrapper\": \"v2cpt\",\r\n    \"type\": \"form\",\r\n    \"icon\": \"icontongyong\",\r\n    \"accept\": [\"page\"],\r\n    \"option\": [\r\n      {\r\n        \"name\": \"value\",\r\n        \"desp\": \"月份\",\r\n        \"type\": \"string_input\",\r\n        \"details\": \"月份\",\r\n        \"defaultValue\": \"\",\r\n        \"sync\": true\r\n      },\r\n      {\r\n        \"name\": \"syncParam\",\r\n        \"desp\": \"\",\r\n        \"details\": \"\",\r\n        \"defaultValue\": {}\r\n      }\r\n    ],\r\n    \"slot\": [],\r\n    \"events\": [],\r\n    \"style\": {\r\n      \"height\": \"30px\"\r\n    }\r\n  },\r\n  \"main\": \"index.vue\",\r\n  \"noUse\": false,\r\n  \"scripts\": {\r\n    \"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n  },\r\n  \"author\": \"zhangzexin01@agree.com.cn\",\r\n  \"license\": \"ISC\",\r\n  \"name\": \"@alcap-component/v2-a-date-picker-month\",\r\n  \"version\": \"1.0.0\",\r\n  \"description\": \"月份选择框\"\r\n}"
		},
		{
			"name": "@alcap-component/v2-a-date-picker-year",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/v2Components/v2-a-date-picker-year/index.vue",
			"package": "{\r\n  \"docs\": {\r\n    \"name\": \"年份选择框\",\r\n    \"detail\": \"年份选择框\",\r\n    \"href\": \"v2-a-date-picker-year\",\r\n    \"__wrapper\": \"v2cpt\",\r\n    \"type\": \"form\",\r\n    \"icon\": \"icontongyong\",\r\n    \"accept\": [\"page\"],\r\n    \"option\": [\r\n      {\r\n        \"name\": \"value\",\r\n        \"desp\": \"年份\",\r\n        \"type\": \"string_input\",\r\n        \"details\": \"年份\",\r\n        \"defaultValue\": \"\",\r\n        \"sync\": true\r\n      },\r\n      {\r\n        \"name\": \"syncParam\",\r\n        \"desp\": \"\",\r\n        \"details\": \"\",\r\n        \"defaultValue\": {}\r\n      }\r\n    ],\r\n    \"slot\": [],\r\n    \"events\": [],\r\n    \"style\": {\r\n      \"height\": \"30px\"\r\n    }\r\n  },\r\n  \"main\": \"index.vue\",\r\n  \"noUse\": false,\r\n  \"scripts\": {\r\n    \"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n  },\r\n  \"author\": \"zhangzexin01@agree.com.cn\",\r\n  \"license\": \"ISC\",\r\n  \"name\": \"@alcap-component/v2-a-date-picker-year\",\r\n  \"version\": \"1.0.0\",\r\n  \"description\": \"年份选择框\"\r\n}"
		},
		{
			"name": "@alcap-component/v2-a-ebank-footer",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/v2Components/v2-a-ebank-footer/index.vue",
			"package": "{\r\n  \"docs\": {\r\n      \"name\": \"底部信息\",\r\n      \"detail\": \"底部信息\",\r\n      \"href\": \"v2-a-ebank-footer\",\r\n      \"__wrapper\": \"v2cpt\",\r\n      \"type\": \"work\",\r\n      \"icon\": \"icontongyong\",\r\n      \"accept\": [\r\n          \"workbench\", \"page\" \r\n      ],\r\n      \"option\": [],\r\n      \"slot\": [],\r\n      \"events\": []\r\n  },\r\n  \"description\": \"底部信息\",\r\n  \"name\": \"@alcap-component/v2-a-ebank-footer\",\r\n  \"version\": \"1.0.0\"\r\n}\r\n"
		},
		{
			"name": "@alcap-component/v2-a-editor",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/v2Components/v2-a-editor/index.vue",
			"package": "{\r\n  \"docs\": {\r\n    \"name\": \"富文本编辑器\",\r\n    \"detail\": \"富文本编辑器\",\r\n    \"href\": \"v2-a-editor\",\r\n    \"__wrapper\": \"v2cpt\",\r\n    \"type\": \"form\",\r\n    \"icon\": \"icontongyong\",\r\n    \"accept\": [\"page\"],\r\n    \"option\": [\r\n      {\r\n        \"name\": \"value\",\r\n        \"desp\": \"文本\",\r\n        \"type\": \"string_input\",\r\n        \"details\": \"文本\",\r\n        \"defaultValue\": \"\",\r\n        \"sync\": true\r\n      },\r\n      {\r\n        \"name\": \"syncParam\",\r\n        \"desp\": \"\",\r\n        \"details\": \"\",\r\n        \"defaultValue\": {}\r\n      }\r\n    ],\r\n    \"slot\": [],\r\n    \"events\": [],\r\n    \"style\": {\r\n      \"height\": \"200px\"\r\n    }\r\n  },\r\n  \"main\": \"index.vue\",\r\n  \"noUse\": false,\r\n  \"scripts\": {\r\n    \"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n  },\r\n  \"author\": \"zhangzexin01@agree.com.cn\",\r\n  \"license\": \"ISC\",\r\n  \"name\": \"@alcap-component/v2-a-editor\",\r\n  \"version\": \"1.0.0\",\r\n  \"description\": \"富文本编辑器\"\r\n}"
		},
		{
			"name": "@alcap-component/v2-a-form-config",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/v2Components/v2-a-form-config/index.vue",
			"package": "{\r\n\t\"docs\": {\r\n\t\t\"name\": \"配置表单组件\",\r\n\t\t\"detail\": \"配置表单组件\",\r\n\t\t\"href\": \"v2-a-form-config\",\r\n\t\t\"__wrapper\": \"v2cpt\",\r\n    \"type\": \"preset\",\r\n\t\t\"icon\": \"icontongyong\",\r\n    \"accept\": [\"page\"],\r\n\t\t\"option\": [\r\n\t\t\t{\r\n\t\t\t\t\"name\": \"formData\",\r\n\t\t\t\t\"desp\": \"表单数据配置\",\r\n\t\t\t\t\"type\": \"custom_component\",\r\n\t\t\t\t\"details\": \"表单数据配置\",\r\n\t\t\t\t\"component\": \"v2-a-form-config-edit\",\r\n\t\t\t\t\"defaultValue\": {}\r\n\t\t\t}\r\n\t\t],\r\n\t\t\"slot\": [],\r\n\t\t\"events\": [],\r\n    \"style\": {\r\n      \"width\": \"100%\",\r\n      \"height\": \"100%\"\r\n    },\r\n    \"children\": [\r\n      {\r\n        \"href\": \"v2-a-input\",\r\n        \"wid\": 3\r\n      }\r\n    ]\r\n\t},\r\n\t\"main\": \"index.vue\",\r\n\t\"noUse\": false,\r\n\t\"scripts\": {\r\n\t\t\"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n\t},\r\n\t\"author\": \"zhangzexin01@agree.com.cn\",\r\n\t\"license\": \"ISC\",\r\n\t\"name\": \"@alcap-component/v2-a-form-config\",\r\n\t\"version\": \"1.0.0\",\r\n\t\"description\": \"配置表单组件\"\r\n}"
		},
		{
			"name": "@alcap-component/v2-a-form-notice",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/v2Components/v2-a-form-notice/index.vue",
			"package": "{\r\n  \"docs\": {\r\n    \"name\": \"须知\",\r\n    \"detail\": \"须知\",\r\n    \"href\": \"v2-a-form-notice\",\r\n    \"__wrapper\": \"v2cpt\",\r\n    \"type\": \"form\",\r\n    \"icon\": \"icontongyong\",\r\n    \"accept\": [\r\n      \"page\"\r\n    ],\r\n    \"schemaType\": \"contentString\",\r\n    \"option\": [\r\n      {\r\n        \"name\": \"textarea\",\r\n        \"desp\": \"文本内容\",\r\n        \"defaultValue\": \"\",\r\n        \"type\": \"textarea\",\r\n        \"details\": \"文本内容\"\r\n      },\r\n      {\r\n        \"name\": \"value\",\r\n        \"desp\": \"确认\",\r\n        \"type\": \"string_input\",\r\n        \"details\": \"确认\",\r\n        \"defaultValue\": \"\",\r\n        \"sync\": true\r\n      },\r\n      {\r\n        \"name\": \"dialogContent\",\r\n        \"desp\": \"弹窗内容\",\r\n        \"type\": \"textarea\",\r\n        \"details\": \"弹窗内容\",\r\n        \"defaultValue\": \"\"\r\n      },\r\n      {\r\n        \"name\": \"title\",\r\n        \"desp\": \"协议名称\",\r\n        \"type\": \"string_input\",\r\n        \"details\": \"协议名称\",\r\n        \"defaultValue\": \"汇款须知\"\r\n      },\r\n      {\r\n        \"name\": \"syncParam\",\r\n        \"desp\": \"\",\r\n        \"details\": \"\",\r\n        \"defaultValue\": {}\r\n      }\r\n    ],\r\n    \"slot\": [],\r\n    \"events\": [],\r\n    \"style\": {\r\n      \"width\": \"100%\",\r\n      \"height\": \"300px\"\r\n    }\r\n  },\r\n  \"main\": \"index.vue\",\r\n  \"noUse\": false,\r\n  \"scripts\": {\r\n    \"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n  },\r\n  \"author\": \"zhangzexin01@agree.com.cn\",\r\n  \"license\": \"ISC\",\r\n  \"name\": \"@alcap-component/v2-a-form-notice\",\r\n  \"version\": \"1.0.0\",\r\n  \"description\": \"须知\"\r\n}\r\n"
		},
		{
			"name": "@alcap-component/v2-a-form-search",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/v2Components/v2-a-form-search/index.vue",
			"package": "{\r\n  \"docs\": {\r\n    \"name\": \"查询表格组件\",\r\n    \"detail\": \"查询表格组件\",\r\n    \"href\": \"v2-a-form-search\",\r\n    \"__wrapper\": \"v2cpt\",\r\n    \"type\": \"preset\",\r\n    \"icon\": \"icontongyong\",\r\n    \"accept\": [\r\n      \"page\"\r\n    ],\r\n    \"option\": [\r\n      {\r\n        \"name\": \"formData\",\r\n        \"desp\": \"表单数据配置\",\r\n        \"type\": \"custom_component\",\r\n        \"details\": \"表单数据配置\",\r\n        \"component\": \"v2-a-form-search-edit\",\r\n        \"defaultValue\": {\r\n          \"entityId\": \"\",\r\n          \"name\": \"\",\r\n          \"desc\": \"\",\r\n          \"filter\": [\r\n            {\r\n              \"component\": {\r\n                \"component\": \"v2-a-input\",\r\n                \"href\": \"v2-a-input\",\r\n                \"maxLength\": \"255\",\r\n                \"name\": \"输入框\",\r\n                \"placeholder\": \"\",\r\n                \"type\": \"text\",\r\n                \"value\": \"\",\r\n                \"disabled\": false,\r\n                \"syncParam\": {}\r\n              },\r\n              \"code\": \"\",\r\n              \"type\": \"string\",\r\n              \"dictionaryItem\": {\r\n                \"id\": \"entity-field-0o8KffYC\",\r\n                \"name\": \"姓名\",\r\n                \"engNameShort\": \"name\",\r\n                \"validationRuleType\": {\r\n                  \"validations\": []\r\n                }\r\n              },\r\n              \"id\": \"entity-field-0o8KffYC\",\r\n              \"primaryKey\": \"0\",\r\n              \"effectFields\": {}\r\n            },\r\n            {\r\n              \"component\": {\r\n                \"component\": \"v2-a-input\",\r\n                \"href\": \"v2-a-input\",\r\n                \"maxLength\": \"255\",\r\n                \"name\": \"输入框\",\r\n                \"placeholder\": \"\",\r\n                \"type\": \"text\",\r\n                \"value\": \"\",\r\n                \"disabled\": false,\r\n                \"syncParam\": {}\r\n              },\r\n              \"code\": \"\",\r\n              \"type\": \"string\",\r\n              \"dictionaryItem\": {\r\n                \"id\": \"entity-field-Pntlto12\",\r\n                \"name\": \"年龄\",\r\n                \"engNameShort\": \"age\",\r\n                \"validationRuleType\": {\r\n                  \"validations\": []\r\n                }\r\n              },\r\n              \"id\": \"entity-field-Pntlto12\",\r\n              \"primaryKey\": \"1\",\r\n              \"effectFields\": {}\r\n            }\r\n          ],\r\n          \"tabsFilter\": {\r\n            \"options\": [],\r\n            \"maxShowLimit\": 4,\r\n            \"showRecordNum\": false\r\n          },\r\n          \"checkboxFilter\": {\r\n            \"options\": []\r\n          },\r\n          \"groupMenu\": {\r\n            \"menuProto\": \"\",\r\n            \"displayType\": \"\",\r\n            \"secondId\": \"\",\r\n            \"mainProto\": \"\",\r\n            \"secondProto\": \"\"\r\n          },\r\n          \"tableAssignRow\": {\r\n            \"fields\": []\r\n          },\r\n          \"tablePro\": [\r\n            {\r\n              \"component\": \"文本\",\r\n              \"code\": \"\",\r\n              \"type\": \"string\",\r\n              \"dictionaryItem\": {\r\n                \"id\": \"entity-field-f21CyDp0\",\r\n                \"name\": \"年龄\",\r\n                \"engNameShort\": \"age\",\r\n                \"validationRuleType\": {\r\n                  \"validations\": []\r\n                }\r\n              },\r\n              \"id\": \"entity-field-f21CyDp0\",\r\n              \"primaryKey\": \"0\"\r\n            },\r\n            {\r\n              \"component\": \"文本\",\r\n              \"code\": \"\",\r\n              \"type\": \"string\",\r\n              \"dictionaryItem\": {\r\n                \"id\": \"entity-field-Pntlto12\",\r\n                \"name\": \"姓名\",\r\n                \"engNameShort\": \"name\",\r\n                \"validationRuleType\": {\r\n                  \"validations\": []\r\n                }\r\n              },\r\n              \"id\": \"entity-field-Pntlto12\",\r\n              \"primaryKey\": \"1\"\r\n            }\r\n          ],\r\n          \"tableOpr\": [],\r\n          \"tableTip\": {\r\n            \"type\": \"text\",\r\n            \"content\": \"\"\r\n          },\r\n          \"opr\": [],\r\n          \"queryUrl\": \"\",\r\n          \"updateUrl\": \"\",\r\n          \"deleteUrl\": \"\",\r\n          \"display\": \"\"\r\n        }\r\n      }\r\n    ],\r\n    \"slot\": [],\r\n    \"events\": [],\r\n    \"style\": {\r\n      \"width\": \"100%\",\r\n      \"height\": \"100%\"\r\n    },\r\n    \"children\": [\r\n      {\r\n        \"href\": \"v2-a-input\",\r\n        \"wid\": 1\r\n      },\r\n      {\r\n        \"href\": \"v2-a-table\",\r\n        \"wid\": 2\r\n      }\r\n    ]\r\n  },\r\n  \"main\": \"index.vue\",\r\n  \"noUse\": false,\r\n  \"scripts\": {\r\n    \"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n  },\r\n  \"author\": \"zhangzexin01@agree.com.cn\",\r\n  \"license\": \"ISC\",\r\n  \"name\": \"@alcap-component/v2-a-form-search\",\r\n  \"version\": \"1.0.0\",\r\n  \"description\": \"查询表格组件\"\r\n}\r\n"
		},
		{
			"name": "@alcap-component/v2-a-img",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/v2Components/v2-a-img/index.vue",
			"package": "{\r\n  \"docs\": {\r\n    \"name\": \"图片\",\r\n    \"detail\": \"图片\",\r\n    \"href\": \"v2-a-img\",\r\n    \"__wrapper\": \"v2cpt\",\r\n    \"type\": \"base\",\r\n    \"icon\": \"icontongyong\",\r\n    \"accept\": [\"page\"],\r\n    \"option\": [\r\n      {\r\n        \"name\": \"src\",\r\n        \"desp\": \"图片内容\",\r\n        \"type\": \"dialog_input\",\r\n        \"details\": \"图片或者图标地址\",\r\n        \"dialogType\":\"picture\",\r\n        \"defaultValue\": \"\",\r\n        \"require\":{\r\n          \"dataType\":\"picture\"\r\n        }\r\n      },\r\n      {\r\n        \"name\": \"alt\",\r\n        \"desp\": \"图像的替代文本\",\r\n        \"type\": \"string_input\",\r\n        \"details\": \"图像的替代文本\",\r\n        \"defaultValue\": \"\"\r\n      }\r\n    ],\r\n    \"slot\": [],\r\n    \"events\": []\r\n  },\r\n  \"description\": \"图片(ant)\",\r\n  \"name\": \"@alcap-component/v2-a-img\",\r\n  \"version\": \"1.0.0\"\r\n}"
		},
		{
			"name": "@alcap-component/v2-a-input",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/v2Components/v2-a-input/index.vue",
			"package": "{\r\n  \"docs\": {\r\n    \"name\": \"输入框\",\r\n    \"detail\": \"输入框\",\r\n    \"href\": \"v2-a-input\",\r\n    \"__wrapper\": \"v2cpt\",\r\n    \"type\": \"form\",\r\n    \"icon\": \"icontongyong\",\r\n    \"accept\": [\"page\"],\r\n    \"option\": [\r\n      {\r\n        \"name\": \"maxLength\",\r\n        \"desp\": \"最大长度\",\r\n        \"type\": \"string_input\",\r\n        \"details\": \"最大长度\",\r\n        \"defaultValue\": \"255\"\r\n      },\r\n      {\r\n        \"name\": \"type\",\r\n        \"desp\": \"声明 input 类型\",\r\n        \"type\": \"string_input\",\r\n        \"details\": \"声明 input 类型，同原生 input 标签的 type 属性\",\r\n        \"defaultValue\": \"text\"\r\n      },\r\n      {\r\n        \"name\": \"value\",\r\n        \"desp\": \"输入框内容\",\r\n        \"type\": \"string_input\",\r\n        \"details\": \"输入框内容\",\r\n        \"defaultValue\": \"\",\r\n        \"sync\": true\r\n      },\r\n      {\r\n        \"name\": \"disabled\",\r\n        \"desp\": \"是否禁用\",\r\n        \"type\": \"boolean\",\r\n        \"details\": \"是否禁用状态，默认为 false\",\r\n        \"defaultValue\": false\r\n      },\r\n      {\r\n        \"name\": \"placeholder\",\r\n        \"desp\": \"输入框占位文本\",\r\n        \"type\": \"string_input\",\r\n        \"details\": \"输入框占位文本\",\r\n        \"defaultValue\": \"请输入\"\r\n      },\r\n      {\r\n        \"name\": \"syncParam\",\r\n        \"desp\": \"\",\r\n        \"details\": \"\",\r\n        \"defaultValue\": {}\r\n      }\r\n    ],\r\n    \"slot\": [],\r\n    \"events\": [],\r\n    \"style\": {\r\n      \"height\": \"30px\"\r\n    }\r\n  },\r\n  \"main\": \"index.vue\",\r\n  \"noUse\": false,\r\n  \"scripts\": {\r\n    \"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n  },\r\n  \"author\": \"zhangzexin01@agree.com.cn\",\r\n  \"license\": \"ISC\",\r\n  \"name\": \"@alcap-component/v2-a-input\",\r\n  \"version\": \"1.0.0\",\r\n  \"description\": \"输入框\"\r\n}\r\n"
		},
		{
			"name": "@alcap-component/v2-a-input-account",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/v2Components/v2-a-input-account/index.vue",
			"package": "{\r\n  \"docs\": {\r\n    \"name\": \"账号输入框\",\r\n    \"detail\": \"账号输入框\",\r\n    \"href\": \"v2-a-input-account\",\r\n    \"__wrapper\": \"v2cpt\",\r\n    \"type\": \"form\",\r\n    \"icon\": \"icontongyong\",\r\n    \"accept\": [\r\n      \"page\"\r\n    ],\r\n    \"option\": [\r\n      {\r\n        \"name\": \"value\",\r\n        \"desp\": \"输入框内容\",\r\n        \"type\": \"string_input\",\r\n        \"details\": \"输入框内容\",\r\n        \"defaultValue\": \"\",\r\n        \"sync\": true\r\n      },\r\n      {\r\n        \"name\": \"syncParam\",\r\n        \"desp\": \"\",\r\n        \"details\": \"\",\r\n        \"defaultValue\": {}\r\n      }\r\n    ],\r\n    \"slot\": [],\r\n    \"events\": [],\r\n    \"style\": {\r\n      \"height\": \"30px\"\r\n    }\r\n  },\r\n  \"main\": \"index.vue\",\r\n  \"noUse\": false,\r\n  \"scripts\": {\r\n    \"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n  },\r\n  \"author\": \"lvchengzhang@agree.com.cn\",\r\n  \"license\": \"ISC\",\r\n  \"name\": \"@alcap-component/v2-a-input-account\",\r\n  \"version\": \"1.0.0\",\r\n  \"description\": \"账号输入框\"\r\n}\r\n"
		},
		{
			"name": "@alcap-component/v2-a-input-dialog",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/v2Components/v2-a-input-dialog/index.vue",
			"package": "{\r\n  \"docs\": {\r\n    \"name\": \"带弹窗输入框\",\r\n    \"detail\": \"带弹窗输入框\",\r\n    \"href\": \"v2-a-input-dialog\",\r\n    \"__wrapper\": \"v2cpt\",\r\n    \"type\": \"form\",\r\n    \"schemaType\": \"ALCAP_PAGEING\",\r\n    \"icon\": \"icontongyong\",\r\n    \"accept\": [\r\n      \"page\"\r\n    ],\r\n    \"option\": [\r\n      {\r\n        \"name\": \"value\",\r\n        \"desp\": \"输入框内容\",\r\n        \"type\": \"string_input\",\r\n        \"details\": \"输入框内容\",\r\n        \"defaultValue\": \"\",\r\n        \"sync\": true\r\n      },\r\n      {\r\n        \"name\": \"entityId\",\r\n        \"codeLessType\": \"dto\",\r\n        \"desp\": \"实体\",\r\n        \"type\": \"string_dto\",\r\n        \"details\": \"实体\",\r\n        \"defaultValue\": \"\"\r\n      },\r\n      {\r\n        \"name\": \"label\",\r\n        \"codeLessType\":\"label\",\r\n        \"desp\": \"显示字段\",\r\n        \"type\": \"string_label\",\r\n        \"details\": \"显示字段\",\r\n        \"defaultValue\": \"\"\r\n      },\r\n      {\r\n        \"name\": \"syncParam\",\r\n        \"desp\": \"\",\r\n        \"details\": \"\",\r\n        \"defaultValue\": {}\r\n      }\r\n    ],\r\n    \"slot\": [],\r\n    \"events\": [],\r\n    \"style\": {\r\n      \"height\": \"30px\"\r\n    }\r\n  },\r\n  \"main\": \"index.vue\",\r\n  \"noUse\": false,\r\n  \"scripts\": {\r\n    \"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n  },\r\n  \"author\": \"zhanghaixian@agree.com.cn\",\r\n  \"license\": \"ISC\",\r\n  \"name\": \"@alcap-component/v2-a-input-dialog\",\r\n  \"version\": \"1.0.0\",\r\n  \"description\": \"带弹窗输入框\"\r\n}\r\n"
		},
		{
			"name": "@alcap-component/v2-a-input-editor",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/v2Components/v2-a-input-editor/index.vue",
			"package": "{\r\n  \"docs\": {\r\n    \"name\": \"标题输入框\",\r\n    \"detail\": \"标题输入框\",\r\n    \"href\": \"v2-a-input-editor\",\r\n    \"__wrapper\": \"v2cpt\",\r\n    \"type\": \"form\",\r\n    \"icon\": \"icontongyong\",\r\n    \"accept\": [\"page\"],\r\n    \"option\": [\r\n      {\r\n        \"name\": \"maxLength\",\r\n        \"desp\": \"最大长度\",\r\n        \"type\": \"string_input\",\r\n        \"details\": \"最大长度\",\r\n        \"defaultValue\": \"255\"\r\n      },\r\n      {\r\n        \"name\": \"type\",\r\n        \"desp\": \"声明 input 类型\",\r\n        \"type\": \"string_input\",\r\n        \"details\": \"声明 input 类型，同原生 input 标签的 type 属性\",\r\n        \"defaultValue\": \"text\"\r\n      },\r\n      {\r\n        \"name\": \"value\",\r\n        \"desp\": \"标题输入框内容\",\r\n        \"type\": \"string_input\",\r\n        \"details\": \"标题输入框内容\",\r\n        \"defaultValue\": \"\",\r\n        \"sync\": true\r\n      },\r\n      {\r\n        \"name\": \"disabled\",\r\n        \"desp\": \"是否禁用\",\r\n        \"type\": \"boolean\",\r\n        \"details\": \"是否禁用状态，默认为 false\",\r\n        \"defaultValue\": false\r\n      },\r\n      {\r\n        \"name\": \"placeholder\",\r\n        \"desp\": \"标题输入框占位文本\",\r\n        \"type\": \"string_input\",\r\n        \"details\": \"标题输入框占位文本\",\r\n        \"defaultValue\": \"请输入\"\r\n      },\r\n      {\r\n        \"name\": \"syncParam\",\r\n        \"desp\": \"\",\r\n        \"details\": \"\",\r\n        \"defaultValue\": {}\r\n      },\r\n      {\r\n        \"name\": \"syncParam\",\r\n        \"desp\": \"\",\r\n        \"details\": \"\",\r\n        \"defaultValue\": {}\r\n      }\r\n    ],\r\n    \"slot\": [],\r\n    \"events\": [],\r\n    \"style\": {\r\n      \"height\": \"30px\"\r\n    }\r\n  },\r\n  \"main\": \"index.vue\",\r\n  \"noUse\": false,\r\n  \"scripts\": {\r\n    \"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n  },\r\n  \"author\": \"zhangzexin01@agree.com.cn\",\r\n  \"license\": \"ISC\",\r\n  \"name\": \"@alcap-component/v2-a-input-editor\",\r\n  \"version\": \"1.0.0\",\r\n  \"description\": \"标题输入框\"\r\n}\r\n"
		},
		{
			"name": "@alcap-component/v2-a-input-money",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/v2Components/v2-a-input-money/index.vue",
			"package": "{\r\n  \"docs\": {\r\n    \"name\": \"金额输入框\",\r\n    \"detail\": \"金额输入框\",\r\n    \"href\": \"v2-a-input-money\",\r\n    \"__wrapper\": \"v2cpt\",\r\n    \"type\": \"form\",\r\n    \"icon\": \"icontongyong\",\r\n    \"accept\": [\"page\"],\r\n    \"option\": [\r\n      {\r\n        \"name\": \"value\",\r\n        \"desp\": \"输入框内容\",\r\n        \"type\": \"string_input\",\r\n        \"details\": \"输入框内容\",\r\n        \"defaultValue\": \"\",\r\n        \"sync\": true\r\n      },\r\n      {\r\n        \"name\": \"syncParam\",\r\n        \"desp\": \"\",\r\n        \"details\": \"\",\r\n        \"defaultValue\": {}\r\n      }\r\n    ],\r\n    \"slot\": [],\r\n    \"events\": [],\r\n    \"style\": {\r\n      \"height\": \"30px\"\r\n    }\r\n  },\r\n  \"main\": \"index.vue\",\r\n  \"noUse\": false,\r\n  \"scripts\": {\r\n    \"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n  },\r\n  \"author\": \"zhanghaixian@agree.com.cn\",\r\n  \"license\": \"ISC\",\r\n  \"name\": \"@alcap-component/v2-a-input-money\",\r\n  \"version\": \"1.0.0\",\r\n  \"description\": \"金额输入框\"\r\n}\r\n"
		},
		{
			"name": "@alcap-component/v2-a-input-number",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/v2Components/v2-a-input-number/index.vue",
			"package": "{\r\n  \"docs\": {\r\n    \"name\": \"数值输入框\",\r\n    \"detail\": \"数值输入框\",\r\n    \"href\": \"v2-a-input-number\",\r\n    \"__wrapper\": \"v2cpt\",\r\n    \"type\": \"form\",\r\n    \"icon\": \"icontongyong\",\r\n    \"accept\": [\r\n      \"page\"\r\n    ],\r\n    \"option\": [\r\n      {\r\n        \"name\": \"value\",\r\n        \"desp\": \"输入框内容\",\r\n        \"type\": \"string_input\",\r\n        \"details\": \"输入框内容\",\r\n        \"defaultValue\": \"\",\r\n        \"sync\": true\r\n      },\r\n      {\r\n        \"name\": \"syncParam\",\r\n        \"desp\": \"\",\r\n        \"details\": \"\",\r\n        \"defaultValue\": {}\r\n      }\r\n    ],\r\n    \"slot\": [],\r\n    \"events\": [],\r\n    \"style\": {\r\n      \"height\": \"30px\"\r\n    }\r\n  },\r\n  \"main\": \"index.vue\",\r\n  \"noUse\": false,\r\n  \"scripts\": {\r\n    \"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n  },\r\n  \"author\": \"zhanghaixian@agree.com.cn\",\r\n  \"license\": \"ISC\",\r\n  \"name\": \"@alcap-component/v2-a-input-number\",\r\n  \"version\": \"1.0.0\",\r\n  \"description\": \"数值输入框\"\r\n}\r\n"
		},
		{
			"name": "@alcap-component/v2-a-input-ocr",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/v2Components/v2-a-input-ocr/index.vue",
			"package": "{\r\n  \"docs\": {\r\n    \"name\": \"证件输入框\",\r\n    \"detail\": \"证件输入框\",\r\n    \"href\": \"v2-a-input-ocr\",\r\n    \"__wrapper\": \"v2cpt\",\r\n    \"type\": \"form\",\r\n    \"icon\": \"icontongyong\",\r\n    \"accept\": [\"page\"],\r\n    \"schemaType\": \"contentString\",\r\n    \"option\": [\r\n      {\r\n        \"name\": \"maxLength\",\r\n        \"desp\": \"最大长度\",\r\n        \"type\": \"string_input\",\r\n        \"details\": \"最大长度\",\r\n        \"defaultValue\": \"255\"\r\n      },\r\n      {\r\n        \"name\": \"type\",\r\n        \"desp\": \"声明 input 类型\",\r\n        \"type\": \"string_input\",\r\n        \"details\": \"声明 input 类型，同原生 input 标签的 type 属性\",\r\n        \"defaultValue\": \"text\"\r\n      },\r\n      {\r\n        \"name\": \"value\",\r\n        \"desp\": \"证件输入框内容\",\r\n        \"type\": \"string_input\",\r\n        \"details\": \"证件输入框内容\",\r\n        \"defaultValue\": \"\",\r\n        \"sync\": true\r\n      },\r\n      {\r\n        \"name\": \"disabled\",\r\n        \"desp\": \"是否禁用\",\r\n        \"type\": \"boolean\",\r\n        \"details\": \"是否禁用状态，默认为 false\",\r\n        \"defaultValue\": false\r\n      },\r\n      {\r\n        \"name\": \"placeholder\",\r\n        \"desp\": \"输入框占位文本\",\r\n        \"type\": \"string_input\",\r\n        \"details\": \"输入框占位文本\",\r\n        \"defaultValue\": \"\"\r\n      },\r\n      {\r\n        \"name\": \"entityId\",\r\n        \"codeLessType\":\"dto\",\r\n        \"desp\": \"实体\",\r\n        \"type\": \"string_dto\",\r\n        \"details\": \"实体\",\r\n        \"defaultValue\": \"\"\r\n      },\r\n      {\r\n        \"name\": \"labelValue\",\r\n        \"codeLessType\":\"labelValue\",\r\n        \"desp\": \"图片字段\",\r\n        \"type\": \"string_input\",\r\n        \"details\": \"图片字段\",\r\n        \"defaultValue\": \"\"\r\n      },\r\n      {\r\n        \"name\": \"ocrType\",\r\n        \"desp\": \"证件类型\",\r\n        \"codeLessType\": \"ocrType\",\r\n        \"defaultValue\": \"\",\r\n        \"type\": \"string_select\",\r\n        \"doc\": \"#\",\r\n        \"valueArray\": [\r\n          \"id_card\",\r\n          \"bank_card\"\r\n        ],\r\n        \"despArray\": [\r\n          \"身份证\",\r\n          \"银行卡\"\r\n        ]\r\n      },\r\n      {\r\n        \"name\": \"syncParam\",\r\n        \"desp\": \"\",\r\n        \"details\": \"\",\r\n        \"defaultValue\": {}\r\n      }\r\n    ],\r\n    \"slot\": [],\r\n    \"events\": [],\r\n    \"style\": {\r\n      \"height\": \"30px\"\r\n    }\r\n  },\r\n  \"main\": \"index.vue\",\r\n  \"noUse\": false,\r\n  \"scripts\": {\r\n    \"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n  },\r\n  \"author\": \"zhangzexin01@agree.com.cn\",\r\n  \"license\": \"ISC\",\r\n  \"name\": \"@alcap-component/v2-a-input-ocr\",\r\n  \"version\": \"1.0.0\",\r\n  \"description\": \"证件输入框\"\r\n}\r\n"
		},
		{
			"name": "@alcap-component/v2-a-input-textarea",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/v2Components/v2-a-input-textarea/index.vue",
			"package": "{\r\n  \"docs\": {\r\n    \"name\": \"文本域\",\r\n    \"detail\": \"文本域\",\r\n    \"href\": \"v2-a-input-textarea\",\r\n    \"__wrapper\": \"v2cpt\",\r\n    \"type\": \"form\",\r\n    \"icon\": \"icontongyong\",\r\n    \"accept\": [\"page\"],\r\n    \"option\": [\r\n      {\r\n        \"name\": \"maxLength\",\r\n        \"desp\": \"最大长度\",\r\n        \"type\": \"string_input\",\r\n        \"details\": \"最大长度\",\r\n        \"defaultValue\": \"255\"\r\n      },\r\n      {\r\n        \"name\": \"value\",\r\n        \"desp\": \"文本域内容\",\r\n        \"type\": \"string_input\",\r\n        \"details\": \"文本域内容\",\r\n        \"defaultValue\": \"\",\r\n        \"sync\": true\r\n      },\r\n      {\r\n        \"name\": \"disabled\",\r\n        \"desp\": \"是否禁用\",\r\n        \"type\": \"boolean\",\r\n        \"details\": \"是否禁用状态，默认为 false\",\r\n        \"defaultValue\": false\r\n      },\r\n      {\r\n        \"name\": \"placeholder\",\r\n        \"desp\": \"输入框占位文本\",\r\n        \"type\": \"string_input\",\r\n        \"details\": \"输入框占位文本\",\r\n        \"defaultValue\": \"请输入内容\"\r\n      },\r\n      {\r\n        \"name\": \"syncParam\",\r\n        \"desp\": \"\",\r\n        \"details\": \"\",\r\n        \"defaultValue\": {}\r\n      }\r\n    ],\r\n    \"slot\": [],\r\n    \"events\": [],\r\n    \"style\": {\r\n      \"height\": \"48px\"\r\n    }\r\n  },\r\n  \"main\": \"index.vue\",\r\n  \"noUse\": false,\r\n  \"scripts\": {\r\n    \"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n  },\r\n  \"author\": \"zhangzexin01@agree.com.cn\",\r\n  \"license\": \"ISC\",\r\n  \"name\": \"@alcap-component/v2-a-input-textarea\",\r\n  \"version\": \"1.0.0\",\r\n  \"description\": \"文本域\"\r\n}\r\n"
		},
		{
			"name": "@alcap-component/v2-a-json",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/v2Components/v2-a-json/index.vue",
			"package": "{\r\n  \"docs\": {\r\n    \"name\": \"json\",\r\n    \"detail\": \"json\",\r\n    \"href\": \"v2-a-json\",\r\n    \"__wrapper\": \"v2cpt\",\r\n    \"type\": \"base\",\r\n    \"icon\": \"icontongyong\",\r\n    \"schemaType\": \"ALCAP_LIST\",\r\n    \"accept\": [\r\n      \"page\"\r\n    ],\r\n    \"option\": [\r\n      {\r\n        \"name\": \"entityId\",\r\n        \"desp\": \"实体id\",\r\n        \"type\": \"string_dto\",\r\n        \"details\": \"实体id\",\r\n        \"defaultValue\": \"\"\r\n      },\r\n      {\r\n        \"name\": \"syncParam\",\r\n        \"desp\": \"\",\r\n        \"details\": \"\",\r\n        \"defaultValue\": {}\r\n      }\r\n    ],\r\n    \"slot\": [],\r\n    \"events\": [],\r\n    \"style\": {}\r\n  },\r\n  \"main\": \"index.vue\",\r\n  \"noUse\": false,\r\n  \"scripts\": {\r\n    \"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n  },\r\n  \"author\": \"zhangzexin01@agree.com.cn\",\r\n  \"license\": \"ISC\",\r\n  \"name\": \"@alcap-component/v2-a-json\",\r\n  \"version\": \"1.0.0\",\r\n  \"description\": \"json\"\r\n}\r\n"
		},
		{
			"name": "@alcap-component/v2-a-list",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/v2Components/v2-a-list/index.vue",
			"package": "{\r\n  \"docs\": {\r\n    \"name\": \"列表\",\r\n    \"detail\": \"列表\",\r\n    \"href\": \"v2-a-list\",\r\n    \"__wrapper\": \"v2cpt\",\r\n    \"type\": \"base\",\r\n    \"icon\": \"icontongyong\",\r\n    \"accept\": [\"page\"],\r\n    \"schemaType\": \"ALCAP_LIST\",\r\n    \"option\": [\r\n      {\r\n        \"name\": \"entityId\",\r\n        \"codeLessType\": \"dto\",\r\n        \"desp\": \"实体\",\r\n        \"type\": \"string_dto\",\r\n        \"details\": \"实体\",\r\n        \"defaultValue\": \"\"\r\n      },\r\n      {\r\n        \"name\": \"label\",\r\n        \"codeLessType\":\"label\",\r\n        \"desp\": \"显示字段\",\r\n        \"type\": \"string_label\",\r\n        \"details\": \"显示字段\",\r\n        \"defaultValue\": \"\"\r\n      }\r\n    ],\r\n    \"slot\": [],\r\n    \"events\": []\r\n  },\r\n  \"description\": \"列表\",\r\n  \"name\": \"@alcap-component/v2-a-list\",\r\n  \"version\": \"1.0.0\"\r\n}"
		},
		{
			"name": "@alcap-component/v2-a-radio",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/v2Components/v2-a-radio/index.vue",
			"package": "{\r\n  \"docs\": {\r\n    \"name\": \"单选框组\",\r\n    \"detail\": \"单选框组\",\r\n    \"href\": \"v2-a-radio\",\r\n    \"__wrapper\": \"v2cpt\",\r\n    \"type\": \"form\",\r\n    \"icon\": \"icontongyong\",\r\n    \"accept\": [\"page\"],\r\n    \"schemaType\": \"ALCAP_LIST\",\r\n    \"option\": [\r\n      {\r\n        \"name\": \"radioType\",\r\n        \"desp\": \"样式\",\r\n        \"codeLessType\":\"handleChange\",\r\n        \"defaultValue\": \"el-radio\",\r\n        \"type\": \"string_select\",\r\n        \"doc\": \"#\",\r\n        \"valueArray\": [\r\n          \"el-radio\",\r\n          \"el-radio-button\"\r\n        ],\r\n        \"despArray\": [\r\n          \"初始\",\r\n          \"按钮\"\r\n        ]\r\n      },\r\n      {\r\n        \"name\": \"dataSource\",\r\n        \"desp\": \"数据源\",\r\n        \"codeLessType\":\"handleChange\",\r\n        \"defaultValue\": \"entityId\",\r\n        \"type\": \"string_select\",\r\n        \"doc\": \"#\",\r\n        \"valueArray\": [\r\n          \"entityId\",\r\n          \"enumCode\"\r\n        ],\r\n        \"despArray\": [\r\n          \"实体\",\r\n          \"枚举\"\r\n        ]\r\n      },\r\n      {\r\n        \"name\": \"enumCode\",\r\n        \"codeLessType\":\"enum\",\r\n        \"desp\": \"枚举数据源\",\r\n        \"type\": \"string_code\",\r\n        \"details\": \"枚举数据源\",\r\n        \"defaultValue\": \"\"\r\n      },\r\n      {\r\n        \"name\": \"entityId\",\r\n        \"codeLessType\":\"dto\",\r\n        \"desp\": \"实体\",\r\n        \"type\": \"string_dto\",\r\n        \"exclude\": [ \"data_factory\" ],\r\n        \"details\": \"实体\",\r\n        \"defaultValue\": \"\"\r\n      },\r\n      {\r\n        \"name\": \"label\",\r\n        \"codeLessType\":\"label\",\r\n        \"desp\": \"显示字段\",\r\n        \"type\": \"string_label\",\r\n        \"details\": \"显示字段\",\r\n        \"defaultValue\": \"\"\r\n      },\r\n      {\r\n        \"name\": \"labelValue\",\r\n        \"codeLessType\":\"labelValue\",  \r\n        \"desp\": \"显示字段值\",\r\n        \"type\": \"string_label\",\r\n        \"details\": \"显示字段值\",\r\n        \"defaultValue\": \"\"\r\n      },\r\n      {\r\n        \"name\": \"value\",\r\n        \"desp\": \"选中的值\",\r\n        \"type\": \"string_input\",\r\n        \"details\": \"选中的值\",\r\n        \"defaultValue\": \"\",\r\n        \"sync\": true\r\n      },\r\n      {\r\n        \"name\": \"syncParam\",\r\n        \"desp\": \"\",\r\n        \"details\": \"\",\r\n        \"defaultValue\": {}\r\n      }\r\n    ],\r\n    \"slot\": [],\r\n    \"events\": [],\r\n    \"style\": {\r\n      \"height\": \"30px\"\r\n    }\r\n  },\r\n  \"main\": \"index.vue\",\r\n  \"noUse\": false,\r\n  \"scripts\": {\r\n    \"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n  },\r\n  \"author\": \"zhangzexin01@agree.com.cn\",\r\n  \"license\": \"ISC\",\r\n  \"name\": \"@alcap-component/v2-a-radio\",\r\n  \"version\": \"1.0.0\",\r\n  \"description\": \"单选框组\"\r\n}\r\n"
		},
		{
			"name": "@alcap-component/v2-a-range-picker",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/v2Components/v2-a-range-picker/index.vue",
			"package": "{\r\n  \"docs\": {\r\n    \"name\": \"日期范围选择框\",\r\n    \"detail\": \"日期范围选择框\",\r\n    \"href\": \"v2-a-range-picker\",\r\n    \"__wrapper\": \"v2cpt\",\r\n    \"type\": \"form\",\r\n    \"icon\": \"icontongyong\",\r\n    \"accept\": [\"page\"],\r\n    \"option\": [\r\n      {\r\n        \"name\": \"value\",\r\n        \"desp\": \"日期范围\",\r\n        \"type\": \"string_input\",\r\n        \"details\": \"日期范围\",\r\n        \"defaultValue\": [],\r\n        \"sync\": true\r\n      },\r\n      {\r\n        \"name\": \"syncParam\",\r\n        \"desp\": \"\",\r\n        \"details\": \"\",\r\n        \"defaultValue\": {}\r\n      }\r\n    ],\r\n    \"slot\": [],\r\n    \"events\": [],\r\n    \"style\": {\r\n      \"height\": \"30px\"\r\n    }\r\n  },\r\n  \"main\": \"index.vue\",\r\n  \"noUse\": false,\r\n  \"scripts\": {\r\n    \"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n  },\r\n  \"author\": \"zhangzexin01@agree.com.cn\",\r\n  \"license\": \"ISC\",\r\n  \"name\": \"@alcap-component/v2-a-range-picker\",\r\n  \"version\": \"1.0.0\",\r\n  \"description\": \"日期范围选择框\"\r\n}"
		},
		{
			"name": "@alcap-component/v2-a-range-work",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/v2Components/v2-a-range-work/index.vue",
			"package": "{\r\n  \"docs\": {\r\n    \"name\": \"工作日组件\",\r\n    \"detail\": \"工作日组件\",\r\n    \"href\": \"v2-a-range-work\",\r\n    \"__wrapper\": \"v2cpt\",\r\n    \"type\": \"form\",\r\n    \"icon\": \"icontongyong\",\r\n    \"accept\": [\r\n      \"page\"\r\n    ],\r\n    \"option\": [\r\n      {\r\n        \"name\": \"value\",\r\n        \"desp\": \"工作日期\",\r\n        \"type\": \"string_input\",\r\n        \"details\": \"工作日期\",\r\n        \"defaultValue\": \"\",\r\n        \"sync\": true\r\n      },\r\n      {\r\n        \"name\": \"disabledDate\",\r\n        \"desp\": \"不可选择的日期\",\r\n        \"type\": \"string_input\",\r\n        \"details\": \"不可选择的日期\",\r\n        \"defaultValue\": \"\"\r\n      },\r\n      {\r\n        \"name\": \"syncParam\",\r\n        \"desp\": \"\",\r\n        \"details\": \"\",\r\n        \"defaultValue\": {}\r\n      }\r\n    ],\r\n    \"slot\": [],\r\n    \"events\": []\r\n  },\r\n  \"description\": \"工作日组件\",\r\n  \"name\": \"@alcap-component/v2-a-range-work\",\r\n  \"version\": \"1.0.0\"\r\n}\r\n"
		},
		{
			"name": "@alcap-component/v2-a-select",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/v2Components/v2-a-select/index.vue",
			"package": "{\r\n  \"docs\": {\r\n    \"name\": \"下拉选择\",\r\n    \"detail\": \"下拉选择\",\r\n    \"href\": \"v2-a-select\",\r\n    \"__wrapper\": \"v2cpt\",\r\n    \"type\": \"form\",\r\n    \"icon\": \"icontongyong\",\r\n    \"accept\": [\"page\"],\r\n    \"schemaType\": \"ALCAP_LIST\",\r\n    \"option\": [\r\n      {\r\n        \"name\": \"dataSource\",\r\n        \"desp\": \"数据源\",\r\n        \"codeLessType\":\"handleChange\",\r\n        \"defaultValue\": \"entityId\",\r\n        \"type\": \"string_select\",\r\n        \"doc\": \"#\",\r\n        \"valueArray\": [\r\n          \"entityId\",\r\n          \"enumCode\"\r\n        ],\r\n        \"despArray\": [\r\n          \"实体\",\r\n          \"枚举\"\r\n        ]\r\n      },\r\n      {\r\n        \"name\": \"enumCode\",\r\n        \"codeLessType\": \"enum\",\r\n        \"desp\": \"枚举\",\r\n        \"type\": \"string_code\",\r\n        \"details\": \"枚举\",\r\n        \"defaultValue\": \"\"\r\n      },\r\n      {\r\n        \"name\": \"entityId\",\r\n        \"codeLessType\":\"dto\",\r\n        \"desp\": \"实体\",\r\n        \"type\": \"string_dto\",\r\n        \"exclude\": [ \"data_factory\" ],\r\n        \"details\": \"实体\",\r\n        \"defaultValue\": \"\"\r\n      },\r\n      {\r\n        \"name\": \"label\",\r\n        \"codeLessType\":\"label\",\r\n        \"desp\": \"显示字段\",\r\n        \"type\": \"string_label\",\r\n        \"details\": \"显示字段\",\r\n        \"defaultValue\": \"\"\r\n      },\r\n      {\r\n        \"name\": \"labelValue\",\r\n        \"codeLessType\":\"labelValue\",  \r\n        \"desp\": \"显示字段值\",\r\n        \"type\": \"string_label\",\r\n        \"details\": \"显示字段值\",\r\n        \"defaultValue\": \"\"\r\n      },\r\n      {\r\n        \"name\": \"value\",\r\n        \"desp\": \"选择框内容\",\r\n        \"type\": \"string_input\",\r\n        \"details\": \"选择框内容\",\r\n        \"defaultValue\": \"\",\r\n        \"sync\": true\r\n      },\r\n      {\r\n        \"name\": \"syncParam\",\r\n        \"desp\": \"\",\r\n        \"details\": \"\",\r\n        \"defaultValue\": {}\r\n      }\r\n    ],\r\n    \"slot\": [],\r\n    \"events\": [],\r\n    \"style\": {\r\n      \"height\": \"30px\"\r\n    }\r\n  },\r\n  \"main\": \"index.vue\",\r\n  \"noUse\": false,\r\n  \"scripts\": {\r\n    \"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n  },\r\n  \"author\": \"zhangzexin01@agree.com.cn\",\r\n  \"license\": \"ISC\",\r\n  \"name\": \"@alcap-component/v2-a-select\",\r\n  \"version\": \"1.0.0\",\r\n  \"description\": \"下拉选择\"\r\n}"
		},
		{
			"name": "@alcap-component/v2-a-select-currency",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/v2Components/v2-a-select-currency/index.vue",
			"package": "{\r\n  \"docs\": {\r\n    \"name\": \"币种组件\",\r\n    \"detail\": \"币种组件\",\r\n    \"href\": \"v2-a-select-currency\",\r\n    \"__wrapper\": \"v2cpt\",\r\n    \"icon\": \"icontongyong\",\r\n    \"accept\": [\"page\"],\r\n    \"schemaType\": \"ALCAP_LIST\",\r\n    \"option\": [\r\n      {\r\n        \"name\": \"entityId\",\r\n        \"codeLessType\": \"dto\",\r\n        \"desp\": \"实体\",\r\n        \"type\": \"string_dto\",\r\n        \"details\": \"实体\",\r\n        \"defaultValue\": \"\"\r\n      },\r\n      {\r\n        \"name\": \"options\",\r\n        \"desp\": \"options 数据\",\r\n        \"type\": \"string_input\",\r\n        \"details\": \"options 数据，如果设置则不需要手动构造 selectOption 节点 array<{value, label, [disabled, key, title]}>\",\r\n        \"defaultValue\": \"\"\r\n      }\r\n    ],\r\n    \"slot\": [],\r\n    \"events\": []\r\n  },\r\n  \"description\": \"币种组件\",\r\n  \"name\": \"@alcap-component/v2-a-select-currency\",\r\n  \"version\": \"1.0.0\"\r\n}\r\n"
		},
		{
			"name": "@alcap-component/v2-a-select-pagination",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/v2Components/v2-a-select-pagination/index.vue",
			"package": "{\r\n  \"docs\": {\r\n    \"name\": \"下拉选择分页\",\r\n    \"detail\": \"下拉选择分页\",\r\n    \"href\": \"v2-a-select-pagination\",\r\n    \"__wrapper\": \"v2cpt\",\r\n    \"type\": \"form\",\r\n    \"icon\": \"icontongyong\",\r\n    \"accept\": [\"page\"],\r\n    \"schemaType\": \"ALCAP_PAGEING\",\r\n    \"option\": [\r\n      {\r\n        \"name\": \"value\",\r\n        \"desp\": \"选择框内容\",\r\n        \"type\": \"string_input\",\r\n        \"details\": \"选择框内容\",\r\n        \"defaultValue\": \"\",\r\n        \"sync\": true,\r\n        \"syncParam\": \"\"\r\n      },\r\n      {\r\n        \"name\": \"entityId\",\r\n        \"codeLessType\":\"dto\",\r\n        \"desp\": \"实体\",\r\n        \"type\": \"string_dto\",\r\n        \"details\": \"实体\",\r\n        \"defaultValue\": \"\"\r\n      },\r\n      {\r\n        \"name\": \"label\",\r\n        \"codeLessType\":\"label\",\r\n        \"desp\": \"显示字段\",\r\n        \"type\": \"string_label\",\r\n        \"details\": \"显示字段\",\r\n        \"defaultValue\": \"\"\r\n      },\r\n      {\r\n        \"name\": \"labelValue\",\r\n        \"codeLessType\":\"labelValue\",\r\n        \"desp\": \"显示字段值\",\r\n        \"type\": \"string_label\",\r\n        \"details\": \"显示字段值\",\r\n        \"defaultValue\": \"\"\r\n      }\r\n    ],\r\n    \"slot\": [],\r\n    \"events\": []\r\n  },\r\n  \"main\": \"index.vue\",\r\n  \"noUse\": false,\r\n  \"scripts\": {\r\n    \"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n  },\r\n  \"author\": \"zhangzexin01@agree.com.cn\",\r\n  \"license\": \"ISC\",\r\n  \"name\": \"@alcap-component/v2-a-select-pagination\",\r\n  \"version\": \"1.0.0\",\r\n  \"description\": \"下拉选择分页\"\r\n}"
		},
		{
			"name": "@alcap-component/v2-a-select-pagination-multiple",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/v2Components/v2-a-select-pagination-multiple/index.vue",
			"package": "{\r\n  \"docs\": {\r\n    \"name\": \"下拉选择分页多选\",\r\n    \"detail\": \"下拉选择分页多选\",\r\n    \"href\": \"v2-a-select-pagination-multiple\",\r\n    \"__wrapper\": \"v2cpt\",\r\n    \"type\": \"form\",\r\n    \"icon\": \"icontongyong\",\r\n    \"accept\": [\"page\"],\r\n    \"schemaType\": \"ALCAP_PAGEING\",\r\n    \"option\": [\r\n      {\r\n        \"name\": \"value\",\r\n        \"desp\": \"选择框内容\",\r\n        \"type\": \"string_input\",\r\n        \"details\": \"选择框内容\",\r\n        \"defaultValue\": [],\r\n        \"sync\": true\r\n      },\r\n      {\r\n        \"name\": \"entityId\",\r\n        \"codeLessType\":\"dto\",\r\n        \"desp\": \"实体\",\r\n        \"type\": \"string_dto\",\r\n        \"details\": \"实体\",\r\n        \"defaultValue\": \"\"\r\n      },\r\n      {\r\n        \"name\": \"label\",\r\n        \"codeLessType\":\"label\",\r\n        \"desp\": \"显示字段\",\r\n        \"type\": \"string_label\",\r\n        \"details\": \"显示字段\",\r\n        \"defaultValue\": \"\"\r\n      },\r\n      {\r\n        \"name\": \"labelValue\",\r\n        \"codeLessType\":\"labelValue\",\r\n        \"desp\": \"显示字段值\",\r\n        \"type\": \"string_label\",\r\n        \"details\": \"显示字段值\",\r\n        \"defaultValue\": \"\"\r\n      },\r\n      {\r\n        \"name\": \"syncParam\",\r\n        \"desp\": \"\",\r\n        \"details\": \"\",\r\n        \"defaultValue\": {}\r\n      }\r\n    ],\r\n    \"slot\": [],\r\n    \"events\": [],\r\n    \"style\": {\r\n      \"height\": \"30px\"\r\n    }\r\n  },\r\n  \"main\": \"index.vue\",\r\n  \"noUse\": false,\r\n  \"scripts\": {\r\n    \"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n  },\r\n  \"author\": \"zhangzexin01@agree.com.cn\",\r\n  \"license\": \"ISC\",\r\n  \"name\": \"@alcap-component/v2-a-select-pagination-multiple\",\r\n  \"version\": \"1.0.0\",\r\n  \"description\": \"下拉选择分页多选\"\r\n}"
		},
		{
			"name": "@alcap-component/v2-a-select-string",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/v2Components/v2-a-select-string/index.vue",
			"package": "{\r\n  \"docs\": {\r\n    \"name\": \"下拉选择字符串\",\r\n    \"detail\": \"下拉选择字符串\",\r\n    \"href\": \"v2-a-select-string\",\r\n    \"__wrapper\": \"v2cpt\",\r\n    \"type\": \"form\",\r\n    \"icon\": \"icontongyong\",\r\n    \"accept\": [\"page\"],\r\n    \"schemaType\": \"contentString\",\r\n    \"option\": [\r\n      {\r\n        \"name\": \"value\",\r\n        \"desp\": \"选择框内容\",\r\n        \"type\": \"string_input\",\r\n        \"details\": \"选择框内容\",\r\n        \"defaultValue\": \"\",\r\n        \"sync\": true\r\n      },\r\n      {\r\n        \"name\": \"entityId\",\r\n        \"codeLessType\":\"dto\",\r\n        \"desp\": \"实体\",\r\n        \"type\": \"string_dto\",\r\n        \"details\": \"实体\",\r\n        \"defaultValue\": \"\"\r\n      },\r\n      {\r\n        \"name\": \"label\",\r\n        \"codeLessType\":\"label\",\r\n        \"desp\": \"显示字段\",\r\n        \"type\": \"string_label\",\r\n        \"details\": \"显示字段\",\r\n        \"defaultValue\": \"\"\r\n      },\r\n      {\r\n        \"name\": \"labelValue\",\r\n        \"codeLessType\":\"labelValue\",\r\n        \"desp\": \"显示字段值\",\r\n        \"type\": \"string_input\",\r\n        \"details\": \"显示字段值\",\r\n        \"defaultValue\": \"\"\r\n      },\r\n      {\r\n        \"name\": \"syncParam\",\r\n        \"desp\": \"\",\r\n        \"details\": \"\",\r\n        \"defaultValue\": {}\r\n      }\r\n    ],\r\n    \"slot\": [],\r\n    \"events\": [],\r\n    \"style\": {\r\n      \"height\": \"30px\"\r\n    }\r\n  },\r\n  \"main\": \"index.vue\",\r\n  \"noUse\": false,\r\n  \"scripts\": {\r\n    \"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n  },\r\n  \"author\": \"zhangzexin01@agree.com.cn\",\r\n  \"license\": \"ISC\",\r\n  \"name\": \"@alcap-component/v2-a-select-string\",\r\n  \"version\": \"1.0.0\",\r\n  \"description\": \"下拉选择字符串\"\r\n}"
		},
		{
			"name": "@alcap-component/v2-a-select-user",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/v2Components/v2-a-select-user/index.vue",
			"package": "{\r\n  \"docs\": {\r\n    \"name\": \"下拉选择用户\",\r\n    \"detail\": \"下拉选择用户\",\r\n    \"href\": \"v2-a-select-user\",\r\n    \"__wrapper\": \"v2cpt\",\r\n    \"type\": \"form\",\r\n    \"icon\": \"icontongyong\",\r\n    \"accept\": [\"page\"],\r\n    \"option\": [\r\n      {\r\n        \"name\": \"value\",\r\n        \"desp\": \"选择框内容\",\r\n        \"type\": \"string_input\",\r\n        \"details\": \"选择框内容\",\r\n        \"defaultValue\": \"\",\r\n        \"sync\": true\r\n      },\r\n      {\r\n        \"name\": \"syncParam\",\r\n        \"desp\": \"\",\r\n        \"details\": \"\",\r\n        \"defaultValue\": {}\r\n      }\r\n    ],\r\n    \"slot\": [],\r\n    \"events\": [],\r\n    \"style\": {\r\n      \"height\": \"30px\"\r\n    }\r\n  },\r\n  \"main\": \"index.vue\",\r\n  \"noUse\": false,\r\n  \"scripts\": {\r\n    \"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n  },\r\n  \"author\": \"zhangzexin01@agree.com.cn\",\r\n  \"license\": \"ISC\",\r\n  \"name\": \"@alcap-component/v2-a-select-user\",\r\n  \"version\": \"1.0.0\",\r\n  \"description\": \"下拉选择用户\"\r\n}"
		},
		{
			"name": "@alcap-component/v2-a-sheet",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/v2Components/v2-a-sheet/index.vue",
			"package": "{\r\n  \"docs\": {\r\n    \"name\": \"excel表格\",\r\n    \"detail\": \"excel表格\",\r\n    \"href\": \"v2-a-sheet\",\r\n    \"__wrapper\": \"v2cpt\",\r\n    \"type\": \"preset\",\r\n    \"icon\": \"icontongyong\",\r\n    \"schemaType\": \"\",\r\n    \"accept\": [\r\n      \"page\"\r\n    ],\r\n    \"option\": [\r\n      {\r\n        \"name\": \"entityId\",\r\n        \"desp\": \"实体\",\r\n        \"type\": \"string_dto\",\r\n        \"exclude\": [ \"data_factory\" ],\r\n        \"details\": \"实体\",\r\n        \"defaultValue\": \"\"\r\n      }\r\n    ],\r\n    \"slot\": [],\r\n    \"events\": [],\r\n    \"style\": {\r\n      \"width\": \"100%\",\r\n      \"height\": \"100%\"\r\n    }\r\n  },\r\n  \"main\": \"index.vue\",\r\n  \"noUse\": false,\r\n  \"scripts\": {\r\n    \"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n  },\r\n  \"author\": \"zhangzexin01@agree.com.cn\",\r\n  \"license\": \"ISC\",\r\n  \"name\": \"@alcap-component/v2-a-sheet\",\r\n  \"version\": \"1.0.0\",\r\n  \"description\": \"excel表格\"\r\n}\r\n"
		},
		{
			"name": "@alcap-component/v2-a-step",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/v2Components/v2-a-step/index.vue",
			"package": "{\r\n  \"docs\": {\r\n    \"name\": \"步骤条\",\r\n    \"detail\": \"步骤条\",\r\n    \"href\": \"v2-a-step\",\r\n    \"__wrapper\": \"v2cpt\",\r\n    \"type\": \"base\",\r\n    \"icon\": \"icontongyong\",\r\n    \"schemaType\": \"ALCAP_LIST\",\r\n    \"accept\": [\r\n      \"page\"\r\n    ],\r\n    \"option\": [\r\n      {\r\n        \"name\": \"value\",\r\n        \"desp\": \"当前步骤\",\r\n        \"type\": \"string_input\",\r\n        \"details\": \"当前步骤\",\r\n        \"defaultValue\": 1,\r\n        \"sync\": true\r\n      },\r\n      {\r\n        \"name\": \"stepArr\",\r\n        \"desp\": \"步骤\",\r\n        \"type\": \"array\",\r\n        \"details\": \"步骤\",\r\n        \"defaultValue\": [],\r\n        \"attrInEachElement\": [\r\n          {\r\n            \"name\": \"title\",\r\n            \"desp\": \"标题\",\r\n            \"defaultValue\": \"\",\r\n            \"type\": \"string_input\"\r\n          }\r\n        ]\r\n      },\r\n      {\r\n        \"name\": \"syncParam\",\r\n        \"desp\": \"\",\r\n        \"details\": \"\",\r\n        \"defaultValue\": {}\r\n      }\r\n    ],\r\n    \"slot\": [],\r\n    \"events\": [],\r\n    \"style\": {\r\n      \"width\": \"100%\",\r\n      \"height\": \"100px\"\r\n    }\r\n  },\r\n  \"main\": \"index.vue\",\r\n  \"noUse\": false,\r\n  \"scripts\": {\r\n    \"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n  },\r\n  \"author\": \"zhangzexin01@agree.com.cn\",\r\n  \"license\": \"ISC\",\r\n  \"name\": \"@alcap-component/v2-a-step\",\r\n  \"version\": \"1.0.0\",\r\n  \"description\": \"步骤条\"\r\n}\r\n"
		},
		{
			"name": "@alcap-component/v2-a-svgicon",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/v2Components/v2-a-svgicon/index.vue",
			"package": "{\r\n  \"docs\": {\r\n    \"name\": \"图标\",\r\n    \"detail\": \"图标\",\r\n    \"href\": \"v2-a-svgicon\",\r\n    \"__wrapper\": \"v2cpt\",\r\n    \"type\": \"base\",\r\n    \"icon\": \"icontongyong\",\r\n    \"accept\": [\r\n      \"page\"\r\n    ],\r\n    \"option\": [\r\n      {\r\n        \"name\": \"icon\",\r\n        \"desp\": \"图标代码\",\r\n        \"type\": \"dialog_input\",\r\n        \"dialogType\": \"icon\",\r\n        \"details\": \"图标代码\",\r\n        \"defaultValue\": \"icon-zuhumingcheng\",\r\n        \"require\": {\r\n          \"dataType\": \"icon\"\r\n        }\r\n      },\r\n      {\r\n        \"name\": \"align\",\r\n        \"desp\": \"水平对齐\",\r\n        \"defaultValue\": \"center\",\r\n        \"type\": \"string_select\",\r\n        \"doc\": \"#\",\r\n        \"valueArray\": [\r\n          \"flex-start\",\r\n          \"center\",\r\n          \"flex-end\"\r\n        ],\r\n        \"despArray\": [\r\n          \"左边\",\r\n          \"居中\",\r\n          \"右边\"\r\n        ]\r\n      },\r\n      {\r\n        \"name\": \"vertical\",\r\n        \"desp\": \"垂直对齐\",\r\n        \"defaultValue\": \"center\",\r\n        \"type\": \"string_select\",\r\n        \"doc\": \"#\",\r\n        \"valueArray\": [\r\n          \"flex-start\",\r\n          \"center\",\r\n          \"flex-end\"\r\n        ],\r\n        \"despArray\": [\r\n          \"上边\",\r\n          \"居中\",\r\n          \"下边\"\r\n        ]\r\n      }\r\n    ],\r\n    \"slot\": [],\r\n    \"events\": []\r\n  },\r\n  \"main\": \"index.vue\",\r\n  \"noUse\": false,\r\n  \"scripts\": {\r\n    \"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n  },\r\n  \"author\": \"zhangzexin01@agree.com.cn\",\r\n  \"license\": \"ISC\",\r\n  \"name\": \"@alcap-component/v2-a-svgicon\",\r\n  \"version\": \"1.0.0\",\r\n  \"description\": \"图标\"\r\n}\r\n"
		},
		{
			"name": "@alcap-component/v2-a-table",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/v2Components/v2-a-table/index.vue",
			"package": "{\r\n  \"docs\": {\r\n    \"name\": \"表格\",\r\n    \"detail\": \"表格\",\r\n    \"href\": \"v2-a-table\",\r\n    \"__wrapper\": \"v2cpt\",\r\n    \"type\": \"base\",\r\n    \"icon\": \"icontongyong\",\r\n    \"accept\": [\"page\"],\r\n    \"schemaType\": \"ALCAP_PAGEING\",\r\n    \"option\": [\r\n      {\r\n        \"name\": \"entityId\",\r\n        \"desp\": \"数据实体id\",\r\n        \"type\": \"string_dto\",\r\n        \"details\": \"数据实体id\",\r\n        \"defaultValue\": \"\"\r\n      }\r\n    ],\r\n    \"slot\": [\r\n      {\r\n        \"name\": \"name\",\r\n        \"desc\": \"自定义文本\",\r\n        \"limit\": 1,\r\n        \"type\": [\r\n          \"none\",\r\n          \"text\",\r\n          \"icon\",\r\n          \"component\",\r\n          \"custom\"\r\n        ],\r\n        \"slotScope\": \"$scope,text\",\r\n        \"scopeDesc\": \"scope描述\",\r\n        \"props\": [\r\n          \"type\",\r\n          \"width\",\r\n          \"index\",\r\n          \"column-key\"\r\n        ]\r\n      }\r\n    ],\r\n    \"events\": []\r\n  },\r\n  \"main\": \"index.vue\",\r\n  \"noUse\": false,\r\n  \"scripts\": {\r\n    \"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n  },\r\n  \"author\": \"zhangzexin01@agree.com.cn\",\r\n  \"license\": \"ISC\",\r\n  \"name\": \"@alcap-component/v2-a-table\",\r\n  \"version\": \"1.0.0\",\r\n  \"description\": \"表格\"\r\n}"
		},
		{
			"name": "@alcap-component/v2-a-table-huaxing",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/v2Components/v2-a-table-huaxing/index.vue",
			"package": "{\r\n  \"docs\": {\r\n    \"name\": \"表格-华兴\",\r\n    \"detail\": \"表格-华兴\",\r\n    \"href\": \"v2-a-table-huaxing\",\r\n    \"__wrapper\": \"v2cpt\",\r\n    \"type\": \"base\",\r\n    \"icon\": \"icontongyong\",\r\n    \"accept\": [\"page\"],\r\n    \"schemaType\": \"ALCAP_SINGLE_PAGE\",\r\n    \"option\": [\r\n      {\r\n        \"name\": \"entityId\",\r\n        \"desp\": \"数据实体id\",\r\n        \"type\": \"string_dto\",\r\n        \"details\": \"数据实体id\",\r\n        \"defaultValue\": \"\"\r\n      },\r\n      {\r\n        \"name\": \"field\",\r\n        \"desp\": \"字段\",\r\n        \"type\": \"custom_component\",\r\n        \"details\": \"字段\",\r\n        \"component\": \"v2-a-table-huaxing-edit\",\r\n        \"defaultValue\": []\r\n      },\r\n      {\r\n        \"name\": \"startGet\"\r\n      }\r\n    ],\r\n    \"slot\": [\r\n      {\r\n        \"name\": \"name\",\r\n        \"desc\": \"自定义文本\",\r\n        \"limit\": 1,\r\n        \"type\": [\r\n          \"none\",\r\n          \"text\",\r\n          \"icon\",\r\n          \"component\",\r\n          \"custom\"\r\n        ],\r\n        \"slotScope\": \"$scope,text\",\r\n        \"scopeDesc\": \"scope描述\",\r\n        \"props\": [\r\n          \"type\",\r\n          \"width\",\r\n          \"index\",\r\n          \"column-key\"\r\n        ]\r\n      }\r\n    ],\r\n    \"events\": []\r\n  },\r\n  \"main\": \"index.vue\",\r\n  \"noUse\": false,\r\n  \"scripts\": {\r\n    \"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n  },\r\n  \"author\": \"zhangzexin01@agree.com.cn\",\r\n  \"license\": \"ISC\",\r\n  \"name\": \"@alcap-component/v2-a-table-huaxing\",\r\n  \"version\": \"1.0.0\",\r\n  \"description\": \"表格-华兴\"\r\n}"
		},
		{
			"name": "@alcap-component/v2-a-table-link",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/v2Components/v2-a-table-link/index.vue",
			"package": "{\r\n  \"docs\": {\r\n    \"name\": \"文本链接\",\r\n    \"detail\": \"文本链接\",\r\n    \"href\": \"v2-a-table-link\",\r\n    \"__wrapper\": \"v2cpt\",\r\n    \"type\": \"table\",\r\n    \"icon\": \"icontongyong\",\r\n    \"accept\": [\"page\"],\r\n    \"option\": [\r\n      {\r\n        \"name\": \"page\",\r\n        \"desp\": \"页面\",\r\n        \"type\": \"string_page\",\r\n        \"codeLessType\": \"page\",\r\n        \"details\": \"页面\",\r\n        \"defaultValue\": {}\r\n      },\r\n      {\r\n        \"name\": \"syncParam\",\r\n        \"desp\": \"数据\",\r\n        \"type\": \"string_syncParam\",\r\n        \"codeLessType\": \"syncParam\",\r\n        \"details\": \"数据\",\r\n        \"defaultValue\": []\r\n      },\r\n      {\r\n        \"name\": \"title\",\r\n        \"desp\": \"按钮标题\",\r\n        \"type\": \"string_input\",\r\n        \"details\": \"按钮标题\",\r\n        \"defaultValue\": \"文字按钮\"\r\n      }\r\n    ],\r\n    \"slot\": [],\r\n    \"events\": []\r\n  },\r\n  \"main\": \"index.vue\",\r\n  \"noUse\": false,\r\n  \"scripts\": {\r\n    \"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n  },\r\n  \"author\": \"zhangzexin01@agree.com.cn\",\r\n  \"license\": \"ISC\",\r\n  \"name\": \"@alcap-component/v2-a-table-link\",\r\n  \"version\": \"1.0.0\",\r\n  \"description\": \"文本链接\"\r\n}"
		},
		{
			"name": "@alcap-component/v2-a-table-money",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/v2Components/v2-a-table-money/index.vue",
			"package": "{\r\n  \"docs\": {\r\n    \"name\": \"金额区间表格\",\r\n    \"detail\": \"金额区间表格\",\r\n    \"href\": \"v2-a-table-money\",\r\n    \"__wrapper\": \"v2cpt\",\r\n    \"type\": \"form\",\r\n    \"icon\": \"icontongyong\",\r\n    \"accept\": [\"page\"],\r\n    \"option\": [\r\n      {\r\n        \"name\": \"value\",\r\n        \"desp\": \"输入框内容\",\r\n        \"type\": \"string_input\",\r\n        \"details\": \"输入框内容\",\r\n        \"defaultValue\": \"\",\r\n        \"sync\": true\r\n      },\r\n      {\r\n        \"name\": \"moneyMode\",\r\n        \"desp\": \"金额模式\",\r\n        \"defaultValue\": \"1\",\r\n        \"type\": \"string_select\",\r\n        \"doc\": \"#\",\r\n        \"valueArray\": [\r\n          \"1\",\r\n          \"0\"\r\n        ],\r\n        \"despArray\": [\r\n          \"有金额模式\",\r\n          \"无金额模式\"\r\n        ]\r\n      }\r\n    ],\r\n    \"slot\": [],\r\n    \"events\": [],\r\n    \"style\": {\r\n      \"height\": \"30px\"\r\n    }\r\n  },\r\n  \"main\": \"index.vue\",\r\n  \"noUse\": false,\r\n  \"scripts\": {\r\n    \"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n  },\r\n  \"author\": \"zhangzexin01@agree.com.cn\",\r\n  \"license\": \"ISC\",\r\n  \"name\": \"@alcap-component/v2-a-table-money\",\r\n  \"version\": \"1.0.0\",\r\n  \"description\": \"金额区间表格\"\r\n}"
		},
		{
			"name": "@alcap-component/v2-a-tabs",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/v2Components/v2-a-tabs/index.vue",
			"package": "{\r\n  \"docs\": {\r\n    \"name\": \"标签页\",\r\n    \"detail\": \"标签页\",\r\n    \"href\": \"v2-a-tabs\",\r\n    \"__wrapper\": \"v2cpt\",\r\n    \"type\": \"base\",\r\n    \"icon\": \"icontongyong\",\r\n    \"accept\": [\r\n      \"page\",\r\n      \"workbench\"\r\n    ],\r\n    \"schemaType\": \"ALCAP_LIST\",\r\n    \"option\": [\r\n      {\r\n        \"type\": \"string_input\",\r\n        \"name\": \"value\",\r\n        \"defaultValue\": \"\",\r\n        \"desp\": \"当前激活\",\r\n        \"first\": true,\r\n        \"details\": \"常和切换容器一起使用，绑定页面码数\"\r\n      },\r\n      {\r\n        \"type\": \"array_page\",\r\n        \"noPageType\": true,\r\n        \"name\": \"tabList\",\r\n        \"desp\": \"渲染页面\",\r\n        \"defaultValue\": []\r\n      },\r\n      {\r\n        \"type\": \"string_select\",\r\n        \"name\": \"type\",\r\n        \"defaultValue\": \"card\",\r\n        \"desp\": \"风格类型\",\r\n        \"doc\": \"#\",\r\n        \"valueArray\": [\r\n          \"\",\r\n          \"card\",\r\n          \"border-card\"\r\n        ],\r\n        \"despArray\": [\r\n          \"默认\",\r\n          \"卡片\",\r\n          \"下划线卡片\"\r\n        ]\r\n      },\r\n      {\r\n        \"type\": \"string_select\",\r\n        \"name\": \"tabPosition\",\r\n        \"defaultValue\": \"top\",\r\n        \"desp\": \"选项卡位置\",\r\n        \"doc\": \"#\",\r\n        \"valueArray\": [\r\n          \"top\",\r\n          \"right\",\r\n          \"bottom\",\r\n          \"left\"\r\n        ],\r\n        \"despArray\": [\r\n          \"上\",\r\n          \"右\",\r\n          \"下\",\r\n          \"左\"\r\n        ]\r\n      }\r\n    ],\r\n    \"slot\": [],\r\n    \"events\": [],\r\n    \"style\": {\r\n      \"width\": \"100%\",\r\n      \"height\": \"100%\"\r\n    }\r\n  },\r\n  \"description\": \"标签页\",\r\n  \"name\": \"@alcap-component/v2-a-tabs\",\r\n  \"version\": \"1.0.0\"\r\n}"
		},
		{
			"name": "@alcap-component/v2-a-text",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/v2Components/v2-a-text/index.vue",
			"package": "{\r\n  \"docs\": {\r\n    \"name\": \"文本\",\r\n    \"detail\": \"文本\",\r\n    \"href\": \"v2-a-text\",\r\n    \"__wrapper\": \"v2cpt\",\r\n    \"type\": \"form\",\r\n    \"icon\": \"icontongyong\",\r\n    \"accept\": [\r\n      \"page\"\r\n    ],\r\n    \"option\": [\r\n      {\r\n        \"name\": \"value\",\r\n        \"desp\": \"文本内容\",\r\n        \"type\": \"string_input\",\r\n        \"details\": \"文本内容\",\r\n        \"defaultValue\": \"文本\",\r\n        \"sync\": true\r\n      },\r\n      {\r\n        \"name\": \"fontSize\",\r\n        \"desp\": \"文本字号\",\r\n        \"type\": \"string_input\",\r\n        \"details\": \"文本字号\",\r\n        \"defaultValue\": \"14px\"\r\n      },\r\n      {\r\n        \"name\": \"color\",\r\n        \"desp\": \"文本颜色\",\r\n        \"type\": \"colorPicker\",\r\n        \"details\": \"文本颜色\",\r\n        \"defaultValue\": \"#000000\"\r\n      },\r\n      {\r\n        \"name\": \"align\",\r\n        \"desp\": \"水平对齐\",\r\n        \"defaultValue\": \"center\",\r\n        \"type\": \"string_select\",\r\n        \"doc\": \"#\",\r\n        \"valueArray\": [\r\n          \"flex-start\",\r\n          \"center\",\r\n          \"flex-end\"\r\n        ],\r\n        \"despArray\": [\r\n          \"左边\",\r\n          \"居中\",\r\n          \"右边\"\r\n        ]\r\n      },\r\n      {\r\n        \"name\": \"vertical\",\r\n        \"desp\": \"垂直\",\r\n        \"defaultValue\": \"center\",\r\n        \"type\": \"string_select\",\r\n        \"doc\": \"#\",\r\n        \"valueArray\": [\r\n          \"flex-start\",\r\n          \"center\",\r\n          \"flex-end\"\r\n        ],\r\n        \"despArray\": [\r\n          \"上边\",\r\n          \"居中\",\r\n          \"下边\"\r\n        ]\r\n      },\r\n      {\r\n        \"name\": \"syncParam\",\r\n        \"desp\": \"\",\r\n        \"details\": \"\",\r\n        \"defaultValue\": {}\r\n      }\r\n    ],\r\n    \"slot\": [],\r\n    \"events\": [],\r\n    \"style\": {\r\n      \"height\": \"30px\"\r\n    }\r\n  },\r\n  \"main\": \"index.vue\",\r\n  \"noUse\": false,\r\n  \"scripts\": {\r\n    \"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n  },\r\n  \"author\": \"zhangzexin01@agree.com.cn\",\r\n  \"license\": \"ISC\",\r\n  \"name\": \"@alcap-component/v2-a-text\",\r\n  \"version\": \"1.0.0\",\r\n  \"description\": \"文本\"\r\n}\r\n"
		},
		{
			"name": "@alcap-component/v2-a-text-date",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/v2Components/v2-a-text-date/index.vue",
			"package": "{\r\n  \"docs\": {\r\n    \"name\": \"时间文本\",\r\n    \"detail\": \"时间文本\",\r\n    \"href\": \"v2-a-text-date\",\r\n    \"__wrapper\": \"v2cpt\",\r\n    \"type\": \"form\",\r\n    \"icon\": \"icontongyong\",\r\n    \"accept\": [\r\n      \"page\"\r\n    ],\r\n    \"option\": [\r\n      {\r\n        \"name\": \"value\",\r\n        \"desp\": \"文本内容\",\r\n        \"type\": \"string_input\",\r\n        \"details\": \"文本内容\",\r\n        \"defaultValue\": 1,\r\n        \"sync\": true\r\n      },\r\n      {\r\n        \"name\": \"fontSize\",\r\n        \"desp\": \"文本字号\",\r\n        \"type\": \"string_input\",\r\n        \"details\": \"文本字号\",\r\n        \"defaultValue\": \"14px\"\r\n      },\r\n      {\r\n        \"name\": \"color\",\r\n        \"desp\": \"文本颜色\",\r\n        \"type\": \"colorPicker\",\r\n        \"details\": \"文本颜色\",\r\n        \"defaultValue\": \"#000000\"\r\n      },\r\n      {\r\n        \"name\": \"syncParam\",\r\n        \"desp\": \"\",\r\n        \"details\": \"\",\r\n        \"defaultValue\": {}\r\n      }\r\n    ],\r\n    \"slot\": [],\r\n    \"events\": [],\r\n    \"style\": {\r\n      \"height\": \"30px\"\r\n    }\r\n  },\r\n  \"main\": \"index.vue\",\r\n  \"noUse\": false,\r\n  \"scripts\": {\r\n    \"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n  },\r\n  \"author\": \"lvchengzhang@agree.com.cn\",\r\n  \"license\": \"ISC\",\r\n  \"name\": \"@alcap-component/v2-a-text-date\",\r\n  \"version\": \"1.0.0\",\r\n  \"description\": \"时间文本\"\r\n}\r\n"
		},
		{
			"name": "@alcap-component/v2-a-text-enum",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/v2Components/v2-a-text-enum/index.vue",
			"package": "{\r\n  \"docs\": {\r\n    \"name\": \"枚举文本\",\r\n    \"detail\": \"枚举文本\",\r\n    \"href\": \"v2-a-text-enum\",\r\n    \"__wrapper\": \"v2cpt\",\r\n    \"type\": \"form\",\r\n    \"icon\": \"icontongyong\",\r\n    \"accept\": [\r\n      \"page\"\r\n    ],\r\n    \"option\": [\r\n      {\r\n        \"name\": \"value\",\r\n        \"desp\": \"文本内容\",\r\n        \"type\": \"string_input\",\r\n        \"details\": \"文本内容\",\r\n        \"defaultValue\": \"文本\",\r\n        \"sync\": true\r\n      },\r\n      {\r\n        \"name\": \"enumCode\",\r\n        \"codeLessType\": \"enum\",\r\n        \"desp\": \"枚举\",\r\n        \"type\": \"string_code\",\r\n        \"details\": \"枚举\",\r\n        \"defaultValue\": \"\"\r\n      },\r\n      {\r\n        \"name\": \"fontSize\",\r\n        \"desp\": \"文本字号\",\r\n        \"type\": \"string_input\",\r\n        \"details\": \"文本字号\",\r\n        \"defaultValue\": \"14px\"\r\n      },\r\n      {\r\n        \"name\": \"color\",\r\n        \"desp\": \"文本颜色\",\r\n        \"type\": \"colorPicker\",\r\n        \"details\": \"文本颜色\",\r\n        \"defaultValue\": \"#000000\"\r\n      },\r\n      {\r\n        \"name\": \"syncParam\",\r\n        \"desp\": \"\",\r\n        \"details\": \"\",\r\n        \"defaultValue\": {}\r\n      }\r\n    ],\r\n    \"slot\": [],\r\n    \"events\": [],\r\n    \"style\": {\r\n      \"height\": \"30px\"\r\n    }\r\n  },\r\n  \"main\": \"index.vue\",\r\n  \"noUse\": false,\r\n  \"scripts\": {\r\n    \"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n  },\r\n  \"author\": \"lvchengzhang@agree.com.cn\",\r\n  \"license\": \"ISC\",\r\n  \"name\": \"@alcap-component/v2-a-text-enum\",\r\n  \"version\": \"1.0.0\",\r\n  \"description\": \"枚举文本\"\r\n}\r\n"
		},
		{
			"name": "@alcap-component/v2-a-text-upload",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/v2Components/v2-a-text-upload/index.vue",
			"package": "{\r\n  \"docs\": {\r\n    \"name\": \"上传文本\",\r\n    \"detail\": \"上传文本\",\r\n    \"href\": \"v2-a-text-upload\",\r\n    \"__wrapper\": \"v2cpt\",\r\n    \"type\": \"form\",\r\n    \"icon\": \"icontongyong\",\r\n    \"accept\": [\r\n      \"page\"\r\n    ],\r\n    \"option\": [\r\n      {\r\n        \"name\": \"syncParam\",\r\n        \"desp\": \"\",\r\n        \"details\": \"\",\r\n        \"defaultValue\": {}\r\n      }\r\n    ],\r\n    \"slot\": [],\r\n    \"events\": [],\r\n    \"style\": {\r\n      \"height\": \"30px\"\r\n    }\r\n  },\r\n  \"main\": \"index.vue\",\r\n  \"noUse\": false,\r\n  \"scripts\": {\r\n    \"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n  },\r\n  \"author\": \"zhanghaixian@agree.com.cn\",\r\n  \"license\": \"ISC\",\r\n  \"name\": \"@alcap-component/v2-a-text-upload\",\r\n  \"version\": \"1.0.0\",\r\n  \"description\": \"上传文本\"\r\n}\r\n"
		},
		{
			"name": "@alcap-component/v2-a-title",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/v2Components/v2-a-title/index.vue",
			"package": "{\r\n  \"docs\": {\r\n    \"name\": \"标题\",\r\n    \"detail\": \"标题\",\r\n    \"href\": \"v2-a-title\",\r\n    \"__wrapper\": \"v2cpt\",\r\n    \"type\": \"base\",\r\n    \"icon\": \"icontongyong\",\r\n    \"accept\": [\"page\"],\r\n    \"option\": [\r\n      {\r\n        \"name\": \"titleType\",\r\n        \"desp\": \"标题级别\",\r\n        \"type\": \"string_select\",\r\n        \"details\": \"标题类型\",\r\n        \"defaultValue\": \"h1\",\r\n        \"despArray\": [\r\n          \"3级标题\",\r\n          \"2级标题\",\r\n          \"1级标题\"\r\n        ],\r\n        \"doc\": \"#\",\r\n        \"valueArray\": [\r\n          \"h3\",\r\n          \"h2\",\r\n          \"h1\"\r\n        ]\r\n      },\r\n      {\r\n        \"name\": \"color\",\r\n        \"desp\": \"标题颜色\",\r\n        \"type\": \"colorPicker\",\r\n        \"details\": \"标题颜色\",\r\n        \"defaultValue\": \"#000000\"\r\n      },\r\n      {\r\n        \"name\": \"title\",\r\n        \"desp\": \"标题内容\",\r\n        \"type\": \"string_input\",\r\n        \"details\": \"标题内容\",\r\n        \"defaultValue\": \"标题\"\r\n      },\r\n      {\r\n        \"name\": \"titleMode\",\r\n        \"desp\": \"模式\",\r\n        \"type\": \"string_select\",\r\n        \"details\": \"模式\",\r\n        \"defaultValue\": \"1\",\r\n        \"despArray\": [\r\n          \"模式一\",\r\n          \"模式二\"\r\n        ],\r\n        \"doc\": \"#\",\r\n        \"valueArray\": [\r\n          \"1\",\r\n          \"2\"\r\n        ]\r\n      },\r\n      {\r\n        \"name\": \"dialogType\",\r\n        \"desp\": \"弹窗类型\",\r\n        \"type\": \"string_select\",\r\n        \"details\": \"模式二下有效，可选icon或者图片\",\r\n        \"defaultValue\": \"icon\",\r\n        \"despArray\": [\r\n          \"图标\",\r\n          \"图片\"\r\n        ],\r\n        \"doc\": \"#\",\r\n        \"valueArray\": [\r\n          \"icon\",\r\n          \"picture\"\r\n        ]\r\n      },\r\n      {\r\n        \"name\": \"icon\",\r\n        \"desp\": \"图标内容\",\r\n        \"type\": \"dialog_input\",\r\n        \"dialogType\": \"icon\",\r\n        \"details\": \"图标内容\",\r\n        \"defaultValue\": \"\",\r\n        \r\n        \"require\":{\r\n          \"dataType\":\"icon\"\r\n        }\r\n      }, \r\n      {\r\n        \"name\": \"pic\",\r\n        \"desp\": \"图片内容\",\r\n        \"type\": \"dialog_input\",\r\n        \"dialogType\": \"picture\",\r\n        \"details\": \"图片内容\",\r\n        \"defaultValue\": \"\",\r\n        \"require\":{\r\n          \"dataType\":\"picture\"\r\n        }\r\n      }\r\n    ],\r\n    \"slot\": [],\r\n    \"events\": []\r\n  },\r\n  \"description\": \"标题\",\r\n  \"name\": \"@alcap-component/v2-a-title\",\r\n  \"version\": \"1.0.0\"\r\n}"
		},
		{
			"name": "@alcap-component/v2-a-tree",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/v2Components/v2-a-tree/index.vue",
			"package": "{\r\n  \"docs\": {\r\n    \"name\": \"树\",\r\n    \"detail\": \"树\",\r\n    \"href\": \"v2-a-tree\",\r\n    \"__wrapper\": \"v2cpt\",\r\n    \"type\": \"preset\",\r\n    \"icon\": \"icontongyong\",\r\n    \"accept\": [\r\n      \"page\"\r\n    ],\r\n    \"schemaType\": \"ALCAP_LIST\",\r\n    \"option\": [\r\n      {\r\n        \"name\": \"entityId\",\r\n        \"codeLessType\": \"dto\",\r\n        \"desp\": \"实体\",\r\n        \"type\": \"string_dto\",\r\n        \"details\": \"实体\",\r\n        \"defaultValue\": \"\"\r\n      },\r\n      {\r\n        \"name\": \"label\",\r\n        \"desp\": \"显示字段\",\r\n        \"type\": \"string_label\",\r\n        \"details\": \"显示字段\",\r\n        \"defaultValue\": \"\"\r\n      },\r\n      {\r\n        \"name\": \"parentId\",\r\n        \"desp\": \"父级字段\",\r\n        \"type\": \"string_label\",\r\n        \"details\": \"父级字段\",\r\n        \"defaultValue\": \"\"\r\n      }\r\n    ],\r\n    \"slot\": [],\r\n    \"events\": []\r\n  },\r\n  \"main\": \"index.vue\",\r\n  \"noUse\": false,\r\n  \"scripts\": {\r\n    \"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n  },\r\n  \"author\": \"zhangzexin01@agree.com.cn\",\r\n  \"license\": \"ISC\",\r\n  \"name\": \"@alcap-component/v2-a-tree\",\r\n  \"version\": \"1.0.0\",\r\n  \"description\": \"树\"\r\n}\r\n"
		},
		{
			"name": "@alcap-component/v2-a-tree-select",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/v2Components/v2-a-tree-select/index.vue",
			"package": "{\r\n  \"docs\": {\r\n    \"name\": \"树下拉选择\",\r\n    \"detail\": \"树下拉选择\",\r\n    \"href\": \"v2-a-tree-select\",\r\n    \"__wrapper\": \"v2cpt\",\r\n    \"type\": \"form\",\r\n    \"icon\": \"icontongyong\",\r\n    \"schemaType\":\"ALCAP_LIST\",\r\n    \"accept\": [\r\n      \"page\"\r\n    ],\r\n    \"option\": [\r\n      {\r\n        \"name\": \"entityId\",\r\n        \"codeLessType\":\"dto\",\r\n        \"desp\": \"实体\",\r\n        \"type\": \"string_dto\",\r\n        \"details\": \"实体\",\r\n        \"defaultValue\": \"\"\r\n      },\r\n      {\r\n        \"name\": \"label\",\r\n        \"codeLessType\":\"label\",\r\n        \"desp\": \"显示字段\",\r\n        \"type\": \"string_label\",\r\n        \"details\": \"显示字段\",\r\n        \"defaultValue\": \"\"\r\n      },\r\n      {\r\n        \"name\": \"labelValue\",\r\n        \"codeLessType\":\"labelValue\",\r\n        \"desp\": \"显示字段值\",\r\n        \"type\": \"string_label\",\r\n        \"details\": \"显示字段值\",\r\n        \"defaultValue\": \"\"\r\n      },\r\n      {\r\n        \"name\": \"value\",\r\n        \"desp\": \"选择框内容\",\r\n        \"type\": \"string_input\",\r\n        \"details\": \"选择框内容\",\r\n        \"defaultValue\": \"\",\r\n        \"sync\": true\r\n      },\r\n      {\r\n        \"name\": \"syncParam\",\r\n        \"desp\": \"\",\r\n        \"details\": \"\",\r\n        \"defaultValue\": {}\r\n      }\r\n    ],\r\n    \"slot\": [],\r\n    \"events\": [],\r\n    \"style\": {\r\n      \"height\": \"30px\"\r\n    }\r\n  },\r\n  \"main\": \"index.vue\",\r\n  \"noUse\": false,\r\n  \"scripts\": {\r\n    \"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n  },\r\n  \"author\": \"zhangzexin01@agree.com.cn\",\r\n  \"license\": \"ISC\",\r\n  \"name\": \"@alcap-component/v2-a-tree-select\",\r\n  \"version\": \"1.0.0\",\r\n  \"description\": \"树下拉选择\"\r\n}\r\n"
		},
		{
			"name": "@alcap-component/v2-a-upload",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/v2Components/v2-a-upload/index.vue",
			"package": "{\r\n  \"docs\": {\r\n    \"name\": \"上传组件\",\r\n    \"detail\": \"上传组件\",\r\n    \"href\": \"v2-a-upload\",\r\n    \"__wrapper\": \"v2cpt\",\r\n    \"type\": \"form\",\r\n    \"icon\": \"icontongyong\",\r\n    \"accept\": [\r\n      \"page\"\r\n    ],\r\n    \"option\": [\r\n      {\r\n        \"name\": \"tip\",\r\n        \"desp\": \"上传内容提示\",\r\n        \"type\": \"string_input\",\r\n        \"details\": \"标题内容\",\r\n        \"defaultValue\": \"单个文件最大可为2M，支持拓展名：.RAR .ZIP .DOC .DOCX .PDF .JPG\"\r\n      },\r\n      {\r\n        \"name\": \"multiple\",\r\n        \"desp\": \"支持多选\",\r\n        \"type\": \"boolean\",\r\n        \"details\": \"是否批量上传\",\r\n        \"defaultValue\": true\r\n      },\r\n      {\r\n        \"name\": \"value\",\r\n        \"desp\": \"上传的文件\",\r\n        \"type\": \"string_input\",\r\n        \"details\": \"上传的文件\",\r\n        \"defaultValue\": [],\r\n        \"sync\": true\r\n      }\r\n    ],\r\n    \"slot\": [],\r\n    \"events\": [],\r\n    \"style\": {\r\n      \"width\": \"80px\",\r\n      \"height\": \"30px\"\r\n    }\r\n  },\r\n  \"main\": \"index.vue\",\r\n  \"noUse\": false,\r\n  \"scripts\": {\r\n    \"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n  },\r\n  \"author\": \"zhanghaixian@agree.com.cn\",\r\n  \"license\": \"ISC\",\r\n  \"name\": \"@alcap-component/v2-a-upload\",\r\n  \"version\": \"1.0.0\",\r\n  \"description\": \"上传组件\"\r\n}\r\n"
		},
		{
			"name": "@alcap-component/v2-a-upload-interim",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/v2Components/v2-a-upload-interim/index.vue",
			"package": "{\r\n  \"docs\": {\r\n    \"name\": \"附件\",\r\n    \"detail\": \"附件\",\r\n    \"href\": \"v2-a-upload-interim\",\r\n    \"__wrapper\": \"v2cpt\",\r\n    \"type\": \"base\",\r\n    \"icon\": \"icontongyong\",\r\n    \"accept\": [\r\n      \"page\"\r\n    ],\r\n    \"option\": [\r\n      {\r\n        \"name\": \"tip\",\r\n        \"desp\": \"上传内容提示\",\r\n        \"type\": \"string_input\",\r\n        \"details\": \"标题内容\",\r\n        \"defaultValue\": \"单个文件最大可为2M，支持拓展名：.RAR .ZIP .DOC .DOCX .PDF .JPG\"\r\n      },\r\n      {\r\n        \"name\": \"multiple\",\r\n        \"desp\": \"支持多选\",\r\n        \"type\": \"boolean\",\r\n        \"details\": \"是否批量上传\",\r\n        \"defaultValue\": true\r\n      },\r\n      {\r\n        \"name\": \"value\",\r\n        \"desp\": \"上传的文件\",\r\n        \"type\": \"string_input\",\r\n        \"details\": \"上传的文件\",\r\n        \"defaultValue\": null,\r\n        \"sync\": true\r\n      },\r\n      {\r\n        \"name\": \"syncParam\",\r\n        \"desp\": \"\",\r\n        \"details\": \"\",\r\n        \"defaultValue\": {}\r\n      }\r\n    ],\r\n    \"slot\": [],\r\n    \"events\": [],\r\n    \"style\": {\r\n      \"width\": \"80px\",\r\n      \"height\": \"30px\"\r\n    }\r\n  },\r\n  \"main\": \"index.vue\",\r\n  \"noUse\": false,\r\n  \"scripts\": {\r\n    \"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n  },\r\n  \"author\": \"zhanghaixian@agree.com.cn\",\r\n  \"license\": \"ISC\",\r\n  \"name\": \"@alcap-component/v2-a-upload-interim\",\r\n  \"version\": \"1.0.0\",\r\n  \"description\": \"附件\"\r\n}\r\n"
		},
		{
			"name": "@alcap-component/v2-a-video",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/v2Components/v2-a-video/index.vue",
			"package": "{\r\n  \"docs\": {\r\n    \"name\": \"视频\",\r\n    \"detail\": \"视频\",\r\n    \"href\": \"v2-a-video\",\r\n    \"__wrapper\": \"v2cpt\",\r\n    \"type\": \"base\",\r\n    \"icon\": \"icontongyong\",\r\n    \"accept\": [\"page\"],\r\n    \"option\": [\r\n      {\r\n        \"name\": \"src\",\r\n        \"desp\": \"视频地址\",\r\n        \"type\": \"dialog_input\",\r\n        \"details\": \"视频地址\",\r\n        \"defaultValue\": \"\"\r\n      }\r\n    ],\r\n    \"slot\": [],\r\n    \"events\": []\r\n  },\r\n  \"description\": \"视频\",\r\n  \"name\": \"@alcap-component/v2-a-video\",\r\n  \"version\": \"1.0.0\"\r\n}"
		},
		{
			"name": "@alcap-component/v2-a-work-agency",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/v2Components/v2-a-work-agency/index.vue",
			"package": "{\r\n    \"docs\": {\r\n        \"name\": \"待办任务\",\r\n        \"detail\": \"待办任务\",\r\n        \"href\": \"v2-a-work-agency\",\r\n        \"__wrapper\": \"v2cpt\",\r\n        \"type\": \"work\",\r\n        \"icon\": \"icontongyong\",\r\n        \"accept\": [\r\n            \"workbench\",\r\n            \"page\"\r\n        ],\r\n        \"option\": [\r\n            {\r\n                \"type\": \"custom_component\",\r\n                \"name\": \"config\",\r\n                \"defaultValue\": {\r\n                    \"title\": \"\",\r\n                    \"titleIcon\": \"\",\r\n                    \"viewAllPage\": {},\r\n                    \"entityId\": \"\",\r\n                    \"fields\": {\r\n                        \"titleField\": {},\r\n                        \"statusField\": {},\r\n                        \"createTimeField\": {},\r\n                        \"taskDespField\": {}\r\n                    }\r\n                },\r\n                \"component\": \"v2-a-work-agency-edit\",\r\n                \"desp\": \"自定义配置\",\r\n                \"first\": true,\r\n                \"details\": \"自定义配置\"\r\n            }\r\n        ],\r\n        \"slot\": [],\r\n        \"events\": []\r\n    },\r\n    \"description\": \"待办任务\",\r\n    \"name\": \"@alcap-component/v2-a-work-agency\",\r\n    \"version\": \"1.0.0\"\r\n}\r\n"
		},
		{
			"name": "@alcap-component/v2-a-work-card",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/v2Components/v2-a-work-card/index.vue",
			"package": "{\r\n  \"docs\": {\r\n        \"name\": \"待办数\",\r\n        \"detail\": \"待办数\",\r\n        \"href\": \"v2-a-work-card\",\r\n        \"__wrapper\": \"v2cpt\",\r\n        \"type\": \"work\",\r\n        \"icon\": \"icontongyong\",\r\n        \"accept\":[ \"workbench\", \"page\" ],\r\n        \"option\": [\r\n              {\r\n                \"name\": \"dataSource\",\r\n                \"desp\": \"数据\",\r\n                \"type\": \"string_input\",\r\n                \"details\": \"数据\",\r\n                \"defaultValue\": \"\"\r\n              }\r\n        ],\r\n        \"slot\": [],\r\n        \"events\": []\r\n  },\r\n  \"description\": \"待办数\",\r\n  \"name\": \"@alcap-component/v2-a-work-card\",\r\n  \"version\": \"1.0.0\"\r\n\r\n}"
		},
		{
			"name": "@alcap-component/v2-a-work-carousel",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/v2Components/v2-a-work-carousel/index.vue",
			"package": "{\r\n    \"docs\": {\r\n        \"name\": \"轮播图\",\r\n        \"detail\": \"轮播图\",\r\n        \"href\": \"v2-a-work-carousel\",\r\n        \"__wrapper\": \"v2cpt\",\r\n        \"type\": \"work\",\r\n        \"icon\": \"icontongyong\",\r\n        \"accept\": [\r\n            \"workbench\", \"page\" \r\n        ],\r\n        \"schemaType\": \"ALCAP_PAGEING\",\r\n        \"option\": [\r\n            {\r\n                \"name\": \"config\",\r\n                \"type\": \"custom_component\",\r\n                \"defaultValue\": {\r\n                    \"entityId\": \"\",\r\n                    \"fields\": {\r\n                        \"imgField\": {},\r\n                        \"linkField\": {},\r\n                        \"sortField\": {}\r\n                    },\r\n                    \"nodeConfig\": {\r\n                        \"list\": []\r\n                    },\r\n                    \"title\": \"\",\r\n                    \"num\": \"\"\r\n                },\r\n                \"component\": \"v2-a-work-carousel-edit\",\r\n                \"desp\": \"实体配置\",\r\n                \"first\": true,\r\n                \"details\": \"实体配置\"\r\n            },\r\n            {\r\n              \"name\": \"page\",\r\n              \"desp\": \"页面\",\r\n              \"type\": \"string_page\",\r\n              \"defaultValue\": {}\r\n            },\r\n            {\r\n                \"name\": \"height\",\r\n                \"desp\": \"高度\",\r\n                \"type\": \"string_input\",\r\n                \"defaultValue\": \"150\"\r\n            },\r\n            {\r\n                \"name\": \"initialIndex\",\r\n                \"desp\": \"初始状态激活索引\",\r\n                \"type\": \"string_input\",\r\n                \"defaultValue\": 0\r\n            },\r\n            {\r\n                \"name\": \"interval\",\r\n                \"type\": \"string_input\",\r\n                \"desp\": \"自动切换时间间隔\",\r\n                \"defaultValue\": 3000\r\n            },\r\n            {\r\n                \"name\": \"autoplay\",\r\n                \"type\": \"boolean\",\r\n                \"desp\": \"是否自动切换\",\r\n                \"defaultValue\": true\r\n            },\r\n            {\r\n                \"name\": \"loop\",\r\n                \"type\": \"boolean\",\r\n                \"desp\": \"是否循环显示\",\r\n                \"defaultValue\": true\r\n            },\r\n            {\r\n                \"name\": \"type\",\r\n                \"desp\": \"轮播图类型\",\r\n                \"defaultValue\": \"\",\r\n                \"type\": \"string_select\",\r\n                \"valueArray\": [\r\n                    \"\",\r\n                    \"card\"\r\n                ],\r\n                \"despArray\": [\r\n                    \"默认\",\r\n                    \"卡片\"\r\n                ]\r\n            },\r\n            {\r\n                \"name\": \"direction\",\r\n                \"desp\": \"轮播图展示方向\",\r\n                \"defaultValue\": \"horizontal\",\r\n                \"type\": \"string_select\",\r\n                \"valueArray\": [\r\n                    \"horizontal\",\r\n                    \"vertical\"\r\n                ],\r\n                \"despArray\": [\r\n                    \"水平\",\r\n                    \"垂直\"\r\n                ]\r\n            },\r\n            {\r\n                \"name\": \"trigger\",\r\n                \"desp\": \"指示器触发方式\",\r\n                \"defaultValue\": \"hover\",\r\n                \"type\": \"string_select\",\r\n                \"valueArray\": [\r\n                    \"hover\",\r\n                    \"click\"\r\n                ],\r\n                \"despArray\": [\r\n                    \"Hover\",\r\n                    \"Click\"\r\n                ]\r\n            },\r\n            {\r\n                \"name\": \"indicatorPosition\",\r\n                \"desp\": \"指示器的位置\",\r\n                \"defaultValue\": \"\",\r\n                \"type\": \"string_select\",\r\n                \"valueArray\": [\r\n                    \"\",\r\n                    \"outside\",\r\n                    \"none\"\r\n                ],\r\n                \"despArray\": [\r\n                    \"内部\",\r\n                    \"外部\",\r\n                    \"不显示\"\r\n                ]\r\n            },\r\n            {\r\n                \"name\": \"arrow\",\r\n                \"desp\": \"箭头显示时机\",\r\n                \"defaultValue\": \"hover\",\r\n                \"type\": \"string_select\",\r\n                \"valueArray\": [\r\n                    \"hover\",\r\n                    \"always\",\r\n                    \"never\"\r\n                ],\r\n                \"despArray\": [\r\n                    \"Hover\",\r\n                    \"Always\",\r\n                    \"Never\"\r\n                ]\r\n            }\r\n        ],\r\n        \"slot\": [],\r\n        \"events\": []\r\n    },\r\n    \"main\": \"index.vue\",\r\n    \"noUse\": false,\r\n    \"scripts\": {\r\n        \"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n    },\r\n    \"author\": \"lvchengzhang@agree.com.cn\",\r\n    \"license\": \"ISC\",\r\n    \"name\": \"@alcap-component/v2-a-work-carousel\",\r\n    \"version\": \"1.0.0\",\r\n    \"description\": \"轮播图\"\r\n}\r\n"
		},
		{
			"name": "@alcap-component/v2-a-work-chart",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/v2Components/v2-a-work-chart/index.vue",
			"package": "{\r\n    \"docs\": {\r\n        \"name\": \"BI图表\",\r\n        \"detail\": \"BI图表\",\r\n        \"href\": \"v2-a-work-chart\",\r\n        \"__wrapper\": \"v2cpt\",\r\n        \"type\": \"work\",\r\n        \"icon\": \"icontongyong\",\r\n        \"accept\": [\r\n            \"workbench\", \"page\" \r\n        ],\r\n        \"option\": [\r\n            {\r\n                \"type\": \"custom_component\",\r\n                \"name\": \"config\",\r\n                \"defaultValue\": {\r\n                    \"entityId\": \"\",\r\n                    \"fields\": {\r\n                        \"xAxis\": [],\r\n                        \"yAxis\": [],\r\n                        \"chartType\": \"line\"\r\n                    }\r\n                },\r\n                \"component\": \"v2-a-work-chart-edit\",\r\n                \"desp\": \"自定义配置\",\r\n                \"first\": true,\r\n                \"details\": \"自定义配置\"\r\n            }\r\n        ],\r\n        \"slot\": [],\r\n        \"events\": []\r\n    },\r\n    \"description\": \"BI图表\",\r\n    \"name\": \"@alcap-component/v2-a-work-chart\",\r\n    \"version\": \"1.0.0\"\r\n}\r\n"
		},
		{
			"name": "@alcap-component/v2-a-work-deal",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/v2Components/v2-a-work-deal/index.vue",
			"package": "{\r\n  \"docs\": {\r\n    \"name\": \"办理事件\",\r\n    \"detail\": \"办理事件\",\r\n    \"href\": \"v2-a-work-deal\",\r\n    \"__wrapper\": \"v2cpt\",\r\n    \"type\": \"work\",\r\n    \"icon\": \"icontongyong\",\r\n    \"accept\": [\r\n      \"workbench\",\r\n      \"page\"\r\n    ],\r\n    \"option\": [\r\n      {\r\n        \"name\": \"mainTitle\",\r\n        \"desp\": \"标题\",\r\n        \"type\": \"string_input\",\r\n        \"details\": \"标题\",\r\n        \"defaultValue\": \"\"\r\n      },\r\n      {\r\n        \"name\": \"mainIcon\",\r\n        \"desp\": \"标题图标\",\r\n        \"type\": \"dialog_input\",\r\n        \"details\": \"图片或者图标地址\",\r\n        \"dialogType\":\"icon\"\r\n      },\r\n      {\r\n        \"name\": \"options\",\r\n        \"desp\": \"配置项\",\r\n        \"type\": \"array\",\r\n        \"details\": \"配置项\",\r\n        \"defaultValue\": [],\r\n        \"attrInEachElement\": [\r\n          {\r\n            \"name\": \"bg\",\r\n            \"desp\": \"背景\",\r\n            \"defaultValue\": \"\",\r\n            \"type\": \"string_select\",\r\n            \"valueArray\": [\"01\", \"02\", \"03\"],\r\n            \"despArray\": [\"待阅\", \"待办\", \"已办\"]\r\n          },\r\n          {\r\n            \"name\": \"title\",\r\n            \"desp\": \"标题\",\r\n            \"defaultValue\": \"\",\r\n            \"type\": \"string_input\"\r\n          },\r\n          {\r\n            \"name\": \"icon\",\r\n            \"desp\": \"图标\",\r\n            \"defaultValue\": \"\",\r\n            \"type\": \"dialog_input\",\r\n            \"details\": \"图片或者图标地址\",\r\n            \"dialogType\":\"icon\"\r\n          },\r\n          {\r\n            \"name\": \"num\",\r\n            \"desp\": \"数量\",\r\n            \"defaultValue\": \"\",\r\n            \"type\": \"string_input\"\r\n          },\r\n          {\r\n            \"name\": \"page\",\r\n            \"desp\": \"页面\",\r\n            \"defaultValue\": {},\r\n            \"type\": \"string_page\",\r\n            \"details\": \"页面\"\r\n          }\r\n        ]\r\n      }\r\n    ],\r\n    \"slot\": [],\r\n    \"events\": []\r\n  },\r\n  \"description\": \"办理事件\",\r\n  \"name\": \"@alcap-component/v2-a-work-deal\",\r\n  \"version\": \"1.0.0\"\r\n}\r\n"
		},
		{
			"name": "@alcap-component/v2-a-work-entrance",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/v2Components/v2-a-work-entrance/index.vue",
			"package": "{\r\n  \"docs\": {\r\n        \"name\": \"快捷入口\",\r\n        \"detail\": \"快捷入口\",\r\n        \"href\": \"v2-a-work-entrance\",\r\n        \"__wrapper\": \"v2cpt\",\r\n        \"type\": \"work\",\r\n        \"icon\": \"icontongyong\",\r\n        \"accept\":[ \"workbench\", \"page\" ],\r\n        \"option\": [\r\n          {\r\n            \"type\": \"custom_component\",\r\n            \"name\": \"config\",\r\n            \"defaultValue\": {\r\n              \"pages\": []\r\n            },\r\n            \"component\": \"v2-a-work-entrance-edit\",\r\n            \"desp\": \"自定义配置\",\r\n            \"first\": true,\r\n            \"details\": \"自定义配置\"\r\n        }\r\n        ],\r\n        \"slot\": [],\r\n        \"events\": []\r\n  },\r\n  \"description\": \"快捷入口\",\r\n  \"name\": \"@alcap-component/v2-a-work-entrance\",\r\n  \"version\": \"1.0.0\"\r\n}"
		},
		{
			"name": "@alcap-component/v2-a-work-entrance-huaxing",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/v2Components/v2-a-work-entrance-huaxing/index.vue",
			"package": "{\r\n  \"docs\": {\r\n    \"name\": \"功能中心\",\r\n    \"detail\": \"功能中心\",\r\n    \"href\": \"v2-a-work-entrance-huaxing\",\r\n    \"__wrapper\": \"v2cpt\",\r\n    \"type\": \"work\",\r\n    \"icon\": \"icontongyong\",\r\n    \"accept\": [\r\n      \"workbench\",\r\n      \"page\"\r\n    ],\r\n    \"option\": [\r\n      {\r\n        \"type\": \"custom_component\",\r\n        \"name\": \"config\",\r\n        \"defaultValue\": {\r\n          \"pages\": [],\r\n          \"title\": \"\"\r\n        },\r\n        \"component\": \"v2-a-work-entrance-edit-huaxing\",\r\n        \"desp\": \"自定义配置\",\r\n        \"first\": true,\r\n        \"details\": \"自定义配置\"\r\n      }\r\n    ],\r\n    \"slot\": [],\r\n    \"events\": []\r\n  },\r\n  \"description\": \"快捷入口\",\r\n  \"name\": \"@alcap-component/v2-a-work-entrance-huaxing\",\r\n  \"version\": \"1.0.0\"\r\n}\r\n"
		},
		{
			"name": "@alcap-component/v2-a-work-files",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/v2Components/v2-a-work-files/index.vue",
			"package": "{\r\n    \"docs\": {\r\n        \"name\": \"资料下载\",\r\n        \"detail\": \"资料下载\",\r\n        \"href\": \"v2-a-work-files\",\r\n        \"__wrapper\": \"v2cpt\",\r\n        \"type\": \"work\",\r\n        \"icon\": \"icontongyong\",\r\n        \"accept\": [\r\n            \"workbench\", \"page\" \r\n        ],\r\n        \"option\": [\r\n            {\r\n                \"type\": \"custom_component\",\r\n                \"name\": \"config\",\r\n                \"defaultValue\": {\r\n                    \"title\": \"\",\r\n                    \"titleIcon\": \"\",\r\n                    \"viewAllPage\": {},\r\n                    \"entityId\": \"\",\r\n                    \"fields\": {\r\n                        \"contentField\": {},\r\n                        \"iconField\": {},\r\n                        \"createTimeField\": {}\r\n                    }\r\n                },\r\n                \"component\": \"v2-a-work-files-edit\",\r\n                \"desp\": \"自定义配置\",\r\n                \"first\": true,\r\n                \"details\": \"自定义配置\"\r\n            }\r\n        ],\r\n        \"slot\": [],\r\n        \"events\": []\r\n    },\r\n    \"description\": \"资料下载\",\r\n    \"name\": \"@alcap-component/v2-a-work-files\",\r\n    \"version\": \"1.0.0\"\r\n}\r\n"
		},
		{
			"name": "@alcap-component/v2-a-work-links",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/v2Components/v2-a-work-links/index.vue",
			"package": "{\r\n    \"docs\": {\r\n        \"name\": \"功能链接\",\r\n        \"detail\": \"功能链接\",\r\n        \"href\": \"v2-a-work-links\",\r\n        \"__wrapper\": \"v2cpt\",\r\n        \"type\": \"work\",\r\n        \"icon\": \"icontongyong\",\r\n        \"accept\": [\r\n            \"workbench\", \"page\" \r\n        ],\r\n        \"option\": [\r\n            {\r\n                \"type\": \"custom_component\",\r\n                \"name\": \"config\",\r\n                \"defaultValue\": {\r\n                    \"title\": \"\",\r\n                    \"links\": []\r\n                },\r\n                \"component\": \"v2-a-work-links-edit\",\r\n                \"desp\": \"自定义配置\",\r\n                \"first\": true,\r\n                \"details\": \"自定义配置\"\r\n            }\r\n        ],\r\n        \"slot\": [],\r\n        \"events\": []\r\n    },\r\n    \"author\": \"lvchengzhang@agree.com.cn\",\r\n    \"name\": \"@alcap-component/v2-a-work-links\",\r\n    \"version\": \"1.0.0\",\r\n    \"description\": \"功能链接\"\r\n}\r\n"
		},
		{
			"name": "@alcap-component/v2-a-work-notice",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/v2Components/v2-a-work-notice/index.vue",
			"package": "{\r\n    \"docs\": {\r\n        \"name\": \"消息通知\",\r\n        \"detail\": \"消息通知\",\r\n        \"href\": \"v2-a-work-notice\",\r\n        \"__wrapper\": \"v2cpt\",\r\n        \"type\": \"work\",\r\n        \"icon\": \"icontongyong\",\r\n        \"accept\": [\r\n            \"workbench\", \"page\" \r\n        ],\r\n        \"option\": [\r\n            {\r\n                \"type\": \"custom_component\",\r\n                \"name\": \"config\",\r\n                \"defaultValue\": {\r\n                    \"title\": \"\",\r\n                    \"titleIcon\": \"\",\r\n                    \"contentIcon\": \"\",\r\n                    \"contentBgColor\": \"\",\r\n                    \"viewAllPage\": {},\r\n                    \"entityId\": \"\",\r\n                    \"fields\": {\r\n                        \"contentField\": {},\r\n                        \"iconField\": {},\r\n                        \"createTimeField\": {}\r\n                    }\r\n                },\r\n                \"component\": \"v2-a-work-notice-edit\",\r\n                \"desp\": \"自定义配置\",\r\n                \"first\": true,\r\n                \"details\": \"自定义配置\"\r\n            },\r\n            {\r\n              \"name\": \"page\",\r\n              \"desp\": \"页面\",\r\n              \"type\": \"string_page\",\r\n              \"defaultValue\": {}\r\n            }\r\n        ],\r\n        \"slot\": [],\r\n        \"events\": []\r\n    },\r\n    \"description\": \"消息通知\",\r\n    \"name\": \"@alcap-component/v2-a-work-notice\",\r\n    \"version\": \"1.0.0\"\r\n}\r\n"
		},
		{
			"name": "@alcap-component/v2-a-work-panel",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/v2Components/v2-a-work-panel/index.vue",
			"package": "{\r\n    \"docs\": {\r\n        \"name\": \"面板\",\r\n        \"detail\": \"面板\",\r\n        \"href\": \"v2-a-work-panel\",\r\n        \"__wrapper\": \"v2cpt\",\r\n        \"type\": \"work\",\r\n        \"icon\": \"icontongyong\",\r\n        \"accept\": [\r\n            \"workbench\", \"page\" \r\n        ],\r\n        \"option\": [\r\n            {\r\n                \"type\": \"custom_component\",\r\n                \"name\": \"config\",\r\n                \"defaultValue\": {\r\n                    \"title\": \"\",\r\n                    \"active\": \"\",\r\n                    \"morePage\": {},\r\n                    \"tabs\": []\r\n                },\r\n                \"component\": \"v2-a-work-panel-edit\",\r\n                \"desp\": \"自定义配置\",\r\n                \"first\": true,\r\n                \"details\": \"自定义配置\"\r\n            }\r\n        ],\r\n        \"slot\": [],\r\n        \"events\": []\r\n    },\r\n    \"author\": \"lvchengzhang@agree.com.cn\",\r\n    \"name\": \"@alcap-component/v2-a-work-panel\",\r\n    \"version\": \"1.0.0\",\r\n    \"description\": \"面板\"\r\n}\r\n"
		},
		{
			"name": "@alcap-component/v2-a-work-trends",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/v2Components/v2-a-work-trends/index.vue",
			"package": "{\r\n    \"docs\": {\r\n        \"name\": \"处理趋势\",\r\n        \"detail\": \"处理趋势\",\r\n        \"href\": \"v2-a-work-trends\",\r\n        \"__wrapper\": \"v2cpt\",\r\n        \"type\": \"work\",\r\n        \"icon\": \"icontongyong\",\r\n        \"accept\": [\r\n            \"workbench\", \"page\" \r\n        ],\r\n        \"option\": [],\r\n        \"slot\": [],\r\n        \"events\": []\r\n    },\r\n    \"description\": \"处理趋势\",\r\n    \"name\": \"@alcap-component/v2-a-work-trends\",\r\n    \"version\": \"1.0.0\"\r\n}\r\n"
		},
		{
			"name": "@micro-page/addPageIndex",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/views/microPages/appManagement/addPageIndex/index.vue",
			"package": "{\r\n\t\"name\": \"@micro-page/addPageIndex\",\r\n\t\"version\": \"1.0.0\",\r\n\t\"description\": \"新建入口页面\",\r\n\t\"main\": \"index.vue\",\r\n\t\"scripts\": {\r\n\t\t\"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n\t},\r\n\t\"author\": \"wubingyu\",\r\n\t\"license\": \"ISC\",\r\n\t\"AParams\": {},\r\n\t\"microSupport\": {\r\n\t\t\"js\": [],\r\n\t\t\"css\": []\r\n\t},\r\n\t\"dependencies\": {},\r\n\t\"peerDependencies\": {}\r\n}"
		},
		{
			"name": "@micro-page/appDetails",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/views/microPages/appManagement/appDetails/index.vue",
			"package": "{\r\n\t\"name\": \"@micro-page/appDetails\",\r\n\t\"version\": \"1.0.0\",\r\n\t\"description\": \"应用管理详情\",\r\n\t\"main\": \"index.vue\",\r\n\t\"scripts\": {\r\n\t\t\"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n\t},\r\n\t\"author\": \"wubingyu\",\r\n\t\"license\": \"ISC\",\r\n\t\"AParams\": {},\r\n\t\"microSupport\": {\r\n\t\t\"js\": [],\r\n\t\t\"css\": []\r\n\t},\r\n\t\"dependencies\": {},\r\n\t\"peerDependencies\": {}\r\n}"
		},
		{
			"name": "@micro-page/appRender",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/views/microPages/appManagement/appRender/index.vue",
			"package": "{\r\n\t\"name\": \"@micro-page/appRender\",\r\n\t\"version\": \"1.0.0\",\r\n\t\"description\": \"原型页面详情\",\r\n\t\"main\": \"index.vue\",\r\n\t\"scripts\": {\r\n\t\t\"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n\t},\r\n\t\"author\": \"wubingyu\",\r\n\t\"license\": \"ISC\",\r\n\t\"AParams\": {},\r\n\t\"microSupport\": {\r\n\t\t\"js\": [],\r\n\t\t\"css\": []\r\n\t},\r\n\t\"dependencies\": {},\r\n\t\"peerDependencies\": {}\r\n}"
		},
		{
			"name": "@micro-page/app-temp",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/views/microPages/appManagement/appTemp/index.vue",
			"package": "{\r\n\t\"name\": \"@micro-page/app-temp\",\r\n\t\"version\": \"1.0.0\",\r\n\t\"description\": \"应用模板\",\r\n\t\"main\": \"index.vue\",\r\n\t\"scripts\": {\r\n\t\t\"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n\t},\r\n\t\"author\": \"wubingyu\",\r\n\t\"license\": \"ISC\",\r\n\t\"AParams\": {},\r\n\t\"microSupport\": {\r\n\t\t\"js\": [],\r\n\t\t\"css\": []\r\n\t},\r\n\t\"dependencies\": {},\r\n\t\"peerDependencies\": {}\r\n}"
		},
		{
			"name": "@micro-page/my-page",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/views/microPages/appManagement/myPage/index.vue",
			"package": "{\r\n\t\"name\": \"@micro-page/my-page\",\r\n\t\"version\": \"1.0.0\",\r\n\t\"description\": \"我的页面\",\r\n\t\"main\": \"index.vue\",\r\n\t\"scripts\": {\r\n\t\t\"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n\t},\r\n\t\"author\": \"wubingyu\",\r\n\t\"license\": \"ISC\",\r\n\t\"AParams\": {},\r\n\t\"microSupport\": {\r\n\t\t\"js\": [],\r\n\t\t\"css\": []\r\n\t},\r\n\t\"dependencies\": {},\r\n\t\"peerDependencies\": {}\r\n}"
		},
		{
			"name": "@micro-page/open-single-page",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/views/microPages/appManagement/openSinglePage/index.vue",
			"package": "{\r\n\t\"name\": \"@micro-page/open-single-page\",\r\n\t\"version\": \"1.0.0\",\r\n\t\"description\": \"页面详情\",\r\n\t\"main\": \"index.vue\",\r\n\t\"scripts\": {\r\n\t\t\"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n\t},\r\n\t\"author\": \"wubingyu\",\r\n\t\"license\": \"ISC\",\r\n\t\"AParams\": {},\r\n\t\"files\": [\r\n\t\t\"dist\",\"readme.md\",\"screenshots\"\r\n\t  ],\r\n\t\"microSupport\": {\r\n\t\t\"js\": [],\r\n\t\t\"css\": []\r\n\t},\r\n\t\"dependencies\": {},\r\n\t\"peerDependencies\": {}\r\n}"
		},
		{
			"name": "@micro-page/app-release",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/views/microPages/appRelease/index.vue",
			"package": "{\r\n\t\"name\": \"@micro-page/app-release\",\r\n\t\"version\": \"1.0.0\",\r\n\t\"description\": \"应用发布\",\r\n\t\"main\": \"index.vue\",\r\n\t\"scripts\": {\r\n\t\t\"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n\t},\r\n\t\"author\": \"zzx\",\r\n\t\"license\": \"ISC\",\r\n\t\"AParams\": {},\r\n\t\"microSupport\": {\r\n\t\t\"js\": [],\r\n\t\t\"css\": []\r\n\t},\r\n\t\"dependencies\": {},\r\n\t\"peerDependencies\": {}\r\n}"
		},
		{
			"name": "@micro-page/authManagement",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/views/microPages/authManagement/index.vue",
			"package": "{\r\n\t\"name\": \"@micro-page/authManagement\",\r\n\t\"version\": \"1.0.0\",\r\n\t\"description\": \"权限管理页面\",\r\n\t\"main\": \"index.vue\",\r\n\t\"scripts\": {\r\n\t\t\"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n\t},\r\n\t\"author\": \"wubingyu\",\r\n\t\"license\": \"ISC\",\r\n\t\"AParams\": {},\r\n\t\"microSupport\": {\r\n\t\t\"js\": [],\r\n\t\t\"css\": []\r\n\t},\r\n\t\"dependencies\": {},\r\n\t\"peerDependencies\": {}\r\n}"
		},
		{
			"name": "@micro-page/dataFactory",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/views/microPages/dataFactory/index.vue",
			"package": "{\r\n\t\"name\": \"@micro-page/dataFactory\",\r\n\t\"version\": \"1.0.0\",\r\n\t\"description\": \"数据工厂\",\r\n\t\"main\": \"index.vue\",\r\n\t\"scripts\": {\r\n\t\t\"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n\t},\r\n\t\"author\": \"wubingyu\",\r\n\t\"license\": \"ISC\",\r\n\t\"AParams\": {},\r\n\t\"microSupport\": {\r\n\t\t\"js\": [],\r\n\t\t\"css\": []\r\n\t},\r\n\t\"dependencies\": {},\r\n\t\"peerDependencies\": {}\r\n}"
		},
		{
			"name": "@micro-page/data-source-manager",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/views/microPages/dataSourceManager/index.vue",
			"package": "{\r\n  \"name\": \"@micro-page/data-source-manager\",\r\n  \"version\": \"1.0.0\",\r\n  \"main\": \"index.vue\",\r\n  \"author\": \"zzx\",\r\n  \"description\": \"三方数据源\",\r\n  \"keywords\": [\r\n    \"三方数据源\"\r\n  ],\r\n  \"category\": \"page\",\r\n  \"license\": \"ISC\"\r\n}"
		},
		{
			"name": "@micro-page/dataStructure",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/views/microPages/dataStructure/index.vue",
			"package": "{\r\n\t\"name\": \"@micro-page/dataStructure\",\r\n\t\"version\": \"1.0.0\",\r\n\t\"description\": \"数据结构管理页面\",\r\n\t\"main\": \"index.vue\",\r\n\t\"scripts\": {\r\n\t\t\"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n\t},\r\n\t\"author\": \"wubingyu\",\r\n\t\"license\": \"ISC\",\r\n\t\"AParams\": {},\r\n\t\"microSupport\": {\r\n\t\t\"js\": [],\r\n\t\t\"css\": []\r\n\t},\r\n\t\"dependencies\": {},\r\n\t\"peerDependencies\": {}\r\n}"
		},
		{
			"name": "@micro-page/departmentManagement",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/views/microPages/departmentManagement/index.vue",
			"package": "{\r\n\t\"name\": \"@micro-page/departmentManagement\",\r\n\t\"version\": \"1.0.0\",\r\n\t\"description\": \"部门\",\r\n\t\"main\": \"index.vue\",\r\n\t\"keywords\": [\r\n\t\t\"\"\r\n\t],\r\n\t\"category\": \"page\",\r\n\t\"author\": \"zenglingjiang\",\r\n\t\"screenshots\": [\r\n\t\t\"\"\r\n\t],\r\n\t\"license\": \"ISC\",\r\n\t\"dependencies\": {\r\n\t\t\"@v2-lib/vue.spa.plugin\": \"^8.0.1\"\r\n\t}\r\n}"
		},
		{
			"name": "@micro-page/entity-manager",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/views/microPages/entityManager/index.vue",
			"package": "{\r\n  \"name\": \"@micro-page/entity-manager\",\r\n  \"version\": \"1.0.0\",\r\n  \"main\": \"index.vue\",\r\n  \"author\": \"xuziping@agree.com.cn\",\r\n  \"description\": \"实体管理\",\r\n  \"keywords\": [\r\n    \"实体管理\"\r\n  ],\r\n  \"category\": \"page\",\r\n  \"license\": \"ISC\"\r\n}"
		},
		{
			"name": "@micro-page/huaxingIconManagement",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/views/microPages/huaxingIconManagement/index.vue",
			"package": "{\r\n\t\"name\": \"@micro-page/huaxingIconManagement\",\r\n\t\"version\": \"1.0.0\",\r\n\t\"description\": \"华兴图标管理\",\r\n\t\"main\": \"index.vue\",\r\n\t\"scripts\": {\r\n\t\t\"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n\t},\r\n\t\"author\": \"wubingyu\",\r\n\t\"license\": \"ISC\",\r\n\t\"AParams\": {},\r\n\t\"microSupport\": {\r\n\t\t\"js\": [],\r\n\t\t\"css\": []\r\n\t},\r\n\t\"dependencies\": {},\r\n\t\"peerDependencies\": {}\r\n}"
		},
		{
			"name": "@micro-page/defaultLayout",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/views/microPages/layout/defaultLayout/index.vue",
			"package": "{\r\n\t\"name\": \"@micro-page/defaultLayout\",\r\n\t\"version\": \"1.0.0\",\r\n\t\"description\": \"微页面模板\",\r\n\t\"main\": \"index.vue\",\r\n\t\"scripts\": {\r\n\t\t\"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n\t},\r\n\t\"author\": \"wubingyu\",\r\n\t\"license\": \"ISC\",\r\n\t\"AParams\": {},\r\n\t\"microSupport\": {\r\n\t\t\"js\": [],\r\n\t\t\"css\": []\r\n\t},\r\n\t\"dependencies\": {},\r\n\t\"peerDependencies\": {}\r\n}"
		},
		{
			"name": "@micro-page/alcapDefaultLogin",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/views/microPages/login/alcapDefaultLogin/index.vue",
			"package": "{\r\n\t\"name\": \"@micro-page/alcapDefaultLogin\",\r\n\t\"version\": \"1.0.0\",\r\n\t\"description\": \"低代码平台默认登录页面\",\r\n\t\"main\": \"index.vue\",\r\n\t\"scripts\": {\r\n\t\t\"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n\t},\r\n\t\"author\": \"wubingyu\",\r\n\t\"license\": \"ISC\",\r\n\t\"AParams\": {},\r\n\t\"microSupport\": {\r\n\t\t\"js\": [],\r\n\t\t\"css\": []\r\n\t},\r\n\t\"dependencies\": {},\r\n\t\"peerDependencies\": {}\r\n}"
		},
		{
			"name": "@micro-page/lpInstance",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/views/microPages/lpInstance/index.vue",
			"package": "{\r\n\t\"name\": \"@micro-page/lpInstance\",\r\n\t\"version\": \"1.0.0\",\r\n\t\"description\": \"流程实例页面\",\r\n\t\"main\": \"index.vue\",\r\n\t\"scripts\": {\r\n\t\t\"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n\t},\r\n\t\"author\": \"wubingyu\",\r\n\t\"license\": \"ISC\",\r\n\t\"AParams\": {},\r\n\t\"microSupport\": {\r\n\t\t\"js\": [],\r\n\t\t\"css\": []\r\n\t},\r\n\t\"dependencies\": {},\r\n\t\"peerDependencies\": {}\r\n}"
		},
		{
			"name": "@micro-page/main",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/views/microPages/main/index.vue",
			"package": "{\r\n\t\"name\": \"@micro-page/main\",\r\n\t\"version\": \"1.0.0\",\r\n\t\"description\": \"页面详情\",\r\n\t\"main\": \"index.vue\",\r\n\t\"scripts\": {\r\n\t\t\"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n\t},\r\n\t\"author\": \"wubingyu\",\r\n\t\"license\": \"ISC\",\r\n\t\"AParams\": {},\r\n\t\"microSupport\": {\r\n\t\t\"js\": [],\r\n\t\t\"css\": []\r\n\t},\r\n\t\"dependencies\": {},\r\n\t\"peerDependencies\": {}\r\n}"
		},
		{
			"name": "@micro-page/menuManagement",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/views/microPages/menuManagement/index.vue",
			"package": "{\r\n\t\"name\": \"@micro-page/menuManagement\",\r\n\t\"version\": \"1.0.0\",\r\n\t\"description\": \"菜单管理页面\",\r\n\t\"main\": \"index.vue\",\r\n\t\"keywords\": [\r\n\t\t\"\"\r\n\t],\r\n\t\"category\": \"page\",\r\n\t\"author\": \"zengmeiling\",\r\n\t\"screenshots\": [\r\n\t\t\"\"\r\n\t],\r\n\t\"license\": \"ISC\",\r\n\t\"dependencies\": {\r\n\t\t\"@v2-lib/vue.spa.plugin\": \"^8.0.1\"\r\n\t}\r\n}"
		},
		{
			"name": "@micro-page/myProcess",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/views/microPages/myProcess/index.vue",
			"package": "{\r\n\t\"name\": \"@micro-page/myProcess\",\r\n\t\"version\": \"1.0.0\",\r\n\t\"description\": \"我的流程页面\",\r\n\t\"main\": \"index.vue\",\r\n\t\"scripts\": {\r\n\t\t\"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n\t},\r\n\t\"author\": \"wubingyu\",\r\n\t\"license\": \"ISC\",\r\n\t\"AParams\": {},\r\n\t\"microSupport\": {\r\n\t\t\"js\": [],\r\n\t\t\"css\": []\r\n\t},\r\n\t\"dependencies\": {},\r\n\t\"peerDependencies\": {}\r\n}"
		},
		{
			"name": "@micro-page/myToDoList",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/views/microPages/myToDoList/index.vue",
			"package": "{\r\n\t\"name\": \"@micro-page/myToDoList\",\r\n\t\"version\": \"1.0.0\",\r\n\t\"description\": \"我的待办\",\r\n\t\"main\": \"index.vue\",\r\n\t\"scripts\": {\r\n\t\t\"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n\t},\r\n\t\"author\": \"wubingyu\",\r\n\t\"license\": \"ISC\",\r\n\t\"AParams\": {},\r\n\t\"microSupport\": {\r\n\t\t\"js\": [],\r\n\t\t\"css\": []\r\n\t},\r\n\t\"dependencies\": {},\r\n\t\"peerDependencies\": {}\r\n}"
		},
		{
			"name": "@micro-page/grid-layout-page-render",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/views/microPages/pageRender/gridLayoutPageRender/index.vue",
			"package": "{\r\n\t\"name\": \"@micro-page/grid-layout-page-render\",\r\n\t\"version\": \"1.0.0\",\r\n\t\"description\": \"gridLayout渲染器\",\r\n\t\"main\": \"index.vue\",\r\n\t\"scripts\": {\r\n\t\t\"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n\t},\r\n\t\"author\": \"zzx\",\r\n\t\"license\": \"ISC\",\r\n\t\"AParams\": {},\r\n\t\"microSupport\": {\r\n\t\t\"js\": [],\r\n\t\t\"css\": []\r\n\t},\r\n\t\"dependencies\": {},\r\n\t\"peerDependencies\": {}\r\n}"
		},
		{
			"name": "@micro-page/microPageRender",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/views/microPages/pageRender/microPageRender/index.vue",
			"package": "{\r\n\t\"name\": \"@micro-page/microPageRender\",\r\n\t\"version\": \"1.0.0\",\r\n\t\"description\": \"微页面渲染器\",\r\n\t\"main\": \"index.vue\",\r\n\t\"scripts\": {\r\n\t\t\"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n\t},\r\n\t\"author\": \"wubingyu\",\r\n\t\"license\": \"ISC\",\r\n\t\"AParams\": {},\r\n\t\"microSupport\": {\r\n\t\t\"js\": [],\r\n\t\t\"css\": []\r\n\t},\r\n\t\"dependencies\": {},\r\n\t\"peerDependencies\": {}\r\n}"
		},
		{
			"name": "@micro-page/processV2",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/views/microPages/pageRender/processV2/index.vue",
			"package": "{\r\n\t\"name\": \"@micro-page/processV2\",\r\n\t\"version\": \"1.0.0\",\r\n\t\"description\": \"流程渲染编辑器\",\r\n\t\"main\": \"index.vue\",\r\n\t\"scripts\": {\r\n\t\t\"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n\t},\r\n\t\"author\": \"wubingyu\",\r\n\t\"license\": \"ISC\",\r\n\t\"AParams\": {},\r\n\t\"microSupport\": {\r\n\t\t\"js\": [],\r\n\t\t\"css\": []\r\n\t},\r\n\t\"dependencies\": {},\r\n\t\"peerDependencies\": {}\r\n}"
		},
		{
			"name": "@micro-page/text-form",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/views/microPages/pageRender/textForm/index.vue",
			"package": "{\r\n\t\"name\": \"@micro-page/text-form\",\r\n\t\"version\": \"1.0.0\",\r\n\t\"description\": \"配置表单\",\r\n\t\"main\": \"index.vue\",\r\n\t\"scripts\": {\r\n\t\t\"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n\t},\r\n\t\"author\": \"zzx\",\r\n\t\"license\": \"ISC\",\r\n\t\"AParams\": {},\r\n\t\"microSupport\": {\r\n\t\t\"js\": [],\r\n\t\t\"css\": []\r\n\t},\r\n\t\"dependencies\": {},\r\n\t\"peerDependencies\": {}\r\n}"
		},
		{
			"name": "@micro-page/work-bench",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/views/microPages/pageRender/workbench/index.vue",
			"package": "{\r\n\t\"name\": \"@micro-page/work-bench\",\r\n\t\"version\": \"1.0.0\",\r\n\t\"description\": \"工作台\",\r\n\t\"main\": \"index.vue\",\r\n\t\"scripts\": {\r\n\t\t\"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n\t},\r\n\t\"author\": \"zzx\",\r\n\t\"license\": \"ISC\",\r\n\t\"AParams\": {},\r\n\t\"microSupport\": {\r\n\t\t\"js\": [],\r\n\t\t\"css\": []\r\n\t},\r\n\t\"dependencies\": {},\r\n\t\"peerDependencies\": {}\r\n}"
		},
		{
			"name": "@micro-page/processHistory",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/views/microPages/processHistory/index.vue",
			"package": "{\r\n\t\"name\": \"@micro-page/processHistory\",\r\n\t\"version\": \"1.0.0\",\r\n\t\"description\": \"已结束流程\",\r\n\t\"main\": \"index.vue\",\r\n\t\"scripts\": {\r\n\t\t\"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n\t},\r\n\t\"author\": \"wubingyu\",\r\n\t\"license\": \"ISC\",\r\n\t\"AParams\": {},\r\n\t\"microSupport\": {\r\n\t\t\"js\": [],\r\n\t\t\"css\": []\r\n\t},\r\n\t\"dependencies\": {},\r\n\t\"peerDependencies\": {}\r\n}"
		},
		{
			"name": "@micro-page/processRunning",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/views/microPages/processRunning/index.vue",
			"package": "{\r\n\t\"name\": \"@micro-page/processRunning\",\r\n\t\"version\": \"1.0.0\",\r\n\t\"description\": \"未结束流程\",\r\n\t\"main\": \"index.vue\",\r\n\t\"scripts\": {\r\n\t\t\"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n\t},\r\n\t\"author\": \"wubingyu\",\r\n\t\"license\": \"ISC\",\r\n\t\"AParams\": {},\r\n\t\"microSupport\": {\r\n\t\t\"js\": [],\r\n\t\t\"css\": []\r\n\t},\r\n\t\"dependencies\": {},\r\n\t\"peerDependencies\": {}\r\n}"
		},
		{
			"name": "@micro-page/role-manager",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/views/microPages/roleManagement/index.vue",
			"package": "{\r\n\t\"name\": \"@micro-page/role-manager\",\r\n\t\"version\": \"1.0.0\",\r\n\t\"main\": \"index.vue\",\r\n\t\"author\": \"xuchaoming@agree.com.cn\",\r\n\t\"description\": \"角色管理\",\r\n\t\"keywords\": [\r\n\t  \"验证中心\",\r\n\t  \"角色管理\"\r\n\t],\r\n\t\"category\": \"page\",\r\n\t\"license\": \"ISC\"\r\n  }"
		},
		{
			"name": "@micro-page/tenantManagement",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/views/microPages/tenantManagement/index.vue",
			"package": "{\r\n\t\"name\": \"@micro-page/tenantManagement\",\r\n\t\"version\": \"1.0.0\",\r\n\t\"description\": \"租户管理页面\",\r\n\t\"main\": \"index.vue\",\r\n\t\"scripts\": {\r\n\t\t\"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n\t},\r\n\t\"author\": \"wubingyu\",\r\n\t\"license\": \"ISC\",\r\n\t\"AParams\": {},\r\n\t\"microSupport\": {\r\n\t\t\"js\": [],\r\n\t\t\"css\": []\r\n\t},\r\n\t\"dependencies\": {},\r\n\t\"peerDependencies\": {}\r\n}"
		},
		{
			"name": "@micro-page/tenantManagementV2",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/views/microPages/tenantManagementV2/index.vue",
			"package": "{\r\n\t\"name\": \"@micro-page/tenantManagementV2\",\r\n\t\"version\": \"1.0.0\",\r\n\t\"description\": \"项目管理页面\",\r\n\t\"main\": \"index.vue\",\r\n\t\"scripts\": {\r\n\t\t\"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n\t},\r\n\t\"author\": \"wubingyu\",\r\n\t\"license\": \"ISC\",\r\n\t\"AParams\": {},\r\n\t\"microSupport\": {\r\n\t\t\"js\": [],\r\n\t\t\"css\": []\r\n\t},\r\n\t\"dependencies\": {},\r\n\t\"peerDependencies\": {}\r\n}"
		},
		{
			"name": "@micro-page/userLogger",
			"version": "1.0.0",
			"microSuppport": "",
			"localPath": "@/views/microPages/userLogger/index.vue",
			"package": "{\r\n\t\"name\": \"@micro-page/userLogger\",\r\n\t\"version\": \"1.0.0\",\r\n\t\"description\": \"日志页面\",\r\n\t\"main\": \"index.vue\",\r\n\t\"scripts\": {\r\n\t\t\"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\r\n\t},\r\n\t\"author\": \"wubingyu\",\r\n\t\"license\": \"ISC\",\r\n\t\"AParams\": {},\r\n\t\"microSupport\": {\r\n\t\t\"js\": [],\r\n\t\t\"css\": []\r\n\t},\r\n\t\"dependencies\": {},\r\n\t\"peerDependencies\": {}\r\n}"
		},
		{
			"name": "@micro-page/userPage",
			"version": "1.0.9",
			"microSuppport": "",
			"localPath": "@/views/microPages/userPage/index.vue",
			"package": "{\r\n\t\"name\": \"@micro-page/userPage\",\r\n\t\"version\": \"1.0.9\",\r\n\t\"description\": \"用户管理的页面\",\r\n\t\"main\": \"index.vue\",\r\n\t\"keywords\": [\r\n\t\t\"\"\r\n\t],\r\n\t\"category\": \"page\",\r\n\t\"author\": \"zengmeiling\",\r\n\t\"screenshots\": [\r\n\t\t\"\"\r\n\t],\r\n\t\"license\": \"ISC\",\r\n\t\"dependencies\": {\r\n\t\t\"axios\": \"^0.18.1\",\r\n\t\t\"vuex\": \"^3.0.1\"\r\n\t}\r\n}"
		},
		{
			"name": "@v2-lib/vue.spa.plugin",
			"version": "9.0.1",
			"microSuppport": "",
			"localPath": "@/pck/vue.spa.plugin/dist/index.umd.min.js",
			"package": "{\r\n  \"name\": \"@v2-lib/vue.spa.plugin\",\r\n  \"version\": \"9.0.1\",\r\n  \"private\": false,\r\n  \"author\": \"zhanghaixian@agree.com.cn\",\r\n  \"description\": \"pc端Vue版SPA的插件\",\r\n  \"main\": \"dist/index.umd.min.js\",\r\n  \"scripts\": {},\r\n  \"dependencies\": {},\r\n  \"devDependencies\": {}\r\n}\r\n"
		}
	]
}