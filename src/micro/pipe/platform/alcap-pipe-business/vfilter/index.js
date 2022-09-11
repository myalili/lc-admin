const vfilter = {
  /**
   * 用于计算结束时间，并格式化
   * @param {*} startTime 开始时间
   * @param {*} useTime 耗时
   */
  formatEndTime: function(startTime,useTime){
      if(!startTime||startTime===null||startTime===''||!useTime||useTime===null||useTime===''){
          return '';
      }
      let time = parseInt(startTime)+parseInt(useTime);
      let date = new Date(time);
      let y = date.getFullYear();
      let MM = date.getMonth() + 1;
      MM = MM < 10 ? ('0' + MM) : MM;
      let d = date.getDate();
      d = d < 10 ? ('0' + d) : d;
      let h = date.getHours();
      h = h < 10 ? ('0' + h) : h;
      let m = date.getMinutes();
      m = m < 10 ? ('0' + m) : m;
      let s = date.getSeconds();
      s = s < 10 ? ('0' + s) : s;
      return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s;
  },

/**
* 用户格式化时间
* @param {} value 时间毫秒数
*/
formatDate : function(value){
  if(!value||value===null||value===''){
      return '';
  }
  let time = parseInt(value);
  let date = new Date(time);
  let y = date.getFullYear();
  let MM = date.getMonth() + 1;
  MM = MM < 10 ? ('0' + MM) : MM;
  let d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  let h = date.getHours();
  h = h < 10 ? ('0' + h) : h;
  let m = date.getMinutes();
  m = m < 10 ? ('0' + m) : m;
  let s = date.getSeconds();
  s = s < 10 ? ('0' + s) : s;
  return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s;
},
/**
* 用户计算耗时毫秒数，并格式化，若小于1分钟则显示秒，
* @param {*} value 耗时|时间差
*/
formatTime : function(value){
  if(!value||value===null||value===''){
      return '';
  }
  let time = parseInt(value);
  if(time<(60*1000)){
      return parseInt(time/1000)+"秒";
  }else if(time<(60*60*1000)){
      return parseInt(time/1000/60)+"分钟";
  }else if(time<(24*60*60*1000)){
      return parseInt(time/1000/60/60)+"小时";
  }else{
      return parseInt(time/1000/60/60/24)+"天";
  }
},
  /**
   * 用户计算耗时毫秒数，并格式化，若小于1分钟则显示秒，
   * @param {*} value 耗时|时间差
   */
  timeFilter(value) {
      if (!value || value === null || value === '') {
          return '';
      }
      let time = parseInt(value)
      if (time < 1000) {
          return "<1s"
      } else if (time < (60 * 1000)) {
          return parseInt(time / 1000) + "s"
      } else if (time < (60 * 60 * 1000)) {
          return parseInt(time / 1000 / 60) + "min"
      } else if (time < (24 * 60 * 60 * 1000)) {
          return parseInt(time / 1000 / 60 / 60) + "h"
      } else {
          return parseInt(time / 1000 / 60 / 60 / 24) + "d"
      }
  },
/**
* 格式化为只有时分秒的时间格式
* @param {*} value 时间毫秒数
*/
formatDateShort: function (value) {
  if(!value||value===null||value===''){
      return '';
  }
let time = parseInt(value);
let date = new Date(time);
let h = date.getHours();
h = h < 10 ? ('0' + h) : h;
let m = date.getMinutes();
m = m < 10 ? ('0' + m) : m;
let s = date.getSeconds();
s = s < 10 ? ('0' + s) : s;
return h + ':' + m + ':' + s;
},
/**
* 把格式"2020-07-15T10:13:37.000+08:00"
* 转换为格式："2020/07/15 10:13:37"
*/
dateFilter: function (data, format = "") {
  var dt = new Date(data);
  var y = dt.getFullYear();
  var m = (dt.getMonth()+1).toString().padStart(2,"0");
  var d = dt.getDate().toString().padStart(2,"0");
  var h = dt.getHours().toString().padStart(2,"0");
  var mm = dt.getMinutes().toString().padStart(2,"0");
  var s = dt.getSeconds().toString().padStart(2,"0");
  if (format.toLocaleLowerCase() === "yyyy-mm-dd" ||
      format.toLocaleLowerCase() === "") {
      return `${y}-${m}-${d}`;
  } else if (format.toLocaleLowerCase() === "yyyy/mm/dd") {
      return `${y}/${m}/${d}`;
  } else if (format.toLocaleLowerCase() === "yyyy-mm-dd hh:mm:ss") {
      return `${y}-${m}-${d} ${h}:${mm}:${s}`;
  } else if (format.toLocaleLowerCase() === "yyyy/mm/dd hh:mm:ss") {
      return `${y}/${m}/${d} ${h}:${mm}:${s}`;
  } else {
      return `输入的时间格式有误`;
  }
}
}
  
  
  
  export default vfilter