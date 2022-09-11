(function() {
  if (navigator.cookieEnabled) return;
  document.cookie = "cookieEnabledTest=1;";
  if (document.cookie.indexOf("cookieEnabledTest")) {
    document.cookie = "cookieEnabledTest=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    return;
  }
  console.error("Cookie is disabled!");
})()

function setCookie(key, value, expires) {
  let _cookie = `${key}=${value};`;
  expires && _cookie + `expires=${expires}`;
  return document.cookie = _cookie;
}

function getCookie(key) {
  const _key = key + "=";
  const cookieArr = document.cookie.split(';');
  const target = cookieArr.find(item => item.trim().startsWith(_key));
  
  return target && target.trim().split("=")[1];
}

function removeCookie(key) {
  return document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

export default {
  setCookie,
  getCookie,
  removeCookie
}