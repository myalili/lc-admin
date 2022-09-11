export function formatDate(date, fmt = 'YYYY-mm-dd HH:MM:SS') {
  if (!(date instanceof Date)) {
    if (typeof date === 'string') {
      date = new Date(Number(date) ? Number(date) : date);
    } else if (typeof date === 'number') {
      date = new Date(date);
    } else {
      return date;
    }
  }
  const opt = {
    'Y+': date.getFullYear().toString(), // 年
    'm+': (date.getMonth() + 1).toString(), // 月
    'd+': date.getDate().toString(), // 日
    'H+': date.getHours().toString(), // 时
    'M+': date.getMinutes().toString(), // 分
    'S+': date.getSeconds().toString() // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  for (var k in opt) {
    const temp = new RegExp('(' + k + ')').exec(fmt);
    if (temp) {
      fmt = fmt.replace(temp[1], temp[1].length == 1 ? opt[k] : opt[k].padStart(temp[1].length, '0'));
    }
  }
  return fmt;
}
export function subtractTime(date, count = 0, unit = 'days') {
  let msCount = 0;
  if (typeof date === 'string') {
    date = new Date(Number(date) ? Number(date) : date);
  }
  if (typeof date === 'number') {
    date = new Date(date);
  }
  if (unit === 'minutes' || unit === 'm') {
    msCount = count * 60 * 1000;
  } else if (unit === 'hours' || unit === 'h') {
    msCount = count * 60 * 60 * 1000;
  } else if (unit === 'days' || unit === 'd') {
    msCount = count * 24 * 60 * 60 * 1000;
  }
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()) - msCount
  );
}
