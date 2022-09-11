function setStore(key, payload) {
    return window.store.state[key] = payload;
}

function getStore(key) {
    return window.store.state[key];
}

function removeStore(key) {
    return delete window.store.state[key];
}

export default {
    setStore,
    getStore,
    removeStore
}