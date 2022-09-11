import { formatDate } from './date';

  export function jsonParse(str, obj) {
    try {
      return JSON.parse(str) || obj;
    } catch (e) {
      return obj;
    }
  }

  export function trimQueryParams(queryMap) {
    if (!queryMap) return queryMap;
    Object.keys(queryMap).forEach(key => {
      if (typeof queryMap[key] === 'string') {
        queryMap[key] = queryMap[key].trim() || undefined;
      }
    });
    return queryMap;
  }

  export function getDefaultPage() {
    return {
      start: 0,
      size: 10,
      total: 0
    };
  }

  export function listToMap(list, getKey, getValue) {
    const map = {};
    list?.forEach(item => {
      map[getKey(item)] = getValue(item);
    });
    return map;
  }

  export function getDatetimeAfterStr(dateStr) {
    if (!dateStr) return dateStr;
    const date = new Date(dateStr);
    return formatDate(new Date(date.getFullYear(), date.getMonth(), date.getDate()));
  }
  
  export function getDatetimeBeforeStr(dateStr) {
    if (!dateStr) return dateStr;
    const date = new Date(dateStr);
    return formatDate(new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59));
  }

  export function getLikeStr(str) {
    if (typeof str !== 'string') {
      return;
    }
    str = str.trim();
    if (str === '') {
      return;
    }
    return `%${str}%`;
  }