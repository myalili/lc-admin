<template>
  <p :style="{ fontSize: fontSize, color: color, margin: 0 }">
    {{ vModel | dateFilter }}
  </p>
</template>

<script>
import pck from "./package.json";

// 时间转换
function formatDate(date, format, timezoneOffset = true) {
  if (!date) return "";
  if (Object.prototype.toString.call(date) !== "[object Date]") {
    if (typeof Number(date) === "number") {
      date = new Date(Number(date));
    }
  }
  if (date instanceof Date) {
    if (timezoneOffset === false) {
      const offsetHours = date.getTimezoneOffset() / 60;
      date.setHours(date.getHours() + offsetHours);
    }
    const o = {
      "M+": date.getMonth() + 1, // 月
      "D+": date.getDate(), // 日
      "H+": date.getHours(), // 时
      "m+": date.getMinutes(), // 分
      "S+": date.getSeconds(), // 秒
      "q+": Math.floor((date.getMonth() + 3) / 3), // 季度
      "f+": date.getMilliseconds(), // 毫秒
    };
    if (/(Y+)/.test(format)) {
      format = format.replace(
        RegExp.$1,
        (date.getFullYear() + "").substr(4 - RegExp.$1.length)
      );
    }
    for (const k in o) {
      if (new RegExp("(" + k + ")").test(format)) {
        // @ts-ignore
        format = format.replace(
          RegExp.$1,
          RegExp.$1.length === 1
            ? o[k]
            : ("00" + o[k]).substr(("" + o[k]).length)
        );
      }
    }
    return format;
  }
}

export default {
  _options: pck.docs,
  name: "v2ATextDate",

  props: {
    value: {
      type: String,
      default: () => {
        return "";
      },
    },
    fontSize: {
      type: String,
      default: () => {
        return "14px";
      },
    },
    color: {
      type: String,
      default: () => {
        return "#000";
      },
    },
  },

  filters: {
    dateFilter(v) {
      return formatDate(v, "YYYY-MM-DD HH:mm:SS");
    },
  },
};
</script>
