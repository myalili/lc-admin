(function() {
  try {
    localStorage.setItem("STORAGE_TEST", "1");
    localStorage.removeItem("STORAGE_TEST");
} catch(e){
    console.error(e);
  }
})()

function setStorage(key, value) {
  return localStorage.setItem(key, value);
}

function getStorage(key) {
  return localStorage.getItem(key); 
}

function removeStorage(key) {
  return localStorage.removeItem(key);
}

export default {
  setStorage,
  getStorage,
  removeStorage
}