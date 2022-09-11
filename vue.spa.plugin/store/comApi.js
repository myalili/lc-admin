
export const getCacheRoute = () => {
    let routeConfig = localStorage.getItem("routeConfig");
    routeConfig = (routeConfig && JSON.parse(routeConfig)) || [];

    return Object.values(routeConfig)

}

export const setCacheRoute = (data) => {
    window.localStorage.setItem('routeConfig', data);

}

export const removeCacheRoute = () => {
    window.localStorage.removeItem('routeConfig');

}
export const getCurrentRoute = (path) => {
    let routes = window.V8.getCacheRoute();
    return routes.find(item => item.path == path)
}
export const setCache = (k, v) => {
    let v8store = localStorage.getItem("v8store");
    try {
        v8store = JSON.parse(v8store)||{};

    } catch (error) {
        v8store = {};

    }
    v8store[k] = v
    window.localStorage.setItem("v8store", JSON.stringify(v8store))

}

export const clearCache = () => {

    window.localStorage.removeItem("v8store")

}


export const getCache = (k) => {
    let v8store = localStorage.getItem("v8store");
    try {
        v8store = JSON.parse(v8store)||{};

    } catch (error) {
        v8store = {};

    }
    return v8store[k];
}

