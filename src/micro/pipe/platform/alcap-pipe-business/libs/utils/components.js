export let v2AInput = {
  component: "v2-a-input",
  href: "v2-a-input",
  maxLength: "255",
  name: "输入框",
  option: [
    {
      name: "maxLength",
      desp: "最大长度",
      type: "string_input",
      details: "最大长度",
      defaultValue: "255",
    },
    {
      name: "type",
      desp: "声明 input 类型",
      type: "string_input",
      details: "声明 input 类型，同原生 input 标签的 type 属性",
      defaultValue: "text",
    },
    {
      name: "value",
      desp: "输入框内容",
      odeLessType: "text",
      type: "string_input",
      details: "输入框内容",
      defaultValue: "",
    },
    {
      name: "placeholder",
      desp: "提示可以在控件中输入的内容",
      type: "string_input",
      details: "提示可以在控件中输入的内容",
      defaultValue: "",
    },
  ],
  placeholder: "",
  props: ["maxLength", "type", "value", "placeholder"],
  type: "text",
  value: "",
};

export let v2AText = {
  component: "v2-a-text",
  href: "v2-a-text",
  props: ["type", "value"],
  value: "",
  name: "文本",
  option: [
    {
      name: "value",
      desp: "文本内容",
      odeLessType: "text",
      type: "string_input",
      details: "文本内容",
      defaultValue: "文本",
    },
  ]
};

export let v2ADatePicker = {
  component: "v2-a-date-picker",
  href: "v2-a-date-picker",
  props: ["type", "value"],
  value: "",
  name: "日期选择框",
};
export let v2ASelect = {
  name: "下拉选择",
  href: "v2-a-select",
  component: "v2-a-select",
  props: ["options", "url", "value"],
  options: "",
  value: "",
  option: [
    {
      name: "options",
      desp: "options 数据",
      type: "string_input",
      details: "options 数据，如果设置则不需要手动构造 selectOption 节点 array<{value, label, [disabled, key, title]}>",
      defaultValue: []
    },
    {
      name: "url",
      codeLessType:"url",
      desp: "请求url",
      type: "string_input",
      details: "通过接口url获取options",
      defaultValue: {}
    },
    {
      name: "value",
      desp: "选择框内容",
      type: "string_input",
      details: "选择框内容",
      defaultValue: ""
    }
  ],
};
